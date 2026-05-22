import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      required: [true, 'Invoice number is required'],
      min: [1, 'Invoice number must be at least 1'],
    },

    invoiceDate: {
      type: Date,
      required: [true, 'Invoice date is required'],
    },

    invoiceAmount: {
      type: Number,
      required: [true, 'Invoice amount is required'],
      min: [0, 'Invoice amount must be positive'],
    },

    financialYear: {
      type: String,
      required: [true, 'Financial year is required'],
      match: /^\d{4}-\d{4}$/,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'SUBMITTED',
    },

    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for invoice number and financial year
invoiceSchema.index(
  {
    invoiceNumber: 1,
    financialYear: 1,
  },
  {
    unique: true,
  }
);

// Index for faster queries
invoiceSchema.index({ financialYear: 1 });
invoiceSchema.index({ invoiceDate: 1 });
invoiceSchema.index({ createdBy: 1 });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;