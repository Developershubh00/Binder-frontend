import SearchableDropdown from './SearchableDropdown';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PercentInput } from '@/components/ui/percent-input';
import { TestingRequirementsInput } from '@/components/ui/testing-requirements-input';
import { isEmpty } from '@/utils/validationSchemas';
import {
  ZippersAdvancedSpec,
  ButtonsAdvancedSpec,
  VelcroAdvancedSpec,
  RivetAdvancedSpec,
  NiwarAdvancedSpec,
  LaceAdvancedSpec,
  FeltAdvancedSpec,
  InterliningAdvancedSpec,
  HookEyeAdvancedSpec,
  BucklesAdvancedSpec,
  RibbingAdvancedSpec,
  CableTieAdvancedSpec,
  SeamTapeAdvancedSpec,
  ReflectiveTapeAdvancedSpec,
  FrTrimsAdvancedSpec,
  CordStopAdvancedSpec,
  RingsLoopsAdvancedSpec,
  PinBarbAdvancedSpec,
  MagneticClosureAdvancedSpec
} from './TrimAccessoryAdvancedSpecs';

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
  const uploadFieldNames = new Set([
    'bucklesReferenceImage',
    'buttonColorReference',
    'buttonReferenceImage',
    'buttonTestingRequirementFile',
    'cableTieReferenceImage',
    'cordStopPlacementReferenceImage',
    'feltColorReference',
    'frTrimsPlacementReferenceImage',
    'frTrimsTestingRequirementFile',
    'interliningPlacementReferenceImage',
    'laceColorReference',
    'magneticClosurePlacementReferenceImage',
    'magneticClosureTestingRequirementFile',
    'niwarColorReference',
    'niwarPlacementReferenceImage',
    'pinBarbPlacementReferenceImage',
    'pinBarbTestingRequirementFile',
    'reflectiveTapePlacementReferenceImage',
    'reflectiveTapeTestingRequirementFile',
    'ribbingColorReference',
    'ribbingPlacementReferenceImage',
    'ringsLoopsPlacementReferenceImage',
    'ringsLoopsTestingRequirementFile',
    'rivetPlacementReferenceImage',
    'rivetTestingRequirementFile',
    'seamTapePlacementReferenceImage',
    'seamTapeTestingRequirementFile',
    'shoulderPadReferenceImage',
    'testingRequirementFile',
    'velcroPlacementReferenceImage',
    'velcroTestingRequirementFile'
  ]);
  const isOptionalField = (fieldName) => {
    if (!fieldName) return true;
    if (uploadFieldNames.has(fieldName)) return true;
    if (/remarks$/i.test(fieldName)) return true;
    if (/^show.*advanced/i.test(fieldName)) return true;
    return false;
  };
  // Helper to get error key
  const getErrorKey = (fieldName) => errorPrefix ? `${errorPrefix}_${fieldName}` : `rawMaterial_${materialIndex}_${fieldName}`;
  const errorKeyPrefix = errorPrefix ? `${errorPrefix}_` : `rawMaterial_${materialIndex}_`;
  const materialHasErrors = Object.keys(errors).some((key) => key.startsWith(errorKeyPrefix));
  const hasError = (fieldName) => {
    if (errors[getErrorKey(fieldName)]) return true;
    if (!materialHasErrors) return false;
    if (isOptionalField(fieldName)) return false;
    return isEmpty(material[fieldName]);
  };
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
                  {/* ZIPPERS Fields */}
                  {material.trimAccessory === 'ZIPPERS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="ZIP #" width="sm" required={!isOptionalField('zipNumber')} error={errors[getErrorKey('zipNumber')]}>
                          <Input
                            type="text"
                            value={material.zipNumber || ''}
                            onChange={(e) => handleChange(materialIndex, 'zipNumber', e.target.value)}
                            placeholder="3 or 5 (Common sizes)"
                            aria-invalid={hasError('zipNumber')}
                          />
                        </Field>
                        <Field label="TYPE" width="sm" required={!isOptionalField('zipType')} error={errors[getErrorKey('zipType')]}>
                          <SearchableDropdown
                            value={material.zipType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'zipType', selectedValue)}
                            options={['Concealed (Invisible)', 'Open (Separating)', 'Closed-End (Non-Separating)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('zipType'))}
                          />
                        </Field>
                        <Field label="BRAND" width="sm" required={!isOptionalField('brand')} error={errors[getErrorKey('brand')]}>
                          <SearchableDropdown
                            value={material.brand || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'brand', selectedValue)}
                            options={['YKK', 'RIRI', 'SBS', 'Unbranded']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('brand'))}
                          />
                        </Field>
                        <Field label="TEETH" width="sm" required={!isOptionalField('teeth')} error={errors[getErrorKey('teeth')]}>
                          <SearchableDropdown
                            value={material.teeth || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'teeth', selectedValue)}
                            options={['Coil (Nylon/Polyester)', 'Plastic (Molded Vislon)', 'Metal (Brass, Aluminium)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('teeth'))}
                          />
                        </Field>
                        <Field label="PULLER" width="sm" required={!isOptionalField('puller')} error={errors[getErrorKey('puller')]}>
                          <SearchableDropdown
                            value={material.puller || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'puller', selectedValue)}
                            options={['Metal', 'DTM (Dyed-to-Match Plastic)', 'Custom Logo', 'Ring']}
                            placeholder="Select or type Puller"
                            className={dropdownClass(hasError('puller'))}
                          />
                        </Field>
                        <Field label="PULLER TYPE" width="sm" required={!isOptionalField('pullerType')} error={errors[getErrorKey('pullerType')]}>
                          <SearchableDropdown
                            value={material.pullerType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pullerType', selectedValue)}
                            options={['Lockable (Auto-lock for secure closure)', 'Non-Lockable (Free-gliding)', 'Semi-']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pullerType'))}
                          />
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('testingRequirement')} error={errors[getErrorKey('testingRequirement')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.testingRequirement) ? material.testingRequirement : []}
                                onChange={(arr) => handleChange(materialIndex, 'testingRequirement', arr)}
                                options={['Slider Durability (Cycling test)', 'Lateral Strength (Teeth-pulling strength)', 'Puller']}
                                placeholder="Select testing requirements"
                                error={hasError('testingRequirement')}
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleChange(materialIndex, 'testingRequirementFile', f); }}
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

                        <Field label="LENGTH" width="sm" required={!isOptionalField('length')} error={errors[getErrorKey('length')]}>
                          <SearchableDropdown
                            value={material.length || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'length', selectedValue)}
                            options={['Specific Length (e.g', '20 cm', '7 inches', '500 mm)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('length'))}
                          />
                        </Field>
                        <Field label="UNIT" width="sm" required={!isOptionalField('unitAdditional')} error={errors[getErrorKey('unitAdditional')]}>
                          <SearchableDropdown
                            value={material.unitAdditional || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'unitAdditional', selectedValue)}
                            options={['CM', 'KGS']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('unitAdditional'))}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('surplus')} error={errors[getErrorKey('surplus')]}>
                          <PercentInput
                            value={material.surplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                            error={hasError('surplus')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('approval')} error={errors[getErrorKey('approval')]}>
                          <SearchableDropdown
                            value={material.approval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('approval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('remarks')} error={errors[getErrorKey('remarks')]}>
                          <Input
                            type="text"
                            value={material.remarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                            placeholder="Required for industrial wash, Must match fabric composition, Specific"
                            aria-invalid={hasError('remarks')}
                          />
                        </Field>
                      </div>

                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showZippersAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showZippersAdvancedSpec', !material.showZippersAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showZippersAdvancedSpec && (
                        <ZippersAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* BUTTONS Fields */}
                  {material.trimAccessory === 'BUTTONS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('buttonType')} error={errors[getErrorKey('buttonType')]}>
                          <SearchableDropdown
                            value={material.buttonType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'buttonType', selectedValue)}
                            options={['Sewing (Flat/Shank)', 'Snap (Press Stud)', 'Tack (Jeans)', 'Toggle', 'Magnetic', 'Covered']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('buttonType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('buttonMaterial')} error={errors[getErrorKey('buttonMaterial')]}>
                          <SearchableDropdown
                            value={material.buttonMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'buttonMaterial', selectedValue)}
                            options={['Polyester', 'Metal (Brass, Alloy, Zinc)', 'Shell', 'Wood', 'Horn', 'Corozo', 'Coconut']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('buttonMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm" required={!isOptionalField('buttonSize')} error={errors[getErrorKey('buttonSize')]}>
                          <Input
                            type="text"
                            value={material.buttonSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'buttonSize', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('buttonSize')}
                          />
                        </Field>
                        <Field label="LIGNE" width="sm" required={!isOptionalField('buttonLigne')} error={errors[getErrorKey('buttonLigne')]}>
                          <SearchableDropdown
                            value={material.buttonLigne || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'buttonLigne', selectedValue)}
                            options={['14L', '16L', '18L', '20L', '22L', '24L', '26L', '28L', '30L', '32L', '34L', '36L', '38L', '40L']}
                            placeholder="Select or type (1L=0.635mm)"
                            className={dropdownClass(hasError('buttonLigne'))}
                          />
                        </Field>
                        <Field label="HOLES" width="sm" required={!isOptionalField('buttonHoles')} error={errors[getErrorKey('buttonHoles')]}>
                          <SearchableDropdown
                            value={material.buttonHoles || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'buttonHoles', selectedValue)}
                            options={['2-Hole', '4-Hole', 'Shank (no holes)', 'Snap Components']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('buttonHoles'))}
                          />
                        </Field>
                        <Field label="FINISH/COLOUR" width="sm" required={!isOptionalField('buttonFinishColour')} error={errors[getErrorKey('buttonFinishColour')]}>
                          <div className="flex flex-col gap-2">
                            <SearchableDropdown
                              value={material.buttonFinishColour || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'buttonFinishColour', selectedValue)}
                              options={['DTM', 'Glossy', 'Matte', 'Engraved', 'Plated (Nickel)', 'Plated (Antique Brass)', 'Plated (Gunmetal)']}
                              placeholder="Select or type"
                              className={dropdownClass(hasError('buttonFinishColour'))}
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleChange(materialIndex, 'buttonColorReference', f); }}
                              className="hidden"
                              id={`upload-button-color-ref-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() => document.getElementById(`upload-button-color-ref-${materialIndex}`)?.click()}
                            >
                              {material.buttonColorReference ? 'UPLOADED' : 'UPLOAD COLOR REF'}
                            </Button>
                          </div>
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('buttonPlacement')} error={errors[getErrorKey('buttonPlacement')]}>
                          <div className="flex flex-col gap-2">
                            <Input
                              type="text"
                              value={material.buttonPlacement || ''}
                              onChange={(e) => handleChange(materialIndex, 'buttonPlacement', e.target.value)}
                              placeholder="Text"
                            aria-invalid={hasError('buttonPlacement')}
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleChange(materialIndex, 'buttonReferenceImage', f); }}
                              className="hidden"
                              id={`upload-button-ref-image-${materialIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() => document.getElementById(`upload-button-ref-image-${materialIndex}`)?.click()}
                            >
                              {material.buttonReferenceImage ? 'UPLOADED' : 'UPLOAD REF IMAGE'}
                            </Button>
                          </div>
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('buttonTestingRequirements')} error={errors[getErrorKey('buttonTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.buttonTestingRequirements) ? material.buttonTestingRequirements : (material.buttonTestingRequirements ? [material.buttonTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'buttonTestingRequirements', arr)}
                                options={['Needle Detection', 'Pull Strength', 'Colour Fastness', 'REACH/OEKO-TEX', 'Corrosion']}
                                placeholder="Select testing requirements"
                                error={hasError('buttonTestingRequirements')}
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleChange(materialIndex, 'buttonTestingRequirementFile', f); }}
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

                        <Field label="QTY" width="sm" required={!isOptionalField('buttonQty')} error={errors[getErrorKey('buttonQty')]}>
                          <Input
                            type="text"
                            value={material.buttonQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'buttonQty', e.target.value)}
                            placeholder="Unit: Pieces"
                            aria-invalid={hasError('buttonQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('buttonSurplus')} error={errors[getErrorKey('buttonSurplus')]}>
                          <PercentInput
                            value={material.buttonSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'buttonSurplus', e.target.value)}
                            error={hasError('buttonSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('buttonWastage')} error={errors[getErrorKey('buttonWastage')]}>
                          <PercentInput
                            value={material.buttonWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'buttonWastage', e.target.value)}
                            error={hasError('buttonWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('buttonApproval')} error={errors[getErrorKey('buttonApproval')]}>
                          <SearchableDropdown
                            value={material.buttonApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'buttonApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('buttonApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('buttonRemarks')} error={errors[getErrorKey('buttonRemarks')]}>
                          <Input
                            type="text"
                            value={material.buttonRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'buttonRemarks', e.target.value)}
                            placeholder="Self-Shank, Laser Engraved Logo"
                            aria-invalid={hasError('buttonRemarks')}
                          />
                        </Field>
                      </div>

                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showButtonsAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showButtonsAdvancedSpec', !material.showButtonsAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showButtonsAdvancedSpec && (
                        <ButtonsAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* VELCRO Fields */}
                  {material.trimAccessory === 'VELCRO' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="PART" width="sm" required={!isOptionalField('velcroPart')} error={errors[getErrorKey('velcroPart')]}>
                          <SearchableDropdown
                            value={material.velcroPart || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroPart', selectedValue)}
                            options={['HOOK','LOOP','BOTH']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroPart'))}
                          />
                        </Field>
                        <Field label="TYPE" width="sm" required={!isOptionalField('velcroType')} error={errors[getErrorKey('velcroType')]}>
                          <SearchableDropdown
                            value={material.velcroType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroType', selectedValue)}
                            options={['Sew-On', 'Adhesive Backed (PSA)', 'Die-Cut Shapes', 'ONE-WRAP', 'Soft Loop', 'Mushroom']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('velcroMaterial')} error={errors[getErrorKey('velcroMaterial')]}>
                          <SearchableDropdown
                            value={material.velcroMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroMaterial', selectedValue)}
                            options={['Nylon (Higher cycle life)', 'Polyester (UV/moisture resistant)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroMaterial'))}
                          />
                        </Field>
                        <Field label="ATTACHMENT" width="sm" required={!isOptionalField('velcroAttachment')} error={errors[getErrorKey('velcroAttachment')]}>
                          <SearchableDropdown
                            value={material.velcroAttachment || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroAttachment', selectedValue)}
                            options={['Sewing', 'Adhesive','General','High','Temp','Permanent']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroAttachment'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('velcroPlacement')} error={errors[getErrorKey('velcroPlacement')]}>
                          <Input
                            type="text"
                            value={material.velcroPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroPlacement', e.target.value)}
                            placeholder="PLACEMENT"
                            aria-invalid={hasError('velcroPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('velcroPlacementReferenceImage')} error={errors[getErrorKey('velcroPlacementReferenceImage')]}>
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
                        <Field label="GSM" width="sm" required={!isOptionalField('velcroGsm')} error={errors[getErrorKey('velcroGsm')]}>
                          <Input
                            type="text"
                            value={material.velcroGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('velcroGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" width="sm" required={!isOptionalField('velcroLengthCm')} error={errors[getErrorKey('velcroLengthCm')]}>
                          <Input
                            type="text"
                            value={material.velcroLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('velcroLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" width="sm" required={!isOptionalField('velcroWidthCm')} error={errors[getErrorKey('velcroWidthCm')]}>
                          <Input
                            type="text"
                            value={material.velcroWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('velcroWidthCm')}
                          />
                        </Field>
                        <Field label="YARDAGE (CNS/PC)" width="sm" required={!isOptionalField('velcroYardageCns')} error={errors[getErrorKey('velcroYardageCns')]}>
                          <Input
                            type="text"
                            value={material.velcroYardageCns || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroYardageCns', e.target.value)}
                            placeholder="Yardage (cns per pc)"
                            aria-invalid={hasError('velcroYardageCns')}
                          />
                        </Field>
                        <Field label="KGS (CNS/PC)" width="sm" required={!isOptionalField('velcroKgsCns')} error={errors[getErrorKey('velcroKgsCns')]}>
                          <Input
                            type="text"
                            value={material.velcroKgsCns || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroKgsCns', e.target.value)}
                            placeholder="Kgs (cns per pc)"
                            aria-invalid={hasError('velcroKgsCns')}
                          />
                        </Field>
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('velcroTestingRequirements')} error={errors[getErrorKey('velcroTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.velcroTestingRequirements) ? material.velcroTestingRequirements : (material.velcroTestingRequirements ? [material.velcroTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'velcroTestingRequirements', arr)}
                                error={hasError('velcroTestingRequirements')}
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
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('velcroSurplus')} error={errors[getErrorKey('velcroSurplus')]}>
                          <PercentInput
                            value={material.velcroSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroSurplus', e.target.value)}
                            error={hasError('velcroSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('velcroWastage')} error={errors[getErrorKey('velcroWastage')]}>
                          <PercentInput
                            value={material.velcroWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroWastage', e.target.value)}
                            error={hasError('velcroWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('velcroApproval')} error={errors[getErrorKey('velcroApproval')]}>
                          <SearchableDropdown
                            value={material.velcroApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'velcroApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('velcroApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('velcroRemarks')} error={errors[getErrorKey('velcroRemarks')]}>
                          <Input
                            type="text"
                            value={material.velcroRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroRemarks', e.target.value)}
                            placeholder="Pack Hook & Loop separately, Non-abrasive loop for skin"
                            aria-invalid={hasError('velcroRemarks')}
                          />
                        </Field>
                      </div>
                      {/* VELCRO - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showVelcroAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showVelcroAdvancedSpec', !material.showVelcroAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showVelcroAdvancedSpec && (
                        <VelcroAdvancedSpec
                          material={material}
                          materialIndex={materialIndex}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* RIVETS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RIVETS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('rivetType')} error={errors[getErrorKey('rivetType')]}>
                          <SearchableDropdown
                            value={material.rivetType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetType', selectedValue)}
                            options={['Double Cap', 'Single Cap', 'Tubular', 'Rapid', 'Decorative']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('rivetType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('rivetMaterial')} error={errors[getErrorKey('rivetMaterial')]}>
                          <SearchableDropdown
                            value={material.rivetMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetMaterial', selectedValue)}
                            options={['Brass', 'Steel', 'Aluminum', 'Zinc Alloy']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('rivetMaterial'))}
                          />
                        </Field>
                        <Field label="CAP SIZE" width="sm" required={!isOptionalField('rivetCapSize')} error={errors[getErrorKey('rivetCapSize')]}>
                          <Input
                            type="text"
                            value={material.rivetCapSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetCapSize', e.target.value)}
                            placeholder="e.g., 8mm, 10mm"
                            aria-invalid={hasError('rivetCapSize')}
                          />
                        </Field>
                        <Field label="POST HEIGHT" width="sm" required={!isOptionalField('rivetPostHeight')} error={errors[getErrorKey('rivetPostHeight')]}>
                          <Input
                            type="text"
                            value={material.rivetPostHeight || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetPostHeight', e.target.value)}
                            placeholder="e.g., 6mm, 8mm"
                            aria-invalid={hasError('rivetPostHeight')}
                          />
                        </Field>
                        <Field label="FINISH/PLATING" width="sm" required={!isOptionalField('rivetFinishPlating')} error={errors[getErrorKey('rivetFinishPlating')]}>
                          <SearchableDropdown
                            value={material.rivetFinishPlating || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetFinishPlating', selectedValue)}
                            options={['Nickel', 'Copper', 'Antique Brass', 'Gunmetal', 'Black Oxide', 'Matte', 'Shiny']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('rivetFinishPlating'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('rivetPlacement')} error={errors[getErrorKey('rivetPlacement')]}>
                          <Input
                            type="text"
                            value={material.rivetPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetPlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('rivetPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('rivetPlacementReferenceImage')} error={errors[getErrorKey('rivetPlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('rivetTestingRequirements')} error={errors[getErrorKey('rivetTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.rivetTestingRequirements) ? material.rivetTestingRequirements : (material.rivetTestingRequirements ? [material.rivetTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'rivetTestingRequirements', arr)}
                                error={hasError('rivetTestingRequirements')}
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
                        <Field label="QTY" width="sm" required={!isOptionalField('rivetQty')} error={errors[getErrorKey('rivetQty')]}>
                          <Input
                            type="text"
                            value={material.rivetQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetQty', e.target.value)}
                            placeholder="PCS"
                            aria-invalid={hasError('rivetQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('rivetSurplus')} error={errors[getErrorKey('rivetSurplus')]}>
                          <PercentInput
                            value={material.rivetSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetSurplus', e.target.value)}
                            error={hasError('rivetSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('rivetWastage')} error={errors[getErrorKey('rivetWastage')]}>
                          <PercentInput
                            value={material.rivetWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetWastage', e.target.value)}
                            error={hasError('rivetWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('rivetApproval')} error={errors[getErrorKey('rivetApproval')]}>
                          <SearchableDropdown
                            value={material.rivetApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('rivetApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('rivetRemarks')} error={errors[getErrorKey('rivetRemarks')]}>
                          <Input
                            type="text"
                            value={material.rivetRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'rivetRemarks', e.target.value)}
                            placeholder="TEXT"
                            aria-invalid={hasError('rivetRemarks')}
                          />
                        </Field>
                      </div>
                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showRivetAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showRivetAdvancedSpec', !material.showRivetAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showRivetAdvancedSpec && (
                        <RivetAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* NIWAR-WEBBING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'NIWAR-WEBBING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm"
                        >
                          <SearchableDropdown
                            value={material.niwarType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarType', selectedValue)}
                            options={['Woven (Twill, Plain, Herringbone)', 'Knitted', 'Non-Woven', 'Binding Tape', 'Grosgrain']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('niwarType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm"
                        >
                          <SearchableDropdown
                            value={material.niwarMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarMaterial', selectedValue)}
                            options={['Cotton', 'Polyester', 'Polypropylene (PP)', 'Nylon', 'Blends', 'Jute']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('niwarMaterial'))}
                          />
                        </Field>
                        <Field label="NO OF COLOURS" width="sm"
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
                        <Field label="WEAVE PATTERN" width="sm"
                        >
                          <SearchableDropdown
                            value={material.niwarWeavePattern || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarWeavePattern', selectedValue)}
                            options={['Plain', 'Twill', 'Herringbone', 'Seatbelt-style', 'Tubular']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('niwarWeavePattern'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm"
                        >
                          <Input
                            type="text"
                            value={material.niwarPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarPlacement', e.target.value)}
                            placeholder="PLACEMENT"
                            aria-invalid={hasError('niwarPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('niwarPlacementReferenceImage')} error={errors[getErrorKey('niwarPlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5"
                        >
                          <TestingRequirementsInput
                            value={Array.isArray(material.niwarTestingRequirements) ? material.niwarTestingRequirements : (material.niwarTestingRequirements ? [material.niwarTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'niwarTestingRequirements', arr)}
                                error={hasError('niwarTestingRequirements')}
                            options={['Tensile Strength', 'Colour Fastness', 'Abrasion Resistance', 'Flammability', 'REACH/OEKO-TEX']}
                            placeholder="Select testing requirements"
                            className={hasError('niwarTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="GSM" width="sm"
                        >
                          <Input
                            type="text"
                            value={material.niwarGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('niwarGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" width="sm"
                        >
                          <Input
                            type="text"
                            value={material.niwarLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('niwarLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" width="sm"
                        >
                          <Input
                            type="text"
                            value={material.niwarWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('niwarWidthCm')}
                          />
                        </Field>
                        <Field label="YARDAGE (CNS/PC)" width="sm"
                        >
                          <Input
                            type="text"
                            value={material.niwarYardageCns || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarYardageCns', e.target.value)}
                            placeholder="Yardage (cns per pc)"
                            aria-invalid={hasError('niwarYardageCns')}
                          />
                        </Field>
                        <Field label="KGS (CNS/PC)" width="sm"
                        >
                          <Input
                            type="text"
                            value={material.niwarKgsCns || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarKgsCns', e.target.value)}
                            placeholder="Kgs (cns per pc)"
                            aria-invalid={hasError('niwarKgsCns')}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm" required={!isOptionalField('niwarQtyType')} error={errors[getErrorKey('niwarQtyType')]}>
                          <SearchableDropdown
                            value={material.niwarQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm" required={!isOptionalField('niwarQtyYardage')} error={errors[getErrorKey('niwarQtyYardage')]}>
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
                            aria-invalid={hasError('niwarQtyYardage')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm"
                        >
                          <PercentInput
                            value={material.niwarSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarSurplus', e.target.value)}
                            error={hasError('niwarSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm"
                        >
                          <PercentInput
                            value={material.niwarWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarWastage', e.target.value)}
                            error={hasError('niwarWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm"
                        >
                          <SearchableDropdown
                            value={material.niwarApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'niwarApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('niwarApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('niwarRemarks')} error={errors[getErrorKey('niwarRemarks')]}>
                          <Input
                            type="text"
                            value={material.niwarRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'niwarRemarks', e.target.value)}
                            placeholder="Seatbelt-style weave, 1200N minimum strength"
                            aria-invalid={hasError('niwarRemarks')}
                          />
                        </Field>
                      </div>
                      {/* NIWAR-WEBBING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showNiwarAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showNiwarAdvancedSpec', !material.showNiwarAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showNiwarAdvancedSpec && (
                        <NiwarAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* LACE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'LACE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('laceType')} error={errors[getErrorKey('laceType')]}>
                          <SearchableDropdown
                            value={material.laceType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceType', selectedValue)}
                            options={['Trim Lace', 'Stretch Lace', 'Leavers Lace', 'Embroidery Lace', 'Crochet Lace']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('laceType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('laceMaterial')} error={errors[getErrorKey('laceMaterial')]}>
                          <SearchableDropdown
                            value={material.laceMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceMaterial', selectedValue)}
                            options={['Cotton', 'Polyester', 'Nylon', 'Rayon', 'Blends']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('laceMaterial'))}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('laceColour')} error={errors[getErrorKey('laceColour')]}>
                          <SearchableDropdown
                            value={material.laceColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceColour', selectedValue)}
                            options={['DTM', 'White', 'Black', 'Natural', 'Pantone TPX/TCX']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('laceColour'))}
                          />
                        </Field>
                        <Field label="COLOR REF" width="sm" required={!isOptionalField('laceColorReference')} error={errors[getErrorKey('laceColorReference')]}>
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
                        <Field label="DESIGN REF" width="sm" required={!isOptionalField('laceDesignRef')} error={errors[getErrorKey('laceDesignRef')]}>
                          <Input
                            type="text"
                            value={material.laceDesignRef || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceDesignRef', e.target.value)}
                            placeholder="Design ref"
                            aria-invalid={hasError('laceDesignRef')}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('lacePlacement')} error={errors[getErrorKey('lacePlacement')]}>
                          <Input
                            type="text"
                            value={material.lacePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'lacePlacement', e.target.value)}
                            placeholder="PLACEMENT"
                            aria-invalid={hasError('lacePlacement')}
                          />
                        </Field>
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('laceTestingRequirements')} error={errors[getErrorKey('laceTestingRequirements')]}>
                          <TestingRequirementsInput
                            value={Array.isArray(material.laceTestingRequirements) ? material.laceTestingRequirements : (material.laceTestingRequirements ? [material.laceTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'laceTestingRequirements', arr)}
                                error={hasError('laceTestingRequirements')}
                            options={['Colour Fastness', 'Stretch Recovery', 'Dimensional Stability', 'Abrasion']}
                            placeholder="Select testing requirements"
                            className={hasError('laceTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="GSM" width="sm" required={!isOptionalField('laceGsm')} error={errors[getErrorKey('laceGsm')]}>
                          <Input
                            type="text"
                            value={material.laceGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('laceGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" width="sm" required={!isOptionalField('laceLengthCm')} error={errors[getErrorKey('laceLengthCm')]}>
                          <Input
                            type="text"
                            value={material.laceLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('laceLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH CM" width="sm" required={!isOptionalField('laceWidthCm')} error={errors[getErrorKey('laceWidthCm')]}>
                          <Input
                            type="text"
                            value={material.laceWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('laceWidthCm')}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm" required={!isOptionalField('laceQtyType')} error={errors[getErrorKey('laceQtyType')]}>
                          <SearchableDropdown
                            value={material.laceQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field
                          label="QTY"
                          width="sm"
                          required={!isOptionalField('laceQtyYardage')}
                          error={
                            material.laceQtyType === 'Kgs (cns per pc)'
                              ? errors[getErrorKey('laceQtyKgs')]
                              : errors[getErrorKey('laceQtyYardage')]
                          }
                        >
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
                            aria-invalid={material.laceQtyType === 'Kgs (cns per pc)' ? hasError('laceQtyKgs') : hasError('laceQtyYardage')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('laceSurplus')} error={errors[getErrorKey('laceSurplus')]}>
                          <PercentInput
                            value={material.laceSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceSurplus', e.target.value)}
                            error={hasError('laceSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('laceWastage')} error={errors[getErrorKey('laceWastage')]}>
                          <PercentInput
                            value={material.laceWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceWastage', e.target.value)}
                            error={hasError('laceWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('laceApproval')} error={errors[getErrorKey('laceApproval')]}>
                          <SearchableDropdown
                            value={material.laceApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'laceApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('laceApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('laceRemarks')} error={errors[getErrorKey('laceRemarks')]}>
                          <Input
                            type="text"
                            value={material.laceRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'laceRemarks', e.target.value)}
                            placeholder="Continuous pattern, No visible knots"
                            aria-invalid={hasError('laceRemarks')}
                          />
                        </Field>
                      </div>
                      {/* LACE - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showLaceAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showLaceAdvancedSpec', !material.showLaceAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showLaceAdvancedSpec && (
                        <LaceAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* FELT - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FELT' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('feltType')} error={errors[getErrorKey('feltType')]}>
                          <SearchableDropdown
                            value={material.feltType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltType', selectedValue)}
                            options={['Needle Felt', 'Pressed Felt', 'Wool Felt', 'Synthetic Felt']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('feltMaterial')} error={errors[getErrorKey('feltMaterial')]}>
                          <SearchableDropdown
                            value={material.feltMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltMaterial', selectedValue)}
                            options={['Wool', 'Polyester', 'Rayon', 'Blends']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltMaterial'))}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('feltColour')} error={errors[getErrorKey('feltColour')]}>
                          <SearchableDropdown
                            value={material.feltColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltColour', selectedValue)}
                            options={['DTM', 'White', 'Black', 'Natural', 'Pantone TPX/TCX']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltColour'))}
                          />
                        </Field>
                        <Field label="COLOR REF" width="sm" required={!isOptionalField('feltColorReference')} error={errors[getErrorKey('feltColorReference')]}>
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
                        <Field label="GSM" width="sm" required={!isOptionalField('feltGsm')} error={errors[getErrorKey('feltGsm')]}>
                          <Input
                            type="text"
                            value={material.feltGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('feltGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" width="sm" required={!isOptionalField('feltLengthCm')} error={errors[getErrorKey('feltLengthCm')]}>
                          <Input
                            type="text"
                            value={material.feltLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('feltLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" width="sm" required={!isOptionalField('feltWidthCm')} error={errors[getErrorKey('feltWidthCm')]}>
                          <Input
                            type="text"
                            value={material.feltWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('feltWidthCm')}
                          />
                        </Field>
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('feltTestingRequirements')} error={errors[getErrorKey('feltTestingRequirements')]}>
                          <TestingRequirementsInput
                            value={Array.isArray(material.feltTestingRequirements) ? material.feltTestingRequirements : (material.feltTestingRequirements ? [material.feltTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'feltTestingRequirements', arr)}
                                error={hasError('feltTestingRequirements')}
                            options={['Flammability', 'Dimensional Stability', 'Colour Fastness', 'Abrasion']}
                            placeholder="Select testing requirements"
                            className={hasError('feltTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm" required={!isOptionalField('feltQtyType')} error={errors[getErrorKey('feltQtyType')]}>
                          <SearchableDropdown
                            value={material.feltQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm" required={!isOptionalField('feltYardage')} error={errors[getErrorKey('feltYardage')]}>
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
                            aria-invalid={hasError('feltYardage')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('feltSurplus')} error={errors[getErrorKey('feltSurplus')]}>
                          <PercentInput
                            value={material.feltSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltSurplus', e.target.value)}
                            error={hasError('feltSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('feltWastage')} error={errors[getErrorKey('feltWastage')]}>
                          <PercentInput
                            value={material.feltWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltWastage', e.target.value)}
                            error={hasError('feltWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('feltApproval')} error={errors[getErrorKey('feltApproval')]}>
                          <SearchableDropdown
                            value={material.feltApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('feltApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('feltRemarks')} error={errors[getErrorKey('feltRemarks')]}>
                          <Input
                            type="text"
                            value={material.feltRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'feltRemarks', e.target.value)}
                            placeholder="Non-Toxic, Anti-Fraying, Heat press suitable"
                            aria-invalid={hasError('feltRemarks')}
                          />
                        </Field>
                      </div>
                      {/* FELT - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showFeltAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showFeltAdvancedSpec', !material.showFeltAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showFeltAdvancedSpec && (
                        <FeltAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* INTERLINING(FUSING) Fields */}
                  {material.trimAccessory === 'INTERLINING(FUSING)' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('interliningType')} error={errors[getErrorKey('interliningType')]}>
                          <SearchableDropdown
                            value={material.interliningType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningType', selectedValue)}
                            options={['Woven', 'Non-Woven', 'Knit', 'Fusible (adhesive)', 'Non-Fusible (sew-in)', 'Weft Insert', 'Bi-Stretch']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('interliningMaterial')} error={errors[getErrorKey('interliningMaterial')]}>
                          <SearchableDropdown
                            value={material.interliningMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningMaterial', selectedValue)}
                            options={['Polyester', 'Cotton', 'Cellulose (Rayon)', 'Polyamide', 'Blends']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningMaterial'))}
                          />
                        </Field>
                        <Field label="ADHESIVE TYPE" width="sm" required={!isOptionalField('interliningAdhesiveType')} error={errors[getErrorKey('interliningAdhesiveType')]}>
                          <SearchableDropdown
                            value={material.interliningAdhesiveType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningAdhesiveType', selectedValue)}
                            options={['PA (Polyamide)', 'LDPE', 'PES (Polyester)', 'Double Dot', 'Scatter Coat', 'Paste']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningAdhesiveType'))}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('interliningColour')} error={errors[getErrorKey('interliningColour')]}>
                          <SearchableDropdown
                            value={material.interliningColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningColour', selectedValue)}
                            options={['White', 'Black', 'Grey', 'Charcoal', 'DTM']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningColour'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('interliningPlacement')} error={errors[getErrorKey('interliningPlacement')]}>
                          <Input
                            type="text"
                            value={material.interliningPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningPlacement', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('interliningPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('interliningPlacementReferenceImage')} error={errors[getErrorKey('interliningPlacementReferenceImage')]}>
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
                        <Field label="GSM" width="sm" required={!isOptionalField('interliningGsm')} error={errors[getErrorKey('interliningGsm')]}>
                          <Input
                            type="text"
                            value={material.interliningGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('interliningGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" width="sm" required={!isOptionalField('interliningLength')} error={errors[getErrorKey('interliningLength')]}>
                          <Input
                            type="text"
                            value={material.interliningLength || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningLength', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('interliningLength')}
                          />
                        </Field>
                        <Field label="WIDTH" width="sm" required={!isOptionalField('interliningWidth')} error={errors[getErrorKey('interliningWidth')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('interliningTestingRequirements')} error={errors[getErrorKey('interliningTestingRequirements')]}>
                          <TestingRequirementsInput
                            value={Array.isArray(material.interliningTestingRequirements) ? material.interliningTestingRequirements : (material.interliningTestingRequirements ? [material.interliningTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'interliningTestingRequirements', arr)}
                                error={hasError('interliningTestingRequirements')}
                            options={['Bond Strength', 'Residual Shrinkage', 'Wash Resistance', 'Strike-Through']}
                            placeholder="Select testing requirements"
                            className={hasError('interliningTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm" required={!isOptionalField('interliningQtyType')} error={errors[getErrorKey('interliningQtyType')]}>
                          <SearchableDropdown
                            value={material.interliningQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm" required={!isOptionalField('interliningYardage')} error={errors[getErrorKey('interliningYardage')]}>
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
                            aria-invalid={hasError('interliningYardage')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('interliningSurplus')} error={errors[getErrorKey('interliningSurplus')]}>
                          <PercentInput
                            value={material.interliningSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningSurplus', e.target.value)}
                            error={hasError('interliningSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('interliningWastage')} error={errors[getErrorKey('interliningWastage')]}>
                          <PercentInput
                            value={material.interliningWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningWastage', e.target.value)}
                            error={hasError('interliningWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('interliningApproval')} error={errors[getErrorKey('interliningApproval')]}>
                          <SearchableDropdown
                            value={material.interliningApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'interliningApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('interliningApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('interliningRemarks')} error={errors[getErrorKey('interliningRemarks')]}>
                          <Input
                            type="text"
                            value={material.interliningRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'interliningRemarks', e.target.value)}
                            placeholder="Hand feel required, Low shrinkage, Shell compatible"
                            aria-invalid={hasError('interliningRemarks')}
                          />
                        </Field>
                      </div>
                      {/* INTERLINING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showInterliningAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showInterliningAdvancedSpec', !material.showInterliningAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showInterliningAdvancedSpec && (
                        <InterliningAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* HOOKS & EYES Fields - Complete implementation based on image data */}
                  {material.trimAccessory === 'HOOKS-EYES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('hookEyeType')} error={errors[getErrorKey('hookEyeType')]}>
                          <SearchableDropdown
                            value={material.hookEyeType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeType', selectedValue)}
                            options={['Standard', 'Slider', 'Flat', 'Lingerie', 'Coat', 'Pants', 'Bra', 'Custom']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('hookEyeMaterial')} error={errors[getErrorKey('hookEyeMaterial')]}>
                          <SearchableDropdown
                            value={material.hookEyeMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeMaterial', selectedValue)}
                            options={['Metal (Steel)', 'Brass', 'Nylon Coated', 'Stainless Steel']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE" width="sm" required={!isOptionalField('hookEyeSize')} error={errors[getErrorKey('hookEyeSize')]}>
                          <Input
                            type="text"
                            value={material.hookEyeSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeSize', e.target.value)}
                            placeholder="MM"
                            aria-invalid={hasError('hookEyeSize')}
                          />
                        </Field>
                        <Field label="COLOUR FINISH" width="sm" required={!isOptionalField('hookEyeColourFinish')} error={errors[getErrorKey('hookEyeColourFinish')]}>
                          <SearchableDropdown
                            value={material.hookEyeColourFinish || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeColourFinish', selectedValue)}
                            options={['Nickel', 'Black', 'Antique Brass', 'Gunmetal', 'Matte']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeColourFinish'))}
                          />
                        </Field>
                        <Field label="FINISH TYPE" width="sm" required={!isOptionalField('hookEyeFinishType')} error={errors[getErrorKey('hookEyeFinishType')]}>
                          <SearchableDropdown
                            value={material.hookEyeFinishType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeFinishType', selectedValue)}
                            options={['Polished', 'Matte', 'Coated', 'Plated']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeFinishType'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('hookEyePlacement')} error={errors[getErrorKey('hookEyePlacement')]}>
                          <Input
                            type="text"
                            value={material.hookEyePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyePlacement', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('hookEyePlacement')}
                          />
                        </Field>
                        <Field label="QTY" width="sm" required={!isOptionalField('hookEyeQty')} error={errors[getErrorKey('hookEyeQty')]}>
                          <Input
                            type="text"
                            value={material.hookEyeQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeQty', e.target.value)}
                            placeholder="PCS"
                            aria-invalid={hasError('hookEyeQty')}
                          />
                        </Field>
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('hookEyeTestingRequirements')} error={errors[getErrorKey('hookEyeTestingRequirements')]}>
                          <TestingRequirementsInput
                            value={Array.isArray(material.hookEyeTestingRequirements) ? material.hookEyeTestingRequirements : (material.hookEyeTestingRequirements ? [material.hookEyeTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'hookEyeTestingRequirements', arr)}
                                error={hasError('hookEyeTestingRequirements')}
                            options={['Holding Power', 'Corrosion', 'Needle Detection', 'Edge Smoothness']}
                            placeholder="Select testing requirements"
                            className={hasError('hookEyeTestingRequirements') ? 'border-red-600' : ''}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('hookEyeSurplus')} error={errors[getErrorKey('hookEyeSurplus')]}>
                          <PercentInput
                            value={material.hookEyeSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeSurplus', e.target.value)}
                            error={hasError('hookEyeSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('hookEyeWastage')} error={errors[getErrorKey('hookEyeWastage')]}>
                          <PercentInput
                            value={material.hookEyeWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeWastage', e.target.value)}
                            error={hasError('hookEyeWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('hookEyeApproval')} error={errors[getErrorKey('hookEyeApproval')]}>
                          <SearchableDropdown
                            value={material.hookEyeApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('hookEyeApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('hookEyeRemarks')} error={errors[getErrorKey('hookEyeRemarks')]}>
                          <Input
                            type="text"
                            value={material.hookEyeRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'hookEyeRemarks', e.target.value)}
                            placeholder="Flat bar, Prevent accidental release"
                            aria-invalid={hasError('hookEyeRemarks')}
                          />
                        </Field>
                      </div>
                      {/* ADVANCE SPEC Button */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.hookEyeAdvanceDataOpen ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'hookEyeAdvanceDataOpen', !material.hookEyeAdvanceDataOpen)}
                        >
                          Advance Spec
                        </Button>
                      </div>

                      {/* STRENGTH and APPLICATION - Only show when ADVANCE SPEC is open */}
                      {material.hookEyeAdvanceDataOpen && (
                        <HookEyeAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* BUCKLES — Field, Input, PercentInput, TestingRequirementsInput, Button, shadcn tokens */}
                  {material.trimAccessory === 'BUCKLES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('bucklesType')} error={errors[getErrorKey('bucklesType')]}>
                          <SearchableDropdown
                            value={material.bucklesType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesType', selectedValue)}
                            options={['Side Release', 'D-Ring', 'Tri-Glide', 'Ladder Lock', 'Belt Buckle', 'Cam Buckle', 'Snap', 'Swivel', 'Center Bar', 'O-Ring', 'Magnetic', 'Roller', 'Military/Web']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('bucklesType') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="MATERIAL DESC." width="sm" required={!isOptionalField('bucklesMaterial')} error={errors[getErrorKey('bucklesMaterial')]}>
                          <SearchableDropdown
                            value={material.bucklesMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesMaterial', selectedValue)}
                            options={['Plastic (Nylon)', 'Plastic (POM/Acetal)', 'Plastic (ABS)', 'Metal (Brass)', 'Metal (Zinc)', 'Metal (Steel)', 'Metal (Stainless)', 'Metal (Aluminium)', 'Acetal/POM', 'Zinc Alloy Die-Cast', 'Carbon Fiber Look']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('bucklesMaterial') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="SIZE (Webbing Width)" width="sm" required={!isOptionalField('bucklesSize')} error={errors[getErrorKey('bucklesSize')]}>
                          <SearchableDropdown
                            value={material.bucklesSize || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesSize', selectedValue)}
                            options={['10mm', '15mm', '20mm', '25mm', '32mm', '38mm', '50mm', '1"', '1.5"', '2"']}
                            placeholder="Select or type (CM)"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('bucklesSize') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="FINISH/COLOUR" width="sm" required={!isOptionalField('bucklesFinishColour')} error={errors[getErrorKey('bucklesFinishColour')]}>
                          <SearchableDropdown
                            value={material.bucklesFinishColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesFinishColour', selectedValue)}
                            options={['Black', 'Clear', 'DTM', 'Plating (Nickel)', 'Plating (Gunmetal)', 'Plating (Antique Brass)', 'Matte', 'Glossy', 'Antique', 'Plated (Nickel/Chrome)', 'Powder Coated', 'Anodized']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('bucklesFinishColour') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('bucklesPlacement')} error={errors[getErrorKey('bucklesPlacement')]}>
                          <Input
                            type="text"
                            value={material.bucklesPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesPlacement', e.target.value)}
                            placeholder="Enter placement location"
                            aria-invalid={hasError('bucklesPlacement')}
                          />
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('bucklesTestingRequirements')} error={errors[getErrorKey('bucklesTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.bucklesTestingRequirements) ? material.bucklesTestingRequirements : (material.bucklesTestingRequirements ? [material.bucklesTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'bucklesTestingRequirements', arr)}
                                error={hasError('bucklesTestingRequirements')}
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

                        <Field label="QTY" width="sm" required={!isOptionalField('bucklesQty')} error={errors[getErrorKey('bucklesQty')]}>
                          <Input
                            type="text"
                            value={material.bucklesQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesQty', e.target.value)}
                            placeholder="Unit: Pieces"
                            aria-invalid={hasError('bucklesQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('bucklesSurplus')} error={errors[getErrorKey('bucklesSurplus')]}>
                          <PercentInput
                            value={material.bucklesSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesSurplus', e.target.value)}
                            error={hasError('bucklesSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('bucklesWastage')} error={errors[getErrorKey('bucklesWastage')]}>
                          <PercentInput
                            value={material.bucklesWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesWastage', e.target.value)}
                            error={hasError('bucklesWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('bucklesApproval')} error={errors[getErrorKey('bucklesApproval')]}>
                          <SearchableDropdown
                            value={material.bucklesApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('bucklesRemarks')} error={errors[getErrorKey('bucklesRemarks')]}>
                          <Input
                            type="text"
                            value={material.bucklesRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'bucklesRemarks', e.target.value)}
                            placeholder="e.g., Finger guard, Outdoor suitable, Smooth edges"
                            aria-invalid={hasError('bucklesRemarks')}
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
                          Advance Spec
                        </Button>
                      </div>
                      {material.showBucklesAdvancedSpec && (
                        <BucklesAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}


                  {/* SHOULDER PADS / CUPS Fields - Complete implementation based on image data */}
                  {material.trimAccessory === 'SHOULDER PADS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('shoulderPadType')} error={errors[getErrorKey('shoulderPadType')]}>
                          <SearchableDropdown
                            value={material.shoulderPadType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadType', selectedValue)}
                            options={['Set-In Pad', 'Raglan Pad', 'Sleeve Head Roll', 'Bra Cup', 'Push-Up Pad', 'Removable Insert']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('shoulderPadMaterial')} error={errors[getErrorKey('shoulderPadMaterial')]}>
                          <SearchableDropdown
                            value={material.shoulderPadMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadMaterial', selectedValue)}
                            options={['Foam (Polyurethane)', 'Synthetic Fiber', 'Felt', 'Cotton Wadding']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm" required={!isOptionalField('shoulderPadSize')} error={errors[getErrorKey('shoulderPadSize')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadSize', e.target.value)}
                            placeholder="Dimensions (LxWxThickness) / Cup Size (A, B, C, D) CM"
                            aria-invalid={hasError('shoulderPadSize')}
                          />
                        </Field>
                        <Field label="THICKNESS" width="sm" required={!isOptionalField('shoulderPadThickness')} error={errors[getErrorKey('shoulderPadThickness')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadThickness || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadThickness', e.target.value)}
                            placeholder="At center/edge (e.g., 5mm center, 3mm edge) CM"
                            aria-invalid={hasError('shoulderPadThickness')}
                          />
                        </Field>
                        <Field label="SHAPE" width="sm" required={!isOptionalField('shoulderPadShape')} error={errors[getErrorKey('shoulderPadShape')]}>
                          <SearchableDropdown
                            value={material.shoulderPadShape || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadShape', selectedValue)}
                            options={['Crescent', 'Triangular', 'Oval', 'Round', 'Custom Molded']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadShape'))}
                          />
                        </Field>
                        <Field label="COVERING" width="sm" required={!isOptionalField('shoulderPadCovering')} error={errors[getErrorKey('shoulderPadCovering')]}>
                          <SearchableDropdown
                            value={material.shoulderPadCovering || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadCovering', selectedValue)}
                            options={['Covered (knit/non-woven)', 'Uncovered (raw)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadCovering'))}
                          />
                        </Field>
                        <Field label="COVERING COLOUR" width="sm" required={!isOptionalField('shoulderPadCoveringColour')} error={errors[getErrorKey('shoulderPadCoveringColour')]}>
                          <SearchableDropdown
                            value={material.shoulderPadCoveringColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadCoveringColour', selectedValue)}
                            options={['White', 'Black', 'DTM', 'Nude']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadCoveringColour'))}
                          />
                        </Field>
                        <Field label="ATTACHMENT" width="sm" required={!isOptionalField('shoulderPadAttachment')} error={errors[getErrorKey('shoulderPadAttachment')]}>
                          <SearchableDropdown
                            value={material.shoulderPadAttachment || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadAttachment', selectedValue)}
                            options={['Sew-In', 'Fusible (adhesive)', 'Removable (pocket)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadAttachment'))}
                          />
                        </Field>
                        <Field label="DENSITY" width="sm" required={!isOptionalField('shoulderPadDensity')} error={errors[getErrorKey('shoulderPadDensity')]}>
                          <SearchableDropdown
                            value={material.shoulderPadDensity || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadDensity', selectedValue)}
                            options={['Soft', 'Medium', 'Firm']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadDensity'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('shoulderPadPlacement')} error={errors[getErrorKey('shoulderPadPlacement')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadPlacement', e.target.value)}
                            placeholder="TEXT"
                            aria-invalid={hasError('shoulderPadPlacement')}
                          />
                        </Field>
                        <Field label="REF IMAGE" width="sm" required={!isOptionalField('shoulderPadReferenceImage')} error={errors[getErrorKey('shoulderPadReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('shoulderPadTestingRequirements')} error={errors[getErrorKey('shoulderPadTestingRequirements')]}>
                          <TestingRequirementsInput
                            value={Array.isArray(material.shoulderPadTestingRequirements) ? material.shoulderPadTestingRequirements : (material.shoulderPadTestingRequirements ? [material.shoulderPadTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'shoulderPadTestingRequirements', arr)}
                                error={hasError('shoulderPadTestingRequirements')}
                            options={['Wash Resistance', 'Flammability', 'Hypoallergenic']}
                            placeholder="Select testing requirements"
                          />
                        </Field>
                        <Field label="QTY" width="sm" required={!isOptionalField('shoulderPadQty')} error={errors[getErrorKey('shoulderPadQty')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadQty', e.target.value)}
                            placeholder="Pairs"
                            aria-invalid={hasError('shoulderPadQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('shoulderPadSurplus')} error={errors[getErrorKey('shoulderPadSurplus')]}>
                          <PercentInput
                            value={material.shoulderPadSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadSurplus', e.target.value)}
                            error={hasError('shoulderPadSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('shoulderPadWastage')} error={errors[getErrorKey('shoulderPadWastage')]}>
                          <PercentInput
                            value={material.shoulderPadWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadWastage', e.target.value)}
                            error={hasError('shoulderPadWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('shoulderPadApproval')} error={errors[getErrorKey('shoulderPadApproval')]}>
                          <SearchableDropdown
                            value={material.shoulderPadApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('shoulderPadApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('shoulderPadRemarks')} error={errors[getErrorKey('shoulderPadRemarks')]}>
                          <Input
                            type="text"
                            value={material.shoulderPadRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadRemarks', e.target.value)}
                            placeholder="Lightweight, Resilient, Hold shape after steam"
                            aria-invalid={hasError('shoulderPadRemarks')}
                          />
                        </Field>
                      </div>
                    </>
                  )}

                  {/* RIBBING Fields */}
                  {material.trimAccessory === 'RIBBING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('ribbingType')} error={errors[getErrorKey('ribbingType')]}>
                          <SearchableDropdown
                            value={material.ribbingType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ribbingType', selectedValue)}
                            options={['1x1 Rib', '2x2 Rib', 'Interlock', 'Jersey']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ribbingType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('ribbingMaterial')} error={errors[getErrorKey('ribbingMaterial')]}>
                          <SearchableDropdown
                            value={material.ribbingMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ribbingMaterial', selectedValue)}
                            options={['Cotton', 'Polyester', 'Spandex', 'Blend']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ribbingMaterial'))}
                          />
                        </Field>
                        <Field label="NO OF COLOURS" width="sm" required={!isOptionalField('ribbingColour')} error={errors[getErrorKey('ribbingColour')]}>
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
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('ribbingPlacement')} error={errors[getErrorKey('ribbingPlacement')]}>
                          <Input
                            type="text"
                            value={material.ribbingPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'ribbingPlacement', e.target.value)}
                            placeholder="PLACEMENT"
                            aria-invalid={hasError('ribbingPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('ribbingPlacementReferenceImage')} error={errors[getErrorKey('ribbingPlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('ribbingTestingRequirements')} error={errors[getErrorKey('ribbingTestingRequirements')]}>
                          <TestingRequirementsInput
                            value={Array.isArray(material.ribbingTestingRequirements) ? material.ribbingTestingRequirements : (material.ribbingTestingRequirements ? [material.ribbingTestingRequirements] : [])}
                            onChange={(arr) => handleChange(materialIndex, 'ribbingTestingRequirements', arr)}
                                error={hasError('ribbingTestingRequirements')}
                            options={['Recovery', 'Dimensional Stability', 'Colorfastness', 'Abrasion']}
                            placeholder="Select testing requirements"
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm" required={!isOptionalField('ribbingQtyType')} error={errors[getErrorKey('ribbingQtyType')]}>
                          <SearchableDropdown
                            value={material.ribbingQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ribbingQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm" required={!isOptionalField('ribbingQtyYardage')} error={errors[getErrorKey('ribbingQtyYardage')]}>
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
                            aria-invalid={hasError('ribbingQtyYardage')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm"
                        >
                          <PercentInput
                            value={material.ribbingSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'ribbingSurplus', e.target.value)}
                            error={hasError('ribbingSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm"
                        >
                          <PercentInput
                            value={material.ribbingWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'ribbingWastage', e.target.value)}
                            error={hasError('ribbingWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm"
                        >
                          <SearchableDropdown
                            value={material.ribbingApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ribbingApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ribbingApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('ribbingRemarks')} error={errors[getErrorKey('ribbingRemarks')]}>
                          <Input
                            type="text"
                            value={material.ribbingRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'ribbingRemarks', e.target.value)}
                            placeholder="Anti-curl on cut edge, 5% Lycra minimum"
                            aria-invalid={hasError('ribbingRemarks')}
                          />
                        </Field>
                      </div>
                      {/* RIBBING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showRibbingAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showRibbingAdvancedSpec', !material.showRibbingAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showRibbingAdvancedSpec && (
                        <RibbingAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* CABLE-TIES — Field, Input, PercentInput, TestingRequirementsInput, Button, shadcn tokens */}
                  {material.trimAccessory === 'CABLE-TIES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('cableTieType')} error={errors[getErrorKey('cableTieType')]}>
                          <SearchableDropdown
                            value={material.cableTieType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieType', selectedValue)}
                            options={['Standard Lock', 'Releasable/Reusable', 'Bar-Lok Loop (hang tags)', 'Security Tie']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('cableTieType') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('cableTieMaterial')} error={errors[getErrorKey('cableTieMaterial')]}>
                          <SearchableDropdown
                            value={material.cableTieMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieMaterial', selectedValue)}
                            options={['Nylon (PA66)', 'Polypropylene (PP)', 'Metal Detectable']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('cableTieMaterial') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm" required={!isOptionalField('cableTieSize')} error={errors[getErrorKey('cableTieSize')]}>
                          <SearchableDropdown
                            value={material.cableTieSize || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieSize', selectedValue)}
                            options={['100x2.5mm', '150x3.6mm', '200x4.8mm']}
                            placeholder="Select or type (CM)"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('cableTieSize') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('cableTieColour')} error={errors[getErrorKey('cableTieColour')]}>
                          <SearchableDropdown
                            value={material.cableTieColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieColour', selectedValue)}
                            options={['Clear/Natural', 'Black', 'Custom']}
                            placeholder="Select or type"
                            className={`border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none ${hasError('cableTieColour') ? 'border-red-600' : ''}`}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('cableTiePlacement')} error={errors[getErrorKey('cableTiePlacement')]}>
                          <Input
                            type="text"
                            value={material.cableTiePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTiePlacement', e.target.value)}
                            placeholder="Enter placement location"
                            aria-invalid={hasError('cableTiePlacement')}
                          />
                        </Field>

                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('cableTieTestingRequirements')} error={errors[getErrorKey('cableTieTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.cableTieTestingRequirements) ? material.cableTieTestingRequirements : (material.cableTieTestingRequirements ? [material.cableTieTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'cableTieTestingRequirements', arr)}
                                error={hasError('cableTieTestingRequirements')}
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

                        <Field label="QTY" width="sm" required={!isOptionalField('cableTieQty')} error={errors[getErrorKey('cableTieQty')]}>
                          <Input
                            type="text"
                            value={material.cableTieQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTieQty', e.target.value)}
                            placeholder="Unit: Pieces"
                            aria-invalid={hasError('cableTieQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('cableTieSurplus')} error={errors[getErrorKey('cableTieSurplus')]}>
                          <PercentInput
                            value={material.cableTieSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTieSurplus', e.target.value)}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('cableTieWastage')} error={errors[getErrorKey('cableTieWastage')]}>
                          <PercentInput
                            value={material.cableTieWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTieWastage', e.target.value)}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('cableTieApproval')} error={errors[getErrorKey('cableTieApproval')]}>
                          <SearchableDropdown
                            value={material.cableTieApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className="border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('cableTieRemarks')} error={errors[getErrorKey('cableTieRemarks')]}>
                          <Input
                            type="text"
                            value={material.cableTieRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'cableTieRemarks', e.target.value)}
                            placeholder="e.g., Rounded non-scratching edges, Operating temperature"
                            aria-invalid={hasError('cableTieRemarks')}
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
                          Advance Spec
                        </Button>
                      </div>
                      {material.showCableTieAdvancedSpec && (
                        <CableTieAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* SEAM TAPE Fields */}
                  {material.trimAccessory === 'SEAM TAPE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('seamTapeType')} error={errors[getErrorKey('seamTapeType')]}>
                          <SearchableDropdown
                            value={material.seamTapeType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeType', selectedValue)}
                            options={['2-Layer (PU/PVC)', '3-Layer (Tri-laminate)', 'Adhesive Film', 'Elastic Tape', 'Hot Melt Seam Tape', 'PU Seam Tape', 'TPU Tape', 'Reflective Seam Tape', 'Reinforcement Tape', 'Edge Binding Tape', 'Waterproof Sealing', 'Stretch Seam Support', 'Edge Stabilization', 'Hem Tape', 'Shoulder Tape']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('seamTapeMaterial')} error={errors[getErrorKey('seamTapeMaterial')]}>
                          <SearchableDropdown
                            value={material.seamTapeMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeMaterial', selectedValue)}
                            options={['TPU (Thermoplastic Polyurethane)', 'PEVA', 'PU', 'Nylon Backing']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeMaterial'))}
                          />
                        </Field>
                        <Field label="WIDTH" width="sm" required={!isOptionalField('seamTapeWidth')} error={errors[getErrorKey('seamTapeWidth')]}>
                          <SearchableDropdown
                            value={material.seamTapeWidth || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeWidth', selectedValue)}
                            options={['16mm', '20mm', '22mm', '25mm', '30mm']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeWidth'))}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('seamTapeColour')} error={errors[getErrorKey('seamTapeColour')]}>
                          <SearchableDropdown
                            value={material.seamTapeColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeColour', selectedValue)}
                            options={['Clear/Transparent', 'Black', 'DTM (rare)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeColour'))}
                          />
                        </Field>
                        <Field label="ADHESIVE TYPE" width="sm" required={!isOptionalField('seamTapeAdhesiveType')} error={errors[getErrorKey('seamTapeAdhesiveType')]}>
                          <SearchableDropdown
                            value={material.seamTapeAdhesiveType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeAdhesiveType', selectedValue)}
                            options={['Heat Activated', 'Low Melting Point', 'High Bond']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeAdhesiveType'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('seamTapePlacement')} error={errors[getErrorKey('seamTapePlacement')]}>
                          <Input
                            type="text"
                            value={material.seamTapePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapePlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('seamTapePlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('seamTapePlacementReferenceImage')} error={errors[getErrorKey('seamTapePlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('seamTapeTestingRequirements')} error={errors[getErrorKey('seamTapeTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.seamTapeTestingRequirements) ? material.seamTapeTestingRequirements : (material.seamTapeTestingRequirements ? [material.seamTapeTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'seamTapeTestingRequirements', arr)}
                                error={hasError('seamTapeTestingRequirements')}
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
                        <Field label="QTY" width="sm" required={!isOptionalField('seamTapeQty')} error={errors[getErrorKey('seamTapeQty')]}>
                          <Input
                            type="text"
                            value={material.seamTapeQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapeQty', e.target.value)}
                            placeholder="Meters"
                            aria-invalid={hasError('seamTapeQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('seamTapeSurplus')} error={errors[getErrorKey('seamTapeSurplus')]}>
                          <PercentInput
                            value={material.seamTapeSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapeSurplus', e.target.value)}
                            error={hasError('seamTapeSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('seamTapeWastage')} error={errors[getErrorKey('seamTapeWastage')]}>
                          <PercentInput
                            value={material.seamTapeWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapeWastage', e.target.value)}
                            error={hasError('seamTapeWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('seamTapeApproval')} error={errors[getErrorKey('seamTapeApproval')]}>
                          <SearchableDropdown
                            value={material.seamTapeApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('seamTapeApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('seamTapeRemarks')} error={errors[getErrorKey('seamTapeRemarks')]}>
                          <Input
                            type="text"
                            value={material.seamTapeRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'seamTapeRemarks', e.target.value)}
                            placeholder="Matte exterior, Specific hot-air welding machine"
                            aria-invalid={hasError('seamTapeRemarks')}
                          />
                        </Field>
                      </div>
                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showSeamTapeAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showSeamTapeAdvancedSpec', !material.showSeamTapeAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showSeamTapeAdvancedSpec && (
                        <SeamTapeAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* REFLECTIVE TAPES Fields */}
                  {material.trimAccessory === 'REFLECTIVE TAPES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('reflectiveTapeType')} error={errors[getErrorKey('reflectiveTapeType')]}>
                          <SearchableDropdown
                            value={material.reflectiveTapeType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeType', selectedValue)}
                            options={['Sew-on Tape', 'Heat Transfer Film', 'Piping', 'Segmented/Perforated', 'Stretch Reflective']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('reflectiveTapeMaterial')} error={errors[getErrorKey('reflectiveTapeMaterial')]}>
                          <SearchableDropdown
                            value={material.reflectiveTapeMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeMaterial', selectedValue)}
                            options={['Glass Bead Technology', 'Micro-Prismatic Vinyl (higher)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeMaterial'))}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('reflectiveTapeColour')} error={errors[getErrorKey('reflectiveTapeColour')]}>
                          <SearchableDropdown
                            value={material.reflectiveTapeColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeColour', selectedValue)}
                            options={['Silver/Grey', 'Fluorescent Yellow/Lime', 'Fluorescent Orange', 'Coloured']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeColour'))}
                          />
                        </Field>
                        <Field label="BASE FABRIC" width="sm" required={!isOptionalField('reflectiveTapeBaseFabric')} error={errors[getErrorKey('reflectiveTapeBaseFabric')]}>
                          <SearchableDropdown
                            value={material.reflectiveTapeBaseFabric || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeBaseFabric', selectedValue)}
                            options={['Polyester', 'Cotton', 'FR (flame retardant)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeBaseFabric'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('reflectiveTapePlacement')} error={errors[getErrorKey('reflectiveTapePlacement')]}>
                          <Input
                            type="text"
                            value={material.reflectiveTapePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapePlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('reflectiveTapePlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('reflectiveTapePlacementReferenceImage')} error={errors[getErrorKey('reflectiveTapePlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('reflectiveTapeTestingRequirements')} error={errors[getErrorKey('reflectiveTapeTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.reflectiveTapeTestingRequirements) ? material.reflectiveTapeTestingRequirements : (material.reflectiveTapeTestingRequirements ? [material.reflectiveTapeTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'reflectiveTapeTestingRequirements', arr)}
                                error={hasError('reflectiveTapeTestingRequirements')}
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
                        <Field label="GSM" width="sm" required={!isOptionalField('reflectiveTapeGsm')} error={errors[getErrorKey('reflectiveTapeGsm')]}>
                          <Input
                            type="text"
                            value={material.reflectiveTapeGsm || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeGsm', e.target.value)}
                            placeholder="GSM"
                            aria-invalid={hasError('reflectiveTapeGsm')}
                          />
                        </Field>
                        <Field label="LENGTH" width="sm" required={!isOptionalField('reflectiveTapeLengthCm')} error={errors[getErrorKey('reflectiveTapeLengthCm')]}>
                          <Input
                            type="text"
                            value={material.reflectiveTapeLengthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeLengthCm', e.target.value)}
                            placeholder="LENGTH"
                            aria-invalid={hasError('reflectiveTapeLengthCm')}
                          />
                        </Field>
                        <Field label="WIDTH" width="sm" required={!isOptionalField('reflectiveTapeWidthCm')} error={errors[getErrorKey('reflectiveTapeWidthCm')]}>
                          <Input
                            type="text"
                            value={material.reflectiveTapeWidthCm || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeWidthCm', e.target.value)}
                            placeholder="WIDTH"
                            aria-invalid={hasError('reflectiveTapeWidthCm')}
                          />
                        </Field>
                        <Field label="QTY TYPE" width="sm" required={!isOptionalField('reflectiveTapeQtyType')} error={errors[getErrorKey('reflectiveTapeQtyType')]}>
                          <SearchableDropdown
                            value={material.reflectiveTapeQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Kgs (cns per pc)']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm" required={!isOptionalField('reflectiveTapeYardage')} error={errors[getErrorKey('reflectiveTapeYardage')]}>
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
                            aria-invalid={hasError('reflectiveTapeYardage')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('reflectiveTapeSurplus')} error={errors[getErrorKey('reflectiveTapeSurplus')]}>
                          <PercentInput
                            value={material.reflectiveTapeSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeSurplus', e.target.value)}
                            error={hasError('reflectiveTapeSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('reflectiveTapeWastage')} error={errors[getErrorKey('reflectiveTapeWastage')]}>
                          <PercentInput
                            value={material.reflectiveTapeWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeWastage', e.target.value)}
                            error={hasError('reflectiveTapeWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('reflectiveTapeApproval')} error={errors[getErrorKey('reflectiveTapeApproval')]}>
                          <SearchableDropdown
                            value={material.reflectiveTapeApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Compliance Certificate']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('reflectiveTapeApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('reflectiveTapeRemarks')} error={errors[getErrorKey('reflectiveTapeRemarks')]}>
                          <Input
                            type="text"
                            value={material.reflectiveTapeRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeRemarks', e.target.value)}
                            placeholder="Industrial launder compatible, No peel or crack"
                            aria-invalid={hasError('reflectiveTapeRemarks')}
                          />
                        </Field>
                      </div>
                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showReflectiveTapeAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showReflectiveTapeAdvancedSpec', !material.showReflectiveTapeAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showReflectiveTapeAdvancedSpec && (
                        <ReflectiveTapeAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* FR-TRIMS Fields */}
                  {material.trimAccessory === 'FIRE RETARDANT (FR) TRIMS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('frTrimsType')} error={errors[getErrorKey('frTrimsType')]}>
                          <SearchableDropdown
                            value={material.frTrimsType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsType', selectedValue)}
                            options={['FR Thread', 'FR Elastic', 'FR Zippers', 'FR Interlining', 'FR Velcro', 'FR Reflective', 'FR Labels', 'FR Webbing']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('frTrimsMaterial')} error={errors[getErrorKey('frTrimsMaterial')]}>
                          <SearchableDropdown
                            value={material.frTrimsMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsMaterial', selectedValue)}
                            options={['Aramid (Nomex/Kevlar)', 'Modacrylic', 'Treated Polyester', 'Treated Cotton', 'FR Nylon']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsMaterial'))}
                          />
                        </Field>
                        <Field label="COMPLIANCE" width="sm" required={!isOptionalField('frTrimsCompliance')} error={errors[getErrorKey('frTrimsCompliance')]}>
                          <SearchableDropdown
                            value={material.frTrimsCompliance || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsCompliance', selectedValue)}
                            options={['NFPA 2112', 'EN ISO 11612', 'BS 5852', 'NFPA 70E', 'EN 469']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsCompliance'))}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('frTrimsColour')} error={errors[getErrorKey('frTrimsColour')]}>
                          <SearchableDropdown
                            value={material.frTrimsColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsColour', selectedValue)}
                            options={[]}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsColour'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('frTrimsPlacement')} error={errors[getErrorKey('frTrimsPlacement')]}>
                          <Input
                            type="text"
                            value={material.frTrimsPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'frTrimsPlacement', e.target.value)}
                            placeholder="TEXT"
                            aria-invalid={hasError('frTrimsPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('frTrimsPlacementReferenceImage')} error={errors[getErrorKey('frTrimsPlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('frTrimsTestingRequirements')} error={errors[getErrorKey('frTrimsTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.frTrimsTestingRequirements) ? material.frTrimsTestingRequirements : (material.frTrimsTestingRequirements ? [material.frTrimsTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'frTrimsTestingRequirements', arr)}
                                error={hasError('frTrimsTestingRequirements')}
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
                        <Field label="QTY TYPE" width="sm" required={!isOptionalField('frTrimsQtyType')} error={errors[getErrorKey('frTrimsQtyType')]}>
                          <SearchableDropdown
                            value={material.frTrimsQtyType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsQtyType', selectedValue)}
                            options={['Yardage (cns per pc)', 'Pieces']}
                            placeholder="Select type"
                            className={dropdownClass(false)}
                          />
                        </Field>
                        <Field label="QTY" width="sm" required={!isOptionalField('frTrimsQtyYardage')} error={errors[getErrorKey('frTrimsQtyYardage')]}>
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
                            aria-invalid={hasError('frTrimsQtyYardage')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('frTrimsSurplus')} error={errors[getErrorKey('frTrimsSurplus')]}>
                          <PercentInput
                            value={material.frTrimsSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'frTrimsSurplus', e.target.value)}
                            error={hasError('frTrimsSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('frTrimsWastage')} error={errors[getErrorKey('frTrimsWastage')]}>
                          <PercentInput
                            value={material.frTrimsWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'frTrimsWastage', e.target.value)}
                            error={hasError('frTrimsWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('frTrimsApproval')} error={errors[getErrorKey('frTrimsApproval')]}>
                          <SearchableDropdown
                            value={material.frTrimsApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'frTrimsApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Certification Report']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('frTrimsApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('frTrimsRemarks')} error={errors[getErrorKey('frTrimsRemarks')]}>
                          <Input
                            type="text"
                            value={material.frTrimsRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'frTrimsRemarks', e.target.value)}
                            placeholder="Inherently FR (not treated), Aramid fiber compatible"
                            aria-invalid={hasError('frTrimsRemarks')}
                          />
                        </Field>
                      </div>
                      
                      {/* FR-TRIMS - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showFrTrimsAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showFrTrimsAdvancedSpec', !material.showFrTrimsAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showFrTrimsAdvancedSpec && (
                        <FrTrimsAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>)}

                  {/* CORD RING Fields */}
                  {material.trimAccessory === 'CORD STOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('cordStopType')} error={errors[getErrorKey('cordStopType')]}>
                          <SearchableDropdown
                            value={material.cordStopType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopType', selectedValue)}
                            options={['Single Hole', 'Double Hole', 'Barrel Lock', 'Toggle', 'Spring Loaded', 'Squeeze Release', 'Ball Lock']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('cordStopMaterial')} error={errors[getErrorKey('cordStopMaterial')]}>
                          <SearchableDropdown
                            value={material.cordStopMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopMaterial', selectedValue)}
                            options={['Plastic (Acetal/POM)', 'Plastic (Nylon)', 'Plastic (ABS)', 'Metal (Zinc Alloy)', 'Metal (Brass)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm" required={!isOptionalField('cordStopSize')} error={errors[getErrorKey('cordStopSize')]}>
                          <SearchableDropdown
                            value={material.cordStopSize || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopSize', selectedValue)}
                            options={['3mm', '4mm', '5mm', '6mm']}
                            placeholder="Select or type (Cord Diameter fit)"
                            className={dropdownClass(hasError('cordStopSize'))}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('cordStopColour')} error={errors[getErrorKey('cordStopColour')]}>
                          <SearchableDropdown
                            value={material.cordStopColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopColour', selectedValue)}
                            options={['DTM', 'Black', 'Clear', 'Plating (metal)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopColour'))}
                          />
                        </Field>
                        <Field label="LOCKING MECHANISM" width="sm" required={!isOptionalField('cordStopLockingMechanism')} error={errors[getErrorKey('cordStopLockingMechanism')]}>
                          <SearchableDropdown
                            value={material.cordStopLockingMechanism || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopLockingMechanism', selectedValue)}
                            options={['Spring Tension (force to depress)', 'Grip Type']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopLockingMechanism'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('cordStopPlacement')} error={errors[getErrorKey('cordStopPlacement')]}>
                          <Input
                            type="text"
                            value={material.cordStopPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopPlacement', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('cordStopPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('cordStopPlacementReferenceImage')} error={errors[getErrorKey('cordStopPlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('cordStopTestingRequirements')} error={errors[getErrorKey('cordStopTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.cordStopTestingRequirements) ? material.cordStopTestingRequirements : (material.cordStopTestingRequirements ? [material.cordStopTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'cordStopTestingRequirements', arr)}
                                error={hasError('cordStopTestingRequirements')}
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
                        <Field label="QTY" width="sm" required={!isOptionalField('cordStopQty')} error={errors[getErrorKey('cordStopQty')]}>
                          <Input
                            type="text"
                            value={material.cordStopQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopQty', e.target.value)}
                            placeholder="Unit: Pieces"
                            aria-invalid={hasError('cordStopQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('cordStopSurplus')} error={errors[getErrorKey('cordStopSurplus')]}>
                          <PercentInput
                            value={material.cordStopSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopSurplus', e.target.value)}
                            error={hasError('cordStopSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('cordStopWastage')} error={errors[getErrorKey('cordStopWastage')]}>
                          <PercentInput
                            value={material.cordStopWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopWastage', e.target.value)}
                            error={hasError('cordStopWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('cordStopApproval')} error={errors[getErrorKey('cordStopApproval')]}>
                          <SearchableDropdown
                            value={material.cordStopApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Functionality Approval']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('cordStopApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('cordStopRemarks')} error={errors[getErrorKey('cordStopRemarks')]}>
                          <Input
                            type="text"
                            value={material.cordStopRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'cordStopRemarks', e.target.value)}
                            placeholder="Ergonomic grip, No snagging on cord opening"
                            aria-invalid={hasError('cordStopRemarks')}
                          />
                        </Field>
                      </div>

                      {/* CORD RING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showCordStopAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showCordStopAdvancedSpec', !material.showCordStopAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showCordStopAdvancedSpec && (
                        <CordStopAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* RINGS-LOOPS Fields */}
                  {material.trimAccessory === 'RINGS-LOOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('ringsLoopsType')} error={errors[getErrorKey('ringsLoopsType')]}>
                          <SearchableDropdown
                            value={material.ringsLoopsType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsType', selectedValue)}
                            options={['D-Ring (Welded/Non-Welded)', 'O-Ring', 'Square Ring', 'Loop Fastener', 'Rectangular Ring']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('ringsLoopsMaterial')} error={errors[getErrorKey('ringsLoopsMaterial')]}>
                          <SearchableDropdown
                            value={material.ringsLoopsMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsMaterial', selectedValue)}
                            options={['Metal (Stainless Steel, Brass, Zinc Alloy)', 'Plastic (Acetal, Nylon)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm" required={!isOptionalField('ringsLoopsSize')} error={errors[getErrorKey('ringsLoopsSize')]}>
                          <Input
                            type="text"
                            value={material.ringsLoopsSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsSize', e.target.value)}
                            placeholder="Inner Diameter or Webbing Width (25mm, 38mm, 50mm, 1 inch, 1.5 inch)"
                            aria-invalid={hasError('ringsLoopsSize')}
                          />
                        </Field>
                        <Field label="THICKNESS/GAUGE" width="sm" required={!isOptionalField('ringsLoopsThicknessGauge')} error={errors[getErrorKey('ringsLoopsThicknessGauge')]}>
                          <SearchableDropdown
                            value={material.ringsLoopsThicknessGauge || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsThicknessGauge', selectedValue)}
                            options={['Wire Diameter (metal)', 'Material Gauge']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsThicknessGauge'))}
                          />
                        </Field>
                        <Field label="FINISH/PLATING" width="sm" required={!isOptionalField('ringsLoopsFinishPlating')} error={errors[getErrorKey('ringsLoopsFinishPlating')]}>
                          <SearchableDropdown
                            value={material.ringsLoopsFinishPlating || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsFinishPlating', selectedValue)}
                            options={['Nickel', 'Black Oxide', 'Antique Brass', 'Matte (plastic)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsFinishPlating'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('ringsLoopsPlacement')} error={errors[getErrorKey('ringsLoopsPlacement')]}>
                          <Input
                            type="text"
                            value={material.ringsLoopsPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsPlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('ringsLoopsPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('ringsLoopsPlacementReferenceImage')} error={errors[getErrorKey('ringsLoopsPlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('ringsLoopsTestingRequirements')} error={errors[getErrorKey('ringsLoopsTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.ringsLoopsTestingRequirements) ? material.ringsLoopsTestingRequirements : (material.ringsLoopsTestingRequirements ? [material.ringsLoopsTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'ringsLoopsTestingRequirements', arr)}
                                error={hasError('ringsLoopsTestingRequirements')}
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
                        <Field label="QTY" width="sm" required={!isOptionalField('ringsLoopsQty')} error={errors[getErrorKey('ringsLoopsQty')]}>
                          <Input
                            type="text"
                            value={material.ringsLoopsQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsQty', e.target.value)}
                            placeholder="Pieces"
                            aria-invalid={hasError('ringsLoopsQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('ringsLoopsSurplus')} error={errors[getErrorKey('ringsLoopsSurplus')]}>
                          <PercentInput
                            value={material.ringsLoopsSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsSurplus', e.target.value)}
                            error={hasError('ringsLoopsSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('ringsLoopsWastage')} error={errors[getErrorKey('ringsLoopsWastage')]}>
                          <PercentInput
                            value={material.ringsLoopsWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsWastage', e.target.value)}
                            error={hasError('ringsLoopsWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('ringsLoopsApproval')} error={errors[getErrorKey('ringsLoopsApproval')]}>
                          <SearchableDropdown
                            value={material.ringsLoopsApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Load Test Certificate']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('ringsLoopsApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('ringsLoopsRemarks')} error={errors[getErrorKey('ringsLoopsRemarks')]}>
                          <Input
                            type="text"
                            value={material.ringsLoopsRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsRemarks', e.target.value)}
                            placeholder="Non-magnetic (military), Smooth burr-free edges"
                            aria-invalid={hasError('ringsLoopsRemarks')}
                          />
                        </Field>
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showRingsLoopsAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showRingsLoopsAdvancedSpec', !material.showRingsLoopsAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showRingsLoopsAdvancedSpec && (
                        <RingsLoopsAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>)}

                  {/* PIN-BARBS Fields */}
                  {material.trimAccessory === 'PIN-BARBS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('pinBarbType')} error={errors[getErrorKey('pinBarbType')]}>
                          <SearchableDropdown
                            value={material.pinBarbType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbType', selectedValue)}
                            options={['Safety Pin', 'Straight Pin', 'Tagging Barb (plastic fastener)', 'Loop Pin', 'Ball Head Pin']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('pinBarbMaterial')} error={errors[getErrorKey('pinBarbMaterial')]}>
                          <SearchableDropdown
                            value={material.pinBarbMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbMaterial', selectedValue)}
                            options={['Plastic (Polypropylene)', 'Metal (Brass, Steel)', 'Stainless Steel']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm" required={!isOptionalField('pinBarbSize')} error={errors[getErrorKey('pinBarbSize')]}>
                          <Input
                            type="text"
                            value={material.pinBarbSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbSize', e.target.value)}
                            placeholder="Length (25mm, 50mm, 1 inch), Needle Gauge (straight pins)"
                            aria-invalid={hasError('pinBarbSize')}
                          />
                        </Field>
                        <Field label="COLOUR" width="sm" required={!isOptionalField('pinBarbColour')} error={errors[getErrorKey('pinBarbColour')]}>
                          <SearchableDropdown
                            value={material.pinBarbColour || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbColour', selectedValue)}
                            options={['Clear', 'Black', 'White', 'Plated (metal)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbColour'))}
                          />
                        </Field>
                        <Field label="HEAD TYPE" width="sm" required={!isOptionalField('pinBarbHeadType')} error={errors[getErrorKey('pinBarbHeadType')]}>
                          <SearchableDropdown
                            value={material.pinBarbHeadType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbHeadType', selectedValue)}
                            options={['Pear Head', 'T-Bar', 'Smooth', 'Ball Head', 'Flat Head']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbHeadType'))}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('pinBarbPlacement')} error={errors[getErrorKey('pinBarbPlacement')]}>
                          <Input
                            type="text"
                            value={material.pinBarbPlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbPlacement', e.target.value)}
                            placeholder="Enter placement"
                            aria-invalid={hasError('pinBarbPlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('pinBarbPlacementReferenceImage')} error={errors[getErrorKey('pinBarbPlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('pinBarbTestingRequirements')} error={errors[getErrorKey('pinBarbTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.pinBarbTestingRequirements) ? material.pinBarbTestingRequirements : (material.pinBarbTestingRequirements ? [material.pinBarbTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'pinBarbTestingRequirements', arr)}
                                error={hasError('pinBarbTestingRequirements')}
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
                        <Field label="QTY" width="sm" required={!isOptionalField('pinBarbQty')} error={errors[getErrorKey('pinBarbQty')]}>
                          <Input
                            type="text"
                            value={material.pinBarbQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbQty', e.target.value)}
                            placeholder="PAIR PER PC"
                            aria-invalid={hasError('pinBarbQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('pinBarbSurplus')} error={errors[getErrorKey('pinBarbSurplus')]}>
                          <PercentInput
                            value={material.pinBarbSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbSurplus', e.target.value)}
                            error={hasError('pinBarbSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('pinBarbWastage')} error={errors[getErrorKey('pinBarbWastage')]}>
                          <PercentInput
                            value={material.pinBarbWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbWastage', e.target.value)}
                            error={hasError('pinBarbWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('pinBarbApproval')} error={errors[getErrorKey('pinBarbApproval')]}>
                          <SearchableDropdown
                            value={material.pinBarbApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('pinBarbApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('pinBarbRemarks')} error={errors[getErrorKey('pinBarbRemarks')]}>
                          <Input
                            type="text"
                            value={material.pinBarbRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'pinBarbRemarks', e.target.value)}
                            placeholder="Non-marking on delicate fabrics, Standard magazine cartridges"
                            aria-invalid={hasError('pinBarbRemarks')}
                          />
                        </Field>
                      </div>

                      {/* ADVANCE SPEC Section */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showPinBarbAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showPinBarbAdvancedSpec', !material.showPinBarbAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showPinBarbAdvancedSpec && (
                        <PinBarbAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}

                  {/* MAGNETIC CLOSURE Fields */}
                  {material.trimAccessory === 'MAGNETIC CLOSURE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
                        <Field label="TYPE" width="sm" required={!isOptionalField('magneticClosureType')} error={errors[getErrorKey('magneticClosureType')]}>
                          <SearchableDropdown
                            value={material.magneticClosureType || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureType', selectedValue)}
                            options={['Sew-In Magnet (encased)', 'Clasp Magnet (metal body)', 'Snap Magnet', 'Hidden Magnet', 'Magnetic Button']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('magneticClosureType'))}
                          />
                        </Field>
                        <Field label="MATERIAL" width="sm" required={!isOptionalField('magneticClosureMaterial')} error={errors[getErrorKey('magneticClosureMaterial')]}>
                          <SearchableDropdown
                            value={material.magneticClosureMaterial || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureMaterial', selectedValue)}
                            options={['Neodymium (strongest)', 'Ferrite', 'Encasing (PVC)', 'Encasing (Stainless Steel)', 'Encasing (Fabric)']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('magneticClosureMaterial'))}
                          />
                        </Field>
                        <Field label="SIZE SPEC" width="sm" required={!isOptionalField('magneticClosureSize')} error={errors[getErrorKey('magneticClosureSize')]}>
                          <Input
                            type="text"
                            value={material.magneticClosureSize || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureSize', e.target.value)}
                            placeholder="CM (e.g., 10mm, 14mm, 18mm, 20mm, Thickness)"
                            aria-invalid={hasError('magneticClosureSize')}
                          />
                        </Field>
                        <Field label="PLACEMENT" width="sm" required={!isOptionalField('magneticClosurePlacement')} error={errors[getErrorKey('magneticClosurePlacement')]}>
                          <Input
                            type="text"
                            value={material.magneticClosurePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosurePlacement', e.target.value)}
                            placeholder="Text"
                            aria-invalid={hasError('magneticClosurePlacement')}
                          />
                        </Field>
                        <Field label="PLACEMENT REF" width="sm" required={!isOptionalField('magneticClosurePlacementReferenceImage')} error={errors[getErrorKey('magneticClosurePlacementReferenceImage')]}>
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
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('magneticClosureTestingRequirements')} error={errors[getErrorKey('magneticClosureTestingRequirements')]}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={Array.isArray(material.magneticClosureTestingRequirements) ? material.magneticClosureTestingRequirements : (material.magneticClosureTestingRequirements ? [material.magneticClosureTestingRequirements] : [])}
                                onChange={(arr) => handleChange(materialIndex, 'magneticClosureTestingRequirements', arr)}
                                error={hasError('magneticClosureTestingRequirements')}
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
                        <Field label="QTY" width="sm" required={!isOptionalField('magneticClosureQty')} error={errors[getErrorKey('magneticClosureQty')]}>
                          <Input
                            type="text"
                            value={material.magneticClosureQty || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureQty', e.target.value)}
                            placeholder="Pairs (Male/Female set) PER PC"
                            aria-invalid={hasError('magneticClosureQty')}
                          />
                        </Field>
                        <Field label="SURPLUS %" width="sm" required={!isOptionalField('magneticClosureSurplus')} error={errors[getErrorKey('magneticClosureSurplus')]}>
                          <PercentInput
                            value={material.magneticClosureSurplus || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureSurplus', e.target.value)}
                            error={hasError('magneticClosureSurplus')}
                          />
                        </Field>
                        <Field label="WASTAGE %" width="sm" required={!isOptionalField('magneticClosureWastage')} error={errors[getErrorKey('magneticClosureWastage')]}>
                          <PercentInput
                            value={material.magneticClosureWastage || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureWastage', e.target.value)}
                            error={hasError('magneticClosureWastage')}
                          />
                        </Field>
                        <Field label="APPROVAL" width="sm" required={!isOptionalField('magneticClosureApproval')} error={errors[getErrorKey('magneticClosureApproval')]}>
                          <SearchableDropdown
                            value={material.magneticClosureApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'IPP', 'Magnet Strength Check']}
                            placeholder="Select or type"
                            className={dropdownClass(hasError('magneticClosureApproval'))}
                          />
                        </Field>
                        <Field label="REMARKS" width="md" className="col-span-1 md:col-span-2 lg:col-span-5" required={!isOptionalField('magneticClosureRemarks')} error={errors[getErrorKey('magneticClosureRemarks')]}>
                          <Input
                            type="text"
                            value={material.magneticClosureRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureRemarks', e.target.value)}
                            placeholder="RF-shielded if near RFID, Care label warn about pacemakers"
                            aria-invalid={hasError('magneticClosureRemarks')}
                          />
                        </Field>
                      </div>

                      {/* MAGNETIC CLOSURE - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full mt-5 mb-5">
                        <Button
                          type="button"
                          variant={material.showMagneticClosureAdvancedSpec ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleChange(materialIndex, 'showMagneticClosureAdvancedSpec', !material.showMagneticClosureAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      {material.showMagneticClosureAdvancedSpec && (
                        <MagneticClosureAdvancedSpec
                          material={material}
                          handleChange={(field, value) => handleChange(materialIndex, field, value)}
                          dropdownClass={dropdownClass}
                          hasError={hasError}
                        />
                      )}
                    </>
                  )}
                </div>
      )}
    </>
  );
};

export default TrimAccessoryFields;
