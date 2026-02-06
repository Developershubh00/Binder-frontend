import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchableDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Type or select...',
  disabled = false,
  className = '',
  style = {},
  error = false,
  onFocus,
  onBlur,
  strictMode = false, // If true, only accepts values from options list
  usePortal = false // If true, render dropdown in portal so it isn't clipped by overflow
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [dropdownWidth, setDropdownWidth] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const previousValidValueRef = useRef(value || '');
  const skipValueSyncOnNextFocusRef = useRef(false);

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

  // Handle click outside (when using portal, also ignore clicks inside the portal dropdown)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && containerRef.current.contains(event.target)) return;
      if (usePortal) {
        const portalEl = document.querySelector('[data-searchable-dropdown-portal]');
        if (portalEl && portalEl.contains(event.target)) return;
      }
      setIsOpen(false);
      setSearchTerm('');
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, usePortal]);

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
    // If we just clicked the arrow to clear+reopen, keep searchTerm empty so ALL options show.
    if (skipValueSyncOnNextFocusRef.current) {
      skipValueSyncOnNextFocusRef.current = false;
      setSearchTerm('');
      setFilteredOptions(options);
    } else {
      setSearchTerm(value || '');
      // Show all options when focused
      setFilteredOptions(options);
    }
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

  // Measure input and position when dropdown opens (for portal: need position for fixed placement)
  useEffect(() => {
    if (isOpen && containerRef.current && inputRef.current) {
      const inputWidth = inputRef.current.offsetWidth;
      setDropdownWidth(inputWidth);
      if (usePortal && typeof document !== 'undefined') {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom, left: rect.left });
      }
    }
  }, [isOpen, usePortal]);

  // Update portal dropdown position on scroll/resize when open
  useEffect(() => {
    if (!isOpen || !usePortal || !containerRef.current) return;
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom, left: rect.left });
      }
    };
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, usePortal]);

  // Show search term when typing, otherwise show value
  const displayValue = isOpen ? searchTerm : (value || '');

  // Clicking the arrow should clear current selection and reopen options
  const handleArrowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    skipValueSyncOnNextFocusRef.current = true;
    onChange('');
    setSearchTerm('');
    previousValidValueRef.current = '';
    setFilteredOptions(options);
    setIsOpen(true);
    inputRef.current?.focus();
  };

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
          error && 'border-destructive focus-visible:ring-destructive/50',
          disabled && 'opacity-60',
          className
        )}
        style={{
          paddingLeft: '1.25rem',
          paddingRight: '2.25rem',
          ...style,
        }}
        aria-invalid={false}
      />
      {!disabled && (
        <button
          type="button"
          onClick={handleArrowClick}
          aria-label="Open options"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded border-0 bg-transparent text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </button>
      )}
      {isOpen && !disabled && filteredOptions.length > 0 && (usePortal && typeof document !== 'undefined' ? createPortal(
        <div
          data-searchable-dropdown-portal
          className="fixed z-[9999] max-h-60 overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          style={{
            top: dropdownPosition.top + 4,
            left: dropdownPosition.left,
            width: dropdownWidth || 280,
            minWidth: 200,
          }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={`${option}-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
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
        </div>,
        document.body
      ) : (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          style={{ top: '100%', left: 0, width: dropdownWidth || '100%' }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={`${option}-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
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
      ))}
    </div>
  );
};

export default SearchableDropdown;


