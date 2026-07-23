import { useCallback, useEffect, useMemo, useState } from "react";
import BaseFormTemplate from "./BaseFormTemplate";
import UQRPendings from "./UQRPendings";
import { formsConfig } from "./formConfig";
import ThemedSelect from "../IMS/StockSheet/ThemedSelect";
import {
  getIPOs,
  getFactoryCodes,
  getFactoryCode,
  getFactoryCodesByIpo,
  getFactoryCodeDraft,
  getUQRRequirements,
} from "../../services/integration";
import { toOrderTypeApiValue } from "../../utils/orderType";
import {
  ORDER_TYPE_SEQUENCE,
  FORM_DISPLAY_NAME_BY_KEY,
} from "@/utils/uqrMappings";
import { computePrefillFromDraft } from "./uqrPrefill";

// The material category a UQR form key belongs to (for the inline list filter).
const materialCategoryOfFormKey = (formKey = "") => {
  if (formKey === "fabric") return "Fabric";
  if (formKey === "yarn") return "Yarn";
  if (formKey.startsWith("foam")) return "Foam";
  if (formKey.startsWith("fiber")) return "Fiber";
  if (formKey.startsWith("trims")) return "Trims & Accessory";
  if (formKey.startsWith("artworks")) return "Artwork & Labelling";
  return "Other";
};

const UQR_DRAFT_PREFIX = "uqrDraft::";

// Shared Tailwind class strings — flat/clean theme matching the StockSheet revamp.
const CARD = "rounded-lg border border-[#e2e3e8] bg-card p-5 md:p-6";
const LABEL =
  "mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

// Material filter — mirrors StockSheet's "Select Category" options.
const MATERIAL_OPTIONS = [
  { value: "YARN", label: "Yarn" },
  { value: "FABRIC", label: "Fabric" },
  { value: "FOAM", label: "Foam" },
  { value: "FIBER", label: "Fiber" },
  { value: "TRIMS_ACCESSORY", label: "Trims & Accessory" },
  { value: "ARTWORK_LABELLING", label: "Artwork & Labelling" },
];

// Which single UQR form a material maps to. Foam/Fiber/Trims/Artwork pick a
// sub-type instead (each maps to its own form) — see SUBTYPE_CONFIG below.
const MATERIAL_TO_FORM_KEY = {
  YARN: "yarn",
  FABRIC: "fabric",
};

// Foam / Fiber sub-types — the option `value` IS the form key in formsConfig.
const FOAM_TYPE_OPTIONS = [
  { value: "foamEva", label: "EVA" },
  { value: "foamGelInfused", label: "Gel Infused" },
  { value: "foamHr", label: "HR" },
  { value: "foamLatex", label: "Latex" },
  { value: "foamMemory", label: "Memory" },
  { value: "foamPeEpe", label: "PE EPE" },
  { value: "foamPu", label: "PU" },
  { value: "foamRebonded", label: "Rebonded" },
];

const FIBER_TYPE_OPTIONS = [
  { value: "fiberCottonFill", label: "Cotton Fill" },
  { value: "fiberDownAlternative", label: "Down Alternative" },
  { value: "fiberDownFeather", label: "Down Feather" },
  { value: "fiberMicrofiber", label: "Microfiber" },
  { value: "fiberPolyesterFill", label: "Polyester" },
  { value: "fiberSpecialityFill", label: "Speciality Fill" },
  { value: "fiberWoolNatural", label: "Wool Natural" },
];

// Build { value: formKey, label } options from a list of form keys, using the
// shared display-name map, sorted alphabetically by label.
const toFormKeyOptions = (keys) =>
  keys
    .map((key) => ({ value: key, label: FORM_DISPLAY_NAME_BY_KEY[key] || key }))
    .sort((a, b) => a.label.localeCompare(b.label));

const TRIM_TYPE_OPTIONS = toFormKeyOptions([
  "trimsBuckles", "trimsButtons", "trimsCableTies", "trimsCordStops", "trimsFelt",
  "trimsFrTrims", "trimsHooksEyes", "trimsInterlining", "trimsLace",
  "trimsMagneticClosure", "trimsNiwarWebbing", "trimsPinBarbs", "trimsReflectiveTapes",
  "trimsRibbing", "trimsRingsLoops", "trimsRivets", "trimsSeamTape", "trimsShoulderPads",
  "trimsVelcro", "trimsZippers",
]);

