const fs = require('fs')
const path = require('path')
const config = require('config')
const Sequelize = require('sequelize')
const cls = require('continuation-local-storage')
const namespace = cls.createNamespace('bee-blog')

Sequelize.useCLS(namespace)

const dbConfig = config.get('db')
console.log('host=%s, database=%s', dbConfig.host, dbConfig.database)

const client = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        idle: dbConfig.pool.idle
    },
    operatorsAliases: false
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
