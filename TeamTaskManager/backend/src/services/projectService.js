const { ApiError } = require('../lib/apiError');

function createProjectService({ projectRepo, userRepo }) {
  return {
    async createProject({ user, name }) {
      if (user.role !== 'admin') {
        throw new ApiError(403, 'FORBIDDEN', 'Only admins can create projects');
      }

      const project = await projectRepo.createProject({ name, createdBy: user.id });
      await projectRepo.addProjectMembers(project.id, [user.id]);
      return project;
    },

    async listProjects(user) {
      const projects = await projectRepo.listProjectsForUser(user.id);
      return Promise.all(
        projects.map(async (project) => ({
          ...project,
          members: await projectRepo.listProjectMembers(project.id)
        }))
      );
    },

    async addMembers({ user, projectId, userIds }) {
      if (user.role !== 'admin') {
        throw new ApiError(403, 'FORBIDDEN', 'Only admins can add project members');
      }

      const project = await projectRepo.getProjectById(projectId);
      if (!project) {
        throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
      }

      const uniqueIds = [...new Set(userIds.map(Number))].filter(Boolean);
      const users = await userRepo.findManyByIds(uniqueIds);
      if (users.length !== uniqueIds.length) {
        throw new ApiError(400, 'INVALID_MEMBER', 'One or more members do not exist');
      }

      const members = await projectRepo.addProjectMembers(projectId, uniqueIds);
      return { project, members };
    }
  };
}

module.exports = { createProjectService };
