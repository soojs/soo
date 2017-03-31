const db = require('./../db');
const Article = db.model.Article;
const Tag = db.model.Tag;
const util = require('./../util');

const _ = util._;
const co = util.co;

// add article

module.exports.addArticle = ($article) => {
    return Article.create($article);
};

module.exports.getArticleList = (page, size) => {
    // 排序有Bug

    return Article.findAndCountAll({
        offset: page ? (page - 1) * size : 0,
        limit: size,
        where: {
            status: '1'
        },
        order: 'publish_time DESC',
        // raw: true, //字段扁平化
        include: [{
            model: Tag,

            // 只返回id, name
            attributes: ['id', 'name']
        }]
    });
};

module.exports.getArticleById = (id, readNumberPlusFlag) => {
    return co(function *() {
        // 查询此id的文章是否存在
        let article = yield Article.findById(id);

        if (article && readNumberPlusFlag) {
            yield article.update({read_num: article.read_num + 1});
        }

        return article;
    });
};


module.exports.updateArticle = (id, $article) => {
    return co(function *() {
        let newArticle = Article.build($article);
        let validateError = yield newArticle.validate();

        // 修改时，参数校验
        if (validateError) {
            throw validateError;
        }

        // 查询此id的文章是否存在
        let article = yield Article.findById(id);

        // 只能修改标题和内容,标签
        if (article) {
            // 修改标签使用方法
            if ($article.tags) {
                yield article.setTags(JSON.parse($article.tags));
            }

            return yield article.update({
                title: $article.title,
                brief: $article.brief,
                content: $article.content
            });
        }

        // 文章不存在，抛出错误
        return null;
    });
};

module.exports.deleteArticle = (id) => {
    return co(function *() {
        let article = yield Article.findById(id);

        if (article) {
            // 注意值类型
            return yield article.update({status: '2'});
        }

        return null;
    });
};

