#Server

### 


### koa插件

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

###日志工具

* winston 
    不同类型，级别的日志可以写到不同的日志文件
    npmjs上看到此工具使用量更多，所以选择此日志工具
    
* morgan


### sample
* https://github.com/pselden/koa-demo.git


### 目录结构
* util: util
* db:dao
* model: domain
* service:
* web: router

### 线上环境配置文件config/production.json

```
{
 "DB_HOST": "127.0.0.1",
  "DB_DATABASE_NAME" : "fxblog-name",
  "DB_USERNAME": "",
  "DB_PASSWORD": "",
  "DB_PORT": db-prot,
  "SERVER_PORT": server-port,
  "imgStoragePath": "/home/blog-static"
}
```
