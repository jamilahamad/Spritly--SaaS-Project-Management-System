// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'project_manager', 'member', 'guest'],
    default: 'member'
  },
  team: {
    type: String,
    default: null
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'invited', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index to ensure one user can only have one membership per organization
memberSchema.index({ user: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model('Member', memberSchema);