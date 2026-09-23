import type { SidebarConfig } from 'vanilla-press';

export default [
  { label: 'vanilla-request', path: 'vanilla-request/index' },
  { label: 'sidebar.apiDesign', path: 'vanilla-request/api' },
  { label: 'sidebar.responseHandling', path: 'vanilla-request/response' },
  { label: 'sidebar.onUploadProgress', path: 'vanilla-request/upload' },
  {
    label: 'sidebar.interceptorsAndErrors',
    path: 'vanilla-request/interceptors-and-errors',
  },
  { label: 'sidebar.queryFn', path: 'vanilla-request/query' },
  { label: 'sidebar.demo', path: 'vanilla-request/demo' },
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
