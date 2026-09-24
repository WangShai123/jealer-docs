---
title: Vanilla Signal 异步模块 - JEALER
keywords: vanilla-signal, async, docs, JEALER
description: vanilla-signal 的异步模块，负责异步数据状态和简单 suspense 读取。它依赖 Core 和 Store，不直接操作 DOM。
---

# Async

Async 模块负责异步数据状态和简单 suspense 读取。它依赖 Core 和 Store，不直接操作 DOM。

## createResource

管理异步请求状态，返回 `[resource, controls]`。

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

带 source：

```js
const [id, setId] = createSignal('1');

const [user] = createResource(id, async (currentId) => {
  const res = await fetch(`/api/users/${currentId}`);
  return res.json();
});
```

`source` 可以是 `false`、`0`、`''` 这类合法值；只有 `undefined` 表示没有 source。source 变化触发的自动加载会把错误写入 `state.error`，不会产生未处理的 Promise rejection。手动调用 `reload()` / `refetch()` 时，返回的 Promise 仍会把当前请求错误 reject 给调用方。

## Resource 状态

- `data`：当前数据。
- `latest`：最近一次成功数据。
- `loading`：是否加载中。
- `error`：当前错误。
- `isStale`：已有数据是否处于刷新中。

## 异步边界

- 新请求会 abort 上一个仍在进行中的请求。
- 过时请求的成功或失败结果会被忽略，不会覆盖当前数据和错误状态。
- owner dispose 时会 abort 当前请求、清理 loading timer，并结束 loading/stale 状态。
- `throwErrors: true` 只影响读取 resource 时是否抛出 `state.error`。

## createSuspense

捕获读取函数抛出的 Promise，pending 时返回 fallback。

```js
const content = createSuspense(
  () => readAsyncValue(),
  () => 'loading...'
);
```

当前实现是轻量 runtime helper：它会在 Promise settle 后触发重新计算，但不会暂停 DOM 渲染树，也不提供框架级 Suspense boundary、错误边界或并发协调能力。

## 搭配工具

- [vanilla-signal-query](/zh/vanilla-signal-query/)：浏览器端 server state 管理。它处理 query 状态、缓存、失效和请求生命周期，不绑定 DOM 渲染，也不规定 UI 组织方式。
- [vanilla-request](/zh/vanilla-request/)：负责 HTTP 请求本身：准备请求、执行请求、解析响应、运行拦截器、做请求级错误恢复，并返回业务数据。
