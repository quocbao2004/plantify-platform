import React, { useState, useEffect, useRef } from "react";
import { Plus, UploadCloud, X, Link2, Loader2, CheckCircle2 } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { MESSAGES, VALIDATION_MESSAGES } from "@/constants/messages";
import { CURRENCY } from "@/constants";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { TextareaCommon } from "@/components/common/TextareaCommon";
import { SelectCommon, type SelectOption } from "@/components/common/SelectCommon";
import { CheckboxCommon } from "@/components/common/CheckboxCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { formatNumberWithDots, parseNumberFromDots } from "@/utils";
import {
  AdminPlant,
  AdminCategory,
  CreateAdminPlantPayload,
  CreateAdminCategoryPayload,
} from "../types";
import { useCreateAdminCategory } from "../hooks/useAdminCategories";
import { adminPlantsApi } from "../api/adminPlantsApi";
import { AdminCategoryFormModal } from "./AdminCategoryFormModal";

interface AdminPlantFormModalProps {
  plant: AdminPlant | null; // null means create mode, object means edit mode
  categories: AdminCategory[];
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAdminPlantPayload) => void;
}

export const AdminPlantFormModal: React.FC<AdminPlantFormModalProps> = ({
  plant,
  categories,
  open,
  isLoading = false,
  onClose,
  onSubmit,
}) => {
  const isEditMode = Boolean(plant);
  const [isQuickCategoryModalOpen, setIsQuickCategoryModalOpen] = useState(false);
  const { mutate: quickCreateCategory, isPending: isQuickCreating } = useCreateAdminCategory();

  const [formData, setFormData] = useState<CreateAdminPlantPayload>({
    name: "",
    category: "",
    description: "",
    care_guide: "",
    is_active: true,
    primary_image: "",
    sale_price: 0,
    rental_price: 0,
    stock_quantity: 1,
  });

  const [salePriceInput, setSalePriceInput] = useState<string>("");
  const [rentalPriceInput, setRentalPriceInput] = useState<string>("");
  const [stockInput, setStockInput] = useState<string>("1");

  const [errors, setErrors] = useState<{
    name?: string;
    category?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name || "",
        category: plant.category || "",
        description: plant.description || "",
        care_guide: plant.care_guide || "",
        is_active: plant.is_active,
        primary_image: plant.primary_image || "",
        sale_price: plant.sale_price || 0,
        rental_price: plant.rental_price || 0,
        stock_quantity: plant.details?.[0]?.stock_quantity ?? 1,
      });
      setSalePriceInput(plant.sale_price ? formatNumberWithDots(plant.sale_price) : "");
      setRentalPriceInput(plant.rental_price ? formatNumberWithDots(plant.rental_price) : "");
      setStockInput(String(plant.details?.[0]?.stock_quantity ?? 1));
      setUseUrlMode(Boolean(plant.primary_image && !plant.primary_image.includes("/media/")));
    } else {
      setFormData({
        name: "",
        category: categories.length > 0 ? categories[0].id : "",
        description: "",
        care_guide: "",
        is_active: true,
        primary_image: "",
        sale_price: 0,
        rental_price: 0,
        stock_quantity: 1,
      });
      setSalePriceInput("");
      setRentalPriceInput("");
      setStockInput("1");
      setUseUrlMode(false);
    }
    setErrors({});
    setUploadError(null);
  }, [plant, categories, open]);

  // Xu ly nhap gia tien: lay so thuan tuy va xoa so 0 o dau (vi du: 0500000 -> 500000)
  const handlePriceChange = (
    field: "sale_price" | "rental_price",
    valueStr: string,
  ) => {
    const digits = valueStr.replace(/\D/g, "");
    const cleaned = digits.replace(/^0+(?=\d)/, "");
    const numericValue = cleaned ? parseInt(cleaned, 10) : 0;

    if (field === "sale_price") {
      setSalePriceInput(cleaned);
    } else {
      setRentalPriceInput(cleaned);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: numericValue,
    }));
  };

  // Khi roi khoi o nhap gia: tu dong format thanh chuoi co dau cham (500000 -> 500.000)
  const handlePriceBlur = (field: "sale_price" | "rental_price") => {
    const rawVal = field === "sale_price" ? salePriceInput : rentalPriceInput;
    const formatted = formatNumberWithDots(rawVal);
    if (field === "sale_price") {
      setSalePriceInput(formatted);
    } else {
      setRentalPriceInput(formatted);
    }
  };

  // Khi focus vao lai o nhap gia: chuyen ve so thuan tuy de chinh sua va tu dong boi den
  const handlePriceFocus = (
    field: "sale_price" | "rental_price",
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const rawVal = field === "sale_price" ? salePriceInput : rentalPriceInput;
    const digits = rawVal.replace(/\D/g, "");
    const cleaned = digits.replace(/^0+(?=\d)/, "");
    if (field === "sale_price") {
      setSalePriceInput(cleaned);
    } else {
      setRentalPriceInput(cleaned);
    }
    e.target.select();
  };

  // Xu ly nhap so luong ton kho: xoa so 0 o dau (vi du: 01555 -> 1555)
  const handleStockChange = (rawVal: string) => {
    const digits = rawVal.replace(/\D/g, "");
    const cleaned = digits.replace(/^0+(?=\d)/, "");
    setStockInput(cleaned);
    const num = cleaned ? parseInt(cleaned, 10) : 0;
    setFormData((prev) => ({ ...prev, stock_quantity: num }));
  };

  const handleStockBlur = () => {
    if (!stockInput) {
      setStockInput("1");
      setFormData((prev) => ({ ...prev, stock_quantity: 1 }));
    }
  };

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError(MESSAGES.IMAGE_TYPE_INVALID);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(MESSAGES.IMAGE_SIZE_EXCEEDED);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const res = await adminPlantsApi.uploadImage(file);
      const imageUrl = res.url || res.relative_url || "";
      setFormData((prev) => ({ ...prev, primary_image: imageUrl }));
    } catch (err: any) {
      const msg = err?.response?.data?.error || MESSAGES.IMAGE_UPLOAD_FAILED;
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, primary_image: "" }));
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; category?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = VALIDATION_MESSAGES.REQUIRED(LABELS.admin.PLANTS_FORM_NAME);
    }
    if (!formData.category) {
      newErrors.category = VALIDATION_MESSAGES.REQUIRED_FIELD;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim(),
      care_guide: formData.care_guide?.trim(),
      primary_image: formData.primary_image?.trim() || undefined,
      sale_price: parseNumberFromDots(salePriceInput),
      rental_price: parseNumberFromDots(rentalPriceInput),
      stock_quantity: Math.max(0, parseInt(stockInput || "0", 10)),
    });
  };

  const handleQuickCategorySubmit = (catPayload: CreateAdminCategoryPayload) => {
    quickCreateCategory(catPayload, {
      onSuccess: (newCat) => {
        setIsQuickCategoryModalOpen(false);
        if (newCat?.id) {
          setFormData((prev) => ({ ...prev, category: newCat.id }));
          setErrors((prev) => ({ ...prev, category: undefined }));
        }
      },
    });
  };

  return (
    <>
      <ModalCommon
        open={open}
        onClose={onClose}
        title={
          isEditMode
            ? LABELS.admin.PLANTS_MODAL_EDIT_TITLE
            : LABELS.admin.PLANTS_MODAL_ADD_TITLE
        }
        className="max-w-2xl w-full"
      >
      <FormCommon
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        className="space-y-4 pt-2"
      >
        {/* Name & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="plant-name-input"
              className="block text-xs font-semibold text-surface-700"
            >
              {LABELS.admin.PLANTS_FORM_NAME} <span className="text-rose-500">*</span>
            </label>
            <TextFieldCommon
              id="plant-name-input"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder={LABELS.admin.PLANTS_FORM_NAME_PLACEHOLDER}
              disabled={isLoading}
              error={errors.name}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="plant-category-select"
                className="block text-xs font-semibold text-surface-700"
              >
                {LABELS.admin.PLANTS_FORM_CATEGORY} <span className="text-rose-500">*</span>
              </label>
              <ButtonCommon
                type="button"
                variant="unstyled"
                size="unstyled"
                onClick={() => setIsQuickCategoryModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-dark hover:underline"
              >
                <Plus className="w-3 h-3" />
                {LABELS.admin.PLANTS_QUICK_ADD_CATEGORY}
              </ButtonCommon>
            </div>
            <SelectCommon
              id="plant-category-select"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, category: e.target.value }));
                if (errors.category)
                  setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              disabled={isLoading}
            />
            {errors.category && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Pricing & Stock Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-surface-50 border border-surface-200/80 items-start">
          <div className="space-y-1">
            <label
              htmlFor="plant-price-input"
              className="block text-xs font-semibold text-surface-700 min-h-[2.25rem] leading-tight"
            >
              {LABELS.admin.PLANTS_FORM_PRICE}
            </label>
            <TextFieldCommon
              id="plant-price-input"
              type="text"
              inputMode="numeric"
              value={salePriceInput}
              onChange={(e) => handlePriceChange("sale_price", e.target.value)}
              onFocus={(e) => handlePriceFocus("sale_price", e)}
              onBlur={() => handlePriceBlur("sale_price")}
              placeholder={LABELS.admin.PLANTS_FORM_PRICE_PLACEHOLDER}
              disabled={isLoading}
            />
            <div className="min-h-[1.25rem] mt-1 flex items-center">
              {Number(formData.sale_price) > 0 && (
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                  ≈ {formatNumberWithDots(formData.sale_price)} {CURRENCY.SYMBOL}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="plant-rental-price-input"
              className="block text-xs font-semibold text-surface-700 min-h-[2.25rem] leading-tight"
            >
              {LABELS.admin.PLANTS_FORM_RENTAL_PRICE}
            </label>
            <TextFieldCommon
              id="plant-rental-price-input"
              type="text"
              inputMode="numeric"
              value={rentalPriceInput}
              onChange={(e) => handlePriceChange("rental_price", e.target.value)}
              onFocus={(e) => handlePriceFocus("rental_price", e)}
              onBlur={() => handlePriceBlur("rental_price")}
              placeholder={LABELS.admin.PLANTS_FORM_RENTAL_PRICE_PLACEHOLDER}
              disabled={isLoading}
            />
            <div className="min-h-[1.25rem] mt-1 flex items-center">
              {Number(formData.rental_price) > 0 && (
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shrink-0">
                  ≈ {formatNumberWithDots(formData.rental_price)} {CURRENCY.SYMBOL}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="plant-stock-input"
              className="block text-xs font-semibold text-surface-700 min-h-[2.25rem] leading-tight"
            >
              {LABELS.admin.PLANTS_FORM_STOCK}
            </label>
            <TextFieldCommon
              id="plant-stock-input"
              type="text"
              inputMode="numeric"
              value={stockInput}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleStockChange(e.target.value)}
              onBlur={handleStockBlur}
              placeholder={LABELS.admin.PLANTS_FORM_STOCK_PLACEHOLDER}
              disabled={isLoading}
            />
            <div className="min-h-[1.25rem] mt-1" />
          </div>
        </div>

        {/* Image Upload / URL Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-surface-700">
              {LABELS.admin.PLANTS_FORM_IMAGE_LABEL}
            </label>
            <ButtonCommon
              type="button"
              variant="unstyled"
              size="unstyled"
              onClick={() => {
                setUseUrlMode(!useUrlMode);
                setUploadError(null);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-dark hover:underline"
            >
              {useUrlMode ? (
                <>
                  <UploadCloud className="w-3 h-3" />
                  {LABELS.admin.PLANTS_IMAGE_UPLOAD_BTN}
                </>
              ) : (
                <>
                  <Link2 className="w-3 h-3" />
                  {LABELS.admin.PLANTS_IMAGE_URL_BTN}
                </>
              )}
            </ButtonCommon>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading || isUploading}
          />

          {useUrlMode ? (
            /* Mode 1: Dán link URL */
            <div className="space-y-2">
              <TextFieldCommon
                id="plant-image-input"
                value={formData.primary_image || ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, primary_image: e.target.value }));
                  setUploadError(null);
                }}
                placeholder={LABELS.admin.PLANTS_FORM_IMAGE_URL_PLACEHOLDER}
                disabled={isLoading}
              />
              {formData.primary_image ? (
                <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-surface-200 bg-surface-50 group">
                  <img
                    src={formData.primary_image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setUploadError(MESSAGES.IMAGE_URL_INVALID)}
                  />
                  <ButtonCommon
                    type="button"
                    variant="unstyled"
                    size="unstyled"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                    title={LABELS.admin.PLANTS_IMAGE_DELETE_BTN}
                  >
                    <X className="w-3.5 h-3.5" />
                  </ButtonCommon>
                </div>
              ) : null}
            </div>
          ) : (
            /* Mode 2: Tải file từ máy tính */
            <div>
              {formData.primary_image ? (
                /* Đã có ảnh preview */
                <div className="relative flex items-center gap-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-surface-200 bg-surface-100 shrink-0 shadow-2xs">
                    <img
                      src={formData.primary_image}
                      alt="Plant Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{LABELS.admin.PLANTS_IMAGE_UPLOADED_SUCCESS}</span>
                    </div>
                    <p className="text-[11px] text-surface-500 truncate mt-0.5">
                      {formData.primary_image}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <ButtonCommon
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || isUploading}
                        className="text-xs h-7 px-2.5 rounded-md"
                      >
                        {LABELS.admin.PLANTS_IMAGE_CHANGE_BTN}
                      </ButtonCommon>
                      <ButtonCommon
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isLoading || isUploading}
                        className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                      >
                        {LABELS.admin.PLANTS_IMAGE_DELETE_BTN}
                      </ButtonCommon>
                    </div>
                  </div>
                </div>
              ) : (
                /* Khung Dropzone chọn file */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? "border-brand bg-brand/5 scale-[0.99]"
                      : "border-surface-300 hover:border-brand/70 hover:bg-surface-50/80 bg-white"
                  } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                      <Loader2 className="w-7 h-7 text-brand animate-spin" />
                      <p className="text-xs font-medium text-surface-700">
                        {LABELS.admin.PLANTS_IMAGE_UPLOADING}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center shadow-2xs">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-surface-600">
                        <span className="font-semibold text-brand hover:underline">
                          {LABELS.admin.PLANTS_IMAGE_DROPZONE_SELECT}
                        </span>{" "}
                        {LABELS.admin.PLANTS_IMAGE_DROPZONE_OR_DRAG}
                      </div>
                      <p className="text-[11px] text-surface-400">
                        {LABELS.admin.PLANTS_IMAGE_DROPZONE_HINT}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {uploadError && (
            <p className="text-[11px] font-medium text-rose-600 mt-1 flex items-center gap-1">
              <span>•</span> {uploadError}
            </p>
          )}
        </div>

        {/* Description */}
        <TextareaCommon
          id="plant-desc-input"
          label={LABELS.admin.PLANTS_FORM_DESCRIPTION}
          rows={3}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={formData.description || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder={LABELS.admin.PLANTS_FORM_DESCRIPTION_PLACEHOLDER}
          disabled={isLoading}
          className="w-full text-xs"
        />

        {/* Care Guide */}
        <TextareaCommon
          id="plant-care-input"
          label={LABELS.admin.PLANTS_FORM_CARE_GUIDE}
          rows={3}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={formData.care_guide || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, care_guide: e.target.value }))
          }
          placeholder={LABELS.admin.PLANTS_FORM_CARE_GUIDE_PLACEHOLDER}
          disabled={isLoading}
          className="w-full text-xs"
        />

        {/* Active Checkbox */}
        <div className="pt-1">
          <CheckboxCommon
            id="plant-active-checkbox"
            checked={formData.is_active ?? true}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
            }
            label={LABELS.admin.PLANTS_FORM_STATUS}
            disabled={isLoading}
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-200/80">
          <ButtonCommon
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {LABELS.admin.PLANTS_FORM_CANCEL}
          </ButtonCommon>

          <ButtonCommon
            type="submit"
            variant="brand"
            size="sm"
            isLoading={isLoading}
          >
            {LABELS.admin.PLANTS_FORM_SAVE}
          </ButtonCommon>
        </div>
      </FormCommon>
    </ModalCommon>

    <AdminCategoryFormModal
      open={isQuickCategoryModalOpen}
      category={null}
      isLoading={isQuickCreating}
      onClose={() => setIsQuickCategoryModalOpen(false)}
      onSubmit={handleQuickCategorySubmit}
    />
  </>
  );
};
