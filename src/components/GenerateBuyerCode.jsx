// import { useState } from 'react';
// import './GenerateBuyerCode.css';

// const GenerateBuyerCode = ({ onBack }) => {
//   const [formData, setFormData] = useState({
//     buyerName: '',
//     buyerAddress: '',
//     contactPerson: '',
//     retailer: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [generatedCode, setGeneratedCode] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Trim whitespace and check if fields are empty
//     const trimmedData = {
//       buyerName: formData.buyerName?.trim() || '',
//       buyerAddress: formData.buyerAddress?.trim() || '',
//       contactPerson: formData.contactPerson?.trim() || '',
//       retailer: formData.retailer?.trim() || ''
//     };

//     if (!trimmedData.buyerName) {
//       newErrors.buyerName = 'Buyer Name is required';
//     }
//     if (!trimmedData.buyerAddress) {
//       newErrors.buyerAddress = 'Buyer Address is required';
//     }
//     if (!trimmedData.contactPerson) {
//       newErrors.contactPerson = 'Contact Person is required';
//     }
//     if (!trimmedData.retailer) {
//       newErrors.retailer = 'Retailer is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const generateBuyerCode = (buyerName, retailer) => {
//     try {
//       // Get existing codes from localStorage
//       const existingCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      
//       // Normalize buyer name and retailer for comparison (case-insensitive and trimmed)
//       const normalizedBuyerName = buyerName.trim().toLowerCase();
//       const normalizedRetailer = retailer.trim().toLowerCase();
      
//       // Find all codes for this buyer-retailer combination
//       const matchingCodes = existingCodes.filter(item => {
//         const itemBuyerName = (item.buyerName || '').trim().toLowerCase();
//         const itemRetailer = (item.retailer || '').trim().toLowerCase();
//         return itemBuyerName === normalizedBuyerName && itemRetailer === normalizedRetailer;
//       });
      
//       if (matchingCodes.length > 0) {
//         // Same buyer-retailer combination exists
//         // Get the base number from the first matching code
//         const firstCode = matchingCodes[0].code;
//         const baseNumber = parseInt(firstCode.replace(/[A-Z]/g, ''));
        
//         // Find the highest letter suffix for this base number
//         const letterSuffixes = matchingCodes
//           .filter(item => {
//             const itemNumber = parseInt(item.code.replace(/[A-Z]/g, ''));
//             return itemNumber === baseNumber;
//           })
//           .map(item => {
//             const match = item.code.match(/[A-Z]+$/);
//             return match ? match[0] : 'A';
//           });
        
//         // Find the highest letter (A, B, C, etc.)
//         let highestLetter = 'A';
//         letterSuffixes.forEach(letter => {
//           if (letter > highestLetter) {
//             highestLetter = letter;
//           }
//         });
        
//         // Increment the letter
//         const nextLetter = String.fromCharCode(highestLetter.charCodeAt(0) + 1);
        
//         return `${baseNumber}${nextLetter}`;
//       } else {
//         // New buyer-retailer combination
//         // Find the highest base number across all codes
//         let maxBaseNumber = 100; // Start from 100, so first code will be 101
        
//         existingCodes.forEach(item => {
//           const itemNumber = parseInt(item.code.replace(/[A-Z]/g, ''));
//           if (itemNumber > maxBaseNumber) {
//             maxBaseNumber = itemNumber;
//           }
//         });
        
//         // Increment for new buyer-retailer combination
//         const newBaseNumber = maxBaseNumber + 1;
//         return `${newBaseNumber}A`;
//       }
//     } catch (error) {
//       console.error('Error generating buyer code:', error);
//       // Fallback to a simple code
//       return `${Date.now().toString().slice(-3)}A`;
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   e.stopPropagation();
    
//   //   console.log('Form submitted with data:', formData);
    
//   //   // Validate form
//   //   if (!validateForm()) {
//   //     console.log('Form validation failed:', errors);
//   //     return;
//   //   }
    
//   //   try {
//   //     setIsGenerating(true);
//   //     console.log('Starting code generation...');
      
//   //     // Simulate API call delay
//   //     await new Promise(resolve => setTimeout(resolve, 1500));
      
