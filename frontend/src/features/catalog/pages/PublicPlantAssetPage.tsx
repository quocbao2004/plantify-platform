import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  Leaf,
  QrCode,
  MapPin,
  Activity,
  ShieldCheck,
  Phone,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { LABELS } from "@/constants/labels";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { BadgeCommon, type BadgeVariant } from "@/components/common/BadgeCommon";
import { useAdminAssetDetail } from "@/features/admin/hooks/useAdminAssets";

export const PublicPlantAssetPage: React.FC = () => {
  const { assetCode } = useParams<{ assetCode: string }>();
  const { data: asset, isLoading, error } = useAdminAssetDetail(assetCode || "");

  if (isLoading) {
    return <LoadingOverlay message={LABELS.common.LOADING_DATA} />;
  }

  if (error || !asset) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-surface-900 font-sans">
          {LABELS.admin.PUBLIC_ASSET_NOT_FOUND}
        </h2>
        <p className="text-xs text-surface-500 max-w-sm mt-1">
          {LABELS.admin.PUBLIC_ASSET_NOT_FOUND_DESC}
        </p>
        <Link to="/" className="mt-5">
          <ButtonCommon variant="outline" size="sm">
            {LABELS.admin.PUBLIC_ASSET_BACK_HOME}
          </ButtonCommon>
        </Link>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
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

  return (
    <div className="min-h-screen bg-surface-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-4">
        {/* Navigation Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{LABELS.admin.PUBLIC_ASSET_BACK_HOME}</span>
        </Link>

        {/* Card thông tin định danh cây cảnh */}
        <div className="bg-white rounded-2xl border border-surface-200/80 shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-brand/10 via-brand/5 to-surface-50 border-b border-surface-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center shadow-xs">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-surface-900">
                  {LABELS.common.BRAND}
                </p>
                <p className="text-[10px] text-surface-500">
                  {LABELS.admin.PUBLIC_ASSET_PAGE_TITLE}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-surface-200 shadow-2xs">
              <QrCode className="w-3.5 h-3.5 text-brand" />
              <span className="font-mono text-xs font-bold text-surface-800">
                {asset.asset_code}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* Image & Basic Info */}
            <div className="flex items-start gap-4">
              {asset.primary_image ? (
                <img
                  src={asset.primary_image}
                  alt={asset.plant_name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-surface-200 shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 text-brand">
                  <Leaf className="w-8 h-8" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-surface-900 font-serif leading-tight">
                  {asset.plant_name}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {asset.size && (
                    <span className="px-2 py-0.5 rounded-md bg-brand/10 text-brand font-semibold text-xs">
                      Size {asset.size}
                    </span>
                  )}
                  <span className="text-xs text-surface-400 font-mono">
                    SKU: {asset.sku}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <BadgeCommon variant={getStatusBadgeVariant(asset.status)} size="sm">
                    {asset.status_display || asset.status}
                  </BadgeCommon>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {asset.health_display || asset.health_condition}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metadata Box */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-50 border border-surface-100 text-xs text-surface-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-surface-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-surface-400 uppercase font-semibold">
                    {LABELS.admin.PUBLIC_ASSET_LOCATION_HEADER}
                  </p>
                  <p className="font-medium truncate">{asset.current_location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-surface-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-surface-400 uppercase font-semibold">
                    {LABELS.admin.PUBLIC_ASSET_HEALTH_HEADER}
                  </p>
                  <p className="font-medium text-emerald-700 truncate">
                    {asset.health_display || asset.health_condition}
                  </p>
                </div>
              </div>
            </div>

            {/* Care Guide Instructions */}
            <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{LABELS.admin.PUBLIC_ASSET_CARE_INSTRUCTIONS}</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed whitespace-pre-line">
                {asset.care_guide || LABELS.admin.PUBLIC_ASSET_CARE_GUIDE_EMPTY}
              </p>
            </div>

            {/* Description if present */}
            {asset.description && (
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
                  {LABELS.admin.PUBLIC_ASSET_DESCRIPTION}
                </p>
                <p className="text-xs text-surface-600 leading-relaxed">
                  {asset.description}
                </p>
              </div>
            )}

            {/* Hotline & Support CTA */}
            <div className="p-4 rounded-xl border border-surface-200 bg-surface-50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-surface-800">
                <Phone className="w-4 h-4 text-brand" />
                <span>{LABELS.admin.PUBLIC_ASSET_HOTLINE_TITLE}</span>
              </div>
              <p className="text-sm font-bold text-brand font-mono">
                {LABELS.admin.PUBLIC_ASSET_HOTLINE_NUMBER}
              </p>
              <p className="text-[11px] text-surface-500">
                {LABELS.admin.ASSETS_QR_SCAN_HINT}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
