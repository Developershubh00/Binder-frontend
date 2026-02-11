import { useEffect, useRef } from 'react';
import SearchableDropdown from '../SearchableDropdown';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PercentInput } from '@/components/ui/percent-input';
import { TestingRequirementsInput } from '@/components/ui/testing-requirements-input';
import TrimAccessoryFields from '../TrimAccessoryFields';

const Step3 = ({
  formData,
  errors,
  handleConsumptionMaterialChange,
  addConsumptionMaterial,
  removeConsumptionMaterial
}) => {
  const prevMaterialsLengthRef = useRef(formData.consumptionMaterials?.length || 0);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevMaterialsLengthRef.current = formData.consumptionMaterials?.length || 0;
      return;
    }
    
    const currentMaterialsLength = formData.consumptionMaterials?.length || 0;
    if (currentMaterialsLength > prevMaterialsLengthRef.current) {
      setTimeout(() => {
        const lastMaterial = document.querySelector('[data-consumption-material-index]:last-child');
        if (lastMaterial) {
          lastMaterial.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
    prevMaterialsLengthRef.current = currentMaterialsLength;
  }, [formData.consumptionMaterials?.length]);

  // Get list of component names from Step 1 products/components
  const getComponentOptions = () => {
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

  return (
<div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-3 TRIMS & ACCESSORIES</h2>
          <p className="text-sm text-gray-600">Trims & accessories specification</p>
        </div>
      </div>
      
      {/* Trim Materials */}
      <div>
        {formData.consumptionMaterials.map((material, materialIndex) => (
          <div key={materialIndex} id={`consumption-material-${materialIndex}`} data-consumption-material-index={materialIndex} className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header with Remove Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h4 className="text-sm font-bold text-gray-700">MATERIAL {materialIndex + 1}</h4>
              {formData.consumptionMaterials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeConsumptionMaterial(materialIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    padding: '4px 10px',
                    height: '28px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Row 1: COMPONENTS, Material Description, Net Consumption per Pc, UNIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5" style={{ marginBottom: '24px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                <SearchableDropdown
                  value={material.components || ''}
                  onChange={(selectedValue) => {
                    handleConsumptionMaterialChange(materialIndex, 'components', selectedValue || '');
                  }}
                  options={getComponentOptions()}
                  placeholder="Select component"
                  strictMode={false}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL DESC</label>
                <input
                  type="text"
                  value={material.materialDescription || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="e.g., Stitching Thread"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">NET CNS/PC</label>
                <input
                  type="number"
                  step="0.001"
                  value={material.netConsumption || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'netConsumption', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="0.000"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                <SearchableDropdown
                  value={material.unit || ''}
                  onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'unit', selectedValue)}
                  options={['KGS', 'CM']}
                  placeholder="Select or type"
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                />
              </div>
            </div>

            {/* Row 2: WORK ORDER, PLACEMENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">WORK ORDER</label>
                <input
                  type="text"
                  value={material.workOrder || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'workOrder', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="e.g., SEWING"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                <input
                  type="text"
                  value={material.placement || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'placement', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="e.g., ON BAG STRAP"
                />
              </div>
            </div>

            {/* SIZE Row */}
            <div className="flex flex-wrap items-start gap-4" style={{ marginTop: '20px', marginBottom: '24px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                  <input
                    type="number"
                  value={material.size?.width || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'size.width', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  placeholder="52"
                />
                </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                <input
                  type="number"
                  value={material.size?.length || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'size.length', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  placeholder="48"
                />
            </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT</label>
                <input
                  type="number"
                  value={material.size?.height || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'size.height', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  placeholder="52"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                                        <SearchableDropdown
                          value={material.size?.unit || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'size.unit', selectedValue)}
                          options={['CM', 'KGS']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ width: '120px' }}
                        />
              </div>
              </div>
              
            {/* TRIM/ACCESSORY CATEGORY SELECTOR */}
            <div className="w-full mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col" style={{ width: '280px', marginBottom: '20px' }}>
                <label className="text-sm font-bold text-gray-800 mb-2">TRIM/ACCESSORY</label>
                <SearchableDropdown
                  value={material.trimAccessory || ''}
                  onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'trimAccessory', selectedValue)}

                  options={['BUCKLES', 'BUTTONS', 'CABLE-TIES', 'CORD STOPS', 'FELT', 'HOOKS-EYES', 'INTERLINING(FUSING)', 'MAGNETIC CLOSURE', 'PIN-BARBS', 'REFLECTIVE TAPES', 'RINGS-LOOPS', 'RIVETS', 'SEAM TAPE', 'SHOULDER PADS', 'VELCRO', 'NIWAR-WEBBING', 'RIBBING', 'LACE', 'FIRE RETARDANT (FR) TRIMS', 'ZIPPERS']}

                  placeholder="Select or type Trim/Accessory"
                  style={{ width: '280px' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                />
              </div>

              {/* Conditional fields based on trim/accessory type */}
              {material.trimAccessory && (
                <TrimAccessoryFields
                  material={material}
                  materialIndex={materialIndex}
                  handleChange={handleConsumptionMaterialChange}
                  errors={errors}
                  errorPrefix={`consumptionMaterial_${materialIndex}`}
                />
              )}
              {false && material.trimAccessory && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                  {/* ZIPPERS — foam-table pattern: Field sm/md/lg, Input, PercentInput, TestingRequirementsInput, Button, tokens */}
                  {material.trimAccessory === 'ZIPPERS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="ZIP #" width="sm">
                          <Input
                            type="text"
                            value={material.zipNumber || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'zipNumber', e.target.value)}
                            placeholder="3 or 5 (Common sizes)"
                          />
                        </Field>
                        <Field label="TYPE" width="sm">
                          <SearchableDropdown
                            value={material.zipType || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'zipType', selectedValue)}
                            options={['Concealed (Invisible)', 'Open (Separating)', 'Closed-End (Non-Separating)']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="BRAND" width="sm">
                          <SearchableDropdown
                            value={material.brand || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'brand', selectedValue)}
                            options={['YKK', 'RIRI', 'SBS', 'Unbranded']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="TEETH" width="sm">
                          <SearchableDropdown
                            value={material.teeth || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'teeth', selectedValue)}
                            options={['Coil (Nylon/Polyester)', 'Plastic (Molded Vislon)', 'Metal (Brass, Aluminium)']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="PULLER" width="sm">
                          <SearchableDropdown
                            value={material.puller || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'puller', selectedValue)}
                            options={['Metal', 'DTM (Dyed-to-Match Plastic)', 'Custom Logo', 'Ring']}
                            placeholder="Select or type Puller"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="PULLER TYPE" width="sm">
                          <SearchableDropdown
                            value={material.pullerType || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pullerType', selectedValue)}
                            options={['Lockable (Auto-lock for secure closure)', 'Non-Lockable (Free-gliding)', 'Semi-']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.testingRequirement) ? material.testingRequirement : []}
                                onChange={(arr) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', arr)}
                                options={['Slider Durability (Cycling test)', 'Lateral Strength (Teeth-pulling strength)', 'Puller']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', f); }}
                              className="hidden"
                              id={`upload-zippers-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-zippers-${materialIndex}`)?.click()}
                            >
                              {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>

                        <Field label="LENGTH" width="sm">
                          <SearchableDropdown
                            value={material.length || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'length', selectedValue)}
                            options={['Specific Length (e.g', '20 cm', '7 inches', '500 mm)']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="UNIT" width="sm">
                          <SearchableDropdown
                            value={material.unitAdditional || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', selectedValue)}
                            options={['CM', 'KGS']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm">
                          <PercentInput
                            value={material.surplus || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm">
                          <SearchableDropdown
                            value={material.approval || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'approval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.remarks || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                            placeholder="Required for industrial wash, Must match fabric composition, Specific"
                          />
                        </Field>
                      </div>

                      {/* ZIPPERS — Advance Spec (shadcn Button + expanded fields) */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showZippersAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showZippersAdvancedSpec', !material.showZippersAdvancedSpec)}
                        >
                          {material.showZippersAdvancedSpec ? '− Advance Spec' : '+ Advance Spec'}
                        </Button>
                      </div>
                      {material.showZippersAdvancedSpec && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                          <Field label="SLIDER TYPE" width="sm">
                            <SearchableDropdown
                              value={material.zipSliderType || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'zipSliderType', selectedValue)}
                              options={['Auto-lock', 'Non-lock', 'Reverse lock', 'Two-way']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="FINISH / COATING" width="sm">
                            <SearchableDropdown
                              value={material.zipFinish || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'zipFinish', selectedValue)}
                              options={['Nickel', 'Brass', 'Antique', 'Black Oxide', 'DTM (Puller)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="LENGTH TOLERANCE" width="sm">
                            <Input
                              type="text"
                              value={material.zipLengthTolerance || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'zipLengthTolerance', e.target.value)}
                              placeholder="e.g., ±3mm, ±5mm"
                            />
                          </Field>
                        </div>
                      )}
                    </>
                  )}

                  {material.trimAccessory === 'VELCRO' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PART</label>
                        <SearchableDropdown
                          value={material.velcroPart || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroPart', selectedValue)}
                          options={['HOOK','LOOP','BOTH']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.velcroType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroType', selectedValue)}
                          options={['Sew-On', 'Adhesive Backed (PSA)', 'Die-Cut Shapes', 'ONE-WRAP', 'Soft Loop', 'Mushroom']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.velcroMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroMaterial', selectedValue)}
                          options={['Nylon (Higher cycle life)', 'Polyester (UV/moisture resistant)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                        <SearchableDropdown
                          value={material.velcroAttachment || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroAttachment', selectedValue)}
                          options={['Sewing', 'Adhesive','General','High','Temp','Permanent']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.velcroPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="PLACEMENT"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'velcroPlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-velcro-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-velcro-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.velcroPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                        <SearchableDropdown
                          value={material.velcroSizeSpec || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroSizeSpec', selectedValue)}
                          options={['CM', 'CNS']}
                          placeholder="Select SIZE SPEC"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', marginBottom: '16px' }}
                        />
                        
                        {/* Fields shown when CM is selected */}
                        {material.velcroSizeSpec === 'CM' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">LENGTH (CM)</label>
                              <input
                                type="text"
                                value={material.velcroLengthCm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroLengthCm', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="LENGTH (CM)"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">WIDTH (CM)</label>
                              <input
                                type="text"
                                value={material.velcroWidthCm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroWidthCm', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="WIDTH (CM)"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Fields shown when CNS is selected */}
                        {material.velcroSizeSpec === 'CNS' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">YARDAGE (CNS)</label>
                              <input
                                type="text"
                                value={material.velcroYardageCns || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroYardageCns', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="YARDAGE (CNS)"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">KGS (CNS)</label>
                              <input
                                type="text"
                                value={material.velcroKgsCns || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroKgsCns', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="KGS (CNS)"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* BUTTONS — Field, Input, PercentInput, TestingRequirementsInput, Button, shadcn tokens */}
                  {material.trimAccessory === 'BUTTONS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm">
                          <SearchableDropdown
                            value={material.buttonType || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonType', selectedValue)}
                            options={['Sewing (Flat/Shank)', 'Snap (Press Stud)', 'Tack (Jeans)', 'Toggle', 'Magnetic', 'Covered']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm">
                          <SearchableDropdown
                            value={material.buttonMaterial || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonMaterial', selectedValue)}
                            options={['Polyester', 'Metal (Brass, Alloy, Zinc)', 'Shell', 'Wood', 'Horn', 'Corozo', 'Coconut']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm">
                          <Input
                            type="text"
                            value={material.buttonSize || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonSize', e.target.value)}
                            placeholder="Text"
                          />
                        </Field>
                        <Field label="LIGNE" width="sm">
                          <SearchableDropdown
                            value={material.buttonLigne || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonLigne', selectedValue)}
                            options={['14L', '16L', '18L', '20L', '22L', '24L', '26L', '28L', '30L', '32L', '34L', '36L', '38L', '40L']}
                            placeholder="Select or type (1L=0.635mm)"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="HOLES" width="sm">
                          <SearchableDropdown
                            value={material.buttonHoles || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonHoles', selectedValue)}
                            options={['2-Hole', '4-Hole', 'Shank (no holes)', 'Snap Components']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="FINISH/COLOUR" width="sm">
                          <SearchableDropdown
                            value={material.buttonFinishColour || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonFinishColour', selectedValue)}
                            options={['DTM', 'Glossy', 'Matte', 'Engraved', 'Plated (Nickel)', 'Plated (Antique Brass)', 'Plated (Gunmetal)']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm">
                          <Input
                            type="text"
                            value={material.buttonPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonPlacement', e.target.value)}
                            placeholder="Text"
                          />
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.buttonTestingRequirements) ? material.buttonTestingRequirements : (material.buttonTestingRequirements ? [material.buttonTestingRequirements] : [])}
                                onChange={(arr) => handleConsumptionMaterialChange(materialIndex, 'buttonTestingRequirements', arr)}
                                options={['Needle Detection', 'Pull Strength', 'Colour Fastness', 'REACH/OEKO-TEX', 'Corrosion']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'buttonTestingRequirementFile', f); }}
                              className="hidden"
                              id={`upload-button-testing-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-button-testing-${materialIndex}`)?.click()}
                            >
                              {material.buttonTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>

                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.buttonQty || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonQty', e.target.value)}
                            placeholder="Unit: Pieces"
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm">
                          <PercentInput
                            value={material.buttonSurplus || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonSurplus', e.target.value)}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm">
                          <PercentInput
                            value={material.buttonWastage || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonWastage', e.target.value)}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm">
                          <SearchableDropdown
                            value={material.buttonApproval || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.buttonRemarks || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonRemarks', e.target.value)}
                            placeholder="Self-Shank, Laser Engraved Logo"
                          />
                        </Field>
                        <Field label="" width="sm" className="col-span-1 md:col-span-2 lg:col-span-5 flex flex-row gap-3 items-end">
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'buttonColorReference', f); }}
                            className="hidden"
                            id={`upload-button-color-ref-${materialIndex}`}
                            accept="image/*"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-11"
                            onClick={() => document.getElementById(`upload-button-color-ref-${materialIndex}`)?.click()}
                          >
                            {material.buttonColorReference ? 'UPLOADED' : 'UPLOAD COLOR REFERENCE'}
                          </Button>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'buttonReferenceImage', f); }}
                            className="hidden"
                            id={`upload-button-ref-image-${materialIndex}`}
                            accept="image/*"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-11"
                            onClick={() => document.getElementById(`upload-button-ref-image-${materialIndex}`)?.click()}
                          >
                            {material.buttonReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </Button>
                        </Field>
                      </div>

                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showButtonsAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showButtonsAdvancedSpec', !material.showButtonsAdvancedSpec)}
                        >
                          {material.showButtonsAdvancedSpec ? '− Advance Spec' : '+ Advance Spec'}
                        </Button>
                      </div>
                      {material.showButtonsAdvancedSpec && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                          <Field label="ATTACHMENT" width="sm">
                            <SearchableDropdown
                              value={material.buttonAttachment || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonAttachment', selectedValue)}
                              options={['Machine Sew', 'Hand Sew (Shank)', 'Pneumatic Press (Snaps)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="FUNCTION" width="sm">
                            <SearchableDropdown
                              value={material.buttonFunction || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonFunction', selectedValue)}
                              options={['Functional (Closure)', 'Decorative', 'Dual Purpose']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="LOGO" width="sm">
                            <SearchableDropdown
                              value={material.buttonLogo || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'buttonLogo', selectedValue)}
                              options={['Plain', 'Embossed', 'Engraved', 'Laser Engraved', 'Custom']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                        </div>
                      )}
                    </>
                  )}

                  {/* RIVETS Fields */}
                  {material.trimAccessory === 'RIVETS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.rivetType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetType', selectedValue)}
                          options={['Open-End', 'Closed-End', 'Blind Rivet', 'Cap Rivet', 'Tubular', 'Double Cap', 'Tubular Rivet', 'Solid/Blind Rivet', 'Decorative Rivet', 'Jeans Rivet', 'Burr Rivet', 'Eyelet Rivet']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.rivetMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetMaterial', selectedValue)}
                          options={['Brass', 'Copper', 'Zinc Alloy', 'Steel', 'Aluminium', 'Stainless Steel']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CAP SIZE</label>
                                                <SearchableDropdown
                          value={material.rivetCapSize || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetCapSize', selectedValue)}
                          options={['6mm', '7mm', '8mm', '9mm', '10mm', '12mm']}
                          placeholder="Select or type Diameter"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">POST HEIGHT</label>
                        <SearchableDropdown
                          value={material.rivetPostHeight || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetPostHeight', selectedValue)}
                          options={['Short (5mm)', 'Medium (6mm)', 'Long (7mm, 8mm)']}
                          placeholder="Select or type (match fabric thickness)"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/PLATING</label>
                                                <SearchableDropdown
                          value={material.rivetFinishPlating || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetFinishPlating', selectedValue)}
                          options={['Nickel', 'Copper', 'Antique Brass', 'Gunmetal', 'Black Oxide', 'Matte', 'Shiny']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <div className="flex items-end gap-4">
                        <input
                          type="text"
                            value={material.rivetPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                        />
                        <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'rivetPlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-rivet-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-rivet-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.rivetPlacementReferenceImage ? 'UPLOADED' : 'IMAGE REF'}
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* NIWAR (Webbing/Tapes) Fields */}
                  {material.trimAccessory === 'NIWAR-WEBBING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.niwarType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'niwarType', selectedValue)}
                          options={['Woven (Twill', 'Plain', 'Herringbone)', 'Knitted']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.niwarMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'niwarMaterial', selectedValue)}
                          options={['Fibre Content (e.g', 'Cotton', 'Polyester', 'Polypropylene)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH / SIZE</label>
                        <input
                          type="text"
                          value={material.niwarWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Measurement (e.g., 20mm, 25mm, 38mm, 50mm) or Inches (e.g., 3/4 inch, 1 inch, 1.5 inch)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <SearchableDropdown
                            value={material.unitAdditional || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', selectedValue)}
                            options={['CM', 'KGS']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <input
                          type="text"
                          value={material.niwarThickness || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Gage / Density (e.g., Thin, Medium, Heavy-duty) - Specified in millimeters"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.niwarColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'niwarColour', selectedValue)}
                          options={['DTM', 'White', 'Black', 'Colour Code']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH / COATING</label>
                                                <SearchableDropdown
                          value={material.finishCoating || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'finishCoating', selectedValue)}
                          options={['Soft Finish', 'Stiff Finish', 'Water Repellent', 'UV Resistant', 'Fire Retardant']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.tensileStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tensileStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Breaking Strength (Force required to break the webbing, specified in...)"
                        />
                      </div>
                    </>
                  )}

                  {/* LACE Fields */}
                  {material.trimAccessory === 'LACE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.laceType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'laceType', selectedValue)}
                          options={['Woven', 'Twill tape (Plain', 'Patterned)', 'Braided', 'Crochet', 'Knit']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.laceMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'laceMaterial', selectedValue)}
                          options={['Fibre Content (e.g', '100% Cotton', 'Nylon', 'Rayon', 'Polyester)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH / SIZE</label>
                        <input
                          type="text"
                          value={material.laceWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Measurement (e.g., 5mm, 10mm, 1 inch)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <SearchableDropdown
                            value={material.unitAdditional || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', selectedValue)}
                            options={['CM', 'KGS']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.laceColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'laceColour', selectedValue)}
                          options={['DTM (Dyed to Match)', 'White', 'Ecru', 'Black', 'Colour Code (Pantone)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISHING</label>
                                                <SearchableDropdown
                          value={material.laceFinishing || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'laceFinishing', selectedValue)}
                          options={['Starch (stiff finish)', 'Soft Finish', 'Mercerized (for Cotton)', 'Scalloped']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                                                <SearchableDropdown
                          value={material.laceUsage || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'laceUsage', selectedValue)}
                          options={['Edging', 'Insertion', 'Applique', 'Beading']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REFERENCE</label>
                        <input
                          type="text"
                          value={material.designReference || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'designReference', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Supplier Pattern ID or Design Name (Essential for reordering the same)"
                        />
                      </div>
                    </>
                  )}

                  {material.trimAccessory === 'VELCRO' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <input
                            type="text"
                            value={material.velcroTestingRequirements || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroTestingRequirements', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="TESTING REQUIREMENTS"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'velcroTestingRequirementFile', f); }}
                            className="hidden"
                            id={`upload-velcro-testing-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-velcro-testing-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.velcroTestingRequirementFile ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.velcroQty || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroQty', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Pieces"
                            />
                          </div>
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.velcroKgsPerPc || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroKgsPerPc', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="KGS (CNS PER PC)"
                            />
                          </div>
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.velcroYardagePerPc || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroYardagePerPc', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="YARDAGE (CNS PER PC)"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.velcroSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <input
                          type="text"
                          value={material.velcroWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.velcroApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroApproval', selectedValue)}
                          options={["BUYER'S / INITIAL / PP SAMPLE"]}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.velcroRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Pack Hook & Loop separately, Non-abrasive loop for skin"
                        />
                      </div>

                      {/* VELCRO - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleConsumptionMaterialChange(materialIndex, 'showVelcroAdvancedSpec', !material.showVelcroAdvancedSpec)}
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
                                  onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroColour', selectedValue)}
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
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'velcroColorReference', f); }}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroHookDensity', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroLoopType', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroCycleLife', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'velcroFlameRetardant', selectedValue)}
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
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS DROPDOWN</label>
                          <SearchableDropdown
                            value={material.rivetTestingRequirements || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetTestingRequirements', selectedValue)}
                            options={['Needle Detection', 'Pull Strength (90N)', 'Corrosion (Salt Spray)']}
                            placeholder="Select or type Testing Requirements"
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'rivetTestingRequirementFile', f); }}
                            className="hidden"
                            id={`upload-rivet-testing-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-rivet-testing-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.rivetTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.rivetQty || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PCS"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.rivetSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <input
                          type="text"
                          value={material.rivetWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.rivetApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.rivetRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="TEXT"
                        />
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showRivetAdvancedSpec', !material.showRivetAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetLogo', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'rivetSetting', selectedValue)}
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

                  {/* NIWAR - Complete fields matching table exactly */}
                  {material.trimAccessory === 'NIWAR-WEBBING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <SearchableDropdown
                          value={material.testingRequirement || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', selectedValue)}
                          options={['Tensile strength test', 'Colour Fastness (to Light, Washing)', 'Abrasion']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', f); }}
                          className="hidden"
                            id={`upload-niwar-${materialIndex}`}
                        />
                        <label
                            htmlFor={`upload-niwar-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH / QUANTITY</label>
                                                <SearchableDropdown
                          value={material.lengthQuantity || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', selectedValue)}
                          options={['Meters or Yards per Roll (e.g', '100m Roll)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                                                  type="text"
                                                  value={material.surplus || ''}
                                                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.approval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required weave pattern (e.g., seatbelt-style), For high-load application"
                        />
                      </div>
                    </>
                  )}

                  {/* LACE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'LACE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <SearchableDropdown
                          value={material.testingRequirement || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', selectedValue)}
                          options={['Colour Fastness (to Washing, Light, Crocking)', 'Residual']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', f); }}
                          className="hidden"
                            id={`upload-lace-${materialIndex}`}
                        />
                        <label
                            htmlFor={`upload-lace-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH / QUANTITY</label>
                                                <SearchableDropdown
                          value={material.lengthQuantity || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', selectedValue)}
                          options={['Meters or Yards per Roll (e.g', '50m Roll)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                                                  type="text"
                                                  value={material.surplus || ''}
                                                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.approval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Continuous pattern repeat, No visible knots, Specific"
                        />
                      </div>
                    </>
                  )}

                  {material.trimAccessory === 'FELT' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.feltType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltType', selectedValue)}
                          options={['Pressed Wool', 'Needle-Punched', 'Synthetic (Acrylic, Polyester, PP)', 'Non-Woven', 'Eco Felt']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.feltMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltMaterial', selectedValue)}
                          options={['100% Wool', '100% Polyester', 'Wool/Rayon Blend', 'Acrylic', 'Recycled PET']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex items-end gap-4">
                        <div className="flex flex-col" style={{ flex: '1 1 70%', minWidth: '300px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <SearchableDropdown
                            value={material.feltColour || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltColour', selectedValue)}
                            options={['Standard Colours', 'Pantone TPX/TCX', 'Heathered']}
                            placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100%' }}
                        />
                      </div>
                        <div className="flex flex-col" style={{ flex: '0 0 auto' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'feltColorReference', f); }}
                            className="hidden"
                            id={`upload-felt-color-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-felt-color-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.feltColorReference ? 'UPLOADED' : 'UPLOAD COLOUR'}
                          </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                                                <SearchableDropdown
                          value={material.feltSizeSpec || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltSizeSpec', selectedValue)}
                          options={['CM']}
                          placeholder="Select SIZE SPEC"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', marginBottom: '16px' }}
                        />
                        
                        {/* Fields shown when CM is selected */}
                        {material.feltSizeSpec === 'CM' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">GSM</label>
                              <input
                                type="text"
                                value={material.feltGsm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltGsm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="GSM"
                        />
                      </div>
                      <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">LENGTH</label>
                              <input
                                type="text"
                                value={material.feltLengthCm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltLengthCm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="LENGTH"
                        />
                      </div>
                      <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">WIDTH</label>
                        <input
                          type="text"
                                value={material.feltWidthCm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltWidthCm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="WIDTH"
                        />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* FELT - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FELT' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.feltQty || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Pieces"
                        />
              </div>
                      <div className="flex flex-col">
                        <input
                              type="text"
                              value={material.feltKgs || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltKgs', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="KGS (CNS PER PC)"
                            />
                      </div>
                          <div className="flex flex-col">
                        <input
                          type="text"
                              value={material.feltYardage || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltYardage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="YARDAGE (CNS PER PC)"
                        />
                      </div>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                        <SearchableDropdown
                          value={material.feltTestingRequirements || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltTestingRequirements', selectedValue)}
                          options={['Flammability', 'Pilling', 'Colour Fastness', 'Tensile', 'Compression']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                                                  type="text"
                          value={material.feltSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltSurplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5%"
                                                />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <input
                          type="text"
                          value={material.feltWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.feltApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.feltRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Non-Toxic, Anti-Fraying, Heat press suitable"
                        />
                      </div>

                      {/* FELT - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleConsumptionMaterialChange(materialIndex, 'showFeltAdvancedSpec', !material.showFeltAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltThickness', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltFinishForm', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltApplication', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'feltStiffness', selectedValue)}
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
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.interliningType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningType', selectedValue)}
                          options={['Woven', 'Non-Woven', 'Knit', 'Fusible (adhesive)', 'Non-Fusible (sew-in)', 'Weft Insert', 'Bi-Stretch']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.interliningMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningMaterial', selectedValue)}
                          options={['Polyester', 'Cotton', 'Cellulose (Rayon)', 'Polyamide', 'Blends']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE TYPE</label>
                        <SearchableDropdown
                          value={material.interliningAdhesiveType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningAdhesiveType', selectedValue)}
                          options={['PA (Polyamide)', 'LDPE', 'PES (Polyester)', 'Double Dot', 'Scatter Coat', 'Paste']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <SearchableDropdown
                          value={material.interliningColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningColour', selectedValue)}
                          options={['White', 'Black', 'Grey', 'Charcoal', 'DTM']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                            value={material.interliningPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningPlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'interliningPlacementReferenceImage', f); }}
                          className="hidden"
                            id={`upload-interlining-placement-${materialIndex}`}
                            accept="image/*"
                        />
                        <label
                            htmlFor={`upload-interlining-placement-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                        >
                            {material.interliningPlacementReferenceImage ? 'UPLOADED' : 'REF IMAGE'}
                </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                                                <SearchableDropdown
                          value={material.interliningSizeSpec || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningSizeSpec', selectedValue)}
                          options={['CM']}
                          placeholder="Select SIZE SPEC"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', marginBottom: '16px' }}
                        />
                        
                        {/* Fields shown when CM is selected */}
                        {material.interliningSizeSpec === 'CM' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">GSM</label>
                        <input
                          type="text"
                                value={material.interliningGsm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningGsm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="GSM"
                        />
                      </div>
                      <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">LENGTH</label>
                        <input
                          type="text"
                                value={material.interliningLength || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningLength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="LENGTH"
                        />
                      </div>
                      <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">WIDTH</label>
                          <input
                            type="text"
                                value={material.interliningWidth || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="WIDTH"
                          />
                        </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* INTERLINING(FUSING) - Complete fields matching table exactly */}
                  {material.trimAccessory === 'INTERLINING(FUSING)' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.interliningQty || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Pieces"
                        />
                      </div>
                      <div className="flex flex-col">
                        <input
                              type="text"
                              value={material.interliningKgs || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningKgs', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="KGS (CNS PER PC)"
                            />
                      </div>
                          <div className="flex flex-col">
                        <input
                          type="text"
                              value={material.interliningYardage || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningYardage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="YARDAGE (CNS PER PC)"
                        />
                      </div>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                        <SearchableDropdown
                          value={material.interliningTestingRequirements || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningTestingRequirements', selectedValue)}
                          options={['Bond Strength', 'Residual Shrinkage', 'Wash Resistance', 'Strike-Through']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                          <input
                            type="text"
                          value={material.interliningSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningSurplus', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2-5%"
                          />
                        </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <SearchableDropdown
                          value={material.interliningWastage || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningWastage', selectedValue)}
                          options={['Collar', 'Cuff', 'Placket', 'Waistband', 'Facing', 'Full Front']}
                          placeholder="Select or type Wastage %"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.interliningApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.interliningRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Hand feel required, Low shrinkage, Shell compatible"
                        />
                      </div>

                      {/* INTERLINING(FUSING) - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleConsumptionMaterialChange(materialIndex, 'showInterliningAdvancedSpec', !material.showInterliningAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningDotDensity', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningStretch', selectedValue)}
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
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningFusingSpec', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'interliningHandFeel', selectedValue)}
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
                      {/* TYPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>

                        <SearchableDropdown
                          value={material.hookEyeType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeType', selectedValue)}
                          options={['Standard Hook & Eye', 'Trouser Hook & Bar', 'Skirt Hook & Bar', 'Bra Hook', 'Fur Hook', 'Covered']}

                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* MATERIAL */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.hookEyeMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeMaterial', selectedValue)}
                          options={['Metal (Brass, Stainless Steel, Nickel-Free)', 'Nylon (lingerie)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* SIZE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                        <SearchableDropdown
                          value={material.hookEyeSize || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeSize', selectedValue)}
                          options={['Small', 'Medium', 'Large', 'Length of Hook/Bar (mm)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>


                      {/* COLOUR/FINISH */}

                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR/FINISH</label>
                        <SearchableDropdown
                          value={material.hookEyeColourFinish || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeColourFinish', selectedValue)}
                          options={['Black', 'Silver', 'Antique Brass', 'Thread Covered (DTM)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* FINISH TYPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH TYPE</label>
                        <SearchableDropdown
                          value={material.hookEyeFinishType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeFinishType', selectedValue)}
                          options={['Plating', 'Non-Pinching', 'Round Edge (comfort)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* PLACEMENT with UPLOAD REFERENCE IMAGE */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.hookEyePlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyePlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="TEXT"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UPLOAD REFERENCE IMAGE</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'hookEyeReferenceImage', f); }}
                            className="hidden"
                            id={`upload-hooks-reference-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-hooks-reference-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '140px' }}
                          >
                            {material.hookEyeReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </label>
                        </div>
                      </div>

                      {/* QTY */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.hookEyeQty || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PAIR PER PC"
                        />
                      </div>

                      {/* TESTING REQUIREMENTS DROPDOWN */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                        <SearchableDropdown
                          value={material.hookEyeTestingRequirements || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeTestingRequirements', selectedValue)}
                          options={['Holding Power', 'Corrosion', 'Needle Detection', 'Edge Smoothness']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* SURPLUS %} */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.hookEyeSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>

                      {/* WASTAGE %} */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <input
                          type="text"
                          value={material.hookEyeWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., Waistband, Neckline, Bra Back, Side Closure)"

                        />
                      </div>

                      {/* APPROVAL */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.hookEyeApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeApproval', selectedValue)}
                          options={["BUYER'S / INITIAL / PP SAMPLE", 'BUYER\'S', 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* REMARKS */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.hookEyeRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '80px' }}
                          rows="3"
                          placeholder="Flat bar, Prevent accidental release"
                        />
                      </div>

                      {/* ADVANCE SPEC Button */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-start mt-4">
                        <button
                          type="button"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'hookEyeAdvanceDataOpen', !material.hookEyeAdvanceDataOpen)}
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
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeStrength', selectedValue)}
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
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'hookEyeApplication', selectedValue)}
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
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm">
                          <SearchableDropdown
                            value={material.bucklesType || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'bucklesType', selectedValue)}
                            options={['Side Release', 'D-Ring', 'Tri-Glide', 'Ladder Lock', 'Belt Buckle', 'Cam Buckle', 'Snap', 'Swivel', 'Center Bar', 'O-Ring', 'Magnetic', 'Roller', 'Military/Web']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="MATERIAL DESCRIPTION" width="sm">
                          <SearchableDropdown
                            value={material.bucklesMaterial || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'bucklesMaterial', selectedValue)}
                            options={['Plastic (Nylon)', 'Plastic (POM/Acetal)', 'Plastic (ABS)', 'Metal (Brass)', 'Metal (Zinc)', 'Metal (Steel)', 'Metal (Stainless)', 'Metal (Aluminium)', 'Acetal/POM', 'Zinc Alloy Die-Cast', 'Carbon Fiber Look']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="SIZE (Webbing Width)" width="sm">
                          <SearchableDropdown
                            value={material.bucklesSize || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'bucklesSize', selectedValue)}
                            options={['10mm', '15mm', '20mm', '25mm', '32mm', '38mm', '50mm', '1"', '1.5"', '2"']}
                            placeholder="Select or type (CM)"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="FINISH/COLOUR" width="sm">
                          <SearchableDropdown
                            value={material.bucklesFinishColour || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'bucklesFinishColour', selectedValue)}
                            options={['Black', 'Clear', 'DTM', 'Plating (Nickel)', 'Plating (Gunmetal)', 'Plating (Antique Brass)', 'Matte', 'Glossy', 'Antique', 'Plated (Nickel/Chrome)', 'Powder Coated', 'Anodized']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm">
                          <Input
                            type="text"
                            value={material.bucklesPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'bucklesPlacement', e.target.value)}
                            placeholder="Enter placement location"
                          />
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.bucklesTestingRequirements) ? material.bucklesTestingRequirements : (material.bucklesTestingRequirements ? [material.bucklesTestingRequirements] : [])}
                                onChange={(arr) => handleConsumptionMaterialChange(materialIndex, 'bucklesTestingRequirements', arr)}
                                options={['Tensile Load', 'Corrosion (Salt Spray)', 'UV Resistance', 'REACH']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'bucklesReferenceImage', f); }}
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

                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.bucklesQty || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'bucklesQty', e.target.value)}
                            placeholder="Unit: Pieces"
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm">
                          <PercentInput
                            value={material.bucklesSurplus || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'bucklesSurplus', e.target.value)}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm">
                          <PercentInput
                            value={material.bucklesWastage || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'bucklesWastage', e.target.value)}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm">
                          <SearchableDropdown
                            value={material.bucklesApproval || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'bucklesApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.bucklesRemarks || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'bucklesRemarks', e.target.value)}
                            placeholder="e.g., Finger guard, Outdoor suitable, Smooth edges"
                          />
                        </Field>
                      </div>

                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showBucklesAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showBucklesAdvancedSpec', !material.showBucklesAdvancedSpec)}
                        >
                          {material.showBucklesAdvancedSpec ? '− Advance Spec' : '+ Advance Spec'}
                        </Button>
                      </div>
                      {material.showBucklesAdvancedSpec && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                          <Field label="FUNCTION" width="sm">
                            <SearchableDropdown
                              value={material.bucklesFunction || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'bucklesFunction', selectedValue)}
                              options={['Load Bearing', 'Decorative', 'Quick Release', 'Adjustable', 'Auto-Lock', 'Swivel']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="TENSILE STRENGTH" width="sm">
                            <SearchableDropdown
                              value={material.bucklesTensileStrength || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'bucklesTensileStrength', selectedValue)}
                              options={['Break Strength (100kg)', 'Break Strength (500N)', 'Light Duty (<50 kg)', 'Standard (50-150 kg)', 'Heavy Duty (150-500 kg)', 'Safety (>500 kg)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="SAFETY" width="sm">
                            <SearchableDropdown
                              value={material.bucklesSafety || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'bucklesSafety', selectedValue)}
                              options={['Standard', 'Child-Safe', 'Breakaway (safety release)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                        </div>
                      )}
                    </>
                  )}


                  {material.trimAccessory === 'SHOULDER PADS' && (
                    <>
                      {/* TYPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.shoulderPadType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadType', selectedValue)}
                          options={['Set-In Pad', 'Raglan Pad', 'Sleeve Head Roll', 'Bra Cup', 'Push-Up Pad', 'Removable Insert']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* MATERIAL */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.shoulderPadMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadMaterial', selectedValue)}
                          options={['Foam (Polyurethane)', 'Synthetic Fiber', 'Felt', 'Cotton Wadding']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* SIZE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                        <input
                          type="text"
                          value={material.shoulderPadSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Dimensions (LxWxThickness) / Cup Size (A, B, C, D) CM"
                        />
                      </div>

                      {/* THICKNESS */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <input
                          type="text"
                          value={material.shoulderPadThickness || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="At center/edge (e.g., 5mm center, 3mm edge) CM"
                        />
                      </div>

                      {/* SHAPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SHAPE</label>
                        <SearchableDropdown
                          value={material.shoulderPadShape || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadShape', selectedValue)}
                          options={['Crescent', 'Triangular', 'Oval', 'Round', 'Custom Molded']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* COVERING */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COVERING</label>
                        <SearchableDropdown
                          value={material.shoulderPadCovering || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadCovering', selectedValue)}
                          options={['Covered (knit/non-woven)', 'Uncovered (raw)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* COVERING COLOUR */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COVERING COLOUR</label>
                        <SearchableDropdown
                          value={material.shoulderPadCoveringColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadCoveringColour', selectedValue)}
                          options={['White', 'Black', 'DTM', 'Nude']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* ATTACHMENT */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                        <SearchableDropdown
                          value={material.shoulderPadAttachment || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadAttachment', selectedValue)}
                          options={['Sew-In', 'Fusible (adhesive)', 'Removable (pocket)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>


                      {/* DENSITY */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DENSITY</label>
                        <SearchableDropdown
                          value={material.shoulderPadDensity || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadDensity', selectedValue)}
                          options={['Soft', 'Medium', 'Firm']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* PLACEMENT with UPLOAD REFERENCE IMAGE */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.shoulderPadPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="TEXT"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UPLOAD REFERENCE IMAGE</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'shoulderPadReferenceImage', f); }}
                            className="hidden"
                            id={`upload-reference-image-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-reference-image-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '140px' }}
                          >
                            {material.shoulderPadReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </label>
                        </div>
                      </div>

                      {/* TESTING REQUIREMENT */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <SearchableDropdown
                          value={material.shoulderPadTestingRequirements || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadTestingRequirements', selectedValue)}
                          options={['Wash Resistance', 'Flammability', 'Hypoallergenic']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* QTY */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.shoulderPadQty || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pairs"
                        />
                      </div>

                      {/* SURPLUS %} */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.shoulderPadSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>

                      {/* WASTAGE %} */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <input
                          type="text"
                          value={material.shoulderPadWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE"
                        />
                      </div>

                      {/* APPROVAL */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.shoulderPadApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadApproval', selectedValue)}
                          options={["BUYER'S / INITIAL / PP SAMPLE", 'BUYER\'S', 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* REMARKS */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.shoulderPadRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '80px' }}
                          rows="3"
                          placeholder="Lightweight, Resilient, Hold shape after steam"
                        />
                      </div>
                    </>
                  )}

                  {/* TUBULAR KNITS / RIBBING Fields */}
                  {material.trimAccessory === 'RIBBING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.tubularType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'tubularType', selectedValue)}
                          options={['1x1 Rib', '2x2 Rib', 'Interlock', 'Jersey']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.tubularMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tubularMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Cotton, Polyester, Spandex, Blend"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH/DIAMETER</label>
                        <input
                          type="text"
                          value={material.widthDiameter || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'widthDiameter', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1.5cm, 2cm, 3cm or inches"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WEIGHT/DENSITY</label>
                                                <SearchableDropdown
                          value={material.weightDensity || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'weightDensity', selectedValue)}
                          options={['GSM or oz', 'yd² (e.g', '5.3 oz', 'yd²)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.tubularColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'tubularColour', selectedValue)}
                          options={['White', 'Black', 'Navy', 'DTM']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH%</label>
                        <input
                          type="text"
                          value={material.stretchPercent || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'stretchPercent', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50%, 100%, 150%"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CUTTING</label>
                                                <SearchableDropdown
                          value={material.cutting || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cutting', selectedValue)}
                          options={['Straight cut', 'Bias cut', 'Anti-curl']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                    </>
                  )}

                  {/* TUBULAR KNITS / RIBBING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RIBBING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Skewness, Colour Fastness, Pilling"
                        />
            </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', f); }}
                          className="hidden"
                          id={`upload-tubular-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-tubular-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.approval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Must be anti-curl on the cut edge..."
                        />
                      </div>
                    </>
                  )}

                  {/* CABLE-TIES — Field, Input, PercentInput, TestingRequirementsInput, Button, shadcn tokens */}
                  {material.trimAccessory === 'CABLE-TIES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm">
                          <SearchableDropdown
                            value={material.cableTieType || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cableTieType', selectedValue)}
                            options={['Standard Lock', 'Releasable/Reusable', 'Bar-Lok Loop (hang tags)', 'Security Tie']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm">
                          <SearchableDropdown
                            value={material.cableTieMaterial || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cableTieMaterial', selectedValue)}
                            options={['Nylon (PA66)', 'Polypropylene (PP)', 'Metal Detectable']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm">
                          <SearchableDropdown
                            value={material.cableTieSize || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cableTieSize', selectedValue)}
                            options={['100x2.5mm', '150x3.6mm', '200x4.8mm']}
                            placeholder="Select or type (CM)"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="COLOUR" width="sm">
                          <SearchableDropdown
                            value={material.cableTieColour || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cableTieColour', selectedValue)}
                            options={['Clear/Natural', 'Black', 'Custom']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm">
                          <Input
                            type="text"
                            value={material.cableTiePlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTiePlacement', e.target.value)}
                            placeholder="Enter placement location"
                          />
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.cableTieTestingRequirements) ? material.cableTieTestingRequirements : (material.cableTieTestingRequirements ? [material.cableTieTestingRequirements] : [])}
                                onChange={(arr) => handleConsumptionMaterialChange(materialIndex, 'cableTieTestingRequirements', arr)}
                                options={['Tensile Test', 'UV Resistance', 'Chemical Resistance']}
                                placeholder="Select testing requirements"
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'cableTieReferenceImage', f); }}
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

                        <Field label="QTY" width="sm">
                          <Input
                            type="text"
                            value={material.cableTieQty || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieQty', e.target.value)}
                            placeholder="Unit: Pieces"
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm">
                          <PercentInput
                            value={material.cableTieSurplus || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieSurplus', e.target.value)}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm">
                          <PercentInput
                            value={material.cableTieWastage || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieWastage', e.target.value)}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm">
                          <SearchableDropdown
                            value={material.cableTieApproval || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cableTieApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.cableTieRemarks || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieRemarks', e.target.value)}
                            placeholder="e.g., Rounded non-scratching edges, Operating temperature"
                          />
                        </Field>
                      </div>

                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showCableTieAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showCableTieAdvancedSpec', !material.showCableTieAdvancedSpec)}
                        >
                          {material.showCableTieAdvancedSpec ? '− Advance Spec' : '+ Advance Spec'}
                        </Button>
                      </div>
                      {material.showCableTieAdvancedSpec && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                          <Field label="TENSILE STRENGTH" width="sm">
                            <SearchableDropdown
                              value={material.cableTieTensileStrength || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cableTieTensileStrength', selectedValue)}
                              options={['Holding Force (8kg)', 'Holding Force (18kg)', 'Holding Force (22kg)', 'Holding Force (55kg)']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="FINISH" width="sm">
                            <SearchableDropdown
                              value={material.cableTieFinish || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cableTieFinish', selectedValue)}
                              options={['Smooth Edge', 'Rounded Head']}
                              placeholder="Select or type"
                              className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                            />
                          </Field>
                          <Field label="UV RESISTANCE" width="sm">
                            <SearchableDropdown
                              value={material.cableTieUvResistance || ''}
                              onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cableTieUvResistance', selectedValue)}
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
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.seamTapeType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeType', selectedValue)}
                          options={['2-Layer (PU/PVC)', '3-Layer (Tri-laminate)', 'Adhesive Film', 'Elastic Tape', 'Hot Melt Seam Tape', 'PU Seam Tape', 'TPU Tape', 'Reflective Seam Tape', 'Reinforcement Tape', 'Edge Binding Tape', 'Waterproof Sealing', 'Stretch Seam Support', 'Edge Stabilization', 'Hem Tape', 'Shoulder Tape']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                        <SearchableDropdown
                          value={material.seamTapeMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeMaterial', selectedValue)}
                          options={['TPU (Thermoplastic Polyurethane)', 'PEVA', 'PU', 'Nylon Backing']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <SearchableDropdown
                          value={material.seamTapeWidth || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeWidth', selectedValue)}
                          options={['16mm', '20mm', '22mm', '25mm', '30mm']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.seamTapeColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeColour', selectedValue)}
                          options={['Clear/Transparent', 'Black', 'DTM (rare)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE TYPE</label>
                        <SearchableDropdown
                          value={material.seamTapeAdhesiveType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeAdhesiveType', selectedValue)}
                          options={['Heat Activated', 'Low Melting Point', 'High Bond']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <div className="flex items-end gap-4">
                        <input
                          type="text"
                            value={material.seamTapePlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapePlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                          />
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'seamTapePlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-seam-tape-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-seam-tape-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.seamTapePlacementReferenceImage ? 'UPLOADED' : 'IMAGE REF'}
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* SEAM TAPE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'SEAM TAPE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.seamTapeTestingRequirements || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeTestingRequirements', selectedValue)}
                            options={['Hydrostatic Head', 'Wash Resistance', 'Adhesion/Peel Test']}
                            placeholder="Select or type Testing Requirements"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'seamTapeTestingRequirementFile', f); }}
                            className="hidden"
                            id={`upload-seam-tape-testing-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-seam-tape-testing-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.seamTapeTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.seamTapeQty || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Meters"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.seamTapeSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="5-10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <SearchableDropdown
                          value={material.seamTapeWastage || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeWastage', selectedValue)}
                          options={['5-10%', 'All Seams', 'Critical Seams', 'Shoulder', 'Armhole']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.seamTapeApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Technical Data Sheet']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.seamTapeRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Matte exterior, Specific hot-air welding machine"
                        />
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showSeamTapeAdvancedSpec', !material.showSeamTapeAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeApplicationSpec', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeElasticity', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'seamTapeBreathability', selectedValue)}
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

                  {material.trimAccessory === 'REFLECTIVE TAPES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.reflectiveTapeType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeType', selectedValue)}
                          options={['Sew-on Tape', 'Heat Transfer Film', 'Piping', 'Segmented/Perforated', 'Stretch Reflective']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.reflectiveTapeMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeMaterial', selectedValue)}
                          options={['Glass Bead Technology', 'Micro-Prismatic Vinyl (higher)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.reflectiveTapeColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeColour', selectedValue)}
                          options={['Silver/Grey', 'Fluorescent Yellow/Lime', 'Fluorescent Orange', 'Coloured']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BASE FABRIC</label>
                                                <SearchableDropdown
                          value={material.reflectiveTapeBaseFabric || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeBaseFabric', selectedValue)}
                          options={['Polyester', 'Cotton', 'FR (flame retardant)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <div className="flex items-end gap-4">
                        <input
                          type="text"
                            value={material.reflectiveTapePlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapePlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                          />
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'reflectiveTapePlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-reflective-tape-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-reflective-tape-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.reflectiveTapePlacementReferenceImage ? 'UPLOADED' : 'IMAGE REF'}
                          </label>
                      </div>
                      </div>
                    </>
                  )}

                  {/* REFLECTIVE TAPES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'REFLECTIVE TAPES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.reflectiveTapeTestingRequirements || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeTestingRequirements', selectedValue)}
                            options={['Retro-reflection Test', 'Wash Cycling', 'Abrasion Resistance']}
                            placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeTestingRequirementFile', f); }}
                            className="hidden"
                            id={`upload-reflective-tape-testing-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-reflective-tape-testing-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.reflectiveTapeTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                        <SearchableDropdown
                          value={material.reflectiveTapeSizeSpec || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeSizeSpec', selectedValue)}
                          options={['CM']}
                          placeholder="Select SIZE SPEC"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', marginBottom: '16px' }}
                        />
                        
                        {/* Fields shown when CM is selected */}
                        {material.reflectiveTapeSizeSpec === 'CM' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">GSM</label>
                        <input
                                                  type="text"
                                value={material.reflectiveTapeGsm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeGsm', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="GSM"
                                                />
                      </div>
                            <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">LENGTH</label>
                        <input
                          type="text"
                                value={material.reflectiveTapeLengthCm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeLengthCm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="LENGTH"
                        />
                      </div>
                        <div className="flex flex-col">
                              <label className="text-xs text-gray-600 mb-1">WIDTH</label>
                          <input
                            type="text"
                                value={material.reflectiveTapeWidthCm || ''}
                                onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeWidthCm', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="WIDTH"
                          />
                        </div>
                          </div>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                        <input
                                                  type="text"
                              value={material.reflectiveTapeQty || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeQty', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Pieces"
                                                />
                      </div>
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.reflectiveTapeKgs || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeKgs', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="KGS (CNS PER PC)"
                        />
                      </div>
                        <div className="flex flex-col">
                          <input
                            type="text"
                              value={material.reflectiveTapeYardage || ''}
                              onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeYardage', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="YARDAGE (CNS PER PC)"
                          />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.reflectiveTapeSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="5-10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <input
                          type="text"
                          value={material.reflectiveTapeWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="5-10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.reflectiveTapeApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Compliance Certificate']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.reflectiveTapeRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Industrial launder compatible, No peel or crack"
                        />
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showReflectiveTapeAdvancedSpec', !material.showReflectiveTapeAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeCertification', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeWashDurability', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'reflectiveTapeReflectivity', selectedValue)}
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

                  {/* FIRE RETARDANT (FR) TRIMS Fields */}
                  {material.trimAccessory === 'FIRE RETARDANT (FR) TRIMS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.frType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'frType', selectedValue)}
                          options={['Tape', 'Trim', 'Binding', 'Webbing']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.frMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'frMaterial', selectedValue)}
                          options={['Nomex', 'Kevlar', 'FR Cotton', 'FR Polyester']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COMPLIANCE LEVEL</label>
                        <input
                          type="text"
                          value={material.complianceLevel || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'complianceLevel', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="NFPA 701, EN 11612, ASTM D6413, CPAI-84"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.frColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'frColour', selectedValue)}
                          options={['Yellow', 'Orange', 'DTM']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                                                <SearchableDropdown
                          value={material.durability || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'durability', selectedValue)}
                          options={['Wash durability', 'Lightfastness', 'Abrasion resistance']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                                                <SearchableDropdown
                          value={material.frComponents || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'frComponents', selectedValue)}
                          options={['Base fabric', 'Coating', 'Thread', 'Adhesive']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                    </>
                  )}

                  {/* FIRE RETARDANT (FR) TRIMS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FIRE RETARDANT (FR) TRIMS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Vertical Flame test, LOI"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Pieces"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', f); }}
                          className="hidden"
                          id={`upload-fr-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-fr-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                                                  type="text"
                                                  value={material.surplus || ''}
                                                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.approval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Certification Test Report']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be inherently FR (not treated)..."
                        />
                      </div>
                    </>
                  )}

                  {material.trimAccessory === 'CORD STOPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.cordStopType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopType', selectedValue)}
                          options={['Single Hole', 'Double Hole', 'Barrel Lock', 'Toggle', 'Spring Loaded', 'Squeeze Release', 'Ball Lock']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.cordStopMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopMaterial', selectedValue)}
                          options={['Plastic (Acetal/POM)', 'Plastic (Nylon)', 'Plastic (ABS)', 'Metal (Zinc Alloy)', 'Metal (Brass)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                        <SearchableDropdown
                          value={material.cordStopSize || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopSize', selectedValue)}
                          options={['3mm', '4mm', '5mm', '6mm']}
                          placeholder="Select or type (Cord Diameter fit)"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.cordStopColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopColour', selectedValue)}
                          options={['DTM', 'Black', 'Clear', 'Plating (metal)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LOCKING MECHANISM</label>
                        <SearchableDropdown
                          value={material.cordStopLockingMechanism || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopLockingMechanism', selectedValue)}
                          options={['Spring Tension (force to depress)', 'Grip Type']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                            value={material.cordStopPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopPlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'cordStopPlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-cord-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-cord-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm  cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.cordStopPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* CORD RING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'CORD STOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.cordStopTestingRequirements || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopTestingRequirements', selectedValue)}
                            options={['Locking Strength', 'UV Resistance', 'Cold Weather', 'Non-Toxic']}
                            placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'cordStopPlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-cord-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-cord-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.cordStopPlacementReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                                                  type="text"
                          value={material.cordStopQty || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopQty', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces"
                                                />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.cordStopSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                          <input
                            type="text"
                          value={material.cordStopWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopWastage', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3-5%"
                          />
                        </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.cordStopApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Functionality Approval']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.cordStopRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Ergonomic grip, No snagging on cord opening"
                        />
                      </div>

                      {/* CORD RING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleConsumptionMaterialChange(materialIndex, 'showCordStopAdvancedSpec', !material.showCordStopAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopFunction', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'cordStopBreakaway', selectedValue)}
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
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.ringsLoopsType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsType', selectedValue)}
                          options={['D-Ring (Welded/Non-Welded)', 'O-Ring', 'Square Ring', 'Loop Fastener', 'Rectangular Ring']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.ringsLoopsMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsMaterial', selectedValue)}
                          options={['Metal (Stainless Steel, Brass, Zinc Alloy)', 'Plastic (Acetal, Nylon)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                        <input
                          type="text"
                          value={material.ringsLoopsSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Inner Diameter or Webbing Width (25mm, 38mm, 50mm, 1 inch, 1.5 inch)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS/GAUGE</label>
                        <SearchableDropdown
                          value={material.ringsLoopsThicknessGauge || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsThicknessGauge', selectedValue)}
                          options={['Wire Diameter (metal)', 'Material Gauge']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/PLATING</label>
                        <SearchableDropdown
                          value={material.ringsLoopsFinishPlating || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsFinishPlating', selectedValue)}
                          options={['Nickel', 'Black Oxide', 'Antique Brass', 'Matte (plastic)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <div className="flex items-end gap-4">
                        <input
                          type="text"
                            value={material.ringsLoopsPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                        />
                        <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'ringsLoopsPlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-rings-loops-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-rings-loops-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.ringsLoopsPlacementReferenceImage ? 'UPLOADED' : 'IMAGE REF'}
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* RINGS-LOOPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RINGS-LOOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS DROPDOWN</label>
                          <SearchableDropdown
                            value={material.ringsLoopsTestingRequirements || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsTestingRequirements', selectedValue)}
                            options={['Tensile Strength', 'Corrosion (Salt Spray)', 'Weld Integrity']}
                            placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'ringsLoopsTestingRequirementFile', f); }}
                            className="hidden"
                            id={`upload-rings-loops-testing-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-rings-loops-testing-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.ringsLoopsTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.ringsLoopsQty || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.ringsLoopsSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="2-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                          <input
                            type="text"
                          value={material.ringsLoopsWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsWastage', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="2-5%"
                          />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.ringsLoopsApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Load Test Certificate']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.ringsLoopsRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Non-magnetic (military), Smooth burr-free edges"
                        />
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showRingsLoopsAdvancedSpec', !material.showRingsLoopsAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsLoadRating', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsWelded', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'ringsLoopsApplication', selectedValue)}
                                options={['Strap Attachment', 'Hanging Point', 'Decoration']}
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


                  {/* PIN-BARBS Fields */}
                  {material.trimAccessory === 'PIN-BARBS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.pinBarbType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbType', selectedValue)}
                          options={['Safety Pin', 'Straight Pin', 'Tagging Barb (plastic fastener)', 'Loop Pin', 'Ball Head Pin']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.pinBarbMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbMaterial', selectedValue)}
                          options={['Plastic (Polypropylene)', 'Metal (Brass, Steel)', 'Stainless Steel']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                        <input
                          type="text"
                          value={material.pinBarbSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinBarbSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Length (25mm, 50mm, 1 inch), Needle Gauge (straight pins)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.pinBarbColour || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbColour', selectedValue)}
                          options={['Clear', 'Black', 'White', 'Plated (metal)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">HEAD TYPE</label>
                                                <SearchableDropdown
                          value={material.pinBarbHeadType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbHeadType', selectedValue)}
                          options={['Pear Head', 'T-Bar', 'Smooth', 'Ball Head', 'Flat Head']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <div className="flex items-end gap-4">
                          <input
                            type="text"
                            value={material.pinBarbPlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinBarbPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                          />
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'pinBarbPlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-pin-barb-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-pin-barb-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.pinBarbPlacementReferenceImage ? 'UPLOADED' : 'IMAGE'}
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PIN-BARBS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PIN-BARBS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS DROPDOWN</label>
                          <SearchableDropdown
                            value={material.pinBarbTestingRequirements || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbTestingRequirements', selectedValue)}
                            options={['Needle Sharpness', 'Non-Rusting', 'Metal Detection (ferrous)']}
                            placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'pinBarbTestingRequirementFile', f); }}
                            className="hidden"
                            id={`upload-pin-barb-testing-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-pin-barb-testing-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.pinBarbTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.pinBarbQty || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinBarbQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PAIR PER PC"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                                                  type="text"
                          value={material.pinBarbSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinBarbSurplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="10%"
                                                />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <input
                          type="text"
                          value={material.pinBarbWastage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinBarbWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.pinBarbApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.pinBarbRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinBarbRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Non-marking on delicate fabrics, Standard magazine cartridges"
                        />
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleConsumptionMaterialChange(materialIndex, 'showPinBarbAdvancedSpec', !material.showPinBarbAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbTensileStrength', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbApplication', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'pinBarbMagazineCartridge', selectedValue)}
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
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.magneticClosureType || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureType', selectedValue)}
                          options={['Sew-In Magnet (encased)', 'Clasp Magnet (metal body)', 'Snap Magnet', 'Hidden Magnet', 'Magnetic Button']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.magneticClosureMaterial || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureMaterial', selectedValue)}
                          options={['Neodymium (strongest)', 'Ferrite', 'Encasing (PVC)', 'Encasing (Stainless Steel)', 'Encasing (Fabric)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE SPEC</label>
                        <input
                          type="text"
                          value={material.magneticClosureSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="CM (e.g., 10mm, 14mm, 18mm, 20mm, Thickness)"
                        />
                      </div>
                      {/* STRENGTH moved to Advanced Spec */}
                      <div className="flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                            value={material.magneticClosurePlacement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticClosurePlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'magneticClosurePlacementReferenceImage', f); }}
                            className="hidden"
                            id={`upload-magnetic-placement-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-magnetic-placement-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.magneticClosurePlacementReferenceImage ? 'UPLOADED' : 'REF IMAGE'}
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* MAGNETIC CLOSURE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'MAGNETIC CLOSURE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.magneticClosureTestingRequirements || ''}
                            onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureTestingRequirements', selectedValue)}
                            options={['Pull Force Test', 'Corrosion', 'Needle Detection (if shielded)']}
                            placeholder="Select or type Testing Requirements"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleConsumptionMaterialChange(materialIndex, 'magneticClosureTestingRequirementFile', f); }}
                            className="hidden"
                            id={`upload-magnetic-testing-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-magnetic-testing-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.magneticClosureTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.magneticClosureQty || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pairs (Male/Female set) PER PC"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.magneticClosureSurplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <SearchableDropdown
                          value={material.magneticClosureWastage || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureWastage', selectedValue)}
                          options={['Flap', 'Hidden Closure', 'Decorative', 'Removable']}
                          placeholder="Select or type Wastage %"
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.magneticClosureApproval || ''}
                          onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Magnet Strength Check']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.magneticClosureRemarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="RF-shielded if near RFID, Care label warn about pacemakers"
                        />
                      </div>

                      {/* MAGNETIC CLOSURE - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleConsumptionMaterialChange(materialIndex, 'showMagneticClosureAdvancedSpec', !material.showMagneticClosureAdvancedSpec)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureStrength', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosurePolarity', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureApplication', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureEncasing', selectedValue)}
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
                                onChange={(selectedValue) => handleConsumptionMaterialChange(materialIndex, 'magneticClosureShielding', selectedValue)}
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
            </div>
          </div>
        ))}
        
        {/* Add Material Button at Bottom */}
        <div className="mt-6 pt-6 border-t border-gray-200" style={{ marginTop: '24px', paddingTop: '24px' }}>
          <p className="text-sm text-gray-600 mb-3">Would you like to add more materials?</p>
          <button
            type="button"
            onClick={() => {
              const currentLength = formData.consumptionMaterials?.length || 0;
              addConsumptionMaterial();
              const newIndex = currentLength;
              const attemptScroll = (attempts = 0) => {
                if (attempts > 30) return;
                const element = document.getElementById(`consumption-material-${newIndex}`);
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

export default Step3;
