# vanilla-sse

`vanilla-sse` is a small SSE client. It reads `text/event-stream` with `fetch`, so it works well for notification, customer service, web terminal, crawler progress, and AI assistant streaming scenarios that need headers, authorization, request bodies, and explicit lifecycle control.

## Features

- Full message subscription with `subscribe(listener)`.
- Namespace subscription with `subscribe(namespace, listener)`.
- Namespace and type subscription with `subscribe(namespace, type, listener)`.
- Raw custom SSE event subscription with `onEvent(eventName, listener)`.
- Connection status listeners for `status`, `open`, `reconnect`, and `close`.
- Structured error handling with `SSEClientError`.
- Authorization support through custom `headers` and `credentials`.
- Automatic reconnect with retry delay, backoff, jitter, and max retry control.
- Idle timeout management for stale streams.
- `Last-Event-ID` reconnect support.
- Custom parser support for non-default message formats.

## Install

NPM:

```bash
npm install vanilla-sse
```

CDN:

```html
<script src="https://unpkg.com/vanilla-sse/dist/index.umd.js"></script>
<script>
  // Global Name: vanillaSSE
  const { createSSE } = vanillaSSE;
</script>
```

## Usage

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

By default, each SSE `data:` block must be a JSON object with at least these
fields:

```json
{
  "namespace": "notification",
  "type": "created",
  "payload": {}
}
```

Custom SSE events can be consumed before or alongside parsed JSON messages:

```ts
sse.onEvent('notice', (event) => {
  console.log(event.id, event.data);
});
```

## API

- `createSSE(options | url)`: creates an SSE client.
- `client.connect()`: opens the stream and resolves after the HTTP stream is accepted.
- `client.close(reason?)`: closes the stream and aborts the active request.
- `client.reconnect()`: closes the active stream and opens it again.
- `client.getState()`: returns a snapshot of the current connection state.
- `client.state`: returns a snapshot of the current connection state.
- `client.status`: returns the current status.
- `client.subscribe(listener)`: receives every parsed message.
- `client.subscribe(namespace, listener)`: receives parsed messages for one namespace.
- `client.subscribe(namespace, type, listener)`: receives parsed messages for one namespace and type.
- `client.on('message', listener)`: receives every parsed message.
- `client.on('error', listener)`: receives structured errors.
- `client.on('status', listener)`: receives every status change.
- `client.on('open', listener)`: receives open events.
- `client.on('reconnect', listener)`: receives reconnect events.
- `client.on('close', listener)`: receives close events.
- `client.onEvent(eventName, listener)`: receives raw SSE events by `event:`.

## Options

- `url`: SSE endpoint URL.
- `headers`: request headers, commonly used for authorization.
- `credentials`: request credential mode.
- `method`: request method. Defaults to `GET`, or `POST` when `body` is set.
- `body`: request body for endpoints that open streams with payloads.
- `signal`: external abort signal.
- `timeout`: idle timeout in milliseconds. `0` disables timeout.
- `reconnect`: enables automatic reconnects. Defaults to `true`.
- `retry`: initial reconnect delay in milliseconds. Defaults to `1000`.
- `retryBackoff.minDelay`: minimum reconnect delay.
- `retryBackoff.maxDelay`: maximum reconnect delay.
- `retryBackoff.factor`: exponential backoff factor.
- `retryBackoff.jitter`: randomizes reconnect delay when enabled.
- `maxRetries`: maximum reconnect attempts. Defaults to no limit.
- `lastEventId`: initial last event id.
- `lastEventIdHeader`: header used on reconnect. Defaults to `Last-Event-ID`.
- `parse`: custom parser for SSE `data:` text.
- `fetch`: custom fetch implementation.
- `autoConnect`: opens the stream immediately after client creation.
