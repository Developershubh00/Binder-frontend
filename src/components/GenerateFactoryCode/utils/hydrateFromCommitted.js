/**
 * Hydrate the GenerateFactoryCode wizard's in-memory formData from
 * committed FactoryCode rows fetched via `GET /ims/factory-codes/?ipo=<id>`.
 *
 * This is the fallback restore path — used when no per-IPO draft exists
 * for the current user (new device, different teammate, draft cleared).
 * The draft (when present) is the source of truth because it carries the
 * full frontend-native nested shape; this helper performs a best-effort
 * back-fill focused on the parts users actually see:
 *   - artwork materials (with all category-specific fields, including the
 *     blob-URL references for uploaded artwork spec images)
 *   - packaging + packaging materials (with material_specific_data spread)
 *   - basic product/component scaffolding so the SKU slots render
 *
 * Data that lives only in the draft (e.g. advanced raw-material specs that
 * the backend flattens into relational rows) is left untouched.
 */

const IPC_SUBPRODUCT_RE = /\/SP-(\d+)$/;

/**
 * Parse an ipc_code like "CHD/101A/PO-1/IPC-2" or "CHD/101A/PO-1/IPC-2/SP-3"
 * and return `{ ipcNumber, spNumber }`. spNumber is null for main-SKU rows.
 */
function parseIpcCode(ipcCode) {
  if (!ipcCode || typeof ipcCode !== 'string') return { ipcNumber: null, spNumber: null };
  const spMatch = ipcCode.match(IPC_SUBPRODUCT_RE);
  const spNumber = spMatch ? parseInt(spMatch[1], 10) : null;
  const base = spMatch ? ipcCode.slice(0, spMatch.index) : ipcCode;
  const ipcMatch = base.match(/\/IPC-(\d+)$/);
  const ipcNumber = ipcMatch ? parseInt(ipcMatch[1], 10) : null;
  return { ipcNumber, spNumber };
}

/**
 * Convert the backend artwork_materials shape into the frontend's flat
 * material object used by Step 4. The category-specific fields live in
 * `category_specific_data` on the backend — we spread them back on top
 * so `material.labelsBrandArtworkSpecFile` etc. are populated with the
 * stored blob URLs.
 */
function artworkMaterialFromBackend(m) {
  if (!m || typeof m !== 'object') return null;
  const size = m.size || {};
  const base = {
    id: m.id,
    artworkCategory: m.category || m.artworkCategory || '',
    // Size block — render code reads either sizeWidth or size.width
    // depending on the category, so populate both shapes.
    sizeWidth: size.width ?? m.size_width ?? '',
    sizeLength: size.length ?? m.size_length ?? '',
    sizeHeight: size.height ?? m.size_height ?? '',
    sizeUnit: size.unit ?? m.size_unit ?? '',
    surplus: m.surplus ?? '',
    surplusForSection: m.surplus_for_section ?? m.surplusForSection ?? '',
    usage: m.usage ?? '',
    approval: m.approval ?? '',
    remarks: m.remarks ?? '',
    // Reference image — backend stores under `reference_image` (file) or
    // `reference_image_url` (URL string); the frontend reads `referenceImage`.
    referenceImage: m.reference_image_url || m.referenceImageUrl || m.reference_image || '',
  };
  // Spread category_specific_data so keys like `labelsBrandArtworkSpecFile`
  // (now a blob URL string) land back on the material for the "UPLOADED"
  // badge to render.
  const specific = m.category_specific_data || m.categorySpecificData;
  if (specific && typeof specific === 'object') {
    return { ...base, ...specific };
  }
  return base;
}

function packagingMaterialFromBackend(m) {
  if (!m || typeof m !== 'object') return null;
  const size = m.size || {};
  const base = {
    id: m.id,
    materialType: m.material_type || m.materialType || '',
    sizeWidth: size.width ?? '',
    sizeLength: size.length ?? '',
    sizeHeight: size.height ?? '',
    sizeUnit: size.unit ?? '',
    colour: m.colour ?? '',
    printing: m.printing ?? '',
    printingRef: m.printing_ref ?? m.printingRef ?? '',
  };
  const specific = m.material_specific_data || m.materialSpecificData;
  if (specific && typeof specific === 'object') {
    return { ...base, ...specific };
  }
  return base;
}

function packagingFromBackend(p) {
  if (!p || typeof p !== 'object') return null;
  return {
    productSelection: p.product_selection ?? p.productSelection ?? [],
    packagingType: p.packaging_type ?? p.packagingType ?? 'STANDARD',
    casepackQty: p.casepack_qty ?? p.casepackQty ?? null,
    assortedSkuLink: p.assorted_sku_link ?? p.assortedSkuLink ?? '',
    materials: (p.materials || [])
      .map(packagingMaterialFromBackend)
      .filter(Boolean),
  };
}

function componentFromBackend(c) {
  if (!c || typeof c !== 'object') return null;
  // Size shape is ambiguous on restore (frontend splits into
  // cuttingSize / sewSize / size); put values into `size` and let the
  // UI copy forward if the user edits.
  const sizeWidth = c.size_width ?? c.sizeWidth ?? '';
  const sizeLength = c.size_length ?? c.sizeLength ?? '';
  const sizeHeight = c.size_height ?? c.sizeHeight ?? '';
  const sizeUnit = c.size_unit ?? c.sizeUnit ?? '';
  return {
    id: c.id,
    productComforter: c.name ?? c.productComforter ?? '',
    placement: c.placement ?? '',
    remarks: c.remarks ?? '',
    surplus: c.surplus ?? '',
    unit: c.unit ?? '',
    quantity: c.quantity ?? '',
    size: {
      width: sizeWidth,
      length: sizeLength,
      height: sizeHeight,
      unit: sizeUnit,
    },
  };
}

