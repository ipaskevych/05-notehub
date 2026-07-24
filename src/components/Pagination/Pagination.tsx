import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  return (
    <div className={css.pagination}>
      <button 
        disabled={forcePage === 0} 
        onClick={() => onPageChange({ selected: forcePage - 1 })}
      >
        &lt;
      </button>
      
      <span className={css.activePage}> Page {forcePage + 1} of {pageCount} </span>
      
      <button 
        disabled={forcePage >= pageCount - 1} 
        onClick={() => onPageChange({ selected: forcePage + 1 })}
      >
        &gt;
      </button>
    </div>
  );
}