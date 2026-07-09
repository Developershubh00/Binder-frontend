import { useEffect, useMemo, useState } from "react";
import {
  getIPOs,
  getFactoryCodes,
  createStockSheet,
} from "../../../services/integration";
import "../../InwardStoreSheet.css";
import AddNewMaterials from "./materialSpec/AddNewMaterials";
import {
  buildItemsFromMaterials,
  validateMaterials,
} from "./materialSpec/buildStockItems";
import { CATEGORY_TO_MATERIAL_TYPE } from "./materialSpec/applyMaterialChange";
import ThemedSelect from "./ThemedSelect";

// Shared Tailwind class strings for the redesigned shell.
// Flat/clean theme: no shadows, small radius, defined grey borders.
const CARD = "rounded-lg border border-[#e2e3e8] bg-card p-5 md:p-6";
const LABEL =
  "mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";
const CTRL =
  "w-full rounded-md border border-[#e2e3e8] bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";

// Labeled react-select dropdown, matching the flat theme.
const SelectField = ({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className,
}) => (
  <div className={className}>
    <label className={LABEL}>
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <ThemedSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isDisabled={disabled}
    />
  </div>
);

const IPO_TYPE_OPTIONS = [
  { value: "PRODUCTION", label: "Production" },
  { value: "SAMPLING", label: "Sampling" },
  { value: "COMPANY", label: "Company" },
  { value: "COMPANY_ESSENTIALS", label: "Company Essentials" },
];

const CATEGORY_OPTIONS = [
  { value: "YARN", label: "Yarn" },
  { value: "FABRIC", label: "Fabric" },
  { value: "FIBER", label: "Fiber" },
  { value: "FOAM", label: "Foam" },
  { value: "TRIMS_ACCESSORY", label: "Trims & Accessory" },
  { value: "ARTWORK_LABELLING", label: "Artwork & Labelling" },
  { value: "PACKAGING", label: "Packaging" },
  { value: "COMPANY_ESSENTIALS", label: "Company Essentials" },
];

const YARN_SUB_OPTIONS = [
  { value: "STITCHING_THREAD", label: "Stitching Thread" },
  { value: "NOT_APPLICABLE", label: "Not Applicable" },
];

const ipoTypeToOrderType = {
  PRODUCTION: "PD",
  SAMPLING: "SAM",
  COMPANY: "SELF",
  COMPANY_ESSENTIALS: "SELF",
};

