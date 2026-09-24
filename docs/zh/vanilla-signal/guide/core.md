---
title: Vanilla Signal 核心模块 - JEALER
keywords: vanilla-signal, core, docs, JEALER
description: vanilla-signal 的核心模块，是响应式运行时基础层，负责依赖收集、计算调度、owner 生命周期和错误边界。它不依赖 Store、Async、DOM 或 JSX。
---

# Core

Core 是响应式运行时基础层，负责依赖收集、计算调度、owner 生命周期和错误边界。它不依赖 Store、Async、DOM 或 JSX。

## API 分组

### 基础响应式

- `access(value)`：如果传入 accessor，则执行并返回结果；否则返回原值。
- `createSignal(initial, options?)`：创建 `[getter, setter]`。
- `createEffect(fn, options?)`：创建会自动追踪依赖的副作用。
- `createComputed(fn, options?)`：`createEffect` 的语义别名。
- `createMemo(fn, initial?, options?)`：创建缓存派生值。
- `createWatch(source, fn, options?)`：监听一个或多个 source，并得到新旧值。
- `createSelector(source, equals?)`：创建 selected key 判断函数。

### 调度

- `batch(fn)`：合并多次同步更新。
- `untrack(fn)`：在不收集依赖的环境中读取。
- `flushSync(fn?)`：同步刷新普通 effect 队列。
- `startTransition(fn)`：把更新放入低优先级 transition 队列。

### 生命周期

- `createRoot(fn)`：创建根 owner，适合手动挂载和 dispose。
- `createScope(fn?)`：创建可手动运行和销毁的作用域。
- `onCleanup(fn)`：注册当前 owner 的清理函数。
- `onDispose(fn)`：`onCleanup` 的语义别名。
- `onMount(fn)`：在微任务中执行挂载回调。
- `getOwner()`：获取当前 owner。

### 错误处理

- `createErrorBoundary(fn, fallback?)`：创建错误边界作用域。
- `catchError(fn, fallback)`：捕获同步错误并返回 fallback。

## Solid-like 语义边界

`vanilla-signal` 提供 Solid-like 响应式原语，但不是 Solid 组件运行时。生命周期与调度的完整对照见 [Solid-like but not Solid](./solid-like.html)。

关键边界：

- `createEffect` 默认立即执行一次；`createComputed` 是 `createEffect` 的语义别名。
- `onCleanup` 绑定当前 owner；无 owner 时不会自动清理，开发环境会 warning。
- `onMount` 是微任务调度，不是真正 DOM 挂载完成钩子。
- `createErrorBoundary` 不自动渲染 fallback。
- `startTransition` 只是低优先级 effect 队列，不是完整并发模型。

## 示例

```js
import { createEffect, createMemo, createSignal } from 'vanilla-signal';

const [count, setCount] = createSignal(0);
const doubled = createMemo(() => count() * 2);

createEffect(() => {
  console.log(doubled());
});

setCount(2);
```

## 模块边界

- Core 可以被其他模块依赖。
- Core 不直接访问 DOM。
- Core 不创建 Store proxy。
- Core 不处理 JSX/template。
