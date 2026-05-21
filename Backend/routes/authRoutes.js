import express from 'express';

import {
  login,
  register,
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';

import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/login', login);

router.post(
  '/register',
  authMiddleware,
  roleMiddleware(
    'SUPER_ADMIN',
    'ADMIN',
    'UNIT_MANAGER'
  ),
  register
);

export default router;