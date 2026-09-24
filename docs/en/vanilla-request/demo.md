---
title: Vanilla Request Demo - JEALER
keywords: vanilla-request, demo, docs, JEALER
description: About vanilla-request demo details.
---

# Vanilla Request Demo

> Authorization and token refresh

## Regular Short-Lived Tokens

In regular business flows, read the current token from the global `headers` function. The function runs again before every request, so new requests automatically use the latest token after it changes.

```ts
const api = createRequest({
  baseURL: '/api/',
  headers: () => ({
    Authorization: `Bearer ${accessToken()}`,
  }),
});
```

This fits ordinary short-lived tokens, admin-page tokens, server-injected tokens, and similar scenarios.

## JWT Access Token + Refresh Token

JWT-based systems usually have two tokens:

- access token: short-lived and used for normal API calls.
- refresh token: longer-lived and used to obtain a new access token.

Recommended flow:

1. Always read the current access token from the `headers` function.
2. Convert business-failure envelopes into `RequestError` in a response interceptor.
3. In an error interceptor, check `event.phase === 'response'` and `error.code === 'TOKEN_EXPIRED'`.
4. Use the refresh token to call the refresh endpoint.
5. Update the local access token and refresh token.
6. Return a replayed `RequestResult` for the original request, indicating that the error has recovered.
7. Use `meta.retried` to prevent infinite retries.

```ts
let refreshTask: Promise<Tokens> | null = null;

const api = createRequest({
  baseURL: '/api/',
  headers: () => ({
    Authorization: `Bearer ${accessToken()}`,
  }),
  validateStatus: () => true,
});

api.interceptors.response.use((result) => {
  const body = result.data as {
    code?: string;
    data?: unknown;
    message?: string;
    success?: boolean;
  };

  if (body.success !== false) return body.data;

  throw createRequestError(body.message ?? 'Business Error', {
    code: body.code,
    data: body,
    request: result.request,
    response: result.response,
    status: result.response.status,
    statusText: result.response.statusText,
  });
});

api.interceptors.error.use(async (error, event) => {
  if (!isRequestError(error) || event.phase !== 'response') return;

  const request = event.request;
  if (!request) return;

  if (
    error.code === 'TOKEN_EXPIRED' &&
    request.input !== 'auth/refresh' &&
    !(request.meta as { retried?: boolean } | undefined)?.retried
  ) {
    refreshTask ??= api
      .post<Tokens>('auth/refresh', {
        refreshToken: refreshToken(),
      })
      .finally(() => {
        refreshTask = null;
      });

    const tokens = await refreshTask;
    setAccessToken(tokens.token);
    setRefreshToken(tokens.refreshToken);

    return api.send(request.input, {
      ...request.options,
      meta: {
        ...(typeof request.meta === 'object' && request.meta
          ? request.meta
          : {}),
        retried: true,
      },
    });
  }
});
```

## Relationship with Query

Token refresh is a recovery strategy after request failure, so it belongs in the `vanilla-request` error interceptor. The response interceptor should only convert business-failure responses into `RequestError`.

Caching, retries, timeouts, aborts, and state display still belong to `vanilla-signal-query`.

For example, after an access token expires, the error interceptor can refresh the token and replay the original request. `query` only cares about the final success or failure result.

If the final result still fails, `query` applies its own retry and timeout policies and asks `vanilla-request` to try again until the request succeeds or both layers give up.
