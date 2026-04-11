const Task = require('../models/Task');
const Project = require('../models/Project');
const Member = require('../models/Member');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const {
  requireOrganizationAccess,
  requireProjectAccess,
  requireTaskAccess,
  validateUsersBelongToOrganization,
  canCreateTasks,
  canUpdateTasks,
  canDeleteTasks
} = require('../utils/access');

const emitTaskAssigned = (req, userId, payload) => {
  if (!req.app?.locals?.io || !userId) return;
  req.app.locals.io.to(`user:${userId}`).emit('task_assigned_realtime', payload);
};

const emitTaskUpdated = (req, userId, payload) => {
  if (!req.app?.locals?.io || !userId) return;
  req.app.locals.io.to(`user:${userId}`).emit('task_updated_realtime', payload);
};

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const populateTask = (query) =>
  query
    .populate('assignee', 'fullName email avatar')
    .populate('reporter', 'fullName email avatar')
    .populate('project', 'name key settings')
    .populate('createdBy', 'fullName email');

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      project,
      assignee,
      priority,
      type,
      labels,
      dueDate,
      estimatedHours
    } = req.body;

    const { project: projectDoc, membership } = await requireProjectAccess(project, req.user._id);

    if (!canCreateTasks(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create tasks'
      });
    }

    if (assignee) {
      await validateUsersBelongToOrganization(projectDoc.organization, [assignee]);
    }

    const defaultStatus = projectDoc.settings?.taskStatuses?.[0] || 'todo';

    const task = await Task.create({
      title,
      description,
      project,
      organization: projectDoc.organization,
      assignee: assignee || null,
      reporter: req.user._id,
      priority,
      type,
      labels,
      dueDate,
      estimatedHours,
      status: defaultStatus,
      createdBy: req.user._id
    });

    const populatedTask = await populateTask(Task.findById(task._id));

    if (assignee && assignee.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: assignee,
        organization: projectDoc.organization,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `${req.user.fullName} assigned you to "${title}"`,
        link: `/tasks/${task._id}`,
        relatedTask: task._id,
        relatedUser: req.user._id
      });

      emitTaskAssigned(req, assignee.toString(), {
        task: populatedTask,
        notification,
        organizationId: projectDoc.organization.toString()
      });
    }

    await ActivityLog.create({
      organization: projectDoc.organization,
      user: req.user._id,
      action: 'created',
      entityType: 'task',
      entityId: task._id,
      metadata: { taskTitle: title, taskKey: task.key }
    });

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const {
      project,
      organization,
      status,
      assignee,
      priority,
      type,
      search,
      limit
    } = req.query;

    const query = {};

    if (project) {
      const { project: projectDoc } = await requireProjectAccess(project, req.user._id);
      query.project = projectDoc._id;
      query.organization = projectDoc.organization;
    } else if (organization) {
      await requireOrganizationAccess(req.user._id, organization);
      query.organization = organization;
    } else {
      const memberships = await Member.find({
        user: req.user._id,
        status: 'active'
      }).select('organization');

      query.organization = {
        $in: memberships.map((membership) => membership.organization)
      };
    }

    if (status) query.status = status;
    if (assignee) query.assignee = assignee;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { key: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    let taskQuery = Task.find(query)
      .populate('assignee', 'fullName email avatar')
      .populate('reporter', 'fullName email avatar')
      .populate('project', 'name key')
      .sort({ createdAt: -1 });

    if (limit) {
      taskQuery = taskQuery.limit(Number(limit));
    }

    const tasks = await taskQuery;

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const { task } = await requireTaskAccess(req.params.id, req.user._id);

    const populatedTask = await populateTask(Task.findById(task._id));

    res.status(200).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    const { task, membership } = await requireTaskAccess(req.params.id, req.user._id);

    if (!canUpdateTasks(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update tasks'
      });
    }

    if (req.body.assignee) {
      await validateUsersBelongToOrganization(task.organization, [req.body.assignee]);
    }

    const allowedFields = [
      'title',
      'description',
      'assignee',
      'priority',
      'type',
      'labels',
      'dueDate',
      'estimatedHours',
      'status'
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const oldAssignee = task.assignee ? task.assignee.toString() : null;
    const oldStatus = task.status;

    const updatedTask = await populateTask(
      Task.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
      })
    );

    if (
      req.body.assignee &&
      oldAssignee !== req.body.assignee.toString() &&
      req.body.assignee.toString() !== req.user._id.toString()
    ) {
      const notification = await Notification.create({
        recipient: req.body.assignee,
        organization: updatedTask.organization,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `${req.user.fullName} assigned you to "${updatedTask.title}"`,
        link: `/tasks/${updatedTask._id}`,
        relatedTask: updatedTask._id,
        relatedUser: req.user._id
      });

      emitTaskAssigned(req, req.body.assignee.toString(), {
        task: updatedTask,
        notification,
        organizationId: updatedTask.organization.toString()
      });
    }

    if (req.body.status && oldStatus !== req.body.status && updatedTask.assignee) {
      emitTaskUpdated(req, updatedTask.assignee.toString(), {
        task: updatedTask,
        organizationId: updatedTask.organization.toString()
      });
    }

    await ActivityLog.create({
      organization: updatedTask.organization,
      user: req.user._id,
      action: 'updated',
      entityType: 'task',
      entityId: updatedTask._id,
      metadata: { taskTitle: updatedTask.title, taskKey: updatedTask.key }
    });

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { task, membership } = await requireTaskAccess(req.params.id, req.user._id);

    if (!canUpdateTasks(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update task status'
      });
    }

    task.status = req.body.status;
    await task.save();

    const populatedTask = await populateTask(Task.findById(task._id));

    await ActivityLog.create({
      organization: task.organization,
      user: req.user._id,
      action: 'updated',
      entityType: 'task',
      entityId: task._id,
      metadata: { taskTitle: task.title, taskKey: task.key, status: task.status }
    });

    res.status(200).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign task
