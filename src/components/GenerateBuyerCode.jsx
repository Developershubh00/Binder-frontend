import { useState } from 'react';
import './GenerateBuyerCode.css';

const GenerateBuyerCode = ({ onBack }) => {
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerAddress: '',
    contactPerson: '',
    retailer: ''
  });
  const [errors, setErrors] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    
    // Trim whitespace and check if fields are empty
    const trimmedData = {
      buyerName: formData.buyerName?.trim() || '',
      buyerAddress: formData.buyerAddress?.trim() || '',
      contactPerson: formData.contactPerson?.trim() || '',
      retailer: formData.retailer?.trim() || ''
    };

    if (!trimmedData.buyerName) {
      newErrors.buyerName = 'Buyer Name is required';
    }
    if (!trimmedData.buyerAddress) {
      newErrors.buyerAddress = 'Buyer Address is required';
    }
    if (!trimmedData.contactPerson) {
      newErrors.contactPerson = 'Contact Person is required';
    }
    if (!trimmedData.retailer) {
      newErrors.retailer = 'Retailer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateBuyerCode = () => {
    try {
      // Get existing codes from localStorage or start from 101
      const existingCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      let nextNumber = 101;
      
      if (existingCodes.length > 0) {
        // Find the highest existing number
        const numbers = existingCodes.map(item => {
          const numStr = item.code?.replace('A', '') || '100';
          return parseInt(numStr) || 100;
        });
        const maxNumber = Math.max(...numbers);
        nextNumber = maxNumber + 1;
      }
      
      return `${nextNumber}A`;
    } catch (error) {
      console.error('Error generating buyer code:', error);
      // Fallback to a simple increment
      return `${Date.now().toString().slice(-3)}A`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted with data:', formData);
    
    // Validate form
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }
    
    try {
      setIsGenerating(true);
      console.log('Starting code generation...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate new code
      const newCode = generateBuyerCode();
      console.log('Generated code:', newCode);
      
      // Save to localStorage
      const existingCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      const newBuyerData = {
        code: newCode,
        buyerName: formData.buyerName.trim(),
        buyerAddress: formData.buyerAddress.trim(),
        contactPerson: formData.contactPerson.trim(),
        retailer: formData.retailer.trim(),
        createdAt: new Date().toISOString()
      };
      
      existingCodes.push(newBuyerData);
      localStorage.setItem('buyerCodes', JSON.stringify(existingCodes));
      console.log('Saved to localStorage:', newBuyerData);
      
      // Set the generated code to show success screen
      setGeneratedCode(newCode);
      setIsGenerating(false);
      
    } catch (error) {
      console.error('Error in form submission:', error);
      setIsGenerating(false);
      alert('An error occurred while generating the buyer code. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert('Buyer code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        alert('Buyer code copied to clipboard!');
      } catch (copyErr) {
        console.error('Fallback copy failed:', copyErr);
        alert('Failed to copy code. Please copy manually: ' + generatedCode);
      }
      
      document.body.removeChild(textArea);
    }
  };

  const resetForm = () => {
    setFormData({
      buyerName: '',
      buyerAddress: '',
      contactPerson: '',
      retailer: ''
    });
    setErrors({});
    setGeneratedCode('');
    setIsGenerating(false);
  };

  // Success screen - only show generated code
  if (generatedCode) {
    return (
      <div className="generate-buyer-container">
        <div className="generated-code-display">
          <div className="success-animation">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Buyer Code Generated Successfully!</h2>
          </div>
          
          <div className="code-display-card">
            <h3 className="code-label">Your Buyer Code:</h3>
            <div className="code-display">
              <span className="code-text">{generatedCode}</span>
              <button 
                className="copy-button" 
                onClick={copyToClipboard}
                title="Copy to clipboard"
                type="button"
              >
                📋
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="generate-another-btn" 
              onClick={resetForm}
              type="button"
            >
              Generate Another Code
            </button>
            <button 
              className="back-btn" 
              onClick={onBack}
              type="button"
            >
              Back to Department
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="generate-buyer-container">
      <div className="form-header">
        <button className="back-button" onClick={onBack} type="button">
          ← Back to Department
        </button>
        <h1 className="form-title">Generate Buyer Code</h1>
        <p className="form-description">Fill in the buyer details to generate a unique buyer code</p>
      </div>

      <form className="buyer-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="buyerName" className="form-label">
              Buyer Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="buyerName"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleInputChange}
              className={`form-input ${errors.buyerName ? 'error' : ''}`}
              placeholder="Enter buyer name"
              required
            />
            {errors.buyerName && <span className="error-message">{errors.buyerName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="retailer" className="form-label">
              Retailer <span className="required">*</span>
            </label>
            <input
              type="text"
              id="retailer"
              name="retailer"
              value={formData.retailer}
              onChange={handleInputChange}
              className={`form-input ${errors.retailer ? 'error' : ''}`}
              placeholder="Enter retailer name"
              required
            />
            {errors.retailer && <span className="error-message">{errors.retailer}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="buyerAddress" className="form-label">
              Buyer Address <span className="required">*</span>
            </label>
            <textarea
              id="buyerAddress"
              name="buyerAddress"
              value={formData.buyerAddress}
              onChange={handleInputChange}
              className={`form-textarea ${errors.buyerAddress ? 'error' : ''}`}
              placeholder="Enter complete buyer address"
              rows={3}
              required
            />
            {errors.buyerAddress && <span className="error-message">{errors.buyerAddress}</span>}
          </div>

          <div className="form-group full-width">
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
              required
            />
            {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
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
                 Generate Buyer Code
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateBuyerCode;