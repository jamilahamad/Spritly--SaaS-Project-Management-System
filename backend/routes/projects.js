// routes/projects.js
const express = require('express');
const router = express.Router();

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} = require('../controllers/projectController');

const { protect } = require('../middleware/auth');
const { validate, createProjectValidation } = require('../utils/validators');

router.route('/')
  .get(protect, getProjects)
  .post(protect, validate(createProjectValidation), createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/members')
  .post(protect, addProjectMember);

router.route('/:id/members/:userId')
  .delete(protect, removeProjectMember);

module.exports = router;