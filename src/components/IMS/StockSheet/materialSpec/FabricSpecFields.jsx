// Fabric specification + advance-spec fields for the StockSheet "Add New" flow.
// Adapted from GenerateFactoryCode/components/steps/Step2.jsx (Fabric block) to run on
// local state via a (materialIndex, field, value) change handler — same prop shape as
// TrimAccessoryFields, so AddNewMaterials can treat all material types uniformly.
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TestingRequirementsInput } from "@/components/ui/testing-requirements-input";
import SearchableDropdown from "../../../GenerateFactoryCode/components/SearchableDropdown";
import AdvanceSpecButton from "../AdvanceSpecButton";
import { useMaterialOptions } from "../../../GenerateFactoryCode/utils/useMaterialOptions";
import {
  getTextileFabricFiberTypes,
  getTextileFabricNames,
  getFabricCompositionOptions,
  getFabricConstructionTypeOptions,
  getFabricWeaveKnitTypeOptions,
  getFabricApprovalOptions,
} from "../../../GenerateFactoryCode/data/textileFabricHelpers";
import {
  FIBER_CATEGORIES,
  ORIGINS,
} from "../../../GenerateFactoryCode/data/advancedFilterData";
import Reveal from "./Reveal";

const FABRIC_TESTING_REQUIREMENT_OPTIONS = [
  "Physical Properties",
  "Tensile Strength",
  "Tear strength",
  "Bursting Strength",
  "Abrasion Resistance",
  "Pilling Resistance",
  "Dimensional Stability",
  "Color Fastness",
];

