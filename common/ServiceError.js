class ServiceError extends Error {
    constructor (code = 500, message = '') {
        super(message)
        this.code = code
        this.message = message
    }
}

module.exports = ServiceError