import type { ReactNode } from "react";
import { ModalCommon } from "@/components/common/ModalCommon";
import { LABELS } from "@/constants/labels";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Compatibility adapter; modal behavior is owned by ModalCommon. */
export function Modal({
  isOpen,
  onClose,
  title = LABELS.common.DIALOG_TITLE,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <ModalCommon
      open={isOpen}
      onClose={onClose}
      title={title}
      className={className}
    >
      {description ? <p className="dialog-intro">{description}</p> : null}
      {children}
    </ModalCommon>
  );
}
