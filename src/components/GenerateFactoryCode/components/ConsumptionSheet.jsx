import React, { useMemo, useState, useEffect } from 'react';
import { TRIM_ACCESSORY_SCHEMAS } from '@/utils/validationSchemas';

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

  // Helper: Sum wastage/surplus values without compounding
  const calculateTotalWastage = (wastageList) => {
    if (!wastageList || wastageList.length === 0) return '0.00';
    const total = wastageList.reduce((sum, w) => {
      const wastageVal = parseFloat(String(w).replace('%', '')) || 0;
      return sum + wastageVal;
    }, 0);
    return total.toFixed(2);
  };

  // Helper: Sum wastage/surplus values (no compounding)
  // const calculateTotalWastage = (wastageList) => {
  //   if (!wastageList || wastageList.length === 0) return '0.00';
  //   const total = wastageList.reduce((sum, w) => {
  //     const wastageVal = parseFloat(String(w).replace('%', '')) || 0;
  //     return sum + wastageVal;
  //   }, 0);
  //   return total.toFixed(2);
  // };

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

  // Helper: Determine if a raw material is complete enough to appear in CNS sheet
  const isRawMaterialCompleteForCns = (material) => {
    if (!material) return false;
    const materialType = material.materialType?.toString().trim();
    const materialDescription = material.materialDescription?.toString().trim();
    const netConsumption = material.netConsumption?.toString().trim();
    const unit = material.unit?.toString().trim();
    return Boolean(materialType && materialDescription && netConsumption && unit);
  };

  // Helper: Get raw materials for a component from stepData (Step-2)
  const getRawMaterialsForComponent = (componentName, stepData) => {
    return (
      stepData?.rawMaterials?.filter(
        (m) => m.componentName === componentName && isRawMaterialCompleteForCns(m)
      ) || []
    );
  };

  const normalizeComponentName = (value) =>
    String(value || '').trim().toLowerCase();

  const componentMatches = (componentValue, componentName) => {
    if (!componentValue) return false;
    if (Array.isArray(componentValue)) {
      return componentValue.some((v) => normalizeComponentName(v) === normalizeComponentName(componentName));
    }
    return normalizeComponentName(componentValue) === normalizeComponentName(componentName);
  };

  // Helper: Get consumption materials for a component from stepData (Step-3)
  const getConsumptionMaterialsForComponent = (componentName, stepData, productComponents = []) => {
    const materials = stepData?.consumptionMaterials || [];
    return materials.filter((m) => {
      const comp = m?.components;
      if (componentMatches(comp, componentName)) return true;
      // If component isn't set and product has only one component, attach it
      if (!comp && (productComponents || []).length === 1) return true;
      return false;
    });
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
  const getTotalNetCNS = (componentName, stepData, productComponents) => {
    const consumptions = [];

    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    rawMats.forEach((m) => {
      if (m.netConsumption) consumptions.push(m.netConsumption);
    });

    const consumptionMats = getConsumptionMaterialsForComponent(componentName, stepData, productComponents);
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

  // Human-readable labels for raw material wastage/surplus keys (for trace/breakdown)
  const RAW_MATERIAL_WASTAGE_LABELS = {
    surplus: 'Surplus',
    wastage: 'Wastage',
    fabricSurplus: 'Fabric surplus',
    fabricWastage: 'Fabric wastage',
    foamSurplus: 'Foam surplus',
    foamWastage: 'Foam wastage',
    foamPeEpeSurplus: 'Foam PE/EPE surplus',
    foamPeEpeWastage: 'Foam PE/EPE wastage',
    foamPuSurplus: 'Foam PU surplus',
    foamPuWastage: 'Foam PU wastage',
    foamRebondedSurplus: 'Foam rebonded surplus',
    foamRebondedWastage: 'Foam rebonded wastage',
    foamGelInfusedSurplus: 'Foam gel infused surplus',
    foamGelInfusedWastage: 'Foam gel infused wastage',
    foamLatexSurplus: 'Foam latex surplus',
    foamLatexWastage: 'Foam latex wastage',
    foamMemorySurplus: 'Foam memory surplus',
    foamMemoryWastage: 'Foam memory wastage',
    foamHrSurplus: 'Foam HR surplus',
    foamHrWastage: 'Foam HR wastage',
    fiberSurplus: 'Fiber surplus',
    fiberWastage: 'Fiber wastage',
    stitchingThreadSurplus: 'Stitching thread surplus',
    stitchingThreadWastage: 'Stitching thread wastage',
  };

  const formatWastageLabel = (key) => {
    if (RAW_MATERIAL_WASTAGE_LABELS[key]) return RAW_MATERIAL_WASTAGE_LABELS[key];
    return String(key)
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const getTrimAccessoryWastageValues = (material) => {
    if (!material || material.materialType !== 'Trim & Accessory') return [];
    const trimType = material.trimAccessory?.toString().trim();
    const schema = trimType ? TRIM_ACCESSORY_SCHEMAS?.[trimType] : null;
    const keys = [
      ...(schema?.required || []),
      ...(schema?.advanced || []),
      ...Object.keys(schema?.conditional || {})
    ];
    const values = [];
    keys.forEach((key) => {
      const keyLower = key.toLowerCase();
      if (keyLower.includes('wastage') || keyLower.includes('surplus')) {
        const value = material[key];
        if (value !== undefined && value !== null && value !== '') values.push({ key, value });
      }
    });
    // Also include generic surplus/wastage if present
    if (material.surplus !== undefined && material.surplus !== null && material.surplus !== '') {
      values.push({ key: 'surplus', value: material.surplus });
    }
    if (material.wastage !== undefined && material.wastage !== null && material.wastage !== '') {
      values.push({ key: 'wastage', value: material.wastage });
    }
    return values;
  };

  // Returns [{ source: string, value: number }] for one raw material only: this material's surplus/wastage + this material's work orders' wastage. No component.
  const getRawMaterialWastageBreakdown = (material) => {
    const breakdown = [];
    const added = new Set();
    const add = (source, value) => {
      const key = `${source}::${value}`;
      if (added.has(key)) return;
      added.add(key);
      const num = parseFloat(String(value).replace('%', '')) || 0;
      if (num > 0) breakdown.push({ source, value: num });
    };

    RAW_MATERIAL_WASTAGE_SURPLUS_KEYS.forEach((key) => {
      if (material[key] !== undefined && material[key] !== null && material[key] !== '') {
        add(RAW_MATERIAL_WASTAGE_LABELS[key] || key, material[key]);
      }
    });
    getTrimAccessoryWastageValues(material).forEach(({ key, value }) => {
      add(formatWastageLabel(key), value);
    });
    (material.workOrders || []).forEach((wo, idx) => {
      const woValues = [];
      extractAllWastages(wo, woValues);
      const woLabel = wo.workOrder ? `Work order (${wo.workOrder})` : `Work order ${idx + 1}`;
      woValues.forEach((v, i) => {
        add(woValues.length > 1 ? `${woLabel} #${i + 1}` : woLabel, v);
      });
    });

    return breakdown;
  };

  // Extract all wastage/surplus from one raw material: 5 categories (foam, fiber, fabric, trim&accessory, yarn) + work orders
  const extractRawMaterialWastagesSurplus = (material, wastageList) => {
    RAW_MATERIAL_WASTAGE_SURPLUS_KEYS.forEach((key) => {
      if (material[key] !== undefined) pushIfPresent(wastageList, material[key]);
    });
    getTrimAccessoryWastageValues(material).forEach(({ value }) => pushIfPresent(wastageList, value));
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
    const consumptionMats = getConsumptionMaterialsForComponent(componentName, stepData, productComponents);
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
    const rawMats = getRawMaterialsForComponent(componentName, stepData);
    const allConsumptionMats = getConsumptionMaterialsForComponent(componentName, stepData, productComponents);
    const componentDetails = component || getComponentDetails(componentName, productComponents);
    const artworkMats = getArtworkMaterialsForComponent(componentName, stepData);
    const overageQty = calculateOverageQty(product.poQty || 0, product.overagePercentage || '0');
    const setOfNumber = parseFloat(String(product.setOf || '').trim()) || 1;

    let componentWastage = null;
    for (const comp of productComponents || []) {
      if (comp.productComforter === componentName && comp.wastage) {
        componentWastage = comp.wastage;
        break;
      }
    }

    const row4Cell = 'min-w-0 border-r border-border bg-muted/5 flex items-center';
    const row4Last = 'min-w-0 border-border bg-muted/5 flex items-center';
    const desktopTableCell = { padding: '14px 18px' };
    const desktopHeaderCell = { padding: '12px 18px' };

    const renderInfoIcon = (message, options = {}) => {
      const { align: alignOption = 'center', size = 'md' } = options;
      const align = size === 'sm' && alignOption === 'center' ? 'left' : alignOption;
      const sizeMap = {
        sm: { button: 14, icon: 10 },
        md: { button: 18, icon: 12 }
      };
      const { button, icon } = sizeMap[size] || sizeMap.md;
      const tooltipStyle = {
        left: '50%',
        top: '110%',
        transform: 'translateX(-50%)',
        minWidth: '180px',
        maxWidth: 'calc(100vw - 32px)',
        padding: '8px 10px',
        borderRadius: '8px',
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'white',
        color: '#111827',
        fontSize: '11px',
        lineHeight: '1.4',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        whiteSpace: 'pre-line'
      };

      if (align === 'right') {
        tooltipStyle.left = 'auto';
        tooltipStyle.right = 0;
        tooltipStyle.transform = 'translateX(0)';
      } else if (align === 'left') {
        tooltipStyle.left = 0;
        tooltipStyle.transform = 'translateX(0)';
      }

      return (
      <span className="relative inline-flex items-center group">
        <button
          type="button"
          className="inline-flex items-center justify-center border border-black/70 text-muted-foreground bg-transparent hover:bg-black/5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          style={{
            width: `${button}px`,
            height: `${button}px`,
            minWidth: `${button}px`,
            padding: 0,
            lineHeight: `${button}px`,
            borderRadius: '9999px',
            boxSizing: 'border-box',
            flex: '0 0 auto'
          }}
          aria-label={message}
        >
          <svg
            viewBox="0 0 20 20"
            width={icon}
            height={icon}
            aria-hidden="true"
            className="block"
          >
            <line x1="10" y1="8" x2="10" y2="14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="5.3" r="1.4" fill="currentColor" />
          </svg>
        </button>
        <span
          className="pointer-events-none absolute z-20 hidden group-hover:block group-focus-visible:block"
          style={tooltipStyle}
        >
          {message}
        </span>
      </span>
      );
    };

    const hasMeaningfulValue = (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return !Number.isNaN(value);
      if (typeof value === 'boolean') return value === true;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.values(value).some(hasMeaningfulValue);
      return false;
    };

    const getConsumptionWastages = (material) => {
      const list = [];
      const addedKeys = new Set();
      const pushValue = (key, value) => {
        if (value === undefined || value === null || value === '') return;
        if (addedKeys.has(key)) return;
        addedKeys.add(key);
        list.push(value);
      };

      // Generic extraction (recursive)
      extractAllWastages(material, list);

      // Explicit trim/accessory keys (defensive: ensure ribbing, etc. are captured)
      const trimType = material?.trimAccessory?.toString().trim();
      const schema = trimType ? TRIM_ACCESSORY_SCHEMAS?.[trimType] : null;
      const schemaKeys = [
        ...(schema?.required || []),
        ...(schema?.advanced || []),
        ...Object.keys(schema?.conditional || {})
      ];
      schemaKeys
        .filter((k) => {
          const kLower = k.toLowerCase();
          return kLower.includes('wastage') || kLower.includes('surplus');
        })
        .forEach((key) => pushValue(key, material?.[key]));

      // Also include generic surplus/wastage if present
      pushValue('surplus', material?.surplus);
      pushValue('wastage', material?.wastage);

      return list;
    };

    const isMeaningfulConsumptionMaterial = (material) => {
      if (!material) return false;
      const hasCore =
        hasMeaningfulValue(material.trimAccessory) ||
        hasMeaningfulValue(material.materialDescription) ||
        hasMeaningfulValue(material.netConsumption) ||
        hasMeaningfulValue(material.unit) ||
        hasMeaningfulValue(material.workOrder);
      const wastages = getConsumptionWastages(material);
      return hasCore || wastages.length > 0;
    };

    const consumptionMats = (allConsumptionMats || []).filter(isMeaningfulConsumptionMaterial);

    const filterValidWorkOrders = (workOrders = []) => {
      return workOrders.filter((wo) => {
        if (!wo || typeof wo !== 'object') return false;
        return Object.values(wo).some((value) => {
          if (value === null || value === undefined) return false;
          if (typeof value === 'string') return value.trim() !== '';
          if (typeof value === 'number') return value !== 0 && !Number.isNaN(value);
          if (typeof value === 'boolean') return value === true;
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'object') return Object.values(value).some((v) => v !== null && v !== undefined && `${v}`.trim() !== '');
          return false;
        });
      });
    };

    const renderMaterialWorkOrders = (workOrders) => {
      if (!workOrders || workOrders.length === 0) {
        return (
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Work orders –</div>
        );
      }
      return (
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Work orders</span>
          <div className="flex flex-wrap gap-3">
            {workOrders.map((wo, idx) => (
              <div
                key={`${wo.workOrder || 'wo'}-${idx}`}
                className="bg-muted/10 border border-border rounded-lg text-sm"
                style={{ padding: '8px 12px' }}
              >
                <span className="font-semibold text-foreground">{wo.workOrder || `WO ${idx + 1}`}</span>
                {wo.wastage && (
                  <span className="text-muted-foreground text-xs block mt-1">Wastage: {wo.wastage}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderDesktopMaterialBlock = (material, matIdx) => {
      const matNetCns = material.netConsumption != null ? parseFloat(material.netConsumption) : 0;
      const wastageBreakdown = getRawMaterialWastageBreakdown(material);
      const matWastages = wastageBreakdown.map((b) => b.value);
      const matCompoundWastage = calculateCompoundWastage(matWastages);
      const matTotalWastage = calculateTotalWastage(matWastages);
      const matGrossCns = calculateGrossCns(overageQty, matWastages, matNetCns);
      const matGrossCnsSet = (parseFloat(matGrossCns) || 0) * setOfNumber;
      const matUnit = material.unit || unit || '-';
      const materialWorkOrders = filterValidWorkOrders(material.workOrders || []);
      const wastageTraceTitle = wastageBreakdown.length > 0
        ? `Gross wastage from (compounded): ${wastageBreakdown.map((b) => `${b.source} ${b.value}%`).join(' → ')}`
        : '';

      return (
        <div key={matIdx} className="min-w-0 border-b border-border">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 min-w-0">
            <div className={row4Cell} style={desktopTableCell}>
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{matIdx + 1}.</span>
                <span className="text-sm text-foreground break-words">{material.materialType || '-'}</span>
              </div>
            </div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{matNetCns || '-'}</span></div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{overageQty}</span></div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{matTotalWastage}%</span></div>
            <div className={row4Cell} style={desktopTableCell} title={wastageTraceTitle}><span className="text-base font-bold text-foreground">{matCompoundWastage}%</span></div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-primary">{matGrossCns}</span></div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-primary">{matGrossCnsSet.toFixed(3)}</span></div>
            <div className={row4Last} style={desktopTableCell}><span className="text-base font-bold text-foreground uppercase">{matUnit}</span></div>
          </div>
          <div className="border-t border-border/70 bg-muted/5" style={{ padding: '14px 18px' }}>
            {renderMaterialWorkOrders(materialWorkOrders)}
          </div>
        </div>
      );
    };

    const renderDesktopConsumptionBlock = (material, matIdx) => {
      const hasNet = material.netConsumption !== null && material.netConsumption !== undefined && String(material.netConsumption).trim() !== '';
      const netCns = hasNet ? parseFloat(material.netConsumption) || 0 : null;
      const wastages = getConsumptionWastages(material);
      const totalWastage = calculateTotalWastage(wastages);
      const compoundWastage = calculateCompoundWastage(wastages);
      const grossCns = hasNet ? calculateGrossCns(overageQty, wastages, netCns) : '-';
      const label = material.trimAccessory || material.materialDescription || `Consumption ${matIdx + 1}`;
      const matUnit = material.unit || '-';

      return (
        <div key={matIdx} className="min-w-0 border-b border-border">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 min-w-0">
            <div className={row4Cell} style={desktopTableCell}>
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{matIdx + 1}.</span>
                <span className="text-sm text-foreground break-words">{label}</span>
              </div>
            </div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{netCns ?? '-'}</span></div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{totalWastage}%</span></div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-foreground">{compoundWastage}%</span></div>
            <div className={row4Cell} style={desktopTableCell}><span className="text-base font-bold text-primary">{grossCns}</span></div>
            <div className={row4Last} style={desktopTableCell}><span className="text-base font-bold text-foreground uppercase">{matUnit}</span></div>
          </div>
        </div>
      );
    };

    const renderMobileTimelineBlock = (material, matIdx) => {
      const matNetCns = material.netConsumption != null ? parseFloat(material.netConsumption) : 0;
      const wastageBreakdown = getRawMaterialWastageBreakdown(material);
      const matWastages = wastageBreakdown.map((b) => b.value);
      const matCompoundWastage = calculateCompoundWastage(matWastages);
      const matTotalWastage = calculateTotalWastage(matWastages);
      const matGrossCns = calculateGrossCns(overageQty, matWastages, matNetCns);
      const matGrossCnsSet = (parseFloat(matGrossCns) || 0) * setOfNumber;
      const matUnit = (material.unit || unit || '-').toString().toUpperCase();
      const materialWorkOrders = filterValidWorkOrders(material.workOrders || []);

      return (
        <div key={matIdx} className="rounded-xl border border-border bg-white shadow-sm">
          <div style={{ padding: '16px 18px' }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Material {matIdx + 1}</span>
                <span className="text-[10px] font-semibold text-muted-foreground">#{matIdx + 1}</span>
              </div>
              <p className="mt-1.5 text-base font-semibold text-foreground leading-snug">{material.materialType || 'Raw material'}</p>
            </div>
            <div className="space-y-3 mt-3">
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Sum of net consumption for this raw material', { size: 'sm' })} Net CNS
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">{matNetCns !== 0 ? matNetCns : '–'}</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('PO Qty with overage applied', { size: 'sm' })} Overage Qty
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">{overageQty}</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Sum of all wastage/surplus values for this raw material and its work orders', { size: 'sm' })} Wastage
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">{matTotalWastage}%</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon(`Extra material needed after compounding all wastage and surplus required.
Formula:
Gross Wastage % = ((1+w1/100) × (1+w2/100) × ... − 1) × 100`, { size: 'sm' })} Gross Wastage
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">{matCompoundWastage}%</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Unit from raw material', { size: 'sm' })} Unit
                </span>
                <span className="text-sm font-semibold text-foreground uppercase">{matUnit}</span>
              </div>
              <div className="flex justify-between items-baseline gap-3 pt-2 mt-1 border-t border-border/60">
                <span className="text-xs font-semibold text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Gross CNS per piece multiplied by overage quantity', { size: 'sm' })} Gross CNS
                </span>
                <span className="text-base font-bold text-primary tabular-nums">{matGrossCns}</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-semibold text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Gross CNS multiplied by Set Of', { size: 'sm' })} Gross CNS
                  <span className="text-[11px] text-muted-foreground">Set of {setOfNumber}</span>
                </span>
                <span className="text-base font-bold text-primary tabular-nums">{matGrossCnsSet.toFixed(3)}</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border/70 bg-muted/5" style={{ padding: '14px 18px' }}>
            {renderMaterialWorkOrders(materialWorkOrders)}
          </div>
        </div>
      );
    };

    const renderMobileConsumptionBlock = (material, matIdx) => {
      const hasNet = material.netConsumption !== null && material.netConsumption !== undefined && String(material.netConsumption).trim() !== '';
      const netCns = hasNet ? parseFloat(material.netConsumption) || 0 : null;
      const wastages = getConsumptionWastages(material);
      const totalWastage = calculateTotalWastage(wastages);
      const compoundWastage = calculateCompoundWastage(wastages);
      const grossCns = hasNet ? calculateGrossCns(overageQty, wastages, netCns) : '-';
      const label = material.trimAccessory || material.materialDescription || `Consumption ${matIdx + 1}`;
      const matUnit = (material.unit || '-').toString().toUpperCase();

      return (
        <div key={matIdx} className="rounded-xl border border-border bg-white shadow-sm">
          <div style={{ padding: '16px 18px' }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Consumption {matIdx + 1}</span>
                <span className="text-[10px] font-semibold text-muted-foreground">#{matIdx + 1}</span>
              </div>
              <p className="mt-1.5 text-base font-semibold text-foreground leading-snug">{label}</p>
            </div>
            <div className="space-y-3 mt-3">
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Net consumption for this trim/accessory', { size: 'sm' })} Net CNS
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">{netCns ?? '–'}</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Sum of all wastage/surplus values for this trim/accessory', { size: 'sm' })} Wastage
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">{totalWastage}%</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Compounded wastage/surplus for this trim/accessory', { size: 'sm' })} Gross Wastage
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">{compoundWastage}%</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Gross CNS per piece multiplied by overage quantity', { size: 'sm' })} Gross CNS
                </span>
                <span className="text-base font-bold text-primary tabular-nums">{grossCns}</span>
              </div>
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                  {renderInfoIcon('Unit from consumption material', { size: 'sm' })} Unit
                </span>
                <span className="text-sm font-semibold text-foreground uppercase">{matUnit}</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="w-full min-w-0 mb-8">
        <div className="border border-border rounded-xl bg-card shadow-sm min-w-0" style={{ padding: '20px' }}>
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

          {/* ROW 4: One row per raw material — grouped layout */}
          <div className="border-b border-border min-w-0">
            {isMobileCns ? (
              <div className="bg-muted/5" style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {rawMats.length > 0 ? (
                  rawMats.map((material, mIdx) => renderMobileTimelineBlock(material, mIdx))
                ) : (
                  <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden p-5 text-sm font-medium text-muted-foreground">
                    No raw material
                  </div>
                )}
              </div>
            ) : (
              <div className="min-w-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 min-w-0 border-b border-border bg-muted/30">
                  <div className={row4Cell} style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Raw Material {renderInfoIcon('Each row is a raw material; its work orders are listed below')}
                    </span>
                  </div>
                  <div className={row4Cell} style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Net CNS {renderInfoIcon('Sum of net consumption for this raw material')}
                    </span>
                  </div>
                  <div className={row4Cell} style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Overage Qty {renderInfoIcon('PO Qty with overage applied')}
                    </span>
                  </div>
                  <div className={row4Cell} style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Wastage {renderInfoIcon('Sum of all wastage/surplus values for this raw material and its work orders')}
                    </span>
                  </div>
                  <div className={row4Cell} style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Gross Wastage {renderInfoIcon(`Extra material needed after compounding all wastage and surplus required.
Formula:
Gross Wastage % = ((1+w1/100) × (1+w2/100) × ... − 1) × 100`)}
                    </span>
                  </div>
                  <div className={row4Cell} style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Gross CNS {renderInfoIcon('Gross CNS per piece multiplied by overage quantity')}
                    </span>
                  </div>
                  <div className={row4Cell} style={desktopHeaderCell}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                        Gross CNS {renderInfoIcon('Gross CNS multiplied by Set Of', { align: 'right' })}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Set of {setOfNumber}</span>
                    </div>
                  </div>
                  <div className={row4Last} style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Unit {renderInfoIcon('Unit from raw material', { align: 'right' })}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  {rawMats.length > 0 ? (
                    rawMats.map((material, mIdx) => renderDesktopMaterialBlock(material, mIdx))
                  ) : (
                  <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden p-5 text-sm font-medium text-muted-foreground">
                    No raw material
                  </div>
                )}
                </div>
              </div>
            )}
          </div>
          {/* CONSUMPTION MATERIALS SECTION */}
          {consumptionMats.length > 0 && (
            <div className="border-b border-border bg-muted/5" style={isMobileCns ? { padding: '18px 16px' } : { padding: '20px' }}>
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-4">Consumption Materials</span>
              {isMobileCns ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {consumptionMats.map((material, idx) => renderMobileConsumptionBlock(material, idx))}
                </div>
              ) : (
                <div className="min-w-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 min-w-0 border-b border-border bg-muted/30">
                    <div className={row4Cell} style={desktopHeaderCell}>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                        Trim/Accessory {renderInfoIcon('Each row is a trim/accessory from Step-3')}
                      </span>
                    </div>
                    <div className={row4Cell} style={desktopHeaderCell}>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                        Net CNS {renderInfoIcon('Net consumption for this trim/accessory')}
                      </span>
                    </div>
                    <div className={row4Cell} style={desktopHeaderCell}>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                        Wastage {renderInfoIcon('Sum of all wastage/surplus values for this trim/accessory')}
                      </span>
                    </div>
                    <div className={row4Cell} style={desktopHeaderCell}>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                        Gross Wastage {renderInfoIcon('Compounded wastage/surplus for this trim/accessory')}
                      </span>
                    </div>
                    <div className={row4Cell} style={desktopHeaderCell}>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                        Gross CNS {renderInfoIcon('Gross CNS per piece multiplied by overage quantity')}
                      </span>
                    </div>
                    <div className={row4Last} style={desktopHeaderCell}>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                        Unit {renderInfoIcon('Unit from consumption material', { align: 'right' })}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    {consumptionMats.map((material, idx) => renderDesktopConsumptionBlock(material, idx))}
                  </div>
                </div>
              )}
            </div>
          )}
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
                  const artworkGrossCnsSet = (parseFloat(artworkGrossCns) || 0) * setOfNumber;
                  const artUnit = (artwork.unit || '-').toString().toUpperCase();
                  return (
                    <div key={idx} className="rounded-xl border border-border bg-white shadow-sm min-w-0">
                      <div style={{ padding: '16px 18px' }}>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Artwork {idx + 1}</span>
                        <p className="mt-1.5 text-base font-semibold text-foreground leading-snug break-words">{artwork.materialDescription || '–'}</p>
                      </div>
                      <div className="border-t border-border bg-muted/20" style={{ padding: '14px 18px' }}>
                        <div className="space-y-3">
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                              {renderInfoIcon('Sum of net consumption for this artwork material', { size: 'sm' })} Net CNS
                            </span>
                            <span className="text-sm font-semibold text-foreground tabular-nums">{artworkNetCns || '–'}</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                              {renderInfoIcon('Sum of all wastage/surplus values for this artwork material', { size: 'sm' })} Wastage
                            </span>
                            <span className="text-sm font-semibold text-foreground tabular-nums">{artworkCompoundWastage}%</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-medium text-muted-foreground shrink-0 inline-flex items-center gap-2">
                              {renderInfoIcon('Unit from artwork material', { size: 'sm' })} Unit
                            </span>
                            <span className="text-sm font-semibold text-foreground uppercase">{artUnit}</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3 pt-2 mt-1 border-t border-border/60">
                            <span className="text-xs font-semibold text-muted-foreground shrink-0 inline-flex items-center gap-2">
                              {renderInfoIcon('Gross CNS per piece multiplied by overage quantity', { size: 'sm' })} Gross CNS
                            </span>
                            <span className="text-base font-bold text-primary tabular-nums">{artworkGrossCns}</span>
                          </div>
                          <div className="flex justify-between items-baseline gap-3">
                            <span className="text-xs font-semibold text-muted-foreground shrink-0 inline-flex items-center gap-2">
                              {renderInfoIcon('Gross CNS multiplied by Set Of', { size: 'sm' })} Gross CNS
                              <span className="text-[11px] text-muted-foreground">Set of {setOfNumber}</span>
                            </span>
                            <span className="text-base font-bold text-primary tabular-nums">{artworkGrossCnsSet.toFixed(3)}</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-6 min-w-0 border-b border-border bg-muted/30">
                  <div className="min-w-0 border-r border-border" style={desktopHeaderCell}><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Material Description</span></div>
                  <div className="min-w-0 border-r border-border" style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Net CNS {renderInfoIcon('Sum of net consumption for this artwork material')}
                    </span>
                  </div>
                  <div className="min-w-0 border-r border-border" style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Wastage {renderInfoIcon('Sum of all wastage/surplus values for this artwork material')}
                    </span>
                  </div>
                  <div className="min-w-0 border-r border-border" style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Gross CNS {renderInfoIcon('Gross CNS per piece multiplied by overage quantity')}
                    </span>
                  </div>
                  <div className="min-w-0 border-r border-border" style={desktopHeaderCell}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                        Gross CNS {renderInfoIcon('Gross CNS multiplied by Set Of', { align: 'right' })}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Set of {setOfNumber}</span>
                    </div>
                  </div>
                  <div className="min-w-0 border-border" style={desktopHeaderCell}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider inline-flex items-center gap-2">
                      Unit {renderInfoIcon('Unit from artwork material', { align: 'right' })}
                    </span>
                  </div>
                </div>
                {artworkMats.map((artwork, idx) => {
                  const artworkNetCns = parseFloat(artwork.netConsumption) || 0;
                  const artworkWastageSurplus = extractArtworkWastageSurplus(artwork);
                  const artworkCompoundWastage = calculateCompoundWastage(artworkWastageSurplus);
                  const artworkGrossCns = calculateGrossCns(overageQty, artworkWastageSurplus, artworkNetCns);
                  const artworkGrossCnsSet = (parseFloat(artworkGrossCns) || 0) * setOfNumber;
                  const artCellClass = 'min-w-0 border-r border-border bg-muted/5';
                  const artLastClass = 'min-w-0 border-border bg-muted/5';
                  return (
                    <div key={idx} className="grid grid-cols-2 sm:grid-cols-6 min-w-0 border-b border-border last:border-b-0">
                      <div className={artCellClass} style={desktopTableCell}><span className="text-sm text-foreground break-words">{artwork.materialDescription || '-'}</span></div>
                      <div className={artCellClass} style={desktopTableCell}><span className="text-base font-bold text-foreground">{artworkNetCns || '-'}</span></div>
                      <div className={artCellClass} style={desktopTableCell}><span className="text-base font-bold text-foreground">{artworkCompoundWastage}%</span></div>
                      <div className={artCellClass} style={desktopTableCell}><span className="text-base font-bold text-primary">{artworkGrossCns}</span></div>
                      <div className={artCellClass} style={desktopTableCell}><span className="text-base font-bold text-primary">{artworkGrossCnsSet.toFixed(3)}</span></div>
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
