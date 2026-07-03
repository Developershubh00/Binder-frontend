// Packaging specification fields for the StockSheet "Add New" flow. Reuses the wizard's
// standalone PackagingMaterialTypeFields (the per-material part of Step5) — the packaging
// header / IPC selection / extra packs from Step5 are wizard/IPO concepts and are omitted.
// Same prop shape as the other *SpecFields: (materialIndex, field, value) change handler.
import SearchableDropdown from "../../GenerateFactoryCode/components/SearchableDropdown";
import PackagingMaterialTypeFields from "../../GenerateFactoryCode/components/PackagingMaterialTypeFields";
import Reveal from "./Reveal";

const PACKAGING_MATERIAL_TYPE_OPTIONS = [
  "CARTON BOX",
  "CORNER PROTECTORS",
  "EDGE PROTECTORS",
  "FOAM INSERT",
  "PALLET STRAP",
  "DIVIDER",
  "TAPE",
  "POLYBAG~POLYBAG-FLAP",
  "POLYBAG~Bale",
  "SILICA GEL DESICCANT",
  "SHRINK TAPE",
  "VOID~FILL",
  "SHIPPING MARK",
];

const PackagingSpecFields = ({
  material,
  materialIndex,
  handleChange,
  errors = {},
  errorPrefix = "",
}) => {
  const typeErrKey = `${errorPrefix}_packagingMaterialType`;

  return (
    <div style={{ marginTop: "2rem" }}>
      <div className="flex flex-col" style={{ width: 280, marginBottom: 24 }}>
        <label className="text-sm font-bold text-foreground mb-2">
          PACKAGING MATERIAL TYPE <span className="text-destructive">*</span>
        </label>
        <SearchableDropdown
          value={material.packagingMaterialType || ""}
          onChange={(value) =>
            handleChange(materialIndex, "packagingMaterialType", value)
          }
          options={PACKAGING_MATERIAL_TYPE_OPTIONS}
          placeholder="Select or type Material Type"
          style={{ width: 280 }}
          className={errors[typeErrKey] ? "border-destructive" : ""}
        />
        {errors[typeErrKey] && (
          <span className="text-destructive text-xs mt-1">{errors[typeErrKey]}</span>
        )}
      </div>

      {material.packagingMaterialType && (
        <Reveal>
        <div data-spec-anchor>
          <PackagingMaterialTypeFields
            material={material}
            materialIndex={materialIndex}
            onChange={(field, value) => handleChange(materialIndex, field, value)}
            errorKeyPrefix={errorPrefix}
            errors={errors}
            casepackQty=""
            productSelection={[]}
            skus={[]}
          />
        </div>
        </Reveal>
      )}
    </div>
  );
};

export default PackagingSpecFields;
