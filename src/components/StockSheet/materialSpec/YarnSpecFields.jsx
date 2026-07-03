// Yarn specification + advance-spec fields for the StockSheet "Add New" flow.
// Adapted from GenerateFactoryCode/components/steps/Step2.jsx (Yarn block) to run on
// local state via a (materialIndex, field, value) change handler — same prop shape as
// TrimAccessoryFields. Consumption-only fields (Net CNS, Procurement Date, Quality
// Verification) are intentionally omitted; the stitching-thread inputs are rendered with
// the shared ui/ primitives for consistency.
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PercentInput } from "@/components/ui/percent-input";
import { TestingRequirementsInput } from "@/components/ui/testing-requirements-input";
import SearchableDropdown from "../../GenerateFactoryCode/components/SearchableDropdown";
import AdvanceSpecButton from "../AdvanceSpecButton";
import { useMaterialOptions } from "../../GenerateFactoryCode/utils/useMaterialOptions";
import {
  getFiberTypes,
  getYarnTypes,
  getYarnDetails,
  getYarnCompositionOptions,
  getYarnCountRangeOptions,
  getYarnDoublingOptions,
  getYarnPlyOptions,
  getYarnWindingOptions,
  getYarnSpinningMethodOptions,
} from "../../GenerateFactoryCode/utils/yarnHelpers";
import { MATERIAL_APPROVAL_OPTIONS } from "../../GenerateFactoryCode/data/approvalOptions";
import {
  FIBER_CATEGORIES,
  ORIGINS,
} from "../../GenerateFactoryCode/data/advancedFilterData";
import Reveal from "./Reveal";

const YARN_TESTING_REQUIREMENT_OPTIONS = [
  "Linear density",
  "Strength",
  "Twist per unit length",
  "Evenness/Irregularity",
  "Yarn Hairiness",
  "Moisture Regain/Content",
];

const STITCHING_TESTING_OPTIONS = [
  "Tensile Strength",
  "Elongation",
  "Abrasion",
  "Colour Fastness",
];

