# Vanilla Create Storage

一个轻量级的异步存储抽象层，用于浏览器存储驱动。

## 安装

NPM:

```bash
npm install vanilla-create-storage
```

CDN:

```html
<!-- umd: 全局变量 vanillaStorage -->
<script src="https://unpkg.com/vanilla-create-storage/dist/index.umd.js"></script>
<script>
  const { createStorage } = vanillaStorage;
</script>

<!-- esm: 模块导入 -->
<script type="module">
  import { createStorage } from 'https://unpkg.com/vanilla-create-storage/dist/index.js';
</script>
```

## 使用

```js
import { createStorage } from 'vanilla-create-storage';

const storage = createStorage({
  driver: 'indexedDB',
  namespace: 'my-app',
  fallback: ['localStorage', 'memory'],
  ttl: 60_000,
});

await storage.set('user', { id: 1, name: 'Ada' });
await storage.set('token', 'abc', { ttl: 5 * 60_000 });

const user = await storage.get('user');
const token = await storage.get('token', { defaultValue: null });

await storage.delete('token');
await storage.clear();
```

## API

```js
const storage = createStorage(options);

await storage.set(key, value, options);
await storage.get(key, options);
await storage.has(key);
await storage.delete(key);
await storage.remove(key);
await storage.clear();
await storage.keys();
await storage.rawKeys();
await storage.values();
await storage.entries();
await storage.size();
await storage.prune(options);
await storage.close();
```

## 驱动器

- `localStorage`
- `sessionStorage`
- `indexedDB`
- `cookie`
- `memory`

## 设计原则

- 统一 API：不同 driver 使用同一组异步方法。
- 显式 fallback：不自动改变持久化和容量语义。
- 单层编码：record 只 JSON stringify 一次，降低 cookie 和服务端联调成本。
- 紧凑结构：record 字段使用 `v/c/e/val`，减少 cookie 和 storage 占用。
- 可演进协议：保留 `v`，未来结构升级时可以安全拒绝或迁移。
