const Project = require('../models/Project');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const {
  requireOrganizationAccess,
  requireProjectAccess,
  validateUsersBelongToOrganization,
  canManageProjects,
  canDeleteProjects,
  canManageProjectMembers,
  canViewProjects
} = require('../utils/access');

const DEFAULT_PROJECT_SETTINGS = {
  taskStatuses: ['todo', 'in_progress', 'review', 'done'],
  taskTypes: ['task', 'bug', 'story', 'epic']
};

const denyPermission = (res, message) => {
  return res.status(403).json({
    success: false,
    message
  });
};

const populateProject = async (project) => {
  await project.populate('lead', 'fullName email avatar');
  await project.populate('members', 'fullName email avatar');
  return project;
};

const createProjectLog = async ({ organization, user, action, entityId, metadata }) => {
  await ActivityLog.create({
    organization,
    user,
    action,
    entityType: 'project',
    entityId,
    metadata
  });
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    const {
      name,
      key,
      description,
      organization,
      lead,
      members,
      startDate,
      endDate,
      priority,
      settings
    } = req.body;

    const membership = await requireOrganizationAccess(req.user._id, organization);

    if (!canManageProjects(membership.role)) {
      return denyPermission(res, 'You do not have permission to create projects');
    }

    const existingProject = await Project.findOne({ organization, key });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Project with this key already exists in organization'
      });
    }

    const memberIds = await validateUsersBelongToOrganization(organization, [
      ...(members || []),
      req.user._id,
      lead || req.user._id
    ]);

    const finalLead = (lead || req.user._id).toString();
    const finalMembers = [...new Set([...memberIds, finalLead, req.user._id.toString()])];

    const project = await Project.create({
      name,
      key,
      description,
      organization,
      lead: finalLead,
      members: finalMembers,
      startDate,
      endDate,
      priority,
      settings: settings || DEFAULT_PROJECT_SETTINGS,
      createdBy: req.user._id
    });

    await populateProject(project);

    await createProjectLog({
      organization,
      user: req.user._id,
      action: 'created',
      entityId: project._id,
      metadata: { projectName: name }
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const { organization, status } = req.query;

    if (!organization) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID is required'
      });
    }

    const membership = await requireOrganizationAccess(req.user._id, organization);

    if (!canViewProjects(membership.role)) {
      return denyPermission(res, 'You do not have permission to view projects');
    }

    const query = { organization };
    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('lead', 'fullName email avatar')
      .populate('members', 'fullName email avatar')
      .sort({ createdAt: -1 })
      .lean();

    const projectIds = projects.map((project) => project._id);

    const taskCounts = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds }
        }
      },
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 }
        }
      }
    ]);

    const taskCountMap = {};
    taskCounts.forEach((item) => {
      taskCountMap[item._id.toString()] = item.count;
    });

    const projectsWithCounts = projects.map((project) => ({
      ...project,
      taskCount: taskCountMap[project._id.toString()] || 0,
      memberCount: project.members?.length || 0
    }));

    res.status(200).json({
      success: true,
      count: projectsWithCounts.length,
      data: projectsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const { project } = await requireProjectAccess(req.params.id, req.user._id);

    await project.populate('lead', 'fullName email avatar');
    await project.populate('members', 'fullName email avatar');
    await project.populate('createdBy', 'fullName email');

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    const { project, membership } = await requireProjectAccess(req.params.id, req.user._id);

    if (!canManageProjects(membership.role)) {
      return denyPermission(res, 'You do not have permission to update this project');
    }

    const {
      name,
      description,
      lead,
      members,
      status,
      startDate,
      endDate,
      priority,
      settings
    } = req.body;

    let finalLead = project.lead?.toString();
    let finalMembers = project.members.map((memberId) => memberId.toString());

    if (lead || members) {
      const validatedMembers = await validateUsersBelongToOrganization(project.organization, [
        ...(members || finalMembers),
        lead || finalLead,
        req.user._id
      ]);

      finalLead = (lead || finalLead || req.user._id.toString()).toString();
      finalMembers = [...new Set([...(members || validatedMembers), finalLead, req.user._id.toString()])];
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (priority !== undefined) updateData.priority = priority;
    if (settings !== undefined) updateData.settings = settings;

    updateData.lead = finalLead;
    updateData.members = finalMembers;

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    await populateProject(updatedProject);

    await createProjectLog({
      organization: updatedProject.organization,
      user: req.user._id,
      action: 'updated',
      entityId: updatedProject._id,
      metadata: { projectName: updatedProject.name }
    });

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const { project, membership } = await requireProjectAccess(req.params.id, req.user._id);

    if (!canDeleteProjects(membership.role)) {
      return denyPermission(res, 'You do not have permission to delete this project');
    }

    await project.deleteOne();
    await Task.deleteMany({ project: project._id });

    await createProjectLog({
      organization: project.organization,
      user: req.user._id,
      action: 'deleted',
      entityId: project._id,
      metadata: { projectName: project.name }
    });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addProjectMember = async (req, res, next) => {
  try {
    const { project, membership } = await requireProjectAccess(req.params.id, req.user._id);

    if (!canManageProjectMembers(membership.role)) {
      return denyPermission(res, 'You do not have permission to manage project members');
    }

    const { userId } = req.body;

    const validUsers = await validateUsersBelongToOrganization(project.organization, [userId]);
    const memberToAdd = validUsers[0];

    const alreadyExists = project.members.some(
      (memberId) => memberId.toString() === memberToAdd.toString()
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: 'User is already a project member'
      });
    }

    project.members.push(memberToAdd);
    await project.save();
    await populateProject(project);

    await createProjectLog({
      organization: project.organization,
      user: req.user._id,
      action: 'updated',
      entityId: project._id,
      metadata: {
        projectName: project.name,
        addedMember: memberToAdd
      }
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
exports.removeProjectMember = async (req, res, next) => {
  try {
    const { project, membership } = await requireProjectAccess(req.params.id, req.user._id);

    if (!canManageProjectMembers(membership.role)) {
      return denyPermission(res, 'You do not have permission to manage project members');
    }

    const { userId } = req.params;

    const memberExists = project.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: 'User is not a project member'
      });
    }

    if (project.lead?.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Change the project lead before removing this member'
      });
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );

    await project.save();
    await populateProject(project);

    await createProjectLog({
      organization: project.organization,
      user: req.user._id,
      action: 'updated',
      entityId: project._id,
      metadata: {
        projectName: project.name,
        removedMember: userId
      }
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};