const YarnSpecFields = ({
  material,
  materialIndex,
  handleChange,
  errors = {},
  errorPrefix = "",
}) => {
  const { mergeOptions, addCustomOption } = useMaterialOptions();
  const err = (key) => errors[`${errorPrefix}_${key}`];
  const isStitching = material.subMaterial === "Stitching Thread";

  return (
    <div style={{ marginTop: "2rem" }}>
      {/* Sub-material */}
      <Field label="SUB-MATERIAL" width="sm">
        <SearchableDropdown
          value={material.subMaterial || ""}
          onChange={(selectedSubMaterial) => {
            handleChange(materialIndex, "subMaterial", selectedSubMaterial);
            if (selectedSubMaterial === "Stitching Thread") {
              handleChange(materialIndex, "fiberType", "");
              handleChange(materialIndex, "yarnType", "");
            }
          }}
          options={["Stitching Thread"]}
          placeholder="Select sub-material (optional)"
        />
      </Field>

      {/* Stitching Thread specifications */}
      {isStitching && (
        <Reveal>
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.25rem",
              backgroundColor: "var(--muted)",
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
            }}
          >
            <h4
              data-spec-anchor
              className="text-sm font-semibold text-foreground/90"
              style={{ marginBottom: "1rem" }}
            >
              STITCHING THREAD SPECIFICATIONS
            </h4>
            <div className="ss-fgrid">
              <Field label="TYPE" width="sm">
                <SearchableDropdown
                  value={material.stitchingThreadType || ""}
                  onChange={(v) =>
                    handleChange(materialIndex, "stitchingThreadType", v)
                  }
                  options={[
                    "Spun Polyester",
                    "Cotton",
                    "Core Spun",
                    "Nylon/Polyamide",
                    "Textured",
                    "Bonded",
                  ]}
                  placeholder="Select or type"
                />
              </Field>

              <Field label="FIBRE CONTENT" width="sm">
                <SearchableDropdown
                  value={material.stitchingThreadFibreContent || ""}
                  onChange={(v) =>
                    handleChange(
                      materialIndex,
                      "stitchingThreadFibreContent",
                      v,
                    )
                  }
                  options={[
                    "100% Spun Poly",
                    "100% Cotton",
                    "Poly/Cotton Core",
                    "100% Nylon",
                  ]}
                  placeholder="Select or type"
                />
              </Field>

              <Field label="COUNT/TICKET" width="sm">
                <SearchableDropdown
                  value={material.stitchingThreadCountTicket || ""}
                  onChange={(v) =>
                    handleChange(materialIndex, "stitchingThreadCountTicket", v)
                  }
                  options={[
                    "Ticket No. (T-70)",
                    "40/2",
                    "60/3",
                    "120/2",
                    "Metric (Nm)",
                  ]}
                  placeholder="Select or type"
                />
              </Field>

              <Field label="USE TYPE" width="sm">
                <SearchableDropdown
                  value={material.stitchingThreadUseType || ""}
                  onChange={(v) =>
                    handleChange(materialIndex, "stitchingThreadUseType", v)
                  }
                  options={[
                    "Main Seam",
                    "Overlock",
                    "Embroidery",
                    "Top Stitch",
                    "Buttonhole",
                    "Bartack",
                  ]}
                  placeholder="Select or type"
                />
              </Field>

              <Field label="TEX" width="sm">
                <Input
                  type="text"
                  value={material.stitchingThreadTex || ""}
                  onChange={(e) =>
                    handleChange(
                      materialIndex,
                      "stitchingThreadTex",
                      e.target.value,
                    )
                  }
                  placeholder="Enter TEX"
                />
              </Field>

              <Field label="PLY" width="sm">
                <SearchableDropdown
                  value={material.stitchingThreadPly || ""}
                  onChange={(v) =>
                    handleChange(materialIndex, "stitchingThreadPly", v)
                  }
                  options={["2 Ply", "3 Ply", "4 Ply"]}
                  placeholder="Select or type"
                />
              </Field>

              <Field label="COLOUR" width="sm">
                <SearchableDropdown
                  value={material.stitchingThreadColour || ""}
                  onChange={(v) =>
                    handleChange(materialIndex, "stitchingThreadColour", v)
                  }
                  options={["Pantone TPX/TCX", "Shade Card Reference", "DTM"]}
                  placeholder="Select or type"
                />
              </Field>

              <Field label="REF" width="sm">
                <Input
                  type="text"
                  value={material.stitchingThreadRef || ""}
                  onChange={(e) =>
                    handleChange(
                      materialIndex,
                      "stitchingThreadRef",
                      e.target.value,
                    )
                  }
                  placeholder="Enter reference"
                />
              </Field>

              <Field label="TESTING REQUIREMENTS" width="lg">
                <TestingRequirementsInput
                  value={
                    Array.isArray(material.stitchingThreadTestingRequirements)
                      ? material.stitchingThreadTestingRequirements
                      : []
                  }
                  onChange={(arr) =>
                    handleChange(
                      materialIndex,
                      "stitchingThreadTestingRequirements",
                      arr,
                    )
                  }
                  options={STITCHING_TESTING_OPTIONS}
                  placeholder="Select or type Testing Requirements"
                />
              </Field>

              <Field label="QTY (CNS)" width="sm">
                <Input
                  type="text"
                  value={material.stitchingThreadQty ?? ""}
                  onChange={(e) =>
                    handleChange(
                      materialIndex,
                      "stitchingThreadQty",
                      e.target.value,
                    )
                  }
                  placeholder="Enter quantity"
                />
              </Field>

              <Field label="UNIT" width="sm">
                <SearchableDropdown
                  value={material.stitchingThreadUnit || ""}
                  onChange={(v) =>
                    handleChange(materialIndex, "stitchingThreadUnit", v)
                  }
                  options={["Yardage", "Kgs"]}
                  placeholder="Select unit"
                />
              </Field>

              <Field label="SURPLUS %" width="sm">
                <PercentInput
                  value={material.stitchingThreadSurplus || ""}
                  onChange={(e) =>
                    handleChange(
                      materialIndex,
                      "stitchingThreadSurplus",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., 5"
                />
              </Field>

              <Field label="WASTAGE %" width="sm">
                <PercentInput
                  value={material.stitchingThreadWastage || ""}
                  onChange={(e) =>
                    handleChange(
                      materialIndex,
                      "stitchingThreadWastage",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., 3"
                />
              </Field>

              <Field label="APPROVAL" width="sm">
                <SearchableDropdown
                  value={material.stitchingThreadApproval || ""}
                  onChange={(v) =>
                    handleChange(materialIndex, "stitchingThreadApproval", v)
                  }
                  options={MATERIAL_APPROVAL_OPTIONS}
                  placeholder="Select or type"
                />
              </Field>

              <Field label="REMARKS" width="lg">
                <Input
                  type="text"
                  value={material.stitchingThreadRemarks || ""}
                  onChange={(e) =>
                    handleChange(
                      materialIndex,
                      "stitchingThreadRemarks",
                      e.target.value,
                    )
                  }
                  placeholder="Enter remarks"
                />
              </Field>
            </div>

            {/* Advance Spec */}
            <div style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>
              <AdvanceSpecButton
                active={material.showStitchingThreadAdvancedSpec}
                onClick={() =>
                  handleChange(
                    materialIndex,
                    "showStitchingThreadAdvancedSpec",
                    !material.showStitchingThreadAdvancedSpec,
                  )
                }
              />
            </div>
            {material.showStitchingThreadAdvancedSpec && (
              <div
                className="ss-fgrid"
                style={{
                  padding: "1.25rem",
                  backgroundColor: "var(--card)",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--border)",
                }}
              >
                <Field label="FINISH" width="sm">
                  <SearchableDropdown
                    value={material.stitchingThreadFinish || ""}
                    onChange={(v) =>
                      handleChange(materialIndex, "stitchingThreadFinish", v)
                    }
                    options={[
                      "Bonded",
                      "Lubricated",
                      "Matte",
                      "Glossy",
                      "Mercerized",
                      "Soft",
                    ]}
                    placeholder="Select or type"
                  />
                </Field>
                <Field label="BRAND" width="sm">
                  <SearchableDropdown
                    value={material.stitchingThreadBrand || ""}
                    onChange={(v) =>
                      handleChange(materialIndex, "stitchingThreadBrand", v)
                    }
                    options={[
                      "Coats",
                      "A&E",
                      "Gunold",
                      "Madeira",
                      "Unbranded",
                      "Others",
                    ]}
                    placeholder="Select or type"
                  />
                </Field>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {/* Fiber Type → Yarn Type hierarchy (non-stitching) */}
      {!isStitching && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4
            className="text-sm font-semibold text-foreground/90"
            style={{ marginBottom: "1rem" }}
          >
            FIBER SPECIFICATIONS
          </h4>
          <div className="ss-fgrid">
            <Field
              label="FIBER TYPE"
              required
              width="sm"
              error={err("fiberType")}
            >
              <SearchableDropdown
                value={material.fiberType || ""}
                onChange={(selectedFiberType) => {
                  handleChange(materialIndex, "fiberType", selectedFiberType);
                  if (selectedFiberType !== material.fiberType) {
                    handleChange(materialIndex, "yarnType", "");
                    handleChange(materialIndex, "spinningMethod", "");
                    handleChange(materialIndex, "spinningType", "");
                  }
                }}
                options={mergeOptions(getFiberTypes(), "Yarn", "fiberType")}
                onCustomValue={(val) =>
                  addCustomOption("Yarn", "fiberType", "", val)
                }
                placeholder="Select or type Fiber Type"
                className={err("fiberType") ? "border-red-600" : ""}
              />
            </Field>

            <Field
              label="YARN TYPE"
              required
              width="sm"
              error={err("yarnType")}
            >
              <SearchableDropdown
                value={material.yarnType || ""}
                onChange={(selectedYarnType) => {
                  handleChange(materialIndex, "yarnType", selectedYarnType);
                  if (selectedYarnType !== material.yarnType) {
                    handleChange(materialIndex, "yarnComposition", "");
                    handleChange(materialIndex, "yarnCountRange", "");
                    handleChange(materialIndex, "yarnDoublingOptions", "");
                    handleChange(materialIndex, "yarnPlyOptions", "");
                    handleChange(materialIndex, "spinningMethod", "");
                    handleChange(materialIndex, "spinningType", "");
                    handleChange(materialIndex, "windingOptions", "");
                  }
                }}
                options={
                  material.fiberType
                    ? mergeOptions(
                        getYarnTypes(material.fiberType),
                        "Yarn",
                        "yarnType",
                        material.fiberType,
                      )
                    : []
                }
                onCustomValue={(val) =>
                  addCustomOption("Yarn", "yarnType", material.fiberType, val)
                }
                placeholder={
                  material.fiberType
                    ? "Select or type Yarn Type"
                    : "Select Fiber Type First"
                }
                disabled={!material.fiberType}
                error={Boolean(err("yarnType"))}
                className={err("yarnType") ? "border-red-600" : ""}
              />
            </Field>
          </div>

          {/* Yarn specifications (once fiber + yarn type selected) */}
          {material.fiberType &&
            material.yarnType &&
            (() => {
              const details = getYarnDetails(
                material.fiberType,
                material.yarnType,
              );
              if (!details) return null;
              return (
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
                    <h4
                      data-spec-anchor
                      className="text-sm font-semibold text-foreground/90"
                      style={{ marginBottom: "1.5rem" }}
                    >
                      YARN SPECIFICATIONS
                    </h4>
                    <div className="ss-fgrid">
                      <Field
                        label="COMPOSITION"
                        required
                        width="sm"
                        error={err("yarnComposition")}
                      >
                        <SearchableDropdown
                          value={material.yarnComposition || ""}
                          onChange={(v) =>
                            handleChange(materialIndex, "yarnComposition", v)
                          }
                          options={getYarnCompositionOptions(
                            material.fiberType,
                            material.yarnType,
                          )}
                          placeholder="Select or type Composition"
                          className={
                            err("yarnComposition") ? "border-red-600" : ""
                          }
                        />
                      </Field>

                      <Field
                        label="COUNT RANGE"
                        required
                        width="sm"
                        error={err("yarnCountRange")}
                      >
                        <SearchableDropdown
                          value={material.yarnCountRange || ""}
                          onChange={(v) =>
                            handleChange(materialIndex, "yarnCountRange", v)
                          }
                          options={getYarnCountRangeOptions(
                            material.fiberType,
                            material.yarnType,
                          )}
                          placeholder="Select or type Count Range"
                          className={
                            err("yarnCountRange") ? "border-red-600" : ""
                          }
                        />
                      </Field>

                      <Field
                        label="DOUBLING OPTIONS"
                        required
                        width="sm"
                        error={err("yarnDoublingOptions")}
                      >
                        <SearchableDropdown
                          value={material.yarnDoublingOptions || ""}
                          onChange={(v) =>
                            handleChange(
                              materialIndex,
                              "yarnDoublingOptions",
                              v,
                            )
                          }
                          options={getYarnDoublingOptions(
                            material.fiberType,
                            material.yarnType,
                          )}
                          placeholder="Select or type Doubling Options"
                          className={
                            err("yarnDoublingOptions") ? "border-red-600" : ""
                          }
                        />
                      </Field>

                      <Field
                        label="PLY OPTIONS"
                        required
                        width="sm"
                        error={err("yarnPlyOptions")}
                      >
                        <SearchableDropdown
                          value={material.yarnPlyOptions || ""}
                          onChange={(v) =>
                            handleChange(materialIndex, "yarnPlyOptions", v)
                          }
                          options={getYarnPlyOptions(
                            material.fiberType,
                            material.yarnType,
                          )}
                          placeholder="Select or type Ply Options"
                          className={
                            err("yarnPlyOptions") ? "border-red-600" : ""
                          }
                        />
                      </Field>

                      <Field label="COUNT SYSTEM" width="sm">
                        <Input
                          type="text"
                          value={details.countSystem || ""}
                          readOnly
                          disabled
                          className="bg-muted cursor-not-allowed"
                        />
                      </Field>

                      <Field
                        label="WINDING OPTIONS"
                        required
                        width="sm"
                        error={err("windingOptions")}
                      >
                        <SearchableDropdown
                          value={material.windingOptions || ""}
                          onChange={(v) =>
                            handleChange(materialIndex, "windingOptions", v)
                          }
                          options={getYarnWindingOptions(
                            material.fiberType,
                            material.yarnType,
                          )}
                          placeholder="Select or type Winding Options"
                          className={
                            err("windingOptions") ? "border-red-600" : ""
                          }
                        />
                      </Field>

                      <Field
                        label="SURPLUS %"
                        required
                        width="sm"
                        error={err("surplus")}
                      >
                        <PercentInput
                          value={material.surplus || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "surplus",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., 5"
                          error={!!err("surplus")}
                        />
                      </Field>

                      <Field
                        label="WASTAGE %"
                        required
                        width="sm"
                        error={err("wastage")}
                      >
                        <PercentInput
                          value={material.wastage || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "wastage",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., 3"
                          error={!!err("wastage")}
                        />
                      </Field>

                      <Field
                        label="TESTING REQUIREMENTS"
                        required
                        width="lg"
                        error={err("testingRequirements")}
                      >
                        <TestingRequirementsInput
                          value={
                            Array.isArray(material.testingRequirements)
                              ? material.testingRequirements
                              : material.testingRequirements
                                ? [String(material.testingRequirements).trim()]
                                : []
                          }
                          onChange={(arr) =>
                            handleChange(
                              materialIndex,
                              "testingRequirements",
                              arr,
                            )
                          }
                          options={YARN_TESTING_REQUIREMENT_OPTIONS}
                          placeholder="Select or type Testing Requirements"
                          className={
                            err("testingRequirements") ? "border-red-600" : ""
                          }
                          error={!!err("testingRequirements")}
                        />
                      </Field>

                      <Field
                        label="APPROVAL"
                        required
                        width="sm"
                        error={err("approval")}
                      >
                        <TestingRequirementsInput
                          value={
                            Array.isArray(material.approval)
                              ? material.approval
                              : material.approval
                                ? [String(material.approval).trim()]
                                : []
                          }
                          onChange={(arr) =>
                            handleChange(materialIndex, "approval", arr)
                          }
                          options={MATERIAL_APPROVAL_OPTIONS}
                          placeholder="Select or type Approval"
                          className={err("approval") ? "border-red-600" : ""}
                          error={!!err("approval")}
                        />
                      </Field>

                      <Field
                        label="REMARKS"
                        required
                        width="sm"
                        error={err("remarks")}
                      >
                        <Input
                          type="text"
                          value={material.remarks || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "remarks",
                              e.target.value,
                            )
                          }
                          placeholder="Enter remarks"
                          aria-invalid={!!err("remarks")}
                        />
                      </Field>
                    </div>

                    {/* Advance Spec */}
                    <div
                      style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}
                    >
                      <AdvanceSpecButton
                        active={material.showAdvancedFilter}
                        onClick={() =>
                          handleChange(
                            materialIndex,
                            "showAdvancedFilter",
                            !material.showAdvancedFilter,
                          )
                        }
                      />
                    </div>
                    {material.showAdvancedFilter && (
                      <div
                        className="ss-fgrid"
                        style={{
                          padding: "1.5rem",
                          backgroundColor: "var(--card)",
                          borderRadius: "0.75rem",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <Field label="SPINNING TYPE" width="sm">
                          <SearchableDropdown
                            value={
                              material.spinningType ||
                              material.spinningMethod ||
                              ""
                            }
                            onChange={(value) => {
                              handleChange(
                                materialIndex,
                                "spinningType",
                                value,
                              );
                              handleChange(
                                materialIndex,
                                "spinningMethod",
                                value,
                              );
                            }}
                            options={getYarnSpinningMethodOptions(
                              material.fiberType,
                              material.yarnType,
                            )}
                            placeholder="Select or type Spinning Type"
                          />
                        </Field>
                        <Field label="FIBER CATEGORY" width="sm">
                          <SearchableDropdown
                            value={material.fiberCategory || ""}
                            onChange={(value) =>
                              handleChange(
                                materialIndex,
                                "fiberCategory",
                                value,
                              )
                            }
                            options={FIBER_CATEGORIES}
                            placeholder="Select or type Fiber Category"
                          />
                        </Field>
                        <Field label="ORIGIN" width="sm">
                          <SearchableDropdown
                            value={material.origin || ""}
                            onChange={(value) =>
                              handleChange(materialIndex, "origin", value)
                            }
                            options={ORIGINS}
                            placeholder="Select or type Origin"
                          />
                        </Field>
                        <Field
                          label="CERTIFICATION REQUIREMENT"
                          width="lg"
                          className="col-span-1 md:col-span-2 lg:col-span-2"
                        >
                          <Input
                            type="text"
                            value={material.certifications || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "certifications",
                                e.target.value,
                              )
                            }
                            placeholder="Enter certificate label"
                          />
                        </Field>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })()}
        </div>
      )}
    </div>
  );
};

export default YarnSpecFields;
