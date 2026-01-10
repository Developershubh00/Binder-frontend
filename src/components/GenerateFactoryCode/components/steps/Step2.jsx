import { useEffect, useRef, useState } from 'react';
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
import TrimAccessoryFields from '../TrimAccessoryFields';
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
  removeWorkOrder,
  addRawMaterialWithType,
  handleSave,
  removeRawMaterial
}) => {
  const prevWorkOrdersLengthRef = useRef({});
  const isInitialMountRef = useRef(true);
  const [selectedComponent, setSelectedComponent] = useState(''); // Component selected at top
  const [showMaterialTypeModal, setShowMaterialTypeModal] = useState(false);
  const [savedComponents, setSavedComponents] = useState(new Set()); // Track which components are saved/done
  const [lastAddedMaterialIndex, setLastAddedMaterialIndex] = useState(null);
  const [scrollToMaterialIndex, setScrollToMaterialIndex] = useState(null); // Index to scroll to after removal

  // Get all components for dropdown with done status
  const getAllComponents = () => {
    const components = [];
    (formData.products || []).forEach((product) => {
      (product.components || []).forEach((component) => {
        if (component.productComforter) {
          components.push(component.productComforter);
        }
      });
    });
    return [...new Set(components)]; // Remove duplicates
  };

  // Check if a component is "done" (saved)
  const isComponentDone = (componentName) => {
    return savedComponents.has(componentName);
  };

  // Get materials for selected component
  const getMaterialsForSelectedComponent = () => {
    if (!selectedComponent) return [];
    return formData.rawMaterials?.filter(m => m.componentName === selectedComponent) || [];
  };

  // Handle bottom SAVE button - marks component as done
  const handleBottomSave = () => {
    if (!selectedComponent) {
      alert('Please select a component first');
      return;
    }
    // Mark component as saved
    setSavedComponents(prev => new Set([...prev, selectedComponent]));
    // Save the data
    handleSave(); // Call the parent save function
    
    // Clear selected component to hide the form
    setSelectedComponent('');
    
    // Scroll to top smoothly
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

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
          const lastWorkOrder = document.querySelector(`[data-material-index="${materialIndex + 1}"][data-work-order-index]:last-child`);
          if (lastWorkOrder) {
            lastWorkOrder.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
      prevWorkOrdersLengthRef.current[materialIndex] = currentWorkOrdersLength;
    });
  }, [formData.rawMaterials]);

  // Scroll to newly added material
  useEffect(() => {
    if (lastAddedMaterialIndex !== null && formData.rawMaterials && formData.rawMaterials.length > lastAddedMaterialIndex) {
      // Wait for React to render the new material
      setTimeout(() => {
        const element = document.querySelector(`[data-raw-material-index="${lastAddedMaterialIndex}"]`);
        if (element) {
          // Scroll to start (top) of the material card
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setLastAddedMaterialIndex(null); // Reset after scrolling
        } else {
          // Retry after a bit more time if element not found
          setTimeout(() => {
            const retryElement = document.querySelector(`[data-raw-material-index="${lastAddedMaterialIndex}"]`);
            if (retryElement) {
              retryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setLastAddedMaterialIndex(null);
            }
          }, 200);
        }
      }, 100);
    }
  }, [lastAddedMaterialIndex, formData.rawMaterials]);

  // Scroll to material after removal
  useEffect(() => {
    if (scrollToMaterialIndex !== null && selectedComponent) {
      const materialsForComponent = getMaterialsForSelectedComponent();
      
      setTimeout(() => {
        if (scrollToMaterialIndex === -1) {
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (scrollToMaterialIndex >= 0 && scrollToMaterialIndex < materialsForComponent.length) {
          // Find the material at the target index
          const targetMaterial = materialsForComponent[scrollToMaterialIndex];
          if (targetMaterial) {
            const targetActualIndex = formData.rawMaterials.findIndex(m => 
              m === targetMaterial || 
              (m.componentName === targetMaterial.componentName && 
               m.materialDescription === targetMaterial.materialDescription)
            );
            
            if (targetActualIndex !== -1) {
              const element = document.querySelector(`[data-raw-material-index="${targetActualIndex}"]`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }
        }
        
        setScrollToMaterialIndex(null); // Reset after scrolling
      }, 200);
    }
  }, [scrollToMaterialIndex, formData.rawMaterials, selectedComponent]);

  // Remove border from fiber testing requirements input
  useEffect(() => {
    const removeBorders = () => {
      const inputs = document.querySelectorAll('[id^="fiber-testing-wrapper"] input');
      inputs.forEach(input => {
        input.style.border = 'none';
        input.style.borderWidth = '0';
        input.style.outline = 'none';
        input.style.boxShadow = 'none';
        input.style.padding = '4px 0';
        input.style.backgroundColor = 'transparent';
      });
    };
    
    removeBorders();
    // Also remove after a short delay to catch any delayed renders
    const timeout = setTimeout(removeBorders, 100);
    return () => clearTimeout(timeout);
  }, [formData.rawMaterials, selectedComponent]);

  const materialsForComponent = getMaterialsForSelectedComponent();

  return (
<div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-2 RAW MATERIAL SOURCING</h2>
        <p className="text-sm text-gray-600">Bill of material & work order</p>
      </div>
      
      {/* Component Selection - OUTSIDE form border */}
      <div style={{ marginBottom: '24px', padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '300px' }}>
          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ display: 'block', marginBottom: '8px' }}>
                    COMPONENT
                  </label>
          <SearchableDropdown
            value={selectedComponent || ''}
            onChange={(selectedValue) => {
              setSelectedComponent(selectedValue || '');
            }}
            options={getAllComponents()}
            placeholder="Select component"
            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
            style={{ padding: '10px 14px', height: '44px', width: '100%' }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '';
            }}
                  />
                </div>
      </div>

      {/* Form for selected component */}
      {selectedComponent && (
        <div className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
          {materialsForComponent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>Add raw materials for this component</p>
              <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                <SearchableDropdown
                  options={['Fabric', 'Yarn', 'Trim & Accessory', 'Foam', 'Fiber']}
                  onChange={(selectedType) => {
                    if (selectedType) {
                      const currentLength = formData.rawMaterials?.length || 0;
                      addRawMaterialWithType(selectedType, selectedComponent);
                      setShowMaterialTypeModal(false);
                      // Set the index of the newly added material
                      setLastAddedMaterialIndex(currentLength);
                    }
                  }}
                  placeholder="Select material type"
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px', width: '100%' }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                />
              </div>
            </div>
          ) : (
            materialsForComponent.map((material, materialIndex) => {
              // Find the actual index in rawMaterials array
              // Try multiple matching strategies to handle newly added materials
              let actualIndex = formData.rawMaterials.findIndex(m => m === material);
              
              // If direct reference fails, try matching by component and material type
              // This works even when materialDescription is empty
              if (actualIndex === -1) {
                const materialsForThisComponent = formData.rawMaterials
                  .map((m, idx) => ({ m, idx }))
                  .filter(({ m }) => m.componentName === selectedComponent);
                
                // Find the material at the same position in the filtered list
                if (materialIndex < materialsForThisComponent.length) {
                  actualIndex = materialsForThisComponent[materialIndex].idx;
                } else {
                  // Fallback: match by componentName and materialType
                  actualIndex = formData.rawMaterials.findIndex(m => 
                    m.componentName === material.componentName && 
                    m.materialType === material.materialType &&
                    (m.materialDescription === material.materialDescription || 
                     (!m.materialDescription && !material.materialDescription))
                  );
                }
              }
              
              // Safety check: if still not found, log warning but continue
              if (actualIndex === -1) {
                console.warn('Could not find material index:', material, 'in rawMaterials:', formData.rawMaterials);
                // Use materialIndex as fallback (not ideal but prevents crashes)
                actualIndex = materialIndex;
              }
              
              // Use a more stable key that includes component and position
              const stableKey = `${selectedComponent}-${materialIndex}-${actualIndex}`;
              const materialNumber = materialIndex + 1;
              return (
                <div key={stableKey} data-raw-material-index={actualIndex} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: materialIndex < materialsForComponent.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  {/* Material Header */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
                      <h4 className="text-sm font-bold text-gray-700">MATERIAL {materialNumber}</h4>
                      {materialsForComponent.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this material?')) {
                              // Store which material index to scroll to after removal
                              if (materialIndex > 0) {
                                // Scroll to previous material (will be at materialIndex - 1 after removal)
                                setScrollToMaterialIndex(materialIndex - 1);
                              } else {
                                // If removing first material, scroll to top
                                setScrollToMaterialIndex(-1);
                              }
                              
                              removeRawMaterial(actualIndex);
                            }
                          }}
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
              
              {/* Material Details */}
              <div className="flex flex-wrap items-start gap-6">
                <div className='flex flex-col'>
                  <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL TYPE</label>
                  <SearchableDropdown
                    value={material.materialType || ''}
                    onChange={(selectedMaterialType) => handleRawMaterialChange(actualIndex, 'materialType', selectedMaterialType)}
                    options={['Fabric', 'Yarn', 'Trim & Accessory', 'Foam', 'Fiber']}
                    placeholder="select material"
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${actualIndex}_materialType`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${actualIndex}_materialType`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                  />
                  {errors[`rawMaterial_${actualIndex}_materialType`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${actualIndex}_materialType`]}
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
                    onChange={(e) => handleRawMaterialChange(actualIndex, 'materialDescription', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${actualIndex}_materialDescription`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${actualIndex}_materialDescription`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., Cotton 200TC"
                    required
                  />
                  {errors[`rawMaterial_${actualIndex}_materialDescription`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${actualIndex}_materialDescription`]}
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
                    onChange={(e) => handleRawMaterialChange(actualIndex, 'netConsumption', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${actualIndex}_netConsumption`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${actualIndex}_netConsumption`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="0.000"
                    required
                  />
                  {errors[`rawMaterial_${actualIndex}_netConsumption`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${actualIndex}_netConsumption`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    UNIT <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={material.unit}
                    onChange={(e) => handleRawMaterialChange(actualIndex, 'unit', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${actualIndex}_unit`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '130px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${actualIndex}_unit`]) {
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
                  {errors[`rawMaterial_${actualIndex}_unit`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${actualIndex}_unit`]}
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
                        handleRawMaterialChange(actualIndex, 'fiberType', selectedFiberType);
                        // Reset yarn type when fiber type changes
                        if (selectedFiberType !== material.fiberType) {
                          handleRawMaterialChange(actualIndex, 'yarnType', '');
                          handleRawMaterialChange(actualIndex, 'spinningMethod', '');
                          handleRawMaterialChange(actualIndex, 'spinningType', '');
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
                        handleRawMaterialChange(actualIndex, 'yarnType', selectedYarnType);
                        // Clear dependent fields when yarn type changes
                        if (selectedYarnType !== material.yarnType) {
                          handleRawMaterialChange(actualIndex, 'yarnComposition', '');
                          handleRawMaterialChange(actualIndex, 'yarnCountRange', '');
                          handleRawMaterialChange(actualIndex, 'yarnDoublingOptions', '');
                          handleRawMaterialChange(actualIndex, 'yarnPlyOptions', '');
                          handleRawMaterialChange(actualIndex, 'spinningMethod', '');
                          handleRawMaterialChange(actualIndex, 'spinningType', '');
                          handleRawMaterialChange(actualIndex, 'windingOptions', '');
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
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'yarnComposition', value)}
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
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'yarnCountRange', value)}
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
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'yarnDoublingOptions', value)}
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
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'yarnPlyOptions', value)}
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
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'windingOptions', value)}
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
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={material.surplus || ''}
                              onChange={(e) => {
                                // Store only numeric value (remove % and non-numeric chars except decimal point)
                                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                handleRawMaterialChange(actualIndex, 'surplus', numericValue);
                              }}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 32px 10px 14px', height: '44px', width: '100%' }}
                              placeholder="%AGE"
                            />
                            {material.surplus && (
                              <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            APPROVAL
                          </label>
                          <SearchableDropdown
                            value={material.approval || ''}
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'approval', value)}
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
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'remarks', e.target.value)}
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
                          onClick={() => handleRawMaterialChange(actualIndex, 'showAdvancedFilter', !material.showAdvancedFilter)}
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
                                  handleRawMaterialChange(actualIndex, 'spinningType', value);
                                  handleRawMaterialChange(actualIndex, 'spinningMethod', value);
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
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'testingRequirements', e.target.value)}
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
                                onChange={(value) => handleRawMaterialChange(actualIndex, 'fiberCategory', value)}
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
                                onChange={(value) => handleRawMaterialChange(actualIndex, 'origin', value)}
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
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'certifications', e.target.value)}
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
                        handleRawMaterialChange(actualIndex, 'fabricFiberType', selectedFiberType);
                        // Clear fabric name when fiber type changes
                        if (selectedFiberType !== material.fabricFiberType) {
                          handleRawMaterialChange(actualIndex, 'fabricName', '');
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
                        handleRawMaterialChange(actualIndex, 'fabricName', selectedFabricName);
                        // Clear dependent fields when fabric name changes
                        if (selectedFabricName !== material.fabricName) {
                          handleRawMaterialChange(actualIndex, 'fabricComposition', '');
                          handleRawMaterialChange(actualIndex, 'constructionType', '');
                          handleRawMaterialChange(actualIndex, 'weaveKnitType', '');
                          handleRawMaterialChange(actualIndex, 'fabricApproval', '');
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
                      onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricComposition', value)}
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
                      onChange={(e) => handleRawMaterialChange(actualIndex, 'gsm', e.target.value)}
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
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={material.fabricSurplus || ''}
                        onChange={(e) => {
                          // Store only numeric value (remove % and non-numeric chars except decimal point)
                          const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                          handleRawMaterialChange(actualIndex, 'fabricSurplus', numericValue);
                        }}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 32px 10px 14px', height: '44px', width: '100%' }}
                        placeholder="%AGE"
                      />
                      {material.fabricSurplus && (
                        <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Approval */}
                  <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      APPROVAL
                    </label>
                    <SearchableDropdown
                      value={material.fabricApproval || ''}
                      onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricApproval', value)}
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
                      onChange={(e) => handleRawMaterialChange(actualIndex, 'fabricRemarks', e.target.value)}
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
                    onClick={() => handleRawMaterialChange(actualIndex, 'showFabricAdvancedFilter', !material.showFabricAdvancedFilter)}
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
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'constructionType', value)}
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
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'weaveKnitType', value)}
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
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricMachineType', value)}
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
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'fabricTestingRequirements', e.target.value)}
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
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricFiberCategory', value)}
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
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricOrigin', value)}
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
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'fabricCertifications', e.target.value)}
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

            {/* Trim & Accessory Section */}
            {material.materialType === "Trim & Accessory" && (
              <>
                <div style={{ marginTop: '32px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h3 className="text-sm font-bold text-gray-800">TRIM & ACCESSORY SPECIFICATIONS</h3>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200" style={{ padding: '20px' }}>
                    {/* Import Trim/Accessory fields from Step3 */}
                    {/* For now, we'll conditionally render a basic structure */}
                    {/* The full trim/accessory fields will be imported from Step3 rendering logic */}
                    <div className="w-full mt-8 pt-6 border-t border-gray-100">
                      <div className="flex flex-col" style={{ width: '280px', marginBottom: '20px' }}>
                        <label className="text-sm font-bold text-gray-800 mb-2">TRIM/ACCESSORY</label>
                        <SearchableDropdown
                          value={material.trimAccessory || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'trimAccessory', selectedValue)}
                          options={['ZIPPERS', 'VELCRO', 'STITCHING THREAD', 'BUTTONS', 'RIVETS', 'NIWAR-WEBBING', 'LACE', 'INTERLINING', 'HOOKS-EYES', 'BUCKLES & ADJUSTERS', 'BUCKLES', 'EYELETS & GROMMETS', 'ELASTIC', 'FELT', 'SHOULDER PADS', 'RIBBING', 'RFID / EAS TAGS', 'CABLE-TIES', 'FRINGE / TASSELS', 'PLASTIC PIPES / RODS', 'SEAM TAPE', 'ADHESIVES / GUNNING', 'PRE-CUT HEMS / BINDINGS', 'REFLECTIVE TAPES', 'FIRE RETARDANT (FR) TRIMS', 'REPAIR KITS / PATCHES', 'CORD STOPS', 'RINGS-LOOPS', 'FOAM / WADDING (Pre-Cut Shapes)', 'PIN-BARBS', 'MAGNETIC CLOSURE']}
                          placeholder="Select or type Trim/Accessory"
                          style={{ width: '280px' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                          onBlur={(e) => e.target.style.boxShadow = ''}
                        />
                      </div>
                      
                      {/* Conditional fields based on trim/accessory type */}
                      <TrimAccessoryFields
                        material={material}
                        materialIndex={actualIndex}
                        handleChange={handleRawMaterialChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Foam Section */}
            {material.materialType === "Foam" && (
              <>
                <div style={{ marginTop: '32px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h3 className="text-sm font-bold text-gray-800">FOAM SPECIFICATIONS</h3>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200" style={{ padding: '20px' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* FOAM TYPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FOAM TYPE</label>
                        <SearchableDropdown
                          value={material.foamType || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamType', selectedValue)}
                          options={['EVA Foam (Ethylene Vinyl Acetate)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* SUBTYPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SUBTYPE</label>
                        <SearchableDropdown
                          value={material.foamSubtype || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamSubtype', selectedValue)}
                          options={['Virgin EVA', 'Recycled EVA', 'Blended']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* VA CONTENT */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">VA CONTENT</label>
                        <SearchableDropdown
                          value={material.foamVaContent || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamVaContent', selectedValue)}
                          options={['18%', '25%', '28%', '33%']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* COLOUR */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <SearchableDropdown
                          value={material.foamColour || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamColour', selectedValue)}
                          options={['Black', 'White', 'Grey', 'Red', 'Blue', 'Green', 'Custom']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* THICKNESS */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <SearchableDropdown
                          value={material.foamThickness || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamThickness', selectedValue)}
                          options={['2mm', '3mm', '5mm', '10mm', '15mm', '20mm', '25mm']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* SHAPE with UPLOAD REF IMAGE */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SHAPE</label>
                          <input
                            type="text"
                            value={material.foamShape || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamShape', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="TEXT"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamShapeRefImage', e.target.files[0])}
                            className="hidden"
                            id={`upload-foam-shape-${actualIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-foam-shape-${actualIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.foamShapeRefImage ? 'UPLOADED' : 'UPLOAD REF IMAGE'}
                          </label>
                        </div>
                      </div>

                      {/* SIZE SPEC */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                        <label className="text-sm font-bold text-gray-800 mb-4 block">SIZE SPEC</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">SHEET/PCS</label>
                            <input
                              type="text"
                              value={material.foamSheetPcs || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamSheetPcs', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter value"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">GSM</label>
                            <input
                              type="text"
                              value={material.foamGsm || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGsm', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter value"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH (CM)</label>
                            <input
                              type="text"
                              value={material.foamLengthCm || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLengthCm', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter value"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH (CM)</label>
                            <input
                              type="text"
                              value={material.foamWidthCm || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamWidthCm', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter value"
                            />
                          </div>
                        </div>
                      </div>

                      {/* QTY - KGS and YARDAGE */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4" style={{ marginTop: '20px' }}>
                        <label className="text-sm font-bold text-gray-800 mb-4 block">QTY</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">KGS (CNS)</label>
                            <input
                              type="text"
                              value={material.foamKgsCns || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamKgsCns', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter value"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">YARDAGE (CNS)</label>
                            <input
                              type="text"
                              value={material.foamYardageCns || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamYardageCns', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Enter value"
                            />
                          </div>
                        </div>
                      </div>

                      {/* TESTING REQUIREMENTS with UPLOAD */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.foamTestingRequirements || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamTestingRequirements', selectedValue)}
                            options={['Density', 'Shore Hardness', 'Compression Set', 'Tensile Strength']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamTestingRequirementsFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-foam-testing-${actualIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-foam-testing-${actualIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.foamTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>

                      {/* SURPLUS % */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={material.foamSurplus || ''}
                            onChange={(e) => {
                              // Store only numeric value (remove % and non-numeric chars except decimal point)
                              const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                              handleRawMaterialChange(actualIndex, 'foamSurplus', numericValue);
                            }}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 32px 10px 14px', height: '44px', width: '100%' }}
                            placeholder="%age"
                          />
                          {material.foamSurplus && (
                            <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                          )}
                        </div>
                      </div>

                      {/* WASTAGE % */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <SearchableDropdown
                            value={material.foamWastage || ''}
                            onChange={(selectedValue) => {
                              // If it's a dropdown option, store as-is. If it's numeric (free typing), store numeric only
                              const predefinedOptions = ['Yoga Mats', 'Packaging', 'Insoles', 'Craft', 'Protective Cases'];
                              if (predefinedOptions.includes(selectedValue)) {
                                handleRawMaterialChange(actualIndex, 'foamWastage', selectedValue);
                              } else {
                                // Free typing - store numeric only
                                const numericValue = selectedValue.replace(/[^0-9.]/g, '');
                                handleRawMaterialChange(actualIndex, 'foamWastage', numericValue);
                              }
                            }}
                            options={['Yoga Mats', 'Packaging', 'Insoles', 'Craft', 'Protective Cases']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 32px 10px 14px', height: '44px', width: '100%' }}
                          />
                          {material.foamWastage && !['Yoga Mats', 'Packaging', 'Insoles', 'Craft', 'Protective Cases'].includes(material.foamWastage) && (
                            <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none', zIndex: 10 }}>%</span>
                          )}
                        </div>
                      </div>

                      {/* APPROVAL */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.foamApproval || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* REMARKS */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.foamRemarks || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Higher VA%=softer, Interlocking for gym flooring, Closed cell=waterproof"
                        />
                      </div>

                      {/* FOAM - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        <button
                          type="button"
                          onClick={() => handleRawMaterialChange(actualIndex, 'showFoamAdvancedSpec', !material.showFoamAdvancedSpec)}
                          style={{
                            backgroundColor: material.showFoamAdvancedSpec ? '#667eea' : '#ffffff',
                            borderColor: material.showFoamAdvancedSpec ? '#667eea' : '#e5e7eb',
                            color: material.showFoamAdvancedSpec ? '#ffffff' : '#374151',
                            border: '2px solid',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s',
                            boxShadow: material.showFoamAdvancedSpec ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            if (!material.showFoamAdvancedSpec) {
                              e.target.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!material.showFoamAdvancedSpec) {
                              e.target.style.backgroundColor = '#ffffff';
                            }
                          }}
                        >
                          {material.showFoamAdvancedSpec ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                        </button>
                        {material.showFoamAdvancedSpec && (
                          <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">SHORE HARDNESS</label>
                                <SearchableDropdown
                                  value={material.foamShoreHardness || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamShoreHardness', selectedValue)}
                                  options={['25A Soft', '35A Medium', '45A Firm', '55A+ Hard']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">CELL STRUCTURE</label>
                                <SearchableDropdown
                                  value={material.foamCellStructure || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamCellStructure', selectedValue)}
                                  options={['Closed Cell']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">COMPRESSION SET</label>
                                <SearchableDropdown
                                  value={material.foamCompressionSet || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamCompressionSet', selectedValue)}
                                  options={['Compression Set %']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                                <SearchableDropdown
                                  value={material.foamTensileStrength || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamTensileStrength', selectedValue)}
                                  options={['Tensile Strength (MPa)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">ELONGATION</label>
                                <SearchableDropdown
                                  value={material.foamElongation || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamElongation', selectedValue)}
                                  options={['Elongation at Break (%)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">WATER RESISTANCE</label>
                                <SearchableDropdown
                                  value={material.foamWaterResistance || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamWaterResistance', selectedValue)}
                                  options={['Excellent']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">UV RESISTANCE</label>
                                <SearchableDropdown
                                  value={material.foamUvResistance || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamUvResistance', selectedValue)}
                                  options={['Standard', 'UV Stabilized']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">FIRE RETARDANT</label>
                                <SearchableDropdown
                                  value={material.foamFireRetardant || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamFireRetardant', selectedValue)}
                                  options={['Standard', 'FR Treated']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">SURFACE TEXTURE</label>
                                <SearchableDropdown
                                  value={material.foamSurfaceTexture || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamSurfaceTexture', selectedValue)}
                                  options={['Smooth', 'Textured (anti-slip)', 'Fabric Laminated', 'Leather-Look']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-SLIP</label>
                                <SearchableDropdown
                                  value={material.foamAntiSlip || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamAntiSlip', selectedValue)}
                                  options={['Standard', 'Anti-Slip Surface Treatment']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">INTERLOCKING</label>
                                <SearchableDropdown
                                  value={material.foamInterlocking || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamInterlocking', selectedValue)}
                                  options={['None', 'Interlocking Edges (puzzle pattern)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
                                <SearchableDropdown
                                  value={material.foamCertification || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamCertification', selectedValue)}
                                  options={['REACH Compliant', 'Phthalate-Free', 'OEKO-TEX']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">DENSITY</label>
                                <SearchableDropdown
                                  value={material.foamDensity || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamDensity', selectedValue)}
                                  options={['30 kg/m³', '45 kg/m³', '60 kg/m³', '90 kg/m³', '120 kg/m³']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Fiber Section */}
            {material.materialType === "Fiber" && (
              <>
                <div style={{ marginTop: '32px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h3 className="text-sm font-bold text-gray-800">FIBER SPECIFICATIONS</h3>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200" style={{ padding: '20px' }}>
                    {/* Table Selection Dropdown */}
                    <div className="flex flex-col" style={{ marginBottom: '24px', maxWidth: '300px' }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2">SELECT FIBER TABLE</label>
                      <SearchableDropdown
                        value={material.fiberTableType || ''}
                        onChange={(selectedValue) => {
                          handleRawMaterialChange(actualIndex, 'fiberTableType', selectedValue);
                          // Clear all fiber fields when table changes
                          if (selectedValue !== material.fiberTableType) {
                            handleRawMaterialChange(actualIndex, 'fiberFiberType', '');
                            handleRawMaterialChange(actualIndex, 'fiberSubtype', '');
                            handleRawMaterialChange(actualIndex, 'fiberForm', '');
                            handleRawMaterialChange(actualIndex, 'fiberDenier', '');
                            handleRawMaterialChange(actualIndex, 'fiberSiliconized', '');
                            handleRawMaterialChange(actualIndex, 'fiberConjugateCrimp', '');
                            handleRawMaterialChange(actualIndex, 'fiberColour', '');
                            handleRawMaterialChange(actualIndex, 'fiberBirdType', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownPercentage', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownProofRequired', '');
                            handleRawMaterialChange(actualIndex, 'fiberWoolType', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicron', '');
                            handleRawMaterialChange(actualIndex, 'fiberKapokSource', '');
                            handleRawMaterialChange(actualIndex, 'fiberKapokProperties', '');
                            handleRawMaterialChange(actualIndex, 'fiberBambooType', '');
                            handleRawMaterialChange(actualIndex, 'fiberBambooProperties', '');
                            handleRawMaterialChange(actualIndex, 'fiberSilkFlossType', '');
                            handleRawMaterialChange(actualIndex, 'fiberSilkFlossGrade', '');
                            handleRawMaterialChange(actualIndex, 'fiberRecycledSource', '');
                            handleRawMaterialChange(actualIndex, 'fiberRecycledCertification', '');
                            handleRawMaterialChange(actualIndex, 'fiberTencelType', '');
                            handleRawMaterialChange(actualIndex, 'fiberBlending', '');
                            handleRawMaterialChange(actualIndex, 'fiberEcoCertification', '');
                            handleRawMaterialChange(actualIndex, 'fiberBiodegradable', '');
                            handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'fiberQty', '');
                            handleRawMaterialChange(actualIndex, 'fiberGsm', '');
                            handleRawMaterialChange(actualIndex, 'fiberLength', '');
                            handleRawMaterialChange(actualIndex, 'fiberWidth', '');
                            handleRawMaterialChange(actualIndex, 'fiberQtyType', '');
                            handleRawMaterialChange(actualIndex, 'fiberQtyValue', '');
                            handleRawMaterialChange(actualIndex, 'fiberSurplus', '');
                            handleRawMaterialChange(actualIndex, 'fiberWastage', '');
                            handleRawMaterialChange(actualIndex, 'fiberApproval', '');
                            handleRawMaterialChange(actualIndex, 'fiberRemarks', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberFiberLength', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberStructure', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberClusterType', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberClusterSize', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberAntiMicrobial', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberHypoallergenic', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberLoftFillPower', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberHandFeel', '');
                            handleRawMaterialChange(actualIndex, 'fiberMicrofiberCertification', '');
                            handleRawMaterialChange(actualIndex, 'showFiberAdvancedSpec', false);
                          }
                        }}
                        options={['Polyester-Fills', 'Down-Feather', 'Wool-Natural','Specialty-Fills','Microfiber-Fill']}
                        placeholder="Select fiber table"
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                      />
                    </div>

                    {/* Polyester-Fills Table */}
                    {material.fiberTableType === 'Polyester-Fills' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* FIBER TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FIBER TYPE</label>
                          <SearchableDropdown
                            value={material.fiberFiberType || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFiberType', selectedValue)}
                            options={['Polyester (PET)', 'Recycled Polyester (rPET)']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                      {/* SUBTYPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SUBTYPE</label>
                        <SearchableDropdown
                          value={material.fiberSubtype || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberSubtype', selectedValue)}
                          options={['Virgin', 'Recycled', 'Conjugate', 'Hollow Conjugate']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* FORM */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FORM</label>
                        <SearchableDropdown
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
                          options={['Loose Fiber', 'Wadding/Batt', 'Carded Cotton', 'Bleached Cotton', 'Linter']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* DENIER */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DENIER</label>
                        <SearchableDropdown
                          value={material.fiberDenier || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDenier', selectedValue)}
                          options={['1D', '1.2D', '3D', '6D', '7D', '10D', '15D']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* SILICONIZED */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SILICONIZED</label>
                        <SearchableDropdown
                          value={material.fiberSiliconized || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberSiliconized', selectedValue)}
                          options={['Non-Siliconized', 'Siliconized (slick finish)', 'Super Siliconized']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* CONJUGATE/CRIMP */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CONJUGATE/CRIMP</label>
                        <SearchableDropdown
                          value={material.fiberConjugateCrimp || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberConjugateCrimp', selectedValue)}
                          options={['Non-Conjugate (straight)', 'Conjugate (crimped)', '3D Crimp']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* COLOUR */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <SearchableDropdown
                          value={material.fiberColour || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberColour', selectedValue)}
                          options={['Optical White', 'Natural White', 'Dope Dyed (solution dyed)']}
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
                              id={`fiber-testing-wrapper-${actualIndex}`}
                              style={{ flex: 1, minWidth: '200px' }}
                            >
                              <SearchableDropdown
                                value=""
                                onChange={(selectedValue) => {
                                  if (selectedValue) {
                                    const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                                    if (!current.includes(selectedValue)) {
                                      const updated = [...current, selectedValue];
                                      handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
                                    }
                                  }
                                }}
                                options={['Fiber Fineness', 'Loft Recovery', 'Compression Resilience', 'Cleanliness']}
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
                                }}
                                onBlur={(e) => {
                                  const input = e.target;
                                  input.style.border = 'none';
                                  input.style.borderWidth = '0';
                                  input.style.outline = 'none';
                                  input.style.boxShadow = 'none';
                                  const container = input.closest('[class*="border-2"]');
                                  if (container) {
                                    container.style.borderColor = '#e5e7eb';
                                    container.style.boxShadow = 'none';
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
                            </div>
                            
                            {/* QTY with dropdown (KGS/Yardage) - Full width below the grid */}
                            <div className="flex flex-col" style={{ marginTop: '16px' }}>
                              <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}>
                                <SearchableDropdown
                                  value={material.fiberQtyType || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberQtyType', selectedValue)}
                                  options={['KGS', 'Yardage']}
                                  placeholder="Select"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '120px', flexShrink: 0 }}
                                />
                                <input
                                  type="text"
                                  value={material.fiberQtyValue || ''}
                                  onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQtyValue', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px', width: '200px', flexShrink: 0 }}
                                  placeholder="Enter value"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* SURPLUS % */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={material.fiberSurplus || ''}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                              handleRawMaterialChange(actualIndex, 'fiberSurplus', numericValue);
                            }}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                            placeholder="2-5%"
                          />
                          <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                        </div>
                      </div>

                      {/* WASTAGE % */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={material.fiberWastage || ''}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                              handleRawMaterialChange(actualIndex, 'fiberWastage', numericValue);
                            }}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                            placeholder="2-5%"
                          />
                          <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                        </div>
                      </div>

                      {/* APPROVAL */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.fiberApproval || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
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
                          placeholder="7D Hollow Siliconized for premium pillows, Ball fiber for machine washable products"
                        />
                      </div>

                      {/* ADVANCE SPEC Button and Fields */}
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
                              {/* FIBER LENGTH */}
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">FIBER LENGTH</label>
                                <SearchableDropdown
                                  value={material.fiberFiberLength || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFiberLength', selectedValue)}
                                  options={['32mm', '51mm', '64mm (Staple Length)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>

                              {/* STRUCTURE */}
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">STRUCTURE</label>
                                <SearchableDropdown
                                  value={material.fiberStructure || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberStructure', selectedValue)}
                                  options={['Solid', 'Hollow (2-hole)', 'Hollow (4-hole)', 'Hollow (7-hole)', 'Spiral Hollow']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>

                              {/* THERMAL BONDED */}
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">THERMAL BONDED</label>
                                <SearchableDropdown
                                  value={material.fiberThermalBonded || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberThermalBonded', selectedValue)}
                                  options={['Non-Bonded', 'Thermal Bonded', 'Spray Bonded', 'Resin Bonded']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>

                              {/* ANTI-MICROBIAL */}
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-MICROBIAL</label>
                                <SearchableDropdown
                                  value={material.fiberAntiMicrobial || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberAntiMicrobial', selectedValue)}
                                  options={['Standard', 'Anti-Microbial Treated', 'Anti-Bacterial']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>

                              {/* FIRE RETARDANT */}
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">FIRE RETARDANT</label>
                                <SearchableDropdown
                                  value={material.fiberFireRetardant || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFireRetardant', selectedValue)}
                                  options={['Standard', 'FR Treated (CFR 1633)', 'FR Treated (TB 117)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>

                              {/* CERTIFICATION */}
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
                                <SearchableDropdown
                                  value={material.fiberCertification || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCertification', selectedValue)}
                                  options={['OEKO-TEX Standard 100', 'GRS (Global Recycled Standard)', 'Bluesign']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>

                              {/* LOFT / FILL POWER */}
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">LOFT / FILL POWER</label>
                                <SearchableDropdown
                                  value={material.fiberLoftFillPower || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberLoftFillPower', selectedValue)}
                                  options={['Low Loft', 'Medium Loft', 'High Loft (specify inches)']}
                                  placeholder="Select or type"
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    )}

                    {/* Down-Feather Table */}
                    {material.fiberTableType === 'Down-Feather' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* FIBER TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FIBER TYPE</label>
                          <SearchableDropdown
                            value={material.fiberFiberType || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFiberType', selectedValue)}
                            options={['Down', 'Feather', 'Down & Feather Blend']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* BIRD TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">BIRD TYPE</label>
                          <SearchableDropdown
                            value={material.fiberBirdType || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberBirdType', selectedValue)}
                            options={['Goose Down', 'Duck Down', 'Goose Feather', 'Duck Feather']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* FORM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FORM</label>
                          <SearchableDropdown
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
                            options={['Loose Fiber', 'Cluster/Ball Fiber', 'Wadding']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* ORIGIN */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">ORIGIN</label>
                          <SearchableDropdown
                            value={material.fiberOrigin || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberOrigin', selectedValue)}
                            options={['European (Hungarian)', 'European (Polish)', 'Chinese', 'North American', 'Siberian']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* DOWN PERCENTAGE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DOWN PERCENTAGE</label>
                          <SearchableDropdown
                            value={material.fiberDownPercentage || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownPercentage', selectedValue)}
                            options={['90/10', '80/20', '70/30', '50/50']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* COLOUR */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <SearchableDropdown
                            value={material.fiberColour || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberColour', selectedValue)}
                            options={['White', 'Grey']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>

                        {/* DOWN-PROOF REQUIRED */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DOWN-PROOF REQUIRED</label>
                          <SearchableDropdown
                            value={material.fiberDownProofRequired || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownProofRequired', selectedValue)}
                            options={['Yes (shell must be down-proof)', 'No']}
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
                                id={`fiber-testing-wrapper-down-${actualIndex}`}
                                style={{ flex: 1, minWidth: '200px' }}
                              >
                                <SearchableDropdown
                                  value=""
                                  onChange={(selectedValue) => {
                                    if (selectedValue) {
                                      const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                                      if (!current.includes(selectedValue)) {
                                        const updated = [...current, selectedValue];
                                        handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
                                      }
                                    }
                                  }}
                                  options={['Fill Power Test', 'Oxygen Number', 'Turbidity', 'Species ID', 'RDS Audit']}
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
                                  }}
                                  onBlur={(e) => {
                                    const input = e.target;
                                    input.style.border = 'none';
                                    input.style.borderWidth = '0';
                                    input.style.outline = 'none';
                                    input.style.boxShadow = 'none';
                                    const container = input.closest('[class*="border-2"]');
                                    if (container) {
                                      container.style.borderColor = '#e5e7eb';
                                      container.style.boxShadow = 'none';
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

                        {material.fiberForm === 'Wadding' && (
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
                              </div>
                              
                              {/* QTY with dropdown (KGS/Yardage) - Full width below the grid */}
                              <div className="flex flex-col" style={{ marginTop: '16px' }}>
                                <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}>
                                  <SearchableDropdown
                                    value={material.fiberQtyType || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberQtyType', selectedValue)}
                                    options={['KGS', 'Yardage']}
                                    placeholder="Select"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px', width: '120px', flexShrink: 0 }}
                                  />
                                  <input
                                    type="text"
                                    value={material.fiberQtyValue || ''}
                                    onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQtyValue', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px', width: '200px', flexShrink: 0 }}
                                    placeholder="Enter value"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* SURPLUS % */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={material.fiberSurplus || ''}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                handleRawMaterialChange(actualIndex, 'fiberSurplus', numericValue);
                              }}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                              placeholder="3-5%"
                            />
                            <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                          </div>
                        </div>

                        {/* WASTAGE % */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={material.fiberWastage || ''}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                handleRawMaterialChange(actualIndex, 'fiberWastage', numericValue);
                              }}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                              placeholder="Enter wastage %"
                            />
                            <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                          </div>
                        </div>

                        {/* APPROVAL */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <SearchableDropdown
                            value={material.fiberApproval || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE', 'RDS Certificate']}
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
                            placeholder="Must be RDS certified, Hungarian White Goose Down for luxury, 4x washed for hypoallergenic"
                          />
                        </div>

                        {/* ADVANCE SPEC Button and Fields for Down-Feather */}
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
                                {/* FILL POWER */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">FILL POWER</label>
                                  <SearchableDropdown
                                    value={material.fiberFillPower || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFillPower', selectedValue)}
                                    options={['500', '550', '600', '650', '700', '750', '800', '850+ (cubic inches/oz)']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* PROCESSING */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">PROCESSING</label>
                                  <SearchableDropdown
                                    value={material.fiberProcessing || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberProcessing', selectedValue)}
                                    options={['Washed (2x)', 'Washed (3x)', 'Washed (4x)', 'Sterilized', 'Sanitized']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* OXYGEN NUMBER */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">OXYGEN NUMBER</label>
                                  <SearchableDropdown
                                    value={material.fiberOxygenNumber || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberOxygenNumber', selectedValue)}
                                    options={['Oxygen Number (cleanliness, <10 ideal)']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* TURBIDITY */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">TURBIDITY</label>
                                  <SearchableDropdown
                                    value={material.fiberTurbidity || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberTurbidity', selectedValue)}
                                    options={['Turbidity (clarity, <300 NTU ideal)']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* ODOR */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">ODOR</label>
                                  <SearchableDropdown
                                    value={material.fiberOdor || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberOdor', selectedValue)}
                                    options={['No odor', 'Minimal (must pass odor test)']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* ANTI-MICROBIAL */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-MICROBIAL</label>
                                  <SearchableDropdown
                                    value={material.fiberAntiMicrobial || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberAntiMicrobial', selectedValue)}
                                    options={['Standard', 'Anti-Microbial Treated']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* TRACEABILITY */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">TRACEABILITY</label>
                                  <SearchableDropdown
                                    value={material.fiberTraceability || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberTraceability', selectedValue)}
                                    options={['Chain of Custody', 'Farm Traceable']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* CLUSTER SIZE */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">CLUSTER SIZE</label>
                                  <SearchableDropdown
                                    value={material.fiberClusterSize || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberClusterSize', selectedValue)}
                                    options={['Small', 'Medium', 'Large (larger clusters = higher fill power)']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>

                                {/* CERTIFICATION */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
                                  <SearchableDropdown
                                    value={material.fiberCertification || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCertification', selectedValue)}
                                    options={['RDS (Responsible Down Standard)', 'Downpass', 'Bluesign', 'IDFL Certified']}
                                    placeholder="Select or type"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Wool-Natural Table */}
                    {material.fiberTableType === 'Wool-Natural' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* FIBER TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FIBER TYPE</label>
                          <SearchableDropdown
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
                          <SearchableDropdown
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
                          <SearchableDropdown
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
                          <SearchableDropdown
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
                          <SearchableDropdown
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
                          <SearchableDropdown
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
                                <SearchableDropdown
                                  value=""
                                  onChange={(selectedValue) => {
                                    if (selectedValue) {
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
                                  }}
                                  onBlur={(e) => {
                                    const input = e.target;
                                    input.style.border = 'none';
                                    input.style.borderWidth = '0';
                                    input.style.outline = 'none';
                                    input.style.boxShadow = 'none';
                                    const container = input.closest('[class*="border-2"]');
                                    if (container) {
                                      container.style.borderColor = '#e5e7eb';
                                      container.style.boxShadow = 'none';
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
                              </div>
                              
                              {/* QTY with dropdown (KGS/Yardage) - Full width below the grid */}
                              <div className="flex flex-col" style={{ marginTop: '16px' }}>
                                <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}>
                                  <SearchableDropdown
                                    value={material.fiberQtyType || ''}
                                    onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberQtyType', selectedValue)}
                                    options={['KGS', 'Yardage']}
                                    placeholder="Select"
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px', width: '120px', flexShrink: 0 }}
                                  />
                                  <input
                                    type="text"
                                    value={material.fiberQtyValue || ''}
                                    onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQtyValue', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px', width: '200px', flexShrink: 0 }}
                                    placeholder="Enter value"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* SURPLUS % */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={material.fiberSurplus || ''}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                handleRawMaterialChange(actualIndex, 'fiberSurplus', numericValue);
                              }}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                              placeholder="3-5%"
                            />
                            <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                          </div>
                        </div>

                        {/* WASTAGE % */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={material.fiberWastage || ''}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                handleRawMaterialChange(actualIndex, 'fiberWastage', numericValue);
                              }}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                              placeholder="3-5%"
                            />
                            <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                          </div>
                        </div>

                        {/* APPROVAL */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <SearchableDropdown
                            value={material.fiberApproval || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
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
                                  <SearchableDropdown
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
                                  <SearchableDropdown
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
                                  <SearchableDropdown
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
                                  <SearchableDropdown
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
                                  <SearchableDropdown
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
                                  <SearchableDropdown
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
                                  <SearchableDropdown
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
                        </div>
                      </div>
                    )}




                    {/* Specialty-Fills Table */}
{material.fiberTableType === 'Specialty-Fills' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* FIBER TYPE */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">FIBER TYPE</label>
      <SearchableDropdown
        value={material.fiberFiberType || ''}
        onChange={(selectedValue) => {
          handleRawMaterialChange(actualIndex, 'fiberFiberType', selectedValue);
          // Clear all conditional fields when fiber type changes
          if (selectedValue !== material.fiberFiberType) {
            handleRawMaterialChange(actualIndex, 'fiberKapokSource', '');
            handleRawMaterialChange(actualIndex, 'fiberKapokProperties', '');
            handleRawMaterialChange(actualIndex, 'fiberBambooType', '');
            handleRawMaterialChange(actualIndex, 'fiberBambooProperties', '');
            handleRawMaterialChange(actualIndex, 'fiberSilkFlossType', '');
            handleRawMaterialChange(actualIndex, 'fiberSilkFlossGrade', '');
            handleRawMaterialChange(actualIndex, 'fiberRecycledSource', '');
            handleRawMaterialChange(actualIndex, 'fiberRecycledCertification', '');
            handleRawMaterialChange(actualIndex, 'fiberTencelType', '');
          }
        }}
        options={['Kapok', 'Bamboo Fiber', 'Silk Floss', 'Milkweed', 'Recycled Fiber', 'Tencel/Lyocell Fill']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* Conditional: KAPOK - SOURCE (only shows when Kapok is selected) */}
    {material.fiberFiberType === 'Kapok' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">KAPOK - SOURCE</label>
        <SearchableDropdown
          value={material.fiberKapokSource || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberKapokSource', selectedValue)}
          options={['Ceiba Tree Seed Pods (100% Natural)']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* Conditional: KAPOK - PROPERTIES (only shows when Kapok is selected) */}
    {material.fiberFiberType === 'Kapok' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">KAPOK - PROPERTIES</label>
        <SearchableDropdown
          value={material.fiberKapokProperties || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberKapokProperties', selectedValue)}
          options={['Ultra-Light', 'Naturally Buoyant', 'Hypoallergenic', 'Quick-Dry']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* Conditional: BAMBOO - TYPE (only shows when Bamboo Fiber is selected) */}
    {material.fiberFiberType === 'Bamboo Fiber' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">BAMBOO - TYPE</label>
        <SearchableDropdown
          value={material.fiberBambooType || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberBambooType', selectedValue)}
          options={['Bamboo Viscose Fill', 'Bamboo Charcoal Fill']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* Conditional: BAMBOO - PROPERTIES (only shows when Bamboo Fiber is selected) */}
    {material.fiberFiberType === 'Bamboo Fiber' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">BAMBOO - PROPERTIES</label>
        <SearchableDropdown
          value={material.fiberBambooProperties || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberBambooProperties', selectedValue)}
          options={['Anti-Bacterial', 'Moisture Wicking', 'Eco-Friendly']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* Conditional: SILK FLOSS - TYPE (only shows when Silk Floss is selected) */}
    {material.fiberFiberType === 'Silk Floss' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">SILK FLOSS - TYPE</label>
        <SearchableDropdown
          value={material.fiberSilkFlossType || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberSilkFlossType', selectedValue)}
          options={['Mulberry Silk Floss', 'Tussah Silk Floss']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* Conditional: SILK FLOSS - GRADE (only shows when Silk Floss is selected) */}
    {material.fiberFiberType === 'Silk Floss' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">SILK FLOSS - GRADE</label>
        <SearchableDropdown
          value={material.fiberSilkFlossGrade || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberSilkFlossGrade', selectedValue)}
          options={['Grade A (long fiber)', 'Grade B', 'Mixed Grade']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* Conditional: RECYCLED - SOURCE (only shows when Recycled Fiber is selected) */}
    {material.fiberFiberType === 'Recycled Fiber' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">RECYCLED - SOURCE</label>
        <SearchableDropdown
          value={material.fiberRecycledSource || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberRecycledSource', selectedValue)}
          options={['Post-Consumer Recycled (PCR)', 'Post-Industrial', 'Recycled PET Bottles']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* Conditional: RECYCLED - CERTIFICATION (only shows when Recycled Fiber is selected) */}
    {material.fiberFiberType === 'Recycled Fiber' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">RECYCLED - CERTIFICATION</label>
        <SearchableDropdown
          value={material.fiberRecycledCertification || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberRecycledCertification', selectedValue)}
          options={['GRS (Global Recycled Standard)', 'RCS (Recycled Claim Standard)']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* Conditional: TENCEL - TYPE (only shows when Tencel/Lyocell Fill is selected) */}
    {material.fiberFiberType === 'Tencel/Lyocell Fill' && (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">TENCEL - TYPE</label>
        <SearchableDropdown
          value={material.fiberTencelType || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberTencelType', selectedValue)}
          options={['Tencel Lyocell Fill', 'Tencel Modal Fill']}
          placeholder="Select or type"
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px' }}
        />
      </div>
    )}

    {/* FORM */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">FORM</label>
      <SearchableDropdown
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
            id={`fiber-testing-wrapper-specialty-${actualIndex}`}
            style={{ flex: 1, minWidth: '200px' }}
          >
            <SearchableDropdown
              value=""
              onChange={(selectedValue) => {
                if (selectedValue) {
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
              }}
              onBlur={(e) => {
                const input = e.target;
                input.style.border = 'none';
                input.style.borderWidth = '0';
                input.style.outline = 'none';
                input.style.boxShadow = 'none';
                const container = input.closest('[class*="border-2"]');
                if (container) {
                  container.style.borderColor = '#e5e7eb';
                  container.style.boxShadow = 'none';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Conditional: QTY for Loose Fiber */}
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

    {/* Conditional: SIZE SPEC for Wadding/Batt */}
    {material.fiberForm === 'Wadding/Batt' && (
      <>
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
          </div>
          
          {/* QTY with dropdown (KGS/Yardage) */}
          <div className="flex flex-col" style={{ marginTop: '16px' }}>
            <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}>
              <SearchableDropdown
                value={material.fiberQtyType || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberQtyType', selectedValue)}
                options={['KGS', 'Yardage']}
                placeholder="Select"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px', width: '120px', flexShrink: 0 }}
              />
              <input
                type="text"
                value={material.fiberQtyValue || ''}
                onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQtyValue', e.target.value)}
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px', width: '200px', flexShrink: 0 }}
                placeholder="Enter value"
              />
            </div>
          </div>
        </div>
      </>
    )}

    {/* SURPLUS % */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={material.fiberSurplus || ''}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9.]/g, '');
            handleRawMaterialChange(actualIndex, 'fiberSurplus', numericValue);
          }}
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
          placeholder="3-5%"
        />
        <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
      </div>
    </div>

    {/* WASTAGE % */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={material.fiberWastage || ''}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9.]/g, '');
            handleRawMaterialChange(actualIndex, 'fiberWastage', numericValue);
          }}
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
          placeholder="3-5%"
        />
        <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
      </div>
    </div>

    {/* APPROVAL */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
      <SearchableDropdown
        value={material.fiberApproval || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberApproval', selectedValue)}
        options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
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
        placeholder="Kapok for ultra-light products, Bamboo charcoal for odor control, GRS for recycled verification"
      />
    </div>

    {/* ADVANCE SPEC Button and Fields */}
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
            {/* BLENDING */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">BLENDING</label>
              <SearchableDropdown
                value={material.fiberBlending || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberBlending', selectedValue)}
                options={['100% Single Fiber', 'Blended (e.g., 70% Polyester / 30% Bamboo)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* ECO CERTIFICATION */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">ECO CERTIFICATION</label>
              <SearchableDropdown
                value={material.fiberEcoCertification || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberEcoCertification', selectedValue)}
                options={['GOTS', 'OEKO-TEX', 'FSC (for plant-based)', 'Vegan Certified']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* BIODEGRADABLE */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">BIODEGRADABLE</label>
              <SearchableDropdown
                value={material.fiberBiodegradable || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberBiodegradable', selectedValue)}
                options={['Standard', 'Certified Biodegradable', 'Compostable']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}




                    {/* Microfiber-Fill Table */}
{material.fiberTableType === 'Microfiber-Fill' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* FIBER TYPE */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">FIBER TYPE</label>
      <SearchableDropdown
        value={material.fiberFiberType || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFiberType', selectedValue)}
        options={['Microfiber Polyester']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* SUBTYPE */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">SUBTYPE</label>
      <SearchableDropdown
        value={material.fiberSubtype || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberSubtype', selectedValue)}
        options={['Standard Microfiber', 'Micro-Gel', 'Micro-Cluster', 'Micro-Denier Ball']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* FORM */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">FORM</label>
      <SearchableDropdown
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
        options={['Loose Fiber', 'Cluster/Ball Fiber', 'Wadding']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* DENIER */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">DENIER</label>
      <SearchableDropdown
        value={material.fiberDenier || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDenier', selectedValue)}
        options={['0.7D (Ultra-Micro)', '0.9D', '1.0D', '1.2D']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* SILICONIZED */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">SILICONIZED</label>
      <SearchableDropdown
        value={material.fiberSiliconized || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberSiliconized', selectedValue)}
        options={['Siliconized (standard for microfiber)', 'Super Siliconized']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* COLOUR */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
      <SearchableDropdown
        value={material.fiberColour || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberColour', selectedValue)}
        options={['Optical White', 'Super White']}
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
            id={`fiber-testing-wrapper-microfiber-${actualIndex}`}
            style={{ flex: 1, minWidth: '200px' }}
          >
            <SearchableDropdown
              value=""
              onChange={(selectedValue) => {
                if (selectedValue) {
                  const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                  if (!current.includes(selectedValue)) {
                    const updated = [...current, selectedValue];
                    handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
                  }
                }
              }}
              options={['Denier Verification', 'Loft Test', 'Resilience', 'Dust Mite Resistance']}
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
              }}
              onBlur={(e) => {
                const input = e.target;
                input.style.border = 'none';
                input.style.borderWidth = '0';
                input.style.outline = 'none';
                input.style.boxShadow = 'none';
                const container = input.closest('[class*="border-2"]');
                if (container) {
                  container.style.borderColor = '#e5e7eb';
                  container.style.boxShadow = 'none';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Conditional: QTY for Loose Fiber */}
    {material.fiberForm === 'Loose Fiber' && (
      <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
        <input
          type="text"
          value={material.fiberQty || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQty', e.target.value)}
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 14px', height: '44px', width: '300px' }}
          placeholder="Enter QTY in KGS PER PC"
        />
      </div>
    )}

    {/* Conditional: SIZE SPEC for Wadding */}
    {material.fiberForm === 'Wadding' && (
      <>
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
            
            {/* YARDAGE (CNS) */}
            <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH (CM)</label>
                <input
                  type="text"
                  value={material.fiberWidth || ''}
                  onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberWidth', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px', width: '200px' }}
                  placeholder="Enter width"
                />
              </div>

          </div>
          
          {/* QTY with WIDTH (CM) and KGS (CNS) */}
          <div className="flex flex-col" style={{ marginTop: '16px' }}>
            <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ width: 'fit-content' }}>
              <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">YARDAGE (CNS)</label>
              <input
                type="text"
                value={material.fiberQtyValue || ''}
                onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQtyValue', e.target.value)}
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
                placeholder="Enter yardage"
              />
            </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">KGS (CNS)</label>
                <input
                  type="text"
                  value={material.fiberQty || ''}
                  onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQty', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px', width: '200px' }}
                  placeholder="Enter KGS"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    {/* SURPLUS % */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={material.fiberSurplus || ''}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9.]/g, '');
            handleRawMaterialChange(actualIndex, 'fiberSurplus', numericValue);
          }}
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
          placeholder="2-3%"
        />
        <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
      </div>
    </div>

    {/* WASTAGE % */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={material.fiberWastage || ''}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9.]/g, '');
            handleRawMaterialChange(actualIndex, 'fiberWastage', numericValue);
          }}
          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
          style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
          placeholder="2-3%"
        />
        <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
      </div>
    </div>

    {/* APPROVAL */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
      <SearchableDropdown
        value={material.fiberApproval || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberApproval', selectedValue)}
        options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
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
        placeholder="Micro-Gel cluster mimics down feel, Ideal for hypoallergenic products"
      />
    </div>

    {/* ADVANCE SPEC Button and Fields */}
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
            {/* FIBER LENGTH */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">FIBER LENGTH</label>
              <SearchableDropdown
                value={material.fiberMicrofiberFiberLength || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberFiberLength', selectedValue)}
                options={['32mm', '51mm', '64mm']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* STRUCTURE */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">STRUCTURE</label>
              <SearchableDropdown
                value={material.fiberMicrofiberStructure || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberStructure', selectedValue)}
                options={['Solid', 'Hollow (for extra loft)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* CLUSTER TYPE */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">CLUSTER TYPE</label>
              <SearchableDropdown
                value={material.fiberMicrofiberClusterType || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberClusterType', selectedValue)}
                options={['Standard Cluster', 'Premium Gel-Cluster', 'Down-Like Cluster']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* CLUSTER SIZE */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">CLUSTER SIZE</label>
              <SearchableDropdown
                value={material.fiberMicrofiberClusterSize || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberClusterSize', selectedValue)}
                options={['Small (marble size)', 'Medium (golf ball)', 'Large (tennis ball)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* ANTI-MICROBIAL */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-MICROBIAL</label>
              <SearchableDropdown
                value={material.fiberMicrofiberAntiMicrobial || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberAntiMicrobial', selectedValue)}
                options={['Standard', 'Anti-Microbial', 'Anti-Bacterial', 'Anti-Allergen']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* HYPOALLERGENIC */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">HYPOALLERGENIC</label>
              <SearchableDropdown
                value={material.fiberMicrofiberHypoallergenic || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberHypoallergenic', selectedValue)}
                options={['Standard', 'Certified Hypoallergenic']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* LOFT / FILL POWER */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">LOFT / FILL POWER</label>
              <SearchableDropdown
                value={material.fiberMicrofiberLoftFillPower || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberLoftFillPower', selectedValue)}
                options={['Medium Loft', 'High Loft', 'Ultra-High Loft']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* HAND FEEL */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">HAND FEEL</label>
              <SearchableDropdown
                value={material.fiberMicrofiberHandFeel || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberHandFeel', selectedValue)}
                options={['Soft', 'Ultra-Soft', 'Down-Like']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* CERTIFICATION */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
              <SearchableDropdown
                value={material.fiberMicrofiberCertification || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberMicrofiberCertification', selectedValue)}
                options={['OEKO-TEX', 'Downpass Alternative', 'CertiPUR (if foam combo)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}




                  </div>
                </div>
              </>
            )}
            





            {/* Work Orders Section */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 className="text-sm font-bold text-gray-800">WORK ORDERS</h3>
              </div>
              
              {material.workOrders && material.workOrders.map((workOrder, woIndex) => (
                <div key={woIndex} id={`workorder-${materialIndex + 1}-${woIndex}`} data-work-order-index={woIndex} data-material-index={materialIndex} className="bg-white rounded-lg border border-gray-200" style={{ padding: '16px', marginBottom: '12px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                    <h4 className="text-sm font-semibold text-gray-700">
                      WORK ORDER {woIndex + 1}
                    </h4>
                    {material.workOrders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          // Find previous work order to scroll to
                          const currentWorkOrders = material.workOrders || [];
                          const prevWorkOrderIndex = woIndex > 0 ? woIndex - 1 : null;
                          removeWorkOrder(actualIndex, woIndex);
                          
                          // Scroll to previous work order after removal
                          if (prevWorkOrderIndex !== null && prevWorkOrderIndex < currentWorkOrders.length) {
                            setTimeout(() => {
                              const prevElement = document.querySelector(`[data-material-index="${actualIndex}"][data-work-order-index="${prevWorkOrderIndex}"]`);
                              if (prevElement) {
                                prevElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          } else if (currentWorkOrders.length === 1) {
                            // If removing the last work order, scroll to material header
                            setTimeout(() => {
                              const materialElement = document.querySelector(`[data-raw-material-index="${actualIndex}"]`);
                              if (materialElement) {
                                materialElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }
                        }}
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
                          handleWorkOrderChange(actualIndex, woIndex, 'workOrder', selectedValue);
                        }}
                        options={['WEAVING', 'TUFTING', 'QUILTING', 'PRINTING', 'KNITTING', 'EMBROIDERY', 'DYEING', 'BRAIDING', 'CARPET', 'CUTTING', 'SEWING', 'FRINGE/TASSELS']}
                        placeholder="Select Work Order"
                        strictMode={true}
                        className={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_workOrder`] 
                          ? 'border-red-600' 
                          : ''}
                        style={{ width: '160px' }}
                        onFocus={(e) => {
                          if (!errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_workOrder`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                      />
                      {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_workOrder`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_workOrder`]}
                        </span>
                      )}
                    </div>
                    
                    {/* WASTAGE field - Hidden for KNITTING, PRINTING, QUILTING, SEWING, TUFTING, WEAVING, and FRINGE/TASSELS as they have their own sections */}
                    {workOrder.workOrder && workOrder.workOrder !== 'KNITTING' && workOrder.workOrder !== 'PRINTING' && workOrder.workOrder !== 'QUILTING' && workOrder.workOrder !== 'SEWING' && workOrder.workOrder !== 'TUFTING' && workOrder.workOrder !== 'WEAVING' && workOrder.workOrder !== 'FRINGE/TASSELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WASTAGE % <span className="text-red-600">*</span>
                          </label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100px' }}>
                            <input
                              type="text"
                              value={workOrder.wastage || ''}
                              onChange={(e) => {
                                // Store only numeric value (remove % and non-numeric chars except decimal point)
                                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                handleWorkOrderChange(actualIndex, woIndex, 'wastage', numericValue);
                              }}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                              }}
                              onBlur={(e) => {
                                e.target.style.boxShadow = '';
                              }}
                              placeholder="e.g., 2"
                              required
                            />
                            {workOrder.wastage && (
                              <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                            )}
                          </div>
                          {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                            </span>
                          )}
                        </div>
                        
                      </>
                    )}
                  </div>
                  
                  {/* Conditional Fields based on Work Order Type */}
                  {workOrder.workOrder && (
                    <div className="w-full flex flex-wrap items-start mt-14 pt-6 border-t border-gray-50" style={{ gap: '24px 32px', marginTop: '20px' }}>
                      {/* Machine Type / Specific Type Dropdown */}
                      {(['WEAVING', 'TUFTING', 'KNITTING', 'EMBROIDERY', 'BRAIDING', 'CARPET', 'CUTTING'].includes(workOrder.workOrder)) && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            {workOrder.workOrder === 'CUTTING' ? 'TOOL TYPE' : 'MACHINE TYPE'}
                          </label>
                          <SearchableDropdown
                            value={workOrder.machineType || ''}
                            onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'machineType', selectedValue)}
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
                            placeholder={workOrder.workOrder === 'CUTTING' ? "Select or type Tool Type" : "Select or type Machine Type"}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'strandCount', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'widthDiameter', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'gsm', e.target.value)}
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
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`braiding-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`braiding-file-${materialIndex + 1}-${woIndex}`}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter remarks"
                          />
                        </div>
                        </>
                      )}

                      {/* KNITTING Specific Fields */}
                      {workOrder.workOrder === 'KNITTING' && (
                        <>
                          {/* DESIGN REF (Upload) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REF</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knittingDesignRef', e.target.files[0])}
                                className="hidden"
                                id={`knitting-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`knitting-file-${materialIndex + 1}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.knittingDesignRef ? 'UPLOADED' : 'UPLOAD'}</span>
                              </label>
                            </div>
                          </div>

                          {/* GAUGE */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              GAUGE
                              {workOrder.machineType && getKnittingGaugeRange(workOrder.machineType) && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({getKnittingGaugeRange(workOrder.machineType)})
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={workOrder.knittingGauge || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knittingGauge', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              placeholder={workOrder.machineType && getKnittingGaugeRange(workOrder.machineType) ? getKnittingGaugeRange(workOrder.machineType) : 'Numeric'}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* GSM */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">GSM</label>
                            <input
                              type="text"
                              value={workOrder.knittingGsm || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knittingGsm', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              placeholder="Numeric"
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* WALES Ratio */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WALES Ratio</label>
                            <input
                              type="number"
                              step="0.001"
                              min="0"
                              max="1"
                              value={workOrder.knittingWalesRatio || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knittingWalesRatio', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              placeholder="0-1"
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* COURSES Ratio */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">COURSES Ratio</label>
                            <input
                              type="number"
                              step="0.001"
                              min="0"
                              max="1"
                              value={workOrder.knittingCoursesRatio || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knittingCoursesRatio', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              placeholder="0-1"
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* RATIO WEIGHT/%AGE (Wales) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">RATIO WEIGHT/%AGE (Wales)</label>
                            <input
                              type="text"
                              value={workOrder.knittingRatioWeightWales || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knittingRatioWeightWales', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              placeholder="Ratio/%"
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* RATIO WEIGHT/%AGE (Courses) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">RATIO WEIGHT/%AGE (Courses)</label>
                            <input
                              type="text"
                              value={workOrder.knittingRatioWeightCourses || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knittingRatioWeightCourses', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              placeholder="Ratio/%"
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* WASTAGE % */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '140px' }}>
                              <input
                                type="text"
                                value={workOrder.wastage || ''}
                                onChange={(e) => {
                                  // Store only numeric value (remove % and non-numeric chars except decimal point)
                                  const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                  handleWorkOrderChange(actualIndex, woIndex, 'wastage', numericValue);
                                }}
                                className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                  errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] 
                                    ? 'border-red-600' 
                                    : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                                }`}
                                style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                                placeholder="%AGE"
                                onFocus={(e) => {
                                  if (!errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]) {
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                  }
                                }}
                                onBlur={(e) => {
                                  e.target.style.boxShadow = '';
                                }}
                              />
                              {workOrder.wastage && (
                                <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                              )}
                            </div>
                            {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                              </span>
                            )}
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={KNITTING_APPROVAL_OPTIONS}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              placeholder="Text"
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>
                        </>
                      )}

                      {/* Advanced Filter for KNITTING - Button right after REMARKS */}
                      {workOrder.workOrder === 'KNITTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showKnittingAdvancedFilter', !workOrder.showKnittingAdvancedFilter)}
                              className="border-2 rounded-lg text-sm font-medium transition-all"
                              style={{
                                padding: '10px 20px',
                                height: '44px',
                                backgroundColor: workOrder.showKnittingAdvancedFilter ? '#667eea' : '#ffffff',
                                borderColor: workOrder.showKnittingAdvancedFilter ? '#667eea' : '#e5e7eb',
                                color: workOrder.showKnittingAdvancedFilter ? '#ffffff' : '#374151'
                              }}
                              onMouseEnter={(e) => {
                                if (!workOrder.showKnittingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#f9fafb';
                                  e.currentTarget.style.borderColor = '#d1d5db';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!workOrder.showKnittingAdvancedFilter) {
                                  e.currentTarget.style.backgroundColor = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                }
                              }}
                            >
                              Advance Filter
                            </button>
                          </div>

                          {/* Advanced Filter UI Table */}
                          {workOrder.showKnittingAdvancedFilter && (
                            <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                              <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* DESIGN - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    DESIGN
                                    {workOrder.machineType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getKnittingDesigns(workOrder.machineType).length} options)
                                      </span>
                                    )}
                                  </label>
                                  <SearchableDropdown
                                    value={workOrder.knittingDesign || ''}
                                    onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'knittingDesign', selectedValue)}
                                    options={workOrder.machineType ? getKnittingDesigns(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Design" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                    style={{ width: '100%' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                  />
                                </div>

                                {/* VARIANTS - Dropdown */}
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">
                                    VARIANTS
                                    {workOrder.machineType && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({getKnittingVariants(workOrder.machineType).length} options)
                                      </span>
                                    )}
                                  </label>
                                  <SearchableDropdown
                                    value={workOrder.knittingVariant || ''}
                                    onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'knittingVariant', selectedValue)}
                                    options={workOrder.machineType ? getKnittingVariants(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Variant" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                    style={{ width: '100%' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for BRAIDING - Button right after REMARKS */}
                      {workOrder.workOrder === 'BRAIDING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Filter Button */}
                          <div style={{ marginBottom: '20px', width: '100%' }}>
                            <button
                              type="button"
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showBraidingAdvancedFilter', !workOrder.showBraidingAdvancedFilter)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'braidingDesign', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pattern', e.target.value)}
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
                            onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'quiltingType', selectedValue)}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`quilting-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`quilting-file-${materialIndex + 1}-${woIndex}`}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'stitchLength', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'patternRepeat', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                              }}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="%AGE"
                            />
                            {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                              </span>
                            )}
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
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
                            onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'printingType', selectedValue)}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`printing-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`printing-file-${materialIndex + 1}-${woIndex}`}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'repeatSize', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                              }}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="%AGE"
                            />
                            {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                              </span>
                            )}
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'spi', e.target.value)}
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
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'threadType', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                                
                              }}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="%AGE"
                            />
                            {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                              </span>
                            )}
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Text"
                            />
                          </div>
                        </>
                      )}

                      {/* FRINGE/TASSELS Specific Fields */}
                      {workOrder.workOrder === 'FRINGE/TASSELS' && (
                        <>
                          {/* TYPE */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                            <SearchableDropdown
                              value={workOrder.fringeType || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeType', selectedValue)}
                              options={['Cut Fringe', 'Chainette', 'Tassel (individual)', 'Ball Fringe', 'Brush Fringe', 'Bullion', 'Loop Fringe']}
                              placeholder="Select or type"
                              style={{ width: '180px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* MATERIAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                            <SearchableDropdown
                              value={workOrder.fringeMaterial || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeMaterial', selectedValue)}
                              options={['Rayon (shiny)', 'Polyester', 'Cotton', 'Silk', 'Metallic', 'Wool', 'Jute']}
                              placeholder="Select or type"
                              style={{ width: '180px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* DROP LENGTH */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DROP LENGTH</label>
                            <SearchableDropdown
                              value={workOrder.dropLength || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'dropLength', selectedValue)}
                              options={['2cm', '5cm', '10cm', '15cm', '20cm']}
                              placeholder="Select or type"
                              style={{ width: '160px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* TAPE/HEADER WIDTH */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">TAPE/HEADER WIDTH</label>
                            <SearchableDropdown
                              value={workOrder.tapeHeaderWidth || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'tapeHeaderWidth', selectedValue)}
                              options={['10mm', '15mm', '20mm']}
                              placeholder="Select or type"
                              style={{ width: '160px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* COLOUR */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                            <div className="flex items-center gap-2">
                              <SearchableDropdown
                                value={workOrder.fringeColour || ''}
                                onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeColour', selectedValue)}
                                options={['DTM', 'Multi-Coloured', 'Iridescent', 'Ombre']}
                                placeholder="Select or type"
                                style={{ width: '160px' }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                              />
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeColourRefImage', e.target.files[0])}
                                className="hidden"
                                id={`fringe-colour-ref-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`fringe-colour-ref-${materialIndex + 1}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.fringeColourRefImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}</span>
                              </label>
                            </div>
                          </div>

                          {/* PLACEMENT */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={workOrder.fringePlacement || ''}
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringePlacement', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                                placeholder="Enter placement"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                              />
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringePlacementRefImage', e.target.files[0])}
                                className="hidden"
                                id={`fringe-placement-ref-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`fringe-placement-ref-${materialIndex + 1}-${woIndex}`}
                                className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="truncate">{workOrder.fringePlacementRefImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}</span>
                              </label>
                            </div>
                          </div>


                          {/* QTY - Type Selection (PCS/LENGTH) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                            <SearchableDropdown
                              value={workOrder.fringeQtyType || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeQtyType', selectedValue)}
                              options={['PCS', 'LENGTH']}
                              placeholder="Select type"
                              style={{ width: '140px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* Conditional QTY Fields */}
                          {workOrder.fringeQtyType === 'PCS' && (
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PIECES</label>
                              <input
                                type="text"
                                value={workOrder.fringeQtyPcs || ''}
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeQtyPcs', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                placeholder="Enter pieces"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                              />
                            </div>
                          )}

                          {workOrder.fringeQtyType === 'LENGTH' && (
                            <>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">CNS/PC</label>
                                <input
                                  type="text"
                                  value={workOrder.fringeQtyCnsPerPc || ''}
                                  onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeQtyCnsPerPc', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                  placeholder="Enter CNS/PC"
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                                />
                              </div>
                            </>
                          )}

                          {/* TESTING REQUIREMENTS - Multiselect with Upload */}
                          <div className="flex flex-col" style={{ width: '100%' }}>
                            <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                            <div className="flex items-start gap-2" style={{ flexWrap: 'wrap' }}>
                              <div className="relative" style={{ minWidth: '220px', flex: '1 1 auto' }}>
                                <div className="border-2 rounded-lg bg-white border-[#e5e7eb] focus-within:border-indigo-500" style={{ padding: '8px', minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}>
                                  {['Colour Fastness (light/UV)', 'Wash Resistance', 'Flammability'].map((option) => {
                                    const currentValues = Array.isArray(workOrder.fringeTestingRequirements) 
                                      ? workOrder.fringeTestingRequirements 
                                      : (workOrder.fringeTestingRequirements ? (typeof workOrder.fringeTestingRequirements === 'string' ? workOrder.fringeTestingRequirements.split(',').filter(v => v.trim()) : []) : []);
                                    const isChecked = currentValues.includes(option);
                                    return (
                                      <label key={option} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            const currentValues = Array.isArray(workOrder.fringeTestingRequirements) 
                                              ? workOrder.fringeTestingRequirements 
                                              : (workOrder.fringeTestingRequirements ? (typeof workOrder.fringeTestingRequirements === 'string' ? workOrder.fringeTestingRequirements.split(',').filter(v => v.trim()) : []) : []);
                                            let newValues;
                                            if (e.target.checked) {
                                              newValues = [...currentValues, option];
                                            } else {
                                              newValues = currentValues.filter(v => v !== option);
                                            }
                                            handleWorkOrderChange(actualIndex, woIndex, 'fringeTestingRequirements', newValues);
                                          }}
                                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-900">{option}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                                {workOrder.fringeTestingRequirements && Array.isArray(workOrder.fringeTestingRequirements) && workOrder.fringeTestingRequirements.length > 0 && (
                                  <div className="text-xs text-gray-700 mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                                    <strong>Selected:</strong> {workOrder.fringeTestingRequirements.join(', ')}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col" style={{ flex: '0 0 auto' }}>
                                <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                                <input
                                  type="file"
                                  onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeTestingRequirementsUpload', e.target.files[0])}
                                  className="hidden"
                                  id={`fringe-testing-requirements-upload-${materialIndex + 1}-${woIndex}`}
                                />
                                <label
                                  htmlFor={`fringe-testing-requirements-upload-${materialIndex + 1}-${woIndex}`}
                                  className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                                  style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                  </svg>
                                  <span className="truncate">{workOrder.fringeTestingRequirementsUpload ? 'UPLOADED' : 'UPLOAD'}</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* SURPLUS % */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '140px' }}>
                              <input
                                type="text"
                                value={workOrder.fringeSurplus || ''}
                                onChange={(e) => {
                                  // Store only numeric value (remove % and non-numeric chars except decimal point)
                                  const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                                  handleWorkOrderChange(actualIndex, woIndex, 'fringeSurplus', numericValue);
                                }}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 32px 10px 14px', width: '100%', height: '44px' }}
                                placeholder="%age"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => {
                                  e.target.style.boxShadow = '';
                                }}
                              />
                              {workOrder.fringeSurplus && (
                                <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                              )}
                            </div>
                          </div>

                          {/* WASTAGE % - With dropdown options */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '180px' }}>
                              <SearchableDropdown
                                value={workOrder.fringeWastage || ''}
                                onChange={(selectedValue) => {
                                  // If it's a dropdown option, store as-is. If it's numeric (free typing), store numeric only
                                  const predefinedOptions = ['Hem', 'Pillow Edge', 'Curtain Edge', 'Trim'];
                                  if (predefinedOptions.includes(selectedValue)) {
                                    handleWorkOrderChange(actualIndex, woIndex, 'fringeWastage', selectedValue);
                                  } else {
                                    // Free typing - store numeric only
                                    const numericValue = selectedValue.replace(/[^0-9.]/g, '');
                                    handleWorkOrderChange(actualIndex, woIndex, 'fringeWastage', numericValue);
                                  }
                                }}
                                options={['Hem', 'Pillow Edge', 'Curtain Edge', 'Trim']}
                                placeholder="Select or type %age"
                                strictMode={false}
                                style={{ width: '100%', paddingRight: '32px' }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => {
                                  e.target.style.boxShadow = '';
                                }}
                              />
                              {workOrder.fringeWastage && !['Hem', 'Pillow Edge', 'Curtain Edge', 'Trim'].includes(workOrder.fringeWastage) && (
                                <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none', zIndex: 10 }}>%</span>
                              )}
                            </div>
                          </div>

                          {/* APPROVAL */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.fringeApproval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeApproval', selectedValue)}
                              options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                              placeholder="Select or type"
                              style={{ width: '180px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* REMARKS */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                            <input
                              type="text"
                              value={workOrder.fringeRemarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeRemarks', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              placeholder="Text"
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>

                          {/* Advance Spec Section for FRINGE/TASSELS */}
                          <div className="w-full" style={{ marginTop: '20px' }}>
                            {/* Show/Hide Advance Filter Button */}
                            <div style={{ marginBottom: '20px', width: '100%' }}>
                              <button
                                type="button"
                                onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showFringeAdvancedSpec', !workOrder.showFringeAdvancedSpec)}
                                className="border-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                  padding: '10px 20px',
                                  height: '44px',
                                  backgroundColor: workOrder.showFringeAdvancedSpec ? '#667eea' : '#ffffff',
                                  borderColor: workOrder.showFringeAdvancedSpec ? '#667eea' : '#e5e7eb',
                                  color: workOrder.showFringeAdvancedSpec ? '#ffffff' : '#374151'
                                }}
                                onMouseEnter={(e) => {
                                  if (!workOrder.showFringeAdvancedSpec) {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!workOrder.showFringeAdvancedSpec) {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                  }
                                }}
                              >
                                Advance Filter
                              </button>
                            </div>

                            {/* Advanced Spec UI Table */}
                            {workOrder.showFringeAdvancedSpec && (
                              <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%' }}>
                                <h4 className="text-sm font-semibold text-gray-800 mb-6">ADVANCE SPEC~UI</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {/* FINISH */}
                                  <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                                    <SearchableDropdown
                                      value={workOrder.fringeFinish || ''}
                                      onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeFinish', selectedValue)}
                                      options={['High Sheen', 'Matte', 'Twisted', 'Braided Header']}
                                      placeholder="Select or type"
                                      style={{ width: '100%' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                    />
                                  </div>

                                  {/* ATTACHMENT */}
                                  <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                                    <SearchableDropdown
                                      value={workOrder.fringeAttachment || ''}
                                      onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeAttachment', selectedValue)}
                                      options={['Sew-On Header', 'Adhesive Back', 'Loop for Hanging']}
                                      placeholder="Select or type"
                                      style={{ width: '100%' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                    />
                                  </div>

                                  {/* CONSTRUCTION */}
                                  <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-2">CONSTRUCTION</label>
                                    <SearchableDropdown
                                      value={workOrder.fringeConstruction || ''}
                                      onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeConstruction', selectedValue)}
                                      options={['Knot Density', 'Fiber Count', 'Threads per inch']}
                                      placeholder="Select or type"
                                      style={{ width: '100%' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
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
                              handleWorkOrderChange(actualIndex, woIndex, 'dyeingType', selectedType);
                              // Clear COLOR REF and REFERENCE TYPE when dyeing type changes
                              if (!selectedType) {
                                handleWorkOrderChange(actualIndex, woIndex, 'colorRef', '');
                                handleWorkOrderChange(actualIndex, woIndex, 'referenceType', '');
                              } else {
                                handleWorkOrderChange(actualIndex, woIndex, 'colorRef', '');
                                handleWorkOrderChange(actualIndex, woIndex, 'referenceType', '');
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'colorRef', e.target.value)}
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
                            onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'referenceType', e.target.value)}
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

                          {/* REFERENCE - Text Field (appears after REFERENCE TYPE is selected) */}
                          {workOrder.referenceType && (
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">REFERENCE</label>
                              <input
                                type="text"
                                value={workOrder.dyeingReference || ''}
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'dyeingReference', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '300px', height: '44px' }}
                                placeholder="Enter reference"
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                              />
                            </div>
                          )}

                          {/* REFERENCE IMAGE (Upload) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REFERENCE IMAGE</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`dyeing-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`dyeing-file-${materialIndex + 1}-${woIndex}`}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'shrinkageWidthPercent', e.target.value)}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'shrinkageLengthPercent', e.target.value)}
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
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="Enter remarks"
                            />
                        </div>
                        </>
                      )}
                      
                      {/* Image Upload - Hidden for CUTTING, BRAIDING, CARPET, DYEING, EMBROIDERY, KNITTING, PRINTING, QUILTING, SEWING, TUFTING, WEAVING, and FRINGE/TASSELS (they have REFERENCE IMAGE/DESIGN REF in their own sections or don't need it) */}
                      {workOrder.workOrder !== 'CUTTING' && workOrder.workOrder !== 'BRAIDING' && workOrder.workOrder !== 'CARPET' && workOrder.workOrder !== 'DYEING' && workOrder.workOrder !== 'EMBROIDERY' && workOrder.workOrder !== 'KNITTING' && workOrder.workOrder !== 'PRINTING' && workOrder.workOrder !== 'QUILTING' && workOrder.workOrder !== 'SEWING' && workOrder.workOrder !== 'TUFTING' && workOrder.workOrder !== 'WEAVING' && workOrder.workOrder !== 'FRINGE/TASSELS' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            {workOrder.workOrder === 'DYEING' ? 'REFERENCE IMAGE' : workOrder.workOrder === 'BRAIDING' ? 'DESIGN REF' : 'IMAGE REF'}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`file-${materialIndex + 1}-${woIndex}`}
                            />
                            <label
                              htmlFor={`file-${materialIndex + 1}-${woIndex}`}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`weaving-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`weaving-file-${materialIndex + 1}-${woIndex}`}
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
                                  onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'reed', e.target.value)}
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
                                  onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pick', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder={workOrder.machineType && getWeavingPickRange(workOrder.machineType) ? getWeavingPickRange(workOrder.machineType) : 'Numeric'}
                                    />
                                </div>

                          {/* GSM */}
                                <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">GSM</label>
                                  <input
                                    type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'gsm', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                      errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] 
                                        ? 'border-red-600' 
                                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                                    }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                    onFocus={(e) => {
                                      if (!errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]) {
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                      }
                                    }}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="%AGE"
                                  />
                                  {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] && (
                                    <span className="text-red-600 text-xs mt-1 font-medium">
                                      {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                                    </span>
                                  )}
                                </div>

                          {/* APPROVAL */}
                                <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`tufting-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`tufting-file-${materialIndex + 1}-${woIndex}`}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'gsm', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pileHeight', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'tpi', e.target.value)}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                  errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] 
                                    ? 'border-red-600' 
                                    : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                                }`}
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                onFocus={(e) => {
                                  if (!errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]) {
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                  }
                                }}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                                placeholder="%AGE"
                              />
                              {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`] && (
                                <span className="text-red-600 text-xs mt-1 font-medium">
                                  {errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                                </span>
                              )}
                            </div>

                          {/* APPROVAL */}
                            <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'gsm', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pileHeight', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'tpiKpsi', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knotType', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pitchRows', e.target.value)}
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
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`carpet-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`carpet-file-${materialIndex + 1}-${woIndex}`}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showCarpetAdvancedFilter', !workOrder.showCarpetAdvancedFilter)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'carpetDesign', e.target.value)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showCuttingAdvancedFilter', !workOrder.showCuttingAdvancedFilter)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'cutType', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'layers', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'nesting', e.target.value)}
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
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                                className="hidden"
                                id={`embroidery-file-${materialIndex + 1}-${woIndex}`}
                              />
                              <label
                                htmlFor={`embroidery-file-${materialIndex + 1}-${woIndex}`}
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
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
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
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showEmbroideryAdvancedFilter', !workOrder.showEmbroideryAdvancedFilter)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'embroideryDesign', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'threadColors', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'stitchCount', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'hoopFrameSize', e.target.value)}
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showPrintingAdvancedFilter', !workOrder.showPrintingAdvancedFilter)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'printingDesign', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'numberOfScreens', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'colors', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'coveragePercent', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'resolution', e.target.value)}
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showQuiltingAdvancedFilter', !workOrder.showQuiltingAdvancedFilter)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'quiltingDesign', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'needleSpacing', e.target.value)}
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showSewingAdvancedFilter', !workOrder.showSewingAdvancedFilter)}
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
                                      handleWorkOrderChange(actualIndex, woIndex, 'sewingMachineType', selectedType);
                                      // Auto-populate STITCH TYPE when machine type changes
                                      if (selectedType) {
                                        handleWorkOrderChange(actualIndex, woIndex, 'stitchType', getSewingStitchType(selectedType));
                                        handleWorkOrderChange(actualIndex, woIndex, 'threadType', getSewingThreadType(selectedType));
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'stitchType', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'needleSize', e.target.value)}
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showWeavingAdvancedFilter', !workOrder.showWeavingAdvancedFilter)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'weavingDesign', e.target.value)}
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
                                      handleWorkOrderChange(actualIndex, woIndex, 'advancedWarpRatio', clampedVal);
                                      // Auto-calculate WEFT if both are being used (ratios should sum to 1)
                                      if (workOrder.advancedWeftRatio !== '' && clampedVal <= 1) {
                                        const weftVal = Math.max(0, Math.min(1, 1 - clampedVal)).toFixed(3);
                                        handleWorkOrderChange(actualIndex, woIndex, 'advancedWeftRatio', weftVal);
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
                                      handleWorkOrderChange(actualIndex, woIndex, 'advancedWeftRatio', clampedVal);
                                      // Auto-calculate WARP if both are being used (ratios should sum to 1)
                                      if (workOrder.advancedWarpRatio !== '' && clampedVal <= 1) {
                                        const warpVal = Math.max(0, Math.min(1, 1 - clampedVal)).toFixed(3);
                                        handleWorkOrderChange(actualIndex, woIndex, 'advancedWarpRatio', warpVal);
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showTuftingAdvancedFilter', !workOrder.showTuftingAdvancedFilter)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'tuftingDesign', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'machineGauge', e.target.value)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'stitchRate', e.target.value)}
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
                          onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
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
                              onClick={() => handleWorkOrderChange(actualIndex, woIndex, 'showDyeingAdvancedFilter', !workOrder.showDyeingAdvancedFilter)}
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
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'variants', e.target.value)}
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
              
              {/* Add Work Order Button at Bottom - Only show if at least one work order exists */}
              {material.workOrders && material.workOrders.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200" style={{ marginTop: '24px', paddingTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => {
                      const currentLength = material.workOrders?.length || 0;
                      addWorkOrder(actualIndex);
                    const newIndex = currentLength;
                    const attemptScroll = (attempts = 0) => {
                      if (attempts > 30) return;
                        const element = document.getElementById(`workorder-${materialIndex + 1}-${newIndex}`);
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
                  style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                    color: '#374151',
                    padding: '10px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
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
                  + Add Work Order
                </button>
              </div>
              )}
            </div>
          </div>
              );
            })
          )}

          {/* Bottom Save and Add Raw Material Buttons - Only show when materials exist */}
          {materialsForComponent.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleBottomSave}
              style={{
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                color: '#374151',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
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
              Save
            </button>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowMaterialTypeModal(!showMaterialTypeModal)}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
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
                Add Raw Material
              </button>
              {showMaterialTypeModal && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    minWidth: '200px'
                  }}
                >
                  <SearchableDropdown
                    options={['Fabric', 'Yarn', 'Trim & Accessory', 'Foam', 'Fiber']}
                    onChange={(selectedType) => {
                      if (selectedType) {
                        const currentLength = formData.rawMaterials?.length || 0;
                        addRawMaterialWithType(selectedType, selectedComponent);
                        setShowMaterialTypeModal(false);
                        // Set the index of the newly added material
                        setLastAddedMaterialIndex(currentLength);
                      }
                    }}
                    placeholder="Select material type"
                    onBlur={() => {
                      setTimeout(() => setShowMaterialTypeModal(false), 200);
                    }}
                  />
      </div>
              )}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step2;
