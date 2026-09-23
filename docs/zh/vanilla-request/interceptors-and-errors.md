# 拦截器与错误

## 请求生命周期

一次请求从调用方法到返回数据，会依次经过这些步骤：

1. 调用请求方法，例如 `api.get()`、`api.post()`、`api.request()` 或 `api.send()`。
2. 规范化请求输入，得到 `input`、`method`、`headers`、`searchParams`、`body`、`meta`、`signal` 等请求上下文。
3. 合并全局配置和单次请求配置，例如 `baseURL`、默认 headers、默认 query 参数、`responseType`、`transformResponse`、`validateStatus`。
4. 创建最终 URL、`Headers` 和 `RequestInit`。
5. 依次执行请求拦截器。
6. 调用底层 `fetch`。
7. 根据 `responseType` 读取响应数据。
8. 执行 `transformResponse`，把响应数据转换成业务数据。
9. 执行 `validateStatus`。如果 HTTP 状态不通过，抛出 `RequestError`。
10. 依次执行响应拦截器。
11. `send()` 返回完整 `RequestResult`；`request()` 和快捷方法返回 `result.data`。

可以把主流程理解为：

```txt
create context
  -> request interceptors
  -> fetch
  -> parse response
  -> transform response
  -> validate status
  -> response interceptors
  -> return result/data
```

如果上述任意步骤抛出错误，会进入统一错误拦截器流程：

```txt
any error
  -> error interceptors with phase
  -> throw final error
```

保留一个统一错误出口，通过 `phase` 告诉用户错误来自请求生命周期的哪个阶段。

它避免了多套阶段性错误拦截器带来的复杂度，又能让业务代码精确判断网络错误、解析错误、HTTP 状态错误或响应阶段业务错误。

## 请求拦截器

请求拦截器在 `fetch` 执行前运行。它接收 `RequestContext`，可以修改 headers、url、init 或 meta。

```ts
api.interceptors.request.use((context) => {
  context.headers.set('X-Trace-Id', crypto.randomUUID());
});
```

`RequestContext` 中常用字段：

```ts
interface RequestContext<TBody = unknown> {
  body?: TBody;
  headers: Headers;
  init: RequestInit;
  input: string | URL;
  meta?: unknown;
  method: RequestMethod;
  options: NormalizedRequestOptions<TBody>;
  url: URL | string;
}
```

请求拦截器可以直接修改传入的 `context`，也可以返回一个新的 `context`：

```ts
api.interceptors.request.use((context) => {
  return {
    ...context,
    meta: {
      source: 'admin-panel',
    },
  };
});
```

多个请求拦截器按注册顺序执行。前一个拦截器返回或修改后的 context，会传给后一个拦截器。

适合放在请求拦截器中的逻辑：

- 注入授权头。
- 注入 trace id。
- 根据 `meta` 补充业务 headers。
- 记录请求开始日志。
- 修改 `RequestInit` 中的 fetch 选项。

## 响应读取与 transformResponse

响应拦截器执行前，响应体已经被读取并完成 `transformResponse`。

也就是说，响应拦截器拿到的 `result.data` 不是原始 `Response`，而是已经经过响应类型读取和数据转换后的结果。

```txt
fetch response
  -> responseType 读取 body
  -> transformResponse
  -> validateStatus
  -> response interceptors
```

- 如果需要控制“响应体如何读取”，使用 `responseType`。
- 如果需要控制“读取后的数据如何变形”，使用 `transformResponse`。
- 如果需要把业务失败响应转换成错误，使用响应拦截器。
- 如果需要在失败后恢复请求，例如刷新 token、重放请求，使用错误拦截器。

## 响应拦截器

响应拦截器在响应数据读取、`transformResponse` 和 HTTP 状态校验之后运行。

```ts
api.interceptors.response.use((result) => {
  const body = result.data as {
    code?: string;
    data?: unknown;
    message?: string;
    success?: boolean;
  };

  if (body.success === false) {
    throw createRequestError(body.message ?? 'Business Error', {
      code: body.code,
      data: body,
      request: result.request,
      response: result.response,
      status: result.response.status,
      statusText: result.response.statusText,
    });
  }

  return body.data;
});
```

响应拦截器接收完整结果：

```ts
interface RequestResult<TData = unknown, TBody = unknown> {
  data: TData;
  request: RequestContext<TBody>;
  response: Response;
}
```

返回值规则：

- 返回 `undefined`：不修改当前结果。
- 返回普通值：用该值替换 `result.data`。
- 返回完整 `RequestResult`：用该结果替换当前结果。
- 抛出错误：进入统一错误拦截器流程。

多个响应拦截器按注册顺序执行。前一个拦截器返回的数据，会作为后一个拦截器接收到的 `result.data`。

适合放在响应拦截器中的逻辑：

