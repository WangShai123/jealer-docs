---
title: 模板 G3-Web - JEALER
keywords: 模板结构, 模板使用方法
description: 介绍 G3 Web 主题的模板结构和使用方法。
---

# 模板

基于 G3-Web 现有功能，通过自定义样式模板的方式，可以快速搭建一个符合自己需求的网站。

## 模板结构

:::tree
your-theme-project/
├── assets/ [collapsed]
│   ├── audios // 音频资源目录
│   ├── css  // CSS 资源目录
│   ├── fonts // 字体资源目录
│   ├── images // 图片资源目录
│   ├── javascript  // JavaScript 资源目录
│   ├── languages // 语言资源目录
│   └── videos // 视频资源目录
├── config/ [collapsed]
├── parts/ [collapsed]
├── src/ [collapsed]
├── templates/ [collapsed]
│   ├── archive/ [collapsed] 
│   │  └── index.php   // 默认归档页模板文件
│   ├── category/ [collapsed] 
│   │  └── index.php   // 默认分类页模板
│   ├── tag/ [collapsed]
│   │  └── index.php   // 默认标签页模板
│   ├── taxonomy/ [collapsed]
│   │  └── index.php   // 默认自定义分类法页模板
│   ├── post/ [collapsed]
│   │  └── index.php   // 默认单篇文章页模板
│   ├── page/ [collapsed]
│   │  └── index.php   // 默认页面模板
│   ├── user/ [collapsed]
│   │  └── index.php   // 默认用户页模板
│   ├── my/ [collapsed]
│   │  └── index.php   // 默认我的页面模板
│   ├── editor/ [collapsed]
│   │  └── index.php   // 默认编辑器页面模板
├── functions.php   // 主题函数文件
├── header.php  // 主题头部文件
├── footer.php  // 主题尾部文件
├── index.php   // 主题首页文件
├── page.php    // 默认页面文件
├── 404.php     // 404 页面文件
├── style.css   // 主题样式文件
├── screenshot.png  // 主题截图文件
└── readme.md  // 主题说明文件
:::