//   //     // Generate new code based on buyer name and retailer
//   //     const newCode = generateBuyerCode(formData.buyerName, formData.retailer);
//   //     console.log('Generated code:', newCode);
      
//   //     // Save to localStorage
//   //     const existingCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
//   //     const newBuyerData = {
//   //       code: newCode,
//   //       buyerName: formData.buyerName.trim(),
//   //       buyerAddress: formData.buyerAddress.trim(),
//   //       contactPerson: formData.contactPerson.trim(),
//   //       retailer: formData.retailer.trim(),
//   //       createdAt: new Date().toISOString()
//   //     };
      
//   //     existingCodes.push(newBuyerData);
//   //     localStorage.setItem('buyerCodes', JSON.stringify(existingCodes));
//   //     console.log('Saved to localStorage:', newBuyerData);
      
//   //     // Set the generated code to show success screen
//   //     setGeneratedCode(newCode);
//   //     setIsGenerating(false);
      
//   //   } catch (error) {
//   //     console.error('Error in form submission:', error);
//   //     setIsGenerating(false);
//   //     alert('An error occurred while generating the buyer code. Please try again.');
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   e.stopPropagation();
  
//   console.log('Form submitted with data:', formData);
  
//   // Validate form
//   if (!validateForm()) {
//     console.log('Form validation failed:', errors);
//     return;
//   }
  
//   try {
//     setIsGenerating(true);
//     console.log('Starting code generation...');
    
//     // Check for exact duplicate entry
//     const existingCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
    
//     const normalizedFormData = {
//       buyerName: formData.buyerName.trim().toLowerCase(),
//       buyerAddress: formData.buyerAddress.trim().toLowerCase(),
//       contactPerson: formData.contactPerson.trim().toLowerCase(),
//       retailer: formData.retailer.trim().toLowerCase()
//     };
    
//     // Check if exact same entry exists (all fields match)
//     const exactDuplicate = existingCodes.find(item => {
//       return (
//         (item.buyerName || '').trim().toLowerCase() === normalizedFormData.buyerName &&
//         (item.buyerAddress || '').trim().toLowerCase() === normalizedFormData.buyerAddress &&
//         (item.contactPerson || '').trim().toLowerCase() === normalizedFormData.contactPerson &&
//         (item.retailer || '').trim().toLowerCase() === normalizedFormData.retailer
//       );
//     });
    
//     if (exactDuplicate) {
//       setIsGenerating(false);
//       setErrors({
//         buyerName: 'This exact buyer entry already exists',
//         retailer: `Existing code: ${exactDuplicate.code}`
//       });
//       alert(`This buyer already exists with code: ${exactDuplicate.code}\n\nIf you need a different code for the same buyer-retailer combination, please modify at least one field (e.g., address or contact person).`);
//       return;
//     }
    
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     // Generate new code based on buyer name and retailer
//     const newCode = generateBuyerCode(formData.buyerName, formData.retailer);
//     console.log('Generated code:', newCode);
    
//     // Save to localStorage
//     const newBuyerData = {
//       code: newCode,
//       buyerName: formData.buyerName.trim(),
//       buyerAddress: formData.buyerAddress.trim(),
//       contactPerson: formData.contactPerson.trim(),
//       retailer: formData.retailer.trim(),
//       createdAt: new Date().toISOString()
//     };
    
//     existingCodes.push(newBuyerData);
//     localStorage.setItem('buyerCodes', JSON.stringify(existingCodes));
//     console.log('Saved to localStorage:', newBuyerData);
    
//     // Set the generated code to show success screen
//     setGeneratedCode(newCode);
//     setIsGenerating(false);
    
//   } catch (error) {
//     console.error('Error in form submission:', error);
//     setIsGenerating(false);
//     alert('An error occurred while generating the buyer code. Please try again.');
//   }
// };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(generatedCode);
//       alert('Buyer code copied to clipboard!');
//     } catch (err) {
//       console.error('Failed to copy to clipboard:', err);
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = generatedCode;
//       textArea.style.position = 'fixed';
//       textArea.style.left = '-999999px';
//       textArea.style.top = '-999999px';
//       document.body.appendChild(textArea);
//       textArea.focus();
//       textArea.select();
      
