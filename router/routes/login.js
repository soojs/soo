const service = require('./../../service/userService');
const config = require('../../config');
const cgiCode = config.cgiCode;

module.exports = (appRouter) => {
    
    // 登录
    appRouter.post('/login', function *(next) {
        let user = this.request.body,
            username = user.username,
            password = user.password;

        if (username.length > 50 || username.length < 5 || password.length < 5 || password.length > 50) {
            this.body = cgiCode.LOGIN_PARAM_ERROR;
            return;
        }

        let $user = yield service.getUser(user.username, user.password);

        if ($user) {
            // 登录成功
            this.session = this.sessionId;
            this.body = cgiCode.SUCCESS;
        } else {
            // 登录失败
            this.body = cgiCode.LOGIN_FAIL;
        }
    });
};