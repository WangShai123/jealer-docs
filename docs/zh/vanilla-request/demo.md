# 示例

> 授权与 token 续期

## 常规短 token

常规业务中，可以在全局 headers 函数中读取当前 token。每次请求都会重新执行该函数，因此 token 更新后，新请求会自动带上最新值。

```ts
const api = createRequest({
  baseURL: '/api/',
  headers: () => ({
    Authorization: `Bearer ${accessToken()}`,
  }),
});
```

这适合普通短 token、后台页面 token、服务端注入 token 等场景。

## JWT access token + refresh token

JWT 业务中通常有两个 token：

- access token：有效期短，用于普通接口。
- refresh token：有效期长，用于换取新的 access token。

推荐做法是：

1. headers 函数始终读取当前 access token。
2. 响应拦截器把业务失败 envelope 转成 `RequestError`。
3. 错误拦截器检查 `event.phase === 'response'` 和 `error.code === 'TOKEN_EXPIRED'`。
4. 使用 refresh token 请求刷新接口。
5. 更新本地 access token 和 refresh token。
6. 返回重放原请求的 `RequestResult`，表示错误已恢复。
7. 用 `meta.retried` 防止无限重试。

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

## 与 query 的关系

token 刷新属于请求失败后的恢复策略，因此适合放在 `vanilla-request` 的错误拦截器里。响应拦截器只负责把业务失败响应转换成 `RequestError`。

缓存、重试、超时、中断和状态展示仍然属于 `vanilla-signal-query`。

例如 access token 过期后，错误拦截器可以完成刷新和重放；`query` 只关心最终成功或失败的结果。

如果最终结果依旧失败，`query` 会根据自身重试和超时策略，拿着皮鞭，督促 `vanilla-request` 再去尝试，直到成功，或者彼此都放弃。
