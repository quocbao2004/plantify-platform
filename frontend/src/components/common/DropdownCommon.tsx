import React, { useState, useRef, useEffect, type ReactNode } from "react";

export interface DropdownCommonProps {
  /** The clickable element or node that triggers the dropdown */
  trigger: ReactNode;
  /** Dropdown content or menu items */
  children: ReactNode;
  /** Alignment of dropdown relative to trigger (default: "right") */
  align?: "left" | "right";
  /** Optional container class name */
  className?: string;
  /** Optional menu wrapper class name */
  menuClassName?: string;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether to close the dropdown when an action item (a or button) is clicked (default: true) */
  closeOnItemClick?: boolean;
}

export const DropdownCommon: React.FC<DropdownCommonProps> = ({
  trigger,
  children,
  align = "right",
  className = "",
  menuClassName = "",
  isOpen: controlledOpen,
  onOpenChange,
  closeOnItemClick = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const containerRef = useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 m-0 focus:outline-none"
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          onClick={(e) => {
            if (
              closeOnItemClick &&
              (e.target as HTMLElement).closest("a, button")
            ) {
              setOpen(false);
            }
          }}
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-2 min-w-[220px] rounded-xl bg-white shadow-xl ring-1 ring-black/5 border border-surface-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${menuClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
