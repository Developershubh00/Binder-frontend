import { useState } from 'react';
import SearchableDropdown from './SearchableDropdown';
import './GenerateVendorCode.css';

const GenerateVendorCode = ({ onBack }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    address: '',
    gst: '',
    bankName: '',
    accNo: '',
    ifscCode: '',
    jobWorkCategory: '',
    jobWorkSubCategory: '',
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
      'jobWorkCategory', 'jobWorkSubCategory', 'contactPerson', 'whatsappNo', 
      'email', 'paymentTerms'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

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
      jobWorkCategory: '',
      jobWorkSubCategory: '',
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
      <div className="generate-vendor-container">
        <div className="generated-code-display" style={{ position: 'relative' }}>
          {/* Close button in top right */}
          <button 
            className="close-button" 
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: 'transparent',
              border: 'none',
              fontSize: '32px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px',
              lineHeight: '1',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            title="Close"
          >
            ×
          </button>

          <div className="success-animation">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Vendor Code Generated Successfully!</h2>
          </div>
          
          <div className="code-display-card">
            <h3 className="code-label">{formData.vendorName} vendor code </h3>
            <div className="code-display">
              <span className="code-text">{generatedCode}</span>
              <button 
                className="copy-button" 
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="generate-another-btn" onClick={resetForm}>
              Generate Another Code
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="generate-vendor-container">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Department
        </button>
        <h1 className="form-title">Generate Vendor Code</h1>
        <p className="form-description">Fill in the vendor details to generate a unique vendor code</p>
      </div>

      <form className="vendor-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Basic Details */}
          <div className="form-group">
            <label htmlFor="vendorName" className="form-label">
              Vendor Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="vendorName"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleInputChange}
              className={`form-input ${errors.vendorName ? 'error' : ''}`}
              placeholder="Enter vendor name"
            />
            {errors.vendorName && <span className="error-message">{errors.vendorName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gst" className="form-label">
              GST Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="gst"
              name="gst"
              value={formData.gst}
              onChange={handleInputChange}
              className={`form-input ${errors.gst ? 'error' : ''}`}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
            />
            {errors.gst && <span className="error-message">{errors.gst}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="address" className="form-label">
              Address <span className="required">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`form-textarea ${errors.address ? 'error' : ''}`}
              placeholder="Enter complete vendor address"
              rows={3}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          {/* Banking Details */}
          <div className="form-group">
            <label htmlFor="bankName" className="form-label">
              Bank Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className={`form-input ${errors.bankName ? 'error' : ''}`}
              placeholder="Enter bank name"
            />
            {errors.bankName && <span className="error-message">{errors.bankName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="accNo" className="form-label">
              Account Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="accNo"
              name="accNo"
              value={formData.accNo}
              onChange={handleInputChange}
              className={`form-input ${errors.accNo ? 'error' : ''}`}
              placeholder="Enter account number"
            />
            {errors.accNo && <span className="error-message">{errors.accNo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ifscCode" className="form-label">
              IFSC Code <span className="required">*</span>
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              className={`form-input ${errors.ifscCode ? 'error' : ''}`}
              placeholder="SBIN0000123"
              maxLength={11}
            />
            {errors.ifscCode && <span className="error-message">{errors.ifscCode}</span>}
          </div>

          {/* Job Work Categories */}
          <div className="form-group">
            <label className="form-label">
              Job Work Category <span className="required">*</span>
            </label>
            <SearchableDropdown
              options={jobWorkCategories}
              value={formData.jobWorkCategory}
              onChange={(value) => handleDropdownChange('jobWorkCategory', value)}
              placeholder="Select or search category"
              error={errors.jobWorkCategory}
            />
            {errors.jobWorkCategory && <span className="error-message">{errors.jobWorkCategory}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Job Work Sub-Category <span className="required">*</span>
            </label>
            <SearchableDropdown
              options={jobWorkSubCategories}
              value={formData.jobWorkSubCategory}
              onChange={(value) => handleDropdownChange('jobWorkSubCategory', value)}
              placeholder="Select or search sub-category"
              error={errors.jobWorkSubCategory}
            />
            {errors.jobWorkSubCategory && <span className="error-message">{errors.jobWorkSubCategory}</span>}
          </div>

          {/* Contact Details */}
          <div className="form-group">
            <label htmlFor="contactPerson" className="form-label">
              Contact Person <span className="required">*</span>
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className={`form-input ${errors.contactPerson ? 'error' : ''}`}
              placeholder="Enter contact person name"
            />
            {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="whatsappNo" className="form-label">
              WhatsApp Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="whatsappNo"
              name="whatsappNo"
              value={formData.whatsappNo}
              onChange={handleInputChange}
              className={`form-input ${errors.whatsappNo ? 'error' : ''}`}
              placeholder="9876543210"
              maxLength={10}
            />
            {errors.whatsappNo && <span className="error-message">{errors.whatsappNo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="altWhatsappNo" className="form-label">
              Alternative WhatsApp Number
            </label>
            <input
              type="tel"
              id="altWhatsappNo"
              name="altWhatsappNo"
              value={formData.altWhatsappNo}
              onChange={handleInputChange}
              className={`form-input ${errors.altWhatsappNo ? 'error' : ''}`}
              placeholder="9876543210 (Optional)"
              maxLength={10}
            />
            {errors.altWhatsappNo && <span className="error-message">{errors.altWhatsappNo}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="paymentTerms" className="form-label">
              Payment Terms <span className="required">*</span>
            </label>
            <textarea
              id="paymentTerms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleInputChange}
              className={`form-textarea ${errors.paymentTerms ? 'error' : ''}`}
              placeholder="Enter payment terms and conditions"
              rows={3}
            />
            {errors.paymentTerms && <span className="error-message">{errors.paymentTerms}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="generate-btn"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating Code...
              </>
            ) : (
              <>
                 Generate Vendor Code
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateVendorCode;