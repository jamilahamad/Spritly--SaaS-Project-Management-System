const Member = require('../models/Member');
const Project = require('../models/Project');
const Task = require('../models/Task');

const roleHierarchy = {
  owner: 5,
  admin: 4,
  project_manager: 3,
  member: 2,
  guest: 1
};

const buildError = (message, statusCode = 403) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const hasRequiredRole = (currentRole, allowedRoles = []) => {
  if (!allowedRoles.length) return true;

  return allowedRoles.some((role) => {
    return (roleHierarchy[currentRole] || 0) >= (roleHierarchy[role] || 0);
  });
};

const getActiveMembership = async (userId, organizationId) => {
  return Member.findOne({
    user: userId,
    organization: organizationId,
    status: 'active'
  });
};

const requireOrganizationAccess = async (userId, organizationId, allowedRoles = []) => {
  const membership = await getActiveMembership(userId, organizationId);

  if (!membership) {
    throw buildError('You do not have access to this organization', 403);
  }

  if (!hasRequiredRole(membership.role, allowedRoles)) {
    throw buildError('You do not have permission to perform this action', 403);
  }

  return membership;
};

const requireProjectAccess = async (projectId, userId, allowedRoles = []) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw buildError('Project not found', 404);
  }

  const membership = await requireOrganizationAccess(userId, project.organization, allowedRoles);

  return { project, membership };
};

const requireTaskAccess = async (taskId, userId, allowedRoles = []) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw buildError('Task not found', 404);
  }

  const membership = await requireOrganizationAccess(userId, task.organization, allowedRoles);

  return { task, membership };
};

const validateUsersBelongToOrganization = async (organizationId, userIds = []) => {
  const normalizedIds = [...new Set(userIds.filter(Boolean).map((id) => id.toString()))];

  if (!normalizedIds.length) {
    return [];
  }

  const memberships = await Member.find({
    organization: organizationId,
    user: { $in: normalizedIds },
    status: 'active'
  }).select('user');

  const validUserIds = memberships.map((m) => m.user.toString());
  const missingUserIds = normalizedIds.filter((id) => !validUserIds.includes(id));

  if (missingUserIds.length) {
    throw buildError('One or more selected users are not active members of this organization', 400);
  }

  return normalizedIds;
};

// RBAC helpers
const canManageOrganization = (role) => ['owner', 'admin'].includes(role);

const canManageProjects = (role) =>
  ['owner', 'admin', 'project_manager'].includes(role);

const canDeleteProjects = (role) =>
  ['owner', 'admin'].includes(role);

const canManageProjectMembers = (role) =>
  ['owner', 'admin', 'project_manager'].includes(role);

const canCreateTasks = (role) =>
  ['owner', 'admin', 'project_manager', 'member'].includes(role);

const canUpdateTasks = (role) =>
  ['owner', 'admin', 'project_manager', 'member'].includes(role);

const canDeleteTasks = (role) =>
  ['owner', 'admin', 'project_manager'].includes(role);

const canComment = (role) =>
  ['owner', 'admin', 'project_manager', 'member', 'guest'].includes(role);

const canViewProjects = (role) =>
  ['owner', 'admin', 'project_manager', 'member', 'guest'].includes(role);

const canViewReports = (role) =>
  ['owner', 'admin', 'project_manager'].includes(role);

const canAccessSettings = (role) =>
  ['owner', 'admin'].includes(role);

module.exports = {
  roleHierarchy,
  buildError,
  hasRequiredRole,
  getActiveMembership,
  requireOrganizationAccess,
  requireProjectAccess,
  requireTaskAccess,
  validateUsersBelongToOrganization,
  canManageOrganization,
  canManageProjects,
  canDeleteProjects,
  canManageProjectMembers,
  canCreateTasks,
  canUpdateTasks,
  canDeleteTasks,
  canComment,
  canViewProjects,
  canViewReports,
  canAccessSettings
};