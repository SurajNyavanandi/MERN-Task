import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import roleMiddleware from '../middleware/roleMiddleware.js';

import {
  createAdminGroup,
} from '../controllers/adminGroupController.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('SUPER_ADMIN'),
  createAdminGroup
);

export default router;