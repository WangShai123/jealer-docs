---
title: 资源地址 Vanilla Press - JEALER
keywords: vanilla-press, source-url, docs, JEALER
description: 详细介绍 vanilla-press 的资源地址功能。
---

# 资源地址

简化图片和视频资源的相对地址输入，构建期按页面深度自动处理资源地址。

## 支持

- Markdown 图片 `![alt](test.png)`
- HTML 图片 `<img src="test/test.png">`
- HTML 视频 `<video src="movie.mp4">`
- HTML 视频子资源 `<video><source src="movie.mp4"></video>`
- 额外支持 `video poster`
- `绝对 URL`、`协议地址`、`根路径`、`data:` / `blob:` 等不改

## 输入

仅需按照 `assets` 内的资源相对路径输入。如：

- `assets/test.png` 一级目录的资源输入地址 `test.png`。
- `assets/test/test.png` 多级目录的资源输入地址 `test/test.png`。

## 输出

执行 `npm run build` 构建时，会自动按页面深度处理资源地址，生成正确的相对路径。