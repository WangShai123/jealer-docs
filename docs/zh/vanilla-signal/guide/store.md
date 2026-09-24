---
title: Vanilla Signal 存储模块 - JEALER
keywords: vanilla-signal, store, docs, JEALER
description: vanilla-signal 的存储模块，负责对象和数组的响应式代理。它依赖 Core 的 signal 和 batch 能力，但不依赖 DOM、JSX 或 Async。
---

# Store

Store 模块负责对象和数组的响应式代理。它依赖 Core 的 signal 和 batch 能力，但不依赖 DOM、JSX 或 Async。

## API

### createStore

创建浅层 store。只有第一层属性会被代理。

```js
import { createEffect, createStore } from 'vanilla-signal';

const state = createStore({ count: 0, nested: { value: 1 } });

createEffect(() => {
  console.log(state.count);
});

state.count++;
```

### createDeepStore

创建深层 store。嵌套对象和数组会在读取时懒代理。

```js
import { createDeepStore } from 'vanilla-signal';

const state = createDeepStore({
  user: { name: 'Ada' },
  items: [],
});

state.user.name = 'Grace';
state.items.push({ id: 1 });
```

### createReadonly

创建深层只读 store。读取仍可追踪，写入、删除和数组变异会被阻止。

```js
const readonlyState = createReadonly(state);
```

默认模式下只读违规会打印 warning 并忽略写入。严格模式会直接抛出 `TypeError`：

```js
const readonlyState = createReadonly(state, { strictReadonly: true });
```

### produce

在 `batch` 中执行可变更新。

```js
produce(state, (draft) => {
  draft.user.name = 'Grace';
  draft.items.push({ id: 2 });
});
```

### unwrap / snapshot

将 store proxy 转为普通快照。

```js
const data = snapshot(state);
const raw = unwrap(state);
```

边界：

- 只处理 plain object 和 array。
- enumerable string key 和 enumerable symbol key 会被复制。
- non-enumerable key 不会进入快照。
- `Date`、`Map`、`Set`、class instance 等非代理对象会原样保留。
- 循环引用会被保留为循环结构，不会递归爆栈。

### isStore / isReadonlyStore

判断一个值是否为本运行时创建的 store proxy。

```js
isStore(state);
isReadonlyStore(readonlyState);
```

### raw

返回 store proxy 对应的原始对象。

```js
const source = raw(state);
```

直接修改 raw 对象不会触发响应式更新。`raw()` 默认会打印一次 warning；如果只用于只读检查，可以关闭提示：

```js
const source = raw(state, { warn: false });
```

### storeVersion

读取 store 整体版本号。放在 effect/memo 中读取时，任意字段写入、删除或数组结构变化都会触发重跑。

```js
createEffect(() => {
  console.log(storeVersion(state));
});
```

## 代理边界

- plain object 和 array 会被代理。
- `Date`、`Map`、`Set`、class instance 不会被代理。
- 通过原始对象引用绕过 proxy 的写入不会触发响应式更新。
- 不再把 `__raw`、`__isStore`、`__version__` 作为公开约定；请使用 `raw`、`isStore`、`storeVersion`。
