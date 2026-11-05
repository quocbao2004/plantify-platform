import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface CheckboxCommonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label hiển thị bên cạnh checkbox */
  label: string;
  /** Ẩn label khỏi giao diện nhưng vẫn hỗ trợ screen reader */
  hideLabel?: boolean;
  /** Thông báo lỗi */
  error?: string;
  /** Lớp CSS bổ sung cho wrapper ngoài */
  wrapperClassName?: string;
  /** Lớp CSS bổ sung cho label text */
  labelClassName?: string;
}

export const CheckboxCommon = forwardRef<HTMLInputElement, CheckboxCommonProps>(
  (
    {
      label,
      hideLabel,
      error,
      wrapperClassName,
      labelClassName,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex items-center gap-2 cursor-pointer select-none",
            hideLabel && "sr-only",
          )}
        >
          <input
            {...props}
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "h-3.5 w-3.5 rounded border-surface-300 text-brand focus:ring-brand focus:ring-offset-0 cursor-pointer",
              error && "border-red-500 focus:ring-red-500",
              className,
            )}
          />
          <span
            className={cn("text-xs text-surface-600", labelClassName)}
          >
            {label}
          </span>
        </label>

        {error && (
          <p id={errorId} className="text-xs text-red-500 ml-5">
            {error}
          </p>
        )}
      </div>
    );
  },
);

CheckboxCommon.displayName = "CheckboxCommon";
