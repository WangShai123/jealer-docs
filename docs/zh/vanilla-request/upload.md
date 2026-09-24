---
title: Vanilla Request 上传进度 - JEALER
keywords: vanilla-request, 上传进度, docs, JEALER
description: vanilla-request 上传进度控制。
---

# 上传进度

`vanilla-request` 默认使用 `fetch` 发送请求。浏览器 `fetch` 不提供上传进度事件，所以需要进度控制时，请在请求选项中传入 `onUploadProgress`。当前请求会自动切换到 `XMLHttpRequest`。

```ts
const form = new FormData();
form.append('file', file);

await api.post<UploadResult>('photos', form, {
  onUploadProgress({ loaded, total, progress }) {
    if (progress !== undefined) {
      setPercent(Math.round(progress * 100));
    }

    console.log(loaded, total);
  },
});
```

## 自动选择传输方式

- 未传入 `onUploadProgress`：使用 `fetch`。
- 传入 `onUploadProgress`：使用 `XMLHttpRequest`。

XHR 分支会返回标准 `Response`，后续仍然经过 `responseType` 读取、`transformResponse`、响应拦截器、状态校验和错误拦截器。

## 进度对象

```ts
interface UploadProgress {
  lengthComputable: boolean;
  loaded: number;
  progress?: number;
  total?: number;
}
```

- `loaded`：已经上传的字节数。
- `total`：总字节数。只有 `lengthComputable` 为 `true` 时才有值。
- `progress`：`loaded / total`。无法计算总长度时为 `undefined`。
- `lengthComputable`：浏览器是否能计算总长度。

## 配合 vanilla-signal-query

上传百分比属于请求传输层状态，由 `onUploadProgress` 直接推给 UI。`vanilla-signal-query` 继续负责 query 状态、超时、中断、重试等。

```ts
const upload = createQuery<UploadResult>({
  queryKey: ['upload-avatar', file.name],
  normalize: false,
  queryFn: api.queryFn<UploadResult>(() => {
    const form = new FormData();
    form.append('avatar', file);

    return {
      url: 'photos',
      method: 'POST',
      body: form,
      onUploadProgress(event) {
        if (event.progress !== undefined) {
          setPercent(Math.round(event.progress * 100));
        }
      },
    };
  }),
});
```

`query.abort()` 或 query 的 `timeout` 传入的 `AbortSignal` 会取消底层 XHR 上传。
