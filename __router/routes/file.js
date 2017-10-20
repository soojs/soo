const path = require('path');
const fs = require('fs');
const uuidV4 = require('uuid/v4');
// const Imagemin = require('imagemin');

const service = require('./../../service/fileService');
const logger = require('./../../lib/logger');
const config = require('../../config');
const imgStoragePath = config.env.imgStoragePath;
const cgiCode = config.cgiCode;

const util = require('./../../util');
const _ = util._;
const co = util.co;

module.exports = (appRouter) => {
    /**
     *  上传图片，支持多种格式
     *  1. base64
     *  2. form 二进抽提交
     *  3. formData
     */

    appRouter.post('/upload/base64', function *(next) {
        let param = this.request.body,
            imgBase64Str = param.base64, // 图片base64串
            width = param.width, // 图片宽度
            height = param.height, // 图片高度
            imgName = param.name || uuidV4().slice(0, 7),  // 图片名字
            totayStr = util.timeFormat(Date.now(), 'yyyyMMdd'), // 图片存放目录，以日期做为目录
            imgExtName, // 图片后缀名
            imgDir = 'images',
            imgPath = path.join(imgStoragePath, imgDir, totayStr), // 图片全路径
            imgReName, // 图片全路径，包含名称
            that = this;

        // 对base64串作检测
        if(! /^data:(.*);base64,/.test(imgBase64Str) && imgBase64Str.length < 100) {
            this.body = cgiCode.IMG_CONTENT_ERROR;
            return;
        }

        // 图片目录不存在，则创建目录
        if(! fs.existsSync(imgPath)) {
            util.mkdirsSync(imgPath);
        }

        // 从base64字符串中获取文件类型
        imgExtName = '.' + util.getBase64ExtName(imgBase64Str);

        imgReName = path.join(imgStoragePath, imgDir, totayStr, (imgName + imgExtName));

        // 如果图片已经存在，返回已存在图片的地址
        if(fs.existsSync(imgReName)) {
            // todo
        }

        // 保存文件
        let imgData = new Buffer(imgBase64Str.replace(/^data:(.*?);base64,/, ''), 'base64');

        // fs.writeFileSync(imgReName, imgData);

        let fileWriteStream = fs.createWriteStream(imgReName);

        fileWriteStream.write(imgData);
        fileWriteStream.end();

        this.body = Object.assign(cgiCode.SUCCESS, {
            result: {
                url: 'static/images/' + totayStr + '/'+ imgName + imgExtName,
                w: ~~width,
                h: ~~height
            }
        });
    });

    appRouter.post('/upload/form', function () {

    });
};