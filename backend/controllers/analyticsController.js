const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Member = require('../models/Member');
const ActivityLog = require('../models/ActivityLog');
const {
  requireOrganizationAccess,
  requireProjectAccess
} = require('../utils/access');

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard?organization=:orgId
// @access  Private
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const { organization } = req.query;

    if (!organization) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID is required'
      });
    }

    await requireOrganizationAccess(req.user._id, organization);

    const orgObjectId = toObjectId(organization);

    const totalProjects = await Project.countDocuments({
      organization,
      status: { $ne: 'archived' }
    });

    const totalTasks = await Task.countDocuments({ organization });

    const tasksByStatus = await Task.aggregate([
      { $match: { organization: orgObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const tasksByPriority = await Task.aggregate([
      { $match: { organization: orgObjectId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const tasksByType = await Task.aggregate([
      { $match: { organization: orgObjectId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const overdueTasks = await Task.countDocuments({
      organization,
      dueDate: { $lt: new Date() },
      status: { $nin: ['done', 'completed'] }
    });

    const totalMembers = await Member.countDocuments({
      organization,
      status: 'active'
    });

    const recentActivity = await ActivityLog.find({ organization })
      .populate('user', 'fullName avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    const myTasks = await Task.countDocuments({
      organization,
      assignee: req.user._id,
      status: { $ne: 'done' }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProjects,
          totalTasks,
          totalMembers,
          overdueTasks,
          myTasks
        },
        tasksByStatus,
        tasksByPriority,
        tasksByType,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project analytics
// @route   GET /api/analytics/projects/:id
// @access  Private
exports.getProjectAnalytics = async (req, res, next) => {
  try {
    const { project } = await requireProjectAccess(req.params.id, req.user._id);

    const projectId = project._id.toString();
    const projectObjectId = toObjectId(projectId);

    const totalTasks = await Task.countDocuments({ project: projectId });

    const tasksByStatus = await Task.aggregate([
      { $match: { project: projectObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const tasksByAssignee = await Task.aggregate([
      { $match: { project: projectObjectId } },
      { $group: { _id: '$assignee', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'assignee'
        }
      },
      { $unwind: { path: '$assignee', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          count: 1,
          assignee: {
            fullName: '$assignee.fullName',
            email: '$assignee.email',
            avatar: '$assignee.avatar'
          }
        }
      }
    ]);

    const completedTasks = await Task.countDocuments({
      project: projectId,
      status: 'done'
    });

    const completionRate = totalTasks > 0
      ? (completedTasks / totalTasks * 100).toFixed(2)
      : 0;

    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const tasksPerWeek = await Task.aggregate([
      {
        $match: {
          project: projectObjectId,
          createdAt: { $gte: fourWeeksAgo }
        }
      },
      {
        $group: {
          _id: { $week: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        completionRate: parseFloat(completionRate),
        tasksByStatus,
        tasksByAssignee,
        tasksPerWeek
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team performance analytics
// @route   GET /api/analytics/team?organization=:orgId
// @access  Private
exports.getTeamAnalytics = async (req, res, next) => {
  try {
    const { organization } = req.query;

    if (!organization) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID is required'
      });
    }

    await requireOrganizationAccess(req.user._id, organization);

    const orgObjectId = toObjectId(organization);

    const memberPerformance = await Task.aggregate([
      {
        $match: {
          organization: orgObjectId,
          status: 'done',
          assignee: { $ne: null }
        }
      },
      { $group: { _id: '$assignee', completedTasks: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          user: {
            fullName: '$user.fullName',
            email: '$user.email',
            avatar: '$user.avatar'
          },
          completedTasks: 1
        }
      },
      { $sort: { completedTasks: -1 } }
    ]);

    const activeMembers = await Member.countDocuments({
      organization,
      status: 'active'
    });

    const averageTasksPerMember = activeMembers > 0
      ? (await Task.countDocuments({ organization })) / activeMembers
      : 0;

    res.status(200).json({
      success: true,
      data: {
        memberPerformance,
        activeMembers,
        averageTasksPerMember: parseFloat(averageTasksPerMember.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
};