import React from 'react';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';

/**
 * ConsumptionSheet Component
 * 
 * A structured form for tracking material consumption, wastage, and related details
 * for products and sub-products. Data will be fetched from backend and passed via props.
 */
const ConsumptionSheet = ({ 
  productData = {},
  subProductData = {},
  onDataChange
}) => {
  // Default structure for component tables
  const defaultComponentRows = [
    { 
      srNumber: 1, 
      rawMaterial: '', // Full row RAW MATERIAL field
      netCns: '', 
      overageQty: '', 
      grossWastage: '', 
      grossCns: '', 
      unit: '',
      // SPEC row fields
      spec: '',
      netCnsSpec: '',
      // WORK ORDER row fields
      workOrder: '',
      netCnsWorkOrder: ''
    },
    { 
      srNumber: 2, 
      rawMaterial: '', // Full row RAW MATERIAL field
      netCns: '', 
      overageQty: '', 
      grossWastage: '', 
      grossCns: '', 
      unit: '',
      // SPEC row fields
      spec: '',
      netCnsSpec: '',
      // WORK ORDER row fields
      workOrder: '',
      netCnsWorkOrder: ''
    }
  ];

  // Initialize data structure
  const product = {
    ipcNumber: productData?.ipcNumber || '',
    productName: productData?.productName || '',
    componentA: productData?.componentA || defaultComponentRows.map(r => ({ ...r })),
    componentB: productData?.componentB || defaultComponentRows.map(r => ({ ...r }))
  };

  const subProduct = {
    subProductName: subProductData?.subProductName || '',
    componentA: subProductData?.componentA || defaultComponentRows.map(r => ({ ...r })),
    componentB: subProductData?.componentB || defaultComponentRows.map(r => ({ ...r }))
  };

  const handleProductChange = (field, value) => {
    const updated = { ...product, [field]: value };
    if (onDataChange) {
      onDataChange({ product: updated, subProduct });
    }
  };

  const handleSubProductChange = (field, value) => {
    const updated = { ...subProduct, [field]: value };
    if (onDataChange) {
      onDataChange({ product, subProduct: updated });
    }
  };

  const handleComponentChange = (section, componentType, rowIndex, field, value) => {
    const sectionData = section === 'product' ? product : subProduct;
    const component = [...sectionData[componentType]];
    component[rowIndex] = { ...component[rowIndex], [field]: value };
    
    const updated = { ...sectionData, [componentType]: component };
    
    if (section === 'product') {
      handleProductChange(componentType, component);
    } else {
      handleSubProductChange(componentType, component);
    }
  };

  // Component Table Component
  const ComponentTable = ({ 
    componentLabel, 
    componentData, 
    section, 
    componentType 
  }) => {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Table Container */}
          <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-0 bg-muted/60 border-b-2 border-border">
              <div className="col-span-1 px-4 py-3 border-r-2 border-border">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">SR#</span>
              </div>
              <div className="col-span-2 px-4 py-3 border-r-2 border-border">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">RAW MATERIAL</span>
              </div>
              <div className="col-span-1 px-4 py-3 border-r-2 border-border">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">NET CNS</span>
              </div>
              <div className="col-span-1 px-4 py-3 border-r-2 border-border">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">OVERAGE QTY</span>
              </div>
              <div className="col-span-1 px-4 py-3 border-r-2 border-border">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">GROSS WASTAGE</span>
              </div>
              <div className="col-span-1 px-4 py-3 border-r-2 border-border">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">GROSS CNS</span>
              </div>
              <div className="col-span-1 px-4 py-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">UNIT</span>
              </div>
            </div>

            {/* Table Body */}
            {componentData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Row 1: Full row for SR# with all columns */}
                <div className="grid grid-cols-8 gap-0 border-b border-border/50">
                  <div className="col-span-1 px-4 py-3 border-r-2 border-border bg-muted/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-foreground">{row.srNumber}</span>
                  </div>
                  <div className="col-span-2 px-4 py-2.5 border-r-2 border-border bg-muted/20">
                    <Input
                      type="text"
                      value={row.rawMaterial || ''}
                      onChange={(e) => handleComponentChange(section, componentType, rowIndex, 'rawMaterial', e.target.value)}
                      className="h-9 text-sm"
                      placeholder=""
                    />
                  </div>
                  <div className="col-span-1 px-4 py-2.5 border-r-2 border-border">
                    <Input
                      type="text"
                      value={row.netCns || ''}
                      onChange={(e) => handleComponentChange(section, componentType, rowIndex, 'netCns', e.target.value)}
                      className="h-9 text-sm"
                      placeholder=""
                    />
                  </div>
                  <div className="col-span-1 px-4 py-2.5 border-r-2 border-border">
                    <Input
                      type="text"
                      value={row.overageQty || ''}
                      onChange={(e) => handleComponentChange(section, componentType, rowIndex, 'overageQty', e.target.value)}
                      className="h-9 text-sm"
                      placeholder=""
                    />
                  </div>
                  <div className="col-span-1 px-4 py-2.5 border-r-2 border-border">
                    <Input
                      type="text"
                      value={row.grossWastage || ''}
                      onChange={(e) => handleComponentChange(section, componentType, rowIndex, 'grossWastage', e.target.value)}
                      className="h-9 text-sm"
                      placeholder=""
                    />
                  </div>
                  <div className="col-span-1 px-4 py-2.5 border-r-2 border-border">
                    <Input
                      type="text"
                      value={row.grossCns || ''}
                      onChange={(e) => handleComponentChange(section, componentType, rowIndex, 'grossCns', e.target.value)}
                      className="h-9 text-sm"
                      placeholder=""
                    />
                  </div>
                  <div className="col-span-1 px-4 py-2.5">
                    <Input
                      type="text"
                      value={row.unit || ''}
                      onChange={(e) => handleComponentChange(section, componentType, rowIndex, 'unit', e.target.value)}
                      className="h-9 text-sm"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Row 2: SPEC row with label only and NET CNS */}
                <div className="grid grid-cols-8 gap-0 border-b border-border/50">
                  <div className="col-span-1 px-4 py-3 border-r-2 border-border bg-muted/10"></div>
                  <div className="col-span-2 px-4 py-3 border-r-2 border-border bg-muted/10">
                    <span className="text-xs font-bold text-foreground whitespace-nowrap">SPEC</span>
                  </div>
                  <div className="col-span-1 px-4 py-2.5 border-r-2 border-border">
                    <Input
                      type="text"
                      value={row.netCnsSpec || ''}
                      onChange={(e) => handleComponentChange(section, componentType, rowIndex, 'netCnsSpec', e.target.value)}
                      className="h-9 text-sm"
                      placeholder=""
                    />
                  </div>
                  <div className="col-span-4"></div>
                </div>

                {/* Row 3: WORK ORDER row with label only and NET CNS */}
                <div className="grid grid-cols-8 gap-0 border-b-2 border-border last:border-b-0">
                  <div className="col-span-1 px-4 py-3 border-r-2 border-border bg-muted/10"></div>
                  <div className="col-span-2 px-4 py-3 border-r-2 border-border bg-muted/10">
                    <span className="text-xs font-bold text-foreground whitespace-nowrap">WORK ORDER</span>
                  </div>
                  <div className="col-span-1 px-4 py-2.5 border-r-2 border-border">
                    <Input
                      type="text"
                      value={row.netCnsWorkOrder || ''}
                      onChange={(e) => handleComponentChange(section, componentType, rowIndex, 'netCnsWorkOrder', e.target.value)}
                      className="h-9 text-sm"
                      placeholder=""
                    />
                  </div>
                  <div className="col-span-4"></div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Product Section
  const ProductSection = () => (
    <div className="border-2 border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Product Header */}
        <div className="flex flex-wrap gap-6 items-start">
          <Field label="IPC#" width="md">
            <Input
              type="text"
              value={product.ipcNumber}
              onChange={(e) => handleProductChange('ipcNumber', e.target.value)}
              placeholder="Enter IPC number"
            />
          </Field>
          <Field label="PRODUCT" width="md">
            <Input
              type="text"
              value={product.productName}
              onChange={(e) => handleProductChange('productName', e.target.value)}
              placeholder="Enter product name"
            />
          </Field>
        </div>

        {/* Component Tables */}
        <div className="space-y-6">
          {/* Component A */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground/90">
                COMPONENT <span className="text-foreground">A</span>
              </h3>
            </div>
            <ComponentTable
              componentLabel="A"
              componentData={product.componentA}
              section="product"
              componentType="componentA"
            />
          </div>

          {/* Component B */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground/90">
                COMPONENT <span className="text-foreground">B</span>
              </h3>
            </div>
            <ComponentTable
              componentLabel="B"
              componentData={product.componentB}
              section="product"
              componentType="componentB"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Sub-Product Section
  const SubProductSection = () => (
    <div className="border-2 border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Sub-Product Header */}
        <div className="flex flex-wrap gap-6 items-start">
          <Field label="SUB-PRODUCT" width="md">
            <Input
              type="text"
              value={subProduct.subProductName}
              onChange={(e) => handleSubProductChange('subProductName', e.target.value)}
              placeholder="Enter sub-product name"
            />
          </Field>
        </div>

        {/* Component Tables */}
        <div className="space-y-6">
          {/* Component A */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground/90">
                COMPONENT <span className="text-foreground">A</span>
              </h3>
            </div>
            <ComponentTable
              componentLabel="A"
              componentData={subProduct.componentA}
              section="subProduct"
              componentType="componentA"
            />
          </div>

          {/* Component B */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-foreground/90">
                COMPONENT <span className="text-foreground">B</span>
              </h3>
            </div>
            <ComponentTable
              componentLabel="B"
              componentData={subProduct.componentB}
              section="subProduct"
              componentType="componentB"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
          CONSUMPTION SHEET
        </h2>
        <p className="text-sm text-muted-foreground">
          Track material consumption, wastage, and related details
        </p>
      </div>

      {/* Product Section */}
      <ProductSection />

      {/* Sub-Product Section */}
      <SubProductSection />
    </div>
  );
};

export default ConsumptionSheet;
