import { useEffect, useRef } from 'react';
import SearchableDropdown from '../SearchableDropdown';
import {
  ANTI_COUNTERFEIT_TYPES,
  ANTI_COUNTERFEIT_MATERIALS,
  ANTI_COUNTERFEIT_SECURITY_FEATURES,
  ANTI_COUNTERFEIT_HOLOGRAM_TYPES,
  ANTI_COUNTERFEIT_NUMBERING_OPTIONS,
  ANTI_COUNTERFEIT_TESTING_REQUIREMENTS,
  ANTI_COUNTERFEIT_APPROVAL_OPTIONS,
  ANTI_COUNTERFEIT_VERIFICATION_OPTIONS,
  ANTI_COUNTERFEIT_QR_CODE_CONTENT_OPTIONS,
  ANTI_COUNTERFEIT_APPLICATION_OPTIONS,
  ANTI_COUNTERFEIT_TAMPER_EVIDENCE_OPTIONS,
  ANTI_COUNTERFEIT_DATABASE_OPTIONS,
  ANTI_COUNTERFEIT_GUMMING_QUALITY_OPTIONS,
  ANTI_COUNTERFEIT_SIZE_UNITS
} from '../../data/antiCounterfeitData';
import {
  BELLY_BAND_TYPES,
  BELLY_BAND_MATERIALS,
  BELLY_BAND_CLOSURE_OPTIONS,
  BELLY_BAND_TESTING_REQUIREMENTS,
  BELLY_BAND_SIZE_UNITS,
  BELLY_BAND_APPROVAL_OPTIONS,
  BELLY_BAND_PRODUCT_FIT_OPTIONS,
  BELLY_BAND_PRINTING_OPTIONS,
  BELLY_BAND_FOLD_LINES_OPTIONS,
  BELLY_BAND_DURABILITY_OPTIONS,
  BELLY_BAND_CONTENT_OPTIONS,
  BELLY_BAND_COLOURS_OPTIONS,
  BELLY_BAND_FINISH_OPTIONS,
  BELLY_BAND_DIE_CUT_OPTIONS,
  BELLY_BAND_GUMMING_QUALITY_OPTIONS
} from '../../data/bellyBandData';
import {
  CARE_COMPOSITION_TYPES,
  CARE_COMPOSITION_MATERIALS,
  CARE_COMPOSITION_TESTING_REQUIREMENTS,
  CARE_COMPOSITION_SIZE_UNITS,
  CARE_COMPOSITION_APPROVAL_OPTIONS,
  CARE_COMPOSITION_PRINT_TYPE_OPTIONS,
  CARE_COMPOSITION_INK_TYPE_OPTIONS,
  CARE_COMPOSITION_MANUFACTURER_ID_OPTIONS,
  CARE_COMPOSITION_PERMANENCE_OPTIONS,
  CARE_COMPOSITION_LANGUAGE_OPTIONS
} from '../../data/careCompositionData';
import {
  FLAMMABILITY_SAFETY_TYPES,
  FLAMMABILITY_SAFETY_MATERIALS,
  FLAMMABILITY_SAFETY_TESTING_REQUIREMENTS,
  FLAMMABILITY_SAFETY_SIZE_UNITS,
  FLAMMABILITY_SAFETY_APPROVAL_OPTIONS,
  FLAMMABILITY_SAFETY_REGULATION_OPTIONS,
  FLAMMABILITY_SAFETY_FONT_SIZE_OPTIONS,
  FLAMMABILITY_SAFETY_PERMANENCE_OPTIONS,
  FLAMMABILITY_SAFETY_SYMBOL_OPTIONS,
  FLAMMABILITY_SAFETY_INK_DURABILITY_OPTIONS,
  FLAMMABILITY_SAFETY_CERTIFICATION_ID_OPTIONS
} from '../../data/flammabilitySafetyData';
import {
  HANG_TAG_SEALS_TYPES,
  HANG_TAG_SEALS_MATERIALS,
  HANG_TAG_SEALS_TESTING_REQUIREMENTS,
  HANG_TAG_SEALS_SIZE_UNITS,
  HANG_TAG_SEALS_APPROVAL_OPTIONS,
  HANG_TAG_SEALS_FASTENING_OPTIONS,
  HANG_TAG_SEALS_PRE_STRINGING_OPTIONS,
  HANG_TAG_SEALS_STRING_FINISH_OPTIONS,
  HANG_TAG_SEALS_SEAL_SHAPE_OPTIONS,
  HANG_TAG_SEALS_COLOUR_OPTIONS,
  HANG_TAG_SEALS_LOGO_BRANDING_OPTIONS
} from '../../data/hangTagSealsData';
import {
  HEAT_TRANSFER_TYPES,
  HEAT_TRANSFER_MATERIAL_BASE_OPTIONS,
  HEAT_TRANSFER_TESTING_REQUIREMENTS,
  HEAT_TRANSFER_SIZE_UNITS,
  HEAT_TRANSFER_APPROVAL_OPTIONS,
  HEAT_TRANSFER_INK_TYPE_OPTIONS,
  HEAT_TRANSFER_FABRIC_COMPATIBILITY_OPTIONS,
  HEAT_TRANSFER_APPLICATION_SPEC_OPTIONS,
  HEAT_TRANSFER_PEEL_TYPE_OPTIONS,
  HEAT_TRANSFER_FINISH_HAND_FEEL_OPTIONS,
  HEAT_TRANSFER_STRETCH_OPTIONS
} from '../../data/heatTransferData';
import {
  INSERT_CARDS_TYPES,
  INSERT_CARDS_MATERIALS,
  INSERT_CARDS_TESTING_REQUIREMENTS,
  INSERT_CARDS_SIZE_UNITS,
  INSERT_CARDS_APPROVAL_OPTIONS,
  INSERT_CARDS_FUNCTION_OPTIONS,
  INSERT_CARDS_CONTENT_OPTIONS,
  INSERT_CARDS_PRINTING_OPTIONS,
  INSERT_CARDS_FINISH_OPTIONS,
  INSERT_CARDS_STIFFNESS_OPTIONS,
  INSERT_CARDS_ACID_FREE_OPTIONS,
  INSERT_CARDS_BRANDING_OPTIONS
} from '../../data/insertCardsData';
import {
  LABELS_BRAND_TYPES,
  LABELS_BRAND_MATERIALS,
  LABELS_BRAND_PLACEMENT_OPTIONS,
  LABELS_BRAND_ATTACHMENT_OPTIONS,
  LABELS_BRAND_TESTING_REQUIREMENTS,
  LABELS_BRAND_SIZE_UNITS,
  LABELS_BRAND_APPROVAL_OPTIONS
} from '../../data/labelsBrandData';
import {
  LAW_LABEL_TYPES,
  LAW_LABEL_MATERIALS,
  LAW_LABEL_TESTING_REQUIREMENTS,
  LAW_LABEL_SIZE_UNITS,
  LAW_LABEL_APPROVAL_OPTIONS
} from '../../data/lawLabelData';
import {
  RFID_TYPES,
  RFID_FORM_FACTORS,
  RFID_CHIP_MODELS,
  RFID_PLACEMENT_OPTIONS,
  RFID_TESTING_REQUIREMENTS,
  RFID_SIZE_UNITS,
  RFID_APPROVAL_OPTIONS
} from '../../data/rfidSecurityData';
import {
  PRICE_TICKET_TYPES,
  PRICE_TICKET_MATERIALS,
  PRICE_TICKET_TESTING_REQUIREMENTS,
  PRICE_TICKET_SIZE_UNITS,
  PRICE_TICKET_APPROVAL_OPTIONS
} from '../../data/priceTicketData';
import {
  QC_INSPECTION_TYPES,
  QC_INSPECTION_MATERIALS,
  QC_INSPECTION_CONTENT,
  QC_INSPECTION_CODING_SYSTEM,
  QC_INSPECTION_GUMMING_QUALITY,
  QC_INSPECTION_TESTING_REQUIREMENTS,
  QC_INSPECTION_SIZE_UNITS,
  QC_INSPECTION_APPROVAL_OPTIONS
} from '../../data/qcInspectionData';
import {
  RIBBONS_TYPES,
  RIBBONS_MATERIALS,
  RIBBONS_TESTING_REQUIREMENTS,
  RIBBONS_APPROVAL_OPTIONS
} from '../../data/ribbonsData';
import {
  TAGS_SPECIAL_LABELS_TYPES,
  TAGS_SPECIAL_LABELS_MATERIALS,
  TAGS_SPECIAL_LABELS_ATTACHMENT_OPTIONS,
  TAGS_SPECIAL_LABELS_FINISHING_OPTIONS,
  TAGS_SPECIAL_LABELS_TESTING_REQUIREMENTS,
  TAGS_SPECIAL_LABELS_SIZE_UNITS,
  TAGS_SPECIAL_LABELS_APPROVAL_OPTIONS
} from '../../data/tagsSpecialLabelsData';
import {
  UPC_BARCODE_TYPES,
  UPC_BARCODE_MATERIALS,
  UPC_BARCODE_TESTING_REQUIREMENTS,
  UPC_BARCODE_SIZE_UNITS,
  UPC_BARCODE_APPROVAL_OPTIONS
} from '../../data/upcBarcodeData';
import {
  SIZE_LABELS_TYPES,
  SIZE_LABELS_MATERIALS,
  SIZE_LABELS_SIZE_SYSTEM_OPTIONS,
  SIZE_LABELS_SIZE_CODE_OPTIONS,
  SIZE_LABELS_FOLD_TYPE_OPTIONS,
  SIZE_LABELS_TESTING_REQUIREMENTS,
  SIZE_LABELS_SIZE_UNITS,
  SIZE_LABELS_APPROVAL_OPTIONS
} from '../../data/sizeLabelsData';

