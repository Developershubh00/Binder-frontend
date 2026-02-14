import React, { useMemo, useState, useEffect } from 'react';

/**
 * ConsumptionSheet Component
 *
 * Displays all IPCs, their products/subproducts, and components in order:
 * - IPC 1 → Product (main) → Component A, B, ... (each with full block: Raw Material row → Spec → Work Orders → Artwork)
 * - IPC 1 → Subproduct (if any) → Component A, B, ... (same structure)
 * - IPC 2 → Product → Components...
 * - Packaging (at product/IPC level)
 * - etc.
 *
 * Each component block shows:
 * - Row 1: IPC Code
 * - Row 2: Product (or Subproduct name)
 * - Row 3: Component name
 * - Row 4: Raw Material, Net CNS, Overage Qty, Gross Wastage, Gross CNS, Unit
 * - Row 5: Spec (Cut Size, Sew Size)
 * - Row 6: Work Orders
 * - Row 7: Artwork (after work orders, per component)
 */
const ConsumptionSheet = ({ formData = {} }) => {
  // Single layout on screen: only mobile OR desktop (avoids duplicate render)
  const [isMobileCns, setIsMobileCns] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    const set = () => setIsMobileCns(mql.matches);
    set();
    mql.addEventListener('change', set);
    return () => mql.removeEventListener('change', set);
  }, []);

  // Helper: Calculate overage qty from PO Qty and overage percentage
  const calculateOverageQty = (poQty, overagePercentage) => {
    const qty = parseFloat(poQty) || 0;
    const overage = parseFloat(overagePercentage?.replace('%', '')) || 0;
    return (qty * (1 + overage / 100)).toFixed(2);
  };

  // Helper: Calculate compound wastage from multiple wastage/surplus values
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

  // Helper: Calculate compound factor directly from wastage list (avoids precision loss from rounding)
  const calculateCompoundFactor = (wastageList) => {
    if (!wastageList || wastageList.length === 0) return 1;
    return wastageList.reduce((factor, w) => {
      const wastageVal = parseFloat(String(w).replace('%', '')) || 0;
      return factor * (1 + wastageVal / 100);
    }, 1);
  };

  // Helper: Calculate gross CNS per piece with compound wastage (using compound factor directly)
  const calculateGrossCnsPerPiece = (wastageList, netCns) => {
    const net = parseFloat(netCns) || 0;
    const compoundFactor = calculateCompoundFactor(wastageList);
    return (net * compoundFactor).toFixed(6); // Higher precision for per-piece calculation
  };

  // Helper: Calculate gross CNS for PO (gross CNS per piece × overage qty)
  const calculateGrossCns = (overageQty, wastageList, netCns) => {
    const overage = parseFloat(overageQty) || 0;
    const grossCnsPerPiece = parseFloat(calculateGrossCnsPerPiece(wastageList, netCns)) || 0;
    return (grossCnsPerPiece * overage).toFixed(3);
  };

  // Helper: Recursively extract ALL wastage values from an object (any key containing "wastage" or "surplus")
  const extractAllWastages = (obj, wastageList = []) => {
    if (!obj || typeof obj !== 'object') return wastageList;

    if (Array.isArray(obj)) {
      obj.forEach((item) => extractAllWastages(item, wastageList));
      return wastageList;
    }

    for (const key in obj) {
      const value = obj[key];
      const keyLower = key.toLowerCase();

      // Extract both wastage and surplus (surplus is treated like wastage for compounding)
      if ((keyLower.includes('wastage') || keyLower.includes('surplus')) && 
          value !== undefined && value !== null && value !== '') {
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

  // Helper: Extract artwork wastage/surplus — use recursive extraction so we pick up
  // generic (surplus, surplusForSection), category-specific (labelsBrandSurplus, rfidSurplus, etc.),
  // and any future fields for every artwork material (fixes 2nd+ materials showing 0).
  const extractArtworkWastageSurplus = (artworkMaterial) => {
    const values = [];
    extractAllWastages(artworkMaterial, values);
    return values;
  };

  // Helper: Extract packaging wastage/surplus based on packagingMaterialType
  const extractPackagingWastageSurplus = (packagingMaterial) => {
    const values = [];
    const type = packagingMaterial.packagingMaterialType;
    
    if (!type) return values;
    
    // Map packaging type to its specific wastage and surplus fields
    const typeFieldMap = {
      'CARTON BOX': { wastage: 'cartonBoxWastage', surplus: 'cartonBoxSurplus' },
      'CORNER PROTECTORS': { wastage: 'cornerProtectorWastage', surplus: 'cornerProtectorSurplus' },
      'EDGE PROTECTORS': { wastage: 'edgeProtectorWastage', surplus: 'edgeProtectorSurplus' },
      'FOAM INSERT': { wastage: 'foamInsertWastage', surplus: 'foamInsertSurplus' },
      'PALLET STRAP': { wastage: 'palletStrapWastage', surplus: 'palletStrapSurplus' },
      'POLYBAG~Bale': { wastage: 'polybagBaleWastage', surplus: 'polybagBaleSurplus' },
      'POLYBAG~POLYBAG-FLAP': { wastage: 'polybagPolybagFlapWastage', surplus: 'polybagPolybagFlapSurplus' },
      'SILICA GEL DESICCANT': { wastage: 'silicaGelDesiccantWastage', surplus: 'silicaGelDesiccantSurplus' },
      'SHRINK TAPE': { wastage: 'stretchWrapWastage', surplus: 'stretchWrapSurplus' },
      'TAPE': { wastage: 'tapeWastage', surplus: 'tapeSurplus' },
      'VOID~FILL': { wastage: 'voidFillWastage', surplus: 'voidFillSurplus' },
      // Default/Divider
      'DIVIDER': { wastage: 'dividerWastage', surplus: 'dividerSurplus' },
    };
    
    const fields = typeFieldMap[type] || typeFieldMap['DIVIDER'];
    if (fields) {
      if (packagingMaterial[fields.wastage]) values.push(packagingMaterial[fields.wastage]);
      if (packagingMaterial[fields.surplus]) values.push(packagingMaterial[fields.surplus]);
    }
    
    // Also extract from workOrders
    if (packagingMaterial.workOrders) {
      packagingMaterial.workOrders.forEach((wo) => {
        if (wo.wastage) values.push(wo.wastage);
      });
    }
    
    return values;
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

  // Helper: Get packaging materials for a product/IPC from stepData (Step-5)
  const getPackagingMaterialsForProduct = (stepData) => {
    return stepData?.packaging?.materials || [];
  };

  // Helper: Get merged IPCs/products from productSelection
  const getMergedIpcsProducts = (productSelection, formData) => {
    if (!productSelection || !Array.isArray(productSelection) || productSelection.length === 0) {
      return [];
    }

    const mergedItems = [];
    formData.skus?.forEach((sku) => {
      // Check if main IPC matches
      const ipcCode = sku.ipcCode || '';
      if (productSelection.includes(ipcCode)) {
        sku.stepData?.products?.forEach((product) => {
          mergedItems.push({
            ipcCode: ipcCode,
            productName: product.name || sku.product || '',
            isSubproduct: false
          });
        });
      }

      // Check subproducts
      sku.subproducts?.forEach((subproduct, spIndex) => {
        const subproductIpc = subproduct.ipcCode || `${ipcCode.replace(/\/SP-?\d+$/i, '')}/SP-${spIndex + 1}`;
        if (productSelection.includes(subproductIpc)) {
          subproduct.stepData?.products?.forEach((product) => {
            mergedItems.push({
              ipcCode: subproductIpc,
              productName: product.name || subproduct.subproduct || '',
              isSubproduct: true
            });
          });
        }
      });
    });

    return mergedItems;
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

  // Helper: Get total net CNS for a component from Step-2, Step-3 AND Step-4 (used only where full total is needed)
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

  // Helper: Get net CNS from raw materials only (Step-2) for the Raw Material row – isolated from consumption/artwork
  const getRawMaterialsOnlyNetCNS = (componentName, stepData) => {
    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    const consumptions = rawMats
      .filter((m) => m.netConsumption)
      .map((m) => m.netConsumption);
    return calculateNetConsumption(consumptions);
  };

  // Known wastage/surplus keys on a raw material (Step-2): foam, fiber, fabric, trim&accessory, yarn categories + work orders.
  // Explicit list so we never miss a category; extractAllWastages(m) still runs to catch any nested or future keys.
  const RAW_MATERIAL_WASTAGE_SURPLUS_KEYS = [
    'surplus', 'wastage',
    'fabricSurplus', 'fabricWastage',
    'foamSurplus', 'foamWastage', 'foamPeEpeSurplus', 'foamPeEpeWastage', 'foamPuSurplus', 'foamPuWastage',
    'foamRebondedSurplus', 'foamRebondedWastage', 'foamGelInfusedSurplus', 'foamGelInfusedWastage',
    'foamLatexSurplus', 'foamLatexWastage', 'foamMemorySurplus', 'foamMemoryWastage', 'foamHrSurplus', 'foamHrWastage',
    'fiberSurplus', 'fiberWastage',
    'stitchingThreadSurplus', 'stitchingThreadWastage',
  ];

  const pushIfPresent = (list, value) => {
    if (value !== undefined && value !== null && value !== '') list.push(value);
  };

  // Extract all wastage/surplus from one raw material: 5 categories (foam, fiber, fabric, trim&accessory, yarn) + work orders
  const extractRawMaterialWastagesSurplus = (material, wastageList) => {
    RAW_MATERIAL_WASTAGE_SURPLUS_KEYS.forEach((key) => {
      if (material[key] !== undefined) pushIfPresent(wastageList, material[key]);
    });
    (material.workOrders || []).forEach((wo) => extractAllWastages(wo, wastageList));
  };

  // Helper: Get wastage/surplus values for raw materials only (Step-1 component + Step-2 raw) for Raw Material row calculations.
  // Step-2: from each raw material, all nested forms (foam, fiber, fabric, trim&accessory, yarn) and work orders – no Step-3/Step-4.
  const getAllWastagesForRawMaterialsOnly = (componentName, stepData, productComponents) => {
    const wastageValues = [];

    // Step-1: Component-level wastage
    for (const comp of productComponents || []) {
      if (comp.productComforter === componentName && comp.wastage) {
        wastageValues.push(comp.wastage);
        break;
      }
    }

    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    rawMats.forEach((m) => extractRawMaterialWastagesSurplus(m, wastageValues));

    return wastageValues;
  };

  // Helper: Get ALL wastage/surplus values for compound calculation (Step-1, Step-2, Step-3, Step-4)
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

    // Step-4: Artwork materials (with category-specific surplus extraction)
    const artworkMats = getArtworkMaterialsForComponent(componentName, stepData);
    artworkMats.forEach((m) => {
      // Extract general wastage/surplus
      extractAllWastages(m, wastageValues);
      // Extract category-specific surplus
      const artworkWastageSurplus = extractArtworkWastageSurplus(m);
      wastageValues.push(...artworkWastageSurplus);
    });

    return wastageValues;
  };

  // Helper: Get ALL wastage/surplus values for packaging materials
  const getAllWastagesForPackaging = (stepData) => {
    const wastageValues = [];
    const packagingMats = getPackagingMaterialsForProduct(stepData);
    
    packagingMats.forEach((m) => {
      const packagingWastageSurplus = extractPackagingWastageSurplus(m);
      wastageValues.push(...packagingWastageSurplus);
    });
    
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

  // Helper: Format packaging type name (convert "CARTON BOX" to "Carton Box")
  const formatPackagingTypeName = (type) => {
    if (!type) return '-';
    // Convert to title case: "CARTON BOX" -> "Carton Box"
    return type
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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

  // Component Row: full block from Raw Material rows to Work Orders to Artwork
  const ComponentRow = ({ componentName, component, product }) => {
    const stepData = product.stepData;
    const productComponents = product.productComponents || [];

    const unit = getUnitForComponent(componentName, stepData);
    const workOrders = getWorkOrdersForComponent(componentName, stepData);
    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    const componentDetails = component || getComponentDetails(componentName, productComponents);
    const artworkMats = getArtworkMaterialsForComponent(componentName, stepData);
    const overageQty = calculateOverageQty(product.poQty || 0, product.overagePercentage || '0');

    let componentWastage = null;
    for (const comp of productComponents || []) {
      if (comp.productComforter === componentName && comp.wastage) {
        componentWastage = comp.wastage;
        break;
      }
    }

    const row4Cell = 'min-w-0 border-r border-border bg-muted/5 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(3n)]:border-r md:[&:nth-child(6n)]:border-r-0';
    const row4Last = 'min-w-0 border-border bg-muted/5';
    const desktopTableCell = { padding: '14px 18px' };
    const desktopHeaderCell = { padding: '12px 18px' };

    return (
      <div className="w-full min-w-0 mb-8">
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm min-w-0" style={{ padding: '20px' }}>
          {/* ROW 1: IPC */}
          <div className="border-b border-border bg-gradient-to-r from-muted/40 to-muted/20" style={{ padding: '16px 20px' }}>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">IPC Code</span>
            <span className="text-lg font-bold text-foreground">{product.ipcCode}</span>
          </div>

          {/* ROW 2: Product (or Subproduct name) + Set Of */}
          <div className="border-b border-border bg-gradient-to-r from-muted/30 to-muted/10 flex items-center justify-between gap-4" style={{ padding: '16px 20px' }}>
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
          <div className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent" style={{ padding: '16px 20px' }}>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Component</span>
            <span className="text-base font-bold text-primary">{componentName || '-'}</span>
          </div>

          {/* ROW 4: One row per raw material — only one of mobile or desktop layout */}
          <div className="border-b border-border min-w-0">
            {isMobileCns ? (
            /* Mobile: grouped cards */
            <div className="bg-muted/5" style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {rawMats.length > 0 ? (
                rawMats.map((material, mIdx) => {
                  const matNetCns = material.netConsumption != null ? parseFloat(material.netConsumption) : 0;
                  const matWastages = [];
                  if (componentWastage) matWastages.push(componentWastage);
                  extractRawMaterialWastagesSurplus(material, matWastages);
                  const matCompoundWastage = calculateCompoundWastage(matWastages);
                  const matGrossCns = calculateGrossCns(overageQty, matWastages, matNetCns);
                  const matUnit = (material.unit || unit || '-').toString().toUpperCase();
                  return (
                    <div key={mIdx} className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                      <div style={{ padding: '16px 18px' }}>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Material {mIdx + 1}</span>
                        <p className="mt-1.5 text-base font-semibold text-foreground leading-snug">{material.materialType || '–'}</p>
                      </div>
                      <div className="border-t border-border bg-muted/20" style={{ padding: '14px 18px' }}>
                        <div className="space-y-3">
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0">Net CNS</span>
                            <span className="text-sm font-semibold text-foreground tabular-nums">{matNetCns !== 0 ? matNetCns : '–'}</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0">Overage Qty</span>
                            <span className="text-sm font-semibold text-foreground tabular-nums">{overageQty}</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0">Gross Wastage</span>
                            <span className="text-sm font-semibold text-foreground tabular-nums">{matCompoundWastage}%</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0">Unit</span>
                            <span className="text-sm font-semibold text-foreground uppercase">{matUnit}</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3 pt-2 mt-1 border-t border-border/60">
                            <span className="text-xs font-semibold text-muted-foreground shrink-0">Gross CNS</span>
                            <span className="text-base font-bold text-primary tabular-nums">{matGrossCns}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-border/60" style={{ padding: '16px 18px' }}>
                    <p className="text-sm font-medium text-muted-foreground">No raw material</p>
                  </div>
                  <div className="text-sm text-muted-foreground" style={{ padding: '14px 18px' }}>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span>Net CNS</span><span>–</span></div>
                      <div className="flex justify-between"><span>Overage Qty</span><span>–</span></div>
                      <div className="flex justify-between"><span>Gross Wastage</span><span>–</span></div>
                      <div className="flex justify-between"><span>Unit</span><span>–</span></div>
                      <div className="flex justify-between pt-2 border-t border-border/60"><span className="font-medium">Gross CNS</span><span>–</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            ) : (
            /* Desktop: table with header row + data rows */
            <div className="min-w-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 min-w-0 border-b border-border bg-muted/30">
                <div className={row4Cell} style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Raw Material</span></div>
                <div className={row4Cell} style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Net CNS</span></div>
                <div className={row4Cell} style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overage Qty</span></div>
                <div className={row4Cell} style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gross Wastage</span></div>
                <div className={row4Cell} style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gross CNS</span></div>
                <div className={row4Last} style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit</span></div>
              </div>
              {rawMats.length > 0 ? (
                rawMats.map((material, mIdx) => {
                  const matNetCns = material.netConsumption != null ? parseFloat(material.netConsumption) : 0;
                  const matWastages = [];
                  if (componentWastage) matWastages.push(componentWastage);
                  extractRawMaterialWastagesSurplus(material, matWastages);
                  const matCompoundWastage = calculateCompoundWastage(matWastages);
                  const matGrossCns = calculateGrossCns(overageQty, matWastages, matNetCns);
                  const matUnit = material.unit || unit;
                  return (
                    <div key={mIdx} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 min-w-0 border-b border-border last:border-b-0">
                      <div className={row4Cell} style={desktopTableCell}><span className="text-sm text-foreground break-words">{material.materialType || '-'}</span></div>
                      <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{matNetCns || '-'}</span></div>
                      <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{overageQty}</span></div>
                      <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{matCompoundWastage}%</span></div>
                      <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-primary">{matGrossCns}</span></div>
                      <div className={row4Last} style={desktopTableCell}><span className="text-base font-bold text-foreground uppercase">{matUnit}</span></div>
                    </div>
                  );
                })
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 min-w-0 border-b border-border">
                  <div className={row4Cell} style={desktopTableCell}><span className="text-sm text-muted-foreground">-</span></div>
                  <div className={row4Cell} style={desktopTableCell}><span className="text-sm text-muted-foreground">-</span></div>
                  <div className={row4Cell} style={desktopTableCell}><span className="text-sm text-muted-foreground">-</span></div>
                  <div className={row4Cell} style={desktopTableCell}><span className="text-sm text-muted-foreground">-</span></div>
                  <div className={row4Cell} style={desktopTableCell}><span className="text-sm text-muted-foreground">-</span></div>
                  <div className={row4Last} style={desktopTableCell}><span className="text-sm text-muted-foreground">-</span></div>
                </div>
              )}
            </div>
            )}
          </div>

          {/* ROW 5: SPEC */}
          <div className="border-b border-border bg-muted/5" style={isMobileCns ? { padding: '18px 16px' } : { padding: '20px' }}>
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4">Specification</span>
            <div className="grid grid-cols-2" style={isMobileCns ? { gap: '16px' } : { gap: '20px' }}>
              <div className="bg-white rounded-lg border border-border shadow-sm" style={{ padding: isMobileCns ? '16px 18px' : '18px 20px' }}>
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
              <div className="bg-white rounded-lg border border-border shadow-sm" style={{ padding: isMobileCns ? '16px 18px' : '18px 20px' }}>
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

          {/* WORK ORDERS */}
          <div className="border-b border-border bg-muted/5" style={isMobileCns ? { padding: '18px 16px' } : { padding: '20px' }}>
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4">Work Orders</span>
            <div style={isMobileCns ? {} : { paddingBottom: '4px' }}>
              {workOrders.length > 0 ? (
                <div className="flex flex-wrap" style={{ gap: isMobileCns ? '14px' : '16px' }}>
                  {workOrders.map((wo, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-border rounded-lg min-w-[140px] shadow-sm hover:shadow-md transition-shadow"
                      style={isMobileCns ? { padding: '14px 18px' } : { padding: '16px 20px' }}
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

          {/* ARTWORK SECTION – One row per artwork, original 5 columns only */}
          {artworkMats.length > 0 && (
            <div className="border-b border-border bg-muted/5 min-w-0" style={isMobileCns ? { padding: '18px 16px' } : { padding: '20px' }}>
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4">Artwork</span>
              {isMobileCns ? (
              /* Mobile: grouped cards */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {artworkMats.map((artwork, idx) => {
                  const artworkNetCns = parseFloat(artwork.netConsumption) || 0;
                  const artworkWastageSurplus = extractArtworkWastageSurplus(artwork);
                  const artworkCompoundWastage = calculateCompoundWastage(artworkWastageSurplus);
                  const artworkGrossCns = calculateGrossCns(overageQty, artworkWastageSurplus, artworkNetCns);
                  const artUnit = (artwork.unit || '-').toString().toUpperCase();
                  return (
                    <div key={idx} className="rounded-xl border border-border bg-white shadow-sm overflow-hidden min-w-0">
                      <div style={{ padding: '16px 18px' }}>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Artwork {idx + 1}</span>
                        <p className="mt-1.5 text-base font-semibold text-foreground leading-snug break-words">{artwork.materialDescription || '–'}</p>
                      </div>
                      <div className="border-t border-border bg-muted/20" style={{ padding: '14px 18px' }}>
                        <div className="space-y-3">
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0">Net CNS</span>
                            <span className="text-sm font-semibold text-foreground tabular-nums">{artworkNetCns || '–'}</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0">Wastage/Surplus</span>
                            <span className="text-sm font-semibold text-foreground tabular-nums">{artworkCompoundWastage}%</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0">Unit</span>
                            <span className="text-sm font-semibold text-foreground uppercase">{artUnit}</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3 pt-2 mt-1 border-t border-border/60">
                            <span className="text-xs font-semibold text-muted-foreground shrink-0">Gross CNS</span>
                            <span className="text-base font-bold text-primary tabular-nums">{artworkGrossCns}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              ) : (
              /* Desktop: table with header row + data rows */
              <div className="min-w-0 rounded-lg border border-border overflow-hidden bg-card">
                <div className="grid grid-cols-2 sm:grid-cols-5 min-w-0 border-b border-border bg-muted/30">
                  <div className="min-w-0 border-r border-border [&:nth-child(5n)]:border-r-0" style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Material Description</span></div>
                  <div className="min-w-0 border-r border-border [&:nth-child(5n)]:border-r-0" style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Net CNS</span></div>
                  <div className="min-w-0 border-r border-border [&:nth-child(5n)]:border-r-0" style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Wastage/Surplus</span></div>
                  <div className="min-w-0 border-r border-border [&:nth-child(5n)]:border-r-0" style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gross CNS</span></div>
                  <div className="min-w-0 border-border" style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit</span></div>
                </div>
                {artworkMats.map((artwork, idx) => {
                  const artworkNetCns = parseFloat(artwork.netConsumption) || 0;
                  const artworkWastageSurplus = extractArtworkWastageSurplus(artwork);
                  const artworkCompoundWastage = calculateCompoundWastage(artworkWastageSurplus);
                  const artworkGrossCns = calculateGrossCns(overageQty, artworkWastageSurplus, artworkNetCns);
                  const artCellClass = 'min-w-0 border-r border-border [&:nth-child(5n)]:border-r-0 bg-muted/5';
                  const artLastClass = 'min-w-0 border-border bg-muted/5';
                  return (
                    <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 min-w-0 border-b border-border last:border-b-0">
                      <div className={artCellClass} style={desktopTableCell}><span className="text-sm text-foreground break-words">{artwork.materialDescription || '-'}</span></div>
                      <div className={artCellClass} style={desktopTableCell}><span className="text-base font-bold text-foreground">{artworkNetCns || '-'}</span></div>
                      <div className={artCellClass} style={desktopTableCell}><span className="text-base font-bold text-foreground">{artworkCompoundWastage}%</span></div>
                      <div className={artCellClass} style={desktopTableCell}><span className="text-base font-bold text-primary">{artworkGrossCns}</span></div>
                      <div className={artLastClass} style={desktopTableCell}><span className="text-base font-bold text-foreground uppercase">{artwork.unit || '-'}</span></div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Packaging Row: Display at product/IPC level
  const PackagingRow = ({ product, formData, isMobile }) => {
    const stepData = product.stepData;
    const packagingMats = getPackagingMaterialsForProduct(stepData);

    if (!packagingMats || packagingMats.length === 0) return null;

    const packagingType = stepData?.packaging?.toBeShipped || '';
    const isMerged = packagingType.toLowerCase() === 'merged';
    const isStandalone = packagingType.toLowerCase() === 'standalone';
    
    // Get merged IPCs/products if merged
    const productSelection = stepData?.packaging?.productSelection || [];
    const mergedItems = isMerged ? getMergedIpcsProducts(productSelection, formData) : [];

    return (
      <div className="w-full min-w-0 mb-8">
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm min-w-0" style={{ padding: isMobile ? '18px 16px' : '20px' }}>
          {/* ROW 1: IPC(s) */}
          <div className="px-4 sm:px-6 py-4 border-b border-border bg-gradient-to-r from-muted/40 to-muted/20">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              {isMerged ? 'IPC Codes' : 'IPC Code'}
            </span>
            {isMerged && mergedItems.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {mergedItems.map((item, idx) => (
                  <span key={idx} className="text-lg font-bold text-foreground bg-muted/30 px-3 py-1 rounded">
                    {item.ipcCode}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-lg font-bold text-foreground">{product.ipcCode}</span>
            )}
          </div>

          {/* ROW 2: Product(s) */}
          <div className="px-4 sm:px-6 py-4 border-b border-border bg-gradient-to-r from-muted/30 to-muted/10 flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                {isMerged ? 'Products' : (product.isSubproduct ? 'Subproduct' : 'Product')}
              </span>
              {isMerged && mergedItems.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {mergedItems.map((item, idx) => (
                    <span key={idx} className="text-base font-semibold text-foreground bg-muted/20 px-3 py-1 rounded">
                      {item.ipcCode}: {item.productName || '-'}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-base font-semibold text-foreground">{product.productName || '-'}</span>
              )}
            </div>
            {(isMerged || isStandalone) && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                isMerged ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {isMerged ? 'MERGED' : 'STANDALONE'}
              </span>
            )}
          </div>

          {/* PACKAGING SECTION */}
          <div className="bg-muted/5" style={isMobile ? { padding: '18px 16px' } : { padding: '20px' }}>
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4">Packaging</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
              {packagingMats.map((packaging, idx) => {
                const packagingWastageSurplus = extractPackagingWastageSurplus(packaging);
                const packagingCompoundWastage = calculateCompoundWastage(packagingWastageSurplus);
                const packagingTypeName = formatPackagingTypeName(packaging.packagingMaterialType);
                
                return (
                  <div
                    key={idx}
                    className="bg-white border border-border rounded-lg shadow-sm"
                    style={{ padding: isMobile ? '16px 18px' : '18px 20px' }}
                  >
                    <div className="grid grid-cols-2" style={{ gap: isMobile ? '16px' : '20px' }}>
                      <div style={isMobile ? {} : { padding: '4px 0' }}>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Packaging Type</span>
                        <span className="text-base font-bold text-foreground">{packagingTypeName}</span>
                      </div>
                      <div style={isMobile ? {} : { padding: '4px 0' }}>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Wastage/Surplus</span>
                        <span className="text-base font-bold text-foreground">{packagingCompoundWastage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full min-w-0 overflow-y-auto overflow-x-hidden"
      style={{
        maxHeight: 'calc(100vh - 250px)',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        overscrollBehavior: 'contain',
      }}
    >
      {allProducts.length > 0 ? (
        (() => {
          const shownMergedKeys = new Set();
          return allProducts.map((product, idx) => {
            const stepData = product.stepData;
            const packagingType = stepData?.packaging?.toBeShipped || '';
            const isMerged = packagingType.toLowerCase() === 'merged';
            const productSelection = stepData?.packaging?.productSelection || [];
            const mergedKey = Array.isArray(productSelection) ? productSelection.sort().join(',') : String(productSelection);
            
            // For merged: only show packaging once per merged group
            // For standalone: show packaging for each product
            let shouldShowPackaging = true;
            if (isMerged && mergedKey) {
              if (shownMergedKeys.has(mergedKey)) {
                shouldShowPackaging = false;
              } else {
                shownMergedKeys.add(mergedKey);
              }
            }

            return (
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
                {/* Packaging section at product/IPC level */}
                {shouldShowPackaging && <PackagingRow product={product} formData={formData} isMobile={isMobileCns} />}
              </div>
            );
          });
        })()
      ) : (
        <div className="text-center py-12 text-muted-foreground">No products found. Please complete previous steps first.</div>
      )}
    </div>
  );
};

export default ConsumptionSheet;
