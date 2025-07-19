const ActivityLog = require('../models/ActivityLog.js');

const logActivity = async ({ userId, role, action, target }) => {
  try {
    await ActivityLog.create({
      user: userId,
      role,
      action,
      target,
    });
  } catch (error) {
    console.error("Failed to log activity:", error.message);
  }
};

module.exports = logActivity;
