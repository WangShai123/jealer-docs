---
title: Vanilla Signal 文档中心 - JEALER
keywords: vanilla-signal, docs, JEALER
description: vanilla-signal 是细粒度响应式运行时，将基于信号的响应式设计带到了无框架、无依赖、无构建的原生 JavaScript 世界。
---

# Vanilla Signal

> SolidJS 风格的响应式核心，但剥离了框架的编译器和完整的 UI 层，使其更轻量、更易嵌入到任何 JavaScript 项目中。

`vanilla-signal` 是细粒度响应式运行时，将基于信号的响应式设计带到了无框架、无依赖、无构建的原生 `JavaScript` 世界。

如果你正在寻找一个轻量、专注、无依赖的响应式方案来增强原生 JS 应用，可以考虑使用 `vanilla-signal`。

## 适用场景

- 在一个已有的、使用传统 JavaScript 或 jQuery 构建的大型应用中，逐步引入响应式能力来升级某个复杂的交互模块。
- 希望在不引入完整前端框架的情况下，获得框架级的响应式开发体验。
- 开发一个需要高度自定义、不依赖特定框架生态的 UI 组件库或工具。

## 设计目标

- 细粒度更新：读了哪个 signal/store 字段，就只在该字段变化时更新对应 effect 或 DOM。
- 无框架依赖：不依赖 React/Vue/Solid，也不要求构建工具。
- 支持复杂 UI 状态：支持深层对象、数组、排序、插入、删除、派生状态和异步请求。
- 支持 JSX 使用体验：无构建环境使用 `` jsx `...` `` 模板；有构建环境可接入 JSX runtime。
- 可维护：业务代码以 state、memo、effect、DOM binding 分层组织。

## 安装

npm:

```bash
npm install vanilla-signal
```

script:

```html
<!-- umd 全局变量 vanillaSignal -->
<script src="https://unpkg.com/vanilla-signal/dist/index.umd.js"></script>
<script>
  const { createSignal } = vanillaSignal;
</script>

<!-- esm 模块导入 -->
<script type="module">
  import { createSignal } from 'https://unpkg.com/vanilla-signal/dist/index.js';
</script>
```

`vanilla-signal` 是 npm/CDN 包名；`vanillaSignal` 只是在 UMD 产物中暴露的浏览器全局变量。

## 最小示例

```html
<div id="app"></div>
```

```js
import { createSignal, jsx, render } from 'vanilla-signal';

const [count, setCount] = createSignal(0);

render(
  jsx`
      <button onClick=${() => setCount((value) => value + 1)}>
        count: ${count}
      </button>
    `,
  document.querySelector('#app')
);
```

## 基本心智模型

- `createSignal` 保存基础响应式值。
- `createEffect` 在读取过的值变化后重新执行副作用。
- `createMemo` 缓存派生值。
- `createDeepStore` 管理对象和数组。
- `render`、`insert`、`jsx` 把响应式值绑定到 DOM。

## 基本概念

### Accessor

Signal 的读取函数称为 accessor：

```js
const [count, setCount] = createSignal(0);

count(); // 读取当前值
setCount(1); // 更新
```

在 `createEffect`、`createMemo`、`insert`、`jsx` 动态插值等响应式上下文中读取 accessor，会自动建立依赖。

### Owner 与清理

`createRoot`、`createScope`、`createEffect`、列表项 root 都会形成 owner 树。`onCleanup` 注册的清理函数会在 effect 重跑或 owner 销毁时执行。

```js
const dispose = createRoot((dispose) => {
  const timer = setInterval(() => {}, 1000);
  onCleanup(() => clearInterval(timer));
  return dispose;
});

dispose();
```

### 推荐组织方式

倡导结构化开发方式，将业务逻辑与视图渲染解耦，易测试、易维护。

- **定义状态**：使用 `createDeepStore` 创建包含业务数据（如列表、筛选条件）的响应式存储。
- **派生计算**：使用 `createMemo` 创建基于状态派生出的新数据（如筛选后的可见列表），并且自动缓存。
- **渲染视图**：使用 `render` 函数结合 `jsx` 模板将状态和派生数据绑定到 DOM，其中通过 `For`、`Show` 等控制流组件处理列表和条件。

```js
const state = createDeepStore({
  rows: [],
  filter: '',
});

const visibleRows = createMemo(() => {
  return state.rows.filter((row) => row.name.includes(state.filter));
});

render(
  () => jsx`
  <section>
    <input value=${() => state.filter} onInput=${(e) => {
      state.filter = e.currentTarget.value;
    }}>
    ${For({
      each: visibleRows,
      key: (row) => row.id,
      children: (row) => jsx`<div>${() => row().name}</div>`,
    })}
  </section>
`,
  document.querySelector('#app')
);
```

## API 总览

| 分类        | API                                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 核心响应式  | `createSignal`, `createEffect`, `createComputed`, `createMemo`, `createWatch`, `createSelector`, `access`                                |
| 调度        | `batch`, `untrack`, `flushSync`, `startTransition`                                                                                       |
| 生命周期    | `createRoot`, `createScope`, `onCleanup`, `onDispose`, `onMount`, `getOwner`                                                             |
| 错误处理    | `createErrorBoundary`, `catchError`                                                                                                      |
| Store       | `createStore`, `createDeepStore`, `createReadonly`, `isStore`, `isReadonlyStore`, `raw`, `storeVersion`, `produce`, `unwrap`, `snapshot` |
| 异步        | `createResource`, `createSuspense`                                                                                                       |
| DOM         | `insert`, `render`, `bindText`, `bindAttr`, `bindStyle`, `bindClass`, `bindShow`, `bindIf`, `bindList`                                   |
| 列表辅助    | `createListKey`, `createCompositeKey`, `For`, `Show`                                                                                     |
| JSX Runtime | `jsx`, `jsxs`, `jsxDEV`, `h`, `createElement`, `Fragment`, `html`                                                                        |
| 工具        | `createDebounced`, `createThrottled`                                                                                                     |
| Devtools    | `emit`, `getDevtoolsSnapshot`, `devtoolsSnapshot`                                                                                        |
