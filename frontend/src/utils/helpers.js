import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getInitials = (name) => {
  if (!name) return '?';

  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];

  if (!name) return colors[0];

  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);

  return colors[hash % colors.length];
};

export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

export const isValidEmail = (email) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];

    if (!result[group]) {
      result[group] = [];
    }

    result[group].push(item);
    return result;
  }, {});
};

export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const hasPermission = (userRole, requiredRoles) => {
  const roleHierarchy = {
    owner: 5,
    admin: 4,
    project_manager: 3,
    member: 2,
    guest: 1
  };

  return requiredRoles.some((role) => roleHierarchy[userRole] >= roleHierarchy[role]);
};

export const canManageOrganization = (role) =>
  ['owner', 'admin'].includes(role);

export const canManageProjects = (role) =>
  ['owner', 'admin', 'project_manager'].includes(role);

export const canDeleteProjects = (role) =>
  ['owner', 'admin'].includes(role);

export const canManageProjectMembers = (role) =>
  ['owner', 'admin', 'project_manager'].includes(role);

export const canCreateTasks = (role) =>
  ['owner', 'admin', 'project_manager', 'member'].includes(role);

export const canUpdateTasks = (role) =>
  ['owner', 'admin', 'project_manager', 'member'].includes(role);

export const canDeleteTasks = (role) =>
  ['owner', 'admin', 'project_manager'].includes(role);

export const canComment = (role) =>
  ['owner', 'admin', 'project_manager', 'member', 'guest'].includes(role);

export const canViewReports = (role) =>
  ['owner', 'admin', 'project_manager'].includes(role);

export const canAccessSettings = (role) =>
  ['owner', 'admin'].includes(role);