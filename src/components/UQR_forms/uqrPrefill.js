/**
 * UQR form prefill — map an IPC's wizard material data onto a UQR form.
 *
 * WHY THIS EXISTS: the committed factory-code read APIs do NOT carry the
 * descriptive material spec (fiber type, fabric name, composition, construction,
 * etc.) — those keys are dropped at commit and live only in the wizard/draft.
 * So the only reliable moment to capture them is at "Generate Factory Code":
 * `buildUqrRequirementsPayload` snapshots each required form's prefill here and
 * the sync endpoint stores it on the UQRRequirement. Both the Pending UQRs popup
 * and the manual UQR Forms page then read that snapshot to pre-fill the form.
 *
 * The mapping is field-name driven off `formConfig` so it covers every form:
 *   1. explicit ALIASES for names that differ (e.g. form "count" ← yarnCountRange);
 *   2. otherwise a normalized match (lowercase, strip a material-type prefix on
 *      both sides) so e.g. form "fiberType" ← material `fabricFiberType`.
 * Fabric and Yarn are verified end-to-end; other material forms fill whatever
 * their column names resolve to (at minimum MATERIAL TYPE/DESCRIPTION + USN).
 */
import { formsConfig } from './formConfig';
import { collectRequiredMaterialsByFormKey, getOrderTypeLabel } from '@/utils/uqrMappings';

// Fields the QC person fills during inspection (or that come from context / the
// logged-in user) — never auto-filled from the material even if a name matches.
const MANUAL_FIELDS = new Set([
  'date', 'time', 'qualityCheckedBy', 'approvedBy', 'inspectedBy',
  'uin', 'poNo', 'factoryPoCode',
  'invoiceQty', 'aqlMajorMinor', 'approvedAgainst',
  'result', 'remarks', 'moisturePercentage', 'shadeApproval', 'avgWeightDiff',
  'defect', 'defectAtMtrLength', 'major', 'minor', 'findings',
  'attachRefImage', 'lengthMeter', 'twist', 'tpi', 'yarnWeightFound',
  'usn',
]);

// Form field/column name → candidate material keys (first non-empty wins).
// Only needed where the names don't line up under the normalizer below.
const FIELD_ALIASES = {
  materialType: ['materialDescription', 'description', 'materialType'],
  materialTypeDescription: ['materialDescription', 'materialType'],
  certificationRequirement: [
    'fabricCertifications', 'certifications', 'yarnCertifications',
    'fiberCertifications', 'certification',
  ],
  widthCm: ['fabricWidth', 'width'],
  // Yarn table columns.
  count: ['yarnCountRange', 'countRange'],
  doubling: ['yarnDoublingOptions'],
  ply: ['yarnPlyOptions'],
  winding: ['windingOptions'],
};

const MATERIAL_PREFIXES = ['fabric', 'yarn', 'fibre', 'fiber', 'foam', 'trim', 'artwork', 'packaging'];

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const stripPrefix = (key) => {
  const low = String(key || '').toLowerCase();
  for (const p of MATERIAL_PREFIXES) {
    if (low.startsWith(p) && low.length > p.length) return key.slice(p.length);
  }
  return key;
};

// Coerce a material value to a form-ready string ('' when nothing usable).
const toText = (v) => {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.filter((x) => x != null && x !== '').join(', ');
  if (typeof v === 'object') return '';
  return String(v);
};

// Build a normalized {name -> value} lookup for one material, indexing each key
// both verbatim and with its material-type prefix stripped, so a form column can
// match either shape.
const buildLookup = (material) => {
  const lookup = {};
  Object.entries(material || {}).forEach(([key, value]) => {
    const text = toText(value);
    if (!text) return;
    const nk = norm(key);
    if (!(nk in lookup)) lookup[nk] = text;
    const ns = norm(stripPrefix(key));
    if (!(ns in lookup)) lookup[ns] = text;
  });
  return lookup;
};

// Resolve a single form field/column from a material (alias first, then normalized).
const resolveField = (fieldName, material, lookup) => {
  if (MANUAL_FIELDS.has(fieldName)) return '';
  const aliases = FIELD_ALIASES[fieldName];
  if (aliases) {
    for (const cand of aliases) {
      const text = toText(material?.[cand]);
      if (text) return text;
    }
  }
  return lookup[norm(fieldName)] ?? lookup[norm(stripPrefix(fieldName))] ?? '';
};

/**
 * Build a form's prefill ({ header, rows }) from the quality=Yes materials that
 * map to it. `header` fills the top fields from the first material; `rows` is one
 * table row per material.
 */
export const buildFormPrefill = (formKey, materials = []) => {
  const list = (materials || []).filter(Boolean);
  const config = formsConfig[formKey];
  if (!config || list.length === 0) return { header: {}, rows: [] };

  const headerFieldNames = (config.sections || []).flatMap((section) =>
    (section?.fields || []).map((field) => field.name),
  );
  const columnNames = (config.tableConfig?.columns || []).map((column) => column.name);

  // Header — from the first contributing material.
  const firstLookup = buildLookup(list[0]);
  const header = {};
  headerFieldNames.forEach((name) => {
    const value = resolveField(name, list[0], firstLookup);
    if (value) header[name] = value;
  });

  // Rows — one per material.
  const rows = list.map((material, index) => {
    const lookup = buildLookup(material);
    const row = {};
    columnNames.forEach((name) => {
      if (name === 'usn') return; // sequence set below
      const value = resolveField(name, material, lookup);
      if (value) row[name] = value;
    });
    if (columnNames.includes('usn') && !row.usn) row.usn = String(index + 1);
    return row;
  });

  return { header, rows };
};

/**
 * Build the payload the UQR requirements-sync endpoint expects from the whole
 * wizard formData: one entry per IPC (and per subproduct) carrying both the
 * required form keys (`uqrForms`) and, per form, its prefill snapshot (`forms`).
 * Mirrors the IPC iteration in ConsumptionSheet.buildPurchaseSharePayload.
 */
export const buildUqrRequirementsPayload = (formData = {}) => {
  const ipcs = [];

  const addIpc = (ipcCode, stepData) => {
    if (!ipcCode) return;
    const byKey = collectRequiredMaterialsByFormKey(stepData);
    const formKeys = Object.keys(byKey).sort();
    ipcs.push({
      ipcCode,
      uqrForms: formKeys,
      forms: formKeys.map((formKey) => ({
        formId: formKey,
        prefill: buildFormPrefill(formKey, byKey[formKey]),
      })),
    });
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