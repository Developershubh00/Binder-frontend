import { useEffect, useRef } from 'react';
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
            <input
              type="text"
              value={formData.packaging.productSelection}
              onChange={(e) => handlePackagingChange('productSelection', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
              style={{ padding: '10px 14px', height: '44px' }}
              placeholder="e.g., COMFORTER+PILLOW+BAG"
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
                <input
                  type="text"
                    value={material.components}
                    onChange={(e) => handlePackagingMaterialChange(materialIndex, 'components', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                    placeholder="e.g., N/A"
                  />
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL DESCRIPTION</label>
                <input
                  type="text"
                    value={material.product}
                    onChange={(e) => handlePackagingMaterialChange(materialIndex, 'product', e.target.value)}
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
                    <option value="Pc">Pc</option>
                    <option value="Set">Set</option>
                    <option value="Roll">Roll</option>
                    <option value="Kgs">Kgs</option>
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
                    placeholder="PACKAGING"
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
                      <option value="CMS">CMS</option>
                      <option value="INCHES">INCHES</option>
                      <option value="MM">MM</option>
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
                  options={['CARTONS/CORRUGATED BOX', 'CARTON BOX', 'CORNER PROTECTORS', 'EDGE PROTECTORS', 'DIVIDER', 'PACKAGING ACCESSORIES', 'TAPE', 'POLYBAG', 'POLY BAG WITH FLAP', 'POLYSHEET', 'BALE WRAP', 'OTHER']}
                  placeholder="Select or type Material Type"
                  style={{ width: '280px' }}
                />
              </div>

              {material.packagingMaterialType && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
                  {/* Specific Fields for CARTONS/CORRUGATED BOX */}
                  {material.packagingMaterialType === 'CARTONS/CORRUGATED BOX' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">NO. OF PLYS</label>
                        <SearchableDropdown
                          value={material.noOfPlys || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'noOfPlys', selectedValue)}
                          options={['5 PLY', '7 PLY']}
                          placeholder="Select or type No. of Plys"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">JOINT TYPE</label>
                        <SearchableDropdown
                          value={material.jointType || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'jointType', selectedValue)}
                          options={['STAPLE', 'BINDED']}
                          placeholder="Select or type Joint Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BURSTING STRENGTH</label>
                        <input
                          type="text"
                          value={material.burstingStrength || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'burstingStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="175 LBS"
                        />
                      </div>
                    </>
                  )}

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
                            value={material.cartonBoxDimensionsUnit || 'CMS'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cartonBoxDimensionsUnit', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                          >
                            <option value="CMS">CMS</option>
                            <option value="INCHES">INCHES</option>
                            <option value="MM">MM</option>
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
                            value={material.cornerProtectorLegLengthUnit || 'MM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorLegLengthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="MM">MM</option>
                            <option value="CMS">CMS</option>
                            <option value="INCHES">INCHES</option>
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
                            value={material.cornerProtectorThicknessUnit || 'MM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorThicknessUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="MM">MM</option>
                            <option value="CMS">CMS</option>
                            <option value="INCHES">INCHES</option>
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
                            value={material.cornerProtectorHeightLengthUnit || 'MM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'cornerProtectorHeightLengthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="MM">MM</option>
                            <option value="CMS">CMS</option>
                            <option value="INCHES">INCHES</option>
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
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <SearchableDropdown
                            value={material.edgeProtectorWingSize || ''}
                            onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorWingSize', selectedValue)}
                            options={['30x30mm', '35x35mm', '40x40mm', '50x50mm', '50x35mm (unequal)']}
                            placeholder="Select or type"
                            className="border-0 outline-none flex-1"
                            style={{ padding: '0 14px', height: '100%' }}
                          />
                          <span className="text-sm text-gray-600 px-3 border-l border-gray-200" style={{ whiteSpace: 'nowrap' }}>CM</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <SearchableDropdown
                            value={material.edgeProtectorThickness || ''}
                            onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorThickness', selectedValue)}
                            options={['2mm', '3mm', '4mm', '5mm', '6mm']}
                            placeholder="Select or type"
                            className="border-0 outline-none flex-1"
                            style={{ padding: '0 14px', height: '100%' }}
                          />
                          <span className="text-sm text-gray-600 px-3 border-l border-gray-200" style={{ whiteSpace: 'nowrap' }}>CM</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <SearchableDropdown
                            value={material.edgeProtectorLength || ''}
                            onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'edgeProtectorLength', selectedValue)}
                            options={['600mm (24")', '900mm (36")', '1200mm (48")', '2400mm', 'Custom']}
                            placeholder="Select or type"
                            className="border-0 outline-none flex-1"
                            style={{ padding: '0 14px', height: '100%' }}
                          />
                          <span className="text-sm text-gray-600 px-3 border-l border-gray-200" style={{ whiteSpace: 'nowrap' }}>CM</span>
                        </div>
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
                              value={material.dividerCellSizeUnit || 'CMS'}
                              onChange={(e) => handlePackagingMaterialChange(materialIndex, 'dividerCellSizeUnit', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                            >
                              <option value="CMS">CMS</option>
                              <option value="MM">MM</option>
                              <option value="INCHES">INCHES</option>
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
                            value={material.dividerHeightUnit || 'MM'}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'dividerHeightUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="MM">MM</option>
                            <option value="CMS">CMS</option>
                            <option value="INCHES">INCHES</option>
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

                  {/* Specific Fields for POLY BAG WITH FLAP */}
                  {material.packagingMaterialType === 'POLY BAG WITH FLAP' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE</label>
                        <input
                          type="text"
                          value={material.guage || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUMMING QUALITY</label>
                        <SearchableDropdown
                          value={material.gummingQuality || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'gummingQuality', selectedValue)}
                          options={['High', 'Standard']}
                          placeholder="Select or type Gumming Quality"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PUNCH HOLES</label>
                        <input
                          type="text"
                          value={material.punchHoles || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'punchHoles', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2 holes"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for POLY SHEET / BALE WRAP */}
                  {(material.packagingMaterialType === 'POLYSHEET' || material.packagingMaterialType === 'BALE WRAP') && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE/GSM</label>
                        <input
                          type="text"
                          value={material.guageGsm || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guageGsm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ROLL WIDTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.rollWidth || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'rollWidth', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="60"
                          />
                          <select
                            value={material.rollWidthUnit || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'rollWidthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="INCHES">INCHES</option>
                            <option value="CMS">CMS</option>
                            <option value="MM">MM</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Specific Fields for TAPE */}
                  {material.packagingMaterialType === 'TAPE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE</label>
                        <input
                          type="text"
                          value={material.guage || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUMMING QUALITY</label>
                        <SearchableDropdown
                          value={material.gummingQuality || ''}
                          onChange={(selectedValue) => handlePackagingMaterialChange(materialIndex, 'gummingQuality', selectedValue)}
                          options={['Strong', 'Standard']}
                          placeholder="Select or type Gumming Quality"
                        />
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
                            placeholder="3"
                          />
                          <select
                            value={material.tapeWidthUnit || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeWidthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="INCHES">INCHES</option>
                            <option value="CMS">CMS</option>
                            <option value="MM">MM</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PRINTING REF with UPLOAD for POLY BAG WITH FLAP and TAPE */}
                  {(material.packagingMaterialType === 'POLY BAG WITH FLAP' || material.packagingMaterialType === 'TAPE') && (
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

                  {/* Dimensions Field for CARTONS/CORRUGATED BOX */}
                  {material.packagingMaterialType === 'CARTONS/CORRUGATED BOX' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS (LXWXH)</label>
                        <input
                          type="text"
                          value={material.size.width || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="L x W x H"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                        <select
                          value={material.size.unit || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                        >
                          <option value="CMS">CMS</option>
                          <option value="INCHES">INCHES</option>
                          <option value="MM">MM</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Dimensions Field for POLY BAG WITH FLAP */}
                  {material.packagingMaterialType === 'POLY BAG WITH FLAP' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS (WXL + FLAP)</label>
                        <input
                          type="text"
                          value={material.size.width || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="W x L + FLAP"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                        <select
                          value={material.size.unit || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                        >
                          <option value="CMS">CMS</option>
                          <option value="INCHES">INCHES</option>
                          <option value="MM">MM</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Surplus & For Section - Special handling for CARTON BOX, CORNER PROTECTORS, EDGE PROTECTORS, and DIVIDER with absolute % signs */}
                  {(material.packagingMaterialType === 'CARTON BOX' || material.packagingMaterialType === 'CORNER PROTECTORS' || material.packagingMaterialType === 'EDGE PROTECTORS' || material.packagingMaterialType === 'DIVIDER') ? (
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

                  {/* Approval Against - Special handling for CARTON BOX, CORNER PROTECTORS, EDGE PROTECTORS, and DIVIDER */}
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
          <button
            type="button"
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
            className="border rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
            style={{
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
              color: '#374151',
              padding: '10px 16px',
              height: '42px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            + Add Material
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5;
