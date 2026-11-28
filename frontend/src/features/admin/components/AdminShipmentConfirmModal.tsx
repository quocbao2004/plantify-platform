import React, { useState } from "react";
import { CheckCircle2, RefreshCw, Image as ImageIcon } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { TextareaCommon } from "@/components/common/TextareaCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { AdminShipment, UpdateAdminShipmentPayload } from "../types";
import { ADMIN_SHIPMENT_STATUS } from "../constants/shipping";

interface AdminShipmentConfirmModalProps {
  shipment: AdminShipment | null;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (payload: UpdateAdminShipmentPayload) => void;
}

export const AdminShipmentConfirmModal: React.FC<AdminShipmentConfirmModalProps> = ({
  shipment,
  open,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const [adminNotes, setAdminNotes] = useState<string>("");

  if (!shipment) return null;

  const codAmountNumber =
    typeof shipment.cod_amount === "string"
      ? parseFloat(shipment.cod_amount) || 0
      : shipment.cod_amount;

  const codCollectedNumber =
    typeof shipment.cod_collected === "string"
      ? parseFloat(shipment.cod_collected) || 0
      : shipment.cod_collected;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      status: ADMIN_SHIPMENT_STATUS.DELIVERED,
      admin_notes: adminNotes.trim() || undefined,
    });
  };

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.SHIPPING_MODAL_CONFIRM_TITLE}
      className="max-w-lg w-full"
    >
      <FormCommon
        id="admin-shipment-confirm-form"
        onSubmit={handleSubmit}
        className="space-y-4 pt-2 text-xs"
      >
        {/* Shipment Info */}
        <div className="p-3.5 rounded-lg bg-surface-50 border border-surface-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.SHIPPING_LABEL_TRACKING}
            </span>
            <span className="font-mono font-bold text-surface-900">
              {shipment.tracking_code || shipment.ship_code}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.SHIPPING_LABEL_ORDER}
            </span>
            <span className="font-mono font-medium text-surface-800">
              {shipment.order_code}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.SHIPPING_LABEL_SHIPPER}
            </span>
            <span className="font-bold text-surface-900">
              {(shipment.shipper_name || shipment.staff_name) || LABELS.admin.SHIPPING_UNASSIGNED_BADGE}
              {(shipment.shipper_phone || shipment.staff_phone || shipment.shipper_email)
                ? ` (${shipment.shipper_phone || shipment.staff_phone || shipment.shipper_email})`
                : ""}
            </span>
          </div>
        </div>

        {/* POD Proof Photo */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-surface-800 uppercase tracking-wider text-[11px]">
            <ImageIcon className="w-3.5 h-3.5 text-brand" />
            <span>{LABELS.admin.SHIPPING_SECTION_POD}</span>
          </div>

          {shipment.proof_image ? (
            <LinkCommon
              href={shipment.proof_image}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative aspect-video rounded-lg overflow-hidden border border-surface-200 group"
            >
              <img
                src={shipment.proof_image}
                alt=""
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </LinkCommon>
          ) : (
            <div className="p-4 rounded-lg bg-surface-50 border border-surface-200/80 text-center text-surface-400">
              {LABELS.admin.SHIPPING_EMPTY_PROOF}
            </div>
          )}
        </div>

        {/* COD Reconciliation */}
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-emerald-700">{LABELS.admin.SHIPPING_LABEL_COD_EXPECTED}</span>
            <span className="font-mono font-semibold text-emerald-900">
              {formatCurrencyVND(codAmountNumber)}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-emerald-200/60 pt-1.5">
            <span className="text-emerald-800 font-bold">{LABELS.admin.SHIPPING_LABEL_COD_COLLECTED}</span>
            <span className="font-mono font-bold text-emerald-900 text-sm">
              {formatCurrencyVND(codCollectedNumber || codAmountNumber)}
            </span>
          </div>
        </div>

        {/* Shipper Notes if any */}
        {shipment.shipper_notes && (
          <div className="space-y-1">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.SHIPPING_LABEL_SHIPPER_NOTES}
            </span>
            <div className="p-2.5 rounded-lg bg-surface-50 border border-surface-100 italic text-surface-700">
              "{shipment.shipper_notes}"
            </div>
          </div>
        )}

        {/* Admin Notes */}
        <TextareaCommon
          id="shipment-confirm-admin-notes"
          label={LABELS.admin.SHIPPING_LABEL_ADMIN_NOTES}
          rows={2}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="w-full text-xs resize-none min-h-0"
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-200">
          <ButtonCommon
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {LABELS.admin.SHIPPING_ACTION_CLOSE}
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
            <span>{LABELS.admin.SHIPPING_ACTION_SUBMIT_CONFIRM}</span>
          </ButtonCommon>
        </div>
      </FormCommon>
    </ModalCommon>
  );
};
