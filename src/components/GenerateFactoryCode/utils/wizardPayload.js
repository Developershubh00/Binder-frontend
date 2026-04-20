/**
 * Build the payload for `POST /api/ims/factory-codes/wizard/`.
 *
 * The frontend form holds a rich nested shape with many optional fields and
 * scaffold rows; the backend serializers are stricter. This builder is the
 * single choke-point that turns one into the other. Fixes applied here:
 *
 *  - Empty scaffold rows (products, rawMaterials, artworkMaterials,
 *    packagingMaterials) are filtered out — the backend rejects them with
 *    "This field is required" errors otherwise.
 *  - Boolean fields on workOrders (warp / weft / wales / courses / shrinkage*)
 *    are stringified, because the serializer declares them as CharField.
 *  - `artworkCategory` is renamed to `category` so the ChoiceField accepts it.
 *  - Empty/array `approval` values are dropped (sending null instead of
 *    `""` or `[]` so the ChoiceField's allow_null kicks in).
 *  - `casepack_qty` is coerced to an integer.
 *  - `products[].name` falls back to the SKU/subproduct display name when
 *    the user leaves the product-level name blank (component-level name
 *    sits in `productComforter`).
 */

// The packaging shape helpers live in the parent component (module-scope
// functions in GenerateFactoryCode.jsx). Callers pass them in so this
// utility stays pure and testable. See `buildWizardPayload({ packagingToBackendShape, ... })`.

// ----- helpers --------------------------------------------------------------

const isBlank = (v) =>
  v == null || (typeof v === 'string' && v.trim() === '') ||
  (Array.isArray(v) && v.length === 0);

