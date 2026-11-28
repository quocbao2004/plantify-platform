import React, { useState, useEffect } from "react";
import { UserCheck, RefreshCw } from "lucide-react";
import { LABELS } from "@/constants/labels";
import { ModalCommon } from "@/components/common/ModalCommon";
import { ButtonCommon } from "@/components/common/ButtonCommon";
import { SelectCommon } from "@/components/common/SelectCommon";
import { FormCommon } from "@/components/common/FormCommon";
import { TextareaCommon } from "@/components/common/TextareaCommon";
import { AdminShipment, AdminShipper, UpdateAdminShipmentPayload } from "../types";
import { ADMIN_SHIPMENT_STATUS } from "../constants/shipping";

interface AdminShipmentAssignModalProps {
  shipment: AdminShipment | null;
  shippers: AdminShipper[];
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (payload: UpdateAdminShipmentPayload) => void;
}

export const AdminShipmentAssignModal: React.FC<AdminShipmentAssignModalProps> = ({
  shipment,
  shippers,
  open,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  const [selectedShipper, setSelectedShipper] = useState<string>(shipment?.staff || shipment?.shipper || "");
  const [adminNotes, setAdminNotes] = useState<string>(shipment?.admin_notes || "");

  useEffect(() => {
    if (open && shipment) {
      setSelectedShipper(shipment.staff || shipment.shipper || "");
      setAdminNotes(shipment.admin_notes || "");
    }
  }, [open, shipment]);

  if (!shipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipper) return;
    onConfirm({
      staff: selectedShipper,
      shipper: selectedShipper,
      status: ADMIN_SHIPMENT_STATUS.ASSIGNED,
      admin_notes: adminNotes.trim() || undefined,
    });
  };

  const shipperOptions = [
    { value: "", label: LABELS.admin.SHIPPING_LABEL_SELECT_SHIPPER_PLACEHOLDER, disabled: true },
    ...shippers.map((s) => ({
      value: s.id,
      label: `${s.full_name} (${s.phone || s.email}) - ${s.role}`,
    })),
  ];

  return (
    <ModalCommon
      open={open}
      onClose={onClose}
      title={LABELS.admin.SHIPPING_MODAL_ASSIGN_TITLE}
      className="max-w-md w-full"
    >
      <FormCommon
        id="admin-shipment-assign-form"
        onSubmit={handleSubmit}
        className="space-y-4 pt-2"
      >
        {/* Shipment Summary */}
        <div className="p-3.5 rounded-lg bg-surface-50 border border-surface-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.SHIPPING_LABEL_TRACKING}
            </span>
            <span className="font-mono font-bold text-surface-900">
              {shipment.tracking_code || shipment.ship_code}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.SHIPPING_LABEL_ORDER}
            </span>
            <span className="font-mono font-medium text-surface-800">
              {shipment.order_code}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-surface-500 font-medium">
              {LABELS.admin.SHIPPING_LABEL_CUSTOMER}
            </span>
            <span className="font-medium text-surface-900">
              {shipment.recipient_name} ({shipment.recipient_phone})
            </span>
          </div>

          <div className="pt-1 text-[11px] text-surface-600 truncate">
            <span className="font-medium text-surface-500">{LABELS.admin.SHIPPING_LABEL_ADDRESS} </span>
            {shipment.shipping_address || shipment.delivery_address}
          </div>
        </div>

        {/* Shipper Dropdown using SelectCommon */}
        <SelectCommon
          id="shipment-assign-shipper-select"
          label={LABELS.admin.SHIPPING_LABEL_SELECT_SHIPPER}
          value={selectedShipper}
          onChange={(e) => setSelectedShipper(e.target.value)}
          options={shipperOptions}
          className="w-full text-xs"
        />

        {/* Admin Notes */}
        <TextareaCommon
          id="shipment-assign-admin-notes"
          label={LABELS.admin.SHIPPING_LABEL_ADMIN_NOTES}
          rows={2}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="w-full text-xs resize-none min-h-0"
        />

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-200">
          <ButtonCommon
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {LABELS.admin.SHIPPING_ACTION_CLOSE}
          </ButtonCommon>
          <ButtonCommon
            type="submit"
            variant="primary"
            size="sm"
            disabled={isLoading || !selectedShipper}
            className="flex items-center gap-1.5"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UserCheck className="w-3.5 h-3.5" />
            )}
            <span>{LABELS.admin.SHIPPING_ACTION_SAVE}</span>
          </ButtonCommon>
        </div>
      </FormCommon>
    </ModalCommon>
  );
};
