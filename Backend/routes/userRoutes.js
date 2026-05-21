import express from 'express';

import {
  deleteUser,
  getUsers,
  updateUserRole,
} from '../controllers/userController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  getUsers
);

router.put(
  '/:id',
  authMiddleware,
  updateUserRole
);

router.delete(
  '/:id',
  authMiddleware,
  deleteUser
);

export default router;