---
title: Vanilla SSE 文档中心 - JEALER
keywords: vanilla-sse, docs, JEALER
description: vanilla-sse 是一个轻量 SSE 客户端，用于订阅服务器发送事件。
---

# Vanilla SSE

`vanilla-sse` 是一个轻量 SSE 客户端。它通过 `fetch` 读取 `text/event-stream`，适合通知、客服、网页终端、数据抓取进度、AI 助手流式响应等需要请求头、授权、请求体和明确连接生命周期控制的场景。

## 功能特性

- 支持 `subscribe(listener)` 全量订阅消息。
- 支持 `subscribe(namespace, listener)` 按命名空间订阅消息。
- 支持 `subscribe(namespace, type, listener)` 按命名空间和类型订阅消息。
- 支持 `onEvent(eventName, listener)` 订阅原始自定义 SSE 事件。
- 支持监听 `status`、`open`、`reconnect`、`close` 连接状态。
- 支持通过 `SSEClientError` 处理结构化错误。
- 支持通过自定义 `headers` 和 `credentials` 接入授权。
- 支持自动重连、重试延迟、退避、随机抖动和最大重试次数控制。
- 支持空闲超时管理，避免长时间无响应的连接悬挂。
- 支持通过 `Last-Event-ID` 续接连接。
- 支持自定义解析器，适配非默认消息格式。

## 安装

NPM:

```bash
npm install vanilla-sse
```

CDN:

```html
<script src="https://unpkg.com/vanilla-sse/dist/index.umd.js"></script>
<script>
  // 全局变量 vanillaSSE
  const { createSSE } = vanillaSSE;
</script>
```

## 使用

```ts
import { createSSE } from 'vanilla-sse';

const sse = createSSE<{ title: string }>({
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 30_000,
  url: '/api/events',
});

sse.subscribe('notification', 'created', (message) => {
  console.log(message.payload.title);
});

sse.on('status', (state) => {
  console.log(state.status, state.reconnects);
});

sse.on('error', (error) => {
  console.warn(error.code, error.message);
});

await sse.connect();
```

默认情况下，每个 SSE `data:` 块都必须是 JSON 对象，并且至少包含以下字段：

```json
{
  "namespace": "notification",
  "type": "created",
  "payload": {}
}
```

自定义 SSE 事件可以和解析后的 JSON 消息一起使用：

```ts
sse.onEvent('notice', (event) => {
  console.log(event.id, event.data);
});
```

## API 介绍

- `createSSE(options | url)`：创建 SSE 客户端。
- `client.connect()`：打开连接，并在 HTTP 流被接受后 resolve。
- `client.close(reason?)`：关闭连接并中断当前请求。
- `client.reconnect()`：关闭当前连接并重新打开。
- `client.getState()`：返回当前连接状态快照。
- `client.state`：返回当前连接状态快照。
- `client.status`：返回当前连接状态。
- `client.subscribe(listener)`：接收所有解析后的消息。
- `client.subscribe(namespace, listener)`：接收指定命名空间的消息。
- `client.subscribe(namespace, type, listener)`：接收指定命名空间和类型的消息。
- `client.on('message', listener)`：接收所有解析后的消息。
- `client.on('error', listener)`：接收结构化错误。
- `client.on('status', listener)`：接收所有状态变化。
- `client.on('open', listener)`：接收连接打开事件。
- `client.on('reconnect', listener)`：接收重连事件。
- `client.on('close', listener)`：接收连接关闭事件。
- `client.onEvent(eventName, listener)`：按 `event:` 接收原始 SSE 事件。

## 参数说明

- `url`：SSE 接口地址。
- `headers`：请求头，常用于授权。
- `credentials`：请求凭据模式。
- `method`：请求方法。默认是 `GET`，设置 `body` 时默认是 `POST`。
- `body`：请求体，用于需要带参数打开流的接口。
- `signal`：外部中断信号。
- `timeout`：空闲超时时间，单位毫秒。`0` 表示禁用超时。
- `reconnect`：是否启用自动重连。默认是 `true`。
- `retry`：初始重连延迟，单位毫秒。默认是 `1000`。
- `retryBackoff.minDelay`：最小重连延迟。
- `retryBackoff.maxDelay`：最大重连延迟。
- `retryBackoff.factor`：指数退避倍数。
- `retryBackoff.jitter`：是否为重连延迟添加随机抖动。
- `maxRetries`：最大重连次数。默认不限制。
- `lastEventId`：初始事件 ID。
- `lastEventIdHeader`：重连时携带事件 ID 的请求头。默认是 `Last-Event-ID`。
- `parse`：用于解析 SSE `data:` 文本的自定义解析器。
- `fetch`：自定义 fetch 实现。
- `autoConnect`：创建客户端后立即打开连接。
