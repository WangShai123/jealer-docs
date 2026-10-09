---
title: 查询 G3-Web - JEALER
keywords: WP_Query, 查询参数
description: 介绍 G3 Web 主题的 WP_Query 查询参数。
---

# 查询

## WP_Query

`WP_Query` 的数组参数非常丰富，用于控制文章查询的各个方面。

### 基本参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| post_type	|string/array	|文章类型，如 'post'、'page'、'custom_post_type'，默认为 'any'|
| posts_per_page	|int	|每页文章数量，-1 表示全部|
| paged	|int	|当前页码|
| offset	|int	|偏移量，跳过前 N 篇文章|
| order	|string	|排序方向：'ASC'（升序）或 'DESC'（降序）|
| orderby	|string	|排序依据：'date'、'title'、'modified'、'rand'、'comment_count' 等|

### 内容过滤

| 参数	| 类型	| 说明 |
| --- | --- | --- |
| s	|string	|搜索关键词|
| post_status	|string/array	|文章状态：'publish'、'draft'、'pending'、'private' 等|
| post_parent	|int	|父文章 ID（用于页面层级）|
| name	|string	|文章别名（slug）|
| p	|int	|指定文章 ID|
| page_id	|int	|指定页面 ID|

### 分类与标签

| 参数	| 类型	| 说明 |
| --- | --- | --- |
| category_name	|string	|分类别名|
| cat	|int/string	|分类 ID（多个用逗号分隔）|
| category__in	|array	|包含指定分类 ID|
| category__not_in	|array	|排除指定分类 ID|
| tag	|string	|标签别名|
| tag_id	|int	|标签 ID|
| tag__in	|array	|包含指定标签 ID|
| tag__not_in	|array	|排除指定标签 ID|

### 自定义分类法（Taxonomy）

|参数	|类型	|说明|
| --- | --- | --- |
| tax_query|	array|	自定义分类法查询（复杂条件）|

示例：

```php
'tax_query' => [
    [
        'taxonomy' => 'genre',
        'field'    => 'slug',
        'terms'    => ['action', 'comedy'],
        'operator' => 'IN'
    ]
]
```

### 自定义字段（Meta）

|参数	|类型	|说明|
| --- | --- | --- |
| meta_key	|string	|自定义字段键名|
| meta_value	|mixed	|自定义字段值|
| meta_query	|array	|自定义字段复杂查询|

示例：

```php
'meta_query' => [
    [
        'key'     => 'featured',
        'value'   => '1',
        'compare' => '='
    ]
]
```

### 作者相关

|参数	|类型	|说明|
| --- | --- | --- |
| author	|int/string	|作者 ID（多个用逗号分隔）|
| author_name	|string	|作者用户名|
| author__in	|array	|包含指定作者 ID|
| author__not_in	|array	|排除指定作者 ID|

### 日期相关

|参数	|类型	|说明|
| --- | --- | --- |
| year	|int	|年份|
| monthnum	|int	|月份（1-12）|
| day	|int	|日期（1-31）|
| date_query	|array	|复杂日期查询|

### 性能优化

|参数	|类型	|说明|
| --- | --- | --- |
| no_found_rows	|bool	|是否计算总记录数（分页时需要设为 false）|
| update_post_meta_cache	|bool	|是否更新文章元数据缓存|
| update_post_term_cache	|bool	|是否更新分类缓存|

示例：

```php
// 查询最近10篇已发布文章
$query = new WP_Query([
    'post_type'      => 'post',
    'posts_per_page' => 10,
    'post_status'    => 'publish',
    'order'          => 'DESC',
    'orderby'        => 'date'
]);

// 查询指定分类的文章
$query = new WP_Query([
    'category_name' => 'news',
    'posts_per_page' => 5
]);

// 自定义字段查询
$query = new WP_Query([
    'meta_query' => [
        [
            'key'     => 'price',
            'value'   => 100,
            'type'    => 'numeric',
            'compare' => '<='
        ]
    ]
]);
```
