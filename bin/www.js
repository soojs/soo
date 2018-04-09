#!/usr/bin/env node

const debug = require('debug')('bee-blog:www');
const http = require('http');
const app = require('../app/app');

const port = process.env.PORT;
const httpServer = http.createServer(app.callback());

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
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
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
  debug(`Listening on ${bind}`);
  // send the ready signal to PM2
  // process.send('ready');
}

httpServer.on('error', onError);
httpServer.on('listening', onListening);
httpServer.listen(port);

module.exports = httpServer;
