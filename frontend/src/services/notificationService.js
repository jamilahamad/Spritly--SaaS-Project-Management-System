// src/services/notificationService.js
import api from './api';

const notificationService = {
  // Get notifications
  getNotifications: async (read = undefined, limit = 50) => {
    const params = { limit };
    if (read !== undefined) params.read = read;
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Clear read notifications
  clearReadNotifications: async () => {
    const response = await api.delete('/notifications/clear-read');
    return response.data;
  }
};

export default notificationService;