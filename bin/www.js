#!/usr/bin/env node

const http = require('http')
const app = require('../app')

const port = process.env.PORT || '8888'
const httpServer = http.createServer(app.callback())

httpServer.on('error', onError)
httpServer.on('listening', onListening)
httpServer.listen(port)

/**
 * Event listener for HTTP server "error" event.
 */
function onError(err) {
    if (err.syscall !== 'listen') {
        throw err
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (err.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw err
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = httpServer.address()
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    console.info('Listening on ' + bind)
}
