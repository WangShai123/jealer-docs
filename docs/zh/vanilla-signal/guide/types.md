# Types

Types 模块分为 public 类型和 internal 类型。

## public.ts

`src/types/public.ts` 定义对外类型契约，并通过包入口导出。

常用类型：

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

示例：

```ts
import type { Accessor, Setter } from 'vanilla-signal';

let count!: Accessor<number>;
let setCount!: Setter<number>;
```

## internal.ts

`src/types/internal.ts` 只服务源码内部模块协作，例如 owner、computation、source、store meta。

这些类型不应作为用户代码依赖。
