// middleware/tenantContext.js
const Organization = require('../models/Organization');
const Member = require('../models/Member');

// Extract organization context from request
exports.setOrganizationContext = async (req, res, next) => {
  try {
    let organizationId = null;

    // Try to get organization from different sources
    if (req.params.organizationId) {
      organizationId = req.params.organizationId;
    } else if (req.body.organization) {
      organizationId = req.body.organization;
    } else if (req.query.organization) {
      organizationId = req.query.organization;
    } else if (req.headers['x-organization-id']) {
      organizationId = req.headers['x-organization-id'];
    }

    if (organizationId) {
      // Verify organization exists
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }

      // If user is authenticated, verify they're a member
      if (req.user) {
        const membership = await Member.findOne({
          user: req.user._id,
          organization: organizationId,
          status: 'active'
        });

        if (!membership) {
          return res.status(403).json({
            success: false,
            message: 'You do not have access to this organization'
          });
        }

        req.membership = membership;
      }

      req.organizationId = organizationId;
      req.organization = organization;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error setting organization context',
      error: error.message
    });
  }
};