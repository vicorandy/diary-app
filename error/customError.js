class customError extends Error {
  constructor(message) {
    const msg = message;
    super(msg);
  }
}

module.exports = customError;