//       try {
//         document.execCommand('copy');
//         alert('Buyer code copied to clipboard!');
//       } catch (copyErr) {
//         console.error('Fallback copy failed:', copyErr);
//         alert('Failed to copy code. Please copy manually: ' + generatedCode);
//       }
      
//       document.body.removeChild(textArea);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       buyerName: '',
//       buyerAddress: '',
//       contactPerson: '',
//       retailer: ''
//     });
//     setErrors({});
//     setGeneratedCode('');
//     setIsGenerating(false);
//   };

//   // Success screen - only show generated code
//   if (generatedCode) {
//     return (
//       <div className="generate-buyer-container">
//         <div className="generated-code-display">
//           <div className="success-animation">
//             <div className="success-icon">✓</div>
//             <h2 className="success-title">Buyer Code Generated Successfully!</h2>
//           </div>
          
//           <div className="code-display-card">
//             <h3 className="code-label">Your Buyer Code:</h3>
//             <div className="code-display">
//               <span className="code-text">{generatedCode}</span>
//               <button 
//                 className="copy-button" 
//                 onClick={copyToClipboard}
//                 title="Copy to clipboard"
//                 type="button"
//               >
//                 📋
//               </button>
//             </div>
//           </div>

//           <div className="action-buttons">
//             <button 
//               className="generate-another-btn" 
//               onClick={resetForm}
//               type="button"
//             >
//               Generate Another Code
//             </button>
//             <button 
//               className="back-btn" 
//               onClick={onBack}
//               type="button"
//             >
//               Back to Department
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Form screen
//   return (
//     <div className="generate-buyer-container">
//       <div className="form-header">
//         <button className="back-button" onClick={onBack} type="button">
//           ← Back to Department
//         </button>
//         <h1 className="form-title">Generate Buyer Code</h1>
//         <p className="form-description">Fill in the buyer details to generate a unique buyer code</p>
//       </div>

//       <form className="buyer-form" onSubmit={handleSubmit} noValidate>
//         <div className="form-grid">
//           <div className="form-group">
//             <label htmlFor="buyerName" className="form-label">
//               Buyer Name <span className="required">*</span>
//             </label>
//             <input
//               type="text"
//               id="buyerName"
//               name="buyerName"
//               value={formData.buyerName}
//               onChange={handleInputChange}
//               className={`form-input ${errors.buyerName ? 'error' : ''}`}
//               placeholder="Enter buyer name"
//               required
//             />
//             {errors.buyerName && <span className="error-message">{errors.buyerName}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="retailer" className="form-label">
//               Retailer <span className="required">*</span>
//             </label>
//             <input
//               type="text"
//               id="retailer"
//               name="retailer"
//               value={formData.retailer}
//               onChange={handleInputChange}
//               className={`form-input ${errors.retailer ? 'error' : ''}`}
//               placeholder="Enter retailer name"
//               required
//             />
//             {errors.retailer && <span className="error-message">{errors.retailer}</span>}
//           </div>

//           <div className="form-group full-width">
//             <label htmlFor="buyerAddress" className="form-label">
//               Buyer Address <span className="required">*</span>
//             </label>
//             <textarea
//               id="buyerAddress"
//               name="buyerAddress"
//               value={formData.buyerAddress}
//               onChange={handleInputChange}
//               className={`form-textarea ${errors.buyerAddress ? 'error' : ''}`}
//               placeholder="Enter complete buyer address"
//               rows={3}
//               required
//             />
//             {errors.buyerAddress && <span className="error-message">{errors.buyerAddress}</span>}
//           </div>

//           <div className="form-group full-width">
//             <label htmlFor="contactPerson" className="form-label">
//               Contact Person <span className="required">*</span>
//             </label>
//             <input
//               type="text"
//               id="contactPerson"
//               name="contactPerson"
//               value={formData.contactPerson}
//               onChange={handleInputChange}
//               className={`form-input ${errors.contactPerson ? 'error' : ''}`}
//               placeholder="Enter contact person name"
//               required
//             />
//             {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
//           </div>
//         </div>