const ARTWORK_TYPE_OPTIONS = toFormKeyOptions([
  "artworksAntiCounterfeit", "artworksBellyBand", "artworksCareComposition",
  "artworksFlammability", "artworksHangtagSeals", "artworksHeatTransfer",
  "artworksInsertCards", "artworksLabelMain", "artworksLawLabel", "artworksPriceTag",
  "artworksQcLabels", "artworksRfid", "artworksSizeLabels", "artworksTagsSpecial",
  "artworksUpcLabel",
]);

// Materials that need a second "type" dropdown → its label, placeholder, options.
const SUBTYPE_CONFIG = {
  FOAM: { label: "Foam Type", placeholder: "Select foam type", options: FOAM_TYPE_OPTIONS },
  FIBER: { label: "Fibre Type", placeholder: "Select fibre type", options: FIBER_TYPE_OPTIONS },
  TRIMS_ACCESSORY: { label: "Trim Type", placeholder: "Select trim type", options: TRIM_TYPE_OPTIONS },
  ARTWORK_LABELLING: { label: "Artwork Type", placeholder: "Select artwork type", options: ARTWORK_TYPE_OPTIONS },
};

const getSectionContextKey = ({ orderType, ipoCode, ipcCode, formKey }) =>
  `${orderType}::${ipoCode}::${ipcCode}::${formKey}`;

const getDraftStorageKey = (contextKey = "") =>
  contextKey ? `${UQR_DRAFT_PREFIX}${contextKey}` : "";

// First non-empty value among candidate keys on an object.
const firstOf = (obj, keys) => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
};

