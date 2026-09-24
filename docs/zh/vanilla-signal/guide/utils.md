---
title: Vanilla Signal Utils - JEALER
keywords: vanilla-signal, 防抖, 节流, docs, JEALER
description: vanilla-signal 提供了若干工具函数，如防抖、节流等。
---

# Utils

Utils 提供轻量调度工具，直接从主入口导入：

```js
import { createDebounced, createThrottled } from 'vanilla-signal';
```

## createDebounced

把一个值或 accessor 转成防抖 accessor。source 连续变化时，只在最后一次变化后的指定时间更新。

```js
const [keyword, setKeyword] = createSignal('');
const debouncedKeyword = createDebounced(keyword, 300);
```

适合搜索输入、筛选条件、窗口尺寸等高频输入场景。

## createThrottled

把一个值或 accessor 转成节流 accessor。source 高频变化时，按时间窗口输出最新值。

```js
const [scrollTop, setScrollTop] = createSignal(0);
const throttledScrollTop = createThrottled(scrollTop, 100);
```

默认 `leading: true`、`trailing: true`。如果在 `createRoot()`、`render()` 或 effect owner 内创建，内部 trailing timer 会随 owner dispose 清理。
