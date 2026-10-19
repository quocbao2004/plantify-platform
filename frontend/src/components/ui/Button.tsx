import React from "react";
import { cn } from "@/utils";
import { Spinner } from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantClasses = {
  primary: "bg-accent-600 text-white hover:bg-accent-700 border border-transparent focus-visible:ring-accent-500",
  secondary: "bg-surface-100 text-surface-900 hover:bg-surface-200 border border-surface-200 focus-visible:ring-surface-400",
  outline: "bg-transparent text-surface-800 hover:bg-surface-100 border border-surface-300 focus-visible:ring-surface-400",
  ghost: "bg-transparent text-surface-700 hover:bg-surface-100 border border-transparent focus-visible:ring-surface-400",
  danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent focus-visible:ring-red-500",
};

const sizeClasses = {
  sm: "px-2.5 py-1 text-xs gap-1.5 h-8",
  md: "px-3.5 py-1.5 text-sm gap-2 h-9",
  lg: "px-4 py-2 text-base gap-2.5 h-11",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded transition-colors select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" className={variant === "primary" || variant === "danger" ? "border-t-white" : ""} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
