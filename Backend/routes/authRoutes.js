import express from 'express';

import {
  login,
  register,
  logout,
  getProfile,
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';

import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes - only authenticated users can create new users
router.post(
  '/register',
  authMiddleware,
  roleMiddleware('SUPER_ADMIN', 'ADMIN', 'UNIT_MANAGER'),
  register
);

// Get current user profile
router.get('/profile', authMiddleware, getProfile);

// Logout
router.post('/logout', authMiddleware, logout);

export default router;