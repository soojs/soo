const co = require('co')
const services = require('../services')

function *testCreateArticle() {
    let article =  {
        title: 'test',
        content: 'this is a test',
        createBy: 'linh'
    }
    try {
        let result = yield services.ArticleService.createArticle3(article)
        console.log(result.get({ plain: true }))
    } catch (e) {
        console.log(e)
    }
}

co(testCreateArticle)