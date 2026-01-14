import { useState } from 'react';
import SearchableDropdown from './GenerateFactoryCode/components/SearchableDropdown';

const CompanyEssentials = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    department: '',
    srNo: 1,
    itemDescription: '',
    item: '',
    machineType: '',
    componentSpec: '',
    qty: '',
    amount: '',
    unit: '',
    forField: '',
    remarks: '',
    referenceImage: null,
    referenceImagePreview: null
  });

  const categories = [
    'STATIONARY',
    'PANTRY',
    'MACHINERY',
    'HOUSE KEEPING',
    'ELECTRICAL',
    'HARDWARE',
    'AUDIT & COMPLIANCES',
    'IT',
    'QC TOOLS',
    'TRAVEL EXPENSE',
    'REPAIR',
    'MAINTENANCE'
  ];

  const unitOptions = ['METER', 'KGS', 'PCS', 'LITRE'];
  // FOR field options only for PANTRY
  const forOptions = ['COMPANY', 'GUEST', 'COMPANY/GUEST'];

  // Generate code based on category (format: CHD/E/{TYPE}/26-27/{PO#})
  const generateCode = (category, poNumber) => {
    const type = category.toUpperCase().replace(/\s+/g, ' ');
    if (poNumber) {
      return `CHD/E/${type}/26-27/${poNumber}/`;
    }
    return `CHD/E/${type}/26-27/`;
  };

  // Handle field change
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          referenceImage: file,
          referenceImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form when category changes
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      department: '',
      srNo: 1,
      itemDescription: '',
      item: '',
      machineType: '',
      componentSpec: '',
      qty: '',
      amount: '',
      unit: '',
      forField: '',
      remarks: '',
      referenceImage: null,
      referenceImagePreview: null
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const code = generateCode(selectedCategory, '');
    
    const dataToSave = {
      category: selectedCategory,
      date: formData.date,
      department: formData.department,
      code: code,
      poNumber: '',
      item: {
        srNo: formData.srNo,
        itemDescription: formData.itemDescription || formData.item || formData.machineType,
        machineType: formData.machineType,
        componentSpec: formData.componentSpec,
        qty: formData.qty,
        amount: formData.amount,
        unit: formData.unit,
        forField: formData.forField,
        remarks: formData.remarks,
        hasImage: !!formData.referenceImage
      },
      timestamp: new Date().toISOString()
    };

    const existingData = JSON.parse(localStorage.getItem('companyEssentials') || '[]');
    existingData.push(dataToSave);
    localStorage.setItem('companyEssentials', JSON.stringify(existingData));

    alert(`Form submitted successfully!\nCode: ${code}\n\nData saved. API call will be implemented later.`);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      department: '',
      srNo: 1,
      itemDescription: '',
      item: '',
      machineType: '',
      componentSpec: '',
      qty: '',
      amount: '',
      unit: '',
      forField: '',
      remarks: '',
      referenceImage: null,
      referenceImagePreview: null
    });
    setSelectedCategory('');
  };

  // Check if category needs DEPARTMENT instead of DATE
  const needsDepartment = selectedCategory === 'MACHINERY' || selectedCategory === 'QC TOOLS';
  
  // Check if category needs MACHINE TYPE and COMPONENT SPEC
  const needsMachineFields = selectedCategory === 'MACHINERY' || selectedCategory === 'QC TOOLS';
  
  // Check if category needs FOR field
  const needsForField = selectedCategory === 'PANTRY' || selectedCategory === 'TRAVEL EXPENSE';
  
  // Check if category needs AMOUNT instead of QTY
  const needsAmount = selectedCategory === 'TRAVEL EXPENSE';
  
  // Check if category needs ITEM instead of ITEM DESCRIPTION
  const needsItem = selectedCategory === 'PANTRY';

  return (
    <div className="w-full min-h-screen" style={{ padding: '24px', background: '#fafafa' }}>
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-4 transition-colors"
          style={{ 
            padding: '8px 16px',
            borderRadius: '8px',
            background: '#f5f5f5',
            border: '1px solid #e0e0e0',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ← Back to Departments
        </button>
        <h1 className="text-3xl font-semibold mb-4" style={{ color: '#333', paddingBottom: '10px' }}>Company Essentials</h1>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-lg border" style={{ padding: '24px', marginBottom: '24px', borderColor: '#e0e0e0' }}>
        <label className="text-sm font-semibold mb-2" style={{ display: 'block', marginBottom: '8px', color: '#555' }}>
          SELECT CATEGORY
        </label>
        <SearchableDropdown
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={categories}
          placeholder="Select or search category"
          className="border rounded-lg text-sm transition-all bg-white text-gray-900"
          style={{ 
            padding: '10px 14px', 
            height: '44px', 
            width: '100%', 
            maxWidth: '22%',
            borderColor: '#d0d0d0'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#999';
            e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d0d0d0';
            e.target.style.boxShadow = '';
          }}
        />
      </div>

      {/* Form - Show when category is selected */}
      {selectedCategory && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border" style={{ padding: '32px', borderColor: '#e0e0e0' }}>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: '#333' }}>{selectedCategory}</h2>
            
            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
              {/* First Row: DATE/DEPARTMENT and SR NO. */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Date or Department Field */}
                {needsDepartment ? (
                  <div className="flex flex-col" style={{ minWidth: '200px', maxWidth: '220px' }}>
                    <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                      DEPARTMENT
                    </label>
                    <SearchableDropdown
                      value={formData.department}
                      onChange={(value) => handleChange('department', value)}
                      options={[]}
                      placeholder="Enter or select department"
                      className="border rounded-lg text-sm transition-all bg-white"
                      style={{ 
                        padding: '10px 14px', 
                        height: '44px', 
                        width: '100%',
                        borderColor: '#d0d0d0'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#999';
                        e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d0d0d0';
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col" style={{ minWidth: '200px', maxWidth: '220px' }}>
                    <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                      DATE
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="border rounded-lg text-sm transition-all bg-white"
                      style={{ 
                        padding: '10px 14px', 
                        height: '44px', 
                        width: '100%',
                        borderColor: '#d0d0d0',
                        color: '#333'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#999';
                        e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d0d0d0';
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                )}

                {/* SR NO. Field */}
                <div className="flex flex-col" style={{ minWidth: '100px', maxWidth: '120px' }}>
                  <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                    SR NO.
                  </label>
                  <input
                    type="number"
                    value={formData.srNo}
                    onChange={(e) => handleChange('srNo', e.target.value)}
                    className="border rounded-lg text-sm transition-all bg-white"
                    style={{ 
                      padding: '10px 14px', 
                      height: '44px', 
                      width: '100%',
                      borderColor: '#d0d0d0',
                      color: '#333'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#999';
                      e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d0d0d0';
                      e.target.style.boxShadow = '';
                    }}
                  />
                </div>
              </div>

              {/* Machine Type Field (for MACHINERY and QC TOOLS) */}
              {needsMachineFields && (
                <div className="flex flex-col" style={{ maxWidth: '45%' }}>
                  <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                    MACHINE TYPE
                  </label>
                  <input
                    type="text"
                    value={formData.machineType}
                    onChange={(e) => handleChange('machineType', e.target.value)}
                    placeholder="Enter machine type"
                    className="border rounded-lg text-sm transition-all bg-white"
                    style={{ 
                      padding: '10px 14px', 
                      height: '44px', 
                      width: '100%',
                      borderColor: '#d0d0d0',
                      color: '#333'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#999';
                      e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d0d0d0';
                      e.target.style.boxShadow = '';
                    }}
                  />
                </div>
              )}

              {/* Component Spec Field (for MACHINERY and QC TOOLS) */}
              {needsMachineFields && (
                <div className="flex flex-col" style={{ maxWidth: '45%' }}>
                  <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                    COMPONENT SPEC
                  </label>
                  <input
                    type="text"
                    value={formData.componentSpec}
                    onChange={(e) => handleChange('componentSpec', e.target.value)}
                    placeholder="Enter component specification"
                    className="border rounded-lg text-sm transition-all bg-white"
                    style={{ 
                      padding: '10px 14px', 
                      height: '44px', 
                      width: '100%',
                      borderColor: '#d0d0d0',
                      color: '#333'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#999';
                      e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d0d0d0';
                      e.target.style.boxShadow = '';
                    }}
                  />
                </div>
              )}

              {/* Item Description or Item Field */}
              {!needsMachineFields && (
                <div className="flex flex-col" style={{ maxWidth: '45%' }}>
                  <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                    {needsItem ? 'ITEM' : 'ITEM DESCRIPTION'}
                  </label>
                  <input
                    type="text"
                    value={needsItem ? formData.item : formData.itemDescription}
                    onChange={(e) => handleChange(needsItem ? 'item' : 'itemDescription', e.target.value)}
                    placeholder={`Enter ${needsItem ? 'item' : 'item description'}`}
                    className="border rounded-lg text-sm transition-all bg-white"
                    style={{ 
                      padding: '10px 14px', 
                      height: '44px', 
                      width: '100%',
                      borderColor: '#d0d0d0',
                      color: '#333'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#999';
                      e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d0d0d0';
                      e.target.style.boxShadow = '';
                    }}
                  />
                </div>
              )}

              {/* Second Row: QTY/AMOUNT and UNIT */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* QTY or AMOUNT Field */}
                <div className="flex flex-col" style={{ minWidth: '150px', maxWidth: '180px' }}>
                  <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                    {needsAmount ? 'AMOUNT' : 'QTY'}
                  </label>
                  <input
                    type="number"
                    value={needsAmount ? formData.amount : formData.qty}
                    onChange={(e) => handleChange(needsAmount ? 'amount' : 'qty', e.target.value)}
                    placeholder={needsAmount ? 'Enter amount' : 'Enter quantity'}
                    className="border rounded-lg text-sm transition-all bg-white"
                    style={{ 
                      padding: '10px 14px', 
                      height: '44px', 
                      width: '100%',
                      borderColor: '#d0d0d0',
                      color: '#333'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#999';
                      e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d0d0d0';
                      e.target.style.boxShadow = '';
                    }}
                  />
                </div>

                {/* UNIT Field (not for TRAVEL EXPENSE) */}
                {!needsAmount && (
                  <div className="flex flex-col" style={{ minWidth: '150px', maxWidth: '180px' }}>
                    <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                      UNIT
                    </label>
                    <SearchableDropdown
                      value={formData.unit}
                      onChange={(value) => handleChange('unit', value)}
                      options={unitOptions}
                      placeholder="Select unit"
                      className="border rounded-lg text-sm transition-all bg-white"
                      style={{ 
                        padding: '10px 14px', 
                        height: '44px', 
                        width: '100%',
                        borderColor: '#d0d0d0'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#999';
                        e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d0d0d0';
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* FOR Field (for PANTRY and TRAVEL EXPENSE) */}
              {needsForField && (
                <div className="flex flex-col" style={{ maxWidth: '45%' }}>
                  <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                    FOR
                  </label>
                  {selectedCategory === 'PANTRY' ? (
                    <SearchableDropdown
                      value={formData.forField}
                      onChange={(value) => handleChange('forField', value)}
                      options={forOptions}
                      placeholder="Select option"
                      className="border rounded-lg text-sm transition-all bg-white"
                      style={{ 
                        padding: '10px 14px', 
                        height: '44px', 
                        width: '100%',
                        borderColor: '#d0d0d0'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#999';
                        e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d0d0d0';
                        e.target.style.boxShadow = '';
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.forField}
                      onChange={(e) => handleChange('forField', e.target.value)}
                      placeholder="Enter value"
                      className="border rounded-lg text-sm transition-all bg-white"
                      style={{ 
                        padding: '10px 14px', 
                        height: '44px', 
                        width: '100%',
                        borderColor: '#d0d0d0',
                        color: '#333'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#999';
                        e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d0d0d0';
                        e.target.style.boxShadow = '';
                      }}
                    />
                  )}
                </div>
              )}

              {/* REMARKS Field - Less than half width */}
              <div className="flex flex-col" style={{ maxWidth: '45%' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  REMARKS
                </label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  placeholder="Enter remarks"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '10px 14px', 
                    height: '44px', 
                    width: '100%',
                    borderColor: '#d0d0d0',
                    color: '#333'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#999';
                    e.target.style.boxShadow = '0 0 0 2px rgba(150, 150, 150, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d0d0d0';
                    e.target.style.boxShadow = '';
                  }}
                />
              </div>

              {/* REFERENCE IMAGE Field - Full Width (show for all except MACHINERY) */}
              {selectedCategory !== 'MACHINERY' && (
                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                    REFERENCE IMAGE
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                      id="upload-image"
                      accept="image/*"
                    />
                    <label
                      htmlFor="upload-image"
                      className="border rounded-lg text-sm font-medium cursor-pointer transition-all bg-white hover:bg-gray-50"
                      style={{ 
                        padding: '10px 20px', 
                        height: '44px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        minWidth: '150px',
                        borderColor: '#d0d0d0',
                        color: '#555'
                      }}
                    >
                      {formData.referenceImage ? 'UPLOADED' : 'UPLOAD'}
                    </label>
                    {formData.referenceImagePreview && (
                      <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                        <img 
                          src={formData.referenceImagePreview} 
                          alt="Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-start mt-8">
              <button
                type="submit"
                className="border rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
                style={{
                  backgroundColor: '#f3f4f6',
                  borderColor: '#d1d5db',
                  color: '#374151',
                  padding: '10px 16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyEssentials;
