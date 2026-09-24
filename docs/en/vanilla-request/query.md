---
title: Working with vanilla-signal-query - JEALER
keywords: vanilla-request, vanilla-signal-query, query function, docs, JEALER
description: Introduce vanilla-request how to work with vanilla-signal-query.
---

# Working with vanilla-signal-query

`vanilla-signal-query` is an optional integration target for `vanilla-request`. When you need query state, caching, deduplication, retries, timeouts, aborts, and invalidation management, pass the request instance's `queryFn()` to `createQuery`.

`vanilla-request` still only owns the HTTP request itself: preparing the request, executing it, parsing the response, running interceptors, performing request-level error recovery, and returning business data.

## Recommended Usage

`vanilla-request` only provides `queryFn()`.

```ts
const profile = createQuery({
  client: queryClient,
  queryKey: ['profile'],
  staleTime: 60_000,
  normalize: false,
  queryFn: api.queryFn<Profile>('profile'),
});
```

## queryFn Responsibilities

`api.queryFn(input)` returns a function that matches what `vanilla-signal-query` expects.

It receives the query context and forwards these values to the request:

- `signal`: used for query timeouts, aborts, and request cancellation.
- `meta`: used for custom business request context.

`vanilla-request` has already handled HTTP response parsing, response interceptors, and error recovery, so `queryFn()` returns the business data that should be managed by query. Newer versions of `vanilla-signal-query` normalize `{ success, data, message, code }`-style responses by default, so when using `api.queryFn()`, explicitly set `normalize: false` to avoid unwrapping or transforming data that the request layer has already handled.

```ts
const user = createQuery({
  client: queryClient,
  queryKey: ['user', userId],
  normalize: false,
  queryFn: api.queryFn<User>((context) => ({
    url: `users/${context.queryKey[1]}`,
    meta: {
      source: 'user-detail',
    },
  })),
});
```

## Recovered Interceptor Data Enters Query

`queryFn()` internally calls the current request instance's `request()`. Therefore it goes through that instance's request interceptors, response handling, response interceptors, and error interceptors.

If an authorization-expired error occurs during the request, but the error interceptor finally returns a recovered `RequestResult`, `queryFn()` returns that recovered result's `data` to `createQuery`.

```txt
createQuery
  -> api.queryFn('profile')
  -> api.request('profile')
  -> response interceptor throws TOKEN_EXPIRED
  -> error interceptor refreshes token
  -> error interceptor returns replay RequestResult
  -> queryFn returns result.data
  -> createQuery caches and exposes final data
```

Example:

```ts
api.interceptors.error.use(async (error, event) => {
  if (
    isRequestError(error) &&
    event.phase === 'response' &&
    error.code === 'TOKEN_EXPIRED' &&
    event.request
  ) {
    await refreshToken();

    return api.send(event.request.input, {
      ...event.request.options,
      meta: {
        retried: true,
      },
    });
  }
});

const profile = createQuery({
  client: queryClient,
  queryKey: ['profile'],
  normalize: false,
  queryFn: api.queryFn<Profile>('profile'),
  staleTime: 60_000,
});
```

In this example, if token refresh and original-request replay succeed, the `profile` query enters the success state and stores the final data according to `staleTime` and the query client's cache configuration.

If the error interceptor returns `undefined`, or if the refresh token request also fails, the request error continues to be thrown to `createQuery`. The query then enters the error state and is handled by `vanilla-signal-query` mechanisms such as `retry`, `timeout`, and error state management.

## Boundaries

`vanilla-request` does not implement these capabilities:

- cache
- staleTime
- request deduplication
- retry
- retryDelay
- timeout
- normalize
- abort state
- invalidate
- prefetch
- local mutate

These capabilities belong to `vanilla-signal-query`.

## Cache Example

```ts
const queryClient = createQueryClient({
  cache: {
    adapter: 'memory',
    options: {
      maxSize: 100,
      ttl: 10 * 60_000,
    },
  },
});

const orders = createQuery({
  client: queryClient,
  queryKey: ['orders'],
  staleTime: 30_000,
  normalize: false,
  queryFn: api.queryFn<Order[]>('orders'),
});
```

Whether the request is sent again is decided by `vanilla-signal-query` based on cache and stale state.

## Refreshing After Writes

Write operations still use `api.post()`, `api.put()`, and similar methods directly. After completion, update state through query-client invalidation or local mutate.

```ts
const created = await api.post<Order>('orders', {
  amount: 128,
});

queryClient.invalidateQueries(['orders']);

orders.mutate((items = []) => [created, ...items], {
  staleTime: 30_000,
});
```
