import { LABELS } from "@/constants/labels";
import { BadgeVariant } from "@/components/common/BadgeCommon";
import { AdminShipmentStatus } from "../types";

export const ADMIN_SHIPMENT_STATUS = {
  PENDING: "PENDING",
  UNASSIGNED: "UNASSIGNED",
  ASSIGNED: "ASSIGNED",
  SHIPPING: "SHIPPING",
  DELIVERING: "DELIVERING",
  DELIVERED_PENDING_CONFIRM: "DELIVERED_PENDING_CONFIRM",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
} as const satisfies Record<string, AdminShipmentStatus>;

export interface ShipmentStatusConfig {
  label: string;
  variant: BadgeVariant;
  dotColor: string;
  badgeClassName?: string;
}

export const ADMIN_SHIPMENT_STATUS_CONFIG: Record<AdminShipmentStatus, ShipmentStatusConfig> = {
  PENDING: {
    label: LABELS.admin.SHIPPING_STATUS_UNASSIGNED,
    variant: "warning",
    dotColor: "bg-amber-500",
  },
  UNASSIGNED: {
    label: LABELS.admin.SHIPPING_STATUS_UNASSIGNED,
    variant: "warning",
    dotColor: "bg-amber-500",
  },
  ASSIGNED: {
    label: LABELS.admin.SHIPPING_STATUS_ASSIGNED,
    variant: "info",
    dotColor: "bg-sky-500",
  },
  SHIPPING: {
    label: LABELS.admin.SHIPPING_STATUS_DELIVERING,
    variant: "info",
    dotColor: "bg-indigo-500",
  },
  DELIVERING: {
    label: LABELS.admin.SHIPPING_STATUS_DELIVERING,
    variant: "info",
    dotColor: "bg-indigo-500",
  },
  DELIVERED_PENDING_CONFIRM: {
    label: LABELS.admin.SHIPPING_STATUS_DELIVERED_PENDING,
    variant: "warning",
    dotColor: "bg-purple-500",
  },
  DELIVERED: {
    label: LABELS.admin.SHIPPING_STATUS_COMPLETED,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  COMPLETED: {
    label: LABELS.admin.SHIPPING_STATUS_COMPLETED,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  CANCELLED: {
    label: LABELS.admin.SHIPPING_STATUS_FAILED,
    variant: "error",
    dotColor: "bg-rose-500",
  },
  FAILED: {
    label: LABELS.admin.SHIPPING_STATUS_FAILED,
    variant: "error",
    dotColor: "bg-rose-500",
  },
};

export const ADMIN_SHIPMENT_TABS = [
  { key: "ALL", label: LABELS.admin.SHIPPING_TAB_ALL },
  { key: "UNASSIGNED", label: LABELS.admin.SHIPPING_TAB_UNASSIGNED },
  { key: "DELIVERING", label: LABELS.admin.SHIPPING_TAB_DELIVERING },
  { key: "DELIVERED_PENDING_CONFIRM", label: LABELS.admin.SHIPPING_TAB_DELIVERED_PENDING },
  { key: "COMPLETED", label: LABELS.admin.SHIPPING_TAB_COMPLETED },
  { key: "FAILED", label: LABELS.admin.SHIPPING_TAB_FAILED },
] as const;

export const ADMIN_SHIPMENT_FILTER_STATUS_OPTIONS = [
  { value: "ALL", label: LABELS.admin.SHIPPING_FILTER_ALL_STATUS },
  { value: "UNASSIGNED", label: LABELS.admin.SHIPPING_STATUS_UNASSIGNED },
  { value: "ASSIGNED", label: LABELS.admin.SHIPPING_STATUS_ASSIGNED },
  { value: "DELIVERING", label: LABELS.admin.SHIPPING_STATUS_DELIVERING },
  { value: "DELIVERED_PENDING_CONFIRM", label: LABELS.admin.SHIPPING_STATUS_DELIVERED_PENDING },
  { value: "COMPLETED", label: LABELS.admin.SHIPPING_STATUS_COMPLETED },
  { value: "FAILED", label: LABELS.admin.SHIPPING_STATUS_FAILED },
] as const;
