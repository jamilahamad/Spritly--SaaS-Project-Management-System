// routes/comments.js
const express = require('express');
const router = express.Router();
const {
  addComment,
  getComments,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.route('/tasks/:taskId/comments')
  .get(protect, getComments)
  .post(protect, addComment);

router.route('/comments/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;