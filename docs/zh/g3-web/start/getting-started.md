---
title: 快速开始 G3-Web - JEALER
keywords: G3-Web, 快速开始, 安装, 启用, 授权, 使用, JEALER
description: 了解 G3 Web 安装、启用、授权、使用。
---

# 快速开始

## 安装 G3 Web

你可以通过以下两种方式获取 G3 Web：

1. 在管理后台搜索插件 `G3 Web` 并安装
2. 通过 Git 克隆或下载项目代码，解压到 `wp-content/plugins` 目录。
    - [Github 仓库](https://github.com/WangShai123/G3-Web)
        - 克隆 `git clone https://github.com/WangShai123/G3-Web.git`
        - 下载 [ZIP压缩包](https://github.com/WangShai123/G3-Web/archive/refs/heads/main.zip)
    - [Gitea 仓库](https://gitea.com/wangshai/G3-Web)
        - 克隆 `git clone https://gitea.com/wangshai/G3-Web.git`
        - 下载 [ZIP压缩包](https://gitea.com/wangshai/G3-Web/archive/main.zip)

## 启用 G3 Web

在管理后台插件页面，启用插件 G3 Web。

## 授权验证

访问 [JEALER](https://www.jealer.com) 成为 G3-Web 会员，在用户中心获取授权码，返回你的网站管理后台输入验证，提交授权。

## 创建新项目

你有两种方式基于 G3 Web 创建新项目：

1. 创建 WP 主题项目
    - 在 `管理后台` - `开发者模式` - `创建主题` 的选项页，填写主题信息，创建完整项目结构的新主题。
2. 创建前后分离 Web 项目
    - 在 WP 根目录的 `index.php` 中，设置 `define( 'WP_USE_THEMES', false );` 禁用 WP 主题功能。
    - 查询 API 文档，使用 API 自由实现纯前端项目。

## 认识项目结构

G3-Web 插件项目结构

:::tree
G3-Web/
├── assets/
├── bin/ [collapsed]
│   ├── supervisor/
│   │   └── queue-consumer/
│   │   │   ├── g3-queue-worker.conf
│   │   │   └── install.sh
│   ├── systemd/
│   │   └── queue-consumer/
│   │   │   ├── g3-queue-worker@.service
│   │   │   ├── install.sh
│   │   │   └── manage.sh
│   ├── console.php
│   ├── queue-manager.php
│   ├── queue-worker.php
│   └── start-workers.sh
├── config/ [collapsed]
│   ├── aspects.php
│   ├── components.php
│   ├── css.php
│   ├── define.php
│   ├── encrypt.php
│   ├── esm.php
│   ├── options.php
│   ├── queue.php
│   ├── rewriteRouter.php
│   ├── umd.php
│   └── whiteList.php
├── dist/
├── documents/
├── extensions/ [collapsed]
│   ├── cache/
│   └── jealer/
├── library/ [collapsed]
│   └── redis/
├── public/ [collapsed]
│   ├── audios/
│   ├── css/
│   ├── fonts/
│   ├── img/
│   ├── js/
│   ├── languages/
│   ├── videos/
│   └── w3lib/
├── src/ [collapsed]
│   ├── Cache/ [collapsed]
│   │   ├── EasyWechat.php
│   ├── Commands/ [collapsed]
│   │   ├── CollectPostCommand.php
│   │   └── CreateCommand.php
│   ├── Components/ [collapsed]
│   │   ├── {Component Name}/ [collapsed]
│   │   │   ├── tests/
│   │   │   ├── views/
│   │   │   ├── widgets/
│   │   │   ├── includes/
│   │   └── └── {Component Name}.php
│   ├── Controllers/ [collapsed]
│   │   └── {Controller Folder}
│   ├── Core/ [collapsed]
│   │   ├── Admin/ [collapsed]
│   │   │   ├── Field.php
│   │   │   ├── Panel.php
│   │   │   ├── PanelRenderer.php
│   │   │   └── Section.php
│   │   ├── Aspects/ [collapsed]
│   │   │   └── Aspects.php
│   │   ├── Attributes/ [collapsed]
│   │   │   ├── Aspects.php
│   │   │   ├── Inject.php
│   │   │   ├── Middleware.php
│   │   │   ├── RestRouter.php
│   │   │   └── Schema.php
│   │   ├── Components/ [collapsed]
│   │   │   ├── ComponentLoader.php
│   │   │   ├── ComponentManager.php
│   │   │   ├── ComponentRegistry.php
│   │   │   └── Components.php
│   │   ├── Container/ [collapsed]
│   │   │   ├── ConfigLoader.php
│   │   │   ├── Container.php
│   │   │   ├── ContainerBuilder.php
│   │   │   ├── ContainerExtensionInterface.php
│   │   │   ├── DefinitionInterface.php
│   │   │   ├── ExtensionManager.php
│   │   │   ├── ExtensionManagerInterface.php
│   │   │   ├── FactoryDefinition.php
│   │   │   ├── ParameterManager.php
│   │   │   ├── ParameterManagerInterface.php
│   │   │   ├── Reference.php
│   │   │   ├── ServiceDecorator.php
│   │   │   ├── ServiceDecoratorInterface.php
│   │   │   ├── TagManager.php
│   │   │   ├── TagManagerInterface.php
│   │   │   └── ValueDefinition.php
│   │   ├── Queue/ [collapsed]
│   │   │   ├── CronSchedules.php
│   │   │   ├── DatabaseQueue.php
│   │   │   ├── Job.php
│   │   │   ├── Queue.php
│   │   │   ├── QueueCronProcessor.php
│   │   │   ├── QueueInterface.php
│   │   │   └── RedisQueue.php
│   │   ├── Rewrite/ [collapsed]
│   │   │   └── RewriteRouter.php
│   │   ├── Router/ [collapsed]
│   │   │   ├── Controller.php
│   │   │   ├── ControllerClassFinder.php
│   │   │   ├── RouteConflictException.php
│   │   │   ├── RouteDefinitionBuilder.php
│   │   │   ├── RouteManifest.php
│   │   │   ├── Router.php
│   │   │   └── RouteSource.php
│   │   ├── Service/ [collapsed]
│   │   │   └── Service.php
│   │   ├── Activator.php
│   │   ├── ComponentLoader.php
│   │   ├── ComponentRegistry.php
│   │   ├── Deactivator.php
│   │   └── Loader.php
│   ├── Jobs/ [collapsed]
│   │   ├── EmailJob.php
│   │   ├── IMDataCleanerJob.php
│   │   └── IMMessageSyncJob.php
│   ├── Middleware/ [collapsed]
│   │   ├── MiddlewareInterface.php
│   │   ├── RateLimitMiddleware.php
│   │   ├── RestAuthMiddleware.php
│   │   ├── RoleMiddleware.php
│   │   ├── SchemaMiddleware.php
│   │   └── WhitelistMiddleware.php
│   ├── Services/ [collapsed]
│   │   ├── AuthService.php
│   │   ├── CommentService.php
│   │   ├── CopyrightService.php
│   │   ├── COSService.php
│   │   ├── CustomerService.php
│   │   ├── DBService.php
│   │   ├── FormService.php
│   │   ├── FundService.php
│   │   ├── IMRealtimeService.php
│   │   ├── IMService.php
│   │   ├── LLMService.php
│   │   ├── LogService.php
│   │   ├── MailerService.php
│   │   ├── MenuService.php
│   │   ├── NotificationService.php
│   │   ├── OrdersService.php
│   │   ├── OSSService.php
│   │   ├── PageService.php
│   │   ├── PaymentService.php
│   │   ├── PostService.php
│   │   ├── ProductService.php
│   │   ├── RedisService.php
│   │   ├── ShareService.php
│   │   ├── SidebarService.php
│   │   ├── SitemapService.php
│   │   ├── SwiperService.php
│   │   ├── SystemService.php
│   │   ├── TaxonomyService.php
│   │   ├── TemplateService.php
│   │   ├── TermService.php
│   │   ├── ThemeGeneratorService.php
│   │   ├── UserPostActionService.php
│   │   ├── UserService.php
│   │   └── WechatOAService.php
│   ├── Traits/ [collapsed]
│   │   └── Cache.php
│   ├── Utilities/ [collapsed]
│   │   ├── Cache.php
│   │   ├── Common.php
│   │   ├── Date.php
│   │   ├── Element.php
│   │   ├── Event.php
│   │   ├── Frontend.php
│   │   ├── Image.php
│   │   ├── Message.php
│   │   ├── Request.php
│   │   ├── Response.php
│   │   ├── System.php
│   │   ├── Type.php
│   │   └── Validator.php
├── templates/ [collapsed]
├── tests/ [collapsed]
├── vendor/ [collapsed]
├── composer.json
├── composer.lock
└── loader.php
:::


自定义主题项目结构

:::tree
your-theme-project/
├── assets/ [collapsed]
│   ├── audios
│   ├── css
│   ├── fonts
│   ├── img
│   ├── js
│   ├── languages
│   └── videos
├── config/ [collapsed]
├── pages/ [collapsed]
├── parts/ [collapsed]
├── src/ [collapsed]
├── templates/ [collapsed]
│   ├── 404/ [collapsed] 
│   │  └── index.php
│   ├── archive/ [collapsed] 
│   │  └── index.php
│   ├── category/ [collapsed] 
│   │  └── index.php
│   ├── Editor/ [collapsed] 
│   │  └── index.php
│   ├── my/ [collapsed]
│   │  └── index.php
│   ├── post/ [collapsed]
│   │  └── index.php
│   ├── tag/ [collapsed]
│   │  └── index.php
│   ├── taxonomy/ [collapsed]
│   │  └── index.php
│   ├── user/ [collapsed]
│   │  └── index.php
├── functions.php
├── header.php
├── footer.php
├── index.php
├── page.php
├── sidebar.php
├── style.css
├── screenshot.png
└── readme.md
:::
