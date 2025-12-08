// src/components/SummaryCards.jsx
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const SummaryCards = ({ summary }) => {
  const { totalUnitsSold, totalAmount, totalDiscount } = summary || {};

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card-top">
          <div className="summary-label">Total units sold</div>
          <span className="summary-info">i</span>
        </div>
        <div className="summary-value-row">
          <div className="summary-value">{totalUnitsSold ?? 0}</div>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-top">
          <div className="summary-label">Total Amount</div>
          <span className="summary-info">i</span>
        </div>
        <div className="summary-value-row">
          <div className="summary-value">{formatCurrency(totalAmount)}</div>
          <div className="summary-subtext">(19 SRs)</div>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-top">
          <div className="summary-label">Total Discount</div>
          <span className="summary-info">i</span>
        </div>
        <div className="summary-value-row">
          <div className="summary-value">{formatCurrency(totalDiscount)}</div>
          <div className="summary-subtext">(45 SRs)</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
