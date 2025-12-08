 
const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ‹
      </button>

      <div className="pagination-pill">
        <span>{page}</span>
        <span className="pagination-separator">/</span>
        <span>{totalPages || 1}</span>
      </div>

      <button
        className="pagination-arrow"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
