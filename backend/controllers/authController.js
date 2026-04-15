const crypto = require('crypto');
const User = require('../models/User');
const Invitation = require('../models/Invitation');
const Member = require('../models/Member');
const Project = require('../models/Project');
const Task = require('../models/Task');
const sendEmail = require('../utils/sendEmail');
const config = require('../config/config');
const { sendTokenResponse } = require('../utils/generateToken');
const asyncHandler = require('../middleware/async');
// const ErrorResponse = require('../utils/errorResponse');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a name'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;

      existingUser.fullName = fullName.trim();
      existingUser.password = password;
      existingUser.emailVerificationToken = verificationToken;
      existingUser.emailVerificationExpire = verificationTokenExpire;

      await existingUser.save();

      const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      try {
        await sendEmail({
          email: existingUser.email,
          subject: 'Verify your Sprintly account',
          message: `Please verify your email by visiting: ${verifyUrl}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Verify your email</h2>
              <p>Welcome to Sprintly.</p>
              <p>Please click the button below to verify your email address:</p>
              <p>
                <a href="${verifyUrl}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">
                  Verify Email
                </a>
              </p>
              <p>This link expires in 24 hours.</p>
            </div>
          `
        });

        return res.status(200).json({
          success: true,
          message: 'This email is already registered but not verified. A new verification email has been sent.',
          requiresEmailVerification: true,
          email: existingUser.email
        });
      } catch (emailError) {
        console.error('Resend verification email error:', emailError);

        return res.status(500).json({
          success: false,
          message: 'Account exists but verification email could not be sent. Please try again.'
        });
      }
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpire: verificationTokenExpire
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your Sprintly account',
        message: `Please verify your email by visiting: ${verifyUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Verify your email</h2>
            <p>Welcome to Sprintly.</p>
            <p>Please click the button below to verify your email address:</p>
            <p>
              <a href="${verifyUrl}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">
                Verify Email
              </a>
            </p>
            <p>This link expires in 24 hours.</p>
          </div>
        `
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        requiresEmailVerification: true,
        email: user.email
      });
    } catch (emailError) {
      console.error('Registration email error:', emailError);

      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        success: false,
        message: 'Registration failed because verification email could not be sent. Please try again.'
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresEmailVerification: true,
        email: user.email
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Email verification failed'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification-email
// @access  Public
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpire = verificationTokenExpire;
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Verify your Sprintly account',
      message: `Please verify your email by visiting: ${verifyUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Verify your email</h2>
          <p>Please click the button below to verify your email address:</p>
          <p>
            <a href="${verifyUrl}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">
              Verify Email
            </a>
          </p>
          <p>This link expires in 24 hours.</p>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to resend verification email'
    });
  }
};

// @desc    Get invitation details
// @route   GET /api/auth/invitations/:token
// @access  Public
exports.getInvitationDetails = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const invitation = await Invitation.findOne({
      token: hashedToken,
      status: 'pending',
      expireAt: { $gt: Date.now() }
    })
      .populate('organization', 'name')
      .populate('invitedBy', 'fullName email');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found or expired'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        email: invitation.email,
        role: invitation.role,
        organization: invitation.organization,
        invitedBy: invitation.invitedBy
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept invitation
// @route   POST /api/auth/invitations/:token/accept
// @access  Private
exports.acceptInvitation = async (req, res, next) => {
  try {
    const rawToken = req.params.token;

    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const invitation = await Invitation.findOne({
      token: hashedToken,
      status: 'pending',
      expireAt: { $gt: Date.now() }
    }).populate('organization', 'name');

    if (!invitation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invitation'
      });
    }

    const user = await User.findById(req.user._id || req.user.id);

    if (!user || !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before accepting invitations'
      });
    }

    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'This invitation was sent to another email address'
      });
    }

    const existingMember = await Member.findOne({
      user: user._id,
      organization: invitation.organization._id
    });

    if (existingMember) {
      if (existingMember.status !== 'active') {
        existingMember.status = 'active';
        existingMember.role = invitation.role;
        await existingMember.save();
      }

      invitation.status = 'accepted';
      invitation.acceptedBy = user._id;
      await invitation.save();

      return res.status(200).json({
        success: true,
        message: 'Invitation accepted successfully'
      });
    }

    await Member.create({
      user: user._id,
      organization: invitation.organization._id,
      role: invitation.role,
      status: 'active'
    });

    invitation.status = 'accepted';
    invitation.acceptedBy = user._id;
    await invitation.save();

    return res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { fullName, email } = req.body;

  const user = await User.findById(req.user.id || req.user._id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (fullName !== undefined) user.fullName = fullName;
  if (email !== undefined) user.email = email.toLowerCase().trim();

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Upload profile image
// @route   PUT /api/auth/profile/image
// @access  Private
exports.uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  const user = await User.findById(req.user.id || req.user._id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const uploadFromBuffer = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'sprintly/avatars',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

  const result = await uploadFromBuffer();

  if (user.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    } catch (err) {
      console.error('Old avatar delete failed:', err.message);
    }
  }

  user.avatar = result.secure_url;
  user.avatarPublicId = result.public_id;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile image uploaded successfully',
    data: {
      avatar: user.avatar,
      avatarPublicId: user.avatarPublicId,
      user
    }
  });
});

// @desc    Remove profile image
// @route   DELETE /api/auth/profile/image
// @access  Private
exports.removeProfileImage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id || req.user._id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (user.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    } catch (err) {
      console.error('Avatar delete failed:', err.message);
    }
  }

  user.avatar = '';
  user.avatarPublicId = '';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile image removed successfully',
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  const cookieOptions = {
    expires: new Date(0),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('token', '', cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const normalizedEmail = req.body.email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists, a reset link has been sent'
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `You requested a password reset for your Sprintly account.

Reset your password using the link below:
${resetUrl}

This link will expire in 10 minutes. If you did not request this, you can ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Sprintly password reset request',
        message,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2>Reset your password</h2>
            <p>We received a request to reset the password for your Sprintly account.</p>
            <p>
              <a href="${resetUrl}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;">
                Reset Password
              </a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 10 minutes.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Password reset email could not be sent. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists, a reset link has been sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete my account
// @route   DELETE /api/auth/me
// @access  Private
exports.deleteMyAccount = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    await Member.deleteMany({ user: userId });

    await Project.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    await Project.updateMany(
      { lead: userId },
      { $set: { lead: null } }
    );

    await Task.updateMany(
      { assignee: userId },
      { $set: { assignee: null } }
    );

    await Task.updateMany(
      { reporter: userId },
      { $set: { reporter: null } }
    );

    await Task.updateMany(
      { createdBy: userId },
      { $set: { createdBy: null } }
    );

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};