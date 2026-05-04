const { z } = require('zod');

const createTaskSchema = z.object({
  project_id: z.coerce.number().int().positive(),
  title: z.string().trim().min(2, 'Task title is required'),
  description: z.string().trim().default(''),
  assigned_to: z.coerce.number().int().positive().optional(),
  due_date: z.string().nullable().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'])
});

function createTaskController(taskService) {
  return {
    create: async (req, res) => {
      const task = await taskService.createTask({
        user: req.user,
        projectId: req.body.project_id,
        title: req.body.title,
        description: req.body.description,
        assignedTo: req.body.assigned_to,
        dueDate: req.body.due_date
      });
      res.status(201).json({ data: { task } });
    },

    list: async (req, res) => {
      const tasks = await taskService.listTasks(req.user);
      res.status(200).json({ data: { tasks } });
    },

    updateStatus: async (req, res) => {
      const task = await taskService.updateStatus({
        user: req.user,
        taskId: req.params.id,
        status: req.body.status
      });
      res.status(200).json({ data: { task } });
    }
  };
}

module.exports = { createTaskController, createTaskSchema, updateStatusSchema };
