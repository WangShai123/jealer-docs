---
title: Vanilla Signal Utils - JEALER
keywords: vanilla-signal, utils, docs, JEALER
description: vanilla-signal provides several utility functions, such as debouncing and throttling.
---

# Utils

Utils provides lightweight scheduling helpers, imported directly from the main entry:

```js
import { createDebounced, createThrottled } from 'vanilla-signal';
```

## createDebounced

Convert a value or accessor into a debounced accessor. When the source changes repeatedly, the accessor updates only after the specified delay following the last change.

```js
const [keyword, setKeyword] = createSignal('');
const debouncedKeyword = createDebounced(keyword, 300);
```

Useful for high-frequency input such as search fields, filter conditions, and window sizes.

## createThrottled

Convert a value or accessor into a throttled accessor. When the source changes frequently, it outputs the latest value by time window.

```js
const [scrollTop, setScrollTop] = createSignal(0);
const throttledScrollTop = createThrottled(scrollTop, 100);
```

Defaults are `leading: true` and `trailing: true`. If created inside `createRoot()`, `render()`, or an effect owner, the internal trailing timer is cleaned up when the owner is disposed.
