import React, { useState } from "react";
import {
  Leaf,
  Tag,
  DollarSign,
  Layers,
  Calendar,
  Pencil,
  BookOpen,
  Info,
  QrCode,
  Sparkles,
  MapPin,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { BadgeCommon, type BadgeVariant } from "@/components/common/BadgeCommon";
import { formatCurrencyVND } from "@/utils/formatCurrency";
import { AdminPlant, AdminPlantAsset } from "../types";
import { ADMIN_PLANT_STATUS_CONFIG } from "../constants/plants";
import { useAdminAssets, useBatchGenerateAssets } from "../hooks/useAdminAssets";
import { AdminPlantAssetQRModal } from "./AdminPlantAssetQRModal";
import { AdminBatchGenerateAssetsModal } from "./AdminBatchGenerateAssetsModal";

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
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<AdminPlantAsset | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Fetch danh sách các cây cảnh định danh thuộc plant này
  const { data: assetsData, refetch: refetchAssets } = useAdminAssets(
    plant?.id ? { plant_id: plant.id } : undefined
  );
  const { mutate: batchGenerate, isPending: isGenerating } = useBatchGenerateAssets();

  if (!plant) return null;

  const assets = assetsData?.results ?? [];

  const statusConfig = plant.is_active
    ? ADMIN_PLANT_STATUS_CONFIG.ACTIVE
    : ADMIN_PLANT_STATUS_CONFIG.INACTIVE;

  const formattedDate = plant.created_at
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(plant.created_at))
    : LABELS.admin.STATUS_UNAVAILABLE;

  const handleBatchGenerateSubmit = (payload: any) => {
    batchGenerate(payload, {
      onSuccess: () => {
        setIsGenerateModalOpen(false);
        refetchAssets();
      },
    });
  };

  const getAssetStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case "AVAILABLE":
        return "success";
      case "RENTED":
        return "info";
      case "MAINTENANCE":
        return "warning";
      case "RETIRED":
        return "error";
      default:
        return "default";
    }
  };

  const getAssetStatusLabel = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return LABELS.admin.ASSETS_STATUS_AVAILABLE;
      case "RENTED":
        return LABELS.admin.ASSETS_STATUS_RENTED;
      case "MAINTENANCE":
        return LABELS.admin.ASSETS_STATUS_MAINTENANCE;
      case "RESERVED":
        return LABELS.admin.ASSETS_STATUS_RESERVED;
      case "RETIRED":
        return LABELS.admin.ASSETS_STATUS_RETIRED;
      default:
        return status;
    }
  };

  const getAssetHealthLabel = (health: string) => {
    switch (health) {
      case "EXCELLENT":
        return LABELS.admin.ASSETS_HEALTH_EXCELLENT;
      case "FAIR":
        return LABELS.admin.ASSETS_HEALTH_FAIR;
      case "NEEDS_CARE":
        return LABELS.admin.ASSETS_HEALTH_NEEDS_CARE;
      case "DAMAGED":
        return LABELS.admin.ASSETS_HEALTH_DAMAGED;
      default:
        return health;
    }
  };

  return (
    <>
      <ModalCommon
        open={open}
        onClose={onClose}
        title={LABELS.admin.PLANTS_MODAL_DETAIL_TITLE}
        className="max-w-4xl w-full"
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

          {/* ── KHU VỰC: QUẢN LÝ CÂY CẢNH ĐỊNH DANH & MÃ QR ── */}
          <div className="p-4 rounded-2xl border-2 border-brand/20 bg-brand/5/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-brand" />
                  <h4 className="text-sm font-bold text-surface-900 font-sans">
                    {LABELS.admin.ASSETS_TAB_TITLE}
                  </h4>
                  <BadgeCommon variant="default" size="sm">
                    {assets.length}
                  </BadgeCommon>
                </div>
                <p className="text-xs text-surface-500 mt-0.5">
                  {LABELS.admin.ASSETS_MGMT_DESCRIPTION}
                </p>
              </div>

              <ButtonCommon
                type="button"
                variant="brand"
                size="sm"
                onClick={() => setIsGenerateModalOpen(true)}
                disabled={!plant.details || plant.details.length === 0}
                className="flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{LABELS.admin.ASSETS_BATCH_GENERATE_BTN}</span>
              </ButtonCommon>
            </div>

            {/* Bảng danh sách từng cây cảnh */}
            {assets.length > 0 ? (
              <div className="border border-surface-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-surface-50 border-b border-surface-200/80 text-surface-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">{LABELS.admin.ASSETS_COL_CODE}</th>
                      <th className="py-2.5 px-3">{LABELS.admin.ASSETS_COL_SIZE}</th>
                      <th className="py-2.5 px-3 text-center">{LABELS.admin.ASSETS_COL_STATUS}</th>
                      <th className="py-2.5 px-3 text-center">{LABELS.admin.ASSETS_COL_HEALTH}</th>
                      <th className="py-2.5 px-3">{LABELS.admin.ASSETS_COL_LOCATION}</th>
                      <th className="py-2.5 px-3 text-right">{LABELS.admin.ASSETS_COL_ACTIONS}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {assets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-surface-50/60">
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-xs text-surface-900 bg-surface-100 px-2 py-0.5 rounded border border-surface-200/70 inline-block">
                            {asset.asset_code}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-surface-600 font-medium">
                          {asset.size ? `Size ${asset.size}` : LABELS.admin.STATUS_UNAVAILABLE}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <BadgeCommon variant={getAssetStatusVariant(asset.status)} size="sm">
                            {getAssetStatusLabel(asset.status)}
                          </BadgeCommon>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {getAssetHealthLabel(asset.health_condition)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-surface-600 max-w-[150px] truncate">
                          <div className="flex items-center gap-1 truncate" title={asset.current_location}>
                            <MapPin className="w-3 h-3 text-surface-400 shrink-0" />
                            <span className="truncate">{asset.current_location}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <ButtonCommon
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs text-brand border-brand/30 hover:bg-brand/5"
                            onClick={() => setSelectedAssetForQR(asset)}
                            title={LABELS.admin.ASSETS_ACTION_VIEW_QR}
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline ml-1">
                              {LABELS.admin.ASSETS_COL_QR}
                            </span>
                          </ButtonCommon>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center bg-white rounded-xl border border-dashed border-surface-300 p-4">
                <QrCode className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-surface-700">
                  {LABELS.admin.ASSETS_EMPTY_TITLE}
                </p>
                <p className="text-[11px] text-surface-400 max-w-sm mx-auto mt-1">
                  {LABELS.admin.ASSETS_EMPTY_DESC}
                </p>
              </div>
            )}
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

      {/* Modal In & Xem QR Code của cây cảnh */}
      <AdminPlantAssetQRModal
        open={Boolean(selectedAssetForQR)}
        asset={selectedAssetForQR}
        onClose={() => setSelectedAssetForQR(null)}
      />

      {/* Modal Sinh mã số riêng hàng loạt */}
      <AdminBatchGenerateAssetsModal
        open={isGenerateModalOpen}
        plant={plant}
        isLoading={isGenerating}
        onClose={() => setIsGenerateModalOpen(false)}
        onSubmit={handleBatchGenerateSubmit}
      />
    </>
  );
};

