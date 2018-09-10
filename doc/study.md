Q: 为什么要把`post_content`单独作为一个表？  
A: http://nethub2.iteye.com/blog/1847420

Q: 数据库的连接检查是否要影响到整个应用的启动（即数据库挂了，`app`要不要存活）？
A:

Q: 使用什么样的模版引擎跟适合开发？
A:

Q: 异步编程范式，用`async/await`好，还是用`yield function`？
A: 全部使用前者，一些需要针对`yield`的处理使用`co`和`blurbird`处理

Q: 如何用业务分层架构，需要传统的JAVA系列分成：`DAO/SERVICE/CONTROLLER`吗？
A:

Q: 如何选择各种`koa`插件？
A: 以下情况不使用或者自己重写：
  + 已经`NOT MAINTAINED`，比如`swig`（有维护的版本）；
  + 通不过安全检查的，执行`npm run check`；
  + 不方便未来业务扩展的；

Q: 如何选择`logger`与打印`logger`？
A: 

Q: 主站做SSR，如何存放前端后源代码与如何部署两者？
A: 至少要满足部署互不影响

Q: 性能平台
A: https://node.console.aliyun.com/dashboard/apps/211/agents

Q: 单元测试的选择
A: 最终选择了`eggjs`推荐的`mocha`和`power-assert`，但是`power-assert`没有显示出应有的效果，为何？？

Q: 为什么需要发布时间
A: 更新时间是给内容编辑用的，用于比较距离上一次是否由更新过内容；但是发布时间一旦发布就不会变的；

Q: 严重bug，cls在async/await下是有问题的，不能hook
A: https://github.com/othiym23/node-continuation-local-storage/issues/98#issuecomment-323503807

参考：  
+ (JerryQu's blog)[https://imququ.com/post/readme.html]

从这里可以学习的：
+ 编程范式
+ 性能优化
+ 职业规划
+ 如何把产品做到极致
