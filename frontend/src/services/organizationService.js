import api from './api';

const organizationService = {
  createOrganization: async (orgData) => {
    const response = await api.post('/organizations', orgData);
    return response.data;
  },

  getOrganizations: async () => {
    const response = await api.get('/organizations');
    return response.data;
  },

  getOrganization: async (orgId) => {
    const response = await api.get(`/organizations/${orgId}`);
    return response.data;
  },

  updateOrganization: async (orgId, updates) => {
    const response = await api.put(`/organizations/${orgId}`, updates);
    return response.data;
  },

  deleteOrganization: async (orgId) => {
    const response = await api.delete(`/organizations/${orgId}`);
    return response.data;
  },

  getMembers: async (orgId) => {
    const response = await api.get(`/organizations/${orgId}/members`);
    return response.data;
  },

  inviteMember: async (orgId, memberData) => {
    const response = await api.post(`/organizations/${orgId}/members`, memberData);
    return response.data;
  },

  updateMember: async (orgId, memberId, updates) => {
    const response = await api.put(`/organizations/${orgId}/members/${memberId}`, updates);
    return response.data;
  },

  removeMember: async (orgId, memberId) => {
    const response = await api.delete(`/organizations/${orgId}/members/${memberId}`);
    return response.data;
  },

  acceptInvitation: async (memberId) => {
    const response = await api.post(`/organizations/invitations/${memberId}/accept`);
    return response.data;
  },

  getOrganizationStats: async (orgId) => {
    const response = await api.get(`/analytics/dashboard`, {
      params: { organization: orgId }
    });
    return response.data;
  }
};

export default organizationService;