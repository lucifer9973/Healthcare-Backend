const { ApiError } = require('../lib/apiError');

const ALLOWED_STATUSES = new Set(['TODO', 'IN_PROGRESS', 'DONE']);

function normalizeStatus(status) {
  return String(status || '').toUpperCase();
}

function createTaskService({ taskRepo, projectRepo, userRepo }) {
  return {
    async createTask({ user, projectId, title, description, assignedTo, dueDate }) {
      if (user.role !== 'admin') {
        throw new ApiError(403, 'FORBIDDEN', 'Only admins can create tasks');
      }

      const project = await projectRepo.getProjectById(projectId);
      if (!project) {
        throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
      }

      if (assignedTo) {
        const assignee = await userRepo.findById(assignedTo);
        if (!assignee) {
          throw new ApiError(400, 'INVALID_ASSIGNEE', 'Assigned user does not exist');
        }

        const isMember = await projectRepo.isProjectMember(projectId, assignedTo);
        if (!isMember) {
          throw new ApiError(400, 'INVALID_ASSIGNEE', 'Assigned user must be a project member');
        }
      }

      return taskRepo.createTask({
        title,
        description,
        status: 'TODO',
        assignedTo: assignedTo || null,
        projectId,
        createdBy: user.id,
        dueDate
      });
    },

    async listTasks(user) {
      return taskRepo.listTasksForUser(user.id, user.role);
    },

    async updateStatus({ user, taskId, status }) {
      const normalizedStatus = normalizeStatus(status);
      if (!ALLOWED_STATUSES.has(normalizedStatus)) {
        throw new ApiError(400, 'INVALID_STATUS', 'Status must be TODO, IN_PROGRESS, or DONE');
      }

      const task = await taskRepo.getTaskById(taskId);
      if (!task) {
        throw new ApiError(404, 'TASK_NOT_FOUND', 'Task not found');
      }

      if (user.role !== 'admin' && Number(task.assigned_to) !== Number(user.id)) {
        throw new ApiError(403, 'FORBIDDEN', 'You can only update your own assigned tasks');
      }

      return taskRepo.updateTaskStatus(taskId, normalizedStatus);
    }
  };
}

module.exports = { createTaskService };
