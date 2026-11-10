import React, { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { SelectCommon } from "@/components/common/SelectCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { AdminOrder, AdminOrderStatus } from "../types";
import {
  ADMIN_ORDER_STATUS_CONFIG,
  ADMIN_ORDER_STATUS_SELECT_OPTIONS,
} from "../constants/orders";

interface AdminOrderStatusModalProps {
  order: AdminOrder | null;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (payload: { status: AdminOrderStatus; notes?: string }) => void;
}

export const AdminOrderStatusModal: React.FC<AdminOrderStatusModalProps> = ({
  order,
  open,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<AdminOrderStatus>("PENDING");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setNotes(order.notes || "");
    }
  }, [order]);

  if (!order) return null;

  const currentConfig = ADMIN_ORDER_STATUS_CONFIG[order.status] ?? {
    label: order.status_display || order.status,
    variant: "default" as const,
    dotColor: "bg-surface-400",
  };

  const nextConfig = ADMIN_ORDER_STATUS_CONFIG[selectedStatus] ?? currentConfig;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      status: selectedStatus,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.ORDERS_MODAL_STATUS_TITLE}
      className="max-w-md w-full"
    >
      <form id="admin-order-status-form" onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Order Identifier & Current Status */}
        <div className="p-3.5 rounded-lg bg-surface-50 border border-surface-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.ORDERS_LABEL_CODE}:
            </span>
            <span className="font-mono font-bold text-surface-900">
              {order.order_code}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.ORDERS_LABEL_STATUS}:
            </span>
            <BadgeCommon
              variant={currentConfig.variant}
              size="sm"
              dot
              dotColor={currentConfig.dotColor}
            >
              {currentConfig.label}
            </BadgeCommon>
          </div>
        </div>

        {/* Status Selection */}
        <div className="space-y-1.5">
          <label
            htmlFor="order-status-select"
            className="block text-xs font-semibold text-surface-700"
          >
            {LABELS.admin.ORDERS_LABEL_NEW_STATUS}
          </label>
          <SelectCommon
            id="order-status-select"
            options={ADMIN_ORDER_STATUS_SELECT_OPTIONS}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as AdminOrderStatus)}
            disabled={isLoading}
          />
        </div>

        {/* Optional Notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="order-notes-input"
            className="block text-xs font-semibold text-surface-700"
          >
            {LABELS.admin.ORDERS_LABEL_CONFIRM_NOTE}
          </label>
          <TextFieldCommon
            id="order-notes-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={LABELS.admin.ORDERS_LABEL_NO_NOTES}
            disabled={isLoading}
          />
        </div>

        {/* Transition Preview Warning / Notice */}
        {selectedStatus !== order.status && (
          <div className="p-3 rounded-lg bg-brand/5 border border-brand/20 flex items-start gap-2.5 text-xs text-brand-dark">
            <AlertCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {LABELS.admin.ORDERS_CONFIRM_CHANGE_MSG(
                order.order_code,
                nextConfig.label
              )}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-200/80">
          <ButtonCommon
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {LABELS.admin.ORDERS_CONFIRM_CANCEL}
          </ButtonCommon>

          <ButtonCommon
            type="submit"
            variant="brand"
            size="sm"
            isLoading={isLoading}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {LABELS.admin.ORDERS_CONFIRM_SUBMIT}
          </ButtonCommon>
        </div>
      </form>
    </ModalCommon>
  );
};
