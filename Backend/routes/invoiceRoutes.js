import express from 'express';

import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  updateInvoice,
} from '../controllers/invoiceController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  createInvoice
);

router.get(
  '/',
  authMiddleware,
  getInvoices
);

router.put(
  '/:id',
  authMiddleware,
  updateInvoice
);

router.delete(
  '/:id',
  authMiddleware,
  deleteInvoice
);

export default router;