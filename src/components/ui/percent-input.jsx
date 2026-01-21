import * as React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

function PercentInput({
  className,
  value,
  onChange,
  error,
  ...props
}) {
  const handleChange = (e) => {
    // Store only numeric value (remove % and non-numeric chars except decimal point)
    const numericValue = e.target.value.replace(/[^0-9.]/g, '');
    // Create synthetic event with cleaned value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: numericValue
      }
    };
    onChange?.(syntheticEvent);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={value || ''}
        onChange={handleChange}
        className={cn(
          "pr-10", // Add padding for % suffix
          error && "aria-invalid border-destructive",
          className
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      <span 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none text-sm"
      >
        %
      </span>
    </div>
  );
}

export { PercentInput }

