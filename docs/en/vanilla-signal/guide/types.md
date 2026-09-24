---
title: Vanilla Signal Types - JEALER
keywords: vanilla-signal, types, docs, JEALER
description: vanilla-signal's Types module is split into public types and internal types.
---

# Types

The Types module is split into public types and internal types.

## public.ts

`src/types/public.ts` defines external type contracts and is exported through the package entry.

Common types:

- `Accessor<T>`
- `Setter<T>`
- `SignalTuple<T>`
- `MemoAccessor<T>`
- `Renderable`
- `Component<P>`
- `SignalOptions<T>`
- `EffectOptions`
- `MemoOptions<T>`
- `ResourceState<T, E>`
- `ResourceAccessor<T, E>`
- `ResourceControls<T, S, E>`
- `ListOptions<T, K>`
- `ForProps<T, K>`
- `ShowProps<T>`
- `DeepReadonly<T>`
- `UnwrapStore<T>`
- `StoreOptions`
- `RawOptions`
- `ElementProps<T>`
- `DebugOptions`
- `SignalDevtoolsEvent`
- `SignalDevtoolsHook`
- `SignalGraphSnapshot`
- `SignalGraphSourceNode`
- `SignalGraphComputationNode`
- `SignalGraphOwnerNode`

Example:

```ts
import type { Accessor, Setter } from 'vanilla-signal';

let count!: Accessor<number>;
let setCount!: Setter<number>;
```

## internal.ts

`src/types/internal.ts` only supports collaboration between internal source modules, such as owner, computation, source, and store metadata.

These types should not be used as dependencies in user code.
