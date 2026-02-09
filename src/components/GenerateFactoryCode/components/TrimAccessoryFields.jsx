import SearchableDropdown from './SearchableDropdown';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PercentInput } from '@/components/ui/percent-input';
import { TestingRequirementsInput } from '@/components/ui/testing-requirements-input';

/**
 * TrimAccessoryFields Component
 * Renders trim/accessory fields based on the selected trim/accessory type.
 * This component is extracted from Step3 to be reusable in Step2.
 * 
 * @param {Object} material - The material object containing trim/accessory data
 * @param {number} materialIndex - Index of the material in the array
 * @param {Function} handleChange - Handler function for field changes (handleConsumptionMaterialChange or handleRawMaterialChange)
 * @param {Object} errors - Validation errors object for displaying error states
 * @param {string} errorPrefix - Prefix for error keys (e.g., 'rawMaterial_0' or 'consumptionMaterial_0')
 */
const TrimAccessoryFields = ({ material, materialIndex, handleChange, errors = {}, errorPrefix = '' }) => {
  // Helper to get error key
  const getErrorKey = (fieldName) => errorPrefix ? `${errorPrefix}_${fieldName}` : `rawMaterial_${materialIndex}_${fieldName}`;
  const hasError = (fieldName) => !!errors[getErrorKey(fieldName)];
  const dropdownClass = (error) =>
    `border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none${error ? ' border-red-600' : ''}`;
  const toCount = (value) => {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0) return 0;
    return parsed;
  };
  const getFileArray = (fieldName) => {
    const value = material[fieldName];
    if (Array.isArray(value)) return value;
    if (value instanceof File) return [value];
    return [];
  };
  const trimFileArrayToCount = (fieldName, count) => {
    const current = getFileArray(fieldName);
    if (current.length > count) {
      handleChange(materialIndex, fieldName, current.slice(0, count));
    } else if (count === 0 && current.length) {
      handleChange(materialIndex, fieldName, []);
    }
  };
  const updateFileArrayAtIndex = (fieldName, index, file) => {
    const next = [...getFileArray(fieldName)];
    next[index] = file;
    handleChange(materialIndex, fieldName, next);
  };
  if (!material.trimAccessory) {
    return null;
  }

  return (
    <>
      {/* Conditional fields based on trim/accessory type */}
      {material.trimAccessory && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                  {/* VELCRO Fields */}
                  {material.trimAccessory === 'VELCRO' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="PART" required width="sm" error={errors[getErrorKey('velcroPart')]}>
                          <SearchableDropdown
                            value={material.velcroPart || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroPart', selectedValue)}
                            options={['HOOK','LOOP','BOTH']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroPart'))}
                          />
                        </Field>
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('velcroType')]}>
                          <SearchableDropdown
                            value={material.velcroType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroType', selectedValue)}
                            options={['Sew-On', 'Adhesive Backed (PSA)', 'Die-Cut Shapes', 'ONE-WRAP', 'Soft Loop', 'Mushroom']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('velcroMaterial')]}>
                          <SearchableDropdown
                            value={material.velcroMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroMaterial', selectedValue)}
                            options={['Nylon (Higher cycle life)', 'Polyester (UV/moisture resistant)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroMaterial'))}
                          />
                        </Field>
                        <Field label="ATTACHMENT" required width="sm" error={errors[getErrorKey('velcroAttachment')]}>
                          <SearchableDropdown
                            value={material.velcroAttachment || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroAttachment', selectedValue)}
                            options={['Sewing', 'Adhesive','General','High','Temp','Permanent']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroAttachment'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('velcroPlacement')]}>
                          <Input
                            type="text"
                            value={material.velcroPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroPlacement', e.target.value)}
                            placeholder="PLACEMENT"
                            aria-invalid={hasError('velcroPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'velcroPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={'upload-velcro-placement-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-velcro-placement-' + materialIndex)?.click()}
                            >
                              {material.velcroPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="GSM" required width="sm" error={errors[getErrorKey('velcroGsm')]}>
                          <Input
                            type="text"
                            value={material.velcroGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('velcroGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" required width="sm" error={errors[getErrorKey('velcroLengthCm')]}>
                          <Input
                            type="text"
                            value={material.velcroLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('velcroLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" required width="sm" error={errors[getErrorKey('velcroWidthCm')]}>
                          <Input
                            type="text"
                            value={material.velcroWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('velcroWidthCm')}
                          />
                        </Field>
                        <Field label="YARDAGE (CNS/PC)" required width="sm" error={errors[getErrorKey('velcroYardageCns')]}>
                          <Input
                            type="text"
                            value={material.velcroYardageCns || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroYardageCns', e.target.value)}
                            placeholder="Yardage (cns per pc)"
                            aria-invalid={hasError('velcroYardageCns')}
                          />
                        </Field>
                        <Field label="KGS (CNS/PC)" required width="sm" error={errors[getErrorKey('velcroKgsCns')]}>
                          <Input
                            type="text"
                            value={material.velcroKgsCns || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroKgsCns', e.target.value)}
                            placeholder="Kgs (cns per pc)"
                            aria-invalid={hasError('velcroKgsCns')}
                          />
                        </Field>
                        <Field label="TESTING REQ." required width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('velcroTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.velcroTestingRequirements) ? material.velcroTestingRequirements : (material.velcroTestingRequirements ? [material.velcroTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'velcroTestingRequirements', arr)}
                                options={['Tensile Strength', 'Colour Fastness', 'Abrasion Resistance', 'Flammability', 'REACH/OEKO-TEX']}
                                placeholder="Select testing requirements"
                                className={hasError('velcroTestingRequirements') ? 'border-red-600' : ''}
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'velcroTestingRequirementFile', e.target.files[0])}
                              className="hidden"
                              id={'upload-velcro-testing-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-velcro-testing-' + materialIndex)?.click()}
                            >
                              {material.velcroTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('velcroSurplus')]}> 
                          <PercentInput
                            value={material.velcroSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroSurplus', e.target.value)}
                            error={hasError('velcroSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('velcroWastage')]}> 
                          <PercentInput
                            value={material.velcroWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroWastage', e.target.value)}
                            error={hasError('velcroWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('velcroApproval')]}> 
                          <SearchableDropdown
                            value={material.velcroApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.velcroRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroRemarks', e.target.value)}
                            placeholder="Pack Hook & Loop separately, Non-abrasive loop for skin"
                          />
                        </Field>
                      </div>
                      {/* VELCRO - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleChange(materialIndex, 'showVelcroAdvancedSpec', !material.showVelcroAdvancedSpec)}
                            className="border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderColor: '#d1d5db',
                              color: '#374151'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#f3f4f6';
                            }}
                          >
                            {material.showVelcroAdvancedSpec ? '− ADVANCE SPEC' : '+ ADVANCE SPEC'}
                          </button>
                        </div>
                        
                        {/* Advanced Spec Fields */}
                        {material.showVelcroAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-x-5 gap-y-5">
                            <div className="flex items-end gap-4">
                              <div className="flex flex-col flex-1">
                                <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                <SearchableDropdown
                                  value={material.velcroColour || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'velcroColour', selectedValue)}
                                  options={['DTM', 'White', 'Black', 'Beige', 'Grey', 'Navy']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                                <input
                                  type="file"
                                  onChange={(e) => handleChange(materialIndex, 'velcroColorReference', e.target.files[0])}
                                  className="hidden"
                                  id={`upload-velcro-color-${materialIndex}`}
                                  accept="image/*"
                                />
                                <label
                                  htmlFor={`upload-velcro-color-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                                  style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                                >
                                  {material.velcroColorReference ? 'UPLOADED' : 'UPLOAD COLOR REFERENCE'}
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">HOOK DENSITY</label>
                              <SearchableDropdown
                                value={material.velcroHookDensity || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'velcroHookDensity', selectedValue)}
                                options={['Standard', 'High Density (stronger grip)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">LOOP TYPE</label>
                              <SearchableDropdown
                                value={material.velcroLoopType || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'velcroLoopType', selectedValue)}
                                options={['Woven', 'Knitted', 'Non-woven']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CYCLE LIFE</label>
                              <SearchableDropdown
                                value={material.velcroCycleLife || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'velcroCycleLife', selectedValue)}
                                options={['Standard: 1,000+', 'Heavy Duty: 5,000+', 'Industrial: 10,000+']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FLAME RETARDANT</label>
                              <SearchableDropdown
                                value={material.velcroFlameRetardant || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'velcroFlameRetardant', selectedValue)}
                                options={['Standard', 'FR Treated', 'Inherently FR']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* RIVETS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RIVETS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('rivetType')]}> 
                          <SearchableDropdown
                            value={material.rivetType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetType', selectedValue)}
                            options={['Double Cap', 'Single Cap', 'Tubular', 'Rapid', 'Decorative']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('rivetType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('rivetMaterial')]}> 
                          <SearchableDropdown
                            value={material.rivetMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetMaterial', selectedValue)}
                            options={['Brass', 'Steel', 'Aluminum', 'Zinc Alloy']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('rivetMaterial'))}
                          />
                        </Field>
                        <Field label="CAP SIZE" required width="sm" error={errors[getErrorKey('rivetCapSize')]}> 
                          <Input
                            type="text"
                            value={material.rivetCapSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetCapSize', e.target.value)}
                            placeholder="e.g., 8mm, 10mm"
                            aria-invalid={hasError('rivetCapSize')}
                          />
                        </Field>
                        <Field label="POST HEIGHT" required width="sm" error={errors[getErrorKey('rivetPostHeight')]}> 
                          <Input
                            type="text"
                            value={material.rivetPostHeight || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetPostHeight', e.target.value)}
                            placeholder="e.g., 6mm, 8mm"
                            aria-invalid={hasError('rivetPostHeight')}
                          />
                        </Field>
                        <Field label="FINISH/PLATING" required width="sm" error={errors[getErrorKey('rivetFinishPlating')]}> 
                          <SearchableDropdown
                            value={material.rivetFinishPlating || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetFinishPlating', selectedValue)}
                            options={['Nickel', 'Copper', 'Antique Brass', 'Gunmetal', 'Black Oxide', 'Matte', 'Shiny']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('rivetFinishPlating'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('rivetPlacement')]}> 
                          <Input
                            type="text"
                            value={material.rivetPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetPlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('rivetPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'rivetPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={'upload-rivet-placement-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-rivet-placement-' + materialIndex)?.click()}
                            >
                              {material.rivetPlacementReferenceImage ? 'UPLOADED' : 'IMAGE REF'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="TESTING REQ." required width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('rivetTestingRequirements')]}> 
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.rivetTestingRequirements) ? material.rivetTestingRequirements : (material.rivetTestingRequirements ? [material.rivetTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'rivetTestingRequirements', arr)}
                                options={['Needle Detection', 'Pull Strength (90N)', 'Corrosion (Salt Spray)']}
                                placeholder="Select testing requirements"
                                className={hasError('rivetTestingRequirements') ? 'border-red-600' : ''}
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'rivetTestingRequirementFile', e.target.files[0])}
                              className="hidden"
                              id={'upload-rivet-testing-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-rivet-testing-' + materialIndex)?.click()}
                            >
                              {material.rivetTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="QTY" required width="sm" error={errors[getErrorKey('rivetQty')]}> 
                          <Input
                            type="text"
                            value={material.rivetQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetQty', e.target.value)}
                            placeholder="PCS"
                            aria-invalid={hasError('rivetQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('rivetSurplus')]}> 
                          <PercentInput
                            value={material.rivetSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetSurplus', e.target.value)}
                            error={hasError('rivetSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('rivetWastage')]}> 
                          <PercentInput
                            value={material.rivetWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetWastage', e.target.value)}
                            error={hasError('rivetWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('rivetApproval')]}> 
                          <SearchableDropdown
                            value={material.rivetApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('rivetApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.rivetRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetRemarks', e.target.value)}
                            placeholder="TEXT"
                          />
                        </Field>
                      </div>
                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showRivetAdvancedSpec', !material.showRivetAdvancedSpec)}
                          className="border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5 self-start"
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            marginBottom: '16px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                        >
                          {material.showRivetAdvancedSpec ? '− ADVANCE SPEC' : '+ ADVANCE SPEC'}
                        </button>
                        {material.showRivetAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 mt-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">LOGO</label>
                              <SearchableDropdown
                                value={material.rivetLogo || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'rivetLogo', selectedValue)}
                                options={['Plain', 'Embossed', 'Custom', 'Laser Engraved']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">SETTING</label>
                              <SearchableDropdown
                                value={material.rivetSetting || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'rivetSetting', selectedValue)}
                                options={['Machine Applied (specific die)', 'Hand Press']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* NIWAR-WEBBING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'NIWAR-WEBBING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('niwarType')]}
                        >
                          <SearchableDropdown
                            value={material.niwarType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarType', selectedValue)}
                            options={['Woven (Twill, Plain, Herringbone)', 'Knitted', 'Non-Woven', 'Binding Tape', 'Grosgrain']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('niwarType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('niwarMaterial')]}
                        >
                          <SearchableDropdown
                            value={material.niwarMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarMaterial', selectedValue)}
                            options={['Cotton', 'Polyester', 'Polypropylene (PP)', 'Nylon', 'Blends', 'Jute']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('niwarMaterial'))}
                          />
                        </Field>
                        <Field label="NO OF COLOURS" required width="sm" error={errors[getErrorKey('niwarColour')]}
                        >
                          <Input
                            type="number"
                            min="0"
                            value={material.niwarColour || ''}
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              handleChange(materialIndex, 'niwarColour', nextValue);
                              trimFileArrayToCount('niwarColorReference', toCount(nextValue));
                            }}
                            placeholder="Enter number of colours"
                            aria-invalid={hasError('niwarColour')}
                          />
                        </Field>
                        {toCount(material.niwarColour) > 0 && (
                          <Field label="COLOR REFS" className="col-span-1 md:col-span-2 lg:col-span-5 w-full">
                            <div className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(160px,160px))] gap-3">
                              {Array.from({ length: toCount(material.niwarColour) }).map((_, index) => {
                                const uploadId = 'upload-niwar-color-' + materialIndex + '-' + index;
                                const file = getFileArray('niwarColorReference')[index];
                                return (
                                  <div key={uploadId} className="flex flex-col min-w-0">
                                    <input
                                      type="file"
                                      onChange={(e) => updateFileArrayAtIndex('niwarColorReference', index, e.target.files[0])}
                                      className="hidden"
                                      id={uploadId}
                                      accept="image/*"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-11 w-full px-3 whitespace-nowrap"
                                      onClick={() => document.getElementById(uploadId)?.click()}
                                    >
                                      {file ? 'UPLOADED COLOR ' + (index + 1) : 'COLOR ' + (index + 1)}
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </Field>
                        )}
                        <Field label="WEAVE PATTERN" required width="sm" error={errors[getErrorKey('niwarWeavePattern')]}
                        >
                          <SearchableDropdown
                            value={material.niwarWeavePattern || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarWeavePattern', selectedValue)}
                            options={['Plain', 'Twill', 'Herringbone', 'Seatbelt-style', 'Tubular']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('niwarWeavePattern'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('niwarPlacement')]}
                        >
                          <Input
                            type="text"
                            value={material.niwarPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarPlacement', e.target.value)}
                            placeholder="PLACEMENT"
                            aria-invalid={hasError('niwarPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'niwarPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={'upload-niwar-placement-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-niwar-placement-' + materialIndex)?.click()}
                            >
                              {material.niwarPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="TESTING REQ." required width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('niwarTestingRequirements')]}
                        >
                          <TestingRequirementsInput
                            value={Array.isArray(material.niwarTestingRequirements) ? material.niwarTestingRequirements : (material.niwarTestingRequirements ? [material.niwarTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'niwarTestingRequirements', arr)}
                            options={['Tensile Strength', 'Colour Fastness', 'Abrasion Resistance', 'Flammability', 'REACH/OEKO-TEX']}
                            placeholder="Select testing requirements"
                            className={hasError('niwarTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="GSM" required width="sm" error={errors[getErrorKey('niwarGsm')]}
                        >
                          <Input
                            type="text"
                            value={material.niwarGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('niwarGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" required width="sm" error={errors[getErrorKey('niwarLengthCm')]}
                        >
                          <Input
                            type="text"
                            value={material.niwarLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('niwarLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" required width="sm" error={errors[getErrorKey('niwarWidthCm')]}
                        >
                          <Input
                            type="text"
                            value={material.niwarWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('niwarWidthCm')}
                          />
                        </Field>
                        <Field label="YARDAGE (CNS/PC)" required width="sm" error={errors[getErrorKey('niwarYardageCns')]}
                        >
                          <Input
                            type="text"
                            value={material.niwarYardageCns || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarYardageCns', e.target.value)}
                            placeholder="Yardage (cns per pc)"
                            aria-invalid={hasError('niwarYardageCns')}
                          />
                        </Field>
                        <Field label="KGS (CNS/PC)" required width="sm" error={errors[getErrorKey('niwarKgsCns')]}
                        >
                          <Input
                            type="text"
                            value={material.niwarKgsCns || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarKgsCns', e.target.value)}
                            placeholder="Kgs (cns per pc)"
                            aria-invalid={hasError('niwarKgsCns')}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm">
                          <SearchableDropdown
                            value={material.niwarQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.niwarQtyType === 'Yardage (cns per pc)' ? (material.niwarQtyYardage || '') : material.niwarQtyType === 'Kgs (cns per pc)' ? (material.niwarQtyKgs || '') : ''}
                            onChange={(e) => {
                              if (material.niwarQtyType === 'Yardage (cns per pc)') {
                                handleChange(materialIndex, 'niwarQtyYardage', e.target.value);
                              } else if (material.niwarQtyType === 'Kgs (cns per pc)') {
                                handleChange(materialIndex, 'niwarQtyKgs', e.target.value);
                              }
                            }}
                            placeholder="Enter value"
                            disabled={!material.niwarQtyType}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('niwarSurplus')]}
                        >
                          <PercentInput
                            value={material.niwarSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarSurplus', e.target.value)}
                            error={hasError('niwarSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('niwarWastage')]}
                        >
                          <PercentInput
                            value={material.niwarWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarWastage', e.target.value)}
                            error={hasError('niwarWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('niwarApproval')]}
                        >
                          <SearchableDropdown
                            value={material.niwarApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('niwarApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.niwarRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarRemarks', e.target.value)}
                            placeholder="Seatbelt-style weave, 1200N minimum strength"
                          />
                        </Field>
                      </div>
                      {/* NIWAR-WEBBING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showNiwarAdvancedSpec', !material.showNiwarAdvancedSpec)}
                          style={{
                            backgroundColor: material.showNiwarAdvancedSpec ? '#667eea' : '#ffffff',
                            borderColor: material.showNiwarAdvancedSpec ? '#667eea' : '#e5e7eb',
                            color: material.showNiwarAdvancedSpec ? '#ffffff' : '#374151',
                            border: '2px solid',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s',
                            boxShadow: material.showNiwarAdvancedSpec ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!material.showNiwarAdvancedSpec) {
                              e.target.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!material.showNiwarAdvancedSpec) {
                              e.target.style.backgroundColor = '#ffffff';
                            }
                          }}
                        >
                          {material.showNiwarAdvancedSpec ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                        </button>
                        {material.showNiwarAdvancedSpec && (
                          <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                                <SearchableDropdown
                                  value={material.niwarThickness || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'niwarThickness', selectedValue)}
                                  options={['Thin', 'Medium', 'Heavy-duty (1mm, 1.5mm, 2mm)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                                <SearchableDropdown
                                  value={material.niwarFinish || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'niwarFinish', selectedValue)}
                                  options={['Soft', 'Stiff', 'Water Repellent', 'UV Resistant', 'Fire Retardant']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                                <input
                                  type="text"
                                  value={material.niwarTensileStrength || ''}
                                  onChange={(e) => handleChange(materialIndex, 'niwarTensileStrength', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                  placeholder="Breaking Strength (N) or Kg"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">EDGE TYPE</label>
                                <SearchableDropdown
                                  value={material.niwarEdgeType || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'niwarEdgeType', selectedValue)}
                                  options={['Selvage', 'Cut & Sealed', 'Bound Edge']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* LACE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'LACE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('laceType')]}> 
                          <SearchableDropdown
                            value={material.laceType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceType', selectedValue)}
                            options={['Trim Lace', 'Stretch Lace', 'Leavers Lace', 'Embroidery Lace', 'Crochet Lace']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('laceType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('laceMaterial')]}> 
                          <SearchableDropdown
                            value={material.laceMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceMaterial', selectedValue)}
                            options={['Cotton', 'Polyester', 'Nylon', 'Rayon', 'Blends']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('laceMaterial'))}
                          />
                        </Field>
                        <Field label="WIDTH" required width="sm" error={errors[getErrorKey('laceWidth')]}> 
                          <Input
                            type="text"
                            value={material.laceWidth || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceWidth', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('laceWidth')}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('laceColour')]}> 
                          <SearchableDropdown
                            value={material.laceColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceColour', selectedValue)}
                            options={['DTM', 'White', 'Black', 'Natural', 'Pantone TPX/TCX']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('laceColour'))}
                          />
                        </Field>
                        <Field label="COLOR REF" required width="sm" error={errors[getErrorKey('laceColorReference')]}> 
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'laceColorReference', e.target.files[0])}
                              className="hidden"
                              id={'upload-lace-color-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-lace-color-' + materialIndex)?.click()}
                            >
                              {material.laceColorReference ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="DESIGN REF" required width="sm" error={errors[getErrorKey('laceDesignRef')]}> 
                          <Input
                            type="text"
                            value={material.laceDesignRef || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceDesignRef', e.target.value)}
                            placeholder="Design ref"
                            aria-invalid={hasError('laceDesignRef')}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('lacePlacement')]}> 
                          <Input
                            type="text"
                            value={material.lacePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'lacePlacement', e.target.value)}
                            placeholder="PLACEMENT"
                            aria-invalid={hasError('lacePlacement')}
                          />
                        </Field>
                        <Field label="TESTING REQ." required width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('laceTestingRequirements')]}> 
                          <TestingRequirementsInput
                            value={Array.isArray(material.laceTestingRequirements) ? material.laceTestingRequirements : (material.laceTestingRequirements ? [material.laceTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'laceTestingRequirements', arr)}
                            options={['Colour Fastness', 'Stretch Recovery', 'Dimensional Stability', 'Abrasion']}
                            placeholder="Select testing requirements"
                            className={hasError('laceTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="GSM" required width="sm" error={errors[getErrorKey('laceGsm')]}> 
                          <Input
                            type="text"
                            value={material.laceGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('laceGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" required width="sm" error={errors[getErrorKey('laceLengthCm')]}> 
                          <Input
                            type="text"
                            value={material.laceLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('laceLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH CM" required width="sm" error={errors[getErrorKey('laceWidthCm')]}> 
                          <Input
                            type="text"
                            value={material.laceWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('laceWidthCm')}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm">
                          <SearchableDropdown
                            value={material.laceQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.laceQtyType === 'Yardage (cns per pc)' ? (material.laceQtyYardage || '') : material.laceQtyType === 'Kgs (cns per pc)' ? (material.laceQtyKgs || '') : ''}
                            onChange={(e) => {
                              if (material.laceQtyType === 'Yardage (cns per pc)') {
                                handleChange(materialIndex, 'laceQtyYardage', e.target.value);
                              } else if (material.laceQtyType === 'Kgs (cns per pc)') {
                                handleChange(materialIndex, 'laceQtyKgs', e.target.value);
                              }
                            }}
                            placeholder="Enter value"
                            disabled={!material.laceQtyType}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('laceSurplus')]}> 
                          <PercentInput
                            value={material.laceSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceSurplus', e.target.value)}
                            error={hasError('laceSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('laceWastage')]}> 
                          <PercentInput
                            value={material.laceWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceWastage', e.target.value)}
                            error={hasError('laceWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('laceApproval')]}> 
                          <SearchableDropdown
                            value={material.laceApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('laceApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.laceRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceRemarks', e.target.value)}
                            placeholder="Continuous pattern, No visible knots"
                          />
                        </Field>
                      </div>
                      {/* LACE - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showLaceAdvancedSpec', !material.showLaceAdvancedSpec)}
                          style={{
                            backgroundColor: material.showLaceAdvancedSpec ? '#667eea' : '#ffffff',
                            borderColor: material.showLaceAdvancedSpec ? '#667eea' : '#e5e7eb',
                            color: material.showLaceAdvancedSpec ? '#ffffff' : '#374151',
                            border: '2px solid',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s',
                            boxShadow: material.showLaceAdvancedSpec ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!material.showLaceAdvancedSpec) {
                              e.target.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!material.showLaceAdvancedSpec) {
                              e.target.style.backgroundColor = '#ffffff';
                            }
                          }}
                        >
                          {material.showLaceAdvancedSpec ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                        </button>
                        {material.showLaceAdvancedSpec && (
                          <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">FINISHING</label>
                                <SearchableDropdown
                                  value={material.laceFinishing || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'laceFinishing', selectedValue)}
                                  options={['Starch (Stiff)', 'Soft', 'Mercerized', 'Scalloped Edge', 'Eyelash Edge']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH</label>
                                <SearchableDropdown
                                  value={material.laceStretch || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'laceStretch', selectedValue)}
                                  options={['Non-Stretch', '2-Way Stretch', '4-Way Stretch']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">PATTERN TYPE</label>
                                <SearchableDropdown
                                  value={material.lacePatternType || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'lacePatternType', selectedValue)}
                                  options={['Floral', 'Geometric', 'Abstract', 'Traditional', 'Scallop']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* FELT Fields */}
                  {material.trimAccessory === 'FELT' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('feltType')]}> 
                          <SearchableDropdown
                            value={material.feltType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltType', selectedValue)}
                            options={['Pressed Wool', 'Needle-Punched', 'Synthetic (Acrylic, Polyester, PP)', 'Non-Woven', 'Eco Felt']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('feltMaterial')]}> 
                          <SearchableDropdown
                            value={material.feltMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltMaterial', selectedValue)}
                            options={['100% Wool', '100% Polyester', 'Wool/Rayon Blend', 'Acrylic', 'Recycled PET']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltMaterial'))}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('feltColour')]}> 
                          <SearchableDropdown
                            value={material.feltColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltColour', selectedValue)}
                            options={['Standard Colours', 'Pantone TPX/TCX', 'Heathered']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltColour'))}
                          />
                        </Field>
                        <Field label="COLOR REF" required width="sm" error={errors[getErrorKey('feltColorReference')]}> 
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'feltColorReference', e.target.files[0])}
                              className="hidden"
                              id={'upload-felt-color-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-felt-color-' + materialIndex)?.click()}
                            >
                              {material.feltColorReference ? 'UPLOADED' : 'UPLOAD COLOUR'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="GSM" required width="sm" error={errors[getErrorKey('feltGsm')]}> 
                          <Input
                            type="text"
                            value={material.feltGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('feltGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" required width="sm" error={errors[getErrorKey('feltLengthCm')]}> 
                          <Input
                            type="text"
                            value={material.feltLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('feltLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" required width="sm" error={errors[getErrorKey('feltWidthCm')]}> 
                          <Input
                            type="text"
                            value={material.feltWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('feltWidthCm')}
                          />
                        </Field>
                      </div>
                    </>
                  )}
                  {/* FELT - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FELT' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('feltType')]}> 
                          <SearchableDropdown
                            value={material.feltType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltType', selectedValue)}
                            options={['Needle Felt', 'Pressed Felt', 'Wool Felt', 'Synthetic Felt']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('feltMaterial')]}> 
                          <SearchableDropdown
                            value={material.feltMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltMaterial', selectedValue)}
                            options={['Wool', 'Polyester', 'Rayon', 'Blends']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltMaterial'))}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('feltColour')]}> 
                          <SearchableDropdown
                            value={material.feltColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltColour', selectedValue)}
                            options={['DTM', 'White', 'Black', 'Natural', 'Pantone TPX/TCX']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltColour'))}
                          />
                        </Field>
                        <Field label="COLOR REF" required width="sm" error={errors[getErrorKey('feltColorReference')]}> 
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'feltColorReference', e.target.files[0])}
                              className="hidden"
                              id={'upload-felt-color-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-felt-color-' + materialIndex)?.click()}
                            >
                              {material.feltColorReference ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="GSM" required width="sm" error={errors[getErrorKey('feltGsm')]}> 
                          <Input
                            type="text"
                            value={material.feltGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('feltGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" required width="sm" error={errors[getErrorKey('feltLengthCm')]}> 
                          <Input
                            type="text"
                            value={material.feltLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('feltLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" required width="sm" error={errors[getErrorKey('feltWidthCm')]}> 
                          <Input
                            type="text"
                            value={material.feltWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('feltWidthCm')}
                          />
                        </Field>
                        <Field label="TESTING REQ." required width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('feltTestingRequirements')]}> 
                          <TestingRequirementsInput
                            value={Array.isArray(material.feltTestingRequirements) ? material.feltTestingRequirements : (material.feltTestingRequirements ? [material.feltTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'feltTestingRequirements', arr)}
                            options={['Flammability', 'Dimensional Stability', 'Colour Fastness', 'Abrasion']}
                            placeholder="Select testing requirements"
                            className={hasError('feltTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm">
                          <SearchableDropdown
                            value={material.feltQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.feltQtyType === 'Yardage (cns per pc)' ? (material.feltYardage || '') : material.feltQtyType === 'Kgs (cns per pc)' ? (material.feltKgs || '') : ''}
                            onChange={(e) => {
                              if (material.feltQtyType === 'Yardage (cns per pc)') {
                                handleChange(materialIndex, 'feltYardage', e.target.value);
                              } else if (material.feltQtyType === 'Kgs (cns per pc)') {
                                handleChange(materialIndex, 'feltKgs', e.target.value);
                              }
                            }}
                            placeholder="Enter value"
                            disabled={!material.feltQtyType}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('feltSurplus')]}> 
                          <PercentInput
                            value={material.feltSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltSurplus', e.target.value)}
                            error={hasError('feltSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('feltWastage')]}> 
                          <PercentInput
                            value={material.feltWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltWastage', e.target.value)}
                            error={hasError('feltWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('feltApproval')]}> 
                          <SearchableDropdown
                            value={material.feltApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.feltRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltRemarks', e.target.value)}
                            placeholder="Non-Toxic, Anti-Fraying, Heat press suitable"
                          />
                        </Field>
                      </div>
                      {/* FELT - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleChange(materialIndex, 'showFeltAdvancedSpec', !material.showFeltAdvancedSpec)}
                            className="border-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                              padding: '10px 20px',
                              height: '44px',
                              backgroundColor: material.showFeltAdvancedSpec ? '#667eea' : '#ffffff',
                              borderColor: material.showFeltAdvancedSpec ? '#667eea' : '#e5e7eb',
                              color: material.showFeltAdvancedSpec ? '#ffffff' : '#374151'
                            }}
                            onMouseEnter={(e) => {
                              if (!material.showFeltAdvancedSpec) {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#d1d5db';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!material.showFeltAdvancedSpec) {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                              }
                            }}
                          >
                            ADVANCE SPEC
                          </button>
                        </div>
                        
                        {/* Advanced Spec Fields */}
                        {material.showFeltAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-x-5 gap-y-5">
              <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                              <SearchableDropdown
                                value={material.feltThickness || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'feltThickness', selectedValue)}
                                options={['1mm', '2mm', '3mm', '5mm', '1/8 inch', '1/4 inch']}
                                placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/FORM</label>
                              <SearchableDropdown
                                value={material.feltFinishForm || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'feltFinishForm', selectedValue)}
                                options={['Rolls', 'Sheets', 'Die-Cut Shapes', 'Adhesive Backed', 'Plain']}
                                placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                              <SearchableDropdown
                                value={material.feltApplication || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'feltApplication', selectedValue)}
                                options={['Padding', 'Interlining', 'Craft', 'Insulation', 'Acoustic']}
                                placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">STIFFNESS</label>
                                                <SearchableDropdown
                                value={material.feltStiffness || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'feltStiffness', selectedValue)}
                                options={['Soft', 'Medium', 'Stiff', 'Extra Stiff']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* INTERLINING(FUSING) Fields */}
                  {material.trimAccessory === 'INTERLINING(FUSING)' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('interliningType')]}> 
                          <SearchableDropdown
                            value={material.interliningType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningType', selectedValue)}
                            options={['Woven', 'Non-Woven', 'Knit', 'Fusible (adhesive)', 'Non-Fusible (sew-in)', 'Weft Insert', 'Bi-Stretch']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('interliningMaterial')]}> 
                          <SearchableDropdown
                            value={material.interliningMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningMaterial', selectedValue)}
                            options={['Polyester', 'Cotton', 'Cellulose (Rayon)', 'Polyamide', 'Blends']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningMaterial'))}
                          />
                        </Field>
                        <Field label="ADHESIVE TYPE" required width="sm" error={errors[getErrorKey('interliningAdhesiveType')]}> 
                          <SearchableDropdown
                            value={material.interliningAdhesiveType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningAdhesiveType', selectedValue)}
                            options={['PA (Polyamide)', 'LDPE', 'PES (Polyester)', 'Double Dot', 'Scatter Coat', 'Paste']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningAdhesiveType'))}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('interliningColour')]}> 
                          <SearchableDropdown
                            value={material.interliningColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningColour', selectedValue)}
                            options={['White', 'Black', 'Grey', 'Charcoal', 'DTM']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningColour'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('interliningPlacement')]}> 
                          <Input
                            type="text"
                            value={material.interliningPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningPlacement', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('interliningPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'interliningPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={'upload-interlining-placement-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-interlining-placement-' + materialIndex)?.click()}
                            >
                              {material.interliningPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="GSM" required width="sm" error={errors[getErrorKey('interliningGsm')]}> 
                          <Input
                            type="text"
                            value={material.interliningGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('interliningGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" required width="sm" error={errors[getErrorKey('interliningLength')]}> 
                          <Input
                            type="text"
                            value={material.interliningLength || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningLength', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('interliningLength')}
                          />
                        </Field>
                        <Field label="WIDTH" required width="sm" error={errors[getErrorKey('interliningWidth')]}> 
                          <Input
                            type="text"
                            value={material.interliningWidth || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningWidth', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('interliningWidth')}
                          />
                        </Field>
                      </div>
                    </>
                  )}
                  {/* INTERLINING(FUSING) - Complete fields matching table exactly */}
                  {material.trimAccessory === 'INTERLINING(FUSING)' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('interliningTestingRequirements')]}> 
                          <TestingRequirementsInput
                            value={Array.isArray(material.interliningTestingRequirements) ? material.interliningTestingRequirements : (material.interliningTestingRequirements ? [material.interliningTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'interliningTestingRequirements', arr)}
                            options={['Bond Strength', 'Residual Shrinkage', 'Wash Resistance', 'Strike-Through']}
                            placeholder="Select testing requirements"
                            className={hasError('interliningTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm">
                          <SearchableDropdown
                            value={material.interliningQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.interliningQtyType === 'Yardage (cns per pc)' ? (material.interliningYardage || '') : material.interliningQtyType === 'Kgs (cns per pc)' ? (material.interliningKgs || '') : ''}
                            onChange={(e) => {
                              if (material.interliningQtyType === 'Yardage (cns per pc)') {
                                handleChange(materialIndex, 'interliningYardage', e.target.value);
                              } else if (material.interliningQtyType === 'Kgs (cns per pc)') {
                                handleChange(materialIndex, 'interliningKgs', e.target.value);
                              }
                            }}
                            placeholder="Enter value"
                            disabled={!material.interliningQtyType}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('interliningSurplus')]}> 
                          <PercentInput
                            value={material.interliningSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningSurplus', e.target.value)}
                            error={hasError('interliningSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('interliningWastage')]}> 
                          <PercentInput
                            value={material.interliningWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningWastage', e.target.value)}
                            error={hasError('interliningWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('interliningApproval')]}> 
                          <SearchableDropdown
                            value={material.interliningApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.interliningRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningRemarks', e.target.value)}
                            placeholder="Hand feel required, Low shrinkage, Shell compatible"
                          />
                        </Field>
                      </div>
                      {/* INTERLINING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleChange(materialIndex, 'showInterliningAdvancedSpec', !material.showInterliningAdvancedSpec)}
                            className="border-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                              padding: '10px 20px',
                              height: '44px',
                              backgroundColor: material.showInterliningAdvancedSpec ? '#667eea' : '#ffffff',
                              borderColor: material.showInterliningAdvancedSpec ? '#667eea' : '#e5e7eb',
                              color: material.showInterliningAdvancedSpec ? '#ffffff' : '#374151'
                            }}
                            onMouseEnter={(e) => {
                              if (!material.showInterliningAdvancedSpec) {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#d1d5db';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!material.showInterliningAdvancedSpec) {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                              }
                            }}
                          >
                            ADVANCE SPEC
                          </button>
                        </div>
                        
                        {/* Advanced Spec Fields */}
                        {material.showInterliningAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-x-5 gap-y-5">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">DOT DENSITY</label>
                              <SearchableDropdown
                                value={material.interliningDotDensity || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'interliningDotDensity', selectedValue)}
                                options={['Light', 'Medium', 'Heavy (affects bond & hand)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH</label>
                              <SearchableDropdown
                                value={material.interliningStretch || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'interliningStretch', selectedValue)}
                                options={['Non-Stretch', 'Warp Stretch', 'Bi-Stretch (2-way)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">INTERLINING(FUSING) SPEC</label>
                              <SearchableDropdown
                                value={material.interliningFusingSpec || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'interliningFusingSpec', selectedValue)}
                                options={['Temperature (±5°C)', 'Pressure (±0.5 Bar)', 'Time (±1 sec)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">HAND FEEL</label>
                              <SearchableDropdown
                                value={material.interliningHandFeel || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'interliningHandFeel', selectedValue)}
                                options={['Soft', 'Medium', 'Crisp', 'Firm']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* HOOKS & EYES Fields - Complete implementation based on image data */}
                  {material.trimAccessory === 'HOOKS-EYES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('hookEyeType')]}> 
                          <SearchableDropdown
                            value={material.hookEyeType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeType', selectedValue)}
                            options={['Standard', 'Slider', 'Flat', 'Lingerie', 'Coat', 'Pants', 'Bra', 'Custom']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('hookEyeMaterial')]}> 
                          <SearchableDropdown
                            value={material.hookEyeMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeMaterial', selectedValue)}
                            options={['Metal (Steel)', 'Brass', 'Nylon Coated', 'Stainless Steel']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE" required width="sm" error={errors[getErrorKey('hookEyeSize')]}> 
                          <Input
                            type="text"
                            value={material.hookEyeSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeSize', e.target.value)}
                            placeholder="MM"
                            aria-invalid={hasError('hookEyeSize')}
                          />
                        </Field>
                        <Field label="COLOUR FINISH" required width="sm" error={errors[getErrorKey('hookEyeColourFinish')]}> 
                          <SearchableDropdown
                            value={material.hookEyeColourFinish || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeColourFinish', selectedValue)}
                            options={['Nickel', 'Black', 'Antique Brass', 'Gunmetal', 'Matte']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeColourFinish'))}
                          />
                        </Field>
                        <Field label="FINISH TYPE" required width="sm" error={errors[getErrorKey('hookEyeFinishType')]}> 
                          <SearchableDropdown
                            value={material.hookEyeFinishType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeFinishType', selectedValue)}
                            options={['Polished', 'Matte', 'Coated', 'Plated']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeFinishType'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('hookEyePlacement')]}> 
                          <Input
                            type="text"
                            value={material.hookEyePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyePlacement', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('hookEyePlacement')}
                          />
                        </Field>
                        <Field label="QTY" required width="sm" error={errors[getErrorKey('hookEyeQty')]}> 
                          <Input
                            type="text"
                            value={material.hookEyeQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeQty', e.target.value)}
                            placeholder="PCS"
                            aria-invalid={hasError('hookEyeQty')}
                          />
                        </Field>
                        <Field label="TESTING REQ." required width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('hookEyeTestingRequirements')]}> 
                          <TestingRequirementsInput
                            value={Array.isArray(material.hookEyeTestingRequirements) ? material.hookEyeTestingRequirements : (material.hookEyeTestingRequirements ? [material.hookEyeTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'hookEyeTestingRequirements', arr)}
                            options={['Holding Power', 'Corrosion', 'Needle Detection', 'Edge Smoothness']}
                            placeholder="Select testing requirements"
                            className={hasError('hookEyeTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('hookEyeSurplus')]}> 
                          <PercentInput
                            value={material.hookEyeSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeSurplus', e.target.value)}
                            error={hasError('hookEyeSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('hookEyeWastage')]}> 
                          <PercentInput
                            value={material.hookEyeWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeWastage', e.target.value)}
                            error={hasError('hookEyeWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('hookEyeApproval')]}> 
                          <SearchableDropdown
                            value={material.hookEyeApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.hookEyeRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeRemarks', e.target.value)}
                            placeholder="Flat bar, Prevent accidental release"
                          />
                        </Field>
                      </div>
                      {/* ADVANCE SPEC Button */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-start mt-4">
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'hookEyeAdvanceDataOpen', !material.hookEyeAdvanceDataOpen)}
                          className="border rounded-md cursor-pointer text-sm font-medium transition-all"
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            padding: '10px 16px',
                            marginBottom: '0'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                            e.currentTarget.style.transform = 'translateX(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          {material.hookEyeAdvanceDataOpen ? 'HIDE ADVANCE SPEC' : 'ADVANCE SPEC'}
                        </button>
                      </div>

                      {/* STRENGTH and APPLICATION - Only show when ADVANCE SPEC is open */}
                      {material.hookEyeAdvanceDataOpen && (
                        <>
                          {/* STRENGTH - From ADVANCE SPEC~UI */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">STRENGTH</label>
                            <SearchableDropdown
                              value={material.hookEyeStrength || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeStrength', selectedValue)}
                              options={['Holding Power (force to pull apart)']}
                              placeholder="Select or type"
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                            />
                          </div>

                          {/* APPLICATION - From ADVANCE SPEC~UI */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                            <SearchableDropdown
                              value={material.hookEyeApplication || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeApplication', selectedValue)}
                              options={['Waistband', 'Bra/Lingerie', 'Neckline', 'Fur Coat']}
                              placeholder="Select or type"
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* BUCKLES — Field, Input, PercentInput, TestingRequirementsInput, Button, shadcn tokens */}
                  {material.trimAccessory === 'BUCKLES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('bucklesType')]}>
                          <SearchableDropdown
                            value={material.bucklesType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesType', selectedValue)}
                            options={['Side Release', 'D-Ring', 'Tri-Glide', 'Ladder Lock', 'Belt Buckle', 'Cam Buckle', 'Snap', 'Swivel', 'Center Bar', 'O-Ring', 'Magnetic', 'Roller', 'Military/Web']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('bucklesType') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="MATERIAL DESC." required width="sm" error={errors[getErrorKey('bucklesMaterial')]}>
                          <SearchableDropdown
                            value={material.bucklesMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesMaterial', selectedValue)}
                            options={['Plastic (Nylon)', 'Plastic (POM/Acetal)', 'Plastic (ABS)', 'Metal (Brass)', 'Metal (Zinc)', 'Metal (Steel)', 'Metal (Stainless)', 'Metal (Aluminium)', 'Acetal/POM', 'Zinc Alloy Die-Cast', 'Carbon Fiber Look']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('bucklesMaterial') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="SIZE (Webbing Width)" required width="sm" error={errors[getErrorKey('bucklesSize')]}>
                          <SearchableDropdown
                            value={material.bucklesSize || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesSize', selectedValue)}
                            options={['10mm', '15mm', '20mm', '25mm', '32mm', '38mm', '50mm', '1"', '1.5"', '2"']}
                            placeholder="Select or type (CM)"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('bucklesSize') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="FINISH/COLOUR" required width="sm" error={errors[getErrorKey('bucklesFinishColour')]}>
                          <SearchableDropdown
                            value={material.bucklesFinishColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesFinishColour', selectedValue)}
                            options={['Black', 'Clear', 'DTM', 'Plating (Nickel)', 'Plating (Gunmetal)', 'Plating (Antique Brass)', 'Matte', 'Glossy', 'Antique', 'Plated (Nickel/Chrome)', 'Powder Coated', 'Anodized']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('bucklesFinishColour') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('bucklesPlacement')]}>
                          <Input
                            type="text"
                            value={material.bucklesPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesPlacement', e.target.value)}
                            placeholder="Enter placement location"
                            aria-invalid={hasError('bucklesPlacement')}
                          />
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.bucklesTestingRequirements) ? material.bucklesTestingRequirements : (material.bucklesTestingRequirements ? [material.bucklesTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'bucklesTestingRequirements', arr)}
                                options={['Tensile Load', 'Corrosion (Salt Spray)', 'UV Resistance', 'REACH']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'bucklesReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-buckles-ref-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-buckles-ref-${materialIndex}`)?.click()}
                            >
                              {material.bucklesReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                            </Button>
                          </div>
                        </Field>

                        <Field label="QTY" required width="sm" error={errors[getErrorKey('bucklesQty')]}>
                          <Input
                            type="text"
                            value={material.bucklesQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesQty', e.target.value)}
                            placeholder="Unit: Pieces"
                            aria-invalid={hasError('bucklesQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('bucklesSurplus')]}>
                          <PercentInput
                            value={material.bucklesSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesSurplus', e.target.value)}
                            error={hasError('bucklesSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('bucklesWastage')]}>
                          <PercentInput
                            value={material.bucklesWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesWastage', e.target.value)}
                            error={hasError('bucklesWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('bucklesApproval')]}>
                          <SearchableDropdown
                            value={material.bucklesApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.bucklesRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesRemarks', e.target.value)}
                            placeholder="e.g., Finger guard, Outdoor suitable, Smooth edges"
                          />
                        </Field>
                      </div>

                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showBucklesAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showBucklesAdvancedSpec', !material.showBucklesAdvancedSpec)}
                        >
                          {material.showBucklesAdvancedSpec ? '− Advance Spec' : '+ Advance Spec'}
                        </Button>
                      </div>
                      {material.showBucklesAdvancedSpec && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                          <Field label="FUNCTION" width="sm">
                            <SearchableDropdown
                              value={material.bucklesFunction || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'bucklesFunction', selectedValue)}
                              options={['Load Bearing', 'Decorative', 'Quick Release', 'Adjustable', 'Auto-Lock', 'Swivel']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="TENSILE STRENGTH" width="sm">
                            <SearchableDropdown
                              value={material.bucklesTensileStrength || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'bucklesTensileStrength', selectedValue)}
                              options={['Break Strength (100kg)', 'Break Strength (500N)', 'Light Duty (<50 kg)', 'Standard (50-150 kg)', 'Heavy Duty (150-500 kg)', 'Safety (>500 kg)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="SAFETY" width="sm">
                            <SearchableDropdown
                              value={material.bucklesSafety || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'bucklesSafety', selectedValue)}
                              options={['Standard', 'Child-Safe', 'Breakaway (safety release)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                        </div>
                      )}
                    </>
                  )}


                  {/* SHOULDER PADS / CUPS Fields - Complete implementation based on image data */}
                  {material.trimAccessory === 'SHOULDER PADS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('shoulderPadType')]}>
                          <SearchableDropdown
                            value={material.shoulderPadType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadType', selectedValue)}
                            options={['Set-In Pad', 'Raglan Pad', 'Sleeve Head Roll', 'Bra Cup', 'Push-Up Pad', 'Removable Insert']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('shoulderPadMaterial')]}>
                          <SearchableDropdown
                            value={material.shoulderPadMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadMaterial', selectedValue)}
                            options={['Foam (Polyurethane)', 'Synthetic Fiber', 'Felt', 'Cotton Wadding']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" required width="sm" error={errors[getErrorKey('shoulderPadSize')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadSize', e.target.value)}
                            placeholder="Dimensions (LxWxThickness) / Cup Size (A, B, C, D) CM"
                            aria-invalid={hasError('shoulderPadSize')}
                          />
                        </Field>
                        <Field label="THICKNESS" required width="sm" error={errors[getErrorKey('shoulderPadThickness')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadThickness || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadThickness', e.target.value)}
                            placeholder="At center/edge (e.g., 5mm center, 3mm edge) CM"
                            aria-invalid={hasError('shoulderPadThickness')}
                          />
                        </Field>
                        <Field label="SHAPE" required width="sm" error={errors[getErrorKey('shoulderPadShape')]}>
                          <SearchableDropdown
                            value={material.shoulderPadShape || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadShape', selectedValue)}
                            options={['Crescent', 'Triangular', 'Oval', 'Round', 'Custom Molded']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadShape'))}
                          />
                        </Field>
                        <Field label="COVERING" required width="sm" error={errors[getErrorKey('shoulderPadCovering')]}>
                          <SearchableDropdown
                            value={material.shoulderPadCovering || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadCovering', selectedValue)}
                            options={['Covered (knit/non-woven)', 'Uncovered (raw)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadCovering'))}
                          />
                        </Field>
                        <Field label="COVERING COLOUR" required width="sm" error={errors[getErrorKey('shoulderPadCoveringColour')]}>
                          <SearchableDropdown
                            value={material.shoulderPadCoveringColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadCoveringColour', selectedValue)}
                            options={['White', 'Black', 'DTM', 'Nude']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadCoveringColour'))}
                          />
                        </Field>
                        <Field label="ATTACHMENT" required width="sm" error={errors[getErrorKey('shoulderPadAttachment')]}>
                          <SearchableDropdown
                            value={material.shoulderPadAttachment || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadAttachment', selectedValue)}
                            options={['Sew-In', 'Fusible (adhesive)', 'Removable (pocket)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadAttachment'))}
                          />
                        </Field>
                        <Field label="DENSITY" required width="sm" error={errors[getErrorKey('shoulderPadDensity')]}>
                          <SearchableDropdown
                            value={material.shoulderPadDensity || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadDensity', selectedValue)}
                            options={['Soft', 'Medium', 'Firm']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadDensity'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('shoulderPadPlacement')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadPlacement', e.target.value)}
                            placeholder="TEXT"
                            aria-invalid={hasError('shoulderPadPlacement')}
                          />
                        </Field>
                        <Field label="REF IMAGE" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleChange(materialIndex, 'shoulderPadReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-reference-image-${materialIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-reference-image-${materialIndex}`)?.click()}
                            >
                              {material.shoulderPadReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <TestingRequirementsInput
                            value={Array.isArray(material.shoulderPadTestingRequirements) ? material.shoulderPadTestingRequirements : (material.shoulderPadTestingRequirements ? [material.shoulderPadTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'shoulderPadTestingRequirements', arr)}
                            options={['Wash Resistance', 'Flammability', 'Hypoallergenic']}
                            placeholder="Select testing requirements"
                          />
                        </Field>
                        <Field label="QTY" required width="sm" error={errors[getErrorKey('shoulderPadQty')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadQty', e.target.value)}
                            placeholder="Pairs"
                            aria-invalid={hasError('shoulderPadQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('shoulderPadSurplus')]}>
                          <PercentInput
                            value={material.shoulderPadSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadSurplus', e.target.value)}
                            error={hasError('shoulderPadSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('shoulderPadWastage')]}>
                          <PercentInput
                            value={material.shoulderPadWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadWastage', e.target.value)}
                            error={hasError('shoulderPadWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('shoulderPadApproval')]}>
                          <SearchableDropdown
                            value={material.shoulderPadApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.shoulderPadRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadRemarks', e.target.value)}
                            placeholder="Lightweight, Resilient, Hold shape after steam"
                          />
                        </Field>
                      </div>
                    </>
                  )}

                  {/* RIBBING Fields */}
                  {material.trimAccessory === 'RIBBING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('ribbingType')]}>
                          <SearchableDropdown
                            value={material.ribbingType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ribbingType', selectedValue)}
                            options={['1x1 Rib', '2x2 Rib', 'Interlock', 'Jersey']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ribbingType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('ribbingMaterial')]}>
                          <SearchableDropdown
                            value={material.ribbingMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ribbingMaterial', selectedValue)}
                            options={['Cotton', 'Polyester', 'Spandex', 'Blend']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ribbingMaterial'))}
                          />
                        </Field>
                        <Field label="NO OF COLOURS" required width="sm" error={errors[getErrorKey('ribbingColour')]}>
                          <Input
                            type="number"
                            min="0"
                            value={material.ribbingColour || ''}
                            onChange={(e) => {
                              const nextValue = e.target.value;
                              handleChange(materialIndex, 'ribbingColour', nextValue);
                              trimFileArrayToCount('ribbingColorReference', toCount(nextValue));
                            }}
                            placeholder="Enter number of colours"
                            aria-invalid={hasError('ribbingColour')}
                          />
                        </Field>
                        {toCount(material.ribbingColour) > 0 && (
                          <Field label="COLOR REFS" className="col-span-1 md:col-span-2 lg:col-span-5 w-full">
                            <div className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(160px,160px))] gap-3">
                              {Array.from({ length: toCount(material.ribbingColour) }).map((_, index) => {
                                const uploadId = 'upload-ribbing-color-' + materialIndex + '-' + index;
                                const file = getFileArray('ribbingColorReference')[index];
                                return (
                                  <div key={uploadId} className="flex flex-col min-w-0">
                                    <input
                                      type="file"
                                      onChange={(e) => updateFileArrayAtIndex('ribbingColorReference', index, e.target.files[0])}
                                      className="hidden"
                                      id={uploadId}
                                      accept="image/*"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-11 w-full px-3 whitespace-nowrap"
                                      onClick={() => document.getElementById(uploadId)?.click()}
                                    >
                                      {file ? 'UPLOADED COLOR ' + (index + 1) : 'COLOR ' + (index + 1)}
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </Field>
                        )}
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('ribbingPlacement')]}>
                          <Input
                            type="text"
                            value={material.ribbingPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'ribbingPlacement', e.target.value)}
                            placeholder="PLACEMENT"
                            aria-invalid={hasError('ribbingPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'ribbingPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={'upload-ribbing-placement-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-ribbing-placement-' + materialIndex)?.click()}
                            >
                              {material.ribbingPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <TestingRequirementsInput
                            value={Array.isArray(material.ribbingTestingRequirements) ? material.ribbingTestingRequirements : (material.ribbingTestingRequirements ? [material.ribbingTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'ribbingTestingRequirements', arr)}
                            options={['Recovery', 'Dimensional Stability', 'Colorfastness', 'Abrasion']}
                            placeholder="Select testing requirements"
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm">
                          <SearchableDropdown
                            value={material.ribbingQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ribbingQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.ribbingQtyType === 'Yardage (cns per pc)' ? (material.ribbingQtyYardage || '') : material.ribbingQtyType === 'Kgs (cns per pc)' ? (material.ribbingQtyKgs || '') : ''}
                            onChange={(e) => {
                              if (material.ribbingQtyType === 'Yardage (cns per pc)') {
                                handleChange(materialIndex, 'ribbingQtyYardage', e.target.value);
                              } else if (material.ribbingQtyType === 'Kgs (cns per pc)') {
                                handleChange(materialIndex, 'ribbingQtyKgs', e.target.value);
                              }
                            }}
                            placeholder="Enter value"
                            disabled={!material.ribbingQtyType}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('ribbingSurplus')]}
                        >
                          <PercentInput
                            value={material.ribbingSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'ribbingSurplus', e.target.value)}
                            error={hasError('ribbingSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('ribbingWastage')]}
                        >
                          <PercentInput
                            value={material.ribbingWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'ribbingWastage', e.target.value)}
                            error={hasError('ribbingWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('ribbingApproval')]}
                        >
                          <SearchableDropdown
                            value={material.ribbingApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ribbingApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ribbingApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.ribbingRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'ribbingRemarks', e.target.value)}
                            placeholder="Anti-curl on cut edge, 5% Lycra minimum"
                          />
                        </Field>
                      </div>
                      {/* RIBBING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showRibbingAdvancedSpec', !material.showRibbingAdvancedSpec)}
                          style={{
                            backgroundColor: material.showRibbingAdvancedSpec ? '#667eea' : '#ffffff',
                            borderColor: material.showRibbingAdvancedSpec ? '#667eea' : '#e5e7eb',
                            color: material.showRibbingAdvancedSpec ? '#ffffff' : '#374151',
                            border: '2px solid',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s',
                            boxShadow: material.showRibbingAdvancedSpec ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!material.showRibbingAdvancedSpec) {
                              e.target.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!material.showRibbingAdvancedSpec) {
                              e.target.style.backgroundColor = '#ffffff';
                            }
                          }}
                        >
                          {material.showRibbingAdvancedSpec ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                        </button>
                        {material.showRibbingAdvancedSpec && (
                          <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH %</label>
                                <SearchableDropdown
                                  value={material.ribbingStretchPercent || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'ribbingStretchPercent', selectedValue)}
                                  options={['Elongation (80% minimum)', 'Recovery %']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">CUTTING</label>
                                <SearchableDropdown
                                  value={material.ribbingCutting || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'ribbingCutting', selectedValue)}
                                  options={['Cut Open (flat)', 'Tubular (continuous)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">SPANDEX CONTENT</label>
                                <SearchableDropdown
                                  value={material.ribbingSpandexContent || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'ribbingSpandexContent', selectedValue)}
                                  options={['0%', '3%', '5%', '7%', '10%']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-CURL</label>
                                <SearchableDropdown
                                  value={material.ribbingAntiCurl || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'ribbingAntiCurl', selectedValue)}
                                  options={['Standard', 'Anti-Curl Treatment']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* CABLE-TIES — Field, Input, PercentInput, TestingRequirementsInput, Button, shadcn tokens */}
                  {material.trimAccessory === 'CABLE-TIES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('cableTieType')]}>
                          <SearchableDropdown
                            value={material.cableTieType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieType', selectedValue)}
                            options={['Standard Lock', 'Releasable/Reusable', 'Bar-Lok Loop (hang tags)', 'Security Tie']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('cableTieType') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('cableTieMaterial')]}>
                          <SearchableDropdown
                            value={material.cableTieMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieMaterial', selectedValue)}
                            options={['Nylon (PA66)', 'Polypropylene (PP)', 'Metal Detectable']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('cableTieMaterial') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="SIZE SPEC" required width="sm" error={errors[getErrorKey('cableTieSize')]}>
                          <SearchableDropdown
                            value={material.cableTieSize || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieSize', selectedValue)}
                            options={['100x2.5mm', '150x3.6mm', '200x4.8mm']}
                            placeholder="Select or type (CM)"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('cableTieSize') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('cableTieColour')]}>
                          <SearchableDropdown
                            value={material.cableTieColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieColour', selectedValue)}
                            options={['Clear/Natural', 'Black', 'Custom']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('cableTieColour') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('cableTiePlacement')]}>
                          <Input
                            type="text"
                            value={material.cableTiePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTiePlacement', e.target.value)}
                            placeholder="Enter placement location"
                            aria-invalid={hasError('cableTiePlacement')}
                          />
                        </Field>

                        <Field label="TESTING REQ." required width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('cableTieTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.cableTieTestingRequirements) ? material.cableTieTestingRequirements : (material.cableTieTestingRequirements ? [material.cableTieTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'cableTieTestingRequirements', arr)}
                                options={['Tensile Test', 'UV Resistance', 'Chemical Resistance']}
                                placeholder="Select testing requirements"
                                className={hasError('cableTieTestingRequirements') ? 'border-red-600' : ''}
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'cableTieReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-cable-ref-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-cable-ref-${materialIndex}`)?.click()}
                            >
                              {material.cableTieReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                            </Button>
                          </div>
                        </Field>

                        <Field label="QTY" required width="sm" error={errors[getErrorKey('cableTieQty')]}>
                          <Input
                            type="text"
                            value={material.cableTieQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTieQty', e.target.value)}
                            placeholder="Unit: Pieces"
                            aria-invalid={hasError('cableTieQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('cableTieSurplus')]}>
                          <PercentInput
                            value={material.cableTieSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTieSurplus', e.target.value)}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm">
                          <PercentInput
                            value={material.cableTieWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTieWastage', e.target.value)}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm">
                          <SearchableDropdown
                            value={material.cableTieApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.cableTieRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTieRemarks', e.target.value)}
                            placeholder="e.g., Rounded non-scratching edges, Operating temperature"
                          />
                        </Field>
                      </div>

                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showCableTieAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showCableTieAdvancedSpec', !material.showCableTieAdvancedSpec)}
                        >
                          {material.showCableTieAdvancedSpec ? '− Advance Spec' : '+ Advance Spec'}
                        </Button>
                      </div>
                      {material.showCableTieAdvancedSpec && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                          <Field label="TENSILE STRENGTH" width="sm">
                            <SearchableDropdown
                              value={material.cableTieTensileStrength || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'cableTieTensileStrength', selectedValue)}
                              options={['Holding Force (8kg)', 'Holding Force (18kg)', 'Holding Force (22kg)', 'Holding Force (55kg)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="FINISH" width="sm">
                            <SearchableDropdown
                              value={material.cableTieFinish || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'cableTieFinish', selectedValue)}
                              options={['Smooth Edge', 'Rounded Head']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="UV RESISTANCE" width="sm">
                            <SearchableDropdown
                              value={material.cableTieUvResistance || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'cableTieUvResistance', selectedValue)}
                              options={['Standard (Indoor)', 'UV Stabilized (Outdoor)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                        </div>
                      )}
                    </>
                  )}

                  {/* SEAM TAPE Fields */}
                  {material.trimAccessory === 'SEAM TAPE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('seamTapeType')]}> 
                          <SearchableDropdown
                            value={material.seamTapeType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeType', selectedValue)}
                            options={['2-Layer (PU/PVC)', '3-Layer (Tri-laminate)', 'Adhesive Film', 'Elastic Tape', 'Hot Melt Seam Tape', 'PU Seam Tape', 'TPU Tape', 'Reflective Seam Tape', 'Reinforcement Tape', 'Edge Binding Tape', 'Waterproof Sealing', 'Stretch Seam Support', 'Edge Stabilization', 'Hem Tape', 'Shoulder Tape']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('seamTapeMaterial')]}> 
                          <SearchableDropdown
                            value={material.seamTapeMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeMaterial', selectedValue)}
                            options={['TPU (Thermoplastic Polyurethane)', 'PEVA', 'PU', 'Nylon Backing']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeMaterial'))}
                          />
                        </Field>
                        <Field label="WIDTH" required width="sm" error={errors[getErrorKey('seamTapeWidth')]}> 
                          <SearchableDropdown
                            value={material.seamTapeWidth || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeWidth', selectedValue)}
                            options={['16mm', '20mm', '22mm', '25mm', '30mm']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeWidth'))}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('seamTapeColour')]}> 
                          <SearchableDropdown
                            value={material.seamTapeColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeColour', selectedValue)}
                            options={['Clear/Transparent', 'Black', 'DTM (rare)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeColour'))}
                          />
                        </Field>
                        <Field label="ADHESIVE TYPE" required width="sm" error={errors[getErrorKey('seamTapeAdhesiveType')]}> 
                          <SearchableDropdown
                            value={material.seamTapeAdhesiveType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeAdhesiveType', selectedValue)}
                            options={['Heat Activated', 'Low Melting Point', 'High Bond']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeAdhesiveType'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('seamTapePlacement')]}> 
                          <Input
                            type="text"
                            value={material.seamTapePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapePlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('seamTapePlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'seamTapePlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={'upload-seam-tape-placement-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-seam-tape-placement-' + materialIndex)?.click()}
                            >
                              {material.seamTapePlacementReferenceImage ? 'UPLOADED' : 'IMAGE REF'}
                            </Button>
                          </div>
                        </Field>
                      </div>
                    </>
                  )}
                  {/* SEAM TAPE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'SEAM TAPE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('seamTapeTestingRequirements')]}> 
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.seamTapeTestingRequirements) ? material.seamTapeTestingRequirements : (material.seamTapeTestingRequirements ? [material.seamTapeTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'seamTapeTestingRequirements', arr)}
                                options={['Hydrostatic Head', 'Wash Resistance', 'Adhesion/Peel Test']}
                                placeholder="Select testing requirements"
                                className={hasError('seamTapeTestingRequirements') ? 'border-red-600' : ''}
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'seamTapeTestingRequirementFile', e.target.files[0])}
                              className="hidden"
                              id={'upload-seam-tape-testing-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-seam-tape-testing-' + materialIndex)?.click()}
                            >
                              {material.seamTapeTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="QTY" required width="sm" error={errors[getErrorKey('seamTapeQty')]}> 
                          <Input
                            type="text"
                            value={material.seamTapeQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapeQty', e.target.value)}
                            placeholder="Meters"
                            aria-invalid={hasError('seamTapeQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('seamTapeSurplus')]}> 
                          <PercentInput
                            value={material.seamTapeSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapeSurplus', e.target.value)}
                            error={hasError('seamTapeSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('seamTapeWastage')]}> 
                          <PercentInput
                            value={material.seamTapeWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapeWastage', e.target.value)}
                            error={hasError('seamTapeWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('seamTapeApproval')]}> 
                          <SearchableDropdown
                            value={material.seamTapeApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.seamTapeRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapeRemarks', e.target.value)}
                            placeholder="Matte exterior, Specific hot-air welding machine"
                          />
                        </Field>
                      </div>
                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showSeamTapeAdvancedSpec', !material.showSeamTapeAdvancedSpec)}
                          className="border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5 self-start"
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            marginBottom: '16px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                        >
                          {material.showSeamTapeAdvancedSpec ? '− ADVANCE SPEC' : '+ ADVANCE SPEC'}
                        </button>
                        {material.showSeamTapeAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 mt-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION SPEC</label>
                              <SearchableDropdown
                                value={material.seamTapeApplicationSpec || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeApplicationSpec', selectedValue)}
                                options={['Temperature (±5°C)', 'Speed (m/min)', 'Pressure (Bar)', 'Waterproof Sealing', 'Stretch Seam Support', 'Edge Stabilization', 'Hem Tape', 'Shoulder Tape']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ELASTICITY</label>
                              <SearchableDropdown
                                value={material.seamTapeElasticity || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeElasticity', selectedValue)}
                                options={['Stretch % (must match fabric)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">BREATHABILITY</label>
                              <SearchableDropdown
                                value={material.seamTapeBreathability || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeBreathability', selectedValue)}
                                options={['Breathable (MVTR rating)', 'Non-Breathable']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* REFLECTIVE TAPES Fields */}
                  {material.trimAccessory === 'REFLECTIVE TAPES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('reflectiveTapeType')]}> 
                          <SearchableDropdown
                            value={material.reflectiveTapeType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeType', selectedValue)}
                            options={['Sew-on Tape', 'Heat Transfer Film', 'Piping', 'Segmented/Perforated', 'Stretch Reflective']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('reflectiveTapeMaterial')]}> 
                          <SearchableDropdown
                            value={material.reflectiveTapeMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeMaterial', selectedValue)}
                            options={['Glass Bead Technology', 'Micro-Prismatic Vinyl (higher)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeMaterial'))}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('reflectiveTapeColour')]}> 
                          <SearchableDropdown
                            value={material.reflectiveTapeColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeColour', selectedValue)}
                            options={['Silver/Grey', 'Fluorescent Yellow/Lime', 'Fluorescent Orange', 'Coloured']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeColour'))}
                          />
                        </Field>
                        <Field label="BASE FABRIC" required width="sm" error={errors[getErrorKey('reflectiveTapeBaseFabric')]}> 
                          <SearchableDropdown
                            value={material.reflectiveTapeBaseFabric || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeBaseFabric', selectedValue)}
                            options={['Polyester', 'Cotton', 'FR (flame retardant)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeBaseFabric'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('reflectiveTapePlacement')]}> 
                          <Input
                            type="text"
                            value={material.reflectiveTapePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapePlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('reflectiveTapePlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'reflectiveTapePlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={'upload-reflective-tape-placement-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-reflective-tape-placement-' + materialIndex)?.click()}
                            >
                              {material.reflectiveTapePlacementReferenceImage ? 'UPLOADED' : 'IMAGE REF'}
                            </Button>
                          </div>
                        </Field>
                      </div>
                    </>
                  )}
                  {/* REFLECTIVE TAPES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'REFLECTIVE TAPES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" error={errors[getErrorKey('reflectiveTapeTestingRequirements')]}> 
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.reflectiveTapeTestingRequirements) ? material.reflectiveTapeTestingRequirements : (material.reflectiveTapeTestingRequirements ? [material.reflectiveTapeTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'reflectiveTapeTestingRequirements', arr)}
                                options={['Reflectivity', 'Abrasion', 'Wash Durability', 'Colour Fastness']}
                                placeholder="Select testing requirements"
                                className={hasError('reflectiveTapeTestingRequirements') ? 'border-red-600' : ''}
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'reflectiveTapeTestingRequirementFile', e.target.files[0])}
                              className="hidden"
                              id={'upload-reflective-tape-testing-' + materialIndex}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById('upload-reflective-tape-testing-' + materialIndex)?.click()}
                            >
                              {material.reflectiveTapeTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="GSM" required width="sm" error={errors[getErrorKey('reflectiveTapeGsm')]}> 
                          <Input
                            type="text"
                            value={material.reflectiveTapeGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('reflectiveTapeGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" required width="sm" error={errors[getErrorKey('reflectiveTapeLengthCm')]}> 
                          <Input
                            type="text"
                            value={material.reflectiveTapeLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('reflectiveTapeLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" required width="sm" error={errors[getErrorKey('reflectiveTapeWidthCm')]}> 
                          <Input
                            type="text"
                            value={material.reflectiveTapeWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('reflectiveTapeWidthCm')}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm">
                          <SearchableDropdown
                            value={material.reflectiveTapeQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.reflectiveTapeQtyType === 'Yardage (cns per pc)' ? (material.reflectiveTapeYardage || '') : material.reflectiveTapeQtyType === 'Kgs (cns per pc)' ? (material.reflectiveTapeKgs || '') : ''}
                            onChange={(e) => {
                              if (material.reflectiveTapeQtyType === 'Yardage (cns per pc)') {
                                handleChange(materialIndex, 'reflectiveTapeYardage', e.target.value);
                              } else if (material.reflectiveTapeQtyType === 'Kgs (cns per pc)') {
                                handleChange(materialIndex, 'reflectiveTapeKgs', e.target.value);
                              }
                            }}
                            placeholder="Enter value"
                            disabled={!material.reflectiveTapeQtyType}
                          />
                        </Field>
                        <Field label="SURPLUS %" required width="sm" error={errors[getErrorKey('reflectiveTapeSurplus')]}> 
                          <PercentInput
                            value={material.reflectiveTapeSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeSurplus', e.target.value)}
                            error={hasError('reflectiveTapeSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" required width="sm" error={errors[getErrorKey('reflectiveTapeWastage')]}> 
                          <PercentInput
                            value={material.reflectiveTapeWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeWastage', e.target.value)}
                            error={hasError('reflectiveTapeWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" required width="sm" error={errors[getErrorKey('reflectiveTapeApproval')]}> 
                          <SearchableDropdown
                            value={material.reflectiveTapeApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Compliance Certificate']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.reflectiveTapeRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeRemarks', e.target.value)}
                            placeholder="Industrial launder compatible, No peel or crack"
                          />
                        </Field>
                      </div>
                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showReflectiveTapeAdvancedSpec', !material.showReflectiveTapeAdvancedSpec)}
                          className="border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5 self-start"
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            marginBottom: '16px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                        >
                          {material.showReflectiveTapeAdvancedSpec ? '− ADVANCE SPEC' : '+ ADVANCE SPEC'}
                        </button>
                        {material.showReflectiveTapeAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 mt-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
                              <SearchableDropdown
                                value={material.reflectiveTapeCertification || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeCertification', selectedValue)}
                                options={['ISO 20471', 'ANSI/ISEA 107', 'EN 469', 'EN 1150']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">WASH DURABILITY</label>
                              <SearchableDropdown
                                value={material.reflectiveTapeWashDurability || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeWashDurability', selectedValue)}
                                options={['Wash cycles maintaining reflectivity (25, 50, Industrial)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">REFLECTIVITY</label>
                              <SearchableDropdown
                                value={material.reflectiveTapeReflectivity || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeReflectivity', selectedValue)}
                                options={['Retro-reflection Coefficient (cd/lux/m²) - Class 1, 2']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* FR-TRIMS Fields */}
                  {material.trimAccessory === 'FIRE RETARDANT (FR) TRIMS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('frTrimsType')]}> 
                          <SearchableDropdown
                            value={material.frTrimsType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsType', selectedValue)}
                            options={['FR Thread', 'FR Elastic', 'FR Zippers', 'FR Interlining', 'FR Velcro', 'FR Reflective', 'FR Labels', 'FR Webbing']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('frTrimsMaterial')]}> 
                          <SearchableDropdown
                            value={material.frTrimsMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsMaterial', selectedValue)}
                            options={['Aramid (Nomex/Kevlar)', 'Modacrylic', 'Treated Polyester', 'Treated Cotton', 'FR Nylon']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsMaterial'))}
                          />
                        </Field>
                        <Field label="COMPLIANCE" required width="sm" error={errors[getErrorKey('frTrimsCompliance')]}> 
                          <SearchableDropdown
                            value={material.frTrimsCompliance || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsCompliance', selectedValue)}
                            options={['NFPA 2112', 'EN ISO 11612', 'BS 5852', 'NFPA 70E', 'EN 469']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsCompliance'))}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('frTrimsColour')]}> 
                          <SearchableDropdown
                            value={material.frTrimsColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsColour', selectedValue)}
                            options={[]}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsColour'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm">
                          <Input
                            type="text"
                            value={material.frTrimsPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'frTrimsPlacement', e.target.value)}
                            placeholder="TEXT"
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'frTrimsPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-fr-trims-placement-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-fr-trims-placement-${materialIndex}`)?.click()}
                            >
                              {material.frTrimsPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.frTrimsTestingRequirements) ? material.frTrimsTestingRequirements : (material.frTrimsTestingRequirements ? [material.frTrimsTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'frTrimsTestingRequirements', arr)}
                                options={['Vertical Flame Test', 'LOI', 'Wash Durability (re-test after wash)']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'frTrimsTestingRequirementFile', e.target.files[0])}
                              className="hidden"
                              id={`upload-fr-trims-testing-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-fr-trims-testing-${materialIndex}`)?.click()}
                            >
                              {material.frTrimsTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                      </div>
                    </>
                  )}
                  {/* FR-TRIMS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FIRE RETARDANT (FR) TRIMS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="QTY TYPE" width="sm">
                          <SearchableDropdown
                            value={material.frTrimsQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Pieces']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.frTrimsQtyType === 'Yardage (cns per pc)' ? (material.frTrimsQtyYardage || '') : material.frTrimsQtyType === 'Pieces' ? (material.frTrimsQtyPieces || '') : ''}
                            onChange={(e) => {
                              if (material.frTrimsQtyType === 'Yardage (cns per pc)') {
                                handleChange(materialIndex, 'frTrimsQtyYardage', e.target.value);
                              } else if (material.frTrimsQtyType === 'Pieces') {
                                handleChange(materialIndex, 'frTrimsQtyPieces', e.target.value);
                              }
                            }}
                            placeholder="Enter value"
                            disabled={!material.frTrimsQtyType}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" error={errors[getErrorKey('frTrimsSurplus')]}> 
                          <PercentInput
                            value={material.frTrimsSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'frTrimsSurplus', e.target.value)}
                            error={hasError('frTrimsSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" error={errors[getErrorKey('frTrimsWastage')]}> 
                          <PercentInput
                            value={material.frTrimsWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'frTrimsWastage', e.target.value)}
                            error={hasError('frTrimsWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" error={errors[getErrorKey('frTrimsApproval')]}> 
                          <SearchableDropdown
                            value={material.frTrimsApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Certification Report']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.frTrimsRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'frTrimsRemarks', e.target.value)}
                            placeholder="Inherently FR (not treated), Aramid fiber compatible"
                          />
                        </Field>
                      </div>
                      
                      {/* FR-TRIMS - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showFrTrimsAdvancedSpec', !material.showFrTrimsAdvancedSpec)}
                          style={{
                            backgroundColor: material.showFrTrimsAdvancedSpec ? '#667eea' : '#ffffff',
                            borderColor: material.showFrTrimsAdvancedSpec ? '#667eea' : '#e5e7eb',
                            color: material.showFrTrimsAdvancedSpec ? '#ffffff' : '#374151',
                            border: '2px solid',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s',
                            boxShadow: material.showFrTrimsAdvancedSpec ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!material.showFrTrimsAdvancedSpec) {
                              e.target.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!material.showFrTrimsAdvancedSpec) {
                              e.target.style.backgroundColor = '#ffffff';
                            }
                          }}
                        >
                          {material.showFrTrimsAdvancedSpec ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                        </button>
                        {material.showFrTrimsAdvancedSpec && (
                          <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                                <SearchableDropdown
                                  value={material.frTrimsDurability || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsDurability', selectedValue)}
                                  options={['Inherently FR (natural)', 'Treated FR (chemical, limited life)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">FR COMPONENTS</label>
                                <SearchableDropdown
                                  value={material.frTrimsFrComponents || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsFrComponents', selectedValue)}
                                  options={['All components must be FR (teeth, tape, thread)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">LOI</label>
                                <SearchableDropdown
                                  value={material.frTrimsLoi || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsLoi', selectedValue)}
                                  options={['Limiting Oxygen Index (>28% for self-extinguishing)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">CHAR LENGTH</label>
                                <SearchableDropdown
                                  value={material.frTrimsCharLength || ''}
                                  onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsCharLength', selectedValue)}
                                  options={['Maximum char length in vertical flame test']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>)}

                  {/* CORD RING Fields */}
                  {material.trimAccessory === 'CORD STOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('cordStopType')]}>
                          <SearchableDropdown
                            value={material.cordStopType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopType', selectedValue)}
                            options={['Single Hole', 'Double Hole', 'Barrel Lock', 'Toggle', 'Spring Loaded', 'Squeeze Release', 'Ball Lock']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('cordStopMaterial')]}>
                          <SearchableDropdown
                            value={material.cordStopMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopMaterial', selectedValue)}
                            options={['Plastic (Acetal/POM)', 'Plastic (Nylon)', 'Plastic (ABS)', 'Metal (Zinc Alloy)', 'Metal (Brass)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" required width="sm" error={errors[getErrorKey('cordStopSize')]}>
                          <SearchableDropdown
                            value={material.cordStopSize || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopSize', selectedValue)}
                            options={['3mm', '4mm', '5mm', '6mm']}
                            placeholder="Select or type (Cord Diameter fit)"
                            className={dropdownClass(hasError('cordStopSize'))}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('cordStopColour')]}>
                          <SearchableDropdown
                            value={material.cordStopColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopColour', selectedValue)}
                            options={['DTM', 'Black', 'Clear', 'Plating (metal)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopColour'))}
                          />
                        </Field>
                        <Field label="LOCKING MECHANISM" required width="sm" error={errors[getErrorKey('cordStopLockingMechanism')]}>
                          <SearchableDropdown
                            value={material.cordStopLockingMechanism || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopLockingMechanism', selectedValue)}
                            options={['Spring Tension (force to depress)', 'Grip Type']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopLockingMechanism'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('cordStopPlacement')]}>
                          <Input
                            type="text"
                            value={material.cordStopPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopPlacement', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('cordStopPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'cordStopPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-cord-placement-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-cord-placement-${materialIndex}`)?.click()}
                            >
                              {material.cordStopPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                      </div>
                    </>
                  )}

                  {/* CORD RING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'CORD STOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.cordStopTestingRequirements) ? material.cordStopTestingRequirements : (material.cordStopTestingRequirements ? [material.cordStopTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'cordStopTestingRequirements', arr)}
                                options={['Locking Strength', 'UV Resistance', 'Cold Weather', 'Non-Toxic']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'cordStopPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-cord-placement-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-cord-placement-${materialIndex}`)?.click()}
                            >
                              {material.cordStopPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.cordStopQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopQty', e.target.value)}
                            placeholder="Unit: Pieces"
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" error={errors[getErrorKey('cordStopSurplus')]}>
                          <PercentInput
                            value={material.cordStopSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopSurplus', e.target.value)}
                            error={hasError('cordStopSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" error={errors[getErrorKey('cordStopWastage')]}>
                          <PercentInput
                            value={material.cordStopWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopWastage', e.target.value)}
                            error={hasError('cordStopWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" error={errors[getErrorKey('cordStopApproval')]}>
                          <SearchableDropdown
                            value={material.cordStopApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Functionality Approval']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.cordStopRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopRemarks', e.target.value)}
                            placeholder="Ergonomic grip, No snagging on cord opening"
                          />
                        </Field>
                      </div>

                      {/* CORD RING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleChange(materialIndex, 'showCordStopAdvancedSpec', !material.showCordStopAdvancedSpec)}
                            className="border-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                              padding: '10px 20px',
                              height: '44px',
                              backgroundColor: material.showCordStopAdvancedSpec ? '#667eea' : '#ffffff',
                              borderColor: material.showCordStopAdvancedSpec ? '#667eea' : '#e5e7eb',
                              color: material.showCordStopAdvancedSpec ? '#ffffff' : '#374151'
                            }}
                            onMouseEnter={(e) => {
                              if (!material.showCordStopAdvancedSpec) {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#d1d5db';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!material.showCordStopAdvancedSpec) {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                              }
                            }}
                          >
                            ADVANCE SPEC
                          </button>
                        </div>
                        
                        {/* Advanced Spec Fields */}
                        {material.showCordStopAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-x-5 gap-y-5">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                              <SearchableDropdown
                                value={material.cordStopFunction || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'cordStopFunction', selectedValue)}
                                options={['Adjustment', 'Decoration', "Safety Breakaway (children's wear)"]}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">BREAKAWAY</label>
                              <SearchableDropdown
                                value={material.cordStopBreakaway || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'cordStopBreakaway', selectedValue)}
                                options={['Standard', 'Safety Breakaway (child safety)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* RINGS-LOOPS Fields */}
                  {material.trimAccessory === 'RINGS-LOOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('ringsLoopsType')]}> 
                          <SearchableDropdown
                            value={material.ringsLoopsType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsType', selectedValue)}
                            options={['D-Ring (Welded/Non-Welded)', 'O-Ring', 'Square Ring', 'Loop Fastener', 'Rectangular Ring']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('ringsLoopsMaterial')]}> 
                          <SearchableDropdown
                            value={material.ringsLoopsMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsMaterial', selectedValue)}
                            options={['Metal (Stainless Steel, Brass, Zinc Alloy)', 'Plastic (Acetal, Nylon)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" required width="sm" error={errors[getErrorKey('ringsLoopsSize')]}> 
                          <Input
                            type="text"
                            value={material.ringsLoopsSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsSize', e.target.value)}
                            placeholder="Inner Diameter or Webbing Width (25mm, 38mm, 50mm, 1 inch, 1.5 inch)"
                            aria-invalid={hasError('ringsLoopsSize')}
                          />
                        </Field>
                        <Field label="THICKNESS/GAUGE" required width="sm" error={errors[getErrorKey('ringsLoopsThicknessGauge')]}> 
                          <SearchableDropdown
                            value={material.ringsLoopsThicknessGauge || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsThicknessGauge', selectedValue)}
                            options={['Wire Diameter (metal)', 'Material Gauge']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsThicknessGauge'))}
                          />
                        </Field>
                        <Field label="FINISH/PLATING" required width="sm" error={errors[getErrorKey('ringsLoopsFinishPlating')]}> 
                          <SearchableDropdown
                            value={material.ringsLoopsFinishPlating || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsFinishPlating', selectedValue)}
                            options={['Nickel', 'Black Oxide', 'Antique Brass', 'Matte (plastic)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsFinishPlating'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('ringsLoopsPlacement')]}> 
                          <Input
                            type="text"
                            value={material.ringsLoopsPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsPlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('ringsLoopsPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'ringsLoopsPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-rings-loops-placement-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-rings-loops-placement-${materialIndex}`)?.click()}
                            >
                              {material.ringsLoopsPlacementReferenceImage ? 'UPLOADED' : 'IMAGE REF'}
                            </Button>
                          </div>
                        </Field>
                      </div>
                    </>
                  )}

                  {/* RINGS-LOOPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RINGS-LOOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.ringsLoopsTestingRequirements) ? material.ringsLoopsTestingRequirements : (material.ringsLoopsTestingRequirements ? [material.ringsLoopsTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'ringsLoopsTestingRequirements', arr)}
                                options={['Tensile Strength', 'Corrosion (Salt Spray)', 'Weld Integrity']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'ringsLoopsTestingRequirementFile', e.target.files[0])}
                              className="hidden"
                              id={`upload-rings-loops-testing-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-rings-loops-testing-${materialIndex}`)?.click()}
                            >
                              {material.ringsLoopsTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.ringsLoopsQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsQty', e.target.value)}
                            placeholder="Pieces"
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" error={errors[getErrorKey('ringsLoopsSurplus')]}> 
                          <PercentInput
                            value={material.ringsLoopsSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsSurplus', e.target.value)}
                            error={hasError('ringsLoopsSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" error={errors[getErrorKey('ringsLoopsWastage')]}> 
                          <PercentInput
                            value={material.ringsLoopsWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsWastage', e.target.value)}
                            error={hasError('ringsLoopsWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" error={errors[getErrorKey('ringsLoopsApproval')]}> 
                          <SearchableDropdown
                            value={material.ringsLoopsApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Load Test Certificate']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.ringsLoopsRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsRemarks', e.target.value)}
                            placeholder="Non-magnetic (military), Smooth burr-free edges"
                          />
                        </Field>
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showRingsLoopsAdvancedSpec', !material.showRingsLoopsAdvancedSpec)}
                          className="border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5 self-start"
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            marginBottom: '16px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                        >
                          {material.showRingsLoopsAdvancedSpec ? '− ADVANCE SPEC' : '+ ADVANCE SPEC'}
                        </button>
                        {material.showRingsLoopsAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 mt-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">LOAD RATING</label>
                              <SearchableDropdown
                                value={material.ringsLoopsLoadRating || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsLoadRating', selectedValue)}
                                options={['Breaking Strength', 'Working Load Limit (WLL)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">WELDED</label>
                              <SearchableDropdown
                                value={material.ringsLoopsWelded || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsWelded', selectedValue)}
                                options={['Welded (stronger)', 'Non-Welded (lighter)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                              <SearchableDropdown
                                value={material.ringsLoopsApplication || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsApplication', selectedValue)}
                                options={['Strap Attachment', 'Hanging Point', 'Decoration']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>)}

                  {/* PIN-BARBS Fields */}
                  {material.trimAccessory === 'PIN-BARBS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('pinBarbType')]}> 
                          <SearchableDropdown
                            value={material.pinBarbType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbType', selectedValue)}
                            options={['Safety Pin', 'Straight Pin', 'Tagging Barb (plastic fastener)', 'Loop Pin', 'Ball Head Pin']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('pinBarbMaterial')]}> 
                          <SearchableDropdown
                            value={material.pinBarbMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbMaterial', selectedValue)}
                            options={['Plastic (Polypropylene)', 'Metal (Brass, Steel)', 'Stainless Steel']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" required width="sm" error={errors[getErrorKey('pinBarbSize')]}> 
                          <Input
                            type="text"
                            value={material.pinBarbSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbSize', e.target.value)}
                            placeholder="Length (25mm, 50mm, 1 inch), Needle Gauge (straight pins)"
                            aria-invalid={hasError('pinBarbSize')}
                          />
                        </Field>
                        <Field label="COLOUR" required width="sm" error={errors[getErrorKey('pinBarbColour')]}> 
                          <SearchableDropdown
                            value={material.pinBarbColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbColour', selectedValue)}
                            options={['Clear', 'Black', 'White', 'Plated (metal)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbColour'))}
                          />
                        </Field>
                        <Field label="HEAD TYPE" required width="sm" error={errors[getErrorKey('pinBarbHeadType')]}> 
                          <SearchableDropdown
                            value={material.pinBarbHeadType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbHeadType', selectedValue)}
                            options={['Pear Head', 'T-Bar', 'Smooth', 'Ball Head', 'Flat Head']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbHeadType'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('pinBarbPlacement')]}> 
                          <Input
                            type="text"
                            value={material.pinBarbPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbPlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('pinBarbPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'pinBarbPlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-pin-barb-placement-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-pin-barb-placement-${materialIndex}`)?.click()}
                            >
                              {material.pinBarbPlacementReferenceImage ? 'UPLOADED' : 'IMAGE'}
                            </Button>
                          </div>
                        </Field>
                      </div>
                    </>
                  )}

                  {/* PIN-BARBS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PIN-BARBS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.pinBarbTestingRequirements) ? material.pinBarbTestingRequirements : (material.pinBarbTestingRequirements ? [material.pinBarbTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'pinBarbTestingRequirements', arr)}
                                options={['Needle Sharpness', 'Non-Rusting', 'Metal Detection (ferrous)']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'pinBarbTestingRequirementFile', e.target.files[0])}
                              className="hidden"
                              id={`upload-pin-barb-testing-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-pin-barb-testing-${materialIndex}`)?.click()}
                            >
                              {material.pinBarbTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.pinBarbQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbQty', e.target.value)}
                            placeholder="PAIR PER PC"
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" error={errors[getErrorKey('pinBarbSurplus')]}> 
                          <PercentInput
                            value={material.pinBarbSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbSurplus', e.target.value)}
                            error={hasError('pinBarbSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" error={errors[getErrorKey('pinBarbWastage')]}> 
                          <PercentInput
                            value={material.pinBarbWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbWastage', e.target.value)}
                            error={hasError('pinBarbWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" error={errors[getErrorKey('pinBarbApproval')]}> 
                          <SearchableDropdown
                            value={material.pinBarbApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.pinBarbRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbRemarks', e.target.value)}
                            placeholder="Non-marking on delicate fabrics, Standard magazine cartridges"
                          />
                        </Field>
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showPinBarbAdvancedSpec', !material.showPinBarbAdvancedSpec)}
                          className="border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5 self-start"
                          style={{
                            backgroundColor: '#f3f4f6',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            marginBottom: '16px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e5e7eb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                        >
                          {material.showPinBarbAdvancedSpec ? '− ADVANCE SPEC' : '+ ADVANCE SPEC'}
                        </button>
                        {material.showPinBarbAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 mt-4">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                              <SearchableDropdown
                                value={material.pinBarbTensileStrength || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbTensileStrength', selectedValue)}
                                options={['Holding Power (prevents tag removal)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                              <SearchableDropdown
                                value={material.pinBarbApplication || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbApplication', selectedValue)}
                                options={['Price Tagging', 'Securing Folds', 'Temporary Attachment', 'Sample Pinning']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">MAGAZINE/CARTRIDGE</label>
                              <SearchableDropdown
                                value={material.pinBarbMagazineCartridge || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbMagazineCartridge', selectedValue)}
                                options={['Compatible magazine for tagging guns']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* MAGNETIC CLOSURE Fields */}
                  {material.trimAccessory === 'MAGNETIC CLOSURE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" required width="sm" error={errors[getErrorKey('magneticClosureType')]}> 
                          <SearchableDropdown
                            value={material.magneticClosureType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureType', selectedValue)}
                            options={['Sew-In Magnet (encased)', 'Clasp Magnet (metal body)', 'Snap Magnet', 'Hidden Magnet', 'Magnetic Button']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('magneticClosureType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" required width="sm" error={errors[getErrorKey('magneticClosureMaterial')]}> 
                          <SearchableDropdown
                            value={material.magneticClosureMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureMaterial', selectedValue)}
                            options={['Neodymium (strongest)', 'Ferrite', 'Encasing (PVC)', 'Encasing (Stainless Steel)', 'Encasing (Fabric)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('magneticClosureMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" required width="sm" error={errors[getErrorKey('magneticClosureSize')]}> 
                          <Input
                            type="text"
                            value={material.magneticClosureSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureSize', e.target.value)}
                            placeholder="CM (e.g., 10mm, 14mm, 18mm, 20mm, Thickness)"
                            aria-invalid={hasError('magneticClosureSize')}
                          />
                        </Field>
                        <Field label="PLACEMENT" required width="sm" error={errors[getErrorKey('magneticClosurePlacement')]}> 
                          <Input
                            type="text"
                            value={material.magneticClosurePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosurePlacement', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('magneticClosurePlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'magneticClosurePlacementReferenceImage', e.target.files[0])}
                              className="hidden"
                              id={`upload-magnetic-placement-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-magnetic-placement-${materialIndex}`)?.click()}
                            >
                              {material.magneticClosurePlacementReferenceImage ? 'UPLOADED' : 'REF IMAGE'}
                            </Button>
                          </div>
                        </Field>
                      </div>
                    </>
                  )}

                  {/* MAGNETIC CLOSURE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'MAGNETIC CLOSURE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.magneticClosureTestingRequirements) ? material.magneticClosureTestingRequirements : (material.magneticClosureTestingRequirements ? [material.magneticClosureTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'magneticClosureTestingRequirements', arr)}
                                options={['Pull Force Test', 'Corrosion', 'Needle Detection (if shielded)']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleChange(materialIndex, 'magneticClosureTestingRequirementFile', e.target.files[0])}
                              className="hidden"
                              id={`upload-magnetic-testing-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-magnetic-testing-${materialIndex}`)?.click()}
                            >
                              {material.magneticClosureTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.magneticClosureQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureQty', e.target.value)}
                            placeholder="Pairs (Male/Female set) PER PC"
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" error={errors[getErrorKey('magneticClosureSurplus')]}> 
                          <PercentInput
                            value={material.magneticClosureSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureSurplus', e.target.value)}
                            error={hasError('magneticClosureSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" error={errors[getErrorKey('magneticClosureWastage')]}> 
                          <PercentInput
                            value={material.magneticClosureWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureWastage', e.target.value)}
                            error={hasError('magneticClosureWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" error={errors[getErrorKey('magneticClosureApproval')]}> 
                          <SearchableDropdown
                            value={material.magneticClosureApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Magnet Strength Check']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('magneticClosureApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.magneticClosureRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureRemarks', e.target.value)}
                            placeholder="RF-shielded if near RFID, Care label warn about pacemakers"
                          />
                        </Field>
                      </div>

                      {/* MAGNETIC CLOSURE - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleChange(materialIndex, 'showMagneticClosureAdvancedSpec', !material.showMagneticClosureAdvancedSpec)}
                            className="border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderColor: '#d1d5db',
                              color: '#374151'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#f3f4f6';
                            }}
                          >
                            {material.showMagneticClosureAdvancedSpec ? '− ADVANCE SPEC' : '+ ADVANCE SPEC'}
                          </button>
                        </div>
                        
                        {/* Advanced Spec Fields */}
                        {material.showMagneticClosureAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-x-5 gap-y-5">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">STRENGTH</label>
                              <SearchableDropdown
                                value={material.magneticClosureStrength || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureStrength', selectedValue)}
                                options={['Pull Force (Newtons)', 'Pull Force (Kilograms)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">POLARITY</label>
                              <SearchableDropdown
                                value={material.magneticClosurePolarity || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosurePolarity', selectedValue)}
                                options={['North/South Orientation (must be consistent for mating pairs)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                              <SearchableDropdown
                                value={material.magneticClosureApplication || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureApplication', selectedValue)}
                                options={['Hidden Closure', 'Quick-Attach Flap', 'Bag Closure', 'Garment Closure']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ENCASING</label>
                              <SearchableDropdown
                                value={material.magneticClosureEncasing || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureEncasing', selectedValue)}
                                options={['PVC Covered', 'Fabric Covered', 'Metal Shell', 'Plastic Shell']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">SHIELDING</label>
                              <SearchableDropdown
                                value={material.magneticClosureShielding || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureShielding', selectedValue)}
                                options={['Standard', 'RF-Shielded (if near RFID)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
      )}
    </>
  );
};

export default TrimAccessoryFields;
