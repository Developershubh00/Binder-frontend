// Local, isolated version of the wizard's raw-material change handler — used by the
// StockSheet "Add New" flow so we can reuse the shared material-description generator
// without depending on GenerateFactoryCode's state. Mirrors the regen half of
// GenerateFactoryCode.jsx handleRawMaterialChange (cascade-clears stay in the field
// onChange handlers, exactly like Step2 does them in JSX).
import {
  generateMaterialDescription,
  getDescriptionSourceFields,
  isAutoDescriptionType,
  generatePackagingDescription,
  getPackagingDescriptionSourceFields,
  generateArtworkDescription,
  getArtworkDescriptionSourceFields,
} from "../../../GenerateFactoryCode/utils/materialDescription";

/**
 * Apply a single field change to a material object and regenerate its
 * auto-description when the changed field feeds the description.
 *
 * @param {object} material - current material object
 * @param {string} field    - field key being changed
 * @param {*} value         - new value
 * @returns {object} the updated material (new reference)
 */
export const applyMaterialChange = (material, field, value) => {
  const updated = { ...material, [field]: value };

  // Packaging materials live in their own spec namespace (keyed by
  // packagingMaterialType) and use a separate description generator.
  if (updated.materialType === "Packaging") {
    if (
      field === "packagingMaterialType" ||
      getPackagingDescriptionSourceFields(
        updated.packagingMaterialType,
      ).includes(field)
    ) {
      updated.materialDescription = generatePackagingDescription(updated);
    }
    return updated;
  }

  // Company Essentials has no spec-description generator; derive a readable description
  // from its primary item fields so the saved item isn't blank.
  if (updated.materialType === "CompanyEssentials") {
    updated.materialDescription =
      updated.item || updated.itemDescription || updated.machineType || "";
    return updated;
  }

  // Artwork & Labelling materials are keyed by artworkCategory and use their own generator.
  if (updated.materialType === "Artwork") {
    if (
      field === "artworkCategory" ||
      getArtworkDescriptionSourceFields(updated.artworkCategory).includes(field)
    ) {
      updated.materialDescription = generateArtworkDescription(updated);
    }
    return updated;
  }

  if (isAutoDescriptionType(updated.materialType)) {
    const isSource =
      field === "materialType" ||
      field === "subMaterial" ||
      field === "trimAccessory" ||
      getDescriptionSourceFields(
        updated.materialType,
        updated.trimAccessory,
      ).includes(field);
    if (isSource) {
      updated.materialDescription = generateMaterialDescription(updated);
    }
  }

  return updated;
};

// Advance-spec visibility flag per auto-description material type — clicking the
// read-only MATERIAL DESC field opens these so the source dropdowns become editable.
export const SPEC_ADVANCE_FLAG = {
  Fabric: "showFabricAdvancedFilter",
  Yarn: "showAdvancedFilter",
};

// Map the top-level StockSheet category to the wizard's materialType label.
export const CATEGORY_TO_MATERIAL_TYPE = {
  YARN: "Yarn",
  FABRIC: "Fabric",
  FIBER: "Fiber",
  FOAM: "Foam",
  TRIMS_ACCESSORY: "Trim & Accessory",
  PACKAGING: "Packaging",
  ARTWORK_LABELLING: "Artwork",
  COMPANY_ESSENTIALS: "CompanyEssentials",
};

// Material types this Add-New flow currently supports (Fiber/Foam/Artwork/Packaging/
// Company Essentials are deferred).
export const SUPPORTED_CATEGORIES = Object.keys(CATEGORY_TO_MATERIAL_TYPE);
