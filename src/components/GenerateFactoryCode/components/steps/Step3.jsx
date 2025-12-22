import { useEffect, useRef } from 'react';

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
                <input
                  type="text"
                  value={material.components || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'components', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="e.g., COMFORTER +"
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
                <select
                  value={material.unit || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unit', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                >
                  <option value="">Select</option>
                  <option value="Kgs">Kgs</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Meters">Meters</option>
                  <option value="Yards">Yards</option>
                  <option value="Sets">Sets</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Gross">Gross</option>
                </select>
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
                <select
                  value={material.size?.unit || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'size.unit', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                >
                  <option value="">Select</option>
                  <option value="CMS">CMS</option>
                  <option value="INCHES">INCHES</option>
                  <option value="MM">MM</option>
                </select>
              </div>
              </div>
              
            {/* TRIM/ACCESSORY CATEGORY SELECTOR */}
            <div className="w-full mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col" style={{ width: '280px', marginBottom: '20px' }}>
                <label className="text-sm font-bold text-gray-800 mb-2">TRIM/ACCESSORY</label>
                <select
                  value={material.trimAccessory || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'trimAccessory', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                >
                  <option value="">Select Trim/Accessory</option>
                  <option value="ZIPPERS">ZIPPERS</option>
                  <option value="VELCRO (Hook & Loop)">VELCRO (Hook & Loop)</option>
                  <option value="STITCHING THREAD">STITCHING THREAD</option>
                  <option value="BUTTONS">BUTTONS</option>
                  <option value="RIVETS">RIVETS</option>
                  <option value="NIWAR (Webbing/Tapes)">NIWAR (Webbing/Tapes)</option>
                  <option value="LACE">LACE</option>
                  <option value="INTERLINING/FUSING">INTERLINING/FUSING</option>
                  <option value="HOOKS & EYES">HOOKS & EYES</option>
                  <option value="BUCKLES & ADJUSTERS">BUCKLES & ADJUSTERS</option>
                  <option value="EYELETS & GROMMETS">EYELETS & GROMMETS</option>
                  <option value="ELASTIC">ELASTIC</option>
                  <option value="FELT">FELT</option>
                  <option value="SHOULDER PADS / CUPS">SHOULDER PADS / CUPS</option>
                  <option value="TUBULAR KNITS / RIBBING">TUBULAR KNITS / RIBBING</option>
                  <option value="RFID / EAS TAGS">RFID / EAS TAGS</option>
                  <option value="PLASTIC CABLE TIES / LOOPS">PLASTIC CABLE TIES / LOOPS</option>
                  <option value="FRINGE / TASSELS">FRINGE / TASSELS</option>
                  <option value="PLASTIC PIPES / RODS">PLASTIC PIPES / RODS</option>
                  <option value="SEAM SEALING TAPE">SEAM SEALING TAPE</option>
                  <option value="ADHESIVES / GUNNING">ADHESIVES / GUNNING</option>
                  <option value="PRE-CUT HEMS / BINDINGS">PRE-CUT HEMS / BINDINGS</option>
                  <option value="REFLECTIVE TAPES / TRIMS">REFLECTIVE TAPES / TRIMS</option>
                  <option value="FIRE RETARDANT (FR) TRIMS">FIRE RETARDANT (FR) TRIMS</option>
                  <option value="REPAIR KITS / PATCHES">REPAIR KITS / PATCHES</option>
                  <option value="CORD STOPS / CORD LOCKS / TOGGLES">CORD STOPS / CORD LOCKS / TOGGLES</option>
                  <option value="D-RINGS / O-RINGS / WEBBING LOOPS">D-RINGS / O-RINGS / WEBBING LOOPS</option>
                  <option value="FOAM / WADDING (Pre-Cut Shapes)">FOAM / WADDING (Pre-Cut Shapes)</option>
                  <option value="PINS / TAGGING BARBS">PINS / TAGGING BARBS</option>
                  <option value="MAGNETIC CLOSURES / SNAPS">MAGNETIC CLOSURES / SNAPS</option>
                </select>
              </div>

              {/* Conditional fields based on trim/accessory type */}
              {material.trimAccessory && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                  {/* ZIPPERS Fields */}
                  {material.trimAccessory === 'ZIPPERS' && (
                    <>
              <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ZIP #</label>
                <input
                  type="text"
                          value={material.zipNumber || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'zipNumber', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="3 or 5 (Common sizes)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.zipType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'zipType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Concealed (Invisible)">Concealed (Invisible)</option>
                          <option value="Open (Separating)">Open (Separating)</option>
                          <option value="Closed-End (Non-Separating)">Closed-End (Non-Separating)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BRAND</label>
                        <input
                          type="text"
                          value={material.brand || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'brand', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="YKK, RIRI, SBS, or Unbranded - Specify supplier name"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TEETH</label>
                        <select
                          value={material.teeth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'teeth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Coil (Nylon/Polyester)">Coil (Nylon/Polyester)</option>
                          <option value="Plastic (Molded Vislon)">Plastic (Molded Vislon)</option>
                          <option value="Metal (Brass, Aluminium)">Metal (Brass, Aluminium)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER</label>
                        <input
                          type="text"
                          value={material.puller || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'puller', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Metal / DTM (Dyed-to-Match Plastic) / Custom Logo / Ring"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER TYPE</label>
                        <select
                          value={material.pullerType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pullerType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Lockable (Auto-lock for secure closure)">Lockable (Auto-lock for secure closure)</option>
                          <option value="Non-Lockable (Free-gliding)">Non-Lockable (Free-gliding)</option>
                          <option value="Semi-">Semi-</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* VELCRO Fields */}
                  {material.trimAccessory === 'VELCRO (Hook & Loop)' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.velcroType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Sew-on tape">Sew-on tape</option>
                          <option value="Adhesive Backed">Adhesive Backed</option>
                          <option value="Die-Cut Shapes">Die-Cut Shapes</option>
                          <option value="ONE-WRAP (Back-to-Back)">ONE-WRAP (Back-to-Back)</option>
                        </select>
              </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <select
                          value={material.velcroMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Nylon">Nylon</option>
                          <option value="Polyester">Polyester</option>
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.width || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'width', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="16mm, 20mm, 25mm, 50mm"
                        />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="mm/in"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.colour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'colour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, White, Black"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">HOOK DENSITY</label>
                        <input
                          type="text"
                          value={material.hookDensityLoopType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookDensityLoopType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="HOOK Density / Loop Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CYCLE LIFE</label>
                        <input
                          type="text"
                          value={material.cycleLife || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cycleLife', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Number of Open/Close Cycles"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT METHOD</label>
                        <input
                          type="text"
                          value={material.attachmentMethod || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'attachmentMethod', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Sewing / Adhesive"
                        />
                      </div>
                    </>
                  )}

                  {/* STITCHING THREAD Fields */}
                  {material.trimAccessory === 'STITCHING THREAD' && (
                    <>
              <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.threadType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'threadType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Spun Polyester (Poly)">Spun Polyester (Poly)</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Core Spun (Poly-Wrapped)">Core Spun (Poly-Wrapped)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FIBRE CONTENT</label>
                <input
                  type="text"
                          value={material.fibreContent || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fibreContent', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 100% Spun"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COUNT/TICKET NO.</label>
                        <input
                          type="text"
                          value={material.countTicketNo || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'countTicketNo', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Metric Count (Nm) or Ticket"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLY</label>
                        <input
                          type="text"
                          value={material.ply || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'ply', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2 Ply, 3 Ply"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.colour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'colour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Colour Code (Pantone)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                        <select
                          value={material.threadFinish || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'threadFinish', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Bonded">Bonded</option>
                          <option value="Lubricated">Lubricated</option>
                          <option value="Matte">Matte</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                        <input
                          type="text"
                          value={material.usage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'usage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Main seam, Overlock, Embroidery"
                        />
                      </div>
                    </>
                  )}

                  {/* BUTTONS Fields */}
                  {material.trimAccessory === 'BUTTONS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.buttonType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Sewing (Flat/Shank)">Sewing (Flat/Shank)</option>
                          <option value="Snap (Press Stud)">Snap (Press Stud)</option>
                          <option value="Tack">Tack</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <select
                          value={material.buttonMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Polyester (Plastic)">Polyester (Plastic)</option>
                          <option value="Metal (Brass, Alloy)">Metal (Brass, Alloy)</option>
                          <option value="Natural (Shell, Wood)">Natural (Shell, Wood)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE/LIGNE</label>
                        <input
                          type="text"
                          value={material.sizeLigne || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'sizeLigne', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="14L, 16L, 20L, 24L"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/COLOUR</label>
                        <input
                          type="text"
                          value={material.finishColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'finishColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, Contrast, Glossy, Matte"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT METHOD</label>
                        <input
                          type="text"
                          value={material.buttonAttachmentMethod || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonAttachmentMethod', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Machine sew, Hand Sew, Pneumatic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                        <input
                          type="text"
                          value={material.function || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'function', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Functional / Decorative"
                        />
                      </div>
                    </>
                  )}

                  {/* RIVETS Fields */}
                  {material.trimAccessory === 'RIVETS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.rivetType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Open-End">Open-End</option>
                          <option value="Close-End">Close-End</option>
                          <option value="Blind Rivet">Blind Rivet</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <select
                          value={material.rivetMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Brass">Brass</option>
                          <option value="Copper">Copper</option>
                          <option value="Zinc Alloy">Zinc Alloy</option>
                          <option value="Steel">Steel</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CAP SIZE</label>
                        <input
                          type="text"
                          value={material.capSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'capSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="8mm, 9mm, 10mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">POST HEIGHT/LENGTH</label>
                        <input
                          type="text"
                          value={material.postHeightLength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'postHeightLength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Short, Medium, Long"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/PLATING</label>
                        <input
                          type="text"
                          value={material.finishPlating || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'finishPlating', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Nickel, Copper, Antique Brass"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER</label>
                        <input
                          type="text"
                          value={material.pullerStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pullerStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pull Strength"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER TYPE</label>
                        <input
                          type="text"
                          value={material.rivetPullerType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetPullerType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Machine Applied"
                        />
                      </div>
                    </>
                  )}

                  {/* NIWAR (Webbing/Tapes) Fields */}
                  {material.trimAccessory === 'NIWAR (Webbing/Tapes)' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.niwarType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Woven (Twill, Plain, Herringbone), Knitted"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.niwarMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fibre Content (e.g., Cotton, Polyester, Polypropylene)"
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
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="mm/in"
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
                        <input
                          type="text"
                          value={material.niwarColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, White, Black, Colour Code"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH / COATING</label>
                        <input
                          type="text"
                          value={material.finishCoating || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'finishCoating', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Soft Finish / Stiff Finish, Water Repellent, UV Resistant, Fire Retardant"
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
                        <input
                          type="text"
                          value={material.laceType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Woven/Twill tape (Plain/Patterned) / Braided / Crochet / Knit"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.laceMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fibre Content (e.g., 100% Cotton, Nylon, Rayon, Polyester)"
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
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="mm/in"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.laceColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM (Dyed to Match) / White / Ecru / Black / Colour Code (Pantone)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISHING</label>
                        <input
                          type="text"
                          value={material.laceFinishing || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceFinishing', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Starch (stiff finish) / Soft Finish / Mercerized (for Cotton) / Scalloped"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                        <input
                          type="text"
                          value={material.laceUsage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceUsage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Edging, Insertion, Applique, Beading"
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

                  {/* ZIPPERS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'ZIPPERS' && (
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
                            placeholder="Slider Durability (Cycling test), Lateral Strength (Teeth-pulling strength), Puller"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-zippers-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-zippers-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                        <input
                          type="text"
                            value={material.length || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'length', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Specific Length (e.g., 20 cm, 7 inches, 500 mm)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="cm/in/mm"
                          />
                        </div>
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
                          placeholder="%AGE (e.g., 2-3%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required for industrial wash, Must match fabric composition, Specific"
                        />
                      </div>
                    </>
                  )}

                  {/* VELCRO - Complete fields matching table exactly */}
                  {material.trimAccessory === 'VELCRO (Hook & Loop)' && (
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
                          placeholder="Shear Strength, Peel Strength, Cycle"
                />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-velcro-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-velcro-${materialIndex}`}
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
                          placeholder="%AGE (e.g., 2-5%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Hook and Loop to be packed separately..."
                        />
                      </div>
                    </>
                  )}

                  {/* STITCHING THREAD - Complete fields matching table exactly */}
                  {material.trimAccessory === 'STITCHING THREAD' && (
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
                            placeholder="Tensile Strength, Elongation, Abrasion"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                            id={`upload-thread-${materialIndex}`}
                        />
                        <label
                            htmlFor={`upload-thread-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                        <input
                          type="text"
                          value={material.unitAdditional || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Yards or Meters per Cone"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5000"
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
                          placeholder="%AGE (e.g., 1-2%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required for Class 1 Safety Seams..."
                        />
                      </div>
                    </>
                  )}

                  {/* BUTTONS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'BUTTONS' && (
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
                            placeholder="Needle Detection, Pull Strength"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                            id={`upload-buttons-${materialIndex}`}
                        />
                        <label
                            htmlFor={`upload-buttons-${materialIndex}`}
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
                          placeholder="Unit: Gross (144 pcs) or Pieces"
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
                          placeholder="%AGE (e.g., 3-5%)"
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
                          placeholder="Self-Shank, Laser Engraved..."
                        />
                      </div>
                    </>
                  )}

                  {/* RIVETS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RIVETS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Needle Detection, Pull Strength"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Gross (144 pcs) or Pieces"
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
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-rivets-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-rivets-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Specific Logo Engraving on Cap..."
                        />
                      </div>
                    </>
                  )}

                  {/* NIWAR - Complete fields matching table exactly */}
                  {material.trimAccessory === 'NIWAR (Webbing/Tapes)' && (
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
                            placeholder="Tensile strength test, Colour Fastness (to Light, Washing), Abrasion"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll (e.g., 100m Roll)"
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
                            placeholder="%AGE (e.g., 2-5% for cutting)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                        <input
                          type="text"
                            value={material.testingRequirement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Colour Fastness (to Washing, Light, Crocking) / Residual"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll (e.g., 50m Roll)"
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
                            placeholder="%AGE (e.g., 5-10%, due to cut ends/pattern)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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

                  {/* ELASTIC Fields */}
                  {material.trimAccessory === 'ELASTIC' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.elasticType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Woven, Braided, Knitted"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.elasticMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Rubber, Spandex, Latex"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.elasticWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 10mm, 20mm, 25mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH/TENSION</label>
                <input
                          type="text"
                          value={material.stretchTension || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'stretchTension', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Stretch percentage, Tension"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.elasticColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, White, Black"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKING</label>
                        <input
                          type="text"
                          value={material.elasticPacking || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticPacking', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                    </>
                  )}

                  {/* ELASTIC - Complete fields matching table exactly */}
                  {material.trimAccessory === 'ELASTIC' && (
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
                            placeholder="Tensile Strength, Elongation, Recovery"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-elastic-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-elastic-${materialIndex}`}
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
                            placeholder="%AGE (e.g., 2-5%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="For Waistband, should not narrow"
                        />
                      </div>
                    </>
                  )}

                  {/* FELT Fields */}
                  {material.trimAccessory === 'FELT' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.feltType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Wool, Synthetic, Blended"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.feltMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fibre Content"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <input
                          type="text"
                          value={material.feltThickness || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2mm, 3mm, 5mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DENSITY/GSM</label>
                        <input
                          type="text"
                          value={material.densityGsm || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'densityGsm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 200 GSM, 300 GSM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.feltColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, White, Black, Grey"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/FORM</label>
                        <input
                          type="text"
                          value={material.feltFinishForm || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltFinishForm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Smooth, Textured, Pre-cut shapes"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.feltApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Padding, Insulation, Reinforcement"
                        />
                      </div>
                    </>
                  )}

                  {/* FELT - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FELT' && (
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
                          placeholder="Flammability Rating, Pilling Resistance"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-felt-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-felt-${materialIndex}`}
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
                          placeholder="Unit: Meters or Yards or Sheets"
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
                          placeholder="%AGE (e.g., 5% for cutting)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required: Non-Toxic, Anti-Fraying edge..."
                        />
                      </div>
                    </>
                  )}

                  {/* INTERLINING/FUSING Fields */}
                  {material.trimAccessory === 'INTERLINING/FUSING' && (
                    <>
              <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.interliningType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Woven, Non-woven, Knitted, Fusible"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.interliningMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyester, Cotton, Viscose, Blend"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GSM/WEIGHT</label>
                        <input
                          type="text"
                          value={material.gsmWeight || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'gsmWeight', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 80 GSM, 100 GSM, 120 GSM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                        <input
                          type="text"
                          value={material.adhesive || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'adhesive', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PA (Polyamide), PES (Polyester), EVA"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.interliningColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Grey, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUSING SPEC</label>
                        <input
                          type="text"
                          value={material.fusingSpec || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fusingSpec', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Temperature, Pressure, Time (e.g., 150°C, 3 bar, 12 sec)"
                        />
                      </div>
                    </>
                  )}

                  {/* INTERLINING/FUSING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'INTERLINING/FUSING' && (
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
                          placeholder="Bond strength, Residual Shrinkage"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-interlining-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-interlining-${materialIndex}`}
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
                          placeholder="%AGE (e.g., 2-5%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Specific hand feel required, Low shrinkage..."
                        />
                      </div>
                    </>
                  )}

                  {/* HOOKS & EYES Fields */}
                  {material.trimAccessory === 'HOOKS & EYES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.hookEyeType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hook, Eye, Hook & Eye Set, Bar"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.hookEyeMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Brass, Steel, Nickel Plated, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.hookEyeSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., #1, #2, #3, Small, Medium, Large"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.hookEyeColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, Silver, Nickel, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                        <input
                          type="text"
                          value={material.hookEyeFinish || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeFinish', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polished, Matte, Plated, Coated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRENGTH</label>
                        <input
                          type="text"
                          value={material.strength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'strength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Holding Power (e.g., 5kg, 10kg)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.application || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'application', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Waistband, Bra closure, Garment fastening"
                        />
                      </div>
                    </>
                  )}

                  {/* HOOKS & EYES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'HOOKS & EYES' && (
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
                          placeholder="Holding Power Test, Corrosion Resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-hooks-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-hooks-${materialIndex}`}
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
                          placeholder="Unit: Gross (144 sets) or Sets"
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
                          placeholder="%AGE (e.g., 3-5%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Ensure the bar is flat and non-bulky..."
                        />
                      </div>
                    </>
                  )}

                  {/* BUCKLES & ADJUSTERS Fields */}
                  {material.trimAccessory === 'BUCKLES & ADJUSTERS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.buckleType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Side Release, Center Bar, Ladder Lock"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.buckleMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Plastic, Metal, Nylon"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.buckleSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 20mm, 25mm, 30mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/COLOUR</label>
                        <input
                          type="text"
                          value={material.buckleFinishColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleFinishColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, White, DTM, Nickel Plated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                        <input
                          type="text"
                          value={material.buckleFunction || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleFunction', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Adjustable, Quick Release, Locking"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.buckleTensileStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleTensileStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Breaking strength in kg/lbs"
                        />
                      </div>
                    </>
                  )}

                  {/* BUCKLES & ADJUSTERS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'BUCKLES & ADJUSTERS' && (
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
                          placeholder="Corrosion Resistance, Salt Spray"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-buckles-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-buckles-${materialIndex}`}
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
                          placeholder="Unit: Pieces"
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
                          placeholder="%AGE (e.g., 3-5%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required: specific finger guard for release..."
                        />
                      </div>
                    </>
                  )}

                  {/* EYELETS & GROMMETS Fields */}
                  {material.trimAccessory === 'EYELETS & GROMMETS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.eyeletType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'eyeletType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Eyelet, Grommet, Two-piece set"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.eyeletMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'eyeletMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Brass, Steel, Aluminium, Plastic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">INNER DIAMETER</label>
                        <input
                          type="text"
                          value={material.innerDiameter || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'innerDiameter', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3mm, 4mm, 5mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">OUTER DIAMETER</label>
                        <input
                          type="text"
                          value={material.outerDiameter || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'outerDiameter', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 8mm, 10mm, 12mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.eyeletColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'eyeletColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, Silver, DTM, Nickel Plated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.eyeletApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'eyeletApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Shoe laces, Drawstrings, Reinforcement"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TOOLING</label>
                        <input
                          type="text"
                          value={material.tooling || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tooling', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hand tool, Machine press, Die set"
                        />
                      </div>
                    </>
                  )}

                  {/* EYELETS & GROMMETS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'EYELETS & GROMMETS' && (
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
                          placeholder="Pull-Off Strength, Corrosion"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-eyelets-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-eyelets-${materialIndex}`}
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
                          placeholder="Unit: Gross (144 sets) or Sets"
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
                          placeholder="%AGE (e.g., 5-8%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Two-piece set (Eyelet and Washer) required..."
                        />
                      </div>
                    </>
                  )}

                  {/* SHOULDER PADS / CUPS Fields */}
                  {material.trimAccessory === 'SHOULDER PADS / CUPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.shoulderPadType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Shoulder Pad, Shoulder Cup, Epaulette"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.shoulderPadMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyurethane Foam, Polyester Fiber, Cotton"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.shoulderPadSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Small, Medium, Large, Custom dimensions"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SHAPE</label>
                        <input
                          type="text"
                          value={material.shape || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shape', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Rounded, Square, Tapered, Contoured"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COVERING</label>
                        <input
                          type="text"
                          value={material.covering || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'covering', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fabric, Mesh, Non-woven, Uncovered"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                        <input
                          type="text"
                          value={material.shoulderPadAttachment || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadAttachment', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Sewn-in, Removable, Snap-on, Velcro"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WEIGHT</label>
                        <input
                          type="text"
                          value={material.weight || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'weight', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Light, Medium, Heavy (e.g., 5g, 10g)"
                        />
                      </div>
                    </>
                  )}

                  {/* SHOULDER PADS / CUPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'SHOULDER PADS / CUPS' && (
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
                          placeholder="Dry Cleaning, Washing Resistance"
                        />
                </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-shoulder-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-shoulder-${materialIndex}`}
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
                          placeholder="Unit: Pairs"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required: Lightweight, resilient to pressure..."
                        />
                      </div>
                    </>
                  )}

                  {/* TUBULAR KNITS / RIBBING Fields */}
                  {material.trimAccessory === 'TUBULAR KNITS / RIBBING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.tubularType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tubularType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="1x1 Rib, 2x2 Rib, Interlock, Jersey"
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
                        <input
                          type="text"
                          value={material.weightDensity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'weightDensity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="GSM or oz/yd² (e.g., 180 GSM, 5.3 oz/yd²)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.tubularColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tubularColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Navy, DTM"
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
                        <input
                          type="text"
                          value={material.cutting || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cutting', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Straight cut, Bias cut, Anti-curl"
                        />
                      </div>
                    </>
                  )}

                  {/* TUBULAR KNITS / RIBBING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'TUBULAR KNITS / RIBBING' && (
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
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          placeholder="%AGE (e.g., 2-5%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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

                  {/* RFID / EAS TAGS Fields */}
                  {material.trimAccessory === 'RFID / EAS TAGS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.rfidType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rfidType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="UHF RFID, HF RFID, LF RFID, EAS Tag"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FORM FACTOR</label>
                        <input
                          type="text"
                          value={material.formFactor || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'formFactor', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Label, Sticker, Hard Tag, Inlay"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FREQUENCY</label>
                        <input
                          type="text"
                          value={material.frequency || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frequency', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="860-960 MHz (UHF), 13.56 MHz (HF), 125 kHz (LF)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CHIP/IC TYPE</label>
                        <input
                          type="text"
                          value={material.chipIcType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'chipIcType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Impinj Monza, NXP UCODE, Alien Higgs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.rfidSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rfidSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50mm x 20mm, 100mm x 30mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CODING</label>
                        <input
                          type="text"
                          value={material.coding || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'coding', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="EPC Gen 2, ISO 18000-6C, TID Programming"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SECURITY</label>
                        <input
                          type="text"
                          value={material.security || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'security', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tamper-evident, Kill Password, Lock Memory"
                        />
                      </div>
                    </>
                  )}

                  {/* RFID / EAS TAGS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RFID / EAS TAGS' && (
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
                          placeholder="Read Range, Washing Resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-rfid-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-rfid-${materialIndex}`}
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
                          placeholder="Unit: Pieces"
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
                          placeholder="%AGE (e.g., 2%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Technical Integration"
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
                          placeholder="Required: Global Gen 2 standard..."
                        />
                      </div>
                    </>
                  )}

                  {/* PLASTIC CABLE TIES / LOOPS Fields */}
                  {material.trimAccessory === 'PLASTIC CABLE TIES / LOOPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.cableTieType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Standard, Releasable, Beaded, Loop"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.cableTieMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Nylon 6/6, Polypropylene, Stainless Steel"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.cableTieSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Length x Width (e.g., 100mm x 2.5mm, 150mm x 3.6mm)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.cableTieColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Natural, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.cableTieTensileStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieTensileStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 18 lbs, 50 lbs, 120 lbs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                        <input
                          type="text"
                          value={material.cableTieFinish || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieFinish', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Smooth, Textured, UV Stabilized"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                        <input
                          type="text"
                          value={material.cableTieUsage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieUsage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hang tags, Security loops, Cable management"
                        />
                      </div>
                    </>
                  )}

                  {/* PLASTIC CABLE TIES / LOOPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PLASTIC CABLE TIES / LOOPS' && (
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
                            placeholder="Tensile Test, UV Resistance"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-cable-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-cable-${materialIndex}`}
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
                          placeholder="Unit: Pieces or Bundles"
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
                          placeholder="%AGE (e.g., 5-10%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required: Must have rounded, non-scratching edges..."
                        />
                      </div>
                    </>
                  )}

                  {/* FRINGE / TASSELS Fields */}
                  {material.trimAccessory === 'FRINGE / TASSELS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.fringeType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fringeType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fringe, Tassel, Pom-pom, Bullion"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.fringeMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fringeMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Cotton, Polyester, Rayon, Wool, Blend"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DROP LENGTH</label>
                        <input
                          type="text"
                          value={material.dropLength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dropLength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2cm, 3cm, 5cm, 10cm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TAPE WIDTH</label>
                        <input
                          type="text"
                          value={material.tapeWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tapeWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1cm, 1.5cm, 2cm, 3cm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.fringeColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fringeColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Navy, DTM, Multi-color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                        <input
                          type="text"
                          value={material.fringeFinish || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fringeFinish', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Brushed, Twisted, Knotted, Cut edge"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CONSTRUCTION</label>
                        <input
                          type="text"
                          value={material.construction || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'construction', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hand-tied, Machine-made, Woven, Knitted"
                        />
                      </div>
                    </>
                  )}

                  {/* FRINGE / TASSELS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FRINGE / TASSELS' && (
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
                          placeholder="Colour Fastness, Washing Resistance"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-fringe-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-fringe-${materialIndex}`}
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
                          placeholder="Unit: Meters or Pieces per Roll"
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
                          placeholder="%AGE (e.g., 5-10%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Design Sample Approval"
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
                          placeholder="Required: Hand-tied appearance..."
                        />
                      </div>
                    </>
                  )}

                  {/* PLASTIC PIPES / RODS Fields */}
                  {material.trimAccessory === 'PLASTIC PIPES / RODS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.pipeType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Round Pipe, Square Rod, Flat Bar, Custom Shape"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.pipeMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PVC, Polypropylene, Nylon, ABS, Polyethylene"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIAMETER/DIM.</label>
                        <input
                          type="text"
                          value={material.diameterDimensions || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'diameterDimensions', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 6mm, 8mm, 10mm or 5mm x 3mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                        <input
                          type="text"
                          value={material.pipeLength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeLength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50cm, 1m, 1.5m, Custom length"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.pipeColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Clear, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">END CAPS</label>
                        <input
                          type="text"
                          value={material.endCaps || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'endCaps', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Open, Closed, Rounded, Flat"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FLEXIBILITY</label>
                        <input
                          type="text"
                          value={material.flexibility || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'flexibility', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Rigid, Semi-flexible, Flexible"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                        <input
                          type="text"
                          value={material.pipeUsage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeUsage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hood drawstring channel, Waistband support, Reinforcement"
                        />
                      </div>
                    </>
                  )}

                  {/* PLASTIC PIPES / RODS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PLASTIC PIPES / RODS' && (
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
                          placeholder="UV Stability, Load Bearing, Deflection"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-pipes-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-pipes-${materialIndex}`}
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
                          placeholder="Unit: Meters or Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required: must fit precisely into a 6mm stitched channel..."
                        />
                      </div>
                    </>
                  )}

                  {/* SEAM SEALING TAPE Fields */}
                  {material.trimAccessory === 'SEAM SEALING TAPE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.seamTapeType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PU Tape, TPU Tape, Hot Melt"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                <input
                  type="text"
                          value={material.seamTapeMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyurethane, Thermoplastic Polyurethane"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.seamTapeWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 12mm, 15mm, 20mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.seamTapeColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Transparent, White, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE TYPE</label>
                        <input
                          type="text"
                          value={material.seamTapeAdhesiveType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeAdhesiveType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hot Melt, Pressure Sensitive, Heat Activated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION SPEC</label>
                        <input
                          type="text"
                          value={material.applicationSpec || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'applicationSpec', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Temperature, Pressure, Speed (e.g., 150°C, 3 bar)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ELASTICITY</label>
                        <input
                          type="text"
                          value={material.elasticity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Stretch %, Recovery %, Elastic Modulus"
                        />
                      </div>
                    </>
                  )}

                  {/* SEAM SEALING TAPE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'SEAM SEALING TAPE' && (
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
                          placeholder="Hydrostatic Head test"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-seam-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-seam-${materialIndex}`}
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
                          placeholder="%AGE (e.g., 5-10%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S / INITIAL / IPP / Technical Data Sheet"
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
                          placeholder="Required: Matte finish on the exterior face..."
                        />
                      </div>
                    </>
                  )}

                  {/* ADHESIVES / GUNNING Fields */}
                  {material.trimAccessory === 'ADHESIVES / GUNNING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.adhesiveType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'adhesiveType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hot Melt, Contact Adhesive, Spray Adhesive"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL BASE</label>
                        <input
                          type="text"
                          value={material.materialBase || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'materialBase', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="EVA, PU, Polyamide, Acrylic, Rubber-based"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.adhesiveApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'adhesiveApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Foam-to-fabric, Fabric-to-fabric, Lamination"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">VISCOSITY</label>
                        <input
                          type="text"
                          value={material.viscosity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'viscosity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Low, Medium, High (e.g., 5000 cPs, 15000 cPs)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SETTING TIME</label>
                        <input
                          type="text"
                          value={material.settingTime || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'settingTime', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5 sec, 30 sec, 2 min, 24 hours"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.adhesiveColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'adhesiveColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Transparent, White, Yellow, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATOR</label>
                        <input
                          type="text"
                          value={material.applicator || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'applicator', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Gun applicator, Spray gun, Roller, Brush"
                        />
                      </div>
                    </>
                  )}

                  {/* ADHESIVES / GUNNING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'ADHESIVES / GUNNING' && (
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
                          placeholder="Bond strength, Toxicity / VOC Content"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-adhesives-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-adhesives-${materialIndex}`}
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
                          placeholder="Unit: Liters (L), Kilograms (Kgs), or Cans"
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
                          placeholder="%AGE (e.g., 5-10%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S / INITIAL / IPP / Safety Data Sheet (SDS)"
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
                          placeholder="Required: Non-toxic, suitable for foam-to-fabric bond..."
                        />
                      </div>
                    </>
                  )}

                  {/* PRE-CUT HEMS / BINDINGS Fields */}
                  {material.trimAccessory === 'PRE-CUT HEMS / BINDINGS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.hemType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Bias Binding, Straight Cut, Curved Hem"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                <input
                  type="text"
                          value={material.hemMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Cotton, Polyester, Blend, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CUT TYPE</label>
                        <input
                          type="text"
                          value={material.cutType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cutType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Straight, Bias (45°), Curved"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.hemWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1cm, 1.5cm, 2cm, 2.5cm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FOLD TYPE</label>
                        <input
                          type="text"
                          value={material.foldType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foldType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Single fold, Double fold, Unfolded"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.hemColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Navy, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKAGING</label>
                        <input
                          type="text"
                          value={material.hemPackaging || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemPackaging', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Roll, Folded, Continuous length"
                        />
                      </div>
                    </>
                  )}

                  {/* PRE-CUT HEMS / BINDINGS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PRE-CUT HEMS / BINDINGS' && (
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
                          placeholder="Residual shrinkage, Skewing"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-hems-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-hems-${materialIndex}`}
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
                          placeholder="%AGE (e.g., 5%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required: must be stretch-stabilized for curved edges..."
                        />
                      </div>
                    </>
                  )}

                  {/* REFLECTIVE TAPES / TRIMS Fields */}
                  {material.trimAccessory === 'REFLECTIVE TAPES / TRIMS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.reflectiveType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Glass Bead, Prismatic, Microprismatic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.reflectiveMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PVC, Polyester, Polyurethane, Fabric-backed"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.reflectiveWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 25mm, 50mm, 75mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.reflectiveColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Silver, Yellow, Orange, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
                        <input
                          type="text"
                          value={material.certification || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'certification', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="EN ISO 20471, ANSI/ISEA 107, CSA Z96"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BASE FABRIC</label>
                        <input
                          type="text"
                          value={material.baseFabric || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'baseFabric', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyester, Nylon, Cotton, Blend"
                        />
                      </div>
                    </>
                  )}

                  {/* REFLECTIVE TAPES / TRIMS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'REFLECTIVE TAPES / TRIMS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Retro-reflection Coefficient"
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
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-reflective-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-reflective-${materialIndex}`}
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
                          placeholder="%AGE (e.g., 5-10%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Compliance Certificate"
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
                          placeholder="Required: must be compatible with industrial laundering..."
                        />
                      </div>
                    </>
                  )}

                  {/* FIRE RETARDANT (FR) TRIMS Fields */}
                  {material.trimAccessory === 'FIRE RETARDANT (FR) TRIMS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.frType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tape, Trim, Binding, Webbing"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.frMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Nomex, Kevlar, FR Cotton, FR Polyester"
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
                        <input
                          type="text"
                          value={material.frColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Yellow, Orange, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                        <input
                          type="text"
                          value={material.durability || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'durability', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Wash durability, Lightfastness, Abrasion resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                        <input
                          type="text"
                          value={material.frComponents || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frComponents', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Base fabric, Coating, Thread, Adhesive"
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
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          placeholder="%AGE (e.g., 5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Certification Test Report"
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

                  {/* REPAIR KITS / PATCHES Fields */}
                  {material.trimAccessory === 'REPAIR KITS / PATCHES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.repairKitType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'repairKitType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Patch Kit, Repair Tape, Adhesive Patch"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.repairKitMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'repairKitMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fabric, Vinyl, PU Coated, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE/SHAPE</label>
                        <input
                          type="text"
                          value={material.sizeShape || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'sizeShape', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5cm x 5cm, Round, Custom shape"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.repairKitColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'repairKitColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, Navy, DTM, Multi-color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKAGING</label>
                        <input
                          type="text"
                          value={material.repairKitPackaging || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'repairKitPackaging', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pouch, Envelope, Box, Individual wrap"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USER APPLICATION</label>
                        <input
                          type="text"
                          value={material.userApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'userApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Heat press, Iron-on, Adhesive, Sew-on"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CONTENTS</label>
                        <input
                          type="text"
                          value={material.contents || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'contents', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Patch, Adhesive, Instructions, Cleaning wipes"
                        />
                      </div>
                    </>
                  )}

                  {/* REPAIR KITS / PATCHES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'REPAIR KITS / PATCHES' && (
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
                          placeholder="Adhesion strength, Shelf Life"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-repair-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-repair-${materialIndex}`}
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
                          placeholder="Unit: Pieces or Sets"
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
                          placeholder="%AGE (e.g., 5-10%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Instruction Manual"
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
                          placeholder="Required: must be included in the product packaging..."
                        />
                      </div>
                    </>
                  )}

                  {/* CORD STOPS / CORD LOCKS / TOGGLES Fields */}
                  {material.trimAccessory === 'CORD STOPS / CORD LOCKS / TOGGLES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.cordStopType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Cord Stop, Cord Lock, Toggle, Spring Lock"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.cordStopMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Nylon, Acetal, POM, Plastic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.cordStopSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3mm, 4mm, 5mm, Small, Medium, Large"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.cordStopColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, White, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LOCKING MECHANISM</label>
                        <input
                          type="text"
                          value={material.lockingMechanism || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lockingMechanism', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Spring-loaded, Friction, Cam lock, Push-pull"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                        <input
                          type="text"
                          value={material.cordStopFunction || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopFunction', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Adjustable tension, Lock cord, Release mechanism"
                        />
                      </div>
                    </>
                  )}

                  {/* CORD STOPS / CORD LOCKS / TOGGLES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'CORD STOPS / CORD LOCKS / TOGGLES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Locking Strength, UV"
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
                          placeholder="Unit: Pieces"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-cord-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-cord-${materialIndex}`}
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
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S / INITIAL / IPP / Functionality Approval"
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
                          placeholder="Required: ergonomic finger grip, No snagging edges..."
                        />
                      </div>
                    </>
                  )}

                  {/* D-RINGS / O-RINGS / WEBBING LOOPS Fields */}
                  {material.trimAccessory === 'D-RINGS / O-RINGS / WEBBING LOOPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.dRingType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="D-Ring, O-Ring, Webbing Loop, Triangle Ring"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.dRingMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Steel, Stainless Steel, Brass, Aluminium, Plastic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.dRingSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 25mm, 38mm, 50mm, 1 inch, 1.5 inch"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS/GAUGE</label>
                        <input
                          type="text"
                          value={material.thicknessGauge || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'thicknessGauge', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2mm, 3mm, 16 gauge, 18 gauge"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/PLATING</label>
                        <input
                          type="text"
                          value={material.dRingFinishPlating || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingFinishPlating', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Zinc plated, Nickel plated, Black oxide, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LOAD RATING</label>
                        <input
                          type="text"
                          value={material.loadRating || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'loadRating', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50kg, 100kg, 200kg, 500 lbs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.dRingApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Backpack straps, Bag handles, Load bearing, Attachment point"
                        />
                      </div>
                    </>
                  )}

                  {/* D-RINGS / O-RINGS / WEBBING LOOPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'D-RINGS / O-RINGS / WEBBING LOOPS' && (
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
                          placeholder="Tensile strength, Corrosion Resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-drings-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-drings-${materialIndex}`}
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
                          placeholder="Unit: Pieces"
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
                          placeholder="%AGE (e.g., 2-5%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S / INITIAL / IPP / Load Test Certificate"
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
                          placeholder="Required: must be non-magnetic for military use..."
                        />
                      </div>
                    </>
                  )}

                  {/* FOAM / WADDING (PRE-CUT SHAPES) Fields */}
                  {material.trimAccessory === 'FOAM / WADDING (Pre-Cut Shapes)' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.foamType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyurethane, Polyethylene, EVA, Memory Foam"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DENSITY</label>
                        <input
                          type="text"
                          value={material.foamDensity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamDensity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 25 kg/m³, 35 kg/m³, 50 kg/m³"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <input
                          type="text"
                          value={material.foamThickness || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5mm, 10mm, 15mm, 20mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SHAPE ID</label>
                        <input
                          type="text"
                          value={material.shapeId || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shapeId', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., SH-001, SH-002, Custom shape reference"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.foamColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Grey, Black, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PROPERTIES</label>
                        <input
                          type="text"
                          value={material.properties || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'properties', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Firm, Soft, High resilience, Anti-microbial"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                        <input
                          type="text"
                          value={material.foamAttachment || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamAttachment', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Adhesive-backed, Sewn-in, Velcro, Snap-on"
                        />
                      </div>
                    </>
                  )}

                  {/* FOAM / WADDING (PRE-CUT SHAPES) - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FOAM / WADDING (Pre-Cut Shapes)' && (
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
                          placeholder="Compression set"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-foam-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-foam-${materialIndex}`}
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
                          placeholder="Unit: Pieces or Sheets"
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
                          placeholder="%AGE (e.g., 5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR</label>
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Foam Sample Approval"
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
                          placeholder="Required: must be neat, sealed on the edge..."
                        />
                      </div>
                    </>
                  )}

                  {/* PINS / TAGGING BARBS Fields */}
                  {material.trimAccessory === 'PINS / TAGGING BARBS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.pinType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tagging Pin, Safety Pin, T-Pin, U-Pin"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.pinMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Stainless Steel, Nickel-plated, Brass, Plastic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.pinSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1.5 inch, 2 inch, 3 inch, Small, Medium, Large"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.pinColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Silver, Gold, Black, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.pinTensileStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinTensileStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5kg, 10kg, 15kg"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">HEAD TYPE</label>
                        <input
                          type="text"
                          value={material.headType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'headType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Round head, Flat head, Ball head, T-head"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.pinApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tagging, Pattern holding, Temporary fastening"
                        />
                      </div>
                    </>
                  )}

                  {/* PINS / TAGGING BARBS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PINS / TAGGING BARBS' && (
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
                          placeholder="Needle sharpness, Non-Rusting"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-pins-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-pins-${materialIndex}`}
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
                          placeholder="Unit: Pieces or Boxes"
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
                          placeholder="%AGE (e.g., 10%)"
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
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
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
                          placeholder="Required: must be non-marking on delicate fabrics..."
                        />
                      </div>
                    </>
                  )}

                  {/* MAGNETIC CLOSURES / SNAPS Fields */}
                  {material.trimAccessory === 'MAGNETIC CLOSURES / SNAPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.magneticType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Magnetic Snap, Magnetic Button, Magnetic Closure"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.magneticMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Neodymium, Ferrite, Samarium Cobalt, Plastic housing"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.magneticSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 12mm, 15mm, 20mm, Small, Medium, Large"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRENGTH</label>
                        <input
                          type="text"
                          value={material.magneticStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pull force (e.g., 1kg, 2kg, 3kg, 5 lbs)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">POLARITY</label>
                        <input
                          type="text"
                          value={material.polarity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'polarity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="North-South, Attracting pair, Repelling pair"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.magneticApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pocket closure, Bag closure, Garment fastening"
                        />
                      </div>
                    </>
                  )}

                  {/* MAGNETIC CLOSURES / SNAPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'MAGNETIC CLOSURES / SNAPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pull Force test, Corrosion Resistance"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pairs (Male/Female set)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Magnet Field Strength"
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
                          placeholder="Required: must be RF-shielded if near RFID tags..."
                        />
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
