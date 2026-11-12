import React, { useState, useEffect } from "react";
import { LABELS } from "@/constants/labels";
import { VALIDATION_MESSAGES } from "@/constants/messages";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { SelectCommon, type SelectOption } from "@/components/common/SelectCommon";
import { CheckboxCommon } from "@/components/common/CheckboxCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { AdminPlant, AdminCategory, CreateAdminPlantPayload } from "../types";

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
    }
    setErrors({});
  }, [plant, categories, open]);

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

  return (
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
            <label
              htmlFor="plant-category-select"
              className="block text-xs font-semibold text-surface-700"
            >
              {LABELS.admin.PLANTS_FORM_CATEGORY} <span className="text-rose-500">*</span>
            </label>
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

        {/* Primary Image URL */}
        <div className="space-y-1">
          <label
            htmlFor="plant-image-input"
            className="block text-xs font-semibold text-surface-700"
          >
            {LABELS.admin.PLANTS_FORM_IMAGE_URL}
          </label>
          <TextFieldCommon
            id="plant-image-input"
            value={formData.primary_image || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, primary_image: e.target.value }))
            }
            placeholder={LABELS.admin.PLANTS_FORM_IMAGE_URL_PLACEHOLDER}
            disabled={isLoading}
          />
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
  );
};
