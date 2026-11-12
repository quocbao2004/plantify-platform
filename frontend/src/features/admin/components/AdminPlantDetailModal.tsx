import React from "react";
import {
  Leaf,
  Tag,
  DollarSign,
  Layers,
  Calendar,
  Pencil,
  BookOpen,
  Info,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { BadgeCommon } from "@/components/common/BadgeCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { AdminPlant } from "../types";
import { ADMIN_PLANT_STATUS_CONFIG } from "../constants/plants";

interface AdminPlantDetailModalProps {
  plant: AdminPlant | null;
  open: boolean;
  onClose: () => void;
  onEdit: (plant: AdminPlant) => void;
}

export const AdminPlantDetailModal: React.FC<AdminPlantDetailModalProps> = ({
  plant,
  open,
  onClose,
  onEdit,
}) => {
  if (!plant) return null;

  const statusConfig = plant.is_active
    ? ADMIN_PLANT_STATUS_CONFIG.ACTIVE
    : ADMIN_PLANT_STATUS_CONFIG.INACTIVE;

  const formattedDate = plant.created_at
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(plant.created_at))
    : LABELS.admin.STATUS_UNAVAILABLE;

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.PLANTS_MODAL_DETAIL_TITLE}
      className="max-w-3xl w-full"
    >
      <div className="space-y-6 pt-2">
        {/* Header Preview Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-50 border border-surface-200/80">
          <div className="flex items-center gap-3.5">
            {plant.primary_image ? (
              <img
                src={plant.primary_image}
                alt={plant.name}
                className="w-14 h-14 rounded-xl object-cover border border-surface-200 shrink-0 bg-white"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 text-brand">
                <Leaf className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-surface-900 font-serif">
                {plant.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-surface-500 font-mono">
                  slug: {plant.slug}
                </span>
                {plant.category_name && (
                  <BadgeCommon variant="default" size="sm">
                    {plant.category_name}
                  </BadgeCommon>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Pricing & Key Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-surface-200/80 bg-white space-y-1">
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {LABELS.admin.PLANTS_COL_PRICE}
            </span>
            <p className="text-base font-bold text-brand-dark font-serif">
              {formatCurrencyVND(plant.sale_price ?? 0)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-surface-200/80 bg-white space-y-1">
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {LABELS.admin.PLANTS_FORM_RENTAL_PRICE}
            </span>
            <p className="text-base font-bold text-surface-900 font-serif">
              {formatCurrencyVND(plant.rental_price ?? 0)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-surface-200/80 bg-white space-y-1">
            <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {LABELS.admin.PLANTS_COL_VARIANTS}
            </span>
            <p className="text-base font-bold text-surface-900">
              {LABELS.admin.PLANTS_VARIANTS_COUNT(plant.details?.length ?? 0)}
            </p>
          </div>
        </div>

        {/* Description & Care Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-2">
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              {LABELS.admin.PLANTS_FORM_DESCRIPTION}
            </h4>
            <p className="text-xs text-surface-700 leading-relaxed whitespace-pre-line">
              {plant.description || LABELS.admin.PLANTS_NO_DESCRIPTION}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-surface-200/80 bg-white space-y-2">
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {LABELS.admin.PLANTS_FORM_CARE_GUIDE}
            </h4>
            <p className="text-xs text-surface-700 leading-relaxed whitespace-pre-line">
              {plant.care_guide || LABELS.admin.PLANTS_NO_CARE_GUIDE}
            </p>
          </div>
        </div>

        {/* Details / Variants Table if present */}
        {plant.details && plant.details.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {LABELS.admin.PLANTS_COL_VARIANTS} ({plant.details.length})
            </h4>

            <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200/80 text-surface-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">{LABELS.admin.ORDERS_PRODUCT_SKU}</th>
                    <th className="py-2.5 px-3">{LABELS.admin.PLANTS_COL_SIZE}</th>
                    <th className="py-2.5 px-3 text-right">{LABELS.admin.ORDERS_PRODUCT_PRICE}</th>
                    <th className="py-2.5 px-3 text-center">{LABELS.admin.PLANTS_COL_STOCK}</th>
                    <th className="py-2.5 px-3 text-center">{LABELS.admin.ORDERS_COL_STATUS}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {plant.details.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-50/60">
                      <td className="py-2 px-3 font-mono text-[11px] font-semibold text-surface-800">
                        {item.sku}
                      </td>
                      <td className="py-2 px-3 text-surface-600">
                        {item.size || LABELS.admin.STATUS_UNAVAILABLE}
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-brand-dark">
                        {formatCurrencyVND(Number(item.sale_price) || 0)}
                      </td>
                      <td className="py-2 px-3 text-center font-medium text-surface-700">
                        {item.stock_quantity}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <BadgeCommon variant="default" size="sm">
                          {item.status}
                        </BadgeCommon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Date Timestamp */}
        <div className="flex items-center gap-1.5 text-xs text-surface-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{LABELS.admin.ORDERS_COL_DATE}: {formattedDate}</span>
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
              onEdit(plant);
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
            {LABELS.admin.PLANTS_ACTION_EDIT}
          </ButtonCommon>
        </div>
      </div>
    </ModalCommon>
  );
};
