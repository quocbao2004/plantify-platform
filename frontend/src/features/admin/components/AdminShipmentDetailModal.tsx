import React from "react";
import {
  Truck,
  Calendar,
  UserCheck,
  Image as ImageIcon,
  CheckCircle2,
  Package,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { LinkCommon } from "@/components/common/LinkCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { AdminShipment } from "../types";
import { ADMIN_SHIPMENT_STATUS, ADMIN_SHIPMENT_STATUS_CONFIG } from "../constants/shipping";

interface AdminShipmentDetailModalProps {
  shipment: AdminShipment | null;
  open: boolean;
  onClose: () => void;
  onRequestAssign?: (item: AdminShipment) => void;
  onRequestConfirmPOD?: (item: AdminShipment) => void;
}

export const AdminShipmentDetailModal: React.FC<AdminShipmentDetailModalProps> = ({
  shipment,
  open,
  onClose,
  onRequestAssign,
  onRequestConfirmPOD,
}) => {
  if (!shipment) return null;

  const statusConfig = ADMIN_SHIPMENT_STATUS_CONFIG[shipment.status] ?? {
    label: shipment.status_display || shipment.status,
    variant: "default" as const,
    dotColor: "bg-surface-400",
  };

  const formattedCreated = shipment.created_at
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(shipment.created_at))
    : LABELS.admin.STATUS_UNAVAILABLE;

  const codAmountNumber =
    typeof shipment.cod_amount === "string"
      ? parseFloat(shipment.cod_amount) || 0
      : shipment.cod_amount;

  const codCollectedNumber =
    typeof shipment.cod_collected === "string"
      ? parseFloat(shipment.cod_collected) || 0
      : shipment.cod_collected;

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.SHIPPING_MODAL_DETAIL_TITLE}
      className="max-w-3xl w-full"
    >
      <div className="space-y-6 pt-2">
        {/* Header Summary Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-50 border border-surface-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  {LABELS.admin.SHIPPING_LABEL_TRACKING}
                </span>
                <span className="text-base font-bold text-surface-900 font-mono">
                  {shipment.tracking_code || shipment.ship_code}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-surface-500 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedCreated}</span>
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

        {/* 2-Column Info: Order & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Details */}
          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
              <Package className="w-4 h-4 text-brand" />
              <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider">
                {LABELS.admin.SHIPPING_SECTION_ORDER}
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-surface-500">{LABELS.admin.SHIPPING_LABEL_ORDER}</span>
                <span className="font-mono font-bold text-surface-900">
                  {shipment.order_code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-500">{LABELS.admin.SHIPPING_COL_COD}:</span>
                <span className="font-bold text-brand">
                  {formatCurrencyVND(codAmountNumber)}
                </span>
              </div>
              {Array.isArray(shipment.plant_names) && shipment.plant_names.length > 0 && (
                <div className="pt-1">
                  <span className="text-surface-500 block mb-1">
                    {LABELS.admin.PLANTS_SECTION_GENERAL}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {shipment.plant_names.map((name, i) => (
                      <span
                        key={i}
                        className="bg-surface-100 text-surface-700 px-2 py-0.5 rounded text-[11px]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Shipper Info */}
          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
              <UserCheck className="w-4 h-4 text-brand" />
              <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider">
                {LABELS.admin.SHIPPING_SECTION_DELIVERY}
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-surface-500">{LABELS.admin.SHIPPING_LABEL_CUSTOMER}</span>
                <span className="font-medium text-surface-900">
                  {shipment.recipient_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-500">{LABELS.admin.SHIPPING_LABEL_PHONE}</span>
                <span className="font-mono text-surface-700">
                  {shipment.recipient_phone}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-surface-500 shrink-0">{LABELS.admin.SHIPPING_LABEL_ADDRESS}</span>
                <span className="text-surface-700 text-right">
                  {shipment.shipping_address || shipment.delivery_address}
                </span>
              </div>
              <div className="pt-2 border-t border-surface-100 flex justify-between items-center">
                <span className="text-surface-500 font-semibold">{LABELS.admin.SHIPPING_LABEL_SHIPPER}</span>
                {(shipment.shipper_name || shipment.staff_name) ? (
                  <span className="font-bold text-surface-900">
                    {shipment.shipper_name || shipment.staff_name} ({shipment.shipper_phone || shipment.staff_phone || shipment.shipper_email})
                  </span>
                ) : (
                  <BadgeCommon variant="warning" size="sm">
                    {LABELS.admin.SHIPPING_UNASSIGNED_BADGE}
                  </BadgeCommon>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Proof of Delivery (POD) Section */}
        <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
            <ImageIcon className="w-4 h-4 text-brand" />
            <h4 className="text-xs font-bold text-surface-800 uppercase tracking-wider">
              {LABELS.admin.SHIPPING_SECTION_POD}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Image Preview */}
            <div>
              <span className="text-surface-500 block mb-2 font-medium">
                {LABELS.admin.SHIPPING_LABEL_PROOF_IMAGE}
              </span>
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
                <div className="p-6 rounded-lg bg-surface-50 border border-surface-200/80 text-center text-surface-400">
                  {LABELS.admin.SHIPPING_EMPTY_PROOF}
                </div>
              )}
            </div>

            {/* Shipper & Admin Notes */}
            <div className="space-y-3">
              {shipment.shipper_notes && (
                <div>
                  <span className="text-surface-500 block mb-1 font-medium">
                    {LABELS.admin.SHIPPING_LABEL_SHIPPER_NOTES}
                  </span>
                  <div className="p-2.5 rounded-lg bg-surface-50 border border-surface-100 text-surface-700 italic">
                    "{shipment.shipper_notes}"
                  </div>
                </div>
              )}

              {codCollectedNumber > 0 && (
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs">
                  <span className="text-emerald-700 font-medium">
                    {LABELS.admin.SHIPPING_LABEL_COD_COLLECTED}
                  </span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {formatCurrencyVND(codCollectedNumber)}
                  </span>
                </div>
              )}

              {shipment.admin_notes && (
                <div>
                  <span className="text-surface-500 block mb-1 font-medium">
                    {LABELS.admin.SHIPPING_LABEL_ADMIN_NOTES}
                  </span>
                  <div className="p-2.5 rounded-lg bg-surface-50 border border-surface-100 text-surface-700">
                    {shipment.admin_notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
          <ButtonCommon variant="outline" size="sm" onClick={onClose}>
            {LABELS.admin.SHIPPING_ACTION_CLOSE}
          </ButtonCommon>

          {onRequestAssign && (
            <ButtonCommon
              variant="secondary"
              size="sm"
              disabled={!(
                shipment.status === ADMIN_SHIPMENT_STATUS.PENDING ||
                shipment.status === ADMIN_SHIPMENT_STATUS.UNASSIGNED ||
                (shipment.status === ADMIN_SHIPMENT_STATUS.ASSIGNED && !(shipment.staff_name || shipment.shipper_name))
              )}
              onClick={() => onRequestAssign(shipment)}
              className="flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{LABELS.admin.SHIPPING_ACTION_ASSIGN}</span>
            </ButtonCommon>
          )}

          {onRequestConfirmPOD && (
            <ButtonCommon
              variant="primary"
              size="sm"
              disabled={shipment.status !== ADMIN_SHIPMENT_STATUS.DELIVERED_PENDING_CONFIRM}
              onClick={() => onRequestConfirmPOD(shipment)}
              className="flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{LABELS.admin.SHIPPING_ACTION_CONFIRM_POD}</span>
            </ButtonCommon>
          )}
        </div>
      </div>
    </ModalCommon>
  );
};
