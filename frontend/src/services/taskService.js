// src/services/taskService.js
import api from './api';

const taskService = {
  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Get all tasks
  getTasks: async (filters = {}) => {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  },

  // Get single task
  getTask: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  // Assign task
  assignTask: async (taskId, assignee) => {
    const response = await api.patch(`/tasks/${taskId}/assign`, { assignee });
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Add comment
  addComment: async (taskId, content, mentions = []) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content, mentions });
    return response.data;
  },

  // Get comments
  getComments: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  // Add subtask
  addSubtask: async (taskId, title) => {
    const response = await api.post(`/tasks/${taskId}/subtasks`, { title });
    return response.data;
  },

  // Toggle subtask
  toggleSubtask: async (taskId, subtaskId) => {
    const response = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data;
  }
};

export default taskService;