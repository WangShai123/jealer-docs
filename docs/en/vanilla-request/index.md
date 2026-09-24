---
title: Vanilla Request Docs - JEALER
keywords: vanilla-request, docs, JEALER
description: vanilla-request is a lightweight HTTP request utility.
---

# Vanilla Request

`vanilla-request` is a lightweight HTTP request utility.

It works well with the `queryFn()` adapter pattern used by [vanilla-signal-query](/en/vanilla-signal-query/), turning HTTP requests into query functions while filling the everyday gaps around `fetch`: global configuration, request interception, response unwrapping, error normalization, authorization headers, and request recovery. For upload requests that need progress events, it automatically switches from `fetch` to `XMLHttpRequest` when `onUploadProgress` is provided.

It does not implement caching, deduplication, retries, timeouts, request state, or invalidation. Those data-management responsibilities belong to `vanilla-signal-query`. `vanilla-request` focuses on preparing the HTTP request, sending it, parsing the response, handling request-level errors, and returning the business data expected by the caller.

## Installation

NPM:

```bash
npm install vanilla-request
```

CDN:

```html
<!-- UMD Global Variable vanillaRequest -->
<script src="https://unpkg.com/vanilla-request@latest/dist/index.umd.js"></script>
```

## Example

```ts
import { createQuery, createQueryClient } from 'vanilla-signal-query';
import { createRequest } from 'vanilla-request';

const api = createRequest({
  baseURL: '/api/',
  headers: () => ({
    Authorization: `Bearer ${accessToken()}`,
  }),
});
api.interceptors.response.use((result) => {
  // Response interception, such as unwrapping a business envelope.
});
api.interceptors.error.use(async (error, event) => {
  // Error interception, such as token refresh, request replay,
  // network errors, or other request-level failures.
});

const queryClient = createQueryClient({
  cache: {
    adapter: 'localStorage',
    options: {
      namespace: 'my-app',
      ttl: 10 * 60_000,
    },
  },
});

const profile = createQuery({
  client: queryClient,
  queryKey: ['profile'],
  queryFn: api.queryFn('profile'),
  normalize: false,
  staleTime: 60_000,
  retry: 1,
  timeout: 8_000,
});
```

## Design Boundaries

- `vanilla-request` handles HTTP request configuration, request/response
  interception, response parsing, error normalization, request recovery, and
  returning business data. Upload requests use `fetch` by default and switch to
  XHR only when `onUploadProgress` is provided.
- `vanilla-signal-query` handles reactive query state, caching, stale data,
  retries, timeouts, cancellation, invalidation, and local mutation.
- `api.queryFn()` returns the data already produced by `vanilla-request`.
  Disable `vanilla-signal-query` response normalization with `normalize: false`
  unless you intentionally want another query-layer normalization step.
- No business response format is assumed. Use response interceptors to unwrap
  project-specific envelopes such as `{ success, data, code, message }`.
- `4xx` and `5xx` responses are not treated as successful by default. If the
  business layer needs to inspect HTTP error responses itself, configure
  `validateStatus: () => true`.

## Documentation Map

- [API Design](./api.html)：`createRequest`、request methods、request options and global configuration。
- [Response Handling](./response.html)：Automatic response type recognition、`responseType`、`transformResponse`。
- [Upload Progress](./upload.html)：`onUploadProgress` and fetch/XHR automatic switching。
- [Interception and Errors](./interceptors-and-errors.html)：Request interception、response interception, and error normalization。
- [Integration vanilla vanilla-signal-query](./query.html)：`queryFn` responsibility boundaries and recommended usage。
- [Example: Authorization with Token Refresh](./demo.html)：Short token、JWT access token + refresh token scenario。
