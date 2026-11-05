import React from "react";
import { cn } from "@/utils/cn";
import { EmptyState } from "./EmptyState";
import { LoadingOverlay } from "./LoadingOverlay";
import { LABELS } from "@/constants/labels";

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
}

export interface TableCommonProps<T> {
  columns: readonly TableColumn<T>[];
  data: readonly T[];
  rowKey: ((row: T, index: number) => string | number) | keyof T;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyState?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  onRowClick?: (row: T, index: number) => void;
}

export function TableCommon<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyTitle = LABELS.catalog.EMPTY_TITLE,
  emptyDescription = LABELS.catalog.EMPTY_DESCRIPTION,
  emptyState,
  className,
  wrapperClassName,
  onRowClick,
}: TableCommonProps<T>) {
  const getRowKey = (row: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(row, index);
    }
    return String(row[rowKey]);
  };

  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div
      className={cn(
        "w-full overflow-x-auto relative",
        wrapperClassName
      )}
    >
      <table className={cn("w-full text-left border-collapse", className)}>
        <thead>
          <tr className="bg-surface-50/80 border-b border-surface-200/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "py-3.5 px-5 text-[11px] font-semibold text-surface-500 uppercase tracking-wider select-none",
                  getAlignClass(col.align),
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100 relative">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <LoadingOverlay message={LABELS.common.LOADING_DATA} />
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                onClick={() => onRowClick?.(row, index)}
                className={cn(
                  "transition-colors duration-150",
                  onRowClick
                    ? "cursor-pointer hover:bg-surface-100/70"
                    : "hover:bg-surface-50/70"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "py-4 px-5 text-xs text-surface-700 align-middle",
                      getAlignClass(col.align),
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row, index)
                      : String(
                          (row as Record<string, unknown>)[col.key] ?? ""
                        )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-16">
                {emptyState || (
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    className="border-none bg-transparent p-4"
                  />
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
