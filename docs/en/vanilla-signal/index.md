---
title: Vanilla Signal Docs - JEALER
keywords: vanilla-signal, docs, JEALER
description: vanilla-signal is a fine-grained reactive runtime that brings Signal-based reactive design to framework-free, dependency-free, build-free vanilla JavaScript.
---

# Vanilla Signal

> A SolidJS-style reactive core without the framework compiler or full UI layer, making it lighter and easier to embed in any JavaScript project.

`vanilla-signal` is a fine-grained reactive runtime that brings Signal-based reactive design to framework-free, dependency-free, build-free vanilla `JavaScript`.

If you are looking for a lightweight, focused, dependency-free reactive solution to enhance vanilla JS applications, `vanilla-signal` is designed for that role.

## Use Cases

- Gradually introduce reactivity into an existing large application built with traditional JavaScript or jQuery to upgrade a complex interactive module.
- Get a framework-level reactive development experience without bringing in a full frontend framework.
- Build a highly customized UI component library or tool that does not depend on a specific framework ecosystem.

## Design Goals

- Fine-grained updates: whichever signal/store field is read, only the matching effect or DOM binding updates when that field changes.
- Framework-free: does not depend on React/Vue/Solid, and does not require build tools.
- Complex UI state: supports deep objects, arrays, sorting, insertion, deletion, derived state, and async requests.
- JSX experience: use `` jsx `...` `` templates without a build step, or connect to the JSX runtime in build environments.
- Maintainable: organize business code into state, memo, effect, and DOM binding layers.

## Installation

npm:

```bash
npm install vanilla-signal
```

script:

```html
<!-- UMD global variable: vanillaSignal -->
<script src="https://unpkg.com/vanilla-signal/dist/index.umd.js"></script>
<script>
  const { createSignal } = vanillaSignal;
</script>

<!-- ESM import -->
<script type="module">
  import { createSignal } from 'https://unpkg.com/vanilla-signal/dist/index.js';
</script>
```

`vanilla-signal` is the npm/CDN package name. `vanillaSignal` is only the browser global exposed by the UMD bundle.

## Minimal Example

```html
<div id="app"></div>
<script type="module">
  import { createSignal, jsx, render } from './dist/index.js';

  const [count, setCount] = createSignal(0);

  render(
    jsx`
      <button onClick=${() => setCount((value) => value + 1)}>
        count: ${count}
      </button>
    `,
    document.querySelector('#app')
  );
</script>
```

## Basic Mental Model

- `createSignal` stores primitive reactive values.
- `createEffect` re-runs side effects after the values it read change.
- `createMemo` caches derived values.
- `createDeepStore` manages objects and arrays.
- `render`, `insert`, and `jsx` bind reactive values to the DOM.

## Core Concepts

### Accessor

The read function of a signal is called an accessor:

```js
const [count, setCount] = createSignal(0);

count(); // read current value
setCount(1); // update
```

Reading an accessor inside reactive contexts such as `createEffect`, `createMemo`, `insert`, or dynamic `jsx` interpolations automatically creates dependencies.

### Owner and Cleanup

`createRoot`, `createScope`, `createEffect`, and list item roots all form an owner tree. Cleanup functions registered with `onCleanup` run before an effect re-runs or when an owner is disposed.

```js
const dispose = createRoot((dispose) => {
  const timer = setInterval(() => {}, 1000);
  onCleanup(() => clearInterval(timer));
  return dispose;
});

dispose();
```

### Recommended Structure

The recommended style is structured development: keep business logic and view rendering separate so the code stays easier to test and maintain.

- **Define state**: use `createDeepStore` to create reactive storage for business data such as lists and filter conditions.
- **Derive values**: use `createMemo` to create cached derived data based on state, such as the visible rows after filtering.
- **Render views**: use `render` with `jsx` templates to bind state and derived data to the DOM, and use control-flow helpers such as `For` and `Show` for lists and conditions.

```js
const state = createDeepStore({
  rows: [],
  filter: '',
});

const visibleRows = createMemo(() => {
  return state.rows.filter((row) => row.name.includes(state.filter));
});

render(
  () => jsx`
  <section>
    <input value=${() => state.filter} onInput=${(e) => {
      state.filter = e.currentTarget.value;
    }}>
    ${For({
      each: visibleRows,
      key: (row) => row.id,
      children: (row) => jsx`<div>${() => row().name}</div>`,
    })}
  </section>
`,
  document.querySelector('#app')
);
```

## API Overview

| Category       | API                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Core Reactive  | `createSignal`, `createEffect`, `createComputed`, `createMemo`, `createWatch`, `createSelector`, `access`                                |
| Scheduling     | `batch`, `untrack`, `flushSync`, `startTransition`                                                                                       |
| Lifecycle      | `createRoot`, `createScope`, `onCleanup`, `onDispose`, `onMount`, `getOwner`                                                             |
| Error Handling | `createErrorBoundary`, `catchError`                                                                                                      |
| Store          | `createStore`, `createDeepStore`, `createReadonly`, `isStore`, `isReadonlyStore`, `raw`, `storeVersion`, `produce`, `unwrap`, `snapshot` |
| Async          | `createResource`, `createSuspense`                                                                                                       |
| DOM            | `insert`, `render`, `bindText`, `bindAttr`, `bindStyle`, `bindClass`, `bindShow`, `bindIf`, `bindList`                                   |
| List Helpers   | `createListKey`, `createCompositeKey`, `For`, `Show`                                                                                     |
| JSX Runtime    | `jsx`, `jsxs`, `jsxDEV`, `h`, `createElement`, `Fragment`, `html`                                                                        |
| Utils          | `createDebounced`, `createThrottled`                                                                                                     |
| Devtools       | `emit`, `getDevtoolsSnapshot`, `devtoolsSnapshot`                                                                                        |
