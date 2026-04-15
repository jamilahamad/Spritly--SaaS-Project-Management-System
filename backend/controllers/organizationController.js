const Invitation = require('../models/Invitation');
const sendEmail = require('../utils/sendEmail');
const Organization = require('../models/Organization');
const Member = require('../models/Member');
const Notification = require('../models/Notification');
const User = require('../models/User');

const {
  canManageOrganization
} = require('../utils/access');

// @desc    Create organization
// @route   POST /api/organizations
// @access  Private
exports.createOrganization = async (req, res, next) => {
  try {
    const { name, slug, description, logo } = req.body;

    const existingOrg = await Organization.findOne({ slug });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: 'Organization with this slug already exists'
      });
    }

    const organization = await Organization.create({
      name,
      slug,
      description,
      logo,
      owner: req.user._id
    });

    await Member.create({
      user: req.user._id,
      organization: organization._id,
      role: 'owner',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user's organizations
// @route   GET /api/organizations
// @access  Private
exports.getOrganizations = async (req, res, next) => {
  try {
    const memberships = await Member.find({
      user: req.user._id,
      status: 'active'
    }).populate('organization');

    const organizations = memberships.map(m => ({
      ...m.organization.toObject(),
      userRole: m.role
    }));

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single organization
// @route   GET /api/organizations/:id
// @access  Private
exports.getOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('owner', 'fullName email avatar');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    const membership = await Member.findOne({
      user: req.user._id,
      organization: organization._id,
      status: 'active'
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this organization'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...organization.toObject(),
        userRole: membership.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
// @access  Private (Owner/Admin)
exports.updateOrganization = async (req, res, next) => {
  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    const membership = await Member.findOne({
      user: req.user._id,
      organization: organization._id,
      status: 'active'
    });

    if (!membership || !canManageOrganization(membership.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this organization'
      });
    }

    const { name, description, logo, settings } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;
    if (settings !== undefined) updateData.settings = settings;

    organization = await Organization.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
// @access  Private (Owner only)
exports.deleteOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    if (organization.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can delete this organization'
      });
    }

    await organization.deleteOne();
    await Member.deleteMany({ organization: organization._id });

    res.status(200).json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organization members
// @route   GET /api/organizations/:orgId/members
// @access  Private
exports.getMembers = async (req, res, next) => {
  try {
    const organizationId = req.params.orgId || req.params.id;

    const hasAccess = await Member.findOne({
      organization: organizationId,
      user: req.user._id,
      status: 'active'
    });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this organization'
      });
    }

    const members = await Member.find({
      organization: organizationId,
      status: { $in: ['active', 'invited'] }
    })
      .populate('user', 'fullName email avatar')
      .populate('invitedBy', 'fullName');

    const validMembers = members.filter((member) => member.user);

    res.status(200).json({
      success: true,
      count: validMembers.length,
      data: validMembers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite member to organization
// @route   POST /api/organizations/:orgId/members
// @access  Private (Owner/Admin)
exports.inviteMember = async (req, res, next) => {
  try {
    const requesterMembership = await Member.findOne({
      user: req.user._id,
      organization: req.params.orgId,
      status: 'active'
    });

    if (!requesterMembership || !canManageOrganization(requesterMembership.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to invite members'
      });
    }

    const { email, role = 'member' } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const organization = await Organization.findById(req.params.orgId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      const existingMember = await Member.findOne({
        user: existingUser._id,
        organization: req.params.orgId
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'User is already a member or already invited'
        });
      }
    }

    const alreadyInvited = await Invitation.findOne({
      email: normalizedEmail,
      organization: req.params.orgId,
      status: 'pending',
      expireAt: { $gt: Date.now() }
    });

    if (alreadyInvited) {
      return res.status(400).json({
        success: false,
        message: 'An active invitation already exists for this email'
      });
    }

    const invitation = new Invitation({
      email: normalizedEmail,
      organization: req.params.orgId,
      invitedBy: req.user._id,
      role
    });

    const rawToken = invitation.generateInviteToken();
    await invitation.save();

    const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite/${rawToken}`;

    const message = `
Hello,

You have been invited to join "${organization.name}" on Sprintly as ${role.replace('_', ' ')}.

Accept your invitation using the link below:
${inviteUrl}

This link will expire in 7 days.
`;

    await sendEmail({
      email: normalizedEmail,
      subject: `Invitation to join ${organization.name} on Sprintly`,
      message
    });

    return res.status(200).json({
      success: true,
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept organization invitation
// @route   POST /api/organizations/invitations/:memberId/accept
// @access  Private
exports.acceptInvitation = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.memberId)
      .populate('organization', 'name')
      .populate('invitedBy', 'fullName');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    if (member.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to accept this invitation'
      });
    }

    if (member.status === 'active') {
      return res.status(200).json({
        success: true,
        message: 'Invitation already accepted',
        data: member
      });
    }

    member.status = 'active';
    await member.save();

    await Notification.updateMany(
      {
        recipient: req.user._id,
        relatedMember: member._id,
        type: 'organization_invite'
      },
      { read: true }
    );

    if (member.invitedBy && member.invitedBy._id.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: member.invitedBy._id,
        organization: member.organization._id,
        type: 'invite_accepted',
        title: 'Invitation Accepted',
        message: `${req.user.fullName} accepted your invitation to join ${member.organization.name}`,
        link: '/team',
        relatedUser: req.user._id,
        relatedMember: member._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully',
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member role
// @route   PUT /api/organizations/:orgId/members/:memberId
// @access  Private (Owner/Admin)
exports.updateMember = async (req, res, next) => {
  try {
    const requesterMembership = await Member.findOne({
      user: req.user._id,
      organization: req.params.orgId,
      status: 'active'
    });

    if (!requesterMembership || !canManageOrganization(requesterMembership.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update members'
      });
    }

    const { role, team, status } = req.body;

    const member = await Member.findById(req.params.memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    if (member.role === 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify owner role'
      });
    }

    if (role === 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Owner role cannot be assigned through this action'
      });
    }

    if (role !== undefined) member.role = role;
    if (team !== undefined) member.team = team;
    if (status !== undefined) member.status = status;

    await member.save();
    await member.populate('user', 'fullName email avatar');

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from organization
// @route   DELETE /api/organizations/:orgId/members/:memberId
// @access  Private (Owner/Admin)
exports.removeMember = async (req, res, next) => {
  try {
    const requesterMembership = await Member.findOne({
      user: req.user._id,
      organization: req.params.orgId,
      status: 'active'
    });

    if (!requesterMembership || !canManageOrganization(requesterMembership.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members'
      });
    }

    const member = await Member.findById(req.params.memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    if (member.role === 'owner') {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove owner from organization'
      });
    }

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    next(error);
  }
};