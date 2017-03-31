function ResError(msg) {
    this.message = msg || 'Error';
    Error.captureStackTrace(this);
}

ResError.prototype = Error.prototype;
ResError.prototype.name = 'ResError';

module.exports = ResError;