const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const sendMail = require('../utils/sendMail');
const generatePassword = require('../utils/generatePassword');
const asyncHandler = require('../middleware/asyncHandler');
const logActivity = require('../utils/logActivity');

const { BadRequestError, NotFoundError, UnauthenticatedError} = require('../errors');

//  Add Member
const addMember = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    throw new BadRequestError('Please provide name, email, and role');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('User already exists with this email');
  }

  const password = generatePassword();

  const newUser = await User.create({
    name,
    email,
    role,
    password,
    teamLeader:req.user._id,
  });

  await sendMail({
    to: email,
    subject: 'You have been added to a team',
    html: `
      <h3>Welcome to the team!</h3>
      <p>You were added by <strong>${req.user.name}</strong> as a <strong>${role}</strong>.</p>
      <p>Here are your login credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please log in and update your password after logging in.</p>
    `,
  });

  await logActivity({
    userId: req.user._id,
    role: 'Leader',
    action: 'Added a new team member',
    target: `Member: ${newUser.name}`,
  });

  res.status(201).json({
    success: true,
    message: 'Team member added successfully. Email sent.',
    member: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

//  Remove Member
const removeMember = asyncHandler(async (req, res) => {
  const memberId = req.params.id;

  // 1. Ensure current user is a team leader
  if (req.user.role !== 'leader') {
    throw new UnauthenticatedError('Only team leaders can remove members');
  }

  // 2. Check if the member exists
  const member = await User.findById(memberId);
  if (!member) {
    throw new NotFoundError('Team member not found');
  }

  // 3. Prevent team leaders from deleting themselves
  if (member._id.toString() === req.user._id.toString()) {
    throw new UnauthenticatedError('You cannot remove yourself');
  }

  // 4. Delete the member
  await member.deleteOne();

  // 5. Log the activity
  await logActivity({
    userId: req.user._id,
    role: 'Leader',
    action: 'Removed a team member',
    target: `Member: ${member.name}`,
  });

  // 6. Send response
  res.status(200).json({
    success: true,
    message: 'Team member removed successfully',
  });
});

//  Get Team Members
const getTeamMembers = asyncHandler(async (req, res) => {

  const teamMembers = await User.find({
    teamLeader: req.user._id, // current leader's ID
  }).select('name email role');

  res.status(200).json({
    success: true,
    count: teamMembers.length,
    teamMembers,
  });
});


//  Get All Activity Logs
const getAllActivityLogs = asyncHandler(async (req, res) => {
  
  const { user, role, from, to } = req.query;

  const filter = {};

  if (user) {
    filter.user = user;
  }

  if (role) {
    filter.role = role;
  }

  if (from || to) {
    filter.timestamp = {};
    if (from) filter.timestamp.$gte = new Date(from);
    if (to) filter.timestamp.$lte = new Date(to);
  }

  const logs = await ActivityLog.find(filter)
    .sort({ timestamp: -1 })
    .populate('user', 'name email');

  res.status(200).json({
    success: true,
    logs,
  });
});



module.exports = {
  addMember,
  removeMember,
  getTeamMembers,
  getAllActivityLogs,
};
