export default function InvoiceTable({ invoices, onDelete }) {
  return (
    <div>
      <h3>Invoices</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Number</th>
            <th>Date</th>
            <th>Amount</th>
            <th>FY</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {invoices?.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.invoiceNumber}</td>
              <td>{inv.invoiceDate}</td>
              <td>{inv.invoiceAmount}</td>
              <td>{inv.financialYear}</td>
              <td>
                <button onClick={() => onDelete(inv._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}