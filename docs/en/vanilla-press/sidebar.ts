import type { SidebarConfig } from 'vanilla-press';

export default [
  { label: 'vanilla-press', path: 'vanilla-press/index' },
  { label: 'sidebar.quickStart', path: 'vanilla-press/guide/quick-start' },
  {
    label: 'sidebar.features',
    children: [
      { label: 'sidebar.layoutApi', path: 'vanilla-press/guide/layout-api' },
      { label: 'sidebar.homeLayout', path: 'vanilla-press/guide/layout-home' },
      {
        label: 'sidebar.componentApi',
        path: 'vanilla-press/guide/component-api',
      },
      {
        label: 'sidebar.ComponentsList',
        path: 'vanilla-press/guide/component-list',
      },
      { label: 'sidebar.client', path: 'vanilla-press/guide/client' },
    ],
  },
  {
    label: 'sidebar.runtime',
    // collapse: true,
    children: [
      { label: 'sidebar.runtime', path: 'vanilla-press/guide/runtime' },
      { label: 'sidebar.highlight', path: 'vanilla-press/guide/highlight' },
      { label: 'sidebar.math', path: 'vanilla-press/guide/math' },
      { label: 'sidebar.locale', path: 'vanilla-press/guide/locale' },
      { label: 'sidebar.menu', path: 'vanilla-press/guide/menu' },
      { label: 'sidebar.sidebar', path: 'vanilla-press/guide/sidebar' },
      { label: 'sidebar.toc', path: 'vanilla-press/guide/toc' },
      { label: 'SEO', path: 'vanilla-press/guide/seo' },
      { label: 'search.button', path: 'vanilla-press/guide/search' },
      { label: 'sidebar.prevNext', path: 'vanilla-press/guide/prev-next' },
      { label: 'sidebar.sitemap', path: 'vanilla-press/guide/sitemap' },
      { label: 'sidebar.robots', path: 'vanilla-press/guide/robots' },
      { label: 'sidebar.llms', path: 'vanilla-press/guide/llms' },
      { label: 'sidebar.theme', path: 'vanilla-press/guide/theme' },
      {
        label: 'sidebar.externalLink',
        path: 'vanilla-press/guide/external-link',
      },
      {
        label: 'sidebar.footerScript',
        path: 'vanilla-press/guide/footer-script',
      },
      { label: 'sidebar.editLink', path: 'vanilla-press/guide/edit-link' },
      { label: 'sidebar.lastUpdated', path: 'vanilla-press/guide/last-edit' },
    ],
  },
  {
    label: 'sidebar.others',
    collapse: true,
    children: [
      { label: 'sidebar.changelog', path: 'vanilla-press/guide/changelog' },
    ],
  },
] satisfies SidebarConfig;
