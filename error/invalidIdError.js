const { StatusCodes } = require('http-status-codes');
const customError = require('./customError');

class InvalidIdError extends customError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = InvalidIdError;