// @route   PATCH /api/tasks/:id/assign
// @access  Private
exports.assignTask = async (req, res, next) => {
  try {
    const { task, membership } = await requireTaskAccess(req.params.id, req.user._id);

    if (!canUpdateTasks(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to assign tasks'
      });
    }

    const { assignee } = req.body;

    if (assignee) {
      await validateUsersBelongToOrganization(task.organization, [assignee]);
    }

    const oldAssignee = task.assignee ? task.assignee.toString() : null;
    task.assignee = assignee || null;
    await task.save();

    const populatedTask = await populateTask(Task.findById(task._id));

    if (
      assignee &&
      assignee.toString() !== req.user._id.toString() &&
      oldAssignee !== assignee.toString()
    ) {
      const notification = await Notification.create({
        recipient: assignee,
        organization: task.organization,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `${req.user.fullName} assigned you to "${task.title}"`,
        link: `/tasks/${task._id}`,
        relatedTask: task._id,
        relatedUser: req.user._id
      });

      emitTaskAssigned(req, assignee.toString(), {
        task: populatedTask,
        notification,
        organizationId: task.organization.toString()
      });
    }

    res.status(200).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const { task, membership } = await requireTaskAccess(req.params.id, req.user._id);

    if (!canDeleteTasks(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete tasks'
      });
    }

    await task.deleteOne();

    await ActivityLog.create({
      organization: task.organization,
      user: req.user._id,
      action: 'deleted',
      entityType: 'task',
      entityId: task._id,
      metadata: { taskTitle: task.title, taskKey: task.key }
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
exports.addAttachment = async (req, res, next) => {
  try {
    const { task, membership } = await requireTaskAccess(req.params.id, req.user._id);

    if (!canUpdateTasks(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add attachments'
      });
    }

    const { name, url } = req.body;

    task.attachments.push({ name, url });
    await task.save();

    const populatedTask = await populateTask(Task.findById(task._id));

    res.status(200).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private
exports.addSubtask = async (req, res, next) => {
  try {
    const { task, membership } = await requireTaskAccess(req.params.id, req.user._id);

    if (!canUpdateTasks(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add subtasks'
      });
    }

    task.subtasks.push({
      title: req.body.title,
      completed: false
    });

    await task.save();

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @access  Private
exports.toggleSubtask = async (req, res, next) => {
  try {
    const { task, membership } = await requireTaskAccess(req.params.id, req.user._id);

    if (!canUpdateTasks(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update subtasks'
      });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: 'Subtask not found'
      });
    }

    subtask.completed = !subtask.completed;
    await task.save();

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};