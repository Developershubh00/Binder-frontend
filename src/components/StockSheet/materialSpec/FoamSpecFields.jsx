// Auto-extracted from GenerateFactoryCode/components/steps/Step2.jsx (Foam block)
// for the StockSheet "Add New" flow. Runs on local state via a
// (materialIndex, field, value) change handler — same prop shape as TrimAccessoryFields.
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TestingRequirementsInput } from "@/components/ui/testing-requirements-input";
import SearchableDropdown from "../../GenerateFactoryCode/components/SearchableDropdown";
import AdvanceSpecButton from "../AdvanceSpecButton";
import QualityVerificationToggle from "../../GenerateFactoryCode/components/QualityVerificationToggle";
import { useMaterialOptions } from "../../GenerateFactoryCode/utils/useMaterialOptions";
import { MATERIAL_APPROVAL_OPTIONS } from "../../GenerateFactoryCode/data/approvalOptions";
import {
  FIBER_CATEGORIES,
  ORIGINS,
} from "../../GenerateFactoryCode/data/advancedFilterData";

const FoamSpecFields = ({
  material,
  materialIndex,
  handleChange,
  errors = {},
  errorPrefix = "",
}) => {
  const { mergeOptions, addCustomOption } = useMaterialOptions();
  const todayDate = (() => {
    const now = new Date();
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localNow.toISOString().split("T")[0];
  })();
  const handleProcurementDateChange = (idx, value) =>
    handleChange(idx, "procurementDate", value);

  return (
    <>
      <>
        <div style={{ marginTop: "32px" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h3
              data-spec-anchor
              className="text-sm font-semibold text-foreground/90"
            >
              FOAM SPECIFICATIONS
            </h3>
          </div>

          <div
            className="bg-card rounded-lg border border-border"
            style={{ padding: "1.25rem" }}
          >
            {/* Table Selection Dropdown */}
            <Field
              label="SELECT FOAM TYPE"
              required
              width="sm"
              style={{ marginBottom: "1.5rem" }}
              error={errors[`${errorPrefix}_foamTableType`]}
            >
              <SearchableDropdown
                value={material.foamTableType || ""}
                onChange={(selectedValue) => {
                  handleChange(materialIndex, "foamTableType", selectedValue);
                  // Clear all foam fields when table changes
                  if (selectedValue !== material.foamTableType) {
                    handleChange(materialIndex, "foamType", "");
                    handleChange(materialIndex, "foamSubtype", "");
                    handleChange(materialIndex, "foamVaContent", "");
                    handleChange(materialIndex, "foamColour", "");
                    handleChange(materialIndex, "foamThickness", "");
                    handleChange(materialIndex, "foamShape", "");
                    handleChange(materialIndex, "foamShapeRefImage", null);
                    handleChange(materialIndex, "foamSheetPcs", "");
                    handleChange(materialIndex, "foamGsm", "");
                    handleChange(materialIndex, "foamLengthCm", "");
                    handleChange(materialIndex, "foamWidthCm", "");
                    handleChange(materialIndex, "foamKgsCns", "");
                    handleChange(materialIndex, "foamYardageCns", "");
                    handleChange(materialIndex, "foamTestingRequirements", []);
                    handleChange(
                      materialIndex,
                      "foamTestingRequirementsFile",
                      null,
                    );
                    handleChange(materialIndex, "foamSurplus", "");
                    handleChange(materialIndex, "foamWastage", "");
                    handleChange(materialIndex, "foamApproval", "");
                    handleChange(materialIndex, "foamRemarks", "");
                    handleChange(materialIndex, "showFoamAdvancedSpec", false);
                    handleChange(materialIndex, "foamShoreHardness", "");
                    handleChange(materialIndex, "foamCellStructure", "");
                    handleChange(materialIndex, "foamCompressionSet", "");
                    handleChange(materialIndex, "foamTensileStrength", "");
                    handleChange(materialIndex, "foamElongation", "");
                    handleChange(materialIndex, "foamWaterResistance", "");
                    handleChange(materialIndex, "foamUvResistance", "");
                    handleChange(materialIndex, "foamFireRetardant", "");
                    handleChange(materialIndex, "foamSurfaceTexture", "");
                    handleChange(materialIndex, "foamAntiSlip", "");
                    handleChange(materialIndex, "foamInterlocking", "");
                    handleChange(materialIndex, "foamCertification", "");
                    handleChange(materialIndex, "foamDensity", "");
                    handleChange(materialIndex, "foamHrGrade", "");
                    handleChange(materialIndex, "foamHrIld", "");
                    handleChange(materialIndex, "foamHrSupportFactor", "");
                    handleChange(materialIndex, "foamHrResilience", "");
                    handleChange(materialIndex, "foamHrFatigueResistance", "");
                    handleChange(
                      materialIndex,
                      "foamHrTestingRequirements",
                      [],
                    );
                    handleChange(materialIndex, "foamPeEpeType", "");
                    handleChange(materialIndex, "foamPeEpeSubtype", "");
                    handleChange(materialIndex, "foamPeEpeColour", "");
                    handleChange(materialIndex, "foamPeEpeThickness", "");
                    handleChange(materialIndex, "foamPeEpeShape", "");
                    handleChange(materialIndex, "foamPeEpeShapeRefImage", null);
                    handleChange(materialIndex, "foamPeEpeSheetPcs", "");
                    handleChange(materialIndex, "foamPeEpeGsm", "");
                    handleChange(materialIndex, "foamPeEpeLengthCm", "");
                    handleChange(materialIndex, "foamPeEpeWidthCm", "");
                    handleChange(materialIndex, "foamPeEpeKgsCns", "");
                    handleChange(materialIndex, "foamPeEpeYardageCns", "");
                    handleChange(
                      materialIndex,
                      "foamPeEpeTestingRequirements",
                      [],
                    );
                    handleChange(
                      materialIndex,
                      "foamPeEpeTestingRequirementsFile",
                      null,
                    );
                    handleChange(materialIndex, "foamPeEpeSurplus", "");
                    handleChange(materialIndex, "foamPeEpeWastage", "");
                    handleChange(materialIndex, "foamPeEpeApproval", "");
                    handleChange(materialIndex, "foamPeEpeRemarks", "");
                    handleChange(
                      materialIndex,
                      "showFoamPeEpeAdvancedSpec",
                      false,
                    );
                    handleChange(materialIndex, "foamPeEpeCellStructure", "");
                    handleChange(materialIndex, "foamPeEpeLamination", "");
                    handleChange(materialIndex, "foamPeEpeCrossLinked", "");
                    handleChange(materialIndex, "foamPeEpeAntiStatic", "");
                    handleChange(materialIndex, "foamPeEpeWaterResistance", "");
                    handleChange(materialIndex, "foamPeEpeCushioning", "");
                    handleChange(materialIndex, "foamPeEpeFireRetardant", "");
                    handleChange(
                      materialIndex,
                      "foamPeEpeThermalInsulation",
                      "",
                    );
                    handleChange(materialIndex, "foamPeEpeCertification", "");
                    handleChange(materialIndex, "foamPeEpeDensity", "");
                    handleChange(materialIndex, "foamPuType", "");
                    handleChange(materialIndex, "foamPuSubtype", "");
                    handleChange(materialIndex, "foamPuGrade", "");
                    handleChange(materialIndex, "foamPuColour", "");
                    handleChange(materialIndex, "foamPuThickness", "");
                    handleChange(materialIndex, "foamPuShape", "");
                    handleChange(materialIndex, "foamPuShapeRefImage", null);
                    handleChange(materialIndex, "foamPuSheetPcs", "");
                    handleChange(materialIndex, "foamPuGsm", "");
                    handleChange(materialIndex, "foamPuLengthCm", "");
                    handleChange(materialIndex, "foamPuWidthCm", "");
                    handleChange(materialIndex, "foamPuKgsCns", "");
                    handleChange(materialIndex, "foamPuYardageCns", "");
                    handleChange(
                      materialIndex,
                      "foamPuTestingRequirements",
                      [],
                    );
                    handleChange(
                      materialIndex,
                      "foamPuTestingRequirementsFile",
                      null,
                    );
                    handleChange(materialIndex, "foamPuSurplus", "");
                    handleChange(materialIndex, "foamPuWastage", "");
                    handleChange(materialIndex, "foamPuApproval", "");
                    handleChange(materialIndex, "foamPuRemarks", "");
                    handleChange(
                      materialIndex,
                      "showFoamPuAdvancedSpec",
                      false,
                    );
                    handleChange(materialIndex, "foamPuIld", "");
                    handleChange(materialIndex, "foamPuSupportFactor", "");
                    handleChange(materialIndex, "foamPuResilience", "");
                    handleChange(materialIndex, "foamPuCellStructure", "");
                    handleChange(materialIndex, "foamPuCompressionSet", "");
                    handleChange(materialIndex, "foamPuTensileStrength", "");
                    handleChange(materialIndex, "foamPuElongation", "");
                    handleChange(materialIndex, "foamPuFireRetardant", "");
                    handleChange(materialIndex, "foamPuAntiMicrobial", "");
                    handleChange(materialIndex, "foamPuDensity", "");
                    handleChange(materialIndex, "foamPuCertification", "");
                    handleChange(materialIndex, "foamRebondedType", "");
                    handleChange(materialIndex, "foamRebondedSubtype", "");
                    handleChange(materialIndex, "foamRebondedChipSource", "");
                    handleChange(materialIndex, "foamRebondedChipSize", "");
                    handleChange(materialIndex, "foamRebondedBonding", "");
                    handleChange(materialIndex, "foamRebondedColour", "");
                    handleChange(materialIndex, "foamRebondedThickness", "");
                    handleChange(materialIndex, "foamRebondedShape", "");
                    handleChange(
                      materialIndex,
                      "foamRebondedShapeRefImage",
                      null,
                    );
                    handleChange(materialIndex, "foamRebondedSheetPcs", "");
                    handleChange(materialIndex, "foamRebondedGsm", "");
                    handleChange(materialIndex, "foamRebondedLengthCm", "");
                    handleChange(materialIndex, "foamRebondedWidthCm", "");
                    handleChange(materialIndex, "foamRebondedKgsCns", "");
                    handleChange(materialIndex, "foamRebondedYardageCns", "");
                    handleChange(
                      materialIndex,
                      "foamRebondedTestingRequirements",
                      [],
                    );
                    handleChange(
                      materialIndex,
                      "foamRebondedTestingRequirementsFile",
                      null,
                    );
                    handleChange(materialIndex, "foamRebondedSurplus", "");
                    handleChange(materialIndex, "foamRebondedWastage", "");
                    handleChange(materialIndex, "foamRebondedApproval", "");
                    handleChange(materialIndex, "foamRebondedRemarks", "");
                    handleChange(
                      materialIndex,
                      "showFoamRebondedAdvancedSpec",
                      false,
                    );
                    handleChange(materialIndex, "foamRebondedIld", "");
                    handleChange(
                      materialIndex,
                      "foamRebondedCompressionSet",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "foamRebondedFireRetardant",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "foamRebondedCertification",
                      "",
                    );
                    handleChange(materialIndex, "foamRebondedDensity", "");
                    handleChange(materialIndex, "foamGelInfusedType", "");
                    handleChange(materialIndex, "foamGelInfusedBaseFoam", "");
                    handleChange(materialIndex, "foamGelInfusedGelType", "");
                    handleChange(materialIndex, "foamGelInfusedGelContent", "");
                    handleChange(materialIndex, "foamGelInfusedSubtype", "");
                    handleChange(materialIndex, "foamGelInfusedColour", "");
                    handleChange(materialIndex, "foamGelInfusedThickness", "");
                    handleChange(materialIndex, "foamGelInfusedShape", "");
                    handleChange(
                      materialIndex,
                      "foamGelInfusedShapeRefImage",
                      null,
                    );
                    handleChange(materialIndex, "foamGelInfusedSheetPcs", "");
                    handleChange(materialIndex, "foamGelInfusedGsm", "");
                    handleChange(materialIndex, "foamGelInfusedLengthCm", "");
                    handleChange(materialIndex, "foamGelInfusedWidthCm", "");
                    handleChange(materialIndex, "foamGelInfusedKgsCns", "");
                    handleChange(materialIndex, "foamGelInfusedYardageCns", "");
                    handleChange(
                      materialIndex,
                      "foamGelInfusedTestingRequirements",
                      [],
                    );
                    handleChange(
                      materialIndex,
                      "foamGelInfusedTestingRequirementsFile",
                      null,
                    );
                    handleChange(materialIndex, "foamGelInfusedSurplus", "");
                    handleChange(materialIndex, "foamGelInfusedWastage", "");
                    handleChange(materialIndex, "foamGelInfusedApproval", "");
                    handleChange(materialIndex, "foamGelInfusedRemarks", "");
                    handleChange(
                      materialIndex,
                      "showFoamGelInfusedAdvancedSpec",
                      false,
                    );
                    handleChange(materialIndex, "foamGelInfusedDensity", "");
                    handleChange(materialIndex, "foamGelInfusedIld", "");
                    handleChange(
                      materialIndex,
                      "foamGelInfusedTemperatureRegulation",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "foamGelInfusedResponseTime",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "foamGelInfusedBreathability",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "foamGelInfusedFireRetardant",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "foamGelInfusedCoolingEffect",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "foamGelInfusedCertification",
                      "",
                    );
                    handleChange(materialIndex, "foamLatexType", "");
                    handleChange(materialIndex, "foamLatexLatexType", "");
                    handleChange(materialIndex, "foamLatexNaturalContent", "");
                    handleChange(materialIndex, "foamLatexProcess", "");
                    handleChange(materialIndex, "foamLatexSubtype", "");
                    handleChange(materialIndex, "foamLatexColour", "");
                    handleChange(materialIndex, "foamLatexThickness", "");
                    handleChange(materialIndex, "foamLatexShape", "");
                    handleChange(materialIndex, "foamLatexShapeRefImage", null);
                    handleChange(materialIndex, "foamLatexSheetPcs", "");
                    handleChange(materialIndex, "foamLatexGsm", "");
                    handleChange(materialIndex, "foamLatexLengthCm", "");
                    handleChange(materialIndex, "foamLatexWidthCm", "");
                    handleChange(materialIndex, "foamLatexKgsCns", "");
                    handleChange(materialIndex, "foamLatexYardageCns", "");
                    handleChange(
                      materialIndex,
                      "foamLatexTestingRequirements",
                      [],
                    );
                    handleChange(
                      materialIndex,
                      "foamLatexTestingRequirementsFile",
                      null,
                    );
                    handleChange(materialIndex, "foamLatexSurplus", "");
                    handleChange(materialIndex, "foamLatexWastage", "");
                    handleChange(materialIndex, "foamLatexApproval", "");
                    handleChange(materialIndex, "foamLatexRemarks", "");
                    handleChange(
                      materialIndex,
                      "showFoamLatexAdvancedSpec",
                      false,
                    );
                    handleChange(materialIndex, "foamLatexIld", "");
                    handleChange(materialIndex, "foamLatexResilience", "");
                    handleChange(materialIndex, "foamLatexCompressionSet", "");
                    handleChange(materialIndex, "foamLatexPincorePattern", "");
                    handleChange(
                      materialIndex,
                      "foamLatexZoneConfiguration",
                      "",
                    );
                    handleChange(materialIndex, "foamLatexBreathability", "");
                    handleChange(materialIndex, "foamLatexHypoallergenic", "");
                    handleChange(materialIndex, "foamLatexAntiMicrobial", "");
                    handleChange(materialIndex, "foamLatexFireRetardant", "");
                    handleChange(materialIndex, "foamLatexDensity", "");
                    handleChange(materialIndex, "foamLatexCertification", "");
                    handleChange(materialIndex, "foamMemoryType", "");
                    handleChange(materialIndex, "foamMemorySubtype", "");
                    handleChange(materialIndex, "foamMemoryGrade", "");
                    handleChange(materialIndex, "foamMemoryColour", "");
                    handleChange(materialIndex, "foamMemoryThickness", "");
                    handleChange(materialIndex, "foamMemoryShape", "");
                    handleChange(
                      materialIndex,
                      "foamMemoryShapeRefImage",
                      null,
                    );
                    handleChange(materialIndex, "foamMemorySheetPcs", "");
                    handleChange(materialIndex, "foamMemoryGsm", "");
                    handleChange(materialIndex, "foamMemoryLengthCm", "");
                    handleChange(materialIndex, "foamMemoryWidthCm", "");
                    handleChange(materialIndex, "foamMemoryKgsCns", "");
                    handleChange(materialIndex, "foamMemoryYardageCns", "");
                    handleChange(
                      materialIndex,
                      "foamMemoryTestingRequirements",
                      [],
                    );
                    handleChange(
                      materialIndex,
                      "foamMemoryTestingRequirementsFile",
                      null,
                    );
                    handleChange(materialIndex, "foamMemorySurplus", "");
                    handleChange(materialIndex, "foamMemoryWastage", "");
                    handleChange(materialIndex, "foamMemoryApproval", "");
                    handleChange(materialIndex, "foamMemoryRemarks", "");
                    handleChange(
                      materialIndex,
                      "showFoamMemoryAdvancedSpec",
                      false,
                    );
                    handleChange(materialIndex, "foamMemoryIld", "");
                    handleChange(materialIndex, "foamMemoryResponseTime", "");
                    handleChange(
                      materialIndex,
                      "foamMemoryTemperatureSensitivity",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "foamMemoryActivationTemperature",
                      "",
                    );
                    handleChange(materialIndex, "foamMemoryCompressionSet", "");
                    handleChange(materialIndex, "foamMemoryResilience", "");
                    handleChange(materialIndex, "foamMemoryBreathability", "");
                    handleChange(materialIndex, "foamMemoryInfusion", "");
                    handleChange(
                      materialIndex,
                      "foamMemoryCoolingTechnology",
                      "",
                    );
                    handleChange(materialIndex, "foamMemoryFireRetardant", "");
                    handleChange(materialIndex, "foamMemoryVocEmissions", "");
                    handleChange(materialIndex, "foamMemoryDensity", "");
                    handleChange(materialIndex, "foamMemoryCertification", "");
                  }
                }}
                options={[
                  "EVA-foam",
                  "HR-foam",
                  "pe-epe",
                  "pu-foam",
                  "rebonded-foam",
                  "gel-infused-foam",
                  "latex-foam",
                  "memory-foam",
                ]}
                placeholder="Select foam table"
                className={
                  errors[`${errorPrefix}_foamTableType`] ? "border-red-600" : ""
                }
              />
              {errors[`${errorPrefix}_foamTableType`] && (
                <span className="text-red-600 text-xs mt-1">
                  {errors[`${errorPrefix}_foamTableType`]}
                </span>
              )}
            </Field>

            {/* EVA-form Table */}
            {material.foamTableType === "EVA-foam" && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                style={{ gap: "16px 12px" }}
              >
                {/* FOAM TYPE */}
                <Field
                  label="FOAM TYPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamType`]}
                >
                  <SearchableDropdown
                    value={material.foamType || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "foamType", selectedValue)
                    }
                    options={mergeOptions(
                      ["EVA Foam (Ethylene Vinyl Acetate)"],
                      "Foam",
                      "foamType",
                    )}
                    onCustomValue={(val) =>
                      addCustomOption("Foam", "foamType", "", val)
                    }
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamType`] ? "border-red-600" : ""
                    }
                  />
                </Field>

                {/* SUBTYPE */}
                <Field
                  label="SUBTYPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamSubtype`]}
                >
                  <SearchableDropdown
                    value={material.foamSubtype || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "foamSubtype", selectedValue)
                    }
                    options={mergeOptions(
                      ["Virgin EVA", "Recycled EVA", "Blended"],
                      "Foam",
                      "foamSubtype",
                      material.foamType || "",
                    )}
                    onCustomValue={(val) =>
                      addCustomOption(
                        "Foam",
                        "foamSubtype",
                        material.foamType || "",
                        val,
                      )
                    }
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamSubtype`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* VA CONTENT */}
                <Field
                  label="VA CONTENT"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamVaContent`]}
                >
                  <SearchableDropdown
                    value={material.foamVaContent || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "foamVaContent",
                        selectedValue,
                      )
                    }
                    options={["18%", "25%", "28%", "33%"]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamVaContent`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* COLOUR */}
                <Field
                  label="COLOUR"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamColour`]}
                >
                  <SearchableDropdown
                    value={material.foamColour || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "foamColour", selectedValue)
                    }
                    options={[
                      "Black",
                      "White",
                      "Grey",
                      "Red",
                      "Blue",
                      "Green",
                      "Custom",
                    ]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamColour`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* THICKNESS */}
                <Field
                  label="THICKNESS"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamThickness`]}
                >
                  <SearchableDropdown
                    value={material.foamThickness || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "foamThickness",
                        selectedValue,
                      )
                    }
                    options={[
                      "2mm",
                      "3mm",
                      "5mm",
                      "10mm",
                      "15mm",
                      "20mm",
                      "25mm",
                    ]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamThickness`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* SHAPE */}
                <Field
                  label="SHAPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamShape`]}
                >
                  <Input
                    type="text"
                    value={material.foamShape || ""}
                    onChange={(e) =>
                      handleChange(materialIndex, "foamShape", e.target.value)
                    }
                    placeholder="TEXT"
                    aria-invalid={Boolean(errors[`${errorPrefix}_foamShape`])}
                  />
                </Field>

                {/* UPLOAD REF IMAGE */}
                <Field
                  label="UPLOAD REF IMAGE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamShapeRefImage`]}
                >
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        handleChange(materialIndex, "foamShapeRefImage", f);
                    }}
                    className="hidden"
                    id={`upload-foam-shape-${materialIndex}`}
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`h-11 w-full ${errors[`${errorPrefix}_foamShapeRefImage`] ? "border-red-600" : ""}`}
                    onClick={() =>
                      document
                        .getElementById(`upload-foam-shape-${materialIndex}`)
                        ?.click()
                    }
                  >
                    {material.foamShapeRefImage
                      ? "UPLOADED"
                      : "UPLOAD REF IMAGE"}
                  </Button>
                </Field>

                {/* SIZE SPEC */}
                <div
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--border)",
                  }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    SIZE SPEC
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field
                      label="SHEET/PCS"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamSheetPcs`]}
                    >
                      <Input
                        type="text"
                        value={material.foamSheetPcs || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamSheetPcs",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamSheetPcs`],
                        )}
                      />
                    </Field>
                    <Field
                      label="GSM"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamGsm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamGsm || ""}
                        onChange={(e) =>
                          handleChange(materialIndex, "foamGsm", e.target.value)
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(errors[`${errorPrefix}_foamGsm`])}
                      />
                    </Field>
                    <Field
                      label="LENGTH (CM)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamLengthCm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamLengthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamLengthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamLengthCm`],
                        )}
                      />
                    </Field>
                    <Field
                      label="WIDTH (CM)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamWidthCm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamWidthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamWidthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamWidthCm`],
                        )}
                      />
                    </Field>
                  </div>
                </div>

                {/* QTY - KGS and YARDAGE */}
                <div
                  style={{ marginTop: "1.25rem" }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    QTY
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field
                      label="KGS (CNS)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamKgsCns`]}
                    >
                      <Input
                        type="text"
                        value={material.foamKgsCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamKgsCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamKgsCns`],
                        )}
                      />
                    </Field>
                    <Field
                      label="YARDAGE (CNS)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamYardageCns`]}
                    >
                      <Input
                        type="text"
                        value={material.foamYardageCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamYardageCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamYardageCns`],
                        )}
                      />
                    </Field>
                  </div>
                </div>

                {/* TESTING REQUIREMENTS */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5"
                  style={{ gap: "16px 12px", marginTop: "1.25rem" }}
                >
                  <Field
                    label="TESTING REQ."
                    required
                    width="sm"
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                    error={errors[`${errorPrefix}_foamTestingRequirements`]}
                  >
                    <div
                      className="flex items-center"
                      style={{ gap: "0.75rem" }}
                    >
                      <div className="flex-1">
                        <TestingRequirementsInput
                          value={material.foamTestingRequirements || []}
                          onChange={(values) =>
                            handleChange(
                              materialIndex,
                              "foamTestingRequirements",
                              values,
                            )
                          }
                          options={[
                            "Density",
                            "Shore Hardness",
                            "Compression Set",
                            "Tensile Strength",
                          ]}
                          placeholder="Type to search or select testing requirements..."
                          error={Boolean(
                            errors[`${errorPrefix}_foamTestingRequirements`],
                          )}
                        />
                      </div>
                      <input
                        type="file"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f)
                            handleChange(
                              materialIndex,
                              "foamTestingRequirementsFile",
                              f,
                            );
                        }}
                        className="hidden"
                        id={`upload-foam-testing-${materialIndex}`}
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`h-11 ${errors[`${errorPrefix}_foamTestingRequirementsFile`] ? "border-red-600" : ""}`}
                        onClick={() =>
                          document
                            .getElementById(
                              `upload-foam-testing-${materialIndex}`,
                            )
                            ?.click()
                        }
                      >
                        {material.foamTestingRequirementsFile
                          ? "UPLOADED"
                          : "UPLOAD"}
                      </Button>
                    </div>
                  </Field>

                  {/* APPROVAL */}
                  <Field
                    label="APPROVAL"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamApproval`]}
                  >
                    <SearchableDropdown
                      value={material.foamApproval || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamApproval",
                          selectedValue,
                        )
                      }
                      options={MATERIAL_APPROVAL_OPTIONS}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamApproval`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* REMARKS */}
                  <Field
                    label="REMARKS"
                    required
                    width="sm"
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                    error={errors[`${errorPrefix}_foamRemarks`]}
                  >
                    <Input
                      type="text"
                      value={material.foamRemarks || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamRemarks",
                          e.target.value,
                        )
                      }
                      placeholder="Higher VA%=softer, Interlocking for gym flooring, Closed cell=waterproof"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamRemarks`],
                      )}
                    />
                  </Field>
                </div>

                {/* Show/Hide Advance Spec Button */}
                <div
                  style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <AdvanceSpecButton
                    active={material.showFoamAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFoamAdvancedSpec",
                        !material.showFoamAdvancedSpec,
                      )
                    }
                  />
                </div>

                {/* Advanced Filter UI Table */}
                {material.showFoamAdvancedSpec && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1.5rem",
                      backgroundColor: "var(--muted)",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field label="SHORE HARDNESS" width="sm">
                        <SearchableDropdown
                          value={material.foamShoreHardness || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamShoreHardness",
                              selectedValue,
                            )
                          }
                          options={[
                            "25A Soft",
                            "35A Medium",
                            "45A Firm",
                            "55A+ Hard",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CELL STRUCTURE" width="sm">
                        <SearchableDropdown
                          value={material.foamCellStructure || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamCellStructure",
                              selectedValue,
                            )
                          }
                          options={["Closed Cell"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="COMPRESSION SET" width="sm">
                        <SearchableDropdown
                          value={material.foamCompressionSet || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamCompressionSet",
                              selectedValue,
                            )
                          }
                          options={["Compression Set %"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="TENSILE STRENGTH" width="sm">
                        <SearchableDropdown
                          value={material.foamTensileStrength || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamTensileStrength",
                              selectedValue,
                            )
                          }
                          options={["Tensile Strength (MPa)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="ELONGATION" width="sm">
                        <SearchableDropdown
                          value={material.foamElongation || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamElongation",
                              selectedValue,
                            )
                          }
                          options={["Elongation at Break (%)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="WATER RESISTANCE" width="sm">
                        <SearchableDropdown
                          value={material.foamWaterResistance || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamWaterResistance",
                              selectedValue,
                            )
                          }
                          options={["Excellent"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="UV RESISTANCE" width="sm">
                        <SearchableDropdown
                          value={material.foamUvResistance || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamUvResistance",
                              selectedValue,
                            )
                          }
                          options={["Standard", "UV Stabilized"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="FIRE RETARDANT" width="sm">
                        <SearchableDropdown
                          value={material.foamFireRetardant || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamFireRetardant",
                              selectedValue,
                            )
                          }
                          options={["Standard", "FR Treated"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="SURFACE TEXTURE" width="sm">
                        <SearchableDropdown
                          value={material.foamSurfaceTexture || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamSurfaceTexture",
                              selectedValue,
                            )
                          }
                          options={[
                            "Smooth",
                            "Textured (anti-slip)",
                            "Fabric Laminated",
                            "Leather-Look",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="ANTI-SLIP" width="sm">
                        <SearchableDropdown
                          value={material.foamAntiSlip || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamAntiSlip",
                              selectedValue,
                            )
                          }
                          options={["Standard", "Anti-Slip Surface Treatment"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="INTERLOCKING" width="sm">
                        <SearchableDropdown
                          value={material.foamInterlocking || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamInterlocking",
                              selectedValue,
                            )
                          }
                          options={[
                            "None",
                            "Interlocking Edges (puzzle pattern)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CERTIFICATION" width="sm">
                        <SearchableDropdown
                          value={material.foamCertification || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamCertification",
                              selectedValue,
                            )
                          }
                          options={[
                            "REACH Compliant",
                            "Phthalate-Free",
                            "OEKO-TEX",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="DENSITY" width="sm">
                        <SearchableDropdown
                          value={material.foamDensity || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamDensity",
                              selectedValue,
                            )
                          }
                          options={[
                            "30 kg/m³",
                            "45 kg/m³",
                            "60 kg/m³",
                            "90 kg/m³",
                            "120 kg/m³",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                    </div>
                  </div>
                )}
                {/* Quality Verification - after Advance Spec, inside top-border block */}
                <div
                  className="w-full max-w-xl"
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <QualityVerificationToggle
                    value={material.qualityVerification}
                    onChange={(value) =>
                      handleChange(materialIndex, "qualityVerification", value)
                    }
                    width="lg"
                    className="mb-3"
                  />
                </div>
              </div>
            )}

            {/* pe-epe Table */}
            {material.foamTableType === "pe-epe" && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                style={{ gap: "16px 12px" }}
              >
                {/* FOAM TYPE */}
                <Field
                  label="FOAM TYPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamPeEpeType`]}
                >
                  <SearchableDropdown
                    value={material.foamPeEpeType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "foamPeEpeType",
                        selectedValue,
                      )
                    }
                    options={["PE Foam", "EPE Foam (Expanded Polyethylene)"]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamPeEpeType`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* SUBTYPE */}
                <Field
                  label="SUBTYPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamPeEpeSubtype`]}
                >
                  <SearchableDropdown
                    value={material.foamPeEpeSubtype || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "foamPeEpeSubtype",
                        selectedValue,
                      )
                    }
                    options={[
                      "Virgin PE",
                      "Recycled PE",
                      "Cross-Linked PE (XLPE)",
                    ]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamPeEpeSubtype`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* COLOUR */}
                <Field
                  label="COLOUR"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamPeEpeColour`]}
                >
                  <SearchableDropdown
                    value={material.foamPeEpeColour || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "foamPeEpeColour",
                        selectedValue,
                      )
                    }
                    options={[
                      "White (standard)",
                      "Black",
                      "Pink (anti-static)",
                      "Blue",
                      "Custom",
                    ]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamPeEpeColour`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* THICKNESS */}
                <Field
                  label="THICKNESS"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamPeEpeThickness`]}
                >
                  <Input
                    type="text"
                    value={material.foamPeEpeThickness || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "foamPeEpeThickness",
                        e.target.value,
                      )
                    }
                    placeholder="MM (e.g., 0.5mm, 1mm, 2mm, 3mm, 5mm, 10mm, 20mm, 50mm)"
                    aria-invalid={Boolean(
                      errors[`${errorPrefix}_foamPeEpeThickness`],
                    )}
                  />
                </Field>

                {/* SHAPE */}
                <Field
                  label="SHAPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamPeEpeShape`]}
                >
                  <Input
                    type="text"
                    value={material.foamPeEpeShape || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "foamPeEpeShape",
                        e.target.value,
                      )
                    }
                    placeholder="TEXT"
                    aria-invalid={Boolean(
                      errors[`${errorPrefix}_foamPeEpeShape`],
                    )}
                  />
                </Field>

                {/* UPLOAD REF IMAGE */}
                <Field
                  label="UPLOAD REF IMAGE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamPeEpeShapeRefImage`]}
                >
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        handleChange(
                          materialIndex,
                          "foamPeEpeShapeRefImage",
                          f,
                        );
                    }}
                    className="hidden"
                    id={`upload-pe-epe-foam-shape-${materialIndex}`}
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`h-11 w-full ${errors[`${errorPrefix}_foamPeEpeShapeRefImage`] ? "border-red-600" : ""}`}
                    onClick={() =>
                      document
                        .getElementById(
                          `upload-pe-epe-foam-shape-${materialIndex}`,
                        )
                        ?.click()
                    }
                  >
                    {material.foamPeEpeShapeRefImage
                      ? "UPLOADED"
                      : "UPLOAD REF IMAGE"}
                  </Button>
                </Field>

                {/* SIZE SPEC */}
                <div
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--border)",
                  }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    SIZE SPEC
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field
                      label="SHEET/PCS"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPeEpeSheetPcs`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPeEpeSheetPcs || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPeEpeSheetPcs",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPeEpeSheetPcs`],
                        )}
                      />
                    </Field>
                    <Field
                      label="GSM"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPeEpeGsm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPeEpeGsm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPeEpeGsm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPeEpeGsm`],
                        )}
                      />
                    </Field>
                    <Field
                      label="LENGTH (CM)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPeEpeLengthCm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPeEpeLengthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPeEpeLengthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPeEpeLengthCm`],
                        )}
                      />
                    </Field>
                    <Field
                      label="WIDTH (CM)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPeEpeWidthCm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPeEpeWidthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPeEpeWidthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPeEpeWidthCm`],
                        )}
                      />
                    </Field>
                  </div>
                </div>

                {/* QTY - KGS and YARDAGE */}
                <div
                  style={{ marginTop: "1.25rem" }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    QTY
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field
                      label="KGS (CNS)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPeEpeKgsCns`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPeEpeKgsCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPeEpeKgsCns",
                            e.target.value,
                          )
                        }
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPeEpeKgsCns`],
                        )}
                        placeholder="Enter value"
                      />
                    </Field>
                    <Field
                      label="YARDAGE (CNS)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPeEpeYardageCns`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPeEpeYardageCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPeEpeYardageCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPeEpeYardageCns`],
                        )}
                      />
                    </Field>
                  </div>
                </div>

                {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5"
                  style={{ gap: "16px 12px", marginTop: "1.25rem" }}
                >
                  {/* TESTING REQ. */}
                  <Field
                    label="TESTING REQ."
                    required
                    width="sm"
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                    error={
                      errors[`${errorPrefix}_foamPeEpeTestingRequirements`]
                    }
                  >
                    <div
                      className="flex items-center"
                      style={{ gap: "0.75rem" }}
                    >
                      <div className="flex-1">
                        <TestingRequirementsInput
                          value={material.foamPeEpeTestingRequirements || []}
                          onChange={(values) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeTestingRequirements",
                              values,
                            )
                          }
                          options={[
                            "Density",
                            "Compression",
                            "Water Absorption",
                            "Thermal Conductivity",
                          ]}
                          placeholder="Type to search or select testing requirements..."
                          error={Boolean(
                            errors[
                              `${errorPrefix}_foamPeEpeTestingRequirements`
                            ],
                          )}
                        />
                      </div>
                      <input
                        type="file"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f)
                            handleChange(
                              materialIndex,
                              "foamPeEpeTestingRequirementsFile",
                              f,
                            );
                        }}
                        className="hidden"
                        id={`upload-pe-epe-testing-${materialIndex}`}
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`h-11 ${errors[`${errorPrefix}_foamPeEpeTestingRequirementsFile`] ? "border-red-600" : ""}`}
                        onClick={() =>
                          document
                            .getElementById(
                              `upload-pe-epe-testing-${materialIndex}`,
                            )
                            ?.click()
                        }
                      >
                        {material.foamPeEpeTestingRequirementsFile
                          ? "UPLOADED"
                          : "UPLOAD"}
                      </Button>
                    </div>
                  </Field>

                  {/* APPROVAL */}
                  <Field
                    label="APPROVAL"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPeEpeApproval`]}
                  >
                    <SearchableDropdown
                      value={material.foamPeEpeApproval || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamPeEpeApproval",
                          selectedValue,
                        )
                      }
                      options={MATERIAL_APPROVAL_OPTIONS}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamPeEpeApproval`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* REMARKS */}
                  <Field
                    label="REMARKS"
                    required
                    width="sm"
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                    error={errors[`${errorPrefix}_foamPeEpeRemarks`]}
                  >
                    <Input
                      type="text"
                      value={material.foamPeEpeRemarks || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamPeEpeRemarks",
                          e.target.value,
                        )
                      }
                      placeholder="Typically closed-cell, lightweight, flexible. Applications: packaging, insulation."
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamPeEpeRemarks`],
                      )}
                    />
                  </Field>
                </div>

                {/* Advance Spec Button */}
                <div
                  style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <AdvanceSpecButton
                    active={material.showFoamPeEpeAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFoamPeEpeAdvancedSpec",
                        !material.showFoamPeEpeAdvancedSpec,
                      )
                    }
                  />
                </div>

                {/* Advanced Filter UI Table */}
                {material.showFoamPeEpeAdvancedSpec && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1.5rem",
                      backgroundColor: "var(--muted)",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field label="CELL STRUCTURE" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeCellStructure || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeCellStructure",
                              selectedValue,
                            )
                          }
                          options={["Closed Cell (standard for PE foam)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="LAMINATION" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeLamination || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeLamination",
                              selectedValue,
                            )
                          }
                          options={[
                            "None",
                            "PE Film Laminated",
                            "Foil Laminated",
                            "Fabric Laminated",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CROSS-LINKED" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeCrossLinked || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeCrossLinked",
                              selectedValue,
                            )
                          }
                          options={[
                            "Non Cross-Linked (standard EPE)",
                            "Cross-Linked (XLPE - denser, stronger)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="ANTI-STATIC" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeAntiStatic || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeAntiStatic",
                              selectedValue,
                            )
                          }
                          options={["Standard", "Anti-Static (Pink ESD foam)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="WATER RESISTANCE" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeWaterResistance || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeWaterResistance",
                              selectedValue,
                            )
                          }
                          options={["Excellent (closed cell)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CUSHIONING" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeCushioning || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeCushioning",
                              selectedValue,
                            )
                          }
                          options={[
                            "Good shock absorption",
                            "Low compression set",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="FIRE RETARDANT" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeFireRetardant || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeFireRetardant",
                              selectedValue,
                            )
                          }
                          options={["Standard", "FR Treated (HF-1, UL94)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="THERMAL INSULATION" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeThermalInsulation || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeThermalInsulation",
                              selectedValue,
                            )
                          }
                          options={["Good thermal insulation (R-value)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CERTIFICATION" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeCertification || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeCertification",
                              selectedValue,
                            )
                          }
                          options={[
                            "REACH Compliant",
                            "RoHS Compliant",
                            "OEKO-TEX",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="DENSITY" width="sm">
                        <SearchableDropdown
                          value={material.foamPeEpeDensity || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPeEpeDensity",
                              selectedValue,
                            )
                          }
                          options={[
                            "18 kg/m³",
                            "20 kg/m³",
                            "25 kg/m³",
                            "30 kg/m³",
                            "35 kg/m³",
                            "45 kg/m³",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                    </div>
                  </div>
                )}
                {/* Quality Verification - after Advance Spec, inside top-border block */}
                <div
                  className="w-full max-w-xl"
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <QualityVerificationToggle
                    value={material.qualityVerification}
                    onChange={(value) =>
                      handleChange(materialIndex, "qualityVerification", value)
                    }
                    width="lg"
                    className="mb-3"
                  />
                </div>
              </div>
            )}

            {/* pu-foam Table */}
            {material.foamTableType === "pu-foam" && (
              <>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                  style={{ gap: "16px 12px" }}
                >
                  {/* FOAM TYPE */}
                  <Field
                    label="FOAM TYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuType`]}
                  >
                    <SearchableDropdown
                      value={material.foamPuType || ""}
                      onChange={(selectedValue) =>
                        handleChange(materialIndex, "foamPuType", selectedValue)
                      }
                      options={["PU Foam (Polyurethane)"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamPuType`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* SUBTYPE */}
                  <Field
                    label="SUBTYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuSubtype`]}
                  >
                    <SearchableDropdown
                      value={material.foamPuSubtype || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamPuSubtype",
                          selectedValue,
                        )
                      }
                      options={["Virgin", "Recycled/Rebonded", "Blended"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamPuSubtype`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* GRADE */}
                  <Field
                    label="GRADE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuGrade`]}
                  >
                    <SearchableDropdown
                      value={material.foamPuGrade || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamPuGrade",
                          selectedValue,
                        )
                      }
                      options={[
                        "Conventional PU",
                        "High Density (HD)",
                        "Super High Density (SHD)",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamPuGrade`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* COLOUR */}
                  <Field
                    label="COLOUR"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuColour`]}
                  >
                    <SearchableDropdown
                      value={material.foamPuColour || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamPuColour",
                          selectedValue,
                        )
                      }
                      options={[
                        "White",
                        "Grey",
                        "Pink",
                        "Blue",
                        "Black",
                        "Charcoal",
                        "Custom",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamPuColour`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* THICKNESS */}
                  <Field
                    label="THICKNESS"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuThickness`]}
                  >
                    <Input
                      type="text"
                      value={material.foamPuThickness || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamPuThickness",
                          e.target.value,
                        )
                      }
                      placeholder="in MM (e.g., 3, 4, 6, 8, 10, 12)"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamPuThickness`],
                      )}
                    />
                  </Field>

                  {/* SHAPE */}
                  <Field
                    label="SHAPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuShape`]}
                  >
                    <Input
                      type="text"
                      value={material.foamPuShape || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamPuShape",
                          e.target.value,
                        )
                      }
                      placeholder="TEXT"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamPuShape`],
                      )}
                    />
                  </Field>

                  {/* UPLOAD REF IMAGE */}
                  <Field
                    label="UPLOAD REF IMAGE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuShapeRefImage`]}
                  >
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleChange(materialIndex, "foamPuShapeRefImage", f);
                      }}
                      className="hidden"
                      id={`upload-pu-foam-shape-${materialIndex}`}
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`h-11 w-full ${errors[`${errorPrefix}_foamPuShapeRefImage`] ? "border-red-600" : ""}`}
                      onClick={() =>
                        document
                          .getElementById(
                            `upload-pu-foam-shape-${materialIndex}`,
                          )
                          ?.click()
                      }
                    >
                      {material.foamPuShapeRefImage ? "UPLOADED" : "UPLOAD"}
                    </Button>
                  </Field>
                </div>

                {/* SIZE SPEC */}
                <div
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    SIZE SPEC
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field
                      label="SHEET/PCS"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPuSheetPcs`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPuSheetPcs || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPuSheetPcs",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPuSheetPcs`],
                        )}
                      />
                    </Field>
                    <Field
                      label="GSM"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPuGsm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPuGsm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPuGsm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPuGsm`],
                        )}
                      />
                    </Field>
                    <Field
                      label="LENGTH (CM)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPuLengthCm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPuLengthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPuLengthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPuLengthCm`],
                        )}
                      />
                    </Field>
                    <Field
                      label="WIDTH (CM)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPuWidthCm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPuWidthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPuWidthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPuWidthCm`],
                        )}
                      />
                    </Field>
                  </div>
                </div>

                {/* QTY - KGS and YARDAGE */}
                <div style={{ marginTop: "1.25rem" }}>
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    QTY
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field
                      label="KGS (CNS)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPuKgsCns`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPuKgsCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPuKgsCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPuKgsCns`],
                        )}
                      />
                    </Field>
                    <Field
                      label="YARDAGE (CNS)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamPuYardageCns`]}
                    >
                      <Input
                        type="text"
                        value={material.foamPuYardageCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamPuYardageCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamPuYardageCns`],
                        )}
                      />
                    </Field>
                  </div>
                </div>

                {/* TESTING REQUIREMENTS */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                  style={{ gap: "16px 12px", marginTop: "1.25rem" }}
                >
                  <Field
                    label="TESTING REQ."
                    required
                    width="sm"
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                    error={errors[`${errorPrefix}_foamPuTestingRequirements`]}
                  >
                    <div
                      className="flex items-center"
                      style={{ gap: "0.75rem" }}
                    >
                      <div className="flex-1">
                        <TestingRequirementsInput
                          value={material.foamPuTestingRequirements || []}
                          onChange={(values) =>
                            handleChange(
                              materialIndex,
                              "foamPuTestingRequirements",
                              values,
                            )
                          }
                          options={[
                            "Density Test",
                            "ILD Test",
                            "Compression Set",
                            "Resilience",
                            "Flammability",
                          ]}
                          placeholder="Type to search or select testing requirements..."
                          error={Boolean(
                            errors[`${errorPrefix}_foamPuTestingRequirements`],
                          )}
                        />
                      </div>
                      <input
                        type="file"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f)
                            handleChange(
                              materialIndex,
                              "foamPuTestingRequirementsFile",
                              f,
                            );
                        }}
                        className="hidden"
                        id={`upload-pu-foam-testing-${materialIndex}`}
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`h-11 ${errors[`${errorPrefix}_foamPuTestingRequirementsFile`] ? "border-red-600" : ""}`}
                        onClick={() =>
                          document
                            .getElementById(
                              `upload-pu-foam-testing-${materialIndex}`,
                            )
                            ?.click()
                        }
                      >
                        {material.foamPuTestingRequirementsFile
                          ? "UPLOADED"
                          : "UPLOAD"}
                      </Button>
                    </div>
                  </Field>

                  {/* APPROVAL */}
                  <Field
                    label="APPROVAL"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuApproval`]}
                  >
                    <SearchableDropdown
                      value={material.foamPuApproval || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamPuApproval",
                          selectedValue,
                        )
                      }
                      options={MATERIAL_APPROVAL_OPTIONS}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamPuApproval`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* REMARKS */}
                  <Field
                    label="REMARKS"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamPuRemarks`]}
                  >
                    <Input
                      type="text"
                      value={material.foamPuRemarks || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamPuRemarks",
                          e.target.value,
                        )
                      }
                      placeholder="32D for mattresses, CertiPUR-US for USA market, FR treatment for bedding"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamPuRemarks`],
                      )}
                    />
                  </Field>
                </div>

                {/* Show/Hide Advance Spec Button */}
                <div style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>
                  <AdvanceSpecButton
                    active={material.showFoamPuAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFoamPuAdvancedSpec",
                        !material.showFoamPuAdvancedSpec,
                      )
                    }
                  />
                </div>

                {/* Advanced Filter UI Table */}
                {material.showFoamPuAdvancedSpec && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1.5rem",
                      backgroundColor: "var(--muted)",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field label="ILD / IFD (Firmness)" width="sm">
                        <SearchableDropdown
                          value={material.foamPuIld || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuIld",
                              selectedValue,
                            )
                          }
                          options={[
                            "ILD rating (e.g., 20 Soft, 30 Medium, 40 Firm, 50+ Extra Firm)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="SUPPORT FACTOR" width="sm">
                        <SearchableDropdown
                          value={material.foamPuSupportFactor || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuSupportFactor",
                              selectedValue,
                            )
                          }
                          options={[
                            "Support Factor ratio (e.g., 1.8, 2.0, 2.4, 2.6+)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="RESILIENCE" width="sm">
                        <SearchableDropdown
                          value={material.foamPuResilience || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuResilience",
                              selectedValue,
                            )
                          }
                          options={[
                            "Resilience % (Ball Rebound Test) - 30-50% typical",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CELL STRUCTURE" width="sm">
                        <SearchableDropdown
                          value={material.foamPuCellStructure || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuCellStructure",
                              selectedValue,
                            )
                          }
                          options={[
                            "Open Cell (breathable)",
                            "Closed Cell (water resistant)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="COMPRESSION SET" width="sm">
                        <SearchableDropdown
                          value={material.foamPuCompressionSet || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuCompressionSet",
                              selectedValue,
                            )
                          }
                          options={[
                            "Compression Set % (lower is better, <10% ideal)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="TENSILE STRENGTH" width="sm">
                        <SearchableDropdown
                          value={material.foamPuTensileStrength || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuTensileStrength",
                              selectedValue,
                            )
                          }
                          options={["Tensile Strength (kPa)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="ELONGATION" width="sm">
                        <SearchableDropdown
                          value={material.foamPuElongation || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuElongation",
                              selectedValue,
                            )
                          }
                          options={["Elongation at Break (%)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="FIRE RETARDANT" width="sm">
                        <SearchableDropdown
                          value={material.foamPuFireRetardant || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuFireRetardant",
                              selectedValue,
                            )
                          }
                          options={[
                            "Standard",
                            "FR Treated (CFR 1633, TB 117-2013, BS 5852, FMVSS 302)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="ANTI-MICROBIAL" width="sm">
                        <SearchableDropdown
                          value={material.foamPuAntiMicrobial || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuAntiMicrobial",
                              selectedValue,
                            )
                          }
                          options={[
                            "Standard",
                            "Anti-Microbial Treated",
                            "Anti-Bacterial",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="DENSITY" width="sm">
                        <SearchableDropdown
                          value={material.foamPuDensity || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuDensity",
                              selectedValue,
                            )
                          }
                          options={[
                            "18 kg/m³",
                            "20 kg/m³",
                            "24 kg/m³",
                            "28 kg/m³",
                            "32 kg/m³",
                            "40 kg/m³",
                            "50 kg/m³",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CERTIFICATION" width="sm">
                        <SearchableDropdown
                          value={material.foamPuCertification || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamPuCertification",
                              selectedValue,
                            )
                          }
                          options={[
                            "CertiPUR-US",
                            "OEKO-TEX",
                            "Greenguard",
                            "REACH Compliant",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                    </div>
                  </div>
                )}
                {/* Quality Verification - after Advance Spec, inside top-border block */}
                <div
                  className="w-full max-w-xl"
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <QualityVerificationToggle
                    value={material.qualityVerification}
                    onChange={(value) =>
                      handleChange(materialIndex, "qualityVerification", value)
                    }
                    width="lg"
                    className="mb-3"
                  />
                </div>
              </>
            )}

            {/* rebonded-foam Table */}
            {material.foamTableType === "rebonded-foam" && (
              <>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                  style={{ gap: "16px 12px" }}
                >
                  {/* FOAM TYPE */}
                  <Field
                    label="FOAM TYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamRebondedType`]}
                  >
                    <SearchableDropdown
                      value={material.foamRebondedType || ""}
                      onChange={(selectedValue) => {
                        handleChange(
                          materialIndex,
                          "foamRebondedType",
                          selectedValue,
                        );
                        // Clear chip-related fields when foam type changes
                        if (selectedValue !== material.foamRebondedType) {
                          handleChange(
                            materialIndex,
                            "foamRebondedChipSource",
                            "",
                          );
                          handleChange(
                            materialIndex,
                            "foamRebondedChipSize",
                            "",
                          );
                        }
                      }}
                      options={["Rebonded Foam", "Bonded Foam", "Chip Foam"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamRebondedType`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* SUBTYPE */}
                  <Field
                    label="SUBTYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamRebondedSubtype`]}
                  >
                    <SearchableDropdown
                      value={material.foamRebondedSubtype || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamRebondedSubtype",
                          selectedValue,
                        )
                      }
                      options={[
                        "Standard Rebond",
                        "High Density Rebond",
                        "Colored Chip",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamRebondedSubtype`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* CHIP SOURCE - Conditional (only shows when Chip Foam is selected) */}
                  {material.foamRebondedType &&
                    material.foamRebondedType
                      .toLowerCase()
                      .includes("chip") && (
                      <Field label="CHIP SOURCE" width="sm">
                        <SearchableDropdown
                          value={material.foamRebondedChipSource || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamRebondedChipSource",
                              selectedValue,
                            )
                          }
                          options={[
                            "Mixed Foam Scrap",
                            "Memory Foam Chips",
                            "PU Chips",
                            "Colored Chips",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                    )}

                  {/* CHIP SIZE - Conditional (only shows when Chip Foam is selected) */}
                  {material.foamRebondedType &&
                    material.foamRebondedType
                      .toLowerCase()
                      .includes("chip") && (
                      <Field label="CHIP SIZE" width="sm">
                        <SearchableDropdown
                          value={material.foamRebondedChipSize || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamRebondedChipSize",
                              selectedValue,
                            )
                          }
                          options={[
                            "Fine Chip",
                            "Medium Chip",
                            "Coarse Chip",
                            "Mixed",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                    )}

                  {/* BONDING */}
                  <Field label="BONDING" width="sm">
                    <SearchableDropdown
                      value={material.foamRebondedBonding || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamRebondedBonding",
                          selectedValue,
                        )
                      }
                      options={["Adhesive Bonded", "Steam Bonded"]}
                      placeholder="Select or type"
                    />
                  </Field>

                  {/* COLOUR */}
                  <Field label="COLOUR" width="sm">
                    <SearchableDropdown
                      value={material.foamRebondedColour || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamRebondedColour",
                          selectedValue,
                        )
                      }
                      options={[
                        "Multi-Color (typical)",
                        "Grey",
                        "Single Color (if sorted chips)",
                      ]}
                      placeholder="Select or type"
                    />
                  </Field>

                  {/* THICKNESS */}
                  <Field label="THICKNESS" width="sm">
                    <Input
                      type="text"
                      value={material.foamRebondedThickness || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamRebondedThickness",
                          e.target.value,
                        )
                      }
                      placeholder="MM (e.g., 5mm, 10mm, 15mm, 20mm, 25mm, 50mm)"
                    />
                  </Field>

                  {/* SHAPE */}
                  <Field label="SHAPE" width="sm">
                    <Input
                      type="text"
                      value={material.foamRebondedShape || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamRebondedShape",
                          e.target.value,
                        )
                      }
                      placeholder="TEXT"
                    />
                  </Field>

                  {/* UPLOAD REF IMAGE */}
                  <Field label="UPLOAD REF IMAGE" width="sm">
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleChange(
                            materialIndex,
                            "foamRebondedShapeRefImage",
                            f,
                          );
                      }}
                      className="hidden"
                      id={`upload-rebonded-foam-shape-${materialIndex}`}
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-11 w-full"
                      onClick={() =>
                        document
                          .getElementById(
                            `upload-rebonded-foam-shape-${materialIndex}`,
                          )
                          ?.click()
                      }
                    >
                      {material.foamRebondedShapeRefImage
                        ? "UPLOADED"
                        : "UPLOAD"}
                    </Button>
                  </Field>
                </div>

                {/* SIZE SPEC */}
                <div
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    SIZE SPEC
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field label="SHEET/PCS" width="sm">
                      <Input
                        type="text"
                        value={material.foamRebondedSheetPcs || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamRebondedSheetPcs",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                      />
                    </Field>
                    <Field label="GSM" width="sm">
                      <Input
                        type="text"
                        value={material.foamRebondedGsm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamRebondedGsm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                      />
                    </Field>
                    <Field label="LENGTH (CM)" width="sm">
                      <Input
                        type="text"
                        value={material.foamRebondedLengthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamRebondedLengthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                      />
                    </Field>
                    <Field label="WIDTH (CM)" width="sm">
                      <Input
                        type="text"
                        value={material.foamRebondedWidthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamRebondedWidthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                      />
                    </Field>
                  </div>
                </div>

                {/* QTY - KGS and YARDAGE */}
                <div style={{ marginTop: "1.25rem" }}>
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    QTY
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field label="KGS (CNS)" width="sm">
                      <Input
                        type="text"
                        value={material.foamRebondedKgsCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamRebondedKgsCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                      />
                    </Field>
                    <Field label="YARDAGE (CNS)" width="sm">
                      <Input
                        type="text"
                        value={material.foamRebondedYardageCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamRebondedYardageCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                      />
                    </Field>
                  </div>
                </div>

                {/* TESTING REQUIREMENTS */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                  style={{ gap: "16px 12px", marginTop: "1.25rem" }}
                >
                  <Field
                    label="TESTING REQ."
                    width="sm"
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <div
                      className="flex items-center"
                      style={{ gap: "0.75rem" }}
                    >
                      <div className="flex-1">
                        <TestingRequirementsInput
                          value={material.foamRebondedTestingRequirements || []}
                          onChange={(values) =>
                            handleChange(
                              materialIndex,
                              "foamRebondedTestingRequirements",
                              values,
                            )
                          }
                          options={[
                            "Density",
                            "Compression Set",
                            "Tensile Strength",
                          ]}
                          placeholder="Type to search or select testing requirements..."
                        />
                      </div>
                      <input
                        type="file"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f)
                            handleChange(
                              materialIndex,
                              "foamRebondedTestingRequirementsFile",
                              f,
                            );
                        }}
                        className="hidden"
                        id={`upload-rebonded-foam-testing-${materialIndex}`}
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-11"
                        onClick={() =>
                          document
                            .getElementById(
                              `upload-rebonded-foam-testing-${materialIndex}`,
                            )
                            ?.click()
                        }
                      >
                        {material.foamRebondedTestingRequirementsFile
                          ? "UPLOADED"
                          : "UPLOAD"}
                      </Button>
                    </div>
                  </Field>

                  {/* APPROVAL */}
                  <Field
                    label="APPROVAL"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamRebondedApproval`]}
                  >
                    <SearchableDropdown
                      value={material.foamRebondedApproval || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamRebondedApproval",
                          selectedValue,
                        )
                      }
                      options={MATERIAL_APPROVAL_OPTIONS}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamRebondedApproval`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* REMARKS */}
                  <Field
                    label="REMARKS"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamRebondedRemarks`]}
                  >
                    <Input
                      type="text"
                      value={material.foamRebondedRemarks || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamRebondedRemarks",
                          e.target.value,
                        )
                      }
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamRebondedRemarks`],
                      )}
                      placeholder="Cost-effective recycled option, High density for underlay, Multi-color is standard"
                    />
                  </Field>
                </div>

                {/* Show/Hide Advance Spec Button */}
                <div style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}>
                  <AdvanceSpecButton
                    active={material.showFoamRebondedAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFoamRebondedAdvancedSpec",
                        !material.showFoamRebondedAdvancedSpec,
                      )
                    }
                  />
                </div>

                {/* Advanced Filter UI Table */}
                {material.showFoamRebondedAdvancedSpec && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1.5rem",
                      backgroundColor: "var(--muted)",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field label="ILD / IFD (Firmness)" width="sm">
                        <SearchableDropdown
                          value={material.foamRebondedIld || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamRebondedIld",
                              selectedValue,
                            )
                          }
                          options={[
                            "ILD rating (typically firm - 40, 50, 60+)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="COMPRESSION SET" width="sm">
                        <SearchableDropdown
                          value={material.foamRebondedCompressionSet || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamRebondedCompressionSet",
                              selectedValue,
                            )
                          }
                          options={["Compression Set %"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="FIRE RETARDANT" width="sm">
                        <SearchableDropdown
                          value={material.foamRebondedFireRetardant || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamRebondedFireRetardant",
                              selectedValue,
                            )
                          }
                          options={["Standard", "FR Treated"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CERTIFICATION" width="sm">
                        <SearchableDropdown
                          value={material.foamRebondedCertification || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamRebondedCertification",
                              selectedValue,
                            )
                          }
                          options={[
                            "Recycled Content Certified",
                            "REACH Compliant",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="DENSITY" width="sm">
                        <SearchableDropdown
                          value={material.foamRebondedDensity || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamRebondedDensity",
                              selectedValue,
                            )
                          }
                          options={[
                            "80 kg/m³",
                            "100 kg/m³",
                            "120 kg/m³",
                            "150 kg/m³",
                            "180 kg/m³",
                            "200 kg/m³",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                    </div>
                  </div>
                )}
                {/* Quality Verification - after Advance Spec, inside top-border block */}
                <div
                  className="w-full max-w-xl"
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <QualityVerificationToggle
                    value={material.qualityVerification}
                    onChange={(value) =>
                      handleChange(materialIndex, "qualityVerification", value)
                    }
                    width="lg"
                    className="mb-3"
                  />
                </div>
              </>
            )}

            {/* gel-infused-foam Table */}
            {material.foamTableType === "gel-infused-foam" && (
              <>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                  style={{ gap: "16px 12px" }}
                >
                  {/* FOAM TYPE */}
                  <Field
                    label="FOAM TYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedType`]}
                  >
                    <SearchableDropdown
                      value={material.foamGelInfusedType || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamGelInfusedType",
                          selectedValue,
                        )
                      }
                      options={["Gel-Infused Foam"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamGelInfusedType`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* BASE FOAM */}
                  <Field
                    label="BASE FOAM"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedBaseFoam`]}
                  >
                    <SearchableDropdown
                      value={material.foamGelInfusedBaseFoam || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamGelInfusedBaseFoam",
                          selectedValue,
                        )
                      }
                      options={["Memory Foam", "PU Foam", "HR Foam", "Latex"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamGelInfusedBaseFoam`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* GEL TYPE */}
                  <Field
                    label="GEL TYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedGelType`]}
                  >
                    <SearchableDropdown
                      value={material.foamGelInfusedGelType || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamGelInfusedGelType",
                          selectedValue,
                        )
                      }
                      options={[
                        "Gel Beads",
                        "Gel Swirl",
                        "Gel Layer",
                        "Gel Particles",
                        "Phase Change Material (PCM)",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamGelInfusedGelType`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* GEL CONTENT */}
                  <Field
                    label="GEL CONTENT"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedGelContent`]}
                  >
                    <SearchableDropdown
                      value={material.foamGelInfusedGelContent || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamGelInfusedGelContent",
                          selectedValue,
                        )
                      }
                      options={["Gel content % or concentration"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamGelInfusedGelContent`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* SUBTYPE */}
                  <Field
                    label="SUBTYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedSubtype`]}
                  >
                    <SearchableDropdown
                      value={material.foamGelInfusedSubtype || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamGelInfusedSubtype",
                          selectedValue,
                        )
                      }
                      options={["Virgin", "Blended"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamGelInfusedSubtype`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* COLOUR */}
                  <Field
                    label="COLOUR"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedColour`]}
                  >
                    <SearchableDropdown
                      value={material.foamGelInfusedColour || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamGelInfusedColour",
                          selectedValue,
                        )
                      }
                      options={[
                        "Blue (common for gel)",
                        "White",
                        "Grey",
                        "Multi-color (swirl)",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamGelInfusedColour`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* THICKNESS */}
                  <Field
                    label="THICKNESS"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedThickness`]}
                  >
                    <Input
                      type="text"
                      value={material.foamGelInfusedThickness || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamGelInfusedThickness",
                          e.target.value,
                        )
                      }
                      placeholder="MM"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamGelInfusedThickness`],
                      )}
                    />
                  </Field>

                  {/* SHAPE */}
                  <Field
                    label="SHAPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedShape`]}
                  >
                    <Input
                      type="text"
                      value={material.foamGelInfusedShape || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamGelInfusedShape",
                          e.target.value,
                        )
                      }
                      placeholder="TEXT"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamGelInfusedShape`],
                      )}
                    />
                  </Field>

                  {/* UPLOAD REF IMAGE */}
                  <Field
                    label="UPLOAD REF IMAGE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamGelInfusedShapeRefImage`]}
                  >
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleChange(
                            materialIndex,
                            "foamGelInfusedShapeRefImage",
                            f,
                          );
                      }}
                      className="hidden"
                      id={`upload-gel-infused-foam-shape-${materialIndex}`}
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`h-11 w-full ${errors[`${errorPrefix}_foamGelInfusedShapeRefImage`] ? "border-red-600" : ""}`}
                      onClick={() =>
                        document
                          .getElementById(
                            `upload-gel-infused-foam-shape-${materialIndex}`,
                          )
                          ?.click()
                      }
                    >
                      {material.foamGelInfusedShapeRefImage
                        ? "UPLOADED"
                        : "UPLOAD"}
                    </Button>
                  </Field>

                  {/* SIZE SPEC */}
                  <div
                    style={{
                      marginTop: "1.25rem",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid var(--border)",
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                      SIZE SPEC
                    </h4>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field label="SHEET/PCS" width="sm">
                        <Input
                          type="text"
                          value={material.foamGelInfusedSheetPcs || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamGelInfusedSheetPcs",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamGelInfusedSheetPcs`],
                          )}
                        />
                      </Field>
                      <Field
                        label="GSM"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamGelInfusedGsm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamGelInfusedGsm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamGelInfusedGsm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamGelInfusedGsm`],
                          )}
                        />
                      </Field>
                      <Field
                        label="LENGTH (CM)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamGelInfusedLengthCm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamGelInfusedLengthCm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamGelInfusedLengthCm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamGelInfusedLengthCm`],
                          )}
                        />
                      </Field>
                      <Field
                        label="WIDTH (CM)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamGelInfusedWidthCm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamGelInfusedWidthCm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamGelInfusedWidthCm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamGelInfusedWidthCm`],
                          )}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* QTY - KGS and YARDAGE */}
                  <div
                    style={{ marginTop: "1.25rem" }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                      QTY
                    </h4>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field
                        label="KGS (CNS)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamGelInfusedKgsCns`]}
                      >
                        <Input
                          type="text"
                          value={material.foamGelInfusedKgsCns || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamGelInfusedKgsCns",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamGelInfusedKgsCns`],
                          )}
                        />
                      </Field>
                      <Field
                        label="YARDAGE (CNS)"
                        required
                        width="sm"
                        error={
                          errors[`${errorPrefix}_foamGelInfusedYardageCns`]
                        }
                      >
                        <Input
                          type="text"
                          value={material.foamGelInfusedYardageCns || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamGelInfusedYardageCns",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamGelInfusedYardageCns`],
                          )}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5"
                    style={{ gap: "16px 12px", marginTop: "1.25rem" }}
                  >
                    {/* TESTING REQ. */}
                    <Field
                      label="TESTING REQ."
                      required
                      width="sm"
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                      error={
                        errors[
                          `${errorPrefix}_foamGelInfusedTestingRequirements`
                        ]
                      }
                    >
                      <div
                        className="flex items-center"
                        style={{ gap: "0.75rem" }}
                      >
                        <div className="flex-1">
                          <TestingRequirementsInput
                            value={
                              material.foamGelInfusedTestingRequirements || []
                            }
                            onChange={(values) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedTestingRequirements",
                                values,
                              )
                            }
                            options={[
                              "Density",
                              "ILD",
                              "Temperature Differential Test",
                              "Compression Set",
                            ]}
                            placeholder="Type to search or select testing requirements..."
                            error={Boolean(
                              errors[
                                `${errorPrefix}_foamGelInfusedTestingRequirements`
                              ],
                            )}
                          />
                        </div>
                        <input
                          type="file"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              handleChange(
                                materialIndex,
                                "foamGelInfusedTestingRequirementsFile",
                                f,
                              );
                          }}
                          className="hidden"
                          id={`upload-gel-infused-testing-${materialIndex}`}
                          accept="image/*"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`h-11 ${errors[`${errorPrefix}_foamGelInfusedTestingRequirementsFile`] ? "border-red-600" : ""}`}
                          onClick={() =>
                            document
                              .getElementById(
                                `upload-gel-infused-testing-${materialIndex}`,
                              )
                              ?.click()
                          }
                        >
                          {material.foamGelInfusedTestingRequirementsFile
                            ? "UPLOADED"
                            : "UPLOAD"}
                        </Button>
                      </div>
                    </Field>

                    {/* APPROVAL */}
                    <Field
                      label="APPROVAL"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamGelInfusedApproval`]}
                    >
                      <SearchableDropdown
                        value={material.foamGelInfusedApproval || ""}
                        onChange={(selectedValue) =>
                          handleChange(
                            materialIndex,
                            "foamGelInfusedApproval",
                            selectedValue,
                          )
                        }
                        options={MATERIAL_APPROVAL_OPTIONS}
                        placeholder="Select or type"
                        className={
                          errors[`${errorPrefix}_foamGelInfusedApproval`]
                            ? "border-red-600"
                            : ""
                        }
                      />
                    </Field>

                    {/* REMARKS */}
                    <Field
                      label="REMARKS"
                      required
                      width="sm"
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                      error={errors[`${errorPrefix}_foamGelInfusedRemarks`]}
                    >
                      <Input
                        type="text"
                        value={material.foamGelInfusedRemarks || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamGelInfusedRemarks",
                            e.target.value,
                          )
                        }
                        placeholder="Gel memory foam for hot sleepers, PCM for active temperature regulation"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamGelInfusedRemarks`],
                        )}
                      />
                    </Field>
                  </div>

                  {/* Advance Spec Button */}
                  <div
                    style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <AdvanceSpecButton
                      active={material.showFoamGelInfusedAdvancedSpec}
                      onClick={() =>
                        handleChange(
                          materialIndex,
                          "showFoamGelInfusedAdvancedSpec",
                          !material.showFoamGelInfusedAdvancedSpec,
                        )
                      }
                    />
                  </div>

                  {/* Advanced Filter UI Table */}
                  {material.showFoamGelInfusedAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        padding: "1.5rem",
                        backgroundColor: "var(--muted)",
                        borderRadius: "0.75rem",
                        border: "1px solid var(--border)",
                      }}
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                    >
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                        style={{ gap: "16px 12px" }}
                      >
                        <Field label="DENSITY" width="sm">
                          <SearchableDropdown
                            value={material.foamGelInfusedDensity || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedDensity",
                                selectedValue,
                              )
                            }
                            options={[
                              "50 kg/m³",
                              "60 kg/m³",
                              "70 kg/m³",
                              "Base foam density + gel",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="ILD / IFD (FIRMNESS)" width="sm">
                          <SearchableDropdown
                            value={material.foamGelInfusedIld || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedIld",
                                selectedValue,
                              )
                            }
                            options={["ILD rating based on base foam"]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="TEMPERATURE REGULATION" width="sm">
                          <SearchableDropdown
                            value={
                              material.foamGelInfusedTemperatureRegulation || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedTemperatureRegulation",
                                selectedValue,
                              )
                            }
                            options={["Absorbs and dissipates body heat"]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="RESPONSE TIME" width="sm">
                          <SearchableDropdown
                            value={material.foamGelInfusedResponseTime || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedResponseTime",
                                selectedValue,
                              )
                            }
                            options={[
                              "If memory foam base - response time specification",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="BREATHABILITY" width="sm">
                          <SearchableDropdown
                            value={material.foamGelInfusedBreathability || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedBreathability",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "Enhanced (ventilated)",
                              "Open Cell",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="FIRE RETARDANT" width="sm">
                          <SearchableDropdown
                            value={material.foamGelInfusedFireRetardant || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedFireRetardant",
                                selectedValue,
                              )
                            }
                            options={["FR Treated (CFR 1633, TB 117)"]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="COOLING EFFECT" width="sm">
                          <SearchableDropdown
                            value={material.foamGelInfusedCoolingEffect || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedCoolingEffect",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard Cooling",
                              "Advanced Cooling",
                              "Phase Change (PCM)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="CERTIFICATION" width="sm">
                          <SearchableDropdown
                            value={material.foamGelInfusedCertification || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamGelInfusedCertification",
                                selectedValue,
                              )
                            }
                            options={["CertiPUR-US", "OEKO-TEX", "Greenguard"]}
                            placeholder="Select or type"
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full max-w-xl"
                    style={{
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <QualityVerificationToggle
                      value={material.qualityVerification}
                      onChange={(value) =>
                        handleChange(
                          materialIndex,
                          "qualityVerification",
                          value,
                        )
                      }
                      width="lg"
                      className="mb-3"
                    />
                  </div>
                </div>
              </>
            )}

            {/* latex-foam Table */}
            {material.foamTableType === "latex-foam" && (
              <>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                  style={{ gap: "16px 12px" }}
                >
                  {/* FOAM TYPE */}
                  <Field
                    label="FOAM TYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexType`]}
                  >
                    <SearchableDropdown
                      value={material.foamLatexType || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamLatexType",
                          selectedValue,
                        )
                      }
                      options={["Latex Foam"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamLatexType`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* LATEX TYPE */}
                  <Field
                    label="LATEX TYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexLatexType`]}
                  >
                    <SearchableDropdown
                      value={material.foamLatexLatexType || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamLatexLatexType",
                          selectedValue,
                        )
                      }
                      options={[
                        "Natural Latex (NR)",
                        "Synthetic Latex (SBR)",
                        "Blended (NR+SBR)",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamLatexLatexType`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* NATURAL CONTENT */}
                  <Field
                    label="NATURAL CONTENT"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexNaturalContent`]}
                  >
                    <SearchableDropdown
                      value={material.foamLatexNaturalContent || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamLatexNaturalContent",
                          selectedValue,
                        )
                      }
                      options={[
                        "100% Natural",
                        "95% Natural",
                        "85% Natural",
                        "Blended (varies)",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamLatexNaturalContent`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* PROCESS */}
                  <Field
                    label="PROCESS"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexProcess`]}
                  >
                    <SearchableDropdown
                      value={material.foamLatexProcess || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamLatexProcess",
                          selectedValue,
                        )
                      }
                      options={["Dunlop Process", "Talalay Process"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamLatexProcess`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* SUBTYPE */}
                  <Field
                    label="SUBTYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexSubtype`]}
                  >
                    <SearchableDropdown
                      value={material.foamLatexSubtype || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamLatexSubtype",
                          selectedValue,
                        )
                      }
                      options={["Virgin", "Organic Certified"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamLatexSubtype`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* COLOUR */}
                  <Field
                    label="COLOUR"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexColour`]}
                  >
                    <SearchableDropdown
                      value={material.foamLatexColour || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamLatexColour",
                          selectedValue,
                        )
                      }
                      options={[
                        "Natural (cream/off-white)",
                        "White (bleached/synthetic)",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamLatexColour`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* THICKNESS */}
                  <Field
                    label="THICKNESS"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexThickness`]}
                  >
                    <Input
                      type="text"
                      value={material.foamLatexThickness || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamLatexThickness",
                          e.target.value,
                        )
                      }
                      placeholder="MM (e.g., 2, 3, 4, 6, 8)"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamLatexThickness`],
                      )}
                    />
                  </Field>

                  {/* SHAPE */}
                  <Field
                    label="SHAPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexShape`]}
                  >
                    <Input
                      type="text"
                      value={material.foamLatexShape || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamLatexShape",
                          e.target.value,
                        )
                      }
                      placeholder="TEXT"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamLatexShape`],
                      )}
                    />
                  </Field>

                  {/* UPLOAD REF IMAGE */}
                  <Field
                    label="UPLOAD REF IMAGE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamLatexShapeRefImage`]}
                  >
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleChange(
                            materialIndex,
                            "foamLatexShapeRefImage",
                            f,
                          );
                      }}
                      className="hidden"
                      id={`upload-latex-foam-shape-${materialIndex}`}
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`h-11 w-full ${errors[`${errorPrefix}_foamLatexShapeRefImage`] ? "border-red-600" : ""}`}
                      onClick={() =>
                        document
                          .getElementById(
                            `upload-latex-foam-shape-${materialIndex}`,
                          )
                          ?.click()
                      }
                    >
                      {material.foamLatexShapeRefImage ? "UPLOADED" : "UPLOAD"}
                    </Button>
                  </Field>

                  {/* SIZE SPEC */}
                  <div
                    style={{
                      marginTop: "1.25rem",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid var(--border)",
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                      SIZE SPEC
                    </h4>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field
                        label="SHEET/PCS"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamLatexSheetPcs`]}
                      >
                        <Input
                          type="text"
                          value={material.foamLatexSheetPcs || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamLatexSheetPcs",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamLatexSheetPcs`],
                          )}
                        />
                      </Field>
                      <Field
                        label="GSM"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamLatexGsm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamLatexGsm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamLatexGsm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamLatexGsm`],
                          )}
                        />
                      </Field>
                      <Field
                        label="LENGTH (CM)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamLatexLengthCm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamLatexLengthCm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamLatexLengthCm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamLatexLengthCm`],
                          )}
                        />
                      </Field>
                      <Field
                        label="WIDTH (CM)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamLatexWidthCm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamLatexWidthCm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamLatexWidthCm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamLatexWidthCm`],
                          )}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* QTY - KGS and YARDAGE */}
                  <div
                    style={{ marginTop: "1.25rem" }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                      QTY
                    </h4>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field
                        label="KGS (CNS)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamLatexKgsCns`]}
                      >
                        <Input
                          type="text"
                          value={material.foamLatexKgsCns || ""}
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamLatexKgsCns`],
                          )}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamLatexKgsCns",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                        />
                      </Field>
                      <Field label="YARDAGE (CNS)" width="sm">
                        <Input
                          type="text"
                          value={material.foamLatexYardageCns || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamLatexYardageCns",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamLatexYardageCns`],
                          )}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5"
                    style={{ gap: "16px 12px", marginTop: "1.25rem" }}
                  >
                    {/* TESTING REQ. */}
                    <Field
                      label="TESTING REQ."
                      required
                      width="sm"
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                      error={
                        errors[`${errorPrefix}_foamLatexTestingRequirements`]
                      }
                    >
                      <div
                        className="flex items-center"
                        style={{ gap: "0.75rem" }}
                      >
                        <div className="flex-1">
                          <TestingRequirementsInput
                            value={material.foamLatexTestingRequirements || []}
                            onChange={(values) =>
                              handleChange(
                                materialIndex,
                                "foamLatexTestingRequirements",
                                values,
                              )
                            }
                            options={[
                              "Density",
                              "ILD",
                              "Resilience",
                              "Natural Content %",
                              "GOLS Certification",
                            ]}
                            placeholder="Type to search or select testing requirements..."
                            error={Boolean(
                              errors[
                                `${errorPrefix}_foamLatexTestingRequirements`
                              ],
                            )}
                          />
                        </div>
                        <input
                          type="file"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              handleChange(
                                materialIndex,
                                "foamLatexTestingRequirementsFile",
                                f,
                              );
                          }}
                          className="hidden"
                          id={`upload-latex-testing-${materialIndex}`}
                          accept="image/*"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`h-11 ${errors[`${errorPrefix}_foamLatexTestingRequirementsFile`] ? "border-red-600" : ""}`}
                          onClick={() =>
                            document
                              .getElementById(
                                `upload-latex-testing-${materialIndex}`,
                              )
                              ?.click()
                          }
                        >
                          {material.foamLatexTestingRequirementsFile
                            ? "UPLOADED"
                            : "UPLOAD"}
                        </Button>
                      </div>
                    </Field>

                    {/* APPROVAL */}
                    <Field
                      label="APPROVAL"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamLatexApproval`]}
                    >
                      <SearchableDropdown
                        value={material.foamLatexApproval || ""}
                        onChange={(selectedValue) =>
                          handleChange(
                            materialIndex,
                            "foamLatexApproval",
                            selectedValue,
                          )
                        }
                        options={MATERIAL_APPROVAL_OPTIONS}
                        placeholder="Select or type"
                        className={
                          errors[`${errorPrefix}_foamLatexApproval`]
                            ? "border-red-600"
                            : ""
                        }
                      />
                    </Field>

                    {/* REMARKS */}
                    <Field
                      label="REMARKS"
                      required
                      width="sm"
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                      error={errors[`${errorPrefix}_foamLatexRemarks`]}
                    >
                      <Input
                        type="text"
                        value={material.foamLatexRemarks || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamLatexRemarks",
                            e.target.value,
                          )
                        }
                        placeholder="Dunlop=denser, Talalay=softer/consistent, GOLS for organic claims, 7-zone for ergonomic"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamLatexRemarks`],
                        )}
                      />
                    </Field>
                  </div>

                  {/* Advance Spec Button */}
                  <div
                    style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <AdvanceSpecButton
                      active={material.showFoamLatexAdvancedSpec}
                      onClick={() =>
                        handleChange(
                          materialIndex,
                          "showFoamLatexAdvancedSpec",
                          !material.showFoamLatexAdvancedSpec,
                        )
                      }
                    />
                  </div>

                  {/* Advanced Filter UI Table */}
                  {material.showFoamLatexAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        padding: "1.5rem",
                        backgroundColor: "var(--muted)",
                        borderRadius: "0.75rem",
                        border: "1px solid var(--border)",
                      }}
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                    >
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                        style={{ gap: "16px 12px" }}
                      >
                        <Field label="ILD / IFD (FIRMNESS)" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexIld || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexIld",
                                selectedValue,
                              )
                            }
                            options={[
                              "ILD rating (e.g., 14-19 Soft, 20-28 Medium, 29-36 Firm, 37+ Extra Firm)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="RESILIENCE" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexResilience || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexResilience",
                                selectedValue,
                              )
                            }
                            options={[
                              "Resilience % (typically 60-75% for latex)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="COMPRESSION SET" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexCompressionSet || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexCompressionSet",
                                selectedValue,
                              )
                            }
                            options={[
                              "Compression Set % (<3% for quality latex)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="PINCORE PATTERN" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexPincorePattern || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexPincorePattern",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard Pincore",
                              "Zoned (different firmness zones)",
                              "Solid",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="ZONE CONFIGURATION" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexZoneConfiguration || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexZoneConfiguration",
                                selectedValue,
                              )
                            }
                            options={[
                              "Single Zone",
                              "3-Zone",
                              "5-Zone",
                              "7-Zone (varying firmness)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="BREATHABILITY" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexBreathability || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexBreathability",
                                selectedValue,
                              )
                            }
                            options={["Excellent (natural pincore holes)"]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="HYPOALLERGENIC" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexHypoallergenic || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexHypoallergenic",
                                selectedValue,
                              )
                            }
                            options={[
                              "Naturally Hypoallergenic",
                              "Anti-Dust Mite",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="ANTI-MICROBIAL" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexAntiMicrobial || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexAntiMicrobial",
                                selectedValue,
                              )
                            }
                            options={[
                              "Naturally Anti-Microbial (latex property)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="FIRE RETARDANT" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexFireRetardant || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexFireRetardant",
                                selectedValue,
                              )
                            }
                            options={[
                              "Natural (self-extinguishing)",
                              "FR Treated",
                              "Wrapped with FR Barrier",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="CERTIFICATION" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexCertification || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexCertification",
                                selectedValue,
                              )
                            }
                            options={[
                              "GOLS (Global Organic Latex Standard)",
                              "OEKO-TEX",
                              "Eco-Institut",
                              "GOTS (if organic cotton cover)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="DENSITY" width="sm">
                          <SearchableDropdown
                            value={material.foamLatexDensity || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamLatexDensity",
                                selectedValue,
                              )
                            }
                            options={[
                              "60 kg/m³",
                              "65 kg/m³",
                              "70 kg/m³",
                              "75 kg/m³",
                              "85 kg/m³",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full max-w-xl"
                    style={{
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <QualityVerificationToggle
                      value={material.qualityVerification}
                      onChange={(value) =>
                        handleChange(
                          materialIndex,
                          "qualityVerification",
                          value,
                        )
                      }
                      width="lg"
                      className="mb-3"
                    />
                  </div>
                </div>
              </>
            )}

            {/* memory-foam Table */}
            {material.foamTableType === "memory-foam" && (
              <>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                  style={{ gap: "16px 12px" }}
                >
                  {/* FOAM TYPE */}
                  <Field
                    label="FOAM TYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamMemoryType`]}
                  >
                    <SearchableDropdown
                      value={material.foamMemoryType || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamMemoryType",
                          selectedValue,
                        )
                      }
                      options={["Memory Foam", "Visco-Elastic Foam"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamMemoryType`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* SUBTYPE */}
                  <Field
                    label="SUBTYPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamMemorySubtype`]}
                  >
                    <SearchableDropdown
                      value={material.foamMemorySubtype || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamMemorySubtype",
                          selectedValue,
                        )
                      }
                      options={["Virgin", "Blended", "Plant-Based (Bio-Foam)"]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamMemorySubtype`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* GRADE */}
                  <Field
                    label="GRADE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamMemoryGrade`]}
                  >
                    <SearchableDropdown
                      value={material.foamMemoryGrade || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamMemoryGrade",
                          selectedValue,
                        )
                      }
                      options={[
                        "Standard Memory",
                        "High Density Memory",
                        "Premium Memory",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamMemoryGrade`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* COLOUR */}
                  <Field
                    label="COLOUR"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamMemoryColour`]}
                  >
                    <SearchableDropdown
                      value={material.foamMemoryColour || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamMemoryColour",
                          selectedValue,
                        )
                      }
                      options={[
                        "White",
                        "Grey",
                        "Blue",
                        "Green (plant-based)",
                        "Charcoal",
                      ]}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamMemoryColour`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* THICKNESS */}
                  <Field
                    label="THICKNESS"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamMemoryThickness`]}
                  >
                    <Input
                      type="text"
                      value={material.foamMemoryThickness || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamMemoryThickness",
                          e.target.value,
                        )
                      }
                      placeholder="in MM (e.g., 2, 3, 4, 5, 6)"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamMemoryThickness`],
                      )}
                    />
                  </Field>

                  {/* SHAPE */}
                  <Field
                    label="SHAPE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamMemoryShape`]}
                  >
                    <Input
                      type="text"
                      value={material.foamMemoryShape || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamMemoryShape",
                          e.target.value,
                        )
                      }
                      placeholder="TEXT"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamMemoryShape`],
                      )}
                    />
                  </Field>

                  {/* UPLOAD REF IMAGE */}
                  <Field
                    label="UPLOAD REF IMAGE"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamMemoryShapeRefImage`]}
                  >
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleChange(
                            materialIndex,
                            "foamMemoryShapeRefImage",
                            f,
                          );
                      }}
                      className="hidden"
                      id={`upload-memory-foam-shape-${materialIndex}`}
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`h-11 w-full ${errors[`${errorPrefix}_foamMemoryShapeRefImage`] ? "border-red-600" : ""}`}
                      onClick={() =>
                        document
                          .getElementById(
                            `upload-memory-foam-shape-${materialIndex}`,
                          )
                          ?.click()
                      }
                    >
                      {material.foamMemoryShapeRefImage
                        ? "UPLOADED"
                        : "UPLOAD REF IMAGE"}
                    </Button>
                  </Field>

                  {/* SIZE SPEC */}
                  <div
                    style={{
                      marginTop: "1.25rem",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid var(--border)",
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                      SIZE SPEC
                    </h4>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field label="SHEET/PCS" width="sm">
                        <Input
                          type="text"
                          value={material.foamMemorySheetPcs || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamMemorySheetPcs",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                        />
                      </Field>
                      <Field
                        label="GSM"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamMemoryGsm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamMemoryGsm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamMemoryGsm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamMemoryGsm`],
                          )}
                        />
                      </Field>
                      <Field
                        label="LENGTH (CM)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamMemoryLengthCm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamMemoryLengthCm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamMemoryLengthCm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamMemoryLengthCm`],
                          )}
                        />
                      </Field>
                      <Field
                        label="WIDTH (CM)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamMemoryWidthCm`]}
                      >
                        <Input
                          type="text"
                          value={material.foamMemoryWidthCm || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamMemoryWidthCm",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamMemoryWidthCm`],
                          )}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* QTY - KGS and YARDAGE */}
                  <div
                    style={{ marginTop: "1.25rem" }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                      QTY
                    </h4>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field
                        label="KGS (CNS)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamMemoryKgsCns`]}
                      >
                        <Input
                          type="text"
                          value={material.foamMemoryKgsCns || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamMemoryKgsCns",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamMemoryKgsCns`],
                          )}
                        />
                      </Field>
                      <Field
                        label="YARDAGE (CNS)"
                        required
                        width="sm"
                        error={errors[`${errorPrefix}_foamMemoryYardageCns`]}
                      >
                        <Input
                          type="text"
                          value={material.foamMemoryYardageCns || ""}
                          onChange={(e) =>
                            handleChange(
                              materialIndex,
                              "foamMemoryYardageCns",
                              e.target.value,
                            )
                          }
                          placeholder="Enter value"
                          aria-invalid={Boolean(
                            errors[`${errorPrefix}_foamMemoryYardageCns`],
                          )}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5"
                    style={{ gap: "16px 12px", marginTop: "1.25rem" }}
                  >
                    {/* TESTING REQ. */}
                    <Field
                      label="TESTING REQ."
                      required
                      width="sm"
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                      error={
                        errors[`${errorPrefix}_foamMemoryTestingRequirements`]
                      }
                    >
                      <div
                        className="flex items-center"
                        style={{ gap: "0.75rem" }}
                      >
                        <div className="flex-1">
                          <TestingRequirementsInput
                            value={material.foamMemoryTestingRequirements || []}
                            onChange={(values) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryTestingRequirements",
                                values,
                              )
                            }
                            options={[
                              "Density",
                              "ILD",
                              "Response Time",
                              "Compression Set",
                              "VOC Emissions",
                              "Flammability",
                            ]}
                            placeholder="Type to search or select testing requirements..."
                            error={Boolean(
                              errors[
                                `${errorPrefix}_foamMemoryTestingRequirements`
                              ],
                            )}
                          />
                        </div>
                        <input
                          type="file"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              handleChange(
                                materialIndex,
                                "foamMemoryTestingRequirementsFile",
                                f,
                              );
                          }}
                          className="hidden"
                          id={`upload-memory-testing-${materialIndex}`}
                          accept="image/*"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`h-11 ${errors[`${errorPrefix}_foamMemoryTestingRequirementsFile`] ? "border-red-600" : ""}`}
                          onClick={() =>
                            document
                              .getElementById(
                                `upload-memory-testing-${materialIndex}`,
                              )
                              ?.click()
                          }
                        >
                          {material.foamMemoryTestingRequirementsFile
                            ? "UPLOADED"
                            : "UPLOAD"}
                        </Button>
                      </div>
                    </Field>

                    {/* APPROVAL */}
                    <Field
                      label="APPROVAL"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamMemoryApproval`]}
                    >
                      <SearchableDropdown
                        value={material.foamMemoryApproval || ""}
                        onChange={(selectedValue) =>
                          handleChange(
                            materialIndex,
                            "foamMemoryApproval",
                            selectedValue,
                          )
                        }
                        options={MATERIAL_APPROVAL_OPTIONS}
                        placeholder="Select or type"
                        className={
                          errors[`${errorPrefix}_foamMemoryApproval`]
                            ? "border-red-600"
                            : ""
                        }
                      />
                    </Field>

                    {/* REMARKS */}
                    <Field
                      label="REMARKS"
                      required
                      width="sm"
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                      error={errors[`${errorPrefix}_foamMemoryRemarks`]}
                    >
                      <Input
                        type="text"
                        value={material.foamMemoryRemarks || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamMemoryRemarks",
                            e.target.value,
                          )
                        }
                        placeholder="50D+ for quality, Gel-infused for cooling, Low VOC for sensitive users"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamMemoryRemarks`],
                        )}
                      />
                    </Field>
                  </div>

                  {/* Advance Spec Button */}
                  <div
                    style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <AdvanceSpecButton
                      active={material.showFoamMemoryAdvancedSpec}
                      onClick={() =>
                        handleChange(
                          materialIndex,
                          "showFoamMemoryAdvancedSpec",
                          !material.showFoamMemoryAdvancedSpec,
                        )
                      }
                    />
                  </div>

                  {/* Advanced Filter UI Table */}
                  {material.showFoamMemoryAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        padding: "1.5rem",
                        backgroundColor: "var(--muted)",
                        borderRadius: "0.75rem",
                        border: "1px solid var(--border)",
                      }}
                      className="col-span-1 md:col-span-2 lg:col-span-5"
                    >
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                        style={{ gap: "16px 12px" }}
                      >
                        <Field label="ILD / IFD (FIRMNESS)" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryIld || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryIld",
                                selectedValue,
                              )
                            }
                            options={[
                              "ILD rating (e.g., 8 Ultra-Soft, 10-12 Soft, 14 Medium, 18+ Firm)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="RESPONSE TIME" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryResponseTime || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryResponseTime",
                                selectedValue,
                              )
                            }
                            options={[
                              "Recovery Time (Slow: 5-10 sec, Medium: 3-5 sec, Fast: 1-3 sec)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="TEMPERATURE SENSITIVITY" width="sm">
                          <SearchableDropdown
                            value={
                              material.foamMemoryTemperatureSensitivity || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryTemperatureSensitivity",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard (temp sensitive)",
                              "Low Temp Sensitive",
                              "Adaptive",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="ACTIVATION TEMPERATURE" width="sm">
                          <SearchableDropdown
                            value={
                              material.foamMemoryActivationTemperature || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryActivationTemperature",
                                selectedValue,
                              )
                            }
                            options={[
                              "Temperature at which foam softens (e.g., 20-25°C, 25-30°C)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="COMPRESSION SET" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryCompressionSet || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryCompressionSet",
                                selectedValue,
                              )
                            }
                            options={[
                              "Compression Set % (<5% for quality memory foam)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="RESILIENCE" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryResilience || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryResilience",
                                selectedValue,
                              )
                            }
                            options={[
                              "Low Resilience (10-30%) - characteristic of memory foam",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="BREATHABILITY" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryBreathability || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryBreathability",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "Open Cell (breathable)",
                              "Ventilated (holes)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="INFUSION" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryInfusion || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryInfusion",
                                selectedValue,
                              )
                            }
                            options={[
                              "None",
                              "Gel-Infused",
                              "Copper-Infused",
                              "Charcoal-Infused",
                              "Green Tea",
                              "Lavender",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="COOLING TECHNOLOGY" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryCoolingTechnology || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryCoolingTechnology",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "Phase Change Material (PCM)",
                              "Gel Beads",
                              "Graphite",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="FIRE RETARDANT" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryFireRetardant || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryFireRetardant",
                                selectedValue,
                              )
                            }
                            options={[
                              "FR Treated (CFR 1633, TB 117-2013, BS 5852)",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="VOC EMISSIONS" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryVocEmissions || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryVocEmissions",
                                selectedValue,
                              )
                            }
                            options={[
                              "Low VOC",
                              "Ultra-Low VOC",
                              "CertiPUR-US Certified",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="DENSITY" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryDensity || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryDensity",
                                selectedValue,
                              )
                            }
                            options={[
                              "40 kg/m³",
                              "50 kg/m³",
                              "60 kg/m³",
                              "70 kg/m³",
                              "80 kg/m³",
                              "90 kg/m³",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                        <Field label="CERTIFICATION" width="sm">
                          <SearchableDropdown
                            value={material.foamMemoryCertification || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "foamMemoryCertification",
                                selectedValue,
                              )
                            }
                            options={[
                              "CertiPUR-US",
                              "OEKO-TEX",
                              "Greenguard Gold",
                              "REACH",
                            ]}
                            placeholder="Select or type"
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full max-w-xl"
                    style={{
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <QualityVerificationToggle
                      value={material.qualityVerification}
                      onChange={(value) =>
                        handleChange(
                          materialIndex,
                          "qualityVerification",
                          value,
                        )
                      }
                      width="lg"
                      className="mb-3"
                    />
                  </div>
                </div>
              </>
            )}

            {/* HR-foam Table */}
            {material.foamTableType === "HR-foam" && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                style={{ gap: "16px 12px" }}
              >
                {/* FOAM TYPE */}
                <Field
                  label="FOAM TYPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamHrType`]}
                >
                  <SearchableDropdown
                    value={material.foamHrType || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "foamHrType", selectedValue)
                    }
                    options={[
                      "HR Foam (High Resilience)",
                      "High Resiliency Foam",
                    ]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamHrType`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* SUBTYPE */}
                <Field
                  label="SUBTYPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamHrSubtype`]}
                >
                  <SearchableDropdown
                    value={material.foamHrSubtype || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "foamHrSubtype",
                        selectedValue,
                      )
                    }
                    options={[
                      "Virgin HR",
                      "Super HR",
                      "CME (Combustion Modified)",
                    ]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamHrSubtype`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* GRADE */}
                <Field
                  label="GRADE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamHrGrade`]}
                >
                  <SearchableDropdown
                    value={material.foamHrGrade || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "foamHrGrade", selectedValue)
                    }
                    options={["HR 35", "HR 40", "HR 45", "HR 50"]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamHrGrade`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* COLOUR */}
                <Field
                  label="COLOUR"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamHrColour`]}
                >
                  <SearchableDropdown
                    value={material.foamHrColour || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "foamHrColour", selectedValue)
                    }
                    options={["White", "Off-White", "Pink", "Blue", "Grey"]}
                    placeholder="Select or type"
                    className={
                      errors[`${errorPrefix}_foamHrColour`]
                        ? "border-red-600"
                        : ""
                    }
                  />
                </Field>

                {/* THICKNESS */}
                <Field
                  label="THICKNESS"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamHrThickness`]}
                >
                  <Input
                    type="text"
                    value={material.foamHrThickness || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "foamHrThickness",
                        e.target.value,
                      )
                    }
                    placeholder="MM"
                    aria-invalid={Boolean(
                      errors[`${errorPrefix}_foamHrThickness`],
                    )}
                  />
                </Field>

                {/* SHAPE */}
                <Field
                  label="SHAPE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamHrShape`]}
                >
                  <Input
                    type="text"
                    value={material.foamHrShape || ""}
                    onChange={(e) =>
                      handleChange(materialIndex, "foamHrShape", e.target.value)
                    }
                    placeholder="TEXT"
                    aria-invalid={Boolean(errors[`${errorPrefix}_foamHrShape`])}
                  />
                </Field>

                {/* UPLOAD REF IMAGE */}
                <Field
                  label="UPLOAD REF IMAGE"
                  required
                  width="sm"
                  error={errors[`${errorPrefix}_foamHrShapeRefImage`]}
                >
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        handleChange(materialIndex, "foamHrShapeRefImage", f);
                    }}
                    className="hidden"
                    id={`upload-hr-foam-shape-${materialIndex}`}
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`h-11 w-full ${errors[`${errorPrefix}_foamHrShapeRefImage`] ? "border-red-600" : ""}`}
                    onClick={() =>
                      document
                        .getElementById(`upload-hr-foam-shape-${materialIndex}`)
                        ?.click()
                    }
                  >
                    {material.foamHrShapeRefImage
                      ? "UPLOADED"
                      : "UPLOAD REF IMAGE"}
                  </Button>
                </Field>
                {/* SIZE SPEC */}
                <div
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--border)",
                  }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    SIZE SPEC
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field
                      label="SHEET/PCS"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamHrSheetPcs`]}
                    >
                      <Input
                        type="text"
                        value={material.foamHrSheetPcs || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamHrSheetPcs",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamHrSheetPcs`],
                        )}
                      />
                    </Field>
                    <Field
                      label="GSM"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamHrGsm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamHrGsm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamHrGsm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamHrGsm`],
                        )}
                      />
                    </Field>
                    <Field
                      label="LENGTH (CM)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamHrLengthCm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamHrLengthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamHrLengthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamHrLengthCm`],
                        )}
                      />
                    </Field>
                    <Field
                      label="WIDTH (CM)"
                      required
                      width="sm"
                      error={errors[`${errorPrefix}_foamHrWidthCm`]}
                    >
                      <Input
                        type="text"
                        value={material.foamHrWidthCm || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamHrWidthCm",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                        aria-invalid={Boolean(
                          errors[`${errorPrefix}_foamHrWidthCm`],
                        )}
                      />
                    </Field>
                  </div>
                </div>

                {/* QTY - KGS and YARDAGE */}
                <div
                  style={{ marginTop: "1.25rem" }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <h4 className="text-sm font-semibold text-foreground/90 mb-4">
                    QTY
                  </h4>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
                    style={{ gap: "16px 12px" }}
                  >
                    <Field label="KGS (CNS)" width="sm">
                      <Input
                        type="text"
                        value={material.foamHrKgsCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamHrKgsCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                      />
                    </Field>
                    <Field label="YARDAGE (CNS)" width="sm">
                      <Input
                        type="text"
                        value={material.foamHrYardageCns || ""}
                        onChange={(e) =>
                          handleChange(
                            materialIndex,
                            "foamHrYardageCns",
                            e.target.value,
                          )
                        }
                        placeholder="Enter value"
                      />
                    </Field>
                  </div>
                </div>
                {/* TESTING / SURPLUS / WASTAGE / APPROVAL / REMARKS */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-1 md:col-span-2 lg:col-span-5"
                  style={{ gap: "16px 12px", marginTop: "1.25rem" }}
                >
                  {/* TESTING REQ. */}
                  <Field
                    label="TESTING REQ."
                    required
                    width="sm"
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                    error={errors[`${errorPrefix}_foamHrTestingRequirements`]}
                  >
                    <TestingRequirementsInput
                      value={material.foamHrTestingRequirements || []}
                      onChange={(values) =>
                        handleChange(
                          materialIndex,
                          "foamHrTestingRequirements",
                          values,
                        )
                      }
                      options={[
                        "Density",
                        "ILD",
                        "Support Factor",
                        "Resilience (>60%)",
                        "Fatigue Test",
                      ]}
                      placeholder="Type to search or select testing requirements..."
                      error={Boolean(
                        errors[`${errorPrefix}_foamHrTestingRequirements`],
                      )}
                    />
                  </Field>

                  {/* APPROVAL */}
                  <Field
                    label="APPROVAL"
                    required
                    width="sm"
                    error={errors[`${errorPrefix}_foamHrApproval`]}
                  >
                    <SearchableDropdown
                      value={material.foamHrApproval || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "foamHrApproval",
                          selectedValue,
                        )
                      }
                      options={MATERIAL_APPROVAL_OPTIONS}
                      placeholder="Select or type"
                      className={
                        errors[`${errorPrefix}_foamHrApproval`]
                          ? "border-red-600"
                          : ""
                      }
                    />
                  </Field>

                  {/* REMARKS */}
                  <Field
                    label="REMARKS"
                    required
                    width="sm"
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                    error={errors[`${errorPrefix}_foamHrRemarks`]}
                  >
                    <Input
                      type="text"
                      value={material.foamHrRemarks || ""}
                      onChange={(e) =>
                        handleChange(
                          materialIndex,
                          "foamHrRemarks",
                          e.target.value,
                        )
                      }
                      placeholder="Resilience >60% is true HR, Better durability than conventional PU, CME for inherent FR"
                      aria-invalid={Boolean(
                        errors[`${errorPrefix}_foamHrRemarks`],
                      )}
                    />
                  </Field>
                </div>
                {/* Show/Hide Advance Spec Button */}
                <div
                  style={{ marginTop: "1.25rem", marginBottom: "1.25rem" }}
                  className="col-span-1 md:col-span-2 lg:col-span-5"
                >
                  <AdvanceSpecButton
                    active={material.showFoamHrAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFoamHrAdvancedSpec",
                        !material.showFoamHrAdvancedSpec,
                      )
                    }
                  />
                </div>

                {/* Advanced Filter UI Table */}
                {material.showFoamHrAdvancedSpec && (
                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1.5rem",
                      backgroundColor: "var(--muted)",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                    }}
                    className="col-span-1 md:col-span-2 lg:col-span-5"
                  >
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      style={{ gap: "16px 12px" }}
                    >
                      <Field label="ILD / IFD (Firmness)" width="sm">
                        <SearchableDropdown
                          value={material.foamHrIld || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrIld",
                              selectedValue,
                            )
                          }
                          options={["ILD rating (e.g., 25, 30, 35, 40, 45)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="SUPPORT FACTOR" width="sm">
                        <SearchableDropdown
                          value={material.foamHrSupportFactor || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrSupportFactor",
                              selectedValue,
                            )
                          }
                          options={["Support Factor (2.4-2.8+ for HR foam)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="RESILIENCE" width="sm">
                        <SearchableDropdown
                          value={material.foamHrResilience || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrResilience",
                              selectedValue,
                            )
                          }
                          options={[
                            "Resilience % (>60% for true HR foam, often 65-75%)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="COMPRESSION SET" width="sm">
                        <SearchableDropdown
                          value={material.foamHrCompressionSet || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrCompressionSet",
                              selectedValue,
                            )
                          }
                          options={["Compression Set % (<5% for quality HR)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="TENSILE STRENGTH" width="sm">
                        <SearchableDropdown
                          value={material.foamHrTensileStrength || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrTensileStrength",
                              selectedValue,
                            )
                          }
                          options={["Tensile Strength (kPa) - higher for HR"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="ELONGATION" width="sm">
                        <SearchableDropdown
                          value={material.foamHrElongation || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrElongation",
                              selectedValue,
                            )
                          }
                          options={["Elongation at Break (%)"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="FATIGUE RESISTANCE" width="sm">
                        <SearchableDropdown
                          value={material.foamHrFatigueResistance || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrFatigueResistance",
                              selectedValue,
                            )
                          }
                          options={[
                            "Fatigue Test (>80% height retention after 80,000 cycles)",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="FIRE RETARDANT" width="sm">
                        <SearchableDropdown
                          value={material.foamHrFireRetardant || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrFireRetardant",
                              selectedValue,
                            )
                          }
                          options={[
                            "Standard",
                            "CME (Combustion Modified)",
                            "FR Treated",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="CERTIFICATION" width="sm">
                        <SearchableDropdown
                          value={material.foamHrCertification || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrCertification",
                              selectedValue,
                            )
                          }
                          options={["CertiPUR-US", "OEKO-TEX", "Greenguard"]}
                          placeholder="Select or type"
                        />
                      </Field>
                      <Field label="DENSITY" width="sm">
                        <SearchableDropdown
                          value={material.foamHrDensity || ""}
                          onChange={(selectedValue) =>
                            handleChange(
                              materialIndex,
                              "foamHrDensity",
                              selectedValue,
                            )
                          }
                          options={[
                            "35 kg/m³",
                            "40 kg/m³",
                            "45 kg/m³",
                            "50 kg/m³",
                            "55 kg/m³",
                          ]}
                          placeholder="Select or type"
                        />
                      </Field>
                    </div>
                  </div>
                )}
                {/* Quality Verification - after Advance Spec, inside top-border block */}
                <div
                  className="w-full max-w-xl"
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <QualityVerificationToggle
                    value={material.qualityVerification}
                    onChange={(value) =>
                      handleChange(materialIndex, "qualityVerification", value)
                    }
                    width="lg"
                    className="mb-3"
                  />
                </div>
              </div>
            )}
            <div
              className="w-full max-w-sm"
              style={{
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <Field
                label="PROCUREMENT DATE"
                required
                width="sm"
                error={errors[`${errorPrefix}_procurementDate`]}
              >
                <Input
                  type="date"
                  min={todayDate}
                  value={material.procurementDate || ""}
                  aria-invalid={
                    errors[`${errorPrefix}_procurementDate`] ? true : undefined
                  }
                  onChange={(e) =>
                    handleProcurementDateChange(materialIndex, e.target.value)
                  }
                />
              </Field>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default FoamSpecFields;
