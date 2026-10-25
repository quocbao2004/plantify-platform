import { ButtonCommon } from "@/components/common/ButtonCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { LABELS } from "@/constants/labels";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { ProductFilters } from "../components/ProductFilters";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts, useCategories } from "../hooks/useProducts";
import { ProductQueryParams, CareLevel, LightRequirement } from "../types";

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters: ProductQueryParams = {
    page: Math.max(1, Number(searchParams.get("page")) || 1),
    page_size: 12,
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    care_level: (searchParams.get("care_level") as CareLevel) || undefined,
    light_requirement:
      (searchParams.get("light_requirement") as LightRequirement) || undefined,
  };

  const { data: productsData, isLoading } = useProducts(filters);
  const { data: categoriesData } = useCategories();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = new FormData(e.currentTarget as HTMLFormElement).get(
      "search",
    );
    handleFilterChange({
      search: typeof value === "string" ? value.trim() || undefined : undefined,
      page: 1,
    });
  };

  const handleFilterChange = (updated: Partial<ProductQueryParams>) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      Object.entries(updated).forEach(([key, value]) => {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      });
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Hero Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">
            {LABELS.catalog.TITLE}
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            {LABELS.catalog.DESCRIPTION}
          </p>
        </div>

        <FormCommon
          onSubmit={handleSearchSubmit}
          className="relative w-full sm:w-72"
        >
          <TextFieldCommon
            type="text"
            key={filters.search || "all"}
            name="search"
            label={LABELS.catalog.SEARCH}
            hideLabel
            defaultValue={filters.search || ""}
            placeholder={LABELS.catalog.SEARCH_PLACEHOLDER}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-white text-surface-900 border border-surface-300 focus:outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600"
          />
          <Search className="w-4 h-4 text-surface-400 absolute left-3 top-2 pointer-events-none" />
        </FormCommon>
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
            {LABELS.catalog.SHOWING}{" "}
            <span className="font-medium text-surface-800">
              {productsData.results.length}
            </span>{" "}
            {LABELS.catalog.TOTAL_PREFIX}{" "}
            <span className="font-medium text-surface-800">
              {productsData.count}
            </span>{" "}
            {LABELS.catalog.PLANT_UNIT}
          </p>
          <div className="flex items-center gap-2">
            <ButtonCommon
              variant="outline"
              size="sm"
              disabled={!productsData.previous || (filters.page || 1) <= 1}
              onClick={() =>
                handleFilterChange({ page: (filters.page || 1) - 1 })
              }
            >
              {LABELS.catalog.PREVIOUS_PAGE}
            </ButtonCommon>
            <ButtonCommon
              variant="outline"
              size="sm"
              disabled={!productsData.next}
              onClick={() =>
                handleFilterChange({ page: (filters.page || 1) + 1 })
              }
            >
              {LABELS.catalog.NEXT_PAGE}
            </ButtonCommon>
          </div>
        </div>
      )}
    </div>
  );
};
