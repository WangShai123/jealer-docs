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
] satisfies SidebarConfig;
