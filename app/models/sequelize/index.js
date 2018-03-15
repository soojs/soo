const debug = require('debug')('bee-blog:model');
const fs = require('fs');
const path = require('path');
const config = require('config');
const Sequelize = require('sequelize');
const cls = require('continuation-local-storage');

const namespace = cls.createNamespace('bee-blog');
Sequelize.useCLS(namespace);

const dbConfig = config.get('db');
debug('Connecting to database: host=%s, database=%s', dbConfig.host, dbConfig.database);

const client = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  dialectOptions: {
    useUTC: false,
  },
  timezone: '+08:00',
  dialect: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    idle: dbConfig.pool.idle,
  },
  operatorsAliases: false,
});

const entities = {};
const dir = path.join(__dirname, '/entity');

fs.readdirSync(dir)
  .filter((file) => {
    const passed = file.indexOf('.') !== 0 && file !== 'index.js';
    return passed;
  })
  .forEach((file) => {
    const model = client.import(path.join(dir, file));
    entities[model.name] = model;
  });

Object.keys(entities).forEach((modelName) => {
  if (Object.prototype.hasOwnProperty.call(entities[modelName], 'associate')) {
    entities[modelName].associate(entities);
  }
});

module.exports = entities;
module.exports.client = client;
