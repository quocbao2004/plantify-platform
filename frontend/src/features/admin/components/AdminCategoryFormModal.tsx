import React, { useState, useEffect } from "react";
import { LABELS } from "@/constants/labels";
import { VALIDATION_MESSAGES } from "@/constants/messages";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { TextFieldCommon } from "@/components/common/TextFieldCommon";
import { TextareaCommon } from "@/components/common/TextareaCommon";
import { CheckboxCommon } from "@/components/common/CheckboxCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { AdminCategory, CreateAdminCategoryPayload } from "../types";

interface AdminCategoryFormModalProps {
  category: AdminCategory | null; // null means create mode, object means edit mode
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAdminCategoryPayload) => void;
}

export const AdminCategoryFormModal: React.FC<AdminCategoryFormModalProps> = ({
  category,
  open,
  isLoading = false,
  onClose,
  onSubmit,
}) => {
  const isEditMode = Boolean(category);

  const [formData, setFormData] = useState<CreateAdminCategoryPayload>({
    name: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        sort_order: category.sort_order ?? 0,
        is_active: category.is_active,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        sort_order: 0,
        is_active: true,
      });
    }
    setErrors({});
  }, [category, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = VALIDATION_MESSAGES.REQUIRED(LABELS.admin.CATEGORIES_FORM_NAME);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      sort_order: Number(formData.sort_order) || 0,
    });
  };

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={
        isEditMode
          ? LABELS.admin.CATEGORIES_MODAL_EDIT_TITLE
          : LABELS.admin.CATEGORIES_MODAL_ADD_TITLE
      }
    >
      <FormCommon onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Tên danh mục */}
        <TextFieldCommon
          label={LABELS.admin.CATEGORIES_FORM_NAME}
          id="category-name"
          placeholder={LABELS.admin.CATEGORIES_FORM_NAME_PLACEHOLDER}
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          required
          autoFocus
        />

        {/* Thứ tự ưu tiên */}
        <TextFieldCommon
          label={LABELS.admin.CATEGORIES_FORM_SORT_ORDER}
          id="category-sort-order"
          type="number"
          placeholder={LABELS.admin.CATEGORIES_FORM_SORT_ORDER_PLACEHOLDER}
          value={String(formData.sort_order ?? 0)}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              sort_order: Math.max(0, parseInt(e.target.value, 10) || 0),
            }))
          }
        />

        {/* Mô tả */}
        <TextareaCommon
          id="category-description"
          label={LABELS.admin.CATEGORIES_FORM_DESCRIPTION}
          rows={3}
          placeholder={LABELS.admin.CATEGORIES_FORM_DESCRIPTION_PLACEHOLDER}
          value={formData.description || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full text-xs"
        />

        {/* Trạng thái hoạt động */}
        <div className="pt-1">
          <CheckboxCommon
            label={LABELS.admin.CATEGORIES_FORM_STATUS}
            checked={formData.is_active ?? true}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, is_active: checked }))
            }
          />
        </div>

        {/* Nút hành động */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-100">
          <ButtonCommon
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            {LABELS.admin.CATEGORIES_FORM_CANCEL}
          </ButtonCommon>
          <ButtonCommon
            variant="brand"
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {LABELS.admin.CATEGORIES_FORM_SAVE}
          </ButtonCommon>
        </div>
      </FormCommon>
    </ModalCommon>
  );
};
