import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage === 2) endPage = Math.min(4, totalPages - 1);
      if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3);

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageClick = (page: number | string) => {
    if (disabled || typeof page !== "number") return;
    onPageChange(page);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-8 gap-1">
      <button
        onClick={() =>
          !disabled && currentPage > 1 && onPageChange(currentPage - 1)
        }
        className={`p-2 rounded-md flex items-center justify-center ${
          disabled || currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        disabled={disabled || currentPage === 1}
        aria-label={t("pagination.previous")}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={`page-${index}`}
          onClick={() => handlePageClick(page)}
          className={`min-w-[36px] h-9 px-3 flex items-center justify-center rounded-md transition-colors ${
            page === currentPage
              ? "bg-emerald-100 text-emerald-700 font-medium"
              : typeof page === "number"
                ? `text-gray-700 hover:bg-gray-100 ${disabled ? "cursor-not-allowed opacity-60" : ""}`
                : "text-gray-400 cursor-default"
          }`}
          disabled={disabled || typeof page !== "number"}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() =>
          !disabled && currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className={`p-2 rounded-md flex items-center justify-center ${
          disabled || currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        disabled={disabled || currentPage === totalPages}
        aria-label={t("pagination.next")}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
