import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TestingRequirementsInput = ({
  value = [],
  onChange,
  options = [],
  placeholder = "Type to search or select...",
  className,
  disabled = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const selectedValues = Array.isArray(value) ? value : [];

  // Filter options based on search term
  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedValues.includes(option)
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options, selectedValues]);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleOptionSelect = (option) => {
    if (!selectedValues.includes(option)) {
      onChange([...selectedValues, option]);
    }
    setSearchTerm('');
    setIsOpen(false);
    // Focus back to input for next entry
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleRemoveChip = (option, e) => {
    e.stopPropagation();
    onChange(selectedValues.filter(val => val !== option));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[0]);
    } else if (e.key === 'Enter' && searchTerm && filteredOptions.length === 0) {
      // Allow adding custom text if not in options
      e.preventDefault();
      if (!selectedValues.includes(searchTerm.trim())) {
        onChange([...selectedValues, searchTerm.trim()]);
        setSearchTerm('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Backspace' && searchTerm === '' && selectedValues.length > 0) {
      // Remove last chip on backspace when input is empty
      onChange(selectedValues.slice(0, -1));
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full", className)}
    >
      <div
        className={cn(
          "border-input rounded-md border bg-white transition-all",
          "flex flex-wrap items-center gap-2",
          "min-h-[2.75rem] py-2",
          isOpen && "ring-ring/50 ring-[3px] border-ring",
          error && "border-destructive ring-destructive/20",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
          boxShadow: isOpen ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
          cursor: disabled ? 'not-allowed' : 'text'
        }}
        onClick={() => !disabled && !isOpen && setIsOpen(true)}
      >
        {/* Selected Chips */}
        {selectedValues.map((val, index) => (
          <span
            key={`${val}-${index}`}
            className="premium-chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: '1.25rem',
              fontSize: '0.8125rem',
              fontWeight: '500',
              animation: 'fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
              e.currentTarget.style.borderColor = 'var(--ring)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--muted)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            {val}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => handleRemoveChip(val, e)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  width: '1.125rem',
                  height: '1.125rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--muted-foreground)',
                  fontSize: '1rem',
                  lineHeight: '1',
                  padding: 0,
                  transition: 'all 0.2s',
                  fontWeight: 'normal',
                  marginLeft: '0.125rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--foreground)';
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            )}
          </span>
        ))}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={selectedValues.length === 0 ? placeholder : "Add more..."}
          className={cn(
            "flex-1 min-w-[120px] outline-none bg-transparent",
            "text-sm text-foreground placeholder:text-muted-foreground",
            disabled && "cursor-not-allowed"
          )}
          style={{
            border: 'none',
            padding: '0.25rem 0.5rem',
            minWidth: '120px'
          }}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && filteredOptions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-md shadow-lg overflow-hidden"
          style={{
            animation: 'slideDown 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            maxHeight: '16rem',
            overflowY: 'auto'
          }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="cursor-pointer px-4 py-3 transition-all hover:bg-accent hover:text-accent-foreground"
              style={{
                borderBottom: index < filteredOptions.length - 1 ? '1px solid var(--border)' : 'none',
                animation: `fadeInSlide 0.2s ease ${index * 0.03}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span className="text-sm font-medium text-foreground">{option}</span>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {isOpen && !disabled && filteredOptions.length === 0 && searchTerm && (
        <div
          className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-md shadow-lg p-6 text-center"
          style={{
            animation: 'slideDown 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <span className="text-sm text-muted-foreground">
            No matching options. Press Enter to add "{searchTerm}"
          </span>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export { TestingRequirementsInput };

