import { useState } from 'react';
import API from '../api/axios';

export default function InvoiceTable({ invoices, onDelete, fetchInvoices }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (invoice) => {
    setEditingId(invoice._id);
    setEditForm({
      invoiceAmount: invoice.invoiceAmount,
      status: invoice.status,
      description: invoice.description || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await API.put(`/api/invoices/${id}`, editForm);
      setEditingId(null);
      fetchInvoices();
    } catch (error) {
      alert('Failed to update invoice');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'bg-gray-200 text-gray-800',
      SUBMITTED: 'bg-blue-200 text-blue-800',
      APPROVED: 'bg-green-200 text-green-800',
      REJECTED: 'bg-red-200 text-red-800'
    };
    return colors[status] || 'bg-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-800 p-6 border-b">Invoices</h3>
      {invoices?.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No invoices found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Invoice #</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">FY</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((inv) => (
                <tr key={inv._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {editingId === inv._id ? (
                      <input
                        type="number"
                        value={editForm.invoiceAmount}
                        onChange={(e) => setEditForm({ ...editForm, invoiceAmount: e.target.value })}
                        className="border rounded px-2 py-1 w-24"
                      />
                    ) : (
                      `₹${inv.invoiceAmount}`
                    )}
                  </td>
                  <td className="px-6 py-4">{inv.financialYear}</td>
                  <td className="px-6 py-4">
                    {editingId === inv._id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="border rounded px-2 py-1"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    {editingId === inv._id ? (
                      <button onClick={() => saveEdit(inv._id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => startEdit(inv)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                        Edit
                      </button>
                    )}
                    <button onClick={() => onDelete(inv._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}