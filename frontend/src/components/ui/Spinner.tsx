import React from "react";
import { cn } from "@/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-5 h-5 border-2",
  lg: "w-8 h-8 border-3",
};

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className, ...props }) => {
  return (
    <div
      role="status"
      aria-label="Đang tải"
      className={cn(
        "inline-block rounded-full border-surface-300 border-t-accent-600 animate-spin",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};
