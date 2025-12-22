import { useEffect, useRef } from 'react';

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
                  <select
                    value={material.unit}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'unit', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_unit`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '130px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_unit`]) {
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
                    <select
                      value={material.workOrder}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'workOrder', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                        errors[`artworkMaterial_${materialIndex}_workOrder`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '12px 16px' }}
                        onFocus={(e) => {
                        if (!errors[`artworkMaterial_${materialIndex}_workOrder`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        required
                    >
                      <option value="">Select Work Order</option>
                      <option value="Sewing">Sewing</option>
                      <option value="DYEING">DYEING</option>
                      <option value="WEAVING">WEAVING</option>
                      <option value="PRINTING">PRINTING</option>
                      <option value="CUTTING">CUTTING</option>
                    </select>
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
                    <select
                      value={material.sizeUnit || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeUnit', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '130px', height: '44px' }}
                    >
                      <option value="">Select</option>
                      <option value="CMS">CMS</option>
                      <option value="INCHES">INCHES</option>
                      <option value="MM">MM</option>
                      <option value="CM">CM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ARTWORK CATEGORY SELECTOR */}
              <div className="w-full" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <div className="flex flex-col" style={{ width: '280px', marginBottom: '20px' }}>
                  <label className="text-sm font-bold text-gray-800 mb-2">ARTWORK CATEGORY</label>
                  <select
                    value={material.artworkCategory}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'artworkCategory', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', height: '44px' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  >
                    <option value="">Select Category</option>
                    <option value="LABELS (BRAND/MAIN)">LABELS (BRAND/MAIN)</option>
                    <option value="CARE & COMPOSITION">CARE & COMPOSITION</option>
                    <option value="TAGS & SPECIAL LABELS">TAGS & SPECIAL LABELS</option>
                    <option value="FLAMMABILITY / SAFETY LABELS">FLAMMABILITY / SAFETY LABELS</option>
                    <option value="RFID / SECURITY TAGS">RFID / SECURITY TAGS</option>
                    <option value="LAW LABEL / CONTENTS TAG">LAW LABEL / CONTENTS TAG</option>
                    <option value="HANG TAG SEALS / STRINGS">HANG TAG SEALS / STRINGS</option>
                    <option value="PRICE TICKET / BARCODE TAG">PRICE TICKET / BARCODE TAG</option>
                    <option value="HEAT TRANSFER LABELS">HEAT TRANSFER LABELS</option>
                    <option value="UPC LABEL / BARCODE STICKER">UPC LABEL / BARCODE STICKER</option>
                    <option value="SIZE LABELS (INDIVIDUAL)">SIZE LABELS (INDIVIDUAL)</option>
                    <option value="ANTI-COUNTERFEIT & HOLOGRAMS">ANTI-COUNTERFEIT & HOLOGRAMS</option>
                    <option value="QC / INSPECTION LABELS">QC / INSPECTION LABELS</option>
                    <option value="BELLY BAND / WRAPPER">BELLY BAND / WRAPPER</option>
                    <option value="TYVEK LABELS">TYVEK LABELS</option>
                    <option value="TAFFETA LABELS">TAFFETA LABELS</option>
                    <option value="INSERT CARDS">INSERT CARDS</option>
                    <option value="RIBBONS">RIBBONS</option>
                  </select>
                </div>

                {material.artworkCategory && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                    {/* TYPE Field */}
                    {!['LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'TYVEK LABELS', 'TAFFETA LABELS'].includes(material.artworkCategory) && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                      <select
                        value={material.specificType}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'specificType', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                      >
                        <option value="">Select</option>
                          {material.artworkCategory === 'LABELS (BRAND/MAIN)' && ['Woven (Damask, Taffeta, Satin)', 'Printed (Satin, Cotton)', 'Heat Transfer', 'Leather', 'Metal'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'CARE & COMPOSITION' && ['Woven', 'Printed', 'Heat Transfer'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'TAGS & SPECIAL LABELS' && ['Hang Tag (Paper/Card)', 'Price Tag', 'Size Label', 'Flag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'FLAMMABILITY / SAFETY LABELS' && ['Permanent Sew-in Label', 'Removable Hang Tag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'RFID / SECURITY TAGS' && ['Soft EAS Label', 'UHF RFID Sticker', 'Hard Tag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'PRICE TICKET / BARCODE TAG' && ['Adhesive Sticker', 'Printed Area', 'Dedicated Small Tag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'HEAT TRANSFER LABELS' && ['Brand Logo', 'Size Tag', 'Minimal Care', 'Instructions', 'Reflective'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'UPC LABEL / BARCODE STICKER' && ['Adhesive Sticker', 'Pre-Printed Barcode Area'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'SIZE LABELS (INDIVIDUAL)' && ['Woven Flag Label', 'Printed Flag Label', 'Heat Transfer', 'Small Sticker'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' && ['Hologram Sticker', 'Void/Tamper-Evident Label', 'Authenticity Patch', 'Invisible Ink Print'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'QC / INSPECTION LABELS' && ['Passed/Inspected Sticker', 'Hold/Defective Sticker', 'Audit Sample Tag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'BELLY BAND / WRAPPER' && ['Cardboard Sleeve', 'Printed Paper Band', 'Plastic Film Wrapper'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'TYVEK LABELS' && ['Law Label', 'Shipping Tag', 'Permanent Industrial/Outdoor Care Label'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'TAFFETA LABELS' && ['Printed Care Label', 'Composition Label', 'Temporary Size Label'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          {material.artworkCategory === 'INSERT CARDS' && ['Shirt Board', 'Neck Support', 'Tissue Paper Insert', 'Promotional Insert Card'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          {material.artworkCategory === 'RIBBONS' && ['Satin', 'Grosgrain', 'Sheer Organza', 'Printed Polyester', 'Woven Edge'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    )}

                    {/* MATERIAL Field */}
                    {!['RFID / SECURITY TAGS', 'LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'TYVEK LABELS', 'TAFFETA LABELS'].includes(material.artworkCategory) && (
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
                            material.artworkCategory === 'INSERT CARDS' ? 'Card Stock GSM (200-400 GSM) / Corrugated Board / Acid-Free Tissue' :
                            material.artworkCategory === 'RIBBONS' ? 'Polyester / Nylon / Rayon / Cotton' :
                            'e.g., Polyester'
                          }
                      />
                    </div>
                    )}

                    {/* Specific Fields for CARE & COMPOSITION */}
                    {material.artworkCategory === 'CARE & COMPOSITION' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COUNTRY OF ORIGIN</label>
                          <input
                            type="text"
                            value={material.countryOfOrigin}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'countryOfOrigin', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Made in India"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MANUFACTURER ID</label>
                          <input
                            type="text"
                            value={material.manufacturerId}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'manufacturerId', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., RN# / CA#"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for RFID / SECURITY TAGS */}
                    {material.artworkCategory === 'RFID / SECURITY TAGS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FORM FACTOR</label>
                          <select
                            value={material.formFactor}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'formFactor', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <option value="">Select</option>
                            <option value="Adhesive Label">Adhesive Label</option>
                            <option value="Integrated Woven Label">Integrated Woven Label</option>
                          </select>
                    </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CHIP / FREQUENCY</label>
                          <input
                            type="text"
                            value={material.chipFrequency}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'chipFrequency', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 860-960 MHz for UHF"
                          />
                  </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CODING</label>
                          <input
                            type="text"
                            value={material.coding}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'coding', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Pre-Encoded / Sequential"
                          />
                </div>
                      </>
                    )}

                    {/* Specific Fields for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.lawLabelType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent Sew-in Label, Attached Label"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.lawLabelMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Cotton, Polyester, Blend, Tyvek"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FILLING MATERIALS</label>
                          <input
                            type="text"
                            value={material.fillingMaterials || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'fillingMaterials', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Full disclosure of filling materials"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">NEW/USED STATUS</label>
                          <input
                            type="text"
                            value={material.newUsedStatus || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'newUsedStatus', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder='e.g., "ALL NEW MATERIAL"'
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REGISTRATION/LICENSES</label>
                          <input
                            type="text"
                            value={material.registrationLicenses || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'registrationLicenses', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Manufacturer's License Number"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for HANG TAG SEALS / STRINGS */}
                    {material.artworkCategory === 'HANG TAG SEALS / STRINGS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.hangTagType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Plastic Loop Lock, String & Seal, Security Pin"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.hangTagMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Plastic, Nylon, Polyester, Cotton String"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SEAL SHAPE</label>
                          <input
                            type="text"
                            value={material.sealShape || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sealShape', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Bullet Shape / Rectangular"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FASTENING</label>
                          <input
                            type="text"
                            value={material.fastening || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'fastening', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Permanent Lock / Reusable"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PRE-STRINGING</label>
                          <input
                            type="text"
                            value={material.preStringing || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'preStringing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Supplied Pre-strung"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                          <input
                            type="text"
                            value={material.application || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'application', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Manual Attachment / Machine Application"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for HEAT TRANSFER LABELS */}
                    {material.artworkCategory === 'HEAT TRANSFER LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.heatTransferType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Brand Logo, Size Tag, Minimal Care, Instructions, Reflective"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL BASE</label>
                          <input
                            type="text"
                            value={material.heatTransferMaterialBase || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferMaterialBase', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Polyester Film, PU, TPU, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION SPEC</label>
                          <input
                            type="text"
                            value={material.applicationSpec || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'applicationSpec', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Temperature, Pressure, Time"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <input
                            type="text"
                            value={material.colours || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'colours', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="DTM / Colour Code (Pantone TPX/TCX)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/HAND FEEL</label>
                          <input
                            type="text"
                            value={material.finishHandFeel || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishHandFeel', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Soft, Smooth, Textured"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.placement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Collar, Side Seam, Care Label Area"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Field for TAFFETA LABELS */}
                    {material.artworkCategory === 'TAFFETA LABELS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PRINT QUALITY</label>
                        <input
                          type="text"
                          value={material.printQuality}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'printQuality', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="High Contrast Printing"
                        />
                      </div>
                    )}

                    {/* Specific Fields for UPC LABEL / BARCODE STICKER */}
                    {material.artworkCategory === 'UPC LABEL / BARCODE STICKER' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.upcType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive Sticker, Pre-Printed Barcode Area"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.upcMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Paper, Synthetic, Vinyl, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="UPC Code, Barcode, Product Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">QUALITY</label>
                          <input
                            type="text"
                            value={material.quality || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'quality', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Print Contrast Ratio"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                          <input
                            type="text"
                            value={material.adhesive || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'adhesive', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Removable"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.placement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Inside Label, Hang Tag, Packaging"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for PRICE TICKET / BARCODE TAG */}
                    {material.artworkCategory === 'PRICE TICKET / BARCODE TAG' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.priceTicketType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive Sticker, Printed Area, Dedicated Small Tag"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.priceTicketMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Paper, Card Stock, Synthetic, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Price, SKU, Barcode, Product Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">BARCODE TYPE</label>
                          <input
                            type="text"
                            value={material.barcodeType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'barcodeType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., UPC / EAN-13 / Code 128"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                          <input
                            type="text"
                            value={material.adhesive || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'adhesive', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Removable, Repositionable"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                          <input
                            type="text"
                            value={material.finishing || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Matte, Gloss, Lamination"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for SIZE LABELS (INDIVIDUAL) */}
                    {material.artworkCategory === 'SIZE LABELS (INDIVIDUAL)' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.sizeLabelType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Woven Flag Label, Printed Flag Label, Heat Transfer, Small Sticker"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.sizeLabelMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Polyester, Cotton, Satin, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                          <input
                            type="text"
                            value={material.finishing || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Matte, Gloss, Lamination"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <input
                            type="text"
                            value={material.colours || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'colours', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="DTM / Colour Code (Pantone TPX/TCX)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.placement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Collar, Side Seam, Care Label Area"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PERMANENCE</label>
                          <input
                            type="text"
                            value={material.permanence || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Temporary"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for ANTI-COUNTERFEIT & HOLOGRAMS */}
                    {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.antiCounterfeitType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Hologram Sticker, Void/Tamper-Evident Label, Authenticity Patch, Invisible Ink Print"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.antiCounterfeitMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Holographic Film, Security Paper, Synthetic, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SECURITY FEATURE</label>
                          <input
                            type="text"
                            value={material.securityFeature || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'securityFeature', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Hologram, UV Ink, Microtext, QR Code"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                          <input
                            type="text"
                            value={material.application || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'application', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive, Sew-in, Heat Transfer"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.placement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Inside Label, Hang Tag, Packaging"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">VERIFICATION</label>
                          <input
                            type="text"
                            value={material.verification || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'verification', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="App Scan, UV Light, Visual Check"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for QC / INSPECTION LABELS */}
                    {material.artworkCategory === 'QC / INSPECTION LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.qcLabelType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcLabelType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Passed/Inspected Sticker, Hold/Defective Sticker, Audit Sample Tag"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.qcLabelMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcLabelMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Paper, Synthetic, Vinyl, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Passed, Hold, Defective, Audit Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                          <input
                            type="text"
                            value={material.application || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'application', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive, Sew-in, Tag"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REMOVAL</label>
                          <input
                            type="text"
                            value={material.removal || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'removal', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Removable, Before Shipping"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TRACEABILITY</label>
                          <input
                            type="text"
                            value={material.traceability || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'traceability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Batch Number, Date, Inspector ID"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for BELLY BAND / WRAPPER */}
                    {material.artworkCategory === 'BELLY BAND / WRAPPER' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.bellyBandType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Cardboard Sleeve, Printed Paper Band, Plastic Film Wrapper"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.bellyBandMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Card Stock GSM, Paper, Plastic Film, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CLOSURE</label>
                          <input
                            type="text"
                            value={material.closure || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'closure', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive, Tuck-in, Overlap"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Brand Info, Product Details, Care Instructions"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CLOSURE/FINISH</label>
                          <input
                            type="text"
                            value={material.closureFinish || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'closureFinish', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Sealed, Open End, Perforated"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                          <input
                            type="text"
                            value={material.durability || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'durability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Temporary, Reusable, Single Use"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for TYVEK LABELS */}
                    {material.artworkCategory === 'TYVEK LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.tyvekType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tyvekType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Law Label, Shipping Tag, Permanent Industrial/Outdoor Care Label"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.tyvekMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tyvekMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Tyvek, Synthetic Paper, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Care Instructions, Composition, Law Label Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">INK TYPE</label>
                          <input
                            type="text"
                            value={material.inkType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'inkType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Durable, Solvent-Resistant"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                          <input
                            type="text"
                            value={material.durability || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'durability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Waterproof, Tear-Resistant, UV Resistant"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PERMANENCE</label>
                          <input
                            type="text"
                            value={material.permanence || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Temporary"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for TAFFETA LABELS */}
                    {material.artworkCategory === 'TAFFETA LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.taffetaType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'taffetaType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Printed Care Label, Composition Label, Temporary Size Label"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.taffetaMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'taffetaMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Taffeta, Polyester, Satin, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Care Instructions, Composition, Size Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PRINT QUALITY</label>
                          <input
                            type="text"
                            value={material.printQuality || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'printQuality', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="High Contrast Printing"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                          <input
                            type="text"
                            value={material.durability || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'durability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Wash Fastness, Fade Resistance"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISHING</label>
                          <input
                            type="text"
                            value={material.finishing || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Matte, Gloss, Lamination"
                          />
                        </div>
                      </>
                    )}

                    {/* SIZE / DIMENSIONS Field */}
                    {(['LABELS (BRAND/MAIN)', 'TAGS & SPECIAL LABELS', 'RFID / SECURITY TAGS', 'LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'TYVEK LABELS', 'TAFFETA LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'LABELS (BRAND/MAIN)' ? 'SIZE / ARTWORK ID' :
                           material.artworkCategory === 'TAGS & SPECIAL LABELS' ? 'SIZE / SHAPE' : 
                           material.artworkCategory === 'HANG TAG SEALS / STRINGS' ? 'SIZE / LENGTH' : 
                           material.artworkCategory === 'SIZE LABELS (INDIVIDUAL)' ? 'SIZE / CODE' : 
                           material.artworkCategory === 'TYVEK LABELS' ? 'SIZE / FORMAT' : 
                           material.artworkCategory === 'TAFFETA LABELS' ? 'SIZE / FOLD' :
                           material.artworkCategory === 'LAW LABEL / CONTENTS TAG' ? 'SIZE / COLOUR' :
                           material.artworkCategory === 'PRICE TICKET / BARCODE TAG' ? 'SIZE / DIMENSION' :
                           material.artworkCategory === 'HEAT TRANSFER LABELS' ? 'SIZE / ARTWORK ID' :
                           material.artworkCategory === 'UPC LABEL / BARCODE STICKER' ? 'SIZE / SPEC' :
                           material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' ? 'SIZE / ARTWORK' :
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

                    {/* FOLD TYPE Field */}
                    {material.artworkCategory === 'LABELS (BRAND/MAIN)' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FOLD TYPE</label>
                  <select
                          value={material.foldType}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'foldType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          {['End-fold', 'Center-fold', 'Miter-fold', 'Straight Cut'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                      </div>
                    )}

                    {/* COLOURS Field */}
                    {(['LABELS (BRAND/MAIN)', 'HANG TAG SEALS / STRINGS'].includes(material.artworkCategory)) && (
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
                
                    {/* ATTACHMENT / CLOSURE Field */}
                    {(['TAGS & SPECIAL LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'TAGS & SPECIAL LABELS' ? 'ATTACHMENT' : 'CLOSURE'}
                  </label>
                  <input
                    type="text"
                          value={material.attachment}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'attachment', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Adhesive"
                        />
                      </div>
                    )}

                    {/* CONTENT Field */}
                    {(['TAGS & SPECIAL LABELS', 'FLAMMABILITY / SAFETY LABELS', 'LAW LABEL / CONTENTS TAG'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' ? 'CONTENT MANDATES' : 'CONTENT'}
                        </label>
                        <input
                          type="text"
                          value={material.content}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Barcode"
                        />
                </div>
                    )}
                
                    {/* SYMBOL Field */}
                    {(['CARE & COMPOSITION', 'FLAMMABILITY / SAFETY LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'CARE & COMPOSITION' ? 'CARE SYMBOLS' : 'SYMBOL'}
                  </label>
                  <input
                    type="text"
                          value={material.symbol}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'symbol', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Bleaching"
                        />
                      </div>
                    )}

                    {/* CERTIFICATION ID Field - Only for FLAMMABILITY / SAFETY LABELS */}
                    {material.artworkCategory === 'FLAMMABILITY / SAFETY LABELS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION ID</label>
                        <input
                          type="text"
                          value={material.certificationId}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'certificationId', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Test Report Reference Number / Certification Body ID"
                        />
                      </div>
                    )}

                    {/* LANGUAGE Field */}
                    {(['CARE & COMPOSITION', 'FLAMMABILITY / SAFETY LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LANGUAGE</label>
                        <input
                          type="text"
                          value={material.language}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'language', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., English, French"
                        />
                </div>
                    )}
                
                    {/* FINISHING / FINISH Field */}
                    {(['LABELS (BRAND/MAIN)', 'TAGS & SPECIAL LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'HEAT TRANSFER LABELS' ? 'FINISH / HAND FEEL' : 'FINISHING'}
                  </label>
                        <input
                          type="text"
                          value={material.finishing}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Hot-cut"
                        />
                      </div>
                    )}

                    {/* PLACEMENT Field (Specific to artwork category) */}
                    {(['LABELS (BRAND/MAIN)', 'TAGS & SPECIAL LABELS', 'FLAMMABILITY / SAFETY LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                          value={material.placement}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Inside seam"
                        />
                      </div>
                    )}

                    {/* PERMANENCE / DURABILITY Field */}
                    {(['CARE & COMPOSITION'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'BELLY BAND / WRAPPER' || material.artworkCategory === 'TYVEK LABELS' || material.artworkCategory === 'TAFFETA LABELS' ? 'DURABILITY' : 'PERMANENCE'}
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

                    {/* PERMANENCE Field with Upload for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PERMANENCE</label>
                          <input
                            type="text"
                            value={material.permanence || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Permanent"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanenceFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-permanence-law-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-permanence-law-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.permanenceFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* ADHESIVE Field */}
                    {(['RFID / SECURITY TAGS', 'PRICE TICKET / BARCODE TAG', 'UPC LABEL / BARCODE STICKER'].includes(material.artworkCategory)) && (
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
                    {material.artworkCategory === 'HEAT TRANSFER LABELS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION SPEC</label>
                        <input
                          type="text"
                          value={material.applicationSpec}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'applicationSpec', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Temp / Dwell Time / Pressure"
                        />
                      </div>
                    )}

                    {/* SECURITY / SECURITY FEATURE Field */}
                    {(['RFID / SECURITY TAGS', 'ANTI-COUNTERFEIT & HOLOGRAMS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' ? 'SECURITY FEATURE' : 'SECURITY'}
                        </label>
                        <input
                          type="text"
                          value={material.security}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'security', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3D Holography"
                        />
                      </div>
                    )}

                    {/* VERIFICATION Field */}
                    {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">VERIFICATION</label>
                        <input
                          type="text"
                          value={material.verification}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'verification', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Web Link"
                        />
                      </div>
                    )}

                    {/* REMOVAL / TRACEABILITY Field */}
                    {material.artworkCategory === 'QC / INSPECTION LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REMOVAL</label>
                          <input
                            type="text"
                            value={material.removal}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'removal', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Easily removable"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TRACEABILITY</label>
                          <input
                            type="text"
                            value={material.traceability}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'traceability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Sequential numbering"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for INSERT CARDS */}
                    {material.artworkCategory === 'INSERT CARDS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SIZE / SHAPE</label>
                          <input
                            type="text"
                            value={material.sizeShape}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeShape', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Dimensions / Die-Cut Shape"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Promotional Text / Product Features / Brand Story"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                          <input
                            type="text"
                            value={material.finishing}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Matte / Gloss Lamination / Varnished"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PERMANENCE</label>
                          <input
                            type="text"
                            value={material.permanence}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Temporary (Removed by consumer)"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for RIBBONS */}
                    {material.artworkCategory === 'RIBBONS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                          <input
                            type="text"
                            value={material.ribbonWidth}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 10mm, 1 inch"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <input
                            type="text"
                            value={material.colours}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'colours', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="DTM / Colour Code (Pantone TPX/TCX)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                          <input
                            type="text"
                            value={material.finishing}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Single Face / Double Face / Wired Edge"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                          <input
                            type="text"
                            value={material.usage}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'usage', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Packaging Tie / Decorative Trim / Hanging Loop"
                          />
                        </div>
                      </>
                    )}

                    {/* TESTING REQUIREMENT Field with Image Upload - For all except LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && (
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

                    {/* TESTING REQUIREMENT Field - Standalone for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Wash Fastness, Durability"
                        />
                      </div>
                    )}

                    {/* LENGTH / QUANTITY Field - For all except LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && (
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

                    {/* LENGTH / QUANTITY Field with FOR-SECTION - For LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                          <input
                            type="text"
                            value={material.lengthQuantity || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 5000 pcs"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.lengthQuantityForSection || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lengthQuantityForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                    )}

                    {/* SURPLUS Field with FOR SECTION - For all except LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && (
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

                    {/* SURPLUS Field - Standalone for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5%)"
                        />
                      </div>
                    )}

                    {/* APPROVAL Field */}
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                  <select
                        value={material.approval}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'approval', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                      >
                        <option value="">Select</option>
                        <option value="BUYER'S">BUYER'S</option>
                        <option value="INITIAL">INITIAL</option>
                        <option value="IPP">IPP</option>
                        <option value="PP">PP</option>
                        <option value="TOP">TOP</option>
                  </select>
                </div>

                    {/* REMARKS Field */}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-8">
            No artwork materials added yet.
          </div>
        )}
        
        {/* Add Material Button at Bottom */}
        <div className="mt-6 pt-6 border-t border-gray-200" style={{ marginTop: '24px', paddingTop: '24px' }}>
          <p className="text-sm text-gray-600 mb-3">Would you like to add more materials?</p>
          <button
            type="button"
            onClick={() => {
              const currentLength = formData.artworkMaterials?.length || 0;
              addArtworkMaterial();
              const newIndex = currentLength;
              const attemptScroll = (attempts = 0) => {
                if (attempts > 30) return;
                const element = document.getElementById(`artwork-material-${newIndex}`);
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

export default Step4;
