// Master-sheet product category → 2-letter code map.
//
// Single source of truth on the frontend for the "MASTER SHEET CATEGORY CODE"
// table, used to build the `HH` segment of a VPO code
// (VPO-CHD/PD/646A/111/HH/VPO-1).
//
// Mirrors the backend map at
// inventory_management/vpo_code/category_codes.py — keep the two in sync.

// Ordered exactly as the master sheet (S.NO 1..28).
export const CATEGORY_CODE_MAP = {
  RUG: "AA",
  BATHRUG: "BB",
  BATHMAT: "CC",
  CARPET: "DD",
  "TREE SKIRT": "EE",
  "TOTE BAGS": "FF",
  BAGS: "GG",
  CUSHION: "HH",
  APRON: "II",
  "TABLE RUNNER": "JJ",
  PLACEMAT: "KK",
  "KITCHEN GLOVES": "LL",
  THROW: "MM",
  BLANKETS: "NN",
  COMFORTER: "OO",
  QUILT: "PP",
  DUVET: "QQ",
  "SHEET SET": "RR",
  CURTAIN: "SS",
  "SHOWER CURTAIN": "TT",
  BATHROB: "UU",
  TOWEL: "VV",
  BASKET: "WW",
  OTTOMAN: "XX",
  "PET BED": "YY",
  "SOFT TOY": "ZZ",
  "FLOOR CUSHION": "AB",
  CHAIRPAD: "AC",
};

// Emitted when the product category is missing or unrecognised. Deliberately
// NOT one of the real codes above.
export const UNKNOWN_CATEGORY_CODE = "NA";

// Uppercase, trim, collapse internal whitespace for map lookups.
export const normalizeCategory = (name) =>
  name ? String(name).trim().toUpperCase().replace(/\s+/g, " ") : "";

// Return the 2-letter master code for a product category name. Accepts a plain
// category ("CUSHION"), the searchable-dropdown label ("CUSHION HH"), or messy
// casing/spacing. Falls back to UNKNOWN_CATEGORY_CODE.
export const categoryToCode = (name) => {
  const key = normalizeCategory(name);
  if (!key) return UNKNOWN_CATEGORY_CODE;
  if (CATEGORY_CODE_MAP[key]) return CATEGORY_CODE_MAP[key];

  // Dropdown label form "CATEGORY CODE" (e.g. "CUSHION HH") — drop the trailing
  // token and retry.
  const idx = key.lastIndexOf(" ");
  if (idx > 0) {
    const head = key.slice(0, idx);
    if (CATEGORY_CODE_MAP[head]) return CATEGORY_CODE_MAP[head];
  }
  return UNKNOWN_CATEGORY_CODE;
};