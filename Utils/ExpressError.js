class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = "error";
    this.isOperational = true; // This helps differentiate between operational errors and programming bugs.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ExpressError;