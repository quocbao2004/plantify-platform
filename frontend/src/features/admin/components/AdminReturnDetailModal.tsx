import React from "react";
import {
  RotateCcw,
  Calendar,
  Pencil,
  Image as ImageIcon,
  Leaf,
  ShoppingBag,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { AdminReturnRequest } from "../types";
import {
  ADMIN_RETURN_STATUS_CONFIG,
  ADMIN_RETURN_TYPE_LABELS,
  ADMIN_RETURN_REASON_LABELS,
} from "../constants/returns";

interface AdminReturnDetailModalProps {
  returnRequest: AdminReturnRequest | null;
  open: boolean;
  onClose: () => void;
  onRequestAction: (item: AdminReturnRequest) => void;
}

export const AdminReturnDetailModal: React.FC<AdminReturnDetailModalProps> = ({
  returnRequest,
  open,
  onClose,
  onRequestAction,
}) => {
  if (!returnRequest) return null;

  const statusConfig = ADMIN_RETURN_STATUS_CONFIG[returnRequest.status] ?? {
    label: returnRequest.status_display || returnRequest.status,
    variant: "default" as const,
    dotColor: "bg-surface-400",
  };

  const formattedDate = returnRequest.created_at
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(returnRequest.created_at))
    : LABELS.admin.STATUS_UNAVAILABLE;

  const refundNumber =
    typeof returnRequest.refund_amount === "string"
      ? parseFloat(returnRequest.refund_amount) || 0
      : returnRequest.refund_amount;

  const typeLabel =
    returnRequest.request_type_display ||
    ADMIN_RETURN_TYPE_LABELS[returnRequest.request_type] ||
    returnRequest.request_type;

  const reasonLabel =
    returnRequest.reason_display ||
    ADMIN_RETURN_REASON_LABELS[returnRequest.reason] ||
    returnRequest.reason;

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.RETURNS_MODAL_DETAIL_TITLE}
      className="max-w-3xl w-full"
    >
      <div className="space-y-6 pt-2">
        {/* Header Summary Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-50 border border-surface-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  {LABELS.admin.RETURNS_LABEL_CODE}
                </span>
                <span className="text-base font-bold text-surface-900 font-mono">
                  {returnRequest.return_code}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-surface-500 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BadgeCommon
              variant={statusConfig.variant}
              size="md"
              dot
              dotColor={statusConfig.dotColor}
            >
              {statusConfig.label}
            </BadgeCommon>
          </div>
        </div>

        {/* 2-Column Info: Order & Customer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Details */}
          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
              <ShoppingBag className="w-4 h-4 text-brand" />
              <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider">
                {LABELS.admin.RETURNS_SECTION_ORDER_INFO}
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-surface-500">{LABELS.admin.RETURNS_LABEL_ORDER}</span>
                <span className="font-mono font-bold text-surface-900">
                  {returnRequest.order_code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-500">{LABELS.admin.RETURNS_LABEL_CUSTOMER}</span>
                <span className="font-medium text-surface-900">
                  {returnRequest.user_name || LABELS.admin.STATUS_UNAVAILABLE}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-500">{LABELS.admin.RETURNS_LABEL_EMAIL}</span>
                <span className="font-medium text-surface-700">
                  {returnRequest.user_email || LABELS.admin.STATUS_UNAVAILABLE}
                </span>
              </div>
              {returnRequest.user_phone && (
                <div className="flex justify-between items-center">
                  <span className="text-surface-500">{LABELS.admin.RETURNS_LABEL_PHONE}</span>
                  <span className="font-medium text-surface-700">
                    {returnRequest.user_phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Claimed Plant Info */}
          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
              <Leaf className="w-4 h-4 text-brand" />
              <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider">
                {LABELS.admin.RETURNS_SECTION_PLANT_INFO}
              </h4>
            </div>

            <div className="flex items-start gap-3">
              {returnRequest.plant_image ? (
                <img
                  src={returnRequest.plant_image}
                  alt={returnRequest.plant_name || ""}
                  className="w-14 h-14 rounded-lg object-cover border border-surface-200 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center text-surface-400 shrink-0">
                  <Leaf className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-1 text-xs flex-1 min-w-0">
                <p className="font-semibold text-surface-900 truncate">
                  {returnRequest.plant_name || LABELS.admin.STATUS_UNAVAILABLE}
                </p>
                {returnRequest.plant_sku && (
                  <p className="text-surface-500 font-mono">
                    {LABELS.admin.RETURNS_LABEL_SKU} {returnRequest.plant_sku}
                  </p>
                )}
                {returnRequest.plant_size && (
                  <p className="text-surface-500">
                    {LABELS.admin.RETURNS_LABEL_SIZE} {returnRequest.plant_size}
                  </p>
                )}
                <div className="flex justify-between pt-1">
                  <span className="text-surface-500">{LABELS.admin.RETURNS_LABEL_CLAIM_QTY}</span>
                  <span className="font-bold text-brand">{returnRequest.quantity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Details: Reason, Type, Notes */}
        <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-50">
              <span className="text-surface-500 block mb-1">
                {LABELS.admin.RETURNS_LABEL_TYPE}
              </span>
              <span className="font-semibold text-surface-900">{typeLabel}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-50">
              <span className="text-surface-500 block mb-1">
                {LABELS.admin.RETURNS_LABEL_REASON}
              </span>
              <span className="font-semibold text-surface-900">{reasonLabel}</span>
            </div>
          </div>

          {refundNumber > 0 && (
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-surface-50 text-xs">
              <span className="text-surface-500">{LABELS.admin.RETURNS_LABEL_REFUND_AMOUNT}</span>
              <span className="font-bold text-emerald-600 text-sm">
                {formatCurrencyVND(refundNumber)}
              </span>
            </div>
          )}

          {returnRequest.customer_notes && (
            <div className="text-xs space-y-1">
              <span className="text-surface-500 font-medium">
                {LABELS.admin.RETURNS_LABEL_CUSTOMER_NOTES}
              </span>
              <div className="p-2.5 rounded-lg bg-surface-50 border border-surface-100 text-surface-700 italic">
                "{returnRequest.customer_notes}"
              </div>
            </div>
          )}
        </div>

        {/* Proof Images Gallery */}
        <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
            <ImageIcon className="w-4 h-4 text-brand" />
            <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider">
              {LABELS.admin.RETURNS_SECTION_PROOF}
            </h4>
          </div>

          {Array.isArray(returnRequest.proof_images) && returnRequest.proof_images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {returnRequest.proof_images.map((imgUrl, idx) => (
                <LinkCommon
                  key={idx}
                  href={imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-lg overflow-hidden border border-surface-200 block"
                >
                  <img
                    src={imgUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </LinkCommon>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-surface-400">
              {LABELS.admin.RETURNS_EMPTY_PROOF}
            </div>
          )}
        </div>

        {/* Admin Resolution & Notes if available */}
        {(returnRequest.admin_notes || returnRequest.resolution_action) && (
          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-2 text-xs">
            <h4 className="font-bold text-surface-800 uppercase tracking-wider">
              {LABELS.admin.RETURNS_SECTION_RESOLUTION}
            </h4>
            {returnRequest.resolution_action && (
              <p className="text-surface-700">
                <span className="font-semibold">{LABELS.admin.RETURNS_LABEL_RESOLUTION} </span>
                {returnRequest.resolution_action}
              </p>
            )}
            {returnRequest.admin_notes && (
              <p className="text-surface-700">
                <span className="font-semibold">{LABELS.admin.RETURNS_LABEL_ADMIN_NOTES} </span>
                {returnRequest.admin_notes}
              </p>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
          <ButtonCommon variant="outline" size="sm" onClick={onClose}>
            {LABELS.admin.RETURNS_ACTION_CLOSE}
          </ButtonCommon>
          <ButtonCommon
            variant="primary"
            size="sm"
            onClick={() => onRequestAction(returnRequest)}
            className="flex items-center gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>{LABELS.admin.RETURNS_ACTION_REVIEW}</span>
          </ButtonCommon>
        </div>
      </div>
    </ModalCommon>
  );
};
