import { useEffect, useRef } from 'react';

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
  const prevProductsLengthRef = useRef(formData.products?.length || 0);
  const prevComponentsLengthRef = useRef({});
  const scrollToElement = (selector, retries = 0) => {
    if (retries > 10) return; // Max 10 retries
    
    const element = document.querySelector(selector);
    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } else {
      setTimeout(() => scrollToElement(selector, retries + 1), 50);
    }
  };

  useEffect(() => {
    const currentProductsLength = formData.products?.length || 0;
    if (prevProductsLengthRef.current > 0 && currentProductsLength > prevProductsLengthRef.current) {
      scrollToElement('[data-product-section]:last-child');
    }
    prevProductsLengthRef.current = currentProductsLength;
  }, [formData.products?.length]);

  useEffect(() => {
    formData.products?.forEach((product, productIndex) => {
      const currentComponentsLength = product.components?.length || 0;
      const prevLength = prevComponentsLengthRef.current[productIndex] || 0;
      
      if (prevLength > 0 && currentComponentsLength > prevLength) {
        scrollToElement(`[data-product-index="${productIndex}"]:last-child`);
      }
      prevComponentsLengthRef.current[productIndex] = currentComponentsLength;
    });
  }, [formData.products]);

  return (
<div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-1 CUT & SEW SPEC</h2>
          <p className="text-sm text-gray-600">Enter cutting and sewing specifications for components</p>
        </div>
      </div>
      
      {/* Products Section */}
      <div>
        {formData.products.map((product, productIndex) => (
          <div key={productIndex} id={`product-${productIndex}`} data-product-section className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Product Header - Product field removed */}
            {formData.products.length > 1 && (
              <div className="flex items-end gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => removeProduct(productIndex)}
                  className="border rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    padding: '8px 14px',
                    height: '42px'
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
            )}

            {/* Components Section for this Product */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 className="text-sm font-bold text-gray-800">COMPONENTS</h3>
              </div>

              {product.components.map((component, componentIndex) => (
                <div key={componentIndex} id={`component-${productIndex}-${componentIndex}`} data-product-index={productIndex} className="bg-white rounded-lg border border-gray-200" style={{ padding: '20px', marginBottom: '16px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                    <h4 className="text-sm font-semibold text-gray-700">COMPONENT {component.srNo}</h4>
                    {product.components.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeComponent(productIndex, componentIndex)}
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

                  {/* Component Details - All in one row */}
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
                        <option value="R METERS">R METERS</option>
                        <option value="CM">CM</option>
                        <option value="Inches">Inches</option>
                        <option value="Meter">Meter</option>
                        <option value="KGS">KGS</option>
                      </select>
                      {errors[`product_${productIndex}_component_${componentIndex}_unit`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`product_${productIndex}_component_${componentIndex}_unit`]}
                        </span>
                      )}
                    </div>

                    {/* WASTAGE field (always shown) */}
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

                    {/* GSM field (shown only when UNIT is R METERS) */}
                    {component.unit === 'R METERS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          GSM <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={component.gsm}
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
                    )}
                  </div>

                  {/* Cutting Size for this component */}
                  <div style={{ marginBottom: '28px' }}>
                    <h4 className="text-sm font-semibold text-gray-800" style={{ marginBottom: '16px' }}>
                      CUTTING SIZE
                    </h4>
                    <div className="flex flex-wrap items-start gap-4">
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
                    </div>
                  </div>

                  {/* Sew Size for this component */}
                  <div style={{ marginTop: '8px' }}>
                    <h4 className="text-sm font-semibold text-gray-800" style={{ marginBottom: '16px' }}>
                      SEW SIZE
                    </h4>
                    <div className="flex flex-wrap items-start gap-4">
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
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Component Button at Bottom */}
              <div className="mt-6 pt-6 border-t border-gray-200" style={{ marginTop: '24px', paddingTop: '24px' }}>
                <p className="text-sm text-gray-600 mb-3">Would you like to add more components?</p>
                <button
                  type="button"
                  onClick={() => {
                    const currentLength = formData.products[productIndex]?.components?.length || 0;
                    addComponent(productIndex);
                    const newIndex = currentLength;
                    const attemptScroll = (attempts = 0) => {
                      if (attempts > 30) return;
                      const element = document.getElementById(`component-${productIndex}-${newIndex}`);
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
                  + Add Component
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step1;
