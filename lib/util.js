const path = require('path');
const fs = require('fs');

module.exports._ = require('sequelize').Utils._;
module.exports.co = require('co');

module.exports.getModelValuesByKeys = ($model, keys) => {
    let ret;

    if (Array.isArray($model)) {
        ret = [];
        
        $model.forEach(module => {
            let temp = {};
            
            keys.forEach(key => {
                temp[key] = module.get(key);
            });
            
            ret.push(temp);
        });        
    } else {
        ret = {};
        
        keys.forEach(function (key) {
            ret[key] = $model.get(key);
        });    
    }

    return ret;
};

module.exports.session = {
    get: function get() {
        let session = this.session;
        
        session.count = session.count || 0;
        session.count++;
        this.body = session.count;
    },
    remove: function remove() {
        this.session = null;
        this.body = 0;
    },

    regenerate: function *regenerate() {
        get.call(this);
        yield this.regenerateSession();
        get.call(this);
    }
};


/**
 * 创建多级目录
 * @param  {String} dirpath 路径
 * @param  {String} mode    模式
 */
module.exports.mkdirsSync = function (dirpath, mode) {
    dirpath = path.resolve(dirpath);
    if (fs.existsSync(dirpath)) {
        return;
    }
    var dirs = dirpath.split(path.sep);
    var dir = '';
    for (var i = 0; i < dirs.length; i++) {
        dir += path.join(dirs[i], path.sep);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, mode);
        }
    }
};

/**
 * 递归删除目录
 * @param  {String} dirpath 路径
 */
module.exports.rmdirsSync = function (dirpath) {
    dirpath = path.resolve(dirpath);
    // console.log(dirpath);
    if (!fs.existsSync(dirpath)) {
        return;
    }
    var dirs = fs.readdirSync(dirpath);
    // console.log(dirs);
    var dir, len = dirs.length;
    if (len === 0) {
        fs.rmdirSync(dirpath);
        return;
    }
    for (var i = 0; i < len; i++) {
        dir = path.join(dirpath, dirs[i]);
        // console.log(dir);
        if (fs.statSync(dir).isDirectory()) {
            rmdirsSync(dir);
            // fs.rmdirSync(dir);
        } else {
            fs.unlinkSync(dir);
        }
    }
    fs.rmdirSync(dirpath);
};

// 获取base64图片格式
module.exports.getBase64ExtName = function (base64Str) {
    return /data\:image\/(\w+)\;/.exec(base64Str)[1];
};

module.exports.timeFormat = function (d, fmt) {
    var date,
        week,
        o,
        k,
        startTime = new Date('1970-01-01 0:0:0').getTime();

    if (d < startTime) {
        return null;
    }

    date = new Date(d);
    week = {
        0: '星期日',
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六'
    };
    o = {
        E: week[date.getDay() + ''],
        y: date.getFullYear(), //年
        M: date.getMonth() + 1, //月份
        d: date.getDate(), //日
        h: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //12小时制
        H: date.getHours(), //24小时制
        m: date.getMinutes(), //分
        s: date.getSeconds(), //秒
        q: Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };

    for (k in o) {
        fmt = fmt.replace(new RegExp(k + '+', 'g'), function (w) {
            var value = (k != 'E') ? '000' + o[k] : o[k];
            return value.substr(value.length - w.length >= 0 ? value.length - w.length : 0);
        });
    }

    return fmt;
};
