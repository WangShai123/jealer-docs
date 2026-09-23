---
layout: docs-index
title: 文档中心
keywords: W3Lib, G3, JavaScript, PHP, 文档
description: JEALER 文档中心，集中浏览 W3Lib 与 G3 相关项目文档。
layouts:
  docs-index:
    metricsLabel: 文档概览
    hero:
      badge: Docs Center
      title: 文档中心
      description: 欢迎来到 JEALER 文档中心，集中浏览 W3Lib、G3 等相关项目文档。
      metrics:
        - value: 2
          label: 项目族
        - value: 9
          label: 当前项目
        - value: i18n
          label: 中英文入口
    projects:
      badge: Projects
      title: 所有文档项目
      description: 集中浏览 W3Lib、G3 等相关项目文档。
    groups:
      - eyebrow: W3Lib
        title: Web 基础库
        description: 原生 JavaScript 生态下的可组合的 Web 基础设施：响应式、请求、存储、缓存、UI 和文档生成工具。
        items:
          - title: vanilla-signal
            description: 轻量信号运行时，用于细粒度响应式状态和视图更新。
            link: ./vanilla-signal/index.html
            icon: VS
            meta: core
            accent: is-blue
          - title: vanilla-signal-i18n
            description: 基于 vanilla-signal 的国际化管理，支持多语言切换与响应式翻译。
            link: ./vanilla-signal-i18n/index.html
            icon: I18
            meta: i18n
            accent: is-green
          - title: vanilla-signal-query
            description: 服务端状态与异步查询管理，覆盖缓存、重试、取消和预取等场景。
            link: ./vanilla-signal-query/index.html
            icon: VQ
            meta: data
            accent: is-orange
          - title: vanilla-request
            description: HTTP 请求工具，负责请求准备、解析、拦截、错误处理和进度事件。
            link: ./vanilla-request/index.html
            icon: VR
            meta: http
            accent: is-rose
          - title: vanilla-lru
            description: LRU 缓存工具，用于控制容量、复用结果和管理临时数据。
            link: ./vanilla-lru/index.html
            icon: LR
            meta: cache
            accent: is-blue
          - title: vanilla-create-storage
            description: 统一 cookie、localStorage 和 sessionStorage 的客户端存储 API。
            link: ./vanilla-create-storage/index.html
            icon: ST
            meta: storage
            accent: is-green
          - title: vanilla-sse
            description: SSE 客户端，支持多级订阅、连接管理、健壮性处理和自定义扩展。
            link: ./vanilla-sse/index.html
            icon: SSE
            meta: event
            accent: is-orange
          - title: vanilla-jui
            description: 原生 JavaScript UI 组件库，提供可组合、可主题化的界面基础设施。
            link: ./vanilla-jui/index.html
            icon: UI
            meta: ui
            accent: is-rose
          - title: vanilla-press
            description: 轻量静态文档生成器，支持多语言、搜索、SEO、自定义布局与客户端入口。
            link: ./vanilla-press/index.html
            icon: VP
            meta: docs
            accent: is-blue
      - eyebrow: G3
        title: G3 项目
        description: 面向中小企业私有化业务系统的项目文档。
        items:
          - title: G3-Web
            description: G3 Web 插件与业务功能文档，覆盖 WordPress 集成和前后端协作。
            link: ./g3-web/index.html
            icon: G3
            meta: web
            accent: is-blue
---
