 
import { FiCopy } from "react-icons/fi";

const TransactionsTable = ({ rows, loading, error }) => {
  const handleCopy = (text) => {
    if (!text) return;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="table-empty">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-empty table-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="table-empty">
        <span>No results found. Try changing filters or search.</span>
      </div>
    );
  }

  return (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Date</th>
          <th>Customer ID</th>
          <th>Customer name</th>
          <th>Phone Number</th>
          <th>Gender</th>
          <th>Age</th>
          <th>Product Category</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row["Transaction ID"] || row.transactionId}>
            <td>{row["Transaction ID"] || row.transactionId}</td>
            <td>{row.Date || row.date}</td>
            <td>{row["Customer ID"] || row.customerId}</td>
            <td>{row["Customer Name"] || row.customerName}</td>
            <td>
              <div className="cell-with-copy">
                <span className="phone-value">
                  {row["Phone Number"] || row.phoneNumber}
                </span>
                <button
                  className="copy-button"
                  type="button"
                  title="Copy phone number"
                  onClick={() => handleCopy(row["Phone Number"] || row.phoneNumber)}
                >
                  <FiCopy />
                </button>
              </div>
            </td>
            <td>{row.Gender || row.gender}</td>
            <td>{row.Age || row.age}</td>
            <td>{row["Product Category"] || row.productCategory}</td>
            <td>{row.Quantity || row.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
