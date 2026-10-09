---
title: G3-Web 编码规范 - JEALER
keywords: G3-Web, 编码规范, 编码质量, 可维护性, JEALER
description: 了解 G3 Web 编码规范、编码质量、可维护性。
---

# 编码规范

严格的编码规范约束，用于确保代码的质量和可维护性。

## 字符编码

- 所有字符串都必须使用 `UTF-8` 编码。
- 数据库强制使用 `utf8mb4` 编码。

## 自动加载

基于 [PSR-4](https://www.php-fig.org/psr/psr-4/) 规范进行自动加载。

## 代码风格

基于 [PSR-12](https://www.php-fig.org/psr/psr-12/) 规范进行代码风格约束。这明显区别于 `WordPress` 的代码风格和命名规范，更能方便您识别 WP 代码和 G3-Web 代码。

### 方法名

方法名使用小驼峰式命名法：以小写字母开头，后续的单词首字母大写。

- 示例：`getTheTitle()`
- 您可以轻松区分 `WordPress` 默认方法和 `G3` 方法，因为 WP 方法名使用下划线命名法 `get_the_title()`。

### 变量名

变量名使用小驼峰式命名法：以小写字母开头，后续的单词首字母大写。

- 示例：`$title`、`$totalPrice`

### 常量名

常量名应该全部大写，单词之间使用下划线 `_` 分隔。

- 示例：`define( 'G3_VERSION', '1.0.0' );`
- 示例：`const G3_VERSION = '1.0.0';`

### 类名

类名使用大驼峰式命名法：以大写字母开头，后续的单词首字母大写。

- 示例：`class UserService`、`class Seo`

### 命名空间

命名空间使用大驼峰式命名法：以大写字母开头，后续的单词首字母大写。

在 G3-Web 中，以 `JEALER\G3\` 作为命名空间前缀。

- 示例：`namespace JEALER\G3\Components`

### 注解

注释使用 `PHPDoc` 格式。

```php
/** @var PostService $postService */
$postService = $this->container->get(PostService::class);

/**
 * Invoke Method with AOP Aspects
 *
 * 调用方法时织入切面
 *
 * @param object     $target    目标对象
 * @param string     $method    方法名
 * @param array      $args      方法参数
 * @return mixed
 * @throws Throwable
 * @since 1.0.0
 * @author Wang Shai
 */
public function invoke(object $target, string $method, array $args): mixed
```

## 依赖管理

基于 [Composer](https://getcomposer.org/) 进行依赖管理，使用 [Packagist](https://packagist.org/) 作为默认的 Composer 仓库。

## API 数据格式

API 数据格式分场景支持：JSON、GraphQL、XML、HTML、CSV等。常规场景使用 JSON 格式。

### JSON 字段

常用 JSON 字段：

| 字段      | 类型     | 描述                | 是否必需 |
| --------- | -------- | ------------------- | -------- |
| `success` | `bool`   | 是否成功            | 是       |
| `code`    | `int`    | 状态码              | 是       |
| `message` | `string` | 状态描述            | 否       |
| `data`    | `array`  | 数据                | 是       |
| `traceId` | `string` | 分布式链路的跟踪 ID | 否       |
| `suggest` | `string` | 建议操作            | 否       |

## 错误码

错误码长度为 7 位，前 2 位为错误来源，中 2 位为业务域，后 3 位为具体错误编码。

1. 错误来源：

- 01：用户端错误，如：参数错误、权限不足等。
- 02：系统端错误，如：配置加载失败、数据库死锁等。
- 03：第三方调用错误，如：支付、短信等外部 api 或依赖的下游服务出错或超时。

2. 业务域：

- 01：基础架构错误（GateWay, Middleware...）
- 02：用户中心错误（UserService）
- 03：商品中心错误（ProductService）
- .... 更多业务域错误

3. 具体错误编码：

- 001-999：根据业务自定义错误归档，非固定编码。

## Git 提交规范

每次提交明确 `更新动作的关键词`，并简述更新内容。期望关键词列表如下：

- feat：新增功能
- fix：修复 bug
- modify：修改功能
- delete：删除功能或文件
- refactor：代码重构
- perf：性能优化
- docs：修改文档
- style：代码格式调整
- test：测试用例
- chore：构建过程、辅助工具或依赖的变更
- ci：持续集成配置和脚本的更改
- revert：回滚到上一个版本
