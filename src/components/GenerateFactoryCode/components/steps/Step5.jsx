import { useEffect, useRef } from 'react';

const Step5 = ({
  formData,
  errors,
  handlePackagingChange,
  handlePackagingMaterialChange,
  handlePackagingMaterialSizeChange,
  handlePackagingWorkOrderChange,
  addPackagingMaterial,
  removePackagingMaterial
}) => {
  const prevMaterialsLengthRef = useRef(formData.packaging?.materials?.length || 0);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevMaterialsLengthRef.current = formData.packaging?.materials?.length || 0;
      return;
    }
    
    const currentMaterialsLength = formData.packaging?.materials?.length || 0;
    if (currentMaterialsLength > prevMaterialsLengthRef.current) {
      setTimeout(() => {
        const lastMaterial = document.querySelector('[data-packaging-material-index]:last-child');
        if (lastMaterial) {
          lastMaterial.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
    prevMaterialsLengthRef.current = currentMaterialsLength;
  }, [formData.packaging?.materials?.length]);
  return (
<div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-5 PACKAGING</h2>
          <p className="text-sm text-gray-600">Configure packaging specifications and materials</p>
        </div>
      </div>

      {/* Header Configuration */}
      <div className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 className="text-sm font-bold text-gray-800" style={{ marginBottom: '16px' }}>PACKAGING HEADER</h3>
        
        <div className="flex flex-wrap items-start gap-4">
          {/* PRODUCT */}
          <div className="flex flex-col" style={{ width: '250px' }}>
            <label className="text-sm font-semibold text-gray-700 mb-2">PRODUCT</label>
            <input
              type="text"
              value={formData.packaging.productSelection}
              onChange={(e) => handlePackagingChange('productSelection', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
              style={{ padding: '10px 14px', height: '44px' }}
              placeholder="e.g., COMFORTER+PILLOW+BAG"
            />
          </div>

          {/* TYPE */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
            <select
              value={formData.packaging.type}
              onChange={(e) => handlePackagingChange('type', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
            >
              <option value="STANDARD">STANDARD</option>
              <option value="ASSORTED">ASSORTED (LINK IPC#)</option>
            </select>
          </div>

          {/* CASEPACK QTY */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">CASEPACK QTY</label>
            <input
              type="number"
              value={formData.packaging.casepackQty}
              onChange={(e) => handlePackagingChange('casepackQty', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', width: '120px', height: '44px' }}
              placeholder="10"
              />
            </div>

          {/* IPC Link for Assorted */}
        {formData.packaging.type === 'ASSORTED' && (
              <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">LINK IPC#</label>
                <input
                  type="text"
                  value={formData.packaging.assortedSkuLink}
                  onChange={(e) => handlePackagingChange('assortedSkuLink', e.target.value)}
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                placeholder="IPC-123"
              />
          </div>
        )}
      </div>
        </div>

      {/* Packaging Materials */}
      <div>
        {formData.packaging.materials && formData.packaging.materials.length > 0 ? formData.packaging.materials.map((material, materialIndex) => (
          <div key={materialIndex} id={`packaging-material-${materialIndex}`} data-packaging-material-index={materialIndex} className="bg-white rounded-xl border-2 border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header with Remove Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h4 className="text-sm font-bold text-gray-800 underline underline-offset-4">MATERIAL {materialIndex + 1}</h4>
              {formData.packaging.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePackagingMaterial(materialIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#fee2e2',
                    borderColor: '#fca5a5',
                    color: '#b91c1c',
                    padding: '4px 10px',
                    height: '28px'
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Basic Info: Components, Material Description, Consumption, Unit, Work Order, Placement */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex flex-wrap items-start gap-4">
              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                <input
                  type="text"
                    value={material.components}
                    onChange={(e) => handlePackagingMaterialChange(materialIndex, 'components', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                    placeholder="e.g., N/A"
                  />
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL DESCRIPTION</label>
                <input
                  type="text"
                    value={material.product}
                    onChange={(e) => handlePackagingMaterialChange(materialIndex, 'product', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    placeholder="e.g., Corrugated Box"
                />
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">CONS. PER PC</label>
                <input
                  type="number"
                    step="0.01"
                  value={material.netConsumptionPerPc}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'netConsumptionPerPc', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '110px', height: '44px' }}
                    placeholder="0.5"
                  />
            </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                <select
                  value={material.unit}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'unit', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  >
                    <option value="Pc">Pc</option>
                    <option value="Set">Set</option>
                    <option value="Roll">Roll</option>
                    <option value="Kgs">Kgs</option>
                </select>
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">WORK ORDER</label>
                <input
                    type="text"
                    value={material.workOrders[0].workOrder}
                    onChange={(e) => handlePackagingWorkOrderChange(materialIndex, 0, 'workOrder', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                    placeholder="PACKAGING"
                  />
              </div>

                <div className="flex flex-col" style={{ flexGrow: 1, minWidth: '250px' }}>
                <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                <input
                  type="text"
                  value={material.placement}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'placement', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', height: '44px' }}
                    placeholder="1 ON THE CENTER OF THE LARGER SIDE..."
                />
              </div>
            </div>

              {/* SIZE Row */}
              <div className="flex flex-wrap items-start gap-4 mt-8" style={{marginTop: '20px'}}>
                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                    <input
                      type="number"
                      value={material.size.width}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                      placeholder="52"
                    />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                    <input
                      type="number"
                      value={material.size.length}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'length', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                    placeholder="48"
                  />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT</label>
                    <input
                      type="number"
                      value={material.size.height}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'height', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                    placeholder="52"
                  />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                    <select
                      value={material.size.unit}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    >
                      <option value="CMS">CMS</option>
                      <option value="INCHES">INCHES</option>
                      <option value="MM">MM</option>
                    </select>
                  </div>
                </div>
              </div>

            {/* CATEGORY SELECTOR & CONDITIONAL FIELDS */}
            <div className="w-full mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col" style={{ width: '280px', marginBottom: '24px' }}>
                <label className="text-sm font-bold text-gray-800 mb-2">PACKAGING MATERIAL TYPE</label>
                <select
                  value={material.packagingMaterialType || ''}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'packagingMaterialType', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                >
                  <option value="">Select Type</option>
                  <option value="CARTONS/CORRUGATED BOX">CARTONS/CORRUGATED BOX</option>
                  <option value="PACKAGING ACCESSORIES">PACKAGING ACCESSORIES</option>
                  <option value="TAPE">TAPE</option>
                  <option value="POLYBAG">POLYBAG</option>
                  <option value="POLY BAG WITH FLAP">POLY BAG WITH FLAP</option>
                  <option value="POLYSHEET">POLYSHEET</option>
                  <option value="BALE WRAP">BALE WRAP</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              {material.packagingMaterialType && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
                  {/* Specific Fields for CARTONS/CORRUGATED BOX */}
                  {material.packagingMaterialType === 'CARTONS/CORRUGATED BOX' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">NO. OF PLYS</label>
                        <input
                          type="text"
                          value={material.noOfPlys || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'noOfPlys', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="5 PLY/7 PLY"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">JOINT TYPE</label>
                        <input
                          type="text"
                          value={material.jointType || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'jointType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="STAPLE/BINDED"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BURSTING STRENGTH</label>
                        <input
                          type="text"
                          value={material.burstingStrength || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'burstingStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="175 LBS"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for POLY BAG WITH FLAP */}
                  {material.packagingMaterialType === 'POLY BAG WITH FLAP' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE</label>
                        <input
                          type="text"
                          value={material.guage || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUMMING QUALITY</label>
                        <input
                          type="text"
                          value={material.gummingQuality || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'gummingQuality', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="High/Standard"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PUNCH HOLES</label>
                        <input
                          type="text"
                          value={material.punchHoles || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'punchHoles', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2 holes"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for POLY SHEET / BALE WRAP */}
                  {(material.packagingMaterialType === 'POLYSHEET' || material.packagingMaterialType === 'BALE WRAP') && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE/GSM</label>
                        <input
                          type="text"
                          value={material.guageGsm || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guageGsm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ROLL WIDTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.rollWidth || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'rollWidth', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="60"
                          />
                          <select
                            value={material.rollWidthUnit || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'rollWidthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="INCHES">INCHES</option>
                            <option value="CMS">CMS</option>
                            <option value="MM">MM</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Specific Fields for TAPE */}
                  {material.packagingMaterialType === 'TAPE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE</label>
                        <input
                          type="text"
                          value={material.guage || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUMMING QUALITY</label>
                        <input
                          type="text"
                          value={material.gummingQuality || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'gummingQuality', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Strong/Standard"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.tapeWidth || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeWidth', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="3"
                          />
                          <select
                            value={material.tapeWidthUnit || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeWidthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="INCHES">INCHES</option>
                            <option value="CMS">CMS</option>
                            <option value="MM">MM</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PRINTING REF with UPLOAD for POLY BAG WITH FLAP and TAPE */}
                  {(material.packagingMaterialType === 'POLY BAG WITH FLAP' || material.packagingMaterialType === 'TAPE') && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING REF</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'printingRef', e.target.files[0])}
                          className="hidden"
                          id={`pkg-file-${materialIndex}`}
                        />
                        <label
                          htmlFor={`pkg-file-${materialIndex}`}
                          className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                          style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="truncate">{material.printingRef ? 'DONE' : 'UPLOAD'}</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Dimensions Field for CARTONS/CORRUGATED BOX */}
                  {material.packagingMaterialType === 'CARTONS/CORRUGATED BOX' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS (LXWXH)</label>
                        <input
                          type="text"
                          value={material.size.width || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="L x W x H"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                        <select
                          value={material.size.unit || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                        >
                          <option value="CMS">CMS</option>
                          <option value="INCHES">INCHES</option>
                          <option value="MM">MM</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Dimensions Field for POLY BAG WITH FLAP */}
                  {material.packagingMaterialType === 'POLY BAG WITH FLAP' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS (WXL + FLAP)</label>
                        <input
                          type="text"
                          value={material.size.width || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="W x L + FLAP"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                        <select
                          value={material.size.unit || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                        >
                          <option value="CMS">CMS</option>
                          <option value="INCHES">INCHES</option>
                          <option value="MM">MM</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Surplus & For Section - For all types */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                      <input
                        type="text"
                        value={material.surplus || ''}
                        onChange={(e) => handlePackagingMaterialChange(materialIndex, 'surplus', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                        placeholder="%AGE"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                      <input
                        type="text"
                        value={material.surplusForSection || ''}
                        onChange={(e) => handlePackagingMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                        placeholder="FOR"
                      />
                    </div>
                  </div>

                  {/* Approval Against - For all types */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL AGAINST</label>
                    <input
                      type="text"
                      value={material.approvalAgainst || ''}
                      onChange={(e) => handlePackagingMaterialChange(materialIndex, 'approvalAgainst', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', height: '44px' }}
                      placeholder="BUYER'S/INITIAL/PP SAMPLE"
                    />
                  </div>

                  {/* Remarks - For all types */}
                  <div className="col-span-full flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                    <textarea
                      value={material.remarks || ''}
                      onChange={(e) => handlePackagingMaterialChange(materialIndex, 'remarks', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '100%' }}
                      rows="2"
                      placeholder="Additional notes..."
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-8">
            No packaging materials added yet.
          </div>
        )}
        
        {/* Add Material Button at Bottom */}
        <div className="mt-6 pt-6 border-t border-gray-200" style={{ marginTop: '24px', paddingTop: '24px' }}>
          <p className="text-sm text-gray-600 mb-3">Would you like to add more materials?</p>
          <button
            type="button"
            onClick={() => {
              const currentLength = formData.packaging?.materials?.length || 0;
              addPackagingMaterial();
              const newIndex = currentLength;
              const attemptScroll = (attempts = 0) => {
                if (attempts > 30) return;
                const element = document.getElementById(`packaging-material-${newIndex}`);
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

export default Step5;
