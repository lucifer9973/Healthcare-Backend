const jwt = require('jsonwebtoken');
const { ApiError } = require('../lib/apiError');
const { loadEnv } = require('../config/env');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'Missing access token'));
  }

  try {
    const env = loadEnv();
    req.user = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch (error) {
    next(new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired access token'));
  }
}

function requireRole(...roles) {
  return function requireRoleMiddleware(req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, 'UNAUTHORIZED', 'Missing authenticated user'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not have access to this resource'));
    }

    next();
  };
}

module.exports = { authenticate, requireRole };
