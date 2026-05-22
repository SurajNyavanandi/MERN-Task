export default function InvoiceTable({ invoices, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-800 p-6 border-b border-gray-200">
        Invoices
      </h3>

      {invoices?.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No invoices found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Financial Year
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {invoices?.map((inv) => (
                <tr key={inv._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{inv.invoiceDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">₹{inv.invoiceAmount}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{inv.financialYear}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(inv._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-4 rounded transition-colors text-sm"
                    >
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