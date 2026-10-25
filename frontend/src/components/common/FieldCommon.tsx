import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface FieldCommonProps {
  id: string;
  label?: string;
  hideLabel?: boolean;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  children: ReactNode;
}

export function FieldCommon({
  id,
  label,
  hideLabel,
  error,
  helperText,
  wrapperClassName,
  children,
}: FieldCommonProps) {
  return (
    <div className={cn("common-field", wrapperClassName)}>
      {label ? (
        <label
          htmlFor={id}
          className={hideLabel ? "sr-only" : "common-field-label"}
        >
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="common-field-error">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-help`} className="common-field-help">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export function fieldDescriptionId(
  id: string,
  error?: string,
  helperText?: string,
  describedBy?: string,
) {
  return (
    [describedBy, error ? `${id}-error` : helperText ? `${id}-help` : undefined]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

export const fieldControlClassName =
  "w-full px-3 py-1.5 text-sm rounded bg-white text-surface-900 border transition-colors placeholder:text-surface-400 focus:outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600 disabled:bg-surface-100 disabled:text-surface-500 disabled:cursor-not-allowed";
