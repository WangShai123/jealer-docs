---
title: REST 路由 G3-Web - JEALER
keywords: REST 路由, 路由, REST API 路由
description: 介绍如何基于 G3-Web 的 REST API路由系统快速实现自定义的 REST API 路由。
---

# REST 路由

在 G3-Web 中，路由是特指基于 `WordPress Rest API` 的路由功能。您可以通过创建控制器类，来快捷实现自定义的 `REST API` 路由。

## 语法

使用注解 `#[RestRouter()]` 来创建路由。

```php
namespace JEALER\G3\Controllers;

use JEALER\G3\Attributes\RestRouter;
use WP_REST_Request;

class TestController {
    /**
     * 使用 #[RestRouter] 注解，来定义一个 REST API 路由
     *
     * @param string $namespace 命名空间
     * @param string $route 路由路径
     * @param string $methods 允许的 HTTP 方法
     *
     * 注意1：命名空间和路由路径不需要以斜杠 `/` 开头和结尾
     * 注意2：允许的 HTTP 方法，必须是大写字母
     * 注意3：允许的 HTTP 方法，可以是单个方法，也可以是多个方法的数组
     * 注意4：处理函数的函数名称可随意命名，系统会自动识别
     * 注意5：处理函数第一个参数必须 WP_REST_Request 类型
     * 注意6：处理函数建议返回 WP_REST_Response 对象
     *
     * 测试GET API - 获取基础信息
     * 访问：GET /wp-json/app/v1/test/info
     * @param WP_REST_Request $request
     * @return array
     */
    // 构造后的 Api URL: /wp-json/app/v1/test/info  // [!code highlight]
    #[RestRouter(               // [!code highlight]
        namespace: 'app/v1',    // 首尾无需斜杠     // [!code highlight]
        route: 'test/info',     // 首尾无需斜杠     // [!code highlight]
        methods: 'GET'          // 默认值 'GET' // [!code highlight]
    )]                          // [!code highlight]
    public function getInfo(WP_REST_Request $request): array
    {
        return [
            'status'       => 'success',
            'message'      => 'G3 Test API is working! from G3-Web plugin.',
            'time'         => current_time('mysql'),
            'server_info'  => [
                'php_version'       => phpversion(),
                'wordpress_version' => get_bloginfo('version'),
                'plugin_version'    => G3_VERSION
            ],
            'request_info' => [
                'method'  => $request->get_method(),
                'params'  => $request->get_params(),
                'headers' => $request->get_headers()
            ]
        ];
    }
}
```

1. 控制器类文件目录：主题目录下 `/src/Controllers/`。
2. 控制器类的命名空间：`JEALER\G3\Controllers`。
3. 控制器类的类名：需与文件名相同，且首字母大写。建议以 `Controller` 结尾。
4. 注解：使用 `#[RestRouter]` 注解来定义路由。
5. 路由构造地址：`/wp-json/{namespace}/{route}`。
   - `{namespace}` 为命名空间，`{route}` 为路由路径。
   - 例如：命名空间为 `app/v1`，路由路径为 `/info`，则完整访问路径为 `/wp-json/app/v1/info`。
   - 注意：访问路径中的 `/wp-json` 是固定的，不能修改。
6. 允许的 HTTP 请求方法：
   - 字符串：单个方法，默认值 `'GET'`
   - 数组：多个方法，如 `['GET', 'POST']`。

## 自动注册

系统会自动扫描 `src/Controllers` 目录下的所有控制器类，并自动注册其中的路由。无需手动注册。

## 缓存机制

- 开发环境下，路由会自动刷新，无需手动清除缓存。
- 生产环境下，路由会缓存起来，提高访问速度。您需要在管理后台手动生成路由缓存。
