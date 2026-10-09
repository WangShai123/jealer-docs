---
title: G3-Web 状态码 - JEALER
keywords: G3-Web, 状态码, HTTP 状态码, 常用状态码, JEALER
description: 了解 G3 Web 状态码、常用状态码。
---

# 状态码

状态码用于表示客户端请求的处理结果，是服务器返回给客户端的 HTTP 响应的一部分。

G3-Web 使用标准 HTTP 状态码。

## 常用状态码

常用 HTTP 状态码：


| 代码  | 含义                                |
| --- | --------------------------------- |
| 200 | OK — 请求成功。                        |
| 201 | Created — 创建成功。                   |
| 204 | No Content — 请求成功但无返回体。           |
| 301 | Moved Permanently — 永久重定向。        |
| 302 | Found — 临时重定向。                    |
| 304 | Not Modified — 缓存未变化。             |
| 400 | Bad Request — 请求格式有误。             |
| 401 | Unauthorized — 未登录或 token 无效。     |
| 403 | Forbidden — 禁止访问。                 |
| 404 | Not Found — 资源不存在。                |
| 405 | Method Not Allowed — 错误的 HTTP 方法。 |
| 409 | Conflict — 数据冲突（例如重复提交）。          |
| 422 | Unprocessable Content — 验证失败。     |
| 429 | Too Many Requests — 频率限制。         |
| 500 | Internal Server Error — 服务器错误。    |
| 502 | Bad Gateway — 上游服务错误。             |
| 503 | Service Unavailable — 服务维护/压力过大。  |
| 504 | Gateway Timeout — 上游服务超时。         |


## 所有状态码

所有 HTTP 状态码：


| 代码         | 含义                                                    |
| ---------- | ----------------------------------------------------- |
| 1xx 信息性状态码 |                                                  |
| 100        | Continue — 已接收请求头，继续发送请求体。                            |
| 101        | Switching Protocols — 协议切换成功（如 WebSocket）。            |
| 102        | Processing — 服务器正在处理（WebDAV）。                         |
| 103        | Early Hints — 服务器提前返回 headers。                        |
| 200        | OK — 请求成功。                                            |
| 201        | Created — 成功创建资源。                                     |
| 202        | Accepted — 请求已接收但未完成处理。                               |
| 203        | Non-Authoritative Information — 代理修改了返回内容。            |
| 204        | No Content — 成功但返回空内容。                                |
| 205        | Reset Content — 要求客户端重置表单。                            |
| 206        | Partial Content — 返回部分内容（断点续传）。                       |
| 207        | Multi-Status — 多状态响应（WebDAV）。                         |
| 208        | Already Reported — 避免重复报告（WebDAV）。                    |
| 226        | IM Used — 使用 HTTP 增量编码（极少用）。                          |
| 300        | Multiple Choices — 多种选择。                              |
| 301        | Moved Permanently — 永久重定向。                            |
| 302        | Found — 临时重定向。                                        |
| 303        | See Other — 引导客户端用 GET 请求新 URL。                       |
| 304        | Not Modified — 资源未修改（缓存）。                             |
| 305        | Use Proxy — 已废弃。                                      |
| 306        | Switch Proxy — 已废弃。                                   |
| 307        | Temporary Redirect — 临时重定向，方法不变。                      |
| 308        | Permanent Redirect — 永久重定向，方法不变。                      |
| 400        | Bad Request — 客户端请求语法错误。                              |
| 401        | Unauthorized — 未认证，需登录。                               |
| 402        | Payment Required — 保留状态码（很少使用）。                       |
| 403        | Forbidden — 禁止访问。                                     |
| 404        | Not Found — 资源不存在。                                    |
| 405        | Method Not Allowed — 方法不允许。                           |
| 406        | Not Acceptable — 内容协商失败。                              |
| 407        | Proxy Authentication Required — 代理认证失败。               |
| 408        | Request Timeout — 请求超时。                               |
| 409        | Conflict — 请求冲突（如版本冲突）。                               |
| 410        | Gone — 资源永久消失。                                        |
| 411        | Length Required — 缺少 Content-Length 头。                |
| 412        | Precondition Failed — 条件请求失败。                         |
| 413        | Payload Too Large — 请求体过大。                            |
| 414        | URI Too Long — URL 太长。                                |
| 415        | Unsupported Media Type — 不支持的数据格式。                    |
| 416        | Range Not Satisfiable — 范围请求无效。                       |
| 417        | Expectation Failed — Expect 头失败。                      |
| 418        | I'm a Teapot — 彩蛋状态码（RFC 2324）。                       |
| 421        | Misdirected Request — 错发给不能处理的服务器。                    |
| 422        | Unprocessable Content — 无法处理的内容（验证失败）。                |
| 423        | Locked — 资源被锁定（WebDAV）。                               |
| 424        | Failed Dependency — 依赖失败（WebDAV）。                     |
| 425        | Too Early — 服务器拒绝因重放风险。                               |
| 426        | Upgrade Required — 要求升级协议。                            |
| 428        | Precondition Required — 必须条件请求。                       |
| 429        | Too Many Requests — 请求过多（限流）。                         |
| 431        | Request Header Fields Too Large — 头部过大。               |
| 451        | Unavailable For Legal Reasons — 被法律要求屏蔽。              |
| 500        | Internal Server Error — 服务器内部错误。                      |
| 501        | Not Implemented — 不支持此请求方法。                           |
| 502        | Bad Gateway — 上游返回无效响应。                               |
| 503        | Service Unavailable — 服务维护或过载。                        |
| 504        | Gateway Timeout — 上游响应超时。                             |
| 505        | HTTP Version Not Supported — 不支持 HTTP 版本。             |
| 506        | Variant Also Negotiates — 内容协商配置出错。                   |
| 507        | Insufficient Storage — 存储不足（WebDAV）。                  |
| 508        | Loop Detected — 检测到循环请求（WebDAV）。                      |
| 510        | Not Extended — 需要进一步扩展。                               |
| 511        | Network Authentication Required — 网络认证失败（如 WiFi 登录页）。 |


&nbsp;