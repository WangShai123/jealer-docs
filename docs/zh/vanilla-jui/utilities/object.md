---
title: Vanilla JUI 对象 工具函数 - JEALER
keywords: vanilla-jui, object, docs, JEALER
description: vanilla-jui 提供了对象 相关的系列工具函数。
---

# 对象

## 导入

```ts
import { isPlainObject } from 'vanilla-jui';
```

## isPlainObject

`isPlainObject(value)` 判断值是否为普通对象。

- 对象字面量和 `Object.create(null)` 返回 `true`；
- 数组、函数、DOM 节点和 class 实例返回 `false`。

```ts
isPlainObject({ value: 1 }); // true
isPlainObject([]); // false
isPlainObject(new Date()); // false
```

schema 中可使用 `type: 'plainObject'`，或在 `type: 'object'` 的基础上使用
`plain: true`。
