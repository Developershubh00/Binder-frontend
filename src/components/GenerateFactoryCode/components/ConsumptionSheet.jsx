import React, { useMemo } from 'react';

/**
 * ConsumptionSheet Component
 *
 * Displays all IPCs, their products/subproducts, and components in order:
 * - IPC 1 → Product (main) → Component A, B, ... (each with full block: Raw Material row → Spec → Work Orders)
 * - IPC 1 → Subproduct (if any) → Component A, B, ... (same structure)
 * - IPC 2 → Product → Components...
 * - etc.
 *
 * Each component block shows:
 * - Row 1: IPC Code
 * - Row 2: Product (or Subproduct name)
 * - Row 3: Component name
 * - Row 4: Raw Material, Net CNS, Overage Qty, Gross Wastage, Gross CNS, Unit
 * - Row 5: Spec (Cut Size, Sew Size)
 * - Row 6: Work Orders
 */
const ConsumptionSheet = ({ formData = {} }) => {
  // Helper: Calculate overage qty from PO Qty and overage percentage
  const calculateOverageQty = (poQty, overagePercentage) => {
    const qty = parseFloat(poQty) || 0;
    const overage = parseFloat(overagePercentage?.replace('%', '')) || 0;
    return (qty * (1 + overage / 100)).toFixed(2);
  };

  // Helper: Calculate compound wastage from multiple wastage values
  // Formula: compoundFactor = (1 + w1/100) * (1 + w2/100) * (1 + w3/100)...
  // Gross Wastage % = (compoundFactor - 1) * 100
  const calculateCompoundWastage = (wastageList) => {
    if (!wastageList || wastageList.length === 0) return 0;

    const compoundFactor = wastageList.reduce((factor, w) => {
      const wastageVal = parseFloat(String(w).replace('%', '')) || 0;
      return factor * (1 + wastageVal / 100);
    }, 1);

    return ((compoundFactor - 1) * 100).toFixed(2);
  };

  // Helper: Calculate net consumption (sum of all consumptions)
  const calculateNetConsumption = (consumptions) => {
    if (!consumptions || consumptions.length === 0) return 0;
    return consumptions.reduce((sum, c) => sum + (parseFloat(c) || 0), 0).toFixed(3);
  };

  // Helper: Calculate gross CNS with compound wastage
  const calculateGrossCns = (overageQty, compoundWastage, netCns) => {
    const overage = parseFloat(overageQty) || 0;
    const wastageFactor = parseFloat(compoundWastage) || 0;
    const net = parseFloat(netCns) || 0;
    const compoundFactor = 1 + wastageFactor / 100;
    return (overage * compoundFactor * net).toFixed(3);
  };

  // Helper: Recursively extract ALL wastage values from an object (any key containing "wastage")
  const extractAllWastages = (obj, wastageList = []) => {
    if (!obj || typeof obj !== 'object') return wastageList;

    if (Array.isArray(obj)) {
      obj.forEach((item) => extractAllWastages(item, wastageList));
      return wastageList;
    }

    for (const key in obj) {
      const value = obj[key];
      const keyLower = key.toLowerCase();

      if (keyLower.includes('wastage') && value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object' && !Array.isArray(value)) {
          extractAllWastages(value, wastageList);
        } else {
          wastageList.push(value);
        }
      } else if (typeof value === 'object' && value !== null) {
        extractAllWastages(value, wastageList);
      }
    }

    return wastageList;
  };

  // Helper: Get raw materials for a component from stepData (Step-2)
  const getRawMaterialsForComponent = (componentName, stepData) => {
    return stepData?.rawMaterials?.filter((m) => m.componentName === componentName) || [];
  };

  // Helper: Get consumption materials for a component from stepData (Step-3)
  const getConsumptionMaterialsForComponent = (componentName, stepData) => {
    return stepData?.consumptionMaterials?.filter((m) => (m.components || '') === componentName) || [];
  };

  // Helper: Get artwork materials for a component from stepData (Step-4)
  const getArtworkMaterialsForComponent = (componentName, stepData) => {
    return stepData?.artworkMaterials?.filter((m) => (m.components || '') === componentName) || [];
  };

  // Helper: Get work orders for a component from Step-2 rawMaterials
  const getWorkOrdersForComponent = (componentName, stepData) => {
    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    const workOrders = [];

    rawMats.forEach((m) => {
      m.workOrders?.forEach((wo) => {
        if (wo.workOrder) {
          workOrders.push({
            workOrder: wo.workOrder,
            wastage: wo.wastage
          });
        }
      });
    });

    return workOrders;
  };

  // Helper: Get total net CNS for a component from Step-2, Step-3 AND Step-4
  const getTotalNetCNS = (componentName, stepData) => {
    const consumptions = [];

    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    rawMats.forEach((m) => {
      if (m.netConsumption) consumptions.push(m.netConsumption);
    });

    const consumptionMats = getConsumptionMaterialsForComponent(componentName, stepData);
    consumptionMats.forEach((m) => {
      if (m.netConsumption) consumptions.push(m.netConsumption);
    });

    const artworkMats = getArtworkMaterialsForComponent(componentName, stepData);
    artworkMats.forEach((m) => {
      if (m.netConsumption) consumptions.push(m.netConsumption);
    });

    return calculateNetConsumption(consumptions);
  };

  // Helper: Get ALL wastage values for compound calculation (Step-1, Step-2, Step-3, Step-4)
  const getAllWastagesForComponent = (componentName, stepData, productComponents) => {
    const wastageValues = [];

    // Step-1: Component-level wastage
    for (const comp of productComponents || []) {
      if (comp.productComforter === componentName && comp.wastage) {
        wastageValues.push(comp.wastage);
        break;
      }
    }

    // Step-2: Raw materials (includes work order wastages via extractAllWastages)
    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    rawMats.forEach((m) => extractAllWastages(m, wastageValues));

    // Step-3: Consumption materials (trims, accessories - velcroWastage, buttonWastage, etc.)
    const consumptionMats = getConsumptionMaterialsForComponent(componentName, stepData);
    consumptionMats.forEach((m) => extractAllWastages(m, wastageValues));

    // Step-4: Artwork materials
    const artworkMats = getArtworkMaterialsForComponent(componentName, stepData);
    artworkMats.forEach((m) => extractAllWastages(m, wastageValues));

    return wastageValues;
  };

  // Helper: Get unit for a component from rawMaterials
  const getUnitForComponent = (componentName, stepData) => {
    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    if (rawMats.length > 0 && rawMats[0].unit) {
      return rawMats[0].unit;
    }
    return 'CM';
  };

  // Helper: Get material types for a component from rawMaterials
  const getMaterialTypes = (componentName, stepData) => {
    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    return rawMats.filter((m) => m.materialType).map((m) => m.materialType);
  };

  // Helper: Get component details from Step-1 products (cutting size, sew size)
  const getComponentDetails = (componentName, productComponents) => {
    for (const comp of productComponents || []) {
      if (comp.productComforter === componentName) {
        return comp;
      }
    }
    return null;
  };

  // Build flat list: IPC → Product/Subproduct → Components (in form order)
  const allProducts = useMemo(() => {
    const products = [];
    formData.skus?.forEach((sku, skuIndex) => {
      // Main product(s) for this IPC
      sku.stepData?.products?.forEach((product, productIndex) => {
        products.push({
          type: 'main',
          skuIndex,
          productIndex,
          ipcCode: sku.ipcCode || `IPC-${skuIndex + 1}`,
          productName: product.name || sku.product || '',
          setOf: sku.setOf || '',
          poQty: sku.poQty,
          overagePercentage: sku.overagePercentage,
          isSubproduct: false,
          stepData: sku.stepData,
          productComponents: product.components || [],
          components: product.components || []
        });
      });
      // Subproducts for this IPC
      sku.subproducts?.forEach((subproduct, spIndex) => {
        subproduct.stepData?.products?.forEach((product, productIndex) => {
          products.push({
            type: 'subproduct',
            skuIndex,
            spIndex,
            productIndex,
            ipcCode: subproduct.ipcCode || `${(sku.ipcCode || `IPC-${skuIndex + 1}`).replace(/\/SP-?\d+$/i, '')}/SP-${spIndex + 1}`,
            productName: product.name || subproduct.subproduct || '',
            setOf: sku.setOf || '',
            poQty: subproduct.poQty,
            overagePercentage: subproduct.overagePercentage,
            isSubproduct: true,
            spLabel: `SP${spIndex + 1}`,
            stepData: subproduct.stepData,
            productComponents: product.components || [],
            components: product.components || []
          });
        });
      });
    });
    return products;
  }, [formData.skus]);

  // Component Row: full block from Raw Material row to Work Orders
  const ComponentRow = ({ componentName, component, product }) => {
    const stepData = product.stepData;
    const productComponents = product.productComponents || [];

    const unit = getUnitForComponent(componentName, stepData);
    const workOrders = getWorkOrdersForComponent(componentName, stepData);
    const netCns = getTotalNetCNS(componentName, stepData);
    const allWastages = getAllWastagesForComponent(componentName, stepData, productComponents);
    const materialTypes = getMaterialTypes(componentName, stepData);
    const componentDetails = component || getComponentDetails(componentName, productComponents);

    const compoundWastage = calculateCompoundWastage(allWastages);
    const overageQty = calculateOverageQty(product.poQty || 0, product.overagePercentage || '0');
    const grossCns = calculateGrossCns(overageQty, compoundWastage, netCns);

    return (
      <div className="w-full mb-8">
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm" style={{ padding: '16px' }}>
          {/* ROW 1: IPC */}
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-muted/40 to-muted/20">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">IPC Code</span>
            <span className="text-lg font-bold text-foreground">{product.ipcCode}</span>
          </div>

          {/* ROW 2: Product (or Subproduct name) + Set Of */}
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-muted/30 to-muted/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                {product.isSubproduct ? 'Subproduct' : 'Product'}
              </span>
              <span className="text-base font-semibold text-foreground">{product.productName || '-'}</span>
            </div>
            {product.setOf && (
              <span className="text-sm font-medium text-muted-foreground shrink-0">Set of {product.setOf}</span>
            )}
          </div>

          {/* ROW 3: Component */}
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Component</span>
            <span className="text-base font-bold text-primary">{componentName || '-'}</span>
          </div>

          {/* ROW 4: Raw Material, Net CNS, Overage Qty, Gross Wastage, Gross CNS, Unit */}
          <div className="grid grid-cols-6 gap-0 border-b border-border">
            <div className="px-6 py-5 border-r border-border bg-muted/5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Raw Material</span>
              <span className="text-sm text-foreground leading-relaxed">
                {materialTypes.length > 0 ? materialTypes.join(', ') : '-'}
              </span>
            </div>
            <div className="px-6 py-5 border-r border-border bg-muted/5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Net CNS</span>
              <span className="text-lg font-bold text-foreground">{netCns || '-'}</span>
            </div>
            <div className="px-6 py-5 border-r border-border bg-muted/5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Overage Qty</span>
              <span className="text-lg font-bold text-foreground">{overageQty}</span>
            </div>
            <div className="px-6 py-5 border-r border-border bg-muted/5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Gross Wastage</span>
              <span className="text-lg font-bold text-foreground">{compoundWastage}%</span>
            </div>
            <div className="px-6 py-5 border-r border-border bg-muted/5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Gross CNS</span>
              <span className="text-lg font-bold text-primary">{grossCns}</span>
            </div>
            <div className="px-6 py-5 bg-muted/5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Unit</span>
              <span className="text-lg font-bold text-foreground uppercase">{unit}</span>
            </div>
          </div>

          {/* ROW 5: SPEC */}
          <div className="border-b border-border bg-muted/5 px-6 py-5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4">Specification</span>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Cut Size</span>
                {String(componentDetails?.unit || unit || '').toUpperCase() === 'KGS' ? (
                  <span className="text-base font-medium text-foreground">
                    {componentDetails?.cuttingSize?.consumption ?? '-'}
                    <span className="text-muted-foreground font-normal"> kgs</span>
                  </span>
                ) : (
                  <span className="text-base font-medium text-foreground">
                    {componentDetails?.cuttingSize?.length || '-'} × {componentDetails?.cuttingSize?.width || '-'} cm
                  </span>
                )}
              </div>
              <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Sew Size</span>
                {String(componentDetails?.unit || unit || '').toUpperCase() === 'KGS' ? (
                  <span className="text-base font-medium text-foreground">
                    {componentDetails?.sewSize?.consumption ?? '-'}
                    <span className="text-muted-foreground font-normal"> kgs</span>
                  </span>
                ) : (
                  <span className="text-base font-medium text-foreground">
                    {componentDetails?.sewSize?.length || '-'} × {componentDetails?.sewSize?.width || '-'} cm
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ROW 6: WORK ORDERS */}
          <div className="bg-muted/5 px-6 py-5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4">Work Orders</span>
            <div className="px-3 pb-3">
              {workOrders.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {workOrders.map((wo, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-border rounded-lg px-5 py-3 min-w-[140px] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-xs font-medium text-muted-foreground block mb-1">WO {idx + 1}</span>
                      <span className="text-sm font-bold text-foreground">{wo.workOrder}</span>
                      {wo.wastage && (
                        <span className="text-xs text-muted-foreground block mt-1">Wastage: {wo.wastage}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {allProducts.length > 0 ? (
        allProducts.map((product, idx) => (
          <div key={idx}>
            {product.components.map((component, cIdx) =>
              component.productComforter ? (
                <ComponentRow
                  key={`${idx}-${cIdx}`}
                  componentName={component.productComforter}
                  component={component}
                  product={product}
                />
              ) : null
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-muted-foreground">No products found. Please complete previous steps first.</div>
      )}
    </div>
  );
};

export default ConsumptionSheet;
