---
title: 中间件 G3-Web - JEALER
keywords: G3-Web 中间件, 中间件, REST API 中间件
description: 介绍如何基于 G3-Web 的中间件系统快速实现自定义的 REST API 中间件。
---

# 中间件

在 `G3 Web` 中，中间件是指在 `Rest API` 路由处理过程中，位于请求和响应之间的处理逻辑。您可以通过创建中间件类，来实现对请求的预处理、验证、日志记录等功能。

## 语法

使用注解 `#[Middleware()]` 来调用中间件。

```php
<?php
namespace JEALER\G3\Controllers;

use JEALER\G3\Attributes\RestRouter;
use JEALER\G3\Attributes\Middleware;
use JEALER\G3\Middleware\RestAuthMiddleware;

use WP_REST_Request;

class TestController {
    /**
     * 测试需要登录的API - 使用中间件实现
     * 访问：GET /wp-json/api/v1/test/protected
     * 
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    #[RestRouter(
        namespace: 'api/v1',
        route: 'test/protected',
        methods: 'GET'
    )]
    // 示例：登录验证中间件 // [!code highlight]
    #[Middleware(RestAuthMiddleware::class)] // [!code highlight]
    public function protectedEndpoint(WP_REST_Request $request): WP_REST_Response
    {
        $current_user = wp_get_current_user();

        return rest_ensure_response([
            'code'    => 200,
            'message' => '这是受保护的资源，只有登录用户才能访问',
            'data'    => [
                'id'           => $current_user->ID,
                'login'        => $current_user->user_login,
                'display_name' => $current_user->display_name
            ]
        ]);
    }
}
```

## 默认中间件

- `RestAuthMiddleware` 登录验证中间件，用于验证用户是否登录。
- `RoleMiddleware` 角色验证中间件，用于验证用户是否具有指定的角色。
- `RateLimitMiddleware` 限流中间件，用于限制用户的请求频率。
- `SchemaMiddleware` 数据验证中间件，用于验证请求参数是否符合指定的 JSON Schema。

### 用法：

```php
// 登录授权中间件，必须登录用户才能访问
#[Middleware(RestAuthMiddleware::class)]

// 角色中间件，必须是管理员才能访问，自定义参数 roles
#[Middleware(RoleMiddleware::class, ['administrator'])]

// 限流中间件，每分钟最多允许10次请求，自定义参数 limit 和 period
#[Middleware(RateLimitMiddleware::class, [10, 60])]
```

注意：`SchemaMiddleware` 数据验证中间件，无需手动调用。`Schema` 在注解中自动导入和触发。

## 自定义中间件

您可以通过创建一个实现了 `MiddlewareInterface` 接口的类，来定义您自己的中间件。

### 接口实现示例

```php
<?php
namespace JEALER\G3\Middleware;

use JEALER\G3\Middleware\MiddlewareInterface;
use WP_REST_Request;
use WP_Error;

class CustomMiddleware implements MiddlewareInterface {
    public function handle(WP_REST_Request $request): bool|WP_Error
    {
        // 自定义中间件逻辑
        // 返回 true 表示继续处理请求
        // 返回 WP_Error 表示中止请求并返回错误响应
    }
}
```

然后，您可以在路由中使用您的自定义中间件：

```php
#[Middleware(CustomMiddleware::class)]
```

### 参数传递示例

如果需要传递参数给中间件，请在构造器中接收参数。

```php
<?php
namespace JEALER\G3\Middleware;

use JEALER\G3\Middleware\MiddlewareInterface;
use WP_REST_Request;
use WP_Error;

class CustomMiddleware implements MiddlewareInterface {
    private int $limit;
    private int $window;

    public function __construct(int $limit = 60, int $window = 60)
    {
        $this->limit  = $limit;  // 请求次数限制
        $this->window = $window; // 时间窗口（秒）
    }

    public function handle(WP_REST_Request $request): bool|WP_Error
    {
        // 自定义中间件逻辑
        // 返回 true 表示继续处理请求
        // 返回 WP_Error 表示中止请求并返回错误响应
    }
}
```

然后，您可以在路由中使用您的自定义中间件，并传递参数：

```php
#[Middleware(CustomMiddleware::class, [10, 60])]
```
