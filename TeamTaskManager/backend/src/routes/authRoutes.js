const { Router } = require('express');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../lib/asyncHandler');
const { signupSchema, loginSchema } = require('../controllers/authController');

function createAuthRoutes(authController) {
  const router = Router();

  router.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
  router.post('/login', validate(loginSchema), asyncHandler(authController.login));
  router.get('/me', authenticate, asyncHandler(authController.me));

  return router;
}

module.exports = { createAuthRoutes };
