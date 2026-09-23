import type { SidebarConfig } from 'vanilla-press';

export default [
  { label: 'vanilla-signal', path: 'vanilla-signal/index' },
  {
    label: 'Core',
    children: [
      { label: 'Core', path: 'vanilla-signal/guide/core' },
      { label: 'Solid-Like', path: 'vanilla-signal/guide/solid-like' },
    ],
  },
  { label: 'Store', path: 'vanilla-signal/guide/store' },
  { label: 'Async', path: 'vanilla-signal/guide/async' },
  { label: 'DOM', path: 'vanilla-signal/guide/dom' },
  { label: 'JSX', path: 'vanilla-signal/guide/jsx' },
  { label: 'Devtools', path: 'vanilla-signal/guide/devtools' },
  { label: 'Types', path: 'vanilla-signal/guide/types' },
  { label: 'Utils', path: 'vanilla-signal/guide/utils' },
  {
    label: 'Demo',
    children: [{ label: 'To-do List', path: 'vanilla-signal/demo/to-do-list' }],
  },
  {
    label: 'sidebar.others',
    children: [
      { label: 'vanilla-signal', path: 'vanilla-signal/index' },
      { label: 'vanilla-signal-i18n', path: 'vanilla-signal-i18n/index' },
      { label: 'vanilla-signal-query', path: 'vanilla-signal-query/index' },
      { label: 'vanilla-request', path: 'vanilla-request/index' },
      { label: 'vanilla-lru', path: 'vanilla-lru/index' },
      { label: 'vanilla-create-storage', path: 'vanilla-create-storage/index' },
      { label: 'vanilla-sse', path: 'vanilla-sse/index' },
      { label: 'vanilla-jui', path: 'vanilla-jui/index' },
      { label: 'vanilla-press', path: 'vanilla-press/index' },
    ],
  },
] satisfies SidebarConfig;
