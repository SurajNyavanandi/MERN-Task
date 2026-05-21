import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    if (
      req.user.role === 'SUPER_ADMIN' &&
      role !== 'ADMIN'
    ) {
      return res.status(403).json({
        message: 'SUPER_ADMIN can create only ADMIN',
      });
    }

    if (
      req.user.role === 'ADMIN' &&
      role !== 'UNIT_MANAGER'
    ) {
      return res.status(403).json({
        message: 'ADMIN can create only UNIT_MANAGER',
      });
    }

    if (
      req.user.role === 'UNIT_MANAGER' &&
      role !== 'USER'
    ) {
      return res.status(403).json({
        message: 'UNIT_MANAGER can create only USER',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let prefix = 'U';

    if (role === 'ADMIN') prefix = 'A';

    if (role === 'UNIT_MANAGER') prefix = 'UM';

    if (role === 'SUPER_ADMIN') prefix = 'SA';

    const count = await User.countDocuments({ role });

    const generatedUserId = `${prefix}${count + 1}`;

    const user = await User.create({
      userId: generatedUserId,
      username,
      email,
      password: hashedPassword,
      role,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};