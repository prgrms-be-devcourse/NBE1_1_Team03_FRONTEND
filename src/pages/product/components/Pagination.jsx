// src/components/common/Pagination.jsx
import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        이전
      </button>
      {[...Array(totalPages).keys()].map((page) => (
        <button
          key={page + 1}
          className={currentPage === page + 1 ? "active" : ""}
          onClick={() => onPageChange(page + 1)}
        >
          {page + 1}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        다음
      </button>
    </div>
  );
};

export default Pagination;
