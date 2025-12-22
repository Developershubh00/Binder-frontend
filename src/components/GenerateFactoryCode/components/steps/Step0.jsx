const Step0 = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>PART-0 PRODUCT SPEC</h2>
        <p className="text-base text-gray-500">Enter product specification details</p>
      </div>
      
      {/* Form Container */}
      <div className="bg-gray-50 rounded-xl" style={{ padding: '32px', border: '1px solid #e5e7eb' }}>
        {/* Row 1: SKU, Product, PO QTY */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', marginBottom: '24px' }}>
          {/* SKU / ITEM NO */}
          <div className="flex flex-col">
            <label htmlFor="sku" className="text-sm font-semibold text-gray-700 mb-2">
              SKU / ITEM NO. <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.sku 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.sku) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., SKU-001"
              required
            />
            {errors.sku && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.sku}</span>
            )}
          </div>

          {/* PRODUCT */}
          <div className="flex flex-col">
            <label htmlFor="product" className="text-sm font-semibold text-gray-700 mb-2">
              PRODUCT <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.product 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.product) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., Cushion"
              required
            />
            {errors.product && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.product}</span>
            )}
          </div>

          {/* PO QTY */}
          <div className="flex flex-col">
            <label htmlFor="poQty" className="text-sm font-semibold text-gray-700 mb-2">
              PO QTY <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="poQty"
              name="poQty"
              value={formData.poQty}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.poQty 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.poQty) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., 1000"
              required
            />
            {errors.poQty && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.poQty}</span>
            )}
          </div>
        </div>

        {/* Row 2: Overage %, Overage Qty, Delivery Date */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', marginBottom: '24px' }}>
          {/* OVERAGE (%AGE) */}
          <div className="flex flex-col">
            <label htmlFor="overagePercentage" className="text-sm font-semibold text-gray-700 mb-2">
              OVERAGE (%) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="overagePercentage"
              name="overagePercentage"
              value={formData.overagePercentage}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.overagePercentage 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.overagePercentage) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., 5%"
              required
            />
            {errors.overagePercentage && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.overagePercentage}</span>
            )}
          </div>

          {/* OVERAGE (QTY) */}
          <div className="flex flex-col">
            <label htmlFor="overageQty" className="text-sm font-semibold text-gray-700 mb-2">
              OVERAGE (QTY) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="overageQty"
              name="overageQty"
              value={formData.overageQty}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.overageQty 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.overageQty) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., 50"
              required
            />
            {errors.overageQty && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.overageQty}</span>
            )}
          </div>

          {/* DELIVERY DUE DATE */}
          <div className="flex flex-col">
            <label htmlFor="deliveryDueDate" className="text-sm font-semibold text-gray-700 mb-2">
              DELIVERY DUE DATE <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="deliveryDueDate"
              name="deliveryDueDate"
              value={formData.deliveryDueDate}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.deliveryDueDate 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.deliveryDueDate) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              required
            />
            {errors.deliveryDueDate && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.deliveryDueDate}</span>
            )}
          </div>
        </div>

        {/* Row 3: Image Upload */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          <label htmlFor="image" className="text-sm font-semibold text-gray-700 mb-2 block">
            PRODUCT IMAGE <span className="text-red-600">*</span>
          </label>
          <div className="flex items-start" style={{ gap: '24px' }}>
            <div className="flex flex-col" style={{ flex: '0 0 auto' }}>
              <div 
                className={`border-2 border-dashed rounded-lg bg-white flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all ${
                  errors.image ? 'border-red-600' : 'border-gray-300'
                }`}
                style={{ width: '160px', height: '120px', position: 'relative' }}
                onClick={() => document.getElementById('image').click()}
              >
                {formData.imagePreview ? (
                  <img 
                    src={formData.imagePreview} 
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
                id="image"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
                required
              />
              {errors.image && (
                <span className="text-red-600 text-xs font-medium mt-1">{errors.image}</span>
              )}
            </div>
            <div className="text-sm text-gray-500" style={{ paddingTop: '8px' }}>
              <p className="font-medium text-gray-700 mb-1">Upload product image</p>
              <p>Supported formats: JPG, PNG, GIF</p>
              <p>Maximum file size: 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step0;

