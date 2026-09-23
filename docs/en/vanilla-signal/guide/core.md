# Core

Core is the foundation of the reactive runtime. It handles dependency tracking, computation scheduling, owner lifecycles, and error boundaries. It does not depend on Store, Async, DOM, or JSX.

## API Groups

### Basic Reactivity

- `access(value)`: if an accessor is passed, run it and return the result; otherwise return the original value.
- `createSignal(initial, options?)`: create `[getter, setter]`.
- `createEffect(fn, options?)`: create a side effect that automatically tracks dependencies.
- `createComputed(fn, options?)`: semantic alias of `createEffect`.
- `createMemo(fn, initial?, options?)`: create a cached derived value.
- `createWatch(source, fn, options?)`: watch one or more sources and receive new and previous values.
- `createSelector(source, equals?)`: create a selected-key predicate.

### Scheduling

- `batch(fn)`: merge multiple synchronous updates.
- `untrack(fn)`: read without collecting dependencies.
- `flushSync(fn?)`: synchronously flush the normal effect queue.
- `startTransition(fn)`: put updates into the lower-priority transition queue.

### Lifecycle

- `createRoot(fn)`: create a root owner, suitable for manual mounting and disposal.
- `createScope(fn?)`: create a manually runnable and disposable scope.
- `onCleanup(fn)`: register a cleanup function on the current owner.
- `onDispose(fn)`: semantic alias of `onCleanup`.
- `onMount(fn)`: run a mount callback in a microtask.
- `getOwner()`: get the current owner.

### Error Handling

- `createErrorBoundary(fn, fallback?)`: create an error-boundary scope.
- `catchError(fn, fallback)`: catch synchronous errors and return a fallback.

## Solid-like Semantics Boundary

`vanilla-signal` provides Solid-like reactive primitives, but it is not the Solid component runtime. For a full lifecycle and scheduling comparison, see [Solid-like but not Solid](./solid-like.html).

Key boundaries:

- `createEffect` runs once immediately by default; `createComputed` is a semantic alias of `createEffect`.
- `onCleanup` binds to the current owner. Without an owner, it cannot be cleaned up automatically and will warn in development.
- `onMount` uses microtask scheduling and is not a true DOM-mounted hook.
- `createErrorBoundary` does not render the fallback automatically.
- `startTransition` is only a lower-priority effect queue, not a full concurrency model.

## Example

```js
import { createEffect, createMemo, createSignal } from 'vanilla-signal';

const [count, setCount] = createSignal(0);
const doubled = createMemo(() => count() * 2);

createEffect(() => {
  console.log(doubled());
});

setCount(2);
```

## Module Boundaries

- Core can be depended on by other modules.
- Core does not access the DOM directly.
- Core does not create Store proxies.
- Core does not process JSX/templates.