const Step4 = ({
  formData,
  errors,
  handleArtworkMaterialChange,
  addArtworkMaterial,
  removeArtworkMaterial
}) => {
  const prevMaterialsLengthRef = useRef(formData.artworkMaterials?.length || 0);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevMaterialsLengthRef.current = formData.artworkMaterials?.length || 0;
      return;
    }
    
    const currentMaterialsLength = formData.artworkMaterials?.length || 0;
    if (currentMaterialsLength > prevMaterialsLengthRef.current) {
      setTimeout(() => {
        const lastMaterial = document.querySelector('[data-artwork-material-index]:last-child');
        if (lastMaterial) {
          lastMaterial.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
    prevMaterialsLengthRef.current = currentMaterialsLength;
  }, [formData.artworkMaterials?.length]);

  return (
<div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-4 ARTWORK & LABELING</h2>
          <p className="text-sm text-gray-600">Artwork & packaging materials</p>
        </div>
      </div>
      
      {/* Artwork Materials */}
      <div>
        {formData.artworkMaterials && formData.artworkMaterials.length > 0 ? formData.artworkMaterials.map((material, materialIndex) => (
          <div key={materialIndex} id={`artwork-material-${materialIndex}`} data-artwork-material-index={materialIndex} className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header with Remove Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h4 className="text-sm font-bold text-gray-700">MATERIAL {materialIndex + 1}</h4>
              {formData.artworkMaterials && formData.artworkMaterials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArtworkMaterial(materialIndex)}
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

            {/* Row 1: Components, Material Desc, Net CNS, Unit */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COMPONENTS <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.components || ''}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'components', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_components`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_components`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., COMFORTER"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_components`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_components`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    MATERIAL DESC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.materialDescription}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_materialDescription`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_materialDescription`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., Care Label"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_materialDescription`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_materialDescription`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    NET CNS/PC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={material.netConsumption}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'netConsumption', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_netConsumption`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_netConsumption`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="0.000"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_netConsumption`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_netConsumption`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    UNIT <span className="text-red-600">*</span>
                  </label>
                  <SearchableDropdown
                    value={material.unit || ''}
                    onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'unit', selectedValue)}
                    options={['R METERS', 'CM', 'Inches', 'Meter', 'KGS']}
                    placeholder="Select or type Unit"
                    className={errors[`artworkMaterial_${materialIndex}_unit`] 
                      ? 'border-red-600' 
                      : ''}
                    style={{ width: '130px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_unit`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                  />
                  {errors[`artworkMaterial_${materialIndex}_unit`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_unit`]}
                    </span>
                  )}
                </div>
              </div>
              
              {/* PLACEMENT and WORK ORDER Row */}
              <div style={{ marginBottom: '24px', marginTop: '24px' }}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex flex-col" style={{ flex: 1, minWidth: '300px', maxWidth: '600px' }}>
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    PLACEMENT <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.placement}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_placement`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '12px 16px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_placement`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="2&quot; FROM RIGHT CORNER AT FLAP"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_placement`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_placement`]}
                    </span>
                  )}
              </div>
              
                    <div className="flex flex-col" style={{ width: '180px' }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                      WORK ORDER <span className="text-red-600">*</span>
                      </label>
                    <SearchableDropdown
                      value={material.workOrder || ''}
                      onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'workOrder', selectedValue)}
                      options={['Sewing', 'DYEING', 'WEAVING', 'PRINTING', 'CUTTING']}
                      placeholder="Select or type Work Order"
                      className={errors[`artworkMaterial_${materialIndex}_workOrder`] 
                        ? 'border-red-600' 
                        : ''}
                      onFocus={(e) => {
                        if (!errors[`artworkMaterial_${materialIndex}_workOrder`]) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                    {errors[`artworkMaterial_${materialIndex}_workOrder`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                        {errors[`artworkMaterial_${materialIndex}_workOrder`]}
                        </span>
                      )}
                  </div>
                </div>
                    </div>
                    
              {/* SIZE Section: WIDTH, LENGTH, HEIGHT, UNIT */}
              <div className="w-full mt-6 pt-6 border-t border-gray-100">
                <h5 className="text-sm font-bold text-gray-800 mb-4">SIZE</h5>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                    <input
                      type="text"
                      value={material.sizeWidth || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeWidth', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                      placeholder="e.g., 52"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                    <input
                      type="text"
                      value={material.sizeLength || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLength', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                      placeholder="e.g., 48"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT</label>
                    <input
                      type="text"
                      value={material.sizeHeight || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeHeight', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                      placeholder="e.g., 52"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                    <SearchableDropdown
                      value={material.sizeUnit || ''}
                      onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'sizeUnit', selectedValue)}
                      options={['CMS', 'INCHES', 'MM', 'CM']}
                      placeholder="Select or type Unit"
                      style={{ width: '130px' }}
                    />
                  </div>
                </div>
              </div>

              {/* ARTWORK CATEGORY SELECTOR */}
              <div className="w-full" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <div className="flex flex-col" style={{ width: '280px', marginBottom: '20px' }}>
                  <label className="text-sm font-bold text-gray-800 mb-2">ARTWORK CATEGORY</label>
                  <SearchableDropdown
                    value={material.artworkCategory || ''}
                    onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'artworkCategory', selectedValue)}
                    options={['LABELS (BRAND/MAIN)', 'CARE & COMPOSITION', 'TAGS & SPECIAL LABELS', 'FLAMMABILITY / SAFETY LABELS', 'RFID / SECURITY TAGS', 'LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'INSERT CARDS', 'RIBBONS']}
                    placeholder="Select or type Category"
                    style={{ width: '280px' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  />
                </div>

                {material.artworkCategory && (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                    {/* TYPE Field */}
                    {!['RFID / SECURITY TAGS', 'LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'CARE & COMPOSITION', 'FLAMMABILITY / SAFETY LABELS', 'INSERT CARDS', 'LABELS (BRAND/MAIN)', 'RIBBONS', 'TAGS & SPECIAL LABELS'].includes(material.artworkCategory) && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                      <SearchableDropdown
                        value={material.specificType || ''}
                        onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'specificType', selectedValue)}
                        options={
                          material.artworkCategory === 'LABELS (BRAND/MAIN)' ? ['Woven (Damask, Taffeta, Satin)', 'Printed (Satin, Cotton)', 'Heat Transfer', 'Leather', 'Metal'] :
                          material.artworkCategory === 'CARE & COMPOSITION' ? ['Woven', 'Printed', 'Heat Transfer'] :
                          material.artworkCategory === 'FLAMMABILITY / SAFETY LABELS' ? ['Permanent Sew-in Label', 'Removable Hang Tag'] :
                          material.artworkCategory === 'PRICE TICKET / BARCODE TAG' ? ['Adhesive Sticker', 'Printed Area', 'Dedicated Small Tag'] :
                          material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' ? ['Hologram Sticker', 'Void/Tamper-Evident Label', 'Authenticity Patch', 'Invisible Ink Print'] :
                          material.artworkCategory === 'QC / INSPECTION LABELS' ? ['Passed/Inspected Sticker', 'Hold/Defective Sticker', 'Audit Sample Tag'] :
                          material.artworkCategory === 'BELLY BAND / WRAPPER' ? ['Cardboard Sleeve', 'Printed Paper Band', 'Plastic Film Wrapper'] :
                          []
                        }
                        placeholder="Select or type Type"
                      />
                    </div>
                    )}

                    {/* MATERIAL Field */}
                    {!['RFID / SECURITY TAGS', 'LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'CARE & COMPOSITION', 'FLAMMABILITY / SAFETY LABELS', 'INSERT CARDS', 'LABELS (BRAND/MAIN)', 'RIBBONS', 'TAGS & SPECIAL LABELS'].includes(material.artworkCategory) && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'CARE & COMPOSITION' ? 'FIBER CONTENT' : 'MATERIAL'}
                      </label>
                      <input
                        type="text"
                        value={material.material}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'material', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                          placeholder={
                            material.artworkCategory === 'CARE & COMPOSITION' ? 'Fiber Content' : 
                            material.artworkCategory === 'BELLY BAND / WRAPPER' ? 'Card Stock GSM' : 
                            'e.g., Polyester'
                          }
                      />
                    </div>
                    )}

                    {/* Specific Fields for LABELS (BRAND/MAIN) */}
                    {material.artworkCategory === 'LABELS (BRAND/MAIN)' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                          <SearchableDropdown
                            value={material.labelsBrandType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'labelsBrandType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'labelsBrandTypeText', '');
                              }
                            }}
                            options={LABELS_BRAND_TYPES}
                            placeholder="Select or type Type"
                          />
                          {material.labelsBrandType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                          <SearchableDropdown
                            value={material.labelsBrandMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'labelsBrandMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'labelsBrandMaterialText', '');
                              }
                            }}
                            options={LABELS_BRAND_MATERIALS}
                            placeholder="Select or type Material"
                          />
                          {material.labelsBrandMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandArtworkSpecFile', e.target.files[0])}
                            className="hidden"
                            id={`labels-brand-artwork-${materialIndex}`}
                          />
                          <label
                            htmlFor={`labels-brand-artwork-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.labelsBrandArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* SIZE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-3">
                        <input
                          type="text"
                                  value={material.labelsBrandSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.labelsBrandSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                <SearchableDropdown
                                  value={material.labelsBrandSizeUnit || 'MM'}
                                  onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'labelsBrandSizeUnit', selectedValue)}
                                  options={LABELS_BRAND_SIZE_UNITS}
                                  placeholder="Select or type Unit"
                                  style={{ width: '120px' }}
                                />
                              </div>
                            </div>

                        {/* PLACEMENT - Full width with text input and upload */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.labelsBrandPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`labels-brand-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`labels-brand-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.labelsBrandPlacementImageRef ? 'UPLOADED' : 'UPLOAD (REFERENCE IMAGE)'}</span>
                            </label>
                        </div>
                        </div>

                        {/* ATTACHMENT - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ATTACHMENT</label>
                          <SearchableDropdown
                            value={material.labelsBrandAttachment || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'labelsBrandAttachment', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'labelsBrandAttachmentText', '');
                              }
                            }}
                            options={LABELS_BRAND_ATTACHMENT_OPTIONS}
                            placeholder="Select or type Attachment"
                          />
                          {material.labelsBrandAttachment === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandAttachmentText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandAttachmentText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter ATTACHMENT"
                          />
                          )}
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.labelsBrandTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'labelsBrandTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'labelsBrandTestingRequirementsText', '');
                              }
                            }}
                            options={LABELS_BRAND_TESTING_REQUIREMENTS}
                            placeholder="Select or type Testing Requirements"
                          />
                          {material.labelsBrandTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces/R LENGTH */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.labelsBrandQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces/R LENGTH"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.labelsBrandSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                          <SearchableDropdown
                            value={material.labelsBrandApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'labelsBrandApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'labelsBrandApprovalText', '');
                              }
                            }}
                            options={LABELS_BRAND_APPROVAL_OPTIONS}
                            placeholder="Select or type Approval"
                          />
                          {material.labelsBrandApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.labelsBrandRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'labelsBrandRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px', resize: 'vertical' }}
                            placeholder="Enter REMARKS"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for CARE & COMPOSITION */}
                    {material.artworkCategory === 'CARE & COMPOSITION' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                          <SearchableDropdown
                            value={material.careCompositionType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'careCompositionTypeText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_TYPES}
                            placeholder="Select or type Type"
                          />
                          {material.careCompositionType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.careCompositionTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                          <SearchableDropdown
                            value={material.careCompositionMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'careCompositionMaterialText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_MATERIALS}
                            placeholder="Select or type Material"
                          />
                          {material.careCompositionMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.careCompositionMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                            />
                          )}
                        </div>

                        {/* ARTWORK SPEC and SIZE in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* ARTWORK SPEC - Upload */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionArtworkSpecFile', e.target.files[0])}
                                  className="hidden"
                                  id={`care-composition-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`care-composition-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.careCompositionArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>

                            {/* SIZE */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="text"
                                  value={material.careCompositionSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="Width (mm)"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.careCompositionSizeLength || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionSizeLength', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="Length (mm)"
                                />
                                <SearchableDropdown
                                  value={material.careCompositionSizeUnit || 'MM'}
                                  onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'careCompositionSizeUnit', selectedValue)}
                                  options={CARE_COMPOSITION_SIZE_UNITS}
                                  placeholder="Select or type Unit"
                                  style={{ width: '120px' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.careCompositionPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`care-composition-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`care-composition-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.careCompositionPlacementImageRef ? 'UPLOADED' : 'UPLOAD (REFERENCE IMAGE)'}</span>
                            </label>
                          </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.careCompositionTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'careCompositionTestingRequirementsText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_TESTING_REQUIREMENTS}
                            placeholder="Select or type Testing Requirements"
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                          {material.careCompositionTestingRequirements === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.careCompositionTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                            />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces/ R LENGTH */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                              <input
                                type="text"
                                value={material.careCompositionQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces/ R LENGTH"
                              />
                            </div>

                            {/* SURPLUS % */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                              <input
                                type="text"
                                value={material.careCompositionSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                              />
                            </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                          <SearchableDropdown
                            value={material.careCompositionApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'careCompositionApprovalText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_APPROVAL_OPTIONS}
                            placeholder="Select or type Approval"
                          />
                          {material.careCompositionApproval === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.careCompositionApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <input
                            type="text"
                            value={material.careCompositionRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for RFID / SECURITY TAGS */}
                    {material.artworkCategory === 'RFID / SECURITY TAGS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                          <SearchableDropdown
                            value={material.rfidType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'rfidType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'rfidTypeText', '');
                              }
                            }}
                            options={RFID_TYPES}
                            placeholder="Select or type Type"
                          />
                          {material.rfidType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.rfidTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                    </div>

                        {/* FORM FACTOR - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>FORM FACTOR</label>
                          <SearchableDropdown
                            value={material.rfidFormFactor || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'rfidFormFactor', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'rfidFormFactorText', '');
                              }
                            }}
                            options={RFID_FORM_FACTORS}
                            placeholder="Select or type Form Factor"
                          />
                          {material.rfidFormFactor === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.rfidFormFactorText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidFormFactorText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter FORM FACTOR"
                          />
                          )}
                  </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidArtworkSpecFile', e.target.files[0])}
                            className="hidden"
                            id={`rfid-artwork-${materialIndex}`}
                          />
                          <label
                            htmlFor={`rfid-artwork-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.rfidArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* CHIP MODEL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>CHIP MODEL</label>
                          <SearchableDropdown
                            value={material.rfidChipModel || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'rfidChipModel', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(materialIndex, 'rfidChipModelText', '');
                              }
                            }}
                            options={RFID_CHIP_MODELS}
                            placeholder="Select or type Chip Model"
                          />
                          {material.rfidChipModel === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.rfidChipModelText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidChipModelText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter CHIP MODEL"
                          />
                          )}
                        </div>

                        {/* SIZE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.rfidSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.rfidSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                <SearchableDropdown
                                  value={material.rfidSizeUnit || 'MM'}
                                  onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'rfidSizeUnit', selectedValue)}
                                  options={RFID_SIZE_UNITS}
                                  placeholder="Select or type Unit"
                                  style={{ width: '120px' }}
                                />
                              </div>
                            </div>

                        {/* PLACEMENT - Text input with Upload Image Reference */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-2">
                          <input
                            type="text"
                              value={material.rfidPlacementText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidPlacementText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`rfid-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`rfid-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                              style={{ padding: '10px 14px', height: '44px', width: '150px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.rfidPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                          </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option and Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.rfidTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(materialIndex, 'rfidTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT FIELD)') {
                                handleArtworkMaterialChange(materialIndex, 'rfidTestingRequirementsText', '');
                              }
                            }}
                            options={RFID_TESTING_REQUIREMENTS}
                            placeholder="Select or type Testing Requirements"
                          />
                          {material.rfidTestingRequirements === 'OTHERS (TEXT FIELD)' && (
                          <input
                            type="text"
                              value={material.rfidTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidTestingRequirementsFile', e.target.files[0])}
                            className="hidden"
                            id={`rfid-testing-${materialIndex}`}
                          />
                          <label
                            htmlFor={`rfid-testing-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.rfidTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.rfidQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.rfidSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidApprovalFile', e.target.files[0])}
                            className="hidden"
                            id={`rfid-approval-${materialIndex}`}
                          />
                          <label
                            htmlFor={`rfid-approval-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.rfidApprovalFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.rfidRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'rfidRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px' }}
                            placeholder="Text"
                          />
                        </div>
                </div>
                      </>
                    )}

                    {/* Specific Fields for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.lawLabelType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'lawLabelType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'lawLabelTypeText', '');
                              }
                              }
                            }}
                            options={LAW_LABEL_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.lawLabelType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.lawLabelTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.lawLabelMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'lawLabelMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'lawLabelMaterialText', '');
                              }
                              }
                            }}
                            options={LAW_LABEL_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.lawLabelMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.lawLabelMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelArtworkSpecFile', e.target.files[0])}
                            className="hidden"
                            id={`law-label-artwork-${materialIndex}`}
                          />
                          <label
                            htmlFor={`law-label-artwork-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.lawLabelArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* SIZE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.lawLabelSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.lawLabelSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.lawLabelSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'lawLabelSizeUnit', selectedValue)}
                            options={LAW_LABEL_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>

                        {/* PLACEMENT - Full width with text input and upload */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.lawLabelPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`law-label-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`law-label-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.lawLabelPlacementImageRef ? 'UPLOADED' : 'UPLOAD (REFERENCE IMAGE)'}</span>
                            </label>
                        </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.lawLabelTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'lawLabelTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'lawLabelTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={LAW_LABEL_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.lawLabelTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.lawLabelTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.lawLabelQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.lawLabelSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.lawLabelApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'lawLabelApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'lawLabelApprovalText', '');
                              }
                              }
                            }}
                            options={LAW_LABEL_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.lawLabelApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.lawLabelApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.lawLabelRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px', resize: 'vertical' }}
                            placeholder="Enter REMARKS"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for HANG TAG SEALS / STRINGS */}
                    {material.artworkCategory === 'HANG TAG SEALS / STRINGS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.hangTagSealsType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsTypeText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.hangTagSealsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.hangTagSealsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.hangTagSealsMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsMaterialText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.hangTagSealsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.hangTagSealsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC and SIZE in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* ARTWORK SPEC - Upload */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsArtworkSpecFile', e.target.files[0])}
                                  className="hidden"
                                  id={`hang-tag-seals-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`hang-tag-seals-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.hangTagSealsArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>

                            {/* SIZE */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                              <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.hangTagSealsSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.hangTagSealsSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.hangTagSealsSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsSizeUnit', selectedValue)}
                            options={HANG_TAG_SEALS_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.hangTagSealsPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`hang-tag-seals-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`hang-tag-seals-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.hangTagSealsPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                        </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.hangTagSealsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.hangTagSealsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.hangTagSealsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.hangTagSealsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.hangTagSealsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="e.g., 5%"
                              />
                            </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.hangTagSealsApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsApprovalText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.hangTagSealsApproval === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.hangTagSealsApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.hangTagSealsRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px', resize: 'vertical' }}
                            placeholder="Enter REMARKS"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for HEAT TRANSFER LABELS */}
                    {material.artworkCategory === 'HEAT TRANSFER LABELS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.heatTransferType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferTypeText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.heatTransferType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.heatTransferTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL BASE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL BASE</label>
                                                    <SearchableDropdown
                            value={material.heatTransferMaterialBase || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferMaterialBase', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferMaterialBaseText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_MATERIAL_BASE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.heatTransferMaterialBase === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.heatTransferMaterialBaseText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferMaterialBaseText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL BASE"
                            />
                          )}
                        </div>

                        {/* SIZE */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-3">
                        <input
                          type="text"
                                  value={material.heatTransferSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.heatTransferSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.heatTransferSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'heatTransferSizeUnit', selectedValue)}
                            options={HEAT_TRANSFER_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.heatTransferPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`heat-transfer-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`heat-transfer-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.heatTransferPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                        </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.heatTransferTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.heatTransferTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.heatTransferTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces / Sheets */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.heatTransferQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces / Sheets (rolls of transfer film)"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.heatTransferSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.heatTransferApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferApprovalText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.heatTransferApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.heatTransferApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.heatTransferRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px', resize: 'vertical' }}
                            placeholder="Enter REMARKS"
                          />
                        </div>
                        </div>
                      </>
                    )}


                    {/* Specific Fields for UPC LABEL / BARCODE STICKER */}
                    {material.artworkCategory === 'UPC LABEL / BARCODE STICKER' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.upcBarcodeType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'upcBarcodeType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'upcBarcodeTypeText', '');
                              }
                              }
                            }}
                            options={UPC_BARCODE_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.upcBarcodeType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.upcBarcodeTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.upcBarcodeMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'upcBarcodeMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'upcBarcodeMaterialText', '');
                              }
                              }
                            }}
                            options={UPC_BARCODE_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.upcBarcodeMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.upcBarcodeMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC - File Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeArtworkSpecFile', e.target.files[0])}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* SIZE - Width, Height, Unit with Upload Image Reference */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={material.upcBarcodeSizeWidth || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeSizeWidth', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="WIDTH"
                            />
                            <span className="text-gray-500">×</span>
                            <input
                              type="text"
                              value={material.upcBarcodeSizeHeight || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeSizeHeight', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="HEIGHT"
                            />
                                                      <SearchableDropdown
                            value={material.upcBarcodeSizeUnit || ''}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeSizeUnit', selectedValue)}
                            options={UPC_BARCODE_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '100px' }}
                          />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeSizeImageFile', e.target.files[0])}
                              className="hidden"
                              id={`upc-barcode-size-image-${materialIndex}`}
                            />
                            <label
                              htmlFor={`upc-barcode-size-image-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                              style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              UPLOAD
                            </label>
                            <input
                              type="text"
                              value={material.upcBarcodeSizeImageRef || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeSizeImageRef', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="IMAGE REFERENCE"
                            />
                          </div>
                        </div>

                        {/* PLACEMENT - Text input */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <input
                            type="text"
                              value={material.upcBarcodePlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodePlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQ.</label>
                                                    <SearchableDropdown
                            value={material.upcBarcodeTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'upcBarcodeTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'upcBarcodeTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={UPC_BARCODE_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.upcBarcodeTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.upcBarcodeTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces / Rolls */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.upcBarcodeQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces / Rolls"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.upcBarcodeSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="5%"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.upcBarcodeApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'upcBarcodeApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'upcBarcodeApprovalText', '');
                              }
                              }
                            }}
                            options={UPC_BARCODE_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.upcBarcodeApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.upcBarcodeApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.upcBarcodeRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcBarcodeRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px' }}
                            placeholder="Text"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for PRICE TICKET / BARCODE TAG */}
                    {material.artworkCategory === 'PRICE TICKET / BARCODE TAG' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.priceTicketType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'priceTicketType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'priceTicketTypeText', '');
                              }
                              }
                            }}
                            options={PRICE_TICKET_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.priceTicketType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.priceTicketTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.priceTicketMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'priceTicketMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'priceTicketMaterialText', '');
                              }
                              }
                            }}
                            options={PRICE_TICKET_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.priceTicketMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.priceTicketMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketArtworkSpecFile', e.target.files[0])}
                            className="hidden"
                            id={`price-ticket-artwork-${materialIndex}`}
                          />
                          <label
                            htmlFor={`price-ticket-artwork-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.priceTicketArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* SIZE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.priceTicketSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.priceTicketSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.priceTicketSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'priceTicketSizeUnit', selectedValue)}
                            options={PRICE_TICKET_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>

                        {/* PLACEMENT - Text input */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <input
                            type="text"
                            value={material.priceTicketPlacement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.priceTicketTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'priceTicketTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'priceTicketTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={PRICE_TICKET_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.priceTicketTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.priceTicketTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces / Rolls */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.priceTicketQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces / Rolls"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.priceTicketSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.priceTicketApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'priceTicketApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'priceTicketApprovalText', '');
                              }
                              }
                            }}
                            options={PRICE_TICKET_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.priceTicketApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.priceTicketApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.priceTicketRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px', resize: 'vertical' }}
                            placeholder="Enter REMARKS"
                          />
                        </div>
                        </div>
                      </>
                    )}


                    {/* Specific Fields for ANTI-COUNTERFEIT & HOLOGRAMS */}
                    {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.antiCounterfeitType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitTypeText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                          {material.antiCounterfeitType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.antiCounterfeitTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                            />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.antiCounterfeitMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitMaterialText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                          {material.antiCounterfeitMaterial === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.antiCounterfeitMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                            />
                          )}
                        </div>

                        {/* ARTWORK SPEC and SIZE in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* ARTWORK SPEC - Upload */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'artworkSpecFile', e.target.files[0])}
                                  className="hidden"
                                  id={`anti-counterfeit-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`anti-counterfeit-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.artworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>

                            {/* SIZE */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                              <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.antiCounterfeitSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.antiCounterfeitSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.antiCounterfeitSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitSizeUnit', selectedValue)}
                            options={ANTI_COUNTERFEIT_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SECURITY FEATURE, HOLOGRAM TYPE, NUMBERING in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {/* SECURITY FEATURE - Dropdown with Others option */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SECURITY</label>
                                                        <SearchableDropdown
                            value={material.securityFeature || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'securityFeature', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'securityFeatureText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_SECURITY_FEATURES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                              {material.securityFeature === 'OTHERS (TEXT)' && (
                                <input
                                  type="text"
                                  value={material.securityFeatureText || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'securityFeatureText', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                  placeholder="Enter SECURITY"
                                />
                              )}
                        </div>

                            {/* HOLOGRAM TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>HOLOGRAM TYPE</label>
                                                        <SearchableDropdown
                            value={material.hologramType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hologramType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hologramTypeText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_HOLOGRAM_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                              {material.hologramType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                                  value={material.hologramTypeText || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hologramTypeText', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                                  placeholder="Enter HOLOGRAM TYPE"
                          />
                              )}
                        </div>

                            {/* NUMBERING - Dropdown with Others option */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>NUMBERING</label>
                                                        <SearchableDropdown
                            value={material.numbering || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'numbering', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'numberingText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_NUMBERING_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                              {material.numbering === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                                  value={material.numberingText || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'numberingText', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                                  placeholder="Enter NUMBERING"
                          />
                              )}
                        </div>
                          </div>
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.antiCounterfeitPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`anti-counterfeit-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`anti-counterfeit-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.placementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                          </div>
                        </div>

                        {/* TESTING REQUIREMENTS, QTY, SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {/* TESTING REQUIREMENTS - Simple Dropdown */}
                            <div className="md:col-span-2 flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                        <SearchableDropdown
                            value={material.testingRequirements || ''}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'testingRequirements', selectedValue)}
                            options={ANTI_COUNTERFEIT_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                            </div>

                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                              <input
                                type="number"
                                value={material.antiCounterfeitQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                              />
                            </div>

                            {/* SURPLUS % */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.antiCounterfeitSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL and REMARKS in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                        <SearchableDropdown
                            value={material.antiCounterfeitApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitApprovalText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                              {material.antiCounterfeitApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                                  value={material.antiCounterfeitApprovalText || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitApprovalText', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                                  placeholder="Enter APPROVAL"
                                />
                              )}
                            </div>

                            {/* REMARKS */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                              <input
                                type="text"
                                value={material.antiCounterfeitRemarks || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitRemarks', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Text"
                              />
                            </div>
                          </div>
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for QC / INSPECTION LABELS */}
                    {material.artworkCategory === 'QC / INSPECTION LABELS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.qcInspectionType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionTypeText', '');
                              }
                              }
                            }}
                            options={QC_INSPECTION_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.qcInspectionType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.qcInspectionMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionMaterialText', '');
                              }
                              }
                            }}
                            options={QC_INSPECTION_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.qcInspectionMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionArtworkSpecFile', e.target.files[0])}
                            className="hidden"
                            id={`qc-inspection-artwork-${materialIndex}`}
                          />
                          <label
                            htmlFor={`qc-inspection-artwork-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.qcInspectionArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* SIZE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.qcInspectionSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.qcInspectionSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.qcInspectionSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionSizeUnit', selectedValue)}
                            options={QC_INSPECTION_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>

                        {/* CONTENT - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>CONTENT</label>
                                                    <SearchableDropdown
                            value={material.qcInspectionContent || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionContent', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionContentText', '');
                              }
                              }
                            }}
                            options={QC_INSPECTION_CONTENT}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.qcInspectionContent === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionContentText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionContentText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter CONTENT"
                          />
                          )}
                        </div>

                        {/* CODING SYSTEM - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>CODING SYSTEM</label>
                                                    <SearchableDropdown
                            value={material.qcInspectionCodingSystem || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionCodingSystem', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionCodingSystemText', '');
                              }
                              }
                            }}
                            options={QC_INSPECTION_CODING_SYSTEM}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.qcInspectionCodingSystem === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionCodingSystemText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionCodingSystemText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter CODING SYSTEM"
                          />
                          )}
                        </div>

                        {/* GUMMING QUALITY - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>GUMMING QU.</label>
                                                    <SearchableDropdown
                            value={material.qcInspectionGummingQuality || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionGummingQuality', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionGummingQualityText', '');
                              }
                              }
                            }}
                            options={QC_INSPECTION_GUMMING_QUALITY}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.qcInspectionGummingQuality === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionGummingQualityText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionGummingQualityText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter GUMMING QUALITY"
                          />
                          )}
                        </div>

                        {/* PLACEMENT - Text input with Upload Image Reference */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-2">
                          <input
                            type="text"
                              value={material.qcInspectionPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionPlacementImageFile', e.target.files[0])}
                              className="hidden"
                              id={`qc-inspection-placement-image-${materialIndex}`}
                            />
                            <label
                              htmlFor={`qc-inspection-placement-image-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                              style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.qcInspectionPlacementImageFile ? 'DONE' : 'UPLOAD'}</span>
                            </label>
                          </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.qcInspectionTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={QC_INSPECTION_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.qcInspectionTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.qcInspectionQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.qcInspectionSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.qcInspectionApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'qcInspectionApprovalText', '');
                              }
                              }
                            }}
                            options={QC_INSPECTION_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.qcInspectionApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Text input */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <input
                            type="text"
                            value={material.qcInspectionRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcInspectionRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter REMARKS"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for BELLY BAND / WRAPPER */}
                    {material.artworkCategory === 'BELLY BAND / WRAPPER' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.bellyBandType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandTypeText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.bellyBandType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.bellyBandTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.bellyBandMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandMaterialText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.bellyBandMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.bellyBandMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC and SIZE in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* ARTWORK SPEC - Upload */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandArtworkSpecFile', e.target.files[0])}
                                  className="hidden"
                                  id={`belly-band-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`belly-band-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.bellyBandArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>

                            {/* SIZE */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                              <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.bellyBandSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.bellyBandSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.bellyBandSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'bellyBandSizeUnit', selectedValue)}
                            options={BELLY_BAND_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CLOSURE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>CLOSURE</label>
                                                    <SearchableDropdown
                            value={material.bellyBandClosure || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandClosure', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandClosureText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_CLOSURE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.bellyBandClosure === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.bellyBandClosureText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandClosureText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter CLOSURE"
                            />
                          )}
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.bellyBandTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                          {material.bellyBandTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.bellyBandTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.bellyBandPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`belly-band-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`belly-band-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.bellyBandPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                          </div>
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                              <input
                                type="number"
                                value={material.bellyBandQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                              />
                            </div>

                            {/* SURPLUS % */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.bellyBandSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.bellyBandApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandApprovalText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.bellyBandApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.bellyBandApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <input
                            type="text"
                            value={material.bellyBandRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                        </div>
                        </div>
                      </>
                    )}


                    {/* Specific Fields for SIZE LABELS (INDIVIDUAL) */}
                    {material.artworkCategory === 'SIZE LABELS (INDIVIDUAL)' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsTypeText', '');
                              }
                              }
                            }}
                            options={SIZE_LABELS_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.sizeLabelsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsMaterialText', '');
                              }
                              }
                            }}
                            options={SIZE_LABELS_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.sizeLabelsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsArtworkSpecFile', e.target.files[0])}
                            className="hidden"
                            id={`size-labels-artwork-${materialIndex}`}
                          />
                          <label
                            htmlFor={`size-labels-artwork-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.sizeLabelsArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* SIZE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.sizeLabelsSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.sizeLabelsSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.sizeLabelsSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeUnit', selectedValue)}
                            options={SIZE_LABELS_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>

                        {/* SIZE SYSTEM - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE SYSTEM</label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsSizeSystem || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeSystem', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeSystemText', '');
                              }
                              }
                            }}
                            options={SIZE_LABELS_SIZE_SYSTEM_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.sizeLabelsSizeSystem === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsSizeSystemText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeSystemText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter SIZE SYSTEM"
                          />
                          )}
                        </div>

                        {/* SIZE / CODE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE / CODE</label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsSizeCode || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeCode', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeCodeText', '');
                              }
                              }
                            }}
                            options={SIZE_LABELS_SIZE_CODE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.sizeLabelsSizeCode === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsSizeCodeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsSizeCodeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter SIZE / CODE"
                          />
                          )}
                        </div>

                        {/* FOLD TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>FOLD TYPE</label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsFoldType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsFoldType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsFoldTypeText', '');
                              }
                              }
                            }}
                            options={SIZE_LABELS_FOLD_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.sizeLabelsFoldType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsFoldTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsFoldTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter FOLD TYPE"
                          />
                          )}
                        </div>

                        {/* PLACEMENT - Text input with Upload Image Reference */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-2">
                          <input
                            type="text"
                              value={material.sizeLabelsPlacementText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsPlacementText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`size-labels-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`size-labels-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                              style={{ padding: '10px 14px', height: '44px', width: '150px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.sizeLabelsPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                          </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={SIZE_LABELS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.sizeLabelsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces or Rolls */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.sizeLabelsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces or Rolls"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.sizeLabelsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'sizeLabelsApprovalText', '');
                              }
                              }
                            }}
                            options={SIZE_LABELS_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.sizeLabelsApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                          />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.sizeLabelsRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelsRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px' }}
                            placeholder="Text"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for TAGS & SPECIAL LABELS */}
                    {material.artworkCategory === 'TAGS & SPECIAL LABELS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsTypeText', '');
                              }
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.tagsSpecialLabelsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsMaterialText', '');
                              }
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.tagsSpecialLabelsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC - File Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsArtworkSpecFile', e.target.files[0])}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* SIZE - Width, Height, Unit */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={material.tagsSpecialLabelsSizeWidth || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsSizeWidth', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="WIDTH"
                            />
                            <span className="text-gray-500">×</span>
                            <input
                              type="text"
                              value={material.tagsSpecialLabelsSizeHeight || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsSizeHeight', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="HEIGHT"
                            />
                                                      <SearchableDropdown
                            value={material.tagsSpecialLabelsSizeUnit || ''}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsSizeUnit', selectedValue)}
                            options={TAGS_SPECIAL_LABELS_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '100px' }}
                          />
                          </div>
                        </div>

                        {/* ATTACHMENT - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ATTACHMENT</label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsAttachment || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsAttachment', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsAttachmentText', '');
                              }
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_ATTACHMENT_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.tagsSpecialLabelsAttachment === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsAttachmentText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsAttachmentText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter ATTACHMENT"
                          />
                          )}
                        </div>

                        {/* FINISHING - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>FINISHING</label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsFinishing || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsFinishing', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsFinishingText', '');
                              }
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_FINISHING_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.tagsSpecialLabelsFinishing === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsFinishingText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsFinishingText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter FINISHING"
                          />
                          )}
                        </div>

                        {/* PLACEMENT - Text input with Upload Image Reference */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-2">
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsPlacementImageFile', e.target.files[0])}
                              className="hidden"
                              id={`tags-special-labels-placement-image-${materialIndex}`}
                            />
                            <label
                              htmlFor={`tags-special-labels-placement-image-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                              style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              UPLOAD
                            </label>
                            <input
                              type="text"
                              value={material.tagsSpecialLabelsPlacementImageRef || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsPlacementImageRef', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                              placeholder="REFERENCE"
                            />
                          </div>
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - PCS/R LENGTH */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.tagsSpecialLabelsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="PCS/R LENGTH"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.tagsSpecialLabelsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                            </div>
                          </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option and File Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQ.</label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.tagsSpecialLabelsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsTestingRequirementsFile', e.target.files[0])}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsApprovalText', '');
                              }
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.tagsSpecialLabelsApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsApprovalFile', e.target.files[0])}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.tagsSpecialLabelsRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tagsSpecialLabelsRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px' }}
                            placeholder="Text"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* SIZE / DIMENSIONS Field */}
                    {false && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'LABELS (BRAND/MAIN)' ? 'SIZE / ARTWORK ID' :
                           material.artworkCategory === 'SIZE LABELS (INDIVIDUAL)' ? 'SIZE / CODE' : 
                           material.artworkCategory === 'LAW LABEL / CONTENTS TAG' ? 'SIZE / COLOUR' :
                           material.artworkCategory === 'PRICE TICKET / BARCODE TAG' ? 'SIZE / DIMENSION' :
                           material.artworkCategory === 'HEAT TRANSFER LABELS' ? 'SIZE / ARTWORK ID' :
                           material.artworkCategory === 'QC / INSPECTION LABELS' ? 'SIZE / COLOUR' :
                           material.artworkCategory === 'BELLY BAND / WRAPPER' ? 'SIZE / DIMENSIONS' : 'SIZE / DIMENSIONS'}
                  </label>
                        <input
                          type="text"
                          value={material.sizeArtworkId || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeArtworkId', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 20mm x 40mm"
                        />
                      </div>
                    )}


                    {/* COLOURS Field - Excluded for LABELS (BRAND/MAIN) - has its own section */}
                    {false && (['LABELS (BRAND/MAIN)'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOURS</label>
                        <input
                          type="text"
                          value={material.colours}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'colours', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 4 colors"
                        />
                </div>
                    )}
                
                
                    {/* Specific Fields for FLAMMABILITY / SAFETY LABELS */}
                    {material.artworkCategory === 'FLAMMABILITY / SAFETY LABELS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.flammabilitySafetyType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyTypeText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.flammabilitySafetyType === 'OTHERS (TEXT)' && (
                  <input
                    type="text"
                              value={material.flammabilitySafetyTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                        />
                          )}
                      </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.flammabilitySafetyMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyMaterialText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.flammabilitySafetyMaterial === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.flammabilitySafetyMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                            />
                          )}
                        </div>

                        {/* ARTWORK SPEC and SIZE in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* ARTWORK SPEC - Upload */}
                      <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyArtworkSpecFile', e.target.files[0])}
                                  className="hidden"
                                  id={`flammability-safety-artwork-${materialIndex}`}
                                />
                                <label
                                  htmlFor={`flammability-safety-artwork-${materialIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{material.flammabilitySafetyArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>

                            {/* SIZE */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                              <div className="flex items-center gap-3">
                        <input
                          type="text"
                                  value={material.flammabilitySafetySizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetySizeWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.flammabilitySafetySizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetySizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.flammabilitySafetySizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetySizeUnit', selectedValue)}
                            options={FLAMMABILITY_SAFETY_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.flammabilitySafetyPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`flammability-safety-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`flammability-safety-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.flammabilitySafetyPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                      </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.flammabilitySafetyTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.flammabilitySafetyTestingRequirements === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.flammabilitySafetyTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                            />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                      <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                        <input
                          type="text"
                                value={material.flammabilitySafetyQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                        />
                </div>

                            {/* SURPLUS % */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                              <input
                                type="text"
                                value={material.flammabilitySafetySurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetySurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                              />
                            </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.flammabilitySafetyApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyApprovalText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.flammabilitySafetyApproval === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.flammabilitySafetyApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <input
                            type="text"
                            value={material.flammabilitySafetyRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                        </div>
                        </div>
                      </>
                    )}
                

                    {/* PERMANENCE / DURABILITY Field - Excluded for CARE & COMPOSITION (has its own in Advanced Filter) */}
                    {(['BELLY BAND / WRAPPER'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'BELLY BAND / WRAPPER' ? 'DURABILITY' : 'PERMANENCE'}
                        </label>
                        <input
                          type="text"
                          value={material.permanence}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Permanent"
                        />
                      </div>
                    )}

                    {/* ADHESIVE Field */}
                    {(['UPC LABEL / BARCODE STICKER'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                        <input
                          type="text"
                          value={material.adhesive}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'adhesive', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., High-bond"
                        />
                      </div>
                    )}

                    {/* APPLICATION SPEC Field */}



                    {/* Specific Fields for INSERT CARDS */}
                    {material.artworkCategory === 'INSERT CARDS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.insertCardsType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsTypeText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.insertCardsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.insertCardsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.insertCardsMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsMaterialText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.insertCardsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.insertCardsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="text"
                            value={material.insertCardsArtworkSpec || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsArtworkSpec', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Artwork specifications"
                          />
                        </div>

                        {/* SIZE */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE</label>
                          <div className="flex items-center gap-3">
                        <input
                          type="text"
                                  value={material.insertCardsSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.insertCardsSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.insertCardsSizeUnit || 'MM'}
                            onChange={(selectedValue) => (e) => handleArtworkMaterialChange(materialIndex, 'insertCardsSizeUnit', selectedValue)}
                            options={INSERT_CARDS_SIZE_UNITS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.insertCardsPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsPlacement', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsPlacementImageRef', e.target.files[0])}
                              className="hidden"
                              id={`insert-cards-placement-${materialIndex}`}
                            />
                            <label
                              htmlFor={`insert-cards-placement-${materialIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.insertCardsPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                        </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.insertCardsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.insertCardsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.insertCardsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.insertCardsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.insertCardsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                                                    <SearchableDropdown
                            value={material.insertCardsApproval || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsApprovalText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.insertCardsApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.insertCardsApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.insertCardsRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px', resize: 'vertical' }}
                            placeholder="Enter REMARKS"
                          />
                        </div>
                        </div>
                      </>
                    )}

                    {/* Specific Fields for RIBBONS */}
                    {material.artworkCategory === 'RIBBONS' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE</label>
                                                    <SearchableDropdown
                            value={material.ribbonsType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'ribbonsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'ribbonsTypeText', '');
                              }
                              }
                            }}
                            options={RIBBONS_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.ribbonsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.ribbonsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL</label>
                                                    <SearchableDropdown
                            value={material.ribbonsMaterial || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'ribbonsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'ribbonsMaterialText', '');
                              }
                              }
                            }}
                            options={RIBBONS_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.ribbonsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.ribbonsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsArtworkSpecFile', e.target.files[0])}
                            className="hidden"
                            id={`ribbons-artwork-${materialIndex}`}
                          />
                          <label
                            htmlFor={`ribbons-artwork-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.ribbonsArtworkSpecFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* WIDTH */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>WIDTH</label>
                          <input
                            type="text"
                            value={material.ribbonsWidth || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 10mm, 1 inch"
                          />
                        </div>

                        {/* ROLL LENGTH */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ROLL LENGTH</label>
                          <input
                            type="text"
                            value={material.ribbonsRollLength || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsRollLength', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 100m, 500 yards"
                          />
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS</label>
                                                    <SearchableDropdown
                            value={material.ribbonsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'ribbonsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'ribbonsTestingRequirementsText', '');
                              }
                              }
                            }}
                            options={RIBBONS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                          />
                          {material.ribbonsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.ribbonsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY</label>
                          <input
                            type="text"
                                value={material.ribbonsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsQty', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS %</label>
                          <input
                            type="text"
                                value={material.ribbonsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsSurplus', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsApprovalFile', e.target.files[0])}
                            className="hidden"
                            id={`ribbons-approval-${materialIndex}`}
                          />
                          <label
                            htmlFor={`ribbons-approval-${materialIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.ribbonsApprovalFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.ribbonsRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonsRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none w-full"
                            style={{ padding: '10px 14px', minHeight: '80px' }}
                            placeholder="Text"
                          />
                        </div>
                        </div>
                      </>
                    )}


                    {/* TESTING REQUIREMENT Field with Image Upload - For all except LAW LABEL / CONTENTS TAG, ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && material.artworkCategory !== 'ANTI-COUNTERFEIT & HOLOGRAMS' && material.artworkCategory !== 'BELLY BAND / WRAPPER' && material.artworkCategory !== 'CARE & COMPOSITION' && material.artworkCategory !== 'FLAMMABILITY / SAFETY LABELS' && material.artworkCategory !== 'HANG TAG SEALS / STRINGS' && material.artworkCategory !== 'HEAT TRANSFER LABELS' && material.artworkCategory !== 'INSERT CARDS' && material.artworkCategory !== 'LABELS (BRAND/MAIN)' && material.artworkCategory !== 'PRICE TICKET / BARCODE TAG' && material.artworkCategory !== 'QC / INSPECTION LABELS' && material.artworkCategory !== 'RFID / SECURITY TAGS' && material.artworkCategory !== 'RIBBONS' && material.artworkCategory !== 'SIZE LABELS (INDIVIDUAL)' && material.artworkCategory !== 'TAGS & SPECIAL LABELS' && material.artworkCategory !== 'UPC LABEL / BARCODE STICKER' && (
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                            value={material.testingRequirement || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-grow"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Wash Fastness"
                        />
                        <input
                          type="file"
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'referenceImage', e.target.files[0])}
                          className="hidden"
                          id={`art-file-${materialIndex}`}
                        />
                        <label
                          htmlFor={`art-file-${materialIndex}`}
                          className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                          style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="truncate">{material.referenceImage ? 'DONE' : 'UPLOAD'}</span>
                        </label>
                      </div>
                    </div>
                    )}


                    {/* LENGTH / QUANTITY Field - For all except LAW LABEL / CONTENTS TAG, ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && material.artworkCategory !== 'ANTI-COUNTERFEIT & HOLOGRAMS' && material.artworkCategory !== 'BELLY BAND / WRAPPER' && material.artworkCategory !== 'CARE & COMPOSITION' && material.artworkCategory !== 'FLAMMABILITY / SAFETY LABELS' && material.artworkCategory !== 'HANG TAG SEALS / STRINGS' && material.artworkCategory !== 'HEAT TRANSFER LABELS' && material.artworkCategory !== 'INSERT CARDS' && material.artworkCategory !== 'LABELS (BRAND/MAIN)' && material.artworkCategory !== 'PRICE TICKET / BARCODE TAG' && material.artworkCategory !== 'QC / INSPECTION LABELS' && material.artworkCategory !== 'RFID / SECURITY TAGS' && material.artworkCategory !== 'RIBBONS' && material.artworkCategory !== 'SIZE LABELS (INDIVIDUAL)' && material.artworkCategory !== 'TAGS & SPECIAL LABELS' && material.artworkCategory !== 'UPC LABEL / BARCODE STICKER' && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH / QUANTITY</label>
                      <input
                        type="text"
                          value={material.lengthQuantity || ''}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                        placeholder="e.g., 5000 pcs"
                      />
                    </div>
                    )}


                    {/* SURPLUS Field with FOR SECTION - For all except LAW LABEL / CONTENTS TAG, ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && material.artworkCategory !== 'ANTI-COUNTERFEIT & HOLOGRAMS' && material.artworkCategory !== 'BELLY BAND / WRAPPER' && material.artworkCategory !== 'CARE & COMPOSITION' && material.artworkCategory !== 'FLAMMABILITY / SAFETY LABELS' && material.artworkCategory !== 'HANG TAG SEALS / STRINGS' && material.artworkCategory !== 'HEAT TRANSFER LABELS' && material.artworkCategory !== 'INSERT CARDS' && material.artworkCategory !== 'LABELS (BRAND/MAIN)' && material.artworkCategory !== 'PRICE TICKET / BARCODE TAG' && material.artworkCategory !== 'QC / INSPECTION LABELS' && material.artworkCategory !== 'RFID / SECURITY TAGS' && material.artworkCategory !== 'RIBBONS' && material.artworkCategory !== 'SIZE LABELS (INDIVIDUAL)' && material.artworkCategory !== 'TAGS & SPECIAL LABELS' && material.artworkCategory !== 'UPC LABEL / BARCODE STICKER' && (
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS (%AGE / FOR)</label>
                      <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                        <input
                          type="text"
                            value={material.surplus || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                          style={{ padding: '10px 14px', width: '80px' }}
                          placeholder="5%"
                        />
                        <input
                          type="text"
                            value={material.surplusForSection || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                          className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                          style={{ padding: '10px 14px' }}
                          placeholder="FOR SECTION (e.g., PACKAGING / QUALITY)"
                        />
                      </div>
                    </div>
                    )}


                    {/* APPROVAL Field - Excluded for ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), LAW LABEL / CONTENTS TAG, PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER (have their own) */}
                    {material.artworkCategory !== 'ANTI-COUNTERFEIT & HOLOGRAMS' && material.artworkCategory !== 'BELLY BAND / WRAPPER' && material.artworkCategory !== 'CARE & COMPOSITION' && material.artworkCategory !== 'FLAMMABILITY / SAFETY LABELS' && material.artworkCategory !== 'HANG TAG SEALS / STRINGS' && material.artworkCategory !== 'HEAT TRANSFER LABELS' && material.artworkCategory !== 'INSERT CARDS' && material.artworkCategory !== 'LABELS (BRAND/MAIN)' && material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && material.artworkCategory !== 'PRICE TICKET / BARCODE TAG' && material.artworkCategory !== 'QC / INSPECTION LABELS' && material.artworkCategory !== 'RFID / SECURITY TAGS' && material.artworkCategory !== 'RIBBONS' && material.artworkCategory !== 'SIZE LABELS (INDIVIDUAL)' && material.artworkCategory !== 'TAGS & SPECIAL LABELS' && material.artworkCategory !== 'UPC LABEL / BARCODE STICKER' && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                  <SearchableDropdown
                        value={material.approval || ''}
                        onChange={(selectedValue) => handleArtworkMaterialChange(materialIndex, 'approval', selectedValue)}
                        options={["BUYER'S", 'INITIAL', 'IPP', 'PP', 'TOP']}
                        placeholder="Select or type Approval"
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      />
                </div>
                    )}

                    {/* REMARKS Field - Excluded for ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), LAW LABEL / CONTENTS TAG, PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER (have their own) */}
                    {material.artworkCategory !== 'ANTI-COUNTERFEIT & HOLOGRAMS' && material.artworkCategory !== 'BELLY BAND / WRAPPER' && material.artworkCategory !== 'CARE & COMPOSITION' && material.artworkCategory !== 'FLAMMABILITY / SAFETY LABELS' && material.artworkCategory !== 'HANG TAG SEALS / STRINGS' && material.artworkCategory !== 'HEAT TRANSFER LABELS' && material.artworkCategory !== 'INSERT CARDS' && material.artworkCategory !== 'LABELS (BRAND/MAIN)' && material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && material.artworkCategory !== 'PRICE TICKET / BARCODE TAG' && material.artworkCategory !== 'QC / INSPECTION LABELS' && material.artworkCategory !== 'RFID / SECURITY TAGS' && material.artworkCategory !== 'RIBBONS' && material.artworkCategory !== 'SIZE LABELS (INDIVIDUAL)' && material.artworkCategory !== 'TAGS & SPECIAL LABELS' && material.artworkCategory !== 'UPC LABEL / BARCODE STICKER' && (
                    <div className="col-span-full flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                      <textarea
                        value={material.remarks}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'remarks', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', width: '100%' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                        onBlur={(e) => e.target.style.boxShadow = ''}
                        rows="1"
                        placeholder="Additional notes..."
                      ></textarea>
                    </div>
                    )}
                  </div>

                  {/* Advanced Filter for INSERT CARDS - At the very bottom after all fields */}
                  {material.artworkCategory === 'INSERT CARDS' && (
                  <div className="w-full" style={{ marginTop: '20px' }}>
                    {/* Show/Hide Advance Filter Button */}
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => handleArtworkMaterialChange(materialIndex, 'showInsertCardsAdvancedFilter', !material.showInsertCardsAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showInsertCardsAdvancedFilter ? '#667eea' : '#ffffff',
                          borderColor: material.showInsertCardsAdvancedFilter ? '#667eea' : '#e5e7eb',
                          color: material.showInsertCardsAdvancedFilter ? '#ffffff' : '#374151'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showInsertCardsAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showInsertCardsAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showInsertCardsAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                        <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* FUNCTION - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FUNCTION
                            </label>
                                                      <SearchableDropdown
                            value={material.insertCardsFunction || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsFunction', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsFunctionText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_FUNCTION_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.insertCardsFunction === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsFunctionText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsFunctionText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter FUNCTION"
                              />
                )}
              </div>

                          {/* CONTENT - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              CONTENT
                            </label>
                                                      <SearchableDropdown
                            value={material.insertCardsContent || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsContent', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsContentText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_CONTENT_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.insertCardsContent === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsContentText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsContentText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter CONTENT"
                              />
                            )}
                          </div>

                          {/* PRINTING - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PRINTING
                            </label>
                                                      <SearchableDropdown
                            value={material.insertCardsPrinting || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsPrinting', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsPrintingText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_PRINTING_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.insertCardsPrinting === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsPrintingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsPrintingText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter PRINTING"
                              />
                            )}
                          </div>

                          {/* FINISH - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FINISH
                            </label>
                                                      <SearchableDropdown
                            value={material.insertCardsFinish || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsFinish', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsFinishText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_FINISH_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.insertCardsFinish === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsFinishText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsFinishText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter FINISH"
                              />
                            )}
                          </div>

                          {/* STIFFNESS - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              STIFFNESS
                            </label>
                                                      <SearchableDropdown
                            value={material.insertCardsStiffness || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsStiffness', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsStiffnessText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_STIFFNESS_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.insertCardsStiffness === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsStiffnessText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsStiffnessText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter STIFFNESS"
                              />
                            )}
                          </div>

                          {/* ACID-FREE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              ACID-FREE
                            </label>
                                                      <SearchableDropdown
                            value={material.insertCardsAcidFree || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsAcidFree', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsAcidFreeText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_ACID_FREE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.insertCardsAcidFree === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsAcidFreeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsAcidFreeText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter ACID-FREE"
                              />
                            )}
                          </div>

                          {/* BRANDING - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              BRANDING
                            </label>
                                                      <SearchableDropdown
                            value={material.insertCardsBranding || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsBranding', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'insertCardsBrandingText', '');
                              }
                              }
                            }}
                            options={INSERT_CARDS_BRANDING_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.insertCardsBranding === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsBrandingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'insertCardsBrandingText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter BRANDING"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  {/* Advanced Filter for HEAT TRANSFER LABELS - At the very bottom after all fields */}
                  {material.artworkCategory === 'HEAT TRANSFER LABELS' && (
                  <div className="w-full" style={{ marginTop: '20px' }}>
                    {/* Show/Hide Advance Filter Button */}
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => handleArtworkMaterialChange(materialIndex, 'showHeatTransferAdvancedFilter', !material.showHeatTransferAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showHeatTransferAdvancedFilter ? '#667eea' : '#ffffff',
                          borderColor: material.showHeatTransferAdvancedFilter ? '#667eea' : '#e5e7eb',
                          color: material.showHeatTransferAdvancedFilter ? '#ffffff' : '#374151'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showHeatTransferAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showHeatTransferAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showHeatTransferAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                        <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* INK TYPE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              INK TYPE
                            </label>
                                                      <SearchableDropdown
                            value={material.heatTransferInkType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferInkType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferInkTypeText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_INK_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.heatTransferInkType === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferInkTypeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferInkTypeText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter INK TYPE"
                              />
                )}
              </div>
                          
                          {/* FABRIC COMPATIBILITY - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FABRIC COMPATIBILITY
                            </label>
                                                      <SearchableDropdown
                            value={material.heatTransferFabricCompatibility || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferFabricCompatibility', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferFabricCompatibilityText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_FABRIC_COMPATIBILITY_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.heatTransferFabricCompatibility === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferFabricCompatibilityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferFabricCompatibilityText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter FABRIC COMPATIBILITY"
                              />
                            )}
                          </div>
                          
                          {/* APPLICATION SPEC - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              APPLICATION SPEC
                            </label>
                                                      <SearchableDropdown
                            value={material.heatTransferApplicationSpec || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferApplicationSpec', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferApplicationSpecText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_APPLICATION_SPEC_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.heatTransferApplicationSpec === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferApplicationSpecText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferApplicationSpecText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter APPLICATION SPEC"
                              />
                            )}
                          </div>
                          
                          {/* PEEL TYPE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PEEL TYPE
                            </label>
                                                      <SearchableDropdown
                            value={material.heatTransferPeelType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferPeelType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferPeelTypeText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_PEEL_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.heatTransferPeelType === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferPeelTypeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferPeelTypeText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter PEEL TYPE"
                              />
                            )}
                          </div>
                          
                          {/* FINISH / HAND FEEL - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FINISH / HAND FEEL
                            </label>
                                                      <SearchableDropdown
                            value={material.heatTransferFinishHandFeel || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferFinishHandFeel', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferFinishHandFeelText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_FINISH_HAND_FEEL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.heatTransferFinishHandFeel === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferFinishHandFeelText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferFinishHandFeelText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter FINISH / HAND FEEL"
                              />
                            )}
                          </div>
                          
                          {/* STRETCH - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              STRETCH
                            </label>
                                                      <SearchableDropdown
                            value={material.heatTransferStretch || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferStretch', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'heatTransferStretchText', '');
                              }
                              }
                            }}
                            options={HEAT_TRANSFER_STRETCH_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.heatTransferStretch === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferStretchText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferStretchText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter STRETCH"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  {/* Advanced Filter for HANG TAG SEALS / STRINGS - At the very bottom after all fields */}
                  {material.artworkCategory === 'HANG TAG SEALS / STRINGS' && (
                  <div className="w-full" style={{ marginTop: '20px' }}>
                    {/* Show/Hide Advance Filter Button */}
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => handleArtworkMaterialChange(materialIndex, 'showHangTagSealsAdvancedFilter', !material.showHangTagSealsAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showHangTagSealsAdvancedFilter ? '#667eea' : '#ffffff',
                          borderColor: material.showHangTagSealsAdvancedFilter ? '#667eea' : '#e5e7eb',
                          color: material.showHangTagSealsAdvancedFilter ? '#ffffff' : '#374151'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showHangTagSealsAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showHangTagSealsAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showHangTagSealsAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                        <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* FASTENING - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FASTENING
                            </label>
                                                      <SearchableDropdown
                            value={material.hangTagSealsFastening || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsFastening', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsFasteningText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_FASTENING_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.hangTagSealsFastening === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsFasteningText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsFasteningText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter FASTENING"
                              />
                )}
              </div>
                          
                          {/* PRE-STRINGING - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PRE-STRINGING
                            </label>
                                                      <SearchableDropdown
                            value={material.hangTagSealsPreStringing || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsPreStringing', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsPreStringingText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_PRE_STRINGING_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.hangTagSealsPreStringing === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsPreStringingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsPreStringingText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter PRE-STRINGING"
                              />
                            )}
                          </div>
                          
                          {/* STRING FINISH - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              STRING FINISH
                            </label>
                                                      <SearchableDropdown
                            value={material.hangTagSealsStringFinish || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsStringFinish', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsStringFinishText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_STRING_FINISH_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.hangTagSealsStringFinish === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsStringFinishText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsStringFinishText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter STRING FINISH"
                              />
                            )}
                          </div>
                          
                          {/* SEAL SHAPE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              SEAL SHAPE
                            </label>
                                                      <SearchableDropdown
                            value={material.hangTagSealsSealShape || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsSealShape', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsSealShapeText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_SEAL_SHAPE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.hangTagSealsSealShape === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsSealShapeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsSealShapeText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter SEAL SHAPE"
                              />
                            )}
                          </div>
                          
                          {/* COLOUR - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              COLOUR
                            </label>
                                                      <SearchableDropdown
                            value={material.hangTagSealsColour || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsColour', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsColourText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_COLOUR_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.hangTagSealsColour === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsColourText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsColourText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter COLOUR"
                              />
                            )}
                          </div>
                          
                          {/* LOGO/BRANDING - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              LOGO/BRANDING
                            </label>
                                                      <SearchableDropdown
                            value={material.hangTagSealsLogoBranding || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsLogoBranding', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'hangTagSealsLogoBrandingText', '');
                              }
                              }
                            }}
                            options={HANG_TAG_SEALS_LOGO_BRANDING_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.hangTagSealsLogoBranding === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsLogoBrandingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagSealsLogoBrandingText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter LOGO/BRANDING"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  {/* Advanced Filter for ANTI-COUNTERFEIT & HOLOGRAMS - At the very bottom after all fields */}
                  {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' && (
                  <div className="w-full" style={{ marginTop: '20px' }}>
                    {/* Show/Hide Advance Filter Button */}
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => handleArtworkMaterialChange(materialIndex, 'showAntiCounterfeitAdvancedFilter', !material.showAntiCounterfeitAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showAntiCounterfeitAdvancedFilter ? '#667eea' : '#ffffff',
                          borderColor: material.showAntiCounterfeitAdvancedFilter ? '#667eea' : '#e5e7eb',
                          color: material.showAntiCounterfeitAdvancedFilter ? '#ffffff' : '#374151'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showAntiCounterfeitAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showAntiCounterfeitAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
              </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showAntiCounterfeitAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                        <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* VERIFICATION - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              VERIFICATION
                            </label>
                                                      <SearchableDropdown
                            value={material.verification || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'verification', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'verificationText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_VERIFICATION_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.verification === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.verificationText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'verificationText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter VERIFICATION"
                              />
                )}
              </div>
                          
                          {/* QR/CODE CONTENT - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              QR/CODE CONTENT
                            </label>
                                                      <SearchableDropdown
                            value={material.qrCodeContent || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'qrCodeContent', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'qrCodeContentText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_QR_CODE_CONTENT_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.qrCodeContent === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.qrCodeContentText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qrCodeContentText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter QR/CODE CONTENT"
                              />
                            )}
                          </div>
                          
                          {/* APPLICATION - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              APPLICATION
                            </label>
                                                      <SearchableDropdown
                            value={material.antiCounterfeitApplication || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitApplication', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitApplicationText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_APPLICATION_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.antiCounterfeitApplication === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.antiCounterfeitApplicationText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitApplicationText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter APPLICATION"
                              />
                            )}
                          </div>
                          
                          {/* TAMPER EVIDENCE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              TAMPER EVIDENCE
                            </label>
                                                      <SearchableDropdown
                            value={material.tamperEvidence || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'tamperEvidence', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'tamperEvidenceText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_TAMPER_EVIDENCE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.tamperEvidence === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.tamperEvidenceText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tamperEvidenceText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter TAMPER EVIDENCE"
                              />
                            )}
                          </div>
                          
                          {/* DATABASE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              DATABASE
                            </label>
                                                      <SearchableDropdown
                            value={material.antiCounterfeitDatabase || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitDatabase', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'antiCounterfeitDatabaseText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_DATABASE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.antiCounterfeitDatabase === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.antiCounterfeitDatabaseText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitDatabaseText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter DATABASE"
                              />
                            )}
                          </div>
                          
                          {/* GUMMING QUALITY - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              GUMMING QUALITY
                            </label>
                                                      <SearchableDropdown
                            value={material.gummingQuality || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'gummingQuality', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'gummingQualityText', '');
                              }
                              }
                            }}
                            options={ANTI_COUNTERFEIT_GUMMING_QUALITY_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.gummingQuality === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.gummingQualityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'gummingQualityText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter GUMMING QUALITY"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  {/* Advanced Filter for CARE & COMPOSITION - At the very bottom after all fields */}
                  {material.artworkCategory === 'CARE & COMPOSITION' && (
                  <div className="w-full" style={{ marginTop: '20px' }}>
                    {/* Show/Hide Advance Filter Button */}
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => handleArtworkMaterialChange(materialIndex, 'showCareCompositionAdvancedFilter', !material.showCareCompositionAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showCareCompositionAdvancedFilter ? '#667eea' : '#ffffff',
                          borderColor: material.showCareCompositionAdvancedFilter ? '#667eea' : '#e5e7eb',
                          color: material.showCareCompositionAdvancedFilter ? '#ffffff' : '#374151'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showCareCompositionAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showCareCompositionAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showCareCompositionAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                        <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* PRINT TYPE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PRINT TYPE
                            </label>
                                                      <SearchableDropdown
                            value={material.careCompositionPrintType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionPrintType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionPrintTypeText', '');
                              }
                              }
                            }}
                            options={CARE_COMPOSITION_PRINT_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.careCompositionPrintType === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionPrintTypeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionPrintTypeText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter PRINT TYPE"
                              />
                            )}
                          </div>
                          
                          {/* INK TYPE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              INK TYPE
                            </label>
                                                      <SearchableDropdown
                            value={material.careCompositionInkType || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionInkType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionInkTypeText', '');
                              }
                              }
                            }}
                            options={CARE_COMPOSITION_INK_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.careCompositionInkType === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionInkTypeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionInkTypeText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter INK TYPE"
                              />
                            )}
                          </div>
                          
                          {/* MANUFACTURER ID - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              MANUFACTURER ID
                            </label>
                                                      <SearchableDropdown
                            value={material.careCompositionManufacturerId || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionManufacturerId', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionManufacturerIdText', '');
                              }
                              }
                            }}
                            options={CARE_COMPOSITION_MANUFACTURER_ID_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.careCompositionManufacturerId === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionManufacturerIdText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionManufacturerIdText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter MANUFACTURER ID"
                              />
                            )}
                          </div>
                          
                          {/* PERMANENCE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PERMANENCE
                            </label>
                                                      <SearchableDropdown
                            value={material.careCompositionPermanence || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionPermanence', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionPermanenceText', '');
                              }
                              }
                            }}
                            options={CARE_COMPOSITION_PERMANENCE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.careCompositionPermanence === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionPermanenceText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionPermanenceText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter PERMANENCE"
                              />
                            )}
                          </div>
                          
                          {/* LANGUAGE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              LANGUAGE
                            </label>
                                                      <SearchableDropdown
                            value={material.careCompositionLanguage || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionLanguage', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'careCompositionLanguageText', '');
                              }
                              }
                            }}
                            options={CARE_COMPOSITION_LANGUAGE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.careCompositionLanguage === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionLanguageText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'careCompositionLanguageText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter LANGUAGE"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  {/* Advanced Filter for FLAMMABILITY / SAFETY LABELS - At the very bottom after all fields */}
                  {material.artworkCategory === 'FLAMMABILITY / SAFETY LABELS' && (
                  <div className="w-full" style={{ marginTop: '20px' }}>
                    {/* Show/Hide Advance Filter Button */}
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => handleArtworkMaterialChange(materialIndex, 'showFlammabilitySafetyAdvancedFilter', !material.showFlammabilitySafetyAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showFlammabilitySafetyAdvancedFilter ? '#667eea' : '#ffffff',
                          borderColor: material.showFlammabilitySafetyAdvancedFilter ? '#667eea' : '#e5e7eb',
                          color: material.showFlammabilitySafetyAdvancedFilter ? '#ffffff' : '#374151'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showFlammabilitySafetyAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showFlammabilitySafetyAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showFlammabilitySafetyAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                        <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* REGULATION - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              REGULATION
                            </label>
                                                      <SearchableDropdown
                            value={material.flammabilitySafetyRegulation || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyRegulation', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyRegulationText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_REGULATION_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.flammabilitySafetyRegulation === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyRegulationText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyRegulationText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter REGULATION"
                              />
                            )}
                          </div>
                          
                          {/* FONT SIZE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FONT SIZE
                            </label>
                                                      <SearchableDropdown
                            value={material.flammabilitySafetyFontSize || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyFontSize', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyFontSizeText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_FONT_SIZE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.flammabilitySafetyFontSize === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyFontSizeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyFontSizeText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter FONT SIZE"
                              />
                            )}
                          </div>
                          
                          {/* PERMANENCE - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PERMANENCE
                            </label>
                                                      <SearchableDropdown
                            value={material.flammabilitySafetyPermanence || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyPermanence', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyPermanenceText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_PERMANENCE_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.flammabilitySafetyPermanence === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyPermanenceText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyPermanenceText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter PERMANENCE"
                              />
                            )}
                          </div>
                          
                          {/* SYMBOL - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              SYMBOL
                            </label>
                                                      <SearchableDropdown
                            value={material.flammabilitySafetySymbol || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetySymbol', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetySymbolText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_SYMBOL_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.flammabilitySafetySymbol === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetySymbolText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetySymbolText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter SYMBOL"
                              />
                            )}
                          </div>
                          
                          {/* INK DURABILITY - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              INK DURABILITY
                            </label>
                                                      <SearchableDropdown
                            value={material.flammabilitySafetyInkDurability || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyInkDurability', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyInkDurabilityText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_INK_DURABILITY_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.flammabilitySafetyInkDurability === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyInkDurabilityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyInkDurabilityText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter INK DURABILITY"
                              />
                            )}
                          </div>
                          
                          {/* CERTIFICATION ID - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              CERTIFICATION ID
                            </label>
                                                      <SearchableDropdown
                            value={material.flammabilitySafetyCertificationId || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyCertificationId', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyCertificationIdText', '');
                              }
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_CERTIFICATION_ID_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.flammabilitySafetyCertificationId === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyCertificationIdText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'flammabilitySafetyCertificationIdText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter CERTIFICATION ID"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  {/* Advanced Filter for BELLY BAND / WRAPPER - At the very bottom after all fields */}
                  {material.artworkCategory === 'BELLY BAND / WRAPPER' && (
                  <div className="w-full" style={{ marginTop: '20px' }}>
                    {/* Show/Hide Advance Filter Button */}
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => handleArtworkMaterialChange(materialIndex, 'showBellyBandAdvancedFilter', !material.showBellyBandAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showBellyBandAdvancedFilter ? '#667eea' : '#ffffff',
                          borderColor: material.showBellyBandAdvancedFilter ? '#667eea' : '#e5e7eb',
                          color: material.showBellyBandAdvancedFilter ? '#ffffff' : '#374151'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showBellyBandAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showBellyBandAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showBellyBandAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                        <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* PRODUCT FIT - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PRODUCT FIT
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandProductFit || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandProductFit', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandProductFitText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_PRODUCT_FIT_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandProductFit === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandProductFitText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandProductFitText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter PRODUCT FIT"
                              />
                            )}
                          </div>
                          
                          {/* PRINTING - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PRINTING
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandPrinting || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandPrinting', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandPrintingText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_PRINTING_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandPrinting === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandPrintingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandPrintingText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter PRINTING"
                              />
                            )}
                          </div>
                          
                          {/* FOLD LINES - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FOLD LINES
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandFoldLines || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandFoldLines', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandFoldLinesText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_FOLD_LINES_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandFoldLines === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandFoldLinesText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandFoldLinesText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter FOLD LINES"
                              />
                            )}
                          </div>
                          
                          {/* DURABILITY - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              DURABILITY
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandDurability || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandDurability', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandDurabilityText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_DURABILITY_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandDurability === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandDurabilityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandDurabilityText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter DURABILITY"
                              />
                            )}
                          </div>
                          
                          {/* CONTENT - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              CONTENT
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandContent || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandContent', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandContentText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_CONTENT_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandContent === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandContentText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandContentText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter CONTENT"
                              />
                            )}
                          </div>
                          
                          {/* COLOURS - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              COLOURS
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandColours || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandColours', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandColoursText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_COLOURS_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandColours === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandColoursText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandColoursText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter COLOURS"
                              />
                            )}
                          </div>
                          
                          {/* FINISH - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FINISH
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandFinish || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandFinish', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandFinishText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_FINISH_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandFinish === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandFinishText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandFinishText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter FINISH"
                              />
                            )}
                          </div>
                          
                          {/* DIE-CUT - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              DIE-CUT
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandDieCut || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandDieCut', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandDieCutText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_DIE_CUT_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandDieCut === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandDieCutText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandDieCutText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter DIE-CUT"
                              />
                            )}
                          </div>
                          
                          {/* GUMMING QUALITY - Dropdown with Others option */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              GUMMING QUALITY
                            </label>
                                                      <SearchableDropdown
                            value={material.bellyBandGummingQuality || ''}
                            onChange={(selectedValue) => {
                              (e) => {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandGummingQuality', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(materialIndex, 'bellyBandGummingQualityText', '');
                              }
                              }
                            }}
                            options={BELLY_BAND_GUMMING_QUALITY_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          />
                            {material.bellyBandGummingQuality === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandGummingQualityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandGummingQualityText', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none mt-2"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter GUMMING QUALITY"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  )}
                  </>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-8">
            No artwork materials added yet.
          </div>
        )}
        
        {/* Add Material Button at Bottom: moved to footer navigation */}
      </div>
    </div>
  );
};

export default Step4;
