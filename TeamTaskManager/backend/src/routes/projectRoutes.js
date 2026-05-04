const { Router } = require('express');
const { validate } = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../lib/asyncHandler');
const { createProjectSchema, addMembersSchema } = require('../controllers/projectController');

function createProjectRoutes(projectController) {
  const router = Router();

  router.get('/', authenticate, asyncHandler(projectController.list));
  router.post('/', authenticate, requireRole('admin'), validate(createProjectSchema), asyncHandler(projectController.create));
  router.post('/:id/members', authenticate, requireRole('admin'), validate(addMembersSchema), asyncHandler(projectController.addMembers));

  return router;
}

module.exports = { createProjectRoutes };
