function createTaskRepository(db) {
  return {
    async createTask({ title, description, status, assignedTo, projectId, createdBy, dueDate }) {
      const result = await db.query(
        `INSERT INTO tasks (title, description, status, assigned_to, project_id, created_by, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, title, description, status, assigned_to, project_id, created_by, due_date, created_at, updated_at`,
        [title, description, status, assignedTo, projectId, createdBy, dueDate || null]
      );

      return result.rows[0];
    },

    async getTaskById(id) {
      const result = await db.query(
        `SELECT t.id, t.title, t.description, t.status, t.assigned_to, t.project_id, t.created_by, t.due_date, t.created_at, t.updated_at,
                p.name AS project_name, u.name AS assigned_name, c.name AS creator_name
         FROM tasks t
         JOIN projects p ON p.id = t.project_id
         JOIN users c ON c.id = t.created_by
         LEFT JOIN users u ON u.id = t.assigned_to
         WHERE t.id = $1`,
        [id]
      );

      return result.rows[0] || null;
    },

    async listTasksForUser(userId, role) {
      const result = await db.query(
        `SELECT DISTINCT t.id, t.title, t.description, t.status, t.assigned_to, t.project_id, t.created_by, t.due_date, t.created_at, t.updated_at,
                p.name AS project_name, u.name AS assigned_name, c.name AS creator_name
         FROM tasks t
         JOIN projects p ON p.id = t.project_id
         JOIN users c ON c.id = t.created_by
         LEFT JOIN users u ON u.id = t.assigned_to
         LEFT JOIN project_members pm ON pm.project_id = p.id
         WHERE ($1 = 'admin' AND (p.created_by = $2 OR pm.user_id = $2))
            OR ($1 = 'member' AND t.assigned_to = $2)
         ORDER BY t.created_at DESC`,
        [role, userId]
      );

      return result.rows;
    },

    async updateTaskStatus(taskId, status) {
      const result = await db.query(
        'UPDATE tasks SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING id, title, description, status, assigned_to, project_id, created_by, due_date, created_at, updated_at',
        [taskId, status]
      );

      return result.rows[0] || null;
    },

    async getDashboardStats(userId, role) {
      const result = await db.query(
        `SELECT
           COUNT(*)::int AS total_tasks,
           COUNT(*) FILTER (WHERE t.status = 'DONE')::int AS completed_tasks,
           COUNT(*) FILTER (WHERE t.due_date IS NOT NULL AND t.due_date < CURRENT_DATE AND t.status <> 'DONE')::int AS overdue_tasks
         FROM tasks t
         JOIN projects p ON p.id = t.project_id
         LEFT JOIN project_members pm ON pm.project_id = p.id
         WHERE ($1 = 'admin' AND (p.created_by = $2 OR pm.user_id = $2))
            OR ($1 = 'member' AND t.assigned_to = $2)`,
        [role, userId]
      );

      return result.rows[0];
    }
  };
}

module.exports = { createTaskRepository };
