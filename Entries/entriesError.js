const { StatusCodes } = require('http-status-codes');

class InvalidIdError extends Error {
  constructor(message) {
    const msg = message;
    super(msg);
    this.StatusCodes = StatusCodes.BAD_REQUEST;
  }
}

module.exports = { InvalidIdError };
