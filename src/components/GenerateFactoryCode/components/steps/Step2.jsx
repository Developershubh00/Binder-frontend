import { useEffect, useRef } from 'react';
import { getFiberTypes, getYarnTypes, getSpinningMethod, getYarnDetails } from '../../utils/yarnHelpers';

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
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <h3 className="text-sm font-bold text-gray-800 mb-4">FIBER SPECIFICATIONS</h3>
                <div className="flex flex-wrap items-start gap-6">
                  {/* Fiber Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      FIBER TYPE
                    </label>
                    <select
                      value={material.fiberType || ''}
                      onChange={(e) => handleRawMaterialChange(materialIndex, 'fiberType', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    >
                      <option value="">Select Fiber Type</option>
                      {getFiberTypes().map(fiberType => (
                        <option key={fiberType} value={fiberType}>{fiberType}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Yarn Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      YARN TYPE
                    </label>
                    <select
                      value={material.yarnType || ''}
                      onChange={(e) => handleRawMaterialChange(materialIndex, 'yarnType', e.target.value)}
                      disabled={!material.fiberType}
                      className={`border-2 rounded-lg text-sm transition-all ${
                        !material.fiberType 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                      }`}
                      style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                      onFocus={(e) => {
                        if (material.fiberType) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                    >
                      <option value="">{material.fiberType ? 'Select Yarn Type' : 'Select Fiber Type First'}</option>
                      {getYarnTypes(material.fiberType).map(yarnType => (
                        <option key={yarnType} value={yarnType}>{yarnType}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Spinning Method Display (Read-only, auto-populated) */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      SPINNING METHOD
                    </label>
                    <input
                      type="text"
                      value={material.spinningMethod || ''}
                      readOnly
                      className="border-2 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                      style={{ padding: '10px 14px', width: '220px', height: '44px', borderColor: '#e5e7eb' }}
                      placeholder="Auto-populated"
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
                          <input
                            type="text"
                            value={material.yarnComposition || ''}
                            onChange={(e) => handleRawMaterialChange(materialIndex, 'yarnComposition', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 100% Cotton"
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            COUNT RANGE <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={material.yarnCountRange || ''}
                            onChange={(e) => handleRawMaterialChange(materialIndex, 'yarnCountRange', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 6-40"
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            DOUBLING OPTIONS <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={material.yarnDoublingOptions || ''}
                            onChange={(e) => handleRawMaterialChange(materialIndex, 'yarnDoublingOptions', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Single, 2-ply"
                          />
                        </div>
                        
                        <div className="flex flex-col" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            PLY OPTIONS <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={material.yarnPlyOptions || ''}
                            onChange={(e) => handleRawMaterialChange(materialIndex, 'yarnPlyOptions', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 1, 2, 3, 4"
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
                          <input
                            type="text"
                            value={details.windingOptions || ''}
                            readOnly
                            className="border-2 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                            style={{ padding: '10px 14px', height: '44px', borderColor: '#e5e7eb' }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            
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
                      <select
                        value={workOrder.workOrder || ''}
                        onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'workOrder', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                        onFocus={(e) => {
                          if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        required
                      >
                        <option value="">Select</option>
                        <option value="WEAVING">WEAVING</option>
                        <option value="TUFTING">TUFTING</option>
                        <option value="QUILTING">QUILTING</option>
                        <option value="PRINTING">PRINTING</option>
                        <option value="KNITTING">KNITTING</option>
                        <option value="EMBROIDERY">EMBROIDERY</option>
                        <option value="DYEING">DYEING</option>
                        <option value="BRAIDING">BRAIDING</option>
                        <option value="CARPET">CARPET</option>
                        <option value="CUTTING">CUTTING</option>
                      </select>
                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`]}
                        </span>
                      )}
                    </div>
                    
                    {/* WASTAGE and FOR fields - Hidden for KNITTING, DYEING, and CUTTING as they have their own sections */}
                    {workOrder.workOrder && workOrder.workOrder !== 'KNITTING' && workOrder.workOrder !== 'DYEING' && workOrder.workOrder !== 'CUTTING' && (
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
                        
                        {/* FOR field - Hidden for CUTTING */}
                        {workOrder.workOrder !== 'CUTTING' && (
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              FOR <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={workOrder.forField || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'forField', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                              }}
                              onBlur={(e) => {
                                e.target.style.boxShadow = '';
                              }}
                              placeholder="e.g., Front Fabric"
                              required
                            />
                            {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`]}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Conditional Fields based on Work Order Type */}
                  {workOrder.workOrder && (
                    <div className="w-full flex flex-wrap items-start mt-14 pt-6 border-t border-gray-50" style={{ gap: '24px 32px', marginTop: '20px' }}>
                      {/* Machine Type / Specific Type Dropdown */}
                      {(['WEAVING', 'TUFTING', 'KNITTING', 'EMBROIDERY', 'BRAIDING', 'CARPET', 'CUTTING'].includes(workOrder.workOrder)) && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MACHINE TYPE</label>
                          <select
                            value={workOrder.machineType || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'machineType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="">Select</option>
                            {workOrder.workOrder === 'WEAVING' && ['WATER JET', 'AIRJET', 'DOBBY', 'FRAMELOOM', 'PITLOOM', 'JACQUARD', 'JUMBO JACQUARD', 'POWERLOOM', 'SHUTTLELESS', 'PANJA LOOM', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {workOrder.workOrder === 'TUFTING' && ['COMPUTERISED', 'MULTINEEDLE', 'FOUR NEEDLE/ TABLE TUFTING', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {workOrder.workOrder === 'KNITTING' && ['CIRCULAR', 'FLATBED', 'CROCHET', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {workOrder.workOrder === 'EMBROIDERY' && ['AARI/ TERRY EMBROIDERY', 'DORI/ ROPE EMBROIDERY', 'RICE STITCH', 'MULTI THREAD', 'SINGLE THREAD', 'COUCHING', 'PIN TUCKING', 'PLEATING'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {workOrder.workOrder === 'BRAIDING' && ['HAND BRAID', 'MACHINE BRAID', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {workOrder.workOrder === 'CARPET' && ['BROADLOOM', 'HAND TUFTED', 'MACHINE MADE- WAN DE VEILE', 'WALL 2 WALL', 'HAND KNOTTED', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {workOrder.workOrder === 'CUTTING' && ['CUTTER', 'SCISSOR', 'LASER'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}

                      {/* Other specific type dropdowns */}
                      {workOrder.workOrder === 'QUILTING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">QUILTING TYPE</label>
                          <select
                            value={workOrder.quiltingType || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'quiltingType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="">Select</option>
                            {['HAND QUILTING', 'MULTINEEDLE', 'MULTINEEDLE+EMBROIDERY', 'SINGLE NEEDLE', 'SCHIFFLEY', 'PESCE SLIDING', 'ULTRASONIC', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}

                      {workOrder.workOrder === 'PRINTING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING TYPE</label>
                          <select
                            value={workOrder.printingType || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'printingType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="">Select</option>
                            {['BLOCK PRINT', 'COTTON-DIGITAL PRINT', 'LAMINATION POLYESTER DIGITAL PRINT', 'ROTARY PRINT', 'SCREEN PRINT', 'FLOCKING', 'OTHER'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}

                      {workOrder.workOrder === 'DYEING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DYEING TYPE</label>
                          <select
                            value={workOrder.dyeingType || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'dyeingType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="">Select</option>
                            {['ARTIFICIAL FABRIC', 'ARTIFICIAL YARN', 'COTTON BATHMAT/ BATHRUG', 'NATURAL FABRIC', 'NATURAL YARN', 'POLYESTER BATHMAT', 'STONEWASH', 'ENZYME WASH', 'ACID WASH'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}

                      {/* DESIGN (Input) - Applicable to many */}
                      {['WEAVING', 'TUFTING', 'QUILTING', 'PRINTING', 'KNITTING', 'EMBROIDERY', 'BRAIDING', 'CARPET'].includes(workOrder.workOrder) && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN</label>
                          <input
                            type="text"
                            value={workOrder.design || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'design', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                            placeholder="e.g. TWILL WEAVE"
                          />
                        </div>
                      )}

                      {/* RECEIVED COLOR REFERENCE for DYEING */}
                      {workOrder.workOrder === 'DYEING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">RECEIVED COLOR REFERENCE</label>
                          <select
                            value={workOrder.receivedColorReference || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'receivedColorReference', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="">Select</option>
                            {['PANTONE', 'ARS', 'CSI', 'PMS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}
                      
                      {/* REFERENCE TYPE for DYEING */}
                      {workOrder.workOrder === 'DYEING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REFERENCE TYPE</label>
                          <select
                            value={workOrder.referenceType || ''}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'referenceType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="">Select</option>
                            {['TPG', 'TCX', 'COATED', 'UNCOAT'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      )}
                      
                      {/* Image Upload - Hidden for CUTTING */}
                      {workOrder.workOrder !== 'CUTTING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            {workOrder.workOrder === 'DYEING' ? 'REFERENCE IMAGE' : 'IMAGE REF'}
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
                      
                      {/* Specific Fields for WEAVING */}
                      {workOrder.workOrder === 'WEAVING' && (
                        <>
                          {/* REED and PICK Fields */}
                          <div className="w-full mt-4">
                            <div className="flex flex-wrap items-start gap-4" style={{ marginBottom: '24px' }}>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">REED</label>
                                <input
                                  type="text"
                                  value={workOrder.reed || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'reed', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                                  placeholder="Enter reed"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">PICK</label>
                                <input
                                  type="text"
                                  value={workOrder.pick || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pick', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                                  placeholder="Enter pick"
                                />
                              </div>
                            </div>
                            
                            {/* WARP & WEFT Radio Buttons Section */}
                            <div className="w-full">
                              <div className="flex flex-wrap items-start gap-6">
                                <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                                  <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={workOrder.warp || false}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'warp', e.target.checked)}
                                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">WARP</span>
                                  </label>
                                  {workOrder.warp && (
                                    <input
                                      type="number"
                                      step="0.001"
                                      value={workOrder.ratioWarp || ''}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWarp', e.target.value)}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                      style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                      placeholder="0.4"
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                                  <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={workOrder.weft || false}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'weft', e.target.checked)}
                                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">WEFT</span>
                                  </label>
                                  {workOrder.weft && (
                                    <input
                                      type="number"
                                      step="0.001"
                                      value={workOrder.ratioWeft || ''}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWeft', e.target.value)}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                      style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                      placeholder="0.25"
                                    />
                                  )}
                                </div>
                              </div>
                              {/* RATIO WEIGHT/%AGE Row */}
                              <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">RATIO WEIGHT/%AGE</label>
                                  <input
                                    type="text"
                                    value={workOrder.ratioWeightWarp || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWeightWarp', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>
                              </div>
                              {/* WASTAGE Row */}
                              <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE</label>
                                  <input
                                    type="text"
                                    value={workOrder.wastage || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                      errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                        ? 'border-red-600' 
                                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                                    }`}
                                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
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
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                                  <input
                                    type="text"
                                    value={workOrder.forSection || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'forSection', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                                    placeholder="FOR-SECTION"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Specific Fields for KNITTING */}
                      {workOrder.workOrder === 'KNITTING' && (
                        <div className="w-full mt-4">
                          <div className="flex flex-wrap items-start gap-6">
                            <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={workOrder.wales || false}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wales', e.target.checked)}
                                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-gray-700">WALES:</span>
                              </label>
                              {workOrder.wales && (
                                <input
                                  type="number"
                                  step="0.001"
                                  value={workOrder.ratioWales || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWales', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                                  placeholder="0.4"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={workOrder.courses || false}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'courses', e.target.checked)}
                                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm font-semibold text-gray-700">COURSES:</span>
                              </label>
                              {workOrder.courses && (
                                <input
                                  type="number"
                                  step="0.001"
                                  value={workOrder.ratioCourses || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioCourses', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                                  placeholder="0.25"
                                />
                              )}
                            </div>
                          </div>
                          {/* RATIO WEIGHT/%AGE Row */}
                          <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">RATIO WEIGHT/%AGE</label>
                              <input
                                type="text"
                                value={workOrder.ratioWeightWales || ''}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWeightWales', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                          </div>
                          {/* WASTAGE Row */}
                          <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE</label>
                              <input
                                type="text"
                                value={workOrder.wastage || ''}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                                className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                  errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                    ? 'border-red-600' 
                                    : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                                }`}
                                style={{ padding: '10px 14px', width: '120px', height: '44px' }}
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
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                              <input
                                type="text"
                                value={workOrder.forSection || ''}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'forSection', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                                placeholder="FOR-SECTION"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Specific Fields for DYEING Shrinkage */}
                      {workOrder.workOrder === 'DYEING' && (
                        <div className="w-full mt-4">
                          <div className="mb-4">
                            <h5 className="text-sm font-bold text-gray-800 mb-3">SHRINKAGE</h5>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                              <div className="flex flex-col">
                                <label className="flex items-center gap-3 cursor-pointer mb-2">
                                  <input
                                    type="checkbox"
                                    checked={workOrder.shrinkageWidth || false}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageWidth', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <span className="text-sm font-semibold text-gray-700">WIDTH</span>
                                </label>
                                {workOrder.shrinkageWidth && (
                                  <input
                                    type="text"
                                    value={workOrder.shrinkageWidthPercent || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageWidthPercent', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="3%"
                                  />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <label className="flex items-center gap-3 cursor-pointer mb-2">
                                  <input
                                    type="checkbox"
                                    checked={workOrder.shrinkageLength || false}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageLength', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <span className="text-sm font-semibold text-gray-700">LENGTH</span>
                                </label>
                                {workOrder.shrinkageLength && (
                                  <input
                                    type="text"
                                    value={workOrder.shrinkageLengthPercent || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageLengthPercent', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="1%"
                                  />
                                )}
                              </div>
                            </div>
                            
                            {/* RATIO %AGE Section - Always Visible */}
                            <div className="mb-6" style={{ marginTop: '24px' }}>
                              <h5 className="text-sm font-bold text-gray-800 mb-3">RATIO %AGE</h5>
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                  <label className="text-xs font-semibold text-gray-600 mb-1">RATIO %AGE</label>
                                  <input
                                    type="number"
                                    step="0.001"
                                    value={workOrder.ratioWidth || workOrder.ratioLength || ''}
                                    onChange={(e) => {
                                      if (workOrder.shrinkageWidth && workOrder.shrinkageLength) {
                                        handleWorkOrderChange(materialIndex, woIndex, 'ratioWidth', e.target.value);
                                        handleWorkOrderChange(materialIndex, woIndex, 'ratioLength', e.target.value);
                                      } else if (workOrder.shrinkageWidth) {
                                        handleWorkOrderChange(materialIndex, woIndex, 'ratioWidth', e.target.value);
                                      } else if (workOrder.shrinkageLength) {
                                        handleWorkOrderChange(materialIndex, woIndex, 'ratioLength', e.target.value);
                                      }
                                    }}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="RATIO %AGE"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-xs font-semibold text-gray-600 mb-1">FOR-SECTION</label>
                                  <input
                                    type="text"
                                    value={workOrder.forSection || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'forSection', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="FOR-SECTION"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* WASTAGE Row - Separate */}
                            <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE</label>
                                <input
                                  type="text"
                                  value={workOrder.wastage || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                    errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                      ? 'border-red-600' 
                                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                                  }`}
                                  style={{ padding: '10px 14px', width: '120px', height: '44px' }}
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
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Specific Fields for TUFTING & CARPET */}
                      {(['TUFTING', 'CARPET'].includes(workOrder.workOrder)) && (
                        <>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">PILE HEIGHT</label>
                            <input
                              type="text"
                              value={workOrder.pileHeight || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pileHeight', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">TPI</label>
                            <input
                              type="text"
                              value={workOrder.tpi || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'tpi', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>
                        </>
                      )}

                      {workOrder.workOrder === 'CUTTING' && (
                        <>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">CUT TYPE</label>
                            <select
                              value={workOrder.cutType || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'cutType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            >
                              <option value="">Select</option>
                              {['LAYERED', 'PANEL'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">CUT SIZE (LENGTH)</label>
                            <input
                              type="text"
                              value={workOrder.cutSize || ''}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'cutSize', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            />
                          </div>
                        </>
                      )}

                      {/* Common Approval Against */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL AGAINST</label>
                        <select
                          value={workOrder.approvalAgainst || ''}
                          onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'approvalAgainst', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                          onBlur={(e) => e.target.style.boxShadow = ''}
                        >
                          <option value="">Select</option>
                          <option value="BUYER'S SAMPLE">BUYER'S SAMPLE</option>
                          <option value="INITIAL SAMPLE">INITIAL SAMPLE</option>
                          <option value="PP SAMPLE">PP SAMPLE</option>
                        </select>
                      </div>

                      {/* Remarks */}
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
