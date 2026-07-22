import { normalizeOrderType } from './orderType';

const normalizeValue = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const createLookup = (mapping) =>
  Object.entries(mapping).reduce((acc, [key, value]) => {
    acc[normalizeValue(key)] = value;
    return acc;
  }, {});

const TRIM_TYPE_TO_FORM_KEY = createLookup({
  'BUCKLES': 'trimsBuckles',
  'BUTTONS': 'trimsButtons',
  'CABLE-TIES': 'trimsCableTies',
  'CORD STOPS': 'trimsCordStops',
  'FELT': 'trimsFelt',
  'FIRE RETARDANT (FR) TRIMS': 'trimsFrTrims',
  'HOOKS-EYES': 'trimsHooksEyes',
  'INTERLINING(FUSING)': 'trimsInterlining',
  'LACE': 'trimsLace',
  'MAGNETIC CLOSURE': 'trimsMagneticClosure',
  'NIWAR-WEBBING': 'trimsNiwarWebbing',
  'PIN-BARBS': 'trimsPinBarbs',
  'REFLECTIVE TAPES': 'trimsReflectiveTapes',
  'RIBBING': 'trimsRibbing',
  'RINGS-LOOPS': 'trimsRingsLoops',
  'RIVETS': 'trimsRivets',
  'SEAM TAPE': 'trimsSeamTape',
  'SHOULDER PADS': 'trimsShoulderPads',
  'VELCRO': 'trimsVelcro',
  'ZIPPERS': 'trimsZippers',
});

const FOAM_TYPE_TO_FORM_KEY = createLookup({
  'EVA-foam': 'foamEva',
  'gel-infused-foam': 'foamGelInfused',
  'HR-foam': 'foamHr',
  'latex-foam': 'foamLatex',
  'memory-foam': 'foamMemory',
  'pe-epe': 'foamPeEpe',
  'pu-foam': 'foamPu',
  'rebonded-foam': 'foamRebonded',
});

const FIBER_TYPE_TO_FORM_KEY = createLookup({
  'Specialty-Fills': 'fiberSpecialityFill',
  'Wool-Natural': 'fiberWoolNatural',
  'Cotton-Fill': 'fiberCottonFill',
  'Down-Alternative': 'fiberDownAlternative',
  'Down-Feather': 'fiberDownFeather',
  'Microfiber-Fill': 'fiberMicrofiber',
  'Polyester-Fills': 'fiberPolyesterFill',
});

const ARTWORK_CATEGORY_TO_FORM_KEY = createLookup({
  'ANTI-COUNTERFEIT & HOLOGRAMS': 'artworksAntiCounterfeit',
  'BELLY BAND / WRAPPER': 'artworksBellyBand',
  'CARE & COMPOSITION': 'artworksCareComposition',
  'FLAMMABILITY / SAFETY LABELS': 'artworksFlammability',
  'HANG TAG SEALS / STRINGS': 'artworksHangtagSeals',
  // Header Card currently reuses the Insert Cards form in UQR.
  'HEADER CARD': 'artworksInsertCards',
  'HEAT TRANSFER LABELS': 'artworksHeatTransfer',
  'INSERT CARDS': 'artworksInsertCards',
  'LABELS (BRAND/MAIN)': 'artworksLabelMain',
  'LAW LABEL / CONTENTS TAG': 'artworksLawLabel',
  'PRICE TICKET / BARCODE TAG': 'artworksPriceTag',
  'QC / INSPECTION LABELS': 'artworksQcLabels',
  'RFID / SECURITY TAGS': 'artworksRfid',
  // Ribbons are grouped under Tags & Special Labels in current UQR forms.
  'RIBBONS': 'artworksTagsSpecial',
  'SIZE LABELS (INDIVIDUAL)': 'artworksSizeLabels',
  'TAGS & SPECIAL LABELS': 'artworksTagsSpecial',
  'UPC LABEL / BARCODE STICKER': 'artworksUpcLabel',
});

export const FORM_DISPLAY_NAME_BY_KEY = {
  artworksAntiCounterfeit: 'Anti-Counterfeit & Holograms',
  artworksBellyBand: 'Belly Band / Wrapper',
  artworksCareComposition: 'Care & Composition',
  artworksFlammability: 'Flammability / Safety Labels',
  artworksHangtagSeals: 'Hang Tag Seals / Strings',
  artworksHeatTransfer: 'Heat Transfer Labels',
  artworksInsertCards: 'Insert Cards',
  artworksLabelMain: 'Labels (Brand/Main)',
  artworksLawLabel: 'Law Label / Contents Tag',
  artworksPriceTag: 'Price Ticket / Barcode Tag',
  artworksQcLabels: 'QC / Inspection Labels',
  artworksRfid: 'RFID / Security Tags',
  artworksSizeLabels: 'Size Labels (Individual)',
  artworksTagsSpecial: 'Tags & Special Labels',
  artworksUpcLabel: 'UPC Label / Barcode Sticker',
  trimsBuckles: 'Buckles',
  trimsButtons: 'Buttons',
  trimsCableTies: 'Cable-Ties',
  trimsCordStops: 'Cord Stops',
  trimsFelt: 'Felt',
  trimsFrTrims: 'Fire Retardant (FR) Trims',
  trimsHooksEyes: 'Hooks-Eyes',
  trimsInterlining: 'Interlining (Fusing)',
  trimsLace: 'Lace',
  trimsMagneticClosure: 'Magnetic Closure',
  trimsNiwarWebbing: 'Niwar-Webbing',
  trimsPinBarbs: 'Pin-Barbs',
  trimsReflectiveTapes: 'Reflective Tapes',
  trimsRibbing: 'Ribbing',
  trimsRingsLoops: 'Rings-Loops',
  trimsRivets: 'Rivets',
  trimsSeamTape: 'Seam Tape',
  trimsShoulderPads: 'Shoulder Pads',
  trimsVelcro: 'Velcro',
  trimsZippers: 'Zippers',
  foamEva: 'EVA Foam',
  foamGelInfused: 'Gel-Infused Foam',
  foamHr: 'HR Foam',
  foamLatex: 'Latex Foam',
  foamMemory: 'Memory Foam',
  foamPeEpe: 'PE-EPE Foam',
  foamPu: 'PU Foam',
  foamRebonded: 'Rebonded Foam',
  fiberSpecialityFill: 'Speciality Fill',
  fiberWoolNatural: 'Wool Natural',
  fiberCottonFill: 'Cotton Fill',
  fiberDownAlternative: 'Down Alternative',
  fiberDownFeather: 'Down Feather',
  fiberMicrofiber: 'Microfiber Fill',
  fiberPolyesterFill: 'Polyester Fill',
  yarn: 'Yarn',
  fabric: 'Fabric',
};

