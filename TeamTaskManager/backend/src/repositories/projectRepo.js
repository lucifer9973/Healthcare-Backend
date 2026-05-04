function createProjectRepository(db) {
  return {
    async createProject({ name, createdBy }) {
      const result = await db.query(
        'INSERT INTO projects (name, created_by) VALUES ($1, $2) RETURNING id, name, created_by, created_at, updated_at',
        [name, createdBy]
      );

      return result.rows[0];
    },

    async getProjectById(id) {
      const result = await db.query(
        'SELECT id, name, created_by, created_at, updated_at FROM projects WHERE id = $1',
        [id]
      );

      return result.rows[0] || null;
    },

    async listProjectsForUser(userId) {
      const result = await db.query(
        `SELECT DISTINCT p.id, p.name, p.created_by, p.created_at, p.updated_at
         FROM projects p
         LEFT JOIN project_members pm ON pm.project_id = p.id
         WHERE p.created_by = $1 OR pm.user_id = $1
         ORDER BY p.created_at DESC`,
        [userId]
      );

      return result.rows;
    },

    async addProjectMembers(projectId, userIds) {
      if (!userIds.length) {
        return [];
      }

      const inserted = [];
      for (const userId of userIds) {
        const result = await db.query(
          'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING project_id, user_id, created_at',
          [projectId, userId]
        );
        if (result.rows[0]) {
          inserted.push(result.rows[0]);
        }
      }

      return inserted;
    },

    async isProjectMember(projectId, userId) {
      const result = await db.query(
        'SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2',
        [projectId, userId]
      );
      return Boolean(result.rows[0]);
    },

    async listProjectMembers(projectId) {
      const result = await db.query(
        `SELECT u.id, u.name, u.email, u.role
         FROM project_members pm
         JOIN users u ON u.id = pm.user_id
         WHERE pm.project_id = $1
         ORDER BY u.name ASC`,
        [projectId]
      );

      return result.rows;
    }
  };
}

module.exports = { createProjectRepository };
