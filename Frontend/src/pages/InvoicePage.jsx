import { useEffect, useState } from 'react';

import API from '../api/axios';

import MainLayout from '../layouts/MainLayout';

import InvoiceForm from '../components/InvoiceForm';
import InvoiceTable from '../components/InvoiceTable';

function InvoicePage() {

  const [invoices, setInvoices] = useState([]);

  const [editingInvoice, setEditingInvoice]
    = useState(null);

  const [search, setSearch]
    = useState('');

  const fetchInvoices = async () => {

    try {

      const { data } = await API.get(
        `/invoices?invoiceNumber=${search}`
      );

      setInvoices(data.invoices);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [search]);

  const deleteInvoice = async (id) => {

    try {

      await API.delete(
        `/invoices/${id}`
      );

      fetchInvoices();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <MainLayout>

      <InvoiceForm
        fetchInvoices={fetchInvoices}
        editingInvoice={editingInvoice}
        setEditingInvoice={setEditingInvoice}
      />

      <div className="bg-white p-5 rounded-xl shadow mb-6 flex gap-4">

        <input
          type="text"
          placeholder="Search Invoice Number"
          className="border p-3 rounded w-full"
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <InvoiceTable
        invoices={invoices}
        deleteInvoice={deleteInvoice}
        setEditingInvoice={setEditingInvoice}
      />

    </MainLayout>
  );
}

export default InvoicePage;