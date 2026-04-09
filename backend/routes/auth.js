const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  logout,
  forgotPassword,
  resetPassword,
  deleteMyAccount,
  verifyEmail,
  resendVerificationEmail,
  getInvitationDetails,
  acceptInvitation,
  uploadProfileImage,
  removeProfileImage
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { validate, registerValidation, loginValidation } = require('../utils/validators');

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);

// Email verification
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);

// Invitation
router.get('/invitations/:token', getInvitationDetails);
router.post('/invitations/:token/accept', protect, acceptInvitation);

// User
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.delete('/me', protect, deleteMyAccount);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);

// Profile image routes
router.put('/profile/image', protect, upload.single('image'), uploadProfileImage);
router.delete('/profile/image', protect, removeProfileImage);

// Password reset
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;