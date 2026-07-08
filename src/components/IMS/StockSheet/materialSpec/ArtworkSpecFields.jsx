// Artwork & Labelling spec fields for the StockSheet "Add New" flow.
// Extracted from GenerateFactoryCode/components/steps/Step4.jsx (the per-material artwork
// block: category selector + Category*/AdvFilter* sub-components + generic fields). The
// component selector and per-component filtering from Step4 are wizard concepts and are
// omitted. Runs on local state via a (materialIndex, field, value) change handler — same
// prop shape as the other *SpecFields.
import SearchableDropdown from "../../../GenerateFactoryCode/components/SearchableDropdown";
import { ARTWORK_APPROVAL_OPTIONS } from "../../../GenerateFactoryCode/data/approvalOptions";
import QualityVerificationToggle from "../../../GenerateFactoryCode/components/QualityVerificationToggle";
import CategoryLabelsBrand from "../../../GenerateFactoryCode/components/artwork/CategoryLabelsBrand";
import CategoryCareComposition from "../../../GenerateFactoryCode/components/artwork/CategoryCareComposition";
import CategoryRfidSecurity from "../../../GenerateFactoryCode/components/artwork/CategoryRfidSecurity";
import CategoryLawLabel from "../../../GenerateFactoryCode/components/artwork/CategoryLawLabel";
import CategoryHangTagSeals from "../../../GenerateFactoryCode/components/artwork/CategoryHangTagSeals";
import CategoryHeatTransfer from "../../../GenerateFactoryCode/components/artwork/CategoryHeatTransfer";
import CategoryUpcBarcode from "../../../GenerateFactoryCode/components/artwork/CategoryUpcBarcode";
import CategoryPriceTicket from "../../../GenerateFactoryCode/components/artwork/CategoryPriceTicket";
import CategoryAntiCounterfeit from "../../../GenerateFactoryCode/components/artwork/CategoryAntiCounterfeit";
import CategoryQcInspection from "../../../GenerateFactoryCode/components/artwork/CategoryQcInspection";
import CategoryBellyBand from "../../../GenerateFactoryCode/components/artwork/CategoryBellyBand";
import CategorySizeLabels from "../../../GenerateFactoryCode/components/artwork/CategorySizeLabels";
import CategoryTagsSpecial from "../../../GenerateFactoryCode/components/artwork/CategoryTagsSpecial";
import CategoryFlammabilitySafety from "../../../GenerateFactoryCode/components/artwork/CategoryFlammabilitySafety";
import CategoryInsertCards from "../../../GenerateFactoryCode/components/artwork/CategoryInsertCards";
import CategoryHeaderCard from "../../../GenerateFactoryCode/components/artwork/CategoryHeaderCard";
import CategoryRibbons from "../../../GenerateFactoryCode/components/artwork/CategoryRibbons";
import AdvFilterInsertCards from "../../../GenerateFactoryCode/components/artwork/AdvFilterInsertCards";
import AdvFilterHeaderCard from "../../../GenerateFactoryCode/components/artwork/AdvFilterHeaderCard";
import AdvFilterHeatTransfer from "../../../GenerateFactoryCode/components/artwork/AdvFilterHeatTransfer";
import AdvFilterHangTagSeals from "../../../GenerateFactoryCode/components/artwork/AdvFilterHangTagSeals";
import AdvFilterAntiCounterfeit from "../../../GenerateFactoryCode/components/artwork/AdvFilterAntiCounterfeit";
import AdvFilterCareComposition from "../../../GenerateFactoryCode/components/artwork/AdvFilterCareComposition";
import AdvFilterFlammabilitySafety from "../../../GenerateFactoryCode/components/artwork/AdvFilterFlammabilitySafety";
import AdvFilterBellyBand from "../../../GenerateFactoryCode/components/artwork/AdvFilterBellyBand";

