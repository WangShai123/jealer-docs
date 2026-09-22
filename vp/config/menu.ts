import type { MenuConfig } from 'vanilla-press';

export default [
  { label: 'menu.home', path: 'index' },
  {
    label: 'W3Lib',
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
  {
    label: 'G3',
    children: [{ label: 'G3-Web', path: 'g3-web/index' }],
  },
  {
    label: 'menu.learn',
    path: 'https://www.jealer.com/learn',
    target: '_blank',
  },
  {
    label: 'JEALER',
    path: 'https://www.jealer.com/',
    target: '_blank',
  },
] satisfies MenuConfig;
