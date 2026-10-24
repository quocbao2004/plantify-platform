import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { ButtonCommon, SelectCommon } from "@/components/common";
import { LABELS } from "@/constants/labels";
import {
  ProductQueryParams,
  CareLevel,
  LightRequirement,
  Category,
} from "../types";
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
}) => (
  <div className="bg-white border border-surface-200 rounded-md p-4 mb-6 space-y-4">
    <div className="flex items-center justify-between pb-3 border-b border-surface-100">
      <div className="flex items-center gap-2 text-surface-900 font-medium text-sm">
        <Filter className="w-4 h-4 text-surface-500" />
        <span>{LABELS.catalog.FILTERS}</span>
      </div>
      <ButtonCommon
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-surface-500 hover:text-surface-900 text-xs gap-1"
      >
        <RotateCcw className="w-3 h-3" />
        {LABELS.common.RESET}
      </ButtonCommon>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SelectCommon
        label={LABELS.catalog.CATEGORY}
        value={filters.category || ""}
        onChange={(event) =>
          onChange({ category: event.target.value || undefined, page: 1 })
        }
        options={[
          { value: "", label: LABELS.catalog.ALL_CATEGORIES },
          ...(categories || []).map((category) => ({
            value: category.id,
            label: category.name,
          })),
        ]}
        className="text-xs"
      />
      <SelectCommon
        label={LABELS.catalog.CARE_LEVEL}
        value={filters.care_level || ""}
        onChange={(event) =>
          onChange({
            care_level: (event.target.value as CareLevel) || undefined,
            page: 1,
          })
        }
        options={[
          { value: "", label: LABELS.catalog.ALL_CARE_LEVELS },
          ...Object.entries(CARE_LEVEL_LABELS).map(([value, label]) => ({
            value,
            label,
          })),
        ]}
        className="text-xs"
      />
      <SelectCommon
        label={LABELS.catalog.LIGHT_REQUIREMENT}
        value={filters.light_requirement || ""}
        onChange={(event) =>
          onChange({
            light_requirement:
              (event.target.value as LightRequirement) || undefined,
            page: 1,
          })
        }
        options={[
          { value: "", label: LABELS.catalog.ALL_LIGHT_REQUIREMENTS },
          ...Object.entries(LIGHT_REQUIREMENT_LABELS).map(([value, label]) => ({
            value,
            label,
          })),
        ]}
        className="text-xs"
      />
    </div>
  </div>
);
