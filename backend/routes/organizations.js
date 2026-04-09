const express = require('express');
const router = express.Router();
const {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getMembers,
  inviteMember,
  acceptInvitation,
  updateMember,
  removeMember
} = require('../controllers/organizationController');
const { protect } = require('../middleware/auth');
const { validate, createOrganizationValidation } = require('../utils/validators');

router.route('/')
  .get(protect, getOrganizations)
  .post(protect, validate(createOrganizationValidation), createOrganization);

router.post('/invitations/:memberId/accept', protect, acceptInvitation);

router.route('/:id')
  .get(protect, getOrganization)
  .put(protect, updateOrganization)
  .delete(protect, deleteOrganization);

router.route('/:orgId/members')
  .get(protect, getMembers)
  .post(protect, inviteMember);

router.route('/:orgId/members/:memberId')
  .put(protect, updateMember)
  .delete(protect, removeMember);

module.exports = router;