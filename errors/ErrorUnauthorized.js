const { ERROR_UNAUTHORIZED } = require('./errors');

class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_UNAUTHORIZED;
  }
}

module.exports = ErrorUnauthorized;
