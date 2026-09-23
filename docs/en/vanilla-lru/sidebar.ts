import type { SidebarConfig } from 'vanilla-press';

export default [
  { label: 'vanilla-lru', path: 'vanilla-lru/index' },
  { label: 'sidebar.design', path: 'vanilla-lru/design' },
  { label: 'API', path: 'vanilla-lru/api' },
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
