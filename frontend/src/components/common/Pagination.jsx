import React from 'react';

const Pagination = ({
  infoLabel,
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  onFirst,
  onPrev,
  onNext,
  onLast,
  pageSize,
  onPageSizeChange,
  pageSizeId,
}) => (
  <div className="pagination-container">
    <div className="pagination-info">{infoLabel}</div>
    <div className="pagination-controls">
      <div className="page-size-selector">
        <label htmlFor={pageSizeId}>Show:</label>
        <select id={pageSizeId} value={pageSize} onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))} className="page-size-select">
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>per page</span>
      </div>
      <div className="pagination-buttons">
        <button onClick={onFirst} disabled={!hasPrevious} className="pagination-btn">First</button>
        <button onClick={onPrev} disabled={!hasPrevious} className="pagination-btn">Previous</button>
        <span className="page-info">Page {currentPage} of {totalPages}</span>
        <button onClick={onNext} disabled={!hasNext} className="pagination-btn">Next</button>
        <button onClick={onLast} disabled={!hasNext} className="pagination-btn">Last</button>
      </div>
    </div>
  </div>
);

export default Pagination;


