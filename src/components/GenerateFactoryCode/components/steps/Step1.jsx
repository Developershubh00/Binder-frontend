import { useEffect, useRef, useState } from 'react';

const Step1 = ({
  formData,
  errors,
  addProduct,
  removeProduct,
  addComponent,
  removeComponent,
  handleProductNameChange,
  handleComponentChange,
  handleComponentCuttingSizeChange,
  handleComponentSewSizeChange
}) => {
  const [expandedProducts, setExpandedProducts] = useState({});
  
  // Initialize: expand first product by default
  useEffect(() => {
    if (formData.products?.length > 0 && Object.keys(expandedProducts).length === 0) {
      setExpandedProducts({ 0: true });
    }
  }, [formData.products?.length]);

  const toggleProduct = (productIndex) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productIndex]: !prev[productIndex]
    }));
  };

  const handleSave = (productIndex) => {
    // Save functionality - can be implemented later
    console.log('Saving sub-product:', productIndex, formData.products[productIndex]);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-1 CUT & SEW SPEC</h2>
        <p className="text-base text-gray-500">Enter cutting and sewing specifications for sub-products and components</p>
      </div>

      {/* Sub-Products List at Top */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="text-lg font-semibold text-gray-800">SUB-PRODUCTS</h3>
          <button
            type="button"
            onClick={addProduct}
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
            + Add Sub-Product
          </button>
        </div>

        {/* Sub-Product Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {formData.products.map((product, productIndex) => (
            <div
              key={productIndex}
              style={{
                background: expandedProducts[productIndex] ? '#f9fafb' : '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => toggleProduct(productIndex)}
              onMouseEnter={(e) => {
                if (!expandedProducts[productIndex]) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!expandedProducts[productIndex]) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg
                    style={{
                      width: '20px',
                      height: '20px',
                      transform: expandedProducts[productIndex] ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      color: '#6b7280'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      Sub-Product #{productIndex + 1}
                    </h4>
                    <p className="text-xs text-gray-500" style={{ marginTop: '4px' }}>
                      {product.components?.length || 0} {product.components?.length === 1 ? 'component' : 'components'}
                    </p>
                  </div>
                </div>
                {formData.products.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProduct(productIndex);
                    }}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      color: '#374151',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
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
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Sub-Product Components */}
      {formData.products.map((product, productIndex) => (
        expandedProducts[productIndex] && (
          <div
            key={productIndex}
            className="bg-gray-50 rounded-xl border border-gray-200"
            style={{ padding: '32px', marginBottom: '24px' }}
          >
            <div style={{ marginBottom: '24px' }}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sub-Product #{productIndex + 1} - Components</h3>
            </div>

            {/* Components List */}
            {product.components.map((component, componentIndex) => (
              <div
                key={componentIndex}
                id={`component-${productIndex}-${componentIndex}`}
                className="bg-white rounded-lg border border-gray-200"
                style={{ padding: '20px', marginBottom: '16px' }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                  <h4 className="text-sm font-semibold text-gray-700">COMPONENT {component.srNo}</h4>
                  {product.components.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeComponent(productIndex, componentIndex)}
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        color: '#374151',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
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

                {/* Component Details */}
                <div className="flex flex-wrap items-start gap-4" style={{ marginBottom: '28px' }}>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      NAME <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={component.productComforter}
                      onChange={(e) => handleComponentChange(productIndex, componentIndex, 'productComforter', e.target.value)}
                      className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                        errors[`product_${productIndex}_component_${componentIndex}_productComforter`]
                          ? 'border-red-600'
                          : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                      }`}
                      style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                      onFocus={(e) => {
                        if (!errors[`product_${productIndex}_component_${componentIndex}_productComforter`]) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                      placeholder="e.g., Top Panel"
                      required
                    />
                    {errors[`product_${productIndex}_component_${componentIndex}_productComforter`] && (
                      <span className="text-red-600 text-xs mt-1 font-medium">
                        {errors[`product_${productIndex}_component_${componentIndex}_productComforter`]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      UNIT <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={component.unit}
                      onChange={(e) => handleComponentChange(productIndex, componentIndex, 'unit', e.target.value)}
                      className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                        errors[`product_${productIndex}_component_${componentIndex}_unit`]
                          ? 'border-red-600'
                          : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                      }`}
                      style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                      onFocus={(e) => {
                        if (!errors[`product_${productIndex}_component_${componentIndex}_unit`]) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                      required
                    >
                      <option value="">Select</option>
                      <option value="CM">CM</option>
                      <option value="KGS">KGS</option>
                    </select>
                    {errors[`product_${productIndex}_component_${componentIndex}_unit`] && (
                      <span className="text-red-600 text-xs mt-1 font-medium">
                        {errors[`product_${productIndex}_component_${componentIndex}_unit`]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      GSM <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={component.gsm || ''}
                      onChange={(e) => handleComponentChange(productIndex, componentIndex, 'gsm', e.target.value)}
                      className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                        errors[`product_${productIndex}_component_${componentIndex}_gsm`]
                          ? 'border-red-600'
                          : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                      }`}
                      style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                      onFocus={(e) => {
                        if (!errors[`product_${productIndex}_component_${componentIndex}_gsm`]) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                      placeholder="e.g., 200"
                      required
                    />
                    {errors[`product_${productIndex}_component_${componentIndex}_gsm`] && (
                      <span className="text-red-600 text-xs mt-1 font-medium">
                        {errors[`product_${productIndex}_component_${componentIndex}_gsm`]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      WASTAGE % <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={component.wastage}
                      onChange={(e) => handleComponentChange(productIndex, componentIndex, 'wastage', e.target.value)}
                      className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                        errors[`product_${productIndex}_component_${componentIndex}_wastage`]
                          ? 'border-red-600'
                          : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                      }`}
                      style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                      onFocus={(e) => {
                        if (!errors[`product_${productIndex}_component_${componentIndex}_wastage`]) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                      placeholder="e.g., 5"
                      required
                    />
                    {errors[`product_${productIndex}_component_${componentIndex}_wastage`] && (
                      <span className="text-red-600 text-xs mt-1 font-medium">
                        {errors[`product_${productIndex}_component_${componentIndex}_wastage`]}
                      </span>
                    )}
                  </div>

                </div>

                {/* Cutting Size */}
                <div style={{ marginBottom: '28px' }}>
                  <h4 className="text-sm font-semibold text-gray-800" style={{ marginBottom: '16px' }}>
                    CUTTING SIZE
                  </h4>
                  <div className="flex flex-wrap items-start gap-4">
                    {component.unit === 'KGS' ? (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          CONSUMPTION <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={component.cuttingSize.consumption || ''}
                          onChange={(e) => handleComponentCuttingSizeChange(productIndex, componentIndex, 'consumption', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`product_${productIndex}_component_${componentIndex}_cuttingConsumption`]
                              ? 'border-red-600'
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                          onFocus={(e) => {
                            if (!errors[`product_${productIndex}_component_${componentIndex}_cuttingConsumption`]) {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                          placeholder="e.g., 2.5"
                          required
                        />
                        {errors[`product_${productIndex}_component_${componentIndex}_cuttingConsumption`] && (
                          <span className="text-red-600 text-xs mt-1 font-medium">
                            {errors[`product_${productIndex}_component_${componentIndex}_cuttingConsumption`]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            value={component.cuttingSize.length}
                            onChange={(e) => handleComponentCuttingSizeChange(productIndex, componentIndex, 'length', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`product_${productIndex}_component_${componentIndex}_cuttingLength`]
                                ? 'border-red-600'
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`product_${productIndex}_component_${componentIndex}_cuttingLength`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., 24"
                            required
                          />
                          {errors[`product_${productIndex}_component_${componentIndex}_cuttingLength`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`product_${productIndex}_component_${componentIndex}_cuttingLength`]}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            value={component.cuttingSize.width}
                            onChange={(e) => handleComponentCuttingSizeChange(productIndex, componentIndex, 'width', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`]
                                ? 'border-red-600'
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., 18"
                            required
                          />
                          {errors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`]}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Sew Size */}
                <div style={{ marginTop: '8px' }}>
                  <h4 className="text-sm font-semibold text-gray-800" style={{ marginBottom: '16px' }}>
                    SEW SIZE
                  </h4>
                  <div className="flex flex-wrap items-start gap-4">
                    {component.unit === 'KGS' ? (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          CONSUMPTION <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={component.sewSize.consumption || ''}
                          onChange={(e) => handleComponentSewSizeChange(productIndex, componentIndex, 'consumption', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`product_${productIndex}_component_${componentIndex}_sewConsumption`]
                              ? 'border-red-600'
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                          onFocus={(e) => {
                            if (!errors[`product_${productIndex}_component_${componentIndex}_sewConsumption`]) {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                          placeholder="e.g., 2.3"
                          required
                        />
                        {errors[`product_${productIndex}_component_${componentIndex}_sewConsumption`] && (
                          <span className="text-red-600 text-xs mt-1 font-medium">
                            {errors[`product_${productIndex}_component_${componentIndex}_sewConsumption`]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            value={component.sewSize.length}
                            onChange={(e) => handleComponentSewSizeChange(productIndex, componentIndex, 'length', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`product_${productIndex}_component_${componentIndex}_sewLength`]
                                ? 'border-red-600'
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`product_${productIndex}_component_${componentIndex}_sewLength`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., 22"
                            required
                          />
                          {errors[`product_${productIndex}_component_${componentIndex}_sewLength`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`product_${productIndex}_component_${componentIndex}_sewLength`]}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            value={component.sewSize.width}
                            onChange={(e) => handleComponentSewSizeChange(productIndex, componentIndex, 'width', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`product_${productIndex}_component_${componentIndex}_sewWidth`]
                                ? 'border-red-600'
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`product_${productIndex}_component_${componentIndex}_sewWidth`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., 16"
                            required
                          />
                          {errors[`product_${productIndex}_component_${componentIndex}_sewWidth`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`product_${productIndex}_component_${componentIndex}_sewWidth`]}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Save and Add Component Buttons */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleSave(productIndex)}
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
              <button
                type="button"
                onClick={() => {
                  const currentLength = formData.products[productIndex]?.components?.length || 0;
                  addComponent(productIndex);
                  const newIndex = currentLength;
                  setTimeout(() => {
                    const element = document.getElementById(`component-${productIndex}-${newIndex}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }, 100);
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
                Add Component
              </button>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Step1;
