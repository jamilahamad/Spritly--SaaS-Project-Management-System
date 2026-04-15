const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { requireTaskAccess, canComment } = require('../utils/access');

// @desc    Add comment to task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { content, mentions, attachments } = req.body;
    const { task, membership } = await requireTaskAccess(req.params.taskId, req.user._id);

    if (!canComment(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to comment on this task'
      });
    }

    const comment = await Comment.create({
      task: req.params.taskId,
      user: req.user._id,
      content,
      mentions: mentions || [],
      attachments: attachments || []
    });

    await comment.populate('user', 'fullName email avatar');
    await comment.populate('mentions', 'fullName email');

    if (mentions && mentions.length > 0) {
      const notificationPromises = mentions.map((userId) =>
        Notification.create({
          recipient: userId,
          organization: task.organization,
          type: 'mention',
          title: 'You were mentioned',
          message: `${req.user.fullName} mentioned you in a comment on "${task.title}"`,
          link: `/tasks/${task._id}`,
          relatedTask: task._id,
          relatedUser: req.user._id
        })
      );

      await Promise.all(notificationPromises);
    }

    if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: task.assignee,
        organization: task.organization,
        type: 'comment_added',
        title: 'New Comment',
        message: `${req.user.fullName} commented on "${task.title}"`,
        link: `/tasks/${task._id}`,
        relatedTask: task._id,
        relatedUser: req.user._id
      });
    }

    await ActivityLog.create({
      organization: task.organization,
      user: req.user._id,
      action: 'commented',
      entityType: 'task',
      entityId: task._id,
      metadata: { taskKey: task.key, commentPreview: content.substring(0, 100) }
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
exports.getComments = async (req, res, next) => {
  try {
    await requireTaskAccess(req.params.taskId, req.user._id);

    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'fullName email avatar')
      .populate('mentions', 'fullName email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const task = await Task.findById(comment.task);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await requireTaskAccess(task._id, req.user._id);

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true, runValidators: true }
    )
      .populate('user', 'fullName email avatar')
      .populate('mentions', 'fullName email');

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const task = await Task.findById(comment.task);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await requireTaskAccess(task._id, req.user._id);

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};