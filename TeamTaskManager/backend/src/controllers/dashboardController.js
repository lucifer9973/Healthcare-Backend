function createDashboardController(dashboardService) {
  return {
    get: async (req, res) => {
      const summary = await dashboardService.getDashboard(req.user);
      res.status(200).json({ data: { summary } });
    }
  };
}

module.exports = { createDashboardController };