- 根据业务 envelope 抛出业务错误。
- 记录响应日志。
- 读取响应头并同步业务状态。

## 错误拦截器的执行规则

当前项目的错误拦截器是统一错误管线，不区分“请求阶段错误拦截器”和“响应阶段错误拦截器”。

它包住的是整个 `send()` 主流程。下面任意位置抛出的错误，都会进入错误拦截器：

- 创建请求上下文失败。
- 请求拦截器抛错。
- `fetch` 网络失败。
- 响应体读取失败。
- JSON 解析失败。
- `validateStatus` 校验失败。
- 响应拦截器抛错。

错误拦截器接收两个参数：

```ts
api.interceptors.error.use((error, event) => {
  console.error(event.phase, event.request?.method, event.request?.url, error);
});
```

- `error`：当前错误。可能是 `RequestError`，也可能是原始错误，例如 `AbortError`。
- `event.phase`：错误发生的阶段。
- `event.request`：请求上下文。如果错误发生在请求上下文创建之前，可能是 `undefined`。

`phase` 的取值：

```ts
type RequestPhase =
  'setup' | 'request' | 'fetch' | 'parse' | 'status' | 'response';
```

- `setup`：创建请求上下文阶段，例如合并配置、创建 URL、创建 headers。
- `request`：请求拦截器阶段。
- `fetch`：底层 `fetch` 阶段。
- `parse`：响应体读取和响应数据转换阶段。
- `status`：HTTP 状态校验阶段。
- `response`：响应拦截器阶段。

错误拦截器按注册顺序执行。

返回值规则：

- 返回 `undefined`：不处理当前错误，继续传递原错误。
- 返回 `RequestResult`：表示错误已被恢复，请求会使用该结果继续完成。
- 自己抛出错误：用新错误替换原错误。

错误拦截器不使用 `return Error` 表示替换错误。`return` 只表示恢复成功；要替换错误必须 `throw`。

这个规则可以避免 `return` 同时表示“恢复”和“失败”的语义混乱。

示例：记录所有请求错误，但不改变错误。

```ts
api.interceptors.error.use((error, event) => {
  console.error('request failed', {
    error,
    method: event.request?.method,
    phase: event.phase,
    url: event.request?.url.toString(),
  });
});
```

示例：把未知错误转换成统一业务错误。

```ts
api.interceptors.error.use((error, event) => {
  if (isRequestError(error)) return;

  throw createRequestError('Unexpected request error', {
    cause: error,
    code: 'UNKNOWN_REQUEST_ERROR',
    request: event.request,
  });
});
```

示例：只恢复响应阶段的 token 过期错误。

```ts
api.interceptors.error.use(async (error, event) => {
  if (
    isRequestError(error) &&
    event.phase === 'response' &&
    error.code === 'TOKEN_EXPIRED' &&
    event.request
  ) {
    const tokens = await refreshToken();
    setAccessToken(tokens.token);

    return api.send(event.request.input, {
      ...event.request.options,
      meta: {
        retried: true,
      },
    });
  }
});
```

## RequestError

`createRequestError()` 用于创建统一错误对象：

```ts
throw createRequestError('No access', {
  code: 'NO_ACCESS',
  data,
  request,
  response,
  status: response.status,
  statusText: response.statusText,
});
```

`RequestError` 可能包含：

- `code`：业务错误码或内部错误码。
- `data`：响应数据或业务数据。
- `request`：请求上下文。
- `response`：原始响应对象。
- `status`：HTTP 状态码。
- `statusText`：HTTP 状态文本。
- `cause`：原始错误。

可以用 `isRequestError()` 判断：

```ts
try {
  await api.get('secret');
} catch (error) {
  if (isRequestError(error)) {
    console.log(error.code, error.status, error.data);
  }
}
```

## 内置错误归一化

`vanilla-request` 会归一化以下错误：

- HTTP 状态不通过 `validateStatus`：抛出 `RequestError`。
- JSON 解析失败：抛出 `RequestError`，`code` 为 `PARSE_ERROR`。
- 网络层失败：抛出 `RequestError`，`code` 为 `NETWORK_ERROR`。

Abort 错误不会包装为 `RequestError`，而是保留原始 `AbortError`。这样 `vanilla-signal-query` 的中断语义不会被请求库隐藏。

## validateStatus

默认只有 `2xx` 是成功。

如果业务接口始终用 HTTP 200 表达成功和失败，可以配置：

```ts
const api = createRequest({
  validateStatus: () => true,
});
```

然后在响应拦截器中根据 `{ success, code, message }` 抛出业务错误。

如果需要让 HTTP 错误响应也先进入响应拦截器，可以把对应状态码视为成功：

```ts
const api = createRequest({
  validateStatus: (status) => status < 500,
});
```

这样 `4xx` 响应会进入响应拦截器，`5xx` 响应仍会被归一化为 `RequestError`。
