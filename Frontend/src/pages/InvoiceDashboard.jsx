import { useEffect, useState } from "react";
import {
  getInvoices,
  createInvoice,
  deleteInvoice,
} from "../api/invoiceApi";

import InvoiceForm from "../components/InvoiceForm";
import InvoiceTable from "../components/InvoiceTable";
import InvoiceFilters from "../components/InvoiceFilters";
import Navbar from "../components/Navbar";

export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchData = async () => {
    try {
      const res = await getInvoices(filters);

      // backend-safe handling
      const data =
        res.data?.data ||
        res.data?.invoices ||
        res.data ||
        [];

      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Fetch error:", err);
      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleCreate = async (data) => {
    try {
      await createInvoice(data);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <Navbar />

      <h2>Invoice Dashboard</h2>

      <InvoiceFilters setFilters={setFilters} />

      <InvoiceForm onSubmit={handleCreate} />

      <hr />

      <h3>Invoices</h3>

      {invoices.length === 0 ? (
        <p>No invoices found</p>
      ) : (
        <InvoiceTable invoices={invoices} onDelete={handleDelete} />
      )}
    </div>
  );
}