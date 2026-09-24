---
title: Vanilla Signal Devtools - JEALER
keywords: vanilla-signal, devtools, docs, JEALER
description: vanilla-signal 的 Devtools 模块，提供最小可用 Devtools 协议：稳定事件对象、响应式图快照、owner path、debugName/name 标记。
---

# Devtools

提供最小可用 Devtools 协议：稳定事件对象、响应式图快照、owner path、debugName/name 标记。

## Hook

如果页面上存在 `window.__SIGNAL_DEVTOOLS__`，运行时会向它发送 `SignalDevtoolsEvent`。

```js
window.__SIGNAL_DEVTOOLS__ = {
  enabled: true,
  emit(event) {
    console.log(event.type, event.payload);
  },
};
```

事件结构：

```ts
interface SignalDevtoolsEvent {
  type: string;
  timestamp: number;
  payload: Record<string, unknown>;
}
```

## debugName / name

以下 API 支持 `debugName` 或 `name`：

- `createSignal`
- `createEffect`
- `createComputed`
- `createMemo`
- `createWatch`
- `createRoot`
- `createScope`
- `createResource`
- `createStore`
- `createDeepStore`
- `createReadonly`
- `bindList`

示例：

```js
const [count, setCount] = createSignal(0, { debugName: 'counter.count' });

createEffect(
  () => {
    console.log(count());
  },
  { debugName: 'counter.render' }
);
```

## Snapshot

通过包入口读取响应式图快照：

```js
import { getDevtoolsSnapshot } from 'vanilla-signal';

const snapshot = getDevtoolsSnapshot();
```

快照包含：

- `sources`：signal、memo、store-key。
- `computations`：effect、memo、watch 等计算节点。
- `owners`：root、scope、effect、memo、error-boundary 等 owner 树节点。
- `dependencies`：source 到 computation 的依赖边。

## 关键事件

- `source:create`
- `source:update`
- `source:dispose`
- `computation:create`
- `computation:run`
- `computation:error`
- `computation:dispose`
- `dependency:add`
- `dependency:remove`
- `owner:create`
- `owner:dispose`
- `store:set`
- `store:delete`
- `store:array`
- `resource:start`
- `resource:success`
- `resource:error`
- `resource:abort`
- `resource:mutate`
- `list:update`
- `error:unhandled`

## 开销边界

- 未安装 hook 或 `enabled === false` 时，事件不会发送。
- snapshot 注册表只保存节点摘要，不把用户数据完整复制进图结构。
- 事件 payload 使用 source/computation/owner 摘要，避免直接暴露内部对象作为调试协议。
