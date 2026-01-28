import { useState } from 'react';
import SearchableDropdown from './GenerateFactoryCode/components/SearchableDropdown';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormCard, FormRow, FullscreenContent } from '@/components/ui/form-layout';

const CompanyEssentials = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [commonDate, setCommonDate] = useState(new Date().toISOString().split('T')[0]);
  const [forms, setForms] = useState([{ id: 1, srNo: 1, data: getInitialFormData() }]);
  const [showPopup, setShowPopup] = useState(false);

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
  const submitForm = (formId) => {
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

    // Show popup instead of alert
    setShowPopup(true);
  };

  const handleSubmitAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    forms.forEach((form) => submitForm(form.id));
  };

  // Handle Add More from popup
  const handleAddMoreFromPopup = () => {
    setShowPopup(false);
    handleAddMore();
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
      <FormCard
        key={form.id}
        className="rounded-xl border-border bg-card"
        style={{ padding: '20px 18px', marginBottom: '12px' }}
      >
        {/* Top row (keeps button topmost, never overlaps fields) */}
        <div className="flex justify-end mb-3">
          <Button
            type="button"
            onClick={() => handleRemove(form.id)}
            disabled={forms.length === 1}
            variant="outline"
            size="sm"
            className="border-border text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            Remove
          </Button>
        </div>

        {/* Form Fields - Compact Layout */}
        <div className="flex flex-col gap-3">
          {/* Row 1: SR NO | DEPARTMENT | MACHINE TYPE | COMPONENT SPEC | QTY | UNIT (QTY/UNIT not for MACHINERY) */}
          <FormRow>
            <Field label="SR NO." width="sm">
              <Input
                type="number"
                value={form.srNo}
                readOnly
                className="bg-muted text-foreground/80"
              />
            </Field>

            {/* Department Field (for MACHINERY and QC TOOLS) */}
            {needsDepartment && (
              <Field label="DEPARTMENT" width="sm">
                <SearchableDropdown
                  value={form.data.department}
                  onChange={(value) => handleChange(form.id, 'department', value)}
                  options={departmentOptions}
                  placeholder="Enter or select department"
                />
              </Field>
            )}

            {/* Item Description or Item Field */}
            {!needsMachineFields && (
              <Field
                label={needsItem ? 'ITEM' : needsJobWork ? 'JOB WORK' : 'ITEM DESCRIPTION'}
                width="md"
              >
                <Input
                  type="text"
                  value={needsItem ? form.data.item : form.data.itemDescription}
                  onChange={(e) => handleChange(form.id, needsItem ? 'item' : 'itemDescription', e.target.value)}
                  placeholder={`Enter ${needsItem ? 'item' : needsJobWork ? 'job work' : 'item description'}`}
                />
              </Field>
            )}

            {/* Machine Type Field (for MACHINERY and QC TOOLS) */}
            {needsMachineFields && (
              <Field label="MACHINE TYPE" width="md">
                <Input
                  type="text"
                  value={form.data.machineType}
                  onChange={(e) => handleChange(form.id, 'machineType', e.target.value)}
                  placeholder="Enter machine type"
                />
              </Field>
            )}

            {/* Component Spec Field (for MACHINERY and QC TOOLS) */}
            {needsMachineFields && (
              <Field label="COMPONENT SPEC" width="md">
                <Input
                  type="text"
                  value={form.data.componentSpec}
                  onChange={(e) => handleChange(form.id, 'componentSpec', e.target.value)}
                  placeholder="Enter component specification"
                />
              </Field>
            )}

            {/* QTY or AMOUNT Field (not in row 1 for MACHINERY) */}
            {selectedCategory !== 'MACHINERY' && (
              <Field label={needsAmount ? 'AMOUNT' : 'QTY'} width="sm">
                <Input
                  type="number"
                  value={needsAmount ? form.data.amount : form.data.qty}
                  onChange={(e) => handleChange(form.id, needsAmount ? 'amount' : 'qty', e.target.value)}
                  placeholder={needsAmount ? 'Enter amount' : 'Enter quantity'}
                />
              </Field>
            )}

            {/* UNIT Field (not for TRAVEL EXPENSE and not in row 1 for MACHINERY) */}
            {!needsAmount && selectedCategory !== 'MACHINERY' && (
              <Field label="UNIT" width="sm">
                <SearchableDropdown
                  value={form.data.unit}
                  onChange={(value) => handleChange(form.id, 'unit', value)}
                  options={unitOptions}
                  placeholder="Select unit"
                />
              </Field>
            )}
          </FormRow>

          {/* Row 2: QTY | UNIT | REMARKS (for MACHINERY) or REMARKS | REF IMAGE (for others) */}
          <FormRow>
            {/* QTY Field (for MACHINERY in row 2) */}
            {selectedCategory === 'MACHINERY' && (
              <Field label="QTY" width="sm">
                <Input
                  type="number"
                  value={form.data.qty}
                  onChange={(e) => handleChange(form.id, 'qty', e.target.value)}
                  placeholder="Enter quantity"
                />
              </Field>
            )}

            {/* UNIT Field (for MACHINERY in row 2) */}
            {selectedCategory === 'MACHINERY' && (
              <Field label="UNIT" width="sm">
                <SearchableDropdown
                  value={form.data.unit}
                  onChange={(value) => handleChange(form.id, 'unit', value)}
                  options={unitOptions}
                  placeholder="Select unit"
                />
              </Field>
            )}

            {/* REMARKS Field */}
            <Field label="REMARKS" width="md">
              <Input
                type="text"
                value={form.data.remarks}
                onChange={(e) => handleChange(form.id, 'remarks', e.target.value)}
                placeholder="Enter remarks"
              />
            </Field>

            {/* FOR Field (for PANTRY and TRAVEL EXPENSE) - in row 2, before REF IMAGE */}
            {needsForField && (
              <Field label="FOR" width="md">
                {selectedCategory === 'PANTRY' ? (
                  <SearchableDropdown
                    value={form.data.forField}
                    onChange={(value) => handleChange(form.id, 'forField', value)}
                    options={forOptions}
                    placeholder="Select option"
                  />
                ) : (
                  <Input
                    type="text"
                    value={form.data.forField}
                    onChange={(e) => handleChange(form.id, 'forField', e.target.value)}
                    placeholder="Enter value"
                  />
                )}
              </Field>
            )}

            {/* REFERENCE IMAGE Field (show for all except MACHINERY) */}
            {selectedCategory !== 'MACHINERY' && (
              <Field label="REF IMAGE" width="md">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(form.id, e.target.files[0])}
                    className="hidden"
                    id={`upload-image-${form.id}`}
                    accept="image/*"
                  />
                  <label
                    htmlFor={`upload-image-${form.id}`}
                    className="inline-flex h-11 min-w-[120px] cursor-pointer items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground/80 shadow-xs transition-colors hover:bg-accent"
                  >
                    {form.data.referenceImage ? 'UPLOADED' : 'UPLOAD'}
                  </label>
                  {form.data.referenceImagePreview && (
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md border border-border bg-muted">
                      <img 
                        src={form.data.referenceImagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Field>
            )}

            {/* Component Spec Field (for QC TOOLS only) - in row 2 */}
            {needsMachineFields && selectedCategory !== 'MACHINERY' && (
              <Field label="COMPONENT SPEC" width="lg">
                <Input
                  type="text"
                  value={form.data.componentSpec}
                  onChange={(e) => handleChange(form.id, 'componentSpec', e.target.value)}
                  placeholder="Enter component specification"
                />
              </Field>
            )}

            {/* Department Field (for QC TOOLS only) - in row 2 */}
            {needsDepartment && selectedCategory !== 'MACHINERY' && (
              <Field label="DEPARTMENT" width="sm">
                <SearchableDropdown
                  value={form.data.department}
                  onChange={(value) => handleChange(form.id, 'department', value)}
                  options={departmentOptions}
                  placeholder="Enter or select department"
                />
              </Field>
            )}
          </FormRow>
        </div>
      </FormCard>
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
    <FullscreenContent style={{ overflowY: 'auto' }}>
      {/* Header */}
      <div className="content-header">
        <Button variant="outline" onClick={onBack} type="button" className="mb-6 bg-white">
          ← Back to Departments
        </Button>
        <h1 className="fullscreen-title">Company Essentials</h1>
      </div>

      {/* Category Selection */}
      <FormCard
        className="rounded-2xl border-border bg-muted"
        style={{ padding: '24px 20px', marginBottom: '16px' }}
      >
        <Field label="SELECT CATEGORY" width="md">
        <SearchableDropdown
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={categories}
          placeholder="Select or search category"
        />
        </Field>
      </FormCard>

      {/* Forms Section */}
      {selectedCategory && (
        <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: '24px 20px' }}>
          <h2 className="text-xl font-semibold mb-4">{selectedCategory}</h2>

          {/* Common Date Field */}
          {!needsDepartment && (
            <Field label="DATE" width="md" className="mb-4">
              <Input
                type="date"
                value={commonDate}
                onChange={(e) => setCommonDate(e.target.value)}
              />
            </Field>
          )}

          {/* Render all subforms */}
          <form onSubmit={handleSubmitAll} onKeyDown={handleKeyDown}>
            {forms.map(form => renderForm(form))}

            {/* Submit and Add More Buttons */}
            <div className="flex justify-start gap-4 mt-4">
              <Button type="submit" variant="default">
                SUBMIT
              </Button>
              <Button
                type="button"
                onClick={handleAddMore}
                variant="default"
              >
                Add More
              </Button>
            </div>
          </form>
        </FormCard>
      )}

      {/* Popup Modal */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Submitted</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleAddMoreFromPopup} type="button">
              Add More
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FullscreenContent>
    </>
  );
};

export default CompanyEssentials;
