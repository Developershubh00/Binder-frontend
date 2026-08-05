// Column schemas for the Purchase Master CNS Sheet grid (Section 8 of spec).
//
// Each schema describes the columns for ONE (tab, category) pair. The
// <PurchaseGrid> renders rows using the schema, so we write each table ONCE
// here instead of 16 separate components.
//
// Column shape:
//   { key, label, align?, width?, editable?, formatter? }
// Editable columns PATCH back to /ims/purchase/line-items/{source_type}/{id}/

const fixedFront = (extra = []) => [
  { key: '_ipc', label: 'IPC#', align: 'left', width: 120, group: true },
  { key: '_select', label: '', align: 'center', width: 56 },
  ...extra,
];

// Render a stored percentage value (e.g. 5 → "5%"). Blank when absent.
export const fmtPercent = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `${n}%`;
};

const balanceCol = { key: '_balance', label: 'Balance Qty / Unit', align: 'right', width: 160 };
const unitCol = { key: 'unit', label: 'Unit', align: 'center', width: 96, editable: true };
// Rate (INR) / Unit — manual entry with an explicit Save button (handled by a
// dedicated cell in PurchaseGrid); persisted via PATCH to the line item.
const rateCol = { key: 'rate', label: 'Rate (INR) / Unit', align: 'right', width: 150 };

// Every grid ends with the same trailing pair: Balance Qty / Unit + Rate.
const tail = [balanceCol, rateCol];

export const TOP_TABS = [
  { key: 'raw_material', label: 'Raw Material' },
  { key: 'job_work', label: 'Job Work' },
  { key: 'artwork', label: 'Artwork & Labeling' },
  { key: 'packaging', label: 'Packaging' },
];

// Fixed chips. Artwork & Packaging are deliberately absent: their chips are the
// wizard categories the IPO actually has data for, sent by the backend as
// `categories` on the grid response (see DYNAMIC_CATEGORY_TABS below).
export const CATEGORY_CHIPS = {
  raw_material: [
    { key: 'yarn', label: 'Yarn' },
    { key: 'fabric', label: 'Fabric' },
    { key: 'fiber', label: 'Fiber' },
    { key: 'foam', label: 'Foam' },
    { key: 'trims', label: 'Trims' },
  ],
  // Job Work applies only to the processable raw-material categories.
  job_work: [
    { key: 'yarn', label: 'Yarn' },
    { key: 'fabric', label: 'Fabric' },
    { key: 'fiber', label: 'Fiber' },
    { key: 'foam', label: 'Foam' },
  ],
};

// Tabs whose chips come from the IPO's own data rather than a fixed list.
// One row is fetched per tab and the chips filter it client-side, so switching
// chips is instant instead of re-running the (expensive) Master CNS recompute.
export const DYNAMIC_CATEGORY_TABS = ['artwork', 'packaging'];

