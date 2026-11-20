import { LABELS } from "@/constants/labels";
import { BadgeVariant } from "@/components/common/BadgeCommon";
import { AdminReturnStatus, AdminReturnType, AdminReturnReason } from "../types";

export interface ReturnStatusConfig {
  label: string;
  variant: BadgeVariant;
  dotColor: string;
  badgeClassName?: string;
}

export const ADMIN_RETURN_STATUS_CONFIG: Record<AdminReturnStatus, ReturnStatusConfig> = {
  PENDING: {
    label: LABELS.admin.RETURNS_STATUS_PENDING,
    variant: "warning",
    dotColor: "bg-amber-500",
  },
  APPROVED: {
    label: LABELS.admin.RETURNS_STATUS_APPROVED,
    variant: "info",
    dotColor: "bg-blue-500",
  },
  COMPLETED: {
    label: LABELS.admin.RETURNS_STATUS_COMPLETED,
    variant: "success",
    dotColor: "bg-emerald-500",
  },
  REJECTED: {
    label: LABELS.admin.RETURNS_STATUS_REJECTED,
    variant: "error",
    dotColor: "bg-rose-500",
  },
  CANCELLED: {
    label: LABELS.admin.RETURNS_STATUS_CANCELLED,
    variant: "neutral",
    dotColor: "bg-gray-400",
  },
};

export const ADMIN_RETURN_TYPE_LABELS: Record<AdminReturnType, string> = {
  EXCHANGE: LABELS.admin.RETURNS_TYPE_EXCHANGE,
  REFUND: LABELS.admin.RETURNS_TYPE_REFUND,
  CARE_SUPPORT: LABELS.admin.RETURNS_TYPE_CARE_SUPPORT,
};

export const ADMIN_RETURN_REASON_LABELS: Record<AdminReturnReason, string> = {
  DAMAGED_TRANSIT: LABELS.admin.RETURNS_REASON_DAMAGED_TRANSIT,
  WRONG_ITEM: LABELS.admin.RETURNS_REASON_WRONG_ITEM,
  DISEASE_14D: LABELS.admin.RETURNS_REASON_DISEASE_14D,
  NOT_AS_DESCRIBED: LABELS.admin.RETURNS_REASON_NOT_AS_DESCRIBED,
  OTHER: LABELS.admin.RETURNS_REASON_OTHER,
};

export const ADMIN_RETURN_TABS = [
  { key: "ALL", label: LABELS.admin.RETURNS_TAB_ALL },
  { key: "PENDING", label: LABELS.admin.RETURNS_TAB_PENDING },
  { key: "APPROVED", label: LABELS.admin.RETURNS_TAB_APPROVED },
  { key: "COMPLETED", label: LABELS.admin.RETURNS_TAB_COMPLETED },
  { key: "REJECTED", label: LABELS.admin.RETURNS_TAB_REJECTED },
] as const;

export const ADMIN_RETURN_FILTER_STATUS_OPTIONS = [
  { value: "ALL", label: LABELS.admin.RETURNS_FILTER_ALL_STATUS },
  { value: "PENDING", label: LABELS.admin.RETURNS_STATUS_PENDING },
  { value: "APPROVED", label: LABELS.admin.RETURNS_STATUS_APPROVED },
  { value: "COMPLETED", label: LABELS.admin.RETURNS_STATUS_COMPLETED },
  { value: "REJECTED", label: LABELS.admin.RETURNS_STATUS_REJECTED },
] as const;

export const ADMIN_RETURN_FILTER_TYPE_OPTIONS = [
  { value: "ALL", label: LABELS.admin.RETURNS_FILTER_ALL_TYPE },
  { value: "EXCHANGE", label: LABELS.admin.RETURNS_TYPE_EXCHANGE },
  { value: "REFUND", label: LABELS.admin.RETURNS_TYPE_REFUND },
  { value: "CARE_SUPPORT", label: LABELS.admin.RETURNS_TYPE_CARE_SUPPORT },
] as const;

export const ADMIN_RETURN_RESOLUTION_OPTIONS = [
  { value: "RESEND_NEW_PLANT", label: LABELS.admin.RETURNS_RESOLUTION_RESEND },
  { value: "REFUND_PAYMENT", label: LABELS.admin.RETURNS_RESOLUTION_REFUND },
  { value: "REJECT_REQUEST", label: LABELS.admin.RETURNS_RESOLUTION_REJECT },
] as const;

export const ADMIN_RETURN_ACTION_STATUS_OPTIONS = [
  { value: "PENDING", label: LABELS.admin.RETURNS_STATUS_PENDING },
  { value: "APPROVED", label: LABELS.admin.RETURNS_STATUS_APPROVED },
  { value: "COMPLETED", label: LABELS.admin.RETURNS_STATUS_COMPLETED },
  { value: "REJECTED", label: LABELS.admin.RETURNS_STATUS_REJECTED },
] as const;
