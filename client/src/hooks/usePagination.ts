import { useState, useCallback } from 'react';

interface PaginationOptions {
  initialPage?: number;
}

interface PaginationResult {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  resetPage: () => void;
  hasNextPage: (totalPages: number) => boolean;
  hasPrevPage: () => boolean;
}

/**
 * A hook for managing pagination state
 */
export function usePagination({ initialPage = 1 }: PaginationOptions = {}): PaginationResult {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const hasNextPage = useCallback(
    (totalPages: number) => currentPage < totalPages,
    [currentPage]
  );

  const hasPrevPage = useCallback(() => currentPage > 1, [currentPage]);

  return {
    currentPage,
    setCurrentPage,
    nextPage,
    prevPage,
    resetPage,
    hasNextPage,
    hasPrevPage,
  };
}
