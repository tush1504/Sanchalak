const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const generateToken = require('../utils/generateToken');
const sendResponse = require('../utils/sendResponse');

const {
  BadRequestError,
  UnauthenticatedError,
} = require('../errors');


const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide name, email, and password');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('User already exists with this email');
  }

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password,
    role: 'leader',
  });

  // Generate JWT token
  const token = generateToken(newUser._id);

  // Send response
  sendResponse(res, 201, {
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});



const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Send response
  sendResponse(res, 200, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = { signup, login };
