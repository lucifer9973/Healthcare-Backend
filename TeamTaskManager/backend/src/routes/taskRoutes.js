const { Router } = require('express');
const { validate } = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../lib/asyncHandler');
const { createTaskSchema, updateStatusSchema } = require('../controllers/taskController');

function createTaskRoutes(taskController) {
  const router = Router();

  router.get('/', authenticate, asyncHandler(taskController.list));
  router.post('/', authenticate, requireRole('admin'), validate(createTaskSchema), asyncHandler(taskController.create));
  router.patch('/:id/status', authenticate, validate(updateStatusSchema), asyncHandler(taskController.updateStatus));

  return router;
}

module.exports = { createTaskRoutes };
