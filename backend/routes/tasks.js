// routes/tasks.js
const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
  addAttachment,
  addSubtask,
  toggleSubtask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate, createTaskValidation } = require('../utils/validators');

router.route('/')
  .get(protect, getTasks)
  .post(protect, validate(createTaskValidation), createTask);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/assign', protect, assignTask);
router.post('/:id/attachments', protect, addAttachment);
router.post('/:id/subtasks', protect, addSubtask);
router.patch('/:id/subtasks/:subtaskId', protect, toggleSubtask);

module.exports = router;