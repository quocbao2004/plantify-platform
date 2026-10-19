import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductQueryParams, CareLevel, LightRequirement, Category } from "../types";
import { CARE_LEVEL_LABELS, LIGHT_REQUIREMENT_LABELS } from "../constants";

interface ProductFiltersProps {
  filters: ProductQueryParams;
  categories?: Category[];
  onChange: (updated: Partial<ProductQueryParams>) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  categories,
  onChange,
  onReset,
}) => {
  return (
    <div className="bg-white border border-surface-200 rounded-md p-4 mb-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-surface-100">
        <div className="flex items-center gap-2 text-surface-900 font-medium text-sm">
          <Filter className="w-4 h-4 text-surface-500" />
          <span>Bộ lọc sản phẩm</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-surface-500 hover:text-surface-900 text-xs gap-1">
          <RotateCcw className="w-3 h-3" />
          Đặt lại
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category filter */}
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Danh mục</label>
          <select
            value={filters.category || ""}
            onChange={(e) => onChange({ category: e.target.value || undefined, page: 1 })}
            className="w-full px-3 py-1.5 text-xs rounded bg-white text-surface-900 border border-surface-300 focus:outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600"
          >
            <option value="">Tất cả danh mục</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.slug || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Care Level filter */}
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Mức độ chăm sóc</label>
          <select
            value={filters.care_level || ""}
            onChange={(e) => onChange({ care_level: (e.target.value as CareLevel) || undefined, page: 1 })}
            className="w-full px-3 py-1.5 text-xs rounded bg-white text-surface-900 border border-surface-300 focus:outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600"
          >
            <option value="">Tất cả mức độ</option>
            {Object.entries(CARE_LEVEL_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Light Requirement filter */}
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Yêu cầu ánh sáng</label>
          <select
            value={filters.light_requirement || ""}
            onChange={(e) => onChange({ light_requirement: (e.target.value as LightRequirement) || undefined, page: 1 })}
            className="w-full px-3 py-1.5 text-xs rounded bg-white text-surface-900 border border-surface-300 focus:outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600"
          >
            <option value="">Tất cả yêu cầu</option>
            {Object.entries(LIGHT_REQUIREMENT_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
