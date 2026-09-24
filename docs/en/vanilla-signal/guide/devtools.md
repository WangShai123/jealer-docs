---
title: Vanilla Signal Devtools - JEALER
keywords: vanilla-signal, devtools, docs, JEALER
description: vanilla-signal provides a minimal usable Devtools protocol: stable event objects, reactive graph snapshots, owner paths, and debugName/name labels.
---

# Devtools

1.1.7 provides a minimal usable Devtools protocol: stable event objects, reactive graph snapshots, owner paths, and `debugName`/`name` labels.

## Hook

If `window.__SIGNAL_DEVTOOLS__` exists on the page, the runtime sends `SignalDevtoolsEvent` objects to it.

```js
window.__SIGNAL_DEVTOOLS__ = {
  enabled: true,
  emit(event) {
    console.log(event.type, event.payload);
  },
};
```

Event shape:

```ts
interface SignalDevtoolsEvent {
  type: string;
  timestamp: number;
  payload: Record<string, unknown>;
}
```

## debugName / name

The following APIs support `debugName` or `name`:

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

Example:

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

Read a reactive graph snapshot from the package entry:

```js
import { getDevtoolsSnapshot } from 'vanilla-signal';

const snapshot = getDevtoolsSnapshot();
```

The snapshot includes:

- `sources`: signals, memos, and store keys.
- `computations`: computation nodes such as effects, memos, and watches.
- `owners`: owner tree nodes such as roots, scopes, effects, memos, and error boundaries.
- `dependencies`: dependency edges from sources to computations.

## Key Events

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

## Cost Boundaries

- When no hook is installed or `enabled === false`, events are not sent.
- The snapshot registry stores only node summaries and does not fully copy user data into the graph structure.
- Event payloads use source/computation/owner summaries to avoid exposing internal objects directly as the debugging protocol.
