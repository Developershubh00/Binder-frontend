import { useState, useEffect } from 'react';
import SearchableDropdown from '../SearchableDropdown';

const Step0 = ({ 
  formData, 
  errors, 
  handleInputChange,
  handleSkuChange,
  handleSkuImageChange,
  addSku,
  removeSku,
  addSubproduct,
  removeSubproduct,
  handleSubproductChange,
  handleSubproductImageChange,
  handleSave
}) => {
  const [buyerCodeOptions, setBuyerCodeOptions] = useState([]);

  // Load buyer codes from localStorage
  useEffect(() => {
    try {
      const buyerCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      const codes = buyerCodes.map(buyer => buyer.code);
      setBuyerCodeOptions(codes);
    } catch (error) {
      console.error('Error loading buyer codes:', error);
      setBuyerCodeOptions([]);
    }
  }, []);

  const handleBuyerCodeChange = (value) => {
    handleInputChange({ target: { name: 'buyerCode', value } });
  };

  const handleProductChange = (skuIndex, value) => {
    handleSkuChange(skuIndex, 'product', value);
  };

  const onSave = () => {
    if (handleSave) {
      handleSave();
    } else {
      console.log('Saving SKUs:', formData.skus);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>PART-0 PRODUCT SPEC</h2>
        <p className="text-base text-gray-500">Enter product specification details</p>
      </div>
      
      {/* IPO Code (if from Internal Purchase Order) or Buyer Code */}
      <div style={{ marginBottom: '24px' }}>
        <div className="flex flex-col" style={{ maxWidth: '400px' }}>
          {formData.ipoCode ? (
            <>
              <label className="text-sm font-semibold text-gray-700 mb-2">
                IPO CODE
              </label>
              <div
                style={{
                  padding: '12px 14px',
                  height: '48px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {formData.ipoCode}
              </div>
            </>
          ) : (
            <>
              <label className="text-sm font-semibold text-gray-700 mb-2">
                BUYER CODE
              </label>
              <SearchableDropdown
                value={formData.buyerCode || ''}
                onChange={handleBuyerCodeChange}
                options={buyerCodeOptions}
                placeholder="Select or type buyer code"
                strictMode={false}
                className={errors.buyerCode ? 'border-red-600' : ''}
                style={{ height: '48px' }}
                onFocus={(e) => {
                  if (!errors.buyerCode) {
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '';
                }}
              />
              {errors.buyerCode && (
                <span className="text-red-600 text-xs font-medium mt-1">{errors.buyerCode}</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* SKU Boxes */}
      {formData.skus.map((sku, skuIndex) => (
        <div key={skuIndex} style={{ marginBottom: '24px' }}>
          <div className="bg-gray-50 rounded-xl" style={{ padding: '32px', border: '1px solid #e5e7eb' }}>
            {/* SKU Header */}
            {formData.skus.length > 1 && (
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="text-lg font-semibold text-gray-800">SKU {skuIndex + 1}</h3>
                {formData.skus.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSku(skuIndex)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      color: 'red',
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
                    Remove
                  </button>
                )}
              </div>
            )}

            {/* Row 1: SKU, Product */}
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px', marginBottom: '24px' }}>
              {/* SKU / ITEM NO */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  SKU / ITEM NO. <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={sku.sku || ''}
                  onChange={(e) => handleSkuChange(skuIndex, 'sku', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`sku_${skuIndex}`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '12px 16px', height: '48px' }}
                  onFocus={(e) => {
                    if (!errors[`sku_${skuIndex}`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="e.g., SKU-001"
                  required
                />
                {errors[`sku_${skuIndex}`] && (
                  <span className="text-red-600 text-xs font-medium mt-1">{errors[`sku_${skuIndex}`]}</span>
                )}
              </div>

              {/* PRODUCT */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  PRODUCT <span className="text-red-600">*</span>
                </label>
                <SearchableDropdown
                  value={sku.product || ''}
                  onChange={(value) => handleProductChange(skuIndex, value)}
                  options={[]}
                  placeholder="Select or type product"
                  strictMode={false}
                  className={errors[`product_${skuIndex}`] ? 'border-red-600' : ''}
                  style={{ height: '48px' }}
                  onFocus={(e) => {
                    if (!errors[`product_${skuIndex}`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                />
                {errors[`product_${skuIndex}`] && (
                  <span className="text-red-600 text-xs font-medium mt-1">{errors[`product_${skuIndex}`]}</span>
                )}
              </div>
            </div>

            {/* Row 2: PO QTY, Overage %, Delivery Date */}
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', marginBottom: '24px' }}>
              {/* PO QTY */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  PO QTY <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={sku.poQty || ''}
                  onChange={(e) => handleSkuChange(skuIndex, 'poQty', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`poQty_${skuIndex}`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '12px 16px', height: '48px' }}
                  onFocus={(e) => {
                    if (!errors[`poQty_${skuIndex}`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="e.g., 1000"
                  required
                />
                {errors[`poQty_${skuIndex}`] && (
                  <span className="text-red-600 text-xs font-medium mt-1">{errors[`poQty_${skuIndex}`]}</span>
                )}
              </div>

              {/* OVERAGE (%AGE) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  OVERAGE (%) <span className="text-red-600">*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={sku.overagePercentage || ''}
                    onChange={(e) => {
                      // Store only numeric value (remove % and non-numeric chars except decimal point)
                      const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                      handleSkuChange(skuIndex, 'overagePercentage', numericValue);
                    }}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`overagePercentage_${skuIndex}`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '12px 40px 12px 16px', height: '48px', width: '100%' }}
                    onFocus={(e) => {
                      if (!errors[`overagePercentage_${skuIndex}`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., 5"
                    required
                  />
                  {sku.overagePercentage && (
                    <span style={{ position: 'absolute', right: '16px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                  )}
                </div>
                {errors[`overagePercentage_${skuIndex}`] && (
                  <span className="text-red-600 text-xs font-medium mt-1">{errors[`overagePercentage_${skuIndex}`]}</span>
                )}
              </div>

              {/* DELIVERY DUE DATE */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  DELIVERY DUE DATE <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={sku.deliveryDueDate || ''}
                  onChange={(e) => handleSkuChange(skuIndex, 'deliveryDueDate', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`deliveryDueDate_${skuIndex}`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '12px 16px', height: '48px' }}
                  onFocus={(e) => {
                    if (!errors[`deliveryDueDate_${skuIndex}`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  required
                />
                {errors[`deliveryDueDate_${skuIndex}`] && (
                  <span className="text-red-600 text-xs font-medium mt-1">{errors[`deliveryDueDate_${skuIndex}`]}</span>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                PRODUCT IMAGE <span className="text-red-600">*</span>
              </label>
              <div className="flex items-start" style={{ gap: '24px' }}>
                <div className="flex flex-col" style={{ flex: '0 0 auto' }}>
                  <div 
                    className={`border-2 border-dashed rounded-lg bg-white flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all ${
                      errors[`image_${skuIndex}`] ? 'border-red-600' : 'border-gray-300'
                    }`}
                    style={{ width: '160px', height: '120px', position: 'relative' }}
                    onClick={() => document.getElementById(`image-${skuIndex}`).click()}
                  >
                    {sku.imagePreview ? (
                      <img 
                        src={sku.imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id={`image-${skuIndex}`}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSkuImageChange(skuIndex, e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    required
                  />
                  {errors[`image_${skuIndex}`] && (
                    <span className="text-red-600 text-xs font-medium mt-1">{errors[`image_${skuIndex}`]}</span>
                  )}
                </div>
                <div className="text-sm text-gray-500" style={{ paddingTop: '8px' }}>
                  <p className="font-medium text-gray-700 mb-1">Upload product image</p>
                  <p>Supported formats: JPG, PNG, GIF</p>
                  <p>Maximum file size: 5MB</p>
                </div>
              </div>
            </div>

            {/* Subproducts List */}
            {sku.subproducts && sku.subproducts.length > 0 ? (
              <div style={{ marginTop: '24px', borderTop: '2px solid #d1d5db', paddingTop: '24px' }}>
                <h4 className="text-base font-semibold text-gray-800 mb-4">SUBPRODUCTS</h4>
                {sku.subproducts.map((subproduct, subproductIndex) => (
                  <div key={subproductIndex}>
                    <div 
                      className="bg-white rounded-lg border border-gray-200"
                      style={{ padding: '24px', marginBottom: '16px' }}
                    >
                    {/* Subproduct Header */}
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 className="text-sm font-semibold text-gray-700">Subproduct {subproductIndex + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeSubproduct(skuIndex, subproductIndex)}
                        style={{
                          background: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          color: 'red',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.2s'
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
                    </div>

                    {/* SUBPRODUCT Field */}
                    <div className="flex flex-col" style={{ marginBottom: '24px' }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        SUBPRODUCT <span className="text-red-600">*</span>
                      </label>
                      <SearchableDropdown
                        value={subproduct.subproduct || ''}
                        onChange={(value) => handleSubproductChange(skuIndex, subproductIndex, 'subproduct', value)}
                        options={[]}
                        placeholder="Select or type subproduct"
                        strictMode={false}
                        className={errors[`subproduct_${skuIndex}_${subproductIndex}`] ? 'border-red-600' : ''}
                        style={{ height: '48px' }}
                        onFocus={(e) => {
                          if (!errors[`subproduct_${skuIndex}_${subproductIndex}`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                      />
                      {errors[`subproduct_${skuIndex}_${subproductIndex}`] && (
                        <span className="text-red-600 text-xs font-medium mt-1">{errors[`subproduct_${skuIndex}_${subproductIndex}`]}</span>
                      )}
                    </div>

                    {/* Row: PO QTY, Overage %, Delivery Date */}
                    <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', marginBottom: '24px' }}>
                      {/* PO QTY */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          PO QTY <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={subproduct.poQty || ''}
                          onChange={(e) => handleSubproductChange(skuIndex, subproductIndex, 'poQty', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`subproduct_${skuIndex}_${subproductIndex}_poQty`] 
                              ? 'border-red-600' 
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '12px 16px', height: '48px' }}
                          placeholder="e.g., 1000"
                          required
                        />
                        {errors[`subproduct_${skuIndex}_${subproductIndex}_poQty`] && (
                          <span className="text-red-600 text-xs font-medium mt-1">{errors[`subproduct_${skuIndex}_${subproductIndex}_poQty`]}</span>
                        )}
                      </div>

                      {/* OVERAGE (%AGE) */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          OVERAGE (%) <span className="text-red-600">*</span>
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={subproduct.overagePercentage || ''}
                            onChange={(e) => {
                              // Store only numeric value (remove % and non-numeric chars except decimal point)
                              const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                              handleSubproductChange(skuIndex, subproductIndex, 'overagePercentage', numericValue);
                            }}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`subproduct_${skuIndex}_${subproductIndex}_overagePercentage`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '12px 40px 12px 16px', height: '48px', width: '100%' }}
                            placeholder="e.g., 5"
                            required
                          />
                          {subproduct.overagePercentage && (
                            <span style={{ position: 'absolute', right: '16px', color: '#6b7280', pointerEvents: 'none', userSelect: 'none' }}>%</span>
                          )}
                        </div>
                        {errors[`subproduct_${skuIndex}_${subproductIndex}_overagePercentage`] && (
                          <span className="text-red-600 text-xs font-medium mt-1">{errors[`subproduct_${skuIndex}_${subproductIndex}_overagePercentage`]}</span>
                        )}
                      </div>

                      {/* DELIVERY DUE DATE */}
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          DELIVERY DUE DATE <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="date"
                          value={subproduct.deliveryDueDate || ''}
                          onChange={(e) => handleSubproductChange(skuIndex, subproductIndex, 'deliveryDueDate', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`subproduct_${skuIndex}_${subproductIndex}_deliveryDueDate`] 
                              ? 'border-red-600' 
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '12px 16px', height: '48px' }}
                          required
                        />
                        {errors[`subproduct_${skuIndex}_${subproductIndex}_deliveryDueDate`] && (
                          <span className="text-red-600 text-xs font-medium mt-1">{errors[`subproduct_${skuIndex}_${subproductIndex}_deliveryDueDate`]}</span>
                        )}
                      </div>
                    </div>

                    {/* Subproduct Image Upload */}
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        SUBPRODUCT IMAGE <span className="text-red-600">*</span>
                      </label>
                      <div className="flex items-start" style={{ gap: '24px' }}>
                        <div className="flex flex-col" style={{ flex: '0 0 auto' }}>
                          <div 
                            className={`border-2 border-dashed rounded-lg bg-white flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all ${
                              errors[`subproduct_${skuIndex}_${subproductIndex}_image`] ? 'border-red-600' : 'border-gray-300'
                            }`}
                            style={{ width: '160px', height: '120px', position: 'relative' }}
                            onClick={() => document.getElementById(`subproduct-image-${skuIndex}-${subproductIndex}`).click()}
                          >
                            {subproduct.imagePreview ? (
                              <img 
                                src={subproduct.imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-contain rounded-lg"
                              />
                            ) : (
                              <div className="text-center">
                                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            id={`subproduct-image-${skuIndex}-${subproductIndex}`}
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleSubproductImageChange(skuIndex, subproductIndex, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            required
                          />
                          {errors[`subproduct_${skuIndex}_${subproductIndex}_image`] && (
                            <span className="text-red-600 text-xs font-medium mt-1">{errors[`subproduct_${skuIndex}_${subproductIndex}_image`]}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500" style={{ paddingTop: '8px' }}>
                          <p className="font-medium text-gray-700 mb-1">Upload subproduct image</p>
                          <p>Supported formats: JPG, PNG, GIF</p>
                          <p>Maximum file size: 5MB</p>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                ))}

                {/* Add Subproduct Button - Only one button at the bottom, after all subproducts */}
                <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addSubproduct(skuIndex);
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
                    + Add Subproduct
                  </button>
                </div>
              </div>
            ) : (
              <div key="add-subproduct-initial" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addSubproduct(skuIndex);
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
                  + Add Subproduct
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Save and Add SKU Buttons */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={onSave}
          style={{
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            color: 'green',
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
        <button
          type="button"
          onClick={addSku}
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
          Add SKU
        </button>
      </div>
    </div>
  );
};

export default Step0;
