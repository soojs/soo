const db = require('./../db');
const User = db.model.User;
const util = require('./../util');
const co = util.co;

module.exports.getUser = (username, password) => {
    return co(function *() {
        // 查询此id的文章是否存在
        return yield User.findOne({
            where: {
                username: username,
                password: password,
                is_delete: '1'
            }
        });
    });
};


