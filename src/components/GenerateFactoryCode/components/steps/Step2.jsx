import { useEffect, useRef } from 'react';
import { 
  getFiberTypes, 
  getYarnTypes, 
  getSpinningMethod, 
  getYarnDetails,
  getYarnCompositionOptions,
  getYarnCountRangeOptions,
  getYarnDoublingOptions,
  getYarnPlyOptions,
  getYarnSpinningMethodOptions,
  getYarnWindingOptions
} from '../../utils/yarnHelpers';
import TEXTILE_FIBER_DATA from '../../data/textileFiberData';
import { 
  getTextileFabricFiberTypes, 
  getTextileFabricNames, 
  getTextileFabricDetails,
  getAllCompositions,
  getAllConstructionTypes,
  getAllWeaveKnitTypes,
  getAllApprovalOptions,
  getFabricCompositionOptions,
  getFabricConstructionTypeOptions,
  getFabricWeaveKnitTypeOptions,
  getFabricApprovalOptions
} from '../../data/textileFabricHelpers';
import SearchableDropdown from '../SearchableDropdown';
import { 
  FIBER_CATEGORIES, 
  ORIGINS, 
  TESTING_REQUIREMENTS, 
  getAllSpinningMethods,
  FIBER_TYPE_TO_CATEGORY,
  FIBER_TYPE_TO_ORIGIN
} from '../../data/advancedFilterData';
import {
  BRAIDING_MACHINE_TYPES,
  BRAIDING_APPROVAL_OPTIONS,
  getBraidingVariants,
  getBraidingDesigns,
  getBraidingPatternType,
  getBraidingStrandCount,
  getBraidingWidthDiameter
} from '../../data/braidingData';
import {
  CARPET_MACHINE_TYPES,
  CARPET_APPROVAL_OPTIONS,
  KNOT_TYPE_OPTIONS,
  getCarpetVariants,
  getCarpetDesigns
} from '../../data/carpetData';
import {
  CUTTING_MACHINE_TYPES,
  CUTTING_APPROVAL_OPTIONS,
  NESTING_OPTIONS,
  getCuttingVariants,
  getCuttingCutTypes
} from '../../data/cuttingData';
import {
  DYEING_TYPES,
  DYEING_APPROVAL_OPTIONS,
  getDyeingColorRefOptions,
  getDyeingReferenceTypeOptions,
  isShrinkageWidthApplicable,
  isShrinkageLengthApplicable,
  getDyeingVariants,
  getAllDyeingTypes
} from '../../data/dyeingData';
import {
  EMBROIDERY_MACHINE_TYPES,
  EMBROIDERY_APPROVAL_OPTIONS,
  getEmbroideryVariants,
  getEmbroideryDesigns,
  getEmbroideryThreadColors,
  getEmbroideryStitchCount,
  getEmbroideryHoopFrameSize,
  getAllEmbroideryMachineTypes
} from '../../data/embroideryData';
import {
  KNITTING_MACHINE_TYPES,
  KNITTING_APPROVAL_OPTIONS,
  getKnittingVariants,
  getKnittingDesigns,
  getKnittingGaugeRange,
  getAllKnittingMachineTypes
} from '../../data/knittingData';
import {
  PRINTING_TYPES,
  PRINTING_APPROVAL_OPTIONS,
  getPrintingVariants,
  getPrintingDesigns,
  getPrintingRepeatSize,
  getPrintingNumberOfScreens,
  getPrintingColors,
  getPrintingCoveragePercent,
  getPrintingResolution,
  getAllPrintingTypes
} from '../../data/printingData';
import {
  QUILTING_TYPES,
  QUILTING_APPROVAL_OPTIONS,
  getQuiltingVariants,
  getQuiltingDesigns,
  getQuiltingStitchLength,
  getQuiltingPatternRepeat,
  getQuiltingNeedleSpacing,
  isQuiltingStitchLengthApplicable,
  isQuiltingNeedleSpacingApplicable,
  getAllQuiltingTypes
} from '../../data/quiltingData';
import {
  SEWING_MACHINE_TYPES,
  SEWING_THREAD_TYPE_OPTIONS,
  SEWING_APPROVAL_OPTIONS,
  getSewingStitchType,
  getSewingVariants,
  getSewingThreadType,
  getSewingNeedleSize,
  getAllSewingMachineTypes
} from '../../data/sewingData';
import {
  TUFTING_MACHINE_TYPES,
  TUFTING_APPROVAL_OPTIONS,
  getTuftingDesigns,
  getTuftingVariants,
  getTuftingMachineGauge,
  getTuftingStitchRate,
  getAllTuftingMachineTypes
} from '../../data/tuftingData';
import {
  WEAVING_MACHINE_TYPES,
  WEAVING_APPROVAL_OPTIONS,
  getWeavingVariants,
  getWeavingDesigns,
  getWeavingReedRange,
  getWeavingPickRange,
  getAllWeavingMachineTypes
} from '../../data/weavingData';

