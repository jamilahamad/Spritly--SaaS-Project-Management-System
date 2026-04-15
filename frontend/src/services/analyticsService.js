import api from './api';

const analyticsService = {
  getDashboardAnalytics: async (organizationId) => {
    const response = await api.get('/analytics/dashboard', {
      params: { organization: organizationId }
    });
    return response.data;
  },

  getProjectAnalytics: async (projectId) => {
    const response = await api.get(`/analytics/projects/${projectId}`);
    return response.data;
  },

  getTeamAnalytics: async (organizationId) => {
    const response = await api.get('/analytics/team', {
      params: { organization: organizationId }
    });
    return response.data;
  }
};

export default analyticsService;