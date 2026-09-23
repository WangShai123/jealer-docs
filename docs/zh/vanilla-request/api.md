# API

## 创建请求实例

`createRequest(options?)` 创建一个独立请求实例。实例中包含全局默认配置、拦截器和一组请求方法。

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

多个业务域可以创建多个实例，职责分离：

```ts
const adminApi = createRequest({
  baseURL: '/admin-api/',
});

const shopApi = createRequest({
  baseURL: '/shop-api/',
});
```

## 全局配置

### baseURL

`baseURL` 用于解析相对 URL。

```ts
const api = createRequest({
  baseURL: 'https://api.example.com/v1/',
});

await api.get('profile');
```

上例最终请求地址是：

```txt
https://api.example.com/v1/profile
```

如果请求传入的是绝对 URL，则会使用传入的 URL。

### fetch

`fetch` 用于替换底层请求实现。常见用途是测试、mock、SSR、特殊运行时适配。

```ts
const api = createRequest({
  fetch: async (input, init) => {
    console.log(input, init);
    return fetch(input, init);
  },
});
```

### headers

`headers` 配置默认请求头。它可以是普通对象、`Headers`、数组，也可以是函数。

```ts
const api = createRequest({
  headers: () => ({
    Authorization: `Bearer ${getToken()}`,
    'X-Client': 'admin',
  }),
});
```

函数会在每次请求前执行，因此适合读取实时 token、租户 ID、语言等状态。

单次请求可以继续追加或覆盖请求头：

```ts
await api.get('profile', {
  headers: {
    'X-Trace-Id': traceId,
  },
});
```

如果某个 header 值是 `null` 或 `undefined`，会从当前 headers 中删除该字段。

### searchParams

`searchParams` 配置默认 query 参数。

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

最终 URL 会包含全局参数和单次请求参数。数组值会展开为多个同名 query 参数。

### responseType

`responseType` 控制响应读取方式。默认值是 `auto`，会根据 `Content-Type` 自动解析。

```ts
const api = createRequest({
  responseType: 'auto',
});
```

常见单次请求写法：

```ts
const text = await api.get<string>('robots.txt', {
  responseType: 'text',
});

const file = await api.get<Blob>('invoice.pdf', {
  responseType: 'blob',
});
```

完整规则见 [响应处理](./response.html)。

### transformResponse

`transformResponse` 用于把响应数据转换成业务需要的形状。它可以配置在全局，也可以配置在单次请求中。

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

完整规则见 [响应处理](./response.html)。

### validateStatus

`validateStatus` 决定哪些 HTTP 状态码被视为成功。

默认规则是：

```ts
status >= 200 && status < 300;
```

如果接口用 HTTP 200 表示所有业务成功和失败，可以这样配置：

```ts
const api = createRequest({
  validateStatus: () => true,
});
```

之后可以在响应拦截器里根据业务字段抛出错误。

## 请求方法总览

请求实例提供两类方法：

- 数据方法：`request`、`get`、`post`、`put`、`patch`、`delete`、`head`、`options`。它们返回响应数据。
- 完整结果方法：`send`。它返回响应数据、请求上下文和原始 `Response`。

## request(input, options?)

`request` 是通用请求方法，适合动态决定 method、url、body 或其他选项。

```ts
const user = await api.request<User>({
  url: 'users/1',
  method: 'GET',
});
```

返回值是响应数据：

```ts
type User = {
  id: number;
  name: string;
};

const user = await api.request<User>('users/1');
user.id;
user.name;
```

`request` 支持三种输入形式。

字符串或 URL：

```ts
await api.request('profile');
await api.request(new URL('https://api.example.com/profile'));
```

请求对象：

```ts
await api.request({
  url: 'orders',
  method: 'POST',
  data: {
    amount: 128,
  },
});
```

元组：

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

元组形式在需要把 URL 和选项作为一个值传递时比较方便。

## send(input, options?)

`send` 与 `request` 使用相同的输入形式，但返回完整结果。

```ts
const result = await api.send<User>('users/1');

result.data;
result.response;
result.request;
```

返回结构：

```ts
interface RequestResult<TData, TBody> {
  data: TData;
  request: RequestContext<TBody>;
  response: Response;
}
```

适合需要读取响应头、HTTP 状态、请求上下文的场景：

```ts
const result = await api.send<User>('users/1');

const etag = result.response.headers.get('ETag');
const status = result.response.status;
```

## get(url, options?)

`get` 发起 GET 请求。

```ts
const profile = await api.get<Profile>('profile');
```

第二个参数是请求选项：

```ts
const orders = await api.get<Order[]>('orders', {
  searchParams: {
    page: 1,
    pageSize: 20,
  },
});
```