const StockSheet = ({ onBack, onSaved }) => {
  // Form state
  const [source, setSource] = useState("FROM_IPO");
  const [ipoType, setIpoType] = useState("");
  const [selectedIpo, setSelectedIpo] = useState("");
  const [selectedIpc, setSelectedIpc] = useState("");
  const [category, setCategory] = useState("");
  const [yarnSubCategory, setYarnSubCategory] = useState("");
  const isFromIpo = source === "FROM_IPO";

  // The Yarn "sub-material" drives which spec form renders. It doubles as the yarn
  // sub-category: "Stitching Thread" → stitching form; "Not Applicable" → regular yarn.
  const yarnSubMaterial =
    category === "YARN" && yarnSubCategory === "STITCHING_THREAD"
      ? "Stitching Thread"
      : "";

  // Item rows (Sr.No., material_description, unit, image, details)
  const [itemRows, setItemRows] = useState([]);
  const [itemColumns, setItemColumns] = useState([]);

  // Add-New manually-built materials + their validation errors
  const [materials, setMaterials] = useState([]);
  const [itemErrors, setItemErrors] = useState({});

  // Packages
  const [numPackagesInput, setNumPackagesInput] = useState("");
  const [packageRows, setPackageRows] = useState([]);

  // Rate / Amount
  const [rate, setRate] = useState("");
  const [amount, setAmount] = useState("");

  // Lookup data
  const [ipoList, setIpoList] = useState([]);
  const [ipcList, setIpcList] = useState([]);

  // UI state
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ---- Effects: load IPOs based on IPO type ----
  useEffect(() => {
    if (!isFromIpo || !ipoType) {
      setIpoList([]);
      return;
    }
    const orderType = ipoTypeToOrderType[ipoType];
    (async () => {
      try {
        const data = await getIPOs({ order_type: orderType });
        const results = data?.results || data || [];
        setIpoList(
          Array.isArray(results)
            ? results.filter((ipo) => ipo.order_type === orderType)
            : [],
        );
      } catch {
        setIpoList([]);
      }
    })();
  }, [ipoType, isFromIpo]);

  // ---- Effects: load IPC (factory codes) for selected IPO ----
  useEffect(() => {
    if (!isFromIpo || !selectedIpo) {
      setIpcList([]);
      setSelectedIpc("");
      return;
    }
    (async () => {
      try {
        const data = await getFactoryCodes({ ipo: selectedIpo });
        const results = data?.results || data || [];
        // Dedupe by displayed code so the dropdown doesn't show repeats.
        const seen = new Set();
        const unique = [];
        for (const fc of Array.isArray(results) ? results : []) {
          const label = fc.ipc_code || fc.code || "";
          if (label && seen.has(label)) continue;
          seen.add(label);
          unique.push(fc);
        }
        setIpcList(unique);
      } catch {
        setIpcList([]);
      }
    })();
  }, [selectedIpo, isFromIpo]);

  // ---- Items loader is intentionally disabled (work in progress) ----
  // The backend material-items endpoint is being reworked; until it lands,
  // we keep the section empty and surface a "Work in progress" placeholder
  // instead of fetching and rendering anything.
  useEffect(() => {
    setItemRows([]);
    setItemColumns([]);
  }, [category, selectedIpc, yarnSubCategory, ipcList]);

  // ---- Effect: rebuild package rows when num_packages changes ----
  useEffect(() => {
    const n = parseInt(numPackagesInput, 10);
    if (!Number.isFinite(n) || n <= 0) {
      setPackageRows([]);
      return;
    }
    setPackageRows((prev) => {
      const next = [];
      for (let i = 0; i < n; i++) {
        next.push(prev[i] || { package_no: i + 1, qty: "", unit: "" });
      }
      return next;
    });
  }, [numPackagesInput]);

  // ---- Derived values ----
  const showUnitColumn = useMemo(() => {
    return itemRows.some((row) => row.unit && row.unit.toUpperCase() !== "PCS");
  }, [itemRows]);

  const totalQty = useMemo(() => {
    return packageRows.reduce(
      (sum, pkg) => sum + (parseFloat(pkg.qty) || 0),
      0,
    );
  }, [packageRows]);

  // ---- Handlers ----
  const updatePackage = (idx, field, value) => {
    setPackageRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSourceChange = (nextSource) => {
    if (nextSource === source) return;
    setSource(nextSource);
    setIpoType("");
    setSelectedIpo("");
    setSelectedIpc("");
    setIpoList([]);
    setIpcList([]);
    setMaterials([]);
    setItemErrors({});
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (isFromIpo && !ipoType) {
      setErrorMsg("Please select IPO Type.");
      return;
    }
    if (!category) {
      setErrorMsg("Please select Category.");
      return;
    }
    if (isFromIpo && category === "YARN" && !yarnSubCategory) {
      setErrorMsg("Please select the Yarn sub-category.");
      return;
    }
    if (isFromIpo && category !== "COMPANY_ESSENTIALS" && !selectedIpc) {
      setErrorMsg("Please select an IPC Code.");
      return;
    }

    // Add New: validate manually-entered materials and build the items payload.
    let addNewItems = null;
    let addNewColumns = null;
    if (!isFromIpo) {
      const materialType = CATEGORY_TO_MATERIAL_TYPE[category];
      if (!materialType) {
        setErrorMsg(
          "Manual entry isn’t supported for this category yet. Choose Yarn, Fabric, or Trims & Accessory.",
        );
        return;
      }
      const {
        errors: vErrors,
        isValid,
        message,
      } = validateMaterials(materials, materialType);
      if (!isValid) {
        setItemErrors(vErrors);
        setErrorMsg(message || "Please complete the required material fields.");
        return;
      }
      setItemErrors({});
      const built = buildItemsFromMaterials(materials);
      addNewItems = built.items;
      addNewColumns = built.item_columns;
    }

    const ipcDisplay = (() => {
      if (!isFromIpo) return "";
      const found = ipcList.find((c) => c.id === selectedIpc);
      return found ? found.ipc_code || found.code || "" : "";
    })();

    const payload = {
      source,
      ipo_type: isFromIpo ? ipoType : null,
      ipo: isFromIpo ? selectedIpo || null : null,
      ipc: isFromIpo ? selectedIpc || null : null,
      ipc_code_text: isFromIpo ? ipcDisplay : "",
      category,
      yarn_sub_category: category === "YARN" ? yarnSubCategory : "",
      num_packages: parseInt(numPackagesInput, 10) || 0,
      total_qty: totalQty,
      rate: parseFloat(rate) || 0,
      amount: parseFloat(amount) || 0,
      item_columns: isFromIpo ? itemColumns : addNewColumns,
      items: isFromIpo
        ? itemRows.map((r, i) => ({
            sr_no: r.sr_no || i + 1,
            material_description: r.material_description || "",
            unit: r.unit || "",
            details: r.details || {},
            image: r.image || null,
          }))
        : addNewItems,
      packages: packageRows.map((p, i) => ({
        package_no: p.package_no || i + 1,
        qty: parseFloat(p.qty) || 0,
        unit: p.unit || "",
      })),
    };

    setSaving(true);
    try {
      const res = await createStockSheet(payload);
      if (res?.status === "success" || res?.id) {
        setSuccessMsg("Stock Sheet saved successfully.");
        if (onSaved) onSaved(res?.data || res);
      } else {
        setErrorMsg(res?.message || JSON.stringify(res) || "Failed to save.");
      }
    } catch (err) {
      setErrorMsg(err?.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="ss-scope min-h-full py-9 w-full overflow-y-auto bg-[#f3f4f6]"
      style={{
        zoom: 0.9,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        // The theme's --input is white (invisible borders on the shared spec inputs);
        // override to a visible grey, scoped to this feature.
        "--input": "#e2e3e8",
        // The theme's --accent is a pinkish grey used for dropdown hover states; recolor
        // to a neutral light grey so hover is grey and only the selected option is orange.
        "--accent": "#edeef1",
        // Widen the shared field presets so the spec inputs don't feel squeezed.
        "--field-width-sm": "185px",
        "--field-width-md": "240px",
        "--field-width-lg": "360px",
      }}
    >
      <div className="mx-auto max-w-[95%] space-y-5 pb-26">
        {/* Consistent field grid used by every spec section: uniform responsive columns,
            fields fill their cell (max-width caps neutralised), wide fields span two. */}
        <style>{`
          .ss-fgrid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
            align-items: start;
          }
          .ss-fgrid > * { margin-bottom: 0 !important; max-width: none !important; }
          .ss-fgrid > [class*="w-field-lg"] { grid-column: span 2; }

          /* Extracted (Foam/Fiber/Artwork/etc.) sections use fixed Tailwind grids where
             the Field max-width cap leaves large empty gaps. Let fields fill their cell
             and use a tight, uniform gap so the inputs are wider and evenly spaced. */
          .ss-scope .grid { gap: 16px !important; }
          .ss-scope .grid [class*="w-field-"] { max-width: none !important; }
        `}</style>
        {/* Header */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-1 rounded-md border border-[#e2e3e8] hover:shadow-lg bg-white cursor-pointer px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-[#f5f5f5]"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-foreground">Add Stock</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isFromIpo
              ? "Create a Stock Sheet entry from an existing IPO."
              : "Create a Stock Sheet entry manually without linking an IPO."}
          </p>
        </div>

        {successMsg && (
          <div className="rounded-md border border-green-500/40 bg-green-500/10 px-5 py-4 text-sm font-medium text-green-600">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm font-medium text-destructive">
            {errorMsg}
          </div>
        )}

        {/* Entry mode + category */}
        <div className={CARD}>
          <span className={LABEL}>Entry Mode</span>
          <div className="inline-flex rounded-md border border-[#e2e3e8] bg-muted p-1">
            {[
              { key: "FROM_IPO", label: "From IPO" },
              { key: "ADD_NEW", label: "Add New" },
            ].map((opt) => {
              const active = source === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSourceChange(opt.key)}
                  className={`cursor-pointer rounded px-5 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
            {isFromIpo && (
              <>
                <SelectField
                  label="IPO Type"
                  required
                  value={ipoType}
                  onChange={(v) => {
                    setIpoType(v);
                    setSelectedIpo("");
                    setSelectedIpc("");
                  }}
                  options={IPO_TYPE_OPTIONS}
                />

                <SelectField
                  label="Select IPO"
                  value={selectedIpo}
                  onChange={setSelectedIpo}
                  disabled={!ipoType}
                  placeholder="-- Select IPO --"
                  options={ipoList.map((ipo) => ({
                    value: ipo.id,
                    label: ipo.program_name
                      ? `${ipo.ipo_code} — ${ipo.program_name}`
                      : ipo.ipo_code,
                  }))}
                />

                <SelectField
                  label="IPC Code"
                  value={selectedIpc}
                  onChange={setSelectedIpc}
                  disabled={!selectedIpo}
                  placeholder="-- Select IPC --"
                  options={ipcList.map((ipc) => ({
                    value: ipc.id,
                    label: ipc.ipc_code || ipc.code,
                  }))}
                />
              </>
            )}

            <SelectField
              label="Select Category"
              required
              className="max-w-[29.5rem]"
              value={category}
              onChange={(v) => {
                setCategory(v);
                setYarnSubCategory("");
                setMaterials([]);
                setItemErrors({});
              }}
              options={CATEGORY_OPTIONS}
            />

            {category === "YARN" && (
              <SelectField
                label="Sub-Material"
                className="max-w-[29.5rem]"
                required
                value={yarnSubCategory}
                onChange={(v) => {
                  setYarnSubCategory(v);
                  // Switching sub-material is a mode switch — rebuild the material(s)
                  // so the correct (stitching vs regular) form renders cleanly.
                  setMaterials([]);
                  setItemErrors({});
                }}
                options={YARN_SUB_OPTIONS}
              />
            )}
          </div>
        </div>

        {/* Items: From-IPO is still WIP; Add New lets the user build materials manually. */}
        {isFromIpo ? (
          <div className="rounded-lg border border-dashed border-[#d5d6dc] bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            Work in progress — items will load here once available.
          </div>
        ) : (
          <AddNewMaterials
            category={category}
            materials={materials}
            setMaterials={setMaterials}
            errors={itemErrors}
            subCategorySelected={category !== "YARN" || !!yarnSubCategory}
            yarnSubMaterial={yarnSubMaterial}
          />
        )}

        {/* # of Packages */}
        <div className={CARD}>
          <div className="max-w-xs">
            <label className={LABEL}># of Packages</label>
            <input
              className={`${CTRL} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              type="number"
              min="0"
              value={numPackagesInput}
              onChange={(e) => setNumPackagesInput(e.target.value)}
              placeholder="Enter number of packages"
            />
          </div>

          {packageRows.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-lg border border-[#e2e3e8]">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th
                      className="border-b border-[#e2e3e8] bg-muted px-3 py-2.5 text-left text-[13px] font-semibold uppercase tracking-wide text-foreground"
                      style={{ width: 110 }}
                    >
                      Package #
                    </th>
                    <th className="border-b border-[#e2e3e8] bg-muted px-3 py-2.5 text-left text-[13px] font-semibold uppercase tracking-wide text-foreground">
                      QTY
                    </th>
                    {showUnitColumn && (
                      <th
                        className="border-b border-[#e2e3e8] bg-muted px-3 py-2.5 text-left text-[13px] font-semibold uppercase tracking-wide text-foreground"
                        style={{ width: 150 }}
                      >
                        Unit
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {packageRows.map((pkg, idx) => (
                    <tr key={idx}>
                      <td className="border-b border-[#e2e3e8] px-3 py-2 align-middle">
                        {pkg.package_no}
                      </td>
                      <td className="border-b border-[#e2e3e8] px-3 py-2 align-middle">
                        <input
                          className={`${CTRL} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                          type="number"
                          min="0"
                          step="any"
                          value={pkg.qty}
                          onChange={(e) =>
                            updatePackage(idx, "qty", e.target.value)
                          }
                        />
                      </td>
                      {showUnitColumn && (
                        <td className="border-b border-[#e2e3e8] px-3 py-2 align-middle">
                          <input
                            className={CTRL}
                            type="text"
                            value={pkg.unit}
                            onChange={(e) =>
                              updatePackage(idx, "unit", e.target.value)
                            }
                            placeholder="e.g. MTR"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                  <tr>
                    <td className="bg-muted px-3 py-2.5 font-semibold">
                      Total
                    </td>
                    <td className="bg-muted px-3 py-2.5 font-semibold">
                      {totalQty.toFixed(3)}
                    </td>
                    {showUnitColumn && <td className="bg-muted px-3 py-2.5" />}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rate / Amount */}
        <div className={CARD}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={LABEL}>Rate</label>
              <input
                className={`${CTRL} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                type="number"
                min="0"
                step="any"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={LABEL}>Amount</label>
              <input
                className={`${CTRL} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            className="cursor-pointer rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Stock Sheet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockSheet;
