const { createAuthService } = require('./authService');
const { createProjectService } = require('./projectService');
const { createTaskService } = require('./taskService');
const { createDashboardService } = require('./dashboardService');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

function createServices({ repos }) {
  return {
    auth: createAuthService({
      userRepo: repos.users,
      hashPassword,
      comparePassword,
      signToken
    }),
    projects: createProjectService({
      projectRepo: repos.projects,
      userRepo: repos.users
    }),
    tasks: createTaskService({
      taskRepo: repos.tasks,
      projectRepo: repos.projects,
      userRepo: repos.users
    }),
    dashboard: createDashboardService({
      taskRepo: repos.tasks
    })
  };
}

module.exports = { createServices };
