import * as React from "react"
import { cn } from "@/lib/utils"

function Field({
  label,
  error,
  helper,
  required,
  children,
  className,
  width,
  style,
}) {
  const widthClass =
    width === "sm" ? "w-field-sm" : width === "lg" ? "w-field-lg" : width === "md" ? "w-field-md" : "";

  return (
    <div className={cn("flex flex-col space-y-2", widthClass, className)} style={{ marginBottom: '12px', ...style }}>
      {label && (
        <label className="text-sm font-semibold text-foreground/80">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      {children}
      {helper && (
        <p className="text-xs text-muted-foreground">{helper}</p>
      )}
      {error && (
        <span className="text-xs font-medium text-destructive">{error}</span>
      )}
    </div>
  );
}

export { Field }

