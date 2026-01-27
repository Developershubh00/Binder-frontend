import { useState, useRef, useEffect } from 'react';
import SearchableDropdown from './SearchableDropdown';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Premium Multi-Select Component
const PremiumMultiSelect = ({ options, selectedValues = [], onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedValues.includes(option)
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options, selectedValues]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleOptionSelect = (option) => {
    if (!selectedValues.includes(option)) {
      onChange([...selectedValues, option]);
    }
    setSearchTerm('');
  };

  const handleRemoveChip = (option, e) => {
    e.stopPropagation();
    onChange(selectedValues.filter(val => val !== option));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div 
      className={cn("premium-multi-select", error && "error")} 
      ref={dropdownRef}
      style={{ position: 'relative' }}
    >
      <div 
        className={cn(
          "multi-select-container border-input h-11 w-full min-w-0 rounded-md border bg-white shadow-xs transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          error && "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-destructive"
        )}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
          paddingLeft: '1.25rem',
          paddingRight: '0.75rem',
          paddingTop: '8px',
          paddingBottom: '8px',
          cursor: 'text',
          boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-xs)'
        }}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* Selected Chips */}
        {selectedValues.length > 0 ? (
          selectedValues.map((value, index) => (
            <span
              key={index}
              className="premium-chip inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-muted text-foreground border border-border rounded-full text-xs font-medium"
              style={{
                animation: 'fadeInScale 0.2s ease'
              }}
            >
              {value}
              <button
                type="button"
                onClick={(e) => handleRemoveChip(value, e)}
                className="bg-transparent border-none rounded-full w-4.5 h-4.5 flex items-center justify-center cursor-pointer text-muted-foreground text-base leading-none p-0 transition-colors hover:text-foreground"
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddClick}
          className="ml-auto bg-white border border-input rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-muted-foreground text-xl font-light leading-none p-0 flex-shrink-0 transition-all hover:border-muted-foreground/50 hover:text-foreground"
          title="Add category"
        >
          <span className="inline-block leading-none pb-0.5">+</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="premium-dropdown-menu absolute top-full left-0 right-0 mt-2 bg-white border-2 border-border rounded-xl shadow-xl z-[1000] overflow-hidden"
          style={{
            animation: 'slideDown 0.2s ease'
          }}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-border">
            <Input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search categories..."
              className="h-9 text-sm"
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "px-4 py-3 cursor-pointer transition-colors flex items-center text-sm font-medium text-foreground",
                    index < filteredOptions.length - 1 && "border-b border-border",
                    "hover:bg-accent"
                  )}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground text-sm">
                {searchTerm ? 'No matching options' : 'All options selected'}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const GenerateVendorCode = ({ onBack }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    address: '',
    gst: '',
    bankName: '',
    accNo: '',
    ifscCode: '',
    jobWorkCategory: [],
    jobWorkSubCategory: [],
    contactPerson: '',
    whatsappNo: '',
    altWhatsappNo: '',
    email: '',
    paymentTerms: ''
  });
  
  const [errors, setErrors] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const jobWorkCategories = [
    'categories',
    'Greige Yarn',
    'Recycled Yarn',
    'Fabric',
    'DYE',
    'Knitting',
    'Quilting',
    'Embroidery',
    'Cut&Sew',
    'Artworks&Trims',
    'Packaging & Product Material',
    'Factory Supplies',
    'Fiber',
    'Weaving',
    'Braided',
    'Printing',
    'Job Card Service',
    'Tufting',
    'Carpet',
    'Man Power'
  ];

  const jobWorkSubCategories = [
    'subcategory',
    'Coarse Count UV 2Ne to 20Ne',
    'Fine Count UV 24Ne to 60Ne',
    'Linen Yarn',
    'Viscose Yarn',
    'Cotton Yarn',
    'Jute Yarn',
    'Polyester Yarn',
    'Wool Yarn',
    'Chenille Yarn',
    'Silk Yarn',
    'Pet Yarn',
    'Fancy Yarn'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'vendorName', 'address', 'gst', 'bankName', 'accNo', 'ifscCode',
      'contactPerson', 'whatsappNo', 'email', 'paymentTerms'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // Validate arrays
    if (!formData.jobWorkCategory || formData.jobWorkCategory.length === 0) {
      newErrors.jobWorkCategory = 'Job Work Category is required';
    }
    if (!formData.jobWorkSubCategory || formData.jobWorkSubCategory.length === 0) {
      newErrors.jobWorkSubCategory = 'Job Work Sub-Category is required';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation (basic)
    if (formData.whatsappNo && !/^\d{10}$/.test(formData.whatsappNo.replace(/\s+/g, ''))) {
      newErrors.whatsappNo = 'Please enter a valid 10-digit WhatsApp number';
    }

    if (formData.altWhatsappNo && formData.altWhatsappNo.trim() && !/^\d{10}$/.test(formData.altWhatsappNo.replace(/\s+/g, ''))) {
      newErrors.altWhatsappNo = 'Please enter a valid 10-digit WhatsApp number';
    }

    // IFSC code validation
    if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Please enter a valid IFSC code (e.g., SBIN0000123)';
    }

    // GST validation
    if (formData.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst)) {
      newErrors.gst = 'Please enter a valid GST number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateVendorCode = () => {
    // Get existing codes from localStorage or start from 101
    const existingCodes = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
    let nextNumber = 101;
    
    if (existingCodes.length > 0) {
      const lastCode = existingCodes[existingCodes.length - 1];
      const lastNumber = parseInt(lastCode.code);
      nextNumber = lastNumber + 1;
    }
    
    return nextNumber.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCode = generateVendorCode();
    
    // Save to localStorage
    const existingCodes = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
    const newVendorData = {
      code: newCode,
      ...formData,
      createdAt: new Date().toISOString()
    };
    existingCodes.push(newVendorData);
    localStorage.setItem('vendorCodes', JSON.stringify(existingCodes));
    
    setGeneratedCode(newCode);
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert('Vendor code copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Vendor code copied to clipboard!');
    }
  };

  const resetForm = () => {
    setFormData({
      vendorName: '',
      address: '',
      gst: '',
      bankName: '',
      accNo: '',
      ifscCode: '',
      jobWorkCategory: [],
      jobWorkSubCategory: [],
      contactPerson: '',
      whatsappNo: '',
      altWhatsappNo: '',
      email: '',
      paymentTerms: ''
    });
    setErrors({});
    setGeneratedCode('');
  };

  if (generatedCode) {
    return (
      <div className="fullscreen-content" style={{ overflowY: 'auto' }}>
        <div className="content-header">
          <Button 
            variant="outline"
            onClick={onBack} 
            type="button"
            className="mb-6 bg-white"
          >
            ← Back to Department
          </Button>
          <h1 className="fullscreen-title">Vendor Code Generated Successfully!</h1>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '40px' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-5 animate-bounce">
              ✓
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px', 
            marginBottom: '24px',
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#333', 
              fontSize: '16px',
              wordBreak: 'break-word',
              marginBottom: '16px'
            }}>
              {formData.vendorName} vendor code
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '20px',
              backgroundColor: 'white',
              border: '3px solid #667eea',
              borderRadius: '12px'
            }}>
              <span style={{ 
                fontSize: '36px',
                fontWeight: '900',
                color: '#667eea',
                fontFamily: 'Courier New, monospace',
                letterSpacing: '3px'
              }}>
                {generatedCode}
              </span>
              <Button 
                variant="default"
                size="icon"
                onClick={copyToClipboard}
                title="Copy to clipboard"
                type="button"
              >
                📋
              </Button>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px', 
            marginTop: '24px'
          }}>
            <Button 
              variant="default"
              onClick={resetForm}
              type="button"
            >
              Generate Another Code
            </Button>
            <Button 
              variant="outline"
              onClick={onBack}
              type="button"
            >
              Back to Department
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-content" style={{ overflowY: 'auto' }}>
      <div className="content-header">
        <Button 
          variant="outline"
          onClick={onBack} 
          type="button"
          className="mb-6 bg-white"
        >
          ← Back to Department
        </Button>
        <h1 className="fullscreen-title">Generate Vendor Code</h1>
        <p className="fullscreen-description">Fill in the vendor details to generate a unique vendor code</p>
      </div>

      <div style={{ maxWidth: '800px', width: '100%' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-wrap items-start" style={{ gap: '16px 24px', width: '100%' }}>
            {/* Basic Details */}
            <Field 
              label="VENDOR NAME" 
              required 
              error={errors.vendorName}
              width="lg"
              className="flex-shrink-0"
            >
              <Input
                type="text"
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
                placeholder="Enter vendor name"
                required
                aria-invalid={!!errors.vendorName}
              />
            </Field>

            <Field 
              label="GST NUMBER" 
              required 
              error={errors.gst}
              width="lg"
            >
              <Input
                type="text"
                id="gst"
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
                required
                aria-invalid={!!errors.gst}
              />
            </Field>

            <Field 
              label="ADDRESS" 
              required 
              error={errors.address}
              width="lg"
              className="md:col-span-2"
            >
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter complete vendor address"
                rows={3}
                required
                aria-invalid={!!errors.address}
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-white py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  errors.address && "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-destructive"
                )}
                style={{
                  paddingLeft: '1.25rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                }}
              ></textarea>
            </Field>

            {/* Banking Details */}
            <Field 
              label="BANK NAME" 
              required 
              error={errors.bankName}
              width="lg"
            >
              <Input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="Enter bank name"
                required
                aria-invalid={!!errors.bankName}
              />
            </Field>

            <Field 
              label="ACCOUNT NUMBER" 
              required 
              error={errors.accNo}
              width="lg"
            >
              <Input
                type="text"
                id="accNo"
                name="accNo"
                value={formData.accNo}
                onChange={handleInputChange}
                placeholder="Enter account number"
                required
                aria-invalid={!!errors.accNo}
              />
            </Field>

            <Field 
              label="IFSC CODE" 
              required 
              error={errors.ifscCode}
              width="lg"
            >
              <Input
                type="text"
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                placeholder="SBIN0000123"
                maxLength={11}
                required
                aria-invalid={!!errors.ifscCode}
              />
            </Field>

            {/* Job Work Categories - Premium Multi-Select */}
            <Field 
              label="JOB WORK CATEGORY" 
              required 
              error={errors.jobWorkCategory}
              width="lg"
            >
              <PremiumMultiSelect
                options={jobWorkCategories.filter(opt => opt !== 'categories')}
                selectedValues={formData.jobWorkCategory}
                onChange={(values) => handleDropdownChange('jobWorkCategory', values)}
                placeholder="Select categories"
                error={errors.jobWorkCategory}
              />
            </Field>

            <Field 
              label="JOB WORK SUB-CATEGORY" 
              required 
              error={errors.jobWorkSubCategory}
              width="lg"
            >
              <PremiumMultiSelect
                options={jobWorkSubCategories.filter(opt => opt !== 'subcategory')}
                selectedValues={formData.jobWorkSubCategory}
                onChange={(values) => handleDropdownChange('jobWorkSubCategory', values)}
                placeholder="Select sub-categories"
                error={errors.jobWorkSubCategory}
              />
            </Field>

            {/* Contact Details */}
            <Field 
              label="CONTACT PERSON" 
              required 
              error={errors.contactPerson}
              width="lg"
            >
              <Input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Enter contact person name"
                required
                aria-invalid={!!errors.contactPerson}
              />
            </Field>

            <Field 
              label="EMAIL" 
              required 
              error={errors.email}
              width="lg"
            >
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
                aria-invalid={!!errors.email}
              />
            </Field>

            <Field 
              label="WHATSAPP NUMBER" 
              required 
              error={errors.whatsappNo}
              width="lg"
            >
              <Input
                type="tel"
                id="whatsappNo"
                name="whatsappNo"
                value={formData.whatsappNo}
                onChange={handleInputChange}
                placeholder="9876543210"
                maxLength={10}
                required
                aria-invalid={!!errors.whatsappNo}
              />
            </Field>

            <Field 
              label="ALTERNATIVE WHATSAPP NUMBER"
              error={errors.altWhatsappNo}
              width="lg"
            >
              <Input
                type="tel"
                id="altWhatsappNo"
                name="altWhatsappNo"
                value={formData.altWhatsappNo}
                onChange={handleInputChange}
                placeholder="9876543210 (Optional)"
                maxLength={10}
                aria-invalid={!!errors.altWhatsappNo}
              />
            </Field>

            <Field 
              label="PAYMENT TERMS" 
              required 
              error={errors.paymentTerms}
              width="lg"
              className="md:col-span-2"
            >
              <textarea
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                placeholder="Enter payment terms and conditions"
                rows={3}
                required
                aria-invalid={!!errors.paymentTerms}
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-white py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  errors.paymentTerms && "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-destructive"
                )}
                style={{
                  paddingLeft: '1.25rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                }}
              ></textarea>
            </Field>
          </div>

          <div className="flex justify-start mt-4">
            <Button 
              type="submit" 
              disabled={isGenerating}
              size="default"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2"></span>
                  Generating Code...
                </>
              ) : (
                'Generate Vendor Code'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateVendorCode;