---
title: Vanilla Request 文档中心 - JEALER
keywords: vanilla-request, docs, JEALER
description: vanilla-request 是一个零依赖的轻量级 HTTP 请求工具。同时，它配合 vanilla-signal-query 提供了 query function 的能力，补足 `fetch` 在全局配置、请求拦截、响应解包、错误归一化、授权头注入等方面的日常请求能力。
---

# Vanilla Request

`vanilla-request` 是轻量级 HTTP 请求工具。

它配合 [vanilla-signal-query](/zh/vanilla-signal-query/) 的 `queryFn()` 适配器，把 HTTP 请求变成 query function，补足 `fetch` 在全局配置、请求拦截、响应解包、错误归一化、授权头注入等方面的日常请求能力。上传请求需要进度事件时，传入 `onUploadProgress` 会自动从 `fetch` 切换到 `XMLHttpRequest`。

它不实现缓存、去重、重试、超时、请求状态或失效管理等功能，这些业务侧数据的管理能力属于 `vanilla-signal-query`，`vanilla-request` 只负责把 HTTP 请求准备好、发出去、解析出来、处理在返回业务所期望的数据之前的错误。

## 安装

NPM:

```bash
npm install vanilla-request
```

CDN:

```html
<!-- UMD 全局变量 vanillaRequest -->
<script src="https://unpkg.com/vanilla-request@latest/dist/index.umd.js"></script>
```

## 示例

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
  // 响应拦截
});
api.interceptors.error.use(async (error, event) => {
  // 错误拦截，如 token 过期、网络错误等 非业务数据层错误
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

## 设计边界

- `vanilla-request` 负责：HTTP 请求配置、请求/响应拦截、响应解析、错误归一化、请求恢复，以及返回业务数据。上传请求默认使用 `fetch`，只有传入 `onUploadProgress` 时切换到 XHR。
- `vanilla-signal-query` 负责：响应式 query 状态、缓存、stale 数据、重试、超时、中断、失效和本地 mutate。
- `api.queryFn()` 返回的是 `vanilla-request` 已经处理后的数据。配合
  `vanilla-signal-query` 使用时，推荐显式配置 `normalize: false`，避免 query
  层再按 `{ success, data, code, message }` 做二次归一化。
- 业务响应格式不内置假设。推荐在响应拦截器中按项目约定解包，比如 `{ success, data, code, message }`。
- 默认不把 4xx/5xx 当作成功。需要业务层自行判断 HTTP 状态时，可以配置 `validateStatus: () => true`。

## 文档地图

- [API 设计](./api.html)：`createRequest`、请求方法、请求选项和全局配置。
- [响应处理](./response.html)：自动响应类型识别、`responseType`、`transformResponse`。
- [上传进度](./upload.html)：`onUploadProgress` 和 fetch/XHR 自动切换。
- [拦截器与错误](./interceptors-and-errors.html)：请求拦截、响应拦截、错误归一化。
- [配合 vanilla-signal-query](./query.html)：`queryFn` 的职责边界和推荐写法。
- [示例：授权与 token 续期](./demo.html)：短 token、JWT access token + refresh token 场景。