export const ORDER_TYPE_SEQUENCE = ['Production', 'Sampling', 'Company'];

export const toCollectionArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
};

export const isQualityYes = (value) => {
  if (value === true || value === 1) return true;
  const normalized = normalizeValue(value);
  return normalized === 'yes' || normalized === 'true' || normalized === '1' || normalized === 'y';
};

export const getOrderTypeLabel = (value) => normalizeOrderType(value || '');

export const getFormDisplayName = (formKey, fallback = '') =>
  FORM_DISPLAY_NAME_BY_KEY[formKey] || fallback || formKey;

export const mapRawMaterialToFormKey = (material = {}) => {
  const materialType = normalizeValue(
    material.materialType || material.rawMaterialType || material.type || material.material_type
  );
  const trimType = normalizeValue(
    material.trimAccessory || material.trimType || material.trim_accessory || material.trimAccessoryType
  );
  const foamType = normalizeValue(
    material.foamTableType || material.foamType || material.foam_table_type
  );
  const fiberType = normalizeValue(
    material.fiberTableType || material.fiberType || material.fiber_table_type
  );

  if (materialType === 'yarn') return 'yarn';
  if (materialType === 'fabric') return 'fabric';
  if (materialType === 'foam' || materialType.includes('foam')) {
    return FOAM_TYPE_TO_FORM_KEY[foamType] || null;
  }
  if (materialType === 'fiber' || materialType.includes('fiber')) {
    return FIBER_TYPE_TO_FORM_KEY[fiberType] || null;
  }
  if (
    materialType === 'trim & accessory' ||
    materialType === 'trim&accessory' ||
    materialType === 'trim & accessories' ||
    materialType === 'trim and accessory' ||
    materialType.includes('trim')
  ) {
    return TRIM_TYPE_TO_FORM_KEY[trimType] || null;
  }
  return null;
};

export const mapArtworkCategoryToFormKey = (artworkCategory) =>
  ARTWORK_CATEGORY_TO_FORM_KEY[normalizeValue(artworkCategory)] || null;

// Which UQR forms a single IPC's step data requires: every raw material or
// artwork whose "quality inspected?" is Yes maps to its form key. Shared by the
// Consumption Sheet's share payload and the Generate flow's requirements sync so
// both compute the same set. Returns a sorted, de-duplicated array of form keys.
export const collectRequiredUqrFormsForStepData = (stepData) => {
  const formKeys = new Set();
  const sd = stepData || {};

  (sd.rawMaterials || []).forEach((material) => {
    const hasMaterialQualityYes = isQualityYes(material?.qualityVerification);
    const hasWorkOrderQualityYes = Array.isArray(material?.workOrders)
      && material.workOrders.some((workOrder) => isQualityYes(workOrder?.qualityVerification));
    if (!hasMaterialQualityYes && !hasWorkOrderQualityYes) return;

    const formKey = mapRawMaterialToFormKey(material);
    if (formKey) formKeys.add(formKey);
  });

  (sd.artworkMaterials || []).forEach((material) => {
    const artworkCategory = material?.artworkCategory;
    const qualityValue =
      material?.qualityVerificationByCategory?.[artworkCategory] ?? material?.qualityVerification;
    if (!isQualityYes(qualityValue)) return;

    const formKey = mapArtworkCategoryToFormKey(artworkCategory);
    if (formKey) formKeys.add(formKey);
  });

  return Array.from(formKeys).sort();
};

// Build the payload the UQR requirements-sync endpoint expects from the whole
// wizard formData: one entry per IPC (and per subproduct) with its required UQR
// form keys. Mirrors the IPC iteration in ConsumptionSheet.buildPurchaseSharePayload.
export const buildUqrRequirementsPayload = (formData = {}) => {
  const ipcs = [];
  const addIpc = (ipcCode, stepData) => {
    if (!ipcCode) return;
    ipcs.push({ ipcCode, uqrForms: collectRequiredUqrFormsForStepData(stepData) });
  };

  (formData.skus || []).forEach((sku, skuIndex) => {
    const ipcCode = sku.ipcCode || `IPC-${skuIndex + 1}`;
    addIpc(ipcCode, sku.stepData);
    (sku.subproducts || []).forEach((subproduct, spIndex) => {
      const spCode = `${(ipcCode || `IPC-${skuIndex + 1}`).replace(/\/SP-?\d+$/i, '')}/SP-${spIndex + 1}`;
      addIpc(spCode, subproduct.stepData);
    });
  });

  return {
    code: formData.ipoCode || formData.buyerCode || '',
    orderType: getOrderTypeLabel(formData.orderType || ''),
    ipcs,
  };
};
