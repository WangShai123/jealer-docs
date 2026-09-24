---
title: Vanilla Signal JSX 模块 - JEALER
keywords: vanilla-signal, jsx, docs, JEALER
description: vanilla-signal 的 JSX 模块，提供 hyperscript、JSX runtime 和无构建 tagged template。它复用 DOM 模块的插入和属性处理能力。
---

# JSX

JSX 模块提供 hyperscript、JSX runtime 和无构建 tagged template。它复用 DOM 模块的插入和属性处理能力。

## h / createElement

```js
import { h } from 'vanilla-signal';

const button = h('button', { onClick: save }, 'Save');
```

`createElement` 是 `h` 的别名，适合 classic JSX runtime。

## jsx / jsxs / jsxDEV

可作为 automatic JSX runtime 使用，也可作为 tagged template 使用。

```js
import { jsx } from 'vanilla-signal';

const node = jsx('button', {
  children: 'Save',
  onClick: save,
});
```

函数值 prop 默认被视为动态 accessor，`ref`、`children`、`key` 和事件 prop 除外。需要传入普通函数值 DOM property 时，先创建节点再手动赋值。

无构建 tagged template：

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

`Fragment` 会保留 `0`、空字符串等可渲染文本值；`null`、`undefined`、`true`、`false` 在插入 DOM 时会被视为空内容。

## SVG

`h` / `jsx` 会根据标签名为常见 SVG 元素使用 SVG namespace，包括 `svg`、`path`、`defs`、`linearGradient`、`mask`、`pattern`、`filter` 和常见 `fe*` 滤镜节点。

```js
const icon = jsx('svg', {
  viewBox: '0 0 10 10',
  children: jsx('circle', { cx: 5, cy: 5, r: 4 }),
});
```

## html

将 HTML 字符串解析成 DOM 节点。

```js
const node = html('<span>ready</span>');
```

`html()` 和 `jsx``...`` tagged template 都会使用 `innerHTML` 解析静态字符串。不要把不可信 HTML 字符串传给它们；用户输入应作为插值文本或 DOM 节点传入。
