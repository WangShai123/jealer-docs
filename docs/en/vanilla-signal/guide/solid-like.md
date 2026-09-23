# Solid-like but not Solid

`vanilla-signal` mirrors the mental model of Solid reactive primitives, not the Solid component runtime. It is designed for no-build, CDN, native-browser usage, so lifecycle, error boundary, and transition behavior all use smaller runtime semantics.

## Semantics Comparison

| API                                  | vanilla-signal Semantics                                                                                                  | Difference from Solid                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `createEffect(fn)`                   | Runs once synchronously by default; after dependency changes, enters the effect queue.                                    | It does not distinguish component render phases, so the first run is more direct.                     |
| `createEffect(fn, { defer: true })`  | Schedules the first run in a microtask.                                                                                   | This is a scheduling option in this library, not equivalent to Solid's full render queue semantics.   |
| `createComputed(fn)`                 | Semantic alias of `createEffect`.                                                                                         | It is not a full equivalent of Solid's internal computation primitive.                                |
| `createRoot(fn)`                     | Creates an owner. If the callback returns `undefined`, returns `{ dispose, run }`; otherwise returns the callback result. | The return rule is this library's manual-runtime convention.                                          |
| `onCleanup(fn)`                      | Registers on the current owner; runs in LIFO order before an effect re-runs and when the owner is disposed.               | Without an owner, it is not bound to a lifecycle and will warn in development.                        |
| `onMount(fn)`                        | Runs in a microtask after restoring the current owner; skips if the owner has been disposed.                              | It is not a true DOM-mounted hook; direct `h/jsx` calls do not automatically get component lifecycle. |
| `createErrorBoundary(fn, fallback?)` | Creates a disposable owner error boundary and catches synchronous runtime errors in child owners.                         | `fallback` is stored only as a return field and does not automatically render UI.                     |
| `startTransition(fn)`                | Puts effects triggered by this update into a lower-priority queue and flushes them when idle or after timeout.            | It is not a full concurrency model and does not provide render interruption or Suspense coordination. |

## Usage Guidance

- Put code inside `render()`, `createRoot()`, `createScope()`, or `createEffect()` when events, timers, and DOM bindings need automatic cleanup.
- `onCleanup()` only cleans resources managed by the current owner. If called in a plain top-level script, it returns the original function but will not run automatically.
- `onMount()` is suitable for expressing "run after the current synchronous creation phase", not "the node is already in the document and layout is complete".
- `createErrorBoundary()` is suitable for catching synchronous exceptions inside reactive owners. Async Promise rejections should be handled in business async flows or `createResource`.
- `startTransition()` only lowers effect flush priority. Do not treat it as UI-framework-level concurrent rendering.
