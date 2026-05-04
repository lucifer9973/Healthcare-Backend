function createDashboardService({ taskRepo }) {
  return {
    async getDashboard(user) {
      const summary = await taskRepo.getDashboardStats(user.id, user.role);
      return {
        totalTasks: Number(summary.total_tasks || 0),
        completedTasks: Number(summary.completed_tasks || 0),
        overdueTasks: Number(summary.overdue_tasks || 0)
      };
    }
  };
}

module.exports = { createDashboardService };
