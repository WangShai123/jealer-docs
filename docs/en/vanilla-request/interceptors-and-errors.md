# Interceptors and Errors

## Request Lifecycle

From calling a request method to receiving data, a request goes through these steps:

1. Call a request method such as `api.get()`, `api.post()`, `api.request()`, or `api.send()`.
2. Normalize the request input into request context such as `input`, `method`, `headers`, `searchParams`, `body`, `meta`, and `signal`.
3. Merge global configuration and per-request configuration, such as `baseURL`, default headers, default query parameters, `responseType`, `transformResponse`, and `validateStatus`.
4. Create the final URL, `Headers`, and `RequestInit`.
5. Run request interceptors in sequence.
6. Call the underlying `fetch`.
7. Read response data according to `responseType`.
8. Run `transformResponse` to convert response data into business data.
9. Run `validateStatus`. If the HTTP status does not pass, throw `RequestError`.
10. Run response interceptors in sequence.
11. `send()` returns the full `RequestResult`; `request()` and shortcut methods return `result.data`.

The main flow can be understood as:

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

If any step above throws an error, it enters the unified error-interceptor flow:

```txt
any error
  -> error interceptors with phase
  -> throw final error
```

There is one unified error exit, and `phase` tells users which part of the request lifecycle produced the error.

This avoids the complexity of multiple phase-specific error interceptor systems while still letting business code precisely distinguish network errors, parse errors, HTTP status errors, and response-stage business errors.

## Request Interceptors

Request interceptors run before `fetch`. They receive `RequestContext` and can modify headers, URL, init, or meta.

```ts
api.interceptors.request.use((context) => {
  context.headers.set('X-Trace-Id', crypto.randomUUID());
});
```

Common fields in `RequestContext`:

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

A request interceptor can mutate the incoming `context` directly or return a new `context`:

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

Multiple request interceptors run in registration order. The context returned or modified by one interceptor is passed to the next interceptor.

Good candidates for request interceptors:

- Inject authorization headers.
- Inject trace IDs.
- Add business headers based on `meta`.
- Record request-start logs.
- Modify fetch options in `RequestInit`.

## Response Reading and transformResponse

Before response interceptors run, the response body has already been read and `transformResponse` has completed.

In other words, `result.data` received by a response interceptor is not the raw `Response`; it is the result after response-type reading and data transformation.

```txt
fetch response
  -> responseType reads body
  -> transformResponse
  -> validateStatus
  -> response interceptors
```

- To control how the response body is read, use `responseType`.
- To control how the read data is transformed, use `transformResponse`.
- To convert business-failure responses into errors, use a response interceptor.
- To recover after failure, such as refreshing a token and replaying a request, use an error interceptor.

## Response Interceptors

Response interceptors run after response-data reading, `transformResponse`, and HTTP status validation.

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

Response interceptors receive the full result:

```ts
interface RequestResult<TData = unknown, TBody = unknown> {
  data: TData;
  request: RequestContext<TBody>;
  response: Response;
}
```

Return rules:

- Return `undefined`: keep the current result unchanged.
- Return a plain value: replace `result.data` with that value.
- Return a full `RequestResult`: replace the current result with that result.
- Throw an error: enter the unified error-interceptor flow.

Multiple response interceptors run in registration order. Data returned by one interceptor becomes the `result.data` received by the next interceptor.

Good candidates for response interceptors:

- Throw business errors based on a business envelope.
- Record response logs.
- Read response headers and synchronize business state.

## Error Interceptor Execution Rules

The current project uses one unified error pipeline. It does not split errors into "request-stage error interceptors" and "response-stage error interceptors".

It wraps the entire `send()` main flow. Errors thrown from any of these locations enter error interceptors:

- Request-context creation failure.
- Request interceptor throws.
- `fetch` network failure.
- Response-body reading failure.
- JSON parse failure.
- `validateStatus` failure.
- Response interceptor throws.

Error interceptors receive two parameters:

```ts
api.interceptors.error.use((error, event) => {
  console.error(event.phase, event.request?.method, event.request?.url, error);
});
```

- `error`: the current error. It may be a `RequestError` or an original error such as `AbortError`.
- `event.phase`: the phase where the error occurred.
- `event.request`: the request context. It may be `undefined` if the error occurred before request-context creation.

Possible `phase` values:

```ts
type RequestPhase =
  'setup' | 'request' | 'fetch' | 'parse' | 'status' | 'response';
```

- `setup`: request-context creation, such as merging config, creating the URL, or creating headers.
- `request`: request-interceptor phase.
- `fetch`: underlying `fetch` phase.
- `parse`: response-body reading and response-data transformation.
- `status`: HTTP status validation.
- `response`: response-interceptor phase.

Error interceptors run in registration order.

Return rules:

- Return `undefined`: do not handle the current error; continue passing the original error.
- Return `RequestResult`: the error has recovered, and the request completes with that result.
- Throw an error: replace the original error with the new error.

Error interceptors do not use `return Error` to replace errors. `return` only means successful recovery; to replace an error, `throw` it.

This avoids ambiguity where `return` could mean both "recovered" and "failed".

Example: log all request errors without changing them.

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

Example: convert unknown errors into a unified business error.

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

Example: recover only token-expiration errors from the response phase.

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

`createRequestError()` creates a unified error object:

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

`RequestError` may contain:

- `code`: business error code or internal error code.
- `data`: response data or business data.
- `request`: request context.
- `response`: raw response object.
- `status`: HTTP status code.
- `statusText`: HTTP status text.
- `cause`: original error.

Use `isRequestError()` to check:

```ts
try {
  await api.get('secret');
} catch (error) {
  if (isRequestError(error)) {
    console.log(error.code, error.status, error.data);
  }
}
```

## Built-In Error Normalization

`vanilla-request` normalizes these errors:

- HTTP status fails `validateStatus`: throws `RequestError`.
- JSON parse failure: throws `RequestError` with `code` set to `PARSE_ERROR`.
- Network-layer failure: throws `RequestError` with `code` set to `NETWORK_ERROR`.

Abort errors are not wrapped as `RequestError`; they remain the original `AbortError`. This keeps `vanilla-signal-query` abort semantics visible instead of hiding them inside the request library.

## validateStatus

By default, only `2xx` is considered successful.

If a business API always uses HTTP 200 to represent both success and failure, configure:

```ts
const api = createRequest({
  validateStatus: () => true,
});
```

Then throw business errors from a response interceptor based on `{ success, code, message }`.

If HTTP error responses should also enter response interceptors first, treat the relevant status codes as successful:

```ts
const api = createRequest({
  validateStatus: (status) => status < 500,
});
```

With this configuration, `4xx` responses enter response interceptors, while `5xx` responses are still normalized into `RequestError`.
