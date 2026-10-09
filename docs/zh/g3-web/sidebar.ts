import type { SidebarConfig } from 'vanilla-press';

export default [
  {
    label: "sidebar.introduction",
    collapse: true,
    children: [
      { label: "sidebar.introduction", path: "g3-web/intro/introduction" },
      { label: "sidebar.service", path: "g3-web/intro/service" },
    ],
  },
  {
    label: "sidebar.quickStart",
    collapse: true,
    children: [
      { label: "sidebar.prepare", path: "g3-web/start/prepare" },
      { label: "sidebar.quickStart", path: "g3-web/start/getting-started" },
    ],
  },
  {
    label: "sidebar.basic",
    collapse: true,
    children: [
      { label: "sidebar.template", path: "g3-web/based/template" },
      { label: "sidebar.query", path: "g3-web/based/query" },
      { label: "sidebar.loop", path: "g3-web/based/loop" },
      { label: "sidebar.post&page", path: "g3-web/based/post" },
    ],
  },
  {
    label: "sidebar.advanced",
    collapse: true,
    children: [
      { label: "sidebar.rewriteRule", path: "g3-web/advanced/rewrite" },
      { label: "sidebar.restRouter", path: "g3-web/advanced/router" },
      { label: "sidebar.middleware", path: "g3-web/advanced/middleware" },
      { label: "sidebar.schema", path: "g3-web/advanced/schema" },
      { label: "sidebar.component", path: "g3-web/advanced/component" },
      { label: "sidebar.queue", path: "g3-web/advanced/queue" },
      { label: "sidebar.consumer", path: "g3-web/advanced/consumer" },
    ],
  },
  {
    label: "sidebar.businessSystem",
    collapse: true,
    children: [],
  },
  {
    label: "sidebar.migration",
    collapse: true,
    children: [
      { label: "sidebar.database", path: "g3-web/migration/database" },
      { label: "sidebar.system", path: "g3-web/migration/system" },
    ],
  },
  {
    label: "sidebar.others",
    collapse: true,
    children: [
      { label: "sidebar.codeStandards", path: "g3-web/others/standards" },
      { label: "sidebar.statusCode", path: "g3-web/others/status-code" },
      { label: "WordPress", path: "g3-web/others/wp-version" },
    ],
  },
] satisfies SidebarConfig;
