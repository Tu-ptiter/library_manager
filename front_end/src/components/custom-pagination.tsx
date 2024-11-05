// Create new file: components/custom-pagination.tsx
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    // Always show first page
    items.push(1);
    
    if (currentPage > 3) {
      items.push('ellipsis');
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!items.includes(i)) {
        items.push(i);
      }
    }
    
    if (currentPage < totalPages - 2) {
      items.push('ellipsis');
    }
    
    // Always show last page
    if (totalPages > 1) {
      items.push(totalPages);
    }
    
    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {generatePaginationItems().map((item, index) => (
          <PaginationItem key={index}>
            {item === 'ellipsis' ? (
              <span className="px-4">...</span>
            ) : (
              <PaginationLink
                isActive={currentPage === item}
                onClick={() => onPageChange(item as number)}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;