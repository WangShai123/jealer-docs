---
title: Vanilla Request API Docs - JEALER
keywords: vanilla-request, api, docs, JEALER
description: About vanilla-request API details.
---

# Vanilla Request API

## Creating a Request Instance

`createRequest(options?)` creates an independent request instance. The instance contains global defaults, interceptors, and a set of request methods.

```ts
import { createRequest } from 'vanilla-request';

const api = createRequest({
  baseURL: 'https://api.example.com/v1/',
  headers: () => ({
    Authorization: `Bearer ${getToken()}`,
  }),
  searchParams: {
    locale: 'zh-CN',
  },
});
```

Different business domains can create separate instances to keep responsibilities isolated:

```ts
const adminApi = createRequest({
  baseURL: '/admin-api/',
});

const shopApi = createRequest({
  baseURL: '/shop-api/',
});
```

## Global Configuration

### baseURL

`baseURL` is used to resolve relative URLs.

```ts
const api = createRequest({
  baseURL: 'https://api.example.com/v1/',
});

await api.get('profile');
```

The final request URL in this example is:

```txt
https://api.example.com/v1/profile
```

If the request receives an absolute URL, that URL is used as-is.

### fetch

`fetch` replaces the underlying request implementation. Common use cases include tests, mocks, SSR, and special runtime adapters.

```ts
const api = createRequest({
  fetch: async (input, init) => {
    console.log(input, init);
    return fetch(input, init);
  },
});
```

### headers

`headers` configures default request headers. It can be a plain object, `Headers`, an array, or a function.

```ts
const api = createRequest({
  headers: () => ({
    Authorization: `Bearer ${getToken()}`,
    'X-Client': 'admin',
  }),
});
```

The function runs before every request, so it is suitable for reading live state such as tokens, tenant IDs, and language.

A single request can continue to append or override headers:

```ts
await api.get('profile', {
  headers: {
    'X-Trace-Id': traceId,
  },
});
```

If a header value is `null` or `undefined`, that field is removed from the current headers.

### searchParams

`searchParams` configures default query parameters.

```ts
const api = createRequest({
  searchParams: {
    locale: 'zh-CN',
    app: 'admin',
  },
});

await api.get('orders', {
  searchParams: {
    page: 1,
    status: ['paid', 'pending'],
  },
});
```

The final URL includes both global parameters and per-request parameters. Array values are expanded into multiple query parameters with the same name.

### responseType

`responseType` controls how the response is read. The default value is `auto`, which parses according to `Content-Type`.

```ts
const api = createRequest({
  responseType: 'auto',
});
```

Common per-request usage:

```ts
const text = await api.get<string>('robots.txt', {
  responseType: 'text',
});

const file = await api.get<Blob>('invoice.pdf', {
  responseType: 'blob',
});
```

See [Response Handling](./response.html) for the full rules.

### transformResponse

`transformResponse` converts response data into the shape required by the business layer. It can be configured globally or on a single request.

```ts
const api = createRequest({
  transformResponse: (data) => {
    const body = data as {
      data?: unknown;
      success?: boolean;
    };

    return body.data;
  },
});
```

See [Response Handling](./response.html) for the full rules.

### validateStatus

`validateStatus` decides which HTTP status codes are considered successful.

The default rule is:

```ts
status >= 200 && status < 300;
```

If an API uses HTTP 200 for both business success and business failure, configure it like this:

```ts
const api = createRequest({
  validateStatus: () => true,
});
```

Then throw errors from a response interceptor based on business fields.

## Request Method Overview

The request instance provides two types of methods:

- Data methods: `request`, `get`, `post`, `put`, `patch`, `delete`, `head`, and `options`. They return response data.
- Full-result method: `send`. It returns response data, request context, and the raw `Response`.

## request(input, options?)

`request` is the generic request method. It is suitable when method, URL, body, or other options must be decided dynamically.

```ts
const user = await api.request<User>({
  url: 'users/1',
  method: 'GET',
});
```

The return value is response data:

```ts
type User = {
  id: number;
  name: string;
};

const user = await api.request<User>('users/1');
user.id;
user.name;
```

`request` supports three input forms.

String or URL:

```ts
await api.request('profile');
await api.request(new URL('https://api.example.com/profile'));
```

Request object:

```ts
await api.request({
  url: 'orders',
  method: 'POST',
  data: {
    amount: 128,
  },
});
```

Tuple:

```ts
await api.request([
  'orders',
  {
    method: 'POST',
    data: {
      amount: 128,
    },
  },
]);
```

The tuple form is convenient when the URL and options need to be passed around as one value.

## send(input, options?)

`send` uses the same input forms as `request`, but returns the full result.

```ts
const result = await api.send<User>('users/1');

result.data;
result.response;
result.request;
```

Return structure:

```ts
interface RequestResult<TData, TBody> {
  data: TData;
  request: RequestContext<TBody>;
  response: Response;
}
```

Use this when you need response headers, HTTP status, or request context:

```ts
const result = await api.send<User>('users/1');

const etag = result.response.headers.get('ETag');
const status = result.response.status;
```

## get(url, options?)

`get` sends a GET request.

```ts
const profile = await api.get<Profile>('profile');
```

The second parameter is request options:

```ts
const orders = await api.get<Order[]>('orders', {
  searchParams: {
    page: 1,
    pageSize: 20,
  },
});
```

The return value is response data. How the response is parsed is decided by `responseType` and `transformResponse`.

## delete(url, options?)

`delete` sends a DELETE request.

```ts
await api.delete('orders/1001');
```

If the backend returns a deletion result, declare the return type:

```ts
const result = await api.delete<{
  deleted: boolean;
}>('orders/1001');
```

## head(url, options?)

