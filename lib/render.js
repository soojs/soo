const path = require('path')
const views = require('co-views')

module.exports = views(path.join(__dirname, '/../views'), {
    map: {
        html: 'swig'
    }
})
