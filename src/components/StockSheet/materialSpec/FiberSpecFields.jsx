// Auto-extracted from GenerateFactoryCode/components/steps/Step2.jsx (Fiber block)
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

const FiberSpecFields = ({
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
          <div style={{ marginBottom: "16px" }}>
            <h3 data-spec-anchor className="text-sm font-bold text-gray-800">
              FIBER SPECIFICATIONS
            </h3>
          </div>

          <div
            className="bg-white rounded-lg border border-gray-200"
            style={{ padding: "20px" }}
          >
            {/* Table Selection Dropdown */}
            <div
              className="flex flex-col"
              style={{ marginBottom: "24px", maxWidth: "300px" }}
            >
              <label className="text-sm font-semibold text-gray-700 mb-2">
                SELECT FIBER TABLE <span className="text-red-600">*</span>
              </label>
              <SearchableDropdown
                value={material.fiberTableType || ""}
                onChange={(selectedValue) => {
                  handleChange(materialIndex, "fiberTableType", selectedValue);
                  // Clear all fiber fields when table changes
                  if (selectedValue !== material.fiberTableType) {
                    handleChange(materialIndex, "fiberFiberType", "");
                    handleChange(materialIndex, "fiberSubtype", "");
                    handleChange(materialIndex, "fiberForm", "");
                    handleChange(materialIndex, "fiberDenier", "");
                    handleChange(materialIndex, "fiberSiliconized", "");
                    handleChange(materialIndex, "fiberConjugateCrimp", "");
                    handleChange(materialIndex, "fiberColour", "");
                    handleChange(materialIndex, "fiberBirdType", "");
                    handleChange(materialIndex, "fiberDownPercentage", "");
                    handleChange(materialIndex, "fiberDownProofRequired", "");
                    handleChange(materialIndex, "fiberWoolType", "");
                    handleChange(materialIndex, "fiberMicron", "");
                    handleChange(materialIndex, "fiberKapokSource", "");
                    handleChange(materialIndex, "fiberKapokProperties", "");
                    handleChange(materialIndex, "fiberBambooType", "");
                    handleChange(materialIndex, "fiberBambooProperties", "");
                    handleChange(materialIndex, "fiberSilkFlossType", "");
                    handleChange(materialIndex, "fiberSilkFlossGrade", "");
                    handleChange(materialIndex, "fiberRecycledSource", "");
                    handleChange(
                      materialIndex,
                      "fiberRecycledCertification",
                      "",
                    );
                    handleChange(materialIndex, "fiberTencelType", "");
                    handleChange(materialIndex, "fiberBlending", "");
                    handleChange(materialIndex, "fiberEcoCertification", "");
                    handleChange(materialIndex, "fiberBiodegradable", "");
                    handleChange(materialIndex, "fiberTestingRequirements", []);
                    handleChange(materialIndex, "fiberQty", "");
                    handleChange(materialIndex, "fiberGsm", "");
                    handleChange(materialIndex, "fiberLength", "");
                    handleChange(materialIndex, "fiberWidth", "");
                    handleChange(materialIndex, "fiberQtyType", "");
                    handleChange(materialIndex, "fiberQtyValue", "");
                    handleChange(materialIndex, "fiberSurplus", "");
                    handleChange(materialIndex, "fiberWastage", "");
                    handleChange(materialIndex, "fiberApproval", "");
                    handleChange(materialIndex, "fiberRemarks", "");
                    handleChange(
                      materialIndex,
                      "fiberMicrofiberFiberLength",
                      "",
                    );
                    handleChange(materialIndex, "fiberMicrofiberStructure", "");
                    handleChange(
                      materialIndex,
                      "fiberMicrofiberClusterType",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberMicrofiberClusterSize",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberMicrofiberAntiMicrobial",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberMicrofiberHypoallergenic",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberMicrofiberLoftFillPower",
                      "",
                    );
                    handleChange(materialIndex, "fiberMicrofiberHandFeel", "");
                    handleChange(
                      materialIndex,
                      "fiberMicrofiberCertification",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeConstruction",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeLoftRating",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeFillPowerEquivalent",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeWarmthToWeight",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeWaterResistance",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeQuickDry",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeHypoallergenic",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeAntiMicrobial",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeVeganCrueltyFree",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeCertification",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberDownAlternativeMachineWashable",
                      "",
                    );
                    handleChange(materialIndex, "fiberCottonGrade", "");
                    handleChange(materialIndex, "fiberCottonStapleLength", "");
                    handleChange(materialIndex, "fiberCottonProcessing", "");
                    handleChange(materialIndex, "fiberCottonBonding", "");
                    handleChange(materialIndex, "fiberCottonNeedlePunched", "");
                    handleChange(materialIndex, "fiberCottonFireRetardant", "");
                    handleChange(
                      materialIndex,
                      "fiberCottonDustTrashContent",
                      "",
                    );
                    handleChange(
                      materialIndex,
                      "fiberCottonOrganicCertified",
                      "",
                    );
                    handleChange(materialIndex, "showFiberAdvancedSpec", false);
                  }
                }}
                options={[
                  "Polyester-Fills",
                  "Down-Feather",
                  "Wool-Natural",
                  "Specialty-Fills",
                  "Microfiber-Fill",
                  "Down-Alternative",
                  "Cotton-Fill",
                ]}
                placeholder="Select fiber table"
                className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 focus:border-primary focus:outline-none ${
                  errors[`${errorPrefix}_fiberTableType`]
                    ? "border-red-600"
                    : "border-[#e5e7eb]"
                }`}
                style={{ padding: "10px 14px", height: "44px" }}
              />
              {errors[`${errorPrefix}_fiberTableType`] && (
                <span className="text-red-600 text-xs mt-1">
                  {errors[`${errorPrefix}_fiberTableType`]}
                </span>
              )}
            </div>

            {/* Polyester-Fills Table */}
            {material.fiberTableType === "Polyester-Fills" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FIBER TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FIBER TYPE <span className="text-red-500">*</span>
                  </label>
                  <SearchableDropdown
                    value={material.fiberFiberType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberFiberType",
                        selectedValue,
                      )
                    }
                    options={mergeOptions(
                      ["Polyester (PET)", "Recycled Polyester (rPET)"],
                      "Fiber",
                      "fiberFiberType",
                    )}
                    onCustomValue={(val) =>
                      addCustomOption("Fiber", "fiberFiberType", "", val)
                    }
                    placeholder="Select or type"
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 focus:border-primary focus:outline-none ${errors[`${errorPrefix}_fiberFiberType`] ? "border-red-600" : "border-[#e5e7eb]"}`}
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                  {errors[`${errorPrefix}_fiberFiberType`] && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors[`${errorPrefix}_fiberFiberType`]}
                    </span>
                  )}
                </div>

                {/* SUBTYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    SUBTYPE <span className="text-red-500">*</span>
                  </label>
                  <SearchableDropdown
                    value={material.fiberSubtype || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberSubtype", selectedValue)
                    }
                    options={mergeOptions(
                      ["Virgin", "Recycled", "Conjugate", "Hollow Conjugate"],
                      "Fiber",
                      "fiberSubtype",
                      material.fiberFiberType || "",
                    )}
                    onCustomValue={(val) =>
                      addCustomOption(
                        "Fiber",
                        "fiberSubtype",
                        material.fiberFiberType || "",
                        val,
                      )
                    }
                    placeholder="Select or type"
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 focus:border-primary focus:outline-none ${errors[`${errorPrefix}_fiberSubtype`] ? "border-red-600" : "border-[#e5e7eb]"}`}
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                  {errors[`${errorPrefix}_fiberSubtype`] && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors[`${errorPrefix}_fiberSubtype`]}
                    </span>
                  )}
                </div>

                {/* FORM */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FORM
                  </label>
                  <SearchableDropdown
                    value={material.fiberForm || ""}
                    onChange={(selectedValue) => {
                      handleChange(materialIndex, "fiberForm", selectedValue);
                      // Clear dependent fields when form changes
                      if (selectedValue !== material.fiberForm) {
                        handleChange(materialIndex, "fiberQty", "");
                        handleChange(materialIndex, "fiberGsm", "");
                        handleChange(materialIndex, "fiberLength", "");
                        handleChange(materialIndex, "fiberWidth", "");
                        handleChange(materialIndex, "fiberQtyValue", "");
                        handleChange(materialIndex, "fiberQtyType", "");
                      }
                    }}
                    options={[
                      "Loose Fiber",
                      "Wadding/Batt",
                      "Carded Cotton",
                      "Bleached Cotton",
                      "Linter",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* DENIER */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    DENIER
                  </label>
                  <SearchableDropdown
                    value={material.fiberDenier || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberDenier", selectedValue)
                    }
                    options={["1D", "1.2D", "3D", "6D", "7D", "10D", "15D"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* SILICONIZED */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    SILICONIZED
                  </label>
                  <SearchableDropdown
                    value={material.fiberSiliconized || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberSiliconized",
                        selectedValue,
                      )
                    }
                    options={[
                      "Non-Siliconized",
                      "Siliconized (slick finish)",
                      "Super Siliconized",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* CONJUGATE/CRIMP */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    CONJUGATE/CRIMP
                  </label>
                  <SearchableDropdown
                    value={material.fiberConjugateCrimp || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberConjugateCrimp",
                        selectedValue,
                      )
                    }
                    options={[
                      "Non-Conjugate (straight)",
                      "Conjugate (crimped)",
                      "3D Crimp",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* COLOUR */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COLOUR
                  </label>
                  <SearchableDropdown
                    value={material.fiberColour || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberColour", selectedValue)
                    }
                    options={[
                      "Optical White",
                      "Natural White",
                      "Dope Dyed (solution dyed)",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* TESTING REQUIREMENTS - Multi-select with chips */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    TESTING REQUIREMENTS
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-primary focus-within:outline-none"
                      style={{
                        padding: "8px 12px",
                        minHeight: "44px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        cursor: "text",
                      }}
                    >
                      {/* Selected chips */}
                      {(Array.isArray(material.fiberTestingRequirements)
                        ? material.fiberTestingRequirements
                        : []
                      ).map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: "#ffe6d9",
                            color: "#9a3412",
                            border: "1px solid #fdba8c",
                          }}
                        >
                          {req}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              const updated = current.filter(
                                (_, i) => i !== index,
                              );
                              handleChange(
                                materialIndex,
                                "fiberTestingRequirements",
                                updated,
                              );
                            }}
                            style={{
                              marginLeft: "4px",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              color: "#9a3412",
                              fontWeight: "bold",
                              fontSize: "14px",
                              lineHeight: "1",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Dropdown for selecting new options */}
                      <div
                        id={`fiber-testing-wrapper-${materialIndex}`}
                        style={{ flex: 1, minWidth: "200px" }}
                      >
                        <SearchableDropdown
                          value=""
                          strictMode={false}
                          onChange={(selectedValue) => {
                            const options = [
                              "Fiber Fineness",
                              "Loft Recovery",
                              "Compression Resilience",
                              "Cleanliness",
                            ];
                            if (
                              selectedValue &&
                              options.includes(selectedValue)
                            ) {
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              if (!current.includes(selectedValue)) {
                                const updated = [...current, selectedValue];
                                handleChange(
                                  materialIndex,
                                  "fiberTestingRequirements",
                                  updated,
                                );
                              }
                            }
                          }}
                          options={[
                            "Fiber Fineness",
                            "Loft Recovery",
                            "Compression Resilience",
                            "Cleanliness",
                          ]}
                          placeholder={
                            Array.isArray(material.fiberTestingRequirements) &&
                            material.fiberTestingRequirements.length === 0
                              ? "Select testing requirements"
                              : "Add more..."
                          }
                          className="border-0 outline-none"
                          style={{
                            padding: "4px 0",
                            height: "auto",
                            minHeight: "32px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                            borderWidth: "0",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            const input = e.target;
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#f94d00";
                              container.style.boxShadow =
                                "0 0 0 3px rgba(249, 77, 0, 0.1)";
                            }
                            const handleKeyDown = (keyEvent) => {
                              if (
                                keyEvent.key === "Enter" &&
                                input.value &&
                                input.value.trim()
                              ) {
                                keyEvent.preventDefault();
                                keyEvent.stopPropagation();
                                const newValue = input.value.trim();
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                const options = [
                                  "Fiber Fineness",
                                  "Loft Recovery",
                                  "Compression Resilience",
                                  "Cleanliness",
                                ];
                                if (!current.includes(newValue)) {
                                  if (!options.includes(newValue)) {
                                    const updated = [...current, newValue];
                                    handleChange(
                                      materialIndex,
                                      "fiberTestingRequirements",
                                      updated,
                                    );
                                  }
                                  input.value = "";
                                  input.blur();
                                }
                              }
                            };
                            input.addEventListener("keydown", handleKeyDown);
                            input._enterHandler = handleKeyDown;
                          }}
                          onBlur={(e) => {
                            const input = e.target;
                            if (input._enterHandler) {
                              input.removeEventListener(
                                "keydown",
                                input._enterHandler,
                              );
                              input._enterHandler = null;
                            }
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#e5e7eb";
                              container.style.boxShadow = "none";
                            }
                            if (input.value && input.value.trim()) {
                              const typedValue = input.value.trim();
                              const options = [
                                "Fiber Fineness",
                                "Loft Recovery",
                                "Compression Resilience",
                                "Cleanliness",
                              ];
                              if (!options.includes(typedValue)) {
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                if (!current.includes(typedValue)) {
                                  const updated = [...current, typedValue];
                                  handleChange(
                                    materialIndex,
                                    "fiberTestingRequirements",
                                    updated,
                                  );
                                }
                              }
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional Fields based on FORM */}
                {material.fiberForm === "Loose Fiber" && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      QTY
                    </label>
                    <input
                      type="text"
                      value={material.fiberQty || ""}
                      onChange={(e) =>
                        handleChange(materialIndex, "fiberQty", e.target.value)
                      }
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{
                        padding: "10px 14px",
                        height: "44px",
                        width: "300px",
                      }}
                      placeholder="Enter QTY in KGS"
                    />
                  </div>
                )}

                {material.fiberForm === "Wadding/Batt" && (
                  <>
                    {/* SIZE SPEC Section */}
                    <div
                      className="col-span-1 md:col-span-2 lg:col-span-4"
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <label className="text-sm font-bold text-gray-800 mb-4 block">
                        SIZE SPEC
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* GSM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            GSM
                          </label>
                          <input
                            type="text"
                            value={material.fiberGsm || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberGsm",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter GSM"
                          />
                        </div>

                        {/* LENGTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberLength || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberLength",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter length"
                          />
                        </div>

                        {/* WIDTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberWidth || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberWidth",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter width"
                          />
                        </div>
                      </div>

                      {/* QTY with dropdown (KGS/Yardage) - Full width below the grid */}
                      <div
                        className="flex flex-col"
                        style={{ marginTop: "16px" }}
                      >
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          QTY
                        </label>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            alignItems: "center",
                            width: "fit-content",
                          }}
                        >
                          <SearchableDropdown
                            value={material.fiberQtyType || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberQtyType",
                                selectedValue,
                              )
                            }
                            options={["KGS", "Yardage"]}
                            placeholder="Select"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "120px",
                              flexShrink: 0,
                            }}
                          />
                          <input
                            type="text"
                            value={material.fiberQtyValue || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberQtyValue",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "200px",
                              flexShrink: 0,
                            }}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* APPROVAL */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    APPROVAL
                  </label>
                  <SearchableDropdown
                    value={material.fiberApproval || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberApproval",
                        selectedValue,
                      )
                    }
                    options={MATERIAL_APPROVAL_OPTIONS}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* REMARKS */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    REMARKS
                  </label>
                  <textarea
                    value={material.fiberRemarks || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "fiberRemarks",
                        e.target.value,
                      )
                    }
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", minHeight: "44px" }}
                    rows="1"
                    placeholder="7D Hollow Siliconized for premium pillows, Ball fiber for machine washable products"
                  />
                </div>

                {/* ADVANCE SPEC Button and Fields */}
                <div
                  className="col-span-1 md:col-span-2 lg:col-span-4 w-full"
                  style={{ marginTop: "20px" }}
                >
                  <AdvanceSpecButton
                    active={material.showFiberAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFiberAdvancedSpec",
                        !material.showFiberAdvancedSpec,
                      )
                    }
                  />
                  {material.showFiberAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* FIBER LENGTH */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            FIBER LENGTH
                          </label>
                          <SearchableDropdown
                            value={material.fiberFiberLength || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberFiberLength",
                                selectedValue,
                              )
                            }
                            options={["32mm", "51mm", "64mm (Staple Length)"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* STRUCTURE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            STRUCTURE
                          </label>
                          <SearchableDropdown
                            value={material.fiberStructure || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberStructure",
                                selectedValue,
                              )
                            }
                            options={[
                              "Solid",
                              "Hollow (2-hole)",
                              "Hollow (4-hole)",
                              "Hollow (7-hole)",
                              "Spiral Hollow",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* THERMAL BONDED */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            THERMAL BONDED
                          </label>
                          <SearchableDropdown
                            value={material.fiberThermalBonded || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberThermalBonded",
                                selectedValue,
                              )
                            }
                            options={[
                              "Non-Bonded",
                              "Thermal Bonded",
                              "Spray Bonded",
                              "Resin Bonded",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* ANTI-MICROBIAL */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            ANTI-MICROBIAL
                          </label>
                          <SearchableDropdown
                            value={material.fiberAntiMicrobial || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberAntiMicrobial",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "Anti-Microbial Treated",
                              "Anti-Bacterial",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* FIRE RETARDANT */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            FIRE RETARDANT
                          </label>
                          <SearchableDropdown
                            value={material.fiberFireRetardant || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberFireRetardant",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "FR Treated (CFR 1633)",
                              "FR Treated (TB 117)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* CERTIFICATION */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            CERTIFICATION
                          </label>
                          <SearchableDropdown
                            value={material.fiberCertification || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCertification",
                                selectedValue,
                              )
                            }
                            options={[
                              "OEKO-TEX Standard 100",
                              "GRS (Global Recycled Standard)",
                              "Bluesign",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* LOFT / FILL POWER */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LOFT / FILL POWER
                          </label>
                          <SearchableDropdown
                            value={material.fiberLoftFillPower || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberLoftFillPower",
                                selectedValue,
                              )
                            }
                            options={[
                              "Low Loft",
                              "Medium Loft",
                              "High Loft (specify inches)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full"
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
              </div>
            )}

            {/* Down-Feather Table */}
            {material.fiberTableType === "Down-Feather" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FIBER TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FIBER TYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberFiberType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberFiberType",
                        selectedValue,
                      )
                    }
                    options={["Down", "Feather", "Down & Feather Blend"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* BIRD TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    BIRD TYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberBirdType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberBirdType",
                        selectedValue,
                      )
                    }
                    options={[
                      "Goose Down",
                      "Duck Down",
                      "Goose Feather",
                      "Duck Feather",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* FORM */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FORM
                  </label>
                  <SearchableDropdown
                    value={material.fiberForm || ""}
                    onChange={(selectedValue) => {
                      handleChange(materialIndex, "fiberForm", selectedValue);
                      // Clear dependent fields when form changes
                      if (selectedValue !== material.fiberForm) {
                        handleChange(materialIndex, "fiberQty", "");
                        handleChange(materialIndex, "fiberGsm", "");
                        handleChange(materialIndex, "fiberLength", "");
                        handleChange(materialIndex, "fiberWidth", "");
                        handleChange(materialIndex, "fiberQtyValue", "");
                        handleChange(materialIndex, "fiberQtyType", "");
                      }
                    }}
                    options={["Loose Fiber", "Cluster/Ball Fiber", "Wadding"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* ORIGIN */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    ORIGIN
                  </label>
                  <SearchableDropdown
                    value={material.fiberOrigin || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberOrigin", selectedValue)
                    }
                    options={[
                      "European (Hungarian)",
                      "European (Polish)",
                      "Chinese",
                      "North American",
                      "Siberian",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* DOWN PERCENTAGE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    DOWN PERCENTAGE
                  </label>
                  <SearchableDropdown
                    value={material.fiberDownPercentage || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberDownPercentage",
                        selectedValue,
                      )
                    }
                    options={["90/10", "80/20", "70/30", "50/50"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* COLOUR */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COLOUR
                  </label>
                  <SearchableDropdown
                    value={material.fiberColour || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberColour", selectedValue)
                    }
                    options={["White", "Grey"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* DOWN-PROOF REQUIRED */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    DOWN-PROOF REQUIRED
                  </label>
                  <SearchableDropdown
                    value={material.fiberDownProofRequired || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberDownProofRequired",
                        selectedValue,
                      )
                    }
                    options={["Yes (shell must be down-proof)", "No"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* TESTING REQUIREMENTS - Multi-select with chips */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    TESTING REQUIREMENTS
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-primary focus-within:outline-none"
                      style={{
                        padding: "8px 12px",
                        minHeight: "44px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        cursor: "text",
                      }}
                    >
                      {/* Selected chips */}
                      {(Array.isArray(material.fiberTestingRequirements)
                        ? material.fiberTestingRequirements
                        : []
                      ).map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: "#ffe6d9",
                            color: "#9a3412",
                            border: "1px solid #fdba8c",
                          }}
                        >
                          {req}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              const updated = current.filter(
                                (_, i) => i !== index,
                              );
                              handleChange(
                                materialIndex,
                                "fiberTestingRequirements",
                                updated,
                              );
                            }}
                            style={{
                              marginLeft: "4px",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              color: "#9a3412",
                              fontWeight: "bold",
                              fontSize: "14px",
                              lineHeight: "1",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Dropdown for selecting new options */}
                      <div
                        id={`fiber-testing-wrapper-down-${materialIndex}`}
                        style={{ flex: 1, minWidth: "200px" }}
                      >
                        <SearchableDropdown
                          value=""
                          strictMode={false}
                          onChange={(selectedValue) => {
                            const options = [
                              "Fill Power Test",
                              "Oxygen Number",
                              "Turbidity",
                              "Species ID",
                              "RDS Audit",
                            ];
                            if (
                              selectedValue &&
                              options.includes(selectedValue)
                            ) {
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              if (!current.includes(selectedValue)) {
                                const updated = [...current, selectedValue];
                                handleChange(
                                  materialIndex,
                                  "fiberTestingRequirements",
                                  updated,
                                );
                              }
                            }
                          }}
                          options={[
                            "Fill Power Test",
                            "Oxygen Number",
                            "Turbidity",
                            "Species ID",
                            "RDS Audit",
                          ]}
                          placeholder={
                            Array.isArray(material.fiberTestingRequirements) &&
                            material.fiberTestingRequirements.length === 0
                              ? "Select testing requirements"
                              : "Add more..."
                          }
                          className="border-0 outline-none"
                          style={{
                            padding: "4px 0",
                            height: "auto",
                            minHeight: "32px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                            borderWidth: "0",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            const input = e.target;
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#f94d00";
                              container.style.boxShadow =
                                "0 0 0 3px rgba(249, 77, 0, 0.1)";
                            }
                            const handleKeyDown = (keyEvent) => {
                              if (
                                keyEvent.key === "Enter" &&
                                input.value &&
                                input.value.trim()
                              ) {
                                keyEvent.preventDefault();
                                keyEvent.stopPropagation();
                                const newValue = input.value.trim();
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                const options = [
                                  "Fill Power Test",
                                  "Oxygen Number",
                                  "Turbidity",
                                  "Species ID",
                                  "RDS Audit",
                                ];
                                if (!current.includes(newValue)) {
                                  if (!options.includes(newValue)) {
                                    const updated = [...current, newValue];
                                    handleChange(
                                      materialIndex,
                                      "fiberTestingRequirements",
                                      updated,
                                    );
                                  }
                                  input.value = "";
                                  input.blur();
                                }
                              }
                            };
                            input.addEventListener("keydown", handleKeyDown);
                            input._enterHandler = handleKeyDown;
                          }}
                          onBlur={(e) => {
                            const input = e.target;
                            if (input._enterHandler) {
                              input.removeEventListener(
                                "keydown",
                                input._enterHandler,
                              );
                              input._enterHandler = null;
                            }
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#e5e7eb";
                              container.style.boxShadow = "none";
                            }
                            if (input.value && input.value.trim()) {
                              const typedValue = input.value.trim();
                              const options = [
                                "Fill Power Test",
                                "Oxygen Number",
                                "Turbidity",
                                "Species ID",
                                "RDS Audit",
                              ];
                              if (!options.includes(typedValue)) {
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                if (!current.includes(typedValue)) {
                                  const updated = [...current, typedValue];
                                  handleChange(
                                    materialIndex,
                                    "fiberTestingRequirements",
                                    updated,
                                  );
                                }
                              }
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional Fields based on FORM */}
                {material.fiberForm === "Loose Fiber" && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      QTY
                    </label>
                    <input
                      type="text"
                      value={material.fiberQty || ""}
                      onChange={(e) =>
                        handleChange(materialIndex, "fiberQty", e.target.value)
                      }
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{
                        padding: "10px 14px",
                        height: "44px",
                        width: "300px",
                      }}
                      placeholder="Enter QTY in KGS"
                    />
                  </div>
                )}

                {material.fiberForm === "Wadding" && (
                  <>
                    {/* SIZE SPEC Section */}
                    <div
                      className="col-span-1 md:col-span-2 lg:col-span-4"
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <label className="text-sm font-bold text-gray-800 mb-4 block">
                        SIZE SPEC
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* GSM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            GSM
                          </label>
                          <input
                            type="text"
                            value={material.fiberGsm || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberGsm",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter GSM"
                          />
                        </div>

                        {/* LENGTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberLength || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberLength",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter length"
                          />
                        </div>

                        {/* WIDTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberWidth || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberWidth",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter width"
                          />
                        </div>
                      </div>

                      {/* QTY with dropdown (KGS/Yardage) - Full width below the grid */}
                      <div
                        className="flex flex-col"
                        style={{ marginTop: "16px" }}
                      >
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          QTY
                        </label>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            alignItems: "center",
                            width: "fit-content",
                          }}
                        >
                          <SearchableDropdown
                            value={material.fiberQtyType || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberQtyType",
                                selectedValue,
                              )
                            }
                            options={["KGS", "Yardage"]}
                            placeholder="Select"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "120px",
                              flexShrink: 0,
                            }}
                          />
                          <input
                            type="text"
                            value={material.fiberQtyValue || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberQtyValue",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "200px",
                              flexShrink: 0,
                            }}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* APPROVAL */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    APPROVAL
                  </label>
                  <SearchableDropdown
                    value={material.fiberApproval || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberApproval",
                        selectedValue,
                      )
                    }
                    options={MATERIAL_APPROVAL_OPTIONS}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* REMARKS */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    REMARKS
                  </label>
                  <textarea
                    value={material.fiberRemarks || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "fiberRemarks",
                        e.target.value,
                      )
                    }
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", minHeight: "44px" }}
                    rows="1"
                    placeholder="Must be RDS certified, Hungarian White Goose Down for luxury, 4x washed for hypoallergenic"
                  />
                </div>

                {/* ADVANCE SPEC Button and Fields for Down-Feather */}
                <div
                  className="col-span-1 md:col-span-2 lg:col-span-4 w-full"
                  style={{ marginTop: "20px" }}
                >
                  <AdvanceSpecButton
                    active={material.showFiberAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFiberAdvancedSpec",
                        !material.showFiberAdvancedSpec,
                      )
                    }
                  />
                  {material.showFiberAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* FILL POWER */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            FILL POWER
                          </label>
                          <SearchableDropdown
                            value={material.fiberFillPower || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberFillPower",
                                selectedValue,
                              )
                            }
                            options={[
                              "500",
                              "550",
                              "600",
                              "650",
                              "700",
                              "750",
                              "800",
                              "850+ (cubic inches/oz)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* PROCESSING */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            PROCESSING
                          </label>
                          <SearchableDropdown
                            value={material.fiberProcessing || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberProcessing",
                                selectedValue,
                              )
                            }
                            options={[
                              "Washed (2x)",
                              "Washed (3x)",
                              "Washed (4x)",
                              "Sterilized",
                              "Sanitized",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* OXYGEN NUMBER */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            OXYGEN NUMBER
                          </label>
                          <SearchableDropdown
                            value={material.fiberOxygenNumber || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberOxygenNumber",
                                selectedValue,
                              )
                            }
                            options={["Oxygen Number (cleanliness, <10 ideal)"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* TURBIDITY */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            TURBIDITY
                          </label>
                          <SearchableDropdown
                            value={material.fiberTurbidity || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberTurbidity",
                                selectedValue,
                              )
                            }
                            options={["Turbidity (clarity, <300 NTU ideal)"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* ODOR */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            ODOR
                          </label>
                          <SearchableDropdown
                            value={material.fiberOdor || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberOdor",
                                selectedValue,
                              )
                            }
                            options={[
                              "No odor",
                              "Minimal (must pass odor test)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* ANTI-MICROBIAL */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            ANTI-MICROBIAL
                          </label>
                          <SearchableDropdown
                            value={material.fiberAntiMicrobial || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberAntiMicrobial",
                                selectedValue,
                              )
                            }
                            options={["Standard", "Anti-Microbial Treated"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* TRACEABILITY */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            TRACEABILITY
                          </label>
                          <SearchableDropdown
                            value={material.fiberTraceability || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberTraceability",
                                selectedValue,
                              )
                            }
                            options={["Chain of Custody", "Farm Traceable"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* CLUSTER SIZE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            CLUSTER SIZE
                          </label>
                          <SearchableDropdown
                            value={material.fiberClusterSize || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberClusterSize",
                                selectedValue,
                              )
                            }
                            options={[
                              "Small",
                              "Medium",
                              "Large (larger clusters = higher fill power)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* CERTIFICATION */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            CERTIFICATION
                          </label>
                          <SearchableDropdown
                            value={material.fiberCertification || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCertification",
                                selectedValue,
                              )
                            }
                            options={[
                              "RDS (Responsible Down Standard)",
                              "Downpass",
                              "Bluesign",
                              "IDFL Certified",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full"
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
              </div>
            )}

            {/* Wool-Natural Table */}
            {material.fiberTableType === "Wool-Natural" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FIBER TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FIBER TYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberFiberType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberFiberType",
                        selectedValue,
                      )
                    }
                    options={["Wool", "Alpaca", "Camel Hair", "Cashmere"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* WOOL TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    WOOL TYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberWoolType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberWoolType",
                        selectedValue,
                      )
                    }
                    options={[
                      "Merino Wool",
                      "Shetland Wool",
                      "Lambswool",
                      "Generic Wool",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* SUBTYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    SUBTYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberSubtype || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberSubtype", selectedValue)
                    }
                    options={["Virgin Wool", "Recycled Wool", "Organic Wool"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* FORM */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FORM
                  </label>
                  <SearchableDropdown
                    value={material.fiberForm || ""}
                    onChange={(selectedValue) => {
                      handleChange(materialIndex, "fiberForm", selectedValue);
                      // Clear dependent fields when form changes
                      if (selectedValue !== material.fiberForm) {
                        handleChange(materialIndex, "fiberQty", "");
                        handleChange(materialIndex, "fiberGsm", "");
                        handleChange(materialIndex, "fiberLength", "");
                        handleChange(materialIndex, "fiberWidth", "");
                        handleChange(materialIndex, "fiberQtyValue", "");
                        handleChange(materialIndex, "fiberQtyType", "");
                      }
                    }}
                    options={[
                      "Loose Fiber",
                      "Wadding/Batt",
                      "Roving",
                      "Carded Wool",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* MICRON */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    MICRON
                  </label>
                  <SearchableDropdown
                    value={material.fiberMicron || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberMicron", selectedValue)
                    }
                    options={[
                      "Fine (<20 micron)",
                      "Medium (20-25)",
                      "Coarse (>25 micron)",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* COLOUR */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COLOUR
                  </label>
                  <SearchableDropdown
                    value={material.fiberColour || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberColour", selectedValue)
                    }
                    options={[
                      "Natural White",
                      "Natural Grey",
                      "Ecru",
                      "Bleached",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* TESTING REQUIREMENTS - Multi-select with chips */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    TESTING REQUIREMENTS
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-primary focus-within:outline-none"
                      style={{
                        padding: "8px 12px",
                        minHeight: "44px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        cursor: "text",
                      }}
                    >
                      {/* Selected chips */}
                      {(Array.isArray(material.fiberTestingRequirements)
                        ? material.fiberTestingRequirements
                        : []
                      ).map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: "#ffe6d9",
                            color: "#9a3412",
                            border: "1px solid #fdba8c",
                          }}
                        >
                          {req}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              const updated = current.filter(
                                (_, i) => i !== index,
                              );
                              handleChange(
                                materialIndex,
                                "fiberTestingRequirements",
                                updated,
                              );
                            }}
                            style={{
                              marginLeft: "4px",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              color: "#9a3412",
                              fontWeight: "bold",
                              fontSize: "14px",
                              lineHeight: "1",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Dropdown for selecting new options */}
                      <div
                        id={`fiber-testing-wrapper-wool-${materialIndex}`}
                        style={{ flex: 1, minWidth: "200px" }}
                      >
                        <SearchableDropdown
                          value=""
                          strictMode={false}
                          onChange={(selectedValue) => {
                            const options = [
                              "Micron Test",
                              "Clean Wool Yield",
                              "Vegetable Matter Content",
                              "Moisture",
                            ];
                            if (
                              selectedValue &&
                              options.includes(selectedValue)
                            ) {
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              if (!current.includes(selectedValue)) {
                                const updated = [...current, selectedValue];
                                handleChange(
                                  materialIndex,
                                  "fiberTestingRequirements",
                                  updated,
                                );
                              }
                            }
                          }}
                          options={[
                            "Micron Test",
                            "Clean Wool Yield",
                            "Vegetable Matter Content",
                            "Moisture",
                          ]}
                          placeholder={
                            Array.isArray(material.fiberTestingRequirements) &&
                            material.fiberTestingRequirements.length === 0
                              ? "Select testing requirements"
                              : "Add more..."
                          }
                          className="border-0 outline-none"
                          style={{
                            padding: "4px 0",
                            height: "auto",
                            minHeight: "32px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                            borderWidth: "0",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            const input = e.target;
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#f94d00";
                              container.style.boxShadow =
                                "0 0 0 3px rgba(249, 77, 0, 0.1)";
                            }
                            const handleKeyDown = (keyEvent) => {
                              if (
                                keyEvent.key === "Enter" &&
                                input.value &&
                                input.value.trim()
                              ) {
                                keyEvent.preventDefault();
                                keyEvent.stopPropagation();
                                const newValue = input.value.trim();
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                const options = [
                                  "Micron Test",
                                  "Clean Wool Yield",
                                  "Vegetable Matter Content",
                                  "Moisture",
                                ];
                                if (!current.includes(newValue)) {
                                  if (!options.includes(newValue)) {
                                    const updated = [...current, newValue];
                                    handleChange(
                                      materialIndex,
                                      "fiberTestingRequirements",
                                      updated,
                                    );
                                  }
                                  input.value = "";
                                  input.blur();
                                }
                              }
                            };
                            input.addEventListener("keydown", handleKeyDown);
                            input._enterHandler = handleKeyDown;
                          }}
                          onBlur={(e) => {
                            const input = e.target;
                            if (input._enterHandler) {
                              input.removeEventListener(
                                "keydown",
                                input._enterHandler,
                              );
                              input._enterHandler = null;
                            }
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#e5e7eb";
                              container.style.boxShadow = "none";
                            }
                            if (input.value && input.value.trim()) {
                              const typedValue = input.value.trim();
                              const options = [
                                "Micron Test",
                                "Clean Wool Yield",
                                "Vegetable Matter Content",
                                "Moisture",
                              ];
                              if (!options.includes(typedValue)) {
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                if (!current.includes(typedValue)) {
                                  const updated = [...current, typedValue];
                                  handleChange(
                                    materialIndex,
                                    "fiberTestingRequirements",
                                    updated,
                                  );
                                }
                              }
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional Fields based on FORM */}
                {material.fiberForm === "Loose Fiber" && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      QTY
                    </label>
                    <input
                      type="text"
                      value={material.fiberQty || ""}
                      onChange={(e) =>
                        handleChange(materialIndex, "fiberQty", e.target.value)
                      }
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{
                        padding: "10px 14px",
                        height: "44px",
                        width: "300px",
                      }}
                      placeholder="Enter QTY in KGS"
                    />
                  </div>
                )}

                {material.fiberForm === "Wadding/Batt" && (
                  <>
                    {/* SIZE SPEC Section */}
                    <div
                      className="col-span-1 md:col-span-2 lg:col-span-4"
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <label className="text-sm font-bold text-gray-800 mb-4 block">
                        SIZE SPEC
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* GSM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            GSM
                          </label>
                          <input
                            type="text"
                            value={material.fiberGsm || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberGsm",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter GSM"
                          />
                        </div>

                        {/* LENGTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberLength || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberLength",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter length"
                          />
                        </div>

                        {/* WIDTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberWidth || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberWidth",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter width"
                          />
                        </div>
                      </div>

                      {/* QTY with dropdown (KGS/Yardage) - Full width below the grid */}
                      <div
                        className="flex flex-col"
                        style={{ marginTop: "16px" }}
                      >
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          QTY
                        </label>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            alignItems: "center",
                            width: "fit-content",
                          }}
                        >
                          <SearchableDropdown
                            value={material.fiberQtyType || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberQtyType",
                                selectedValue,
                              )
                            }
                            options={["KGS", "Yardage"]}
                            placeholder="Select"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "120px",
                              flexShrink: 0,
                            }}
                          />
                          <input
                            type="text"
                            value={material.fiberQtyValue || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberQtyValue",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "200px",
                              flexShrink: 0,
                            }}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* APPROVAL */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    APPROVAL
                  </label>
                  <SearchableDropdown
                    value={material.fiberApproval || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberApproval",
                        selectedValue,
                      )
                    }
                    options={MATERIAL_APPROVAL_OPTIONS}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* REMARKS */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    REMARKS
                  </label>
                  <textarea
                    value={material.fiberRemarks || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "fiberRemarks",
                        e.target.value,
                      )
                    }
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", minHeight: "44px" }}
                    rows="1"
                    placeholder="Merino for softness, RWS certified for ethical sourcing, Naturally temperature regulating"
                  />
                </div>

                {/* ADVANCE SPEC Button and Fields for Wool-Natural */}
                <div
                  className="col-span-1 md:col-span-2 lg:col-span-4 w-full"
                  style={{ marginTop: "20px" }}
                >
                  <AdvanceSpecButton
                    active={material.showFiberAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFiberAdvancedSpec",
                        !material.showFiberAdvancedSpec,
                      )
                    }
                  />
                  {material.showFiberAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* PROCESSING */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            PROCESSING
                          </label>
                          <SearchableDropdown
                            value={material.fiberProcessing || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberProcessing",
                                selectedValue,
                              )
                            }
                            options={[
                              "Scoured (washed)",
                              "Carbonized (vegetable matter removed)",
                              "Needle Punched",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* LANOLIN CONTENT */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LANOLIN CONTENT
                          </label>
                          <SearchableDropdown
                            value={material.fiberLanolinContent || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberLanolinContent",
                                selectedValue,
                              )
                            }
                            options={[
                              "Lanolin-Free (fully scoured)",
                              "Low Lanolin",
                              "Natural Lanolin",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* TEMPERATURE REGULATING */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            TEMPERATURE REGULATING
                          </label>
                          <SearchableDropdown
                            value={material.fiberTemperatureRegulating || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberTemperatureRegulating",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "Temperature Regulating (wool naturally)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* MOISTURE WICKING */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            MOISTURE WICKING
                          </label>
                          <SearchableDropdown
                            value={material.fiberMoistureWicking || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMoistureWicking",
                                selectedValue,
                              )
                            }
                            options={["Natural Moisture Wicking Property"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* FIRE RETARDANT */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            FIRE RETARDANT
                          </label>
                          <SearchableDropdown
                            value={material.fiberFireRetardant || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberFireRetardant",
                                selectedValue,
                              )
                            }
                            options={[
                              "Naturally FR (wool is self-extinguishing)",
                              "Treated FR",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* MULESING-FREE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            MULESING-FREE
                          </label>
                          <SearchableDropdown
                            value={material.fiberMulesingFree || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMulesingFree",
                                selectedValue,
                              )
                            }
                            options={["Standard", "Certified Mulesing-Free"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* ORGANIC CERTIFIED */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            ORGANIC CERTIFIED
                          </label>
                          <SearchableDropdown
                            value={material.fiberOrganicCertified || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberOrganicCertified",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "GOTS Certified",
                              "OCS",
                              "RWS (Responsible Wool Standard)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full"
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
              </div>
            )}

            {/* Specialty-Fills Table */}
            {material.fiberTableType === "Specialty-Fills" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FIBER TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FIBER TYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberFiberType || ""}
                    onChange={(selectedValue) => {
                      handleChange(
                        materialIndex,
                        "fiberFiberType",
                        selectedValue,
                      );
                      // Clear all conditional fields when fiber type changes
                      if (selectedValue !== material.fiberFiberType) {
                        handleChange(materialIndex, "fiberKapokSource", "");
                        handleChange(materialIndex, "fiberKapokProperties", "");
                        handleChange(materialIndex, "fiberBambooType", "");
                        handleChange(
                          materialIndex,
                          "fiberBambooProperties",
                          "",
                        );
                        handleChange(materialIndex, "fiberSilkFlossType", "");
                        handleChange(materialIndex, "fiberSilkFlossGrade", "");
                        handleChange(materialIndex, "fiberRecycledSource", "");
                        handleChange(
                          materialIndex,
                          "fiberRecycledCertification",
                          "",
                        );
                        handleChange(materialIndex, "fiberTencelType", "");
                      }
                    }}
                    options={[
                      "Kapok",
                      "Bamboo Fiber",
                      "Silk Floss",
                      "Milkweed",
                      "Recycled Fiber",
                      "Tencel/Lyocell Fill",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* Conditional: KAPOK - SOURCE (only shows when Kapok is selected) */}
                {material.fiberFiberType === "Kapok" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      KAPOK - SOURCE
                    </label>
                    <SearchableDropdown
                      value={material.fiberKapokSource || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberKapokSource",
                          selectedValue,
                        )
                      }
                      options={["Ceiba Tree Seed Pods (100% Natural)"]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* Conditional: KAPOK - PROPERTIES (only shows when Kapok is selected) */}
                {material.fiberFiberType === "Kapok" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      KAPOK - PROPERTIES
                    </label>
                    <SearchableDropdown
                      value={material.fiberKapokProperties || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberKapokProperties",
                          selectedValue,
                        )
                      }
                      options={[
                        "Ultra-Light",
                        "Naturally Buoyant",
                        "Hypoallergenic",
                        "Quick-Dry",
                      ]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* Conditional: BAMBOO - TYPE (only shows when Bamboo Fiber is selected) */}
                {material.fiberFiberType === "Bamboo Fiber" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      BAMBOO - TYPE
                    </label>
                    <SearchableDropdown
                      value={material.fiberBambooType || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberBambooType",
                          selectedValue,
                        )
                      }
                      options={["Bamboo Viscose Fill", "Bamboo Charcoal Fill"]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* Conditional: BAMBOO - PROPERTIES (only shows when Bamboo Fiber is selected) */}
                {material.fiberFiberType === "Bamboo Fiber" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      BAMBOO - PROPERTIES
                    </label>
                    <SearchableDropdown
                      value={material.fiberBambooProperties || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberBambooProperties",
                          selectedValue,
                        )
                      }
                      options={[
                        "Anti-Bacterial",
                        "Moisture Wicking",
                        "Eco-Friendly",
                      ]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* Conditional: SILK FLOSS - TYPE (only shows when Silk Floss is selected) */}
                {material.fiberFiberType === "Silk Floss" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      SILK FLOSS - TYPE
                    </label>
                    <SearchableDropdown
                      value={material.fiberSilkFlossType || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberSilkFlossType",
                          selectedValue,
                        )
                      }
                      options={["Mulberry Silk Floss", "Tussah Silk Floss"]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* Conditional: SILK FLOSS - GRADE (only shows when Silk Floss is selected) */}
                {material.fiberFiberType === "Silk Floss" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      SILK FLOSS - GRADE
                    </label>
                    <SearchableDropdown
                      value={material.fiberSilkFlossGrade || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberSilkFlossGrade",
                          selectedValue,
                        )
                      }
                      options={[
                        "Grade A (long fiber)",
                        "Grade B",
                        "Mixed Grade",
                      ]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* Conditional: RECYCLED - SOURCE (only shows when Recycled Fiber is selected) */}
                {material.fiberFiberType === "Recycled Fiber" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      RECYCLED - SOURCE
                    </label>
                    <SearchableDropdown
                      value={material.fiberRecycledSource || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberRecycledSource",
                          selectedValue,
                        )
                      }
                      options={[
                        "Post-Consumer Recycled (PCR)",
                        "Post-Industrial",
                        "Recycled PET Bottles",
                      ]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* Conditional: RECYCLED - CERTIFICATION (only shows when Recycled Fiber is selected) */}
                {material.fiberFiberType === "Recycled Fiber" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      RECYCLED - CERTIFICATION
                    </label>
                    <SearchableDropdown
                      value={material.fiberRecycledCertification || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberRecycledCertification",
                          selectedValue,
                        )
                      }
                      options={[
                        "GRS (Global Recycled Standard)",
                        "RCS (Recycled Claim Standard)",
                      ]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* Conditional: TENCEL - TYPE (only shows when Tencel/Lyocell Fill is selected) */}
                {material.fiberFiberType === "Tencel/Lyocell Fill" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      TENCEL - TYPE
                    </label>
                    <SearchableDropdown
                      value={material.fiberTencelType || ""}
                      onChange={(selectedValue) =>
                        handleChange(
                          materialIndex,
                          "fiberTencelType",
                          selectedValue,
                        )
                      }
                      options={["Tencel Lyocell Fill", "Tencel Modal Fill"]}
                      placeholder="Select or type"
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{ padding: "10px 14px", height: "44px" }}
                    />
                  </div>
                )}

                {/* FORM */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FORM
                  </label>
                  <SearchableDropdown
                    value={material.fiberForm || ""}
                    onChange={(selectedValue) => {
                      handleChange(materialIndex, "fiberForm", selectedValue);
                      // Clear dependent fields when form changes
                      if (selectedValue !== material.fiberForm) {
                        handleChange(materialIndex, "fiberQty", "");
                        handleChange(materialIndex, "fiberGsm", "");
                        handleChange(materialIndex, "fiberLength", "");
                        handleChange(materialIndex, "fiberWidth", "");
                        handleChange(materialIndex, "fiberQtyValue", "");
                        handleChange(materialIndex, "fiberQtyType", "");
                      }
                    }}
                    options={[
                      "Loose Fiber",
                      "Wadding/Batt",
                      "Roving",
                      "Carded Wool",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* TESTING REQUIREMENTS - Multi-select with chips */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    TESTING REQUIREMENTS
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-primary focus-within:outline-none"
                      style={{
                        padding: "8px 12px",
                        minHeight: "44px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        cursor: "text",
                      }}
                    >
                      {/* Selected chips */}
                      {(Array.isArray(material.fiberTestingRequirements)
                        ? material.fiberTestingRequirements
                        : []
                      ).map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: "#ffe6d9",
                            color: "#9a3412",
                            border: "1px solid #fdba8c",
                          }}
                        >
                          {req}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              const updated = current.filter(
                                (_, i) => i !== index,
                              );
                              handleChange(
                                materialIndex,
                                "fiberTestingRequirements",
                                updated,
                              );
                            }}
                            style={{
                              marginLeft: "4px",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              color: "#9a3412",
                              fontWeight: "bold",
                              fontSize: "14px",
                              lineHeight: "1",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Dropdown for selecting new options */}
                      <div
                        id={`fiber-testing-wrapper-specialty-${materialIndex}`}
                        style={{ flex: 1, minWidth: "200px" }}
                      >
                        <SearchableDropdown
                          value=""
                          strictMode={false}
                          onChange={(selectedValue) => {
                            const options = [
                              "Micron Test",
                              "Clean Wool Yield",
                              "Vegetable Matter Content",
                              "Moisture",
                            ];
                            if (
                              selectedValue &&
                              options.includes(selectedValue)
                            ) {
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              if (!current.includes(selectedValue)) {
                                const updated = [...current, selectedValue];
                                handleChange(
                                  materialIndex,
                                  "fiberTestingRequirements",
                                  updated,
                                );
                              }
                            }
                          }}
                          options={[
                            "Micron Test",
                            "Clean Wool Yield",
                            "Vegetable Matter Content",
                            "Moisture",
                          ]}
                          placeholder={
                            Array.isArray(material.fiberTestingRequirements) &&
                            material.fiberTestingRequirements.length === 0
                              ? "Select testing requirements"
                              : "Add more..."
                          }
                          className="border-0 outline-none"
                          style={{
                            padding: "4px 0",
                            height: "auto",
                            minHeight: "32px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                            borderWidth: "0",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            const input = e.target;
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#f94d00";
                              container.style.boxShadow =
                                "0 0 0 3px rgba(249, 77, 0, 0.1)";
                            }
                            const handleKeyDown = (keyEvent) => {
                              if (
                                keyEvent.key === "Enter" &&
                                input.value &&
                                input.value.trim()
                              ) {
                                keyEvent.preventDefault();
                                keyEvent.stopPropagation();
                                const newValue = input.value.trim();
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                const options = [
                                  "Micron Test",
                                  "Clean Wool Yield",
                                  "Vegetable Matter Content",
                                  "Moisture",
                                ];
                                if (!current.includes(newValue)) {
                                  if (!options.includes(newValue)) {
                                    const updated = [...current, newValue];
                                    handleChange(
                                      materialIndex,
                                      "fiberTestingRequirements",
                                      updated,
                                    );
                                  }
                                  input.value = "";
                                  input.blur();
                                }
                              }
                            };
                            input.addEventListener("keydown", handleKeyDown);
                            input._enterHandler = handleKeyDown;
                          }}
                          onBlur={(e) => {
                            const input = e.target;
                            if (input._enterHandler) {
                              input.removeEventListener(
                                "keydown",
                                input._enterHandler,
                              );
                              input._enterHandler = null;
                            }
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#e5e7eb";
                              container.style.boxShadow = "none";
                            }
                            if (input.value && input.value.trim()) {
                              const typedValue = input.value.trim();
                              const options = [
                                "Micron Test",
                                "Clean Wool Yield",
                                "Vegetable Matter Content",
                                "Moisture",
                              ];
                              if (!options.includes(typedValue)) {
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                if (!current.includes(typedValue)) {
                                  const updated = [...current, typedValue];
                                  handleChange(
                                    materialIndex,
                                    "fiberTestingRequirements",
                                    updated,
                                  );
                                }
                              }
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional: QTY for Loose Fiber */}
                {material.fiberForm === "Loose Fiber" && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      QTY
                    </label>
                    <input
                      type="text"
                      value={material.fiberQty || ""}
                      onChange={(e) =>
                        handleChange(materialIndex, "fiberQty", e.target.value)
                      }
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{
                        padding: "10px 14px",
                        height: "44px",
                        width: "300px",
                      }}
                      placeholder="Enter QTY in KGS"
                    />
                  </div>
                )}

                {/* Conditional: SIZE SPEC for Wadding/Batt */}
                {material.fiberForm === "Wadding/Batt" && (
                  <>
                    <div
                      className="col-span-1 md:col-span-2 lg:col-span-4"
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <label className="text-sm font-bold text-gray-800 mb-4 block">
                        SIZE SPEC
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* GSM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            GSM
                          </label>
                          <input
                            type="text"
                            value={material.fiberGsm || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberGsm",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter GSM"
                          />
                        </div>

                        {/* LENGTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberLength || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberLength",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter length"
                          />
                        </div>

                        {/* WIDTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberWidth || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberWidth",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter width"
                          />
                        </div>
                      </div>

                      {/* QTY with dropdown (KGS/Yardage) */}
                      <div
                        className="flex flex-col"
                        style={{ marginTop: "16px" }}
                      >
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          QTY
                        </label>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            alignItems: "center",
                            width: "fit-content",
                          }}
                        >
                          <SearchableDropdown
                            value={material.fiberQtyType || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberQtyType",
                                selectedValue,
                              )
                            }
                            options={["KGS", "Yardage"]}
                            placeholder="Select"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "120px",
                              flexShrink: 0,
                            }}
                          />
                          <input
                            type="text"
                            value={material.fiberQtyValue || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberQtyValue",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "200px",
                              flexShrink: 0,
                            }}
                            placeholder="Enter value"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* APPROVAL */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    APPROVAL
                  </label>
                  <SearchableDropdown
                    value={material.fiberApproval || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberApproval",
                        selectedValue,
                      )
                    }
                    options={MATERIAL_APPROVAL_OPTIONS}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* REMARKS */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    REMARKS
                  </label>
                  <textarea
                    value={material.fiberRemarks || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "fiberRemarks",
                        e.target.value,
                      )
                    }
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", minHeight: "44px" }}
                    rows="1"
                    placeholder="Kapok for ultra-light products, Bamboo charcoal for odor control, GRS for recycled verification"
                  />
                </div>

                {/* ADVANCE SPEC Button and Fields */}
                <div
                  className="col-span-1 md:col-span-2 lg:col-span-4 w-full"
                  style={{ marginTop: "20px" }}
                >
                  <AdvanceSpecButton
                    active={material.showFiberAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFiberAdvancedSpec",
                        !material.showFiberAdvancedSpec,
                      )
                    }
                  />
                  {material.showFiberAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* BLENDING */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            BLENDING
                          </label>
                          <SearchableDropdown
                            value={material.fiberBlending || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberBlending",
                                selectedValue,
                              )
                            }
                            options={[
                              "100% Single Fiber",
                              "Blended (e.g., 70% Polyester / 30% Bamboo)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* ECO CERTIFICATION */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            ECO CERTIFICATION
                          </label>
                          <SearchableDropdown
                            value={material.fiberEcoCertification || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberEcoCertification",
                                selectedValue,
                              )
                            }
                            options={[
                              "GOTS",
                              "OEKO-TEX",
                              "FSC (for plant-based)",
                              "Vegan Certified",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* BIODEGRADABLE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            BIODEGRADABLE
                          </label>
                          <SearchableDropdown
                            value={material.fiberBiodegradable || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberBiodegradable",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "Certified Biodegradable",
                              "Compostable",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full"
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
              </div>
            )}

            {/* Microfiber-Fill Table */}
            {material.fiberTableType === "Microfiber-Fill" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FIBER TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FIBER TYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberFiberType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberFiberType",
                        selectedValue,
                      )
                    }
                    options={["Microfiber Polyester"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* SUBTYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    SUBTYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberSubtype || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberSubtype", selectedValue)
                    }
                    options={[
                      "Standard Microfiber",
                      "Micro-Gel",
                      "Micro-Cluster",
                      "Micro-Denier Ball",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* FORM */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FORM
                  </label>
                  <SearchableDropdown
                    value={material.fiberForm || ""}
                    onChange={(selectedValue) => {
                      handleChange(materialIndex, "fiberForm", selectedValue);
                      // Clear dependent fields when form changes
                      if (selectedValue !== material.fiberForm) {
                        handleChange(materialIndex, "fiberQty", "");
                        handleChange(materialIndex, "fiberGsm", "");
                        handleChange(materialIndex, "fiberLength", "");
                        handleChange(materialIndex, "fiberWidth", "");
                        handleChange(materialIndex, "fiberQtyValue", "");
                        handleChange(materialIndex, "fiberQtyType", "");
                      }
                    }}
                    options={["Loose Fiber", "Cluster/Ball Fiber", "Wadding"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* DENIER */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    DENIER
                  </label>
                  <SearchableDropdown
                    value={material.fiberDenier || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberDenier", selectedValue)
                    }
                    options={["0.7D (Ultra-Micro)", "0.9D", "1.0D", "1.2D"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* SILICONIZED */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    SILICONIZED
                  </label>
                  <SearchableDropdown
                    value={material.fiberSiliconized || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberSiliconized",
                        selectedValue,
                      )
                    }
                    options={[
                      "Siliconized (standard for microfiber)",
                      "Super Siliconized",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* COLOUR */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COLOUR
                  </label>
                  <SearchableDropdown
                    value={material.fiberColour || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberColour", selectedValue)
                    }
                    options={["Optical White", "Super White"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* TESTING REQUIREMENTS - Multi-select with chips */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    TESTING REQUIREMENTS
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-primary focus-within:outline-none"
                      style={{
                        padding: "8px 12px",
                        minHeight: "44px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        cursor: "text",
                      }}
                    >
                      {/* Selected chips */}
                      {(Array.isArray(material.fiberTestingRequirements)
                        ? material.fiberTestingRequirements
                        : []
                      ).map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: "#ffe6d9",
                            color: "#9a3412",
                            border: "1px solid #fdba8c",
                          }}
                        >
                          {req}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              const updated = current.filter(
                                (_, i) => i !== index,
                              );
                              handleChange(
                                materialIndex,
                                "fiberTestingRequirements",
                                updated,
                              );
                            }}
                            style={{
                              marginLeft: "4px",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              color: "#9a3412",
                              fontWeight: "bold",
                              fontSize: "14px",
                              lineHeight: "1",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Dropdown for selecting new options */}
                      <div
                        id={`fiber-testing-wrapper-microfiber-${materialIndex}`}
                        style={{ flex: 1, minWidth: "200px" }}
                      >
                        <SearchableDropdown
                          value=""
                          strictMode={false}
                          onChange={(selectedValue) => {
                            const options = [
                              "Denier Verification",
                              "Loft Test",
                              "Resilience",
                              "Dust Mite Resistance",
                            ];
                            if (
                              selectedValue &&
                              options.includes(selectedValue)
                            ) {
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              if (!current.includes(selectedValue)) {
                                const updated = [...current, selectedValue];
                                handleChange(
                                  materialIndex,
                                  "fiberTestingRequirements",
                                  updated,
                                );
                              }
                            }
                          }}
                          options={[
                            "Denier Verification",
                            "Loft Test",
                            "Resilience",
                            "Dust Mite Resistance",
                          ]}
                          placeholder={
                            Array.isArray(material.fiberTestingRequirements) &&
                            material.fiberTestingRequirements.length === 0
                              ? "Select testing requirements"
                              : "Add more..."
                          }
                          className="border-0 outline-none"
                          style={{
                            padding: "4px 0",
                            height: "auto",
                            minHeight: "32px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                            borderWidth: "0",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            const input = e.target;
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#f94d00";
                              container.style.boxShadow =
                                "0 0 0 3px rgba(249, 77, 0, 0.1)";
                            }
                            const handleKeyDown = (keyEvent) => {
                              if (
                                keyEvent.key === "Enter" &&
                                input.value &&
                                input.value.trim()
                              ) {
                                keyEvent.preventDefault();
                                keyEvent.stopPropagation();
                                const newValue = input.value.trim();
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                const options = [
                                  "Denier Verification",
                                  "Loft Test",
                                  "Resilience",
                                  "Dust Mite Resistance",
                                ];
                                if (!current.includes(newValue)) {
                                  if (!options.includes(newValue)) {
                                    const updated = [...current, newValue];
                                    handleChange(
                                      materialIndex,
                                      "fiberTestingRequirements",
                                      updated,
                                    );
                                  }
                                  input.value = "";
                                  input.blur();
                                }
                              }
                            };
                            input.addEventListener("keydown", handleKeyDown);
                            input._enterHandler = handleKeyDown;
                          }}
                          onBlur={(e) => {
                            const input = e.target;
                            if (input._enterHandler) {
                              input.removeEventListener(
                                "keydown",
                                input._enterHandler,
                              );
                              input._enterHandler = null;
                            }
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#e5e7eb";
                              container.style.boxShadow = "none";
                            }
                            if (input.value && input.value.trim()) {
                              const typedValue = input.value.trim();
                              const options = [
                                "Denier Verification",
                                "Loft Test",
                                "Resilience",
                                "Dust Mite Resistance",
                              ];
                              if (!options.includes(typedValue)) {
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                if (!current.includes(typedValue)) {
                                  const updated = [...current, typedValue];
                                  handleChange(
                                    materialIndex,
                                    "fiberTestingRequirements",
                                    updated,
                                  );
                                }
                              }
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional: QTY for Loose Fiber */}
                {material.fiberForm === "Loose Fiber" && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      QTY
                    </label>
                    <input
                      type="text"
                      value={material.fiberQty || ""}
                      onChange={(e) =>
                        handleChange(materialIndex, "fiberQty", e.target.value)
                      }
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{
                        padding: "10px 14px",
                        height: "44px",
                        width: "300px",
                      }}
                      placeholder="Enter QTY in KGS PER PC"
                    />
                  </div>
                )}

                {/* Conditional: SIZE SPEC for Wadding */}
                {material.fiberForm === "Wadding" && (
                  <>
                    <div
                      className="col-span-1 md:col-span-2 lg:col-span-4"
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <label className="text-sm font-bold text-gray-800 mb-4 block">
                        SIZE SPEC
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* GSM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            GSM
                          </label>
                          <input
                            type="text"
                            value={material.fiberGsm || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberGsm",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter GSM"
                          />
                        </div>

                        {/* LENGTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberLength || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberLength",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter length"
                          />
                        </div>

                        {/* YARDAGE (CNS) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberWidth || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberWidth",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{
                              padding: "10px 14px",
                              height: "44px",
                              width: "200px",
                            }}
                            placeholder="Enter width"
                          />
                        </div>
                      </div>

                      {/* QTY with WIDTH (CM) and KGS (CNS) */}
                      <div
                        className="flex flex-col"
                        style={{ marginTop: "16px" }}
                      >
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          QTY
                        </label>
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          style={{ width: "fit-content" }}
                        >
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              YARDAGE (CNS)
                            </label>
                            <input
                              type="text"
                              value={material.fiberQtyValue || ""}
                              onChange={(e) =>
                                handleChange(
                                  materialIndex,
                                  "fiberQtyValue",
                                  e.target.value,
                                )
                              }
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                              style={{ padding: "10px 14px", height: "44px" }}
                              placeholder="Enter yardage"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              KGS (CNS)
                            </label>
                            <input
                              type="text"
                              value={material.fiberQty || ""}
                              onChange={(e) =>
                                handleChange(
                                  materialIndex,
                                  "fiberQty",
                                  e.target.value,
                                )
                              }
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                              style={{
                                padding: "10px 14px",
                                height: "44px",
                                width: "200px",
                              }}
                              placeholder="Enter KGS"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* APPROVAL */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    APPROVAL
                  </label>
                  <SearchableDropdown
                    value={material.fiberApproval || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberApproval",
                        selectedValue,
                      )
                    }
                    options={MATERIAL_APPROVAL_OPTIONS}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* REMARKS */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    REMARKS
                  </label>
                  <textarea
                    value={material.fiberRemarks || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "fiberRemarks",
                        e.target.value,
                      )
                    }
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", minHeight: "44px" }}
                    rows="1"
                    placeholder="Micro-Gel cluster mimics down feel, Ideal for hypoallergenic products"
                  />
                </div>

                {/* ADVANCE SPEC Button and Fields */}
                <div
                  className="col-span-1 md:col-span-2 lg:col-span-4 w-full"
                  style={{ marginTop: "20px" }}
                >
                  <AdvanceSpecButton
                    active={material.showFiberAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFiberAdvancedSpec",
                        !material.showFiberAdvancedSpec,
                      )
                    }
                  />
                  {material.showFiberAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* FIBER LENGTH */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            FIBER LENGTH
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberFiberLength || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberFiberLength",
                                selectedValue,
                              )
                            }
                            options={["32mm", "51mm", "64mm"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* STRUCTURE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            STRUCTURE
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberStructure || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberStructure",
                                selectedValue,
                              )
                            }
                            options={["Solid", "Hollow (for extra loft)"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* CLUSTER TYPE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            CLUSTER TYPE
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberClusterType || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberClusterType",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard Cluster",
                              "Premium Gel-Cluster",
                              "Down-Like Cluster",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* CLUSTER SIZE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            CLUSTER SIZE
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberClusterSize || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberClusterSize",
                                selectedValue,
                              )
                            }
                            options={[
                              "Small (marble size)",
                              "Medium (golf ball)",
                              "Large (tennis ball)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* ANTI-MICROBIAL */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            ANTI-MICROBIAL
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberAntiMicrobial || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberAntiMicrobial",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "Anti-Microbial",
                              "Anti-Bacterial",
                              "Anti-Allergen",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* HYPOALLERGENIC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            HYPOALLERGENIC
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberHypoallergenic || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberHypoallergenic",
                                selectedValue,
                              )
                            }
                            options={["Standard", "Certified Hypoallergenic"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* LOFT / FILL POWER */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LOFT / FILL POWER
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberLoftFillPower || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberLoftFillPower",
                                selectedValue,
                              )
                            }
                            options={[
                              "Medium Loft",
                              "High Loft",
                              "Ultra-High Loft",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* HAND FEEL */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            HAND FEEL
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberHandFeel || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberHandFeel",
                                selectedValue,
                              )
                            }
                            options={["Soft", "Ultra-Soft", "Down-Like"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* CERTIFICATION */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            CERTIFICATION
                          </label>
                          <SearchableDropdown
                            value={material.fiberMicrofiberCertification || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberMicrofiberCertification",
                                selectedValue,
                              )
                            }
                            options={[
                              "OEKO-TEX",
                              "Downpass Alternative",
                              "CertiPUR (if foam combo)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full"
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
              </div>
            )}

            {/* Down-Alternative Table */}
            {material.fiberTableType === "Down-Alternative" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FIBER TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FIBER TYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberFiberType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberFiberType",
                        selectedValue,
                      )
                    }
                    options={["Down Alternative (Synthetic)"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* SUBTYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    SUBTYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberSubtype || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberSubtype", selectedValue)
                    }
                    options={[
                      "Micro-Gel Fiber",
                      "PrimaLoft",
                      "Thinsulate",
                      "3M Featherless",
                      "Generic Down Alt",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* FORM */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FORM
                  </label>
                  <SearchableDropdown
                    value={material.fiberForm || ""}
                    onChange={(selectedValue) => {
                      handleChange(materialIndex, "fiberForm", selectedValue);
                      // Clear dependent fields when form changes
                      if (selectedValue !== material.fiberForm) {
                        handleChange(materialIndex, "fiberQty", "");
                        handleChange(materialIndex, "fiberGsm", "");
                        handleChange(materialIndex, "fiberLength", "");
                        handleChange(materialIndex, "fiberWidth", "");
                        handleChange(materialIndex, "fiberQtyValue", "");
                        handleChange(materialIndex, "fiberQtyType", "");
                      }
                    }}
                    options={[
                      "Cluster/Ball Fiber",
                      "Loose Fill",
                      "Bonded Batt",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* CONSTRUCTION */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    CONSTRUCTION
                  </label>
                  <SearchableDropdown
                    value={material.fiberDownAlternativeConstruction || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberDownAlternativeConstruction",
                        selectedValue,
                      )
                    }
                    options={[
                      "Single Cluster",
                      "Dual Cluster",
                      "Layered Cluster",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* DENIER */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    DENIER
                  </label>
                  <SearchableDropdown
                    value={material.fiberDenier || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberDenier", selectedValue)
                    }
                    options={["0.7D - 1.5D (fine for down-like feel)"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* SILICONIZED */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    SILICONIZED
                  </label>
                  <SearchableDropdown
                    value={material.fiberSiliconized || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberSiliconized",
                        selectedValue,
                      )
                    }
                    options={["Siliconized", "Gel-Coated", "Slick Finish"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* TESTING REQUIREMENTS - Multi-select with chips */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    TESTING REQUIREMENTS
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-primary focus-within:outline-none"
                      style={{
                        padding: "8px 12px",
                        minHeight: "44px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        cursor: "text",
                      }}
                    >
                      {/* Selected chips */}
                      {(Array.isArray(material.fiberTestingRequirements)
                        ? material.fiberTestingRequirements
                        : []
                      ).map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: "#ffe6d9",
                            color: "#9a3412",
                            border: "1px solid #fdba8c",
                          }}
                        >
                          {req}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              const updated = current.filter(
                                (_, i) => i !== index,
                              );
                              handleChange(
                                materialIndex,
                                "fiberTestingRequirements",
                                updated,
                              );
                            }}
                            style={{
                              marginLeft: "4px",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              color: "#9a3412",
                              fontWeight: "bold",
                              fontSize: "14px",
                              lineHeight: "1",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Dropdown for selecting new options */}
                      <div
                        id={`fiber-testing-wrapper-downalt-${materialIndex}`}
                        style={{ flex: 1, minWidth: "200px" }}
                      >
                        <SearchableDropdown
                          value=""
                          strictMode={false}
                          onChange={(selectedValue) => {
                            const options = [
                              "Loft Recovery",
                              "Compression Resilience",
                              "Thermal Resistance (CLO value)",
                            ];
                            if (
                              selectedValue &&
                              options.includes(selectedValue)
                            ) {
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              if (!current.includes(selectedValue)) {
                                const updated = [...current, selectedValue];
                                handleChange(
                                  materialIndex,
                                  "fiberTestingRequirements",
                                  updated,
                                );
                              }
                            }
                          }}
                          options={[
                            "Loft Recovery",
                            "Compression Resilience",
                            "Thermal Resistance (CLO value)",
                          ]}
                          placeholder={
                            Array.isArray(material.fiberTestingRequirements) &&
                            material.fiberTestingRequirements.length === 0
                              ? "Select testing requirements"
                              : "Add more..."
                          }
                          className="border-0 outline-none"
                          style={{
                            padding: "4px 0",
                            height: "auto",
                            minHeight: "32px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                            borderWidth: "0",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            const input = e.target;
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#f94d00";
                              container.style.boxShadow =
                                "0 0 0 3px rgba(249, 77, 0, 0.1)";
                            }
                            const handleKeyDown = (keyEvent) => {
                              if (
                                keyEvent.key === "Enter" &&
                                input.value &&
                                input.value.trim()
                              ) {
                                keyEvent.preventDefault();
                                keyEvent.stopPropagation();
                                const newValue = input.value.trim();
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                const options = [
                                  "Loft Recovery",
                                  "Compression Resilience",
                                  "Thermal Resistance (CLO value)",
                                ];
                                if (!current.includes(newValue)) {
                                  if (!options.includes(newValue)) {
                                    const updated = [...current, newValue];
                                    handleChange(
                                      materialIndex,
                                      "fiberTestingRequirements",
                                      updated,
                                    );
                                  }
                                  input.value = "";
                                  input.blur();
                                }
                              }
                            };
                            input.addEventListener("keydown", handleKeyDown);
                            input._enterHandler = handleKeyDown;
                          }}
                          onBlur={(e) => {
                            const input = e.target;
                            if (input._enterHandler) {
                              input.removeEventListener(
                                "keydown",
                                input._enterHandler,
                              );
                              input._enterHandler = null;
                            }
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#e5e7eb";
                              container.style.boxShadow = "none";
                            }
                            if (input.value && input.value.trim()) {
                              const typedValue = input.value.trim();
                              const options = [
                                "Loft Recovery",
                                "Compression Resilience",
                                "Thermal Resistance (CLO value)",
                              ];
                              if (!options.includes(typedValue)) {
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                if (!current.includes(typedValue)) {
                                  const updated = [...current, typedValue];
                                  handleChange(
                                    materialIndex,
                                    "fiberTestingRequirements",
                                    updated,
                                  );
                                }
                              }
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional: QTY for Loose Fill */}
                {material.fiberForm === "Loose Fill" && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      QTY
                    </label>
                    <input
                      type="text"
                      value={material.fiberQty || ""}
                      onChange={(e) =>
                        handleChange(materialIndex, "fiberQty", e.target.value)
                      }
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{
                        padding: "10px 14px",
                        height: "44px",
                        width: "300px",
                      }}
                      placeholder="Enter QTY in KGS"
                    />
                  </div>
                )}

                {/* Conditional: SIZE SPEC for Bonded Batt (Wadding) */}
                {/* Conditional: SIZE SPEC for Wadding/Batt but as of now wadding option is not available in sheet provided to us*/}
                {material.fiberForm === "wadding" && (
                  <>
                    <div
                      className="col-span-1 md:col-span-2 lg:col-span-4"
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <label className="text-sm font-bold text-gray-800 mb-4 block">
                        SIZE SPEC
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* GSM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            GSM
                          </label>
                          <input
                            type="text"
                            value={material.fiberGsm || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberGsm",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter GSM"
                          />
                        </div>

                        {/* LENGTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberLength || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberLength",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter length"
                          />
                        </div>

                        {/* WIDTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberWidth || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberWidth",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter width"
                          />
                        </div>
                      </div>

                      {/* QTY section with YARDAGE (CNS) and KGS (CNS) - nested under SIZE SPEC */}
                      <div
                        className="flex flex-col"
                        style={{ marginTop: "16px" }}
                      >
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          QTY
                        </label>
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          style={{ width: "fit-content" }}
                        >
                          {/* YARDAGE (CNS) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              YARDAGE (CNS)
                            </label>
                            <input
                              type="text"
                              value={material.fiberQtyValue || ""}
                              onChange={(e) =>
                                handleChange(
                                  materialIndex,
                                  "fiberQtyValue",
                                  e.target.value,
                                )
                              }
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                              style={{
                                padding: "10px 14px",
                                height: "44px",
                                width: "200px",
                              }}
                              placeholder="Enter YARDAGE (CNS)"
                            />
                          </div>

                          {/* KGS (CNS) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              KGS (CNS)
                            </label>
                            <input
                              type="text"
                              value={material.fiberQty || ""}
                              onChange={(e) =>
                                handleChange(
                                  materialIndex,
                                  "fiberQty",
                                  e.target.value,
                                )
                              }
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                              style={{
                                padding: "10px 14px",
                                height: "44px",
                                width: "200px",
                              }}
                              placeholder="Enter KGS (CNS)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* APPROVAL */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    APPROVAL
                  </label>
                  <SearchableDropdown
                    value={material.fiberApproval || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberApproval",
                        selectedValue,
                      )
                    }
                    options={MATERIAL_APPROVAL_OPTIONS}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* REMARKS */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    REMARKS
                  </label>
                  <textarea
                    value={material.fiberRemarks || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "fiberRemarks",
                        e.target.value,
                      )
                    }
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", minHeight: "44px" }}
                    rows="1"
                    placeholder="PrimaLoft for outdoor performance, Machine washable for easy care products"
                  />
                </div>

                {/* ADVANCE SPEC Button and Fields */}
                <div
                  className="col-span-1 md:col-span-2 lg:col-span-4 w-full"
                  style={{ marginTop: "20px" }}
                >
                  <AdvanceSpecButton
                    active={material.showFiberAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFiberAdvancedSpec",
                        !material.showFiberAdvancedSpec,
                      )
                    }
                  />
                  {material.showFiberAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* LOFT RATING */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LOFT RATING
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeLoftRating || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeLoftRating",
                                selectedValue,
                              )
                            }
                            options={[
                              "Low Loft",
                              "Medium Loft",
                              "High Loft",
                              "Down-Equivalent",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* FILL POWER EQUIVALENT */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            FILL POWER EQUIVALENT
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeFillPowerEquivalent ||
                              ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeFillPowerEquivalent",
                                selectedValue,
                              )
                            }
                            options={[
                              "Equivalent to 500 fill power down",
                              "Equivalent to 600 fill power down",
                              "Equivalent to 700 fill power down",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* WARMTH-TO-WEIGHT */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WARMTH-TO-WEIGHT
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeWarmthToWeight || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeWarmthToWeight",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "High Warmth-to-Weight Ratio",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* WATER RESISTANCE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WATER RESISTANCE
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeWaterResistance || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeWaterResistance",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "Water Resistant (retains loft when wet)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* QUICK DRY */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            QUICK DRY
                          </label>
                          <SearchableDropdown
                            value={material.fiberDownAlternativeQuickDry || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeQuickDry",
                                selectedValue,
                              )
                            }
                            options={["Standard", "Quick-Dry Technology"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* HYPOALLERGENIC */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            HYPOALLERGENIC
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeHypoallergenic || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeHypoallergenic",
                                selectedValue,
                              )
                            }
                            options={["Standard Hypoallergenic", "Certified"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* ANTI-MICROBIAL */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            ANTI-MICROBIAL
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeAntiMicrobial || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeAntiMicrobial",
                                selectedValue,
                              )
                            }
                            options={["Standard", "Treated"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* VEGAN/CRUELTY-FREE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            VEGAN/CRUELTY-FREE
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeVeganCrueltyFree ||
                              ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeVeganCrueltyFree",
                                selectedValue,
                              )
                            }
                            options={["Certified Vegan", "Cruelty-Free"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* CERTIFICATION */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            CERTIFICATION
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeCertification || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeCertification",
                                selectedValue,
                              )
                            }
                            options={[
                              "OEKO-TEX",
                              "Bluesign",
                              "GRS (if recycled)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* MACHINE WASHABLE */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            MACHINE WASHABLE
                          </label>
                          <SearchableDropdown
                            value={
                              material.fiberDownAlternativeMachineWashable || ""
                            }
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberDownAlternativeMachineWashable",
                                selectedValue,
                              )
                            }
                            options={["Yes", "Machine Washable & Dryable"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Quality Verification - after Advance Spec, inside top-border block */}
                  <div
                    className="w-full"
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
              </div>
            )}

            {/* Cotton-Fill Table */}
            {material.fiberTableType === "Cotton-Fill" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FIBER TYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FIBER TYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberFiberType || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberFiberType",
                        selectedValue,
                      )
                    }
                    options={["Cotton"]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* SUBTYPE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    SUBTYPE
                  </label>
                  <SearchableDropdown
                    value={material.fiberSubtype || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberSubtype", selectedValue)
                    }
                    options={[
                      "Virgin Cotton",
                      "Recycled Cotton",
                      "Organic Cotton",
                      "Ginned Cotton Waste",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* FORM */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FORM
                  </label>
                  <SearchableDropdown
                    value={material.fiberForm || ""}
                    onChange={(selectedValue) => {
                      handleChange(materialIndex, "fiberForm", selectedValue);
                      // Clear dependent fields when form changes
                      if (selectedValue !== material.fiberForm) {
                        handleChange(materialIndex, "fiberQty", "");
                        handleChange(materialIndex, "fiberGsm", "");
                        handleChange(materialIndex, "fiberLength", "");
                        handleChange(materialIndex, "fiberWidth", "");
                        handleChange(materialIndex, "fiberQtyValue", "");
                        handleChange(materialIndex, "fiberQtyType", "");
                      }
                    }}
                    options={[
                      "Loose Fiber",
                      "Wadding/Batt",
                      "Carded Cotton",
                      "Bleached Cotton Linter",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* GRADE */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    GRADE
                  </label>
                  <SearchableDropdown
                    value={material.fiberCottonGrade || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberCottonGrade",
                        selectedValue,
                      )
                    }
                    options={[
                      "Premium Grade",
                      "Standard Grade",
                      "Economy Grade",
                      "Noil (short fibers)",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* COLOUR */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COLOUR
                  </label>
                  <SearchableDropdown
                    value={material.fiberColour || ""}
                    onChange={(selectedValue) =>
                      handleChange(materialIndex, "fiberColour", selectedValue)
                    }
                    options={[
                      "Natural (off-white)",
                      "Bleached White",
                      "Unbleached/Ecru",
                    ]}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* TESTING REQUIREMENTS - Multi-select with chips */}
                <div className="flex flex-col col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    TESTING
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus-within:border-primary focus-within:outline-none"
                      style={{
                        padding: "8px 12px",
                        minHeight: "44px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                        cursor: "text",
                      }}
                    >
                      {/* Selected chips */}
                      {(Array.isArray(material.fiberTestingRequirements)
                        ? material.fiberTestingRequirements
                        : []
                      ).map((req, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: "#ffe6d9",
                            color: "#9a3412",
                            border: "1px solid #fdba8c",
                          }}
                        >
                          {req}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              const updated = current.filter(
                                (_, i) => i !== index,
                              );
                              handleChange(
                                materialIndex,
                                "fiberTestingRequirements",
                                updated,
                              );
                            }}
                            style={{
                              marginLeft: "4px",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                              color: "#9a3412",
                              fontWeight: "bold",
                              fontSize: "14px",
                              lineHeight: "1",
                              padding: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {/* Dropdown for selecting new options */}
                      <div
                        id={`fiber-testing-wrapper-cotton-${materialIndex}`}
                        style={{ flex: 1, minWidth: "200px" }}
                      >
                        <SearchableDropdown
                          value=""
                          strictMode={false}
                          onChange={(selectedValue) => {
                            const options = [
                              "Staple Length",
                              "Micronaire",
                              "Trash Content",
                              "Moisture Content",
                            ];
                            if (
                              selectedValue &&
                              options.includes(selectedValue)
                            ) {
                              const current = Array.isArray(
                                material.fiberTestingRequirements,
                              )
                                ? material.fiberTestingRequirements
                                : [];
                              if (!current.includes(selectedValue)) {
                                const updated = [...current, selectedValue];
                                handleChange(
                                  materialIndex,
                                  "fiberTestingRequirements",
                                  updated,
                                );
                              }
                            }
                          }}
                          options={[
                            "Staple Length",
                            "Micronaire",
                            "Trash Content",
                            "Moisture Content",
                          ]}
                          placeholder={
                            Array.isArray(material.fiberTestingRequirements) &&
                            material.fiberTestingRequirements.length === 0
                              ? "Select testing requirements"
                              : "Add more..."
                          }
                          className="border-0 outline-none"
                          style={{
                            padding: "4px 0",
                            height: "auto",
                            minHeight: "32px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            border: "none",
                            borderWidth: "0",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            const input = e.target;
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#f94d00";
                              container.style.boxShadow =
                                "0 0 0 3px rgba(249, 77, 0, 0.1)";
                            }
                            const handleKeyDown = (keyEvent) => {
                              if (
                                keyEvent.key === "Enter" &&
                                input.value &&
                                input.value.trim()
                              ) {
                                keyEvent.preventDefault();
                                keyEvent.stopPropagation();
                                const newValue = input.value.trim();
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                const options = [
                                  "Staple Length",
                                  "Micronaire",
                                  "Trash Content",
                                  "Moisture Content",
                                ];
                                if (!current.includes(newValue)) {
                                  if (!options.includes(newValue)) {
                                    const updated = [...current, newValue];
                                    handleChange(
                                      materialIndex,
                                      "fiberTestingRequirements",
                                      updated,
                                    );
                                  }
                                  input.value = "";
                                  input.blur();
                                }
                              }
                            };
                            input.addEventListener("keydown", handleKeyDown);
                            input._enterHandler = handleKeyDown;
                          }}
                          onBlur={(e) => {
                            const input = e.target;
                            if (input._enterHandler) {
                              input.removeEventListener(
                                "keydown",
                                input._enterHandler,
                              );
                              input._enterHandler = null;
                            }
                            input.style.border = "none";
                            input.style.borderWidth = "0";
                            input.style.outline = "none";
                            input.style.boxShadow = "none";
                            const container = input.closest(
                              '[class*="border-2"]',
                            );
                            if (container) {
                              container.style.borderColor = "#e5e7eb";
                              container.style.boxShadow = "none";
                            }
                            if (input.value && input.value.trim()) {
                              const typedValue = input.value.trim();
                              const options = [
                                "Staple Length",
                                "Micronaire",
                                "Trash Content",
                                "Moisture Content",
                              ];
                              if (!options.includes(typedValue)) {
                                const current = Array.isArray(
                                  material.fiberTestingRequirements,
                                )
                                  ? material.fiberTestingRequirements
                                  : [];
                                if (!current.includes(typedValue)) {
                                  const updated = [...current, typedValue];
                                  handleChange(
                                    materialIndex,
                                    "fiberTestingRequirements",
                                    updated,
                                  );
                                }
                              }
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional: QTY for Loose Fiber (WIDTH and KGS) */}
                {/* Conditional: QTY for Loose Fiber */}
                {material.fiberForm === "Loose Fiber" && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      QTY
                    </label>
                    <input
                      type="text"
                      value={material.fiberQty || ""}
                      onChange={(e) =>
                        handleChange(materialIndex, "fiberQty", e.target.value)
                      }
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                      style={{
                        padding: "10px 14px",
                        height: "44px",
                        width: "300px",
                      }}
                      placeholder="Enter QTY in KGS"
                    />
                  </div>
                )}

                {/* Conditional: SIZE SPEC for Wadding/Batt */}
                {material.fiberForm === "Wadding/Batt" && (
                  <>
                    <div
                      className="col-span-1 md:col-span-2 lg:col-span-4"
                      style={{
                        marginTop: "20px",
                        paddingTop: "20px",
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <label className="text-sm font-bold text-gray-800 mb-4 block">
                        SIZE SPEC
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* GSM */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            GSM
                          </label>
                          <input
                            type="text"
                            value={material.fiberGsm || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberGsm",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter GSM"
                          />
                        </div>
                        {/* LENGTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberLength || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberLength",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter length"
                          />
                        </div>
                        {/* WIDTH (CM) */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH (CM)
                          </label>
                          <input
                            type="text"
                            value={material.fiberWidth || ""}
                            onChange={(e) =>
                              handleChange(
                                materialIndex,
                                "fiberWidth",
                                e.target.value,
                              )
                            }
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                            placeholder="Enter width"
                          />
                        </div>
                      </div>

                      {/* QTY section with YARDAGE (CNS) and KGS (CNS) - nested under SIZE SPEC */}
                      <div
                        className="flex flex-col"
                        style={{ marginTop: "16px" }}
                      >
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          QTY
                        </label>
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          style={{ width: "fit-content" }}
                        >
                          {/* YARDAGE (CNS) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              YARDAGE (CNS)
                            </label>
                            <input
                              type="text"
                              value={material.fiberQtyValue || ""}
                              onChange={(e) =>
                                handleChange(
                                  materialIndex,
                                  "fiberQtyValue",
                                  e.target.value,
                                )
                              }
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                              style={{
                                padding: "10px 14px",
                                height: "44px",
                                width: "200px",
                              }}
                              placeholder="Enter YARDAGE (CNS)"
                            />
                          </div>
                          {/* KGS (CNS) */}
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              KGS (CNS)
                            </label>
                            <input
                              type="text"
                              value={material.fiberQty || ""}
                              onChange={(e) =>
                                handleChange(
                                  materialIndex,
                                  "fiberQty",
                                  e.target.value,
                                )
                              }
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                              style={{
                                padding: "10px 14px",
                                height: "44px",
                                width: "200px",
                              }}
                              placeholder="Enter KGS (CNS)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* APPROVAL */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    APPROVAL
                  </label>
                  <SearchableDropdown
                    value={material.fiberApproval || ""}
                    onChange={(selectedValue) =>
                      handleChange(
                        materialIndex,
                        "fiberApproval",
                        selectedValue,
                      )
                    }
                    options={MATERIAL_APPROVAL_OPTIONS}
                    placeholder="Select or type"
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", height: "44px" }}
                  />
                </div>

                {/* REMARKS */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    REMARKS
                  </label>
                  <textarea
                    value={material.fiberRemarks || ""}
                    onChange={(e) =>
                      handleChange(
                        materialIndex,
                        "fiberRemarks",
                        e.target.value,
                      )
                    }
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                    style={{ padding: "10px 14px", minHeight: "44px" }}
                    rows="1"
                    placeholder="GOTS certified for organic products, Bleached for white appearance"
                  />
                </div>

                {/* ADVANCE SPEC Button and Fields */}
                <div
                  className="col-span-1 md:col-span-2 lg:col-span-4 w-full"
                  style={{ marginTop: "20px" }}
                >
                  <AdvanceSpecButton
                    active={material.showFiberAdvancedSpec}
                    onClick={() =>
                      handleChange(
                        materialIndex,
                        "showFiberAdvancedSpec",
                        !material.showFiberAdvancedSpec,
                      )
                    }
                  />
                  {material.showFiberAdvancedSpec && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* STAPLE LENGTH */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            STAPLE LENGTH
                          </label>
                          <SearchableDropdown
                            value={material.fiberCottonStapleLength || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCottonStapleLength",
                                selectedValue,
                              )
                            }
                            options={[
                              "Short Staple (<25mm)",
                              "Medium (25-30mm)",
                              "Long Staple (>30mm)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* PROCESSING */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            PROCESSING
                          </label>
                          <SearchableDropdown
                            value={material.fiberCottonProcessing || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCottonProcessing",
                                selectedValue,
                              )
                            }
                            options={[
                              "Carded",
                              "Combed",
                              "Garneted (recycled)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* BONDING */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            BONDING
                          </label>
                          <SearchableDropdown
                            value={material.fiberCottonBonding || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCottonBonding",
                                selectedValue,
                              )
                            }
                            options={[
                              "Non-Bonded (needle punch)",
                              "Thermal Bonded",
                              "Resin Bonded",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* NEEDLE PUNCHED */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            NEEDLE PUNCHED
                          </label>
                          <SearchableDropdown
                            value={material.fiberCottonNeedlePunched || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCottonNeedlePunched",
                                selectedValue,
                              )
                            }
                            options={["Light Needle Punch", "Medium", "Heavy"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* FIRE RETARDANT */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            FIRE RETARDANT
                          </label>
                          <SearchableDropdown
                            value={material.fiberCottonFireRetardant || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCottonFireRetardant",
                                selectedValue,
                              )
                            }
                            options={["Standard", "FR Treated"]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* DUST/TRASH CONTENT */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            DUST/TRASH CONTENT
                          </label>
                          <SearchableDropdown
                            value={material.fiberCottonDustTrashContent || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCottonDustTrashContent",
                                selectedValue,
                              )
                            }
                            options={[
                              "Low (<1%)",
                              "Medium (1-2%)",
                              "Standard (<3%)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>

                        {/* ORGANIC CERTIFIED */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            ORGANIC CERTIFIED
                          </label>
                          <SearchableDropdown
                            value={material.fiberCottonOrganicCertified || ""}
                            onChange={(selectedValue) =>
                              handleChange(
                                materialIndex,
                                "fiberCottonOrganicCertified",
                                selectedValue,
                              )
                            }
                            options={[
                              "Standard",
                              "GOTS Certified",
                              "OCS (Organic Content Standard)",
                            ]}
                            placeholder="Select or type"
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-primary focus:outline-none"
                            style={{ padding: "10px 14px", height: "44px" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
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

export default FiberSpecFields;
