import express from 'express';

import {
  deleteUser,
  getUsers,
  updateUserRole,
  getUserById,
  updateUserTimezone,
  deactivateUser,
} from '../controllers/userController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users with filters and pagination
router.get('/', authMiddleware, getUsers);

// Get single user
router.get('/:id', authMiddleware, getUserById);

// Update user role (SUPER_ADMIN only)
router.put('/:id/role', authMiddleware, updateUserRole);

// Update user timezone
router.put('/:id/timezone', authMiddleware, updateUserTimezone);

// Deactivate user (SUPER_ADMIN only)
router.put('/:id/deactivate', authMiddleware, deactivateUser);

// Delete user
router.delete('/:id', authMiddleware, deleteUser);

export default router;