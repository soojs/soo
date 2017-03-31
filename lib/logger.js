'use strict';

const winston = require('winston');
const fs = require('fs');

// 如果不存在logs目录，则创建一个
const logerDir = 'logs';
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new (winston.transports.File)({
            name: 'error',
            filename: './logs/error.log',
            level: 'error',
            colorize: true,
            handleExceptions: true
            // 日志自定义
            /*timestamp: function() {
                return Date.now();
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
            }*/
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: './logs/exceptions.log'
        })
    ],
    exitOnError: false
});


if(!fs.existsSync(logerDir)){
    fs.mkdirSync(logerDir);
}

module.exports = logger;

module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

