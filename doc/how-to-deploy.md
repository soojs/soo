---
title: Node后台的线上打包发布策略  
date: 2018-08-05 23:48:00  
updated: 2018-08-05 23:48:00  
desc: Node后台，如何实现快速安全的线上发布策略  
tags: deploy, 发布  
categories:  
author: jerrydot0  
comments: false   
---

+ pm2的deploy功能，在线上做```npm install```   
+ 本地打包成tar压缩包，直接扔到线上服务器解压缩；这种方案要考虑如何做最小化压缩，比如去掉非```dependencies```的依赖，对代码进行uglify压缩处理（是否有必要）   
+ docker？

