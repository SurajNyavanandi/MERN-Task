import Invoice from '../models/Invoice.js';
import User from '../models/User.js';

export const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      financialYear,
      description,
    } = req.body;

    // Validation
    if (!invoiceNumber || !invoiceDate || !invoiceAmount || !financialYear) {
      return res.status(400).json({
        success: false,
        message:
          'Invoice number, date, amount, and financial year are required',
      });
    }

    // Check duplicate invoice number in same FY
    const existingInvoice = await Invoice.findOne({
      invoiceNumber,
      financialYear,
    });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message:
          'Invoice number already exists in this financial year',
      });
    }

    // Get all invoices in this FY to validate date range
    const allInvoicesInFY = await Invoice.find({
      financialYear,
    }).sort({ invoiceNumber: 1 });

    const currentDate = new Date(invoiceDate);

    // Find where this invoice should fit in the sequence
    let isValidDate = true;
    let errorMessage = '';

    for (let i = 0; i < allInvoicesInFY.length; i++) {
      const invoice = allInvoicesInFY[i];
      const invoiceDate_existing = new Date(invoice.invoiceDate);

      // Check if invoice number is between current and existing
      if (invoiceNumber < invoice.invoiceNumber) {
        // Current invoice comes before this one
        // So its date should not exceed this invoice's date
        if (currentDate > invoiceDate_existing) {
          isValidDate = false;
          errorMessage = `Invoice date must be less than or equal to invoice #${invoice.invoiceNumber} (${invoice.invoiceDate.toDateString()})`;
          break;
        }
        break;
      } else if (invoiceNumber > invoice.invoiceNumber) {
        // Current invoice comes after this one
        // So its date should not be less than this invoice's date
        if (currentDate < invoiceDate_existing) {
          isValidDate = false;
          errorMessage = `Invoice date must be greater than or equal to invoice #${invoice.invoiceNumber} (${invoice.invoiceDate.toDateString()})`;
          break;
        }
      }
    }

    if (!isValidDate) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    // Create invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      financialYear,
      description: description || '',
      createdBy: req.user.id,
    });

    // Populate creator info
    await invoice.populate('createdBy', 'userId username email role');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice,
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating invoice',
    });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by financial year
    if (req.query.financialYear) {
      filter.financialYear = req.query.financialYear;
    }

    // Search by invoice number
    if (req.query.invoiceNumber) {
      filter.invoiceNumber = Number(req.query.invoiceNumber);
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      filter.invoiceDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get total count
    const total = await Invoice.countDocuments(filter);

    // Get paginated invoices
    const invoices = await Invoice.find(filter)
      .populate('createdBy', 'userId username email role')
      .sort({ invoiceNumber: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalInvoices: total,
        limit: limit,
      },
      invoices,
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching invoices',
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      'createdBy',
      'userId username email role'
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching invoice',
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { invoiceAmount, description, status } = req.body;

    // Find invoice
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Check authorization (only creator or admin can update)
    if (
      invoice.createdBy.toString() !== req.user.id &&
      req.user.role !== 'ADMIN' &&
      req.user.role !== 'SUPER_ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this invoice',
      });
    }

    // Update allowed fields
    if (invoiceAmount !== undefined) {
      if (invoiceAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invoice amount must be positive',
        });
      }
      invoice.invoiceAmount = invoiceAmount;
    }

    if (description !== undefined) {
      invoice.description = description;
    }

    if (status !== undefined) {
      if (!['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
        });
      }
      invoice.status = status;
    }

    await invoice.save();

    await invoice.populate('createdBy', 'userId username email role');

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      invoice,
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating invoice',
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Check authorization
    if (
      invoice.createdBy.toString() !== req.user.id &&
      req.user.role !== 'ADMIN' &&
      req.user.role !== 'SUPER_ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this invoice',
      });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting invoice',
    });
  }
};

export const deleteMultipleInvoices = async (req, res) => {
  try {
    const { invoiceIds } = req.body;

    if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invoice IDs provided',
      });
    }

    // Check authorization for each invoice
    const invoices = await Invoice.find({ _id: { $in: invoiceIds } });

    for (const invoice of invoices) {
      if (
        invoice.createdBy.toString() !== req.user.id &&
        req.user.role !== 'ADMIN' &&
        req.user.role !== 'SUPER_ADMIN'
      ) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete some invoices',
        });
      }
    }

    const result = await Invoice.deleteMany({ _id: { $in: invoiceIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} invoice(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Delete multiple invoices error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting invoices',
    });
  }
};

// Get financial years available
export const getFinancialYears = async (req, res) => {
  try {
    const financialYears = await Invoice.distinct('financialYear').sort();

    res.status(200).json({
      success: true,
      financialYears,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};