import { useState, useEffect } from 'react';
import GenerateFactoryCode from '../GenerateFactoryCode/GenerateFactoryCode';
import SearchableDropdown from '../GenerateFactoryCode/components/SearchableDropdown';

const InternalPurchaseOrder = ({ onBack, onNavigateToCodeCreation, onNavigateToIPO }) => {
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [showIPOPopup, setShowIPOPopup] = useState(false);
  const [generatedIPOCode, setGeneratedIPOCode] = useState('');
  
  // Handle navigation to IPO - reset to initial screen
  // When called from GenerateFactoryCode opened via InternalPurchaseOrder,
  // we should always reset to the IPO initial screen
  const handleNavigateToIPO = () => {
    console.log('Resetting to IPO initial screen');
    setShowInitialScreen(true);
  };
  const [initialData, setInitialData] = useState({
    orderType: '',      // 'Production' | 'Sampling' | 'Company'
    buyerCode: '',
    type: '',          // 'STOCK' | 'SAM' (for Company only)
    programName: '',
    ipoCode: '',      // Generated IPO code
    poSrNo: null      // Sequential number
  });
  const [buyerCodeOptions, setBuyerCodeOptions] = useState([]);
  const [errors, setErrors] = useState({});

  const orderTypeOptions = ['Production', 'Sampling', 'Company'];
  const companyTypeOptions = ['STOCK', 'SAM'];

  // Load buyer codes from localStorage
  useEffect(() => {
    try {
      const buyerCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      const codes = buyerCodes.map(buyer => buyer.code);
      setBuyerCodeOptions(codes);
    } catch (error) {
      console.error('Error loading buyer codes:', error);
      setBuyerCodeOptions([]);
    }
  }, []);

  const handleOrderTypeChange = (value) => {
    // Clear buyerCode/type when orderType changes
    setInitialData(prev => ({ 
      ...prev, 
      orderType: value,
      buyerCode: '',
      type: ''
    }));
    if (errors.orderType) {
      setErrors(prev => ({ ...prev, orderType: '' }));
    }
    // Clear related errors
    setErrors(prev => ({ ...prev, buyerCode: '', type: '' }));
  };

  const handleBuyerCodeChange = (value) => {
    setInitialData(prev => ({ ...prev, buyerCode: value }));
    if (errors.buyerCode) {
      setErrors(prev => ({ ...prev, buyerCode: '' }));
    }
  };

  const handleTypeChange = (value) => {
    setInitialData(prev => ({ ...prev, type: value }));
    if (errors.type) {
      setErrors(prev => ({ ...prev, type: '' }));
    }
  };

  const handleProgramNameChange = (e) => {
    const value = e.target.value;
    setInitialData(prev => ({ ...prev, programName: value }));
    if (errors.programName) {
      setErrors(prev => ({ ...prev, programName: '' }));
    }
  };

  // Get next IPO sequential number - FIXED to increment per order type
  const getNextIPOSrNo = (orderType) => {
    try {
      const existingIPOs = JSON.parse(localStorage.getItem('internalPurchaseOrders') || '[]');
      // Filter IPOs by order type and get the highest serial number
      const sameTypeIPOs = existingIPOs.filter(ipo => ipo.orderType === orderType);
      if (sameTypeIPOs.length === 0) {
        return 1;
      }
      const maxSrNo = Math.max(...sameTypeIPOs.map(ipo => ipo.poSrNo || 0));
      return maxSrNo + 1;
    } catch (error) {
      console.error('Error getting next IPO SR#:', error);
      return 1;
    }
  };

  // Generate IPO code based on order type
  const generateIPOCode = (orderType, buyerCodeOrType, programName, poSrNo) => {
    const baseCode = 'CHD/';
    let typeCode = '';
    
    if (orderType === 'Production') {
      typeCode = 'PD/';
      return `${baseCode}${typeCode}${buyerCodeOrType}/${programName}/${poSrNo}`;
    } else if (orderType === 'Sampling') {
      typeCode = 'SAM/';
      return `${baseCode}${typeCode}${buyerCodeOrType}/${programName}/${poSrNo}`;
    } else if (orderType === 'Company') {
      typeCode = 'SELF/';
      return `${baseCode}${typeCode}${buyerCodeOrType}/${programName}/${poSrNo}`;
    }
    return '';
  };

  const validateInitialScreen = () => {
    const newErrors = {};
    
    if (!initialData.orderType?.trim()) {
      newErrors.orderType = 'Order Type is required';
    }
    
    // For Company, validate type instead of buyerCode
    if (initialData.orderType === 'Company') {
      if (!initialData.type?.trim()) {
        newErrors.type = 'Type is required';
      }
    } else {
      // For Production/Sampling, validate buyerCode
      if (!initialData.buyerCode?.trim()) {
        newErrors.buyerCode = 'Buyer Code is required';
      }
    }
    
    if (!initialData.programName?.trim()) {
      newErrors.programName = 'Program Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateInitialScreen()) {
      // Get next sequential number for this specific order type
      const poSrNo = getNextIPOSrNo(initialData.orderType);
      
      // Determine buyerCodeOrType based on orderType
      const buyerCodeOrType = initialData.orderType === 'Company' 
        ? initialData.type 
        : initialData.buyerCode;
      
      // Generate IPO code
      const ipoCode = generateIPOCode(
        initialData.orderType,
        buyerCodeOrType,
        initialData.programName,
        poSrNo
      );
      
      // Update initialData with generated code
      const updatedData = {
        ...initialData,
        ipoCode,
        poSrNo
      };
      
      // Store IPO record in localStorage
      try {
        const existingIPOs = JSON.parse(localStorage.getItem('internalPurchaseOrders') || '[]');
        const newIPO = {
          ipoCode,
          orderType: initialData.orderType,
          buyerCode: initialData.buyerCode || null,
          type: initialData.type || null,
          programName: initialData.programName,
          poSrNo,
          createdAt: new Date().toISOString()
        };
        existingIPOs.push(newIPO);
        localStorage.setItem('internalPurchaseOrders', JSON.stringify(existingIPOs));
      } catch (error) {
        console.error('Error saving IPO:', error);
      }
      
      setInitialData(updatedData);
      setGeneratedIPOCode(ipoCode);
      setShowIPOPopup(true);
    }
  };

  // Handle Next from IPO popup
  const handleNextFromPopup = () => {
    setShowIPOPopup(false);
    setShowInitialScreen(false);
  };

  // If initial screen is completed, show GenerateFactoryCode
  if (!showInitialScreen) {
    return (
      <GenerateFactoryCode 
        onBack={onBack}
        initialFormData={initialData}
        onNavigateToCodeCreation={onNavigateToCodeCreation}
        onNavigateToIPO={handleNavigateToIPO}
      />
    );
  }

  // Initial Selection Screen
  return (
    <div className='fullscreen-content'>
      <div className="" style={{ height: '100%', overflowY: 'scroll' }}>
      <div className="content-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Departments
        </button>
        <h1 className="fullscreen-title">Internal Purchase Order</h1>
        <p className="fullscreen-description">Select order type and enter required information</p>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Order Type */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
              ORDER FOR <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <SearchableDropdown
              value={initialData.orderType}
              onChange={handleOrderTypeChange}
              options={orderTypeOptions}
              placeholder="Select order type"
              className={errors.orderType ? 'border-red-600' : ''}
              style={{ 
                padding: '10px 14px', 
                height: '44px', 
                width: '40%',
                borderColor: errors.orderType ? '#ef4444' : '#d0d0d0'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#999';
                e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.orderType ? '#ef4444' : '#d0d0d0';
                e.target.style.boxShadow = '';
              }}
            />
            {errors.orderType && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.orderType}</span>
            )}
          </div>

          {/* Buyer Code (for Production/Sampling) or Type (for Company) */}
          {initialData.orderType === 'Company' ? (
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                TYPE <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <SearchableDropdown
                value={initialData.type}
                onChange={handleTypeChange}
                options={companyTypeOptions}
                placeholder="Select type (STOCK or SAM)"
                className={errors.type ? 'border-red-600' : ''}
                style={{ 
                  padding: '10px 14px', 
                  height: '44px', 
                  width: '40%',
                  borderColor: errors.type ? '#ef4444' : '#d0d0d0'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#999';
                  e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.type ? '#ef4444' : '#d0d0d0';
                  e.target.style.boxShadow = '';
                }}
              />
              {errors.type && (
                <span className="text-red-600 text-xs font-medium mt-1">{errors.type}</span>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                BUYER CODE <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <SearchableDropdown
                value={initialData.buyerCode}
                onChange={handleBuyerCodeChange}
                options={buyerCodeOptions}
                placeholder="Select or type buyer code"
                strictMode={false}
                className={errors.buyerCode ? 'border-red-600' : ''}
                style={{ 
                  padding: '10px 14px', 
                  height: '44px', 
                  width: '40%',
                  borderColor: errors.buyerCode ? '#ef4444' : '#d0d0d0'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#999';
                  e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.buyerCode ? '#ef4444' : '#d0d0d0';
                  e.target.style.boxShadow = '';
                }}
              />
              {errors.buyerCode && (
                <span className="text-red-600 text-xs font-medium mt-1">{errors.buyerCode}</span>
              )}
            </div>
          )}

          {/* Program Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
              PROGRAM NAME <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={initialData.programName}
              onChange={handleProgramNameChange}
              placeholder="Enter program name"
              className={errors.programName ? 'border-red-600' : ''}
              style={{ 
                padding: '10px 14px', 
                height: '44px', 
                width: '40%',
                border: `1px solid ${errors.programName ? '#ef4444' : '#d0d0d0'}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: '#333',
                background: '#fff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#999';
                e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.programName ? '#ef4444' : '#d0d0d0';
                e.target.style.boxShadow = '';
              }}
            />
            {errors.programName && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.programName}</span>
            )}
          </div>

          {/* Continue Button */}
          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center gap-2 text-white rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)',
                cursor: 'pointer'
              }}
            >
              Continue →
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* IPO Popup Modal */}
      {showIPOPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowIPOPopup(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px 20px',
              minWidth: '400px',
              maxWidth: '500px',
              position: 'relative',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Icon - Top Right */}
            <button
              onClick={() => setShowIPOPopup(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#666';
              }}
            >
              ×
            </button>

            {/* Popup Content */}
            <div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#333',
                textAlign: 'center'
              }}>
                IPO
              </h3>
              
              {/* Display IPO Code */}
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
                  wordBreak: 'break-word'
                }}>
                  {generatedIPOCode}
                </div>
              </div>
              
              {/* Next Button */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '12px', 
                marginTop: '24px'
              }}>
                <button
                  onClick={handleNextFromPopup}
                  style={{
                    backgroundColor: '#667eea',
                    border: 'none',
                    color: '#ffffff',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5568d3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#667eea';
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalPurchaseOrder;

