import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { SelectCommon } from "@/components/common/SelectCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { FieldCommon } from "@/components/common/FieldCommon";
import { AdminReturnRequest, AdminReturnStatus, UpdateAdminReturnPayload } from "../types";
import {
  ADMIN_RETURN_STATUS_CONFIG,
  ADMIN_RETURN_ACTION_STATUS_OPTIONS,
  ADMIN_RETURN_RESOLUTION_OPTIONS,
} from "../constants/returns";

interface AdminReturnActionModalProps {
  returnRequest: AdminReturnRequest | null;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (payload: UpdateAdminReturnPayload) => void;
}

export const AdminReturnActionModal: React.FC<AdminReturnActionModalProps> = ({
  returnRequest,
  open,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<AdminReturnStatus>("PENDING");
  const [selectedResolution, setSelectedResolution] = useState<string>("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");

  useEffect(() => {
    if (returnRequest) {
      setSelectedStatus(returnRequest.status);
      setSelectedResolution(returnRequest.resolution_action || "RESEND_NEW_PLANT");
      setRefundAmount(
        returnRequest.refund_amount ? String(returnRequest.refund_amount) : ""
      );
      setAdminNotes(returnRequest.admin_notes || "");
    }
  }, [returnRequest]);

  if (!returnRequest) return null;

  const currentConfig = ADMIN_RETURN_STATUS_CONFIG[returnRequest.status] ?? {
    label: returnRequest.status_display || returnRequest.status,
    variant: "default" as const,
    dotColor: "bg-surface-400",
  };

  const nextConfig = ADMIN_RETURN_STATUS_CONFIG[selectedStatus] ?? currentConfig;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      status: selectedStatus,
      resolution_action: selectedResolution,
      refund_amount: refundAmount ? parseFloat(refundAmount) || 0 : undefined,
      admin_notes: adminNotes.trim() || undefined,
    });
  };

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.RETURNS_MODAL_ACTION_TITLE}
      className="max-w-md w-full"
    >
      <FormCommon
        id="admin-return-action-form"
        onSubmit={handleSubmit}
        className="space-y-4 pt-2"
      >
        {/* Return Identifier & Current Status */}
        <div className="p-3.5 rounded-lg bg-surface-50 border border-surface-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.RETURNS_LABEL_CODE}
            </span>
            <span className="font-mono font-bold text-surface-900">
              {returnRequest.return_code}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.RETURNS_LABEL_ORDER}
            </span>
            <span className="font-mono font-medium text-surface-800">
              {returnRequest.order_code}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.RETURNS_LABEL_STATUS}
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
        <SelectCommon
          id="return-status-select"
          label={LABELS.admin.RETURNS_FILTER_STATUS}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as AdminReturnStatus)}
          options={ADMIN_RETURN_ACTION_STATUS_OPTIONS}
          className="w-full text-xs"
        />

        {/* Resolution Action Selection */}
        <SelectCommon
          id="return-resolution-select"
          label={LABELS.admin.RETURNS_LABEL_RESOLUTION}
          value={selectedResolution}
          onChange={(e) => setSelectedResolution(e.target.value)}
          options={ADMIN_RETURN_RESOLUTION_OPTIONS}
          className="w-full text-xs"
        />

        {/* Refund Amount (if resolution is refund) */}
        {selectedResolution === "REFUND_PAYMENT" && (
          <TextFieldCommon
            id="return-refund-amount"
            label={LABELS.admin.RETURNS_LABEL_REFUND_AMOUNT}
            type="number"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            placeholder={LABELS.admin.PLANTS_FORM_PRICE_PLACEHOLDER}
            className="text-xs"
          />
        )}

        {/* Admin Notes */}
        <FieldCommon
          id="return-admin-notes"
          label={LABELS.admin.RETURNS_LABEL_ADMIN_NOTES}
        >
          <textarea
            id="return-admin-notes"
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-surface-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-surface-900 bg-white resize-none"
          />
        </FieldCommon>

        {/* Status Transition Preview */}
        {selectedStatus !== returnRequest.status && (
          <div className="p-3 rounded-lg bg-surface-50 border border-surface-200/80 flex items-center justify-between text-xs">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.RETURNS_LABEL_STATUS}
            </span>
            <div className="flex items-center gap-2">
              <BadgeCommon
                variant={currentConfig.variant}
                size="sm"
                dot
                dotColor={currentConfig.dotColor}
              >
                {currentConfig.label}
              </BadgeCommon>
              <ArrowRight className="w-3.5 h-3.5 text-surface-400" />
              <BadgeCommon
                variant={nextConfig.variant}
                size="sm"
                dot
                dotColor={nextConfig.dotColor}
              >
                {nextConfig.label}
              </BadgeCommon>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-200">
          <ButtonCommon
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {LABELS.admin.RETURNS_ACTION_CLOSE}
          </ButtonCommon>
          <ButtonCommon
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{LABELS.admin.RETURNS_ACTION_CONFIRM}</span>
          </ButtonCommon>
        </div>
      </FormCommon>
    </ModalCommon>
  );
};