const toIntOrNull = (v) => {
  if (v == null || v === '') return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

const toStr = (v) => {
  if (v == null) return '';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
};

// Approval is a single-choice enum server-side but the form stores it as a
// multi-select array. Collapse to the first non-empty value or null.
const normalizeApproval = (v) => {
  if (Array.isArray(v)) v = v.find((x) => !isBlank(x)) || null;
  if (isBlank(v)) return null;
  return String(v);
};

const WORK_ORDER_BOOL_FIELDS = [
  'warp', 'weft', 'wales', 'courses',
  'shrinkageWidth', 'shrinkageLength',
];

const sanitizeWorkOrder = (wo) => {
  if (!wo || typeof wo !== 'object') return wo;
  const out = { ...wo };
  for (const k of WORK_ORDER_BOOL_FIELDS) {
    if (k in out && typeof out[k] === 'boolean') {
      out[k] = out[k] ? 'true' : '';
    }
  }
  // process_type: backend requires the field; pull from workOrder label
  // if absent so scaffold rows with just a `workOrder` set still pass.
  if (isBlank(out.process_type) && !isBlank(out.workOrder)) {
    out.process_type = String(out.workOrder);
  }
  return out;
};

// Decide whether a raw material row carries enough user intent to save.
// Returning false filters it out of the payload so the backend doesn't
// reject an empty scaffold.
const rawMaterialHasIntent = (rm) => {
  if (!rm || typeof rm !== 'object') return false;
  return [
    rm.materialName, rm.materialDescription, rm.fiberType, rm.yarnType,
    rm.fabricName, rm.fabricFiberType, rm.fabricComposition,
    rm.trimAccessory, rm.material,
  ].some((v) => !isBlank(v));
};

// Pick a non-empty display name for a raw-material row. Covers the full
// spread of discriminant fields the form uses across fabric/yarn/trim rows.
const rawMaterialName = (rm) => {
  const candidates = [
    rm.materialName, rm.materialDescription, rm.fabricName,
    rm.yarnType, rm.fiberType, rm.fabricFiberType,
    rm.fabricComposition, rm.yarnComposition,
    rm.trimAccessory, rm.trimAccessoryType, rm.material,
    rm.componentName, rm.productName,
  ];
  const hit = candidates.find((v) => !isBlank(v));
  return hit ? String(hit).trim() : '';
};

const sanitizeRawMaterial = (rm) => {
  const out = { ...rm };
  out.materialName = rawMaterialName(rm);
  out.approval = normalizeApproval(rm.approval);
  out.fabricApproval = normalizeApproval(rm.fabricApproval);
  out.workOrders = Array.isArray(rm.workOrders)
    ? rm.workOrders.map(sanitizeWorkOrder).filter((wo) => {
        // Drop empty workOrder scaffolds
        if (!wo || typeof wo !== 'object') return false;
        return !isBlank(wo.workOrder) || !isBlank(wo.process_type) || !isBlank(wo.machineType);
      })
    : [];
  return out;
};

const artworkHasIntent = (am) => {
  if (!am || typeof am !== 'object') return false;
  return [
    am.artworkCategory, am.category, am.materialDescription, am.material,
    am.specificType, am.placement,
  ].some((v) => !isBlank(v));
};

// Known choice fields on the artwork create serializer — empty string
// fails ChoiceField validation ("'' is not a valid choice"), so drop those
// keys entirely and let the backend treat them as missing.
const ARTWORK_CHOICE_FIELDS = ['sizeUnit'];

const sanitizeArtworkMaterial = (am) => {
  const out = { ...am };
  // Backend expects `category`; frontend stores `artworkCategory`.
  if (isBlank(out.category) && !isBlank(out.artworkCategory)) {
    out.category = String(out.artworkCategory);
  }
  out.approval = normalizeApproval(am.approval);
  for (const k of ARTWORK_CHOICE_FIELDS) {
    if (out[k] === '' || out[k] == null) delete out[k];
  }
  // Any File instances survive as-is here — the caller runs this payload
  // through replaceFilesWithBlobUrls before POST, which replaces Files
  // with URL strings. The caller is responsible for any post-upload
  // rename/cleanup of file-like keys (see cleanArtworkFiles below).
  return out;
};

/**
 * After the commit-time `replaceFilesWithBlobUrls` pass has turned every
 * File into a URL string (or empty string on upload failure), rewrite the
 * artwork materials so the wizard serializer accepts them:
 *
 *  - `referenceImage` as a string URL moves to `referenceImageUrl`
 *  - Empty strings in file-like fields are deleted (FileField rejects '')
 *  - Category-specific *File keys stay as URL strings because the backend
 *    stores them inside `category_specific_data` as opaque values.
 */
export function cleanArtworkFilesForWizard(artworkMaterials) {
  if (!Array.isArray(artworkMaterials)) return artworkMaterials;
  for (const m of artworkMaterials) {
    if (!m || typeof m !== 'object') continue;
    // referenceImage → referenceImageUrl when it's a non-empty string.
    if (typeof m.referenceImage === 'string') {
      if (m.referenceImage) {
        m.referenceImageUrl = m.referenceImage;
      }
      delete m.referenceImage;
    }
    // Top-level FileFields declared on the serializer: if upload failed
    // we may be holding an empty string — drop it so FileField validation
    // doesn't fire.
    for (const k of ['permanenceFile', 'testingRequirementFile']) {
      if (m[k] === '') delete m[k];
    }
  }
  return artworkMaterials;
}

export function cleanPackagingFilesForWizard(packaging) {
  if (!packaging || typeof packaging !== 'object') return packaging;
  for (const m of packaging.materials || []) {
    if (!m || typeof m !== 'object') continue;
    // printingRef is a FileField on the create serializer; drop empty
    // strings and stash non-empty URLs inside material_specific_data by
    // leaving the key intact — backend's _get_material_specific_fields
    // already forwards unknown keys into the JSON blob.
    if (m.printingRef === '') delete m.printingRef;
  }
  return packaging;
}

const packagingMaterialHasIntent = (pm) => {
  if (!pm || typeof pm !== 'object') return false;
  return [pm.materialType, pm.material_type, pm.colour, pm.printing].some(
    (v) => !isBlank(v)
  );
};

const sanitizePackaging = (raw, shapers) => {
  const normalized = shapers.normalizePackagingBlockStiffenerPlys(raw ?? null);
  const shaped = shapers.packagingToBackendShape(normalized);
  if (!shaped) return null;
  return {
    ...shaped,
    casepack_qty: toIntOrNull(shaped.casepack_qty),
    materials: (shaped.materials || [])
      .filter(packagingMaterialHasIntent)
      .map((pm) => ({
        ...pm,
        // Keep both casings so the serializer's source= mapping doesn't care
        // about which one we sent.
        materialType: pm.materialType || pm.material_type || '',
      })),
  };
};

// Component-level: backend wants `name` (not blank). Prefer productComforter
// (the frontend's label field), fall back to any other identifier.
const sanitizeComponent = (c) => ({
  name: c.productComforter || c.name || c.componentName || '',
  placement: c.placement ?? '',
  remarks: c.remarks ?? '',
  surplus: c.surplus ?? '',
  sizeWidth: toStr(c.cuttingSize?.width ?? c.sewSize?.width ?? c.size?.width ?? ''),
  sizeLength: toStr(c.cuttingSize?.length ?? c.sewSize?.length ?? c.size?.length ?? ''),
  sizeHeight: toStr(c.size?.height ?? ''),
  sizeUnit: c.size?.unit ?? c.cuttingSize?.unit ?? c.sewSize?.unit ?? '',
  unit: c.unit ?? '',
  quantity: toStr(c.quantity ?? ''),
});

// Product-level: backend wants a non-blank `name`. If the user left it blank
// but we know the SKU's product display name, use that.
const sanitizeProduct = (p, fallbackName) => {
  const name = !isBlank(p.name) ? p.name : (fallbackName || '');
  return {
    name: String(name).trim(),
    placement: p.placement ?? '',
    components: (p.components || []).map(sanitizeComponent),
  };
};

// ----- public ---------------------------------------------------------------

/**
 * Build a wizard payload for one SKU (or subproduct).
 *
 * @param {object} args
 * @param {object} args.skuItem        - the top-level SKU record
 * @param {string} args.productName    - display name (skuItem.product or sp.subproduct)
 * @param {string} args.ipcCode        - e.g. "CHD/101A/PO-1/IPC-2" or ".../SP-3"
 * @param {object} args.stepData       - skuItem.stepData or sp.stepData
 * @param {string|null} args.buyerCode - formData.buyerCode
 * @param {string|null} args.ipoId     - formData.ipoId
 * @param {string} args.ipoCode        - formData.ipoCode (stored in notes)
 */
export function buildWizardPayload({
  skuItem,
  productName,
  ipcCode,
  stepData,
  buyerCode,
  ipoId,
  ipoCode,
  packagingToBackendShape,
  normalizePackagingBlockStiffenerPlys,
}) {
  const stepProducts = stepData?.products || [];
  const products = stepProducts
    .map((p) => sanitizeProduct(p, productName))
    .filter((p) => !isBlank(p.name));

  const rawMaterials = (stepData?.rawMaterials || [])
    .filter(rawMaterialHasIntent)
    .map(sanitizeRawMaterial);

  const consumptionMaterials = (stepData?.consumptionMaterials || [])
    .filter((cm) => cm && typeof cm === 'object' && Object.values(cm).some((v) => !isBlank(v)));

  const artworkMaterials = (stepData?.artworkMaterials || [])
    .filter(artworkHasIntent)
    .map(sanitizeArtworkMaterial);

  const packaging = sanitizePackaging(stepData?.packaging, {
    packagingToBackendShape,
    normalizePackagingBlockStiffenerPlys,
  });

  return {
    step0: {
      sku: skuItem?.sku ?? '',
      product_name: productName || '',
      buyer_code: buyerCode || null,
      notes: ipoCode ?? '',
      ipo: ipoId || null,
      ipc_code: ipcCode || '',
      set_of: toStr(skuItem?.setOf ?? ''),
      po_qty: toStr(skuItem?.poQty ?? ''),
      overage_percentage: toStr(skuItem?.overagePercentage ?? ''),
      // YYYY-MM-DD from <input type="date"> goes straight into DRF DateField.
      // Empty string would fail DateField validation, so send null instead.
      delivery_due_date: skuItem?.deliveryDueDate || null,
    },
    products,
    rawMaterials,
    consumptionMaterials,
    artworkMaterials,
    packaging,
  };
}

export default buildWizardPayload;
