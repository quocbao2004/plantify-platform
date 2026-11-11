import React from "react";
import { cn } from "@/utils/cn";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export type BadgeSize = "sm" | "md";

export interface BadgeCommonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  dotColor?: string;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-100 text-surface-700 border-surface-200/80",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  warning: "bg-amber-50 text-amber-700 border-amber-200/70",
  error: "bg-rose-50 text-rose-700 border-rose-200/70",
  info: "bg-blue-50 text-blue-700 border-blue-200/70",
  neutral: "bg-surface-100 text-surface-600 border-surface-200/80",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] gap-1.5",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

export const BadgeCommon: React.FC<BadgeCommonProps> = ({
  variant = "default",
  size = "sm",
  dot = false,
  dotColor,
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border select-none transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColor ||
              (variant === "success"
                ? "bg-emerald-500"
                : variant === "warning"
                ? "bg-amber-500"
                : variant === "error"
                ? "bg-rose-500"
                : variant === "info"
                ? "bg-blue-500"
                : "bg-surface-400")
          )}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
