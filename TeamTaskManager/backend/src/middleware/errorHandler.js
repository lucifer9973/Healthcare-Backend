const { ApiError } = require('../lib/apiError');

function notFoundHandler(req, res, next) {
  next(new ApiError(404, 'NOT_FOUND', 'Resource not found'));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = statusCode === 500 ? 'Something went wrong' : err.message;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message
    }
  });
}

module.exports = { notFoundHandler, errorHandler };