const FabricSpecFields = ({
  material,
  materialIndex,
  handleChange,
  errors = {},
  errorPrefix = "",
}) => {
  const { mergeOptions, addCustomOption } = useMaterialOptions();
  const err = (key) => errors[`${errorPrefix}_${key}`];

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h3
          data-spec-anchor
          className="text-sm font-semibold text-foreground/90"
        >
          FABRIC SPECIFICATIONS
        </h3>
      </div>

      <div
        className="bg-card rounded-lg border border-border"
        style={{ padding: "1.25rem" }}
      >
        <div className="ss-fgrid" style={{ marginBottom: "1rem" }}>
          {/* Fiber Type */}
          <Field
            label="FIBER TYPE"
            required
            width="sm"
            error={err("fabricFiberType")}
          >
            <SearchableDropdown
              value={material.fabricFiberType || ""}
              onChange={(selectedFiberType) => {
                handleChange(
                  materialIndex,
                  "fabricFiberType",
                  selectedFiberType,
                );
                if (selectedFiberType !== material.fabricFiberType) {
                  handleChange(materialIndex, "fabricName", "");
                }
              }}
              options={mergeOptions(
                getTextileFabricFiberTypes(),
                "Fabric",
                "fabricFiberType",
              )}
              onCustomValue={(val) =>
                addCustomOption("Fabric", "fabricFiberType", "", val)
              }
              placeholder="Select or type Fiber Type"
              className={err("fabricFiberType") ? "border-red-600" : ""}
            />
          </Field>

          {/* Fabric Name */}
          <Field
            label="FABRIC NAME"
            required
            width="sm"
            error={err("fabricName")}
          >
            <SearchableDropdown
              value={material.fabricName || ""}
              onChange={(selectedFabricName) => {
                handleChange(materialIndex, "fabricName", selectedFabricName);
                if (selectedFabricName !== material.fabricName) {
                  handleChange(materialIndex, "fabricComposition", "");
                  handleChange(materialIndex, "constructionType", "");
                  handleChange(materialIndex, "weaveKnitType", "");
                  handleChange(materialIndex, "fabricApproval", []);
                }
              }}
              options={
                material.fabricFiberType
                  ? mergeOptions(
                      getTextileFabricNames(material.fabricFiberType),
                      "Fabric",
                      "fabricName",
                      material.fabricFiberType,
                    )
                  : []
              }
              onCustomValue={(val) =>
                addCustomOption(
                  "Fabric",
                  "fabricName",
                  material.fabricFiberType,
                  val,
                )
              }
              placeholder={
                material.fabricFiberType
                  ? "Select or type Fabric Name"
                  : "Select Fiber Type First"
              }
              disabled={!material.fabricFiberType}
              className={err("fabricName") ? "border-red-600" : ""}
            />
          </Field>

          {/* Composition */}
          <Field
            label="COMPOSITION"
            required
            width="sm"
            error={err("fabricComposition")}
          >
            <SearchableDropdown
              value={material.fabricComposition || ""}
              onChange={(value) =>
                handleChange(materialIndex, "fabricComposition", value)
              }
              options={
                material.fabricFiberType && material.fabricName
                  ? mergeOptions(
                      getFabricCompositionOptions(
                        material.fabricFiberType,
                        material.fabricName,
                      ),
                      "Fabric",
                      "fabricComposition",
                      `${material.fabricFiberType}|${material.fabricName}`,
                    )
                  : []
              }
              onCustomValue={(val) =>
                addCustomOption(
                  "Fabric",
                  "fabricComposition",
                  `${material.fabricFiberType}|${material.fabricName}`,
                  val,
                )
              }
              placeholder={
                material.fabricFiberType && material.fabricName
                  ? "Select or type Composition"
                  : "Select Fabric First"
              }
              disabled={!material.fabricFiberType || !material.fabricName}
              className={err("fabricComposition") ? "border-red-600" : ""}
            />
          </Field>

          {/* GSM */}
          <Field label="GSM" required width="sm" error={err("gsm")}>
            <Input
              type="text"
              value={material.gsm || ""}
              onChange={(e) =>
                handleChange(materialIndex, "gsm", e.target.value)
              }
              placeholder="e.g., 90"
              aria-invalid={!!err("gsm")}
            />
          </Field>

          {/* Testing Requirements */}
          <Field
            label="TESTING REQUIREMENTS"
            required
            width="lg"
            error={err("fabricTestingRequirements")}
          >
            <TestingRequirementsInput
              value={
                Array.isArray(material.fabricTestingRequirements)
                  ? material.fabricTestingRequirements
                  : material.fabricTestingRequirements
                    ? [String(material.fabricTestingRequirements).trim()]
                    : []
              }
              onChange={(arr) =>
                handleChange(materialIndex, "fabricTestingRequirements", arr)
              }
              options={FABRIC_TESTING_REQUIREMENT_OPTIONS}
              placeholder="Select or type Testing Requirements"
              className={
                err("fabricTestingRequirements") ? "border-red-600" : ""
              }
              error={!!err("fabricTestingRequirements")}
            />
          </Field>

          {/* Approval */}
          <Field
            label="APPROVAL"
            required
            width="sm"
            error={err("fabricApproval")}
          >
            <TestingRequirementsInput
              value={
                Array.isArray(material.fabricApproval)
                  ? material.fabricApproval
                  : material.fabricApproval
                    ? [String(material.fabricApproval).trim()]
                    : []
              }
              onChange={(arr) =>
                handleChange(materialIndex, "fabricApproval", arr)
              }
              options={
                material.fabricFiberType && material.fabricName
                  ? getFabricApprovalOptions(
                      material.fabricFiberType,
                      material.fabricName,
                    )
                  : []
              }
              placeholder={
                material.fabricFiberType && material.fabricName
                  ? "Select or type Approval"
                  : "Select Fabric First"
              }
              disabled={!material.fabricFiberType || !material.fabricName}
              className={err("fabricApproval") ? "border-red-600" : ""}
              error={!!err("fabricApproval")}
            />
          </Field>

          {/* Remarks */}
          <Field
            label="REMARKS"
            required
            width="sm"
            error={err("fabricRemarks")}
          >
            <Input
              type="text"
              value={material.fabricRemarks || ""}
              onChange={(e) =>
                handleChange(materialIndex, "fabricRemarks", e.target.value)
              }
              placeholder="Text"
              aria-invalid={!!err("fabricRemarks")}
            />
          </Field>
        </div>

        {/* Show/Hide Advance Spec Button */}
        <div style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>
          <AdvanceSpecButton
            active={material.showFabricAdvancedFilter}
            onClick={() =>
              handleChange(
                materialIndex,
                "showFabricAdvancedFilter",
                !material.showFabricAdvancedFilter,
              )
            }
          />
        </div>

        {/* Advanced Filter UI Table */}
        {material.showFabricAdvancedFilter && (
          <Reveal>
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1.5rem",
                backgroundColor: "var(--muted)",
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
              }}
            >
              <div className="ss-fgrid">
                {/* Construction Type */}
                <Field label="CONSTRUCTION TYPE" width="sm">
                  <SearchableDropdown
                    value={material.constructionType || ""}
                    onChange={(value) =>
                      handleChange(materialIndex, "constructionType", value)
                    }
                    options={
                      material.fabricFiberType && material.fabricName
                        ? mergeOptions(
                            getFabricConstructionTypeOptions(
                              material.fabricFiberType,
                              material.fabricName,
                            ),
                            "Fabric",
                            "constructionType",
                            `${material.fabricFiberType}|${material.fabricName}`,
                          )
                        : []
                    }
                    onCustomValue={(val) =>
                      addCustomOption(
                        "Fabric",
                        "constructionType",
                        `${material.fabricFiberType}|${material.fabricName}`,
                        val,
                      )
                    }
                    placeholder={
                      material.fabricFiberType && material.fabricName
                        ? "Select or type Construction Type"
                        : "Select Fabric First"
                    }
                    disabled={!material.fabricFiberType || !material.fabricName}
                  />
                </Field>

                {/* Weave/Knit Type */}
                <Field label="WEAVE/KNIT TYPE" width="sm">
                  <SearchableDropdown
                    value={material.weaveKnitType || ""}
                    onChange={(value) =>
                      handleChange(materialIndex, "weaveKnitType", value)
                    }
                    options={
                      material.fabricFiberType && material.fabricName
                        ? mergeOptions(
                            getFabricWeaveKnitTypeOptions(
                              material.fabricFiberType,
                              material.fabricName,
                            ),
                            "Fabric",
                            "weaveKnitType",
                            `${material.fabricFiberType}|${material.fabricName}`,
                          )
                        : []
                    }
                    onCustomValue={(val) =>
                      addCustomOption(
                        "Fabric",
                        "weaveKnitType",
                        `${material.fabricFiberType}|${material.fabricName}`,
                        val,
                      )
                    }
                    placeholder={
                      material.fabricFiberType && material.fabricName
                        ? "Select or type Weave/Knit Type"
                        : "Select Fabric First"
                    }
                    disabled={!material.fabricFiberType || !material.fabricName}
                  />
                </Field>

                {/* Machine Type */}
                <Field label="MACHINE TYPE" width="sm">
                  <SearchableDropdown
                    value={material.fabricMachineType || ""}
                    onChange={(value) =>
                      handleChange(materialIndex, "fabricMachineType", value)
                    }
                    options={[
                      "Powerloom",
                      "Handloom",
                      "Circular Knitting",
                      "Flatbed Knitting",
                      "Warp Knitting",
                      "Others",
                    ]}
                    placeholder="Select or type Machine Type"
                  />
                </Field>

                {/* Fiber Category */}
                <Field label="FIBER CATEGORY" width="sm">
                  <SearchableDropdown
                    value={material.fabricFiberCategory || ""}
                    onChange={(value) =>
                      handleChange(materialIndex, "fabricFiberCategory", value)
                    }
                    options={FIBER_CATEGORIES}
                    placeholder="Select or type Fiber Category"
                  />
                </Field>

                {/* Origin */}
                <Field label="ORIGIN" width="sm">
                  <SearchableDropdown
                    value={material.fabricOrigin || ""}
                    onChange={(value) =>
                      handleChange(materialIndex, "fabricOrigin", value)
                    }
                    options={ORIGINS}
                    placeholder="Select or type Origin"
                  />
                </Field>

                {/* Certification Requirement */}
                <Field
                  label="CERTIFICATION REQUIREMENT"
                  width="lg"
                  className="col-span-1 md:col-span-2 lg:col-span-2"
                >
                  <Input
                    type="text"
                    value={material.fabricCertifications || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "fabricCertifications",
                        e.target.value,
                      )
                    }
                    placeholder="Enter certificate label"
                  />
                </Field>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default FabricSpecFields;
