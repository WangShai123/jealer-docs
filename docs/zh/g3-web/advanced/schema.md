---
title: Schema G3-Web - JEALER
keywords: Schema, JSON 数据验证
description: 介绍如何基于 G3-Web 的 Schema 数据验证器快速实现自定义的 JSON 数据验证。
---

# Schema

G3-Web 提供了一个简单版本的 `Schema` 数据验证器，它使用注解的方式，为 `Rest Api` 路由添加 `JSON` 数据验证功能。

## 语法

```php
<?php
namespace JEALER\G3\Controllers;
use JEALER\G3\Attributes\RestRouter;
use JEALER\G3\Attributes\Schema;
use WP_REST_Request;
use WP_Error;

class TestController {
    /**
     * 测试POST API - 创建数据
     * 访问：POST /wp-json/api/v1/test/create
     *
     * @param WP_REST_Request $request
     * @return array
     */
    #[RestRouter(
        namespace: 'api/v1',
        route: '/test/create',
        methods: 'POST'
    )]
    // 使用 Schema 注解进行数据验证 // [!code highlight]
    #[Schema([// [!code highlight]
        'type'            => 'object',// [!code highlight]
        // 必需的参数 // [!code highlight]
        'required'        => ['name', 'description'],// [!code highlight]
        // body 参数 属性规则 // [!code highlight]
        'properties'      => [// [!code highlight]
            'name'        => [// [!code highlight]
                'type'      => 'string', // [!code highlight]
                'minLength' => 1, // [!code highlight]
                'maxLength' => 100 // [!code highlight]
            ], // [!code highlight]
            'description' => [// [!code highlight]
                'type'      => 'string',// [!code highlight]
                'maxLength' => 500// [!code highlight]
            ]// [!code highlight]
        ]// [!code highlight]
    ])]// [!code highlight]
    public function createData(WP_REST_Request $request): array
    {
        $data = $request->get_json_params();

        $name        = sanitize_text_field($data['name']);
        $description = sanitize_textarea_field($data['description']);

        // 模拟创建数据
        $created_data = [
            'id'          => wp_generate_uuid4(),
            'name'        => $name,
            'description' => $description,
            'created_at'  => current_time('mysql'),
            'created_by'  => get_current_user_id()
        ];

        return [
            'status'  => 'success',
            'message' => '数据创建成功',
            'data'    => $created_data
        ];
    }
}
```

## 属性

| 注解属性   | 类型     | 描述                |
| ---------- | -------- | ------------------- |
| type       | `string` | `object`            |
| required   | `array`  | body 参数的必填字段 |
| properties | `array`  | body 参数的字段规则 |

## 规则

| 规则类型  | 描述     | 期望值           | 支持                                                        |
| --------- | -------- | ---------------- | ----------------------------------------------------------- |
| type      | 数据类型 | `string` `array` | string, number, integer, boolean, object, array |
| enum      | 枚举值   | `array`          |                                                             |
| minLength | 最小长度 | `number`         |                                                             |
| maxLength | 最大长度 | `number`         |                                                             |
| minimum   | 最小值   | `number`         |                                                             |
| maximum   | 最大值   | `number`         |                                                             |

## Draft 7

如果需要更强大的 `JSON Schema` 验证功能，推荐使用完整支持 `JSON Schema Draft 7` 的第三方库，如：[opis/json-schema](https://github.com/opis/json-schema){target="_blank"}。
