import { useEffect, useRef, useState } from 'react';
import SearchableDropdown from '../SearchableDropdown';
import { ARTWORK_APPROVAL_OPTIONS } from '../../data/approvalOptions';
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
  renderHeaderAction,
  handleArtworkMaterialChange,
  addArtworkMaterial,
  removeArtworkMaterial,
  step3SelectedComponentRef
}) => {
  const [selectedComponent, setSelectedComponent] = useState('');
  const prevMaterialsLengthRef = useRef(formData.artworkMaterials?.length || 0);
  const isInitialMountRef = useRef(true);

  // Sync selected component to parent so Save validates only this component
  useEffect(() => {
    if (step3SelectedComponentRef) {
      step3SelectedComponentRef.current = selectedComponent;
    }
  }, [selectedComponent, step3SelectedComponentRef]);

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

  // Artwork materials for the selected component only (like Part-2 raw materials per component)
  const getArtworkMaterialsForSelectedComponent = () => {
    if (!selectedComponent) return [];
    return (formData.artworkMaterials || []).filter((m) => (m.components || '') === selectedComponent);
  };

  const materialsForComponent = getArtworkMaterialsForSelectedComponent();

  return (
<div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }} className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">PART-3 ARTWORK & LABELING</h2>
          <p className="text-sm text-gray-600">Artwork & packaging materials</p>
        </div>
        {renderHeaderAction}
      </div>

      {/* Component Selection - OUTSIDE form border (like Part-2) */}
      <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--muted)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '300px' }}>
          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ display: 'block', marginBottom: '8px' }}>
            COMPONENT
          </label>
          <SearchableDropdown
            value={selectedComponent || ''}
            onChange={(val) => setSelectedComponent(val || '')}
            options={getComponentOptions()}
            placeholder="Select component"
            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none"
            style={{ padding: '10px 14px', height: '44px', width: '100%' }}
          />
        </div>
      </div>

      {/* Artwork Materials for selected component */}
      {selectedComponent && (
        <div>
          {materialsForComponent.length === 0 ? (
            <div className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '40px 24px', marginBottom: '24px', textAlign: 'center' }}>
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>Add artwork materials for this component</p>
              <button
                type="button"
                onClick={() => addArtworkMaterial(selectedComponent)}
                className="border-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                style={{ padding: '10px 20px', backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                + Add Artwork Material
              </button>
            </div>
          ) : (
            <>
              {materialsForComponent.map((material, filteredIndex) => {
                const allMaterials = formData.artworkMaterials || [];
                const actualIndex = allMaterials.findIndex((m) => m === material);
                if (actualIndex === -1) return null;
                const materialNumber = filteredIndex + 1;
                return (
          <div key={`${selectedComponent}-${actualIndex}`} id={`artwork-material-${actualIndex}`} data-artwork-material-index={actualIndex} className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header with Remove Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h4 className="text-sm font-bold text-gray-700">MATERIAL {materialNumber}</h4>
              {materialsForComponent.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArtworkMaterial(actualIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: 'var(--foreground)',
                    padding: '4px 10px',
                    height: '28px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--muted)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Row 1: Material Desc, Net CNS, Unit (component is fixed by selection) */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    MATERIAL DESC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.materialDescription}
                    onChange={(e) => handleArtworkMaterialChange(actualIndex, 'materialDescription', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground ${
                      errors[`artworkMaterial_${actualIndex}_materialDescription`] 
                        ? 'border-red-600' 
                        : 'border-border focus:border-primary focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${actualIndex}_materialDescription`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., Care Label"
                    required
                  />
                  {errors[`artworkMaterial_${actualIndex}_materialDescription`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${actualIndex}_materialDescription`]}
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
                    onChange={(e) => handleArtworkMaterialChange(actualIndex, 'netConsumption', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground ${
                      errors[`artworkMaterial_${actualIndex}_netConsumption`] 
                        ? 'border-red-600' 
                        : 'border-border focus:border-primary focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${actualIndex}_netConsumption`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="0.000"
                    required
                  />
                  {errors[`artworkMaterial_${actualIndex}_netConsumption`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${actualIndex}_netConsumption`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    UNIT <span className="text-red-600">*</span>
                  </label>
                  <SearchableDropdown
                    value={material.unit || ''}
                    onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'unit', selectedValue)}
                    options={['CM', 'KGS', 'PCS']}
                    strictMode
                    placeholder="CM"
                    className={errors[`artworkMaterial_${actualIndex}_unit`] 
                      ? 'border-red-600' 
                      : ''}
                    style={{ width: '130px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${actualIndex}_unit`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                  />
                  {errors[`artworkMaterial_${actualIndex}_unit`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${actualIndex}_unit`]}
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
                    onChange={(e) => handleArtworkMaterialChange(actualIndex, 'placement', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground ${
                      errors[`artworkMaterial_${actualIndex}_placement`] 
                        ? 'border-red-600' 
                        : 'border-border focus:border-primary focus:outline-none'
                    }`}
                    style={{ padding: '12px 16px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${actualIndex}_placement`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="2&quot; FROM RIGHT CORNER AT FLAP"
                    required
                  />
                  {errors[`artworkMaterial_${actualIndex}_placement`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${actualIndex}_placement`]}
                    </span>
                  )}
              </div>
              
                    <div className="flex flex-col" style={{ width: '180px' }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                      WORK ORDER <span className="text-red-600">*</span>
                      </label>
                    <SearchableDropdown
                      value={material.workOrder || ''}
                      onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'workOrder', selectedValue)}
                      options={["WEAVING", "TUFTING", "QUILTING", "PRINTING", "KNITTING", "EMBROIDERY", "DYEING", "BRAIDING", "CARPET", "CUTTING" , "SEWING" , "FRINGE/TASSELS"]}
                      placeholder="Select or type Work Order"
                      className={errors[`artworkMaterial_${actualIndex}_workOrder`] 
                        ? 'border-red-600' 
                        : ''}
                      onFocus={(e) => {
                        if (!errors[`artworkMaterial_${actualIndex}_workOrder`]) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                    {errors[`artworkMaterial_${actualIndex}_workOrder`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                        {errors[`artworkMaterial_${actualIndex}_workOrder`]}
                        </span>
                      )}
                  </div>
                </div>
                    </div>
                    
              {/* ARTWORK CATEGORY SELECTOR */}
              <div className="w-full" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <div className="flex flex-col" style={{ width: '280px', marginBottom: '20px' }}>
                  <label className="text-sm font-bold text-gray-800 mb-2">ARTWORK CATEGORY</label>
                  <SearchableDropdown
                    value={material.artworkCategory || ''}
                    onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'artworkCategory', selectedValue)}
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
                        onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'specificType', selectedValue)}
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
                        onChange={(e) => handleArtworkMaterialChange(actualIndex, 'material', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_material`] ? 'border-red-600' : 'border-border'}`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.labelsBrandType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'labelsBrandType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'labelsBrandTypeText', '');
                              }
                            }}
                            options={LABELS_BRAND_TYPES}
                            placeholder="Select or type Type"
                            className={errors[`artworkMaterial_${actualIndex}_labelsBrandType`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_labelsBrandType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_labelsBrandType`]}</span>}
                          {material.labelsBrandType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_labelsBrandTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.labelsBrandMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'labelsBrandMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'labelsBrandMaterialText', '');
                              }
                            }}
                            options={LABELS_BRAND_MATERIALS}
                            placeholder="Select or type Material"
                            className={errors[`artworkMaterial_${actualIndex}_labelsBrandMaterial`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_labelsBrandMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_labelsBrandMaterial`]}</span>}
                          {material.labelsBrandMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_labelsBrandMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'labelsBrandArtworkSpecFile', f); }}
                            className="hidden"
                            id={`labels-brand-artwork-${actualIndex}`}
                          />
                          <label
                            htmlFor={`labels-brand-artwork-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_labelsBrandSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.labelsBrandSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_labelsBrandSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                <SearchableDropdown
                                  value={material.labelsBrandSizeUnit || ''}
                                  onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'labelsBrandSizeUnit', selectedValue)}
                                  options={['CM', 'KGS','PCS']}
                                  strictMode
                                  placeholder="CM"
                                  style={{ width: '120px' }}
                                />
                              </div>
                            </div>

                        {/* PLACEMENT - Full width with text input and upload */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.labelsBrandPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_labelsBrandPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'labelsBrandPlacementImageRef', f); }}
                              className="hidden"
                              id={`labels-brand-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`labels-brand-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ATTACHMENT <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.labelsBrandAttachment || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'labelsBrandAttachment', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'labelsBrandAttachmentText', '');
                              }
                            }}
                            options={LABELS_BRAND_ATTACHMENT_OPTIONS}
                            placeholder="Select or type Attachment"
                            className={errors[`artworkMaterial_${actualIndex}_labelsBrandAttachment`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_labelsBrandAttachment`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_labelsBrandAttachment`]}</span>}
                          {material.labelsBrandAttachment === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandAttachmentText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandAttachmentText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_labelsBrandAttachmentText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter ATTACHMENT"
                          />
                          )}
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.labelsBrandTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'labelsBrandTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'labelsBrandTestingRequirementsText', '');
                              }
                            }}
                            options={LABELS_BRAND_TESTING_REQUIREMENTS}
                            placeholder="Select or type Testing Requirements"
                            className={errors[`artworkMaterial_${actualIndex}_labelsBrandTestingRequirements`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_labelsBrandTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_labelsBrandTestingRequirements`]}</span>}
                          {material.labelsBrandTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_labelsBrandTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.labelsBrandQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_labelsBrandQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces/R LENGTH"
                          />
                          {errors[`artworkMaterial_${actualIndex}_labelsBrandQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_labelsBrandQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.labelsBrandSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_labelsBrandSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_labelsBrandSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_labelsBrandSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.labelsBrandApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'labelsBrandApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'labelsBrandApprovalText', '');
                              }
                            }}
                            className={errors[`artworkMaterial_${actualIndex}_labelsBrandApproval`] ? 'border-red-600' : ''}
                            options={LABELS_BRAND_APPROVAL_OPTIONS}
                            placeholder="Select or type Approval"
                          />
                          {material.labelsBrandApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.labelsBrandApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_labelsBrandApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'labelsBrandRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.careCompositionType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'careCompositionTypeText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_TYPES}
                            placeholder="Select or type Type"
                            className={errors[`artworkMaterial_${actualIndex}_careCompositionType`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_careCompositionType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_careCompositionType`]}</span>}
                          {material.careCompositionType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.careCompositionTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.careCompositionMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'careCompositionMaterialText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_MATERIALS}
                            placeholder="Select or type Material"
                            className={errors[`artworkMaterial_${actualIndex}_careCompositionMaterial`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_careCompositionMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_careCompositionMaterial`]}</span>}
                          {material.careCompositionMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.careCompositionMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'careCompositionArtworkSpecFile', f); }}
                                  className="hidden"
                                  id={`care-composition-artwork-${actualIndex}`}
                                />
                                <label
                                  htmlFor={`care-composition-artwork-${actualIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_careCompositionSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="Width"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.careCompositionSizeLength || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionSizeLength', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_careCompositionSizeLength`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="Length"
                                />
                                <SearchableDropdown
                                  value={material.careCompositionSizeUnit || ''}
                                  onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'careCompositionSizeUnit', selectedValue)}
                                  options={['CM', 'KGS','PCS']}
                                  strictMode
                                  placeholder="CM"
                                  style={{ width: '120px' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.careCompositionPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_careCompositionPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'careCompositionPlacementImageRef', f); }}
                              className="hidden"
                              id={`care-composition-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`care-composition-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.careCompositionTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'careCompositionTestingRequirementsText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_TESTING_REQUIREMENTS}
                            placeholder="Select or type Testing Requirements"
                            className={errors[`artworkMaterial_${actualIndex}_careCompositionTestingRequirements`] ? 'border-red-600' : ''}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_careCompositionTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_careCompositionTestingRequirements`]}</span>}
                          {material.careCompositionTestingRequirements === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.careCompositionTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={material.careCompositionQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_careCompositionQty`] ? 'border-red-600' : 'border-border'}`}
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces/ R LENGTH"
                              />
                              {errors[`artworkMaterial_${actualIndex}_careCompositionQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_careCompositionQty`]}</span>}
                            </div>

                            {/* SURPLUS % */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={material.careCompositionSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_careCompositionSurplus`] ? 'border-red-600' : 'border-border'}`}
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                              />
                              {errors[`artworkMaterial_${actualIndex}_careCompositionSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_careCompositionSurplus`]}</span>}
                            </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.careCompositionApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'careCompositionApprovalText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_APPROVAL_OPTIONS}
                            placeholder="Select or type Approval"
                            className={errors[`artworkMaterial_${actualIndex}_careCompositionApproval`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_careCompositionApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_careCompositionApproval`]}</span>}
                          {material.careCompositionApproval === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.careCompositionApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.rfidType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'rfidType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'rfidTypeText', '');
                              }
                            }}
                            options={RFID_TYPES}
                            placeholder="Select or type Type"
                            className={errors[`artworkMaterial_${actualIndex}_rfidType`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_rfidType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_rfidType`]}</span>}
                          {material.rfidType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.rfidTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_rfidTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                    </div>

                        {/* FORM FACTOR - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>FORM FACTOR <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.rfidFormFactor || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'rfidFormFactor', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'rfidFormFactorText', '');
                              }
                            }}
                            options={RFID_FORM_FACTORS}
                            placeholder="Select or type Form Factor"
                            className={errors[`artworkMaterial_${actualIndex}_rfidFormFactor`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_rfidFormFactor`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_rfidFormFactor`]}</span>}
                          {material.rfidFormFactor === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.rfidFormFactorText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidFormFactorText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_rfidFormFactorText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'rfidArtworkSpecFile', f); }}
                            className="hidden"
                            id={`rfid-artwork-${actualIndex}`}
                          />
                          <label
                            htmlFor={`rfid-artwork-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>CHIP MODEL <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.rfidChipModel || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'rfidChipModel', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'rfidChipModelText', '');
                              }
                            }}
                            options={RFID_CHIP_MODELS}
                            placeholder="Select or type Chip Model"
                            className={errors[`artworkMaterial_${actualIndex}_rfidChipModel`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_rfidChipModel`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_rfidChipModel`]}</span>}
                          {material.rfidChipModel === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.rfidChipModelText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidChipModelText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_rfidChipModelText`] ? 'border-red-600' : 'border-border'}`}
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
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_rfidSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.rfidSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_rfidSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                <SearchableDropdown
                                  value={material.rfidSizeUnit || ''}
                                  onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'rfidSizeUnit', selectedValue)}
                                  options={['CM', 'KGS','PCS']}
                                  strictMode
                                  placeholder="CM"
                                  style={{ width: '120px' }}
                                />
                              </div>
                            </div>

                        {/* PLACEMENT - Text input with Upload Image Reference */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-2">
                          <input
                            type="text"
                              value={material.rfidPlacementText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidPlacementText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_rfidPlacementText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'rfidPlacementImageRef', f); }}
                              className="hidden"
                              id={`rfid-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`rfid-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border flex-shrink-0"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                          <SearchableDropdown
                            value={material.rfidTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'rfidTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT FIELD)') {
                                handleArtworkMaterialChange(actualIndex, 'rfidTestingRequirementsText', '');
                              }
                            }}
                            options={RFID_TESTING_REQUIREMENTS}
                            placeholder="Select or type Testing Requirements"
                            className={errors[`artworkMaterial_${actualIndex}_rfidTestingRequirements`] ? 'border-red-600' : ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_rfidTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_rfidTestingRequirements`]}</span>}
                          {material.rfidTestingRequirements === 'OTHERS (TEXT FIELD)' && (
                          <input
                            type="text"
                              value={material.rfidTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_rfidTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'rfidTestingRequirementsFile', f); }}
                            className="hidden"
                            id={`rfid-testing-${actualIndex}`}
                          />
                          <label
                            htmlFor={`rfid-testing-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border mt-2"
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.rfidQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_rfidQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                          {errors[`artworkMaterial_${actualIndex}_rfidQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_rfidQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.rfidSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_rfidSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_rfidSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_rfidSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL</label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'rfidApprovalFile', f); }}
                            className="hidden"
                            id={`rfid-approval-${actualIndex}`}
                          />
                          <label
                            htmlFor={`rfid-approval-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'rfidRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.lawLabelType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'lawLabelType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'lawLabelTypeText', '');
                              }
                            }}
                            options={LAW_LABEL_TYPES}
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_lawLabelType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_lawLabelType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_lawLabelType`]}</span>}
                          {material.lawLabelType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.lawLabelTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_lawLabelTypeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'lawLabelMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'lawLabelMaterialText', '');
                              }
                            }}
                            options={LAW_LABEL_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_lawLabelMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_lawLabelMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_lawLabelMaterial`]}</span>}
                          {material.lawLabelMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.lawLabelMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_lawLabelMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'lawLabelArtworkSpecFile', f); }}
                            className="hidden"
                            id={`law-label-artwork-${actualIndex}`}
                          />
                          <label
                            htmlFor={`law-label-artwork-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_lawLabelSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.lawLabelSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_lawLabelSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.lawLabelSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'lawLabelSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_lawLabelSizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>

                        {/* PLACEMENT - Full width with text input and upload */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.lawLabelPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_lawLabelPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'lawLabelPlacementImageRef', f); }}
                              className="hidden"
                              id={`law-label-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`law-label-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.lawLabelTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'lawLabelTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'lawLabelTestingRequirementsText', '');
                              }
                            }}
                            options={LAW_LABEL_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_lawLabelTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.lawLabelTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.lawLabelTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_lawLabelTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.lawLabelQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_lawLabelQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                          {errors[`artworkMaterial_${actualIndex}_lawLabelQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_lawLabelQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.lawLabelSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_lawLabelSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_lawLabelSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_lawLabelSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.lawLabelApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'lawLabelApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'lawLabelApprovalText', '');
                              }
                            }}
                            options={LAW_LABEL_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_lawLabelApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_lawLabelApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_lawLabelApproval`]}</span>}
                          {material.lawLabelApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.lawLabelApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_lawLabelApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lawLabelRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.hangTagSealsType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'hangTagSealsTypeText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_hangTagSealsType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_hangTagSealsType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_hangTagSealsType`]}</span>}
                          {material.hangTagSealsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.hangTagSealsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_\${actualIndex}_hangTagSealsTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.hangTagSealsMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'hangTagSealsMaterialText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_hangTagSealsMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_hangTagSealsMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_hangTagSealsMaterial`]}</span>}
                          {material.hangTagSealsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.hangTagSealsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'hangTagSealsArtworkSpecFile', f); }}
                                  className="hidden"
                                  id={`hang-tag-seals-artwork-${actualIndex}`}
                                />
                                <label
                                  htmlFor={`hang-tag-seals-artwork-${actualIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_\${actualIndex}_hangTagSealsSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.hangTagSealsSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_\${actualIndex}_hangTagSealsSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.hangTagSealsSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_\${actualIndex}_hangTagSealsSizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '120px' }}
                          />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.hangTagSealsPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'hangTagSealsPlacementImageRef', f); }}
                              className="hidden"
                              id={`hang-tag-seals-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`hang-tag-seals-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.hangTagSealsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'hangTagSealsTestingRequirementsText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_hangTagSealsTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.hangTagSealsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.hangTagSealsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.hangTagSealsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_hangTagSealsQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                          {errors[`artworkMaterial_${actualIndex}_hangTagSealsQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_hangTagSealsQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.hangTagSealsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_hangTagSealsSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="e.g., 5%"
                              />
                              {errors[`artworkMaterial_${actualIndex}_hangTagSealsSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_hangTagSealsSurplus`]}</span>}
                            </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.hangTagSealsApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'hangTagSealsApprovalText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_hangTagSealsApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_hangTagSealsApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_hangTagSealsApproval`]}</span>}
                          {material.hangTagSealsApproval === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.hangTagSealsApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_hangTagSealsRemarks`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'heatTransferTypeText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_heatTransferType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.heatTransferType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.heatTransferTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_\${actualIndex}_heatTransferTypeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferMaterialBase', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'heatTransferMaterialBaseText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_MATERIAL_BASE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_heatTransferMaterialBase`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.heatTransferMaterialBase === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.heatTransferMaterialBaseText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferMaterialBaseText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_\${actualIndex}_heatTransferMaterialBaseText`] ? 'border-red-600' : 'border-border'}`}
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
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_\${actualIndex}_heatTransferSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.heatTransferSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_\${actualIndex}_heatTransferSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.heatTransferSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'heatTransferSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_\${actualIndex}_heatTransferSizeUnit`] ? 'border-red-600' : 'border-border'}`}
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
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_\${actualIndex}_heatTransferPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'heatTransferPlacementImageRef', f); }}
                              className="hidden"
                              id={`heat-transfer-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`heat-transfer-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'heatTransferTestingRequirementsText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_heatTransferTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.heatTransferTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.heatTransferTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_\${actualIndex}_heatTransferTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_heatTransferQty`] ? 'border-red-600' : 'border-border'}`}
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
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_heatTransferSurplus`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'heatTransferApprovalText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_heatTransferApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.heatTransferApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.heatTransferApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_\${actualIndex}_heatTransferApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_heatTransferRemarks`] ? 'border-red-600' : 'border-border'}`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.upcBarcodeType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'upcBarcodeType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'upcBarcodeTypeText', '');
                              }
                            }}
                            options={UPC_BARCODE_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_upcBarcodeType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_upcBarcodeType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_upcBarcodeType`]}</span>}
                          {material.upcBarcodeType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.upcBarcodeTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_\${actualIndex}_upcBarcodeTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.upcBarcodeMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'upcBarcodeMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                                handleArtworkMaterialChange(actualIndex, 'upcBarcodeMaterialText', '');
                              }
                            }}
                            options={UPC_BARCODE_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_upcBarcodeMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_upcBarcodeMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_upcBarcodeMaterial`]}</span>}
                          {material.upcBarcodeMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.upcBarcodeMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_\${actualIndex}_upcBarcodeMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'upcBarcodeArtworkSpecFile', f); }}
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* SIZE - Width, Height, Unit with Upload Image Reference */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={material.upcBarcodeSizeWidth || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeSizeWidth', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_upcBarcodeSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="WIDTH"
                            />
                            <span className="text-gray-500">×</span>
                            <input
                              type="text"
                              value={material.upcBarcodeSizeHeight || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeSizeHeight', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_upcBarcodeSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="HEIGHT"
                            />
                                                      <SearchableDropdown
                            value={material.upcBarcodeSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_\${actualIndex}_upcBarcodeSizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '100px' }}
                          />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'upcBarcodeSizeImageFile', f); }}
                              className="hidden"
                              id={`upc-barcode-size-image-${actualIndex}`}
                            />
                            <label
                              htmlFor={`upc-barcode-size-image-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border flex-shrink-0"
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
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeSizeImageRef', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_\${actualIndex}_upcBarcodeSizeImageRef`] ? 'border-red-600' : 'border-border'}`}
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="IMAGE REFERENCE"
                            />
                          </div>
                        </div>

                        {/* PLACEMENT - Text input */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                              value={material.upcBarcodePlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodePlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_upcBarcodePlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                          {errors[`artworkMaterial_${actualIndex}_upcBarcodePlacement`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_upcBarcodePlacement`]}</span>}
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQ. <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.upcBarcodeTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'upcBarcodeTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'upcBarcodeTestingRequirementsText', '');
                              }
                            }}
                            options={UPC_BARCODE_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_upcBarcodeTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_upcBarcodeTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_upcBarcodeTestingRequirements`]}</span>}
                          {material.upcBarcodeTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.upcBarcodeTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_upcBarcodeTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_upcBarcodeQty`] ? 'border-red-600' : 'border-border'}`}
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
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_\${actualIndex}_upcBarcodeSurplus`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'upcBarcodeApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'upcBarcodeApprovalText', '');
                              }
                            }}
                            options={UPC_BARCODE_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_upcBarcodeApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.upcBarcodeApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.upcBarcodeApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_upcBarcodeApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'upcBarcodeRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                              handleArtworkMaterialChange(actualIndex, 'priceTicketType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'priceTicketTypeText', '');
                              }
                            }}
                            options={PRICE_TICKET_TYPES}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none w-full"
                          />
                          {material.priceTicketType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.priceTicketTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                              handleArtworkMaterialChange(actualIndex, 'priceTicketMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'priceTicketMaterialText', '');
                              }
                            }}
                            options={PRICE_TICKET_MATERIALS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none w-full"
                          />
                          {material.priceTicketMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.priceTicketMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'priceTicketArtworkSpecFile', f); }}
                            className="hidden"
                            id={`price-ticket-artwork-${actualIndex}`}
                          />
                          <label
                            htmlFor={`price-ticket-artwork-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_priceTicketSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.priceTicketSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_priceTicketSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.priceTicketSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'priceTicketSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_priceTicketSizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '120px' }}
                          />
                              </div>
                          {(errors[`artworkMaterial_${actualIndex}_priceTicketSizeWidth`] || errors[`artworkMaterial_${actualIndex}_priceTicketSizeHeight`] || errors[`artworkMaterial_${actualIndex}_priceTicketSizeUnit`]) && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_priceTicketSizeWidth`] || errors[`artworkMaterial_${actualIndex}_priceTicketSizeHeight`] || errors[`artworkMaterial_${actualIndex}_priceTicketSizeUnit`]}</span>}
                            </div>

                        {/* PLACEMENT - Text input */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={material.priceTicketPlacement || ''}
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketPlacement', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_priceTicketPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                          {errors[`artworkMaterial_${actualIndex}_priceTicketPlacement`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_priceTicketPlacement`]}</span>}
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.priceTicketTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'priceTicketTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'priceTicketTestingRequirementsText', '');
                              }
                            }}
                            options={PRICE_TICKET_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_priceTicketTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_priceTicketTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_priceTicketTestingRequirements`]}</span>}
                          {material.priceTicketTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.priceTicketTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_priceTicketTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_priceTicketQty`] ? 'border-red-600' : 'border-border'}`}
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
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_priceTicketSurplus`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'priceTicketApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'priceTicketApprovalText', '');
                              }
                            }}
                            options={PRICE_TICKET_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_priceTicketApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.priceTicketApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.priceTicketApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_priceTicketApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'priceTicketRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitTypeText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.antiCounterfeitType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.antiCounterfeitTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitTypeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitMaterialText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {material.antiCounterfeitMaterial === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.antiCounterfeitMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'artworkSpecFile', f); }}
                                  className="hidden"
                                  id={`anti-counterfeit-artwork-${actualIndex}`}
                                />
                                <label
                                  htmlFor={`anti-counterfeit-artwork-${actualIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitSizeWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.antiCounterfeitSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitSizeHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.antiCounterfeitSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none"
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SECURITY <span className="text-red-500">*</span></label>
                                                        <SearchableDropdown
                            value={material.securityFeature || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'securityFeature', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'securityFeatureText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_SECURITY_FEATURES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_securityFeature`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_securityFeature`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_securityFeature`]}</span>}
                              {material.securityFeature === 'OTHERS (TEXT)' && (
                                <input
                                  type="text"
                                  value={material.securityFeatureText || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'securityFeatureText', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                  placeholder="Enter SECURITY"
                                />
                              )}
                        </div>

                            {/* HOLOGRAM TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>HOLOGRAM TYPE <span className="text-red-500">*</span></label>
                                                        <SearchableDropdown
                            value={material.hologramType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'hologramType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'hologramTypeText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_HOLOGRAM_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_hologramType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_hologramType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_hologramType`]}</span>}
                              {material.hologramType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                                  value={material.hologramTypeText || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hologramTypeText', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                                  placeholder="Enter HOLOGRAM TYPE"
                          />
                              )}
                        </div>

                            {/* NUMBERING - Dropdown with Others option */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>NUMBERING <span className="text-red-500">*</span></label>
                                                        <SearchableDropdown
                            value={material.numbering || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'numbering', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'numberingText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_NUMBERING_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_numbering`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_numbering`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_numbering`]}</span>}
                              {material.numbering === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                                  value={material.numberingText || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'numberingText', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_numberingText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                  placeholder="Enter NUMBERING"
                          />
                              )}
                        </div>
                          </div>
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.antiCounterfeitPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitPlacement`] ? 'border-red-600' : 'border-border'}`}
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'placementImageRef', f); }}
                              className="hidden"
                              id={`anti-counterfeit-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`anti-counterfeit-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.placementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                          </div>
                          {errors[`artworkMaterial_${actualIndex}_antiCounterfeitPlacement`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_antiCounterfeitPlacement`]}</span>}
                        </div>

                        {/* TESTING REQUIREMENTS, QTY, SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            {/* TESTING REQUIREMENTS - Simple Dropdown */}
                            <div className="md:col-span-2 flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                        <SearchableDropdown
                            value={material.testingRequirements || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'testingRequirements', selectedValue)}
                            options={ANTI_COUNTERFEIT_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_testingRequirements`] ? 'border-red-600' : 'border-border'}`}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_testingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_testingRequirements`]}</span>}
                            </div>

                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                              <input
                                type="number"
                                value={material.antiCounterfeitQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitQty`] ? 'border-red-600' : 'border-border'}`}
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                              />
                              {errors[`artworkMaterial_${actualIndex}_antiCounterfeitQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_antiCounterfeitQty`]}</span>}
                            </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.antiCounterfeitSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_antiCounterfeitSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_antiCounterfeitSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL and REMARKS in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                        <SearchableDropdown
                            value={material.antiCounterfeitApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitApprovalText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_antiCounterfeitApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_antiCounterfeitApproval`]}</span>}
                              {material.antiCounterfeitApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                                  value={material.antiCounterfeitApprovalText || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitApprovalText', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitRemarks', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.qcInspectionType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionTypeText', '');
                              }
                            }}
                            options={QC_INSPECTION_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionType`]}</span>}
                          {material.qcInspectionType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_qcInspectionTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.qcInspectionMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionMaterialText', '');
                              }
                            }}
                            options={QC_INSPECTION_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionMaterial`]}</span>}
                          {material.qcInspectionMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_qcInspectionMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'qcInspectionArtworkSpecFile', f); }}
                            className="hidden"
                            id={`qc-inspection-artwork-${actualIndex}`}
                          />
                          <label
                            htmlFor={`qc-inspection-artwork-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_qcInspectionSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.qcInspectionSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_qcInspectionSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.qcInspectionSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'qcInspectionSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none"
                            style={{ width: '120px' }}
                          />
                              </div>
                          {(errors[`artworkMaterial_${actualIndex}_qcInspectionSizeWidth`] || errors[`artworkMaterial_${actualIndex}_qcInspectionSizeHeight`] || errors[`artworkMaterial_${actualIndex}_qcInspectionSizeUnit`]) && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionSizeWidth`] || errors[`artworkMaterial_${actualIndex}_qcInspectionSizeHeight`] || errors[`artworkMaterial_${actualIndex}_qcInspectionSizeUnit`]}</span>}
                            </div>

                        {/* CONTENT - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>CONTENT <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.qcInspectionContent || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionContent', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionContentText', '');
                              }
                            }}
                            options={QC_INSPECTION_CONTENT}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionContent`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionContent`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionContent`]}</span>}
                          {material.qcInspectionContent === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionContentText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionContentText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_qcInspectionContentText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter CONTENT"
                          />
                          )}
                        </div>

                        {/* CODING SYSTEM - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>CODING SYSTEM <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.qcInspectionCodingSystem || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionCodingSystem', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionCodingSystemText', '');
                              }
                            }}
                            options={QC_INSPECTION_CODING_SYSTEM}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionCodingSystem`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionCodingSystem`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionCodingSystem`]}</span>}
                          {material.qcInspectionCodingSystem === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionCodingSystemText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionCodingSystemText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_qcInspectionCodingSystemText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter CODING SYSTEM"
                          />
                          )}
                        </div>

                        {/* GUMMING QUALITY - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>GUMMING QU. <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.qcInspectionGummingQuality || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionGummingQuality', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionGummingQualityText', '');
                              }
                            }}
                            options={QC_INSPECTION_GUMMING_QUALITY}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionGummingQuality`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionGummingQuality`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionGummingQuality`]}</span>}
                          {material.qcInspectionGummingQuality === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionGummingQualityText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionGummingQualityText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_qcInspectionGummingQualityText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter GUMMING QUALITY"
                          />
                          )}
                        </div>

                        {/* PLACEMENT - Text input with Upload Image Reference */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-2">
                          <input
                            type="text"
                              value={material.qcInspectionPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_qcInspectionPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'qcInspectionPlacementImageFile', f); }}
                              className="hidden"
                              id={`qc-inspection-placement-image-${actualIndex}`}
                            />
                            <label
                              htmlFor={`qc-inspection-placement-image-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border flex-shrink-0"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.qcInspectionTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionTestingRequirementsText', '');
                              }
                            }}
                            options={QC_INSPECTION_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionTestingRequirements`]}</span>}
                          {material.qcInspectionTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.qcInspectionQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.qcInspectionSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.qcInspectionApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'qcInspectionApprovalText', '');
                              }
                            }}
                            options={QC_INSPECTION_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_qcInspectionApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_qcInspectionApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_qcInspectionApproval`]}</span>}
                          {material.qcInspectionApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.qcInspectionApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qcInspectionRemarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none w-full"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.bellyBandType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandTypeText', '');
                              }
                            }}
                            options={BELLY_BAND_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_bellyBandType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_bellyBandType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandType`]}</span>}
                          {material.bellyBandType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.bellyBandTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.bellyBandMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandMaterialText', '');
                              }
                            }}
                            options={BELLY_BAND_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_bellyBandMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_bellyBandMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandMaterial`]}</span>}
                          {material.bellyBandMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.bellyBandMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'bellyBandArtworkSpecFile', f); }}
                                  className="hidden"
                                  id={`belly-band-artwork-${actualIndex}`}
                                />
                                <label
                                  htmlFor={`belly-band-artwork-${actualIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE <span className="text-red-500">*</span></label>
                              <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.bellyBandSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.bellyBandSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.bellyBandSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'bellyBandSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandSizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '120px' }}
                          />
                              </div>
                          {(errors[`artworkMaterial_${actualIndex}_bellyBandSizeWidth`] || errors[`artworkMaterial_${actualIndex}_bellyBandSizeHeight`] || errors[`artworkMaterial_${actualIndex}_bellyBandSizeUnit`]) && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandSizeWidth`] || errors[`artworkMaterial_${actualIndex}_bellyBandSizeHeight`] || errors[`artworkMaterial_${actualIndex}_bellyBandSizeUnit`]}</span>}
                            </div>
                          </div>
                        </div>

                        {/* CLOSURE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>CLOSURE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.bellyBandClosure || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandClosure', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandClosureText', '');
                              }
                            }}
                            options={BELLY_BAND_CLOSURE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_bellyBandClosure`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_bellyBandClosure`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandClosure`]}</span>}
                          {material.bellyBandClosure === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.bellyBandClosureText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandClosureText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandClosureText`] ? 'border-red-600' : 'border-border'}`}
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter CLOSURE"
                            />
                          )}
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.bellyBandTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandTestingRequirementsText', '');
                              }
                            }}
                            options={BELLY_BAND_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_bellyBandTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                          {errors[`artworkMaterial_${actualIndex}_bellyBandTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandTestingRequirements`]}</span>}
                          {material.bellyBandTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.bellyBandTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.bellyBandPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_bellyBandPlacement`] ? 'border-red-600' : 'border-border'}`}
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'bellyBandPlacementImageRef', f); }}
                              className="hidden"
                              id={`belly-band-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`belly-band-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.bellyBandPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                          </div>
                          {errors[`artworkMaterial_${actualIndex}_bellyBandPlacement`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandPlacement`]}</span>}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - Pieces */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                              <input
                                type="number"
                                value={material.bellyBandQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_bellyBandQty`] ? 'border-red-600' : 'border-border'}`}
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                              />
                              {errors[`artworkMaterial_${actualIndex}_bellyBandQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandQty`]}</span>}
                            </div>

                            {/* SURPLUS % */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.bellyBandSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_bellyBandSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_bellyBandSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.bellyBandApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandApprovalText', '');
                              }
                            }}
                            options={BELLY_BAND_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_bellyBandApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_bellyBandApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_bellyBandApproval`]}</span>}
                          {material.bellyBandApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.bellyBandApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsTypeText', '');
                              }
                            }}
                            options={SIZE_LABELS_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsType`]}</span>}
                          {material.sizeLabelsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_sizeLabelsTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsMaterialText', '');
                              }
                            }}
                            options={SIZE_LABELS_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsMaterial`]}</span>}
                          {material.sizeLabelsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_sizeLabelsMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'sizeLabelsArtworkSpecFile', f); }}
                            className="hidden"
                            id={`size-labels-artwork-${actualIndex}`}
                          />
                          <label
                            htmlFor={`size-labels-artwork-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                          <input
                            type="text"
                                  value={material.sizeLabelsSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.sizeLabelsSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.sizeLabelsSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '120px' }}
                          />
                              </div>
                          {(errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeWidth`] || errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeHeight`] || errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeUnit`]) && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeWidth`] || errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeHeight`] || errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeUnit`]}</span>}
                            </div>

                        {/* SIZE SYSTEM - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE SYSTEM <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsSizeSystem || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeSystem', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeSystemText', '');
                              }
                            }}
                            options={SIZE_LABELS_SIZE_SYSTEM_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeSystem`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeSystem`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeSystem`]}</span>}
                          {material.sizeLabelsSizeSystem === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsSizeSystemText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeSystemText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter SIZE SYSTEM"
                          />
                          )}
                        </div>

                        {/* SIZE / CODE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE / CODE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsSizeCode || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeCode', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeCodeText', '');
                              }
                            }}
                            options={SIZE_LABELS_SIZE_CODE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeCode`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeCode`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeCode`]}</span>}
                          {material.sizeLabelsSizeCode === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsSizeCodeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsSizeCodeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_sizeLabelsSizeCodeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter SIZE / CODE"
                          />
                          )}
                        </div>

                        {/* FOLD TYPE - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>FOLD TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsFoldType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsFoldType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsFoldTypeText', '');
                              }
                            }}
                            options={SIZE_LABELS_FOLD_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsFoldType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsFoldType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsFoldType`]}</span>}
                          {material.sizeLabelsFoldType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsFoldTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsFoldTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsPlacementText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none flex-1"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'sizeLabelsPlacementImageRef', f); }}
                              className="hidden"
                              id={`size-labels-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`size-labels-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border flex-shrink-0"
                              style={{ padding: '10px 14px', height: '44px', width: '150px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.sizeLabelsPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                          </div>
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsPlacementText`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsPlacementText`]}</span>}
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsTestingRequirementsText', '');
                              }
                            }}
                            options={SIZE_LABELS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsTestingRequirements`]}</span>}
                          {material.sizeLabelsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.sizeLabelsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces or Rolls"
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.sizeLabelsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.sizeLabelsApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'sizeLabelsApprovalText', '');
                              }
                            }}
                            options={SIZE_LABELS_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_sizeLabelsApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_sizeLabelsApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_sizeLabelsApproval`]}</span>}
                          {material.sizeLabelsApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.sizeLabelsApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_sizeLabelsApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeLabelsRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsTypeText', '');
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsType`]}</span>}
                          {material.tagsSpecialLabelsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsTypeText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsMaterialText', '');
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsMaterial`]}</span>}
                          {material.tagsSpecialLabelsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsMaterialText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsArtworkSpecFile', f); }}
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none w-full"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* SIZE - Width, Height, Unit */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                            value={material.tagsSpecialLabelsSizeWidth || ''}
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsSizeWidth', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="WIDTH"
                            />
                            <span className="text-gray-500">×</span>
                            <input
                              type="text"
                            value={material.tagsSpecialLabelsSizeHeight || ''}
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsSizeHeight', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="HEIGHT"
                            />
                                                      <SearchableDropdown
                            value={material.tagsSpecialLabelsSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '100px' }}
                          />
                          </div>
                          {(errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeWidth`] || errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeHeight`] || errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeUnit`]) && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeWidth`] || errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeHeight`] || errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSizeUnit`]}</span>}
                        </div>

                        {/* ATTACHMENT - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ATTACHMENT</label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsAttachment || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsAttachment', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsAttachmentText', '');
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_ATTACHMENT_OPTIONS}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none w-full"
                          />
                          {material.tagsSpecialLabelsAttachment === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsAttachmentText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsAttachmentText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter ATTACHMENT"
                          />
                          )}
                        </div>

                        {/* FINISHING - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>FINISHING <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsFinishing || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsFinishing', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsFinishingText', '');
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_FINISHING_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsFinishing`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsFinishing`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsFinishing`]}</span>}
                          {material.tagsSpecialLabelsFinishing === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsFinishingText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsFinishingText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsPlacementImageFile', f); }}
                              className="hidden"
                              id={`tags-special-labels-placement-image-${actualIndex}`}
                            />
                            <label
                              htmlFor={`tags-special-labels-placement-image-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border flex-shrink-0"
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
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsPlacementImageRef', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                              placeholder="REFERENCE"
                            />
                          </div>
                          {errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsPlacement`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsPlacement`]}</span>}
                        </div>

                        {/* QTY and SURPLUS % in one row */}
                        <div className="col-span-full flex flex-col">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                            {/* QTY - PCS/R LENGTH */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.tagsSpecialLabelsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="PCS/R LENGTH"
                          />
                          {errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.tagsSpecialLabelsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsSurplus`]}</span>}
                            </div>
                          </div>
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option and File Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQ. <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsTestingRequirementsText', '');
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsTestingRequirements`]}</span>}
                          {material.tagsSpecialLabelsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TESTING REQUIREMENTS"
                          />
                          )}
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsTestingRequirementsFile', f); }}
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.tagsSpecialLabelsApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsApprovalText', '');
                              }
                            }}
                            options={TAGS_SPECIAL_LABELS_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_tagsSpecialLabelsApproval`]}</span>}
                          {material.tagsSpecialLabelsApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.tagsSpecialLabelsApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsApprovalText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter APPROVAL"
                            />
                          )}
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsApprovalFile', f); }}
                            className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.tagsSpecialLabelsRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tagsSpecialLabelsRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          onChange={(e) => handleArtworkMaterialChange(actualIndex, 'sizeArtworkId', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder=""
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
                          onChange={(e) => handleArtworkMaterialChange(actualIndex, 'colours', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.flammabilitySafetyType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyTypeText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_flammabilitySafetyType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_flammabilitySafetyType`]}</span>}
                          {material.flammabilitySafetyType === 'OTHERS (TEXT)' && (
                  <input
                    type="text"
                              value={material.flammabilitySafetyTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyTypeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyMaterialText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_flammabilitySafetyMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_flammabilitySafetyMaterial`]}</span>}
                          {material.flammabilitySafetyMaterial === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.flammabilitySafetyMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyArtworkSpecFile', f); }}
                                  className="hidden"
                                  id={`flammability-safety-artwork-${actualIndex}`}
                                />
                                <label
                                  htmlFor={`flammability-safety-artwork-${actualIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE <span className="text-red-500">*</span></label>
                              <div className="flex items-center gap-3">
                        <input
                          type="text"
                                  value={material.flammabilitySafetySizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetySizeWidth', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.flammabilitySafetySizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetySizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.flammabilitySafetySizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetySizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '120px' }}
                          />
                              </div>
                          {(errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeWidth`] || errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeHeight`] || errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeUnit`]) && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeWidth`] || errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeHeight`] || errors[`artworkMaterial_${actualIndex}_flammabilitySafetySizeUnit`]}</span>}
                            </div>
                          </div>
                        </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.flammabilitySafetyPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyPlacement`] ? 'border-red-600' : 'border-border'}`}
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyPlacementImageRef', f); }}
                              className="hidden"
                              id={`flammability-safety-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`flammability-safety-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.flammabilitySafetyPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                      </div>
                          {errors[`artworkMaterial_${actualIndex}_flammabilitySafetyPlacement`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_flammabilitySafetyPlacement`]}</span>}
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.flammabilitySafetyTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyTestingRequirementsText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_flammabilitySafetyTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_flammabilitySafetyTestingRequirements`]}</span>}
                          {material.flammabilitySafetyTestingRequirements === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.flammabilitySafetyTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                                value={material.flammabilitySafetyQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyQty`] ? 'border-red-600' : 'border-border'}`}
                          style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                        />
                          {errors[`artworkMaterial_${actualIndex}_flammabilitySafetyQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_flammabilitySafetyQty`]}</span>}
                </div>

                            {/* SURPLUS % */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={material.flammabilitySafetySurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetySurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetySurplus`] ? 'border-red-600' : 'border-border'}`}
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                              />
                              {errors[`artworkMaterial_${actualIndex}_flammabilitySafetySurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_flammabilitySafetySurplus`]}</span>}
                            </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.flammabilitySafetyApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyApprovalText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_flammabilitySafetyApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_flammabilitySafetyApproval`]}</span>}
                          {material.flammabilitySafetyApproval === 'OTHERS (TEXT)' && (
                            <input
                              type="text"
                              value={material.flammabilitySafetyApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          {material.artworkCategory === 'BELLY BAND / WRAPPER' ? 'DURABILITY' : 'PERMANENCE'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={material.permanence}
                          onChange={(e) => handleArtworkMaterialChange(actualIndex, 'permanence', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_permanence`] ? 'border-red-600' : 'border-border'}`}
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Permanent"
                        />
                        {errors[`artworkMaterial_${actualIndex}_permanence`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_permanence`]}</span>}
                      </div>
                    )}

                    {/* ADHESIVE Field */}
                    {(['UPC LABEL / BARCODE STICKER'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                        <input
                          type="text"
                          value={material.adhesive}
                          onChange={(e) => handleArtworkMaterialChange(actualIndex, 'adhesive', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_adhesive`] ? 'border-red-600' : 'border-border'}`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.insertCardsType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsTypeText', '');
                              }
                            }}
                            options={INSERT_CARDS_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_insertCardsType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_insertCardsType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsType`]}</span>}
                          {material.insertCardsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.insertCardsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.insertCardsMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsMaterialText', '');
                              }
                            }}
                            options={INSERT_CARDS_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_insertCardsMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_insertCardsMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsMaterial`]}</span>}
                          {material.insertCardsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.insertCardsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsMaterialText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter MATERIAL"
                          />
                          )}
                        </div>

                        {/* ARTWORK SPEC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ARTWORK SPEC <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={material.insertCardsArtworkSpec || ''}
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsArtworkSpec', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_insertCardsArtworkSpec`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Artwork specifications"
                          />
                          {errors[`artworkMaterial_${actualIndex}_insertCardsArtworkSpec`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsArtworkSpec`]}</span>}
                        </div>

                        {/* SIZE */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SIZE <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                        <input
                          type="text"
                                  value={material.insertCardsSizeWidth || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsSizeWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsSizeWidth`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="WIDTH"
                                />
                                <span className="text-gray-600" style={{ flexShrink: 0 }}>x</span>
                                <input
                                  type="text"
                                  value={material.insertCardsSizeHeight || ''}
                                  onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsSizeHeight', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsSizeHeight`] ? 'border-red-600' : 'border-border'}`}
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                  placeholder="HEIGHT"
                                />
                                                          <SearchableDropdown
                            value={material.insertCardsSizeUnit || ''}
                            onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'insertCardsSizeUnit', selectedValue)}
                            options={['CM', 'KGS','PCS']}
                            strictMode
                            placeholder="CM"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsSizeUnit`] ? 'border-red-600' : 'border-border'}`}
                            style={{ width: '120px' }}
                          />
                              </div>
                          {(errors[`artworkMaterial_${actualIndex}_insertCardsSizeWidth`] || errors[`artworkMaterial_${actualIndex}_insertCardsSizeHeight`] || errors[`artworkMaterial_${actualIndex}_insertCardsSizeUnit`]) && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsSizeWidth`] || errors[`artworkMaterial_${actualIndex}_insertCardsSizeHeight`] || errors[`artworkMaterial_${actualIndex}_insertCardsSizeUnit`]}</span>}
                            </div>

                        {/* PLACEMENT - Full width in grid */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>PLACEMENT <span className="text-red-500">*</span></label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={material.insertCardsPlacement || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsPlacement', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-1 ${errors[`artworkMaterial_${actualIndex}_insertCardsPlacement`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Text"
                            />
                            <input
                              type="file"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'insertCardsPlacementImageRef', f); }}
                              className="hidden"
                              id={`insert-cards-placement-${actualIndex}`}
                            />
                            <label
                              htmlFor={`insert-cards-placement-${actualIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
                              style={{ padding: '10px 14px', height: '44px', minWidth: '200px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{material.insertCardsPlacementImageRef ? 'UPLOADED' : 'UPLOAD IMAGE REFERENCE'}</span>
                            </label>
                        </div>
                          {errors[`artworkMaterial_${actualIndex}_insertCardsPlacement`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsPlacement`]}</span>}
                        </div>

                        {/* TESTING REQUIREMENTS - Simple Dropdown */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.insertCardsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsTestingRequirementsText', '');
                              }
                            }}
                            options={INSERT_CARDS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_insertCardsTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_insertCardsTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsTestingRequirements`]}</span>}
                          {material.insertCardsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.insertCardsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsTestingRequirementsText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsTestingRequirementsText`] ? 'border-red-600' : 'border-border'}`}
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
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>QTY <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.insertCardsQty || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_insertCardsQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                          {errors[`artworkMaterial_${actualIndex}_insertCardsQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.insertCardsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_insertCardsSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_insertCardsSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.insertCardsApproval || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsApproval', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsApprovalText', '');
                              }
                            }}
                            options={INSERT_CARDS_APPROVAL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_insertCardsApproval`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_insertCardsApproval`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_insertCardsApproval`]}</span>}
                          {material.insertCardsApproval === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.insertCardsApprovalText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsApprovalText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsApprovalText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TYPE <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.ribbonsType || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'ribbonsType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'ribbonsTypeText', '');
                              }
                            }}
                            options={RIBBONS_TYPES}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_ribbonsType`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_ribbonsType`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_ribbonsType`]}</span>}
                          {material.ribbonsType === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.ribbonsTypeText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'ribbonsTypeText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_ribbonsTypeText`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter TYPE"
                          />
                          )}
                        </div>

                        {/* MATERIAL - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>MATERIAL <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.ribbonsMaterial || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'ribbonsMaterial', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'ribbonsMaterialText', '');
                              }
                            }}
                            options={RIBBONS_MATERIALS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_ribbonsMaterial`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_ribbonsMaterial`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_ribbonsMaterial`]}</span>}
                          {material.ribbonsMaterial === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.ribbonsMaterialText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'ribbonsMaterialText', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_ribbonsMaterialText`] ? 'border-red-600' : 'border-border'}`}
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
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'ribbonsArtworkSpecFile', f); }}
                            className="hidden"
                            id={`ribbons-artwork-${actualIndex}`}
                          />
                          <label
                            htmlFor={`ribbons-artwork-${actualIndex}`}
                            className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border"
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
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>WIDTH <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={material.ribbonsWidth || ''}
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'ribbonsWidth', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_ribbonsWidth`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 10mm, 1 inch"
                          />
                          {errors[`artworkMaterial_${actualIndex}_ribbonsWidth`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_ribbonsWidth`]}</span>}
                        </div>

                        {/* ROLL LENGTH */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>ROLL LENGTH <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={material.ribbonsRollLength || ''}
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'ribbonsRollLength', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_ribbonsRollLength`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 100m, 500 yards"
                          />
                          {errors[`artworkMaterial_${actualIndex}_ribbonsRollLength`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_ribbonsRollLength`]}</span>}
                        </div>

                        {/* TESTING REQUIREMENTS - Dropdown with Others option */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>TESTING REQUIREMENTS <span className="text-red-500">*</span></label>
                                                    <SearchableDropdown
                            value={material.ribbonsTestingRequirements || ''}
                            onChange={(selectedValue) => {
                              handleArtworkMaterialChange(actualIndex, 'ribbonsTestingRequirements', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'ribbonsTestingRequirementsText', '');
                              }
                            }}
                            options={RIBBONS_TESTING_REQUIREMENTS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_ribbonsTestingRequirements`] ? 'border-red-600' : 'border-border'}`}
                          />
                          {errors[`artworkMaterial_${actualIndex}_ribbonsTestingRequirements`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_ribbonsTestingRequirements`]}</span>}
                          {material.ribbonsTestingRequirements === 'OTHERS (TEXT)' && (
                          <input
                            type="text"
                              value={material.ribbonsTestingRequirementsText || ''}
                              onChange={(e) => handleArtworkMaterialChange(actualIndex, 'ribbonsTestingRequirementsText', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-background text-foreground border-border focus:border-primary focus:outline-none mt-2"
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
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'ribbonsQty', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_ribbonsQty`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Pieces"
                          />
                          {errors[`artworkMaterial_${actualIndex}_ribbonsQty`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_ribbonsQty`]}</span>}
                        </div>

                            {/* SURPLUS % */}
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>SURPLUS % <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                                value={material.ribbonsSurplus || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'ribbonsSurplus', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full ${errors[`artworkMaterial_${actualIndex}_ribbonsSurplus`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="%AGE"
                          />
                          {errors[`artworkMaterial_${actualIndex}_ribbonsSurplus`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_ribbonsSurplus`]}</span>}
                        </div>
                          </div>
                        </div>

                        {/* APPROVAL - Upload */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>APPROVAL <span className="text-red-500">*</span></label>
                          <input
                            type="file"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'ribbonsApprovalFile', f); }}
                            className="hidden"
                            id={`ribbons-approval-${actualIndex}`}
                          />
                          <label
                            htmlFor={`ribbons-approval-${actualIndex}`}
                            className={`border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 ${errors[`artworkMaterial_${actualIndex}_ribbonsApprovalFile`] ? 'border-red-600' : 'border-border'}`}
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="truncate">{material.ribbonsApprovalFile ? 'UPLOADED' : 'UPLOAD'}</span>
                          </label>
                          {errors[`artworkMaterial_${actualIndex}_ribbonsApprovalFile`] && <span className="text-red-600 text-xs mt-1">{errors[`artworkMaterial_${actualIndex}_ribbonsApprovalFile`]}</span>}
                        </div>

                        {/* REMARKS - Full width */}
                        <div className="col-span-full flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ whiteSpace: 'nowrap' }}>REMARKS</label>
                          <textarea
                            value={material.ribbonsRemarks || ''}
                            onChange={(e) => handleArtworkMaterialChange(actualIndex, 'ribbonsRemarks', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none w-full border-border`}
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
                          onChange={(e) => handleArtworkMaterialChange(actualIndex, 'testingRequirement', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-grow ${errors[`artworkMaterial_${actualIndex}_testingRequirement`] ? 'border-red-600' : 'border-border'}`}
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Wash Fastness"
                        />
                        <input
                          type="file"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArtworkMaterialChange(actualIndex, 'referenceImage', f); }}
                          className="hidden"
                          id={`art-file-${actualIndex}`}
                        />
                        <label
                          htmlFor={`art-file-${actualIndex}`}
                          className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border flex-shrink-0"
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
                        onChange={(e) => handleArtworkMaterialChange(actualIndex, 'lengthQuantity', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_lengthQuantity`] ? 'border-red-600' : 'border-border'}`}
                        style={{ padding: '10px 14px', height: '44px' }}
                        placeholder="e.g., 5000 pcs"
                      />
                    </div>
                    )}


                    {/* SURPLUS Field with FOR SECTION - For all except LAW LABEL / CONTENTS TAG, ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && material.artworkCategory !== 'ANTI-COUNTERFEIT & HOLOGRAMS' && material.artworkCategory !== 'BELLY BAND / WRAPPER' && material.artworkCategory !== 'CARE & COMPOSITION' && material.artworkCategory !== 'FLAMMABILITY / SAFETY LABELS' && material.artworkCategory !== 'HANG TAG SEALS / STRINGS' && material.artworkCategory !== 'HEAT TRANSFER LABELS' && material.artworkCategory !== 'INSERT CARDS' && material.artworkCategory !== 'LABELS (BRAND/MAIN)' && material.artworkCategory !== 'PRICE TICKET / BARCODE TAG' && material.artworkCategory !== 'QC / INSPECTION LABELS' && material.artworkCategory !== 'RFID / SECURITY TAGS' && material.artworkCategory !== 'RIBBONS' && material.artworkCategory !== 'SIZE LABELS (INDIVIDUAL)' && material.artworkCategory !== 'TAGS & SPECIAL LABELS' && material.artworkCategory !== 'UPC LABEL / BARCODE STICKER' && (
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS (%AGE / FOR)</label>
                      <div className={`flex items-center gap-0 border-2 rounded-lg bg-white overflow-hidden focus-within:border-primary transition-all ${errors[`artworkMaterial_${actualIndex}_surplus`] || errors[`artworkMaterial_${actualIndex}_surplusForSection`] ? 'border-red-600' : 'border-border'}`} style={{ height: '44px' }}>
                        <input
                          type="text"
                            value={material.surplus || ''}
                          onChange={(e) => handleArtworkMaterialChange(actualIndex, 'surplus', e.target.value)}
                          className="text-sm bg-transparent text-foreground focus:outline-none border-r border-border"
                          style={{ padding: '10px 14px', width: '80px' }}
                          placeholder="5%"
                        />
                        <input
                          type="text"
                            value={material.surplusForSection || ''}
                          onChange={(e) => handleArtworkMaterialChange(actualIndex, 'surplusForSection', e.target.value)}
                          className="text-sm bg-transparent text-foreground focus:outline-none flex-grow"
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
                        onChange={(selectedValue) => handleArtworkMaterialChange(actualIndex, 'approval', selectedValue)}
                        options={ARTWORK_APPROVAL_OPTIONS}
                        placeholder="Select or type Approval"
                        className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_approval`] ? 'border-red-600' : 'border-border'}`}
                      />
                </div>
                    )}

                    {/* REMARKS Field - Excluded for ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), LAW LABEL / CONTENTS TAG, PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER (have their own) */}
                    {material.artworkCategory !== 'ANTI-COUNTERFEIT & HOLOGRAMS' && material.artworkCategory !== 'BELLY BAND / WRAPPER' && material.artworkCategory !== 'CARE & COMPOSITION' && material.artworkCategory !== 'FLAMMABILITY / SAFETY LABELS' && material.artworkCategory !== 'HANG TAG SEALS / STRINGS' && material.artworkCategory !== 'HEAT TRANSFER LABELS' && material.artworkCategory !== 'INSERT CARDS' && material.artworkCategory !== 'LABELS (BRAND/MAIN)' && material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && material.artworkCategory !== 'PRICE TICKET / BARCODE TAG' && material.artworkCategory !== 'QC / INSPECTION LABELS' && material.artworkCategory !== 'RFID / SECURITY TAGS' && material.artworkCategory !== 'RIBBONS' && material.artworkCategory !== 'SIZE LABELS (INDIVIDUAL)' && material.artworkCategory !== 'TAGS & SPECIAL LABELS' && material.artworkCategory !== 'UPC LABEL / BARCODE STICKER' && (
                    <div className="col-span-full flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                      <textarea
                        value={material.remarks}
                        onChange={(e) => handleArtworkMaterialChange(actualIndex, 'remarks', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_remarks`] ? 'border-red-600' : 'border-border'}`}
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
                        onClick={() => handleArtworkMaterialChange(actualIndex, 'showInsertCardsAdvancedFilter', !material.showInsertCardsAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showInsertCardsAdvancedFilter ? 'var(--primary)' : 'var(--card)',
                          borderColor: material.showInsertCardsAdvancedFilter ? 'var(--primary)' : 'var(--border)',
                          color: material.showInsertCardsAdvancedFilter ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showInsertCardsAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showInsertCardsAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showInsertCardsAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', width: '100%' }}>
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
                              handleArtworkMaterialChange(actualIndex, 'insertCardsFunction', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsFunctionText', '');
                              }
                            }}
                            options={INSERT_CARDS_FUNCTION_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsFunction`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.insertCardsFunction === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsFunctionText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsFunctionText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsFunctionText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'insertCardsContent', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsContentText', '');
                              }
                            }}
                            options={INSERT_CARDS_CONTENT_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsContent`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.insertCardsContent === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsContentText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsContentText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsContentText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'insertCardsPrinting', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsPrintingText', '');
                              }
                            }}
                            options={INSERT_CARDS_PRINTING_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsPrinting`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.insertCardsPrinting === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsPrintingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsPrintingText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsPrintingText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'insertCardsFinish', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsFinishText', '');
                              }
                            }}
                            options={INSERT_CARDS_FINISH_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsFinish`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.insertCardsFinish === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsFinishText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsFinishText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsFinishText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'insertCardsStiffness', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsStiffnessText', '');
                              }
                            }}
                            options={INSERT_CARDS_STIFFNESS_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsStiffness`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.insertCardsStiffness === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsStiffnessText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsStiffnessText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsStiffnessText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'insertCardsAcidFree', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsAcidFreeText', '');
                              }
                            }}
                            options={INSERT_CARDS_ACID_FREE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsAcidFree`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.insertCardsAcidFree === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsAcidFreeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsAcidFreeText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsAcidFreeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'insertCardsBranding', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'insertCardsBrandingText', '');
                              }
                            }}
                            options={INSERT_CARDS_BRANDING_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_insertCardsBranding`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.insertCardsBranding === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.insertCardsBrandingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'insertCardsBrandingText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_insertCardsBrandingText`] ? 'border-red-600' : 'border-border'}`}
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
                        onClick={() => handleArtworkMaterialChange(actualIndex, 'showHeatTransferAdvancedFilter', !material.showHeatTransferAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showHeatTransferAdvancedFilter ? 'var(--primary)' : 'var(--card)',
                          borderColor: material.showHeatTransferAdvancedFilter ? 'var(--primary)' : 'var(--border)',
                          color: material.showHeatTransferAdvancedFilter ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showHeatTransferAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showHeatTransferAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showHeatTransferAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', width: '100%' }}>
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferInkType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'heatTransferInkTypeText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_INK_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_heatTransferInkType`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.heatTransferInkType === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferInkTypeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferInkTypeText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_heatTransferInkTypeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferFabricCompatibility', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'heatTransferFabricCompatibilityText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_FABRIC_COMPATIBILITY_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_heatTransferFabricCompatibility`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.heatTransferFabricCompatibility === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferFabricCompatibilityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferFabricCompatibilityText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_heatTransferFabricCompatibilityText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferApplicationSpec', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'heatTransferApplicationSpecText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_APPLICATION_SPEC_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_heatTransferApplicationSpec`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.heatTransferApplicationSpec === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferApplicationSpecText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferApplicationSpecText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_heatTransferApplicationSpecText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferPeelType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'heatTransferPeelTypeText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_PEEL_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_heatTransferPeelType`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.heatTransferPeelType === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferPeelTypeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferPeelTypeText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_heatTransferPeelTypeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferFinishHandFeel', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'heatTransferFinishHandFeelText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_FINISH_HAND_FEEL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_heatTransferFinishHandFeel`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.heatTransferFinishHandFeel === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferFinishHandFeelText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferFinishHandFeelText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_heatTransferFinishHandFeelText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'heatTransferStretch', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'heatTransferStretchText', '');
                              }
                            }}
                            options={HEAT_TRANSFER_STRETCH_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_heatTransferStretch`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.heatTransferStretch === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.heatTransferStretchText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'heatTransferStretchText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_heatTransferStretchText`] ? 'border-red-600' : 'border-border'}`}
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
                        onClick={() => handleArtworkMaterialChange(actualIndex, 'showHangTagSealsAdvancedFilter', !material.showHangTagSealsAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showHangTagSealsAdvancedFilter ? 'var(--primary)' : 'var(--card)',
                          borderColor: material.showHangTagSealsAdvancedFilter ? 'var(--primary)' : 'var(--border)',
                          color: material.showHangTagSealsAdvancedFilter ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showHangTagSealsAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showHangTagSealsAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showHangTagSealsAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', width: '100%' }}>
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
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsFastening', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsFasteningText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_FASTENING_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_hangTagSealsFastening`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.hangTagSealsFastening === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsFasteningText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsFasteningText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsFasteningText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsPreStringing', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsPreStringingText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_PRE_STRINGING_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_hangTagSealsPreStringing`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.hangTagSealsPreStringing === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsPreStringingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsPreStringingText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsPreStringingText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsStringFinish', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsStringFinishText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_STRING_FINISH_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_hangTagSealsStringFinish`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.hangTagSealsStringFinish === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsStringFinishText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsStringFinishText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsStringFinishText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsSealShape', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsSealShapeText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_SEAL_SHAPE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_hangTagSealsSealShape`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.hangTagSealsSealShape === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsSealShapeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsSealShapeText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsSealShapeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsColour', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsColourText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_COLOUR_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_hangTagSealsColour`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.hangTagSealsColour === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsColourText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsColourText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsColourText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsLogoBranding', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'hangTagSealsLogoBrandingText', '');
                              }
                            }}
                            options={HANG_TAG_SEALS_LOGO_BRANDING_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_hangTagSealsLogoBranding`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.hangTagSealsLogoBranding === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.hangTagSealsLogoBrandingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'hangTagSealsLogoBrandingText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_hangTagSealsLogoBrandingText`] ? 'border-red-600' : 'border-border'}`}
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
                        onClick={() => handleArtworkMaterialChange(actualIndex, 'showAntiCounterfeitAdvancedFilter', !material.showAntiCounterfeitAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showAntiCounterfeitAdvancedFilter ? 'var(--primary)' : 'var(--card)',
                          borderColor: material.showAntiCounterfeitAdvancedFilter ? 'var(--primary)' : 'var(--border)',
                          color: material.showAntiCounterfeitAdvancedFilter ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showAntiCounterfeitAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showAntiCounterfeitAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
              </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showAntiCounterfeitAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', width: '100%' }}>
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
                              handleArtworkMaterialChange(actualIndex, 'verification', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'verificationText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_VERIFICATION_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_verification`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.verification === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.verificationText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'verificationText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_verificationText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'qrCodeContent', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'qrCodeContentText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_QR_CODE_CONTENT_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_qrCodeContent`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.qrCodeContent === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.qrCodeContentText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'qrCodeContentText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_qrCodeContentText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitApplication', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitApplicationText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_APPLICATION_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitApplication`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.antiCounterfeitApplication === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.antiCounterfeitApplicationText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitApplicationText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitApplicationText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'tamperEvidence', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'tamperEvidenceText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_TAMPER_EVIDENCE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_tamperEvidence`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.tamperEvidence === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.tamperEvidenceText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'tamperEvidenceText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_tamperEvidenceText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitDatabase', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'antiCounterfeitDatabaseText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_DATABASE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitDatabase`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.antiCounterfeitDatabase === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.antiCounterfeitDatabaseText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'antiCounterfeitDatabaseText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_antiCounterfeitDatabaseText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'gummingQuality', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'gummingQualityText', '');
                              }
                            }}
                            options={ANTI_COUNTERFEIT_GUMMING_QUALITY_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_gummingQuality`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.gummingQuality === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.gummingQualityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'gummingQualityText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_gummingQualityText`] ? 'border-red-600' : 'border-border'}`}
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
                        onClick={() => handleArtworkMaterialChange(actualIndex, 'showCareCompositionAdvancedFilter', !material.showCareCompositionAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showCareCompositionAdvancedFilter ? 'var(--primary)' : 'var(--card)',
                          borderColor: material.showCareCompositionAdvancedFilter ? 'var(--primary)' : 'var(--border)',
                          color: material.showCareCompositionAdvancedFilter ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showCareCompositionAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showCareCompositionAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showCareCompositionAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', width: '100%' }}>
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
                              handleArtworkMaterialChange(actualIndex, 'careCompositionPrintType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionPrintTypeText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_PRINT_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_careCompositionPrintType`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.careCompositionPrintType === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionPrintTypeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionPrintTypeText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionPrintTypeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'careCompositionInkType', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionInkTypeText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_INK_TYPE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_careCompositionInkType`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.careCompositionInkType === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionInkTypeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionInkTypeText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionInkTypeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'careCompositionManufacturerId', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionManufacturerIdText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_MANUFACTURER_ID_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_careCompositionManufacturerId`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.careCompositionManufacturerId === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionManufacturerIdText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionManufacturerIdText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionManufacturerIdText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'careCompositionPermanence', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionPermanenceText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_PERMANENCE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_careCompositionPermanence`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.careCompositionPermanence === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionPermanenceText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionPermanenceText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionPermanenceText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'careCompositionLanguage', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'careCompositionLanguageText', '');
                              }
                            }}
                            options={CARE_COMPOSITION_LANGUAGE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_careCompositionLanguage`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.careCompositionLanguage === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.careCompositionLanguageText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'careCompositionLanguageText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_careCompositionLanguageText`] ? 'border-red-600' : 'border-border'}`}
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
                        onClick={() => handleArtworkMaterialChange(actualIndex, 'showFlammabilitySafetyAdvancedFilter', !material.showFlammabilitySafetyAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showFlammabilitySafetyAdvancedFilter ? 'var(--primary)' : 'var(--card)',
                          borderColor: material.showFlammabilitySafetyAdvancedFilter ? 'var(--primary)' : 'var(--border)',
                          color: material.showFlammabilitySafetyAdvancedFilter ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showFlammabilitySafetyAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showFlammabilitySafetyAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showFlammabilitySafetyAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', width: '100%' }}>
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
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyRegulation', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyRegulationText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_REGULATION_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyRegulation`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.flammabilitySafetyRegulation === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyRegulationText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyRegulationText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyRegulationText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyFontSize', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyFontSizeText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_FONT_SIZE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyFontSize`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.flammabilitySafetyFontSize === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyFontSizeText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyFontSizeText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyFontSizeText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyPermanence', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyPermanenceText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_PERMANENCE_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyPermanence`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.flammabilitySafetyPermanence === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyPermanenceText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyPermanenceText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyPermanenceText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetySymbol', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetySymbolText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_SYMBOL_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetySymbol`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.flammabilitySafetySymbol === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetySymbolText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetySymbolText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetySymbolText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyInkDurability', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyInkDurabilityText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_INK_DURABILITY_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyInkDurability`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.flammabilitySafetyInkDurability === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyInkDurabilityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyInkDurabilityText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyInkDurabilityText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyCertificationId', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyCertificationIdText', '');
                              }
                            }}
                            options={FLAMMABILITY_SAFETY_CERTIFICATION_ID_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyCertificationId`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.flammabilitySafetyCertificationId === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.flammabilitySafetyCertificationIdText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'flammabilitySafetyCertificationIdText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_flammabilitySafetyCertificationIdText`] ? 'border-red-600' : 'border-border'}`}
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
                        onClick={() => handleArtworkMaterialChange(actualIndex, 'showBellyBandAdvancedFilter', !material.showBellyBandAdvancedFilter)}
                        className="border-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          padding: '10px 20px',
                          height: '44px',
                          backgroundColor: material.showBellyBandAdvancedFilter ? 'var(--primary)' : 'var(--card)',
                          borderColor: material.showBellyBandAdvancedFilter ? 'var(--primary)' : 'var(--border)',
                          color: material.showBellyBandAdvancedFilter ? 'var(--primary-foreground)' : 'var(--foreground)'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showBellyBandAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--muted)';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showBellyBandAdvancedFilter) {
                            e.currentTarget.style.backgroundColor = 'var(--card)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }
                        }}
                      >
                        Advance Filter
                      </button>
                    </div>
                    
                    {/* Advanced Filter UI Table */}
                    {material.showBellyBandAdvancedFilter && (
                      <div style={{ padding: '24px', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', width: '100%' }}>
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandProductFit', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandProductFitText', '');
                              }
                            }}
                            options={BELLY_BAND_PRODUCT_FIT_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandProductFit`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandProductFit === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandProductFitText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandProductFitText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandProductFitText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandPrinting', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandPrintingText', '');
                              }
                            }}
                            options={BELLY_BAND_PRINTING_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandPrinting`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandPrinting === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandPrintingText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandPrintingText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandPrintingText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandFoldLines', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandFoldLinesText', '');
                              }
                            }}
                            options={BELLY_BAND_FOLD_LINES_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandFoldLines`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandFoldLines === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandFoldLinesText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandFoldLinesText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandFoldLinesText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandDurability', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandDurabilityText', '');
                              }
                            }}
                            options={BELLY_BAND_DURABILITY_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandDurability`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandDurability === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandDurabilityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandDurabilityText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandDurabilityText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandContent', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandContentText', '');
                              }
                            }}
                            options={BELLY_BAND_CONTENT_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandContent`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandContent === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandContentText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandContentText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandContentText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandColours', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandColoursText', '');
                              }
                            }}
                            options={BELLY_BAND_COLOURS_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandColours`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandColours === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandColoursText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandColoursText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandColoursText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandFinish', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandFinishText', '');
                              }
                            }}
                            options={BELLY_BAND_FINISH_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandFinish`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandFinish === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandFinishText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandFinishText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandFinishText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandDieCut', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandDieCutText', '');
                              }
                            }}
                            options={BELLY_BAND_DIE_CUT_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandDieCut`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandDieCut === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandDieCutText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandDieCutText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandDieCutText`] ? 'border-red-600' : 'border-border'}`}
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
                              handleArtworkMaterialChange(actualIndex, 'bellyBandGummingQuality', selectedValue);
                              if (selectedValue === 'OTHERS (TEXT)') {
                              handleArtworkMaterialChange(actualIndex, 'bellyBandGummingQualityText', '');
                              }
                            }}
                            options={BELLY_BAND_GUMMING_QUALITY_OPTIONS}
                            placeholder="Select or type"
                            className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_bellyBandGummingQuality`] ? 'border-red-600' : 'border-border'}`}
                          />
                            {material.bellyBandGummingQuality === 'OTHERS (TEXT)' && (
                              <input
                                type="text"
                                value={material.bellyBandGummingQualityText || ''}
                                onChange={(e) => handleArtworkMaterialChange(actualIndex, 'bellyBandGummingQualityText', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none mt-2 ${errors[`artworkMaterial_${actualIndex}_bellyBandGummingQualityText`] ? 'border-red-600' : 'border-border'}`}
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
                );
              })}
              <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => addArtworkMaterial(selectedComponent)}
                  className="border-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{ padding: '10px 20px', backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  + Add Artwork Material
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Step4;

