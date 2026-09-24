---
title: Vanilla JUI Popup - JEALER
keywords: vanilla-jui, popup, docs, JEALER
description: Introduce the usage of the Popup component of vanilla-jui.
---

# Popup

Popup is a lightweight DOM factory. It only creates common popup nodes for other components to use.

<Badge text="UI Primitive" theme="danger"/> <Badge text="RenderableContent"/>

## Import

```ts
import { createPopup } from 'vanilla-jui';
```

## Basic Usage

```ts
const popup = createPopup({
  position: 'center',
  component: 'modal',
  content: 'Popup content',
});

document.body.appendChild(popup);
```

Generated structure:

```html
<div
  class="j-popup-layout is-center"
  role="dialog"
  data-modal="root"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  ...
</div>
```

## Options

`createPopup(options)`

```ts
createPopup(options:PopupOptions):HTMLElement {}
```

| Option       | Type                | Default            | Description                                                                   |
| ------------ | ------------------- | ------------------ | ----------------------------------------------------------------------------- |
| `className`  | `string`            | `'j-popup-layout'` | Base class name of the root node                                              |
| `position`   | `string`            | `'center'`         | Popup position, appended as `is-${position}`                                  |
| `component`  | `string`            | `''`               | Component name. When non-empty, renders `data-${component}` and matching ARIA |
| `labelledby` | `string`            | `''`               | When non-empty, renders `aria-labelledby`                                     |
| `content`    | `RenderableContent` | `''`               | Popup content                                                                 |

`position` supports nine-point placement. Available values:

- `center`
- `top-center`
- `bottom-center`
- `left-center`
- `right-center`
- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right`
