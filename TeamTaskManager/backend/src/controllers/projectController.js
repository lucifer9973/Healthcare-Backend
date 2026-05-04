const { z } = require('zod');

const createProjectSchema = z.object({
  name: z.string().trim().min(2, 'Project name is required')
});

const addMembersSchema = z.object({
  user_ids: z.array(z.coerce.number().int().positive()).min(1, 'At least one user id is required')
});

function createProjectController(projectService) {
  return {
    create: async (req, res) => {
      const project = await projectService.createProject({ user: req.user, name: req.body.name });
      res.status(201).json({ data: { project } });
    },

    list: async (req, res) => {
      const projects = await projectService.listProjects(req.user);
      res.status(200).json({ data: { projects } });
    },

    addMembers: async (req, res) => {
      const result = await projectService.addMembers({
        user: req.user,
        projectId: req.params.id,
        userIds: req.body.user_ids
      });
      res.status(200).json({ data: result });
    }
  };
}

module.exports = { createProjectController, createProjectSchema, addMembersSchema };
