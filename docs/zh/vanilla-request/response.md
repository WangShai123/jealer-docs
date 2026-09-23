# 响应处理

`vanilla-request` 的响应处理分成两个阶段：

1. 按 `responseType` 读取响应体。
2. 执行 `transformResponse`，把读取结果转换成业务需要的数据。

请求方法最终返回的就是转换后的数据。

```ts
const profile = await api.get<Profile>('profile');
```

## 自动响应类型

默认 `responseType` 是 `auto`。请求完成后会根据响应头 `Content-Type` 自动选择读取方式。

| 响应头                     | 读取方式              | 返回值      |
| -------------------------- | --------------------- | ----------- |
| `application/json`         | `JSON.parse(text)`    | JSON 数据   |
| `application/problem+json` | `JSON.parse(text)`    | JSON 数据   |
| `application/vnd.xxx+json` | `JSON.parse(text)`    | JSON 数据   |
| `text/*`                   | `response.text()`     | 字符串      |
| `application/xml`          | `response.text()`     | 字符串      |
| `application/javascript`   | `response.text()`     | 字符串      |
| `image/svg+xml`            | `response.text()`     | 字符串      |
| `multipart/form-data`      | `response.formData()` | `FormData`  |
| 其他类型                   | `response.blob()`     | `Blob`      |
| `204`、`205`               | 不读取 body           | `undefined` |

常见 JSON 接口不需要手动配置：

```ts
const user = await api.get<User>('users/1');
```

只要响应头是 JSON 类型，`user` 就是解析后的对象。

## responseType

可以在全局配置响应读取方式：

```ts
const api = createRequest({
  responseType: 'json',
});
```

也可以在单次请求中配置：

```ts
const text = await api.get<string>('robots.txt', {
  responseType: 'text',
});
```

支持的值如下。

### auto

根据 `Content-Type` 自动判断读取方式。

```ts
const data = await api.get<User>('users/1', {
  responseType: 'auto',
});
```

这是默认值，适合绝大多数业务接口。

### json

按 JSON 读取响应。内部会先读取文本，再执行 `JSON.parse()`。

```ts
const data = await api.get<User>('users/1', {
  responseType: 'json',
});
```

如果响应体为空，返回 `undefined`。如果 JSON 格式错误，会抛出 `RequestError`，`code` 为 `PARSE_ERROR`。

### text

按文本读取响应。

```ts
const html = await api.get<string>('page.html', {
  responseType: 'text',
});
```

适合 HTML、纯文本、CSV、日志、服务端返回的原始 JSON 字符串等场景。

### blob

按 `Blob` 读取响应。

```ts
const image = await api.get<Blob>('avatar.png', {
  responseType: 'blob',
});
```

适合浏览器中的图片、PDF、压缩包等二进制文件。

### arrayBuffer

按 `ArrayBuffer` 读取响应。

```ts
const buffer = await api.get<ArrayBuffer>('report.bin', {
  responseType: 'arrayBuffer',
});
```

适合需要自己解析二进制协议或计算校验值的场景。

### formData

按 `FormData` 读取响应。

```ts
const form = await api.get<FormData>('form-response', {
  responseType: 'formData',
});
```

### response

直接返回原始 `Response` 对象。

```ts
const response = await api.get<Response>('download', {
  responseType: 'response',
});

const contentType = response.headers.get('Content-Type');
```

这种模式下仍会经过 `transformResponse`。如果没有配置转换函数，最终数据就是原始 `Response`。

## transformResponse

`transformResponse` 用于把读取后的数据转换成业务需要的形状。

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

如果接口返回：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ada"
  }
}
```

经过上面的转换后，请求方法返回的是：

```ts
{
  id: 1,
  name: 'Ada',
}
```

## transformResponse 参数

转换函数接收两个参数：

```ts
type ResponseTransformer = (
  data: unknown,
  context: ResponseTransformContext
) => MaybePromise<unknown>;
```

`data` 是当前阶段的数据。第一个转换函数收到的是按 `responseType` 读取后的结果；后续转换函数收到的是上一个转换函数的返回值。

`context` 包含：

```ts
interface ResponseTransformContext<TBody = unknown> {
  rawData: unknown;
  request: RequestContext<TBody>;
  response: Response;
  responseType: ResponseType;
}
```

- `rawData`：按 `responseType` 读取响应时得到的原始数据。
- `request`：当前请求上下文。
- `response`：原始 `Response`。
- `responseType`：本次实际使用的响应读取类型。

## 保留原始字符串

如果响应头是 JSON 类型，默认会解析成对象。需要返回原始字符串时，可以使用 `context.rawData`。

```ts
const raw = await api.get<string>('profile', {
  transformResponse: (_data, context) => context.rawData,
});
```

也可以直接指定 `responseType: 'text'`：

```ts
const raw = await api.get<string>('profile', {
  responseType: 'text',
});
```

两者差异是：

- `responseType: 'text'`：读取阶段直接按文本处理。
- `transformResponse: (_data, context) => context.rawData`：读取阶段仍按默认规则处理，但最终返回原始读取结果。

## 全局转换与单次转换

全局转换适合处理项目统一响应格式：

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

单次转换适合处理某个接口的特殊返回：

```ts
const names = await api.get<string[]>('users', {
  transformResponse: (data) => {
    const users = data as Array<{
      name: string;
    }>;

    return users.map((user) => user.name);
  },
});
```

## 转换顺序

转换函数按以下顺序执行：

1. `createRequest()` 中的全局 `transformResponse`
2. 请求输入对象中的 `transformResponse`
3. 单次请求 options 中的 `transformResponse`

每一步的返回值会作为下一步的 `data`。

```ts
const api = createRequest({
  transformResponse: (data) => ({ envelope: data }),
});

const user = await api.get<User>('profile', {
  transformResponse: [
    (data) => (data as { envelope: { data: User } }).envelope.data,
    (user) => ({
      ...(user as User),
      loadedAt: Date.now(),
    }),
  ],
});
```

## 与响应拦截器的边界

`transformResponse` 适合做数据形状转换：

- 解包 `{ data }`
- 返回原始字符串
- 把数组映射成另一种结构
- 给返回数据补充派生字段

响应拦截器适合做请求流程控制：

- 业务错误码转成 `RequestError`
- access token 过期后刷新 token
- 刷新 token 后重放原请求
- 记录响应日志

如果某个处理只关心“返回什么数据”，优先放在 `transformResponse`。如果某个处理会影响请求流程，优先放在响应拦截器。
