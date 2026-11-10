import { LABELS } from "@/constants/labels";
import { BadgeVariant } from "@/components/common/BadgeCommon";
import { AdminOrderStatus } from "../types";

export interface StatusConfig {
  label: string;
  variant: BadgeVariant;
  dotColor: string;
  badgeClassName?: string;
}

export const ADMIN_ORDER_STATUSES: readonly AdminOrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
] as const;

export const ADMIN_ORDER_STATUS_CONFIG: Record<AdminOrderStatus, StatusConfig> = {
  PENDING: {
    label: LABELS.admin.ORDERS_STATUS_PENDING,
    variant: "warning",
    dotColor: "bg-amber-500",
  },
  PAID: {
    label: LABELS.admin.ORDERS_STATUS_PAID,
    variant: "info",
    dotColor: "bg-sky-500",
  },
  PROCESSING: {
    label: LABELS.admin.ORDERS_STATUS_PROCESSING,
    variant: "info",
    dotColor: "bg-blue-500",
  },
  DELIVERING: {
    label: LABELS.admin.ORDERS_STATUS_DELIVERING,
    variant: "info",
    dotColor: "bg-indigo-500",
  },
  COMPLETED: {
    label: LABELS.admin.ORDERS_STATUS_COMPLETED,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  CANCELLED: {
    label: LABELS.admin.ORDERS_STATUS_CANCELLED,
    variant: "error",
    dotColor: "bg-rose-500",
  },
};

export const ADMIN_ORDER_FILTER_OPTIONS = [
  { value: "ALL", label: LABELS.admin.ORDERS_FILTER_ALL },
  { value: "PENDING", label: LABELS.admin.ORDERS_STATUS_PENDING },
  { value: "PAID", label: LABELS.admin.ORDERS_STATUS_PAID },
  { value: "PROCESSING", label: LABELS.admin.ORDERS_STATUS_PROCESSING },
  { value: "DELIVERING", label: LABELS.admin.ORDERS_STATUS_DELIVERING },
  { value: "COMPLETED", label: LABELS.admin.ORDERS_STATUS_COMPLETED },
  { value: "CANCELLED", label: LABELS.admin.ORDERS_STATUS_CANCELLED },
] as const;

export const ADMIN_ORDER_STATUS_SELECT_OPTIONS = [
  { value: "PENDING", label: LABELS.admin.ORDERS_STATUS_PENDING },
  { value: "PAID", label: LABELS.admin.ORDERS_STATUS_PAID },
  { value: "PROCESSING", label: LABELS.admin.ORDERS_STATUS_PROCESSING },
  { value: "DELIVERING", label: LABELS.admin.ORDERS_STATUS_DELIVERING },
  { value: "COMPLETED", label: LABELS.admin.ORDERS_STATUS_COMPLETED },
  { value: "CANCELLED", label: LABELS.admin.ORDERS_STATUS_CANCELLED },
] as const;

export const ADMIN_ORDER_TABS = [
  { key: "ALL", label: LABELS.admin.ORDERS_TAB_ALL },
  { key: "PENDING", label: LABELS.admin.ORDERS_TAB_PENDING },
  { key: "PROCESSING", label: LABELS.admin.ORDERS_TAB_PROCESSING },
  { key: "DELIVERING", label: LABELS.admin.ORDERS_TAB_DELIVERING },
  { key: "COMPLETED", label: LABELS.admin.ORDERS_TAB_COMPLETED },
  { key: "CANCELLED", label: LABELS.admin.ORDERS_TAB_CANCELLED },
] as const;
