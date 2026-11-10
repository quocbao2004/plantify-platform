import React from "react";
import {
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Pencil,
  Tag,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { AdminOrder } from "../types";
import { ADMIN_ORDER_STATUS_CONFIG } from "../constants/orders";

interface AdminOrderDetailModalProps {
  order: AdminOrder | null;
  open: boolean;
  onClose: () => void;
  onRequestChangeStatus: (order: AdminOrder) => void;
}

export const AdminOrderDetailModal: React.FC<AdminOrderDetailModalProps> = ({
  order,
  open,
  onClose,
  onRequestChangeStatus,
}) => {
  if (!order) return null;

  const statusConfig = ADMIN_ORDER_STATUS_CONFIG[order.status] ?? {
    label: order.status_display || order.status,
    variant: "default" as const,
    dotColor: "bg-surface-400",
  };

  const formattedDate = order.created_at
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(order.created_at))
    : LABELS.admin.STATUS_UNAVAILABLE;

  const totalAmountNumber =
    typeof order.total_amount === "string"
      ? parseFloat(order.total_amount) || 0
      : order.total_amount;

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.ORDERS_MODAL_DETAIL_TITLE}
      className="max-w-3xl w-full"
    >
      <div className="space-y-6 pt-2">
        {/* Header Summary Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-50 border border-surface-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  {LABELS.admin.ORDERS_LABEL_CODE}:
                </span>
                <span className="text-base font-bold text-surface-900 font-mono">
                  {order.order_code}
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

        {/* 2-Column Info: Customer & Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer / Account Details */}
          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {LABELS.admin.ORDERS_SECTION_GENERAL}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-surface-100">
                <span className="text-surface-500 text-xs">
                  {LABELS.admin.ORDERS_LABEL_CUSTOMER_NAME}
                </span>
                <span className="font-medium text-surface-900">
                  {order.user_name || order.user_email || LABELS.admin.STATUS_UNAVAILABLE}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-100">
                <span className="text-surface-500 text-xs">
                  {LABELS.admin.ORDERS_LABEL_CUSTOMER_EMAIL}
                </span>
                <span className="font-medium text-surface-900 flex items-center gap-1 text-xs">
                  <Mail className="w-3 h-3 text-surface-400" />
                  {order.user_email}
                </span>
              </div>
              {order.user_phone && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-surface-500 text-xs">
                    {LABELS.auth.PHONE_OPTIONAL}
                  </span>
                  <span className="font-medium text-surface-900 flex items-center gap-1 text-xs">
                    <Phone className="w-3 h-3 text-surface-400" />
                    {order.user_phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery / Recipient Details */}
          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-3">
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {LABELS.admin.ORDERS_SECTION_CUSTOMER}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-surface-100">
                <span className="text-surface-500 text-xs">
                  {LABELS.admin.ORDERS_LABEL_RECIPIENT_NAME}
                </span>
                <span className="font-semibold text-surface-900">
                  {order.recipient_name}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-100">
                <span className="text-surface-500 text-xs">
                  {LABELS.admin.ORDERS_LABEL_RECIPIENT_PHONE}
                </span>
                <span className="font-medium text-surface-900 flex items-center gap-1 text-xs">
                  <Phone className="w-3 h-3 text-surface-400" />
                  {order.recipient_phone}
                </span>
              </div>
              <div className="py-1">
                <span className="text-surface-500 text-xs block mb-0.5">
                  {LABELS.admin.ORDERS_LABEL_SHIPPING_ADDRESS}
                </span>
                <span className="text-surface-800 text-xs font-medium leading-relaxed">
                  {order.shipping_address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes ? (
          <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs space-y-1">
            <div className="font-semibold text-amber-800 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              {LABELS.admin.ORDERS_LABEL_NOTES}
            </div>
            <p className="text-amber-900/90 leading-relaxed pl-5">
              {order.notes}
            </p>
          </div>
        ) : null}

        {/* Product Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {LABELS.admin.ORDERS_SECTION_ITEMS} (
              {order.details ? order.details.length : 0})
            </h4>
          </div>

          <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200/80 text-surface-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">{LABELS.admin.ORDERS_PRODUCT_NAME}</th>
                    <th className="py-3 px-3">{LABELS.admin.ORDERS_PRODUCT_SKU}</th>
                    <th className="py-3 px-3 text-right">{LABELS.admin.ORDERS_PRODUCT_PRICE}</th>
                    <th className="py-3 px-3 text-center">{LABELS.admin.ORDERS_PRODUCT_QTY}</th>
                    <th className="py-3 px-4 text-right">{LABELS.admin.ORDERS_PRODUCT_TOTAL}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {order.details && order.details.length > 0 ? (
                    order.details.map((item, index) => {
                      const unitPrice =
                        typeof item.unit_price === "string"
                          ? parseFloat(item.unit_price) || 0
                          : item.unit_price;
                      const totalPrice =
                        typeof item.total_price === "string"
                          ? parseFloat(item.total_price) || 0
                          : item.total_price;

                      return (
                        <tr
                          key={item.id || index}
                          className="hover:bg-surface-50/60 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {item.primary_image ? (
                                <img
                                  src={item.primary_image}
                                  alt={item.plant_name || ""}
                                  className="w-10 h-10 rounded-lg object-cover border border-surface-200 shrink-0 bg-surface-50"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center shrink-0 text-surface-400">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-surface-900 text-xs">
                                  {item.plant_name || LABELS.admin.ORDERS_FOOTER_TIP}
                                </p>
                                {item.plant_size ? (
                                  <p className="text-[11px] text-surface-500 mt-0.5">
                                    {item.plant_size}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-surface-600">
                            {item.plant_sku || LABELS.admin.STATUS_UNAVAILABLE}
                          </td>
                          <td className="py-3 px-3 text-right text-surface-700 font-medium">
                            {formatCurrencyVND(unitPrice)}
                          </td>
                          <td className="py-3 px-3 text-center font-semibold text-surface-900">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-brand-dark">
                            {formatCurrencyVND(totalPrice)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-xs text-surface-400"
                      >
                        {LABELS.admin.EMPTY_ORDERS}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Row */}
            <div className="p-4 bg-surface-50/80 border-t border-surface-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-surface-600 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-surface-500" />
                {LABELS.admin.ORDERS_COL_TOTAL}
              </span>
              <span className="text-lg font-bold text-brand font-serif">
                {formatCurrencyVND(totalAmountNumber)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-200/80">
          <ButtonCommon
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            {LABELS.common.CLOSE}
          </ButtonCommon>

          <ButtonCommon
            type="button"
            variant="brand"
            size="sm"
            onClick={() => {
              onClose();
              onRequestChangeStatus(order);
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
            {LABELS.admin.ORDERS_ACTION_UPDATE_STATUS}
          </ButtonCommon>
        </div>
      </div>
    </ModalCommon>
  );
};
