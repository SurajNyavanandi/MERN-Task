import { useEffect, useState } from "react";
import { getInvoices, createInvoice, deleteInvoice } from "../api/invoiceApi";
import InvoiceForm from "../components/InvoiceForm";
import InvoiceTable from "../components/InvoiceTable";
import InvoiceFilters from "../components/InvoiceFilters";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";

export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getInvoices(filters);
      const data = res.data?.data || res.data?.invoices || res.data || [];
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filters]);

  const handleCreate = async (data) => {
    try {
      await createInvoice(data);
      fetchData();
    } catch (err) {
      setError("Failed to create invoice");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id);
      fetchData();
    } catch (err) {
      setError("Failed to delete invoice");
    }
  };

  if (loading && invoices.length === 0) return <Loader />;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Invoice Dashboard</h2>
        <p className="text-gray-600 mb-6">Manage and track your invoices</p>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        <InvoiceFilters setFilters={setFilters} />
        <InvoiceForm onSubmit={handleCreate} />
        {invoices.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">No invoices found. Create your first invoice above.</p>
          </div>
        ) : (
          <InvoiceTable invoices={invoices} onDelete={handleDelete} fetchInvoices={fetchData} />
        )}
      </div>
    </MainLayout>
  );
}