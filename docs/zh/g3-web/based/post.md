---
title: 文章与页面 G3-Web - JEALER
keywords: 文章与页面, 文章类型, 页面类型
description: 介绍 G3 Web 主题的文章与页面内容类型。
---

# 文章与页面

提供了自定义的文章与页面的内容类型。

## 需求背景

在 WP 中，默认 post 和 page 的问题：

1. post 和 page 的固定链接格式，过于基础
    - 缺少业务路由格式化表达。
    - 使用不当时，可能会对其他功能产生影响。
2. post 和 page 是默认的内容类型，耦合过深，难以在不影响其他功能的前提下进行自定义。

## 解决方案

搁置和不使用 post 和 page 的默认内容类型，并提供语义化的自定义的内容类型，并保持功能和数据一致。

在确保数据安全的前提下，对既有 post 和 page 进行迁移，将它们转换为新的自定义内容类型。

## 功能使用

在后台管理页面 `开发者模式` - `设置` 中，分别打开开关，启用 `文章` 和 `页面` 功能。

对应固定链接为 `/posts` 和 `/pages`：

- 归档页链接：`/posts`, `/pages`
- 详情页链接：`/posts/:id`, `/pages/:id`

## 数据迁移

在数据库中执行以下 SQL 语句，将既有 post 和 page 的数据进行迁移：

```sql
-- 开始事务，确保数据安全，避免数据不一致
START TRANSACTION;

-- 请替换为你的真实表名，常为 *_posts
UPDATE your_table_name
SET post_type = 'site-post'
WHERE post_type = 'post';

-- 请替换为你的真实表名，常为 *_posts
UPDATE your_table_name
-- 请把下方三处 g3.local 替为你的真实域名，注意 http:// 或 https:// 前缀 是否和你当前的域名服务一致
SET guid = REPLACE(guid, 'http://g3.local/', 'http://g3.local/posts/')
WHERE post_type = 'site-post'
  AND guid LIKE 'http://g3.local/%';

-- 检查无误后执行提交：
COMMIT;

-- 如果发现改错了，执行回滚：
-- ROLLBACK;
```
