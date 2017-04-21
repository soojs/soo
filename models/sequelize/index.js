const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

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

const models = {}

fs
    .readdirSync(__dirname + '/models')
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach((file) => {
        let model = client.import(path.join(__dirname + '/models', file))
        models[model.name] = model
    })

Object.keys(models).forEach((modelName) => {
    if (models[modelName].options.hasOwnProperty('associate')) {
        models[modelName].options.associate(models)
    }
})

module.exports = models
module.exports.client = client
