import React from "react";
import { PackageOpen } from "lucide-react";
import { cn } from "@/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-dashed border-surface-200 rounded-md bg-surface-50/50",
        className,
      )}
    >
      <div className="w-10 h-10 rounded-full bg-surface-100 text-surface-500 flex items-center justify-center mb-3">
        {icon || <PackageOpen className="w-5 h-5" />}
      </div>
      <h4 className="text-sm font-medium text-surface-900">{title}</h4>
      {description && (
        <p className="text-xs text-surface-500 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
