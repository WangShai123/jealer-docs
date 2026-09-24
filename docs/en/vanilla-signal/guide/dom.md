---
title: Vanilla Signal DOM - JEALER
keywords: vanilla-signal, dom, docs, JEALER
description: vanilla-signal's DOM module binds reactive values to the browser DOM. It depends on Core, but not Store or Async.
---

# DOM

The DOM module binds reactive values to the browser DOM. It depends on Core, but not Store or Async.

## Insertion and Rendering

### render

Clear the container, insert content inside a root scope, and return `dispose`.

```js
import { jsx, render } from 'vanilla-signal';

const dispose = render(
  jsx`<button>Save</button>`,
  document.getElementById('app')
);
```

### insert

Insert a renderable value into a parent node. The value can be a Node, string, array, Fragment, or accessor.

```js
insert(parent, () => count());
```

## DOM Bindings

- `bindText(el, value)`: bind `textContent`.
- `bindAttr(el, name, value)`: bind an attribute.
- `bindStyle(el, nameOrObject, value?)`: bind styles; object form cleans up keys that existed previously but are removed in the next value.
- `bindClass(el, name, value)`: toggle a class.
- `bindShow(el, value, display?)`: toggle `display`.
- `bindIf(anchor, condition, factory)`: mount a block conditionally.

Event listeners, dynamic attributes, and conditional block cleanup depend on owners. When events and effects need automatic disposal, create DOM inside `render()`, `createRoot()`, `createScope()`, or `createEffect()`. Event listeners created by direct top-level `h()` / `jsx()` calls are not automatically bound to a lifecycle.

## Lists

### bindList

Keyed list rendering. DOM nodes with the same key are reused, and only nodes whose order changes are moved.

```js
bindList(
  anchor,
  () => state.items,
  (item, index, itemAccessor) => jsx`
    <div data-id=${item.id}>${() => itemAccessor().name}</div>
  `,
  { key: (item) => item.id }
);
```

### createListKey / createCompositeKey

```js
const byId = createListKey('id');
const bySku = createCompositeKey('sku', 'warehouse');
```

## Control-Flow Components

- `Show(props)`: conditional rendering accessor.
- `For(props)`: keyed list component based on `bindList`.
