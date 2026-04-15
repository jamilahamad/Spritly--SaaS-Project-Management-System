import api from './api';

const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerificationEmail: async (email) => {
    const response = await api.post('/auth/resend-verification-email', { email });
    return response.data;
  },

  // Get invitation details
  getInvitationDetails: async (token) => {
    const response = await api.get(`/auth/invitations/${token}`);
    return response.data;
  },

  // Accept invitation by token
  acceptInvitationByToken: async (token) => {
    const response = await api.post(`/auth/invitations/${token}/accept`);
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentOrganization');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/update-profile', userData);

    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }

    return response.data;
  },

  // Update password
  updatePassword: async (passwords) => {
    const response = await api.put('/auth/update-password', passwords);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Delete my account
  deleteMyAccount: async () => {
    const response = await api.delete('/auth/me');
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.put('/auth/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data?.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  },

  // Remove profile image
  removeProfileImage: async () => {
    const response = await api.delete('/auth/profile/image');

    if (response.data?.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }

    return response.data;
  },

  // Get token
  getToken: () => localStorage.getItem('token'),

  // Check auth
  isAuthenticated: () => !!localStorage.getItem('token')
};

export default authService;