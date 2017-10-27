# 幸福六局

## 关于来源
缘起公司内前端团队的个人学习项目，觉得有必要促进大家学习的积极性和动手能力。所以从零开始开发该博客，并将通过该博客记录整个发展过程。

## koa插件

* koa-static - https://github.com/koajs/static
* koa-send - https://github.com/koajs/send
* koa-bundle - https://github.com/koajs/bundle
* koa-route - https://github.com/koajs/route
* koa-compose - https://github.com/koajs/compose
* koa-safe-jsonp - https://github.com/koajs/koa-safe-jsonp
* koa-bodyparser - https://github.com/koajs/bodyparser
* koa-session - https://github.com/koajs/session
* co-busboy -  [parser using co or koa](https://github.com/cojs/busboy.multipart)
* koa-multer - https://github.com/koa-modules/multer 

**未来如果团队发展健康，是有可能自己造轮子。希望会有那么一天**

## 目录结构
* apis: 开放数据接口层
* bin: 一些可能会有用的命令，和服务器入口`www.js`
* config: 博客参数配置
* controllers: 页面入口层
* doc: 开发文档，包括数据库设计和开发过程记录
* lib: 一些公共库
* log: 默认日志目录，可通过`config`目录的配置修改
* middlewares: 中间件合集
* public: 静态文件目录
* services: 业务逻辑层
* test: 测试代码
* views: 页面模版
* app.js 应用入口

## URL模块
| url path               | description |
|------------------------|-------------|
| /                      | 首页 |
| /rss.html              | 订阅 |
| /search.html           | 搜索 | 
| /post/about.html       | 关于 |
| /post/archives.html    | 归档 |
| /post/series.html      | 专题 |
| /post/:post-title.html | 文章详情页 |

