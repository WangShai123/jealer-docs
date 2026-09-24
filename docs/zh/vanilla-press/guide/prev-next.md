---
title: Vanilla Press 分页导航 - JEALER
keywords: vanilla-press, prev next, docs, JEALER
description: 详细介绍 vanilla-press 的分页导航功能。
---

# 分页导航

帮助用户快速浏览文档的分页导航功能。

## 构建

分页导航在构建阶段渲染，配置项为 `server.prevNext`。

```ts
export default {
  server: {
    prevNext: true,
  },
};
```

## 插槽

分页导航只会渲染到当前布局声明的 `<div data-vp-prev-next></div>` 插槽中。

- 默认文档布局已包含该插槽。
- `layout: home` 首页布局默认不渲染分页导航。
