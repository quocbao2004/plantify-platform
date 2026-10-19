import React, { useState } from "react";
import { Search } from "lucide-react";
import { ProductFilters } from "../components/ProductFilters";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts, useCategories } from "../hooks/useProducts";
import { ProductQueryParams } from "../types";
import { Button } from "@/components/ui";

export const ProductListPage: React.FC = () => {
  const [filters, setFilters] = useState<ProductQueryParams>({
    page: 1,
    page_size: 12,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data: productsData, isLoading } = useProducts(filters);
  const { data: categoriesData } = useCategories();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchTerm.trim() || undefined, page: 1 }));
  };

  const handleFilterChange = (updated: Partial<ProductQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ page: 1, page_size: 12 });
  };

  return (
    <div className="space-y-6">
      {/* Hero Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Danh mục cây cảnh</h1>
          <p className="text-xs text-surface-500 mt-1">
            Khám phá bộ sưu tập cây nội thất, cây phong thủy và cây văn phòng
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên cây..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-white text-surface-900 border border-surface-300 focus:outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600"
          />
          <Search className="w-4 h-4 text-surface-400 absolute left-3 top-2 pointer-events-none" />
        </form>
      </div>

      {/* Filters Accordion/Box */}
      <ProductFilters
        filters={filters}
        categories={categoriesData?.results}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Product Grid */}
      <ProductGrid products={productsData?.results} isLoading={isLoading} />

      {/* Pagination Controls */}
      {productsData && productsData.count > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-surface-200">
          <p className="text-xs text-surface-500">
            Hiển thị <span className="font-medium text-surface-800">{productsData.results.length}</span> trên tổng số{" "}
            <span className="font-medium text-surface-800">{productsData.count}</span> cây cảnh
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!productsData.previous || (filters.page || 1) <= 1}
              onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!productsData.next}
              onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
