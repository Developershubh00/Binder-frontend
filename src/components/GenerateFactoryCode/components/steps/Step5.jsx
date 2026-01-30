import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import SearchableDropdown from '../SearchableDropdown';

const Step5 = ({
  formData,
  errors,
  handlePackagingChange,
  handlePackagingMaterialChange,
  handlePackagingMaterialSizeChange,
  handlePackagingWorkOrderChange,
  addPackagingMaterial,
  removePackagingMaterial
}) => {
  const prevMaterialsLengthRef = useRef(formData.packaging?.materials?.length || 0);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevMaterialsLengthRef.current = formData.packaging?.materials?.length || 0;
      return;
    }
    
    const currentMaterialsLength = formData.packaging?.materials?.length || 0;
    if (currentMaterialsLength > prevMaterialsLengthRef.current) {
      setTimeout(() => {
        const lastMaterial = document.querySelector('[data-packaging-material-index]:last-child');
        if (lastMaterial) {
          lastMaterial.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
    prevMaterialsLengthRef.current = currentMaterialsLength;
  }, [formData.packaging?.materials?.length]);

  // Get list of all component names from Step 1 (selected SKU's products/components)
  // Step 1 only edits products[0].components and never sets product.name; product names
  // come from Step 0 (sku.product). So we always show all components from this SKU's Step 1.
  const getComponentOptionsForSelectedProduct = () => {
    const names = [];
    (formData.products || []).forEach((product) => {
      (product.components || []).forEach((component) => {
        if (component?.productComforter) {
          names.push(component.productComforter);
        }
      });
    });
    return [...new Set(names)];
  };

  // Build list of all products and subproducts for header dropdown
  const getAllProductOptions = () => {
    const names = [];
    (formData.skus || []).forEach((sku) => {
      if (sku.product) {
        names.push(sku.product);
      }
      (sku.subproducts || []).forEach((sub) => {
        if (sub.product) {
          names.push(sub.product);
        }
      });
    });
    // Also include products from Step 1 (for safety / backwards compatibility)
    (formData.products || []).forEach((product) => {
      if (product.name) {
        names.push(product.name);
      }
    });
    return [...new Set(names)];
  };

  return (
<div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-5 PACKAGING</h2>
          <p className="text-sm text-gray-600">Configure packaging specifications and materials</p>
        </div>
      </div>

      {/* Header Configuration */}
      <div className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 className="text-sm font-bold text-gray-800" style={{ marginBottom: '16px' }}>PACKAGING HEADER</h3>
        
        <div className="flex flex-wrap items-start gap-4">
          {/* PRODUCT */}
          <div className="flex flex-col" style={{ width: '250px' }}>
            <label className="text-sm font-semibold text-gray-700 mb-2">PRODUCT</label>
            <SearchableDropdown
              value={formData.packaging.productSelection || ''}
              onChange={(selectedValue) => handlePackagingChange('productSelection', selectedValue || '')}
              options={getAllProductOptions()}
              placeholder="Select or type product"
              strictMode={false}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
              style={{ padding: '10px 14px', height: '44px' }}
            />
          </div>

          {/* TYPE */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
            <select
              value={formData.packaging.type}
              onChange={(e) => handlePackagingChange('type', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
            >
              <option value="STANDARD">STANDARD</option>
              <option value="ASSORTED">ASSORTED (LINK IPC#)</option>
            </select>
          </div>

          {/* CASEPACK QTY */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">CASEPACK QTY</label>
            <input
              type="number"
              value={formData.packaging.casepackQty}
              onChange={(e) => handlePackagingChange('casepackQty', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', width: '120px', height: '44px' }}
              placeholder="10"
              />
            </div>

          {/* IPC Link for Assorted */}
        {formData.packaging.type === 'ASSORTED' && (
              <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">LINK IPC#</label>
                <input
                  type="text"
                  value={formData.packaging.assortedSkuLink}
                  onChange={(e) => handlePackagingChange('assortedSkuLink', e.target.value)}
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                placeholder="IPC-123"
              />
          </div>
        )}
      </div>
        </div>

      {/* Packaging Materials */}
      <div>
        {formData.packaging.materials && formData.packaging.materials.length > 0 ? formData.packaging.materials.map((material, materialIndex) => (
          <div key={materialIndex} id={`packaging-material-${materialIndex}`} data-packaging-material-index={materialIndex} className="bg-white rounded-xl border-2 border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header with Remove Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h4 className="text-sm font-bold text-gray-800 underline underline-offset-4">MATERIAL {materialIndex + 1}</h4>
              {formData.packaging.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePackagingMaterial(materialIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#fee2e2',
                    borderColor: '#fca5a5',
                    color: '#b91c1c',
                    padding: '4px 10px',
                    height: '28px'
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Basic Info: Components, Material Description, Consumption, Unit, Work Order, Placement */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex flex-wrap items-start gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                <SearchableDropdown
                  value={material.components || ''}
                  onChange={(selectedValue) =>
                    handlePackagingMaterialChange(materialIndex, 'components', selectedValue || '')
                  }
                  options={getComponentOptionsForSelectedProduct()}
                  placeholder="Select or type component"
                  strictMode={false}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL DESCRIPTION</label>
                <input
                  type="text"
                  value={material.materialDescription || ''}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                  placeholder="e.g., Corrugated Box"
                />
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">CONS. PER PC</label>
                <input
                  type="number"
                    step="0.01"
                  value={material.netConsumptionPerPc}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'netConsumptionPerPc', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '110px', height: '44px' }}
                    placeholder="0.5"
                  />
            </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                <select
                  value={material.unit}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'unit', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  >
                    <option value="CM">CM</option>
                    <option value="KGS">KGS</option>
                </select>
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">WORK ORDER</label>
                <input
                    type="text"
                    value={material.workOrders[0].workOrder}
                    onChange={(e) => handlePackagingWorkOrderChange(materialIndex, 0, 'workOrder', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                  />
              </div>

                <div className="flex flex-col" style={{ flexGrow: 1, minWidth: '250px' }}>
                <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                <input
                  type="text"
                  value={material.placement}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'placement', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', height: '44px' }}
                    placeholder="1 ON THE CENTER OF THE LARGER SIDE..."
                />
              </div>
            </div>

              {/* SIZE Row */}
              <div className="flex flex-wrap items-start gap-4 mt-8" style={{marginTop: '20px'}}>
                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                    <input
                      type="number"
                      value={material.size.width}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                      placeholder="52"
                    />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                    <input
                      type="number"
                      value={material.size.length}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'length', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                    placeholder="48"
                  />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT</label>
                    <input
                      type="number"
                      value={material.size.height}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'height', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                    placeholder="52"
                  />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                    <select
                      value={material.size.unit}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    >
                      <option value="CM">CM</option>
                      <option value="KGS">KGS</option>
                    </select>
                  </div>
                </div>
              </div>

            {/* CATEGORY SELECTOR & CONDITIONAL FIELDS */}
            <div className="w-full mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col" style={{ width: '280px', marginBottom: '24px' }}>
                <label className="text-sm font-bold text-gray-800 mb-2">PACKAGING MATERIAL TYPE</label>
                <SearchableDropdown
                  value={material.packagingMaterialType || ''}
                  onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'packagingMaterialType', selectedValue)}
                  options={['CARTON BOX', 'CORNER PROTECTORS', 'EDGE PROTECTORS', 'FOAM INSERT', 'PALLET STRAP', 'DIVIDER', 'TAPE', 'POLYBAG~POLYBAG-FLAP', 'POLYBAG~Bale', 'SILICA GEL DESICCANT', 'STRETCH~WRAP', 'VOID~FILL']}
                  placeholder="Select or type Material Type"
                  style={{ width: '280px' }}
                />
              </div>

              {material.packagingMaterialType && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
                  
                  {/* Specific Fields for CARTON BOX - Completely new section */}
                  {material.packagingMaterialType === 'CARTON BOX' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.cartonBoxType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxType', selectedValue)}
                          options={['RSC (Regular Slotted Container)', 'HSC (Half Slotted)', 'FOL (Full Overlap)', 'Die-Cut', 'Telescope', 'Master Carton', 'Inner Carton']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2"># OF PLYS</label>
                        <SearchableDropdown
                          value={material.cartonBoxNoOfPlys || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxNoOfPlys', selectedValue)}
                          options={['3 Ply', '5 Ply', '7 Ply', '9 Ply']}
                          placeholder="Select or type # of Plys"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BOARD GRADE</label>
                        <SearchableDropdown
                          value={material.cartonBoxBoardGrade || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxBoardGrade', selectedValue)}
                          options={['Kraft (Brown)', 'White Top', 'Duplex', 'Test Liner', 'Virgin Kraft']}
                          placeholder="Select or type Board Grade"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">JOINT TYPE</label>
                        <SearchableDropdown
                          value={material.cartonBoxJointType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxJointType', selectedValue)}
                          options={['Staple/Stitched', 'Glued/Binded', 'Taped']}
                          placeholder="Select or type Joint Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BURSTING STRENGTH</label>
                        <input
                          type="text"
                          value={material.cartonBoxBurstingStrength || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cartonBoxBurstingStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 175 lbs, 200 lbs, 275 lbs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STIFFENER REQUIRED</label>
                        <SearchableDropdown
                          value={material.cartonBoxStiffenerRequired || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxStiffenerRequired', selectedValue)}
                          options={['YES', 'NO']}
                          placeholder="Select YES or NO"
                        />
                      </div>
                      {material.cartonBoxStiffenerRequired === 'YES' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">STIFFENER DIMENSIONS (L x W x H)</label>
                          <input
                            type="text"
                            value={material.cartonBoxStiffenerDimensions || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cartonBoxStiffenerDimensions', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="L x W x H (CM)"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <input
                          type="text"
                          value={material.cartonBoxQuantity || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cartonBoxQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pieces"
                        />
                      </div>
                      {/* DIMENSIONS for CARTON BOX */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS (L x W x H)</label>
                          <input
                            type="text"
                            value={material.cartonBoxDimensions || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cartonBoxDimensions', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="L x W x H"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <select
                            value={material.cartonBoxDimensionsUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cartonBoxDimensionsUnit', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                      {/* TESTING REQUIREMENTS - Multi-select with chips (SAME AS FIBER/FOAM) */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                        <div style={{ position: 'relative' }}>
                          <div
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-indigo-500 focus-within:outline-none"
                            style={{ 
                              padding: '8px 12px',
                              minHeight: '44px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                              alignItems: 'center',
                              cursor: 'text'
                            }}
                          >
                            {/* Selected chips */}
                            {(Array.isArray(material.cartonBoxTestingRequirements) ? material.cartonBoxTestingRequirements : []).map((req, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                                style={{
                                  backgroundColor: '#e0e7ff',
                                  color: '#4338ca',
                                  border: '1px solid #c7d2fe'
                                }}
                              >
                                {req}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const current = Array.isArray(material.cartonBoxTestingRequirements) ? material.cartonBoxTestingRequirements : [];
                                    const updated = current.filter((_, i) => i !== index);
                                    handlePackagingMaterialChange(materialIndex, 'cartonBoxTestingRequirements', updated);
                                  }}
                                  style={{
                                    marginLeft: '4px',
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    color: '#4338ca',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    lineHeight: '1',
                                    padding: 0,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '16px',
                                    height: '16px'
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            {/* Dropdown for selecting new options */}
                            <div 
                              id={`carton-box-testing-wrapper-${materialIndex}`}
                              style={{ flex: 1, minWidth: '200px' }}
                            >
                              <SearchableDropdown
                                value=""
                                strictMode={false}
                                onChange={(selectedValue) => {
                                  const options = ['Bursting Strength Test', 'ECT Test', 'Drop Test', 'Compression Test'];
                                  if (selectedValue && options.includes(selectedValue)) {
                                    const current = Array.isArray(material.cartonBoxTestingRequirements) ? material.cartonBoxTestingRequirements : [];
                                    if (!current.includes(selectedValue)) {
                                      const updated = [...current, selectedValue];
                                      handlePackagingMaterialChange(materialIndex, 'cartonBoxTestingRequirements', updated);
                                    }
                                  }
                                }}
                                options={['Bursting Strength Test', 'ECT Test', 'Drop Test', 'Compression Test']}
                                placeholder={(Array.isArray(material.cartonBoxTestingRequirements) && material.cartonBoxTestingRequirements.length === 0) ? "Select testing requirements" : "Add more..."}
                                className="border-0 outline-none"
                                style={{ 
                                  padding: '4px 0', 
                                  height: 'auto', 
                                  minHeight: '32px',
                                  backgroundColor: 'transparent', 
                                  boxShadow: 'none',
                                  border: 'none',
                                  borderWidth: '0',
                                  outline: 'none'
                                }}
                                onFocus={(e) => {
                                  const input = e.target;
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#667eea';
                                    container.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                  }
                                  const handleKeyDown = (keyEvent) => {
                                    if (keyEvent.key === 'Enter' && input.value && input.value.trim()) {
                                      keyEvent.preventDefault();
                                      keyEvent.stopPropagation();
                                      const newValue = input.value.trim();
                                      const current = Array.isArray(material.cartonBoxTestingRequirements) ? material.cartonBoxTestingRequirements : [];
                                      const options = ['Bursting Strength Test', 'ECT Test', 'Drop Test', 'Compression Test'];
                                      if (!current.includes(newValue)) {
                                        if (!options.includes(newValue)) {
                                          const updated = [...current, newValue];
                                          handlePackagingMaterialChange(materialIndex, 'cartonBoxTestingRequirements', updated);
                                        }
                                        input.value = '';
                                        input.blur();
                                      }
                                    }
                                  };
                                  input.addEventListener('keydown', handleKeyDown);
                                  input._enterHandler = handleKeyDown;
                                }}
                                onBlur={(e) => {
                                  const input = e.target;
                                  if (input._enterHandler) {
                                    input.removeEventListener('keydown', input._enterHandler);
                                    input._enterHandler = null;
                                  }
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#e5e7eb';
                                    container.style.boxShadow = 'none';
                                  }
                                  if (input.value && input.value.trim()) {
                                    const typedValue = input.value.trim();
                                    const options = ['Bursting Strength Test', 'ECT Test', 'Drop Test', 'Compression Test'];
                                    if (!options.includes(typedValue)) {
                                      const current = Array.isArray(material.cartonBoxTestingRequirements) ? material.cartonBoxTestingRequirements : [];
                                      if (!current.includes(typedValue)) {
                                        const updated = [...current, typedValue];
                                        handlePackagingMaterialChange(materialIndex, 'cartonBoxTestingRequirements', updated);
                                      }
                                    }
                                    input.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Specific Fields for CORNER PROTECTORS */}
                  {material.packagingMaterialType === 'CORNER PROTECTORS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.cornerProtectorType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorType', selectedValue)}
                          options={['L-Shape', 'U-Shape', 'Edge Guard', 'Wrap-Around']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.cornerProtectorMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorMaterial', selectedValue)}
                          options={['Cardboard', 'Corrugated Board', 'Plastic (PP/PE)', 'Foam (EPE/EVA)', 'Wood']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LEG LENGTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.cornerProtectorLegLength || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorLegLength', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="25"
                          />
                          <select
                            value={material.cornerProtectorLegLengthUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorLegLengthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.cornerProtectorThickness || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorThickness', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="3"
                          />
                          <select
                            value={material.cornerProtectorThicknessUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorThicknessUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT/LENGTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.cornerProtectorHeightLength || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorHeightLength', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="50"
                          />
                          <select
                            value={material.cornerProtectorHeightLengthUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorHeightLengthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LOAD CAPACITY</label>
                        <SearchableDropdown
                          value={material.cornerProtectorLoadCapacity || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorLoadCapacity', selectedValue)}
                          options={['Light (<10kg)', 'Medium (10-25kg)', 'Heavy (>25kg)']}
                          placeholder="Select or type Load Capacity"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOR</label>
                        <SearchableDropdown
                          value={material.cornerProtectorColor || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorColor', selectedValue)}
                          options={['Brown (Kraft)', 'White', 'Black', 'Custom']}
                          placeholder="Select or type Color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <input
                          type="text"
                          value={material.cornerProtectorQuantity || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pcs"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for EDGE PROTECTORS */}
                  {material.packagingMaterialType === 'EDGE PROTECTORS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.edgeProtectorType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorType', selectedValue)}
                          options={['V-Board', 'L-Board', 'U-Channel', 'Flat Strip', 'Wrap-Around']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.edgeProtectorMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorMaterial', selectedValue)}
                          options={['Solid Board', 'Corrugated', 'Laminated Board', 'Plastic', 'Metal (Aluminum)']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WING SIZE</label>
                        <SearchableDropdown
                          value={material.edgeProtectorWingSize || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorWingSize', selectedValue)}
                          options={['30x30mm', '35x35mm', '40x40mm', '50x50mm', '50x35mm (unequal)']}
                          placeholder="Select or type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <SearchableDropdown
                          value={material.edgeProtectorThickness || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorThickness', selectedValue)}
                          options={['2mm', '3mm', '4mm', '5mm', '6mm']}
                          placeholder="Select or type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                        <SearchableDropdown
                          value={material.edgeProtectorLength || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorLength', selectedValue)}
                          options={['600mm (24")', '900mm (36")', '1200mm (48")', '2400mm', 'Custom']}
                          placeholder="Select or type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLY/LAYERS</label>
                        <SearchableDropdown
                          value={material.edgeProtectorPlyLayers || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorPlyLayers', selectedValue)}
                          options={['Single Ply', 'Multi-Ply (laminated)']}
                          placeholder="Select or type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOR</label>
                        <SearchableDropdown
                          value={material.edgeProtectorColor || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorColor', selectedValue)}
                          options={['Brown', 'White', 'Custom Print']}
                          placeholder="Select or type Color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <input
                          type="text"
                          value={material.edgeProtectorQuantity || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PCS"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for FOAM INSERT */}
                  {material.packagingMaterialType === 'FOAM INSERT' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.foamInsertType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertType', selectedValue)}
                          options={['Die-Cut Insert', 'Convoluted (Egg Crate)', 'Sheet', 'Corner Block', 'Custom Molded']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.foamInsertMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertMaterial', selectedValue)}
                          options={['EPE (Polyethylene)', 'EVA', 'PU (Polyurethane)', 'XPE (Cross-linked PE)', 'EPS (Styrofoam)']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DENSITY</label>
                        <SearchableDropdown
                          value={material.foamInsertDensity || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertDensity', selectedValue)}
                          options={['18 kg/m³', '20 kg/m³', '25 kg/m³', '30 kg/m³', '35 kg/m³', '45 kg/m³']}
                          placeholder="Select or type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <SearchableDropdown
                          value={material.foamInsertThickness || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertThickness', selectedValue)}
                          options={['5mm', '10mm', '15mm', '20mm', '25mm', '30mm', '50mm']}
                          placeholder="Select or type"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS (L x W x H)</label>
                        <div className="flex items-end gap-4">
                          <div className="flex flex-col flex-1">
                            <input
                              type="text"
                              value={material.foamInsertDimensions || ''}
                              onChange={(e) => handlePackagingMaterialChange(materialIndex, 'foamInsertDimensions', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="L x W x H"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">UNIT</label>
                            <select
                              value={material.foamInsertDimensionsUnit || 'CM'}
                              onChange={(e) => handlePackagingMaterialChange(materialIndex, 'foamInsertDimensionsUnit', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                            >
                              <option value="CM">CM</option>
                              <option value="KGS">KGS</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOR</label>
                        <SearchableDropdown
                          value={material.foamInsertColor || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertColor', selectedValue)}
                          options={['White', 'Black', 'Pink (Anti-Static)', 'Blue', 'Custom']}
                          placeholder="Select or type Color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <input
                          type="text"
                          value={material.foamInsertQuantity || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'foamInsertQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PCS"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for PALLET STRAP */}
                  {material.packagingMaterialType === 'PALLET STRAP' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.palletStrapType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapType', selectedValue)}
                          options={['PP Strapping', 'PET Strapping', 'Steel Strapping', 'Composite (Woven)']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <SearchableDropdown
                          value={material.palletStrapApplication || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapApplication', selectedValue)}
                          options={['Manual (Hand Tool)', 'Semi-Auto', 'Automatic Machine']}
                          placeholder="Select or type Application"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <SearchableDropdown
                          value={material.palletStrapWidth || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapWidth', selectedValue)}
                          options={['9mm', '12mm', '15mm', '16mm', '19mm', '25mm', '32mm']}
                          placeholder="Select or type Width"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SEAL TYPE</label>
                        <SearchableDropdown
                          value={material.palletStrapSealType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapSealType', selectedValue)}
                          options={['Metal Seals', 'Friction Weld', 'Heat Seal', 'Buckle']}
                          placeholder="Select or type Seal Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SEAL SIZE</label>
                        <SearchableDropdown
                          value={material.palletStrapSealSize || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapSealSize', selectedValue)}
                          options={['12mm', '13mm', '15mm', '16mm', '19mm']}
                          placeholder="Select or type Seal Size"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOR</label>
                        <SearchableDropdown
                          value={material.palletStrapColor || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapColor', selectedValue)}
                          options={['Black', 'Blue', 'Green', 'Yellow', 'White', 'Custom']}
                          placeholder="Select or type Color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <input
                          type="text"
                          value={material.palletStrapQuantity || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'palletStrapQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="METER"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for POLYBAG~Bale */}
                  {material.packagingMaterialType === 'POLYBAG~Bale' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKAGING TYPE</label>
                        <SearchableDropdown
                          value={material.polybagBalePackagingType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBalePackagingType', selectedValue)}
                          options={['STANDARD', 'INNER~CASEAPACK', 'PC']}
                          placeholder="Select or type Packaging Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">INNER CASEPACK</label>
                        <input
                          type="number"
                          value={material.polybagBaleInnerCasepack || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagBaleInnerCasepack', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Numeric"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.polybagBaleType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBaleType', selectedValue)}
                          options={['Polysheet (Flat)', 'Bale Wrap (for shipping bales)', 'Pallet Wrap', 'Shrink Film', 'Stretch Film']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.polybagBaleMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBaleMaterial', selectedValue)}
                          options={['LDPE', 'HDPE', 'LLDPE (Stretch)', 'PVC (Shrink)', 'Recycled PE']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GAUGE/GSM</label>
                        <input
                          type="text"
                          value={material.polybagBaleGaugeGsm || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagBaleGaugeGsm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 150, 200, 300 gauge or GSM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ROLL WIDTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.polybagBaleRollWidth || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagBaleRollWidth', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="36"
                          />
                          <select
                            value={material.polybagBaleRollWidthUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagBaleRollWidthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <SearchableDropdown
                          value={material.polybagBaleColour || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBaleColour', selectedValue)}
                          options={['Clear/Transparent', 'White', 'Black', 'Tinted (Blue)', 'Tinted (Green)']}
                          placeholder="Select or type Colour"
                        />
                      </div>
                      {/* TESTING REQUIREMENTS - Multi-select with chips (SAME AS CARTON BOX) */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                        <div style={{ position: 'relative' }}>
                          <div
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-indigo-500 focus-within:outline-none"
                            style={{ 
                              padding: '8px 12px',
                              minHeight: '44px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                              alignItems: 'center',
                              cursor: 'text'
                            }}
                          >
                            {/* Selected chips */}
                            {(Array.isArray(material.polybagBaleTestingRequirements) ? material.polybagBaleTestingRequirements : []).map((req, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                                style={{
                                  backgroundColor: '#e0e7ff',
                                  color: '#4338ca',
                                  border: '1px solid #c7d2fe'
                                }}
                              >
                                {req}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const current = Array.isArray(material.polybagBaleTestingRequirements) ? material.polybagBaleTestingRequirements : [];
                                    const updated = current.filter((_, i) => i !== index);
                                    handlePackagingMaterialChange(materialIndex, 'polybagBaleTestingRequirements', updated);
                                  }}
                                  style={{
                                    marginLeft: '4px',
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    color: '#4338ca',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    lineHeight: '1',
                                    padding: 0,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '16px',
                                    height: '16px'
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            {/* Dropdown for selecting new options */}
                            <div 
                              id={`polybag-bale-testing-wrapper-${materialIndex}`}
                              style={{ flex: 1, minWidth: '200px' }}
                            >
                              <SearchableDropdown
                                value=""
                                strictMode={false}
                                onChange={(selectedValue) => {
                                  const options = ['Tear Strength', 'Puncture Resistance', 'Stretch %'];
                                  if (selectedValue && options.includes(selectedValue)) {
                                    const current = Array.isArray(material.polybagBaleTestingRequirements) ? material.polybagBaleTestingRequirements : [];
                                    if (!current.includes(selectedValue)) {
                                      const updated = [...current, selectedValue];
                                      handlePackagingMaterialChange(materialIndex, 'polybagBaleTestingRequirements', updated);
                                    }
                                  }
                                }}
                                options={['Tear Strength', 'Puncture Resistance', 'Stretch %']}
                                placeholder={(Array.isArray(material.polybagBaleTestingRequirements) && material.polybagBaleTestingRequirements.length === 0) ? "Select testing requirements" : "Add more..."}
                                className="border-0 outline-none"
                                style={{ 
                                  padding: '4px 0', 
                                  height: 'auto', 
                                  minHeight: '32px',
                                  backgroundColor: 'transparent', 
                                  boxShadow: 'none',
                                  border: 'none',
                                  borderWidth: '0',
                                  outline: 'none'
                                }}
                                onFocus={(e) => {
                                  const input = e.target;
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#667eea';
                                    container.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                  }
                                  const handleKeyDown = (keyEvent) => {
                                    if (keyEvent.key === 'Enter' && input.value && input.value.trim()) {
                                      keyEvent.preventDefault();
                                      keyEvent.stopPropagation();
                                      const newValue = input.value.trim();
                                      const current = Array.isArray(material.polybagBaleTestingRequirements) ? material.polybagBaleTestingRequirements : [];
                                      const options = ['Tear Strength', 'Puncture Resistance', 'Stretch %'];
                                      if (!current.includes(newValue)) {
                                        if (!options.includes(newValue)) {
                                          const updated = [...current, newValue];
                                          handlePackagingMaterialChange(materialIndex, 'polybagBaleTestingRequirements', updated);
                                        }
                                        input.value = '';
                                        input.blur();
                                      }
                                    }
                                  };
                                  input.addEventListener('keydown', handleKeyDown);
                                  input._enterHandler = handleKeyDown;
                                }}
                                onBlur={(e) => {
                                  const input = e.target;
                                  if (input._enterHandler) {
                                    input.removeEventListener('keydown', input._enterHandler);
                                    input._enterHandler = null;
                                  }
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#e5e7eb';
                                    container.style.boxShadow = 'none';
                                  }
                                  if (input.value && input.value.trim()) {
                                    const typedValue = input.value.trim();
                                    const options = ['Tear Strength', 'Puncture Resistance', 'Stretch %'];
                                    if (!options.includes(typedValue)) {
                                      const current = Array.isArray(material.polybagBaleTestingRequirements) ? material.polybagBaleTestingRequirements : [];
                                      if (!current.includes(typedValue)) {
                                        const updated = [...current, typedValue];
                                        handlePackagingMaterialChange(materialIndex, 'polybagBaleTestingRequirements', updated);
                                      }
                                    }
                                    input.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.polybagBaleQuantity || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagBaleQuantity', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="100"
                          />
                          <select
                            value={material.polybagBaleQuantityUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagBaleQuantityUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Specific Fields for POLYBAG~POLYBAG-FLAP */}
                  {material.packagingMaterialType === 'POLYBAG~POLYBAG-FLAP' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKAGING TYPE</label>
                        <SearchableDropdown
                          value={material.polybagPolybagFlapPackagingType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapPackagingType', selectedValue)}
                          options={['STANDARD', 'INNER~CASEAPACK', 'PC']}
                          placeholder="Select or type Packaging Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">INNER CASEPACK</label>
                        <input
                          type="number"
                          value={material.polybagPolybagFlapInnerCasepack || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapInnerCasepack', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Numeric"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.polybagPolybagFlapType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapType', selectedValue)}
                          options={['Flat Bag (Open Top)', 'Gusseted Bag', 'Wicketed Bag', 'Zip Lock Bag', 'Drawstring Bag']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.polybagPolybagFlapMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapMaterial', selectedValue)}
                          options={['LDPE (Low Density Polyethylene)', 'HDPE (High Density)', 'PP (Polypropylene)', 'CPP', 'Biodegradable', 'Recycled PE']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GAUGE / THICKNESS</label>
                        <input
                          type="text"
                          value={material.polybagPolybagFlapGaugeThickness || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapGaugeThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 100, 150, 200 gauge or 25, 37.5, 50 micron"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS</label>
                        <input
                          type="text"
                          value={material.polybagPolybagFlapDimensions || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapDimensions', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '100%' }}
                          placeholder="W x L (x G)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FLAP REQUIRED</label>
                        <SearchableDropdown
                          value={material.polybagPolybagFlapFlapRequired || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapFlapRequired', selectedValue)}
                          options={['YES', 'NO']}
                          placeholder="Select YES or NO"
                        />
                      </div>
                      {material.polybagPolybagFlapFlapRequired === 'YES' && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FLAP DIMENSIONS</label>
                          <input
                            type="text"
                            value={material.polybagPolybagFlapFlapDimensions || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapFlapDimensions', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100%' }}
                            placeholder="L x W x H (CM)"
                          />
                        </div>
                      )}
                      {/* TESTING REQUIREMENTS - Multi-select with chips (SAME AS POLYBAG~Bale) */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                        <div style={{ position: 'relative' }}>
                          <div
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-indigo-500 focus-within:outline-none"
                            style={{ 
                              padding: '8px 12px',
                              minHeight: '44px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                              alignItems: 'center',
                              cursor: 'text'
                            }}
                          >
                            {/* Selected chips */}
                            {(Array.isArray(material.polybagPolybagFlapTestingRequirements) ? material.polybagPolybagFlapTestingRequirements : []).map((req, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                                style={{
                                  backgroundColor: '#e0e7ff',
                                  color: '#4338ca',
                                  border: '1px solid #c7d2fe'
                                }}
                              >
                                {req}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const current = Array.isArray(material.polybagPolybagFlapTestingRequirements) ? material.polybagPolybagFlapTestingRequirements : [];
                                    const updated = current.filter((_, i) => i !== index);
                                    handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapTestingRequirements', updated);
                                  }}
                                  style={{
                                    marginLeft: '4px',
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    color: '#4338ca',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    lineHeight: '1',
                                    padding: 0,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '16px',
                                    height: '16px'
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            {/* Dropdown for selecting new options */}
                            <div 
                              id={`polybag-polybag-flap-testing-wrapper-${materialIndex}`}
                              style={{ flex: 1, minWidth: '200px' }}
                            >
                              <SearchableDropdown
                                value=""
                                strictMode={false}
                                onChange={(selectedValue) => {
                                  const options = ['Seal Strength', 'Dart Drop Impact', 'Clarity Test'];
                                  if (selectedValue && options.includes(selectedValue)) {
                                    const current = Array.isArray(material.polybagPolybagFlapTestingRequirements) ? material.polybagPolybagFlapTestingRequirements : [];
                                    if (!current.includes(selectedValue)) {
                                      const updated = [...current, selectedValue];
                                      handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapTestingRequirements', updated);
                                    }
                                  }
                                }}
                                options={['Seal Strength', 'Dart Drop Impact', 'Clarity Test']}
                                placeholder={(Array.isArray(material.polybagPolybagFlapTestingRequirements) && material.polybagPolybagFlapTestingRequirements.length === 0) ? "Select testing requirements" : "Add more..."}
                                className="border-0 outline-none"
                                style={{ 
                                  padding: '4px 0', 
                                  height: 'auto', 
                                  minHeight: '32px',
                                  backgroundColor: 'transparent', 
                                  boxShadow: 'none',
                                  border: 'none',
                                  borderWidth: '0',
                                  outline: 'none'
                                }}
                                onFocus={(e) => {
                                  const input = e.target;
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#667eea';
                                    container.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                  }
                                  const handleKeyDown = (keyEvent) => {
                                    if (keyEvent.key === 'Enter' && input.value && input.value.trim()) {
                                      keyEvent.preventDefault();
                                      keyEvent.stopPropagation();
                                      const newValue = input.value.trim();
                                      const current = Array.isArray(material.polybagPolybagFlapTestingRequirements) ? material.polybagPolybagFlapTestingRequirements : [];
                                      const options = ['Seal Strength', 'Dart Drop Impact', 'Clarity Test'];
                                      if (!current.includes(newValue)) {
                                        if (!options.includes(newValue)) {
                                          const updated = [...current, newValue];
                                          handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapTestingRequirements', updated);
                                        }
                                        input.value = '';
                                        input.blur();
                                      }
                                    }
                                  };
                                  input.addEventListener('keydown', handleKeyDown);
                                  input._enterHandler = handleKeyDown;
                                }}
                                onBlur={(e) => {
                                  const input = e.target;
                                  if (input._enterHandler) {
                                    input.removeEventListener('keydown', input._enterHandler);
                                    input._enterHandler = null;
                                  }
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#e5e7eb';
                                    container.style.boxShadow = 'none';
                                  }
                                  if (input.value && input.value.trim()) {
                                    const typedValue = input.value.trim();
                                    const options = ['Seal Strength', 'Dart Drop Impact', 'Clarity Test'];
                                    if (!options.includes(typedValue)) {
                                      const current = Array.isArray(material.polybagPolybagFlapTestingRequirements) ? material.polybagPolybagFlapTestingRequirements : [];
                                      if (!current.includes(typedValue)) {
                                        const updated = [...current, typedValue];
                                        handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapTestingRequirements', updated);
                                      }
                                    }
                                    input.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.polybagPolybagFlapQuantity || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapQuantity', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="100"
                          />
                          <select
                            value={material.polybagPolybagFlapQuantityUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapQuantityUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Specific Fields for SILICA GEL DESICCANT */}
                  {material.packagingMaterialType === 'SILICA GEL DESICCANT' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.silicaGelDesiccantType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantType', selectedValue)}
                          options={['Silica Gel', 'Clay (Montmorillonite)', 'Molecular Sieve', 'Calcium Chloride', 'Activated Carbon']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FORM</label>
                        <SearchableDropdown
                          value={material.silicaGelDesiccantForm || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantForm', selectedValue)}
                          options={['Sachets/Packets', 'Canisters', 'Strips', 'Sheets', 'Poles/Hanging']}
                          placeholder="Select or type Form"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT SIZE</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <SearchableDropdown
                            value={material.silicaGelDesiccantUnitSize || ''}
                            onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantUnitSize', selectedValue)}
                            options={['1g', '2g', '5g', '10g', '25g', '50g', '100g', '200g', '500g']}
                            placeholder="Select or type"
                            style={{ paddingRight: '60px' }}
                          />
                          <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>GRAMS</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOR</label>
                        <SearchableDropdown
                          value={material.silicaGelDesiccantColor || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantColor', selectedValue)}
                          options={['White', 'Blue', 'Orange (indicating)']}
                          placeholder="Select or type Color"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                          value={material.silicaGelDesiccantPlacement || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantPlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '100%' }}
                          placeholder="Placement details"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <input
                          type="text"
                          value={material.silicaGelDesiccantQuantity || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PCS"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UPLOAD IMAGE REFERENCE</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantImageReference', e.target.files[0])}
                            className="hidden"
                            id={`silica-gel-desiccant-image-${materialIndex}`}
                          />
                          <label
                            htmlFor={`silica-gel-desiccant-image-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                            style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.silicaGelDesiccantImageReference ? 'DONE' : 'UPLOAD'}</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CASEPACK LOGIC</label>
                        <input
                          type="text"
                          value={material.silicaGelDesiccantCasepackLogic || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantCasepackLogic', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '100%' }}
                          placeholder="Casepack logic"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for STRETCH~WRAP */}
                  {material.packagingMaterialType === 'STRETCH~WRAP' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.stretchWrapType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapType', selectedValue)}
                          options={['Hand Wrap', 'Machine Wrap', 'Pre-Stretch', 'Bundling Film', 'Colored/Tinted']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.stretchWrapMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapMaterial', selectedValue)}
                          options={['LLDPE (Linear Low)', 'LDPE', 'Cast Film', 'Blown Film']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <SearchableDropdown
                            value={material.stretchWrapWidth || ''}
                            onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapWidth', selectedValue)}
                            options={['100mm', '450mm', '500mm', '600mm', '750mm']}
                            placeholder="Select or type"
                            style={{ paddingRight: '50px' }}
                          />
                          <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>CM</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS/GAUGE</label>
                        <SearchableDropdown
                          value={material.stretchWrapThicknessGauge || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapThicknessGauge', selectedValue)}
                          options={['17 micron', '20 micron', '23 micron', '25 micron', '30 micron']}
                          placeholder="Select or type Thickness/Gauge"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CLING</label>
                        <SearchableDropdown
                          value={material.stretchWrapCling || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapCling', selectedValue)}
                          options={['One-Side Cling', 'Two-Side Cling']}
                          placeholder="Select or type Cling"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOR</label>
                        <SearchableDropdown
                          value={material.stretchWrapColor || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapColor', selectedValue)}
                          options={['Clear', 'Black', 'Blue', 'Green', 'White Opaque']}
                          placeholder="Select or type Color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <input
                          type="text"
                          value={material.stretchWrapQuantity || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'stretchWrapQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Number of rolls"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for VOID~FILL */}
                  {material.packagingMaterialType === 'VOID~FILL' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.voidFillType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillType', selectedValue)}
                          options={['Air Pillows', 'Paper Fill (Kraft)', 'Packing Peanuts', 'Bubble Wrap', 'Tissue/Newsprint']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.voidFillMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillMaterial', selectedValue)}
                          options={['HDPE (Air Pillows)', 'Kraft Paper', 'EPS (Peanuts)', 'PE (Bubble)', 'Recycled Paper']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      {/* Conditional fields for AIR PILLOW */}
                      {material.voidFillType === 'Air Pillows' && (
                        <>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">PILLOW SIZE</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <SearchableDropdown
                                value={material.voidFillPillowSize || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillPillowSize', selectedValue)}
                                options={['100x200mm', '200x200mm', '200x400mm']}
                                placeholder="Select or type"
                                style={{ paddingRight: '50px' }}
                              />
                              <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>CM</span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">FILL %</label>
                            <SearchableDropdown
                              value={material.voidFillFillPercent || ''}
                              onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillFillPercent', selectedValue)}
                              options={['80%', '90%', 'Full Inflation']}
                              placeholder="Select or type Fill %"
                            />
                          </div>
                        </>
                      )}
                      {/* Conditional fields for BUBBLE WRAP */}
                      {material.voidFillType === 'Bubble Wrap' && (
                        <>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">BUBBLE SIZE</label>
                            <SearchableDropdown
                              value={material.voidFillBubbleSize || ''}
                              onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillBubbleSize', selectedValue)}
                              options={['10mm (Small)', '25mm (Medium)', '30mm (Large)']}
                              placeholder="Select or type Bubble Size"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">LAYER</label>
                            <SearchableDropdown
                              value={material.voidFillLayer || ''}
                              onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillLayer', selectedValue)}
                              options={['Single', 'Double Layer']}
                              placeholder="Select or type Layer"
                            />
                          </div>
                        </>
                      )}
                      {/* Paper Type and Paper Weight - always visible */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PAPER TYPE</label>
                        <SearchableDropdown
                          value={material.voidFillPaperType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillPaperType', selectedValue)}
                          options={['Kraft', 'Newsprint', 'Tissue', 'Honeycomb']}
                          placeholder="Select or type Paper Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PAPER WEIGHT</label>
                        <SearchableDropdown
                          value={material.voidFillPaperWeight || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillPaperWeight', selectedValue)}
                          options={['30gsm', '40gsm', '50gsm', '70gsm']}
                          placeholder="Select or type Paper Weight"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOR</label>
                        <SearchableDropdown
                          value={material.voidFillColor || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillColor', selectedValue)}
                          options={['Clear', 'White', 'Kraft Brown', 'Pink (Anti-Static)']}
                          placeholder="Select or type Color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.voidFillQuantity || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'voidFillQuantity', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="100"
                          />
                          <select
                            value={material.voidFillQuantityUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'voidFillQuantityUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Specific Fields for DIVIDER */}
                  {material.packagingMaterialType === 'DIVIDER' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.dividerType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'dividerType', selectedValue)}
                          options={['Cell Divider (Grid)', 'Partition (Single)', 'Z-Fold', 'Layer Pad', 'Custom']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.dividerMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'dividerMaterial', selectedValue)}
                          options={['Corrugated Board (B/C/E Flute)', 'Solid Board', 'Chipboard', 'Plastic (PP)']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CELL CONFIGURATION</label>
                        <SearchableDropdown
                          value={material.dividerCellConfiguration || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'dividerCellConfiguration', selectedValue)}
                          options={['6-cell (2x3)', '8-cell (2x4)', '12-cell (3x4)', '24-cell (4x6)', 'Custom']}
                          placeholder="Select or type Cell Configuration"
                        />
                      </div>
                      {/* CELL SIZE - with LENGTH and WIDTH */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CELL SIZE</label>
                        <div className="flex items-end gap-4">
                          <div className="flex flex-col flex-1">
                            <label className="text-xs text-gray-600 mb-1">LENGTH</label>
                            <input
                              type="text"
                              value={material.dividerCellSizeLength || ''}
                              onChange={(e) => handlePackagingMaterialChange(materialIndex, 'dividerCellSizeLength', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Length"
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <label className="text-xs text-gray-600 mb-1">WIDTH</label>
                            <input
                              type="text"
                              value={material.dividerCellSizeWidth || ''}
                              onChange={(e) => handlePackagingMaterialChange(materialIndex, 'dividerCellSizeWidth', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Width"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-600 mb-1">UNIT</label>
                            <select
                              value={material.dividerCellSizeUnit || 'CM'}
                              onChange={(e) => handlePackagingMaterialChange(materialIndex, 'dividerCellSizeUnit', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                            >
                              <option value="CM">CM</option>
                              <option value="KGS">KGS</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {/* HEIGHT */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.dividerHeight || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'dividerHeight', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="50"
                          />
                          <select
                            value={material.dividerHeightUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'dividerHeightUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BOARD THICKNESS</label>
                        <SearchableDropdown
                          value={material.dividerBoardThickness || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'dividerBoardThickness', selectedValue)}
                          options={['2mm', '3mm (E-Flute)', '4mm (B-Flute)', '5mm (C-Flute)']}
                          placeholder="Select or type Board Thickness"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SLOT DEPTH</label>
                        <SearchableDropdown
                          value={material.dividerSlotDepth || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'dividerSlotDepth', selectedValue)}
                          options={['50%', '60%', '70% of divider height']}
                          placeholder="Select or type Slot Depth"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOR</label>
                        <SearchableDropdown
                          value={material.dividerColor || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'dividerColor', selectedValue)}
                          options={['Brown (Kraft)', 'White', 'Printed']}
                          placeholder="Select or type Color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <input
                          type="text"
                          value={material.dividerQuantity || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'dividerQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pcs"
                        />
                      </div>
                    </>
                  )}

                

                  {/* Specific Fields for TAPE */}
                  {material.packagingMaterialType === 'TAPE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.tapeType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeType', selectedValue)}
                          options={['BOPP Tape (Clear/Brown)', 'Printed Tape', 'Paper Tape (Kraft)', 'Masking Tape', 'Strapping Tape', 'Double-Sided']}
                          placeholder="Select or type Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.tapeMaterial || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeMaterial', selectedValue)}
                          options={['BOPP (Biaxially Oriented Polypropylene)', 'PVC', 'Paper (Kraft)', 'Cloth/Duct', 'Filament/Strapping']}
                          placeholder="Select or type Material"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GAUGE / THICKNESS</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                            value={material.tapeGaugeThickness || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeGaugeThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 60px 10px 14px', width: '100%', height: '44px' }}
                            placeholder="e.g., 40, 45, 50"
                          />
                          <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>Micron</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.tapeWidth || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeWidth', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="2"
                          />
                          <select
                            value={material.tapeWidthUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeWidthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.tapeLength || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeLength', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="100"
                          />
                          <select
                            value={material.tapeLengthUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeLengthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUMMING QUALITY</label>
                        <SearchableDropdown
                          value={material.tapeGummingQuality || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeGummingQuality', selectedValue)}
                          options={['Strong', 'Standard']}
                          placeholder="Select or type Gumming Quality"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <SearchableDropdown
                          value={material.tapeApplication || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeApplication', selectedValue)}
                          options={['6 WAYS', '6 WAYS +ROUND ABOUT', '6 WAYS Xtwice', '6 WAYS XTWICE + ROUND ABOUT', '6 WAYS +TOP & BOTTOM TWICE', '6 WAYS +TOP & BOTTOM TWICE + ROUND ABOUT']}
                          placeholder="Select or type Application"
                        />
                      </div>
                      {/* TESTING REQUIREMENTS - Multi-select with chips (SAME AS CARTON BOX) */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                        <div style={{ position: 'relative' }}>
                          <div
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-indigo-500 focus-within:outline-none"
                            style={{ 
                              padding: '8px 12px',
                              minHeight: '44px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                              alignItems: 'center',
                              cursor: 'text'
                            }}
                          >
                            {/* Selected chips */}
                            {(Array.isArray(material.tapeTestingRequirements) ? material.tapeTestingRequirements : []).map((req, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                                style={{
                                  backgroundColor: '#e0e7ff',
                                  color: '#4338ca',
                                  border: '1px solid #c7d2fe'
                                }}
                              >
                                {req}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const current = Array.isArray(material.tapeTestingRequirements) ? material.tapeTestingRequirements : [];
                                    const updated = current.filter((_, i) => i !== index);
                                    handlePackagingMaterialChange(materialIndex, 'tapeTestingRequirements', updated);
                                  }}
                                  style={{
                                    marginLeft: '4px',
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    color: '#4338ca',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    lineHeight: '1',
                                    padding: 0,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '16px',
                                    height: '16px'
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            {/* Dropdown for selecting new options */}
                            <div 
                              id={`tape-testing-wrapper-${materialIndex}`}
                              style={{ flex: 1, minWidth: '200px' }}
                            >
                              <SearchableDropdown
                                value=""
                                strictMode={false}
                                onChange={(selectedValue) => {
                                  const options = ['Adhesion Test', 'Tensile Strength', 'Elongation'];
                                  if (selectedValue && options.includes(selectedValue)) {
                                    const current = Array.isArray(material.tapeTestingRequirements) ? material.tapeTestingRequirements : [];
                                    if (!current.includes(selectedValue)) {
                                      const updated = [...current, selectedValue];
                                      handlePackagingMaterialChange(materialIndex, 'tapeTestingRequirements', updated);
                                    }
                                  }
                                }}
                                options={['Adhesion Test', 'Tensile Strength', 'Elongation']}
                                placeholder={(Array.isArray(material.tapeTestingRequirements) && material.tapeTestingRequirements.length === 0) ? "Select testing requirements" : "Add more..."}
                                className="border-0 outline-none"
                                style={{ 
                                  padding: '4px 0', 
                                  height: 'auto', 
                                  minHeight: '32px',
                                  backgroundColor: 'transparent', 
                                  boxShadow: 'none',
                                  border: 'none',
                                  borderWidth: '0',
                                  outline: 'none'
                                }}
                                onFocus={(e) => {
                                  const input = e.target;
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#667eea';
                                    container.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                  }
                                  const handleKeyDown = (keyEvent) => {
                                    if (keyEvent.key === 'Enter' && input.value && input.value.trim()) {
                                      keyEvent.preventDefault();
                                      keyEvent.stopPropagation();
                                      const newValue = input.value.trim();
                                      const current = Array.isArray(material.tapeTestingRequirements) ? material.tapeTestingRequirements : [];
                                      const options = ['Adhesion Test', 'Tensile Strength', 'Elongation'];
                                      if (!current.includes(newValue)) {
                                        if (!options.includes(newValue)) {
                                          const updated = [...current, newValue];
                                          handlePackagingMaterialChange(materialIndex, 'tapeTestingRequirements', updated);
                                        }
                                        input.value = '';
                                        input.blur();
                                      }
                                    }
                                  };
                                  input.addEventListener('keydown', handleKeyDown);
                                  input._enterHandler = handleKeyDown;
                                }}
                                onBlur={(e) => {
                                  const input = e.target;
                                  if (input._enterHandler) {
                                    input.removeEventListener('keydown', input._enterHandler);
                                    input._enterHandler = null;
                                  }
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#e5e7eb';
                                    container.style.boxShadow = 'none';
                                  }
                                  if (input.value && input.value.trim()) {
                                    const typedValue = input.value.trim();
                                    const options = ['Adhesion Test', 'Tensile Strength', 'Elongation'];
                                    if (!options.includes(typedValue)) {
                                      const current = Array.isArray(material.tapeTestingRequirements) ? material.tapeTestingRequirements : [];
                                      if (!current.includes(typedValue)) {
                                        const updated = [...current, typedValue];
                                        handlePackagingMaterialChange(materialIndex, 'tapeTestingRequirements', updated);
                                      }
                                    }
                                    input.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QUANTITY</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.tapeQuantity || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeQuantity', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="100"
                          />
                          <select
                            value={material.tapeQuantityUnit || 'CM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeQuantityUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="CM">CM</option>
                            <option value="KGS">KGS</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PRINTING REF with UPLOAD for POLY BAG WITH FLAP */}
                  {material.packagingMaterialType === 'POLY BAG WITH FLAP' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING REF</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'printingRef', e.target.files[0])}
                          className="hidden"
                          id={`pkg-file-${materialIndex}`}
                        />
                        <label
                          htmlFor={`pkg-file-${materialIndex}`}
                          className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                          style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="truncate">{material.printingRef ? 'DONE' : 'UPLOAD'}</span>
                        </label>
                      </div>
                    </div>
                  )}

                  

                

                  {/* Surplus & For Section - Special handling for CARTON BOX, CORNER PROTECTORS, EDGE PROTECTORS, FOAM INSERT, PALLET STRAP, POLYBAG~Bale, POLYBAG~POLYBAG-FLAP, SILICA GEL DESICCANT, STRETCH~WRAP, TAPE, VOID~FILL, and DIVIDER with absolute % signs */}
                  {(material.packagingMaterialType === 'CARTON BOX' || material.packagingMaterialType === 'CORNER PROTECTORS' || material.packagingMaterialType === 'EDGE PROTECTORS' || material.packagingMaterialType === 'FOAM INSERT' || material.packagingMaterialType === 'PALLET STRAP' || material.packagingMaterialType === 'POLYBAG~Bale' || material.packagingMaterialType === 'POLYBAG~POLYBAG-FLAP' || material.packagingMaterialType === 'SILICA GEL DESICCANT' || material.packagingMaterialType === 'STRETCH~WRAP' || material.packagingMaterialType === 'TAPE' || material.packagingMaterialType === 'VOID~FILL' || material.packagingMaterialType === 'DIVIDER') ? (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={
                                material.packagingMaterialType === 'CARTON BOX' ? (material.cartonBoxSurplus || '') :
                                material.packagingMaterialType === 'CORNER PROTECTORS' ? (material.cornerProtectorSurplus || '') :
                                material.packagingMaterialType === 'EDGE PROTECTORS' ? (material.edgeProtectorSurplus || '') :
                                material.packagingMaterialType === 'FOAM INSERT' ? (material.foamInsertSurplus || '') :
                                material.packagingMaterialType === 'PALLET STRAP' ? (material.palletStrapSurplus || '') :
                                material.packagingMaterialType === 'POLYBAG~Bale' ? (material.polybagBaleSurplus || '') :
                                material.packagingMaterialType === 'POLYBAG~POLYBAG-FLAP' ? (material.polybagPolybagFlapSurplus || '') :
                                material.packagingMaterialType === 'SILICA GEL DESICCANT' ? (material.silicaGelDesiccantSurplus || '') :
                                material.packagingMaterialType === 'STRETCH~WRAP' ? (material.stretchWrapSurplus || '') :
                                material.packagingMaterialType === 'TAPE' ? (material.tapeSurplus || '') :
                                material.packagingMaterialType === 'VOID~FILL' ? (material.voidFillSurplus || '') :
                                (material.dividerSurplus || '')
                              }
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                if (material.packagingMaterialType === 'CARTON BOX') {
                                  handlePackagingMaterialChange(materialIndex, 'cartonBoxSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'CORNER PROTECTORS') {
                                  handlePackagingMaterialChange(materialIndex, 'cornerProtectorSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'EDGE PROTECTORS') {
                                  handlePackagingMaterialChange(materialIndex, 'edgeProtectorSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'FOAM INSERT') {
                                  handlePackagingMaterialChange(materialIndex, 'foamInsertSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'PALLET STRAP') {
                                  handlePackagingMaterialChange(materialIndex, 'palletStrapSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'POLYBAG~Bale') {
                                  handlePackagingMaterialChange(materialIndex, 'polybagBaleSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'POLYBAG~POLYBAG-FLAP') {
                                  handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'SILICA GEL DESICCANT') {
                                  handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'STRETCH~WRAP') {
                                  handlePackagingMaterialChange(materialIndex, 'stretchWrapSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'TAPE') {
                                  handlePackagingMaterialChange(materialIndex, 'tapeSurplus', numericValue);
                                } else if (material.packagingMaterialType === 'VOID~FILL') {
                                  handlePackagingMaterialChange(materialIndex, 'voidFillSurplus', numericValue);
                                } else {
                                  handlePackagingMaterialChange(materialIndex, 'dividerSurplus', numericValue);
                                }
                              }}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                              placeholder=""
                            />
                            <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                          </div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={
                                material.packagingMaterialType === 'CARTON BOX' ? (material.cartonBoxWastage || '') :
                                material.packagingMaterialType === 'CORNER PROTECTORS' ? (material.cornerProtectorWastage || '') :
                                material.packagingMaterialType === 'EDGE PROTECTORS' ? (material.edgeProtectorWastage || '') :
                                material.packagingMaterialType === 'FOAM INSERT' ? (material.foamInsertWastage || '') :
                                material.packagingMaterialType === 'PALLET STRAP' ? (material.palletStrapWastage || '') :
                                material.packagingMaterialType === 'POLYBAG~Bale' ? (material.polybagBaleWastage || '') :
                                material.packagingMaterialType === 'POLYBAG~POLYBAG-FLAP' ? (material.polybagPolybagFlapWastage || '') :
                                material.packagingMaterialType === 'SILICA GEL DESICCANT' ? (material.silicaGelDesiccantWastage || '') :
                                material.packagingMaterialType === 'STRETCH~WRAP' ? (material.stretchWrapWastage || '') :
                                material.packagingMaterialType === 'TAPE' ? (material.tapeWastage || '') :
                                material.packagingMaterialType === 'VOID~FILL' ? (material.voidFillWastage || '') :
                                (material.dividerWastage || '')
                              }
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                if (material.packagingMaterialType === 'CARTON BOX') {
                                  handlePackagingMaterialChange(materialIndex, 'cartonBoxWastage', numericValue);
                                } else if (material.packagingMaterialType === 'CORNER PROTECTORS') {
                                  handlePackagingMaterialChange(materialIndex, 'cornerProtectorWastage', numericValue);
                                } else if (material.packagingMaterialType === 'EDGE PROTECTORS') {
                                  handlePackagingMaterialChange(materialIndex, 'edgeProtectorWastage', numericValue);
                                } else if (material.packagingMaterialType === 'FOAM INSERT') {
                                  handlePackagingMaterialChange(materialIndex, 'foamInsertWastage', numericValue);
                                } else if (material.packagingMaterialType === 'PALLET STRAP') {
                                  handlePackagingMaterialChange(materialIndex, 'palletStrapWastage', numericValue);
                                } else if (material.packagingMaterialType === 'POLYBAG~Bale') {
                                  handlePackagingMaterialChange(materialIndex, 'polybagBaleWastage', numericValue);
                                } else if (material.packagingMaterialType === 'POLYBAG~POLYBAG-FLAP') {
                                  handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapWastage', numericValue);
                                } else if (material.packagingMaterialType === 'SILICA GEL DESICCANT') {
                                  handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantWastage', numericValue);
                                } else if (material.packagingMaterialType === 'STRETCH~WRAP') {
                                  handlePackagingMaterialChange(materialIndex, 'stretchWrapWastage', numericValue);
                                } else if (material.packagingMaterialType === 'TAPE') {
                                  handlePackagingMaterialChange(materialIndex, 'tapeWastage', numericValue);
                                } else if (material.packagingMaterialType === 'VOID~FILL') {
                                  handlePackagingMaterialChange(materialIndex, 'voidFillWastage', numericValue);
                                } else {
                                  handlePackagingMaterialChange(materialIndex, 'dividerWastage', numericValue);
                                }
                              }}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                              placeholder=""
                            />
                            <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                      <input
                        type="text"
                        value={material.surplus || ''}
                        onChange={(e) => handlePackagingMaterialChange(materialIndex, 'surplus', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                        placeholder="%AGE"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                      <input
                        type="text"
                        value={material.surplusForSection || ''}
                        onChange={(e) => handlePackagingMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                        placeholder="FOR"
                      />
                    </div>
                  </div>
                  )}

                  {/* Approval Against - Special handling for CARTON BOX, CORNER PROTECTORS, EDGE PROTECTORS, FOAM INSERT, PALLET STRAP, POLYBAG~Bale, POLYBAG~POLYBAG-FLAP, SILICA GEL DESICCANT, STRETCH~WRAP, TAPE, VOID~FILL, and DIVIDER */}
                  {material.packagingMaterialType === 'CARTON BOX' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.cartonBoxApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxApproval', selectedValue)}
                        options={['SELF', "BUYER'S", 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'CORNER PROTECTORS' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.cornerProtectorApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorApproval', selectedValue)}
                        options={["BUYER'S", 'QA Approval', 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'EDGE PROTECTORS' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.edgeProtectorApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorApproval', selectedValue)}
                        options={["BUYER'S", 'QA Approval', 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'FOAM INSERT' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.foamInsertApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertApproval', selectedValue)}
                        options={["BUYER'S", 'QA Approval', 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'PALLET STRAP' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.palletStrapApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapApproval', selectedValue)}
                        options={["BUYER'S", 'Logistics Approval', 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'POLYBAG~Bale' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.polybagBaleApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBaleApproval', selectedValue)}
                        options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'POLYBAG~POLYBAG-FLAP' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.polybagPolybagFlapApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapApproval', selectedValue)}
                        options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'SILICA GEL DESICCANT' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.silicaGelDesiccantApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantApproval', selectedValue)}
                        options={["BUYER'S", 'QA Approval', 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'STRETCH~WRAP' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.stretchWrapApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapApproval', selectedValue)}
                        options={["BUYER'S", 'Logistics Approval', 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'TAPE' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.tapeApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeApproval', selectedValue)}
                        options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'VOID~FILL' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.voidFillApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'voidFillApproval', selectedValue)}
                        options={["BUYER'S", 'QA Approval', 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : material.packagingMaterialType === 'DIVIDER' ? (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                      <SearchableDropdown
                        value={material.dividerApproval || ''}
                        onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'dividerApproval', selectedValue)}
                        options={["BUYER'S", 'QA Approval', 'INITIAL', 'PP SAMPLE']}
                        placeholder="Select or type Approval"
                      />
                    </div>
                  ) : (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL AGAINST</label>
                    <SearchableDropdown
                      value={material.approvalAgainst || ''}
                      onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'approvalAgainst', selectedValue)}
                      options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                      placeholder="Select or type Approval Against"
                    />
                  </div>
                  )}

                  {/* Remarks - For all types */}
                  <div className="col-span-full flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                    <textarea
                      value={material.remarks || ''}
                      onChange={(e) => handlePackagingMaterialChange(materialIndex, 'remarks', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '100%' }}
                      rows="2"
                      placeholder="Additional notes..."
                    ></textarea>
                  </div>

                  {/* FOAM INSERT - Advance Data Button and Fields */}
                  {material.packagingMaterialType === 'FOAM INSERT' && (
                    <div className="col-span-full w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handlePackagingMaterialChange(materialIndex, 'showFoamInsertAdvancedData', !material.showFoamInsertAdvancedData)}
                        style={{
                          backgroundColor: material.showFoamInsertAdvancedData ? '#667eea' : '#ffffff',
                          borderColor: material.showFoamInsertAdvancedData ? '#667eea' : '#e5e7eb',
                          color: material.showFoamInsertAdvancedData ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showFoamInsertAdvancedData ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showFoamInsertAdvancedData) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showFoamInsertAdvancedData) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showFoamInsertAdvancedData ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showFoamInsertAdvancedData && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CAVITY/CUT-OUT</label>
                              <SearchableDropdown
                                value={material.foamInsertCavityCutout || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertCavityCutout', selectedValue)}
                                options={['Single Cavity', 'Multi-Cavity', 'Through-Cut', 'Partial Cut']}
                                placeholder="Select or type Cavity/Cut-out"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-STATIC</label>
                              <SearchableDropdown
                                value={material.foamInsertAntiStatic || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertAntiStatic', selectedValue)}
                                options={['Standard', 'Anti-Static (Pink/Black)']}
                                placeholder="Select or type Anti-Static"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">LAMINATION</label>
                              <SearchableDropdown
                                value={material.foamInsertLamination || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'foamInsertLamination', selectedValue)}
                                options={['None', 'PE Film', 'Fabric', 'Foil']}
                                placeholder="Select or type Lamination"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                  </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PALLET STRAP - Advance Data Button and Fields */}
                  {material.packagingMaterialType === 'PALLET STRAP' && (
                    <div className="col-span-full w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handlePackagingMaterialChange(materialIndex, 'showPalletStrapAdvancedData', !material.showPalletStrapAdvancedData)}
                        style={{
                          backgroundColor: material.showPalletStrapAdvancedData ? '#667eea' : '#ffffff',
                          borderColor: material.showPalletStrapAdvancedData ? '#667eea' : '#e5e7eb',
                          color: material.showPalletStrapAdvancedData ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showPalletStrapAdvancedData ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showPalletStrapAdvancedData) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showPalletStrapAdvancedData) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showPalletStrapAdvancedData ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showPalletStrapAdvancedData && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                              <SearchableDropdown
                                value={material.palletStrapTensileStrength || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapTensileStrength', selectedValue)}
                                options={['150 kg', '200 kg', '250 kg', '300 kg', '400 kg', '500 kg+']}
                                placeholder="Select or type Tensile Strength"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CORE SIZE</label>
                              <SearchableDropdown
                                value={material.palletStrapCoreSize || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'palletStrapCoreSize', selectedValue)}
                                options={['200mm', '400mm', '406mm (16")']}
                                placeholder="Select or type Core Size"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* POLYBAG~Bale - Advance Data Button and Fields */}
                  {material.packagingMaterialType === 'POLYBAG~Bale' && (
                    <div className="col-span-full w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handlePackagingMaterialChange(materialIndex, 'showPolybagBaleAdvancedData', !material.showPolybagBaleAdvancedData)}
                        style={{
                          backgroundColor: material.showPolybagBaleAdvancedData ? '#667eea' : '#ffffff',
                          borderColor: material.showPolybagBaleAdvancedData ? '#667eea' : '#e5e7eb',
                          color: material.showPolybagBaleAdvancedData ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showPolybagBaleAdvancedData ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showPolybagBaleAdvancedData) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showPolybagBaleAdvancedData) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showPolybagBaleAdvancedData ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showPolybagBaleAdvancedData && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagBaleArtworkSpec', e.target.files[0])}
                                  className="hidden"
                                  id={`polybag-bale-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`polybag-bale-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                                  style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.polybagBaleArtworkSpec ? 'DONE' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING</label>
                              <SearchableDropdown
                                value={material.polybagBalePrinting || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBalePrinting', selectedValue)}
                                options={['Plain/Unprinted', '1-2 Color Printed', 'Repeating Logo']}
                                placeholder="Select or type Printing"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CORE SIZE</label>
                              <SearchableDropdown
                                value={material.polybagBaleCoreSize || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBaleCoreSize', selectedValue)}
                                options={['3" core', '6" core']}
                                placeholder="Select or type Core Size"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PERFORATION</label>
                              <SearchableDropdown
                                value={material.polybagBalePerforation || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBalePerforation', selectedValue)}
                                options={['None', 'Perforated at intervals', 'Easy-Tear Perforation']}
                                placeholder="Select or type Perforation"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CLING/TACK</label>
                              <SearchableDropdown
                                value={material.polybagBaleClingTack || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBaleClingTack', selectedValue)}
                                options={['Standard', 'High Cling (stretch wrap)', 'Low Cling']}
                                placeholder="Select or type Cling/Tack"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">UV STABILIZED</label>
                              <SearchableDropdown
                                value={material.polybagBaleUvStabilized || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBaleUvStabilized', selectedValue)}
                                options={['Standard', 'UV Stabilized (outdoor storage)']}
                                placeholder="Select or type UV Stabilized"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-STATIC</label>
                              <SearchableDropdown
                                value={material.polybagBaleAntiStatic || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagBaleAntiStatic', selectedValue)}
                                options={['Standard', 'Anti-Static']}
                                placeholder="Select or type Anti-Static"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* POLYBAG~POLYBAG-FLAP - Advance Data Button and Fields */}
                  {material.packagingMaterialType === 'POLYBAG~POLYBAG-FLAP' && (
                    <div className="col-span-full w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handlePackagingMaterialChange(materialIndex, 'showPolybagPolybagFlapAdvancedData', !material.showPolybagPolybagFlapAdvancedData)}
                        style={{
                          backgroundColor: material.showPolybagPolybagFlapAdvancedData ? '#667eea' : '#ffffff',
                          borderColor: material.showPolybagPolybagFlapAdvancedData ? '#667eea' : '#e5e7eb',
                          color: material.showPolybagPolybagFlapAdvancedData ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showPolybagPolybagFlapAdvancedData ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showPolybagPolybagFlapAdvancedData) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showPolybagPolybagFlapAdvancedData) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showPolybagPolybagFlapAdvancedData ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showPolybagPolybagFlapAdvancedData && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">SEAL TYPE</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapSealType || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapSealType', selectedValue)}
                                options={['Open Top (unsealed)', 'Heat Seal', 'Adhesive Seal', 'Zip Lock', 'Drawstring']}
                                placeholder="Select or type Seal Type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">VENT HOLES</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapVentHoles || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapVentHoles', selectedValue)}
                                options={['None', 'Single Hole', 'Multiple Holes', 'Perforated']}
                                placeholder="Select or type Vent Holes"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">SUFFOCATION WARNING</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapSuffocationWarning || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapSuffocationWarning', selectedValue)}
                                options={['Required (printed warning text per ASTM D3951)', 'Not Required']}
                                placeholder="Select or type Suffocation Warning"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapArtworkSpec', e.target.files[0])}
                                  className="hidden"
                                  id={`polybag-polybag-flap-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`polybag-polybag-flap-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                                  style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.polybagPolybagFlapArtworkSpec ? 'DONE' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapPrinting || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapPrinting', selectedValue)}
                                options={['Plain/Unprinted', '1 Color', '2 Color', 'Full Color']}
                                placeholder="Select or type Printing"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINT COLOUR</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapPrintColour || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapPrintColour', selectedValue)}
                                options={['Black', 'White', 'Pantone', 'Custom']}
                                placeholder="Select or type Print Colour"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINT POSITION</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapPrintPosition', e.target.files[0])}
                                  className="hidden"
                                  id={`polybag-polybag-flap-print-position-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`polybag-polybag-flap-print-position-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                                  style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.polybagPolybagFlapPrintPosition ? 'DONE' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-STATIC</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapAntiStatic || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapAntiStatic', selectedValue)}
                                options={['Standard', 'Anti-Static (ESD Safe)']}
                                placeholder="Select or type Anti-Static"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FOOD GRADE</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapFoodGrade || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapFoodGrade', selectedValue)}
                                options={['Standard', 'FDA Approved Food Grade']}
                                placeholder="Select or type Food Grade"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">RECYCLABLE</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapRecyclable || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapRecyclable', selectedValue)}
                                options={['Standard', 'Recyclable Symbol Printed', 'Compostable']}
                                placeholder="Select or type Recyclable"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CLARITY</label>
                              <SearchableDropdown
                                value={material.polybagPolybagFlapClarity || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'polybagPolybagFlapClarity', selectedValue)}
                                options={['Clear', 'Frosted/Matte', 'Opaque White', 'Opaque Black', 'Tinted']}
                                placeholder="Select or type Clarity"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SILICA GEL DESICCANT - Advance Data Button and Fields */}
                  {material.packagingMaterialType === 'SILICA GEL DESICCANT' && (
                    <div className="col-span-full w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handlePackagingMaterialChange(materialIndex, 'showSilicaGelDesiccantAdvancedData', !material.showSilicaGelDesiccantAdvancedData)}
                        style={{
                          backgroundColor: material.showSilicaGelDesiccantAdvancedData ? '#667eea' : '#ffffff',
                          borderColor: material.showSilicaGelDesiccantAdvancedData ? '#667eea' : '#e5e7eb',
                          color: material.showSilicaGelDesiccantAdvancedData ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showSilicaGelDesiccantAdvancedData ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showSilicaGelDesiccantAdvancedData) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showSilicaGelDesiccantAdvancedData) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showSilicaGelDesiccantAdvancedData ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showSilicaGelDesiccantAdvancedData && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ABSORPTION CAPACITY</label>
                              <SearchableDropdown
                                value={material.silicaGelDesiccantAbsorptionCapacity || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantAbsorptionCapacity', selectedValue)}
                                options={['20% of own weight', '30% of own weight', '40% of own weight']}
                                placeholder="Select or type Absorption Capacity"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">INDICATING TYPE</label>
                              <SearchableDropdown
                                value={material.silicaGelDesiccantIndicatingType || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantIndicatingType', selectedValue)}
                                options={['Non-Indicating', 'Blue (Cobalt)', 'Orange (Cobalt-free)']}
                                placeholder="Select or type Indicating Type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PACKET MATERIAL</label>
                              <SearchableDropdown
                                value={material.silicaGelDesiccantPacketMaterial || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantPacketMaterial', selectedValue)}
                                options={['Tyvek', 'Non-Woven', 'Cotton Paper', 'OPP Film']}
                                placeholder="Select or type Packet Material"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PACKET SIZE</label>
                              <SearchableDropdown
                                value={material.silicaGelDesiccantPacketSize || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantPacketSize', selectedValue)}
                                options={['25x35mm', '30x50mm', '50x70mm', 'Custom']}
                                placeholder="Select or type Packet Size"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FOOD SAFE</label>
                              <SearchableDropdown
                                value={material.silicaGelDesiccantFoodSafe || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'silicaGelDesiccantFoodSafe', selectedValue)}
                                options={['FDA Compliant', 'Food Contact Safe']}
                                placeholder="Select or type Food Safe"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STRETCH~WRAP - Advance Data Button and Fields */}
                  {material.packagingMaterialType === 'STRETCH~WRAP' && (
                    <div className="col-span-full w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handlePackagingMaterialChange(materialIndex, 'showStretchWrapAdvancedData', !material.showStretchWrapAdvancedData)}
                        style={{
                          backgroundColor: material.showStretchWrapAdvancedData ? '#667eea' : '#ffffff',
                          borderColor: material.showStretchWrapAdvancedData ? '#667eea' : '#e5e7eb',
                          color: material.showStretchWrapAdvancedData ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showStretchWrapAdvancedData ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showStretchWrapAdvancedData) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showStretchWrapAdvancedData) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showStretchWrapAdvancedData ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showStretchWrapAdvancedData && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH %</label>
                              <SearchableDropdown
                                value={material.stretchWrapStretchPercent || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapStretchPercent', selectedValue)}
                                options={['100%', '150%', '200%', '250%', '300%']}
                                placeholder="Select or type Stretch %"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CORE SIZE</label>
                              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <SearchableDropdown
                                  value={material.stretchWrapCoreSize || ''}
                                  onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapCoreSize', selectedValue)}
                                  options={['38mm', '50mm (hand)', '76mm (machine)']}
                                  placeholder="Select or type"
                                  style={{ paddingRight: '50px' }}
                                />
                                <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>CM</span>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">UV STABILIZED</label>
                              <SearchableDropdown
                                value={material.stretchWrapUvStabilized || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapUvStabilized', selectedValue)}
                                options={['Standard', 'UV Protected']}
                                placeholder="Select or type UV Stabilized"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">VCI (Anti-Corrosion)</label>
                              <SearchableDropdown
                                value={material.stretchWrapVci || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'stretchWrapVci', selectedValue)}
                                options={['Standard', 'VCI Film']}
                                placeholder="Select or type VCI (Anti-Corrosion)"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAPE - Advance Data Button and Fields */}
                  {material.packagingMaterialType === 'TAPE' && (
                    <div className="col-span-full w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handlePackagingMaterialChange(materialIndex, 'showTapeAdvancedData', !material.showTapeAdvancedData)}
                        style={{
                          backgroundColor: material.showTapeAdvancedData ? '#667eea' : '#ffffff',
                          borderColor: material.showTapeAdvancedData ? '#667eea' : '#e5e7eb',
                          color: material.showTapeAdvancedData ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showTapeAdvancedData ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showTapeAdvancedData) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showTapeAdvancedData) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showTapeAdvancedData ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showTapeAdvancedData && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                              <SearchableDropdown
                                value={material.tapeColour || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeColour', selectedValue)}
                                options={['Clear/Transparent', 'Brown/Tan', 'White', 'Black', 'Custom Color']}
                                placeholder="Select or type Colour"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE TYPE</label>
                              <SearchableDropdown
                                value={material.tapeAdhesiveType || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeAdhesiveType', selectedValue)}
                                options={['Acrylic (general)', 'Hot Melt (strong)', 'Solvent/Rubber (economy)', 'Water-Activated (paper)']}
                                placeholder="Select or type Adhesive Type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeArtworkSpec', e.target.files[0])}
                                  className="hidden"
                                  id={`tape-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`tape-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                                  style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.tapeArtworkSpec ? 'DONE' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING</label>
                              <SearchableDropdown
                                value={material.tapePrinting || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapePrinting', selectedValue)}
                                options={['Plain/Unprinted', '1 Color', '2 Color', 'Full Color']}
                                placeholder="Select or type Printing"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINT REPEAT</label>
                              <SearchableDropdown
                                value={material.tapePrintRepeat || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapePrintRepeat', selectedValue)}
                                options={['Continuous repeat distance (e.g., every 6 inches)']}
                                placeholder="Select or type Print Repeat"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CORE SIZE</label>
                              <SearchableDropdown
                                value={material.tapeCoreSize || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeCoreSize', selectedValue)}
                                options={['3" core', '1" core', '1.5" core', 'Custom']}
                                placeholder="Select or type Core Size"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">NOISE LEVEL</label>
                              <SearchableDropdown
                                value={material.tapeNoiseLevel || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeNoiseLevel', selectedValue)}
                                options={['Standard (noisy)', 'Low Noise/Quiet']}
                                placeholder="Select or type Noise Level"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">TEMPERATURE RANGE</label>
                              <SearchableDropdown
                                value={material.tapeTemperatureRange || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'tapeTemperatureRange', selectedValue)}
                                options={['Standard', 'Cold Temperature', 'High Temperature']}
                                placeholder="Select or type Temperature Range"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CARTON BOX - Advance Spec Button and Fields */}
                  {material.packagingMaterialType === 'CARTON BOX' && (
                    <div className="col-span-full w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handlePackagingMaterialChange(materialIndex, 'showCartonBoxAdvancedSpec', !material.showCartonBoxAdvancedSpec)}
                        style={{
                          backgroundColor: material.showCartonBoxAdvancedSpec ? '#667eea' : '#ffffff',
                          borderColor: material.showCartonBoxAdvancedSpec ? '#667eea' : '#e5e7eb',
                          color: material.showCartonBoxAdvancedSpec ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showCartonBoxAdvancedSpec ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showCartonBoxAdvancedSpec) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showCartonBoxAdvancedSpec) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showCartonBoxAdvancedSpec ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showCartonBoxAdvancedSpec && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cartonBoxArtworkSpec', e.target.files[0])}
                                  className="hidden"
                                  id={`carton-box-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`carton-box-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                                  style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.cartonBoxArtworkSpec ? 'DONE' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PAPER GSM</label>
                              <SearchableDropdown
                                value={material.cartonBoxPaperGsm || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxPaperGsm', selectedValue)}
                                options={['150/120/180 GSM', '180/150/200 GSM', '200/150/250 GSM']}
                                placeholder="Select or type Paper GSM"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FLUTE TYPE</label>
                              <SearchableDropdown
                                value={material.cartonBoxFluteType || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxFluteType', selectedValue)}
                                options={['A Flute (5mm)', 'B Flute (3mm)', 'C Flute (4mm)', 'E Flute (1.5mm)', 'F Flute (0.8mm)', 'BC Double Wall', 'EB Double Wall']}
                                placeholder="Select or type Flute Type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ECT (Edge Crush Test)</label>
                              <SearchableDropdown
                                value={material.cartonBoxEct || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxEct', selectedValue)}
                                options={['32 ECT', '44 ECT', '48 ECT', '52 ECT']}
                                placeholder="Select or type ECT"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING</label>
                              <SearchableDropdown
                                value={material.cartonBoxPrinting || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxPrinting', selectedValue)}
                                options={['Plain/Unprinted', '1 Color', '2 Color', 'Full Color (Flexo/Litho Laminated)']}
                                placeholder="Select or type Printing"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINT CONTENT</label>
                              <SearchableDropdown
                                value={material.cartonBoxPrintContent || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxPrintContent', selectedValue)}
                                options={['Shipping Marks', 'Brand Logo', 'Handling Instructions', 'Barcode']}
                                placeholder="Select or type Print Content"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PRINT COLOUR</label>
                              <SearchableDropdown
                                value={material.cartonBoxPrintColour || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxPrintColour', selectedValue)}
                                options={['Black', 'Blue', 'Red', 'Pantone', 'Process (CMYK)']}
                                placeholder="Select or type Print Colour"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">COATING/TREATMENT</label>
                              <SearchableDropdown
                                value={material.cartonBoxCoatingTreatment || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxCoatingTreatment', selectedValue)}
                                options={['None', 'Wax Coated (moisture)', 'PE Laminated', 'Water Resistant']}
                                placeholder="Select or type Coating/Treatment"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">HAND HOLES</label>
                              <SearchableDropdown
                                value={material.cartonBoxHandHoles || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxHandHoles', selectedValue)}
                                options={['None', 'Punched Hand Holes', 'Die-Cut Hand Holes']}
                                placeholder="Select or type Hand Holes"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
                              <SearchableDropdown
                                value={material.cartonBoxCertification || ''}
                                onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'cartonBoxCertification', selectedValue)}
                                options={['FSC Certified', 'ISO Certified', 'None']}
                                placeholder="Select or type Certification"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-8">
            No packaging materials added yet.
          </div>
        )}
        
        {/* Add Material Button at Bottom */}
        <div className="mt-6 pt-6 border-t border-gray-200" style={{ marginTop: '24px', paddingTop: '24px' }}>
          <p className="text-sm text-gray-600 mb-3">Would you like to add more materials?</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const currentLength = formData.packaging?.materials?.length || 0;
              addPackagingMaterial();
              const newIndex = currentLength;
              const attemptScroll = (attempts = 0) => {
                if (attempts > 30) return;
                const element = document.getElementById(`packaging-material-${newIndex}`);
                if (element) {
                  setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 150);
                } else {
                  setTimeout(() => attemptScroll(attempts + 1), 50);
                }
              };
              attemptScroll();
            }}
          >
            + Add Material
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step5;
