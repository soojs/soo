const service = require('./../../service/articleService');
const logger = require('./../../lib/logger');
const config = require('../../config');
const cgiCode = config.cgiCode;
const db = require('./../../db');
const Tag = db.model.Tag;
const ArticleTag = db.model.ArticleTag;
const tagService = require('./../../service/tagService');
const util = require('./../../util');

const _ = util._;
const co = util.co;

module.exports = (appRouter) => {
    // query
    appRouter.get('/article/:page/:size', function *(next) {
        let param = this.params;
        let page = +param.page;
        let size = +param.size;
        let ret;

        if (page < 0) {
            this.body = Object.assign(cgiCode.ARGS_ERROR, {
                message: '页面是非负整数'
            });

            return yield next;
        }

        if (size <= 0) {
            this.body = Object.assign(cgiCode.ARGS_ERROR, {
                message: '查询条数是正整数'
            });

            return yield next;
        }

        ret = yield service.getArticleList(page, size);

        this.body = {
            retcode: 0,
            result: {
                list: ret.rows,
                total: ret.count
            }
        };

        yield next;
    });

    // add
    appRouter.put('/article', function *(next) {
        let article = this.request.body;

        article.publish_time = Date.now();

        let $article = yield service.addArticle(article);

        // 如果有tagid, 则要带上tag

        let tags = JSON.parse(this.request.body.tags);

        if (tags.length) {
            let $tags = [];
            
            for (var i = 0; i < tags.length; i++) {
                $tags.push(yield Tag.findById(tags[i]));
            }
            
            $article.addTags(tags);
        }
        
        this.body = Object.assign(cgiCode.SUCCESS, {
            result: {
                article: $article
            }
        });
    });

    let updateFn = function *(next) {
        let id = this.params.articleId;
        let newArticle = this.request.body;

        let ret = yield service.updateArticle(id, newArticle);

        if (ret) {
            this.body = cgiCode.SUCCESS;
        } else {
            this.body = cgiCode.ARTICLE_NOT_EXIST;
        }

        yield next;
    };

    // update。由于patch支持的浏览器不多，.patch,.post都用作更新操作。
    appRouter.patch('/article/:articleId', updateFn);
    appRouter.post('/article/:articleId', updateFn);

    // delete
    appRouter.delete('/article/:id', function *(next) {
        let id = this.params.id;

        let ret = yield service.deleteArticle(id);

        if (ret) {
            this.body = cgiCode.SUCCESS;
        } else {
            this.body = cgiCode.ARTICLE_NOT_EXIST;
        }

        yield next;
    });

    // 获取文章详情
    appRouter.get('/article/:id', function *(next) {
        let id = this.params.id;

        // 查询文章内容，同时让阅读数加1
        let ret = yield service.getArticleById(id, true);
        let tags = yield ret.getTags();


        if (ret) {
            this.body = Object.assign(cgiCode.SUCCESS, {
                result: {
                    article: ret,
                    tags: util.getModelValuesByKeys(tags, ['name', 'id'])
                }
            });
        } else {
            this.body = cgiCode.ARTICLE_NOT_EXIST;
        }

        yield next;
    });
};