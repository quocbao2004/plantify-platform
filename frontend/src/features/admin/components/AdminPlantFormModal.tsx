import React, { useState, useEffect, useRef } from "react";
import { Plus, UploadCloud, X, Link2, Loader2, CheckCircle2 } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { MESSAGES, VALIDATION_MESSAGES } from "@/constants/messages";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon, type SelectOption } from "@/components/common/SelectCommon";
import { CheckboxCommon } from "@/components/common/CheckboxCommon";
import { FormCommon } from "@/components/common/FormCommon";
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
    stock_quantity: 10,
  });

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
        stock_quantity: plant.details?.[0]?.stock_quantity ?? 10,
      });
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
        stock_quantity: 10,
      });
      setUseUrlMode(false);
    }
    setErrors({});
    setUploadError(null);
  }, [plant, categories, open]);

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
      sale_price: Number(formData.sale_price) || 0,
      rental_price: Number(formData.rental_price) || 0,
      stock_quantity: Number(formData.stock_quantity) || 0,
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
              <button
                type="button"
                onClick={() => setIsQuickCategoryModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-dark hover:underline"
              >
                <Plus className="w-3 h-3" />
                {LABELS.admin.PLANTS_QUICK_ADD_CATEGORY}
              </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-surface-50 border border-surface-200/80">
          <div className="space-y-1">
            <label
              htmlFor="plant-price-input"
              className="block text-xs font-semibold text-surface-700"
            >
              {LABELS.admin.PLANTS_FORM_PRICE}
            </label>
            <TextFieldCommon
              id="plant-price-input"
              type="number"
              min="0"
              value={formData.sale_price ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sale_price: Number(e.target.value) }))
              }
              placeholder={LABELS.admin.PLANTS_FORM_PRICE_PLACEHOLDER}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="plant-rental-price-input"
              className="block text-xs font-semibold text-surface-700"
            >
              {LABELS.admin.PLANTS_FORM_RENTAL_PRICE}
            </label>
            <TextFieldCommon
              id="plant-rental-price-input"
              type="number"
              min="0"
              value={formData.rental_price ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, rental_price: Number(e.target.value) }))
              }
              placeholder={LABELS.admin.PLANTS_FORM_RENTAL_PRICE_PLACEHOLDER}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="plant-stock-input"
              className="block text-xs font-semibold text-surface-700"
            >
              {LABELS.admin.PLANTS_FORM_STOCK}
            </label>
            <TextFieldCommon
              id="plant-stock-input"
              type="number"
              min="0"
              value={formData.stock_quantity ?? 10}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stock_quantity: Number(e.target.value),
                }))
              }
              placeholder={LABELS.admin.PLANTS_FORM_STOCK_PLACEHOLDER}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Image Upload / URL Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-surface-700">
              {LABELS.admin.PLANTS_FORM_IMAGE_LABEL}
            </label>
            <button
              type="button"
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
            </button>
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
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                    title={LABELS.admin.PLANTS_IMAGE_DELETE_BTN}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
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
        <div className="space-y-1">
          <label
            htmlFor="plant-desc-input"
            className="block text-xs font-semibold text-surface-700"
          >
            {LABELS.admin.PLANTS_FORM_DESCRIPTION}
          </label>
          <textarea
            id="plant-desc-input"
            rows={3}
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder={LABELS.admin.PLANTS_FORM_DESCRIPTION_PLACEHOLDER}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-surface-300 bg-white text-surface-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-surface-100 disabled:text-surface-400"
          />
        </div>

        {/* Care Guide */}
        <div className="space-y-1">
          <label
            htmlFor="plant-care-input"
            className="block text-xs font-semibold text-surface-700"
          >
            {LABELS.admin.PLANTS_FORM_CARE_GUIDE}
          </label>
          <textarea
            id="plant-care-input"
            rows={3}
            value={formData.care_guide || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, care_guide: e.target.value }))
            }
            placeholder={LABELS.admin.PLANTS_FORM_CARE_GUIDE_PLACEHOLDER}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-surface-300 bg-white text-surface-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-surface-100 disabled:text-surface-400"
          />
        </div>

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
