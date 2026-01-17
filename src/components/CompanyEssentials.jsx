import { useState } from 'react';
import SearchableDropdown from './GenerateFactoryCode/components/SearchableDropdown';

const CompanyEssentials = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [commonDate, setCommonDate] = useState(new Date().toISOString().split('T')[0]);
  const [forms, setForms] = useState([{ id: 1, srNo: 1, data: getInitialFormData() }]);

  const categories = [
    'STATIONARY',
    'PANTRY',
    'MACHINERY',
    'HOUSE KEEPING',
    'ELECTRICAL',
    'HARDWARE & CHEMICALS',
    'AUDIT & COMPLIANCES',
    'IT',
    'QC TOOLS',
    'TRAVEL EXPENSE',
    'REPAIR',
    'MAINTENANCE'
  ];

  const unitOptions = ['METER', 'KGS', 'PCS', 'LITRE'];
  const forOptions = ['COMPANY', 'GUEST', 'COMPANY/GUEST'];
  const departmentOptions = ['BRAIDING', 'CARPET', 'CUTTING', 'DYEING', 'EMBROIDERY', 'KNITTING', 'PRINTING', 'QUILTING', 'SEWING', 'TUFTING', 'WEAVING'];

  function getInitialFormData() {
    return {
      department: '',
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
    };
  }

  // Get next PO number for a category
  const getNextPONumber = (category) => {
    if (!category) return 1;
    try {
      const existingData = JSON.parse(localStorage.getItem('companyEssentials') || '[]');
      const categoryEntries = existingData.filter(entry => entry.category === category);
      if (categoryEntries.length === 0) return 1;
      
      // Extract PO numbers from existing entries for this category
      const poNumbers = categoryEntries
        .map(entry => {
          // Extract PO number from code (format: CHD/E/{TYPE}/26-27/PO-{N}/)
          const match = entry.code?.match(/PO-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter(num => num > 0);
      
      if (poNumbers.length === 0) return 1;
      const maxPO = Math.max(...poNumbers);
      return maxPO + 1;
    } catch (error) {
      console.error('Error getting next PO number:', error);
      return 1;
    }
  };

  // Generate code based on category with PO number
  const generateCode = (category, poNumber) => {
    const type = category.toUpperCase().replace(/\s+/g, ' ');
    if (poNumber) {
      return `CHD/E/${type}/26-27/PO-${poNumber}/`;
    }
    return `CHD/E/${type}/26-27/`;
  };

  // Reset when category changes
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCommonDate(new Date().toISOString().split('T')[0]);
    setForms([{ id: 1, srNo: 1, data: getInitialFormData() }]);
  };

  // Handle remove form
  const handleRemove = (formId) => {
    setForms(prevForms => {
      const updated = prevForms.filter(form => form.id !== formId);
      // Reassign SR NOs
      return updated.map((form, index) => ({ ...form, srNo: index + 1 }));
    });
  };

  // Handle field change for a specific form
  const handleChange = (formId, field, value) => {
    setForms(prevForms =>
      prevForms.map(form =>
        form.id === formId
          ? { ...form, data: { ...form.data, [field]: value } }
          : form
      )
    );
  };

  // Handle image upload for a specific form
  const handleImageUpload = (formId, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForms(prevForms =>
          prevForms.map(form =>
            form.id === formId
              ? {
                  ...form,
                  data: {
                    ...form.data,
                    referenceImage: file,
                    referenceImagePreview: reader.result
                  }
                }
              : form
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Add More - add new form below
  const handleAddMore = () => {
    const nextSrNo = forms.length + 1;
    const newForm = {
      id: Date.now(),
      srNo: nextSrNo,
      data: getInitialFormData()
    };
    setForms(prevForms => [...prevForms, newForm]);
  };

  // Handle form submit for a specific form
  const handleSubmit = (e, formId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const form = forms.find(f => f.id === formId);
    if (!form) return;

    // Get next PO number for this category
    const poNumber = getNextPONumber(selectedCategory);
    const code = generateCode(selectedCategory, poNumber);
    
    const dataToSave = {
      category: selectedCategory,
      date: commonDate,
      department: form.data.department,
      code: code,
      poNumber: `PO-${poNumber}`,
      item: {
        srNo: form.srNo,
        itemDescription: form.data.itemDescription || form.data.item || form.data.machineType,
        machineType: form.data.machineType,
        componentSpec: form.data.componentSpec,
        qty: form.data.qty,
        amount: form.data.amount,
        unit: form.data.unit,
        forField: form.data.forField,
        remarks: form.data.remarks,
        hasImage: !!form.data.referenceImage
      },
      timestamp: new Date().toISOString()
    };

    const existingData = JSON.parse(localStorage.getItem('companyEssentials') || '[]');
    existingData.push(dataToSave);
    localStorage.setItem('companyEssentials', JSON.stringify(existingData));

    alert(`Form submitted successfully!\nCode: ${code}\n\nData saved.`);
  };

  // Prevent Enter key from submitting form when typing in input fields
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const target = e.target;
      // Only prevent if it's an input field, textarea, or select (not a button)
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        e.preventDefault();
        e.stopPropagation();
      }
    }
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
  
  // Check if category needs JOB WORK instead of ITEM DESCRIPTION
  const needsJobWork = selectedCategory === 'REPAIR' || selectedCategory === 'MAINTENANCE';

  // Render a single form
  const renderForm = (form) => {
    return (
      <div 
        key={form.id}
        className="bg-white rounded-lg border" 
        style={{ padding: '16px', marginBottom: '12px', borderColor: '#e0e0e0', position: 'relative' }}
      >
        {/* Remove Button - Top Right */}
        <button
          type="button"
          onClick={() => handleRemove(form.id)}
          disabled={forms.length === 1}
          className="cursor-pointer text-sm font-medium transition-all"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: '#ffffff',
            color: forms.length === 1 ? '#cccccc' : '#ff0000',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: forms.length === 1 ? 'not-allowed' : 'pointer',
            opacity: forms.length === 1 ? 0.5 : 1,
            zIndex: 10,
            visibility: 'visible',
            display: 'block'
          }}
          onMouseEnter={(e) => {
            if (forms.length > 1) {
              e.currentTarget.style.backgroundColor = '#fff5f5';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          Remove
        </button>

        {/* Form Fields - Compact Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Row 1: SR NO | DEPARTMENT | MACHINE TYPE | COMPONENT SPEC | QTY | UNIT (QTY/UNIT not for MACHINERY) */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* SR NO. Field */}
            <div className="flex flex-col" style={{ minWidth: '80px', maxWidth: '100px' }}>
              <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                SR NO.
              </label>
              <input
                type="number"
                value={form.srNo}
                readOnly
                className="border rounded-lg text-sm transition-all bg-gray-100"
                style={{ 
                  padding: '8px 12px', 
                  height: '40px', 
                  width: '100%',
                  borderColor: '#d0d0d0',
                  color: '#333'
                }}
              />
            </div>

            {/* Department Field (for MACHINERY and QC TOOLS) */}
            {needsDepartment && (
              <div className="flex flex-col" style={{ minWidth: '150px', maxWidth: '200px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  DEPARTMENT
                </label>
                <SearchableDropdown
                  value={form.data.department}
                  onChange={(value) => handleChange(form.id, 'department', value)}
                  options={departmentOptions}
                  placeholder="Enter or select department"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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

            {/* Item Description or Item Field */}
            {!needsMachineFields && (
              <div className="flex flex-col" style={{ width: '25%', minWidth: '150px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  {needsItem ? 'ITEM' : needsJobWork ? 'JOB WORK' : 'ITEM DESCRIPTION'}
                </label>
                <input
                  type="text"
                  value={needsItem ? form.data.item : form.data.itemDescription}
                  onChange={(e) => handleChange(form.id, needsItem ? 'item' : 'itemDescription', e.target.value)}
                  placeholder={`Enter ${needsItem ? 'item' : needsJobWork ? 'job work' : 'item description'}`}
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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

            {/* Machine Type Field (for MACHINERY and QC TOOLS) */}
            {needsMachineFields && (
              <div className="flex flex-col" style={{ width: '25%', minWidth: '150px', maxWidth: '250px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  MACHINE TYPE
                </label>
                <input
                  type="text"
                  value={form.data.machineType}
                  onChange={(e) => handleChange(form.id, 'machineType', e.target.value)}
                  placeholder="Enter machine type"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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
              <div className="flex flex-col" style={{ width: '25%', minWidth: '150px', maxWidth: '250px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  COMPONENT SPEC
                </label>
                <input
                  type="text"
                  value={form.data.componentSpec}
                  onChange={(e) => handleChange(form.id, 'componentSpec', e.target.value)}
                  placeholder="Enter component specification"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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

            {/* QTY or AMOUNT Field (not in row 1 for MACHINERY) */}
            {selectedCategory !== 'MACHINERY' && (
              <div className="flex flex-col" style={{ minWidth: '120px', maxWidth: '150px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  {needsAmount ? 'AMOUNT' : 'QTY'}
                </label>
                <input
                  type="number"
                  value={needsAmount ? form.data.amount : form.data.qty}
                  onChange={(e) => handleChange(form.id, needsAmount ? 'amount' : 'qty', e.target.value)}
                  placeholder={needsAmount ? 'Enter amount' : 'Enter quantity'}
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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

            {/* UNIT Field (not for TRAVEL EXPENSE and not in row 1 for MACHINERY) */}
            {!needsAmount && selectedCategory !== 'MACHINERY' && (
              <div className="flex flex-col" style={{ minWidth: '120px', maxWidth: '150px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  UNIT
                </label>
                <SearchableDropdown
                  value={form.data.unit}
                  onChange={(value) => handleChange(form.id, 'unit', value)}
                  options={unitOptions}
                  placeholder="Select unit"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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

          {/* Row 2: QTY | UNIT | REMARKS (for MACHINERY) or REMARKS | REF IMAGE (for others) */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* QTY Field (for MACHINERY in row 2) */}
            {selectedCategory === 'MACHINERY' && (
              <div className="flex flex-col" style={{ minWidth: '120px', maxWidth: '150px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  QTY
                </label>
                <input
                  type="number"
                  value={form.data.qty}
                  onChange={(e) => handleChange(form.id, 'qty', e.target.value)}
                  placeholder="Enter quantity"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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

            {/* UNIT Field (for MACHINERY in row 2) */}
            {selectedCategory === 'MACHINERY' && (
              <div className="flex flex-col" style={{ minWidth: '120px', maxWidth: '150px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  UNIT
                </label>
                <SearchableDropdown
                  value={form.data.unit}
                  onChange={(value) => handleChange(form.id, 'unit', value)}
                  options={unitOptions}
                  placeholder="Select unit"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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

            {/* REMARKS Field */}
            <div className="flex flex-col" style={{ width: '25%', minWidth: '150px' }}>
              <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                REMARKS
              </label>
              <input
                type="text"
                value={form.data.remarks}
                onChange={(e) => handleChange(form.id, 'remarks', e.target.value)}
                placeholder="Enter remarks"
                className="border rounded-lg text-sm transition-all bg-white"
                style={{ 
                  padding: '8px 12px', 
                  height: '40px', 
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

            {/* FOR Field (for PANTRY and TRAVEL EXPENSE) - in row 2, before REF IMAGE */}
            {needsForField && (
              <div className="flex flex-col" style={{ minWidth: '150px', maxWidth: '200px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  FOR
                </label>
                {selectedCategory === 'PANTRY' ? (
                  <SearchableDropdown
                    value={form.data.forField}
                    onChange={(value) => handleChange(form.id, 'forField', value)}
                    options={forOptions}
                    placeholder="Select option"
                    className="border rounded-lg text-sm transition-all bg-white"
                    style={{ 
                      padding: '8px 12px', 
                      height: '40px', 
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
                    value={form.data.forField}
                    onChange={(e) => handleChange(form.id, 'forField', e.target.value)}
                    placeholder="Enter value"
                    className="border rounded-lg text-sm transition-all bg-white"
                    style={{ 
                      padding: '8px 12px', 
                      height: '40px', 
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

            {/* REFERENCE IMAGE Field (show for all except MACHINERY) */}
            {selectedCategory !== 'MACHINERY' && (
              <div className="flex flex-col" style={{ minWidth: '200px', maxWidth: '300px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  REF IMAGE
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(form.id, e.target.files[0])}
                    className="hidden"
                    id={`upload-image-${form.id}`}
                    accept="image/*"
                  />
                  <label
                    htmlFor={`upload-image-${form.id}`}
                    className="border rounded-lg text-sm font-medium cursor-pointer transition-all bg-white hover:bg-gray-50"
                    style={{ 
                      padding: '8px 16px', 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minWidth: '120px',
                      borderColor: '#d0d0d0',
                      color: '#555'
                    }}
                  >
                    {form.data.referenceImage ? 'UPLOADED' : 'UPLOAD'}
                  </label>
                  {form.data.referenceImagePreview && (
                    <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                      <img 
                        src={form.data.referenceImagePreview} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Component Spec Field (for QC TOOLS only) - in row 2 */}
            {needsMachineFields && selectedCategory !== 'MACHINERY' && (
              <div className="flex flex-col" style={{ flex: '1', minWidth: '200px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  COMPONENT SPEC
                </label>
                <input
                  type="text"
                  value={form.data.componentSpec}
                  onChange={(e) => handleChange(form.id, 'componentSpec', e.target.value)}
                  placeholder="Enter component specification"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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

            {/* Department Field (for QC TOOLS only) - in row 2 */}
            {needsDepartment && selectedCategory !== 'MACHINERY' && (
              <div className="flex flex-col" style={{ minWidth: '150px', maxWidth: '200px' }}>
                <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                  DEPARTMENT
                </label>
                <SearchableDropdown
                  value={form.data.department}
                  onChange={(value) => handleChange(form.id, 'department', value)}
                  options={departmentOptions}
                  placeholder="Enter or select department"
                  className="border rounded-lg text-sm transition-all bg-white"
                  style={{ 
                    padding: '8px 12px', 
                    height: '40px', 
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
        </div>
      </div>
    );
  };

  return (
    <>
    <style>{`
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `}</style>
    <div className="w-full min-h-screen" style={{ padding: '16px', background: '#fafafa' }}>
      {/* Header */}
      <div className="mb-4" style={{ flexShrink: 0 }}>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-3 transition-colors"
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
        <h1 className="text-2xl font-semibold mb-2" style={{ color: '#333' }}>Company Essentials</h1>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-lg border" style={{ padding: '16px', marginBottom: '16px', borderColor: '#e0e0e0', flexShrink: 0 }}>
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

      {/* Forms Section */}
      {selectedCategory && (
        <div className="bg-white rounded-lg border" style={{ padding: '16px', borderColor: '#e0e0e0' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#333' }}>
            {selectedCategory}
          </h2>

          {/* Common Date Field */}
          {!needsDepartment && (
            <div className="flex flex-col mb-4" style={{ maxWidth: '220px' }}>
              <label className="text-sm font-semibold mb-2" style={{ color: '#555' }}>
                DATE
              </label>
              <input
                type="date"
                value={commonDate}
                onChange={(e) => setCommonDate(e.target.value)}
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

          {/* Render all subforms */}
          <form onSubmit={(e) => { e.preventDefault(); }} onKeyDown={handleKeyDown}>
            {forms.map(form => renderForm(form))}

            {/* Submit and Add More Buttons */}
            <div className="flex justify-start gap-4 mt-4" style={{ flexShrink: 0 }}>
              <button
                type="button"
                onClick={(e) => {
                  forms.forEach(form => handleSubmit(e, form.id));
                }}
                className="border rounded-md cursor-pointer text-sm font-medium transition-all"
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
              <button
                type="button"
                onClick={handleAddMore}
                className="border rounded-md cursor-pointer text-sm font-medium transition-all"
                style={{
                  backgroundColor: '#667eea',
                  borderColor: '#667eea',
                  color: '#ffffff',
                  padding: '10px 20px',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5568d3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea';
                }}
              >
                Add More
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default CompanyEssentials;
