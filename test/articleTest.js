const co = require('co')
const services = require('../services')

function *testCreateArticle () {
    let article =  {
        title: 'test',
        content: 'this is a test',
        createBy: 'linh'
    }
    try {
        let result = yield services.ArticleService.createArticle(article)
        console.log(result)
    } catch (e) {
        console.log(e)
    }
}

function *testGetAritcleById () {
    let articleId = 1492696128

    try {
        let result = yield services.ArticleService.getArticleById(articleId)
        console.log(result)
    } catch (e) {
        console.log(e)
    }
}

function *testGetArticles () {
    try {
        let result = yield services.ArticleService.getArticles({limit: 10, offset: 0})
        console.log(result.count)
        console.log(result.rows)
    } catch (e) {
        console.log(e)
    }
}

co(testGetArticles)