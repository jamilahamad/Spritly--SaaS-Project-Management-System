const mongoose = require('mongoose');
const crypto = require('crypto');

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'project_manager', 'member', 'guest'],
      default: 'member'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired', 'cancelled'],
      default: 'pending'
    },
    token: {
      type: String,
      required: true
    },
    expireAt: {
      type: Date,
      required: true
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

invitationSchema.methods.generateInviteToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');

  this.token = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  this.expireAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

  return rawToken;
};

module.exports = mongoose.model('Invitation', invitationSchema);