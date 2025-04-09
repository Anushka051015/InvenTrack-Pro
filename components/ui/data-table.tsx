import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
  }[];
  actions?: {
    label: string;
    onClick: (item: T) => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    className?: string;
  }[];
  itemsPerPage?: number;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  actions,
  itemsPerPage = 5,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentData = data.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      const middleStart = Math.max(2, currentPage - 1);
      const middleEnd = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed
      if (middleStart > 2) {
        pages.push("...");
      }
      
      // Add middle pages
      for (let i = middleStart; i <= middleEnd; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (middleEnd < totalPages - 1) {
        pages.push("...");
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div>
      {data.length === 0 ? (
        <div className="flex justify-center items-center py-10 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead key={index} className={column.className}>
                      {column.header}
                    </TableHead>
                  ))}
                  {actions && actions.length > 0 && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className={column.className}>
                        {typeof column.accessor === "function"
                          ? column.accessor(item)
                          : item[column.accessor] as React.ReactNode}
                      </TableCell>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {actions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              variant={action.variant || "default"}
                              size="sm"
                              onClick={() => action.onClick(item)}
                              className={action.className}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {endIndex} of {data.length} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {typeof page === "number" ? (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ) : (
                      <span className="px-2 flex items-center text-sm text-muted-foreground">
                        {page}
                      </span>
                    )}
                  </React.Fragment>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
