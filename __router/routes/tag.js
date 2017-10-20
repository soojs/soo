const service = require('./../../service/tagService');
const logger = require('./../../lib/logger');
const config = require('../../config');
const cgiCode = config.cgiCode;

module.exports = (appRouter) => {
    // query
    appRouter.get('/tag', function *(next) {
        let ret = yield service.getTagList();

        if (ret) {
            this.body = {
                retcode: 0,
                result: {
                    list: ret.rows,
                    total: ret.count
                }
            };
        } else {
            this.body = {
                retcode: 0,
                result: {
                    list: [],
                    total: 0
                }
            };
        }

        yield next;
    });

    // add
    appRouter.put('/tag', function *(next) {
        let tag = this.request.body;
        const tagName = tag.name || '';

        if (tagName.length < 2 || tagName.length > 10) {
            this.body = Object.assign(cgiCode.ARGS_ERROR, {
                message: 'tag名称长度为2到10个字符'
            });
        } else {
            let tagList = yield service.getTagByName(tagName);

            if (tagList.length) {
                this.body = Object.assign(cgiCode.TAG_IS_EXIST);
            } else {
                tag.publish_time = Date.now();

                let $tag = yield service.addTag(tag);

                this.body = Object.assign(cgiCode.SUCCESS, {
                    result: {
                        tag: $tag
                    }
                });
            }
        }

        yield next;
    });

    // delete
    appRouter.delete('/tag/:id', function *(next) {
        let id = this.params.id;

        let ret = yield service.deleteTag(id);

        if (ret) {
            this.body = cgiCode.SUCCESS;
        } else {
            this.body = cgiCode.TAG_NOT_EXIST;
        }

        yield next;
    });
};