const ArtworkSpecFields = ({
  material,
  materialIndex,
  handleChange,
  errors = {},
}) => {
  const actualIndex = materialIndex;
  const handleArtworkMaterialChange = handleChange;

  return (
    <div className="w-full" style={{ marginTop: 0 }}>
      <div
        className="flex flex-col"
        style={{ width: "280px", marginBottom: "20px" }}
      >
        <label className="text-sm font-bold text-gray-800 mb-2">
          ARTWORK CATEGORY
        </label>
        <SearchableDropdown
          value={material.artworkCategory || ""}
          onChange={(selectedValue) =>
            handleArtworkMaterialChange(
              actualIndex,
              "artworkCategory",
              selectedValue,
            )
          }
          options={[
            "LABELS (BRAND/MAIN)",
            "CARE & COMPOSITION",
            "TAGS & SPECIAL LABELS",
            "FLAMMABILITY / SAFETY LABELS",
            "RFID / SECURITY TAGS",
            "LAW LABEL / CONTENTS TAG",
            "HANG TAG SEALS / STRINGS",
            "PRICE TICKET / BARCODE TAG",
            "HEAT TRANSFER LABELS",
            "UPC LABEL / BARCODE STICKER",
            "SIZE LABELS (INDIVIDUAL)",
            "ANTI-COUNTERFEIT & HOLOGRAMS",
            "QC / INSPECTION LABELS",
            "BELLY BAND / WRAPPER",
            "INSERT CARDS",
            "HEADER CARD",
            "RIBBONS",
          ]}
          placeholder="Select or type Category"
          style={{ width: "280px" }}
          onFocus={(e) =>
            (e.target.style.boxShadow = "0 0 0 3px rgba(249, 77, 0, 0.1)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "")}
        />
      </div>

      {material.artworkCategory && (
        <>
          {/* Auto-generated MATERIAL DESC (read-only). Clicking reveals the
                      source spec fields below so the user edits the origin. */}
          <div
            className="flex flex-col"
            style={{ width: "100%", maxWidth: "640px", marginBottom: "20px" }}
          >
            <label className="text-sm font-bold text-gray-800 mb-2">
              MATERIAL DESC
            </label>
            <input
              type="text"
              readOnly
              value={material.materialDescription || ""}
              onClick={() => {
                if (typeof document !== "undefined") {
                  const card = document.querySelector(
                    `[data-artwork-material-index="${actualIndex}"]`,
                  );
                  const anchor =
                    card?.querySelector("[data-spec-anchor]") || card;
                  anchor?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              title="Auto-generated from specifications — click to edit the source fields"
              placeholder="Fill specifications below"
              className="border-2 rounded-lg text-sm bg-gray-100 text-gray-900 border-border cursor-pointer focus:outline-none"
              style={{ padding: "10px 14px", height: "44px" }}
            />
          </div>
          <div data-spec-anchor className="space-y-5">
            {/* TYPE Field */}
            {![
              "RFID / SECURITY TAGS",
              "LAW LABEL / CONTENTS TAG",
              "HANG TAG SEALS / STRINGS",
              "PRICE TICKET / BARCODE TAG",
              "HEAT TRANSFER LABELS",
              "UPC LABEL / BARCODE STICKER",
              "SIZE LABELS (INDIVIDUAL)",
              "ANTI-COUNTERFEIT & HOLOGRAMS",
              "QC / INSPECTION LABELS",
              "BELLY BAND / WRAPPER",
              "CARE & COMPOSITION",
              "FLAMMABILITY / SAFETY LABELS",
              "INSERT CARDS",
              "HEADER CARD",
              "LABELS (BRAND/MAIN)",
              "RIBBONS",
              "TAGS & SPECIAL LABELS",
            ].includes(material.artworkCategory) && (
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  TYPE
                </label>
                <SearchableDropdown
                  value={material.specificType || ""}
                  onChange={(selectedValue) =>
                    handleArtworkMaterialChange(
                      actualIndex,
                      "specificType",
                      selectedValue,
                    )
                  }
                  options={
                    material.artworkCategory === "LABELS (BRAND/MAIN)"
                      ? [
                          "Woven (Damask, Taffeta, Satin)",
                          "Printed (Satin, Cotton)",
                          "Heat Transfer",
                          "Leather",
                          "Metal",
                        ]
                      : material.artworkCategory === "CARE & COMPOSITION"
                        ? ["Woven", "Printed", "Heat Transfer"]
                        : material.artworkCategory ===
                            "FLAMMABILITY / SAFETY LABELS"
                          ? ["Permanent Sew-in Label", "Removable Hang Tag"]
                          : material.artworkCategory ===
                              "PRICE TICKET / BARCODE TAG"
                            ? [
                                "Adhesive Sticker",
                                "Printed Area",
                                "Dedicated Small Tag",
                              ]
                            : material.artworkCategory ===
                                "ANTI-COUNTERFEIT & HOLOGRAMS"
                              ? [
                                  "Hologram Sticker",
                                  "Void/Tamper-Evident Label",
                                  "Authenticity Patch",
                                  "Invisible Ink Print",
                                ]
                              : material.artworkCategory ===
                                  "QC / INSPECTION LABELS"
                                ? [
                                    "Passed/Inspected Sticker",
                                    "Hold/Defective Sticker",
                                    "Audit Sample Tag",
                                  ]
                                : material.artworkCategory ===
                                    "BELLY BAND / WRAPPER"
                                  ? [
                                      "Cardboard Sleeve",
                                      "Printed Paper Band",
                                      "Plastic Film Wrapper",
                                    ]
                                  : []
                  }
                  placeholder="Select or type Type"
                />
              </div>
            )}

            {/* MATERIAL Field */}
            {![
              "RFID / SECURITY TAGS",
              "LAW LABEL / CONTENTS TAG",
              "HANG TAG SEALS / STRINGS",
              "PRICE TICKET / BARCODE TAG",
              "HEAT TRANSFER LABELS",
              "UPC LABEL / BARCODE STICKER",
              "SIZE LABELS (INDIVIDUAL)",
              "ANTI-COUNTERFEIT & HOLOGRAMS",
              "QC / INSPECTION LABELS",
              "BELLY BAND / WRAPPER",
              "CARE & COMPOSITION",
              "FLAMMABILITY / SAFETY LABELS",
              "INSERT CARDS",
              "HEADER CARD",
              "LABELS (BRAND/MAIN)",
              "RIBBONS",
              "TAGS & SPECIAL LABELS",
            ].includes(material.artworkCategory) && (
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  {material.artworkCategory === "CARE & COMPOSITION"
                    ? "FIBER CONTENT"
                    : "MATERIAL"}
                </label>
                <input
                  type="text"
                  value={material.material}
                  onChange={(e) =>
                    handleArtworkMaterialChange(
                      actualIndex,
                      "material",
                      e.target.value,
                    )
                  }
                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_material`] ? "border-red-600" : "border-border"}`}
                  style={{ padding: "10px 14px", height: "44px" }}
                  placeholder={
                    material.artworkCategory === "CARE & COMPOSITION"
                      ? "Fiber Content"
                      : material.artworkCategory === "BELLY BAND / WRAPPER"
                        ? "Card Stock GSM"
                        : "e.g., Polyester"
                  }
                />
              </div>
            )}

            {/* Specific Fields for LABELS (BRAND/MAIN) */}
            {material.artworkCategory === "LABELS (BRAND/MAIN)" && (
              <CategoryLabelsBrand
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for CARE & COMPOSITION */}
            {material.artworkCategory === "CARE & COMPOSITION" && (
              <CategoryCareComposition
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for RFID / SECURITY TAGS */}
            {material.artworkCategory === "RFID / SECURITY TAGS" && (
              <CategoryRfidSecurity
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for LAW LABEL / CONTENTS TAG */}
            {material.artworkCategory === "LAW LABEL / CONTENTS TAG" && (
              <CategoryLawLabel
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for HANG TAG SEALS / STRINGS */}
            {material.artworkCategory === "HANG TAG SEALS / STRINGS" && (
              <CategoryHangTagSeals
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for HEAT TRANSFER LABELS */}
            {material.artworkCategory === "HEAT TRANSFER LABELS" && (
              <CategoryHeatTransfer
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for UPC LABEL / BARCODE STICKER */}
            {material.artworkCategory === "UPC LABEL / BARCODE STICKER" && (
              <CategoryUpcBarcode
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for PRICE TICKET / BARCODE TAG */}
            {material.artworkCategory === "PRICE TICKET / BARCODE TAG" && (
              <CategoryPriceTicket
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for ANTI-COUNTERFEIT & HOLOGRAMS */}
            {material.artworkCategory === "ANTI-COUNTERFEIT & HOLOGRAMS" && (
              <CategoryAntiCounterfeit
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for QC / INSPECTION LABELS */}
            {material.artworkCategory === "QC / INSPECTION LABELS" && (
              <CategoryQcInspection
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for BELLY BAND / WRAPPER */}
            {material.artworkCategory === "BELLY BAND / WRAPPER" && (
              <CategoryBellyBand
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for SIZE LABELS (INDIVIDUAL) */}
            {material.artworkCategory === "SIZE LABELS (INDIVIDUAL)" && (
              <CategorySizeLabels
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for TAGS & SPECIAL LABELS */}
            {material.artworkCategory === "TAGS & SPECIAL LABELS" && (
              <CategoryTagsSpecial
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for FLAMMABILITY / SAFETY LABELS */}
            {material.artworkCategory === "FLAMMABILITY / SAFETY LABELS" && (
              <CategoryFlammabilitySafety
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* PERMANENCE / DURABILITY Field - Excluded for CARE & COMPOSITION (has its own in Advanced Filter) */}
            {["BELLY BAND / WRAPPER"].includes(material.artworkCategory) && (
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  {material.artworkCategory === "BELLY BAND / WRAPPER"
                    ? "DURABILITY"
                    : "PERMANENCE"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={material.permanence}
                  onChange={(e) =>
                    handleArtworkMaterialChange(
                      actualIndex,
                      "permanence",
                      e.target.value,
                    )
                  }
                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_permanence`] ? "border-red-600" : "border-border"}`}
                  style={{ padding: "10px 14px", height: "44px" }}
                  placeholder="e.g., Permanent"
                />
                {errors[`artworkMaterial_${actualIndex}_permanence`] && (
                  <span className="text-red-600 text-xs mt-1">
                    {errors[`artworkMaterial_${actualIndex}_permanence`]}
                  </span>
                )}
              </div>
            )}

            {/* ADHESIVE Field */}
            {["UPC LABEL / BARCODE STICKER"].includes(
              material.artworkCategory,
            ) && (
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  ADHESIVE
                </label>
                <input
                  type="text"
                  value={material.adhesive}
                  onChange={(e) =>
                    handleArtworkMaterialChange(
                      actualIndex,
                      "adhesive",
                      e.target.value,
                    )
                  }
                  className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_adhesive`] ? "border-red-600" : "border-border"}`}
                  style={{ padding: "10px 14px", height: "44px" }}
                  placeholder="e.g., High-bond"
                />
              </div>
            )}

            {/* APPLICATION SPEC Field */}

            {/* Specific Fields for INSERT CARDS */}
            {material.artworkCategory === "INSERT CARDS" && (
              <CategoryInsertCards
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for HEADER CARD - Exact replica of INSERT CARDS */}
            {material.artworkCategory === "HEADER CARD" && (
              <CategoryHeaderCard
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* Specific Fields for RIBBONS */}
            {material.artworkCategory === "RIBBONS" && (
              <CategoryRibbons
                material={material}
                actualIndex={actualIndex}
                errors={errors}
                handleArtworkMaterialChange={handleArtworkMaterialChange}
              />
            )}

            {/* TESTING REQUIREMENT Field with Image Upload - For all except LAW LABEL / CONTENTS TAG, ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER */}
            {material.artworkCategory !== "LAW LABEL / CONTENTS TAG" &&
              material.artworkCategory !== "ANTI-COUNTERFEIT & HOLOGRAMS" &&
              material.artworkCategory !== "BELLY BAND / WRAPPER" &&
              material.artworkCategory !== "CARE & COMPOSITION" &&
              material.artworkCategory !== "FLAMMABILITY / SAFETY LABELS" &&
              material.artworkCategory !== "HANG TAG SEALS / STRINGS" &&
              material.artworkCategory !== "HEAT TRANSFER LABELS" &&
              material.artworkCategory !== "INSERT CARDS" &&
              material.artworkCategory !== "HEADER CARD" &&
              material.artworkCategory !== "LABELS (BRAND/MAIN)" &&
              material.artworkCategory !== "PRICE TICKET / BARCODE TAG" &&
              material.artworkCategory !== "QC / INSPECTION LABELS" &&
              material.artworkCategory !== "RFID / SECURITY TAGS" &&
              material.artworkCategory !== "RIBBONS" &&
              material.artworkCategory !== "SIZE LABELS (INDIVIDUAL)" &&
              material.artworkCategory !== "TAGS & SPECIAL LABELS" &&
              material.artworkCategory !== "UPC LABEL / BARCODE STICKER" && (
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    TESTING REQUIREMENT
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={material.testingRequirement || ""}
                      onChange={(e) =>
                        handleArtworkMaterialChange(
                          actualIndex,
                          "testingRequirement",
                          e.target.value,
                        )
                      }
                      className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none flex-grow ${errors[`artworkMaterial_${actualIndex}_testingRequirement`] ? "border-red-600" : "border-border"}`}
                      style={{ padding: "10px 14px", height: "44px" }}
                      placeholder="e.g., Wash Fastness"
                    />
                    <input
                      type="file"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleArtworkMaterialChange(
                            actualIndex,
                            "referenceImage",
                            f,
                          );
                      }}
                      className="hidden"
                      id={`art-file-${actualIndex}`}
                    />
                    <label
                      htmlFor={`art-file-${actualIndex}`}
                      className="border-2 rounded-lg text-sm transition-all bg-background cursor-pointer hover:bg-muted flex items-center justify-center gap-2 text-foreground border-border flex-shrink-0"
                      style={{
                        padding: "10px 14px",
                        height: "44px",
                        width: "110px",
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span className="truncate">
                        {material.referenceImage ? "DONE" : "UPLOAD"}
                      </span>
                    </label>
                  </div>
                </div>
              )}

            {/* LENGTH / QUANTITY Field - For all except LAW LABEL / CONTENTS TAG, ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER */}
            {material.artworkCategory !== "LAW LABEL / CONTENTS TAG" &&
              material.artworkCategory !== "ANTI-COUNTERFEIT & HOLOGRAMS" &&
              material.artworkCategory !== "BELLY BAND / WRAPPER" &&
              material.artworkCategory !== "CARE & COMPOSITION" &&
              material.artworkCategory !== "FLAMMABILITY / SAFETY LABELS" &&
              material.artworkCategory !== "HANG TAG SEALS / STRINGS" &&
              material.artworkCategory !== "HEAT TRANSFER LABELS" &&
              material.artworkCategory !== "INSERT CARDS" &&
              material.artworkCategory !== "HEADER CARD" &&
              material.artworkCategory !== "LABELS (BRAND/MAIN)" &&
              material.artworkCategory !== "PRICE TICKET / BARCODE TAG" &&
              material.artworkCategory !== "QC / INSPECTION LABELS" &&
              material.artworkCategory !== "RFID / SECURITY TAGS" &&
              material.artworkCategory !== "RIBBONS" &&
              material.artworkCategory !== "SIZE LABELS (INDIVIDUAL)" &&
              material.artworkCategory !== "TAGS & SPECIAL LABELS" &&
              material.artworkCategory !== "UPC LABEL / BARCODE STICKER" && (
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    LENGTH / QUANTITY
                  </label>
                  <input
                    type="text"
                    value={material.lengthQuantity || ""}
                    onChange={(e) =>
                      handleArtworkMaterialChange(
                        actualIndex,
                        "lengthQuantity",
                        e.target.value,
                      )
                    }
                    className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_lengthQuantity`] ? "border-red-600" : "border-border"}`}
                    style={{ padding: "10px 14px", height: "44px" }}
                    placeholder="e.g., 5000 pcs"
                  />
                </div>
              )}

            {/* APPROVAL Field - Excluded for ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), LAW LABEL / CONTENTS TAG, PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER (have their own) */}
            {material.artworkCategory !== "ANTI-COUNTERFEIT & HOLOGRAMS" &&
              material.artworkCategory !== "BELLY BAND / WRAPPER" &&
              material.artworkCategory !== "CARE & COMPOSITION" &&
              material.artworkCategory !== "FLAMMABILITY / SAFETY LABELS" &&
              material.artworkCategory !== "HANG TAG SEALS / STRINGS" &&
              material.artworkCategory !== "HEAT TRANSFER LABELS" &&
              material.artworkCategory !== "INSERT CARDS" &&
              material.artworkCategory !== "HEADER CARD" &&
              material.artworkCategory !== "LABELS (BRAND/MAIN)" &&
              material.artworkCategory !== "LAW LABEL / CONTENTS TAG" &&
              material.artworkCategory !== "PRICE TICKET / BARCODE TAG" &&
              material.artworkCategory !== "QC / INSPECTION LABELS" &&
              material.artworkCategory !== "RFID / SECURITY TAGS" &&
              material.artworkCategory !== "RIBBONS" &&
              material.artworkCategory !== "SIZE LABELS (INDIVIDUAL)" &&
              material.artworkCategory !== "TAGS & SPECIAL LABELS" &&
              material.artworkCategory !== "UPC LABEL / BARCODE STICKER" && (
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    APPROVAL
                  </label>
                  <SearchableDropdown
                    value={material.approval || ""}
                    onChange={(selectedValue) =>
                      handleArtworkMaterialChange(
                        actualIndex,
                        "approval",
                        selectedValue,
                      )
                    }
                    options={ARTWORK_APPROVAL_OPTIONS}
                    placeholder="Select or type Approval"
                    className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_approval`] ? "border-red-600" : "border-border"}`}
                  />
                </div>
              )}

            {/* REMARKS Field - Excluded for ANTI-COUNTERFEIT & HOLOGRAMS, BELLY BAND / WRAPPER, CARE & COMPOSITION, FLAMMABILITY / SAFETY LABELS, HANG TAG SEALS / STRINGS, HEAT TRANSFER LABELS, INSERT CARDS, LABELS (BRAND/MAIN), LAW LABEL / CONTENTS TAG, PRICE TICKET / BARCODE TAG, QC / INSPECTION LABELS, RFID / SECURITY TAGS, RIBBONS, SIZE LABELS (INDIVIDUAL), TAGS & SPECIAL LABELS, and UPC LABEL / BARCODE STICKER (have their own) */}
            {material.artworkCategory !== "ANTI-COUNTERFEIT & HOLOGRAMS" &&
              material.artworkCategory !== "BELLY BAND / WRAPPER" &&
              material.artworkCategory !== "CARE & COMPOSITION" &&
              material.artworkCategory !== "FLAMMABILITY / SAFETY LABELS" &&
              material.artworkCategory !== "HANG TAG SEALS / STRINGS" &&
              material.artworkCategory !== "HEAT TRANSFER LABELS" &&
              material.artworkCategory !== "INSERT CARDS" &&
              material.artworkCategory !== "HEADER CARD" &&
              material.artworkCategory !== "LABELS (BRAND/MAIN)" &&
              material.artworkCategory !== "LAW LABEL / CONTENTS TAG" &&
              material.artworkCategory !== "PRICE TICKET / BARCODE TAG" &&
              material.artworkCategory !== "QC / INSPECTION LABELS" &&
              material.artworkCategory !== "RFID / SECURITY TAGS" &&
              material.artworkCategory !== "RIBBONS" &&
              material.artworkCategory !== "SIZE LABELS (INDIVIDUAL)" &&
              material.artworkCategory !== "TAGS & SPECIAL LABELS" &&
              material.artworkCategory !== "UPC LABEL / BARCODE STICKER" && (
                <div className="col-span-full flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    REMARKS
                  </label>
                  <textarea
                    value={material.remarks}
                    onChange={(e) =>
                      handleArtworkMaterialChange(
                        actualIndex,
                        "remarks",
                        e.target.value,
                      )
                    }
                    className={`border-2 rounded-lg text-sm transition-all bg-background text-foreground focus:border-primary focus:outline-none ${errors[`artworkMaterial_${actualIndex}_remarks`] ? "border-red-600" : "border-border"}`}
                    style={{ padding: "10px 14px", width: "100%" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow =
                        "0 0 0 3px rgba(249, 77, 0, 0.1)")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "")}
                    rows="1"
                    placeholder="Additional notes..."
                  ></textarea>
                </div>
              )}
          </div>

          {/* Advanced Filter for INSERT CARDS - At the very bottom after all fields */}
          {material.artworkCategory === "INSERT CARDS" && (
            <AdvFilterInsertCards
              material={material}
              actualIndex={actualIndex}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
            />
          )}

          {/* Advanced Filter for HEADER CARD - Same as INSERT CARDS */}
          {material.artworkCategory === "HEADER CARD" && (
            <AdvFilterHeaderCard
              material={material}
              actualIndex={actualIndex}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
            />
          )}

          {/* Advanced Filter for HEAT TRANSFER LABELS - At the very bottom after all fields */}
          {material.artworkCategory === "HEAT TRANSFER LABELS" && (
            <AdvFilterHeatTransfer
              material={material}
              actualIndex={actualIndex}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
            />
          )}

          {/* Advanced Filter for HANG TAG SEALS / STRINGS - At the very bottom after all fields */}
          {material.artworkCategory === "HANG TAG SEALS / STRINGS" && (
            <AdvFilterHangTagSeals
              material={material}
              actualIndex={actualIndex}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
            />
          )}

          {/* Advanced Filter for ANTI-COUNTERFEIT & HOLOGRAMS - At the very bottom after all fields */}
          {material.artworkCategory === "ANTI-COUNTERFEIT & HOLOGRAMS" && (
            <AdvFilterAntiCounterfeit
              material={material}
              actualIndex={actualIndex}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
            />
          )}

          {/* Advanced Filter for CARE & COMPOSITION - At the very bottom after all fields */}
          {material.artworkCategory === "CARE & COMPOSITION" && (
            <AdvFilterCareComposition
              material={material}
              actualIndex={actualIndex}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
            />
          )}

          {/* Advanced Filter for FLAMMABILITY / SAFETY LABELS - At the very bottom after all fields */}
          {material.artworkCategory === "FLAMMABILITY / SAFETY LABELS" && (
            <AdvFilterFlammabilitySafety
              material={material}
              actualIndex={actualIndex}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
            />
          )}

          {/* Advanced Filter for BELLY BAND / WRAPPER - At the very bottom after all fields */}
          {material.artworkCategory === "BELLY BAND / WRAPPER" && (
            <AdvFilterBellyBand
              material={material}
              actualIndex={actualIndex}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
            />
          )}
          <div
            className="w-full col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4"
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <QualityVerificationToggle
              value={
                material.qualityVerificationByCategory?.[
                  material.artworkCategory
                ] ?? material.qualityVerification
              }
              onChange={(value) =>
                handleArtworkMaterialChange(
                  actualIndex,
                  "qualityVerificationByCategory",
                  {
                    ...(material.qualityVerificationByCategory || {}),
                    [material.artworkCategory]: value,
                  },
                )
              }
              width="lg"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ArtworkSpecFields;
