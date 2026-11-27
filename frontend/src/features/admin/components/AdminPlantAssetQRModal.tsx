import React, { useRef } from "react";
import { Printer, MapPin, Activity, Leaf } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { AdminPlantAsset } from "../types";

interface AdminPlantAssetQRModalProps {
  asset: AdminPlantAsset | null;
  open: boolean;
  onClose: () => void;
}

export const AdminPlantAssetQRModal: React.FC<AdminPlantAssetQRModalProps> = ({
  asset,
  open,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!asset) return null;

  // URL công khai để quét mã QR bằng điện thoại
  const publicQrUrl = `${window.location.origin}/qr/${asset.asset_code}`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
    publicQrUrl
  )}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.ASSETS_QR_MODAL_TITLE}
      className="max-w-md w-full"
    >
      <div className="space-y-4 pt-1">
        {/* Printable Physical Tag Card */}
        <div
          ref={printRef}
          className="print-asset-tag p-4 rounded-2xl border-2 border-surface-900/80 bg-white text-surface-900 shadow-sm space-y-3"
        >
          {/* Header Tag */}
          <div className="flex items-center justify-between border-b border-surface-200 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-brand" />
              <span className="font-bold text-xs uppercase tracking-wider text-surface-900">
                {LABELS.common.BRAND}
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold text-surface-500 uppercase">
              PLANT ASSET TAG
            </span>
          </div>

          {/* Plant Name & Serial Code */}
          <div className="text-center space-y-0.5">
            <h3 className="font-bold text-base text-surface-900 line-clamp-1">
              {asset.plant_name}
            </h3>
            <div className="flex items-center justify-center gap-2 text-xs text-surface-600">
              {asset.size && (
                <span className="font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded text-[11px]">
                  Size {asset.size}
                </span>
              )}
              <span className="font-mono text-surface-400">SKU: {asset.sku}</span>
            </div>
          </div>

          {/* QR Code Graphic */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="p-2 bg-white rounded-xl border border-surface-200 shadow-2xs">
              <img
                src={qrImageSrc}
                alt={`QR Code for ${asset.asset_code}`}
                width={150}
                height={150}
                className="w-36 h-36 object-contain"
              />
            </div>
            <div className="mt-2 text-center">
              <p className="font-mono font-bold text-base tracking-wider text-surface-900 bg-surface-100 px-3 py-1 rounded-md border border-surface-200 inline-block">
                {asset.asset_code}
              </p>
              <p className="text-[10px] text-surface-500 mt-1 max-w-[220px]">
                {LABELS.admin.ASSETS_QR_SCAN_HINT}
              </p>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-100 text-[11px] text-surface-600">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-surface-400 shrink-0" />
              <span className="truncate">{asset.current_location}</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <Activity className="w-3.5 h-3.5 text-surface-400 shrink-0" />
              <span className="font-medium text-emerald-600">
                {asset.health_display || asset.health_condition}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-100">
          <ButtonCommon
            variant="outline"
            type="button"
            onClick={onClose}
            className="text-xs"
          >
            {LABELS.admin.ASSETS_QR_CLOSE_BTN}
          </ButtonCommon>
          <ButtonCommon
            variant="brand"
            type="button"
            onClick={handlePrint}
            className="text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{LABELS.admin.ASSETS_QR_PRINT_BTN}</span>
          </ButtonCommon>
        </div>
      </div>
    </ModalCommon>
  );
};
