import {
  createDeepStore,
  createMemo,
  produce,
  snapshot,
  render,
  jsx,
  For,
  Show,
} from 'vanilla-signal';
import { t } from 'vanilla-signal-i18n';
import { Toast } from 'vanilla-jui';

const locales = {
  zh: {
    add: '新增',
    all: '全部',
    allCount: '全部：',
    active: '未完成',
    activeCount: '未完成：',
    activeOnlyPrefix: '当前只显示未完成任务，共 ',
    clearDone: '清空已完成',
    delete: '删除',
    done: '已完成',
    doneCount: '已完成：',
    doneOnlyPrefix: '当前只显示已完成任务，共 ',
    empty: '暂无任务',
    export: '导出',
    exportTip: '导出成功。请在控制台查看详细信息。',
    itemUnit: ' 条',
    placeholder: '输入任务后按 Enter',
    title1: '学习 createSignal',
    title2: '写一个响应式列表',
  },
  en: {
    add: 'Add',
    all: 'All',
    allCount: 'All: ',
    active: 'Active',
    activeCount: 'Active: ',
    activeOnlyPrefix: 'Showing active tasks only, ',
    clearDone: 'Clear completed',
    delete: 'Delete',
    done: 'Completed',
    doneCount: 'Completed: ',
    doneOnlyPrefix: 'Showing completed tasks only, ',
    empty: 'No tasks yet',
    export: 'Export',
    exportTip: 'Export Success. Watch the console for details.',
    itemUnit: ' item(s)',
    placeholder: 'Enter a task and press Enter',
    title1: 'Learn createSignal',
    title2: 'Write a reactive list',
  },
};
const translate = (k) => t(k, locales);

const state = createDeepStore({
  draft: '',
  filter: 'all',
  todos: [
    { id: 't1', title: translate('title1'), done: true },
    { id: 't2', title: translate('title2'), done: false },
  ],
});

const totalCount = createMemo(() => state.todos.length);

const doneCount = createMemo(() => {
  return state.todos.filter((todo) => todo.done).length;
});

const activeCount = createMemo(() => totalCount() - doneCount());

const visibleTodos = createMemo(() => {
  if (state.filter === 'active') {
    return state.todos.filter((todo) => !todo.done);
  }

  if (state.filter === 'done') {
    return state.todos.filter((todo) => todo.done);
  }

  return state.todos;
});

const canAdd = createMemo(() => state.draft.trim().length > 0);

function addTodo() {
  const title = state.draft.trim();

  if (!title) return;

  state.todos.unshift({
    id: crypto.randomUUID(),
    title,
    done: false,
  });

  state.draft = '';
}

function removeTodo(id) {
  const index = state.todos.findIndex((todo) => todo.id === id);

  if (index >= 0) {
    state.todos.splice(index, 1);
  }
}

function clearDone() {
  produce(state, (draft) => {
    for (let index = draft.todos.length - 1; index >= 0; index -= 1) {
      if (draft.todos[index].done) {
        draft.todos.splice(index, 1);
      }
    }
  });
}

function exportData() {
  console.table(snapshot(state.todos));
  Toast.success(translate('exportTip'));
}

function filterButtonClass(filter) {
  return () =>
    `j-button ${state.filter === filter ? 'is-solid' : 'is-outline'} is-sm`;
}

render(
  () => jsx`
      <div class="toolbar">
        <input
          class="j-input"
          type="text"
          placeholder=${translate('placeholder')}
          value=${() => state.draft}
          onInput=${(event) => {
            state.draft = event.currentTarget.value;
          }}
          onKeyDown=${(event) => {
            if (event.key === 'Enter') addTodo();
          }}
        >
        <button class="j-button is-solid" disabled=${() => !canAdd()} onClick=${addTodo}>${translate('add')}</button>
      </div>

      <div class="filters">
        <div class="group">
          <button
            class=${filterButtonClass('all')}
            onClick=${() => {
              state.filter = 'all';
            }}
          >
          ${totalCount() > 0 ? `${translate('allCount')}${totalCount()}` : translate('all')}
          </button>
          <button
            class=${filterButtonClass('active')}
            onClick=${() => {
              state.filter = 'active';
            }}
          >
          ${activeCount() > 0 ? `${translate('activeCount')}${activeCount()}` : translate('active')}
          </button>
          <button
            class=${filterButtonClass('done')}
            onClick=${() => {
              state.filter = 'done';
            }}
          >
          ${doneCount() > 0 ? `${translate('doneCount')}${doneCount()}` : translate('done')}
          </button>
        </div>
        <div class="group">
          <button
            class="j-button is-default is-sm"
            disabled=${() => doneCount() === 0}
            onClick=${clearDone}
          >${translate('clearDone')}</button>
          <button class="j-button is-default is-sm" onClick=${exportData}>${translate('export')}</button>
        </div>
      </div>

      ${Show({
        when: () => state.filter !== 'all',
        children: jsx`
          <p>
            ${() =>
              state.filter === 'active'
                ? `${translate('activeOnlyPrefix')}${visibleTodos().length}${translate('itemUnit')}`
                : `${translate('doneOnlyPrefix')}${visibleTodos().length}${translate('itemUnit')}`}
          </p>
        `,
      })}

      <div class="list">
        ${For({
          each: visibleTodos,
          key: (todo) => todo.id,
          fallback: jsx`<div class="empty">${translate('empty')}</div>`,
          children: (todo) => jsx`
            <label class=${() => (todo().done ? 'item done' : 'item')} for=${() => todo().id}>
              <div class="j-checkbox">
                <input
                    id=${() => todo().id}
                    type="checkbox"
                    checked=${() => todo().done}
                    onChange=${(event) => {
                      todo().done = event.currentTarget.checked;
                    }}
                >
              </div>
              <span class="title">${() => todo().title}</span>
              <button class="j-button is-danger is-sm" onClick=${() => removeTodo(todo().id)}>
                ${translate('delete')}
              </button>
            </label>
          `,
        })}
      </div>
  `,
  document.querySelector('#app')
);
