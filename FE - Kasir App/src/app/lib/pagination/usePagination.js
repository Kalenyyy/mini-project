'use client';
import { useState, useMemo } from "react";

export default function usePagination(data = [], itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage]
  );

  const offset = currentPage * itemsPerPage;
  const currentItems = useMemo(
    () => data.slice(offset, offset + itemsPerPage),
    [data, offset, itemsPerPage]
  );

  const pages = useMemo(
    () => Array.from({ length: pageCount }, (_, i) => i + 1),
    [pageCount]
  );

  const canGoNext = currentPage < pageCount - 1;
  const canGoPrev = currentPage > 0;

  const goToPage = (page) => {
    if (page >= 0 && page < pageCount) setCurrentPage(page);
  };

  return {
    currentPage,
    setCurrentPage: goToPage,
    currentItems,
    pageCount,
    pages,
    canGoNext,
    canGoPrev,
    goToNext: () => goToPage(currentPage + 1),
    goToPrev: () => goToPage(currentPage - 1),
  };
}
