# Store

The Store module manages reactive proxies for objects and arrays. It depends on Core signals and batching, but not DOM, JSX, or Async.

## APIs

### createStore

Create a shallow store. Only first-level properties are proxied.

```js
import { createEffect, createStore } from 'vanilla-signal';

const state = createStore({ count: 0, nested: { value: 1 } });

createEffect(() => {
  console.log(state.count);
});

state.count++;
```

### createDeepStore

Create a deep store. Nested objects and arrays are lazily proxied when read.

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

Create a deeply readonly store. Reads remain trackable, while writes, deletes, and array mutations are blocked.

```js
const readonlyState = createReadonly(state);
```

In default mode, readonly violations print a warning and ignore the write. Strict mode throws a `TypeError` directly:

```js
const readonlyState = createReadonly(state, { strictReadonly: true });
```

### produce

Run mutable updates inside `batch`.

```js
produce(state, (draft) => {
  draft.user.name = 'Grace';
  draft.items.push({ id: 2 });
});
```

### unwrap / snapshot

Convert store proxies into plain snapshots.

```js
const data = snapshot(state);
const raw = unwrap(state);
```

Boundaries:

- Only plain objects and arrays are processed.
- Enumerable string keys and enumerable symbol keys are copied.
- Non-enumerable keys are not included in snapshots.
- Non-proxied objects such as `Date`, `Map`, `Set`, and class instances are preserved as-is.
- Circular references are preserved as circular structures and do not cause recursive stack overflow.

### isStore / isReadonlyStore

Check whether a value is a store proxy created by this runtime.

```js
isStore(state);
isReadonlyStore(readonlyState);
```

### raw

Return the original object behind a store proxy.

```js
const source = raw(state);
```

Mutating the raw object directly does not trigger reactive updates. `raw()` prints a warning once by default. If it is only used for readonly inspection, disable the warning:

```js
const source = raw(state, { warn: false });
```

### storeVersion

Read the whole-store version. When read inside an effect/memo, any field write, delete, or array-structure change will trigger a re-run.

```js
createEffect(() => {
  console.log(storeVersion(state));
});
```

## Proxy Boundaries

- Plain objects and arrays are proxied.
- `Date`, `Map`, `Set`, and class instances are not proxied.
- Writes that bypass the proxy through original object references do not trigger reactive updates.
- `__raw`, `__isStore`, and `__version__` are no longer public contracts. Use `raw`, `isStore`, and `storeVersion` instead.
