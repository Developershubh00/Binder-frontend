import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PercentInput } from '@/components/ui/percent-input';
import { TestingRequirementsInput } from '@/components/ui/testing-requirements-input';
import { cn } from '@/lib/utils';
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
  removeRawMaterial,
  validateField,
  validateStep2,
  validateComponentMaterials
}) => {
  const prevWorkOrdersLengthRef = useRef({});
  const isInitialMountRef = useRef(true);
  const [selectedComponent, setSelectedComponent] = useState(''); // Component selected at top
  const [showMaterialTypeModal, setShowMaterialTypeModal] = useState(false);
  const [savedComponents, setSavedComponents] = useState(new Set()); // Track which components are saved/done
  const [lastAddedMaterialIndex, setLastAddedMaterialIndex] = useState(null);
  const [scrollToMaterialIndex, setScrollToMaterialIndex] = useState(null); // Index to scroll to after removal
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'success' | 'error'

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

  // Reset save status when switching components
  useEffect(() => {
    setSaveStatus('idle');
  }, [selectedComponent]);


  // Handle bottom SAVE button - marks component as done
  const handleBottomSave = () => {
    if (!selectedComponent) {
      return;
    }
    
    // Validate component materials - this will set errors in state
    if (!validateComponentMaterials) {
      return;
    }
    
    const result = validateComponentMaterials(selectedComponent);

    if (!result || !result.isValid) {
      setSaveStatus('error');
      // Validation failed - errors are already set in state by validateComponentMaterials
      // Scroll to first error
      setTimeout(() => {
        const firstErrorKey = Object.keys(result?.errors || {})[0];
        if (firstErrorKey) {
          const selectors = [
            `[data-error-key="${firstErrorKey}"]`,
            `[name="${firstErrorKey}"]`,
            `#${firstErrorKey}`,
          ];
          
          let errorElement = null;
          for (const selector of selectors) {
            errorElement = document.querySelector(selector);
            if (errorElement) break;
          }
          
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (errorElement.tagName === 'INPUT' || errorElement.tagName === 'SELECT' || errorElement.tagName === 'TEXTAREA') {
              errorElement.focus();
            }
          }
        }
      }, 100);
      return;
    }

    // Validation passed - save the component
    setSaveStatus('success');
    setSavedComponents((prev) => new Set([...prev, selectedComponent]));
    if (handleSave) {
      handleSave(selectedComponent);
    }

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
              
              // Safety check: if still not found, use proper calculation
              if (actualIndex === -1) {
                console.warn('Could not find material index, recalculating:', material);
                // Don't use materialIndex as fallback - it's the filtered array index
                // Instead, recalculate using the filtered list approach
                const allMaterialsForComponent = formData.rawMaterials
                  .map((m, idx) => ({ m, idx }))
                  .filter(({ m }) => m.componentName === selectedComponent);
                
                if (materialIndex < allMaterialsForComponent.length) {
                  actualIndex = allMaterialsForComponent[materialIndex].idx;
                } else {
                  console.error('Cannot find material index even after recalculation. Skipping render.');
                  return null; // Skip rendering this material to prevent errors
                }
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
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
                          className="text-xs text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      )}
              </div>
              
              {/* Material Details */}
              <div className="flex flex-wrap items-start gap-6">
                <Field
                  label="MATERIAL TYPE"
                  width="sm"
                  error={errors[`rawMaterial_${actualIndex}_materialType`]}
                >
                  <SearchableDropdown
                    value={material.materialType || ''}
                    onChange={(selectedMaterialType) => {
                      handleRawMaterialChange(actualIndex, 'materialType', selectedMaterialType);
                      // Clear sub-material when material type changes
                      if (selectedMaterialType !== material.materialType) {
                        handleRawMaterialChange(actualIndex, 'subMaterial', '');
                      }
                    }}
                    options={['Fabric', 'Yarn', 'Trim & Accessory', 'Foam', 'Fiber']}
                    placeholder="select material"
                    className={errors[`rawMaterial_${actualIndex}_materialType`] ? 'border-destructive' : ''}
                  />
                </Field>

                {/* SUB-MATERIAL field - only show when materialType is Yarn */}
                {material.materialType === "Yarn" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      SUB-MATERIAL
                    </label>
                    <SearchableDropdown
                      value={material.subMaterial || ''}
                      onChange={(selectedSubMaterial) => {
                        handleRawMaterialChange(actualIndex, 'subMaterial', selectedSubMaterial);
                        // Clear yarn fields when sub-material changes to stitching thread
                        if (selectedSubMaterial === 'Stitching Thread') {
                          handleRawMaterialChange(actualIndex, 'fiberType', '');
                          handleRawMaterialChange(actualIndex, 'yarnType', '');
                        }
                      }}
                      options={['Stitching Thread']}
                      placeholder="Select sub-material (optional)"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    />
                  </div>
                )}

                <Field
                  label={
                    <>
                      MATERIAL DESC <span className="text-red-600">*</span>
                    </>
                  }
                  width="sm"
                  error={errors[`rawMaterial_${actualIndex}_materialDescription`]}
                >
                  <Input
                    type="text"
                    value={material.materialDescription}
                    onChange={(e) => {
                      handleRawMaterialChange(actualIndex, 'materialDescription', e.target.value);
                    }}
                    placeholder="e.g., Cotton 200TC"
                    required
                  />
                </Field>
                
                <Field
                  label={
                    <>
                      NET CNS/PC <span className="text-red-600">*</span>
                    </>
                  }
                  width="sm"
                  error={errors[`rawMaterial_${actualIndex}_netConsumption`]}
                >
                  <Input
                    type="number"
                    step="0.001"
                    value={material.netConsumption}
                    onChange={(e) => {
                      handleRawMaterialChange(actualIndex, 'netConsumption', e.target.value);
                      // Clear error when typing
                      if (errors[`rawMaterial_${actualIndex}_netConsumption`] && e.target.value.trim()) {
                        const newErrors = { ...errors };
                        delete newErrors[`rawMaterial_${actualIndex}_netConsumption`];
                      }
                    }}
                    placeholder="0.000"
                    required
                  />
                </Field>
                
                <Field
                  label={
                    <>
                      UNIT <span className="text-red-600">*</span>
                    </>
                  }
                  width="sm"
                  error={errors[`rawMaterial_${actualIndex}_unit`]}
                >
                  <SearchableDropdown
                    value={material.unit || ''}
                    onChange={(selectedValue) => {
                      handleRawMaterialChange(actualIndex, 'unit', selectedValue);
                    }}
                    options={['KGS', 'CM']}
                    placeholder="Select unit"
                    className={errors[`rawMaterial_${actualIndex}_unit`] ? 'border-destructive' : ''}
                    required
                  />
                </Field>
              </div>
              
              {/* Stitching Thread Section - only show when subMaterial is "Stitching Thread" */}
              {material.materialType === "Yarn" && material.subMaterial === "Stitching Thread" && (
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                  <h3 className="text-sm font-bold text-gray-800 mb-4">STITCHING THREAD SPECIFICATIONS</h3>
                  
                  <div style={{ marginTop: '24px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* TYPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.stitchingThreadType || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadType', value)}
                          options={['Spun Polyester', 'Cotton', 'Core Spun', 'Nylon/Polyamide', 'Textured', 'Bonded']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* FIBRE CONTENT */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FIBRE CONTENT</label>
                        <SearchableDropdown
                          value={material.stitchingThreadFibreContent || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadFibreContent', value)}
                          options={['100% Spun Poly', '100% Cotton', 'Poly/Cotton Core', '100% Nylon']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* COUNT/TICKET */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COUNT/TICKET</label>
                        <SearchableDropdown
                          value={material.stitchingThreadCountTicket || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadCountTicket', value)}
                          options={['Ticket No. (T-70)', '40/2', '60/3', '120/2', 'Metric (Nm)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* Use Type */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">Use Type</label>
                        <SearchableDropdown
                          value={material.stitchingThreadUseType || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadUseType', value)}
                          options={['Main Seam', 'Overlock', 'Embroidery', 'Top Stitch', 'Buttonhole', 'Bartack']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* TEX */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TEX</label>
                        <input
                          type="text"
                          value={material.stitchingThreadTex || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'stitchingThreadTex', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Enter TEX"
                        />
                      </div>

                      {/* PLY */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLY</label>
                        <SearchableDropdown
                          value={material.stitchingThreadPly || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadPly', value)}
                          options={['2 Ply', '3 Ply', '4 Ply']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* COLOUR */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <SearchableDropdown
                            value={material.stitchingThreadColour || ''}
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadColour', value)}
                            options={['Pantone TPX/TCX', 'Shade Card Reference', 'DTM']}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', flex: 1 }}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  handleRawMaterialChange(actualIndex, 'stitchingThreadColourRefImage', reader.result);
                                  handleRawMaterialChange(actualIndex, 'stitchingThreadColourRefFile', file);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id={`stitching-thread-colour-upload-${actualIndex}`}
                          />
                          <label
                            htmlFor={`stitching-thread-colour-upload-${actualIndex}`}
                            className="border-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-[#e5e7eb] hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
                            style={{ padding: '10px 14px', height: '44px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
                          >
                            UPLOAD
                          </label>
                        </div>
                        {material.stitchingThreadColourRefImage && (
                          <div style={{ marginTop: '8px' }}>
                            <img src={material.stitchingThreadColourRefImage} alt="Color reference" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px' }} />
                          </div>
                        )}
                      </div>

                      {/* REF */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REF</label>
                        <input
                          type="text"
                          value={material.stitchingThreadRef || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'stitchingThreadRef', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Enter reference"
                        />
                      </div>

                      {/* TESTING REQUIREMENTS - SearchableDropdown with text key (same as fiber) */}
                      <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
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
                            {(Array.isArray(material.stitchingThreadTestingRequirements) ? material.stitchingThreadTestingRequirements : []).map((req, index) => (
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
                                    const current = Array.isArray(material.stitchingThreadTestingRequirements) ? material.stitchingThreadTestingRequirements : [];
                                    const updated = current.filter((_, i) => i !== index);
                                    handleRawMaterialChange(actualIndex, 'stitchingThreadTestingRequirements', updated);
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
                              id={`stitching-thread-testing-wrapper-${actualIndex}`}
                              style={{ flex: 1, minWidth: '200px' }}
                            >
                              <SearchableDropdown
                                value=""
                                strictMode={false}
                                onChange={(selectedValue) => {
                                  const options = ['Tensile Strength', 'Elongation', 'Abrasion', 'Colour Fastness'];
                                  if (selectedValue && options.includes(selectedValue)) {
                                    const current = Array.isArray(material.stitchingThreadTestingRequirements) ? material.stitchingThreadTestingRequirements : [];
                                    if (!current.includes(selectedValue)) {
                                      const updated = [...current, selectedValue];
                                      handleRawMaterialChange(actualIndex, 'stitchingThreadTestingRequirements', updated);
                                    }
                                  }
                                }}
                                options={['Tensile Strength', 'Elongation', 'Abrasion', 'Colour Fastness']}
                                placeholder={(Array.isArray(material.stitchingThreadTestingRequirements) && material.stitchingThreadTestingRequirements.length === 0) ? "Select testing requirements" : "Add more..."}
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
                                      const current = Array.isArray(material.stitchingThreadTestingRequirements) ? material.stitchingThreadTestingRequirements : [];
                                      const options = ['Tensile Strength', 'Elongation', 'Abrasion', 'Colour Fastness'];
                                      if (!current.includes(newValue)) {
                                        if (!options.includes(newValue)) {
                                          const updated = [...current, newValue];
                                          handleRawMaterialChange(actualIndex, 'stitchingThreadTestingRequirements', updated);
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
                                    const options = ['Tensile Strength', 'Elongation', 'Abrasion', 'Colour Fastness'];
                                    if (!options.includes(typedValue)) {
                                      const current = Array.isArray(material.stitchingThreadTestingRequirements) ? material.stitchingThreadTestingRequirements : [];
                                      if (!current.includes(typedValue)) {
                                        const updated = [...current, typedValue];
                                        handleRawMaterialChange(actualIndex, 'stitchingThreadTestingRequirements', updated);
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

                      {/* QTY - Yardage (CNS) */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY - Yardage (CNS)</label>
                        <input
                          type="text"
                          value={material.stitchingThreadQtyYardage || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'stitchingThreadQtyYardage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Enter yardage"
                        />
                      </div>

                      {/* QTY - Kgs (CNS) */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY - Kgs (CNS)</label>
                        <input
                          type="text"
                          value={material.stitchingThreadQtyKgs || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'stitchingThreadQtyKgs', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Enter KGS"
                        />
                      </div>

                      {/* SURPLUS % */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={material.stitchingThreadSurplus || ''}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                              handleRawMaterialChange(actualIndex, 'stitchingThreadSurplus', numericValue);
                            }}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 32px 10px 14px', height: '44px', width: '100%' }}
                            placeholder=""
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
                            value={material.stitchingThreadWastage || ''}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                              handleRawMaterialChange(actualIndex, 'stitchingThreadWastage', numericValue);
                            }}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 32px 10px 14px', height: '44px', width: '100%' }}
                            placeholder=""
                          />
                          <span style={{ position: 'absolute', right: '14px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                        </div>
                      </div>

                      {/* APPROVAL */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.stitchingThreadApproval || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadApproval', value)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* REMARKS */}
                      <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <input
                          type="text"
                          value={material.stitchingThreadRemarks || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'stitchingThreadRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Enter remarks"
                        />
                      </div>
                    </div>

                    {/* ADV DATA Button and ADVANCE SPEC Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 w-full" style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => handleRawMaterialChange(actualIndex, 'showStitchingThreadAdvancedSpec', !material.showStitchingThreadAdvancedSpec)}
                        style={{
                          backgroundColor: material.showStitchingThreadAdvancedSpec ? '#667eea' : '#ffffff',
                          borderColor: material.showStitchingThreadAdvancedSpec ? '#667eea' : '#e5e7eb',
                          color: material.showStitchingThreadAdvancedSpec ? '#ffffff' : '#374151',
                          border: '2px solid',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: material.showStitchingThreadAdvancedSpec ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!material.showStitchingThreadAdvancedSpec) {
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!material.showStitchingThreadAdvancedSpec) {
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {material.showStitchingThreadAdvancedSpec ? '▼ ADVANCE SPEC' : '▶ ADVANCE SPEC'}
                      </button>
                      {material.showStitchingThreadAdvancedSpec && (
                        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                          <h4 className="text-sm font-semibold text-gray-800 mb-4">ADVANCE SPEC</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* FINISH */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                              <SearchableDropdown
                                value={material.stitchingThreadFinish || ''}
                                onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadFinish', value)}
                                options={['Bonded', 'Lubricated', 'Matte', 'Glossy', 'Mercerized', 'Soft']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>

                            {/* BRAND */}
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">BRAND</label>
                              <SearchableDropdown
                                value={material.stitchingThreadBrand || ''}
                                onChange={(value) => handleRawMaterialChange(actualIndex, 'stitchingThreadBrand', value)}
                                options={['Coats', 'A&E', 'Gunold', 'Madeira', 'Unbranded', 'Others']}
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
              )}

              {/* Fiber Type Hierarchy Dropdowns - only show when subMaterial is NOT "Stitching Thread" */}
              {material.materialType === "Yarn" && material.subMaterial !== "Stitching Thread" && (<>
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <h3 className="text-sm font-semibold text-foreground/90 mb-4">FIBER SPECIFICATIONS</h3>
                <div className="flex flex-wrap items-start" style={{ gap: '16px 12px' }}>
                  {/* Fiber Type Dropdown */}
                  <Field label="FIBER TYPE" width="sm">
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
                    />
                  </Field>
                  
                  {/* Yarn Type Dropdown */}
                  <Field label="YARN TYPE" width="sm">
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
                    />
                  </Field>
                </div>
                
                {/* Display Yarn Details when both Fiber Type and Yarn Type are selected */}
                {material.fiberType && material.yarnType && (() => {
                  const details = getYarnDetails(material.fiberType, material.yarnType);
                  if (!details) return null;
                  
                  return (
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                      <h4 className="text-sm font-semibold text-foreground/90 mb-6">YARN SPECIFICATIONS</h4>
                      
                      {/* Input Fields Row */}
                      <div className="flex flex-wrap items-start" style={{ gap: '16px 12px' }}>
                        <Field label="COMPOSITION" required width="sm">
                          <SearchableDropdown
                            value={material.yarnComposition || ''}
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'yarnComposition', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnCompositionOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Composition" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                          />
                        </Field>
                        
                        <Field label="COUNT RANGE" required width="sm">
                          <SearchableDropdown
                            value={material.yarnCountRange || ''}
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'yarnCountRange', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnCountRangeOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Count Range" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                          />
                        </Field>
                        
                        <Field label="DOUBLING OPTIONS" required width="sm">
                          <SearchableDropdown
                            value={material.yarnDoublingOptions || ''}
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'yarnDoublingOptions', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnDoublingOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Doubling Options" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                          />
                        </Field>
                        
                        <Field label="PLY OPTIONS" required width="sm">
                          <SearchableDropdown
                            value={material.yarnPlyOptions || ''}
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'yarnPlyOptions', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnPlyOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Ply Options" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                          />
                        </Field>
                        
                        <Field label="COUNT SYSTEM" width="sm">
                          <Input
                            type="text"
                            value={details.countSystem || ''}
                            readOnly
                            disabled
                            className="bg-muted cursor-not-allowed"
                          />
                        </Field>
                        
                        <Field label="WINDING OPTIONS" width="sm">
                          <SearchableDropdown
                            value={material.windingOptions || details.windingOptions || ''}
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'windingOptions', value)}
                            options={material.fiberType && material.yarnType 
                              ? getYarnWindingOptions(material.fiberType, material.yarnType)
                              : []}
                            placeholder={material.fiberType && material.yarnType ? "Select or type Winding Options" : "Select Yarn Type First"}
                            disabled={!material.fiberType || !material.yarnType}
                          />
                        </Field>
                        
                        <Field label="SURPLUS %" width="sm">
                          <PercentInput
                              value={material.surplus || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'surplus', e.target.value)}
                            placeholder="e.g., 5"
                          />
                        </Field>
                        
                        <Field label="WASTAGE %" width="sm">
                          <PercentInput
                            value={material.wastage || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'wastage', e.target.value)}
                            placeholder="e.g., 3"
                          />
                        </Field>
                        
                        <Field label="APPROVAL" width="sm">
                          <SearchableDropdown
                            value={material.approval || ''}
                            onChange={(value) => handleRawMaterialChange(actualIndex, 'approval', value)}
                            options={['BUYER\'S', 'PROTO', 'FIT', 'SIZE SET', 'PP', 'TOP SAMPLE']}
                            placeholder="Select or type Approval"
                          />
                        </Field>
                        
                        <Field label="REMARKS" width="sm">
                          <Input
                            type="text"
                            value={material.remarks || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'remarks', e.target.value)}
                            placeholder="Enter remarks"
                          />
                        </Field>
                      </div>
                      
                      {/* Show/Hide Advance Spec Button */}
                      <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                        <Button
                          type="button"
                          variant={material.showAdvancedFilter ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRawMaterialChange(actualIndex, 'showAdvancedFilter', !material.showAdvancedFilter)}
                        >
                          Advance Spec
                        </Button>
                      </div>
                      
                      {/* Advanced Filter UI Table */}
                      {material.showAdvancedFilter && (
                        <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
                            {/* Spinning Type - Searchable dropdown */}
                            <Field label="SPINNING TYPE" width="sm">
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
                              />
                            </Field>
                            
                            {/* Testing Requirements */}
                            <Field label="TESTING REQ." width="sm">
                              <Input
                                type="text"
                                value={material.testingRequirements || ''}
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'testingRequirements', e.target.value)}
                                placeholder="Enter testing requirements"
                              />
                            </Field>
                            
                            {/* Fiber Category - Searchable dropdown */}
                            <Field label="FIBER CATEGORY" width="sm">
                              <SearchableDropdown
                                value={material.fiberCategory || ''}
                                onChange={(value) => handleRawMaterialChange(actualIndex, 'fiberCategory', value)}
                                options={FIBER_CATEGORIES}
                                placeholder="Select or type Fiber Category"
                              />
                            </Field>
                            
                            {/* Origin - Searchable dropdown */}
                            <Field label="ORIGIN" width="sm">
                              <SearchableDropdown
                                value={material.origin || ''}
                                onChange={(value) => handleRawMaterialChange(actualIndex, 'origin', value)}
                                options={ORIGINS}
                                placeholder="Select or type Origin"
                              />
                            </Field>
                            
                            {/* Certifications (Text Input) */}
                            <Field label="CERTIFICATIONS" width="lg" className="col-span-1 md:col-span-2 lg:col-span-2">
                              <Input
                                type="text"
                                value={material.certifications || ''}
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'certifications', e.target.value)}
                                placeholder="Enter certificate label"
                              />
                            </Field>
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
            <div style={{ marginTop: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 className="text-sm font-semibold text-foreground/90">FABRIC SPECIFICATIONS</h3>
              </div>
              
              <div className="bg-card rounded-lg border border-border" style={{ padding: '1.25rem' }}>
                {/* Fiber Type and Fabric Name */}
                <div className="flex flex-wrap items-start" style={{ gap: '16px 12px', marginBottom: '1rem' }}>
                  {/* Fiber Type */}
                  <Field label="FIBER TYPE" required width="sm">
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
                    />
                  </Field>
                  
                  {/* Fabric Name */}
                  <Field label="FABRIC NAME" required width="sm">
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
                    />
                  </Field>
                  
                  {/* Composition */}
                  <Field label="COMPOSITION" required width="sm">
                    <SearchableDropdown
                      value={material.fabricComposition || ''}
                      onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricComposition', value)}
                      options={material.fabricFiberType && material.fabricName 
                        ? getFabricCompositionOptions(material.fabricFiberType, material.fabricName)
                        : []}
                      placeholder={material.fabricFiberType && material.fabricName ? "Select or type Composition" : "Select Fabric First"}
                      disabled={!material.fabricFiberType || !material.fabricName}
                    />
                  </Field>
                  
                  {/* GSM */}
                  <Field label="GSM" width="sm">
                    <Input
                      type="text"
                      value={material.gsm || ''}
                      onChange={(e) => handleRawMaterialChange(actualIndex, 'gsm', e.target.value)}
                      placeholder="e.g., 90"
                    />
                  </Field>
                  
                  {/* Surplus */}
                  <Field label="SURPLUS %" width="sm">
                    <PercentInput
                        value={material.fabricSurplus || ''}
                      onChange={(e) => handleRawMaterialChange(actualIndex, 'fabricSurplus', e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </Field>
                  
                  {/* Wastage */}
                  <Field label="WASTAGE %" width="sm">
                    <PercentInput
                      value={material.fabricWastage || ''}
                      onChange={(e) => handleRawMaterialChange(actualIndex, 'fabricWastage', e.target.value)}
                      placeholder="e.g., 3"
                    />
                  </Field>
                  
                  {/* Approval */}
                  <Field label="APPROVAL" width="sm">
                    <SearchableDropdown
                      value={material.fabricApproval || ''}
                      onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricApproval', value)}
                      options={material.fabricFiberType && material.fabricName 
                        ? getFabricApprovalOptions(material.fabricFiberType, material.fabricName)
                        : []}
                      placeholder={material.fabricFiberType && material.fabricName ? "Select or type Approval" : "Select Fabric First"}
                      disabled={!material.fabricFiberType || !material.fabricName}
                    />
                  </Field>
                  
                  {/* Remarks */}
                  <Field label="REMARKS" width="sm">
                    <Input
                      type="text"
                      value={material.fabricRemarks || ''}
                      onChange={(e) => handleRawMaterialChange(actualIndex, 'fabricRemarks', e.target.value)}
                      placeholder="Text"
                    />
                  </Field>
                </div>
                
                {/* Show/Hide Advance Spec Button */}
                <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                  <Button
                    type="button"
                    variant={material.showFabricAdvancedFilter ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRawMaterialChange(actualIndex, 'showFabricAdvancedFilter', !material.showFabricAdvancedFilter)}
                  >
                    Advance Spec
                  </Button>
                </div>
                
                {/* Advanced Filter UI Table */}
                {material.showFabricAdvancedFilter && (
                  <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
                      {/* Construction Type - Searchable dropdown */}
                      <Field label="CONSTRUCTION TYPE" width="sm">
                        <SearchableDropdown
                          value={material.constructionType || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'constructionType', value)}
                          options={material.fabricFiberType && material.fabricName 
                            ? getFabricConstructionTypeOptions(material.fabricFiberType, material.fabricName)
                            : []}
                          placeholder={material.fabricFiberType && material.fabricName ? "Select or type Construction Type" : "Select Fabric First"}
                          disabled={!material.fabricFiberType || !material.fabricName}
                        />
                      </Field>
                      
                      {/* Weave/Knit Type - Searchable dropdown */}
                      <Field label="WEAVE/KNIT TYPE" width="sm">
                        <SearchableDropdown
                          value={material.weaveKnitType || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'weaveKnitType', value)}
                          options={material.fabricFiberType && material.fabricName 
                            ? getFabricWeaveKnitTypeOptions(material.fabricFiberType, material.fabricName)
                            : []}
                          placeholder={material.fabricFiberType && material.fabricName ? "Select or type Weave/Knit Type" : "Select Fabric First"}
                          disabled={!material.fabricFiberType || !material.fabricName}
                        />
                      </Field>
                      
                      {/* Machine Type */}
                      <Field label="MACHINE TYPE" width="sm">
                        <SearchableDropdown
                          value={material.fabricMachineType || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricMachineType', value)}
                          options={['Powerloom', 'Handloom', 'Circular Knitting', 'Flatbed Knitting', 'Warp Knitting', 'Others']}
                          placeholder="Select or type Machine Type"
                        />
                      </Field>
                      
                      {/* Testing Requirements */}
                      <Field label="TESTING REQ." width="sm">
                        <Input
                          type="text"
                          value={material.fabricTestingRequirements || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'fabricTestingRequirements', e.target.value)}
                          placeholder="Enter testing requirements"
                        />
                      </Field>
                      
                      {/* Fiber Category - Searchable dropdown */}
                      <Field label="FIBER CATEGORY" width="sm">
                        <SearchableDropdown
                          value={material.fabricFiberCategory || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricFiberCategory', value)}
                          options={FIBER_CATEGORIES}
                          placeholder="Select or type Fiber Category"
                        />
                      </Field>
                      
                      {/* Origin - Searchable dropdown */}
                      <Field label="ORIGIN" width="sm">
                        <SearchableDropdown
                          value={material.fabricOrigin || ''}
                          onChange={(value) => handleRawMaterialChange(actualIndex, 'fabricOrigin', value)}
                          options={ORIGINS}
                          placeholder="Select or type Origin"
                        />
                      </Field>
                      
                      {/* Certifications (Text Input) - spans 2 columns on large screens */}
                      <Field label="CERTIFICATIONS" width="sm" className="col-span-1 md:col-span-2 lg:col-span-2">
                        <Input
                          type="text"
                          value={material.fabricCertifications || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'fabricCertifications', e.target.value)}
                          placeholder="Enter certificate label"
                        />
                      </Field>
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
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 className="text-sm font-semibold text-foreground/90">FOAM SPECIFICATIONS</h3>
                  </div>
                  
                  <div className="bg-card rounded-lg border border-border" style={{ padding: '1.25rem' }}>
                    {/* Table Selection Dropdown */}
                    <Field label="SELECT FOAM TABLE" width="sm" style={{ marginBottom: '1.5rem' }}>
                      <SearchableDropdown
                        value={material.foamTableType || ''}
                        onChange={(selectedValue) => {
                          handleRawMaterialChange(actualIndex, 'foamTableType', selectedValue);
                          // Clear all foam fields when table changes
                          if (selectedValue !== material.foamTableType) {
                            handleRawMaterialChange(actualIndex, 'foamType', '');
                            handleRawMaterialChange(actualIndex, 'foamSubtype', '');
                            handleRawMaterialChange(actualIndex, 'foamVaContent', '');
                            handleRawMaterialChange(actualIndex, 'foamColour', '');
                            handleRawMaterialChange(actualIndex, 'foamThickness', '');
                            handleRawMaterialChange(actualIndex, 'foamShape', '');
                            handleRawMaterialChange(actualIndex, 'foamShapeRefImage', null);
                            handleRawMaterialChange(actualIndex, 'foamSheetPcs', '');
                            handleRawMaterialChange(actualIndex, 'foamGsm', '');
                            handleRawMaterialChange(actualIndex, 'foamLengthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamWidthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamKgsCns', '');
                            handleRawMaterialChange(actualIndex, 'foamYardageCns', '');
                            handleRawMaterialChange(actualIndex, 'foamTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'foamTestingRequirementsFile', null);
                            handleRawMaterialChange(actualIndex, 'foamSurplus', '');
                            handleRawMaterialChange(actualIndex, 'foamWastage', '');
                            handleRawMaterialChange(actualIndex, 'foamApproval', '');
                            handleRawMaterialChange(actualIndex, 'foamRemarks', '');
                            handleRawMaterialChange(actualIndex, 'showFoamAdvancedSpec', false);
                            handleRawMaterialChange(actualIndex, 'foamShoreHardness', '');
                            handleRawMaterialChange(actualIndex, 'foamCellStructure', '');
                            handleRawMaterialChange(actualIndex, 'foamCompressionSet', '');
                            handleRawMaterialChange(actualIndex, 'foamTensileStrength', '');
                            handleRawMaterialChange(actualIndex, 'foamElongation', '');
                            handleRawMaterialChange(actualIndex, 'foamWaterResistance', '');
                            handleRawMaterialChange(actualIndex, 'foamUvResistance', '');
                            handleRawMaterialChange(actualIndex, 'foamFireRetardant', '');
                            handleRawMaterialChange(actualIndex, 'foamSurfaceTexture', '');
                            handleRawMaterialChange(actualIndex, 'foamAntiSlip', '');
                            handleRawMaterialChange(actualIndex, 'foamInterlocking', '');
                            handleRawMaterialChange(actualIndex, 'foamCertification', '');
                            handleRawMaterialChange(actualIndex, 'foamDensity', '');
                            handleRawMaterialChange(actualIndex, 'foamHrGrade', '');
                            handleRawMaterialChange(actualIndex, 'foamHrIld', '');
                            handleRawMaterialChange(actualIndex, 'foamHrSupportFactor', '');
                            handleRawMaterialChange(actualIndex, 'foamHrResilience', '');
                            handleRawMaterialChange(actualIndex, 'foamHrFatigueResistance', '');
                            handleRawMaterialChange(actualIndex, 'foamHrTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'foamPeEpeType', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeSubtype', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeColour', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeThickness', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeShape', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeShapeRefImage', null);
                            handleRawMaterialChange(actualIndex, 'foamPeEpeSheetPcs', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeGsm', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeLengthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeWidthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeKgsCns', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeYardageCns', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'foamPeEpeTestingRequirementsFile', null);
                            handleRawMaterialChange(actualIndex, 'foamPeEpeSurplus', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeWastage', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeApproval', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeRemarks', '');
                            handleRawMaterialChange(actualIndex, 'showFoamPeEpeAdvancedSpec', false);
                            handleRawMaterialChange(actualIndex, 'foamPeEpeCellStructure', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeLamination', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeCrossLinked', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeAntiStatic', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeWaterResistance', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeCushioning', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeFireRetardant', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeThermalInsulation', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeCertification', '');
                            handleRawMaterialChange(actualIndex, 'foamPeEpeDensity', '');
                            handleRawMaterialChange(actualIndex, 'foamPuType', '');
                            handleRawMaterialChange(actualIndex, 'foamPuSubtype', '');
                            handleRawMaterialChange(actualIndex, 'foamPuGrade', '');
                            handleRawMaterialChange(actualIndex, 'foamPuColour', '');
                            handleRawMaterialChange(actualIndex, 'foamPuThickness', '');
                            handleRawMaterialChange(actualIndex, 'foamPuShape', '');
                            handleRawMaterialChange(actualIndex, 'foamPuShapeRefImage', null);
                            handleRawMaterialChange(actualIndex, 'foamPuSheetPcs', '');
                            handleRawMaterialChange(actualIndex, 'foamPuGsm', '');
                            handleRawMaterialChange(actualIndex, 'foamPuLengthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamPuWidthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamPuKgsCns', '');
                            handleRawMaterialChange(actualIndex, 'foamPuYardageCns', '');
                            handleRawMaterialChange(actualIndex, 'foamPuTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'foamPuTestingRequirementsFile', null);
                            handleRawMaterialChange(actualIndex, 'foamPuSurplus', '');
                            handleRawMaterialChange(actualIndex, 'foamPuWastage', '');
                            handleRawMaterialChange(actualIndex, 'foamPuApproval', '');
                            handleRawMaterialChange(actualIndex, 'foamPuRemarks', '');
                            handleRawMaterialChange(actualIndex, 'showFoamPuAdvancedSpec', false);
                            handleRawMaterialChange(actualIndex, 'foamPuIld', '');
                            handleRawMaterialChange(actualIndex, 'foamPuSupportFactor', '');
                            handleRawMaterialChange(actualIndex, 'foamPuResilience', '');
                            handleRawMaterialChange(actualIndex, 'foamPuCellStructure', '');
                            handleRawMaterialChange(actualIndex, 'foamPuCompressionSet', '');
                            handleRawMaterialChange(actualIndex, 'foamPuTensileStrength', '');
                            handleRawMaterialChange(actualIndex, 'foamPuElongation', '');
                            handleRawMaterialChange(actualIndex, 'foamPuFireRetardant', '');
                            handleRawMaterialChange(actualIndex, 'foamPuAntiMicrobial', '');
                            handleRawMaterialChange(actualIndex, 'foamPuDensity', '');
                            handleRawMaterialChange(actualIndex, 'foamPuCertification', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedType', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedSubtype', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedChipSource', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedChipSize', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedBonding', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedColour', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedThickness', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedShape', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedShapeRefImage', null);
                            handleRawMaterialChange(actualIndex, 'foamRebondedSheetPcs', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedGsm', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedLengthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedWidthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedKgsCns', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedYardageCns', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'foamRebondedTestingRequirementsFile', null);
                            handleRawMaterialChange(actualIndex, 'foamRebondedSurplus', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedWastage', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedApproval', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedRemarks', '');
                            handleRawMaterialChange(actualIndex, 'showFoamRebondedAdvancedSpec', false);
                            handleRawMaterialChange(actualIndex, 'foamRebondedIld', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedCompressionSet', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedFireRetardant', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedCertification', '');
                            handleRawMaterialChange(actualIndex, 'foamRebondedDensity', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedType', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedBaseFoam', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedGelType', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedGelContent', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedSubtype', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedColour', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedThickness', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedShape', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedShapeRefImage', null);
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedSheetPcs', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedGsm', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedLengthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedWidthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedKgsCns', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedYardageCns', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedTestingRequirementsFile', null);
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedSurplus', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedWastage', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedApproval', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedRemarks', '');
                            handleRawMaterialChange(actualIndex, 'showFoamGelInfusedAdvancedSpec', false);
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedDensity', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedIld', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedTemperatureRegulation', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedResponseTime', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedBreathability', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedFireRetardant', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedCoolingEffect', '');
                            handleRawMaterialChange(actualIndex, 'foamGelInfusedCertification', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexType', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexLatexType', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexNaturalContent', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexProcess', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexSubtype', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexColour', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexThickness', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexShape', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexShapeRefImage', null);
                            handleRawMaterialChange(actualIndex, 'foamLatexSheetPcs', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexGsm', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexLengthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexWidthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexKgsCns', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexYardageCns', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'foamLatexTestingRequirementsFile', null);
                            handleRawMaterialChange(actualIndex, 'foamLatexSurplus', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexWastage', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexApproval', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexRemarks', '');
                            handleRawMaterialChange(actualIndex, 'showFoamLatexAdvancedSpec', false);
                            handleRawMaterialChange(actualIndex, 'foamLatexIld', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexResilience', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexCompressionSet', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexPincorePattern', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexZoneConfiguration', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexBreathability', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexHypoallergenic', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexAntiMicrobial', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexFireRetardant', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexDensity', '');
                            handleRawMaterialChange(actualIndex, 'foamLatexCertification', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryType', '');
                            handleRawMaterialChange(actualIndex, 'foamMemorySubtype', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryGrade', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryColour', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryThickness', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryShape', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryShapeRefImage', null);
                            handleRawMaterialChange(actualIndex, 'foamMemorySheetPcs', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryGsm', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryLengthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryWidthCm', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryKgsCns', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryYardageCns', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryTestingRequirements', []);
                            handleRawMaterialChange(actualIndex, 'foamMemoryTestingRequirementsFile', null);
                            handleRawMaterialChange(actualIndex, 'foamMemorySurplus', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryWastage', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryApproval', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryRemarks', '');
                            handleRawMaterialChange(actualIndex, 'showFoamMemoryAdvancedSpec', false);
                            handleRawMaterialChange(actualIndex, 'foamMemoryIld', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryResponseTime', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryTemperatureSensitivity', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryActivationTemperature', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryCompressionSet', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryResilience', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryBreathability', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryInfusion', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryCoolingTechnology', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryFireRetardant', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryVocEmissions', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryDensity', '');
                            handleRawMaterialChange(actualIndex, 'foamMemoryCertification', '');

                          }
                        }}
                        options={['EVA-form','HR-form','pe-epe','pu-foam','rebonded-foam','gel-infused-foam','latex-foam','memory-foam']}
                        placeholder="Select foam table"
                      />
                    </Field>

                    {/* EVA-form Table */}
                    {material.foamTableType === 'EVA-form' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
                      {/* FOAM TYPE */}
                      <Field label="FOAM TYPE" width="sm">
                        <SearchableDropdown
                          value={material.foamType || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamType', selectedValue)}
                          options={['EVA Foam (Ethylene Vinyl Acetate)']}
                          placeholder="Select or type"
                        />
                      </Field>

                      {/* SUBTYPE */}
                      <Field label="SUBTYPE" width="sm">
                        <SearchableDropdown
                          value={material.foamSubtype || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamSubtype', selectedValue)}
                          options={['Virgin EVA', 'Recycled EVA', 'Blended']}
                          placeholder="Select or type"
                        />
                      </Field>

                      {/* VA CONTENT */}
                      <Field label="VA CONTENT" width="sm">
                        <SearchableDropdown
                          value={material.foamVaContent || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamVaContent', selectedValue)}
                          options={['18%', '25%', '28%', '33%']}
                          placeholder="Select or type"
                        />
                      </Field>

                      {/* COLOUR */}
                      <Field label="COLOUR" width="sm">
                        <SearchableDropdown
                          value={material.foamColour || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamColour', selectedValue)}
                          options={['Black', 'White', 'Grey', 'Red', 'Blue', 'Green', 'Custom']}
                          placeholder="Select or type"
                        />
                      </Field>

                      {/* THICKNESS */}
                      <Field label="THICKNESS" width="sm">
                        <SearchableDropdown
                          value={material.foamThickness || ''}
                          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamThickness', selectedValue)}
                          options={['2mm', '3mm', '5mm', '10mm', '15mm', '20mm', '25mm']}
                          placeholder="Select or type"
                        />
                      </Field>

                      {/* SHAPE */}
                      <Field label="SHAPE" width="sm">
                        <Input
                          type="text"
                          value={material.foamShape || ''}
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamShape', e.target.value)}
                          placeholder="TEXT"
                        />
                      </Field>

                      {/* UPLOAD REF IMAGE */}
                      <Field label="UPLOAD REF IMAGE" width="sm">
                        <input
                          type="file"
                          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamShapeRefImage', e.target.files[0])}
                          className="hidden"
                          id={`upload-foam-shape-${actualIndex}`}
                          accept="image/*"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-11 w-full"
                          onClick={() => document.getElementById(`upload-foam-shape-${actualIndex}`)?.click()}
                        >
                          {material.foamShapeRefImage ? 'UPLOADED' : 'UPLOAD REF IMAGE'}
                        </Button>
                      </Field>

                      {/* SIZE SPEC */}
                      <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }} className="col-span-1 md:col-span-2 lg:col-span-5">
                        <h4 className="text-sm font-semibold text-foreground/90 mb-4">SIZE SPEC</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
                          <Field label="SHEET/PCS" width="sm">
                            <Input
                              type="text"
                              value={material.foamSheetPcs || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamSheetPcs', e.target.value)}
                              placeholder="Enter value"
                            />
                          </Field>
                          <Field label="GSM" width="sm">
                            <Input
                              type="text"
                              value={material.foamGsm || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGsm', e.target.value)}
                              placeholder="Enter value"
                            />
                          </Field>
                          <Field label="LENGTH (CM)" width="sm">
                            <Input
                              type="text"
                              value={material.foamLengthCm || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLengthCm', e.target.value)}
                              placeholder="Enter value"
                            />
                          </Field>
                          <Field label="WIDTH (CM)" width="sm">
                            <Input
                              type="text"
                              value={material.foamWidthCm || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamWidthCm', e.target.value)}
                              placeholder="Enter value"
                            />
                          </Field>
                        </div>
                      </div>

                      {/* QTY - KGS and YARDAGE */}
                      <div style={{ marginTop: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
                        <h4 className="text-sm font-semibold text-foreground/90 mb-4">QTY</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
                          <Field label="KGS (CNS)" width="sm">
                            <Input
                              type="text"
                              value={material.foamKgsCns || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamKgsCns', e.target.value)}
                              placeholder="Enter value"
                            />
                          </Field>
                          <Field label="YARDAGE (CNS)" width="sm">
                            <Input
                              type="text"
                              value={material.foamYardageCns || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamYardageCns', e.target.value)}
                              placeholder="Enter value"
                            />
                          </Field>
                        </div>
                      </div>

                      {/* TESTING REQUIREMENTS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5" style={{ gap: '16px 12px', marginTop: '1.25rem' }}>
                        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="flex items-center" style={{ gap: '0.75rem' }}>
                            <div className="flex-1">
                              <TestingRequirementsInput
                                value={material.foamTestingRequirements || []}
                                onChange={(values) => handleRawMaterialChange(actualIndex, 'foamTestingRequirements', values)}
                                options={['Density', 'Shore Hardness', 'Compression Set', 'Tensile Strength']}
                                placeholder="Type to search or select testing requirements..."
                              />
                            </div>
                            <input
                              type="file"
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamTestingRequirementsFile', e.target.files[0])}
                              className="hidden"
                              id={`upload-foam-testing-${actualIndex}`}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11"
                              onClick={() => document.getElementById(`upload-foam-testing-${actualIndex}`)?.click()}
                            >
                              {material.foamTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </div>
                        </Field>

                        {/* SURPLUS % */}
                        <Field label="SURPLUS %" width="sm">
                          <PercentInput
                            value={material.foamSurplus || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamSurplus', e.target.value)}
                            placeholder="e.g., 3-5"
                          />
                        </Field>

                        {/* WASTAGE % */}
                        <Field label="WASTAGE %" width="sm">
                          <div className="relative">
                            <SearchableDropdown
                              value={material.foamWastage || ''}
                              onChange={(selectedValue) => {
                                const predefinedOptions = ['Yoga Mats', 'Packaging', 'Insoles', 'Craft', 'Protective Cases'];
                                if (predefinedOptions.includes(selectedValue)) {
                                  handleRawMaterialChange(actualIndex, 'foamWastage', selectedValue);
                                } else {
                                  const numericValue = selectedValue.replace(/[^0-9.]/g, '');
                                  handleRawMaterialChange(actualIndex, 'foamWastage', numericValue);
                                }
                              }}
                              options={['Yoga Mats', 'Packaging', 'Insoles', 'Craft', 'Protective Cases']}
                              placeholder="Select or type %"
                              className={material.foamWastage && !['Yoga Mats', 'Packaging', 'Insoles', 'Craft', 'Protective Cases'].includes(material.foamWastage) ? 'pr-10' : ''}
                            />
                            {material.foamWastage && !['Yoga Mats', 'Packaging', 'Insoles', 'Craft', 'Protective Cases'].includes(material.foamWastage) && (
                              <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', userSelect: 'none', zIndex: 10 }}>%</span>
                            )}
                          </div>
                        </Field>

                        {/* APPROVAL */}
                        <Field label="APPROVAL" width="sm">
                          <SearchableDropdown
                            value={material.foamApproval || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                          />
                        </Field>

                        {/* REMARKS */}
                        <Field label="REMARKS" width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Input
                            type="text"
                            value={material.foamRemarks || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRemarks', e.target.value)}
                            placeholder="Higher VA%=softer, Interlocking for gym flooring, Closed cell=waterproof"
                          />
                        </Field>
                      </div>

                      {/* Show/Hide Advance Spec Button */}
                      <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
                        <Button
                          type="button"
                          variant={material.showFoamAdvancedSpec ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRawMaterialChange(actualIndex, 'showFoamAdvancedSpec', !material.showFoamAdvancedSpec)}
                        >
                          Advance Spec
                        </Button>
                      </div>

                      {/* Advanced Filter UI Table */}
                      {material.showFoamAdvancedSpec && (
                        <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', border: '1px solid var(--border)' }} className="col-span-1 md:col-span-2 lg:col-span-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
                            <Field label="SHORE HARDNESS" width="sm">
                              <SearchableDropdown
                                value={material.foamShoreHardness || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamShoreHardness', selectedValue)}
                                options={['25A Soft', '35A Medium', '45A Firm', '55A+ Hard']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="CELL STRUCTURE" width="sm">
                              <SearchableDropdown
                                value={material.foamCellStructure || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamCellStructure', selectedValue)}
                                options={['Closed Cell']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="COMPRESSION SET" width="sm">
                              <SearchableDropdown
                                value={material.foamCompressionSet || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamCompressionSet', selectedValue)}
                                options={['Compression Set %']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="TENSILE STRENGTH" width="sm">
                              <SearchableDropdown
                                value={material.foamTensileStrength || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamTensileStrength', selectedValue)}
                                options={['Tensile Strength (MPa)']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="ELONGATION" width="sm">
                              <SearchableDropdown
                                value={material.foamElongation || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamElongation', selectedValue)}
                                options={['Elongation at Break (%)']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="WATER RESISTANCE" width="sm">
                              <SearchableDropdown
                                value={material.foamWaterResistance || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamWaterResistance', selectedValue)}
                                options={['Excellent']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="UV RESISTANCE" width="sm">
                              <SearchableDropdown
                                value={material.foamUvResistance || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamUvResistance', selectedValue)}
                                options={['Standard', 'UV Stabilized']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="FIRE RETARDANT" width="sm">
                              <SearchableDropdown
                                value={material.foamFireRetardant || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamFireRetardant', selectedValue)}
                                options={['Standard', 'FR Treated']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="SURFACE TEXTURE" width="sm">
                              <SearchableDropdown
                                value={material.foamSurfaceTexture || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamSurfaceTexture', selectedValue)}
                                options={['Smooth', 'Textured (anti-slip)', 'Fabric Laminated', 'Leather-Look']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="ANTI-SLIP" width="sm">
                              <SearchableDropdown
                                value={material.foamAntiSlip || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamAntiSlip', selectedValue)}
                                options={['Standard', 'Anti-Slip Surface Treatment']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="INTERLOCKING" width="sm">
                              <SearchableDropdown
                                value={material.foamInterlocking || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamInterlocking', selectedValue)}
                                options={['None', 'Interlocking Edges (puzzle pattern)']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="CERTIFICATION" width="sm">
                              <SearchableDropdown
                                value={material.foamCertification || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamCertification', selectedValue)}
                                options={['REACH Compliant', 'Phthalate-Free', 'OEKO-TEX']}
                                placeholder="Select or type"
                              />
                            </Field>
                            <Field label="DENSITY" width="sm">
                              <SearchableDropdown
                                value={material.foamDensity || ''}
                                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamDensity', selectedValue)}
                                options={['30 kg/m³', '45 kg/m³', '60 kg/m³', '90 kg/m³', '120 kg/m³']}
                                placeholder="Select or type"
                              />
                            </Field>
                          </div>
                        </div>
                      )}
                    </div>
                    )}



{/* pe-epe Table */}
{material.foamTableType === 'pe-epe' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
    {/* FOAM TYPE */}
    <Field label="FOAM TYPE" width="sm">
      <SearchableDropdown
        value={material.foamPeEpeType || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeType', selectedValue)}
        options={['PE Foam', 'EPE Foam (Expanded Polyethylene)']}
        placeholder="Select or type"
      />
    </Field>

    {/* SUBTYPE */}
    <Field label="SUBTYPE" width="sm">
      <SearchableDropdown
        value={material.foamPeEpeSubtype || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeSubtype', selectedValue)}
        options={['Virgin PE', 'Recycled PE', 'Cross-Linked PE (XLPE)']}
        placeholder="Select or type"
      />
    </Field>

    {/* COLOUR */}
    <Field label="COLOUR" width="sm">
      <SearchableDropdown
        value={material.foamPeEpeColour || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeColour', selectedValue)}
        options={['White (standard)', 'Black', 'Pink (anti-static)', 'Blue', 'Custom']}
        placeholder="Select or type"
      />
    </Field>

    {/* THICKNESS */}
    <Field label="THICKNESS" width="sm">
      <Input
        type="text"
        value={material.foamPeEpeThickness || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeThickness', e.target.value)}
        placeholder="MM (e.g., 0.5mm, 1mm, 2mm, 3mm, 5mm, 10mm, 20mm, 50mm)"
      />
    </Field>

    {/* SHAPE */}
    <Field label="SHAPE" width="sm">
      <Input
        type="text"
        value={material.foamPeEpeShape || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeShape', e.target.value)}
        placeholder="TEXT"
      />
    </Field>

    {/* UPLOAD REF IMAGE */}
    <Field label="UPLOAD REF IMAGE" width="sm">
      <input
        type="file"
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeShapeRefImage', e.target.files[0])}
        className="hidden"
        id={`upload-pe-epe-foam-shape-${actualIndex}`}
        accept="image/*"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-11 w-full"
        onClick={() => document.getElementById(`upload-pe-epe-foam-shape-${actualIndex}`)?.click()}
      >
        {material.foamPeEpeShapeRefImage ? 'UPLOADED' : 'UPLOAD REF IMAGE'}
      </Button>
    </Field>

    {/* SIZE SPEC */}
    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }} className="col-span-1 md:col-span-2 lg:col-span-5">
      <h4 className="text-sm font-semibold text-foreground/90 mb-4">SIZE SPEC</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
        <Field label="SHEET/PCS" width="sm">
          <Input
            type="text"
            value={material.foamPeEpeSheetPcs || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeSheetPcs', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="GSM" width="sm">
          <Input
            type="text"
            value={material.foamPeEpeGsm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeGsm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="LENGTH (CM)" width="sm">
          <Input
            type="text"
            value={material.foamPeEpeLengthCm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeLengthCm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="WIDTH (CM)" width="sm">
          <Input
            type="text"
            value={material.foamPeEpeWidthCm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeWidthCm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
      </div>
    </div>

    {/* QTY - KGS and YARDAGE */}
    <div style={{ marginTop: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
      <h4 className="text-sm font-semibold text-foreground/90 mb-4">QTY</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
        <Field label="KGS (CNS)" width="sm">
          <Input
            type="text"
            value={material.foamPeEpeKgsCns || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeKgsCns', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="YARDAGE (CNS)" width="sm">
          <Input
            type="text"
            value={material.foamPeEpeYardageCns || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeYardageCns', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
      </div>
    </div>

    {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5" style={{ gap: '16px 12px', marginTop: '1.25rem' }}>
      {/* TESTING REQ. */}
      <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
        <div className="flex items-center" style={{ gap: '0.75rem' }}>
          <div className="flex-1">
            <TestingRequirementsInput
              value={material.foamPeEpeTestingRequirements || []}
              onChange={(values) => handleRawMaterialChange(actualIndex, 'foamPeEpeTestingRequirements', values)}
              options={['Density', 'Compression', 'Water Absorption', 'Thermal Conductivity']}
              placeholder="Type to search or select testing requirements..."
            />
          </div>
          <input
            type="file"
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeTestingRequirementsFile', e.target.files[0])}
            className="hidden"
            id={`upload-pe-epe-testing-${actualIndex}`}
            accept="image/*"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11"
            onClick={() => document.getElementById(`upload-pe-epe-testing-${actualIndex}`)?.click()}
          >
            {material.foamPeEpeTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}
          </Button>
        </div>
      </Field>

    {/* SURPLUS % */}
    <Field label="SURPLUS %" width="sm">
      <PercentInput
        value={material.foamPeEpeSurplus || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeSurplus', e.target.value)}
        placeholder="e.g., 3-5"
      />
    </Field>

    {/* WASTAGE % */}
    <Field label="WASTAGE %" width="sm">
      <div className="relative">
        <SearchableDropdown
          value={material.foamPeEpeWastage || ''}
          onChange={(selectedValue) => {
            const predefinedOptions = ['Packaging', 'Insulation', 'Protective Wrap', 'Underlayment'];
            if (predefinedOptions.includes(selectedValue)) {
              handleRawMaterialChange(actualIndex, 'foamPeEpeWastage', selectedValue);
            } else {
              const numericValue = selectedValue.replace(/[^0-9.]/g, '');
              handleRawMaterialChange(actualIndex, 'foamPeEpeWastage', numericValue);
            }
          }}
          options={['Packaging', 'Insulation', 'Protective Wrap', 'Underlayment']}
          placeholder="Select or type %"
          className={
            material.foamPeEpeWastage &&
            !['Packaging', 'Insulation', 'Protective Wrap', 'Underlayment'].includes(material.foamPeEpeWastage)
              ? 'pr-10'
              : ''
          }
        />
        {material.foamPeEpeWastage &&
          !['Packaging', 'Insulation', 'Protective Wrap', 'Underlayment'].includes(material.foamPeEpeWastage) && (
            <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', userSelect: 'none', zIndex: 10 }}>%</span>
          )}
      </div>
    </Field>

      {/* APPROVAL */}
      <Field label="APPROVAL" width="sm">
        <SearchableDropdown
          value={material.foamPeEpeApproval || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeApproval', selectedValue)}
          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
          placeholder="Select or type"
        />
      </Field>

      {/* REMARKS */}
      <Field label="REMARKS" width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
        <Input
          type="text"
          value={material.foamPeEpeRemarks || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPeEpeRemarks', e.target.value)}
          placeholder="Typically closed-cell, lightweight, flexible. Applications: packaging, insulation."
        />
      </Field>
    </div>

    {/* Advance Spec Button */}
    <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
      <Button
        type="button"
        variant={material.showFoamPeEpeAdvancedSpec ? "default" : "outline"}
        size="sm"
        onClick={() => handleRawMaterialChange(actualIndex, 'showFoamPeEpeAdvancedSpec', !material.showFoamPeEpeAdvancedSpec)}
      >
        Advance Spec
      </Button>
    </div>

    {/* Advanced Filter UI Table */}
    {material.showFoamPeEpeAdvancedSpec && (
      <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', border: '1px solid var(--border)' }} className="col-span-1 md:col-span-2 lg:col-span-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
          <Field label="CELL STRUCTURE" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeCellStructure || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeCellStructure', selectedValue)}
              options={['Closed Cell (standard for PE foam)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="LAMINATION" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeLamination || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeLamination', selectedValue)}
              options={['None', 'PE Film Laminated', 'Foil Laminated', 'Fabric Laminated']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="CROSS-LINKED" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeCrossLinked || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeCrossLinked', selectedValue)}
              options={['Non Cross-Linked (standard EPE)', 'Cross-Linked (XLPE - denser, stronger)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="ANTI-STATIC" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeAntiStatic || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeAntiStatic', selectedValue)}
              options={['Standard', 'Anti-Static (Pink ESD foam)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="WATER RESISTANCE" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeWaterResistance || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeWaterResistance', selectedValue)}
              options={['Excellent (closed cell)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="CUSHIONING" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeCushioning || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeCushioning', selectedValue)}
              options={['Good shock absorption', 'Low compression set']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="FIRE RETARDANT" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeFireRetardant || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeFireRetardant', selectedValue)}
              options={['Standard', 'FR Treated (HF-1, UL94)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="THERMAL INSULATION" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeThermalInsulation || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeThermalInsulation', selectedValue)}
              options={['Good thermal insulation (R-value)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="CERTIFICATION" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeCertification || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeCertification', selectedValue)}
              options={['REACH Compliant', 'RoHS Compliant', 'OEKO-TEX']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="DENSITY" width="sm">
            <SearchableDropdown
              value={material.foamPeEpeDensity || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPeEpeDensity', selectedValue)}
              options={['18 kg/m³', '20 kg/m³', '25 kg/m³', '30 kg/m³', '35 kg/m³', '45 kg/m³']}
              placeholder="Select or type"
            />
          </Field>
        </div>
      </div>
    )}
  </div>
)}

{/* pu-foam Table */}
{material.foamTableType === 'pu-foam' && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
    {/* FOAM TYPE */}
    <Field label="FOAM TYPE" width="sm">
      <SearchableDropdown
        value={material.foamPuType || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuType', selectedValue)}
        options={['PU Foam (Polyurethane)']}
        placeholder="Select or type"
      />
    </Field>

    {/* SUBTYPE */}
    <Field label="SUBTYPE" width="sm">
      <SearchableDropdown
        value={material.foamPuSubtype || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuSubtype', selectedValue)}
        options={['Virgin', 'Recycled/Rebonded', 'Blended']}
        placeholder="Select or type"
      />
    </Field>

    {/* GRADE */}
    <Field label="GRADE" width="sm">
      <SearchableDropdown
        value={material.foamPuGrade || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuGrade', selectedValue)}
        options={['Conventional PU', 'High Density (HD)', 'Super High Density (SHD)']}
        placeholder="Select or type"
      />
    </Field>

    {/* COLOUR */}
    <Field label="COLOUR" width="sm">
      <SearchableDropdown
        value={material.foamPuColour || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuColour', selectedValue)}
        options={['White', 'Grey', 'Pink', 'Blue', 'Black', 'Charcoal', 'Custom']}
        placeholder="Select or type"
      />
    </Field>

    {/* THICKNESS */}
    <Field label="THICKNESS" width="sm">
      <Input
        type="text"
        value={material.foamPuThickness || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuThickness', e.target.value)}
        placeholder="in MM (e.g., 3, 4, 6, 8, 10, 12)"
      />
    </Field>

    {/* SHAPE */}
    <Field label="SHAPE" width="sm">
      <Input
        type="text"
        value={material.foamPuShape || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuShape', e.target.value)}
        placeholder="TEXT"
      />
    </Field>

    {/* UPLOAD REF IMAGE */}
    <Field label="UPLOAD REF IMAGE" width="sm">
      <input
        type="file"
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuShapeRefImage', e.target.files[0])}
        className="hidden"
        id={`upload-pu-foam-shape-${actualIndex}`}
        accept="image/*"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-11 w-full"
        onClick={() => document.getElementById(`upload-pu-foam-shape-${actualIndex}`)?.click()}
      >
        {material.foamPuShapeRefImage ? 'UPLOADED' : 'UPLOAD'}
      </Button>
    </Field>
  </div>

  {/* SIZE SPEC */}
  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
    <h4 className="text-sm font-semibold text-foreground/90 mb-4">SIZE SPEC</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
      <Field label="SHEET/PCS" width="sm">
        <Input
          type="text"
          value={material.foamPuSheetPcs || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuSheetPcs', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
      <Field label="GSM" width="sm">
        <Input
          type="text"
          value={material.foamPuGsm || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuGsm', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
      <Field label="LENGTH (CM)" width="sm">
        <Input
          type="text"
          value={material.foamPuLengthCm || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuLengthCm', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
      <Field label="WIDTH (CM)" width="sm">
        <Input
          type="text"
          value={material.foamPuWidthCm || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuWidthCm', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
    </div>
  </div>

  {/* QTY - KGS and YARDAGE */}
  <div style={{ marginTop: '1.25rem' }}>
    <h4 className="text-sm font-semibold text-foreground/90 mb-4">QTY</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
      <Field label="KGS (CNS)" width="sm">
        <Input
          type="text"
          value={material.foamPuKgsCns || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuKgsCns', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
      <Field label="YARDAGE (CNS)" width="sm">
        <Input
          type="text"
          value={material.foamPuYardageCns || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuYardageCns', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
    </div>
  </div>

  {/* TESTING REQUIREMENTS */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px', marginTop: '1.25rem' }}>
    <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
      <div className="flex items-center" style={{ gap: '0.75rem' }}>
        <div className="flex-1">
          <TestingRequirementsInput
            value={material.foamPuTestingRequirements || []}
            onChange={(values) => handleRawMaterialChange(actualIndex, 'foamPuTestingRequirements', values)}
            options={['Density Test', 'ILD Test', 'Compression Set', 'Resilience', 'Flammability']}
            placeholder="Type to search or select testing requirements..."
          />
        </div>
        <input
          type="file"
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuTestingRequirementsFile', e.target.files[0])}
          className="hidden"
          id={`upload-pu-foam-testing-${actualIndex}`}
          accept="image/*"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11"
          onClick={() => document.getElementById(`upload-pu-foam-testing-${actualIndex}`)?.click()}
        >
          {material.foamPuTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}
        </Button>
      </div>
    </Field>

    {/* SURPLUS % */}
    <Field label="SURPLUS %" width="sm">
      <PercentInput
        value={material.foamPuSurplus || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuSurplus', e.target.value)}
        placeholder="e.g., 3-5"
      />
    </Field>

    {/* WASTAGE % */}
    <Field label="WASTAGE %" width="sm">
      <div className="relative">
        <SearchableDropdown
          value={material.foamPuWastage || ''}
          onChange={(selectedValue) => {
            const predefinedOptions = ['Mattress Core', 'Cushion Insert', 'Topper', 'Packaging'];
            if (predefinedOptions.includes(selectedValue)) {
              handleRawMaterialChange(actualIndex, 'foamPuWastage', selectedValue);
            } else {
              const numericValue = selectedValue.replace(/[^0-9.]/g, '');
              handleRawMaterialChange(actualIndex, 'foamPuWastage', numericValue);
            }
          }}
          options={['Mattress Core', 'Cushion Insert', 'Topper', 'Packaging']}
          placeholder="Select or type %"
          className={material.foamPuWastage && !['Mattress Core', 'Cushion Insert', 'Topper', 'Packaging'].includes(material.foamPuWastage) ? 'pr-10' : ''}
        />
        {material.foamPuWastage && !['Mattress Core', 'Cushion Insert', 'Topper', 'Packaging'].includes(material.foamPuWastage) && (
          <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', userSelect: 'none', zIndex: 10 }}>%</span>
        )}
      </div>
    </Field>

    {/* APPROVAL */}
    <Field label="APPROVAL" width="sm">
      <SearchableDropdown
        value={material.foamPuApproval || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuApproval', selectedValue)}
        options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
        placeholder="Select or type"
      />
    </Field>

    {/* REMARKS */}
    <Field label="REMARKS" width="sm">
      <Input
        type="text"
        value={material.foamPuRemarks || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamPuRemarks', e.target.value)}
        placeholder="32D for mattresses, CertiPUR-US for USA market, FR treatment for bedding"
      />
    </Field>
  </div>
  
  {/* Show/Hide Advance Spec Button */}
  <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
    <Button
      type="button"
      variant={material.showFoamPuAdvancedSpec ? "default" : "outline"}
      size="sm"
      onClick={() => handleRawMaterialChange(actualIndex, 'showFoamPuAdvancedSpec', !material.showFoamPuAdvancedSpec)}
    >
      Advance Spec
    </Button>
  </div>
  
  {/* Advanced Filter UI Table */}
  {material.showFoamPuAdvancedSpec && (
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
            <Field label="ILD / IFD (Firmness)" width="sm">
              <SearchableDropdown
                value={material.foamPuIld || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuIld', selectedValue)}
                options={['ILD rating (e.g., 20 Soft, 30 Medium, 40 Firm, 50+ Extra Firm)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="SUPPORT FACTOR" width="sm">
              <SearchableDropdown
                value={material.foamPuSupportFactor || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuSupportFactor', selectedValue)}
                options={['Support Factor ratio (e.g., 1.8, 2.0, 2.4, 2.6+)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="RESILIENCE" width="sm">
              <SearchableDropdown
                value={material.foamPuResilience || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuResilience', selectedValue)}
                options={['Resilience % (Ball Rebound Test) - 30-50% typical']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="CELL STRUCTURE" width="sm">
              <SearchableDropdown
                value={material.foamPuCellStructure || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuCellStructure', selectedValue)}
                options={['Open Cell (breathable)', 'Closed Cell (water resistant)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="COMPRESSION SET" width="sm">
              <SearchableDropdown
                value={material.foamPuCompressionSet || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuCompressionSet', selectedValue)}
                options={['Compression Set % (lower is better, <10% ideal)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="TENSILE STRENGTH" width="sm">
              <SearchableDropdown
                value={material.foamPuTensileStrength || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuTensileStrength', selectedValue)}
                options={['Tensile Strength (kPa)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="ELONGATION" width="sm">
              <SearchableDropdown
                value={material.foamPuElongation || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuElongation', selectedValue)}
                options={['Elongation at Break (%)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="FIRE RETARDANT" width="sm">
              <SearchableDropdown
                value={material.foamPuFireRetardant || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuFireRetardant', selectedValue)}
                options={['Standard', 'FR Treated (CFR 1633, TB 117-2013, BS 5852, FMVSS 302)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="ANTI-MICROBIAL" width="sm">
              <SearchableDropdown
                value={material.foamPuAntiMicrobial || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuAntiMicrobial', selectedValue)}
                options={['Standard', 'Anti-Microbial Treated', 'Anti-Bacterial']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="DENSITY" width="sm">
              <SearchableDropdown
                value={material.foamPuDensity || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuDensity', selectedValue)}
                options={['18 kg/m³', '20 kg/m³', '24 kg/m³', '28 kg/m³', '32 kg/m³', '40 kg/m³', '50 kg/m³']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="CERTIFICATION" width="sm">
              <SearchableDropdown
                value={material.foamPuCertification || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamPuCertification', selectedValue)}
                options={['CertiPUR-US', 'OEKO-TEX', 'Greenguard', 'REACH Compliant']}
                placeholder="Select or type"
              />
            </Field>
          </div>
        </div>
      )}
    </>
)}


{/* rebonded-foam Table */}
{material.foamTableType === 'rebonded-foam' && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
    {/* FOAM TYPE */}
    <Field label="FOAM TYPE" width="sm">
      <SearchableDropdown
        value={material.foamRebondedType || ''}
        onChange={(selectedValue) => {
          handleRawMaterialChange(actualIndex, 'foamRebondedType', selectedValue);
          // Clear chip-related fields when foam type changes
          if (selectedValue !== material.foamRebondedType) {
            handleRawMaterialChange(actualIndex, 'foamRebondedChipSource', '');
            handleRawMaterialChange(actualIndex, 'foamRebondedChipSize', '');
          }
        }}
        options={['Rebonded Foam', 'Bonded Foam', 'Chip Foam']}
        placeholder="Select or type"
      />
    </Field>

    {/* SUBTYPE */}
    <Field label="SUBTYPE" width="sm">
      <SearchableDropdown
        value={material.foamRebondedSubtype || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedSubtype', selectedValue)}
        options={['Standard Rebond', 'High Density Rebond', 'Colored Chip']}
        placeholder="Select or type"
      />
    </Field>

    {/* CHIP SOURCE - Conditional (only shows when Chip Foam is selected) */}
    {material.foamRebondedType && material.foamRebondedType.toLowerCase().includes('chip') && (
      <Field label="CHIP SOURCE" width="sm">
        <SearchableDropdown
          value={material.foamRebondedChipSource || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedChipSource', selectedValue)}
          options={['Mixed Foam Scrap', 'Memory Foam Chips', 'PU Chips', 'Colored Chips']}
          placeholder="Select or type"
        />
      </Field>
    )}

    {/* CHIP SIZE - Conditional (only shows when Chip Foam is selected) */}
    {material.foamRebondedType && material.foamRebondedType.toLowerCase().includes('chip') && (
      <Field label="CHIP SIZE" width="sm">
        <SearchableDropdown
          value={material.foamRebondedChipSize || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedChipSize', selectedValue)}
          options={['Fine Chip', 'Medium Chip', 'Coarse Chip', 'Mixed']}
          placeholder="Select or type"
        />
      </Field>
    )}

    {/* BONDING */}
    <Field label="BONDING" width="sm">
      <SearchableDropdown
        value={material.foamRebondedBonding || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedBonding', selectedValue)}
        options={['Adhesive Bonded', 'Steam Bonded']}
        placeholder="Select or type"
      />
    </Field>

    {/* COLOUR */}
    <Field label="COLOUR" width="sm">
      <SearchableDropdown
        value={material.foamRebondedColour || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedColour', selectedValue)}
        options={['Multi-Color (typical)', 'Grey', 'Single Color (if sorted chips)']}
        placeholder="Select or type"
      />
    </Field>

    {/* THICKNESS */}
    <Field label="THICKNESS" width="sm">
      <Input
        type="text"
        value={material.foamRebondedThickness || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedThickness', e.target.value)}
        placeholder="MM (e.g., 5mm, 10mm, 15mm, 20mm, 25mm, 50mm)"
      />
    </Field>

    {/* SHAPE */}
    <Field label="SHAPE" width="sm">
      <Input
        type="text"
        value={material.foamRebondedShape || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedShape', e.target.value)}
        placeholder="TEXT"
      />
    </Field>

    {/* UPLOAD REF IMAGE */}
    <Field label="UPLOAD REF IMAGE" width="sm">
      <input
        type="file"
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedShapeRefImage', e.target.files[0])}
        className="hidden"
        id={`upload-rebonded-foam-shape-${actualIndex}`}
        accept="image/*"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-11 w-full"
        onClick={() => document.getElementById(`upload-rebonded-foam-shape-${actualIndex}`)?.click()}
      >
        {material.foamRebondedShapeRefImage ? 'UPLOADED' : 'UPLOAD'}
      </Button>
    </Field>
  </div>

  {/* SIZE SPEC */}
  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
    <h4 className="text-sm font-semibold text-foreground/90 mb-4">SIZE SPEC</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
      <Field label="SHEET/PCS" width="sm">
        <Input
          type="text"
          value={material.foamRebondedSheetPcs || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedSheetPcs', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
      <Field label="GSM" width="sm">
        <Input
          type="text"
          value={material.foamRebondedGsm || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedGsm', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
      <Field label="LENGTH (CM)" width="sm">
        <Input
          type="text"
          value={material.foamRebondedLengthCm || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedLengthCm', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
      <Field label="WIDTH (CM)" width="sm">
        <Input
          type="text"
          value={material.foamRebondedWidthCm || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedWidthCm', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
    </div>
  </div>

  {/* QTY - KGS and YARDAGE */}
  <div style={{ marginTop: '1.25rem' }}>
    <h4 className="text-sm font-semibold text-foreground/90 mb-4">QTY</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
      <Field label="KGS (CNS)" width="sm">
        <Input
          type="text"
          value={material.foamRebondedKgsCns || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedKgsCns', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
      <Field label="YARDAGE (CNS)" width="sm">
        <Input
          type="text"
          value={material.foamRebondedYardageCns || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedYardageCns', e.target.value)}
          placeholder="Enter value"
        />
      </Field>
    </div>
  </div>

  {/* TESTING REQUIREMENTS */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px', marginTop: '1.25rem' }}>
    <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
      <div className="flex items-center" style={{ gap: '0.75rem' }}>
        <div className="flex-1">
          <TestingRequirementsInput
            value={material.foamRebondedTestingRequirements || []}
            onChange={(values) => handleRawMaterialChange(actualIndex, 'foamRebondedTestingRequirements', values)}
            options={['Density', 'Compression Set', 'Tensile Strength']}
            placeholder="Type to search or select testing requirements..."
          />
        </div>
        <input
          type="file"
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedTestingRequirementsFile', e.target.files[0])}
          className="hidden"
          id={`upload-rebonded-foam-testing-${actualIndex}`}
          accept="image/*"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11"
          onClick={() => document.getElementById(`upload-rebonded-foam-testing-${actualIndex}`)?.click()}
        >
          {material.foamRebondedTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}
        </Button>
      </div>
    </Field>

    {/* SURPLUS % */}
    <Field label="SURPLUS %" width="sm">
      <PercentInput
        value={material.foamRebondedSurplus || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedSurplus', e.target.value)}
        placeholder="e.g., 3-5"
      />
    </Field>

    {/* WASTAGE % */}
    <Field label="WASTAGE %" width="sm">
      <div className="relative">
        <SearchableDropdown
          value={material.foamRebondedWastage || ''}
          onChange={(selectedValue) => {
            const predefinedOptions = ['Carpet Underlay', 'Gym Mats', 'Economy Mattress', 'Packaging'];
            if (predefinedOptions.includes(selectedValue)) {
              handleRawMaterialChange(actualIndex, 'foamRebondedWastage', selectedValue);
            } else {
              const numericValue = selectedValue.replace(/[^0-9.]/g, '');
              handleRawMaterialChange(actualIndex, 'foamRebondedWastage', numericValue);
            }
          }}
          options={['Carpet Underlay', 'Gym Mats', 'Economy Mattress', 'Packaging']}
          placeholder="Select or type %"
          className={material.foamRebondedWastage && !['Carpet Underlay', 'Gym Mats', 'Economy Mattress', 'Packaging'].includes(material.foamRebondedWastage) ? 'pr-10' : ''}
        />
        {material.foamRebondedWastage && !['Carpet Underlay', 'Gym Mats', 'Economy Mattress', 'Packaging'].includes(material.foamRebondedWastage) && (
          <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', userSelect: 'none', zIndex: 10 }}>%</span>
        )}
      </div>
    </Field>

    {/* APPROVAL */}
    <Field label="APPROVAL" width="sm">
      <SearchableDropdown
        value={material.foamRebondedApproval || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedApproval', selectedValue)}
        options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
        placeholder="Select or type"
      />
    </Field>

    {/* REMARKS */}
    <Field label="REMARKS" width="sm">
      <Input
        type="text"
        value={material.foamRebondedRemarks || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamRebondedRemarks', e.target.value)}
        placeholder="Cost-effective recycled option, High density for underlay, Multi-color is standard"
      />
    </Field>
  </div>

  {/* Show/Hide Advance Spec Button */}
  <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
    <Button
      type="button"
      variant={material.showFoamRebondedAdvancedSpec ? "default" : "outline"}
      size="sm"
      onClick={() => handleRawMaterialChange(actualIndex, 'showFoamRebondedAdvancedSpec', !material.showFoamRebondedAdvancedSpec)}
    >
      Advance Spec
    </Button>
  </div>
  
  {/* Advanced Filter UI Table */}
  {material.showFoamRebondedAdvancedSpec && (
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
        <Field label="ILD / IFD (Firmness)" width="sm">
          <SearchableDropdown
            value={material.foamRebondedIld || ''}
            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedIld', selectedValue)}
            options={['ILD rating (typically firm - 40, 50, 60+)']}
            placeholder="Select or type"
          />
        </Field>
        <Field label="COMPRESSION SET" width="sm">
          <SearchableDropdown
            value={material.foamRebondedCompressionSet || ''}
            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedCompressionSet', selectedValue)}
            options={['Compression Set %']}
            placeholder="Select or type"
          />
        </Field>
        <Field label="FIRE RETARDANT" width="sm">
          <SearchableDropdown
            value={material.foamRebondedFireRetardant || ''}
            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedFireRetardant', selectedValue)}
            options={['Standard', 'FR Treated']}
            placeholder="Select or type"
          />
        </Field>
        <Field label="CERTIFICATION" width="sm">
          <SearchableDropdown
            value={material.foamRebondedCertification || ''}
            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedCertification', selectedValue)}
            options={['Recycled Content Certified', 'REACH Compliant']}
            placeholder="Select or type"
          />
        </Field>
        <Field label="DENSITY" width="sm">
          <SearchableDropdown
            value={material.foamRebondedDensity || ''}
            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamRebondedDensity', selectedValue)}
            options={['80 kg/m³', '100 kg/m³', '120 kg/m³', '150 kg/m³', '180 kg/m³', '200 kg/m³']}
            placeholder="Select or type"
          />
        </Field>
      </div>
    </div>
  )}
</>
)}
                   
                  

{/* gel-infused-foam Table */}
{material.foamTableType === 'gel-infused-foam' && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
      {/* FOAM TYPE */}
      <Field label="FOAM TYPE" width="sm">
        <SearchableDropdown
          value={material.foamGelInfusedType || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedType', selectedValue)}
          options={['Gel-Infused Foam']}
          placeholder="Select or type"
        />
      </Field>

    {/* BASE FOAM */}
    <Field label="BASE FOAM" width="sm">
      <SearchableDropdown
        value={material.foamGelInfusedBaseFoam || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedBaseFoam', selectedValue)}
        options={['Memory Foam', 'PU Foam', 'HR Foam', 'Latex']}
        placeholder="Select or type"
      />
    </Field>

    {/* GEL TYPE */}
    <Field label="GEL TYPE" width="sm">
      <SearchableDropdown
        value={material.foamGelInfusedGelType || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedGelType', selectedValue)}
        options={['Gel Beads', 'Gel Swirl', 'Gel Layer', 'Gel Particles', 'Phase Change Material (PCM)']}
        placeholder="Select or type"
      />
    </Field>

    {/* GEL CONTENT */}
    <Field label="GEL CONTENT" width="sm">
      <SearchableDropdown
        value={material.foamGelInfusedGelContent || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedGelContent', selectedValue)}
        options={['Gel content % or concentration']}
        placeholder="Select or type"
      />
    </Field>

    {/* SUBTYPE */}
    <Field label="SUBTYPE" width="sm">
      <SearchableDropdown
        value={material.foamGelInfusedSubtype || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedSubtype', selectedValue)}
        options={['Virgin', 'Blended']}
        placeholder="Select or type"
      />
    </Field>

    {/* COLOUR */}
    <Field label="COLOUR" width="sm">
      <SearchableDropdown
        value={material.foamGelInfusedColour || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedColour', selectedValue)}
        options={['Blue (common for gel)', 'White', 'Grey', 'Multi-color (swirl)']}
        placeholder="Select or type"
      />
    </Field>

    {/* THICKNESS */}
    <Field label="THICKNESS" width="sm">
      <Input
        type="text"
        value={material.foamGelInfusedThickness || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedThickness', e.target.value)}
        placeholder="MM"
      />
    </Field>

    {/* SHAPE */}
    <Field label="SHAPE" width="sm">
      <Input
        type="text"
        value={material.foamGelInfusedShape || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedShape', e.target.value)}
        placeholder="TEXT"
      />
    </Field>

    {/* UPLOAD REF IMAGE */}
    <Field label="UPLOAD REF IMAGE" width="sm">
      <input
        type="file"
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedShapeRefImage', e.target.files[0])}
        className="hidden"
        id={`upload-gel-infused-foam-shape-${actualIndex}`}
        accept="image/*"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-11 w-full"
        onClick={() => document.getElementById(`upload-gel-infused-foam-shape-${actualIndex}`)?.click()}
      >
        {material.foamGelInfusedShapeRefImage ? 'UPLOADED' : 'UPLOAD'}
      </Button>
    </Field>

    {/* SIZE SPEC */}
    <div
      style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}
      className="col-span-1 md:col-span-2 lg:col-span-5"
    >
      <h4 className="text-sm font-semibold text-foreground/90 mb-4">SIZE SPEC</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
        <Field label="SHEET/PCS" width="sm">
          <Input
            type="text"
            value={material.foamGelInfusedSheetPcs || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedSheetPcs', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="GSM" width="sm">
          <Input
            type="text"
            value={material.foamGelInfusedGsm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedGsm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="LENGTH (CM)" width="sm">
          <Input
            type="text"
            value={material.foamGelInfusedLengthCm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedLengthCm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="WIDTH (CM)" width="sm">
          <Input
            type="text"
            value={material.foamGelInfusedWidthCm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedWidthCm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
      </div>
    </div>

    {/* QTY - KGS and YARDAGE */}
    <div style={{ marginTop: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
      <h4 className="text-sm font-semibold text-foreground/90 mb-4">QTY</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
        <Field label="KGS (CNS)" width="sm">
          <Input
            type="text"
            value={material.foamGelInfusedKgsCns || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedKgsCns', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="YARDAGE (CNS)" width="sm">
          <Input
            type="text"
            value={material.foamGelInfusedYardageCns || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedYardageCns', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
      </div>
    </div>

    {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5"
      style={{ gap: '16px 12px', marginTop: '1.25rem' }}
    >
      {/* TESTING REQ. */}
      <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
        <div className="flex items-center" style={{ gap: '0.75rem' }}>
          <div className="flex-1">
            <TestingRequirementsInput
              value={material.foamGelInfusedTestingRequirements || []}
              onChange={(values) => handleRawMaterialChange(actualIndex, 'foamGelInfusedTestingRequirements', values)}
              options={['Density', 'ILD', 'Temperature Differential Test', 'Compression Set']}
              placeholder="Type to search or select testing requirements..."
            />
          </div>
          <input
            type="file"
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedTestingRequirementsFile', e.target.files[0])}
            className="hidden"
            id={`upload-gel-infused-testing-${actualIndex}`}
            accept="image/*"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11"
            onClick={() => document.getElementById(`upload-gel-infused-testing-${actualIndex}`)?.click()}
          >
            {material.foamGelInfusedTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}
          </Button>
        </div>
      </Field>

      {/* SURPLUS % */}
      <Field label="SURPLUS %" width="sm">
        <PercentInput
          value={material.foamGelInfusedSurplus || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedSurplus', e.target.value)}
          placeholder="e.g., 3-5"
        />
      </Field>

      {/* WASTAGE % */}
      <Field label="WASTAGE %" width="sm">
        <div className="relative">
          <SearchableDropdown
            value={material.foamGelInfusedWastage || ''}
            onChange={(selectedValue) => {
              const predefinedOptions = ['Cooling Mattress Topper', 'Premium Pillows', 'Hot Sleeper Products'];
              if (predefinedOptions.includes(selectedValue)) {
                handleRawMaterialChange(actualIndex, 'foamGelInfusedWastage', selectedValue);
              } else {
                const numericValue = selectedValue.replace(/[^0-9.]/g, '');
                handleRawMaterialChange(actualIndex, 'foamGelInfusedWastage', numericValue);
              }
            }}
            options={['Cooling Mattress Topper', 'Premium Pillows', 'Hot Sleeper Products']}
            placeholder="Select or type %"
            className={
              material.foamGelInfusedWastage &&
              !['Cooling Mattress Topper', 'Premium Pillows', 'Hot Sleeper Products'].includes(material.foamGelInfusedWastage)
                ? 'pr-10'
                : ''
            }
          />
          {material.foamGelInfusedWastage &&
            !['Cooling Mattress Topper', 'Premium Pillows', 'Hot Sleeper Products'].includes(material.foamGelInfusedWastage) && (
              <span
                style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-foreground)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 10,
                }}
              >
                %
              </span>
            )}
        </div>
      </Field>

      {/* APPROVAL */}
      <Field label="APPROVAL" width="sm">
        <SearchableDropdown
          value={material.foamGelInfusedApproval || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedApproval', selectedValue)}
          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
          placeholder="Select or type"
        />
      </Field>

      {/* REMARKS */}
      <Field label="REMARKS" width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
        <Input
          type="text"
          value={material.foamGelInfusedRemarks || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamGelInfusedRemarks', e.target.value)}
          placeholder="Gel memory foam for hot sleepers, PCM for active temperature regulation"
        />
      </Field>
    </div>

    {/* Advance Spec Button */}
    <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
      <Button
        type="button"
        variant={material.showFoamGelInfusedAdvancedSpec ? 'default' : 'outline'}
        size="sm"
        onClick={() =>
          handleRawMaterialChange(actualIndex, 'showFoamGelInfusedAdvancedSpec', !material.showFoamGelInfusedAdvancedSpec)
        }
      >
        Advance Spec
      </Button>
    </div>

    {/* Advanced Filter UI Table */}
    {material.showFoamGelInfusedAdvancedSpec && (
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--muted)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border)',
        }}
        className="col-span-1 md:col-span-2 lg:col-span-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
          <Field label="DENSITY" width="sm">
            <SearchableDropdown
              value={material.foamGelInfusedDensity || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedDensity', selectedValue)}
              options={['50 kg/m³', '60 kg/m³', '70 kg/m³', 'Base foam density + gel']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="ILD / IFD (FIRMNESS)" width="sm">
            <SearchableDropdown
              value={material.foamGelInfusedIld || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedIld', selectedValue)}
              options={['ILD rating based on base foam']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="TEMPERATURE REGULATION" width="sm">
            <SearchableDropdown
              value={material.foamGelInfusedTemperatureRegulation || ''}
              onChange={(selectedValue) =>
                handleRawMaterialChange(actualIndex, 'foamGelInfusedTemperatureRegulation', selectedValue)
              }
              options={['Absorbs and dissipates body heat']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="RESPONSE TIME" width="sm">
            <SearchableDropdown
              value={material.foamGelInfusedResponseTime || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedResponseTime', selectedValue)}
              options={['If memory foam base - response time specification']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="BREATHABILITY" width="sm">
            <SearchableDropdown
              value={material.foamGelInfusedBreathability || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedBreathability', selectedValue)}
              options={['Standard', 'Enhanced (ventilated)', 'Open Cell']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="FIRE RETARDANT" width="sm">
            <SearchableDropdown
              value={material.foamGelInfusedFireRetardant || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedFireRetardant', selectedValue)}
              options={['FR Treated (CFR 1633, TB 117)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="COOLING EFFECT" width="sm">
            <SearchableDropdown
              value={material.foamGelInfusedCoolingEffect || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedCoolingEffect', selectedValue)}
              options={['Standard Cooling', 'Advanced Cooling', 'Phase Change (PCM)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="CERTIFICATION" width="sm">
            <SearchableDropdown
              value={material.foamGelInfusedCertification || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamGelInfusedCertification', selectedValue)}
              options={['CertiPUR-US', 'OEKO-TEX', 'Greenguard']}
              placeholder="Select or type"
            />
          </Field>
        </div>
      </div>
    )}
  </div>
  </>
)}





{/* latex-foam Table */}
{material.foamTableType === 'latex-foam' && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
      {/* FOAM TYPE */}
      <Field label="FOAM TYPE" width="sm">
        <SearchableDropdown
          value={material.foamLatexType || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexType', selectedValue)}
          options={['Latex Foam']}
          placeholder="Select or type"
        />
      </Field>

    {/* LATEX TYPE */}
    <Field label="LATEX TYPE" width="sm">
      <SearchableDropdown
        value={material.foamLatexLatexType || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexLatexType', selectedValue)}
        options={['Natural Latex (NR)', 'Synthetic Latex (SBR)', 'Blended (NR+SBR)']}
        placeholder="Select or type"
      />
    </Field>

    {/* NATURAL CONTENT */}
    <Field label="NATURAL CONTENT" width="sm">
      <SearchableDropdown
        value={material.foamLatexNaturalContent || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexNaturalContent', selectedValue)}
        options={['100% Natural', '95% Natural', '85% Natural', 'Blended (varies)']}
        placeholder="Select or type"
      />
    </Field>

    {/* PROCESS */}
    <Field label="PROCESS" width="sm">
      <SearchableDropdown
        value={material.foamLatexProcess || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexProcess', selectedValue)}
        options={['Dunlop Process', 'Talalay Process']}
        placeholder="Select or type"
      />
    </Field>

    {/* SUBTYPE */}
    <Field label="SUBTYPE" width="sm">
      <SearchableDropdown
        value={material.foamLatexSubtype || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexSubtype', selectedValue)}
        options={['Virgin', 'Organic Certified']}
        placeholder="Select or type"
      />
    </Field>

    {/* COLOUR */}
    <Field label="COLOUR" width="sm">
      <SearchableDropdown
        value={material.foamLatexColour || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexColour', selectedValue)}
        options={['Natural (cream/off-white)', 'White (bleached/synthetic)']}
        placeholder="Select or type"
      />
    </Field>

    {/* THICKNESS */}
    <Field label="THICKNESS" width="sm">
      <Input
        type="text"
        value={material.foamLatexThickness || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexThickness', e.target.value)}
        placeholder="MM (e.g., 2, 3, 4, 6, 8)"
      />
    </Field>

    {/* SHAPE */}
    <Field label="SHAPE" width="sm">
      <Input
        type="text"
        value={material.foamLatexShape || ''}
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexShape', e.target.value)}
        placeholder="TEXT"
      />
    </Field>

    {/* UPLOAD REF IMAGE */}
    <Field label="UPLOAD REF IMAGE" width="sm">
      <input
        type="file"
        onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexShapeRefImage', e.target.files[0])}
        className="hidden"
        id={`upload-latex-foam-shape-${actualIndex}`}
        accept="image/*"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-11 w-full"
        onClick={() => document.getElementById(`upload-latex-foam-shape-${actualIndex}`)?.click()}
      >
        {material.foamLatexShapeRefImage ? 'UPLOADED' : 'UPLOAD'}
      </Button>
    </Field>

    {/* SIZE SPEC */}
    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }} className="col-span-1 md:col-span-2 lg:col-span-5">
      <h4 className="text-sm font-semibold text-foreground/90 mb-4">SIZE SPEC</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
        <Field label="SHEET/PCS" width="sm">
          <Input
            type="text"
            value={material.foamLatexSheetPcs || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexSheetPcs', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="GSM" width="sm">
          <Input
            type="text"
            value={material.foamLatexGsm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexGsm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="LENGTH (CM)" width="sm">
          <Input
            type="text"
            value={material.foamLatexLengthCm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexLengthCm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="WIDTH (CM)" width="sm">
          <Input
            type="text"
            value={material.foamLatexWidthCm || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexWidthCm', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
      </div>
    </div>

    {/* QTY - KGS and YARDAGE */}
    <div style={{ marginTop: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
      <h4 className="text-sm font-semibold text-foreground/90 mb-4">QTY</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
        <Field label="KGS (CNS)" width="sm">
          <Input
            type="text"
            value={material.foamLatexKgsCns || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexKgsCns', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
        <Field label="YARDAGE (CNS)" width="sm">
          <Input
            type="text"
            value={material.foamLatexYardageCns || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexYardageCns', e.target.value)}
            placeholder="Enter value"
          />
        </Field>
      </div>
    </div>

    {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5" style={{ gap: '16px 12px', marginTop: '1.25rem' }}>
      {/* TESTING REQ. */}
      <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
        <div className="flex items-center" style={{ gap: '0.75rem' }}>
          <div className="flex-1">
            <TestingRequirementsInput
              value={material.foamLatexTestingRequirements || []}
              onChange={(values) => handleRawMaterialChange(actualIndex, 'foamLatexTestingRequirements', values)}
              options={['Density', 'ILD', 'Resilience', 'Natural Content %', 'GOLS Certification']}
              placeholder="Type to search or select testing requirements..."
            />
          </div>
          <input
            type="file"
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexTestingRequirementsFile', e.target.files[0])}
            className="hidden"
            id={`upload-latex-testing-${actualIndex}`}
            accept="image/*"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11"
            onClick={() => document.getElementById(`upload-latex-testing-${actualIndex}`)?.click()}
          >
            {material.foamLatexTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}
          </Button>
        </div>
      </Field>

      {/* SURPLUS % */}
      <Field label="SURPLUS %" width="sm">
        <PercentInput
          value={material.foamLatexSurplus || ''}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9.]/g, '');
            handleRawMaterialChange(actualIndex, 'foamLatexSurplus', numericValue);
          }}
          placeholder="e.g., 2-5"
        />
      </Field>

      {/* WASTAGE % */}
      <Field label="WASTAGE %" width="sm">
        <div className="relative">
          <SearchableDropdown
            value={material.foamLatexWastage || ''}
            onChange={(selectedValue) => {
              const predefinedOptions = ['Luxury Mattress', 'Organic Bedding', 'Premium Pillows'];
              if (predefinedOptions.includes(selectedValue)) {
                handleRawMaterialChange(actualIndex, 'foamLatexWastage', selectedValue);
              } else {
                const numericValue = selectedValue.replace(/[^0-9.]/g, '');
                handleRawMaterialChange(actualIndex, 'foamLatexWastage', numericValue);
              }
            }}
            options={['Luxury Mattress', 'Organic Bedding', 'Premium Pillows']}
            placeholder="Select or type %"
            className={
              material.foamLatexWastage && !['Luxury Mattress', 'Organic Bedding', 'Premium Pillows'].includes(material.foamLatexWastage)
                ? 'pr-10'
                : ''
            }
          />
          {material.foamLatexWastage &&
            !['Luxury Mattress', 'Organic Bedding', 'Premium Pillows'].includes(material.foamLatexWastage) && (
              <span
                style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-foreground)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 10,
                }}
              >
                %
              </span>
            )}
        </div>
      </Field>

      {/* APPROVAL */}
      <Field label="APPROVAL" width="sm">
        <SearchableDropdown
          value={material.foamLatexApproval || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexApproval', selectedValue)}
          options={["BUYER'S", 'INITIAL', 'PP SAMPLE', 'GOLS Certificate']}
          placeholder="Select or type"
        />
      </Field>

      {/* REMARKS */}
      <Field label="REMARKS" width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
        <Input
          type="text"
          value={material.foamLatexRemarks || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamLatexRemarks', e.target.value)}
          placeholder="Dunlop=denser, Talalay=softer/consistent, GOLS for organic claims, 7-zone for ergonomic"
        />
      </Field>
    </div>

    {/* Advance Spec Button */}
    <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
      <Button
        type="button"
        variant={material.showFoamLatexAdvancedSpec ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleRawMaterialChange(actualIndex, 'showFoamLatexAdvancedSpec', !material.showFoamLatexAdvancedSpec)}
      >
        Advance Spec
      </Button>
    </div>

    {/* Advanced Filter UI Table */}
    {material.showFoamLatexAdvancedSpec && (
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--muted)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border)',
        }}
        className="col-span-1 md:col-span-2 lg:col-span-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
          <Field label="ILD / IFD (FIRMNESS)" width="sm">
            <SearchableDropdown
              value={material.foamLatexIld || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexIld', selectedValue)}
              options={['ILD rating (e.g., 14-19 Soft, 20-28 Medium, 29-36 Firm, 37+ Extra Firm)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="RESILIENCE" width="sm">
            <SearchableDropdown
              value={material.foamLatexResilience || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexResilience', selectedValue)}
              options={['Resilience % (typically 60-75% for latex)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="COMPRESSION SET" width="sm">
            <SearchableDropdown
              value={material.foamLatexCompressionSet || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexCompressionSet', selectedValue)}
              options={['Compression Set % (<3% for quality latex)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="PINCORE PATTERN" width="sm">
            <SearchableDropdown
              value={material.foamLatexPincorePattern || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexPincorePattern', selectedValue)}
              options={['Standard Pincore', 'Zoned (different firmness zones)', 'Solid']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="ZONE CONFIGURATION" width="sm">
            <SearchableDropdown
              value={material.foamLatexZoneConfiguration || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexZoneConfiguration', selectedValue)}
              options={['Single Zone', '3-Zone', '5-Zone', '7-Zone (varying firmness)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="BREATHABILITY" width="sm">
            <SearchableDropdown
              value={material.foamLatexBreathability || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexBreathability', selectedValue)}
              options={['Excellent (natural pincore holes)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="HYPOALLERGENIC" width="sm">
            <SearchableDropdown
              value={material.foamLatexHypoallergenic || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexHypoallergenic', selectedValue)}
              options={['Naturally Hypoallergenic', 'Anti-Dust Mite']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="ANTI-MICROBIAL" width="sm">
            <SearchableDropdown
              value={material.foamLatexAntiMicrobial || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexAntiMicrobial', selectedValue)}
              options={['Naturally Anti-Microbial (latex property)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="FIRE RETARDANT" width="sm">
            <SearchableDropdown
              value={material.foamLatexFireRetardant || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexFireRetardant', selectedValue)}
              options={['Natural (self-extinguishing)', 'FR Treated', 'Wrapped with FR Barrier']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="CERTIFICATION" width="sm">
            <SearchableDropdown
              value={material.foamLatexCertification || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexCertification', selectedValue)}
              options={['GOLS (Global Organic Latex Standard)', 'OEKO-TEX', 'Eco-Institut', 'GOTS (if organic cotton cover)']}
              placeholder="Select or type"
            />
          </Field>
          <Field label="DENSITY" width="sm">
            <SearchableDropdown
              value={material.foamLatexDensity || ''}
              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamLatexDensity', selectedValue)}
              options={['60 kg/m³', '65 kg/m³', '70 kg/m³', '75 kg/m³', '85 kg/m³']}
              placeholder="Select or type"
            />
          </Field>
        </div>
      </div>
    )}
  </div>
  </>
)}                  




{/* memory-foam Table */}
{material.foamTableType === 'memory-foam' && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
      {/* FOAM TYPE */}
      <Field label="FOAM TYPE" width="sm">
        <SearchableDropdown
          value={material.foamMemoryType || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryType', selectedValue)}
          options={['Memory Foam', 'Visco-Elastic Foam']}
          placeholder="Select or type"
        />
      </Field>

      {/* SUBTYPE */}
      <Field label="SUBTYPE" width="sm">
        <SearchableDropdown
          value={material.foamMemorySubtype || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemorySubtype', selectedValue)}
          options={['Virgin', 'Blended', 'Plant-Based (Bio-Foam)']}
          placeholder="Select or type"
        />
      </Field>

      {/* GRADE */}
      <Field label="GRADE" width="sm">
        <SearchableDropdown
          value={material.foamMemoryGrade || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryGrade', selectedValue)}
          options={['Standard Memory', 'High Density Memory', 'Premium Memory']}
          placeholder="Select or type"
        />
      </Field>

      {/* COLOUR */}
      <Field label="COLOUR" width="sm">
        <SearchableDropdown
          value={material.foamMemoryColour || ''}
          onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryColour', selectedValue)}
          options={['White', 'Grey', 'Blue', 'Green (plant-based)', 'Charcoal']}
          placeholder="Select or type"
        />
      </Field>

      {/* THICKNESS */}
      <Field label="THICKNESS" width="sm">
        <Input
          type="text"
          value={material.foamMemoryThickness || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryThickness', e.target.value)}
          placeholder="in MM (e.g., 2, 3, 4, 5, 6)"
        />
      </Field>

      {/* SHAPE */}
      <Field label="SHAPE" width="sm">
        <Input
          type="text"
          value={material.foamMemoryShape || ''}
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryShape', e.target.value)}
          placeholder="TEXT"
        />
      </Field>

      {/* UPLOAD REF IMAGE */}
      <Field label="UPLOAD REF IMAGE" width="sm">
        <input
          type="file"
          onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryShapeRefImage', e.target.files[0])}
          className="hidden"
          id={`upload-memory-foam-shape-${actualIndex}`}
          accept="image/*"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11 w-full"
          onClick={() => document.getElementById(`upload-memory-foam-shape-${actualIndex}`)?.click()}
        >
          {material.foamMemoryShapeRefImage ? 'UPLOADED' : 'UPLOAD REF IMAGE'}
        </Button>
      </Field>

      {/* SIZE SPEC */}
      <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }} className="col-span-1 md:col-span-2 lg:col-span-5">
        <h4 className="text-sm font-semibold text-foreground/90 mb-4">SIZE SPEC</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
          <Field label="SHEET/PCS" width="sm">
            <Input
              type="text"
              value={material.foamMemorySheetPcs || ''}
              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemorySheetPcs', e.target.value)}
              placeholder="Enter value"
            />
          </Field>
          <Field label="GSM" width="sm">
            <Input
              type="text"
              value={material.foamMemoryGsm || ''}
              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryGsm', e.target.value)}
              placeholder="Enter value"
            />
          </Field>
          <Field label="LENGTH (CM)" width="sm">
            <Input
              type="text"
              value={material.foamMemoryLengthCm || ''}
              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryLengthCm', e.target.value)}
              placeholder="Enter value"
            />
          </Field>
          <Field label="WIDTH (CM)" width="sm">
            <Input
              type="text"
              value={material.foamMemoryWidthCm || ''}
              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryWidthCm', e.target.value)}
              placeholder="Enter value"
            />
          </Field>
        </div>
      </div>

      {/* QTY - KGS and YARDAGE */}
      <div style={{ marginTop: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
        <h4 className="text-sm font-semibold text-foreground/90 mb-4">QTY</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
          <Field label="KGS (CNS)" width="sm">
            <Input
              type="text"
              value={material.foamMemoryKgsCns || ''}
              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryKgsCns', e.target.value)}
              placeholder="Enter value"
            />
          </Field>
          <Field label="YARDAGE (CNS)" width="sm">
            <Input
              type="text"
              value={material.foamMemoryYardageCns || ''}
              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryYardageCns', e.target.value)}
              placeholder="Enter value"
            />
          </Field>
        </div>
      </div>

      {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5" style={{ gap: '16px 12px', marginTop: '1.25rem' }}>
        {/* TESTING REQ. */}
        <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            <div className="flex-1">
              <TestingRequirementsInput
                value={material.foamMemoryTestingRequirements || []}
                onChange={(values) => handleRawMaterialChange(actualIndex, 'foamMemoryTestingRequirements', values)}
                options={['Density', 'ILD', 'Response Time', 'Compression Set', 'VOC Emissions', 'Flammability']}
                placeholder="Type to search or select testing requirements..."
              />
            </div>
            <input
              type="file"
              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryTestingRequirementsFile', e.target.files[0])}
              className="hidden"
              id={`upload-memory-testing-${actualIndex}`}
              accept="image/*"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-11"
              onClick={() => document.getElementById(`upload-memory-testing-${actualIndex}`)?.click()}
            >
              {material.foamMemoryTestingRequirementsFile ? 'UPLOADED' : 'UPLOAD'}
            </Button>
          </div>
        </Field>

        {/* SURPLUS % */}
        <Field label="SURPLUS %" width="sm">
          <PercentInput
            value={material.foamMemorySurplus || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemorySurplus', e.target.value)}
            placeholder="e.g., 3-5"
          />
        </Field>

        {/* WASTAGE % */}
        <Field label="WASTAGE %" width="sm">
          <div className="relative">
            <SearchableDropdown
              value={material.foamMemoryWastage || ''}
              onChange={(selectedValue) => {
                const predefinedOptions = ['Mattress Topper', 'Pillow Core', 'Mattress Layer', 'Cushion'];
                if (predefinedOptions.includes(selectedValue)) {
                  handleRawMaterialChange(actualIndex, 'foamMemoryWastage', selectedValue);
                } else {
                  const numericValue = selectedValue.replace(/[^0-9.]/g, '');
                  handleRawMaterialChange(actualIndex, 'foamMemoryWastage', numericValue);
                }
              }}
              options={['Mattress Topper', 'Pillow Core', 'Mattress Layer', 'Cushion']}
              placeholder="Select or type %"
              className={
                material.foamMemoryWastage && !['Mattress Topper', 'Pillow Core', 'Mattress Layer', 'Cushion'].includes(material.foamMemoryWastage)
                  ? 'pr-10'
                  : ''
              }
            />
            {material.foamMemoryWastage &&
              !['Mattress Topper', 'Pillow Core', 'Mattress Layer', 'Cushion'].includes(material.foamMemoryWastage) && (
                <span
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-foreground)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    zIndex: 10,
                  }}
                >
                  %
                </span>
              )}
          </div>
        </Field>

        {/* APPROVAL */}
        <Field label="APPROVAL" width="sm">
          <SearchableDropdown
            value={material.foamMemoryApproval || ''}
            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryApproval', selectedValue)}
            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
            placeholder="Select or type"
          />
        </Field>

        {/* REMARKS */}
        <Field label="REMARKS" width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
          <Input
            type="text"
            value={material.foamMemoryRemarks || ''}
            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamMemoryRemarks', e.target.value)}
            placeholder="50D+ for quality, Gel-infused for cooling, Low VOC for sensitive users"
          />
        </Field>
      </div>

      {/* Advance Spec Button */}
      <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
        <Button
          type="button"
          variant={material.showFoamMemoryAdvancedSpec ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleRawMaterialChange(actualIndex, 'showFoamMemoryAdvancedSpec', !material.showFoamMemoryAdvancedSpec)}
        >
          Advance Spec
        </Button>
      </div>

      {/* Advanced Filter UI Table */}
      {material.showFoamMemoryAdvancedSpec && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            backgroundColor: 'var(--muted)',
            borderRadius: '0.75rem',
            border: '1px solid var(--border)',
          }}
          className="col-span-1 md:col-span-2 lg:col-span-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
            <Field label="ILD / IFD (FIRMNESS)" width="sm">
              <SearchableDropdown
                value={material.foamMemoryIld || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryIld', selectedValue)}
                options={['ILD rating (e.g., 8 Ultra-Soft, 10-12 Soft, 14 Medium, 18+ Firm)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="RESPONSE TIME" width="sm">
              <SearchableDropdown
                value={material.foamMemoryResponseTime || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryResponseTime', selectedValue)}
                options={['Recovery Time (Slow: 5-10 sec, Medium: 3-5 sec, Fast: 1-3 sec)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="TEMPERATURE SENSITIVITY" width="sm">
              <SearchableDropdown
                value={material.foamMemoryTemperatureSensitivity || ''}
                onChange={(selectedValue) =>
                  handleRawMaterialChange(actualIndex, 'foamMemoryTemperatureSensitivity', selectedValue)
                }
                options={['Standard (temp sensitive)', 'Low Temp Sensitive', 'Adaptive']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="ACTIVATION TEMPERATURE" width="sm">
              <SearchableDropdown
                value={material.foamMemoryActivationTemperature || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryActivationTemperature', selectedValue)}
                options={['Temperature at which foam softens (e.g., 20-25°C, 25-30°C)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="COMPRESSION SET" width="sm">
              <SearchableDropdown
                value={material.foamMemoryCompressionSet || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryCompressionSet', selectedValue)}
                options={['Compression Set % (<5% for quality memory foam)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="RESILIENCE" width="sm">
              <SearchableDropdown
                value={material.foamMemoryResilience || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryResilience', selectedValue)}
                options={['Low Resilience (10-30%) - characteristic of memory foam']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="BREATHABILITY" width="sm">
              <SearchableDropdown
                value={material.foamMemoryBreathability || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryBreathability', selectedValue)}
                options={['Standard', 'Open Cell (breathable)', 'Ventilated (holes)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="INFUSION" width="sm">
              <SearchableDropdown
                value={material.foamMemoryInfusion || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryInfusion', selectedValue)}
                options={['None', 'Gel-Infused', 'Copper-Infused', 'Charcoal-Infused', 'Green Tea', 'Lavender']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="COOLING TECHNOLOGY" width="sm">
              <SearchableDropdown
                value={material.foamMemoryCoolingTechnology || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryCoolingTechnology', selectedValue)}
                options={['Standard', 'Phase Change Material (PCM)', 'Gel Beads', 'Graphite']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="FIRE RETARDANT" width="sm">
              <SearchableDropdown
                value={material.foamMemoryFireRetardant || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryFireRetardant', selectedValue)}
                options={['FR Treated (CFR 1633, TB 117-2013, BS 5852)']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="VOC EMISSIONS" width="sm">
              <SearchableDropdown
                value={material.foamMemoryVocEmissions || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryVocEmissions', selectedValue)}
                options={['Low VOC', 'Ultra-Low VOC', 'CertiPUR-US Certified']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="DENSITY" width="sm">
              <SearchableDropdown
                value={material.foamMemoryDensity || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryDensity', selectedValue)}
                options={['40 kg/m³', '50 kg/m³', '60 kg/m³', '70 kg/m³', '80 kg/m³', '90 kg/m³']}
                placeholder="Select or type"
              />
            </Field>
            <Field label="CERTIFICATION" width="sm">
              <SearchableDropdown
                value={material.foamMemoryCertification || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamMemoryCertification', selectedValue)}
                options={['CertiPUR-US', 'OEKO-TEX', 'Greenguard Gold', 'REACH']}
                placeholder="Select or type"
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  </>
)}
                  


                    
                    {/* HR-form Table */}
                    {material.foamTableType === 'HR-form' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
                        {/* FOAM TYPE */}
                        <Field label="FOAM TYPE" width="sm">
                          <SearchableDropdown
                            value={material.foamHrType || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrType', selectedValue)}
                            options={['HR Foam (High Resilience)', 'High Resiliency Foam']}
                            placeholder="Select or type"
                          />
                        </Field>

                        {/* SUBTYPE */}
                        <Field label="SUBTYPE" width="sm">
                          <SearchableDropdown
                            value={material.foamHrSubtype || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrSubtype', selectedValue)}
                            options={['Virgin HR', 'Super HR', 'CME (Combustion Modified)']}
                            placeholder="Select or type"
                          />
                        </Field>

                        {/* GRADE */}
                        <Field label="GRADE" width="sm">
                          <SearchableDropdown
                            value={material.foamHrGrade || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrGrade', selectedValue)}
                            options={['HR 35', 'HR 40', 'HR 45', 'HR 50']}
                            placeholder="Select or type"
                          />
                        </Field>

                        {/* COLOUR */}
                        <Field label="COLOUR" width="sm">
                          <SearchableDropdown
                            value={material.foamHrColour || ''}
                            onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrColour', selectedValue)}
                            options={['White', 'Off-White', 'Pink', 'Blue', 'Grey']}
                            placeholder="Select or type"
                          />
                        </Field>

                        {/* THICKNESS */}
                        <Field label="THICKNESS" width="sm">
                          <Input
                            type="text"
                            value={material.foamHrThickness || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrThickness', e.target.value)}
                            placeholder="MM"
                          />
                        </Field>

                        {/* SHAPE */}
                        <Field label="SHAPE" width="sm">
                          <Input
                            type="text"
                            value={material.foamHrShape || ''}
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrShape', e.target.value)}
                            placeholder="TEXT"
                          />
                        </Field>

                        {/* UPLOAD REF IMAGE */}
                        <Field label="UPLOAD REF IMAGE" width="sm">
                          <input
                            type="file"
                            onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrShapeRefImage', e.target.files[0])}
                            className="hidden"
                            id={`upload-hr-foam-shape-${actualIndex}`}
                            accept="image/*"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-11 w-full"
                            onClick={() => document.getElementById(`upload-hr-foam-shape-${actualIndex}`)?.click()}
                          >
                            {material.foamHrShapeRefImage ? 'UPLOADED' : 'UPLOAD REF IMAGE'}
                          </Button>
                        </Field>
                        {/* SIZE SPEC */}
                        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }} className="col-span-1 md:col-span-2 lg:col-span-5">
                          <h4 className="text-sm font-semibold text-foreground/90 mb-4">SIZE SPEC</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
                            <Field label="SHEET/PCS" width="sm">
                              <Input
                                type="text"
                                value={material.foamHrSheetPcs || ''}
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrSheetPcs', e.target.value)}
                                placeholder="Enter value"
                              />
                            </Field>
                            <Field label="GSM" width="sm">
                              <Input
                                type="text"
                                value={material.foamHrGsm || ''}
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrGsm', e.target.value)}
                                placeholder="Enter value"
                              />
                            </Field>
                            <Field label="LENGTH (CM)" width="sm">
                              <Input
                                type="text"
                                value={material.foamHrLengthCm || ''}
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrLengthCm', e.target.value)}
                                placeholder="Enter value"
                              />
                            </Field>
                            <Field label="WIDTH (CM)" width="sm">
                              <Input
                                type="text"
                                value={material.foamHrWidthCm || ''}
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrWidthCm', e.target.value)}
                                placeholder="Enter value"
                              />
                            </Field>
                          </div>
                        </div>

                        {/* QTY - KGS and YARDAGE */}
                        <div style={{ marginTop: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
                          <h4 className="text-sm font-semibold text-foreground/90 mb-4">QTY</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ gap: '16px 12px' }}>
                            <Field label="KGS (CNS)" width="sm">
                              <Input
                                type="text"
                                value={material.foamHrKgsCns || ''}
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrKgsCns', e.target.value)}
                                placeholder="Enter value"
                              />
                            </Field>
                            <Field label="YARDAGE (CNS)" width="sm">
                              <Input
                                type="text"
                                value={material.foamHrYardageCns || ''}
                                onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrYardageCns', e.target.value)}
                                placeholder="Enter value"
                              />
                            </Field>
                          </div>
                        </div>
                        {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5" style={{ gap: '16px 12px', marginTop: '1.25rem' }}>
                          {/* TESTING REQ. */}
                          <Field label="TESTING REQ." width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                            <TestingRequirementsInput
                              value={material.foamHrTestingRequirements || []}
                              onChange={(values) => handleRawMaterialChange(actualIndex, 'foamHrTestingRequirements', values)}
                              options={['Density', 'ILD', 'Support Factor', 'Resilience (>60%)', 'Fatigue Test']}
                              placeholder="Type to search or select testing requirements..."
                            />
                          </Field>

                          {/* SURPLUS % */}
                          <Field label="SURPLUS %" width="sm">
                            <PercentInput
                              value={material.foamHrSurplus || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrSurplus', e.target.value)}
                              placeholder="e.g., 3-5"
                            />
                          </Field>

                          {/* WASTAGE % */}
                          <Field label="WASTAGE %" width="sm">
                            <div className="relative">
                              <SearchableDropdown
                                value={material.foamHrWastage || ''}
                                onChange={(selectedValue) => {
                                  const predefinedOptions = ['Premium Mattress', 'Automotive Seating', 'High-End Cushions'];
                                  if (predefinedOptions.includes(selectedValue)) {
                                    handleRawMaterialChange(actualIndex, 'foamHrWastage', selectedValue);
                                  } else {
                                    const numericValue = selectedValue.replace(/[^0-9.]/g, '');
                                    handleRawMaterialChange(actualIndex, 'foamHrWastage', numericValue);
                                  }
                                }}
                                options={['Premium Mattress', 'Automotive Seating', 'High-End Cushions']}
                                placeholder="Select or type %"
                                className={material.foamHrWastage && !['Premium Mattress', 'Automotive Seating', 'High-End Cushions'].includes(material.foamHrWastage) ? 'pr-10' : ''}
                              />
                              {material.foamHrWastage && !['Premium Mattress', 'Automotive Seating', 'High-End Cushions'].includes(material.foamHrWastage) && (
                                <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', userSelect: 'none', zIndex: 10 }}>%</span>
                              )}
                            </div>
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={material.foamHrApproval || ''}
                              onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrApproval', selectedValue)}
                              options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                              placeholder="Select or type"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="sm" className="col-span-1 md:col-span-2 lg:col-span-5">
                            <Input
                              type="text"
                              value={material.foamHrRemarks || ''}
                              onChange={(e) => handleRawMaterialChange(actualIndex, 'foamHrRemarks', e.target.value)}
                              placeholder="Resilience >60% is true HR, Better durability than conventional PU, CME for inherent FR"
                            />
                          </Field>
                        </div>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="col-span-1 md:col-span-2 lg:col-span-5">
                          <Button
                            type="button"
                            variant={material.showFoamHrAdvancedSpec ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleRawMaterialChange(actualIndex, 'showFoamHrAdvancedSpec', !material.showFoamHrAdvancedSpec)}
                          >
                            Advance Spec
                          </Button>
                        </div>

                        {/* Advanced Filter UI Table */}
                        {material.showFoamHrAdvancedSpec && (
                          <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--muted)', borderRadius: '0.75rem', border: '1px solid var(--border)' }} className="col-span-1 md:col-span-2 lg:col-span-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
                              <Field label="ILD / IFD (Firmness)" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrIld || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrIld', selectedValue)}
                                  options={['ILD rating (e.g., 25, 30, 35, 40, 45)']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="SUPPORT FACTOR" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrSupportFactor || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrSupportFactor', selectedValue)}
                                  options={['Support Factor (2.4-2.8+ for HR foam)']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="RESILIENCE" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrResilience || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrResilience', selectedValue)}
                                  options={['Resilience % (>60% for true HR foam, often 65-75%)']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="COMPRESSION SET" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrCompressionSet || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrCompressionSet', selectedValue)}
                                  options={['Compression Set % (<5% for quality HR)']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="TENSILE STRENGTH" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrTensileStrength || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrTensileStrength', selectedValue)}
                                  options={['Tensile Strength (kPa) - higher for HR']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="ELONGATION" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrElongation || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrElongation', selectedValue)}
                                  options={['Elongation at Break (%)']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="FATIGUE RESISTANCE" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrFatigueResistance || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrFatigueResistance', selectedValue)}
                                  options={['Fatigue Test (>80% height retention after 80,000 cycles)']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="FIRE RETARDANT" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrFireRetardant || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrFireRetardant', selectedValue)}
                                  options={['Standard', 'CME (Combustion Modified)', 'FR Treated']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="CERTIFICATION" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrCertification || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrCertification', selectedValue)}
                                  options={['CertiPUR-US', 'OEKO-TEX', 'Greenguard']}
                                  placeholder="Select or type"
                                />
                              </Field>
                              <Field label="DENSITY" width="sm">
                                <SearchableDropdown
                                  value={material.foamHrDensity || ''}
                                  onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'foamHrDensity', selectedValue)}
                                  options={['35 kg/m³', '40 kg/m³', '45 kg/m³', '50 kg/m³', '55 kg/m³']}
                                  placeholder="Select or type"
                                />
                              </Field>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    

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
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeConstruction', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeLoftRating', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeFillPowerEquivalent', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeWarmthToWeight', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeWaterResistance', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeQuickDry', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeHypoallergenic', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeAntiMicrobial', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeVeganCrueltyFree', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeCertification', '');
                            handleRawMaterialChange(actualIndex, 'fiberDownAlternativeMachineWashable', '');
                            handleRawMaterialChange(actualIndex, 'fiberCottonGrade', '');
                            handleRawMaterialChange(actualIndex, 'fiberCottonStapleLength', '');
                            handleRawMaterialChange(actualIndex, 'fiberCottonProcessing', '');
                            handleRawMaterialChange(actualIndex, 'fiberCottonBonding', '');
                            handleRawMaterialChange(actualIndex, 'fiberCottonNeedlePunched', '');
                            handleRawMaterialChange(actualIndex, 'fiberCottonFireRetardant', '');
                            handleRawMaterialChange(actualIndex, 'fiberCottonDustTrashContent', '');
                            handleRawMaterialChange(actualIndex, 'fiberCottonOrganicCertified', '');
                            handleRawMaterialChange(actualIndex, 'showFiberAdvancedSpec', false);
                          }
                        }}
                        options={['Polyester-Fills', 'Down-Feather', 'Wool-Natural','Specialty-Fills','Microfiber-Fill','Down-Alternative','Cotton-Fill']}
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
                                strictMode={false}
                                onChange={(selectedValue) => {
                                  const options = ['Fiber Fineness', 'Loft Recovery', 'Compression Resilience', 'Cleanliness'];
                                  if (selectedValue && options.includes(selectedValue)) {
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
                                  const handleKeyDown = (keyEvent) => {
                                    if (keyEvent.key === 'Enter' && input.value && input.value.trim()) {
                                      keyEvent.preventDefault();
                                      keyEvent.stopPropagation();
                                      const newValue = input.value.trim();
                                      const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                                      const options = ['Fiber Fineness', 'Loft Recovery', 'Compression Resilience', 'Cleanliness'];
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
                                    const options = ['Fiber Fineness', 'Loft Recovery', 'Compression Resilience', 'Cleanliness'];
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
                                  strictMode={false}
                                  onChange={(selectedValue) => {
                                    const options = ['Fill Power Test', 'Oxygen Number', 'Turbidity', 'Species ID', 'RDS Audit'];
                                    if (selectedValue && options.includes(selectedValue)) {
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
                                    const handleKeyDown = (keyEvent) => {
                                      if (keyEvent.key === 'Enter' && input.value && input.value.trim()) {
                                        keyEvent.preventDefault();
                                        keyEvent.stopPropagation();
                                        const newValue = input.value.trim();
                                        const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                                        const options = ['Fill Power Test', 'Oxygen Number', 'Turbidity', 'Species ID', 'RDS Audit'];
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
                                      const options = ['Fill Power Test', 'Oxygen Number', 'Turbidity', 'Species ID', 'RDS Audit'];
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
              strictMode={false}
              onChange={(selectedValue) => {
                const options = ['Denier Verification', 'Loft Test', 'Resilience', 'Dust Mite Resistance'];
                if (selectedValue && options.includes(selectedValue)) {
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
                const handleKeyDown = (keyEvent) => {
                  if (keyEvent.key === 'Enter' && input.value && input.value.trim()) {
                    keyEvent.preventDefault();
                    keyEvent.stopPropagation();
                    const newValue = input.value.trim();
                    const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                    const options = ['Denier Verification', 'Loft Test', 'Resilience', 'Dust Mite Resistance'];
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
                  const options = ['Denier Verification', 'Loft Test', 'Resilience', 'Dust Mite Resistance'];
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


                  {/* Down-Alternative Table */}
{material.fiberTableType === 'Down-Alternative' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* FIBER TYPE */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">FIBER TYPE</label>
      <SearchableDropdown
        value={material.fiberFiberType || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFiberType', selectedValue)}
        options={['Down Alternative (Synthetic)']}
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
        options={['Micro-Gel Fiber', 'PrimaLoft', 'Thinsulate', '3M Featherless', 'Generic Down Alt']}
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
        options={['Cluster/Ball Fiber', 'Loose Fill', 'Bonded Batt']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* CONSTRUCTION */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">CONSTRUCTION</label>
      <SearchableDropdown
        value={material.fiberDownAlternativeConstruction || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeConstruction', selectedValue)}
        options={['Single Cluster', 'Dual Cluster', 'Layered Cluster']}
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
        options={['0.7D - 1.5D (fine for down-like feel)']}
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
        options={['Siliconized', 'Gel-Coated', 'Slick Finish']}
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
            id={`fiber-testing-wrapper-downalt-${actualIndex}`}
            style={{ flex: 1, minWidth: '200px' }}
          >
                        <SearchableDropdown
              value=""
              strictMode={false}
              onChange={(selectedValue) => {
                const options = ['Loft Recovery', 'Compression Resilience', 'Thermal Resistance (CLO value)'];
                if (selectedValue && options.includes(selectedValue)) {
                  const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                  if (!current.includes(selectedValue)) {
                    const updated = [...current, selectedValue];
                    handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
                  }
                }
              }}
              options={['Loft Recovery', 'Compression Resilience', 'Thermal Resistance (CLO value)']}
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
                    const options = ['Loft Recovery', 'Compression Resilience', 'Thermal Resistance (CLO value)'];
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
                  const options = ['Loft Recovery', 'Compression Resilience', 'Thermal Resistance (CLO value)'];
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

    {/* Conditional: QTY for Loose Fill */}
    {material.fiberForm === 'Loose Fill' && (
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

    {/* Conditional: SIZE SPEC for Bonded Batt (Wadding) */}
    {/* Conditional: SIZE SPEC for Wadding/Batt but as of now wadding option is not available in sheet provided to us*/}
    {material.fiberForm === 'wadding' && (
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
          
          {/* QTY section with YARDAGE (CNS) and KGS (CNS) - nested under SIZE SPEC */}
          <div className="flex flex-col" style={{ marginTop: '16px' }}>
            <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ width: 'fit-content' }}>
              {/* YARDAGE (CNS) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">YARDAGE (CNS)</label>
                <input
                  type="text"
                  value={material.fiberQtyValue || ''}
                  onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQtyValue', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px', width: '200px' }}
                  placeholder="Enter YARDAGE (CNS)"
                />
              </div>
              
              {/* KGS (CNS) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">KGS (CNS)</label>
                <input
                  type="text"
                  value={material.fiberQty || ''}
                  onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQty', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px', width: '200px' }}
                  placeholder="Enter KGS (CNS)"
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
        placeholder="PrimaLoft for outdoor performance, Machine washable for easy care products"
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
            {/* LOFT RATING */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">LOFT RATING</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeLoftRating || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeLoftRating', selectedValue)}
                options={['Low Loft', 'Medium Loft', 'High Loft', 'Down-Equivalent']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* FILL POWER EQUIVALENT */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">FILL POWER EQUIVALENT</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeFillPowerEquivalent || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeFillPowerEquivalent', selectedValue)}
                options={['Equivalent to 500 fill power down', 'Equivalent to 600 fill power down', 'Equivalent to 700 fill power down']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* WARMTH-TO-WEIGHT */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">WARMTH-TO-WEIGHT</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeWarmthToWeight || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeWarmthToWeight', selectedValue)}
                options={['Standard', 'High Warmth-to-Weight Ratio']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* WATER RESISTANCE */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">WATER RESISTANCE</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeWaterResistance || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeWaterResistance', selectedValue)}
                options={['Standard', 'Water Resistant (retains loft when wet)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* QUICK DRY */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">QUICK DRY</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeQuickDry || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeQuickDry', selectedValue)}
                options={['Standard', 'Quick-Dry Technology']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* HYPOALLERGENIC */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">HYPOALLERGENIC</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeHypoallergenic || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeHypoallergenic', selectedValue)}
                options={['Standard Hypoallergenic', 'Certified']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* ANTI-MICROBIAL */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">ANTI-MICROBIAL</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeAntiMicrobial || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeAntiMicrobial', selectedValue)}
                options={['Standard', 'Treated']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* VEGAN/CRUELTY-FREE */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">VEGAN/CRUELTY-FREE</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeVeganCrueltyFree || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeVeganCrueltyFree', selectedValue)}
                options={['Certified Vegan', 'Cruelty-Free']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* CERTIFICATION */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeCertification || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeCertification', selectedValue)}
                options={['OEKO-TEX', 'Bluesign', 'GRS (if recycled)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* MACHINE WASHABLE */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">MACHINE WASHABLE</label>
              <SearchableDropdown
                value={material.fiberDownAlternativeMachineWashable || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberDownAlternativeMachineWashable', selectedValue)}
                options={['Yes', 'Machine Washable & Dryable']}
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


                   {/* Cotton-Fill Table */}
{material.fiberTableType === 'Cotton-Fill' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* FIBER TYPE */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">FIBER TYPE</label>
      <SearchableDropdown
        value={material.fiberFiberType || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberFiberType', selectedValue)}
        options={['Cotton']}
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
        options={['Virgin Cotton', 'Recycled Cotton', 'Organic Cotton', 'Ginned Cotton Waste']}
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
        options={['Loose Fiber', 'Wadding/Batt', 'Carded Cotton', 'Bleached Cotton Linter']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* GRADE */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-2">GRADE</label>
      <SearchableDropdown
        value={material.fiberCottonGrade || ''}
        onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCottonGrade', selectedValue)}
        options={['Premium Grade', 'Standard Grade', 'Economy Grade', 'Noil (short fibers)']}
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
        options={['Natural (off-white)', 'Bleached White', 'Unbleached/Ecru']}
        placeholder="Select or type"
        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
        style={{ padding: '10px 14px', height: '44px' }}
      />
    </div>

    {/* TESTING REQUIREMENTS - Multi-select with chips */}
    <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
      <label className="text-sm font-semibold text-gray-700 mb-2">TESTING</label>
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
            id={`fiber-testing-wrapper-cotton-${actualIndex}`}
            style={{ flex: 1, minWidth: '200px' }}
          >
                        <SearchableDropdown
              value=""
              strictMode={false}
              onChange={(selectedValue) => {
                const options = ['Staple Length', 'Micronaire', 'Trash Content', 'Moisture Content'];
                if (selectedValue && options.includes(selectedValue)) {
                  const current = Array.isArray(material.fiberTestingRequirements) ? material.fiberTestingRequirements : [];
                  if (!current.includes(selectedValue)) {
                    const updated = [...current, selectedValue];
                    handleRawMaterialChange(actualIndex, 'fiberTestingRequirements', updated);
                  }
                }
              }}
              options={['Staple Length', 'Micronaire', 'Trash Content', 'Moisture Content']}
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
                    const options = ['Staple Length', 'Micronaire', 'Trash Content', 'Moisture Content'];
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
                  const options = ['Staple Length', 'Micronaire', 'Trash Content', 'Moisture Content'];
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

    {/* Conditional: QTY for Loose Fiber (WIDTH and KGS) */}
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

          {/* QTY section with YARDAGE (CNS) and KGS (CNS) - nested under SIZE SPEC */}
          <div className="flex flex-col" style={{ marginTop: '16px' }}>
            <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ width: 'fit-content' }}>
              {/* YARDAGE (CNS) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">YARDAGE (CNS)</label>
                <input
                  type="text"
                  value={material.fiberQtyValue || ''}
                  onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQtyValue', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px', width: '200px' }}
                  placeholder="Enter YARDAGE (CNS)"
                />
              </div>
              {/* KGS (CNS) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">KGS (CNS)</label>
                <input
                  type="text"
                  value={material.fiberQty || ''}
                  onChange={(e) => handleRawMaterialChange(actualIndex, 'fiberQty', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px', width: '200px' }}
                  placeholder="Enter KGS (CNS)"
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
        placeholder="GOTS certified for organic products, Bleached for white appearance"
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
            {/* STAPLE LENGTH */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">STAPLE LENGTH</label>
              <SearchableDropdown
                value={material.fiberCottonStapleLength || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCottonStapleLength', selectedValue)}
                options={['Short Staple (<25mm)', 'Medium (25-30mm)', 'Long Staple (>30mm)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* PROCESSING */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">PROCESSING</label>
              <SearchableDropdown
                value={material.fiberCottonProcessing || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCottonProcessing', selectedValue)}
                options={['Carded', 'Combed', 'Garneted (recycled)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* BONDING */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">BONDING</label>
              <SearchableDropdown
                value={material.fiberCottonBonding || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCottonBonding', selectedValue)}
                options={['Non-Bonded (needle punch)', 'Thermal Bonded', 'Resin Bonded']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* NEEDLE PUNCHED */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">NEEDLE PUNCHED</label>
              <SearchableDropdown
                value={material.fiberCottonNeedlePunched || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCottonNeedlePunched', selectedValue)}
                options={['Light Needle Punch', 'Medium', 'Heavy']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* FIRE RETARDANT */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">FIRE RETARDANT</label>
              <SearchableDropdown
                value={material.fiberCottonFireRetardant || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCottonFireRetardant', selectedValue)}
                options={['Standard', 'FR Treated']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* DUST/TRASH CONTENT */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">DUST/TRASH CONTENT</label>
              <SearchableDropdown
                value={material.fiberCottonDustTrashContent || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCottonDustTrashContent', selectedValue)}
                options={['Low (<1%)', 'Medium (1-2%)', 'Standard (<3%)']}
                placeholder="Select or type"
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', height: '44px' }}
              />
            </div>

            {/* ORGANIC CERTIFIED */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">ORGANIC CERTIFIED</label>
              <SearchableDropdown
                value={material.fiberCottonOrganicCertified || ''}
                onChange={(selectedValue) => handleRawMaterialChange(actualIndex, 'fiberCottonOrganicCertified', selectedValue)}
                options={['Standard', 'GOTS Certified', 'OCS (Organic Content Standard)']}
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
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
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  {/* Work Order Fields */}
                  <div className="flex flex-wrap items-start gap-6">
                    <Field
                      label="WORK ORDER"
                      required
                      width="sm"
                      error={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_workOrder`]}
                      style={{ width: '160px' }}
                    >
                      <SearchableDropdown
                        value={workOrder.workOrder || ''}
                        onChange={(selectedValue) => {
                          handleWorkOrderChange(actualIndex, woIndex, 'workOrder', selectedValue);
                        }}
                        options={[
                          'WEAVING',
                          'TUFTING',
                          'QUILTING',
                          'PRINTING',
                          'KNITTING',
                          'EMBROIDERY',
                          'DYEING',
                          'BRAIDING',
                          'CARPET',
                          'CUTTING',
                          'SEWING',
                          'FRINGE/TASSELS',
                        ]}
                        placeholder="Select Work Order"
                        strictMode={true}
                        className={
                          errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_workOrder`] ? 'border-destructive' : ''
                        }
                      />
                    </Field>
                    
                    {/* WASTAGE field - Hidden for KNITTING, PRINTING, QUILTING, SEWING, TUFTING, WEAVING, and FRINGE/TASSELS as they have their own sections */}
                    {workOrder.workOrder && workOrder.workOrder !== 'KNITTING' && workOrder.workOrder !== 'PRINTING' && workOrder.workOrder !== 'QUILTING' && workOrder.workOrder !== 'SEWING' && workOrder.workOrder !== 'TUFTING' && workOrder.workOrder !== 'WEAVING' && workOrder.workOrder !== 'FRINGE/TASSELS' && (
                      <>
                        <Field
                          label={
                            <>
                              WASTAGE % <span className="text-red-600">*</span>
                            </>
                          }
                          width="sm"
                          error={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                        >
                          <PercentInput
                            value={workOrder.wastage || ''}
                            onChange={(e) => {
                              handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value);
                            }}
                            placeholder="e.g., 2"
                            error={Boolean(errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`])}
                            required
                          />
                        </Field>
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
                          <Field
                            label="STRAND COUNT"
                            width="sm"
                            helper={workOrder.machineType ? getBraidingStrandCount(workOrder.machineType) : undefined}
                          >
                            <Input
                              type="text"
                              value={workOrder.strandCount || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'strandCount', e.target.value)}
                              placeholder="Enter strand count"
                            />
                          </Field>

                          {/* WIDTH / DIAMETER */}
                          <Field
                            label={workOrder.machineType ? getBraidingWidthDiameter(workOrder.machineType) : 'WIDTH / DIAMETER'}
                            width="sm"
                          >
                            <Input
                              type="text"
                              value={workOrder.widthDiameter || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'widthDiameter', e.target.value)}
                              placeholder="Enter width/diameter"
                            />
                          </Field>

                          {/* GSM */}
                          <Field label="GSM" width="sm">
                            <Input
                              type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'gsm', e.target.value)}
                              placeholder="Enter GSM"
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={BRAIDING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* DESIGN REF (Upload) */}
                          <Field label="DESIGN REF" width="sm">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`braiding-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`braiding-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Enter remarks"
                            />
                          </Field>
                        </>
                      )}

                      {/* KNITTING Specific Fields */}
                      {workOrder.workOrder === 'KNITTING' && (
                        <>
                          {/* DESIGN REF (Upload) */}
                          <Field label="DESIGN REF" width="sm">
                            <input
                              type="file"
                              onChange={(e) =>
                                handleWorkOrderChange(actualIndex, woIndex, 'knittingDesignRef', e.target.files[0])
                              }
                              className="hidden"
                              id={`knitting-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`knitting-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.knittingDesignRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* GAUGE */}
                          <Field
                            label="GAUGE"
                            width="sm"
                            helper={workOrder.machineType ? getKnittingGaugeRange(workOrder.machineType) : undefined}
                          >
                            <Input
                              type="text"
                              value={workOrder.knittingGauge || ''}
                              onChange={(e) =>
                                handleWorkOrderChange(actualIndex, woIndex, 'knittingGauge', e.target.value)
                              }
                              placeholder={
                                workOrder.machineType && getKnittingGaugeRange(workOrder.machineType)
                                  ? getKnittingGaugeRange(workOrder.machineType)
                                  : 'Numeric'
                              }
                            />
                          </Field>

                          {/* GSM */}
                          <Field label="GSM" width="sm">
                            <Input
                              type="text"
                              value={workOrder.knittingGsm || ''}
                              onChange={(e) =>
                                handleWorkOrderChange(actualIndex, woIndex, 'knittingGsm', e.target.value)
                              }
                              placeholder="Numeric"
                            />
                          </Field>

                          {/* WALES Ratio */}
                          <Field label="WALES RATIO" width="sm" helper="0–1">
                            <Input
                              type="number"
                              step="0.001"
                              min="0"
                              max="1"
                              value={workOrder.knittingWalesRatio || ''}
                              onChange={(e) =>
                                handleWorkOrderChange(actualIndex, woIndex, 'knittingWalesRatio', e.target.value)
                              }
                              placeholder="0-1"
                            />
                          </Field>

                          {/* COURSES Ratio */}
                          <Field label="COURSES RATIO" width="sm" helper="0–1">
                            <Input
                              type="number"
                              step="0.001"
                              min="0"
                              max="1"
                              value={workOrder.knittingCoursesRatio || ''}
                              onChange={(e) =>
                                handleWorkOrderChange(actualIndex, woIndex, 'knittingCoursesRatio', e.target.value)
                              }
                              placeholder="0-1"
                            />
                          </Field>

                          {/* RATIO WEIGHT/%AGE (Wales) */}
                          <Field label="RATIO WEIGHT(WALES)" width="sm">
                            <PercentInput
                              value={workOrder.knittingRatioWeightWales || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'knittingRatioWeightWales', e.target.value)}
                              placeholder="e.g., 25"
                            />
                          </Field>

                          {/* RATIO WEIGHT/%AGE (Courses) */}
                          <Field label="RATIO WEIGHT(COURSE)" width="sm">
                            <PercentInput
                              value={workOrder.knittingRatioWeightCourses || ''}
                              onChange={(e) =>
                                handleWorkOrderChange(actualIndex, woIndex, 'knittingRatioWeightCourses', e.target.value)
                              }
                              placeholder="e.g., 75"
                            />
                          </Field>

                          {/* WASTAGE % */}
                          <Field
                            label="WASTAGE %"
                            width="sm"
                            error={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                          >
                            <PercentInput
                              value={workOrder.wastage || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                              placeholder="e.g., 2"
                              error={Boolean(errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`])}
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={KNITTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Text"
                            />
                          </Field>
                        </>
                      )}

                      {/* Advanced Filter for KNITTING - Button right after REMARKS */}
                      {workOrder.workOrder === 'KNITTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Advance Filter Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showKnittingAdvancedFilter ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showKnittingAdvancedFilter',
                                  !workOrder.showKnittingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>

                          {/* Advanced Filter UI Table */}
                          {workOrder.showKnittingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-6">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px 12px' }}>
                                <Field
                                  label="DESIGN"
                                  width="sm"
                                  helper={
                                    workOrder.machineType
                                      ? `${getKnittingDesigns(workOrder.machineType).length} options`
                                      : undefined
                                  }
                                >
                                  <SearchableDropdown
                                    value={workOrder.knittingDesign || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'knittingDesign', selectedValue)
                                    }
                                    options={workOrder.machineType ? getKnittingDesigns(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Design" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                <Field
                                  label="VARIANTS"
                                  width="sm"
                                  helper={
                                    workOrder.machineType
                                      ? `${getKnittingVariants(workOrder.machineType).length} options`
                                      : undefined
                                  }
                                >
                                  <SearchableDropdown
                                    value={workOrder.knittingVariant || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'knittingVariant', selectedValue)
                                    }
                                    options={workOrder.machineType ? getKnittingVariants(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Variant" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for BRAIDING - Button right after REMARKS */}
                      {workOrder.workOrder === 'BRAIDING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showBraidingAdvancedFilter ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showBraidingAdvancedFilter',
                                  !workOrder.showBraidingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>

                          {/* Advanced Filter UI Table */}
                          {workOrder.showBraidingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-6">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px 12px' }}>
                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)
                                    }
                                    options={workOrder.machineType ? getBraidingVariants(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Variant" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                <Field label="DESIGN" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.braidingDesign || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'braidingDesign', selectedValue)
                                    }
                                    options={workOrder.machineType ? getBraidingDesigns(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Design" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                <Field
                                  label="PATTERN"
                                  width="sm"
                                  helper={workOrder.machineType ? getBraidingPatternType(workOrder.machineType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.pattern || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pattern', e.target.value)}
                                    placeholder={
                                      workOrder.machineType
                                        ? `Enter ${getBraidingPatternType(workOrder.machineType).toLowerCase()}`
                                        : 'Enter pattern'
                                    }
                                  />
                                </Field>
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
                          <Field label="QUILTING TYPE" width="sm">
                            <SearchableDropdown
                              value={workOrder.quiltingType || ''}
                              onChange={(selectedValue) =>
                                handleWorkOrderChange(actualIndex, woIndex, 'quiltingType', selectedValue)
                              }
                              options={getAllQuiltingTypes()}
                              placeholder="Select or type Quilting Type"
                            />
                          </Field>

                          {/* DESIGN REF (Upload) */}
                          <Field label="DESIGN REF" width="sm">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`quilting-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`quilting-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* STITCH LENGTH (mm) */}
                          <Field
                            label="STITCH LENGTH (MM)"
                            width="sm"
                            helper={workOrder.quiltingType ? getQuiltingStitchLength(workOrder.quiltingType) : undefined}
                          >
                            <Input
                              type="text"
                              value={workOrder.stitchLength || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'stitchLength', e.target.value)}
                              placeholder={
                                workOrder.quiltingType ? getQuiltingStitchLength(workOrder.quiltingType) : 'Enter stitch length (mm)'
                              }
                            />
                          </Field>

                          {/* PATTERN REPEAT */}
                          <Field
                            label="PATTERN REPEAT"
                            width="sm"
                            helper={workOrder.quiltingType ? getQuiltingPatternRepeat(workOrder.quiltingType) : undefined}
                          >
                            <Input
                              type="text"
                              value={workOrder.patternRepeat || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'patternRepeat', e.target.value)}
                              placeholder={
                                workOrder.quiltingType ? getQuiltingPatternRepeat(workOrder.quiltingType) : 'Enter pattern repeat'
                              }
                            />
                          </Field>

                          {/* WASTAGE % */}
                          <Field
                            label="WASTAGE %"
                            width="sm"
                            error={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                          >
                            <PercentInput
                              value={workOrder.wastage || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                              placeholder="e.g., 2"
                              error={Boolean(errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`])}
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={QUILTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Text"
                            />
                          </Field>
                        </>
                      )}

                      {/* Printing Specific Fields */}
                      {workOrder.workOrder === 'PRINTING' && (
                        <>
                          {/* PRINTING TYPE */}
                          <Field label="PRINTING TYPE" width="sm">
                            <SearchableDropdown
                              value={workOrder.printingType || ''}
                              onChange={(selectedValue) =>
                                handleWorkOrderChange(actualIndex, woIndex, 'printingType', selectedValue)
                              }
                              options={getAllPrintingTypes()}
                              placeholder="Select or type Printing Type"
                            />
                          </Field>

                          {/* DESIGN REF (Upload) */}
                          <Field label="DESIGN REF" width="sm">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`printing-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`printing-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* REPEAT SIZE */}
                          <Field
                            label="REPEAT SIZE"
                            width="sm"
                            helper={workOrder.printingType ? getPrintingRepeatSize(workOrder.printingType) : undefined}
                          >
                            <Input
                              type="text"
                              value={workOrder.repeatSize || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'repeatSize', e.target.value)}
                              placeholder={workOrder.printingType ? getPrintingRepeatSize(workOrder.printingType) : 'Enter repeat size'}
                            />
                          </Field>

                          {/* WASTAGE % */}
                          <Field
                            label="WASTAGE %"
                            width="sm"
                            error={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                          >
                            <PercentInput
                              value={workOrder.wastage || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                              placeholder="e.g., 2"
                              error={Boolean(errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`])}
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={PRINTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Text"
                            />
                          </Field>
                        </>
                      )}

                      {/* Sewing Specific Fields */}
                      {workOrder.workOrder === 'SEWING' && (
                        <>
                          {/* SPI */}
                          <Field label="SPI" width="sm">
                            <Input
                              type="text"
                              value={workOrder.spi || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'spi', e.target.value)}
                              placeholder="Numeric"
                            />
                          </Field>

                          {/* THREAD TYPE */}
                          <Field
                            label="THREAD TYPE"
                            width="sm"
                            helper={workOrder.sewingMachineType ? getSewingThreadType(workOrder.sewingMachineType) : undefined}
                          >
                            <SearchableDropdown
                              value={workOrder.threadType || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'threadType', selectedValue)}
                              options={SEWING_THREAD_TYPE_OPTIONS}
                              placeholder="Select or type Thread Type"
                            />
                          </Field>

                          {/* WASTAGE % - OPTIONAL for SEWING */}
                          <Field
                            label="WASTAGE %"
                            width="sm"
                            error={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                          >
                            <PercentInput
                              value={workOrder.wastage || ''}
                              onChange={(e) => {
                                handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value);
                              }}
                              placeholder="e.g., 2 (optional)"
                              error={Boolean(errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`])}
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={SEWING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Text"
                            />
                          </Field>
                        </>
                      )}

                      {/* FRINGE/TASSELS Specific Fields */}
                      {workOrder.workOrder === 'FRINGE/TASSELS' && (
                        <>
                          {/* TYPE */}
                          <Field label="TYPE" width="sm">
                            <SearchableDropdown
                              value={workOrder.fringeType || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeType', selectedValue)}
                              options={['Cut Fringe', 'Chainette', 'Tassel (individual)', 'Ball Fringe', 'Brush Fringe', 'Bullion', 'Loop Fringe']}
                              placeholder="Select or type"
                            />
                          </Field>

                          {/* MATERIAL */}
                          <Field label="MATERIAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.fringeMaterial || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeMaterial', selectedValue)}
                              options={['Rayon (shiny)', 'Polyester', 'Cotton', 'Silk', 'Metallic', 'Wool', 'Jute']}
                              placeholder="Select or type"
                            />
                          </Field>

                          {/* DROP LENGTH */}
                          <Field label="DROP LENGTH" width="sm">
                            <SearchableDropdown
                              value={workOrder.dropLength || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'dropLength', selectedValue)}
                              options={['2cm', '5cm', '10cm', '15cm', '20cm']}
                              placeholder="Select or type"
                            />
                          </Field>

                          {/* TAPE/HEADER WIDTH */}
                          <Field label="TAPE/HEADER WIDTH" width="sm">
                            <SearchableDropdown
                              value={workOrder.tapeHeaderWidth || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'tapeHeaderWidth', selectedValue)}
                              options={['10mm', '15mm', '20mm']}
                              placeholder="Select or type"
                            />
                          </Field>

                          {/* COLOUR */}
                          <Field label="COLOUR" width="lg">
                            <div className="flex items-center gap-2">
                              <SearchableDropdown
                                value={workOrder.fringeColour || ''}
                                onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeColour', selectedValue)}
                                options={['DTM', 'Multi-Coloured', 'Iridescent', 'Ombre']}
                                placeholder="Select or type"
                                className="flex-1"
                              />
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeColourRefImage', e.target.files[0])}
                                className="hidden"
                                id={`fringe-colour-ref-${materialIndex + 1}-${woIndex}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-11 flex-shrink-0"
                                onClick={() =>
                                  document.getElementById(`fringe-colour-ref-${materialIndex + 1}-${woIndex}`)?.click()
                                }
                              >
                                {workOrder.fringeColourRefImage ? 'UPLOADED' : 'UPLOAD REF'}
                              </Button>
                            </div>
                          </Field>

                          {/* PLACEMENT */}
                          <Field label="PLACEMENT" width="lg">
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={workOrder.fringePlacement || ''}
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringePlacement', e.target.value)}
                                placeholder="Enter placement"
                                className="flex-1"
                              />
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringePlacementRefImage', e.target.files[0])}
                                className="hidden"
                                id={`fringe-placement-ref-${materialIndex + 1}-${woIndex}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-11 flex-shrink-0"
                                onClick={() =>
                                  document.getElementById(`fringe-placement-ref-${materialIndex + 1}-${woIndex}`)?.click()
                                }
                              >
                                {workOrder.fringePlacementRefImage ? 'UPLOADED' : 'UPLOAD REF'}
                              </Button>
                            </div>
                          </Field>

                          {/* QTY - Type Selection (PCS/LENGTH) */}
                          <Field label="QTY" width="sm">
                            <SearchableDropdown
                              value={workOrder.fringeQtyType || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeQtyType', selectedValue)}
                              options={['PCS', 'LENGTH']}
                              placeholder="Select type"
                            />
                          </Field>

                          {/* Conditional QTY Fields */}
                          {workOrder.fringeQtyType === 'PCS' && (
                            <Field label="PIECES" width="sm">
                              <Input
                                type="text"
                                value={workOrder.fringeQtyPcs || ''}
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeQtyPcs', e.target.value)}
                                placeholder="Enter pieces"
                              />
                            </Field>
                          )}

                          {workOrder.fringeQtyType === 'LENGTH' && (
                            <Field label="CNS/PC" width="sm">
                              <Input
                                type="text"
                                value={workOrder.fringeQtyCnsPerPc || ''}
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeQtyCnsPerPc', e.target.value)}
                                placeholder="Enter CNS/PC"
                              />
                            </Field>
                          )}

                          {/* TESTING REQUIREMENTS */}
                          <Field label="TESTING REQ." width="lg">
                            <div className="flex items-center" style={{ gap: '0.75rem' }}>
                              <div className="flex-1">
                                <TestingRequirementsInput
                                  value={Array.isArray(workOrder.fringeTestingRequirements) 
                                    ? workOrder.fringeTestingRequirements 
                                    : (workOrder.fringeTestingRequirements ? (typeof workOrder.fringeTestingRequirements === 'string' ? workOrder.fringeTestingRequirements.split(',').filter(v => v.trim()) : []) : [])}
                                  onChange={(values) => handleWorkOrderChange(actualIndex, woIndex, 'fringeTestingRequirements', values)}
                                  options={['Colour Fastness (light/UV)', 'Wash Resistance', 'Flammability']}
                                  placeholder="Type to search or select testing requirements..."
                                />
                              </div>
                              <input
                                type="file"
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeTestingRequirementsUpload', e.target.files[0])}
                                className="hidden"
                                id={`fringe-testing-requirements-upload-${materialIndex + 1}-${woIndex}`}
                                accept="image/*"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-11 flex-shrink-0"
                                onClick={() => document.getElementById(`fringe-testing-requirements-upload-${materialIndex + 1}-${woIndex}`)?.click()}
                              >
                                {workOrder.fringeTestingRequirementsUpload ? 'UPLOADED' : 'UPLOAD'}
                              </Button>
                            </div>
                          </Field>

                          {/* SURPLUS % */}
                          <Field label="SURPLUS %" width="sm">
                            <PercentInput
                              value={workOrder.fringeSurplus || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeSurplus', e.target.value)}
                              placeholder="e.g., 5"
                            />
                          </Field>

                          {/* WASTAGE % - With dropdown options */}
                          <Field label="WASTAGE %" width="sm">
                            <div className="relative">
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
                                className={workOrder.fringeWastage && !['Hem', 'Pillow Edge', 'Curtain Edge', 'Trim'].includes(workOrder.fringeWastage) ? 'pr-10' : ''}
                              />
                              {workOrder.fringeWastage && !['Hem', 'Pillow Edge', 'Curtain Edge', 'Trim'].includes(workOrder.fringeWastage) && (
                                <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', userSelect: 'none', zIndex: 10 }}>%</span>
                              )}
                            </div>
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.fringeApproval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'fringeApproval', selectedValue)}
                              options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                              placeholder="Select or type"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.fringeRemarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'fringeRemarks', e.target.value)}
                              placeholder="Text"
                            />
                          </Field>

                          {/* Advance Spec Section for FRINGE/TASSELS */}
                          <div className="w-full" style={{ marginTop: '20px' }}>
                            {/* Advance Spec Button */}
                            <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                              <Button
                                type="button"
                                variant={workOrder.showFringeAdvancedSpec ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  handleWorkOrderChange(
                                    actualIndex,
                                    woIndex,
                                    'showFringeAdvancedSpec',
                                    !workOrder.showFringeAdvancedSpec
                                  )
                                }
                              >
                                Advance Spec
                              </Button>
                            </div>

                            {/* Advanced Spec UI Table */}
                            {workOrder.showFringeAdvancedSpec && (
                              <div
                                style={{
                                  marginTop: '1.5rem',
                                  padding: '1.5rem',
                                  backgroundColor: 'var(--muted)',
                                  borderRadius: '0.75rem',
                                  border: '1px solid var(--border)',
                                  width: '100%',
                                }}
                              >
                                <h4 className="text-sm font-semibold text-foreground/90 mb-6">ADVANCE SPEC</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '16px 12px' }}>
                                  <Field label="FINISH" width="sm">
                                    <SearchableDropdown
                                      value={workOrder.fringeFinish || ''}
                                      onChange={(selectedValue) =>
                                        handleWorkOrderChange(actualIndex, woIndex, 'fringeFinish', selectedValue)
                                      }
                                      options={['High Sheen', 'Matte', 'Twisted', 'Braided Header']}
                                      placeholder="Select or type"
                                    />
                                  </Field>

                                  <Field label="ATTACHMENT" width="sm">
                                    <SearchableDropdown
                                      value={workOrder.fringeAttachment || ''}
                                      onChange={(selectedValue) =>
                                        handleWorkOrderChange(actualIndex, woIndex, 'fringeAttachment', selectedValue)
                                      }
                                      options={['Sew-On Header', 'Adhesive Back', 'Loop for Hanging']}
                                      placeholder="Select or type"
                                    />
                                  </Field>

                                  <Field label="CONSTRUCTION" width="sm">
                                    <SearchableDropdown
                                      value={workOrder.fringeConstruction || ''}
                                      onChange={(selectedValue) =>
                                        handleWorkOrderChange(actualIndex, woIndex, 'fringeConstruction', selectedValue)
                                      }
                                      options={['Knot Density', 'Fiber Count', 'Threads per inch']}
                                      placeholder="Select or type"
                                    />
                                  </Field>
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
                          <Field label="DYEING TYPE" width="sm">
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
                            />
                          </Field>

                          {/* COLOR REF */}
                          <Field label="COLOR REF" width="sm">
                            <SearchableDropdown
                              value={workOrder.colorRef || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'colorRef', selectedValue)}
                              options={workOrder.dyeingType ? getDyeingColorRefOptions(workOrder.dyeingType) : []}
                              placeholder={workOrder.dyeingType ? "Select or type Color Ref" : "Select Dyeing Type First"}
                              disabled={!workOrder.dyeingType}
                            />
                          </Field>

                          {/* REFERENCE TYPE */}
                          <Field label="REFERENCE TYPE" width="lg">
                            <SearchableDropdown
                              value={workOrder.referenceType || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'referenceType', selectedValue)}
                              options={workOrder.dyeingType ? getDyeingReferenceTypeOptions(workOrder.dyeingType) : []}
                              placeholder={workOrder.dyeingType ? "Select or type Reference Type" : "Select Dyeing Type First"}
                              disabled={!workOrder.dyeingType}
                            />
                          </Field>

                          {/* REFERENCE - Text Field (appears after REFERENCE TYPE is selected) */}
                          <Field label="REFERENCE" width="sm">
                            <Input
                              type="text"
                              value={workOrder.dyeingReference || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'dyeingReference', e.target.value)}
                              placeholder="Enter reference"
                            />
                          </Field>

                          {/* REFERENCE IMAGE (Upload) */}
                          <Field label="REFERENCE IMAGE" width="sm">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`dyeing-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`dyeing-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* SHRINKAGE WIDTH % */}
                          {isShrinkageWidthApplicable(workOrder.dyeingType) && (
                            <Field label="SHRINKAGE WIDTH %" width="sm">
                              <PercentInput
                                value={workOrder.shrinkageWidthPercent || ''}
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'shrinkageWidthPercent', e.target.value)}
                                placeholder="e.g., 2"
                              />
                            </Field>
                          )}

                          {/* SHRINKAGE LENGTH % */}
                          {isShrinkageLengthApplicable(workOrder.dyeingType) && (
                            <Field label="SHRINKAGE LENGTH %" width="sm">
                              <PercentInput
                                value={workOrder.shrinkageLengthPercent || ''}
                                onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'shrinkageLengthPercent', e.target.value)}
                                placeholder="e.g., 2"
                              />
                            </Field>
                          )}

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={DYEING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Enter remarks"
                            />
                          </Field>
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
                          <Field label="DESIGN REF" width="sm">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`weaving-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`weaving-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* REED */}
                          <Field
                            label="REED"
                            width="sm"
                            helper={workOrder.machineType ? getWeavingReedRange(workOrder.machineType) : undefined}
                          >
                            <Input
                              type="text"
                              value={workOrder.reed || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'reed', e.target.value)}
                              placeholder={
                                workOrder.machineType && getWeavingReedRange(workOrder.machineType)
                                  ? getWeavingReedRange(workOrder.machineType)
                                  : 'Numeric'
                              }
                            />
                          </Field>

                          {/* PICK */}
                          <Field
                            label="PICK"
                            width="sm"
                            helper={workOrder.machineType ? getWeavingPickRange(workOrder.machineType) : undefined}
                          >
                            <Input
                              type="text"
                              value={workOrder.pick || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pick', e.target.value)}
                              placeholder={
                                workOrder.machineType && getWeavingPickRange(workOrder.machineType)
                                  ? getWeavingPickRange(workOrder.machineType)
                                  : 'Numeric'
                              }
                            />
                          </Field>

                          {/* GSM */}
                          <Field label="GSM" width="sm">
                            <Input
                              type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'gsm', e.target.value)}
                              placeholder="Enter GSM"
                            />
                          </Field>

                          {/* WASTAGE % */}
                          <Field
                            label="WASTAGE %"
                            width="sm"
                            error={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}
                          >
                            <PercentInput
                              value={workOrder.wastage || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                              placeholder="e.g., 2"
                              error={Boolean(errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`])}
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={WEAVING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Text"
                            />
                          </Field>
                        </>
                      )}
                      
                      {/* Specific Fields for DYEING Shrinkage */}
                      {/* Tufting Specific Fields */}
                      {workOrder.workOrder === 'TUFTING' && (
                        <>
                          {/* DESIGN REF (Upload) */}
                          <Field label="DESIGN REF" width="sm">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`tufting-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`tufting-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* GSM */}
                          <Field label="GSM" width="sm">
                            <Input
                              type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'gsm', e.target.value)}
                              placeholder="Enter GSM"
                            />
                          </Field>

                          {/* PILE HEIGHT (mm) */}
                          <Field label="PILE HEIGHT (MM)" width="sm">
                            <Input
                              type="text"
                              value={workOrder.pileHeight || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pileHeight', e.target.value)}
                              placeholder="Enter pile height (mm)"
                            />
                          </Field>

                          {/* TPI (TUFT PER INCH) */}
                          <Field label="TPI (TUFT PER INCH)" width="sm">
                            <Input
                              type="text"
                              value={workOrder.tpi || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'tpi', e.target.value)}
                              placeholder="Enter TPI"
                            />
                          </Field>

                          {/* WASTAGE % */}
                          <Field label="WASTAGE %" width="sm" error={errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`]}>
                            <PercentInput
                              value={workOrder.wastage || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'wastage', e.target.value)}
                              placeholder="e.g., 2"
                              error={Boolean(errors[`rawMaterial_${actualIndex}_workOrder_${woIndex}_wastage`])}
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={TUFTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Text"
                            />
                          </Field>
                        </>
                      )}

                      {/* Carpet Specific Fields */}
                      {workOrder.workOrder === 'CARPET' && (
                        <>
                          {/* GSM */}
                          <Field label="GSM" width="sm">
                            <Input
                              type="text"
                              value={workOrder.gsm || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'gsm', e.target.value)}
                              placeholder="Enter GSM"
                            />
                          </Field>

                          {/* PILE HEIGHT (mm) */}
                          <Field label="PILE HEIGHT (MM)" width="sm">
                            <Input
                              type="text"
                              value={workOrder.pileHeight || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pileHeight', e.target.value)}
                              placeholder="Enter pile height"
                            />
                          </Field>

                          {/* TPI / KPSI */}
                          <Field label="TPI / KPSI" width="sm">
                            <Input
                              type="text"
                              value={workOrder.tpiKpsi || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'tpiKpsi', e.target.value)}
                              placeholder="Enter TPI/KPSI"
                            />
                          </Field>

                          {/* KNOT TYPE */}
                          <Field label="KNOT TYPE" width="sm">
                            <SearchableDropdown
                              value={workOrder.knotType || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'knotType', selectedValue)}
                              options={KNOT_TYPE_OPTIONS}
                              placeholder="Select or type Knot Type"
                            />
                          </Field>

                          {/* PITCH/ROWS */}
                          <Field label="PITCH/ROWS" width="sm">
                            <Input
                              type="text"
                              value={workOrder.pitchRows || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'pitchRows', e.target.value)}
                              placeholder="Enter pitch/rows"
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={CARPET_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* DESIGN REF (Upload) */}
                          <Field label="DESIGN REF" width="sm">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`carpet-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`carpet-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Enter remarks"
                            />
                          </Field>
                        </>
                      )}

                      {/* Advanced Filter for CARPET - Button right after REMARKS */}
                      {workOrder.workOrder === 'CARPET' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showCarpetAdvancedFilter ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showCarpetAdvancedFilter',
                                  !workOrder.showCarpetAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>

                          {/* Advanced Filter UI Table */}
                          {workOrder.showCarpetAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-6">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px 12px' }}>
                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)
                                    }
                                    options={workOrder.machineType ? getCarpetVariants(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Variant" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                <Field label="DESIGN" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.carpetDesign || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'carpetDesign', selectedValue)
                                    }
                                    options={workOrder.machineType ? getCarpetDesigns(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Design" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Cutting Specific Fields */}
                      {workOrder.workOrder === 'CUTTING' && (
                        <>
                          {/* VARIANTS - Dropdown */}
                          <Field label="VARIANTS" width="sm">
                            <SearchableDropdown
                              value={workOrder.variants || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)}
                              options={workOrder.machineType ? getCuttingVariants(workOrder.machineType) : []}
                              placeholder={workOrder.machineType ? "Select or type Variant" : "Select Machine Type First"}
                              disabled={!workOrder.machineType}
                            />
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={CUTTING_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Enter remarks"
                            />
                          </Field>
                        </>
                      )}

                      {/* Advanced Filter for CUTTING - Button right after REMARKS */}
                      {workOrder.workOrder === 'CUTTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showCuttingAdvancedFilter ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showCuttingAdvancedFilter',
                                  !workOrder.showCuttingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>

                          {/* Advanced Filter UI Table */}
                          {workOrder.showCuttingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-6">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px 12px' }}>
                                <Field label="CUT TYPE" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.cutType || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'cutType', selectedValue)
                                    }
                                    options={workOrder.machineType ? getCuttingCutTypes(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Cut Type" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                <Field label="LAYERS" width="sm">
                                  <Input
                                    type="text"
                                    value={workOrder.layers || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'layers', e.target.value)}
                                    placeholder="Enter layers"
                                  />
                                </Field>

                                <Field label="NESTING" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.nesting || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'nesting', selectedValue)
                                    }
                                    options={NESTING_OPTIONS}
                                    placeholder="Select or type Nesting"
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Embroidery Specific Fields */}
                      {workOrder.workOrder === 'EMBROIDERY' && (
                        <>
                          {/* DESIGN REF (Upload) */}
                          <Field label="DESIGN REF" width="sm">
                            <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`embroidery-file-${materialIndex + 1}-${woIndex}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-11 w-full"
                              onClick={() =>
                                document.getElementById(`embroidery-file-${materialIndex + 1}-${woIndex}`)?.click()
                              }
                            >
                              {workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}
                            </Button>
                          </Field>

                          {/* APPROVAL */}
                          <Field label="APPROVAL" width="sm">
                            <SearchableDropdown
                              value={workOrder.approval || ''}
                              onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'approval', selectedValue)}
                              options={EMBROIDERY_APPROVAL_OPTIONS}
                              placeholder="Select or type Approval"
                            />
                          </Field>

                          {/* REMARKS */}
                          <Field label="REMARKS" width="lg">
                            <Input
                              type="text"
                              value={workOrder.remarks || ''}
                              onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'remarks', e.target.value)}
                              placeholder="Enter remarks"
                            />
                          </Field>
                        </>
                      )}

                      {/* Advanced Filter for EMBROIDERY - At the very bottom after all fields */}
                      {workOrder.workOrder === 'EMBROIDERY' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showEmbroideryAdvancedFilter ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showEmbroideryAdvancedFilter',
                                  !workOrder.showEmbroideryAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>

                          {/* Advanced Filter UI Table */}
                          {workOrder.showEmbroideryAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-6">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px 12px' }}>
                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)
                                    }
                                    options={workOrder.machineType ? getEmbroideryVariants(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Variant" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                <Field label="DESIGN" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.embroideryDesign || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'embroideryDesign', selectedValue)
                                    }
                                    options={workOrder.machineType ? getEmbroideryDesigns(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? "Select or type Design" : "Select Machine Type First"}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                <Field
                                  label="THREAD COLORS"
                                  width="sm"
                                  helper={workOrder.machineType ? getEmbroideryThreadColors(workOrder.machineType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.threadColors || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'threadColors', e.target.value)}
                                    placeholder={
                                      workOrder.machineType
                                        ? `Enter ${getEmbroideryThreadColors(workOrder.machineType)}`
                                        : 'Enter thread colors'
                                    }
                                  />
                                </Field>

                                <Field
                                  label="STITCH COUNT"
                                  width="sm"
                                  helper={workOrder.machineType ? getEmbroideryStitchCount(workOrder.machineType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.stitchCount || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'stitchCount', e.target.value)}
                                    placeholder={
                                      workOrder.machineType
                                        ? `Enter ${getEmbroideryStitchCount(workOrder.machineType)}`
                                        : 'Enter stitch count'
                                    }
                                  />
                                </Field>

                                <Field
                                  label="HOOP/FRAME SIZE"
                                  width="sm"
                                  helper={workOrder.machineType ? getEmbroideryHoopFrameSize(workOrder.machineType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.hoopFrameSize || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'hoopFrameSize', e.target.value)}
                                    placeholder={
                                      workOrder.machineType
                                        ? `Enter ${getEmbroideryHoopFrameSize(workOrder.machineType)}`
                                        : 'Enter hoop/frame size'
                                    }
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for PRINTING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'PRINTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showPrintingAdvancedFilter ? 'default' : 'outline'}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showPrintingAdvancedFilter',
                                  !workOrder.showPrintingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showPrintingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-4">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
                                {/* VARIANTS */}
                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)
                                    }
                                    options={workOrder.printingType ? getPrintingVariants(workOrder.printingType) : []}
                                    placeholder={workOrder.printingType ? 'Select or type' : 'Select Printing Type First'}
                                    disabled={!workOrder.printingType}
                                  />
                                </Field>

                                {/* DESIGN */}
                                <Field label="DESIGN" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.printingDesign || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'printingDesign', selectedValue)
                                    }
                                    options={workOrder.printingType ? getPrintingDesigns(workOrder.printingType) : []}
                                    placeholder={workOrder.printingType ? 'Select or type' : 'Select Printing Type First'}
                                    disabled={!workOrder.printingType}
                                  />
                                </Field>

                                {/* # OF SCREENS */}
                                <Field
                                  label="# OF SCREENS"
                                  width="sm"
                                  helper={workOrder.printingType ? getPrintingNumberOfScreens(workOrder.printingType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.numberOfScreens || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'numberOfScreens', e.target.value)}
                                    placeholder={
                                      workOrder.printingType ? getPrintingNumberOfScreens(workOrder.printingType) : 'Enter # of screens'
                                    }
                                  />
                                </Field>

                                {/* COLORS */}
                                <Field label="COLORS" width="sm" helper={workOrder.printingType ? getPrintingColors(workOrder.printingType) : undefined}>
                                  <Input
                                    type="text"
                                    value={workOrder.colors || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'colors', e.target.value)}
                                    placeholder={workOrder.printingType ? getPrintingColors(workOrder.printingType) : 'Enter colors'}
                                  />
                                </Field>

                                {/* COVERAGE % */}
                                <Field
                                  label="COVERAGE %"
                                  width="sm"
                                  helper={workOrder.printingType ? getPrintingCoveragePercent(workOrder.printingType) : undefined}
                                >
                                  <PercentInput
                                    value={workOrder.coveragePercent || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'coveragePercent', e.target.value)}
                                    placeholder={workOrder.printingType ? getPrintingCoveragePercent(workOrder.printingType) : 'Enter coverage %'}
                                  />
                                </Field>

                                {/* RESOLUTION */}
                                <Field
                                  label="RESOLUTION"
                                  width="sm"
                                  helper={workOrder.printingType ? getPrintingResolution(workOrder.printingType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.resolution || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'resolution', e.target.value)}
                                    placeholder={workOrder.printingType ? getPrintingResolution(workOrder.printingType) : 'Enter resolution'}
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Advanced Filter for QUILTING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'QUILTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showQuiltingAdvancedFilter ? 'default' : 'outline'}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showQuiltingAdvancedFilter',
                                  !workOrder.showQuiltingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showQuiltingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-4">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
                                {/* VARIANTS */}
                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)
                                    }
                                    options={workOrder.quiltingType ? getQuiltingVariants(workOrder.quiltingType) : []}
                                    placeholder={workOrder.quiltingType ? 'Select or type' : 'Select Quilting Type First'}
                                    disabled={!workOrder.quiltingType}
                                  />
                                </Field>

                                {/* DESIGN */}
                                <Field label="DESIGN" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.quiltingDesign || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'quiltingDesign', selectedValue)
                                    }
                                    options={workOrder.quiltingType ? getQuiltingDesigns(workOrder.quiltingType) : []}
                                    placeholder={workOrder.quiltingType ? 'Select or type' : 'Select Quilting Type First'}
                                    disabled={!workOrder.quiltingType}
                                  />
                                </Field>

                                {/* NEEDLE SPACING */}
                                <Field
                                  label="NEEDLE SPACING"
                                  width="sm"
                                  helper={workOrder.quiltingType ? getQuiltingNeedleSpacing(workOrder.quiltingType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.needleSpacing || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'needleSpacing', e.target.value)}
                                    placeholder={
                                      workOrder.quiltingType ? getQuiltingNeedleSpacing(workOrder.quiltingType) : 'Enter needle spacing'
                                    }
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for SEWING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'SEWING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showSewingAdvancedFilter ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showSewingAdvancedFilter',
                                  !workOrder.showSewingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>

                          {/* Advanced Filter UI Table */}
                          {workOrder.showSewingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-6">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px 12px' }}>
                                <Field label="MACHINE TYPE" width="sm">
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
                                  />
                                </Field>

                                <Field
                                  label="STITCH TYPE"
                                  width="sm"
                                  helper={workOrder.sewingMachineType ? getSewingStitchType(workOrder.sewingMachineType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.stitchType || getSewingStitchType(workOrder.sewingMachineType) || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'stitchType', e.target.value)}
                                    placeholder={
                                      workOrder.sewingMachineType
                                        ? getSewingStitchType(workOrder.sewingMachineType)
                                        : 'Enter stitch type'
                                    }
                                    disabled={!workOrder.sewingMachineType}
                                  />
                                </Field>

                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)
                                    }
                                    options={workOrder.sewingMachineType ? getSewingVariants(workOrder.sewingMachineType) : []}
                                    placeholder={workOrder.sewingMachineType ? "Select or type Variant" : "Select Machine Type First"}
                                    disabled={!workOrder.sewingMachineType}
                                  />
                                </Field>

                                <Field label="NEEDLE SIZE" width="sm">
                                  <Input
                                    type="text"
                                    value={workOrder.needleSize || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'needleSize', e.target.value)}
                                    placeholder="TEXT"
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for WEAVING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'WEAVING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showWeavingAdvancedFilter ? 'default' : 'outline'}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showWeavingAdvancedFilter',
                                  !workOrder.showWeavingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showWeavingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-4">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
                                {/* VARIANTS */}
                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)}
                                    options={workOrder.machineType ? getWeavingVariants(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? 'Select or type' : 'Select Machine Type First'}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                {/* DESIGN */}
                                <Field label="DESIGN" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.weavingDesign || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'weavingDesign', selectedValue)
                                    }
                                    options={workOrder.machineType ? getWeavingDesigns(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? 'Select or type' : 'Select Machine Type First'}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                {/* WARP RATIO */}
                                <Field label="WARP RATIO" width="sm" helper="0–1 (sum with weft = 1)">
                                  <Input
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
                                    placeholder="0-1"
                                  />
                                </Field>

                                {/* WEFT RATIO */}
                                <Field label="WEFT RATIO" width="sm" helper="0–1 (sum with warp = 1)">
                                  <Input
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
                                    placeholder="0-1"
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced Filter for TUFTING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'TUFTING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Show/Hide Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showTuftingAdvancedFilter ? 'default' : 'outline'}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showTuftingAdvancedFilter',
                                  !workOrder.showTuftingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>
                          
                          {/* Advanced Filter UI Table */}
                          {workOrder.showTuftingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-4">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px 12px' }}>
                                {/* DESIGN */}
                                <Field label="DESIGN" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.tuftingDesign || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'tuftingDesign', selectedValue)
                                    }
                                    options={workOrder.machineType ? getTuftingDesigns(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? 'Select or type' : 'Select Machine Type First'}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                {/* VARIANTS */}
                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) => handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)}
                                    options={workOrder.machineType ? getTuftingVariants(workOrder.machineType) : []}
                                    placeholder={workOrder.machineType ? 'Select or type' : 'Select Machine Type First'}
                                    disabled={!workOrder.machineType}
                                  />
                                </Field>

                                {/* MACHINE GAUGE */}
                                <Field
                                  label="MACHINE GAUGE"
                                  width="sm"
                                  helper={workOrder.machineType ? getTuftingMachineGauge(workOrder.machineType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.machineGauge || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'machineGauge', e.target.value)}
                                    placeholder={
                                      workOrder.machineType ? getTuftingMachineGauge(workOrder.machineType) : 'Enter machine gauge'
                                    }
                                  />
                                </Field>

                                {/* STITCH RATE */}
                                <Field
                                  label="STITCH RATE"
                                  width="sm"
                                  helper={workOrder.machineType ? getTuftingStitchRate(workOrder.machineType) : undefined}
                                >
                                  <Input
                                    type="text"
                                    value={workOrder.stitchRate || ''}
                                    onChange={(e) => handleWorkOrderChange(actualIndex, woIndex, 'stitchRate', e.target.value)}
                                    placeholder={
                                      workOrder.machineType ? getTuftingStitchRate(workOrder.machineType) : 'Enter stitch rate'
                                    }
                                  />
                                </Field>
                              </div>
                            </div>
                          )}
                        </div>
                      )}


                      {/* Advanced Filter for DYEING - At the very bottom after all fields */}
                      {workOrder.workOrder === 'DYEING' && (
                        <div className="w-full" style={{ marginTop: '20px' }}>
                          {/* Advance Spec Button */}
                          <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }} className="w-full">
                            <Button
                              type="button"
                              variant={workOrder.showDyeingAdvancedFilter ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleWorkOrderChange(
                                  actualIndex,
                                  woIndex,
                                  'showDyeingAdvancedFilter',
                                  !workOrder.showDyeingAdvancedFilter
                                )
                              }
                            >
                              Advance Spec
                            </Button>
                          </div>

                          {/* Advanced Filter UI Table */}
                          {workOrder.showDyeingAdvancedFilter && (
                            <div
                              style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: 'var(--muted)',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--border)',
                                width: '100%',
                              }}
                            >
                              <h4 className="text-sm font-semibold text-foreground/90 mb-6">ADVANCE SPEC</h4>

                              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px 12px' }}>
                                <Field label="VARIANTS" width="sm">
                                  <SearchableDropdown
                                    value={workOrder.variants || ''}
                                    onChange={(selectedValue) =>
                                      handleWorkOrderChange(actualIndex, woIndex, 'variants', selectedValue)
                                    }
                                    options={workOrder.dyeingType ? getDyeingVariants(workOrder.dyeingType) : []}
                                    placeholder={workOrder.dyeingType ? "Select or type Variant" : "Select Dyeing Type First"}
                                    disabled={!workOrder.dyeingType}
                                  />
                                </Field>
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
              <div className="mt-6 pt-6" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <Button
                  type="button"
                  variant="outline"
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
                >
                  + Add Work Order
                </Button>
              </div>
              )}
            </div>
          </div>
              );
            })
          )}

          {/* Bottom Save and Add Raw Material Buttons - Only show when materials exist */}
          {materialsForComponent.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Button
                type="button"
                variant="outline"
                onClick={handleBottomSave}
                className={cn(
                  'min-w-[90px]',
                  saveStatus === 'error'
                    ? 'text-red-600 border-red-500 hover:text-red-700'
                    : isComponentDone(selectedComponent)
                      ? 'text-green-600 hover:text-green-700'
                      : ''
                )}
              >
                {saveStatus === 'error'
                  ? 'Not Saved'
                  : isComponentDone(selectedComponent)
                    ? 'Saved'
                    : 'Save'}
              </Button>
            <div style={{ position: 'relative' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMaterialTypeModal(!showMaterialTypeModal)}
              >
                Add Raw Material
              </Button>
              {showMaterialTypeModal && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
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
