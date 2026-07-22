// FiberWool — extracted from FiberSpec.jsx (Step 2). Pure presentational.
import { Button } from '@/components/ui/button';
import QualityVerificationToggle from '../QualityVerificationToggle';
import { MATERIAL_APPROVAL_OPTIONS } from '../../data/approvalOptions';
import TenantDropdown from '@/components/ui/TenantDropdown';
import { computeSqMeter, formatCalc, useFiberKgsAutoFill } from '@/utils/fiberSizeCalc';

const FiberWool = ({
  material,
  actualIndex,
  handleRawMaterialChange,
}) => {
  const sqMeterStr = formatCalc(computeSqMeter(material.fiberLength, material.fiberWidth), 4);
  const kgsStr = useFiberKgsAutoFill({
    material,
    actualIndex,
    onChange: handleRawMaterialChange,
    targetField: 'fiberQtyValue',
    enabled: material.fiberQtyType === 'KGS',
  });
  return (
  <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* FIBER TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FIBER TYPE</label>
                          <TenantDropdown
                            value={material.fiberFiberType || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFiberType', selectedValue)}
                            options={['Wool', 'Alpaca', 'Camel Hair', 'Cashmere']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* WOOL TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">WOOL TYPE</label>
                          <TenantDropdown
                            value={material.fiberWoolType || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberWoolType', selectedValue)}
                            options={['Merino Wool', 'Shetland Wool', 'Lambswool', 'Generic Wool']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* SUBTYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SUBTYPE</label>
                          <TenantDropdown
                            value={material.fiberSubtype || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberSubtype', selectedValue)}
                            options={['Virgin Wool', 'Recycled Wool', 'Organic Wool']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* FORM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FORM</label>
                          <TenantDropdown
                            value={material.fiberForm || ''}
                            onChange={(selectedValue) => {
                              handleRawMaterialChange(actualIndex, 'fiberForm', selectedValue);
                              // Clear dependent fields when form changes
                              if (selectedValue !== material.fiberForm) {
                                handleRawMaterialChange(actualIndex, 'fiberQty', '');
                                handleRawMaterialChange(actualIndex, 'fiberGsm', '');
                                handleRawMaterialChange(actualIndex, 'fiberLength', '');
                                handleRawMaterialChange(actualIndex, 'fiberWidth', '');
                                handleRawMaterialChange(actualIndex, 'fiberQtyValue', '');
                                handleRawMaterialChange(actualIndex, 'fiberQtyType', '');
                              }
                            }}
                            options={['Loose Fiber', 'Wadding/Batt', 'Roving', 'Carded Wool']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* MICRON */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MICRON</label>
                          <TenantDropdown
                            value={material.fiberMicron || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicron', selectedValue)}
                            options={['Fine (<20 micron)', 'Medium (20-25)', 'Coarse (>25 micron)']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* COLOUR */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <TenantDropdown
                            value={material.fiberColour || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberColour', selectedValue)}
                            options={['Natural White', 'Natural Grey', 'Ecru', 'Bleached']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* TESTING REQUIREMENTS - Multi-select with chips */}
                        <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
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
                              {(Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : []).map((req, index) => (
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
                                      const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                                      const updated = current.filter((_, i) => i !== index);
                                      handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
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
                                id={`fiber-testing-wrapper-wool-${actualIndex}`}
                                style={{ flex: 1, minWidth: '200px' }}
                              >
                                                                <TenantDropdown
                                  value=""
                                  strictMode={false}
                                  onChange={(selectedValue) => {
                                    const options = ['Micron Test', 'Clean Wool Yield', 'Vegetable Matter Content', 'Moisture'];
                                    if (selectedValue && options.includes(selectedValue)) {
                                      const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                                      if (!current.includes(selectedValue)) {
                                        const updated = [...current, selectedValue];
                                        handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
                                      }
                                    }
                                  }}
                                  options={['Micron Test', 'Clean Wool Yield', 'Vegetable Matter Content', 'Moisture']}
                                  placeholder={(Array.isArray(material.fiberTestingRequirements) && material.fiberTestingRequirements.length === 0) ? "Select testing requirements" : "Add more..."}
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
                                        const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                                        const options = ['Micron Test', 'Clean Wool Yield', 'Vegetable Matter Content', 'Moisture'];
                                        if (!current.includes(newValue)) {
                                          if (!options.includes(newValue)) {
                                            const updated = [...current, newValue];
                                            handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
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
                                      const options = ['Micron Test', 'Clean Wool Yield', 'Vegetable Matter Content', 'Moisture'];
                                      if (!options.includes(typedValue)) {
                                        const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                                        if (!current.includes(typedValue)) {
                                          const updated = [...current, typedValue];
                                          handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
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

                        {/* Conditional Fields based on FORM */}
                        {material.fiberForm === 'Loose Fiber' && (
                          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                            <input
                              type="text"
                              value={material.fiberQty || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQty', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px', width: '300px' }}
                              placeholder="Enter QTY in KGS"
                            />
                          </div>
                        )}

                        {material.fiberForm === 'Wadding/Batt' && (
                          <>
                            {/* SIZE SPEC Section */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-4" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                              <label className="text-sm font-bold text-gray-800 mb-4 block">SIZE SPEC</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* GSM */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">GSM</label>
                                  <input
                                    type="text"
                                    value={material.fiberGsm || ''}
                                    onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberGsm', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    placeholder="Enter GSM"
                                  />
                                </div>
                                
                                {/* LENGTH (CM) */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH (CM)</label>
                                  <input
                                    type="text"
                                    value={material.fiberLength || ''}
                                    onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberLength', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    placeholder="Enter length"
                                  />
                                </div>
                                
                                {/* WIDTH (CM) */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH (CM)</label>
                                  <input
                                    type="text"
                                    value={material.fiberWidth || ''}
                                    onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberWidth', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    placeholder="Enter width"
                                  />
                                </div>

                                {/* SQ. METER (auto: LENGTH × WIDTH / 10000) */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">SQ. METER</label>
                                  <input
                                    type="text"
                                    value={sqMeterStr}
                                    readOnly
                                    tabIndex={-1}
                                    className="border-2 rounded-lg text-sm bg-gray-50 text-gray-700 border-[#e5e7eb] cursor-not-allowed focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    placeholder="L × W / 10000"
                                    title="Auto-calculated: LENGTH (CM) × WIDTH (CM) / 10000"
                                  />
                                </div>
                              </div>

                              {/* QTY with dropdown (KGS/Yardage) - Full width below the grid */}
                              <div className="flex flex-col" style={{ marginTop: '16px' }}>
                                <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}>
                                  <TenantDropdown
                                    value={material.fiberQtyType || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberQtyType', selectedValue)}
                                    options={['KGS', 'Yardage']}
                                    placeholder="Select"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px', width: '120px', flexShrink: 0 }}
                                  />
                                  <input
                                    type="text"
                                    value={material.fiberQtyType === 'KGS' ? kgsStr : (material.fiberQtyValue || '')}
                                    onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQtyValue', e.target.value)}
                                    readOnly={material.fiberQtyType === 'KGS'}
                                    className={`border-2 rounded-lg text-sm transition-all text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none ${material.fiberQtyType === 'KGS' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                                    style={{ padding: '10px 14px', height: '44px', width: '200px', flexShrink: 0 }}
                                    placeholder={material.fiberQtyType === 'KGS' ? 'Auto (GSM × m² / 1000)' : 'Enter value'}
                                    title={material.fiberQtyType === 'KGS' ? 'Auto-calculated: GSM × SQ.METER / 1000' : undefined}
                                  />
                                </div>
                                {material.fiberQtyType === 'KGS' && (
                                  <span className="text-xs text-gray-500 mt-1">
                                    Auto = GSM × (L × W ÷ 10000) ÷ 1000{kgsStr ? ` = ${kgsStr} kg` : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {/* APPROVAL */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <TenantDropdown
                            value={material.fiberApproval || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberApproval', selectedValue)}
                            options={MATERIAL_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* REMARKS */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                          <textarea
                            value={material.fiberRemarks || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', minHeight: '44px' }}
                            rows="1"
                            placeholder="Merino for softness, RWS certified for ethical sourcing, Naturally temperature regulating"
                          />
                        </div>

                        {/* ADVANCE SPEC Button and Fields for Wool-Natural */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-4 w-full" style={{ marginTop: '20px' }}>
                          <button
                            type="button"
                            onClick={() => handleRawMaterialChange(actualIndex, 'showFiberAdvancedSpec', !material.showFiberAdvancedSpec)}
                            style={{
                              backgroundColor: material.showFiberAdvancedSpec ? '#667eea' : '#ffffff',
                              borderColor: material.showFiberAdvancedSpec ? '#667eea' : '#e5e7eb',
                              color: material.showFiberAdvancedSpec ? '#ffffff' : '#374151',
                              border: '2px solid',
                              borderRadius: '8px',
                              padding: '10px 20px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              width: '100%',
                              transition: 'all 0.2s',
                              boxShadow: material.showFiberAdvancedSpec ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (!material.showFiberAdvancedSpec) {
                                e.target.style.backgroundColor = '#f9fafb';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!material.showFiberAdvancedSpec) {
                                e.target.style.backgroundColor = '#ffffff';
                              }
                            }}
                          >
                            {material.showFiberAdvancedSpec ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                          </button>
                          {material.showFiberAdvancedSpec && (
                            <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* PROCESSING */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">PROCESSING</label>
                                  <TenantDropdown
                                    value={material.fiberProcessing || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberProcessing', selectedValue)}
                                    options={['Scoured (washed)', 'Carbonized (vegetable matter removed)', 'Needle Punched']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* LANOLIN CONTENT */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">LANOLIN CONTENT</label>
                                  <TenantDropdown
                                    value={material.fiberLanolinContent || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberLanolinContent', selectedValue)}
                                    options={['Lanolin-Free (fully scoured)', 'Low Lanolin', 'Natural Lanolin']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* TEMPERATURE REGULATING */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">TEMPERATURE REGULATING</label>
                                  <TenantDropdown
                                    value={material.fiberTemperatureRegulating || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberTemperatureRegulating', selectedValue)}
                                    options={['Standard', 'Temperature Regulating (wool naturally)']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* MOISTURE WICKING */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">MOISTURE WICKING</label>
                                  <TenantDropdown
                                    value={material.fiberMoistureWicking || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMoistureWicking', selectedValue)}
                                    options={['Natural Moisture Wicking Property']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* FIRE RETARDANT */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">FIRE RETARDANT</label>
                                  <TenantDropdown
                                    value={material.fiberFireRetardant || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFireRetardant', selectedValue)}
                                    options={['Naturally FR (wool is self-extinguishing)', 'Treated FR']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* MULESING-FREE */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">MULESING-FREE</label>
                                  <TenantDropdown
                                    value={material.fiberMulesingFree || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMulesingFree', selectedValue)}
                                    options={['Standard', 'Certified Mulesing-Free']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* ORGANIC CERTIFIED */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">ORGANIC CERTIFIED</label>
                                  <TenantDropdown
                                    value={material.fiberOrganicCertified || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberOrganicCertified', selectedValue)}
                                    options={['Standard', 'GOTS Certified', 'OCS', 'RWS (Responsible Wool Standard)']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Quality Verification - after Advance Spec, inside top-border block */}
                          <div className="w-full" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <QualityVerificationToggle
                              value={material.qualityVerification}
                              onChange={(value) => handleRawMaterialChange(actualIndex, 'qualityVerification', value)}
                              width="lg"
                              className="mb-3"
                            />
                          </div>
                        </div>
                      </div>
  </>
  );
};

export default FiberWool;
