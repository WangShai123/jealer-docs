# Upload Progress

`vanilla-request` sends requests with `fetch` by default. Browser `fetch` does not provide upload progress events, so when progress control is needed, pass `onUploadProgress` in the request options. The current request automatically switches to `XMLHttpRequest`.

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

## Automatic Transport Selection

- Without `onUploadProgress`: use `fetch`.
- With `onUploadProgress`: use `XMLHttpRequest`.

The XHR branch returns a standard `Response`, and the result still goes through `responseType` reading, `transformResponse`, response interceptors, status validation, and error interceptors.

## Progress Object

```ts
interface UploadProgress {
  lengthComputable: boolean;
  loaded: number;
  progress?: number;
  total?: number;
}
```

- `loaded`: uploaded bytes.
- `total`: total bytes. This is available only when `lengthComputable` is `true`.
- `progress`: `loaded / total`. It is `undefined` when the total length cannot be calculated.
- `lengthComputable`: whether the browser can calculate the total length.

## Working with vanilla-signal-query

Upload percentage is request-transport state and should be pushed directly to the UI from `onUploadProgress`. `vanilla-signal-query` continues to own query state, timeouts, aborts, retries, and related behavior.

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

`query.abort()` or the `AbortSignal` passed by a query `timeout` cancels the underlying XHR upload.