const Step2 = ({
  formData,
  errors,
  handleRawMaterialChange,
  handleWorkOrderChange,
  addWorkOrder,
  removeWorkOrder
}) => {
  const prevWorkOrdersLengthRef = useRef({});
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      formData.rawMaterials?.forEach((material, materialIndex) => {
        prevWorkOrdersLengthRef.current[materialIndex] = material.workOrders?.length || 0;
      });
      return;
    }

    formData.rawMaterials?.forEach((material, materialIndex) => {
      const currentWorkOrdersLength = material.workOrders?.length || 0;
      const prevLength = prevWorkOrdersLengthRef.current[materialIndex] || 0;
      
      if (currentWorkOrdersLength > prevLength) {
        setTimeout(() => {
          const lastWorkOrder = document.querySelector(`[data-material-index="${materialIndex}"][data-work-order-index]:last-child`);
          if (lastWorkOrder) {
            lastWorkOrder.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
      prevWorkOrdersLengthRef.current[materialIndex] = currentWorkOrdersLength;
    });
  }, [formData.rawMaterials]);

  return (
<div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-2 RAW MATERIAL SOURCING</h2>
        <p className="text-sm text-gray-600">Bill of material & work order</p>
      </div>
      
      {/* Raw Materials Table */}
      <div>
        {formData.rawMaterials.map((material, materialIndex) => (
          <div key={materialIndex} className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header */}
            <div className="mb-5">
              <div className="flex flex-wrap items-end gap-3" style={{ marginBottom: '24px' }}>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COMPONENT
                  </label>
                  <input
                    type="text"
                    value={material.componentName}
                    readOnly
                    className="border-2 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    style={{ padding: '10px 14px', width: '160px', height: '44px', borderColor: '#e5e7eb' }}
                  />
                </div>
              </div>
              
              {/* Material Details */}
              <div className="flex flex-wrap items-start gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    MATERIAL DESC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.materialDescription}
                    onChange={(e) => handleRawMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${materialIndex}_materialDescription`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${materialIndex}_materialDescription`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., Cotton 200TC"
                    required
                  />
                  {errors[`rawMaterial_${materialIndex}_materialDescription`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${materialIndex}_materialDescription`]}
                    </span>
                  )}
                </div>

                <div className='flex flex-col'>
                  <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL TYPE</label>
                  <SearchableDropdown
                    value={material.materialType || ''}
                    onChange={(selectedMaterialType) => handleRawMaterialChange(materialIndex, 'materialType', selectedMaterialType)}
                    options={['Fabric', 'Yarn']}
                    placeholder="select material"
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                  />
                  {errors[`rawMaterial_${materialIndex}_materialType`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${materialIndex}_materialType`]}
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
                    onChange={(e) => handleRawMaterialChange(materialIndex, 'netConsumption', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${materialIndex}_netConsumption`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${materialIndex}_netConsumption`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="0.000"
                    required
                  />
                  {errors[`rawMaterial_${materialIndex}_netConsumption`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${materialIndex}_netConsumption`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    UNIT <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={material.unit}
                    onChange={(e) => handleRawMaterialChange(materialIndex, 'unit', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${materialIndex}_unit`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '130px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${materialIndex}_unit`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    required
                  >
                    <option value="">Select</option>
                    <option value="R METERS">R METERS</option>
                    <option value="CM">CM</option>
                    <option value="Inches">Inches</option>
                    <option value="Meter">Meter</option>
                    <option value="KGS">KGS</option>
                  </select>
                  {errors[`rawMaterial_${materialIndex}_unit`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${materialIndex}_unit`]}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Fiber Type Hierarchy Dropdowns */}
              {material.materialType === "Yarn" && (<>
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <h3 className="text-sm font-bold text-gray-800 mb-4">FIBER SPECIFICATIONS</h3>
                <div className="flex flex-wrap items-start gap-6">
                  {/* Fiber Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      FIBER TYPE
                    </label>
                    <SearchableDropdown
                      value={material.fiberType || ''}
                      onChange={(selectedFiberType) => {
                        handleRawMaterialChange(materialIndex, 'fiberType', selectedFiberType);
                        // Reset yarn type when fiber type changes
                        if (selectedFiberType !== material.fiberType) {
                          handleRawMaterialChange(materialIndex, 'yarnType', '');
                          handleRawMaterialChange(materialIndex, 'spinningMethod', '');
                          handleRawMaterialChange(materialIndex, 'spinningType', '');
                        }
                      }}
                      options={getFiberTypes()}
                      placeholder="Select or type Fiber Type"
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                  
                  {/* Yarn Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      YARN TYPE
                    </label>
                    <SearchableDropdown
                      value={material.yarnType || ''}
                      onChange={(selectedYarnType) => {
                        handleRawMaterialChange(materialIndex, 'yarnType', selectedYarnType);
                        // Clear dependent fields when yarn type changes
                        if (selectedYarnType !== material.yarnType) {
                          handleRawMaterialChange(materialIndex, 'yarnComposition', '');
                          handleRawMaterialChange(materialIndex, 'yarnCountRange', '');
                          handleRawMaterialChange(materialIndex, 'yarnDoublingOptions', '');
                          handleRawMaterialChange(materialIndex, 'yarnPlyOptions', '');
                          handleRawMaterialChange(materialIndex, 'spinningMethod', '');
                          handleRawMaterialChange(materialIndex, 'spinningType', '');
                          handleRawMaterialChange(materialIndex, 'windingOptions', '');
                        }
                      }}
                      options={material.fiberType ? getYarnTypes(material.fiberType) : []}
                      placeholder={material.fiberType ? 'Select or type Yarn Type' : 'Select Fiber Type First'}
                      disabled={!material.fiberType}
                      onFocus={(e) => {
                        if (material.fiberType) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                </div>
                
                {/* Display Yarn Details when both Fiber Type and Yarn Type are selected */}
                {material.fiberType && material.yarnType && (() => {
                  const details = getYarnDetails(material.fiberType, material.yarnType);
                  if (!details) return null;
                  
                  return (
                    <div style={{ marginTop: '24px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <h4 className="text-sm font-semibold text-gray-800 mb-6">YARN SPECIFICATIONS</h4>
                      
                      {/* Input Fields Row */}
                      <div className="flex flex-wrap items-start gap-6">
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            COMPOSITION <span className="text-red-600">*</span>
                          </label>
                          <SearchableDropdown
                            value={material.yarnComposition || ''}
                            onChange={(value) => handleRawMaterialChange(materialIndex, 'yarnComposition', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnCompositionOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Composition" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                            onFocus={(e) => {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            COUNT RANGE <span className="text-red-600">*</span>
                          </label>
                          <SearchableDropdown
                            value={material.yarnCountRange || ''}
                            onChange={(value) => handleRawMaterialChange(materialIndex, 'yarnCountRange', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnCountRangeOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Count Range" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                            onFocus={(e) => {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            DOUBLING OPTIONS <span className="text-red-600">*</span>
                          </label>
                          <SearchableDropdown
                            value={material.yarnDoublingOptions || ''}
                            onChange={(value) => handleRawMaterialChange(materialIndex, 'yarnDoublingOptions', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnDoublingOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Doubling Options" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                            onFocus={(e) => {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            PLY OPTIONS <span className="text-red-600">*</span>
                          </label>
                          <SearchableDropdown
                            value={material.yarnPlyOptions || ''}
                            onChange={(value) => handleRawMaterialChange(materialIndex, 'yarnPlyOptions', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnPlyOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Ply Options" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                            onFocus={(e) => {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            COUNT SYSTEM
                          </label>
                          <input
                            type="text"
                            value={details.countSystem || ''}
                            readOnly
                            className="border-2 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                            style={{ padding: '10px 14px', height: '44px', borderColor: '#e5e7eb' }}
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WINDING OPTIONS
                          </label>
                          <SearchableDropdown
                            value={material.windingOptions || details.windingOptions || ''}
                            onChange={(value) => handleRawMaterialChange(materialIndex, 'windingOptions', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnWindingOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Winding Options" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                            onFocus={(e) => {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            SURPLUS
                          </label>
                          <input
                            type="text"
                            value={material.surplus || ''}
                            onChange={(e) => handleRawMaterialChange(materialIndex, 'surplus', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="%AGE"
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            APPROVAL
                          </label>
                          <SearchableDropdown
                            value={material.approval || ''}
                            onChange={(value) => handleRawMaterialChange(materialIndex, 'approval', value)}
                            options={['BUYER\'S', 'PROTO', 'FIT', 'SIZE SET', 'PP', 'TOP SAMPLE']}
                            placeholder="Select or type Approval"
                            onFocus={(e) => {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            REMARKS
                          </label>
                          <input
                            type="text"
                            value={material.remarks || ''}
                            onChange={(e) => handleRawMaterialChange(materialIndex, 'remarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter remarks"
                          />
                        </div>
                      </div>
                      
                      {/* Show/Hide Advance Filter Button */}
                      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <button
                          type="button"
                          onClick={() => handleRawMaterialChange(materialIndex, 'showAdvancedFilter', !material.showAdvancedFilter)}
                          className="border-2 rounded-lg text-sm font-medium transition-all"
                          style={{
                            padding: '10px 20px',
                            height: '44px',
                            backgroundColor: material.showAdvancedFilter ? '#667eea' : '#ffffff',
                            borderColor: material.showAdvancedFilter ? '#667eea' : '#e5e7eb',
                            color: material.showAdvancedFilter ? '#ffffff' : '#374151'
                          }}
                          onMouseEnter={(e) => {
                            if (!material.showAdvancedFilter) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                              e.currentTarget.style.borderColor = '#d1d5db';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!material.showAdvancedFilter) {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }
                          }}
                        >
                          Advance Filter
                        </button>
                      </div>
                      
                      {/* Advanced Filter UI Table */}
                      {material.showAdvancedFilter && (
                        <div style={{ marginTop: '24px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                          {/* <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE FILTERED~UI</h4> */}
                          
                          <div className="grid grid-cols-2 gap-6">
                            {/* Spinning Type - Searchable dropdown */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">
                                SPINNING TYPE
                              </label>
                              <SearchableDropdown
                                value={material.spinningType || material.spinningMethod || ''}
                                onChange={(value) => {
                                  handleRawMaterialChange(materialIndex, 'spinningType', value);
                                  handleRawMaterialChange(materialIndex, 'spinningMethod', value);
                                }}
                                options={material.fiberType && material.yarnType 
                                  ? getYarnSpinningMethodOptions(material.fiberType, material.yarnType)
                                  : []}
                                placeholder={material.fiberType && material.yarnType ? "Select or type Spinning Type" : "Select Yarn Type First"}
                                disabled={!material.fiberType || !material.yarnType}
                                onFocus={(e) => {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.boxShadow = '';
                                }}
                              />
                            </div>
                            
                            {/* Testing Requirements */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">
                                TESTING REQUIREMENTS
                              </label>
                              <input
                                type="text"
                                value={material.testingRequirements || ''}
                                onChange={(e) => handleRawMaterialChange(materialIndex, 'testingRequirements', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                                onFocus={(e) => {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.boxShadow = '';
                                }}
                                placeholder="Enter testing requirements"
                              />
                            </div>
                            
                            {/* Fiber Category - Searchable dropdown */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">
                                FIBER CATEGORY
                              </label>
                              <SearchableDropdown
                                value={material.fiberCategory || ''}
                                onChange={(value) => handleRawMaterialChange(materialIndex, 'fiberCategory', value)}
                                options={FIBER_CATEGORIES}
                                placeholder="Select or type Fiber Category"
                                onFocus={(e) => {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.boxShadow = '';
                                }}
                              />
                            </div>
                            
                            {/* Origin - Searchable dropdown */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">
                                ORIGIN
                              </label>
                              <SearchableDropdown
                                value={material.origin || ''}
                                onChange={(value) => handleRawMaterialChange(materialIndex, 'origin', value)}
                                options={ORIGINS}
                                placeholder="Select or type Origin"
                                onFocus={(e) => {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.boxShadow = '';
                                }}
                              />
                            </div>
                            
                            {/* Certifications (Text Input) */}
                            <div className="flex flex-col col-span-2">
                              <label className="text-sm font-semibold text-gray-700 mb-2">
                                CERTIFICATIONS
                              </label>
                              <input
                                type="text"
                                value={material.certifications || ''}
                                onChange={(e) => handleRawMaterialChange(materialIndex, 'certifications', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                                placeholder="Enter certificate label"
                                onFocus={(e) => {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.boxShadow = '';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              </>)}
            </div>
            
            {/* Fabric Specifications Section */}
            {material.materialType == "Fabric" && (<>
            <div style={{ marginTop: '32px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 className="text-sm font-bold text-gray-800">FABRIC SPECIFICATIONS</h3>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200" style={{ padding: '20px' }}>
                {/* Fiber Type and Fabric Name */}
                <div className="flex flex-wrap items-start gap-6" style={{ marginBottom: '20px' }}>
                  {/* Fiber Type */}
                  <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      FIBER TYPE <span className="text-red-600">*</span>
                    </label>
                    <SearchableDropdown
                      value={material.fabricFiberType || ''}
                      onChange={(selectedFiberType) => {
                        handleRawMaterialChange(materialIndex, 'fabricFiberType', selectedFiberType);
                        // Clear fabric name when fiber type changes
                        if (selectedFiberType !== material.fabricFiberType) {
                          handleRawMaterialChange(materialIndex, 'fabricName', '');
                        }
                      }}
                      options={getTextileFabricFiberTypes()}
                      placeholder="Select or type Fiber Type"
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                  
                  {/* Fabric Name */}
                  <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      FABRIC NAME <span className="text-red-600">*</span>
                    </label>
                    <SearchableDropdown
                      value={material.fabricName || ''}
                      onChange={(selectedFabricName) => {
                        handleRawMaterialChange(materialIndex, 'fabricName', selectedFabricName);
                        // Clear dependent fields when fabric name changes
                        if (selectedFabricName !== material.fabricName) {
                          handleRawMaterialChange(materialIndex, 'fabricComposition', '');
                          handleRawMaterialChange(materialIndex, 'constructionType', '');
                          handleRawMaterialChange(materialIndex, 'weaveKnitType', '');
                          handleRawMaterialChange(materialIndex, 'fabricApproval', '');
                        }
                      }}
                      options={material.fabricFiberType ? getTextileFabricNames(material.fabricFiberType) : []}
                      placeholder={material.fabricFiberType ? 'Select or type Fabric Name' : 'Select Fiber Type First'}
                      disabled={!material.fabricFiberType}
                      onFocus={(e) => {
                        if (material.fabricFiberType) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                  
                  {/* Composition */}
                  <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      COMPOSITION <span className="text-red-600">*</span>
                    </label>
                    <SearchableDropdown
                      value={material.fabricComposition || ''}
                      onChange={(value) => handleRawMaterialChange(materialIndex, 'fabricComposition', value)}
                      options={material.fabricFiberType && material.fabricName 
                        ? getFabricCompositionOptions(material.fabricFiberType, material.fabricName)
                        : []}
                      placeholder={material.fabricFiberType && material.fabricName ? "Select or type Composition" : "Select Fabric First"}
                      disabled={!material.fabricFiberType || !material.fabricName}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                  
                  {/* GSM */}
                  <div className="flex flex-col" style={{ flex: '1 1 200px', minWidth: '180px' }}>
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      GSM
                    </label>
                    <input
                      type="text"
                      value={material.gsm || ''}
                      onChange={(e) => handleRawMaterialChange(materialIndex, 'gsm', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', height: '44px' }}
                      placeholder="e.g., 90"
                    />
                  </div>
                  
                  {/* Surplus */}
                  <div className="flex flex-col" style={{ flex: '1 1 200px', minWidth: '180px' }}>
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      SURPLUS %AGE
                    </label>
                    <input
                      type="text"
                      value={material.fabricSurplus || ''}
                      onChange={(e) => handleRawMaterialChange(materialIndex, 'fabricSurplus', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', height: '44px' }}
                      placeholder="%AGE"
                    />
                  </div>
                  
                  {/* Approval */}
                  <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      APPROVAL
                    </label>
                    <SearchableDropdown
                      value={material.fabricApproval || ''}
                      onChange={(value) => handleRawMaterialChange(materialIndex, 'fabricApproval', value)}
                      options={material.fabricFiberType && material.fabricName 
                        ? getFabricApprovalOptions(material.fabricFiberType, material.fabricName)
                        : []}
                      placeholder={material.fabricFiberType && material.fabricName ? "Select or type Approval" : "Select Fabric First"}
                      disabled={!material.fabricFiberType || !material.fabricName}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                  
                  {/* Remarks */}
                  <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      REMARKS
                    </label>
                    <input
                      type="text"
                      value={material.fabricRemarks || ''}
                      onChange={(e) => handleRawMaterialChange(materialIndex, 'fabricRemarks', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', height: '44px' }}
                      placeholder="Text"
                    />
                  </div>
                </div>
                
                {/* Show/Hide Advance Filter Button */}
                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => handleRawMaterialChange(materialIndex, 'showFabricAdvancedFilter', !material.showFabricAdvancedFilter)}
                    className="border-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      padding: '10px 20px',
                      height: '44px',
                      backgroundColor: material.showFabricAdvancedFilter ? '#667eea' : '#ffffff',
                      borderColor: material.showFabricAdvancedFilter ? '#667eea' : '#e5e7eb',
                      color: material.showFabricAdvancedFilter ? '#ffffff' : '#374151'
                    }}
                    onMouseEnter={(e) => {
                      if (!material.showFabricAdvancedFilter) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!material.showFabricAdvancedFilter) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    Advance Filter
                  </button>
                </div>
                
                {/* Advanced Filter UI Table */}
                {material.showFabricAdvancedFilter && (
                  <div style={{ marginTop: '24px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    {/* <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE FILTERED~UI</h4> */}
                    
                    <div className="grid grid-cols-2 gap-6">
                      {/* Construction Type - Searchable dropdown */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          CONSTRUCTION TYPE
                        </label>
                        <SearchableDropdown
                          value={material.constructionType || ''}
                          onChange={(value) => handleRawMaterialChange(materialIndex, 'constructionType', value)}
                          options={material.fabricFiberType && material.fabricName 
                            ? getFabricConstructionTypeOptions(material.fabricFiberType, material.fabricName)
                            : []}
                          placeholder={material.fabricFiberType && material.fabricName ? "Select or type Construction Type" : "Select Fabric First"}
                          disabled={!material.fabricFiberType || !material.fabricName}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                        />
                      </div>
                      
                      {/* Weave/Knit Type - Searchable dropdown */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          WEAVE/KNIT TYPE
                        </label>
                        <SearchableDropdown
                          value={material.weaveKnitType || ''}
                          onChange={(value) => handleRawMaterialChange(materialIndex, 'weaveKnitType', value)}
                          options={material.fabricFiberType && material.fabricName 
                            ? getFabricWeaveKnitTypeOptions(material.fabricFiberType, material.fabricName)
                            : []}
                          placeholder={material.fabricFiberType && material.fabricName ? "Select or type Weave/Knit Type" : "Select Fabric First"}
                          disabled={!material.fabricFiberType || !material.fabricName}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                        />
                      </div>
                      
                      {/* Machine Type */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          MACHINE TYPE
                        </label>
                        <SearchableDropdown
                          value={material.fabricMachineType || ''}
                          onChange={(value) => handleRawMaterialChange(materialIndex, 'fabricMachineType', value)}
                          options={['Powerloom', 'Handloom', 'Circular Knitting', 'Flatbed Knitting', 'Warp Knitting', 'Others']}
                          placeholder="Select or type Machine Type"
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                        />
                      </div>
                      
                      {/* Testing Requirements */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          TESTING REQUIREMENTS
                        </label>
                        <input
                          type="text"
                          value={material.fabricTestingRequirements || ''}
                          onChange={(e) => handleRawMaterialChange(materialIndex, 'fabricTestingRequirements', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                          placeholder="Enter testing requirements"
                        />
                      </div>
                      
                      {/* Fiber Category - Searchable dropdown */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          FIBER CATEGORY
                        </label>
                        <SearchableDropdown
                          value={material.fabricFiberCategory || ''}
                          onChange={(value) => handleRawMaterialChange(materialIndex, 'fabricFiberCategory', value)}
                          options={FIBER_CATEGORIES}
                          placeholder="Select or type Fiber Category"
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                        />
                      </div>
                      
                      {/* Origin - Searchable dropdown */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          ORIGIN
                        </label>
                        <SearchableDropdown
                          value={material.fabricOrigin || ''}
                          onChange={(value) => handleRawMaterialChange(materialIndex, 'fabricOrigin', value)}
                          options={ORIGINS}
                          placeholder="Select or type Origin"
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                        />
                      </div>
                      
                      {/* Certifications (Text Input) */}
                      <div className="flex flex-col col-span-2">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          CERTIFICATIONS
                        </label>
                        <input
                          type="text"
                          value={material.fabricCertifications || ''}
                          onChange={(e) => handleRawMaterialChange(materialIndex, 'fabricCertifications', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Enter certificate label"
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </>)}
            
            {/* Work Orders Section */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 className="text-sm font-bold text-gray-800">WORK ORDERS</h3>
              </div>
              
              {material.workOrders && material.workOrders.map((workOrder, woIndex) => (
                <div key={woIndex} id={`workorder-${materialIndex}-${woIndex}`} data-work-order-index={woIndex} data-material-index={materialIndex} className="bg-white rounded-lg border border-gray-200" style={{ padding: '16px', marginBottom: '12px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                    <h4 className="text-sm font-semibold text-gray-700">
                      WORK ORDER {woIndex + 1}
                    </h4>
                    {material.workOrders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkOrder(materialIndex, woIndex)}
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
                  
                  {/* Work Order Fields */}
                  <div className="flex flex-wrap items-start gap-6">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        WORK ORDER <span className="text-red-600">*</span>
                      </label>
                      <SearchableDropdown
                        value={workOrder.workOrder || ''}
                        onChange={(selectedValue) => {
                          handleWorkOrderChange(materialIndex, woIndex, 'workOrder', selectedValue);
                        }}
                        options={['WEAVING', 'TUFTING', 'QUILTING', 'PRINTING', 'KNITTING', 'EMBROIDERY', 'DYEING', 'BRAIDING', 'CARPET', 'CUTTING', 'SEWING']}
                        placeholder="Select Work Order"
                        strictMode={true}
                        className={errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`] 
                          ? 'border-red-600' 
                          : ''}
                        style={{ width: '160px' }}
                        onFocus={(e) => {
                          if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                      />
                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`]}
                        </span>
                      )}
                    </div>
                    
                    {/* WASTAGE field - Hidden for KNITTING, PRINTING, QUILTING, SEWING, TUFTING, and WEAVING as they have their own sections */}
                    {workOrder.workOrder && workOrder.workOrder !== 'KNITTING' && workOrder.workOrder !== 'PRINTING' && workOrder.workOrder !== 'QUILTING' && workOrder.workOrder !== 'SEWING' && workOrder.workOrder !== 'TUFTING' && workOrder.workOrder !== 'WEAVING' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WASTAGE % <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={workOrder.wastage || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., 2"
                            required
                          />
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                            </span>
                          )}
                        </div>
                        
                      </>
                    )}
                  </div>
                  
                  {/* Conditional Fields based on Work Order Type */}
                  {workOrder.workOrder && (
                    <div className="w-full flex flex-wrap items-start mt-14 pt-6 border-t border-gray-50" style={{ gap: '24px 32px', marginTop: '20px' }}>
                      {/* TYPE field for CUTTING - Before MACHINE TYPE */}
                      {workOrder.workOrder === 'CUTTING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <SearchableDropdown
                            value={workOrder.cuttingType || ''}
                            onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'cuttingType', selectedValue)}
                            options={['SCISSOR', 'STRAIGHT KNIFE', 'ROUND KNIFE', 'BAND KNIFE', 'DIE CUTTER', 'CNC CUTTER', 'LASER', 'WATERJET', 'ULTRASONIC', 'ROTARY HAND', 'OTHERS']}
                            placeholder="Select or type Type"
                            style={{ width: '160px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                        </div>
                      )}

                      {/* Machine Type / Specific Type Dropdown */}
                      {(['WEAVING', 'TUFTING', 'KNITTING', 'EMBROIDERY', 'BRAIDING', 'CARPET', 'CUTTING'].includes(workOrder.workOrder)) && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MACHINE TYPE</label>
                          <SearchableDropdown
                            value={workOrder.machineType || ''}
                            onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'machineType', selectedValue)}
                            options={
                              workOrder.workOrder === 'WEAVING' ? getAllWeavingMachineTypes() :
                              workOrder.workOrder === 'TUFTING' ? getAllTuftingMachineTypes() :
                              workOrder.workOrder === 'KNITTING' ? getAllKnittingMachineTypes() :
                              workOrder.workOrder === 'EMBROIDERY' ? getAllEmbroideryMachineTypes() :
                              workOrder.workOrder === 'BRAIDING' ? ['HAND BRAID', 'MACHINE BRAID', 'ROPE MACHINE', 'OTHERS'] :
                              workOrder.workOrder === 'CARPET' ? ['HAND KNOTTED', 'HAND TUFTED', 'FLATWEAVE', 'WILTON', 'AXMINSTER', 'MACHINE MADE- WAN DE VEILE', 'BROADLOOM', 'WALL 2 WALL', 'NEEDLE PUNCH', 'OTHERS'] :
                              workOrder.workOrder === 'CUTTING' ? ['SCISSOR', 'STRAIGHT KNIFE', 'ROUND KNIFE', 'BAND KNIFE', 'DIE CUTTER', 'CNC CUTTER', 'LASER', 'WATERJET', 'ULTRASONIC', 'ROTARY HAND', 'OTHERS'] :
                              []
                            }
                            placeholder="Select or type Machine Type"
                            style={{ width: '160px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                        </div>
                      )}

                      {/* Braiding Specific Fields */}
                      {workOrder.workOrder === 'BRAIDING' && (
                        <>
                          {/* STRAND COUNT */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              STRAND COUNT
                              {workOrder.machineType && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getBraidingStrandCount(workOrder.machineType)})
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={workOrder.strandCount || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'strandCount', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter strand count"
                            />
                        </div>

                          {/* WIDTH / DIAMETER */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              {workOrder.machineType ? getBraidingWidthDiameter(workOrder.machineType) : 'WIDTH / DIAMETER'}
                            </label>
                            <input
                              type="text"
                              value={workOrder.widthDiameter || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'widthDiameter', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter width/diameter"
                            />
                        </div>

                          {/* GSM */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">GSM</label>
                            <input
                              type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'gsm', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter GSM"
                            />
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={BRAIDING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                        </div>

                          {/* DESIGN REF (Upload) */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REF</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`braiding-file-${materialIndex}-${woIndex}`}
                              />
                              <label
                                htmlFor={`braiding-file-${materialIndex}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                              </label>
                            </div>
                          </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                          <input
                            type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter remarks"
                          />
                        </div>
                        </>
                      )}

                      {/* Advanced Filter for BRAIDING - Button right after REMARKS */}
                      {workOrder.workOrder === 'BRAIDING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showBraidingAdvancedFilter', !workOrder.showBraidingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showBraidingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showBraidingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showBraidingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showBraidingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showBraidingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showBraidingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* VARIANTS - Dropdown */}
                        <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                          <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.machineType ? getBraidingVariants(workOrder.machineType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                                </div>
                                
                                {/* DESIGN - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    DESIGN
                                  </label>
                                  <select
                                    value={workOrder.braidingDesign || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'braidingDesign', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Design</option>
                                    {workOrder.machineType ? getBraidingDesigns(workOrder.machineType).map(design => (
                                      <option key={design} value={design}>{design}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                                </div>
                                
                                {/* PATTERN - Text Input */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    PATTERN
                                    {workOrder.machineType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getBraidingPatternType(workOrder.machineType)})
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="text"
                                    value={workOrder.pattern || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pattern', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.machineType ? `Enter ${getBraidingPatternType(workOrder.machineType).toLowerCase()}` : 'Enter pattern'}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Other specific type dropdowns */}
                      {/* Quilting Specific Fields */}
                      {workOrder.workOrder === 'QUILTING' && (
                        <>
                          {/* QUILTING TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">QUILTING TYPE</label>
                          <SearchableDropdown
                            value={workOrder.quiltingType || ''}
                            onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'quiltingType', selectedValue)}
                            options={getAllQuiltingTypes()}
                            placeholder="Select or type Quilting Type"
                            style={{ width: '200px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                        </div>

                          {/* DESIGN REF (Upload) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REF</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`quilting-file-${materialIndex}-${woIndex}`}
                              />
                              <label
                                htmlFor={`quilting-file-${materialIndex}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                              </label>
                            </div>
                          </div>

                          {/* STITCH LENGTH (mm) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              STITCH LENGTH (mm)
                              {workOrder.quiltingType && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getQuiltingStitchLength(workOrder.quiltingType)})
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={workOrder.stitchLength || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'stitchLength', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder={workOrder.quiltingType ? getQuiltingStitchLength(workOrder.quiltingType) : 'Enter stitch length (mm)'}
                            />
                          </div>

                          {/* PATTERN REPEAT */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PATTERN REPEAT
                              {workOrder.quiltingType && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getQuiltingPatternRepeat(workOrder.quiltingType)})
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={workOrder.patternRepeat || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'patternRepeat', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder={workOrder.quiltingType ? getQuiltingPatternRepeat(workOrder.quiltingType) : 'Enter pattern repeat'}
                            />
                          </div>

                          {/* WASTAGE % */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                            <input
                              type="text"
                              value={workOrder.wastage || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                              }}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="%AGE"
                            />
                            {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                              </span>
                            )}
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={QUILTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                            <input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Text"
                            />
                          </div>
                        </>
                      )}

                      {/* Printing Specific Fields */}
                      {workOrder.workOrder === 'PRINTING' && (
                        <>
                          {/* PRINTING TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING TYPE</label>
                          <SearchableDropdown
                            value={workOrder.printingType || ''}
                            onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'printingType', selectedValue)}
                            options={getAllPrintingTypes()}
                            placeholder="Select or type Printing Type"
                            style={{ width: '200px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                        </div>

                          {/* DESIGN REF (Upload) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REF</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`printing-file-${materialIndex}-${woIndex}`}
                              />
                              <label
                                htmlFor={`printing-file-${materialIndex}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                              </label>
                            </div>
                          </div>

                          {/* REPEAT SIZE */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              REPEAT SIZE
                              {workOrder.printingType && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getPrintingRepeatSize(workOrder.printingType)})
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={workOrder.repeatSize || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'repeatSize', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder={workOrder.printingType ? getPrintingRepeatSize(workOrder.printingType) : 'Enter repeat size'}
                            />
                          </div>

                          {/* WASTAGE % */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                            <input
                              type="text"
                              value={workOrder.wastage || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                              }}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="%AGE"
                            />
                            {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                              </span>
                            )}
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={PRINTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                        </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                            <input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Text"
                            />
                          </div>
                        </>
                      )}

                      {/* Sewing Specific Fields */}
                      {workOrder.workOrder === 'SEWING' && (
                        <>
                          {/* SPI */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">SPI</label>
                          <input
                            type="text"
                              value={workOrder.spi || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'spi', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Numeric"
                          />
                        </div>

                          {/* THREAD TYPE */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              THREAD TYPE
                              {workOrder.sewingMachineType && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getSewingThreadType(workOrder.sewingMachineType)})
                                </span>
                              )}
                            </label>
                            <SearchableDropdown
                              value={workOrder.threadType || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'threadType', selectedValue)}
                              options={SEWING_THREAD_TYPE_OPTIONS}
                              placeholder="Select or type Thread Type"
                              style={{ width: '220px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* WASTAGE % */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                            <input
                              type="text"
                              value={workOrder.wastage || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                                
                              }}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="%AGE"
                            />
                            {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                              </span>
                            )}
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={SEWING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                        </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                            <input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Text"
                            />
                          </div>
                        </>
                      )}


                      
                      {/* Dyeing Specific Fields */}
                      {workOrder.workOrder === 'DYEING' && (
                        <>
                          {/* DYEING TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DYEING TYPE</label>
                          <SearchableDropdown
                            value={workOrder.dyeingType || ''}
                            onChange={(selectedValue) => {
                              const selectedType = selectedValue;
                              handleWorkOrderChange(materialIndex, woIndex, 'dyeingType', selectedType);
                              // Clear COLOR REF and REFERENCE TYPE when dyeing type changes
                              if (!selectedType) {
                                handleWorkOrderChange(materialIndex, woIndex, 'colorRef', '');
                                handleWorkOrderChange(materialIndex, woIndex, 'referenceType', '');
                              } else {
                                handleWorkOrderChange(materialIndex, woIndex, 'colorRef', '');
                                handleWorkOrderChange(materialIndex, woIndex, 'referenceType', '');
                              }
                            }}
                            options={getAllDyeingTypes()}
                            placeholder="Select or type Dyeing Type"
                            style={{ width: '200px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                        </div>

                          {/* COLOR REF */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">COLOR REF</label>
                            <select
                              value={workOrder.colorRef || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'colorRef', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              disabled={!workOrder.dyeingType}
                            >
                              <option value="">Select Color Ref</option>
                              {workOrder.dyeingType ? getDyeingColorRefOptions(workOrder.dyeingType).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              )) : <option value="">Select Dyeing Type First</option>}
                            </select>
                          </div>

                          {/* REFERENCE TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REFERENCE TYPE</label>
                          <select
                            value={workOrder.referenceType || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'referenceType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '300px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              disabled={!workOrder.dyeingType}
                            >
                              <option value="">Select Reference Type</option>
                              {workOrder.dyeingType ? getDyeingReferenceTypeOptions(workOrder.dyeingType).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              )) : <option value="">Select Dyeing Type First</option>}
                            </select>
                          </div>

                          {/* REFERENCE IMAGE (Upload) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REFERENCE IMAGE</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`dyeing-file-${materialIndex}-${woIndex}`}
                              />
                              <label
                                htmlFor={`dyeing-file-${materialIndex}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                              </label>
                            </div>
                          </div>

                          {/* SHRINKAGE WIDTH % */}
                          {isShrinkageWidthApplicable(workOrder.dyeingType) && (
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">SHRINKAGE WIDTH %</label>
                              <input
                                type="text"
                                value={workOrder.shrinkageWidthPercent || ''}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageWidthPercent', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                                placeholder="Enter %"
                              />
                        </div>
                      )}

                          {/* SHRINKAGE LENGTH % */}
                          {isShrinkageLengthApplicable(workOrder.dyeingType) && (
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">SHRINKAGE LENGTH %</label>
                          <input
                            type="text"
                                value={workOrder.shrinkageLengthPercent || ''}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageLengthPercent', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                                placeholder="Enter %"
                          />
                        </div>
                      )}

                          {/* APPROVAL */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={DYEING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          />
                        </div>
                      
                          {/* REMARKS */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                            <input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter remarks"
                            />
                        </div>
                        </>
                      )}
                      
                      {/* Image Upload - Hidden for CUTTING, BRAIDING, CARPET, DYEING, EMBROIDERY, KNITTING, PRINTING, QUILTING, SEWING, TUFTING, and WEAVING (they have REFERENCE IMAGE/DESIGN REF in their own sections or don't need it) */}
                      {workOrder.workOrder !== 'CUTTING' && workOrder.workOrder !== 'BRAIDING' && workOrder.workOrder !== 'CARPET' && workOrder.workOrder !== 'DYEING' && workOrder.workOrder !== 'EMBROIDERY' && workOrder.workOrder !== 'KNITTING' && workOrder.workOrder !== 'PRINTING' && workOrder.workOrder !== 'QUILTING' && workOrder.workOrder !== 'SEWING' && workOrder.workOrder !== 'TUFTING' && workOrder.workOrder !== 'WEAVING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            {workOrder.workOrder === 'DYEING' ? 'REFERENCE IMAGE' : workOrder.workOrder === 'BRAIDING' ? 'DESIGN REF' : 'IMAGE REF'}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`file-${materialIndex}-${woIndex}`}
                            />
                            <label
                              htmlFor={`file-${materialIndex}-${woIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {/* Weaving Specific Fields */}
                      {workOrder.workOrder === 'WEAVING' && (
                        <>
                          {/* DESIGN REF (Upload) */}
                              <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REF</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`weaving-file-${materialIndex}-${woIndex}`}
                              />
                              <label
                                htmlFor={`weaving-file-${materialIndex}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                              </label>
                            </div>
                          </div>

                          {/* REED */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              REED
                              {workOrder.machineType && getWeavingReedRange(workOrder.machineType) && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getWeavingReedRange(workOrder.machineType)})
                                </span>
                              )}
                            </label>
                                <input
                                  type="text"
                                  value={workOrder.reed || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'reed', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder={workOrder.machineType && getWeavingReedRange(workOrder.machineType) ? getWeavingReedRange(workOrder.machineType) : 'Numeric'}
                                />
                              </div>

                          {/* PICK */}
                              <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              PICK
                              {workOrder.machineType && getWeavingPickRange(workOrder.machineType) && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getWeavingPickRange(workOrder.machineType)})
                                </span>
                              )}
                            </label>
                                <input
                                  type="text"
                                  value={workOrder.pick || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pick', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder={workOrder.machineType && getWeavingPickRange(workOrder.machineType) ? getWeavingPickRange(workOrder.machineType) : 'Numeric'}
                                />
                            </div>
                            
                          {/* WARP Ratio */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WARP Ratio</label>
                                    <input
                                      type="number"
                                      step="0.001"
                              min="0"
                              max="1"
                                      value={workOrder.ratioWarp || ''}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const clampedVal = val > 1 ? 1 : val < 0 ? 0 : val;
                                handleWorkOrderChange(materialIndex, woIndex, 'ratioWarp', clampedVal);
                                // Auto-calculate WEFT if both are being used (ratios should sum to 1)
                                if (workOrder.ratioWeft !== '' && clampedVal <= 1) {
                                  const weftVal = Math.max(0, Math.min(1, 1 - clampedVal)).toFixed(3);
                                  handleWorkOrderChange(materialIndex, woIndex, 'ratioWeft', weftVal);
                                }
                              }}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="0-1"
                                    />
                                </div>

                          {/* WEFT Ratio */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WEFT Ratio</label>
                                    <input
                                      type="number"
                                      step="0.001"
                              min="0"
                              max="1"
                                      value={workOrder.ratioWeft || ''}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const clampedVal = val > 1 ? 1 : val < 0 ? 0 : val;
                                handleWorkOrderChange(materialIndex, woIndex, 'ratioWeft', clampedVal);
                                // Auto-calculate WARP if both are being used (ratios should sum to 1)
                                if (workOrder.ratioWarp !== '' && clampedVal <= 1) {
                                  const warpVal = Math.max(0, Math.min(1, 1 - clampedVal)).toFixed(3);
                                  handleWorkOrderChange(materialIndex, woIndex, 'ratioWarp', warpVal);
                                }
                              }}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="0-1"
                                    />
                                </div>

                          {/* GSM */}
                                <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">GSM</label>
                                  <input
                                    type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'gsm', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter GSM"
                                  />
                                </div>

                          {/* WASTAGE % */}
                                <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                                  <input
                                    type="text"
                                    value={workOrder.wastage || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                      errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                        ? 'border-red-600' 
                                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                                    }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                    onFocus={(e) => {
                                      if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                      }
                                    }}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="%AGE"
                                  />
                                  {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                                    <span className="text-red-600 text-xs mt-1 font-medium">
                                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                                    </span>
                                  )}
                                </div>

                          {/* APPROVAL */}
                                <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={WEAVING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                                  <input
                                    type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Text"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Specific Fields for DYEING Shrinkage */}
                      {/* Tufting Specific Fields */}
                      {workOrder.workOrder === 'TUFTING' && (
                        <>
                          {/* DESIGN REF (Upload) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REF</label>
                            <div className="flex items-center gap-2">
                                <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`tufting-file-${materialIndex}-${woIndex}`}
                              />
                              <label
                                htmlFor={`tufting-file-${materialIndex}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                              </label>
                            </div>
                          </div>

                          {/* GSM */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">GSM</label>
                                <input
                              type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'gsm', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter GSM"
                                />
                            </div>

                          {/* PILE HEIGHT (mm) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">PILE HEIGHT (mm)</label>
                                <input
                              type="text"
                              value={workOrder.pileHeight || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pileHeight', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter pile height (mm)"
                                />
                            </div>

                          {/* TPI (TUFT PER INCH) */}
                            <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">TPI (TUFT PER INCH)</label>
                              <input
                                type="text"
                              value={workOrder.tpi || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'tpi', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter TPI"
                              />
                            </div>

                          {/* WASTAGE % */}
                            <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                              <input
                                type="text"
                                value={workOrder.wastage || ''}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                  errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                    ? 'border-red-600' 
                                    : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                                }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                onFocus={(e) => {
                                  if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                  }
                                }}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                                placeholder="%AGE"
                              />
                              {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                                <span className="text-red-600 text-xs mt-1 font-medium">
                                  {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                                </span>
                              )}
                            </div>

                          {/* APPROVAL */}
                            <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={TUFTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                              <input
                                type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Text"
                              />
                            </div>
                        </>
                      )}

                      {/* Carpet Specific Fields */}
                      {workOrder.workOrder === 'CARPET' && (
                        <>
                          {/* GSM */}
                              <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">GSM</label>
                                  <input
                                type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'gsm', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter GSM"
                              />
                            </div>

                          {/* PILE HEIGHT (mm) */}
                            <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">PILE HEIGHT (mm)</label>
                                  <input
                                    type="text"
                              value={workOrder.pileHeight || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pileHeight', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter pile height"
                                  />
                              </div>
                            
                          {/* TPI / KPSI */}
                              <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">TPI / KPSI</label>
                                  <input
                                    type="text"
                              value={workOrder.tpiKpsi || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'tpiKpsi', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter TPI/KPSI"
                                  />
                              </div>

                          {/* KNOT TYPE */}
                                <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">KNOT TYPE</label>
                            <select
                              value={workOrder.knotType || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'knotType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            >
                              <option value="">Select Knot Type</option>
                              {KNOT_TYPE_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            </div>
                            
                          {/* PITCH/ROWS */}
                                <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">PITCH/ROWS</label>
                                  <input
                                type="text"
                              value={workOrder.pitchRows || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pitchRows', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter pitch/rows"
                                  />
                                </div>

                          {/* APPROVAL */}
                                <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={CARPET_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* DESIGN REF (Upload) */}
                            <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REF</label>
                            <div className="flex items-center gap-2">
                                  <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`carpet-file-${materialIndex}-${woIndex}`}
                              />
                              <label
                                htmlFor={`carpet-file-${materialIndex}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>
                            
                          {/* REMARKS */}
                              <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                                  <input
                                    type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter remarks"
                                  />
                                </div>
                        </>
                      )}

                      {/* Advanced Filter for CARPET - Button right after REMARKS */}
                      {workOrder.workOrder === 'CARPET' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showCarpetAdvancedFilter', !workOrder.showCarpetAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showCarpetAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showCarpetAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showCarpetAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showCarpetAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showCarpetAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                              </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showCarpetAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* VARIANTS - Dropdown */}
                      <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                        <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                onFocus={(e) => {
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.machineType ? getCarpetVariants(workOrder.machineType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                            </div>
                            
                                {/* DESIGN - Dropdown */}
                              <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    DESIGN
                                  </label>
                                  <select
                                    value={workOrder.carpetDesign || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'carpetDesign', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                  onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Design</option>
                                    {workOrder.machineType ? getCarpetDesigns(workOrder.machineType).map(design => (
                                      <option key={design} value={design}>{design}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                              </div>
                            </div>
                          </div>
                          )}
                        </div>
                      )}
                      
                      {/* Cutting Specific Fields */}
                      {workOrder.workOrder === 'CUTTING' && (
                        <>
                          {/* VARIANTS - Dropdown */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">VARIANTS</label>
                            <select
                              value={workOrder.variants || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                        >
                              <option value="">Select Variant</option>
                              {workOrder.machineType ? getCuttingVariants(workOrder.machineType).map(variant => (
                                <option key={variant} value={variant}>{variant}</option>
                              )) : <option value="">Select Machine Type First</option>}
                        </select>
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={CUTTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                            <input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter remarks"
                            />
                          </div>
                        </>
                      )}

                      {/* Advanced Filter for CUTTING - Button right after REMARKS */}
                      {workOrder.workOrder === 'CUTTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showCuttingAdvancedFilter', !workOrder.showCuttingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showCuttingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showCuttingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showCuttingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showCuttingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showCuttingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                            </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showCuttingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* CUT TYPE - Dropdown */}
                          <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    CUT TYPE
                                  </label>
                            <select
                              value={workOrder.cutType || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'cutType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Cut Type</option>
                                    {workOrder.machineType ? getCuttingCutTypes(workOrder.machineType).map(cutType => (
                                      <option key={cutType} value={cutType}>{cutType}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                            </div>
                            
                                {/* LAYERS - Text Input */}
                              <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    LAYERS
                                  </label>
                              <input
                                type="text"
                                    value={workOrder.layers || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'layers', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder="Enter layers"
                                  />
                              </div>
                                
                                {/* NESTING - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    NESTING
                                  </label>
                                  <select
                                    value={workOrder.nesting || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'nesting', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Nesting</option>
                                    {NESTING_OPTIONS.map(opt => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                            </div>
                          </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Embroidery Specific Fields */}
                      {workOrder.workOrder === 'EMBROIDERY' && (
                        <>
                          {/* DESIGN REF (Upload) */}
                              <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REF</label>
                            <div className="flex items-center gap-2">
                                  <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`embroidery-file-${materialIndex}-${woIndex}`}
                              />
                              <label
                                htmlFor={`embroidery-file-${materialIndex}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                                </label>
                            </div>
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(materialIndex, woIndex, 'approval', selectedValue)}
                              options={EMBROIDERY_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                              style={{ width: '200px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                            <input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter remarks"
                            />
                          </div>
                        </>
                      )}

                      {/* Advanced Filter for EMBROIDERY - At the very bottom after all fields */}
                      {workOrder.workOrder === 'EMBROIDERY' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showEmbroideryAdvancedFilter', !workOrder.showEmbroideryAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showEmbroideryAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showEmbroideryAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showEmbroideryAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showEmbroideryAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showEmbroideryAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                              </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showEmbroideryAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* VARIANTS - Dropdown */}
                      <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                        <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.machineType ? getEmbroideryVariants(workOrder.machineType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                        </select>
                      </div>

                                {/* DESIGN - Dropdown */}
                          <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    DESIGN
                                  </label>
                                  <select
                                    value={workOrder.embroideryDesign || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'embroideryDesign', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Design</option>
                                    {workOrder.machineType ? getEmbroideryDesigns(workOrder.machineType).map(design => (
                                      <option key={design} value={design}>{design}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                                </div>
                                
                                {/* THREAD COLORS */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    THREAD COLORS
                                    {workOrder.machineType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getEmbroideryThreadColors(workOrder.machineType)})
                                      </span>
                                    )}
                                  </label>
                                  <input
                              type="text"
                                    value={workOrder.threadColors || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'threadColors', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.machineType ? `Enter ${getEmbroideryThreadColors(workOrder.machineType)}` : 'Enter thread colors'}
                            />
                          </div>
                                
                                {/* STITCH COUNT */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    STITCH COUNT
                                    {workOrder.machineType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getEmbroideryStitchCount(workOrder.machineType)})
                                      </span>
                                    )}
                                </label>
                                  <input
                                    type="text"
                                    value={workOrder.stitchCount || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'stitchCount', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.machineType ? `Enter ${getEmbroideryStitchCount(workOrder.machineType)}` : 'Enter stitch count'}
                                  />
                            </div>
                            
                                {/* HOOP/FRAME SIZE */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    HOOP/FRAME SIZE
                                    {workOrder.machineType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getEmbroideryHoopFrameSize(workOrder.machineType)})
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="text"
                                    value={workOrder.hoopFrameSize || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'hoopFrameSize', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.machineType ? `Enter ${getEmbroideryHoopFrameSize(workOrder.machineType)}` : 'Enter hoop/frame size'}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for PRINTING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'PRINTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showPrintingAdvancedFilter', !workOrder.showPrintingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showPrintingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showPrintingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showPrintingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showPrintingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showPrintingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showPrintingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* VARIANTS - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                        <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.printingType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.printingType ? getPrintingVariants(workOrder.printingType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Printing Type First</option>}
                        </select>
                      </div>

                                {/* DESIGN - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    DESIGN
                                  </label>
                                  <select
                                    value={workOrder.printingDesign || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'printingDesign', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.printingType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Design</option>
                                    {workOrder.printingType ? getPrintingDesigns(workOrder.printingType).map(design => (
                                      <option key={design} value={design}>{design}</option>
                                    )) : <option value="">Select Printing Type First</option>}
                                  </select>
                                </div>
                                
                                {/* # OF SCREENS */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    # OF SCREENS
                                    {workOrder.printingType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getPrintingNumberOfScreens(workOrder.printingType)})
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="text"
                                    value={workOrder.numberOfScreens || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'numberOfScreens', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.printingType ? getPrintingNumberOfScreens(workOrder.printingType) : 'Enter # of screens'}
                                  />
                                </div>
                                
                                {/* COLORS */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    COLORS
                                    {workOrder.printingType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getPrintingColors(workOrder.printingType)})
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="text"
                                    value={workOrder.colors || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'colors', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.printingType ? getPrintingColors(workOrder.printingType) : 'Enter colors'}
                                  />
                            </div>
                            
                                {/* COVERAGE % */}
                              <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    COVERAGE %
                                    {workOrder.printingType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getPrintingCoveragePercent(workOrder.printingType)})
                                      </span>
                                    )}
                                  </label>
                                <input
                                  type="text"
                                    value={workOrder.coveragePercent || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'coveragePercent', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.printingType ? getPrintingCoveragePercent(workOrder.printingType) : 'Enter coverage %'}
                                  />
                                </div>
                                
                                {/* RESOLUTION */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    RESOLUTION
                                    {workOrder.printingType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getPrintingResolution(workOrder.printingType)})
                                  </span>
                                )}
                                  </label>
                                  <input
                                    type="text"
                                    value={workOrder.resolution || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'resolution', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.printingType ? getPrintingResolution(workOrder.printingType) : 'Enter resolution'}
                                  />
                              </div>
                            </div>
                          </div>
                          )}
                        </div>
                      )}
                      
                      {/* Advanced Filter for QUILTING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'QUILTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showQuiltingAdvancedFilter', !workOrder.showQuiltingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showQuiltingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showQuiltingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showQuiltingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showQuiltingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showQuiltingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showQuiltingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* VARIANTS - Dropdown */}
                          <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                                  <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.quiltingType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.quiltingType ? getQuiltingVariants(workOrder.quiltingType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Quilting Type First</option>}
                                  </select>
                          </div>
                                
                                {/* DESIGN - Dropdown */}
                          <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    DESIGN
                                  </label>
                                  <select
                                    value={workOrder.quiltingDesign || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'quiltingDesign', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.quiltingType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Design</option>
                                    {workOrder.quiltingType ? getQuiltingDesigns(workOrder.quiltingType).map(design => (
                                      <option key={design} value={design}>{design}</option>
                                    )) : <option value="">Select Quilting Type First</option>}
                                  </select>
                                </div>
                                
                                {/* NEEDLE SPACING */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    NEEDLE SPACING
                                    {workOrder.quiltingType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getQuiltingNeedleSpacing(workOrder.quiltingType)})
                                      </span>
                                    )}
                                  </label>
                            <input
                              type="text"
                                    value={workOrder.needleSpacing || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'needleSpacing', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.quiltingType ? getQuiltingNeedleSpacing(workOrder.quiltingType) : 'Enter needle spacing'}
                            />
                          </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for SEWING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'SEWING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showSewingAdvancedFilter', !workOrder.showSewingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showSewingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showSewingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showSewingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showSewingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showSewingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showSewingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* MACHINE TYPE - Dropdown */}
                          <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    MACHINE TYPE
                                  </label>
                            <SearchableDropdown
                                    value={workOrder.sewingMachineType || ''}
                                    onChange={(selectedValue) => {
                                      const selectedType = selectedValue;
                                      handleWorkOrderChange(materialIndex, woIndex, 'sewingMachineType', selectedType);
                                      // Auto-populate STITCH TYPE when machine type changes
                                      if (selectedType) {
                                        handleWorkOrderChange(materialIndex, woIndex, 'stitchType', getSewingStitchType(selectedType));
                                        handleWorkOrderChange(materialIndex, woIndex, 'threadType', getSewingThreadType(selectedType));
                                      }
                                    }}
                                    options={getAllSewingMachineTypes()}
                                    placeholder="Select or type Machine Type"
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  />
                          </div>
                                
                                {/* STITCH TYPE */}
                          <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    STITCH TYPE
                                  </label>
                            <input
                              type="text"
                                    value={workOrder.stitchType || getSewingStitchType(workOrder.sewingMachineType) || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'stitchType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.sewingMachineType ? getSewingStitchType(workOrder.sewingMachineType) : 'Enter stitch type'}
                                    disabled={!workOrder.sewingMachineType}
                            />
                          </div>

                                {/* VARIANTS - Dropdown */}
                      <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                        <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.sewingMachineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.sewingMachineType ? getSewingVariants(workOrder.sewingMachineType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                        </select>
                      </div>

                                {/* NEEDLE SIZE */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    NEEDLE SIZE
                                  </label>
                                  <input
                                    type="text"
                                    value={workOrder.needleSize || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'needleSize', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder="TEXT"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for WEAVING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'WEAVING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showWeavingAdvancedFilter', !workOrder.showWeavingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showWeavingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showWeavingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showWeavingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showWeavingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showWeavingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showWeavingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* VARIANTS - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                                  <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.machineType ? getWeavingVariants(workOrder.machineType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                                </div>
                                
                                {/* DESIGN - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    DESIGN
                                  </label>
                                  <select
                                    value={workOrder.weavingDesign || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'weavingDesign', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Design</option>
                                    {workOrder.machineType ? getWeavingDesigns(workOrder.machineType).map(design => (
                                      <option key={design} value={design}>{design}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                                </div>
                                
                                {/* WARP Ratio */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    WARP Ratio
                                  </label>
                                  <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    max="1"
                                    value={workOrder.advancedWarpRatio || ''}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      const clampedVal = val > 1 ? 1 : val < 0 ? 0 : val;
                                      handleWorkOrderChange(materialIndex, woIndex, 'advancedWarpRatio', clampedVal);
                                      // Auto-calculate WEFT if both are being used (ratios should sum to 1)
                                      if (workOrder.advancedWeftRatio !== '' && clampedVal <= 1) {
                                        const weftVal = Math.max(0, Math.min(1, 1 - clampedVal)).toFixed(3);
                                        handleWorkOrderChange(materialIndex, woIndex, 'advancedWeftRatio', weftVal);
                                      }
                                    }}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder="0-1"
                                  />
                                </div>
                                
                                {/* WEFT Ratio */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    WEFT Ratio
                                  </label>
                                  <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    max="1"
                                    value={workOrder.advancedWeftRatio || ''}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0;
                                      const clampedVal = val > 1 ? 1 : val < 0 ? 0 : val;
                                      handleWorkOrderChange(materialIndex, woIndex, 'advancedWeftRatio', clampedVal);
                                      // Auto-calculate WARP if both are being used (ratios should sum to 1)
                                      if (workOrder.advancedWarpRatio !== '' && clampedVal <= 1) {
                                        const warpVal = Math.max(0, Math.min(1, 1 - clampedVal)).toFixed(3);
                                        handleWorkOrderChange(materialIndex, woIndex, 'advancedWarpRatio', warpVal);
                                      }
                                    }}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder="0-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for TUFTING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'TUFTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showTuftingAdvancedFilter', !workOrder.showTuftingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showTuftingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showTuftingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showTuftingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showTuftingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showTuftingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showTuftingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* DESIGN - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    DESIGN
                                  </label>
                                  <select
                                    value={workOrder.tuftingDesign || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'tuftingDesign', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Design</option>
                                    {workOrder.machineType ? getTuftingDesigns(workOrder.machineType).map(design => (
                                      <option key={design} value={design}>{design}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                                </div>
                                
                                {/* VARIANTS - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                                  <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.machineType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.machineType ? getTuftingVariants(workOrder.machineType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Machine Type First</option>}
                                  </select>
                                </div>
                                
                                {/* MACHINE GAUGE */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    MACHINE GAUGE
                                    {workOrder.machineType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getTuftingMachineGauge(workOrder.machineType)})
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="text"
                                    value={workOrder.machineGauge || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'machineGauge', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.machineType ? getTuftingMachineGauge(workOrder.machineType) : 'Enter machine gauge'}
                                  />
                                </div>
                                
                                {/* STITCH RATE */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    STITCH RATE
                                    {workOrder.machineType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getTuftingStitchRate(workOrder.machineType)})
                                      </span>
                                    )}
                                  </label>
                                  <input
                                    type="text"
                                    value={workOrder.stitchRate || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'stitchRate', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                    placeholder={workOrder.machineType ? getTuftingStitchRate(workOrder.machineType) : 'Enter stitch rate'}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Remarks - Hidden for BRAIDING, CARPET, CUTTING, DYEING, EMBROIDERY, KNITTING, PRINTING, QUILTING, SEWING, TUFTING, and WEAVING (they have their own REMARKS fields) */}
                      {workOrder.workOrder !== 'BRAIDING' && workOrder.workOrder !== 'CARPET' && workOrder.workOrder !== 'CUTTING' && workOrder.workOrder !== 'DYEING' && workOrder.workOrder !== 'EMBROIDERY' && workOrder.workOrder !== 'KNITTING' && workOrder.workOrder !== 'PRINTING' && workOrder.workOrder !== 'QUILTING' && workOrder.workOrder !== 'SEWING' && workOrder.workOrder !== 'TUFTING' && workOrder.workOrder !== 'WEAVING' && (
                      <div className="w-full flex flex-col mt-8">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={workOrder.remarks || ''}
                          onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '12px 16px', width: '100%' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                          onBlur={(e) => e.target.style.boxShadow = ''}
                          rows="2"
                        ></textarea>
                      </div>
                      )}

                      {/* Advanced Filter for DYEING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'DYEING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(materialIndex, woIndex, 'showDyeingAdvancedFilter', !workOrder.showDyeingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showDyeingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showDyeingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showDyeingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showDyeingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showDyeingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showDyeingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>
                              
                              <div className="grid grid-cols-2 gap-6">
                                {/* VARIANTS - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                  </label>
                                  <select
                                    value={workOrder.variants || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'variants', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    disabled={!workOrder.dyeingType}
                                    onFocus={(e) => {
                                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                      e.target.style.boxShadow = '';
                                    }}
                                  >
                                    <option value="">Select Variant</option>
                                    {workOrder.dyeingType ? getDyeingVariants(workOrder.dyeingType).map(variant => (
                                      <option key={variant} value={variant}>{variant}</option>
                                    )) : <option value="">Select Dyeing Type First</option>}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add Work Order Button at Bottom */}
              <div className="mt-6 pt-6 border-t border-gray-200" style={{ marginTop: '24px', paddingTop: '24px' }}>
                <p className="text-sm text-gray-600 mb-3">Would you like to add more work orders?</p>
                <button
                  type="button"
                  onClick={() => {
                    const currentLength = formData.rawMaterials[materialIndex]?.workOrders?.length || 0;
                    addWorkOrder(materialIndex);
                    const newIndex = currentLength;
                    const attemptScroll = (attempts = 0) => {
                      if (attempts > 30) return;
                      const element = document.getElementById(`workorder-${materialIndex}-${newIndex}`);
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
                  + Add Work Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2;
