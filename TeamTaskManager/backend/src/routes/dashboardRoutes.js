const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../lib/asyncHandler');

function createDashboardRoutes(dashboardController) {
  const router = Router();

  router.get('/', authenticate, asyncHandler(dashboardController.get));

  return router;
}

module.exports = { createDashboardRoutes };
