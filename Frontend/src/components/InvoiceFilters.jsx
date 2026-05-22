import { useState } from "react";

export default function InvoiceFilters({ setFilters }) {
  const [fy, setFy] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStart] = useState("");
  const [endDate, setEnd] = useState("");

  const applyFilters = () => {
    setFilters({
      financialYear: fy,
      invoiceNumber: search,
      startDate,
      endDate,
    });
  };

  return (
    <div>
      <h3>Filters</h3>

      <input
        placeholder="Financial Year"
        onChange={(e) => setFy(e.target.value)}
      />

      <input
        placeholder="Invoice Number"
        onChange={(e) => setSearch(e.target.value)}
      />

      <input type="date" onChange={(e) => setStart(e.target.value)} />
      <input type="date" onChange={(e) => setEnd(e.target.value)} />

      <button onClick={applyFilters}>Apply</button>
    </div>
  );
}