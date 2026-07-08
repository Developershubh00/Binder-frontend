// Maps manually-built "Add New" materials into the StockSheet payload shape
// (items[] + item_columns + details) and validates required spec fields per type.

const isEmpty = (v) =>
  v === undefined ||
  v === null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

const isUiFlag = (key) => key.startsWith("show");
const isFile = (v) => typeof File !== "undefined" && v instanceof File;
// Inline base64 image previews are huge and would bloat the JSON payload; skip them
// (the File itself is recorded by name).
const isInlineDataUrl = (v) => typeof v === "string" && v.startsWith("data:");

// Keys handled at the item level (not duplicated into details).
const SKIP_DETAIL_KEYS = new Set(["materialType", "materialDescription", "unit"]);

const humanize = (key) =>
  key
    .replace(/([A-Z]+)/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

const toDisplay = (v) => {
  if (Array.isArray(v)) return v.join(", ");
  if (isFile(v)) return v.name;
  if (v && typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
};

/**
 * Build { items, item_columns } from the manually-entered materials.
 * Each material → one item; non-empty spec fields become `details` and drive the
 * shared `item_columns` so MasterStockSheet renders them as columns.
 */
export const buildItemsFromMaterials = (materials) => {
  const columnKeys = [];
  const items = (materials || []).map((m, i) => {
    const details = {};
    Object.entries(m).forEach(([k, v]) => {
      if (SKIP_DETAIL_KEYS.has(k) || isUiFlag(k)) return;
      if (isEmpty(v) || isInlineDataUrl(v)) return;
      details[k] = toDisplay(v);
      if (!columnKeys.includes(k)) columnKeys.push(k);
    });
    return {
      sr_no: i + 1,
      material_description: m.materialDescription || "",
      unit: m.unit || "",
      details,
      image: null,
    };
  });
  const item_columns = columnKeys.map((k) => ({ key: k, label: humanize(k) }));
  return { items, item_columns };
};

// Required spec fields per material type (mirrors the required markers in Step2).
const REQUIRED = {
  Fabric: [
    "fabricFiberType",
    "fabricName",
    "fabricComposition",
    "gsm",
    "fabricTestingRequirements",
    "fabricApproval",
    "fabricRemarks",
  ],
  "Trim & Accessory": ["trimAccessory"],
  // Foam/Fiber have subtype-dependent fields; require at least the subtype selector.
  Foam: ["foamTableType"],
  Fiber: ["fiberTableType"],
  // Packaging fields depend on the material type; require at least that selector.
  Packaging: ["packagingMaterialType"],
  // Artwork fields depend on the category; require at least that selector.
  Artwork: ["artworkCategory"],
  // Company Essentials fields depend on the sub-category; require at least that.
  CompanyEssentials: ["ceCategory"],
};

const yarnRequired = (m) =>
  m.subMaterial === "Stitching Thread"
    ? ["stitchingThreadQty", "stitchingThreadUnit"]
    : [
        "fiberType",
        "yarnType",
        "yarnComposition",
        "yarnCountRange",
        "yarnDoublingOptions",
        "yarnPlyOptions",
        "windingOptions",
        "testingRequirements",
        "approval",
        "remarks",
      ];

/**
 * Validate the materials for a given material type. Returns { errors, isValid }.
 * Error keys are `item_<index>_<field>` to match the field components' errorPrefix.
 */
export const validateMaterials = (materials, materialType) => {
  const errors = {};
  if (!materials || materials.length === 0) {
    return { errors, isValid: false, message: "Add at least one material." };
  }

  materials.forEach((m, index) => {
    const required =
      materialType === "Yarn" ? yarnRequired(m) : REQUIRED[materialType] || [];
    // Unit is required for every material except Packaging (which carries its own
    // per-type dimension units inside PackagingMaterialTypeFields).
    const noUnit =
      materialType === "Packaging" ||
      materialType === "Artwork" ||
      materialType === "CompanyEssentials";
    const keysToCheck = noUnit ? required : [...required, "unit"];
    keysToCheck.forEach((key) => {
      if (isEmpty(m[key])) {
        errors[`item_${index}_${key}`] = "Required";
      }
    });
  });

  return { errors, isValid: Object.keys(errors).length === 0 };
};
