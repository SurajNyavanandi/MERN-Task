import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import roleMiddleware from '../middleware/roleMiddleware.js';

import {
  createUnitGroup,
} from '../controllers/unitGroupController.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware(
    'SUPER_ADMIN',
    'ADMIN'
  ),
  createUnitGroup
);

export default router;