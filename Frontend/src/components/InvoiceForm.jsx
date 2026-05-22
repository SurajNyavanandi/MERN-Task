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
  };

  return (
    <div>
      <h3>Create Invoice</h3>

      <input
        placeholder="Invoice Number"
        onChange={(e) =>
          setForm({ ...form, invoiceNumber: e.target.value })
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setForm({ ...form, invoiceDate: e.target.value })
        }
      />

      <input
        placeholder="Amount"
        onChange={(e) =>
          setForm({ ...form, invoiceAmount: e.target.value })
        }
      />

      <input
        placeholder="Financial Year (2026-2027)"
        onChange={(e) =>
          setForm({ ...form, financialYear: e.target.value })
        }
      />

      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}