// src/utils/constants.js

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'];

export const TASK_PRIORITIES = {
  low: { label: 'Low', color: 'text-green-600 bg-green-100', icon: '↓' },
  medium: { label: 'Medium', color: 'text-yellow-600 bg-yellow-100', icon: '=' },
  high: { label: 'High', color: 'text-orange-600 bg-orange-100', icon: '↑' },
  urgent: { label: 'Urgent', color: 'text-red-600 bg-red-100', icon: '⚠' }
};

export const TASK_TYPES = {
  task: { label: 'Task', color: 'text-blue-600 bg-blue-100', icon: '📋' },
  bug: { label: 'Bug', color: 'text-red-600 bg-red-100', icon: '🐛' },
  story: { label: 'Story', color: 'text-green-600 bg-green-100', icon: '📖' },
  epic: { label: 'Epic', color: 'text-purple-600 bg-purple-100', icon: '⚡' }
};

export const USER_ROLES = {
  owner: { label: 'Owner', color: 'text-purple-600 bg-purple-100' },
  admin: { label: 'Admin', color: 'text-blue-600 bg-blue-100' },
  project_manager: { label: 'Project Manager', color: 'text-green-600 bg-green-100' },
  member: { label: 'Member', color: 'text-gray-600 bg-gray-100' },
  guest: { label: 'Guest', color: 'text-orange-600 bg-orange-100' }
};

export const PROJECT_STATUS = {
  active: { label: 'Active', color: 'text-green-600 bg-green-100' },
  archived: { label: 'Archived', color: 'text-gray-600 bg-gray-100' },
  completed: { label: 'Completed', color: 'text-blue-600 bg-blue-100' }
};