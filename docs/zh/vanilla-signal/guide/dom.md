# DOM

DOM 模块负责把响应式值绑定到浏览器 DOM。它依赖 Core，不依赖 Store 或 Async。

## 插入和渲染

### render

清空容器，在 root 作用域中插入内容，并返回 dispose。

```js
import { jsx, render } from 'vanilla-signal';

const dispose = render(
  jsx`<button>Save</button>`,
  document.getElementById('app')
);
```

### insert

向父节点插入可渲染值。值可以是 Node、字符串、数组、Fragment 或 accessor。

```js
insert(parent, () => count());
```

## DOM 绑定

- `bindText(el, value)`：绑定 `textContent`。
- `bindAttr(el, name, value)`：绑定 attribute。
- `bindStyle(el, nameOrObject, value?)`：绑定 style；对象形式会清理上一次存在、本次移除的 key。
- `bindClass(el, name, value)`：切换 class。
- `bindShow(el, value, display?)`：切换 `display`。
- `bindIf(anchor, condition, factory)`：按条件挂载块。

事件监听、动态属性和条件块清理依赖 owner。需要自动释放事件和 effect 时，请在 `render()`、`createRoot()`、`createScope()` 或 `createEffect()` 内创建 DOM；直接在顶层调用 `h()` / `jsx()` 创建的事件监听器不会自动绑定生命周期。

## 列表

### bindList

keyed 列表渲染。复用相同 key 的 DOM 节点，只移动顺序变化的节点。

```js
bindList(
  anchor,
  () => state.items,
  (item, index, itemAccessor) => jsx`
    <div data-id=${item.id}>${() => itemAccessor().name}</div>
  `,
  { key: (item) => item.id }
);
```

### createListKey / createCompositeKey

```js
const byId = createListKey('id');
const bySku = createCompositeKey('sku', 'warehouse');
```

## 控制流组件

- `Show(props)`：条件渲染访问器。
- `For(props)`：基于 `bindList` 的 keyed 列表组件。
