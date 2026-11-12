import { LABELS } from "@/constants/labels";
import { BadgeVariant } from "@/components/common/BadgeCommon";

export interface PlantStatusConfig {
  label: string;
  variant: BadgeVariant;
  dotColor: string;
}

export const ADMIN_PLANT_STATUS_CONFIG: Record<string, PlantStatusConfig> = {
  ACTIVE: {
    label: LABELS.admin.PLANTS_STATUS_ACTIVE,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  INACTIVE: {
    label: LABELS.admin.PLANTS_STATUS_INACTIVE,
    variant: "neutral",
    dotColor: "bg-surface-400",
  },
};

export const ADMIN_PLANT_STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: LABELS.admin.PLANTS_FILTER_ALL_STATUS },
  { value: "ACTIVE", label: LABELS.admin.PLANTS_STATUS_ACTIVE },
  { value: "INACTIVE", label: LABELS.admin.PLANTS_STATUS_INACTIVE },
] as const;

export const ADMIN_PLANT_TABS = [
  { key: "ALL", label: LABELS.admin.PLANTS_TAB_ALL },
  { key: "ACTIVE", label: LABELS.admin.PLANTS_TAB_ACTIVE },
  { key: "INACTIVE", label: LABELS.admin.PLANTS_TAB_INACTIVE },
] as const;
