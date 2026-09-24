---
title: 配合 vanilla-signal-query - JEALER
keywords: vanilla-request, vanilla-signal-query, query function, docs, JEALER
description: 详细介绍 vanilla-request 如何配合 vanilla-signal-query 使用。
---

# 配合 vanilla-signal-query

`vanilla-signal-query` 是 `vanilla-request` 的可选集成目标。需要 query 状态、缓存、去重、重试、超时、中断和失效管理时，可以把请求实例的 `queryFn()` 交给 `createQuery`。

`vanilla-request` 仍然只负责 HTTP 请求本身：准备请求、执行请求、解析响应、运行拦截器、做请求级错误恢复，并返回业务数据。

## 推荐写法

`vanilla-request` 只提供 `queryFn()`。

```ts
const profile = createQuery({
  client: queryClient,
  queryKey: ['profile'],
  staleTime: 60_000,
  normalize: false,
  queryFn: api.queryFn<Profile>('profile'),
});
```

## queryFn 的职责

`api.queryFn(input)` 会返回一个符合 `vanilla-signal-query` 预期的函数。

它会接收 query context，并把以下信息传给请求：

- `signal`：用于 query 超时、中断和请求取消。
- `meta`：用于业务自定义请求上下文。

`vanilla-request` 已经完成 HTTP 响应解析、响应拦截器处理和错误恢复，`queryFn()` 返回的是最终要交给 query 管理的业务数据。`vanilla-signal-query` 新版默认会对 `{ success, data, message, code }` 风格响应做 `normalize`，所以配合 `api.queryFn()` 时推荐显式配置 `normalize: false`，避免 query 层再次解包或转换已经处理好的数据。

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

## 拦截器恢复后的数据会进入 query

`queryFn()` 内部会调用当前请求实例的 `request()`。因此它会完整经过这个实例上的请求拦截器、响应处理、响应拦截器和错误拦截器。

如果请求过程中发生授权过期等错误，但错误拦截器最终返回了恢复后的 `RequestResult`，`queryFn()` 会把恢复结果中的 `data` 返回给 `createQuery`。

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

示例：

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

上例中，如果 token 刷新和原请求重放成功，`profile` query 会进入成功状态，并按 `staleTime` 和 query client 的缓存配置处理最终数据。

如果错误拦截器返回 `undefined`，或者 refresh token 也失败，请求错误会继续抛给 `createQuery`。这时 query 会进入错误状态，并由 `vanilla-signal-query` 的 `retry`、`timeout`、错误状态等机制继续处理。

## 能力边界

`vanilla-request` 不实现这些能力：

- 缓存
- staleTime
- 请求去重
- retry
- retryDelay
- timeout
- normalize
- abort 状态
- invalidate
- prefetch
- 本地 mutate

这些能力属于 `vanilla-signal-query`。

## 缓存示例

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

请求是否重新发出由 `vanilla-signal-query` 根据缓存和 stale 状态决定。

## 写操作后的刷新

写操作仍然直接使用 `api.post()`、`api.put()` 等方法。完成后通过 query client 失效或本地 mutate 更新状态。

```ts
const created = await api.post<Order>('orders', {
  amount: 128,
});

queryClient.invalidateQueries(['orders']);

orders.mutate((items = []) => [created, ...items], {
  staleTime: 30_000,
});
```
