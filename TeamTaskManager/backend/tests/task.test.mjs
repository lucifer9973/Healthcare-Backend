import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';

const require = createRequire(import.meta.url);
const { createTaskService } = require('../src/services/taskService');

describe('task service', () => {
  it('creates an assigned task for an admin', async () => {
    const taskService = createTaskService({
      taskRepo: {
        createTask: async (task) => ({ id: 11, ...task }),
        getTaskById: async () => ({ id: 11, assigned_to: 2 }),
        updateTaskStatus: async (id, status) => ({ id, status })
      },
      projectRepo: {
        getProjectById: async () => ({ id: 7 }),
        isProjectMember: async () => true
      },
      userRepo: {
        findById: async () => ({ id: 2 })
      }
    });

    const task = await taskService.createTask({
      user: { id: 1, role: 'admin' },
      projectId: 7,
      title: 'Ship release',
      description: 'Finish release checklist',
      assignedTo: 2,
      dueDate: '2026-06-01'
    });

    expect(task.title).toBe('Ship release');
    expect(task.status).toBe('TODO');
    expect(task.assignedTo).toBe(2);
  });
});