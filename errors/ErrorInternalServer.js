const { ERROR_INTERNAL_SERVER } = require('./errors');

class ErrorInternalServer extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_INTERNAL_SERVER;
  }
}

module.exports = ErrorInternalServer;
