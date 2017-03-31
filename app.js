const koa = require('koa');
const co = require('co');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');

const router = require('./router');
const db = require('./db');
const logger = require('./lib/logger');
const config = require('./config');
const cgiCode = config.cgiCode;

let env = config.env;

// 初始化应用
const app = koa();

// public dir 利用nginx做
// app.use(serve(path.join(env.imgStoragePath)));

// body parser
app.use(bodyParser({
    formLimit: '2mb' // post传参限制在2m
}));

let errorEvt = 'error';

// 要放在路由规则的前面
app.use(function *(next){
    try {
        yield next;
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            // 参数错误
            this.body = Object.assign(cgiCode.ARGS_ERROR, {
                desc: err.message
            });
        } else if(err.name === 'WriteBodyError'){
            this.body = Object.assign(cgiCode.ARGS_ERROR, {
                desc: err.message
            });
        } else {
            // some errors will have .status
            // however this is not a guarantee
            this.status = err.status || 500;
            this.type = 'json';
            this.body = cgiCode.SERVER_ERROR;
        }

        // 抛出错误，进行错误处理
        this.app.emit(errorEvt, err, this);
    }
});


const SequelizeStore = require('koa-generic-session-sequelize');
const session = require('koa-generic-session');
app.use(session({
    store: new SequelizeStore(db.Client),
    key: config.loginCookieKey,
    cookie: {
    path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,  //one day in ms,
        rewrite: true,
        signed: true // 是否加密
    }
}));

// 是否登录检查
app.use(function *(next) {
    
    if (this.path.indexOf('/login') !== -1 || this.req.method.toUpperCase() === 'GET') {
        return yield next;
    }

    let sessonCookie = this.cookies.get(config.loginCookieKey);
    if (sessonCookie) {
        let hasLogin = yield this.sessionStore.get(sessonCookie);

        // 有cookie再检查是否过期
        if (! hasLogin) {
            this.body = cgiCode.UN_LOGIN;
            return this;
        } else {
            yield next;
        }
    } else {
        this.body = cgiCode.UN_LOGIN;
        return this;
    }
});

// 错误处理
app.on(errorEvt, function(err, ctx){
    logger.error('错误日志:' + err);
});

// 路由
app.use(router.routes());
app.use(router.allowedMethods());

co(function *() {
    let connection;

    try {
        if (process.env.NODE_ENV === 'test') {
            connection = yield db.Client.sync({force: true})
        } else {
            connection = yield db.Client.sync();
        }
    } catch (e) {
        logger.error('数据库连接失败。描述：'+JSON.stringify(e));
    }

    if(connection){
        app.listen(env.SERVER_PORT, (err) => {
            logger.info('server is started on port:' + env.SERVER_PORT);
        });
    }
});



module.exports = app;
