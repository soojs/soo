const superagent = require('supertest');
const app = require('../app');
const should = require('should');
const config = require('../config');
const cgiCode = config.cgiCode;
const co = require('co');
const Util = require('../util');

const db = require('../db');
const Article = db.model.Article;


function request() {
    return superagent(app.listen());
}

before(function() {

});

after(function() {

});

describe('文章CGI测试', function (done) {
    var articleCreateSuc = { title: '文章标题', content: '文章内容'};


    describe('创建文章 POST /article', function (done) {
        it('返回参数错误，缺少文章名称', function (done) {
            var article = {desc : 'this is a article desc'};

            request()
                .put('/article')
                .send(article)
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    var text = res.text;
                    var json = JSON.parse(text);

                    should(json.retcode).be.a.Number().equal(cgiCode.ARGS_ERROR.retcode);
                    should(json.type).be.a.String().equal(cgiCode.ARGS_ERROR.type);
                    should(/title/.test(json.desc)).equal(true);

                    done();
                });
        });

        it('创建文章成功', function (done) {

            request()
                .put('/article')
                .send(articleCreateSuc)
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    var text = res.text;
                    var json = JSON.parse(text);

                    should(json.retcode).be.a.Number().equal(cgiCode.SUCCESS.retcode);
                    should(json.result.article.title).equal(articleCreateSuc.title);

                    done();
                });
        });
    });

    describe('更新文章 PATCH /article/:id', (done) => {
        let newArticle = {
            title: '我是新文章',
            content: '我是新文章内容'
        };
        before(function() {
            Article.create({
                title: '我是用于测试更新操作的文章',
                content: '我是文章的内容'
            });
        });

        it('文章不存在，更新文章失败', (done) => {
            request()
                .patch('/article/-1')
                .send(newArticle)
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    let text = res.text;
                    let json = JSON.parse(text);

                    should(json.retcode).be.a.Number().equal(cgiCode.ARTICLE_NOT_EXIST.retcode);
                    should(json.type).be.a.String().equal(cgiCode.ARTICLE_NOT_EXIST.type);

                    done();
                });
        });

        it('更新失败，缺少参数', function (done){
            let newArticle2 = {
                title: '我是一个没有内容的文章'
            };

            Article.findOne({
                where: {
                    id: {
                        $gt: 0
                    }
                }
            }).then(function (ret) {
                ret = ret.toJSON();

                request()
                    .patch('/article/'+ret.id)
                    .send(newArticle2)
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        let text = res.text;
                        let json = JSON.parse(text);

                        should(json.retcode).be.a.Number().equal(cgiCode.ARGS_ERROR.retcode);
                        should(json.type).be.a.String().equal(cgiCode.ARGS_ERROR.type);

                        done();
                    });
            });

        });

        it('更新成功', (done) => {
            setTimeout(function () {
                Article.findOne({
                    where: {
                        title: {
                            $like: '%我是用于测试更新操作的文章'
                        }
                    }
                }).then(function (ret) {
                    ret = ret.toJSON();

                    request()
                        .patch('/article/'+ret.id)
                        .send(newArticle)
                        .expect(200)
                        .end(function(err, res){
                            if (err) return done(err);
                            let text = res.text;
                            let json = JSON.parse(text);

                            should(json.retcode).be.a.Number().equal(cgiCode.SUCCESS.retcode);
                            should(json.type).be.a.String().equal(cgiCode.SUCCESS.type);

                            done();
                        });
                });
            }, 1000);
        });
    });

    describe('删除文章 DELETE /article/:id', (done) => {

        it('文章不存在，删除文章失败', (done) => {
            request()
                .delete('/article/-1')
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    let text = res.text;
                    let json = JSON.parse(text);

                    should(json.retcode).be.a.Number().equal(cgiCode.ARTICLE_NOT_EXIST.retcode);
                    should(json.type).be.a.String().equal(cgiCode.ARTICLE_NOT_EXIST.type);

                    done();
                });
        });

        it('删除文章成功', (done) => {
            Article.findOne({
                where: {
                    id: {
                        $gt: 2
                    }
                }
            }).then(function (ret) {
                ret = ret.toJSON();

                request()
                    .delete('/article/'+ret.id)
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        let text = res.text;
                        let json = JSON.parse(text);

                        should(json.retcode).be.a.Number().equal(cgiCode.SUCCESS.retcode);
                        should(json.type).be.a.String().equal(cgiCode.SUCCESS.type);

                        done();
                    });
            });

        });
    });

    describe('分页查询文章 GET /article/:page/:size', (done) => {
        this.timeout(8000);

        // 先保证至少有100条数据
        before(function() {
            let articleList = [], len = 100, baseArticle = {
                title: '我是批量创建的文章',
                content: '我是批量创建文章的内容'
            }, temp;

            while(len--) {
                temp = Object.assign({}, baseArticle);
                temp.title += len;
                temp.content += len;
                articleList.push(temp);
            }

            Article.bulkCreate(articleList);
        });

        it('页码不对', function(done) {
            // 延迟4秒，让数据准备好
            setTimeout(function () {
                request()
                    .get('/article/-1/10')
                    .expect(200)
                    .end(function(err, res){
                        if (err) return done(err);
                        let text = res.text;
                        let json = JSON.parse(text);

                        should(json.retcode).be.a.Number().equal(cgiCode.ARGS_ERROR.retcode);
                        should(json.type).be.a.String().equal(cgiCode.ARGS_ERROR.type);

                        done();
                    });
            }, 1000);
        });

        it('一页有10条数据', function(done) {
            request()
                .get('/article/0/10')
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    let text = res.text;
                    let json = JSON.parse(text);

                    should(json.retcode).be.a.Number().equal(cgiCode.SUCCESS.retcode);
                    should(json.result.list.length).equal(10);

                    done();
                });
        });

        it('一页有20条数据', function(done) {
            request()
                .get('/article/0/20')
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    let text = res.text;
                    let json = JSON.parse(text);

                    should(json.retcode).be.a.Number().equal(cgiCode.SUCCESS.retcode);
                    should(json.result.list.length).equal(20);

                    done();
                });
        });

    });
});