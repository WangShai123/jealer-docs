---
title: Vanilla Request Response Handling Docs - JEALER
keywords: vanilla-request, response, docs, JEALER
description: About vanilla-request response handling details.
---

# Vanilla Request Response Handling

`vanilla-request` handles responses in two stages:

1. Read the response body according to `responseType`.
2. Run `transformResponse` to convert the read result into business data.

Request methods finally return the transformed data.

```ts
const profile = await api.get<Profile>('profile');
```

## Automatic Response Type

The default `responseType` is `auto`. After a request completes, the response header `Content-Type` is used to choose how the body should be read.

| Response Header            | Read Method           | Return Value |
| -------------------------- | --------------------- | ------------ |
| `application/json`         | `JSON.parse(text)`    | JSON data    |
| `application/problem+json` | `JSON.parse(text)`    | JSON data    |
| `application/vnd.xxx+json` | `JSON.parse(text)`    | JSON data    |
| `text/*`                   | `response.text()`     | string       |
| `application/xml`          | `response.text()`     | string       |
| `application/javascript`   | `response.text()`     | string       |
| `image/svg+xml`            | `response.text()`     | string       |
| `multipart/form-data`      | `response.formData()` | `FormData`   |
| Other types                | `response.blob()`     | `Blob`       |
| `204`, `205`               | Do not read body      | `undefined`  |

Common JSON APIs do not need manual configuration:

```ts
const user = await api.get<User>('users/1');
```

As long as the response header is a JSON type, `user` is the parsed object.

## responseType

Configure the response read mode globally:

```ts
const api = createRequest({
  responseType: 'json',
});
```

Or configure it for a single request:

```ts
const text = await api.get<string>('robots.txt', {
  responseType: 'text',
});
```

Supported values are listed below.

### auto

Automatically chooses the read method according to `Content-Type`.

```ts
const data = await api.get<User>('users/1', {
  responseType: 'auto',
});
```

This is the default and fits most business APIs.

### json

Reads the response as JSON. Internally it first reads text, then runs `JSON.parse()`.

```ts
const data = await api.get<User>('users/1', {
  responseType: 'json',
});
```

If the response body is empty, it returns `undefined`. If the JSON format is invalid, it throws `RequestError` with `code` set to `PARSE_ERROR`.

### text

Reads the response as text.

```ts
const html = await api.get<string>('page.html', {
  responseType: 'text',
});
```

This is suitable for HTML, plain text, CSV, logs, raw JSON strings returned by the server, and similar cases.

### blob

Reads the response as `Blob`.

```ts
const image = await api.get<Blob>('avatar.png', {
  responseType: 'blob',
});
```

This is suitable for images, PDFs, archives, and other binary files in the browser.

### arrayBuffer

Reads the response as `ArrayBuffer`.

```ts
const buffer = await api.get<ArrayBuffer>('report.bin', {
  responseType: 'arrayBuffer',
});
```

This is suitable when you need to parse a binary protocol yourself or calculate checksums.

### formData

Reads the response as `FormData`.

```ts
const form = await api.get<FormData>('form-response', {
  responseType: 'formData',
});
```

### response

Returns the raw `Response` object directly.

```ts
const response = await api.get<Response>('download', {
  responseType: 'response',
});

const contentType = response.headers.get('Content-Type');
```

This mode still goes through `transformResponse`. If no transformer is configured, the final data is the raw `Response`.

## transformResponse

`transformResponse` converts read data into the shape required by the business layer.

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

If the API returns:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ada"
  }
}
```

After the transform above, the request method returns:

```ts
{
  id: 1,
  name: 'Ada',
}
```

## transformResponse Parameters

The transformer receives two parameters:

```ts
type ResponseTransformer = (
  data: unknown,
  context: ResponseTransformContext
) => MaybePromise<unknown>;
```

`data` is the data at the current stage. The first transformer receives the result read according to `responseType`; later transformers receive the return value from the previous transformer.

`context` contains:

```ts
interface ResponseTransformContext<TBody = unknown> {
  rawData: unknown;
  request: RequestContext<TBody>;
  response: Response;
  responseType: ResponseType;
}
```

- `rawData`: the original data read according to `responseType`.
- `request`: current request context.
- `response`: raw `Response`.
- `responseType`: the actual response read type used for this request.

## Keeping the Raw String

If the response header is a JSON type, the default behavior parses it into an object. To return the raw string, use `context.rawData`.

```ts
const raw = await api.get<string>('profile', {
  transformResponse: (_data, context) => context.rawData,
});
```

You can also specify `responseType: 'text'` directly:

```ts
const raw = await api.get<string>('profile', {
  responseType: 'text',
});
```

The difference is:

- `responseType: 'text'`: the read stage handles the response as text directly.
- `transformResponse: (_data, context) => context.rawData`: the read stage still follows the default rules, but the final result returns the original read result.

## Global and Per-Request Transforms

Global transforms are suitable for a project's shared response format:

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

Per-request transforms are suitable for special responses from a specific endpoint:

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

## Transform Order

Transformers run in this order:

1. Global `transformResponse` from `createRequest()`
2. `transformResponse` from the request input object
3. `transformResponse` from per-request options

The return value from each step becomes the `data` for the next step.

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

## Boundary with Response Interceptors

`transformResponse` is suitable for data-shape conversion:

- unwrap `{ data }`
- return the raw string
- map an array into another structure
- add derived fields to returned data

Response interceptors are suitable for request-flow control:

- convert business error codes into `RequestError`
- refresh the token after access-token expiration
- replay the original request after token refresh
- record response logs

If a handler only cares about "what data should be returned", prefer `transformResponse`. If it affects the request flow, prefer a response interceptor.
