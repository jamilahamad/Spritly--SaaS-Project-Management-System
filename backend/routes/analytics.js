// routes/analytics.js
const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getProjectAnalytics,
  getTeamAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/projects/:id', protect, getProjectAnalytics);
router.get('/team', protect, getTeamAnalytics);

module.exports = router;