import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * SearchableCombobox - Input field with dropdown below
 * 
 * Props:
 * - value: string
 * - onChange: (value: string) => void
 * - options: string[]
 * - placeholder?: string
 * - strictMode?: boolean (default false) → when false, allows free text
 * - className?: string
 * - error?: boolean
 * - disabled?: boolean
 */
function SearchableCombobox({
  value,
  onChange,
  options = [],
  placeholder = "Select or type...",
  strictMode = false,
  className,
  error,
  disabled,
  style,
}) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(value || "");
  const inputRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const lastCommittedValueRef = React.useRef(value || "");

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  // Update search term when value changes externally (only if it's different from what we last committed)
  React.useEffect(() => {
    // Only sync if value changed from outside (not from our own onChange)
    if (value !== lastCommittedValueRef.current && value !== searchTerm) {
      setSearchTerm(value || "");
      lastCommittedValueRef.current = value || "";
    }
  }, [value, searchTerm]);

  // Handle input typing
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setOpen(true);
    
    // In non-strict mode, update value as user types
    if (!strictMode) {
      onChange?.(newValue);
      lastCommittedValueRef.current = newValue;
    }
  };

  // Handle selecting from dropdown
  const handleSelect = (option) => {
    setSearchTerm(option);
    setOpen(false);
    onChange?.(option);
    lastCommittedValueRef.current = option;
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleFocus = () => {
    if (disabled) return;
    setOpen(true);
    setSearchTerm(value || "");
  };

  // Handle input blur
  const handleBlur = (e) => {
    // Delay to allow click on option
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setOpen(false);
        
        // In strict mode, validate on blur
        if (strictMode) {
          const trimmed = searchTerm.trim();
          if (trimmed && !options.includes(trimmed)) {
            // Reset to previous valid value or empty
            onChange?.(value || "");
            setSearchTerm(value || "");
          }
        } else {
          // Non-strict: commit whatever is typed
          onChange?.(searchTerm);
          lastCommittedValueRef.current = searchTerm;
        }
      }
    }, 200);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        // Select first filtered option
        handleSelect(filteredOptions[0]);
      } else if (!strictMode && searchTerm.trim()) {
        // Commit free text
        const trimmed = searchTerm.trim();
        onChange?.(trimmed);
        lastCommittedValueRef.current = trimmed;
        setOpen(false);
        inputRef.current?.blur();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div ref={containerRef} className="relative w-full">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "h-11 pr-10",
                error && "border-destructive",
                className
              )}
              style={style}
              aria-invalid={error ? true : undefined}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </PopoverAnchor>
      
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>
                {strictMode ? "No options found" : "No options found. Press Enter to use typed text."}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { SearchableCombobox };
