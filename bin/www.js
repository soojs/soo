#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const log4js = require('log4js');

/**
 * make a log directory, just in case it isn't there.
 */
try {
  fs.mkdirSync('./log');
} catch (e) {
  if (e.code !== 'EEXIST') {
    // eslint-disable-next-line no-console
    console.error('Could not set up log directory, ', e);
    process.exit(1);
  }
}

/**
 * Initialise log4js first, so we don't miss any log messages
 */
log4js.configure('./config/log4js.json');

const log = log4js.getLogger('startup');
const port = process.env.PORT;
const httpServer = http.createServer(require('../app/app').callback());

/**
 * Event listener for HTTP server "error" event.
 */
function onError(err) {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      log.info(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.info(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      log.info('unknown err', err);
      process.exit(1);
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === 'string'
    ? `Pipe ${addr}`
    : `Port ${addr.port}`;
  log.info('Server listening on port ', bind, ' with pid ', process.pid);
  // send the ready signal to PM2
  // process.send('ready');
}

httpServer.on('error', onError);
httpServer.on('listening', onListening);
httpServer.listen(port);

module.exports = httpServer;