export const COLUMN_SCHEMAS = {
  // ------------------------- RAW MATERIAL ----------------------------------
  'raw_material:yarn': [
    ...fixedFront([
      { key: 'component', label: 'IPC / Component', align: 'left', width: 180 },
      { key: 'material_description', label: 'Material Description', align: 'left', width: 280 },
      // "Purchase Qty" is a grouped header spanning the full Master CNS Purchase
      // Qty breakdown. Gross CNS = Net CNS/PC × (1 + Gross Wastage %) — all fetched.
      { key: 'net_cns_pc', label: 'Net CNS / PC', align: 'right', width: 120, headerGroup: 'Purchase Qty' },
      { key: 'gross_wastage', label: 'Gross Wastage', align: 'right', width: 130, formatter: fmtPercent, headerGroup: 'Purchase Qty' },
      // Editable + autosave: fetched Gross CNS when the BOM has consumption; the
      // buyer can type/override the purchase qty when it's blank. Drives Balance.
      { key: 'purchase_qty', label: 'Gross CNS', align: 'right', width: 120, editable: true, headerGroup: 'Purchase Qty' },
      unitCol,
    ]),
    ...tail,
  ],

  // Fabric layout mirrors the "PURCHASE REQUIREMENT — FABRIC" spec sheet.
  // IPC# + Raw Material stay anchored (as elsewhere); the remaining columns
  // match the PDF: Component · Purchase Width · Gross Purchase Qty · Issued Qty
  // from Stock · Balance · Rate. All values are fetched from the IPO Master CNS
  // sheet (only Purchase Width stays editable + prefilled; Rate is manual).
  'raw_material:fabric': [
    ...fixedFront([
      { key: 'material_description', label: 'Raw Material', align: 'left', width: 280 },
      // Fetched from the IPO — the component this fabric maps to (Front Panel…).
      { key: 'component', label: 'Component', align: 'left', width: 180 },
      // Editable + prefilled from what was saved on IPO Master CNS.
      { key: 'purchase_width', label: 'Purchase Width', align: 'right', width: 150, editable: true },
      // Fetched (read-only) from the IPO Master CNS Fabric "Gross Purchase Qty"
      // field. This is the row's purchase basis: Balance = Gross Purchase Qty −
      // (issued from stock + partial VPO purchase).
      { key: 'purchase_qty', label: 'Gross Purchase Qty', align: 'right', width: 170 },
      // Fetched (read-only) — qty already issued to this IPO from existing stock.
      { key: 'issued_from_stock_qty', label: 'Issued Qty from Stock', align: 'right', width: 180 },
      unitCol,
    ]),
    ...tail,
  ],

  // Gross Length CNS stays fetched/read-only (derived from the BOM). Purchase
  // Width + Purchase Qty are buyer inputs — editable + autosave, prefilled from
  // the IPO Master CNS when present, typed when blank.
  'raw_material:fiber': [
    ...fixedFront([
      { key: 'material_description', label: 'Raw Material Description', align: 'left', width: 280 },
      { key: 'gross_length_cns', label: 'Gross Length CNS / Unit', align: 'right', width: 170 },
      { key: 'purchase_width', label: 'Purchase Width / Unit', align: 'right', width: 160, editable: true },
      { key: 'purchase_qty', label: 'Purchase Qty', align: 'right', width: 130, editable: true },
      unitCol,
    ]),
    ...tail,
  ],

  'raw_material:foam': [
    ...fixedFront([
      { key: 'material_description', label: 'Raw Material', align: 'left', width: 280 },
      { key: 'gross_length_cns', label: 'Gross Length CNS / Unit', align: 'right', width: 170 },
      { key: 'gross_weight_cns', label: 'Gross Weight CNS / Unit', align: 'right', width: 170 },
      { key: 'purchase_width', label: 'Purchase Width / Unit', align: 'right', width: 160, editable: true },
      { key: 'purchase_qty', label: 'Purchase Qty', align: 'right', width: 130, editable: true },
      unitCol,
    ]),
    ...tail,
  ],

  'raw_material:trims': [
    ...fixedFront([
      { key: 'material_description', label: 'Raw Material', align: 'left', width: 280 },
      { key: 'purchase_width', label: 'Purchase Width', align: 'right', width: 130, editable: true },
      { key: 'purchase_length_qty', label: 'Purchase Length Qty / Unit', align: 'right', width: 180, editable: true },
      { key: 'purchase_weight_qty', label: 'Purchase Weight Qty', align: 'right', width: 160, editable: true },
      { key: 'purchase_qty', label: 'Purchase Qty', align: 'right', width: 130, editable: true },
      unitCol,
    ]),
    ...tail,
  ],

  // ------------------------- ARTWORK & LABELING ----------------------------
  // Every artwork category shares these columns — the chip only narrows which
  // rows are shown, never which columns exist.
  artwork: [
    ...fixedFront([
      { key: 'material_description', label: 'Artwork / Label', align: 'left', width: 280 },
      // Fetched (read-only) — the Derived CNS Sheet's Gross CNS for this label.
      { key: 'gross_cns', label: 'Gross CNS', align: 'right', width: 130 },
      // Buyer inputs — editable + autosave, prefilled from Gross CNS.
      { key: 'purchase_width', label: 'Purchase Width / Unit', align: 'right', width: 160, editable: true },
      { key: 'purchase_qty', label: 'Purchase Qty', align: 'right', width: 130, editable: true },
      unitCol,
    ]),
    ...tail,
  ],

  // ------------------------- PACKAGING -------------------------------------
  packaging: [
    ...fixedFront([
      { key: 'material_description', label: 'Packaging', align: 'left', width: 280 },
      // Fetched (read-only) — Gross Total Mat Req from the Derived CNS Sheet.
      { key: 'gross_cns', label: 'Gross CNS', align: 'right', width: 130 },
      // Buyer input — editable + autosave, prefilled from Gross CNS.
      { key: 'purchase_qty', label: 'Purchase Qty', align: 'right', width: 130, editable: true },
      unitCol,
    ]),
    ...tail,
  ],
};

export const getColumnSchema = (tab, category) =>
  // Artwork / Packaging chips are data-driven, so their schema is keyed by tab
  // alone; Raw Material keeps a per-category layout.
  COLUMN_SCHEMAS[tab] || COLUMN_SCHEMAS[`${tab}:${category}`] || null;

// Material description rendering — pipe-delimited, category-specific. Render
// as stored (Section 11.2 of spec) but wrap nicely for long strings.
export const formatMaterialDescription = (category, value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};
