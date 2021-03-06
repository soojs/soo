const fs = require('fs');
const path = require('path');
const config = require('config');
const log4js = require('log4js');
const Sequelize = require('sequelize');
const cls = require('cls-hooked'); // cannot use cls, because have problem when using async/await

const namespace = cls.createNamespace('soo-blog');
Sequelize.useCLS(namespace);

const log = log4js.getLogger('startup');
const dbConfig = config.get('db');
if (dbConfig.logging === undefined && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  dbConfig.logging = console.log;
}
log.info('Connecting to database: host=%s, database=%s', dbConfig.host, dbConfig.database);

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
  logging: dbConfig.logging,
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
    log.debug('import model %s', model.name);
    entities[model.name] = model;
  });

Object.keys(entities).forEach((modelName) => {
  if (Object.prototype.hasOwnProperty.call(entities[modelName], 'associate')) {
    entities[modelName].associate(entities);
  }
});

module.exports = entities;
module.exports.client = client;
