import Invoice from '../models/Invoice.js';

export const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      financialYear,
    } = req.body;

    // CHECK DUPLICATE IN SAME FY

    const existingInvoice = await Invoice.findOne({
      invoiceNumber,
      financialYear,
    });

    if (existingInvoice) {
      return res.status(400).json({
        message:
          'Invoice number already exists in this financial year',
      });
    }

    // PREVIOUS INVOICE

    const previousInvoice = await Invoice.findOne({
      financialYear,
      invoiceNumber: { $lt: invoiceNumber },
    }).sort({ invoiceNumber: -1 });

    // NEXT INVOICE

    const nextInvoice = await Invoice.findOne({
      financialYear,
      invoiceNumber: { $gt: invoiceNumber },
    }).sort({ invoiceNumber: 1 });

    const currentDate = new Date(invoiceDate);

    // VALIDATE PREVIOUS DATE

    if (
      previousInvoice &&
      currentDate <
        new Date(previousInvoice.invoiceDate)
    ) {
      return res.status(400).json({
        message:
          'Invoice date must be greater than previous invoice date',
      });
    }

    // VALIDATE NEXT DATE

    if (
      nextInvoice &&
      currentDate >
        new Date(nextInvoice.invoiceDate)
    ) {
      return res.status(400).json({
        message:
          'Invoice date must be less than next invoice date',
      });
    }

    const invoice = await Invoice.create({
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      financialYear,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const filter = {};

    // FILTER BY FY

    if (req.query.financialYear) {
      filter.financialYear =
        req.query.financialYear;
    }

    // SEARCH BY INVOICE NUMBER

    if (req.query.invoiceNumber) {
      filter.invoiceNumber =
        req.query.invoiceNumber;
    }

    // FILTER DATE RANGE

    if (
      req.query.startDate &&
      req.query.endDate
    ) {
      filter.invoiceDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const invoices = await Invoice.find(filter)
      .sort({ invoiceNumber: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Invoice.countDocuments(
      filter
    );

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInvoices: total,
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice =
      await Invoice.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found',
      });
    }

    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Invoice deleted',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};