function productFromBackend(p) {
  if (!p || typeof p !== 'object') return null;
  return {
    id: p.id,
    name: p.name ?? '',
    placement: p.placement ?? '',
    components: (p.components || []).map(componentFromBackend).filter(Boolean),
  };
}

function stepDataFromFactoryCode(fc) {
  return {
    products: (fc.products || []).map(productFromBackend).filter(Boolean),
    artworkMaterials: (fc.artwork_materials || [])
      .map(artworkMaterialFromBackend)
      .filter(Boolean),
    consumptionMaterials: fc.consumption_materials || [],
    rawMaterials: fc.raw_materials || [],
    packaging: packagingFromBackend(fc.packaging),
  };
}

/**
 * Public API — turn an array of FactoryCodeCompleteSerializer rows into a
 * partial `formData.skus[]` structure. Rows are grouped by IPC number; the
 * row without `/SP-N` becomes the main SKU and rows with `/SP-N` suffixes
 * become subproducts in order.
 *
 * Callers should merge this output on top of any existing draft rather
 * than replacing — the draft, if present, is richer.
 */
export function hydrateSkusFromFactoryCodes(factoryCodes) {
  if (!Array.isArray(factoryCodes) || factoryCodes.length === 0) return [];

  // Group by IPC number
  const byIpc = new Map();
  for (const fc of factoryCodes) {
    const { ipcNumber, spNumber } = parseIpcCode(fc.ipc_code || '');
    if (ipcNumber == null) continue; // unparseable — skip defensively
    if (!byIpc.has(ipcNumber)) byIpc.set(ipcNumber, { main: null, subs: [] });
    const bucket = byIpc.get(ipcNumber);
    if (spNumber == null) {
      bucket.main = fc;
    } else {
      bucket.subs.push({ spNumber, fc });
    }
  }

  // Build SKUs in IPC order (1-indexed)
  const sortedKeys = [...byIpc.keys()].sort((a, b) => a - b);
  return sortedKeys.map((ipcNumber) => {
    const { main, subs } = byIpc.get(ipcNumber);
    const mainFc = main || (subs[0] && subs[0].fc);
    const sku = {
      sku: mainFc?.sku ?? '',
      product: mainFc?.product_name ?? '',
      ipcCode: main ? main.ipc_code : '',
      stepData: main ? stepDataFromFactoryCode(main) : {},
      subproducts: subs
        .sort((a, b) => a.spNumber - b.spNumber)
        .map(({ fc }) => ({
          subproduct: fc.product_name ?? '',
          ipcCode: fc.ipc_code ?? '',
          stepData: stepDataFromFactoryCode(fc),
        })),
    };
    return sku;
  });
}

/**
 * Merge hydrated SKUs on top of draft SKUs. Draft wins for every field that
 * the draft actually defines (non-empty, non-null). Committed data fills
 * gaps (e.g. artwork spec URLs the draft lost because File→null).
 */
export function mergeDraftOverCommitted(draftSkus, committedSkus) {
  if (!Array.isArray(committedSkus) || committedSkus.length === 0) return draftSkus;
  if (!Array.isArray(draftSkus) || draftSkus.length === 0) return committedSkus;

  const mergeStepData = (draftSd, commSd) => {
    if (!commSd) return draftSd;
    if (!draftSd) return commSd;
    return {
      ...commSd,
      ...draftSd,
      // Artwork materials need per-key merging so committed URLs fill gaps
      // left by the draft's File→null serialization.
      artworkMaterials: mergeArtworkArrays(
        draftSd.artworkMaterials,
        commSd.artworkMaterials
      ),
      packaging: mergePackaging(draftSd.packaging, commSd.packaging),
    };
  };

  return draftSkus.map((draftSku, idx) => {
    const commSku = committedSkus[idx];
    if (!commSku) return draftSku;
    return {
      ...draftSku,
      stepData: mergeStepData(draftSku.stepData, commSku.stepData),
      subproducts: (draftSku.subproducts || []).map((sp, spIdx) => {
        const commSp = (commSku.subproducts || [])[spIdx];
        if (!commSp) return sp;
        return { ...sp, stepData: mergeStepData(sp.stepData, commSp.stepData) };
      }),
    };
  });
}

function mergeArtworkArrays(draftArr, commArr) {
  if (!Array.isArray(draftArr) || draftArr.length === 0) return commArr || [];
  if (!Array.isArray(commArr) || commArr.length === 0) return draftArr;
  return draftArr.map((d, i) => {
    const c = commArr[i];
    if (!c) return d;
    const merged = { ...c, ...d };
    // Fill any empty/null/File-stripped fields with the committed value.
    for (const [k, v] of Object.entries(c)) {
      const current = merged[k];
      if (current == null || current === '') merged[k] = v;
    }
    return merged;
  });
}

function mergePackaging(draftPkg, commPkg) {
  if (!draftPkg) return commPkg || null;
  if (!commPkg) return draftPkg;
  const draftMats = Array.isArray(draftPkg.materials) ? draftPkg.materials : [];
  const commMats = Array.isArray(commPkg.materials) ? commPkg.materials : [];
  const mergedMats = draftMats.map((d, i) => {
    const c = commMats[i];
    if (!c) return d;
    const merged = { ...c, ...d };
    for (const [k, v] of Object.entries(c)) {
      const current = merged[k];
      if (current == null || current === '') merged[k] = v;
    }
    return merged;
  });
  return {
    ...commPkg,
    ...draftPkg,
    materials: mergedMats.length ? mergedMats : commMats,
  };
}

export default hydrateSkusFromFactoryCodes;
