import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { AdminPlant } from "../types";

interface AdminPlantDeleteModalProps {
  plant: AdminPlant | null;
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (plant: AdminPlant) => void;
}

export const AdminPlantDeleteModal: React.FC<AdminPlantDeleteModalProps> = ({
  plant,
  open,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  if (!plant) return null;

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.PLANTS_DELETE_CONFIRM_TITLE}
      className="max-w-md w-full"
    >
      <div className="space-y-4 pt-2">
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs text-rose-800 space-y-1">
            <p className="font-semibold text-rose-900 text-sm">{plant.name}</p>
            <p className="leading-relaxed">
              {LABELS.admin.PLANTS_DELETE_CONFIRM_MSG(plant.name)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-200/80">
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
            type="button"
            variant="danger"
            size="sm"
            isLoading={isLoading}
            onClick={() => onConfirm(plant)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {LABELS.admin.PLANTS_DELETE_SUBMIT}
          </ButtonCommon>
        </div>
      </div>
    </ModalCommon>
  );
};
