---
title: Vanilla Signal Solid-like 模型 - JEALER
keywords: vanilla-signal, solid-like, docs, JEALER
description: vanilla-signal 复刻的是 Solid 响应式原语的心智模型，不是 Solid 组件运行时。它适合无构建、CDN、原生浏览器使用，因此生命周期、错误边界和 transition 都采用更小的运行时语义。
---

# Solid-like but not Solid

`vanilla-signal` 复刻的是 Solid 响应式原语的心智模型，不是 Solid 组件运行时。它适合无构建、CDN、原生浏览器使用，因此生命周期、错误边界和 transition 都采用更小的运行时语义。

## 语义对照

| API                                  | vanilla-signal 语义                                                                       | 与 Solid 的差异                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `createEffect(fn)`                   | 默认立即同步执行一次；依赖变化后进入 effect 队列。                                        | 不区分组件渲染阶段，首次执行时机更直接。                                 |
| `createEffect(fn, { defer: true })`  | 首次执行进入微任务调度。                                                                  | 这是本库的调度选项，不等价于 Solid 的完整渲染队列语义。                  |
| `createComputed(fn)`                 | `createEffect` 的语义别名。                                                               | 不是 Solid 内部计算原语的完整等价实现。                                  |
| `createRoot(fn)`                     | 创建 owner，callback 返回 `undefined` 时返回 `{ dispose, run }`；否则返回 callback 结果。 | 返回规则是本库的手动运行时约定。                                         |
| `onCleanup(fn)`                      | 注册到当前 owner；effect 重跑前和 owner dispose 时按 LIFO 顺序执行。                      | 在无 owner 时不会绑定生命周期，开发环境会 warning。                      |
| `onMount(fn)`                        | 在微任务中恢复当前 owner 后执行；owner 已 dispose 时跳过。                                | 不是真正 DOM 挂载完成钩子；直接调用 `h/jsx` 时不会自动获得组件生命周期。 |
| `createErrorBoundary(fn, fallback?)` | 创建可 dispose 的 owner 错误边界，捕获子 owner 中的同步运行时错误。                       | `fallback` 仅作为返回字段保存，不会自动渲染 UI。                         |
| `startTransition(fn)`                | 把本次更新触发的 effect 放入低优先级队列，空闲或 timeout 后刷新。                         | 不是完整并发模型，不提供中断渲染或 Suspense 协调能力。                   |

## 使用建议

- 需要自动清理事件、定时器、DOM binding 时，把代码放进 `render()`、`createRoot()`、`createScope()` 或 `createEffect()` 内。
- `onCleanup()` 只清理当前 owner 管理的资源；如果在普通顶层脚本里调用，它会返回原函数但不会自动执行。
- `onMount()` 适合表达“当前同步创建阶段结束后运行”，不适合表达“节点已经进入文档并完成布局”。
- `createErrorBoundary()` 适合捕获响应式 owner 内的同步异常；异步 Promise rejection 应在业务异步流程或 `createResource` 中处理。
- `startTransition()` 只降低 effect 刷新优先级；不要把它理解为 UI 框架级并发渲染。
