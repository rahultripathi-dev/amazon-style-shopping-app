import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

const btnBase = 'px-3 py-1.5 rounded-md border cursor-pointer text-sm [&:hover:not(:disabled)]:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60';
const btnDefault = 'bg-white text-gray-900 font-normal border-gray-200';
const btnActive = 'bg-blue-600 text-white font-semibold border-blue-600';

const Pagination = React.memo(function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-1.5 py-6 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${btnDefault}`}
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-gray-500">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnDefault}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${btnDefault}`}
      >
        Next →
      </button>
    </div>
  );
});

export default Pagination;
