import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-lg bg-white rounded-md border border-surface-200 p-6 shadow-subtle animate-in fade-in-0 zoom-in-95",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-surface-100">
          <div>
            {title && <h2 className="text-base font-semibold text-surface-900">{title}</h2>}
            {description && <p className="text-xs text-surface-500 mt-0.5">{description}</p>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-7 w-7 text-surface-500 hover:text-surface-900"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
};