const UQRFormsPreview = ({ mode = "forms", onBack }) => {
  const isDatabaseMode = mode === "database";

  // Section → IPO → IPC, loaded from the API exactly like StockSheet's From-IPO flow.
  // Nothing is pre-selected — the user picks each one.
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [ipoList, setIpoList] = useState([]);
  const [selectedIpoId, setSelectedIpoId] = useState("");
  const [ipcList, setIpcList] = useState([]);
  const [selectedIpcId, setSelectedIpcId] = useState("");
  const [ipcDetail, setIpcDetail] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  // Foam/Fiber sub-type (a form key); empty for Yarn/Fabric.
  const [selectedSubType, setSelectedSubType] = useState("");
  const [loadingIpos, setLoadingIpos] = useState(false);
  const [loadingIpcs, setLoadingIpcs] = useState(false);
  // "Pending UQRs" popup — the queue of required-but-unfilled UQR forms.
  const [showPendings, setShowPendings] = useState(false);
  // The IPO's full draft payload — the complete source we read material specs
  // from to prefill a form (the committed factory-code APIs don't carry them).
  const [draftPayload, setDraftPayload] = useState(null);
  // Required UQR forms for the currently-selected IPC (drives the inline list).
  const [ipcReqs, setIpcReqs] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(false);
  // Optional material-type filter on the inline list.
  const [pendingFilter, setPendingFilter] = useState("");

  /* ---------------------------------------------------------------- *
   * IPOs for the selected section (mirrors StockSheet)
   * ---------------------------------------------------------------- */
  const loadIpos = useCallback(async () => {
    if (!selectedOrderType) {
      setIpoList([]);
      return;
    }
    const orderType = toOrderTypeApiValue(selectedOrderType);
    setLoadingIpos(true);
    try {
      const data = await getIPOs({ order_type: orderType });
      const results = data?.results || data?.data || data || [];
      setIpoList(
        Array.isArray(results)
          ? results.filter((ipo) => ipo.order_type === orderType)
          : [],
      );
    } catch (error) {
      console.warn("UQR: failed to load IPOs:", error);
      setIpoList([]);
    } finally {
      setLoadingIpos(false);
    }
  }, [selectedOrderType]);

  useEffect(() => {
    loadIpos();
    window.addEventListener("internalPurchaseOrdersUpdated", loadIpos);
    return () =>
      window.removeEventListener("internalPurchaseOrdersUpdated", loadIpos);
  }, [loadIpos]);

  // Drop the IPO selection if it's no longer in the list (never auto-pick one).
  useEffect(() => {
    if (
      selectedIpoId &&
      !ipoList.some((ipo) => String(ipo.id) === String(selectedIpoId))
    ) {
      setSelectedIpoId("");
    }
  }, [ipoList, selectedIpoId]);

  /* ---------------------------------------------------------------- *
   * IPCs (factory codes) for the selected IPO (mirrors StockSheet)
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedIpoId) {
      setIpcList([]);
      setSelectedIpcId("");
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setLoadingIpcs(true);
      try {
        const data = await getFactoryCodes({ ipo: selectedIpoId });
        const results = data?.results || data?.data || data || [];
        // Dedupe by displayed code so the dropdown doesn't show repeats.
        const seen = new Set();
        const unique = [];
        for (const fc of Array.isArray(results) ? results : []) {
          const label = fc.ipc_code || fc.code || "";
          if (!label || seen.has(label)) continue;
          seen.add(label);
          unique.push(fc);
        }
        // The committed factory-code table can be missing IPCs (e.g. an IPC that
        // never persisted, or was overwritten). The per-IPO draft is the complete
        // source, so merge in any IPC codes it lists that aren't already shown.
        try {
          const draft = await getFactoryCodeDraft(selectedIpoId);
          const payload = draft?.payload || draft || {};
          (payload.skus || []).forEach((sku) => {
            const codes = [
              sku?.ipcCode,
              ...((sku?.subproducts || []).map((sp) => sp?.ipcCode)),
            ];
            codes.forEach((code) => {
              if (!code || seen.has(code)) return;
              seen.add(code);
              unique.push({ id: code, ipc_code: code });
            });
          });
        } catch {
          // No draft (or load failed) — fall back to the committed list only.
        }
        unique.sort((a, b) =>
          (a.ipc_code || "").localeCompare(b.ipc_code || ""),
        );
        if (!cancelled) setIpcList(unique);
      } catch (error) {
        console.warn("UQR: failed to load factory codes:", error);
        if (!cancelled) setIpcList([]);
      } finally {
        if (!cancelled) setLoadingIpcs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedIpoId]);

  // Drop the IPC selection if it's no longer in the list (never auto-pick one).
  useEffect(() => {
    if (
      selectedIpcId &&
      !ipcList.some((ipc) => String(ipc.id) === String(selectedIpcId))
    ) {
      setSelectedIpcId("");
    }
  }, [ipcList, selectedIpcId]);

  // Load the IPO's draft once — the complete source for material-spec prefill.
  useEffect(() => {
    if (!selectedIpoId) {
      setDraftPayload(null);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const draft = await getFactoryCodeDraft(selectedIpoId);
        if (!cancelled) setDraftPayload(draft?.payload || draft || null);
      } catch {
        if (!cancelled) setDraftPayload(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedIpoId]);

  /* ---------------------------------------------------------------- *
   * Full IPC (factory code) detail for the selected IPC. The list record
   * is only a summary, so we fetch:
   *   - getFactoryCode(id)          → the by-id detail
   *   - getFactoryCodesByIpo(ipoId) → the nested/complete committed shape,
   *     from which we pick the row matching this IPC (carries the components).
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedIpcId) {
      setIpcDetail(null);
      return undefined;
    }
    let cancelled = false;

    // Pull out the component-ish arrays from a factory-code record.
    const extractComponents = (fc) => {
      if (!fc || typeof fc !== "object") return null;
      const products = fc.products || fc.skus || [];
      const productList = Array.isArray(products) ? products : [];
      return {
        rawMaterials: fc.raw_materials || fc.rawMaterials || [],
        artworkMaterials: fc.artwork_materials || fc.artworkMaterials || [],
        packagingMaterials: fc.packaging_materials || fc.packagingMaterials || [],
        products: productList,
        productComponents: productList.flatMap((p) => p?.components || []),
        subproducts: fc.subproducts || [],
      };
    };

    (async () => {
      try {
        const [detailRes, byIpoRes] = await Promise.all([
          getFactoryCode(selectedIpcId).catch((error) => {
            console.warn("UQR: getFactoryCode failed:", error);
            return null;
          }),
          selectedIpoId
            ? getFactoryCodesByIpo(selectedIpoId).catch((error) => {
                console.warn("UQR: getFactoryCodesByIpo failed:", error);
                return null;
              })
            : null,
        ]);
        if (cancelled) return;

        const detail = detailRes?.data || detailRes || null;
        const byIpoList =
          byIpoRes?.results || byIpoRes?.data || byIpoRes || [];
        const ipoScopedRecord = (Array.isArray(byIpoList) ? byIpoList : []).find(
          (fc) => String(fc.id) === String(selectedIpcId),
        );

        // Prefer whichever actually carries components.
        const complete =
          (extractComponents(detail)?.rawMaterials?.length ||
          extractComponents(detail)?.products?.length
            ? detail
            : null) ||
          ipoScopedRecord ||
          detail;

        setIpcDetail(complete);
        console.log("[UQR] Full IPC details", {
          ipcId: selectedIpcId,
          ipoId: selectedIpoId,
          detail, // getFactoryCode(id)
          ipoScopedRecord, // matching row from getFactoryCodesByIpo
          detailFields: detail ? Object.keys(detail) : [],
          ipoScopedFields: ipoScopedRecord ? Object.keys(ipoScopedRecord) : [],
          components:
            extractComponents(detail) || extractComponents(ipoScopedRecord),
        });
      } catch (error) {
        console.warn("UQR: failed to load full IPC details:", error);
        if (!cancelled) setIpcDetail(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedIpcId, selectedIpoId]);

  /* ---------------------------------------------------------------- *
   * Derived — the context keys are code-based, the dropdowns are id-based.
   * ---------------------------------------------------------------- */
  const selectedIpo = useMemo(
    () => ipoList.find((ipo) => String(ipo.id) === String(selectedIpoId)) || null,
    [ipoList, selectedIpoId],
  );

  const selectedIpcRecord = useMemo(
    () => ipcList.find((ipc) => String(ipc.id) === String(selectedIpcId)) || null,
    [ipcList, selectedIpcId],
  );

  const selectedIpoCode = selectedIpo?.ipo_code || selectedIpo?.code || "";
  const selectedIpcCode =
    selectedIpcRecord?.ipc_code || selectedIpcRecord?.code || "";

  // Debug: dump every field the API returns for the picked IPO / IPC.
  useEffect(() => {
    if (!selectedIpo && !selectedIpcRecord) return;
    console.log("[UQR] Selected IPO / IPC details", {
      section: selectedOrderType,
      ipoCode: selectedIpoCode,
      ipcCode: selectedIpcCode,
      ipo: selectedIpo,
      ipc: selectedIpcRecord,
      ipoFields: selectedIpo ? Object.keys(selectedIpo) : [],
      ipcFields: selectedIpcRecord ? Object.keys(selectedIpcRecord) : [],
    });
  }, [
    selectedOrderType,
    selectedIpo,
    selectedIpcRecord,
    selectedIpoCode,
    selectedIpcCode,
  ]);

  /* ---------------------------------------------------------------- *
   * Required UQR forms for the selected IPC — the inline "pending" list.
   * ---------------------------------------------------------------- */
  const loadIpcReqs = useCallback(async () => {
    if (!selectedOrderType || !selectedIpoCode || !selectedIpcCode) {
      setIpcReqs([]);
      return;
    }
    setLoadingReqs(true);
    try {
      const data = await getUQRRequirements({
        orderType: selectedOrderType,
        ipoCode: selectedIpoCode,
        ipcCode: selectedIpcCode,
      });
      setIpcReqs(Array.isArray(data?.results) ? data.results : []);
    } catch {
      setIpcReqs([]);
    } finally {
      setLoadingReqs(false);
    }
  }, [selectedOrderType, selectedIpoCode, selectedIpcCode]);

  useEffect(() => {
    loadIpcReqs();
  }, [loadIpcReqs]);

  /* ---------------------------------------------------------------- *
   * Material form (Materials dropdown) — e.g. YARN → the Yarn UQR form.
   * Foam/Fiber pick a sub-type whose value is the form key.
   * ---------------------------------------------------------------- */
  const subTypeCfg = SUBTYPE_CONFIG[selectedMaterial] || null;
  const needsSubType = Boolean(subTypeCfg);
  const materialFormKey = needsSubType
    ? selectedSubType
    : MATERIAL_TO_FORM_KEY[selectedMaterial] || "";
  const materialFormConfig = materialFormKey
    ? formsConfig[materialFormKey]
    : null;
  const hasFullContext = Boolean(
    selectedOrderType && selectedIpoCode && selectedIpcCode,
  );
  // Save contextually when an IPO+IPC is chosen; otherwise keep a material-scoped
  // local draft so the form is still usable on its own.
  const materialContextKey = materialFormKey
    ? hasFullContext
      ? getSectionContextKey({
          orderType: selectedOrderType,
          ipoCode: selectedIpoCode,
          ipcCode: selectedIpcCode,
          formKey: materialFormKey,
        })
      : `material::${selectedMaterial}::${materialFormKey}`
    : "";
  const materialDraftKey = getDraftStorageKey(materialContextKey);
  const materialApiContext = hasFullContext
    ? {
        orderType: selectedOrderType,
        ipoCode: selectedIpoCode,
        ipcCode: selectedIpcCode,
      }
    : null;

  // Auto-fill from the picked PO/IPC: PO NO ← IPO code, FACTORY PO CODE ← IPC code,
  // UIN ← the unit id on the IPC record (candidate keys; blank if the API omits it).
  // Prefer the richer by-id detail; fall back to the list record.
  const ipcSource = useMemo(
    () => ({ ...(selectedIpcRecord || {}), ...(ipcDetail || {}) }),
    [selectedIpcRecord, ipcDetail],
  );

  // Material-spec prefill computed LIVE from the IPO draft for the picked IPC +
  // form. Live (not a stored snapshot) so mapping improvements show immediately —
  // the draft is the complete source the committed APIs don't carry.
  const livePrefill = useMemo(() => {
    if (!materialFormKey || !draftPayload || !selectedIpcCode) return null;
    return computePrefillFromDraft(draftPayload, selectedIpcCode, materialFormKey);
  }, [materialFormKey, draftPayload, selectedIpcCode]);

  const materialPrefillValues = useMemo(() => {
    if (!materialFormKey) return null;
    const poNo =
      firstOf(selectedIpo, ["ipo_code", "ipoCode", "po_no", "poNo", "code"]) ||
      selectedIpoCode;
    const factoryPoCode =
      firstOf(ipcSource, [
        "ipc_code",
        "ipcCode",
        "factory_po_code",
        "factoryPoCode",
        "code",
      ]) || selectedIpcCode;
    // UIN (Unit ID) ← a dedicated unit id if present, else the factory code (e.g. "FC-211").
    const uin = firstOf(ipcSource, [
      "uin",
      "unit_id",
      "unitId",
      "uid",
      "code",
    ]);
    // Start from the material-spec prefill (MATERIAL TYPE/DESCRIPTION, WIDTH,
    // CERTIFICATION, …); PO/IPC context fields fill on top.
    const values = { ...(livePrefill?.header || {}) };
    if (poNo) values.poNo = poNo;
    if (factoryPoCode) values.factoryPoCode = factoryPoCode;
    if (uin) values.uin = uin;
    return Object.keys(values).length ? values : null;
  }, [materialFormKey, selectedIpo, ipcSource, selectedIpoCode, selectedIpcCode, livePrefill]);

  // Table prefill: prefer the live rows (one per IPC material that needs this
  // form). Otherwise fall back to a single row seeded with the USN.
  const materialTablePrefill = useMemo(() => {
    if (!materialFormKey) return null;
    if (livePrefill?.rows?.length) return livePrefill.rows;
    const dedicated = firstOf(ipcSource, [
      "usn",
      "unit_sequence",
      "unit_sequence_no",
      "unitSequence",
    ]);
    const ipcCode = firstOf(ipcSource, ["ipc_code", "ipcCode"]);
    const sequenceMatch = ipcCode.match(/(?:IPC|SP)-?(\d+)\s*$/i);
    const usn =
      dedicated || (sequenceMatch && sequenceMatch[1]) || firstOf(ipcSource, ["sku"]);
    return usn ? { usn } : null;
  }, [materialFormKey, ipcSource, livePrefill]);

  // Open the form for a given UQR form key by driving the existing Material /
  // sub-type selectors — this reuses the whole render + prefill pipeline below.
  const openFormForKey = (formKey) => {
    if (!formKey) return;
    if (formKey === "fabric") {
      setSelectedMaterial("FABRIC");
      setSelectedSubType("");
    } else if (formKey === "yarn") {
      setSelectedMaterial("YARN");
      setSelectedSubType("");
    } else if (formKey.startsWith("foam")) {
      setSelectedMaterial("FOAM");
      setSelectedSubType(formKey);
    } else if (formKey.startsWith("fiber")) {
      setSelectedMaterial("FIBER");
      setSelectedSubType(formKey);
    } else if (formKey.startsWith("trims")) {
      setSelectedMaterial("TRIMS_ACCESSORY");
      setSelectedSubType(formKey);
    } else if (formKey.startsWith("artworks")) {
      setSelectedMaterial("ARTWORK_LABELLING");
      setSelectedSubType(formKey);
    }
  };

  // The inline list, filtered by the optional material-type chip.
  const filteredIpcReqs = pendingFilter
    ? ipcReqs.filter((r) => materialCategoryOfFormKey(r.form_id) === pendingFilter)
    : ipcReqs;
  // Distinct material categories present on this IPC (for the filter chips).
  const ipcReqCategories = Array.from(
    new Set(ipcReqs.map((r) => materialCategoryOfFormKey(r.form_id))),
  ).sort();

  return (
    <div
      className="min-h-full w-full overflow-y-auto bg-[#f3f4f6] py-9"
      style={{
        zoom: 0.9,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        // Recolor the theme's pinkish --accent to a neutral grey for dropdown hover.
        "--accent": "#edeef1",
      }}
    >
      <div className="mx-auto flex max-w-[95%] flex-col gap-5">
        {/* Header */}
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-5 inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#e2e3e8] bg-white px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-[#f5f5f5] hover:shadow-lg"
            >
              ← Back
            </button>
          )}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isDatabaseMode ? "UQR Database" : "UQR Forms"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isDatabaseMode
                  ? "Browse all saved UQR forms using the same section, IPO, IPC, and material filters."
                  : "Create and submit UQR forms using the existing section, IPO, IPC, and material flow."}
              </p>
            </div>
            {!isDatabaseMode && (
              <button
                type="button"
                onClick={() => setShowPendings(true)}
                className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
              >
                Pending UQRs
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className={`${CARD} space-y-4`}>
          {/* Row 1: Section / IPO / IPC */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={LABEL}>Section</label>
              <ThemedSelect
                value={selectedOrderType}
                onChange={(value) => {
                  setSelectedOrderType(value);
                  setSelectedIpoId("");
                  setSelectedIpcId("");
                }}
                options={ORDER_TYPE_SEQUENCE.map((type) => ({
                  value: type,
                  label: type,
                }))}
                isSearchable={false}
                placeholder="Select section"
              />
            </div>

            <div>
              <label className={LABEL}>IPO</label>
              <ThemedSelect
                value={selectedIpoId}
                onChange={(value) => {
                  setSelectedIpoId(value);
                  setSelectedIpcId("");
                }}
                options={ipoList.map((ipo) => ({
                  value: String(ipo.id),
                  label: ipo.program_name
                    ? `${ipo.ipo_code} — ${ipo.program_name}`
                    : ipo.ipo_code || ipo.code || String(ipo.id),
                }))}
                isDisabled={!selectedOrderType || loadingIpos || ipoList.length === 0}
                placeholder={
                  !selectedOrderType
                    ? "Select section first"
                    : loadingIpos
                      ? "Loading IPOs…"
                      : ipoList.length === 0
                        ? "No IPOs"
                        : "-- Select IPO --"
                }
              />
            </div>

            <div>
              <label className={LABEL}>IPC</label>
              <ThemedSelect
                value={selectedIpcId}
                onChange={setSelectedIpcId}
                options={ipcList.map((ipc) => ({
                  value: String(ipc.id),
                  label: ipc.ipc_code || ipc.code || String(ipc.id),
                }))}
                isDisabled={!selectedIpoId || loadingIpcs || ipcList.length === 0}
                placeholder={
                  !selectedIpoId
                    ? "Select IPO first"
                    : loadingIpcs
                      ? "Loading IPCs…"
                      : ipcList.length === 0
                        ? "No IPCs"
                        : "-- Select IPC --"
                }
              />
            </div>
          </div>

          {/* Row 2: Materials (+ Foam/Fiber type when applicable) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={LABEL}>Materials</label>
              <ThemedSelect
                value={selectedMaterial}
                onChange={(value) => {
                  setSelectedMaterial(value);
                  setSelectedSubType(""); // reset the sub-type on material change
                }}
                options={MATERIAL_OPTIONS}
                isSearchable={false}
                placeholder="Select material"
              />
            </div>

            {subTypeCfg && (
              <div>
                <label className={LABEL}>{subTypeCfg.label}</label>
                <ThemedSelect
                  value={selectedSubType}
                  onChange={setSelectedSubType}
                  options={subTypeCfg.options}
                  placeholder={subTypeCfg.placeholder}
                />
              </div>
            )}
          </div>
        </div>

        {/* Inline list of required UQR forms for the selected IPC (forms mode) */}
        {!isDatabaseMode && selectedIpcCode && (
          <div className={`${CARD} space-y-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-foreground">
                Quality inspections required for{" "}
                <span className="text-primary">{selectedIpcCode}</span>
                {!loadingReqs && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {filteredIpcReqs.length} form{filteredIpcReqs.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>
              {ipcReqCategories.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {["", ...ipcReqCategories].map((cat) => (
                    <button
                      key={cat || "all"}
                      type="button"
                      onClick={() => setPendingFilter(cat)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        pendingFilter === cat
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-[#e2e3e8] bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {cat || "All"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loadingReqs ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading…</div>
            ) : filteredIpcReqs.length === 0 ? (
              <div className="rounded-md border border-dashed border-[#e2e3e8] py-8 text-center text-sm text-muted-foreground">
                No quality inspections required for this IPC. (They appear once the
                IPC is generated with a material marked “quality inspected? = Yes”.)
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#e2e3e8]">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border-b border-[#e2e3e8] bg-muted px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground">Material</th>
                      <th className="border-b border-[#e2e3e8] bg-muted px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground">UQR Form</th>
                      <th className="border-b border-[#e2e3e8] bg-muted px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground">Status</th>
                      <th className="border-b border-[#e2e3e8] bg-muted px-4 py-2.5" style={{ width: 100 }} aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIpcReqs.map((r) => {
                      const isActive = r.form_id === materialFormKey;
                      return (
                        <tr key={r.id} className={isActive ? "bg-primary/5" : ""}>
                          <td className="border-b border-[#e2e3e8] px-4 py-2.5 text-foreground">
                            {materialCategoryOfFormKey(r.form_id)}
                          </td>
                          <td className="border-b border-[#e2e3e8] px-4 py-2.5 text-foreground">
                            {FORM_DISPLAY_NAME_BY_KEY[r.form_id] || formsConfig[r.form_id]?.title || r.form_id}
                          </td>
                          <td className="border-b border-[#e2e3e8] px-4 py-2.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                r.filled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {r.filled ? "Filled" : "Pending"}
                            </span>
                          </td>
                          <td className="border-b border-[#e2e3e8] px-4 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => openFormForKey(r.form_id)}
                              className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90"
                            >
                              {isActive ? "Open" : r.filled ? "View" : "Fill"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Material form */}
        {materialFormConfig && (
          <div className={CARD}>
            <BaseFormTemplate
              key={materialContextKey}
              formId={materialFormKey}
              title={materialFormConfig.title}
              sections={materialFormConfig.sections}
              tableConfig={materialFormConfig.tableConfig}
              draftStorageKey={materialDraftKey}
              apiContext={materialApiContext}
              prefillValues={materialPrefillValues}
              tablePrefill={materialTablePrefill}
              readOnly={isDatabaseMode}
              onSubmitSuccess={loadIpcReqs}
            />
          </div>
        )}
      </div>

      {/* Pending UQRs popup (opened from the header button) */}
      <UQRPendings open={showPendings} onClose={() => setShowPendings(false)} />
    </div>
  );
};

export default UQRFormsPreview;