`head` sends a HEAD request. HEAD responses usually have no body, so the data is usually `undefined`.

```ts
const result = await api.send<undefined>('assets/logo.png', {
  method: 'HEAD',
});

const contentLength = result.response.headers.get('Content-Length');
```

If you only need to trigger the request:

```ts
await api.head('assets/logo.png');
```

When headers need to be read, prefer `send()`.

## options(url, options?)

`options` sends an OPTIONS request, usually to read the methods supported by the server.

```ts
const result = await api.send<undefined>('orders', {
  method: 'OPTIONS',
});

const allow = result.response.headers.get('Allow');
```

## post(url, body?, options?)

`post` sends a POST request. The second parameter is the request body.

```ts
const created = await api.post<Order>('orders', {
  amount: 128,
  customer: 'Ada',
});
```

Plain objects are automatically serialized as JSON, and `Content-Type: application/json` is added.

The third parameter is request options:

```ts
const created = await api.post<Order>(
  'orders',
  {
    amount: 128,
  },
  {
    headers: {
      'X-Trace-Id': traceId,
    },
  }
);
```

When uploading `FormData`, it is passed to fetch as-is by default:

```ts
const form = new FormData();
form.append('file', file);

await api.post('photos', form);
```

If upload progress is needed, pass `onUploadProgress`. Internally, the request automatically switches to `XMLHttpRequest` and continues to reuse response parsing, response interceptors, and error interceptors.

```ts
await api.post('photos', form, {
  onUploadProgress({ loaded, total, progress }) {
    console.log(loaded, total, progress);
  },
});
```

## put(url, body?, options?)

`put` sends a PUT request, usually for replacing an entire resource.

```ts
const updated = await api.put<User>('users/1', {
  name: 'Ada Lovelace',
  role: 'admin',
});
```

The return value is response data.

## patch(url, body?, options?)

`patch` sends a PATCH request, usually for partially updating a resource.

```ts
const updated = await api.patch<User>('users/1', {
  nickname: 'Ada',
});
```

The return value is response data.

## Request Options

Request options inherit most of fetch's `RequestInit` and add these fields:

```ts
interface RequestOptions<TBody = unknown> {
  url?: string | URL;
  method?: RequestMethod | Lowercase<RequestMethod>;
  body?: BodyInit | TBody;
  data?: BodyInit | TBody;
  headers?: HeadersSource;
  meta?: unknown;
  onUploadProgress?: (progress: UploadProgress) => void;
  responseType?: ResponseType;
  searchParams?: SearchParamsSource;
  signal?: AbortSignal;
  transformResponse?: ResponseTransformSource<TBody>;
  validateStatus?: (status: number, response: Response) => boolean;
}
```

### url

When using object input, specify the request URL with `url`.

```ts
await api.request({
  url: 'profile',
  method: 'GET',
});
```

### method

`method` is case-insensitive and is converted to uppercase internally.

```ts
await api.request({
  url: 'orders',
  method: 'post',
  data: {
    amount: 128,
  },
});
```

### data and body

Both `data` and `body` represent the request body. For business JSON requests, prefer `data` or method parameters.

```ts
await api.request({
  url: 'orders',
  method: 'POST',
  data: {
    amount: 128,
  },
});
```

When both `body` and `data` are present, `body` takes priority.

### onUploadProgress

`onUploadProgress` receives upload progress. Browser `fetch` does not provide upload progress events, so only requests with this option automatically use `XMLHttpRequest`.

```ts
interface UploadProgress {
  lengthComputable: boolean;
  loaded: number;
  progress?: number;
  total?: number;
}
```

```ts
const form = new FormData();
form.append('file', file);

await api.post('photos', form, {
  onUploadProgress(event) {
    if (event.progress !== undefined) {
      setPercent(Math.round(event.progress * 100));
    }
  },
});
```

Requests still use `fetch` when `onUploadProgress` is not provided.

### meta

`meta` is business context that is not passed to fetch. It can be used in interceptors, error handling, and request replay.

```ts
await api.get('profile', {
  meta: {
    source: 'profile-page',
  },
});
```

Read it from a response interceptor:

```ts
api.interceptors.response.use((result) => {
  console.log(result.request.meta);
});
```

### signal

`signal` is passed to the underlying fetch and is used to cancel the request.

```ts
const controller = new AbortController();

const task = api.get('slow-api', {
  signal: controller.signal,
});

controller.abort();
await task;
```

When used with `vanilla-signal-query`, `queryFn` automatically forwards the query's signal. Because `queryFn` returns data already processed by `vanilla-request`, configure `normalize: false` in `createQuery` so response unwrapping and error recovery remain owned by the request instance.

## Default Instance Methods

The package also exports convenience methods from the default request instance:

```ts
import { get, post, request, requestClient } from 'vanilla-request';

const profile = await get<Profile>('/profile');
const created = await post<Order>('/orders', { amount: 128 });
```

For business code, prefer `createRequest()` to create an instance with `baseURL`, headers, and interceptors.

## Side Note

`vanilla-request` does not support streaming responses such as `sse` and `stream`. If needed, add custom streaming response handling, for example:

```ts
api.stream('chat/completions', body, {
  parser: 'sse',
  onMessage(event) {},
  signal,
});

// or
for await (const event of api.eventStream('chat/completions', {
  method: 'POST',
  data,
})) {
  appendToken(event.data);
}
```

Or for `sse`:

```ts
const stream = api.sse('im/events', {
  onMessage(event) {
    messages.mutate((items) => [...items, JSON.parse(event.data)]);
  },
  onOpen() {},
  onError() {},
  lastEventId,
});

// or
for await (const event of api.eventStream('im/events')) {
  handleEvent(event);
}
```
