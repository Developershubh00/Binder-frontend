// Company Essentials spec fields for the StockSheet "Add New" flow. Mirrors the
// per-item fields + category-driven visibility rules from src/components/CompanyEssentials.jsx
// (its submission workflow — preview modal, taken-by/payment, code generation — is omitted).
// Runs on local state via a (materialIndex, field, value) change handler, same prop shape as
// the other *SpecFields. NOTE: the needsX flags use the underscore category values
// (QC_TOOLS / TRAVEL_EXPENSE) — the original used spaced strings that never matched.
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SearchableDropdown from "../../GenerateFactoryCode/components/SearchableDropdown";
import Reveal from "./Reveal";

const CE_CATEGORIES = [
  "STATIONARY",
  "PANTRY",
  "MACHINERY",
  "HOUSEKEEPING",
  "ELECTRICALS",
  "HARDWARE_CHEMICALS",
  "AUDIT_COMPLIANCE",
  "IT",
  "QC_TOOLS",
  "TRAVEL_EXPENSE",
  "REPAIR",
  "MAINTENANCE",
];
const UNIT_OPTIONS = ["KGS", "LITRE", "METER", "PCS"];
const FOR_OPTIONS = ["COMPANY", "COMPANY/GUEST", "GUEST"];
const DEPARTMENT_OPTIONS = [
  "BRAIDING", "CARPET", "CUTTING", "DYEING", "EMBROIDERY", "KNITTING",
  "PRINTING", "QUILTING", "SEWING", "TUFTING", "WEAVING",
];

const CompanyEssentialsSpecFields = ({
  material,
  materialIndex,
  handleChange,
  errors = {},
  errorPrefix = "",
}) => {
  const set = (field, value) => handleChange(materialIndex, field, value);
  const err = (key) => errors[`${errorPrefix}_${key}`];
  const cat = material.ceCategory || "";

  const needsMachineFields = cat === "MACHINERY" || cat === "QC_TOOLS";
  const needsDepartment = needsMachineFields;
  const needsForField = cat === "PANTRY" || cat === "TRAVEL_EXPENSE";
  const needsAmount = cat === "TRAVEL_EXPENSE";
  const needsItem = cat === "PANTRY";
  const needsJobWork = cat === "REPAIR" || cat === "MAINTENANCE";

  const onImage = (file) => {
    if (!file) return;
    set("referenceImage", file);
    const reader = new FileReader();
    reader.onloadend = () => set("referenceImagePreview", reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <div className="flex flex-col" style={{ width: 280, marginBottom: 20 }}>
        <label className="text-sm font-bold text-foreground mb-2">
          CATEGORY <span className="text-destructive">*</span>
        </label>
        <SearchableDropdown
          value={cat}
          onChange={(value) => set("ceCategory", value)}
          options={CE_CATEGORIES}
          placeholder="Select or search category"
          className={err("ceCategory") ? "border-destructive" : ""}
        />
      </div>

      {cat && (
        <Reveal>
        <div data-spec-anchor className="ss-fgrid">
          {needsDepartment && (
            <Field label="DEPARTMENT" width="sm" error={err("department")}>
              <SearchableDropdown
                value={material.department || ""}
                onChange={(value) => set("department", value)}
                options={DEPARTMENT_OPTIONS}
                placeholder="Enter or select department"
                className={err("department") ? "border-destructive" : ""}
              />
            </Field>
          )}

          {!needsMachineFields && (
            <Field
              label={needsItem ? "ITEM" : needsJobWork ? "JOB WORK" : "ITEM DESCRIPTION"}
              width="md"
              error={err(needsItem ? "item" : "itemDescription")}
            >
              <Input
                type="text"
                value={needsItem ? material.item || "" : material.itemDescription || ""}
                onChange={(e) =>
                  set(needsItem ? "item" : "itemDescription", e.target.value)
                }
                placeholder={`Enter ${needsItem ? "item" : needsJobWork ? "job work" : "item description"}`}
                aria-invalid={!!err(needsItem ? "item" : "itemDescription")}
              />
            </Field>
          )}

          {needsMachineFields && (
            <>
              <Field label="MACHINE TYPE" width="md" error={err("machineType")}>
                <Input
                  type="text"
                  value={material.machineType || ""}
                  onChange={(e) => set("machineType", e.target.value)}
                  placeholder="Enter machine type"
                  aria-invalid={!!err("machineType")}
                />
              </Field>
              <Field label="COMPONENT SPEC" width="md" error={err("componentSpec")}>
                <Input
                  type="text"
                  value={material.componentSpec || ""}
                  onChange={(e) => set("componentSpec", e.target.value)}
                  placeholder="Enter component specification"
                  aria-invalid={!!err("componentSpec")}
                />
              </Field>
            </>
          )}

          <Field
            label={needsAmount ? "AMOUNT" : "QTY"}
            width="sm"
            error={err(needsAmount ? "amount" : "qty")}
          >
            <Input
              type="number"
              value={needsAmount ? material.amount || "" : material.qty || ""}
              onChange={(e) => set(needsAmount ? "amount" : "qty", e.target.value)}
              placeholder={needsAmount ? "Enter amount" : "Enter quantity"}
              aria-invalid={!!err(needsAmount ? "amount" : "qty")}
            />
          </Field>

          {!needsAmount && (
            <Field label="UNIT" width="sm" error={err("unit")}>
              <SearchableDropdown
                value={material.unit || ""}
                onChange={(value) => set("unit", value)}
                options={UNIT_OPTIONS}
                placeholder="Select unit"
                className={err("unit") ? "border-destructive" : ""}
              />
            </Field>
          )}

          {needsForField && (
            <Field label="FOR" width="md">
              {cat === "PANTRY" ? (
                <SearchableDropdown
                  value={material.forField || ""}
                  onChange={(value) => set("forField", value)}
                  options={FOR_OPTIONS}
                  placeholder="Select option"
                />
              ) : (
                <Input
                  type="text"
                  value={material.forField || ""}
                  onChange={(e) => set("forField", e.target.value)}
                  placeholder="Enter value"
                />
              )}
            </Field>
          )}

          <Field label="REMARKS" width="md">
            <Input
              type="text"
              value={material.remarks || ""}
              onChange={(e) => set("remarks", e.target.value)}
              placeholder="Enter remarks"
            />
          </Field>

          <Field label="REF IMAGE" width="md">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImage(e.target.files?.[0])}
                className="hidden"
                id={`ce-upload-${materialIndex}`}
              />
              <label
                htmlFor={`ce-upload-${materialIndex}`}
                className="inline-flex h-11 min-w-[120px] cursor-pointer items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground/80 shadow-xs transition-colors hover:bg-accent"
              >
                {material.referenceImage ? "UPLOADED" : "UPLOAD"}
              </label>
              {material.referenceImagePreview && (
                <div className="h-[50px] w-[50px] overflow-hidden rounded-md border border-border bg-muted">
                  <img
                    src={material.referenceImagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </Field>
        </div>
        </Reveal>
      )}
    </div>
  );
};

export default CompanyEssentialsSpecFields;
