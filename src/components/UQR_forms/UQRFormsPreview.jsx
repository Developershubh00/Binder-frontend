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
  // Material-spec prefill snapshot ({header, rows}) for the picked IPC+form,
  // captured at Generate time and stored on the UQR requirement.
  const [reqPrefill, setReqPrefill] = useState(null);

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

  // Pull the material-spec prefill snapshot for the picked IPC + form. This is
  // the ONLY reliable source for the spec fields — the committed factory-code
  // APIs don't carry them; the snapshot was captured at Generate time.
  useEffect(() => {
    if (!hasFullContext || !materialFormKey) {
      setReqPrefill(null);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getUQRRequirements({
          orderType: selectedOrderType,
          ipoCode: selectedIpoCode,
          ipcCode: selectedIpcCode,
          formId: materialFormKey,
        });
        const row = (data?.results || [])[0];
        if (!cancelled) setReqPrefill(row?.prefill || null);
      } catch {
        if (!cancelled) setReqPrefill(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasFullContext, materialFormKey, selectedOrderType, selectedIpoCode, selectedIpcCode]);

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
    // Start from the material-spec snapshot (MATERIAL TYPE/DESCRIPTION, WIDTH,
    // CERTIFICATION, …); PO/IPC context fields fill on top.
    const values = { ...(reqPrefill?.header || {}) };
    if (poNo) values.poNo = poNo;
    if (factoryPoCode) values.factoryPoCode = factoryPoCode;
    if (uin) values.uin = uin;
    return Object.keys(values).length ? values : null;
  }, [materialFormKey, selectedIpo, ipcSource, selectedIpoCode, selectedIpcCode, reqPrefill]);

  // Table prefill: prefer the snapshot's rows (one per IPC material that needs
  // this form). Otherwise fall back to a single row seeded with the USN.
  const materialTablePrefill = useMemo(() => {
    if (!materialFormKey) return null;
    if (reqPrefill?.rows?.length) return reqPrefill.rows;
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
  }, [materialFormKey, ipcSource, reqPrefill]);

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
