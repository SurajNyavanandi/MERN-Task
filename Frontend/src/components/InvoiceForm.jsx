import { useState } from "react";

export default function InvoiceForm({ onSubmit }) {
  const [form, setForm] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    invoiceAmount: "",
    financialYear: "",
  });

  const handleSubmit = () => {
    onSubmit(form);
    setForm({
      invoiceNumber: "",
      invoiceDate: "",
      invoiceAmount: "",
      financialYear: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Invoice</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          placeholder="Invoice Number"
          value={form.invoiceNumber}
          onChange={(e) =>
            setForm({ ...form, invoiceNumber: e.target.value })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="date"
          value={form.invoiceDate}
          onChange={(e) =>
            setForm({ ...form, invoiceDate: e.target.value })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          placeholder="Amount"
          type="number"
          value={form.invoiceAmount}
          onChange={(e) =>
            setForm({ ...form, invoiceAmount: e.target.value })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          placeholder="Financial Year (2026-2027)"
          value={form.financialYear}
          onChange={(e) =>
            setForm({ ...form, financialYear: e.target.value })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        Create Invoice
      </button>
    </div>
  );
}