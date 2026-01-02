import { useState, useRef, useEffect } from 'react';

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

  // Show search term when typing, otherwise show value
  const displayValue = isOpen ? searchTerm : (value || '');

  return (
    <div ref={containerRef} className="relative" style={{ width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''} ${className}`}
        style={{ padding: '10px 14px', height: '44px', width: '100%', ...style }}
      />
      {isOpen && !disabled && filteredOptions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          style={{ top: '100%', left: 0 }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={`${option}-${index}`}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur
                handleSelect(option);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-sm text-gray-900"
              style={{ borderBottom: index < filteredOptions.length - 1 ? '1px solid #e5e7eb' : 'none' }}
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


