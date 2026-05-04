import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';

const require = createRequire(import.meta.url);
const { createProjectService } = require('../src/services/projectService');

describe('rbac', () => {
  it('blocks members from creating projects', async () => {
    const projectService = createProjectService({
      projectRepo: {
        createProject: async () => ({ id: 1 }),
        addProjectMembers: async () => [],
        listProjectsForUser: async () => [],
        listProjectMembers: async () => [],
        getProjectById: async () => null
      },
      userRepo: {
        findById: async () => null,
        findManyByIds: async () => []
      }
    });

    await expect(
      projectService.createProject({
        user: { id: 2, role: 'member' },
        name: 'Blocked project'
      })
    ).rejects.toMatchObject({ statusCode: 403, code: 'FORBIDDEN' });
  });
});