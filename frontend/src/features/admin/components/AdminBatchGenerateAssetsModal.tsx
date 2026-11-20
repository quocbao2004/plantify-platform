import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { VALIDATION_MESSAGES } from "@/constants/messages";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon, type SelectOption } from "@/components/common/SelectCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { AdminPlant, BatchGenerateAssetsPayload } from "../types";

interface AdminBatchGenerateAssetsModalProps {
  plant: AdminPlant | null;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (payload: BatchGenerateAssetsPayload) => void;
}

export const AdminBatchGenerateAssetsModal: React.FC<
  AdminBatchGenerateAssetsModalProps
> = ({ plant, open, isLoading = false, onClose, onSubmit }) => {
  const [selectedDetailId, setSelectedDetailId] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [prefix, setPrefix] = useState("");
  const [location, setLocation] = useState<string>(LABELS.admin.ASSETS_DEFAULT_LOCATION);
  const [errors, setErrors] = useState<{
    detailId?: string;
    quantity?: string;
  }>({});

  const details = plant?.details ?? [];

  useEffect(() => {
    if (plant && details.length > 0) {
      setSelectedDetailId(details[0].id);
      const defaultSku = details[0].sku || "";
      setPrefix(defaultSku ? `${defaultSku}-` : "");
      setQuantity(10);
      setLocation(LABELS.admin.ASSETS_DEFAULT_LOCATION);
    } else {
      setSelectedDetailId("");
      setPrefix("");
      setQuantity(10);
      setLocation(LABELS.admin.ASSETS_DEFAULT_LOCATION);
    }
    setErrors({});
  }, [plant, open]);

  // Khi chọn biến thể khác thì tự cập nhật tiền tố gợi ý
  const handleDetailChange = (detailId: string) => {
    setSelectedDetailId(detailId);
    const detail = details.find((d) => d.id === detailId);
    if (detail?.sku) {
      setPrefix(`${detail.sku}-`);
    }
  };

  const detailOptions: SelectOption[] = details.map((d) => ({
    value: d.id,
    label: `${d.size ? `Size ${d.size}` : LABELS.common.DEFAULT} - SKU: ${d.sku} ${LABELS.admin.ASSETS_STOCK_CURRENT(d.stock_quantity)}`,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { detailId?: string; quantity?: string } = {};
    if (!selectedDetailId) {
      newErrors.detailId = VALIDATION_MESSAGES.REQUIRED_FIELD;
    }
    if (!quantity || quantity < 1) {
      newErrors.quantity = VALIDATION_MESSAGES.REQUIRED_FIELD;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      plant_detail_id: selectedDetailId,
      quantity: Number(quantity),
      prefix: prefix.trim() || undefined,
      location: location.trim() || undefined,
    });
  };

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.ASSETS_MODAL_GENERATE_TITLE}
      className="max-w-lg w-full"
    >
      <FormCommon onSubmit={handleSubmit} className="space-y-4 pt-1">
        {plant && (
          <div className="p-3 bg-brand/5 border border-brand/15 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-brand-dark">{plant.name}</p>
              <p className="text-[11px] text-surface-500">{plant.category_name}</p>
            </div>
            <Sparkles className="w-4 h-4 text-brand" />
          </div>
        )}

        {/* Chọn biến thể kích cỡ */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-surface-700">
            {LABELS.admin.ASSETS_FORM_SELECT_SIZE} <span className="text-rose-500">*</span>
          </label>
          <SelectCommon
            options={detailOptions}
            value={selectedDetailId}
            onChange={(e) => handleDetailChange(e.target.value)}
            disabled={isLoading || detailOptions.length === 0}
          />
          {errors.detailId && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.detailId}</p>
          )}
        </div>

        {/* Số lượng cây cảnh */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-surface-700">
            {LABELS.admin.ASSETS_FORM_QUANTITY} <span className="text-rose-500">*</span>
          </label>
          <TextFieldCommon
            type="number"
            min="1"
            max="500"
            value={quantity}
            onChange={(e) => {
              setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1));
              if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
            }}
            placeholder={LABELS.admin.ASSETS_FORM_QUANTITY_PLACEHOLDER}
            disabled={isLoading}
            error={errors.quantity}
          />
        </div>

        {/* Tiền tố mã định danh */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-surface-700">
            {LABELS.admin.ASSETS_FORM_PREFIX}
          </label>
          <TextFieldCommon
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder={LABELS.admin.ASSETS_FORM_PREFIX_PLACEHOLDER}
            disabled={isLoading}
          />
          <p className="text-[11px] text-surface-400 mt-0.5">
            {LABELS.admin.ASSETS_FORM_PREFIX_SAMPLE(prefix || "TAG-")}
          </p>
        </div>

        {/* Vị trí kho */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-surface-700">
            {LABELS.admin.ASSETS_FORM_LOCATION}
          </label>
          <TextFieldCommon
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={LABELS.admin.ASSETS_FORM_LOCATION_PLACEHOLDER}
            disabled={isLoading}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-100">
          <ButtonCommon
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            {LABELS.admin.ASSETS_FORM_CANCEL}
          </ButtonCommon>
          <ButtonCommon
            variant="brand"
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{LABELS.admin.ASSETS_FORM_SUBMIT}</span>
          </ButtonCommon>
        </div>
      </FormCommon>
    </ModalCommon>
  );
};
