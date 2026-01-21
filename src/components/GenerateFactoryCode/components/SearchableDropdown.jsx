import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const SearchableDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Type or select...',
  disabled = false,
  className = '',
  style = {},
  onFocus,
  onBlur,
  strictMode = false // If true, only accepts values from options list
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [dropdownWidth, setDropdownWidth] = useState(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const previousValidValueRef = useRef(value || '');

  // Update filtered options when search term or options change
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Show all options when dropdown opens (if no search term)
  useEffect(() => {
    if (isOpen && searchTerm === '') {
      setFilteredOptions(options);
    }
  }, [isOpen, options, searchTerm]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    // In strict mode, don't update value while typing - only when selecting from dropdown
    // In non-strict mode, update as user types
    if (!strictMode) {
      onChange(newValue);
    }
  };

  const handleSelect = (option) => {
    setSearchTerm('');
    setIsOpen(false);
    previousValidValueRef.current = option;
    onChange(option);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleFocus = (e) => {
    if (disabled) return;
    setIsOpen(true);
    setSearchTerm(value || '');
    // Show all options when focused
    setFilteredOptions(options);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    // Clear any existing timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    // Delay to allow click on option
    blurTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setSearchTerm('');
      
      // In strict mode, validate the search term on blur
      if (strictMode && searchTerm) {
        // Check if search term matches any option (case-insensitive)
        const matchedOption = options.find(opt => 
          opt.toLowerCase() === searchTerm.toLowerCase()
        );
        if (matchedOption) {
          // If it matches, set the matched option
          previousValidValueRef.current = matchedOption;
          onChange(matchedOption);
        } else {
          // If it doesn't match, reset to previous valid value or empty
          onChange(previousValidValueRef.current || '');
        }
      }
      
      if (onBlur) onBlur(e);
    }, 200);
  };

  // Update previous valid value when value changes externally
  useEffect(() => {
    if (value && options.includes(value)) {
      previousValidValueRef.current = value;
    }
  }, [value, options]);

  // Measure input width when dropdown opens to match dropdown width
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const inputWidth = inputRef.current.offsetWidth;
      setDropdownWidth(inputWidth);
    }
  }, [isOpen]);

  // Show search term when typing, otherwise show value
  const displayValue = isOpen ? searchTerm : (value || '');

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          // Base shadcn-style input
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
          'border-input h-11 w-full min-w-0 rounded-md border bg-white text-sm shadow-xs transition-[color,box-shadow]',
          'outline-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          disabled && 'opacity-60',
          className
        )}
        style={{
          paddingLeft: '1.25rem',
          paddingRight: '0.75rem',
          ...style,
        }}
        aria-invalid={false}
      />
      {isOpen && !disabled && filteredOptions.length > 0 && (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          style={{ top: '100%', left: 0, width: dropdownWidth || '100%' }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={`${option}-${index}`}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur
                handleSelect(option);
              }}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm',
                'border-b border-border last:border-b-0',
                'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;


