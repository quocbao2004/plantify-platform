import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Leaf, ExternalLink } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { AdminCategory } from "../types";

interface AdminCategoryDeleteModalProps {
  category: AdminCategory | null;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (category: AdminCategory) => void;
}

export const AdminCategoryDeleteModal: React.FC<AdminCategoryDeleteModalProps> = ({
  category,
  open,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  if (!category) return null;

  const plantsCount = category.plants_count ?? 0;
  const hasPlants = plantsCount > 0;

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={
        hasPlants
          ? LABELS.admin.CATEGORIES_DELETE_BLOCKED_TITLE
          : LABELS.admin.CATEGORIES_DELETE_CONFIRM_TITLE
      }
    >
      <div className="space-y-4 pt-1">
        {hasPlants ? (
          /* TRƯỜNG HỢP CÒN CÂY CẢNH: CHẶN XÓA */
          <div className="space-y-3">
            <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200/80 text-rose-800 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-rose-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{LABELS.admin.CATEGORIES_DELETE_BLOCKED_TITLE}</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                {LABELS.admin.CATEGORIES_DELETE_BLOCKED_MSG(category.name, plantsCount)}
              </p>
            </div>

            <div className="p-3 bg-surface-50 rounded-lg border border-surface-200 text-xs text-surface-600 space-y-1">
              <p className="font-semibold text-surface-800">
                {LABELS.admin.CATEGORIES_DELETE_BLOCKED_GUIDE_TITLE}
              </p>
              <p>{LABELS.admin.CATEGORIES_DELETE_BLOCKED_STEP_1(plantsCount)}</p>
              <p>{LABELS.admin.CATEGORIES_DELETE_BLOCKED_STEP_2}</p>
              <p>{LABELS.admin.CATEGORIES_DELETE_BLOCKED_STEP_3}</p>
            </div>

            <div className="pt-1">
              <Link
                to={`/admin/plants?category=${category.id}`}
                onClick={onClose}
                className="w-full inline-block"
              >
                <ButtonCommon
                  variant="outline"
                  type="button"
                  className="w-full flex items-center justify-center gap-2 text-brand border-brand/30 hover:bg-brand/5"
                >
                  <Leaf className="w-4 h-4" />
                  <span>{LABELS.admin.CATEGORIES_ACTION_VIEW_PLANTS} ({plantsCount})</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 text-surface-400" />
                </ButtonCommon>
              </Link>
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP KHÔNG CÓ CÂY: CHO PHÉP XÓA */
          <div className="space-y-3">
            <p className="text-sm text-surface-600 leading-relaxed">
              {LABELS.admin.CATEGORIES_DELETE_CONFIRM_MSG(category.name)}
            </p>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <p className="font-semibold">{LABELS.admin.CATEGORIES_DELETE_SAFE_TITLE}</p>
              <p>{LABELS.admin.CATEGORIES_DELETE_SAFE_DESC}</p>
            </div>
          </div>
        )}

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
            variant="danger"
            type="button"
            isLoading={isLoading}
            disabled={isLoading || hasPlants}
            title={hasPlants ? LABELS.admin.CATEGORIES_DELETE_TOOLTIP_BLOCKED : undefined}
            onClick={() => onConfirm(category)}
          >
            {LABELS.admin.CATEGORIES_DELETE_SUBMIT}
          </ButtonCommon>
        </div>
      </div>
    </ModalCommon>
  );
};
