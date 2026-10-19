import React from "react";
import { Spinner } from "@/components/ui";
import { cn } from "@/utils";

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Đang tải dữ liệu...",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 space-y-3",
        className
      )}
    >
      <Spinner size="lg" />
      <p className="text-xs text-surface-500 font-medium">{message}</p>
    </div>
  );
};
