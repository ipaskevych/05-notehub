import type { ComponentType } from "react";
import importReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from './Pagination.module.css';

type ModuleWithDefault<T> = { default: T };

// Шаблон ментора для правильного импорта библиотеки в Vite
const ReactPaginate = (
  importReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel={'<'}
      nextLabel={'>'}
      pageCount={pageCount}
      forcePage={forcePage}
      onPageChange={onPageChange}
      containerClassName={css.pagination}
      activeClassName={css.active} // ИСПРАВЛЕНО: заменили css.activePage на css.active
    />
  );
}