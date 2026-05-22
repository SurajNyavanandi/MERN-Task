import express from 'express';

import {
  createInvoice,
  deleteInvoice,
  deleteMultipleInvoices,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  getFinancialYears,
} from '../controllers/invoiceController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all financial years
router.get('/financial-years', authMiddleware, getFinancialYears);

// Create invoice
router.post('/', authMiddleware, createInvoice);

// Get all invoices with filters
router.get('/', authMiddleware, getInvoices);

// Get single invoice
router.get('/:id', authMiddleware, getInvoiceById);

// Update invoice
router.put('/:id', authMiddleware, updateInvoice);

// Delete single invoice
router.delete('/:id', authMiddleware, deleteInvoice);

// Delete multiple invoices
router.delete('/', authMiddleware, deleteMultipleInvoices);

export default router;