返回值是响应数据。响应如何解析由 `responseType` 和 `transformResponse` 决定。

## delete(url, options?)

`delete` 发起 DELETE 请求。

```ts
await api.delete('orders/1001');
```

如果后端会返回删除结果，可以声明返回类型：

```ts
const result = await api.delete<{
  deleted: boolean;
}>('orders/1001');
```

## head(url, options?)

`head` 发起 HEAD 请求。HEAD 响应通常没有 body，因此数据通常是 `undefined`。

```ts
const result = await api.send<undefined>('assets/logo.png', {
  method: 'HEAD',
});

const contentLength = result.response.headers.get('Content-Length');
```

如果只需要触发请求：

```ts
await api.head('assets/logo.png');
```

需要读取 headers 时，优先使用 `send()`。

## options(url, options?)

`options` 发起 OPTIONS 请求，通常用于读取服务端允许的请求能力。

```ts
const result = await api.send<undefined>('orders', {
  method: 'OPTIONS',
});

const allow = result.response.headers.get('Allow');
```

## post(url, body?, options?)

`post` 发起 POST 请求。第二个参数是请求体。

```ts
const created = await api.post<Order>('orders', {
  amount: 128,
  customer: 'Ada',
});
```

普通对象会自动序列化为 JSON，并补充 `Content-Type: application/json`。

第三个参数是请求选项：

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

上传 `FormData` 时默认原样传给 fetch：

```ts
const form = new FormData();
form.append('file', file);

await api.post('photos', form);
```

如果需要上传进度，传入 `onUploadProgress`。此时内部会自动切换为
`XMLHttpRequest`，并继续复用响应解析、响应拦截器和错误拦截器。

```ts
await api.post('photos', form, {
  onUploadProgress({ loaded, total, progress }) {
    console.log(loaded, total, progress);
  },
});
```

## put(url, body?, options?)

`put` 发起 PUT 请求，通常用于整体更新资源。

```ts
const updated = await api.put<User>('users/1', {
  name: 'Ada Lovelace',
  role: 'admin',
});
```

返回值是响应数据。

## patch(url, body?, options?)

`patch` 发起 PATCH 请求，通常用于局部更新资源。

```ts
const updated = await api.patch<User>('users/1', {
  nickname: 'Ada',
});
```

返回值是响应数据。

## 请求选项

请求选项继承大部分 `fetch` 的 `RequestInit`，并增加以下字段：

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

对象输入时使用 `url` 指定请求地址。

```ts
await api.request({
  url: 'profile',
  method: 'GET',
});
```

### method

`method` 不区分大小写，内部会转换为大写。

```ts
await api.request({
  url: 'orders',
  method: 'post',
  data: {
    amount: 128,
  },
});
```

### data 与 body

`data` 和 `body` 都表示请求体。业务 JSON 请求推荐使用 `data` 或方法参数。

```ts
await api.request({
  url: 'orders',
  method: 'POST',
  data: {
    amount: 128,
  },
});
```

当 `body` 和 `data` 同时存在时，`body` 优先。

### onUploadProgress

`onUploadProgress` 用于接收上传进度。浏览器 `fetch` 不提供上传进度事件，因此只有传入该选项时，当前请求会自动走 `XMLHttpRequest`。

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

未传入 `onUploadProgress` 时，请求仍然使用 `fetch`。

### meta

`meta` 是不会传给 fetch 的业务上下文，可以在拦截器、错误处理、请求重放中使用。

```ts
await api.get('profile', {
  meta: {
    source: 'profile-page',
  },
});
```

响应拦截器中可以读取：

```ts
api.interceptors.response.use((result) => {
  console.log(result.request.meta);
});
```

### signal

`signal` 会传给底层 fetch，用于取消请求。

```ts
const controller = new AbortController();

const task = api.get('slow-api', {
  signal: controller.signal,
});

controller.abort();
await task;
```

配合 `vanilla-signal-query` 时，`queryFn` 会自动传递 query 的 signal。由于
`queryFn` 返回的是 `vanilla-request` 已处理后的数据，推荐在 `createQuery` 中配置
`normalize: false`，让响应解包和错误恢复继续由请求实例负责。

## 默认实例方法

包也导出默认请求实例上的便捷方法：

```ts
import { get, post, request, requestClient } from 'vanilla-request';

const profile = await get<Profile>('/profile');
const created = await post<Order>('/orders', { amount: 128 });
```

推荐使用 `createRequest()` 创建带有 `baseURL`、headers 和拦截器的业务实例。

## 题外话

`vanilla-request` 不支持 `sse`, `stream` 等流式响应。若需要使用，可自定义流式响应处理逻辑，如：

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

或者 `sse`：

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
