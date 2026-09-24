---
title: Vanilla Signal JSX - JEALER
keywords: vanilla-signal, jsx, docs, JEALER
description: vanilla-signal's JSX module provides hyperscript, JSX runtime, and no-build tagged templates. It reuses insertion and prop handling from the DOM module.
---

# JSX

The JSX module provides hyperscript, JSX runtime, and no-build tagged templates. It reuses insertion and prop handling from the DOM module.

## h / createElement

```js
import { h } from 'vanilla-signal';

const button = h('button', { onClick: save }, 'Save');
```

`createElement` is an alias of `h`, suitable for the classic JSX runtime.

## jsx / jsxs / jsxDEV

These APIs can be used as the automatic JSX runtime and also as tagged templates.

```js
import { jsx } from 'vanilla-signal';

const node = jsx('button', {
  children: 'Save',
  onClick: save,
});
```

Function-valued props are treated as dynamic accessors by default, except for `ref`, `children`, `key`, and event props. If you need to pass a normal function value as a DOM property, create the node first and assign the property manually.

No-build tagged template:

```js
const view = jsx`
  <button onClick=${save}>
    count: ${count}
  </button>
`;
```

## Fragment

```js
const view = h(Fragment, null, h('span', null, 'A'), h('span', null, 'B'));
```

`Fragment` preserves renderable text values such as `0` and empty strings. `null`, `undefined`, `true`, and `false` are treated as empty content when inserted into the DOM.

## SVG

`h` / `jsx` use the SVG namespace for common SVG elements based on tag name, including `svg`, `path`, `defs`, `linearGradient`, `mask`, `pattern`, `filter`, and common `fe*` filter nodes.

```js
const icon = jsx('svg', {
  viewBox: '0 0 10 10',
  children: jsx('circle', { cx: 5, cy: 5, r: 4 }),
});
```

## html

Parse an HTML string into DOM nodes.

```js
const node = html('<span>ready</span>');
```

`html()` and the `` jsx`...` `` tagged template both parse static strings with `innerHTML`. Do not pass untrusted HTML strings to them; pass user input as interpolated text or DOM nodes.
