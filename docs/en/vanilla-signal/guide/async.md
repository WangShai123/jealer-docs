---
title: Vanilla Signal Async - JEALER
keywords: vanilla-signal, async, docs, JEALER
description: vanilla-signal's Async module manages async data state and lightweight suspense reads. It depends on Core and Store, and does not operate on the DOM directly.
---

# Async

The Async module manages async data state and lightweight suspense reads. It depends on Core and Store, and does not operate on the DOM directly.

## createResource

Manage async request state and return `[resource, controls]`.

```js
import { createResource } from 'vanilla-signal';

const [user, controls] = createResource(
  () => fetch('/api/user').then((res) => res.json()),
  {
    initialValue: null,
  }
);

user();
user.loading();
user.error();
user.latest();

controls.reload();
controls.mutate((previous) => ({ ...previous, name: 'Ada' }));
```

With a source:

```js
const [id, setId] = createSignal('1');

const [user] = createResource(id, async (currentId) => {
  const res = await fetch(`/api/users/${currentId}`);
  return res.json();
});
```

`source` can be valid values such as `false`, `0`, or `''`; only `undefined` means there is no source. Automatic loading triggered by source changes writes errors into `state.error` and does not create unhandled Promise rejections. When `reload()` / `refetch()` is called manually, the returned Promise still rejects the current request error to the caller.

## Resource State

- `data`: current data.
- `latest`: most recent successful data.
- `loading`: whether a request is in progress.
- `error`: current error.
- `isStale`: whether existing data is refreshing.

## Async Boundaries

- A new request aborts the previous request if it is still in progress.
- Success or failure from stale requests is ignored and will not overwrite current data or error state.
- Owner disposal aborts the current request, clears the loading timer, and ends loading/stale state.
- `throwErrors: true` only controls whether reading the resource throws `state.error`.

## createSuspense

Catch a Promise thrown by a read function and return the fallback while pending.

```js
const content = createSuspense(
  () => readAsyncValue(),
  () => 'loading...'
);
```

The current implementation is a lightweight runtime helper: it triggers recomputation after the Promise settles, but it does not pause the DOM render tree and does not provide a framework-level Suspense boundary, error boundary, or concurrency coordination.

## Companion Tools

- [vanilla-signal-query](/en/vanilla-signal-query/): browser-side server state management. It handles query state, cache, invalidation, and request lifecycle, without binding to DOM rendering or prescribing UI organization.
- [vanilla-request](/en/vanilla-request/): handles HTTP requests themselves: preparing requests, executing requests, parsing responses, running interceptors, request-level error recovery, and returning business data.
