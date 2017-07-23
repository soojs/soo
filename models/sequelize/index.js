const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const cls = require('continuation-local-storage')
const namespace = cls.createNamespace('fx-blog')

Sequelize.cls = namespace

const config = require('../../config')

console.log('database=%s, username=%s, password=%s', config.db_database, config.db_username, config.db_password)

const client = new Sequelize(config.db_database, config.db_username, config.db_password, {
    host: config.db_host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})

const entities = {}

fs
    .readdirSync(__dirname + '/entity')
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach((file) => {
        let model = client.import(path.join(__dirname + '/entity', file))
        entities[model.name] = model
    })

// Object.keys(entities).forEach((modelName) => {
//     if (entities[modelName].options.hasOwnProperty('associate')) {
//         entities[modelName].options.associate(entities)
//     }
// })

module.exports = entities
module.exports.client = client
