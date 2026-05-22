import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const VALID_TIMEZONES = [
  'UTC',
  'GMT',
  'IST',
  'EST',
  'CST',
  'MST',
  'PST',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Australia/Sydney',
];

export const register = async (req, res) => {
  try {
    const { username, email, password, role, timezone } = req.body;

    // Validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, password, and role are required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Validate timezone
    const userTimezone = timezone || 'UTC';
    if (!VALID_TIMEZONES.includes(userTimezone)) {
      return res.status(400).json({
        success: false,
        message: `Invalid timezone. Must be one of: ${VALID_TIMEZONES.join(', ')}`,
      });
    }

    // Role-based permission checks
    if (req.user.role === 'SUPER_ADMIN' && role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'SUPER_ADMIN can create only ADMIN users',
      });
    }

    if (req.user.role === 'ADMIN' && role !== 'UNIT_MANAGER') {
      return res.status(403).json({
        success: false,
        message: 'ADMIN can create only UNIT_MANAGER users',
      });
    }

    if (req.user.role === 'UNIT_MANAGER' && role !== 'USER') {
      return res.status(403).json({
        success: false,
        message: 'UNIT_MANAGER can create only USER users',
      });
    }

    if (req.user.role === 'USER') {
      return res.status(403).json({
        success: false,
        message: 'USER cannot create other users',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate User ID based on role
    let prefix = 'U';
    if (role === 'ADMIN') prefix = 'A';
    if (role === 'UNIT_MANAGER') prefix = 'UM';
    if (role === 'SUPER_ADMIN') prefix = 'SA';

    const count = await User.countDocuments({ role });
    const generatedUserId = `${prefix}${count + 1}`;

    // Create user
    const user = await User.create({
      userId: generatedUserId,
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      timezone: userTimezone,
      createdBy: req.user.id,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: `${role} user created successfully`,
      user: userResponse,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating user',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, timezone } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is disabled',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Validate timezone if provided
    if (timezone && !VALID_TIMEZONES.includes(timezone)) {
      return res.status(400).json({
        success: false,
        message: `Invalid timezone. Must be one of: ${VALID_TIMEZONES.join(', ')}`,
      });
    }

    // Update last login and timezone
    user.lastLogin = new Date();
    if (timezone) {
      user.timezone = timezone;
    }
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error during login',
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Token invalidation would be handled on frontend by removing token
    // Or implement token blacklist if needed
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};