//         <div className="form-actions">
//           <button 
//             type="submit" 
//             className="generate-btn"
//             disabled={isGenerating}
//           >
//             {isGenerating ? (
//               <>
//                 <span className="spinner"></span>
//                 Generating Code...
//               </>
//             ) : (
//               <>
//                 🎯 Generate Buyer Code
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default GenerateBuyerCode;

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
      newErrors.retailer = 'End Customer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkIfCombinationExists = (existingCodes) => {
    const normalizedBuyerName = formData.buyerName.trim().toLowerCase();
    const normalizedRetailer = formData.retailer.trim().toLowerCase();

    // Check if exact buyer + end customer combination exists
    const existingEntry = existingCodes.find(item => {
      const itemBuyerName = (item.buyerName || '').trim().toLowerCase();
      const itemRetailer = (item.retailer || '').trim().toLowerCase();

      return (
        itemBuyerName === normalizedBuyerName &&
        itemRetailer === normalizedRetailer
      );
    });

    return existingEntry;
  };

  const generateBuyerCode = (buyerName, retailer) => {
    try {
      // Get existing codes from localStorage
      const existingCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      
      // Normalize buyer name for comparison
      const normalizedBuyerName = buyerName.trim().toLowerCase();
      
      // Find all codes for this buyer (regardless of end customer)
      const buyerCodes = existingCodes.filter(item => {
        const itemBuyerName = (item.buyerName || '').trim().toLowerCase();
        return itemBuyerName === normalizedBuyerName;
      });
      
      if (buyerCodes.length > 0) {
        // Buyer exists - increment the letter suffix
        // Get the base number from the first code of this buyer
        const firstCode = buyerCodes[0].code;
        const baseNumber = parseInt(firstCode.replace(/[A-Z]/g, ''));
        
        // Find all letter suffixes for this buyer
        const letterSuffixes = buyerCodes.map(item => {
          const match = item.code.match(/[A-Z]+$/);
          return match ? match[0] : 'A';
        });
        
        // Find the highest letter (A, B, C, etc.)
        let highestLetter = 'A';
        letterSuffixes.forEach(letter => {
          if (letter > highestLetter) {
            highestLetter = letter;
          }
        });
        
        // Increment the letter for new end customer
        const nextLetter = String.fromCharCode(highestLetter.charCodeAt(0) + 1);
        
        return `${baseNumber}${nextLetter}`;
      } else {
        // New buyer - increment the base number
        // Find the highest base number across all codes
        let maxBaseNumber = 100; // Start from 100, so first code will be 101
        
        existingCodes.forEach(item => {
          const itemNumber = parseInt(item.code.replace(/[A-Z]/g, ''));
          if (itemNumber > maxBaseNumber) {
            maxBaseNumber = itemNumber;
          }
        });
        
        // Increment for new buyer
        const newBaseNumber = maxBaseNumber + 1;
        return `${newBaseNumber}A`;
      }
    } catch (error) {
      console.error('Error generating buyer code:', error);
      // Fallback to a simple code
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
      
      // Get existing codes from localStorage
      const existingCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      
      // Check if this exact buyer + end customer combination already exists
      const existingEntry = checkIfCombinationExists(existingCodes);
      
      if (existingEntry) {
        setIsGenerating(false);
        setErrors({
          buyerName: `This buyer-end customer combination already exists`,
          retailer: `Existing code: ${existingEntry.code}`
        });
        alert(`⚠️ This buyer-end customer combination already exists!\n\nExisting Code: ${existingEntry.code}\nBuyer: ${existingEntry.buyerName}\nEnd Customer: ${existingEntry.retailer}\n\nPlease use a different end customer or buyer name.`);
        return;
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate new code
      const newCode = generateBuyerCode(formData.buyerName, formData.retailer);
      console.log('Generated code:', newCode);
      
      // Save to localStorage
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
              End Customer <span className="required">*</span>
            </label>
            <input
              type="text"
              id="retailer"
              name="retailer"
              value={formData.retailer}
              onChange={handleInputChange}
              className={`form-input ${errors.retailer ? 'error' : ''}`}
              placeholder="Enter end customer name"
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
                🎯 Generate Buyer Code
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateBuyerCode;