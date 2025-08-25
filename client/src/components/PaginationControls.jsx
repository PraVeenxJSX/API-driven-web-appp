import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-controls">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        &larr; Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default PaginationControls;