import SearchableDropdown from './SearchableDropdown';

/**
 * TrimAccessoryFields Component
 * Renders trim/accessory fields based on the selected trim/accessory type.
 * This component is extracted from Step3 to be reusable in Step2.
 * 
 * @param {Object} material - The material object containing trim/accessory data
 * @param {number} materialIndex - Index of the material in the array
 * @param {Function} handleChange - Handler function for field changes (handleConsumptionMaterialChange or handleRawMaterialChange)
 */
const TrimAccessoryFields = ({ material, materialIndex, handleChange }) => {
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
              <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ZIP #</label>
                <input
                  type="text"
                          value={material.zipNumber || ''}
                          onChange={(e) => handleChange(materialIndex, 'zipNumber', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="3 or 5 (Common sizes)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.zipType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'zipType', selectedValue)}
                          options={['Concealed (Invisible)', 'Open (Separating)', 'Closed-End (Non-Separating)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BRAND</label>
                                                <SearchableDropdown
                          value={material.brand || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'brand', selectedValue)}
                          options={['YKK', 'RIRI', 'SBS', 'Unbranded']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TEETH</label>
                                                <SearchableDropdown
                          value={material.teeth || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'teeth', selectedValue)}
                          options={['Coil (Nylon/Polyester)', 'Plastic (Molded Vislon)', 'Metal (Brass, Aluminium)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER</label>
                        <SearchableDropdown
                          value={material.puller || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'puller', selectedValue)}
                          options={['Metal', 'DTM (Dyed-to-Match Plastic)', 'Custom Logo', 'Ring']}
                          placeholder="Select or type Puller"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER TYPE</label>
                                                <SearchableDropdown
                          value={material.pullerType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'pullerType', selectedValue)}
                          options={['Lockable (Auto-lock for secure closure)', 'Non-Lockable (Free-gliding)', 'Semi-']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                    </>
                  )}

                  {/* VELCRO Fields */}
                  {material.trimAccessory === 'VELCRO' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PART</label>
                        <SearchableDropdown
                          value={material.velcroPart || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'velcroPart', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'velcroType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'velcroMaterial', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'velcroAttachment', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'velcroPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="PLACEMENT"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'velcroPlacementReferenceImage', e.target.files[0])}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'velcroSizeSpec', selectedValue)}
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
                                onChange={(e) => handleChange(materialIndex, 'velcroLengthCm', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'velcroWidthCm', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'velcroYardageCns', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'velcroKgsCns', e.target.value)}
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

                  {/* STITCHING THREAD Fields */}
                  {material.trimAccessory === 'STITCHING THREAD' && (
                    <>
              <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.threadType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'threadType', selectedValue)}
                          options={['Spun Polyester (Poly)', 'Cotton', 'Core Spun (Poly-Wrapped)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FIBRE CONTENT</label>
                <input
                  type="text"
                          value={material.fibreContent || ''}
                          onChange={(e) => handleChange(materialIndex, 'fibreContent', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'countTicketNo', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'ply', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'colour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Colour Code (Pantone)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                                                <SearchableDropdown
                          value={material.threadFinish || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'threadFinish', selectedValue)}
                          options={['Bonded', 'Lubricated', 'Matte']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                                                <SearchableDropdown
                          value={material.usage || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'usage', selectedValue)}
                          options={['Main seam', 'Overlock', 'Embroidery']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                    </>
                  )}

                  {/* BUTTONS Fields */}
                  {material.trimAccessory === 'BUTTONS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.buttonType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buttonType', selectedValue)}
                          options={['Sewing (Flat/Shank)', 'Snap (Press Stud)', 'Tack (Jeans)', 'Toggle', 'Magnetic', 'Covered']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.buttonMaterial || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buttonMaterial', selectedValue)}
                          options={['Polyester', 'Metal (Brass, Alloy, Zinc)', 'Shell', 'Wood', 'Horn', 'Corozo', 'Coconut']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.buttonSize || ''}
                          onChange={(e) => handleChange(materialIndex, 'buttonSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Text"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LIGNE</label>
                                                <SearchableDropdown
                          value={material.buttonLigne || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buttonLigne', selectedValue)}
                          options={['14L', '16L', '18L', '20L', '22L', '24L', '26L', '28L', '30L', '32L', '34L', '36L', '38L', '40L']}
                          placeholder="Select or type (1L=0.635mm)"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">HOLES</label>
                        <SearchableDropdown
                          value={material.buttonHoles || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buttonHoles', selectedValue)}
                          options={['2-Hole', '4-Hole', 'Shank (no holes)', 'Snap Components']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/COLOUR</label>
                                                <SearchableDropdown
                          value={material.buttonFinishColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buttonFinishColour', selectedValue)}
                          options={['DTM', 'Glossy', 'Matte', 'Engraved', 'Plated (Nickel)', 'Plated (Antique Brass)', 'Plated (Gunmetal)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                          value={material.buttonPlacement || ''}
                          onChange={(e) => handleChange(materialIndex, 'buttonPlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Text"
                        />
                      </div>
                    </>
                  )}

                  {/* RIVETS Fields */}
                  {material.trimAccessory === 'RIVETS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.rivetType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'rivetType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'rivetMaterial', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'rivetCapSize', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'rivetPostHeight', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'rivetFinishPlating', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'rivetPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                        />
                        <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'rivetPlacementReferenceImage', e.target.files[0])}
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
                  {material.trimAccessory === 'NIWAR (Webbing/Tapes)' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.niwarType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'niwarType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'niwarMaterial', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'niwarWidth', e.target.value)}
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
                            onChange={(e) => handleChange(materialIndex, 'unitAdditional', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'niwarThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Gage / Density (e.g., Thin, Medium, Heavy-duty) - Specified in millimeters"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.niwarColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'niwarColour', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'finishCoating', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'tensileStrength', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'laceType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'laceMaterial', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'laceWidth', e.target.value)}
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
                            onChange={(e) => handleChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="mm/in"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.laceColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'laceColour', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'laceFinishing', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'laceUsage', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'designReference', e.target.value)}
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
                        <SearchableDropdown
                          value={material.testingRequirement || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'testingRequirement', selectedValue)}
                          options={['Slider Durability (Cycling test)', 'Lateral Strength (Teeth-pulling strength)', 'Puller']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                                                <SearchableDropdown
                          value={material.length || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'length', selectedValue)}
                          options={['Specific Length (e.g', '20 cm', '7 inches', '500 mm)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleChange(materialIndex, 'unitAdditional', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required for industrial wash, Must match fabric composition, Specific"
                        />
                      </div>
                    </>
                  )}

                  {/* VELCRO - Complete fields matching table exactly */}
                  {material.trimAccessory === 'VELCRO' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <input
                            type="text"
                            value={material.velcroTestingRequirements || ''}
                            onChange={(e) => handleChange(materialIndex, 'velcroTestingRequirements', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="TESTING REQUIREMENTS"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'velcroTestingRequirementFile', e.target.files[0])}
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
                              onChange={(e) => handleChange(materialIndex, 'velcroQty', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Pieces"
                            />
                          </div>
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.velcroKgsPerPc || ''}
                              onChange={(e) => handleChange(materialIndex, 'velcroKgsPerPc', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="KGS (CNS PER PC)"
                            />
                          </div>
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.velcroYardagePerPc || ''}
                              onChange={(e) => handleChange(materialIndex, 'velcroYardagePerPc', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'velcroSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'velcroWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.velcroApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'velcroApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'velcroRemarks', e.target.value)}
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
                            onClick={() => handleChange(materialIndex, 'showVelcroAdvancedSpec', !material.showVelcroAdvancedSpec)}
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
                                  onChange={(selectedValue) => handleChange(materialIndex, 'velcroColour', selectedValue)}
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
                                  onChange={(e) => handleChange(materialIndex, 'velcroColorReference', e.target.files[0])}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'velcroHookDensity', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'velcroLoopType', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'velcroCycleLife', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'velcroFlameRetardant', selectedValue)}
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

                  {/* STITCHING THREAD - Complete fields matching table exactly */}
                  {material.trimAccessory === 'STITCHING THREAD' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <SearchableDropdown
                          value={material.testingRequirement || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'testingRequirement', selectedValue)}
                          options={['Tensile Strength', 'Elongation', 'Abrasion']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'unitAdditional', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
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
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                        <SearchableDropdown
                            value={material.buttonTestingRequirements || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'buttonTestingRequirements', selectedValue)}
                            options={['Needle Detection', 'Pull Strength', 'Colour Fastness', 'REACH/OEKO-TEX', 'Corrosion']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                            onChange={(e) => handleChange(materialIndex, 'buttonTestingRequirementFile', e.target.files[0])}
                          className="hidden"
                            id={`upload-button-testing-${materialIndex}`}
                            accept="image/*"
                        />
                        <label
                            htmlFor={`upload-button-testing-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.buttonTestingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                </label>
                      </div>
              </div>
                      
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.buttonQty || ''}
                          onChange={(e) => handleChange(materialIndex, 'buttonQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces"
                        />
            </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                                                  type="text"
                          value={material.buttonSurplus || ''}
                          onChange={(e) => handleChange(materialIndex, 'buttonSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <SearchableDropdown
                          value={material.buttonWastage || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buttonWastage', selectedValue)}
                          options={['Front Placket', 'Cuff', 'Collar', 'Pocket', 'Waistband']}
                          placeholder="Select or type Wastage %"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                          <SearchableDropdown
                            value={material.buttonApproval || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'buttonApproval', selectedValue)}
                            options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                            placeholder="Select or type"
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'buttonColorReference', e.target.files[0])}
                            className="hidden"
                            id={`upload-button-color-ref-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-button-color-ref-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.buttonColorReference ? 'UPLOADED' : 'UPLOAD COLOR REFERENCE'}
                          </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                            value={material.buttonRemarks || ''}
                            onChange={(e) => handleChange(materialIndex, 'buttonRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                            placeholder="Self-Shank, Laser Engraved Logo"
                        />
                      </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'buttonReferenceImage', e.target.files[0])}
                            className="hidden"
                            id={`upload-button-ref-image-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-button-ref-image-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '150px' }}
                          >
                            {material.buttonReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </label>
                        </div>
                      </div>

                      {/* BUTTONS - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleChange(materialIndex, 'showButtonsAdvancedSpec', !material.showButtonsAdvancedSpec)}
                            className="border-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                              padding: '10px 20px',
                              height: '44px',
                              backgroundColor: material.showButtonsAdvancedSpec ? '#667eea' : '#ffffff',
                              borderColor: material.showButtonsAdvancedSpec ? '#667eea' : '#e5e7eb',
                              color: material.showButtonsAdvancedSpec ? '#ffffff' : '#374151'
                            }}
                            onMouseEnter={(e) => {
                              if (!material.showButtonsAdvancedSpec) {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.borderColor = '#d1d5db';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!material.showButtonsAdvancedSpec) {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                              }
                            }}
                          >
                            ADVANCE SPEC
                          </button>
                        </div>
                        
                        {/* Advanced Spec Fields */}
                        {material.showButtonsAdvancedSpec && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:col-span-4 gap-x-5 gap-y-5">
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                        <SearchableDropdown
                                value={material.buttonAttachment || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'buttonAttachment', selectedValue)}
                                options={['Machine Sew', 'Hand Sew (Shank)', 'Pneumatic Press (Snaps)']}
                                placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                              <SearchableDropdown
                                value={material.buttonFunction || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'buttonFunction', selectedValue)}
                                options={['Functional (Closure)', 'Decorative', 'Dual Purpose']}
                                placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">LOGO</label>
                              <SearchableDropdown
                                value={material.buttonLogo || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'buttonLogo', selectedValue)}
                                options={['Plain', 'Embossed', 'Engraved', 'Laser Engraved', 'Custom']}
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
                            onChange={(selectedValue) => handleChange(materialIndex, 'rivetTestingRequirements', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'rivetTestingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'rivetQty', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'rivetSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'rivetWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.rivetApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'rivetApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'rivetRemarks', e.target.value)}
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
                          onClick={() => handleChange(materialIndex, 'showRivetAdvancedSpec', !material.showRivetAdvancedSpec)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'rivetLogo', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'rivetSetting', selectedValue)}
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
                  {material.trimAccessory === 'NIWAR (Webbing/Tapes)' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <SearchableDropdown
                          value={material.testingRequirement || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'testingRequirement', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'lengthQuantity', selectedValue)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'testingRequirement', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'lengthQuantity', selectedValue)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
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
                                                <SearchableDropdown
                          value={material.elasticType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'elasticType', selectedValue)}
                          options={['Woven', 'Braided', 'Knitted']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.elasticMaterial || ''}
                          onChange={(e) => handleChange(materialIndex, 'elasticMaterial', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'elasticWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 10mm, 20mm, 25mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH/TENSION</label>
                                        <SearchableDropdown
                          value={material.stretchTension || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'stretchTension', selectedValue)}
                          options={['Stretch percentage', 'Tension']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.elasticColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'elasticColour', selectedValue)}
                          options={['DTM', 'White', 'Black']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKING</label>
                        <input
                          type="text"
                          value={material.elasticPacking || ''}
                          onChange={(e) => handleChange(materialIndex, 'elasticPacking', e.target.value)}
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
                          <SearchableDropdown
                            value={material.testingRequirement || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'testingRequirement', selectedValue)}
                            options={['Tensile Strength', 'Elongation', 'Recovery']}
                            placeholder="Select or type Testing Requirements"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                                                    onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                    style={{ padding: '10px 14px', height: '44px' }}
                                                  />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                          type="text"
                          value={material.surplusForSection || ''}
                          onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
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
                                                <SearchableDropdown
                          value={material.feltType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'feltType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'feltMaterial', selectedValue)}
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
                            onChange={(selectedValue) => handleChange(materialIndex, 'feltColour', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'feltColorReference', e.target.files[0])}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'feltSizeSpec', selectedValue)}
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
                                onChange={(e) => handleChange(materialIndex, 'feltGsm', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'feltLengthCm', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'feltWidthCm', e.target.value)}
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
                              onChange={(e) => handleChange(materialIndex, 'feltQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Pieces"
                        />
              </div>
                      <div className="flex flex-col">
                        <input
                              type="text"
                              value={material.feltKgs || ''}
                              onChange={(e) => handleChange(materialIndex, 'feltKgs', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="KGS (CNS PER PC)"
                            />
                      </div>
                          <div className="flex flex-col">
                        <input
                          type="text"
                              value={material.feltYardage || ''}
                              onChange={(e) => handleChange(materialIndex, 'feltYardage', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'feltTestingRequirements', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'feltSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'feltWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.feltApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'feltApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'feltRemarks', e.target.value)}
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
                            onClick={() => handleChange(materialIndex, 'showFeltAdvancedSpec', !material.showFeltAdvancedSpec)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'feltThickness', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'feltFinishForm', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'feltApplication', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'feltStiffness', selectedValue)}
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

                  {/* INTERLINING Fields */}
                  {material.trimAccessory === 'INTERLINING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.interliningType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'interliningType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'interliningMaterial', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'interliningAdhesiveType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'interliningColour', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'interliningPlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                            onChange={(e) => handleChange(materialIndex, 'interliningPlacementReferenceImage', e.target.files[0])}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'interliningSizeSpec', selectedValue)}
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
                                onChange={(e) => handleChange(materialIndex, 'interliningGsm', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'interliningLength', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'interliningWidth', e.target.value)}
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

                  {/* INTERLINING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'INTERLINING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.interliningQty || ''}
                              onChange={(e) => handleChange(materialIndex, 'interliningQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Pieces"
                        />
                      </div>
                      <div className="flex flex-col">
                        <input
                              type="text"
                              value={material.interliningKgs || ''}
                              onChange={(e) => handleChange(materialIndex, 'interliningKgs', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="KGS (CNS PER PC)"
                            />
                      </div>
                          <div className="flex flex-col">
                        <input
                          type="text"
                              value={material.interliningYardage || ''}
                              onChange={(e) => handleChange(materialIndex, 'interliningYardage', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'interliningTestingRequirements', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'interliningSurplus', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2-5%"
                          />
                        </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <SearchableDropdown
                          value={material.interliningWastage || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'interliningWastage', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'interliningApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'interliningRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Hand feel required, Low shrinkage, Shell compatible"
                        />
                      </div>

                      {/* INTERLINING - Advance Spec Button and Fields */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                        {/* Show/Hide Advance Spec Button */}
                        <div style={{ marginBottom: '20px', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => handleChange(materialIndex, 'showInterliningAdvancedSpec', !material.showInterliningAdvancedSpec)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'interliningDotDensity', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'interliningStretch', selectedValue)}
                                options={['Non-Stretch', 'Warp Stretch', 'Bi-Stretch (2-way)']}
                                placeholder="Select or type"
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', height: '44px' }}
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">FUSING SPEC</label>
                              <SearchableDropdown
                                value={material.interliningFusingSpec || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'interliningFusingSpec', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'interliningHandFeel', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeMaterial', selectedValue)}
                          options={['Metal (Brass, Stainless Steel, Nickel-Free)', 'Nylon (lingerie)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* SIZE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <SearchableDropdown
                          value={material.hookEyeSize || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeSize', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeColourFinish', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeFinishType', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'hookEyePlacement', e.target.value)}
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
                            onChange={(e) => handleChange(materialIndex, 'hookEyeReferenceImage', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'hookEyeQty', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeTestingRequirements', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'hookEyeSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'hookEyeWastage', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'hookEyeRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '80px' }}
                          rows="3"
                          placeholder="Flat bar, Prevent accidental release"
                        />
                      </div>

                      {/* ADVANCE DATA Button */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-start mt-4">
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'hookEyeAdvanceDataOpen', !material.hookEyeAdvanceDataOpen)}
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
                          {material.hookEyeAdvanceDataOpen ? 'HIDE ADVANCE DATA' : 'ADVANCE DATA'}
                        </button>
                      </div>

                      {/* STRENGTH and APPLICATION - Only show when ADVANCE DATA is open */}
                      {material.hookEyeAdvanceDataOpen && (
                        <>
                          {/* STRENGTH - From ADVANCE SPEC~UI */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">STRENGTH</label>
                            <SearchableDropdown
                              value={material.hookEyeStrength || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeStrength', selectedValue)}
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
                              onChange={(selectedValue) => handleChange(materialIndex, 'hookEyeApplication', selectedValue)}
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

                  {/* BUCKLES & ADJUSTERS Fields */}
                  {material.trimAccessory === 'BUCKLES & ADJUSTERS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.buckleType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buckleType', selectedValue)}
                          options={['Side Release', 'Center Bar', 'Ladder Lock']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.buckleMaterial || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buckleMaterial', selectedValue)}
                          options={['Plastic', 'Metal', 'Nylon']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.buckleSize || ''}
                          onChange={(e) => handleChange(materialIndex, 'buckleSize', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'buckleFinishColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, White, DTM, Nickel Plated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                                                <SearchableDropdown
                          value={material.buckleFunction || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'buckleFunction', selectedValue)}
                          options={['Adjustable', 'Quick Release', 'Locking']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.buckleTensileStrength || ''}
                          onChange={(e) => handleChange(materialIndex, 'buckleTensileStrength', e.target.value)}
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
                        <SearchableDropdown
                          value={material.testingRequirement || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'testingRequirement', selectedValue)}
                          options={['Corrosion Resistance', 'Salt Spray']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: specific finger guard for release..."
                        />
                      </div>
                    </>
                  )}

                  {/* BUCKLES Fields */}
                  {material.trimAccessory === 'BUCKLES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.bucklesType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'bucklesType', selectedValue)}
                          options={['Side Release', 'D-Ring', 'Tri-Glide', 'Ladder Lock', 'Belt Buckle', 'Cam Buckle', 'Snap', 'Swivel', 'Center Bar', 'O-Ring', 'Magnetic', 'Roller', 'Military/Web']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.bucklesMaterial || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'bucklesMaterial', selectedValue)}
                          options={['Plastic (Nylon)', 'Plastic (POM/Acetal)', 'Plastic (ABS)', 'Metal (Brass)', 'Metal (Zinc)', 'Metal (Steel)', 'Metal (Stainless)', 'Metal (Aluminium)', 'Acetal/POM', 'Zinc Alloy Die-Cast', 'Carbon Fiber Look']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE (Webbing Width)</label>
                        <SearchableDropdown
                          value={material.bucklesSize || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'bucklesSize', selectedValue)}
                          options={['10mm', '15mm', '20mm', '25mm', '32mm', '38mm', '50mm', '1"', '1.5"', '2"']}
                          placeholder="Select or type (CM)"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/COLOUR</label>
                        <SearchableDropdown
                          value={material.bucklesFinishColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'bucklesFinishColour', selectedValue)}
                          options={['Black', 'Clear', 'DTM', 'Plating (Nickel)', 'Plating (Gunmetal)', 'Plating (Antique Brass)', 'Matte', 'Glossy', 'Antique', 'Plated (Nickel/Chrome)', 'Powder Coated', 'Anodized']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                          value={material.bucklesPlacement || ''}
                          onChange={(e) => handleChange(materialIndex, 'bucklesPlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Enter placement location"
                        />
                      </div>
                    </>
                  )}

                  {/* BUCKLES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'BUCKLES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.bucklesTestingRequirements || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'bucklesTestingRequirements', selectedValue)}
                            options={['Tensile Load', 'Corrosion (Salt Spray)', 'UV Resistance', 'REACH']}
                            placeholder="Select or type Testing Requirements"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'bucklesReferenceImage', e.target.files[0])}
                            className="hidden"
                            id={`upload-buckles-ref-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-buckles-ref-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.bucklesReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.bucklesQty || ''}
                          onChange={(e) => handleChange(materialIndex, 'bucklesQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.bucklesSurplus || ''}
                          onChange={(e) => handleChange(materialIndex, 'bucklesSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <SearchableDropdown
                          value={material.bucklesWastage || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'bucklesWastage', selectedValue)}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.bucklesApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'bucklesApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.bucklesRemarks || ''}
                          onChange={(e) => handleChange(materialIndex, 'bucklesRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="e.g., Finger guard, Outdoor suitable, Smooth edges"
                        />
                      </div>
                    </>
                  )}


                                    {/* BUCKLES - Advance Spec Button and Fields */}
                                    {material.trimAccessory === 'BUCKLES' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                      {/* Show/Hide Advance Spec Button */}
                      <div style={{ marginBottom: '20px', width: '100%' }}>
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showBucklesAdvancedSpec', !material.showBucklesAdvancedSpec)}
                          className="border-2 rounded-lg text-sm font-medium transition-all"
                          style={{
                            padding: '10px 20px',
                            height: '44px',
                            backgroundColor: material.showBucklesAdvancedSpec ? '#667eea' : '#ffffff',
                            borderColor: material.showBucklesAdvancedSpec ? '#667eea' : '#e5e7eb',
                            color: material.showBucklesAdvancedSpec ? '#ffffff' : '#374151'
                          }}
                          onMouseEnter={(e) => {
                            if (!material.showBucklesAdvancedSpec) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                              e.currentTarget.style.borderColor = '#d1d5db';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!material.showBucklesAdvancedSpec) {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }
                          }}
                        >
                          ADVANCE DATA
                        </button>
                      </div>
                      
                      {/* Advanced Spec Fields */}
                      {material.showBucklesAdvancedSpec && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                            <SearchableDropdown
                              value={material.bucklesFunction || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'bucklesFunction', selectedValue)}
                              options={['Load Bearing', 'Decorative', 'Quick Release', 'Adjustable', 'Auto-Lock', 'Swivel']}
                              placeholder="Select or type"
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                            <SearchableDropdown
                              value={material.bucklesTensileStrength || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'bucklesTensileStrength', selectedValue)}
                              options={['Break Strength (100kg)', 'Break Strength (500N)', 'Light Duty (<50 kg)', 'Standard (50-150 kg)', 'Heavy Duty (150-500 kg)', 'Safety (>500 kg)']}
                              placeholder="Select or type"
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">SAFETY</label>
                            <SearchableDropdown
                              value={material.bucklesSafety || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'bucklesSafety', selectedValue)}
                              options={['Standard', 'Child-Safe', 'Breakaway (safety release)']}
                              placeholder="Select or type"
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}


                  {/* EYELETS & GROMMETS Fields */}
                  {material.trimAccessory === 'EYELETS & GROMMETS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.eyeletType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'eyeletType', selectedValue)}
                          options={['Eyelet', 'Grommet', 'Two-piece set']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.eyeletMaterial || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'eyeletMaterial', selectedValue)}
                          options={['Brass', 'Steel', 'Aluminium', 'Plastic']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">INNER DIAMETER</label>
                        <input
                          type="text"
                          value={material.innerDiameter || ''}
                          onChange={(e) => handleChange(materialIndex, 'innerDiameter', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'outerDiameter', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 8mm, 10mm, 12mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.eyeletColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'eyeletColour', selectedValue)}
                          options={['Black', 'Silver', 'DTM', 'Nickel Plated']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.eyeletApplication || ''}
                          onChange={(e) => handleChange(materialIndex, 'eyeletApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Shoe laces, Drawstrings, Reinforcement"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TOOLING</label>
                                                <SearchableDropdown
                          value={material.tooling || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'tooling', selectedValue)}
                          options={['Hand tool', 'Machine press', 'Die set']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                        <SearchableDropdown
                          value={material.testingRequirement || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'testingRequirement', selectedValue)}
                          options={['Pull-Off Strength', 'Corrosion']}
                          placeholder="Select or type Testing Requirements"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Two-piece set (Eyelet and Washer) required..."
                        />
                      </div>
                    </>
                  )}

                  {/* SHOULDER PADS / CUPS Fields - Complete implementation based on image data */}
                  {material.trimAccessory === 'SHOULDER PADS' && (
                    <>
                      {/* TYPE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.shoulderPadType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadMaterial', selectedValue)}
                          options={['Foam (Polyurethane)', 'Synthetic Fiber', 'Felt', 'Cotton Wadding']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* SIZE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.shoulderPadSize || ''}
                          onChange={(e) => handleChange(materialIndex, 'shoulderPadSize', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'shoulderPadThickness', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadShape', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadCovering', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadCoveringColour', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadAttachment', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadDensity', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadPlacement', e.target.value)}
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
                            onChange={(e) => handleChange(materialIndex, 'shoulderPadReferenceImage', e.target.files[0])}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadTestingRequirements', selectedValue)}
                          options={['Wash Resistance', 'Flammability', 'Hypoallergenic']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>

                      {/* MULTISELECT - Empty field as per image */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MULTISELECT</label>
                        <input
                          type="text"
                          value={material.shoulderPadMultiselect || ''}
                          onChange={(e) => handleChange(materialIndex, 'shoulderPadMultiselect', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder=""
                        />
                      </div>

                      {/* QTY */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.shoulderPadQty || ''}
                          onChange={(e) => handleChange(materialIndex, 'shoulderPadQty', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'shoulderPadSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'shoulderPadWastage', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'shoulderPadApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'shoulderPadRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '80px' }}
                          rows="3"
                          placeholder="Lightweight, Resilient, Hold shape after steam"
                        />
                      </div>
                    </>
                  )}

                  {/* TUBULAR KNITS / RIBBING Fields */}
                  {material.trimAccessory === 'TUBULAR KNITS / RIBBING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.tubularType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'tubularType', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'tubularMaterial', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'widthDiameter', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1.5cm, 2cm, 3cm or inches"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WEIGHT/DENSITY</label>
                                                <SearchableDropdown
                          value={material.weightDensity || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'weightDensity', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'tubularColour', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'stretchPercent', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50%, 100%, 150%"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CUTTING</label>
                                                <SearchableDropdown
                          value={material.cutting || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cutting', selectedValue)}
                          options={['Straight cut', 'Bias cut', 'Anti-curl']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Skewness, Colour Fastness, Pilling"
                        />
            </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
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
                                                <SearchableDropdown
                          value={material.rfidType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'rfidType', selectedValue)}
                          options={['UHF RFID', 'HF RFID', 'LF RFID', 'EAS Tag']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FORM FACTOR</label>
                                                <SearchableDropdown
                          value={material.formFactor || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'formFactor', selectedValue)}
                          options={['Label', 'Sticker', 'Hard Tag', 'Inlay']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FREQUENCY</label>
                                                <SearchableDropdown
                          value={material.frequency || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'frequency', selectedValue)}
                          options={['860-960 MHz (UHF)', '13.56 MHz (HF)', '125 kHz (LF)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CHIP/IC TYPE</label>
                                                <SearchableDropdown
                          value={material.chipIcType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'chipIcType', selectedValue)}
                          options={['Impinj Monza', 'NXP UCODE', 'Alien Higgs']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.rfidSize || ''}
                          onChange={(e) => handleChange(materialIndex, 'rfidSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50mm x 20mm, 100mm x 30mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CODING</label>
                                                <SearchableDropdown
                          value={material.coding || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'coding', selectedValue)}
                          options={['EPC Gen 2', 'ISO 18000-6C', 'TID Programming']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SECURITY</label>
                                                <SearchableDropdown
                          value={material.security || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'security', selectedValue)}
                          options={['Tamper-evident', 'Kill Password', 'Lock Memory']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Read Range, Washing Resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                          type="text"
                          value={material.surplusForSection || ''}
                          onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Technical Integration']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Global Gen 2 standard..."
                        />
                      </div>
                    </>
                  )}

                  {/* CABLE-TIES */}
                  {material.trimAccessory === 'CABLE-TIES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <SearchableDropdown
                          value={material.cableTieType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cableTieType', selectedValue)}
                          options={['Standard Lock', 'Releasable/Reusable', 'Bar-Lok Loop (hang tags)', 'Security Tie']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <SearchableDropdown
                          value={material.cableTieMaterial || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cableTieMaterial', selectedValue)}
                          options={['Nylon (PA66)', 'Polypropylene (PP)', 'Metal Detectable']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <SearchableDropdown
                          value={material.cableTieSize || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cableTieSize', selectedValue)}
                          options={['100x2.5mm', '150x3.6mm', '200x4.8mm']}
                          placeholder="Select or type (CM)"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <SearchableDropdown
                          value={material.cableTieColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cableTieColour', selectedValue)}
                          options={['Clear/Natural', 'Black', 'Custom']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                          value={material.cableTiePlacement || ''}
                          onChange={(e) => handleChange(materialIndex, 'cableTiePlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Enter placement location"
                        />
                      </div>
                    </>
                  )}

                  
                  {/* PLASTIC CABLE TIES / LOOPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'CABLE-TIES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENTS</label>
                          <SearchableDropdown
                            value={material.cableTieTestingRequirements || ''}
                            onChange={(selectedValue) => handleChange(materialIndex, 'cableTieTestingRequirements', selectedValue)}
                            options={['Tensile Test', 'UV Resistance', 'Chemical Resistance']}
                            placeholder="Select or type Testing Requirements"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'cableTieReferenceImage', e.target.files[0])}
                            className="hidden"
                            id={`upload-cable-ref-${materialIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`upload-cable-ref-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.cableTieReferenceImage ? 'UPLOADED' : 'UPLOAD REFERENCE IMAGE'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">QTY</label>
                        <input
                          type="text"
                          value={material.cableTieQty || ''}
                          onChange={(e) => handleChange(materialIndex, 'cableTieQty', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS %</label>
                        <input
                          type="text"
                          value={material.cableTieSurplus || ''}
                          onChange={(e) => handleChange(materialIndex, 'cableTieSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5-10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <input
                          type="text"
                          value={material.cableTieWastage || ''}
                          onChange={(e) => handleChange(materialIndex, 'cableTieWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5-10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.cableTieApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cableTieApproval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'PP SAMPLE']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.cableTieRemarks || ''}
                          onChange={(e) => handleChange(materialIndex, 'cableTieRemarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="e.g., Rounded non-scratching edges, Operating temperature"
                        />
                      </div>
                    </>
                  )}


                  {/* CABLE-TIES / advance button*/}
                  {material.trimAccessory === 'CABLE-TIES' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 w-full" style={{ marginTop: '20px' }}>
                      {/* Show/Hide Advance Spec Button */}
                      <div style={{ marginBottom: '20px', width: '100%' }}>
                        <button
                          type="button"
                          onClick={() => handleChange(materialIndex, 'showCableTieAdvancedSpec', !material.showCableTieAdvancedSpec)}
                          className="border-2 rounded-lg text-sm font-medium transition-all"
                          style={{
                            padding: '10px 20px',
                            height: '44px',
                            backgroundColor: material.showCableTieAdvancedSpec ? '#667eea' : '#ffffff',
                            borderColor: material.showCableTieAdvancedSpec ? '#667eea' : '#e5e7eb',
                            color: material.showCableTieAdvancedSpec ? '#ffffff' : '#374151'
                          }}
                          onMouseEnter={(e) => {
                            if (!material.showCableTieAdvancedSpec) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                              e.currentTarget.style.borderColor = '#d1d5db';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!material.showCableTieAdvancedSpec) {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }
                          }}
                        >
                          ADVANCE DATA
                        </button>
                      </div>
                      
                      {/* Advanced Spec Fields */}
                      {material.showCableTieAdvancedSpec && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                            <SearchableDropdown
                              value={material.cableTieTensileStrength || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'cableTieTensileStrength', selectedValue)}
                              options={['Holding Force (8kg)', 'Holding Force (18kg)', 'Holding Force (22kg)', 'Holding Force (55kg)']}
                              placeholder="Select or type"
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                            <SearchableDropdown
                              value={material.cableTieFinish || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'cableTieFinish', selectedValue)}
                              options={['Smooth Edge', 'Rounded Head']}
                              placeholder="Select or type"
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">UV RESISTANCE</label>
                            <SearchableDropdown
                              value={material.cableTieUvResistance || ''}
                              onChange={(selectedValue) => handleChange(materialIndex, 'cableTieUvResistance', selectedValue)}
                              options={['Standard (Indoor)', 'UV Stabilized (Outdoor)']}
                              placeholder="Select or type"
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', height: '44px' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}



                  {/* FRINGE / TASSELS Fields */}
                  {material.trimAccessory === 'FRINGE / TASSELS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.fringeType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'fringeType', selectedValue)}
                          options={['Fringe', 'Tassel', 'Pom-pom', 'Bullion']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.fringeMaterial || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'fringeMaterial', selectedValue)}
                          options={['Cotton', 'Polyester', 'Rayon', 'Wool', 'Blend']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DROP LENGTH</label>
                        <input
                          type="text"
                          value={material.dropLength || ''}
                          onChange={(e) => handleChange(materialIndex, 'dropLength', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'tapeWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1cm, 1.5cm, 2cm, 3cm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.fringeColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'fringeColour', selectedValue)}
                          options={['White', 'Black', 'Navy', 'DTM', 'Multi-color']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                                                <SearchableDropdown
                          value={material.fringeFinish || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'fringeFinish', selectedValue)}
                          options={['Brushed', 'Twisted', 'Knotted', 'Cut edge']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CONSTRUCTION</label>
                                                <SearchableDropdown
                          value={material.construction || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'construction', selectedValue)}
                          options={['Hand-tied', 'Machine-made', 'Woven', 'Knitted']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Colour Fastness, Washing Resistance"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Design Sample Approval']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
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
                                                <SearchableDropdown
                          value={material.pipeType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'pipeType', selectedValue)}
                          options={['Round Pipe', 'Square Rod', 'Flat Bar', 'Custom Shape']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                                <SearchableDropdown
                          value={material.pipeMaterial || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'pipeMaterial', selectedValue)}
                          options={['PVC', 'Polypropylene', 'Nylon', 'ABS', 'Polyethylene']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIAMETER/DIM.</label>
                        <input
                          type="text"
                          value={material.diameterDimensions || ''}
                          onChange={(e) => handleChange(materialIndex, 'diameterDimensions', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'pipeLength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50cm, 1m, 1.5m, Custom length"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.pipeColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'pipeColour', selectedValue)}
                          options={['White', 'Black', 'Clear', 'DTM']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">END CAPS</label>
                                                <SearchableDropdown
                          value={material.endCaps || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'endCaps', selectedValue)}
                          options={['Open', 'Closed', 'Rounded', 'Flat']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FLEXIBILITY</label>
                                                <SearchableDropdown
                          value={material.flexibility || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'flexibility', selectedValue)}
                          options={['Rigid', 'Semi-flexible', 'Flexible']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                                                <SearchableDropdown
                          value={material.pipeUsage || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'pipeUsage', selectedValue)}
                          options={['Hood drawstring channel', 'Waistband support', 'Reinforcement']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="UV Stability, Load Bearing, Deflection"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                                                  type="text"
                                                  value={material.approval || ''}
                                                  onChange={(e) => handleChange(materialIndex, 'approval', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must fit precisely into a 6mm stitched channel..."
                        />
                      </div>
                    </>
                  )}

                  {/* SEAM TAPE Fields */}
                  {material.trimAccessory === 'SEAM TAPE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.seamTapeType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeMaterial', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeWidth', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeColour', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeAdhesiveType', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'seamTapePlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                          />
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'seamTapePlacementReferenceImage', e.target.files[0])}
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
                            onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeTestingRequirements', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'seamTapeTestingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'seamTapeQty', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'seamTapeSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="5-10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <SearchableDropdown
                          value={material.seamTapeWastage || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeWastage', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'seamTapeRemarks', e.target.value)}
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
                          onClick={() => handleChange(materialIndex, 'showSeamTapeAdvancedSpec', !material.showSeamTapeAdvancedSpec)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeApplicationSpec', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeElasticity', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'seamTapeBreathability', selectedValue)}
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

                  {/* ADHESIVES / GUNNING Fields */}
                  {material.trimAccessory === 'ADHESIVES / GUNNING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.adhesiveType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'adhesiveType', selectedValue)}
                          options={['Hot Melt', 'Contact Adhesive', 'Spray Adhesive']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL BASE</label>
                                                <SearchableDropdown
                          value={material.materialBase || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'materialBase', selectedValue)}
                          options={['EVA', 'PU', 'Polyamide', 'Acrylic', 'Rubber-based']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.adhesiveApplication || ''}
                          onChange={(e) => handleChange(materialIndex, 'adhesiveApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Foam-to-fabric, Fabric-to-fabric, Lamination"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">VISCOSITY</label>
                                                <SearchableDropdown
                          value={material.viscosity || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'viscosity', selectedValue)}
                          options={['Low', 'Medium', 'High (e.g', '5000 cPs', '15000 cPs)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SETTING TIME</label>
                        <input
                          type="text"
                          value={material.settingTime || ''}
                          onChange={(e) => handleChange(materialIndex, 'settingTime', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5 sec, 30 sec, 2 min, 24 hours"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.adhesiveColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'adhesiveColour', selectedValue)}
                          options={['Transparent', 'White', 'Yellow', 'DTM']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATOR</label>
                                                <SearchableDropdown
                          value={material.applicator || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'applicator', selectedValue)}
                          options={['Gun applicator', 'Spray gun', 'Roller', 'Brush']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Bond strength, Toxicity / VOC Content"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                                                <SearchableDropdown
                          value={material.lengthQuantity || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'lengthQuantity', selectedValue)}
                          options={['Liters (L)', 'Kilograms (Kgs)', 'Cans']}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Safety Data Sheet (SDS)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
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
                                                <SearchableDropdown
                          value={material.hemType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'hemType', selectedValue)}
                          options={['Bias Binding', 'Straight Cut', 'Curved Hem']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                                        <SearchableDropdown
                          value={material.hemMaterial || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'hemMaterial', selectedValue)}
                          options={['Cotton', 'Polyester', 'Blend', 'DTM']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CUT TYPE</label>
                                                <SearchableDropdown
                          value={material.cutType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cutType', selectedValue)}
                          options={['Straight', 'Bias (45°)', 'Curved']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.hemWidth || ''}
                          onChange={(e) => handleChange(materialIndex, 'hemWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1cm, 1.5cm, 2cm, 2.5cm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FOLD TYPE</label>
                                                <SearchableDropdown
                          value={material.foldType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'foldType', selectedValue)}
                          options={['Single fold', 'Double fold', 'Unfolded']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.hemColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'hemColour', selectedValue)}
                          options={['White', 'Black', 'Navy', 'DTM']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKAGING</label>
                                                <SearchableDropdown
                          value={material.hemPackaging || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'hemPackaging', selectedValue)}
                          options={['Roll', 'Folded', 'Continuous length']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Residual shrinkage, Skewing"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be stretch-stabilized for curved edges..."
                        />
                      </div>
                    </>
                  )}

                  {/* REFLECTIVE TAPES Fields */}
                  {material.trimAccessory === 'REFLECTIVE TAPES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.reflectiveTapeType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeMaterial', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeColour', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeBaseFabric', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapePlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                          />
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapePlacementReferenceImage', e.target.files[0])}
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
                            onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeTestingRequirements', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'reflectiveTapeTestingRequirementFile', e.target.files[0])}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeSizeSpec', selectedValue)}
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
                                onChange={(e) => handleChange(materialIndex, 'reflectiveTapeGsm', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'reflectiveTapeLengthCm', e.target.value)}
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
                                onChange={(e) => handleChange(materialIndex, 'reflectiveTapeWidthCm', e.target.value)}
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
                              onChange={(e) => handleChange(materialIndex, 'reflectiveTapeQty', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="Pieces"
                                                />
                      </div>
                          <div className="flex flex-col">
                            <input
                              type="text"
                              value={material.reflectiveTapeKgs || ''}
                              onChange={(e) => handleChange(materialIndex, 'reflectiveTapeKgs', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                              placeholder="KGS (CNS PER PC)"
                        />
                      </div>
                        <div className="flex flex-col">
                          <input
                            type="text"
                              value={material.reflectiveTapeYardage || ''}
                              onChange={(e) => handleChange(materialIndex, 'reflectiveTapeYardage', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'reflectiveTapeSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'reflectiveTapeWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="5-10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.reflectiveTapeApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'reflectiveTapeRemarks', e.target.value)}
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
                          onClick={() => handleChange(materialIndex, 'showReflectiveTapeAdvancedSpec', !material.showReflectiveTapeAdvancedSpec)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeCertification', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeWashDurability', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'reflectiveTapeReflectivity', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'frType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'frMaterial', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'complianceLevel', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="NFPA 701, EN 11612, ASTM D6413, CPAI-84"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.frColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'frColour', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'durability', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'frComponents', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Pieces"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.approval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
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
                                                <SearchableDropdown
                          value={material.repairKitType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'repairKitType', selectedValue)}
                          options={['Patch Kit', 'Repair Tape', 'Adhesive Patch']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.repairKitMaterial || ''}
                          onChange={(e) => handleChange(materialIndex, 'repairKitMaterial', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'sizeShape', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'repairKitColour', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'repairKitPackaging', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'userApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Heat press, Iron-on, Adhesive, Sew-on"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CONTENTS</label>
                                                <SearchableDropdown
                          value={material.contents || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'contents', selectedValue)}
                          options={['Patch', 'Adhesive', 'Instructions', 'Cleaning wipes']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Adhesion strength, Shelf Life"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Instruction Manual']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be included in the product packaging..."
                        />
                      </div>
                    </>
                  )}

                  {/* CORD RING Fields */}
                  {material.trimAccessory === 'CORD STOPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.cordStopType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cordStopType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'cordStopMaterial', selectedValue)}
                          options={['Plastic (Acetal/POM)', 'Plastic (Nylon)', 'Plastic (ABS)', 'Metal (Zinc Alloy)', 'Metal (Brass)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <SearchableDropdown
                          value={material.cordStopSize || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cordStopSize', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'cordStopColour', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'cordStopLockingMechanism', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'cordStopPlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'cordStopPlacementReferenceImage', e.target.files[0])}
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
                            onChange={(selectedValue) => handleChange(materialIndex, 'cordStopTestingRequirements', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'cordStopPlacementReferenceImage', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'cordStopQty', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'cordStopSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'cordStopWastage', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3-5%"
                          />
                        </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <SearchableDropdown
                          value={material.cordStopApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'cordStopApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'cordStopRemarks', e.target.value)}
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
                            onClick={() => handleChange(materialIndex, 'showCordStopAdvancedSpec', !material.showCordStopAdvancedSpec)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'cordStopFunction', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'cordStopBreakaway', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsMaterial', selectedValue)}
                          options={['Metal (Stainless Steel, Brass, Zinc Alloy)', 'Plastic (Acetal, Nylon)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.ringsLoopsSize || ''}
                          onChange={(e) => handleChange(materialIndex, 'ringsLoopsSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Inner Diameter or Webbing Width (25mm, 38mm, 50mm, 1 inch, 1.5 inch)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS/GAUGE</label>
                        <SearchableDropdown
                          value={material.ringsLoopsThicknessGauge || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsThicknessGauge', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsFinishPlating', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                        />
                        <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsPlacementReferenceImage', e.target.files[0])}
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
                            onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsTestingRequirements', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'ringsLoopsTestingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'ringsLoopsQty', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'ringsLoopsSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'ringsLoopsWastage', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="2-5%"
                          />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.ringsLoopsApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'ringsLoopsRemarks', e.target.value)}
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
                          onClick={() => handleChange(materialIndex, 'showRingsLoopsAdvancedSpec', !material.showRingsLoopsAdvancedSpec)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsLoadRating', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsWelded', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'ringsLoopsApplication', selectedValue)}
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

                  {/* FOAM / WADDING (PRE-CUT SHAPES) Fields */}
                  {material.trimAccessory === 'FOAM / WADDING (Pre-Cut Shapes)' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                                                <SearchableDropdown
                          value={material.foamType || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'foamType', selectedValue)}
                          options={['Polyurethane', 'Polyethylene', 'EVA', 'Memory Foam']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DENSITY</label>
                        <input
                          type="text"
                          value={material.foamDensity || ''}
                          onChange={(e) => handleChange(materialIndex, 'foamDensity', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'foamThickness', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'shapeId', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., SH-001, SH-002, Custom shape reference"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.foamColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'foamColour', selectedValue)}
                          options={['White', 'Grey', 'Black', 'DTM']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PROPERTIES</label>
                                                <SearchableDropdown
                          value={material.properties || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'properties', selectedValue)}
                          options={['Firm', 'Soft', 'High resilience', 'Anti-microbial']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                                                <SearchableDropdown
                          value={material.foamAttachment || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'foamAttachment', selectedValue)}
                          options={['Adhesive-backed', 'Sewn-in', 'Velcro', 'Snap-on']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
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
                          onChange={(e) => handleChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Compression set"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'lengthQuantity', e.target.value)}
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
                                                  onChange={(e) => handleChange(materialIndex, 'surplus', e.target.value)}
                                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                                  style={{ padding: '10px 14px', height: '44px' }}
                                                />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleChange(materialIndex, 'surplusForSection', e.target.value)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'approval', selectedValue)}
                          options={["BUYER'S", 'INITIAL', 'IPP', 'Foam Sample Approval']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be neat, sealed on the edge..."
                        />
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbMaterial', selectedValue)}
                          options={['Plastic (Polypropylene)', 'Metal (Brass, Steel)', 'Stainless Steel']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.pinBarbSize || ''}
                          onChange={(e) => handleChange(materialIndex, 'pinBarbSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Length (25mm, 50mm, 1 inch), Needle Gauge (straight pins)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                                                <SearchableDropdown
                          value={material.pinBarbColour || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbColour', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbHeadType', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'pinBarbPlacement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-1"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Enter placement"
                          />
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'pinBarbPlacementReferenceImage', e.target.files[0])}
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
                            onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbTestingRequirements', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'pinBarbTestingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'pinBarbQty', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'pinBarbSurplus', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'pinBarbWastage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="10%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                                                <SearchableDropdown
                          value={material.pinBarbApproval || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'pinBarbRemarks', e.target.value)}
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
                          onClick={() => handleChange(materialIndex, 'showPinBarbAdvancedSpec', !material.showPinBarbAdvancedSpec)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbTensileStrength', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbApplication', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'pinBarbMagazineCartridge', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureType', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureMaterial', selectedValue)}
                          options={['Neodymium (strongest)', 'Ferrite', 'Encasing (PVC)', 'Encasing (Stainless Steel)', 'Encasing (Fabric)']}
                          placeholder="Select or type"
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.magneticClosureSize || ''}
                          onChange={(e) => handleChange(materialIndex, 'magneticClosureSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="CM (e.g., 10mm, 14mm, 18mm, 20mm, Thickness)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRENGTH</label>
                                                <SearchableDropdown
                          value={material.magneticClosureStrength || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureStrength', selectedValue)}
                          options={['Pull Force (Newtons)', 'Pull Force (Kilograms)']}
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
                            value={material.magneticClosurePlacement || ''}
                            onChange={(e) => handleChange(materialIndex, 'magneticClosurePlacement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Text"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleChange(materialIndex, 'magneticClosurePlacementReferenceImage', e.target.files[0])}
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
                            onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureTestingRequirements', selectedValue)}
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
                            onChange={(e) => handleChange(materialIndex, 'magneticClosureTestingRequirementFile', e.target.files[0])}
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
                          onChange={(e) => handleChange(materialIndex, 'magneticClosureQty', e.target.value)}
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
                          onChange={(e) => handleChange(materialIndex, 'magneticClosureSurplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3-5%"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE %</label>
                        <SearchableDropdown
                          value={material.magneticClosureWastage || ''}
                          onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureWastage', selectedValue)}
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
                          onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureApproval', selectedValue)}
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
                          onChange={(e) => handleChange(materialIndex, 'magneticClosureRemarks', e.target.value)}
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
                            onClick={() => handleChange(materialIndex, 'showMagneticClosureAdvancedSpec', !material.showMagneticClosureAdvancedSpec)}
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
                              <label className="text-sm font-semibold text-gray-700 mb-2">POLARITY</label>
                              <SearchableDropdown
                                value={material.magneticClosurePolarity || ''}
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosurePolarity', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureApplication', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureEncasing', selectedValue)}
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
                                onChange={(selectedValue) => handleChange(materialIndex, 'magneticClosureShielding', selectedValue)}
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
    </>
  );
};

export default TrimAccessoryFields;
