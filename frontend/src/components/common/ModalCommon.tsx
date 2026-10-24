import { ButtonCommon } from "@/components/common/ButtonCommon";
import { LABELS } from "@/constants/labels";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalCommonProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function ModalCommon({
  open,
  onClose,
  title,
  children,
  className = "",
}: ModalCommonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`store-dialog ${className}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="store-dialog-content">
        <div className="store-dialog-heading">
          <h2>{title}</h2>
          <ButtonCommon
            variant="unstyled"
            type="button"
            className="store-icon-button"
            onClick={onClose}
            aria-label={LABELS.common.CLOSE_DIALOG}
          >
            <X size={20} />
          </ButtonCommon>
        </div>
        {open ? children : null}
      </div>
    </dialog>
  );
}
