const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes you have a User model
    required: true,
  },
  role: {
    type: String,
    enum: ['Leader', 'Member'],
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
