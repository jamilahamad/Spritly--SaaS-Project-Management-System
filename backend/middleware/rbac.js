// middleware/rbac.js
const Member = require('../models/Member');

// Role hierarchy
const roleHierarchy = {
  owner: 5,
  admin: 4,
  project_manager: 3,
  member: 2,
  guest: 1
};

// Check if user has required role
exports.authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // User must be authenticated first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Organization ID should be in params or body
      const organizationId = req.params.organizationId || 
                            req.body.organization || 
                            req.organizationId;

      if (!organizationId) {
        return res.status(400).json({
          success: false,
          message: 'Organization context required'
        });
      }

      // Find user's membership in this organization
      const membership = await Member.findOne({
        user: req.user._id,
        organization: organizationId,
        status: 'active'
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this organization'
        });
      }

      // Check if user's role is in allowed roles
      const hasPermission = allowedRoles.some(role => {
        return roleHierarchy[membership.role] >= roleHierarchy[role];
      });

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
        });
      }

      // Attach membership info to request
      req.membership = membership;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking permissions',
        error: error.message
      });
    }
  };
};

// Check if user is member of organization
exports.isMemberOf = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const organizationId = req.params.organizationId || 
                          req.body.organization || 
                          req.organizationId;

    const membership = await Member.findOne({
      user: req.user._id,
      organization: organizationId,
      status: 'active'
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this organization'
      });
    }

    req.membership = membership;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking membership',
      error: error.message
    });
  }
};