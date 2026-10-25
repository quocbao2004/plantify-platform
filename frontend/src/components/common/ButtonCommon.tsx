import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Spinner } from "@/components/ui/Spinner";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger" | "unstyled";
export type ButtonSize = "sm" | "md" | "lg" | "unstyled";

export interface ButtonCommonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-600 text-white hover:bg-accent-700 border border-transparent focus-visible:ring-accent-500",
  secondary:
    "bg-surface-100 text-surface-900 hover:bg-surface-200 border border-surface-200 focus-visible:ring-surface-400",
  outline:
    "bg-transparent text-surface-800 hover:bg-surface-100 border border-surface-300 focus-visible:ring-surface-400",
  ghost:
    "bg-transparent text-surface-700 hover:bg-surface-100 border border-transparent focus-visible:ring-surface-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border border-transparent focus-visible:ring-red-500",
  unstyled: "",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-2.5 py-1 text-xs gap-1.5 h-8",
  md: "px-3.5 py-1.5 text-sm gap-2 h-9",
  lg: "px-4 py-2 text-base gap-2.5 h-11",
  unstyled: "",
};

export function buttonCommonClassName({
  variant = "primary",
  size = "md",
  className,
}: Pick<ButtonCommonProps, "variant" | "size" | "className">) {
  return cn(
    variant !== "unstyled" &&
      "inline-flex items-center justify-center font-medium rounded transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  );
}

export const ButtonCommon = forwardRef<HTMLButtonElement, ButtonCommonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = variant === "unstyled" ? "unstyled" : "md",
      isLoading = false,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonCommonClassName({ variant, size, className })}
    >
      {isLoading ? (
        <Spinner
          size="sm"
          className={
            variant === "primary" || variant === "danger"
              ? "border-t-white"
              : ""
          }
        />
      ) : null}
      {children}
    </button>
  ),
);
ButtonCommon.displayName = "ButtonCommon";
