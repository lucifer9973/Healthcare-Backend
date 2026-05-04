const { Router } = require('express');
const { createAuthController } = require('../controllers/authController');
const { createProjectController } = require('../controllers/projectController');
const { createTaskController } = require('../controllers/taskController');
const { createDashboardController } = require('../controllers/dashboardController');
const { createAuthRoutes } = require('./authRoutes');
const { createProjectRoutes } = require('./projectRoutes');
const { createTaskRoutes } = require('./taskRoutes');
const { createDashboardRoutes } = require('./dashboardRoutes');

function createApiRouter(services) {
  const router = Router();
  const authController = createAuthController(services.auth);
  const projectController = createProjectController(services.projects);
  const taskController = createTaskController(services.tasks);
  const dashboardController = createDashboardController(services.dashboard);

  router.use('/auth', createAuthRoutes(authController));
  router.use('/projects', createProjectRoutes(projectController));
  router.use('/tasks', createTaskRoutes(taskController));
  router.use('/dashboard', createDashboardRoutes(dashboardController));

  return router;
}

module.exports = { createApiRouter };
