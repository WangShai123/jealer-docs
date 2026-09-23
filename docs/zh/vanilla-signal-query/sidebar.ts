import type { SidebarConfig } from 'vanilla-press';

export default [
  { label: 'vanilla-signal-query', path: 'vanilla-signal-query/index' },
  { label: 'sidebar.design', path: 'vanilla-signal-query/design' },
  { label: 'API', path: 'vanilla-signal-query/api' },
  {
    label: 'sidebar.others',
    children: [
      { label: 'vanilla-signal', path: 'vanilla-signal/index' },
      { label: 'vanilla-signal-i18n', path: 'vanilla-signal-i18n/index' },
      { label: 'vanilla-signal-query', path: 'vanilla-signal-query/index' },
      { label: 'vanilla-request', path: 'vanilla-request/index' },
      { label: 'vanilla-lru', path: 'vanilla-lru/index' },
      { label: 'vanilla-create-storage', path: 'vanilla-create-storage/index' },
      { label: 'vanilla-jui', path: 'vanilla-jui/index' },
      { label: 'vanilla-press', path: 'vanilla-press/index' },
    ],
  },
] satisfies SidebarConfig;
