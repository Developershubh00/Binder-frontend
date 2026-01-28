import { useState, useEffect } from 'react';
import GenerateFactoryCode from '../GenerateFactoryCode/GenerateFactoryCode';
import SearchableDropdown from '../GenerateFactoryCode/components/SearchableDropdown';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
// Dialog removed: IPO success is shown inline like Buyer/Vendor
import { FormCard, FullscreenContent } from '@/components/ui/form-layout';

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

  // Inline success screen (no modal) - matches Buyer/Vendor
  if (showIPOPopup) {
    return (
      <FullscreenContent style={{ overflowY: 'auto' }}>
        <div className="content-header">
          <Button variant="outline" onClick={onBack} type="button" className="mb-6 bg-white">
            ← Back to Departments
          </Button>
          <h1 className="fullscreen-title">Internal Purchase Order</h1>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: '24px 20px' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-5">
                ✓
              </div>

              <div className="w-full" style={{ marginTop: '8px' }}>
                <div className="text-sm font-semibold text-foreground/80 mb-3">
                  Generated IPO Code
                </div>

                <FormCard className="rounded-xl border-border bg-card" style={{ padding: '20px 18px' }}>
                  <div className="flex items-center justify-center gap-3">
                    <span
                      className="text-primary font-black"
                      style={{
                        fontSize: '28px',
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        letterSpacing: '2px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {generatedIPOCode}
                    </span>
                  </div>
                </FormCard>
              </div>

              <div className="flex justify-center gap-3" style={{ marginTop: '40px' }}>
                <Button onClick={handleNextFromPopup} type="button" variant="default">
                  Next
                </Button>
              </div>
            </div>
          </FormCard>
        </div>
      </FullscreenContent>
    );
  }

  // Initial Selection Screen
  return (
    <FullscreenContent style={{ overflowY: 'auto' }}>
      <div className="content-header">
        <Button variant="outline" onClick={onBack} type="button" className="mb-6 bg-white">
          ← Back to Departments
        </Button>
        <h1 className="fullscreen-title">Internal Purchase Order</h1>
        <p className="fullscreen-description">Select order type and enter required information</p>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: '24px 20px' }}>
          <div className="flex flex-wrap items-start" style={{ gap: '16px 12px', marginBottom: '32px' }}>
            {/* Order Type */}
            <Field 
              label="ORDER FOR" 
              required 
              error={errors.orderType}
              width="md"
              style={{ marginBottom: 0 }}
            >
              <SearchableDropdown
                value={initialData.orderType}
                onChange={handleOrderTypeChange}
                options={orderTypeOptions}
                placeholder="Select order type"
                className={errors.orderType ? 'border-destructive' : ''}
              />
            </Field>

            {/* Buyer Code (for Production/Sampling) or Type (for Company) */}
            {initialData.orderType === 'Company' ? (
              <Field 
                label="TYPE" 
                required 
                error={errors.type}
                width="md"
                style={{ marginBottom: 0 }}
              >
                <SearchableDropdown
                  value={initialData.type}
                  onChange={handleTypeChange}
                  options={companyTypeOptions}
                  placeholder="Select type (STOCK or SAM)"
                  className={errors.type ? 'border-destructive' : ''}
                />
              </Field>
            ) : (
              <Field 
                label="BUYER CODE" 
                required 
                error={errors.buyerCode}
                width="md"
                style={{ marginBottom: 0 }}
              >
                <SearchableDropdown
                  value={initialData.buyerCode}
                  onChange={handleBuyerCodeChange}
                  options={buyerCodeOptions}
                  placeholder="Select or type buyer code"
                  strictMode={false}
                  className={errors.buyerCode ? 'border-destructive' : ''}
                />
              </Field>
            )}

            {/* Program Name */}
            <Field 
              label="PROGRAM NAME" 
              required 
              error={errors.programName}
              width="md"
              style={{ marginBottom: 0 }}
            >
              <Input
                type="text"
                value={initialData.programName}
                onChange={handleProgramNameChange}
                placeholder="Enter program name"
                aria-invalid={!!errors.programName}
              />
            </Field>
          </div>

          {/* Continue Button */}
          <div className="flex justify-start">
            <Button type="button" onClick={handleContinue} variant="default">
              Continue →
            </Button>
          </div>
        </FormCard>
      </div>

      {/* IPO success is shown inline (no modal) */}
    </FullscreenContent>
  );
};

export default InternalPurchaseOrder;

