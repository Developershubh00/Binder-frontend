import { Fragment, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ImagePlus, X, CheckCircle2, Printer } from "lucide-react";
import {
  getAllIPOs,
  createInwardStoreSheet,
  getVpoHistory,
  getVpoDetail,
  getUQRRequirements,
} from "../services/integration";
import { uploadToBlob } from "../services/blobUpload";
import ThemedSelect from "./IMS/StockSheet/ThemedSelect";
import { printInwardReceipt } from "./inwardReceiptPrint";

// Read the logged-in user (for the "Received By" block on the printed receipt).
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

// Shared Tailwind class strings — flat/clean theme matching the StockSheet revamp:
// small radius, defined grey borders, no shadows, orange primary, grey neutrals.
const CARD = "rounded-lg border border-[#e2e3e8] bg-card p-5 md:p-6";
const LABEL =
  "mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";
const CTRL =
  "w-full rounded-md border border-[#e2e3e8] bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";
const NO_SPIN =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
const SECTION_TITLE =
  "mb-4 text-sm font-bold uppercase tracking-wide text-foreground";
// Compact table controls
const TH =
  "border-b border-[#e2e3e8] bg-muted px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground";
const TD = "border-b border-[#e2e3e8] px-2 py-1.5 align-middle";
const TCTRL =
  "w-full rounded-md border border-[#e2e3e8] bg-card px-2.5 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";
// Compact styles for the nested package sub-table so it reads as a small,
// secondary detail under the parent row (smaller text, greyer, tighter spacing).
const CTH =
  "border-b border-[#d7dae0] bg-[#e6e8ec] px-1.5 py-1 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";
const CTD = "border-b border-[#e6e7eb] px-1.5 py-1 text-[11px] align-middle";
const CINPUT =
  "w-20 rounded border border-[#e2e3e8] bg-card px-1.5 py-1 text-[11px] text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20";

const RECEIVABLE_TYPE_OPTIONS = [
  { value: "CHALLAN_ONLY", label: "Challan Only" },
  { value: "CHALLAN_CUM_INVOICE", label: "Challan Cum Invoice" },
];
const IPO_TYPE_OPTIONS = [
  { value: "COMPANY", label: "Company" },
  { value: "PRODUCTION", label: "Production" },
  { value: "SAMPLING", label: "Sampling" },
];

// Packaging form the goods arrive in — a fixed set for the Received Form column.
const FORM_OPTIONS = [
  { value: "BALE", label: "BALE" },
  { value: "BUNDLE", label: "BUNDLE" },
  { value: "ROLL", label: "ROLL" },
  { value: "PCS", label: "PCS" },
];

// A row's "# of Package" expands into that many package sub-rows (the 2nd dimension);
// the per-package quantities must add up to the row's received quantity.
const MAX_PACKAGES = 200;

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// One package sub-row. Only the quantity is entered — its Received Form, Unit and
// USN are derived from the parent item (see the render + buildUsn).
const createPackage = () => ({ id: createId(), quantity: "" });

// Grow/shrink a row's packages array to `count`, preserving existing quantities.
const resizePackages = (packages = [], count = 0) => {
  const n = Math.max(
    0,
    Math.min(Number.isFinite(count) ? count : 0, MAX_PACKAGES),
  );
  const next = packages.slice(0, n);
  while (next.length < n) next.push(createPackage());
  return next;
};

const packagesSum = (row) =>
  (row.packages || []).reduce(
    (sum, p) => sum + (parseFloat(p.quantity) || 0),
    0,
  );

// Truncate a filename to `max` chars, keeping the extension and adding an ellipsis.
const truncateName = (name, max = 20) => {
  if (!name || name.length <= max) return name || "";
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot) : "";
  const base = dot > 0 ? name.slice(0, dot) : name;
  const keep = Math.max(1, max - ext.length - 3);
  return `${base.slice(0, keep)}...${ext}`;
};

// Themed image picker: dashed upload button with an icon, or once a file is chosen a
// thumbnail preview + truncated name + an X to clear (which re-enables the button).
const ImageUpload = ({ id, value, onChange }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  if (value) {
    return (
      <div className="flex items-center gap-2.5 rounded-md border border-[#e2e3e8] bg-card p-1.5">
        {preview ? (
          <img
            src={preview}
            alt={value.name}
            className="h-10 w-10 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
            <ImagePlus className="h-4 w-4" />
          </div>
        )}
        <span
          className="flex-1 truncate text-sm font-medium text-foreground"
          title={value.name}
        >
          {truncateName(value.name)}
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          title="Remove image"
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#cdced6] bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
    >
      <ImagePlus className="h-4 w-4" />
      Upload Image
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files[0] || null)}
      />
    </label>
  );
};

const EMPTY_ROW = {
  particulars: "",
  po_quantity: "",
  received_quantity: "",
  rate: "",
  remarks: "",
  received_form: "",
  num_packages: "",
  packages: [], // [{ id, quantity }] — the 2nd-dimension per-package quantities
  uqr_sent: false,
  qc_requested: false,
  raw_material_type: "",
  raw_material: "",
  length: "",
};

// Fresh row — a new `packages` array each time (never share EMPTY_ROW's reference).
const createRow = (overrides = {}) => ({
  ...EMPTY_ROW,
  packages: [],
  ...overrides,
});

// Uppercase + dash-join a material/spec string: "Slub Fabric" -> "SLUB-FABRIC".
const slug = (text) =>
  (text || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ── Code formats (must mirror the backend in models.py) ───────────────────────
// UIN (one per sheet — the parent record):
//   [UIN_NO]-CHD/[BUYER]/[VENDOR]/[PROGRAM]/[PO_SEQUENCE]
//   e.g. 1-CHD/646A/104/PRACHI-CUSHION/6
// Buyer/program/sequence come from the IPO code; vendor from the VPO. UIN_NO is
// a per-tenant DB counter assigned on Save; the preview shows the first ("1").
const UIN_NO_PLACEHOLDER = "1";
const buildUin = (
  { buyerCode, vendorCode, program, poSequence } = {},
  uinNo = UIN_NO_PLACEHOLDER,
) =>
  `${uinNo}-CHD/${buyerCode || "000"}/${vendorCode || "000"}/` +
  `${program || "NA"}/${poSequence || "0"}`;

// USN (one per PACKAGE under the item's UIN — a child traceability record):
//   USN-[GlobalPkgNo]A/[MaterialDescription][/Specification]
//   e.g. USN-1A/VISCOSE-TWILL-100-VISCOSE-90GSM
// GlobalPkgNo is a running number across ALL packages of ALL particulars on the
// sheet, so the sequence is 1A, 2A, 3A, 4A… regardless of which item a package
// belongs to.
const buildUsn = (row, globalNo) => {
  const material = slug(row.raw_material || row.particulars);
  const spec = (row.length || "").trim();
  const parts = [];
  if (material) parts.push(material);
  if (spec) parts.push(spec);
  const suffix = parts.length ? `/${parts.join("/")}` : "";
  return `USN-${globalNo}A${suffix}`;
};

// Running package number (1-based) across all rows: every package in earlier
// rows is counted first, so package `pkgIndex` of row `rowIndex` gets its global
// position in the 1A, 2A, 3A… sequence.
const globalPackageNo = (rows, rowIndex, pkgIndex = 0) => {
  let n = 0;
  for (let i = 0; i < rowIndex; i += 1) n += (rows[i].packages || []).length;
  return n + pkgIndex + 1;
};

const escHtml = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Open a print-ready A4 sheet of carton stickers — one per package/USN, each showing
// UIN / USN / Quantity. A 2-column grid flows as many rows as fit; stickers never
// split across a page.
const printUsnStickers = (uin, items) => {
  const stickers = [];
  (items || []).forEach((item) => {
    (item.packages || []).forEach((p) => {
      stickers.push({ usn: p.usn, quantity: p.quantity, unit: p.unit });
    });
  });
  if (!stickers.length) return;

  const cards = stickers
    .map(
      (s) => `
      <div class="sticker">
        <div class="row uin"><span class="lbl">UIN:</span><span class="val">${escHtml(uin)}</span></div>
        <div class="row usn"><span class="lbl">USN:</span><span class="val">${escHtml(s.usn)}</span></div>
        <div class="row qty"><span class="lbl">Quantity:</span><span class="val">${escHtml(s.quantity || "")}${s.unit ? " " + escHtml(s.unit) : ""}</span></div>
      </div>`,
    )
    .join("");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>USN Stickers</title>
<style>
  * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html, body { margin: 0; padding: 0; background: #fff; color: #1f2937;
    font-family: "Segoe UI", Inter, Arial, sans-serif; }
  body { padding: 8mm; }
  .sheet { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm; }
  .sticker {
    border: 1px dashed #555; border-radius: 5px; padding: 3.5mm 5mm;
    display: flex; flex-direction: column; justify-content: center; gap: 1.2mm;
    break-inside: avoid; page-break-inside: avoid;
  }
  .row { line-height: 1.2; word-break: break-all; }
  .lbl { font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; margin-right: 6px; }
  .val { font-weight: 600; }
  .uin .val { font-family: "Consolas", "Courier New", monospace; font-size: 13px; }
  .usn .val { font-family: "Consolas", "Courier New", monospace; font-size: 14px; font-weight: 700; }
  .qty .val { font-size: 16px; font-weight: 800; }
  @media print {
    body { padding: 0; }
    @page { size: A4 portrait; margin: 8mm; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="sheet">${cards}</div>
  <div class="no-print" style="margin:14px 0 4px; text-align:center;">
    <button onclick="window.print()" style="padding:10px 28px; font-size:14px; font-weight:600; color:#fff; background:#f94d00; border:0; border-radius:6px; cursor:pointer;">Print Stickers</button>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win) {
    alert("Please allow pop-ups to print stickers.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
};

// Success modal: the UIN, then each particular (item) with its packages' USN codes.
const GeneratedCodesModal = ({ open, uin, items, onClose }) => {
  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[#e2e3e8] bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e2e3e8] px-6 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="text-base font-bold text-foreground">
              Successfully generated UIN and USN codes
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-5 py-4">
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              UIN
            </div>
            <div className="break-all font-mono text-2xl font-extrabold leading-tight tracking-tight text-primary">
              {uin}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Particulars &amp; their package USN codes
            </div>
            <div className="overflow-hidden rounded-md border border-[#e2e3e8]">
              <table className="w-full table-fixed text-sm">
                {/* Particular / No. of Package split so No. of Package lines up
                    above the nested USN column (which starts at 50%). */}
                <colgroup>
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "42%" }} />
                  <col style={{ width: "50%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className={`${TH} text-center`}>S. No.</th>
                    <th className={TH}>Particular</th>
                    <th className={TH}>No. of Package</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <Fragment key={item.sr}>
                      {/* Particular row */}
                      <tr>
                        <td className={`${TD} text-center font-semibold`}>
                          {item.sr}
                        </td>
                        <td className={TD}>{item.particulars || "—"}</td>
                        <td className={TD}>{item.numPackages}</td>
                      </tr>
                      {/* Its packages' USNs — the tree guide sits under the S. No.
                          column and branches to each USN, rounding at the last. */}
                      <tr>
                        <td colSpan={3} className="bg-muted/20 p-0">
                          <table className="w-full table-fixed text-sm">
                            <colgroup>
                              <col style={{ width: "8%" }} />
                              <col style={{ width: "20%" }} />
                              <col style={{ width: "14%" }} />
                              <col style={{ width: "33%" }} />
                              <col style={{ width: "25%" }} />
                            </colgroup>
                            <thead>
                              <tr>
                                {/* Trunk (bottom half) → connects into row 1. */}
                                <th
                                  className="relative p-0"
                                  aria-hidden="true"
                                >
                                  <span className="pointer-events-none absolute bottom-0 left-1/2 top-1/2 w-px bg-primary/50" />
                                </th>
                                <th className={TH}>Received Form</th>
                                <th className={TH}>Qty / Unit</th>
                                <th className={TH}>USN</th>
                                {/* Spacer — keeps the child table narrower. */}
                                <th className="p-0" aria-hidden="true" />
                              </tr>
                            </thead>
                            <tbody>
                              {item.packages.map((p, pIdx) => {
                                const isLastPkg =
                                  pIdx === item.packages.length - 1;
                                return (
                                  <tr key={p.id}>
                                    {/* Tree branch to this USN; last row rounds (└). */}
                                    <td
                                      className="relative p-0"
                                      aria-hidden="true"
                                    >
                                      {isLastPkg ? (
                                        <span className="pointer-events-none absolute left-1/2 top-0 h-1/2 w-1/2 rounded-bl-[7px] border-b border-l border-primary/50" />
                                      ) : (
                                        <>
                                          <span className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-primary/50" />
                                          <span className="pointer-events-none absolute left-1/2 top-1/2 h-px w-1/2 bg-primary/50" />
                                        </>
                                      )}
                                    </td>
                                    <td
                                      className={`${TD} font-medium text-foreground`}
                                    >
                                      {p.form}
                                    </td>
                                    <td className={TD}>
                                      {p.quantity
                                        ? `${p.quantity} ${(p.unit || "").toLowerCase()}`
                                        : "—"}
                                    </td>
                                    <td
                                      className={`${TD} break-all font-mono text-[11px] text-foreground`}
                                      title={p.usn}
                                    >
                                      {p.usn}
                                    </td>
                                    <td className="p-0" aria-hidden="true" />
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[#e2e3e8] px-6 py-4">
          <button
            type="button"
            onClick={() => printUsnStickers(uin, items)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#e2e3e8] bg-card px-5 py-2.5 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted"
          >
            <Printer className="h-4 w-4" />
            Print Codes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const InwardStoreSheet = ({ onBack }) => {
  // Form state
  const [receivableType, setReceivableType] = useState("");
  const [ipoType, setIpoType] = useState("");
  const [selectedIpo, setSelectedIpo] = useState("");

  const [goodsReceivingCondition, setGoodsReceivingCondition] = useState("");
  const [goodsConditionImage, setGoodsConditionImage] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleNumberImage, setVehicleNumberImage] = useState(null);
  const [vehiclePic, setVehiclePic] = useState(null);
  const [vendorChallanNo, setVendorChallanNo] = useState("");
  const [vendorChallanImage, setVendorChallanImage] = useState(null);
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState("");
  const [vendorInvoiceImage, setVendorInvoiceImage] = useState(null);

  // Table rows
  const [rows, setRows] = useState([createRow()]);

  // Dropdown data
  const [ipoList, setIpoList] = useState([]);
  // Issued VPOs (the new Purchase-department VPOs) used to auto-fill line items.
  const [issuedVpos, setIssuedVpos] = useState([]);
  const [selectedIssuedVpo, setSelectedIssuedVpo] = useState("");
  const [loadingVpoItems, setLoadingVpoItems] = useState(false);

  // UI state
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [createdSheet, setCreatedSheet] = useState(null);

  // True when the IPO's quality inspection is DONE (has UQR requirements and none
  // pending). Then rows auto "Sent to Quality Verification". Otherwise (No, or
  // still-pending UQR) rows show a "Request to Verification" click button.
  const [qcAutoSend, setQcAutoSend] = useState(false);

  // UIN component codes resolved from the selected IPO + VPO. Populated by the
  // effect below and fed to buildUin().
  const [orderCodes, setOrderCodes] = useState({
    buyerCode: "",
    vendorCode: "",
    program: "",
    poSequence: "",
  });
  const [showCodesModal, setShowCodesModal] = useState(false);
  // The UIN/USN codes are only revealed in the table once the user clicks
  // "Generate UIN and USN Codes"; before that the cells show "UIN :-" / "USN :-"
  // with a blank value.
  const [codesGenerated, setCodesGenerated] = useState(false);

  const isChallanOnly = receivableType === "CHALLAN_ONLY";

  // Map IPO type to the order_type filter used in the API
  const ipoTypeToOrderType = {
    COMPANY: "SELF",
    PRODUCTION: "PD",
    SAMPLING: "SAM",
  };

  // Load IPOs when ipoType changes
  useEffect(() => {
    if (!ipoType) {
      setIpoList([]);
      return;
    }
    const orderType = ipoTypeToOrderType[ipoType];
    getAllIPOs({ order_type: orderType })
      .then((data) => {
        const results = data?.results || data || [];
        const normalizedResults = Array.isArray(results) ? results : [];
        setIpoList(
          normalizedResults.filter((ipo) => ipo.order_type === orderType),
        );
      })
      .catch(() => setIpoList([]));
  }, [ipoType]);

  // Detect whether the selected IPO's goods are quality-inspected (BOM had
  // "quality inspected = Yes" → UQR requirements exist). Drives the UQR column:
  // Yes → auto Sent to Quality Verification; No → manual Request Inspection.
  useEffect(() => {
    if (!selectedIpo) {
      setQcAutoSend(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      const ipoObj = ipoList.find((o) => o.id === selectedIpo);
      const ipoCode = ipoObj?.ipo_code;
      if (!ipoCode) return;
      try {
        const res = await getUQRRequirements({ ipoCode });
        const raw = res?.results || res || [];
        const list = Array.isArray(raw) ? raw : [];
        // Auto-send only when the IPO's quality inspection is DONE — i.e. it has
        // UQR requirements and none are still pending (all filled). Otherwise
        // (No inspection, or still pending) rows offer a manual request.
        const filled = list.filter((r) => r.status === "filled").length;
        const pending = list.length - filled;
        if (!cancelled) setQcAutoSend(filled > 0 && pending === 0);
      } catch {
        if (!cancelled) setQcAutoSend(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedIpo, ipoList]);

  // When the IPO turns out to require inspection, default every row's "Sent to
  // Quality Verification" on (the auto = Yes case). Runs on the transition only.
  useEffect(() => {
    if (!qcAutoSend) return;
    setRows((prev) =>
      prev.map((r) => ({ ...r, uqr_sent: true, qc_requested: false })),
    );
  }, [qcAutoSend]);

  // Load issued VPOs (new Purchase-department VPOs) for the auto-fill selector.
  // When an IPO is chosen we scope to it; otherwise list all issued VPOs.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getVpoHistory({
          ipoId: selectedIpo || undefined,
          status: "issued",
        });
        if (!cancelled) setIssuedVpos(res?.results || []);
      } catch {
        if (!cancelled) setIssuedVpos([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedIpo]);

  // When a VPO is selected, pull its lines and populate the inward rows so the
  // user doesn't retype what Purchase already issued.
  const handleSelectIssuedVpo = async (vpoId) => {
    setSelectedIssuedVpo(vpoId);
    if (!vpoId) return;
    setLoadingVpoItems(true);
    try {
      const detail = await getVpoDetail(vpoId);
      const lines = detail?.lines || [];
      if (lines.length) {
        setRows(
          lines.map((l) =>
            createRow({
              particulars: l.material_description || "",
              raw_material: l.material_description || "",
              raw_material_type: l.category || "",
              po_quantity: l.qty != null ? String(l.qty) : "",
              received_quantity: "",
              rate: l.rate != null ? String(l.rate) : "",
              remarks: l.remark || "",
            }),
          ),
        );
      }
    } catch {
      /* leave rows as-is on failure */
    } finally {
      setLoadingVpoItems(false);
    }
  };

  // Resolve the UIN component codes once both an IPO and a VPO are selected.
  // Mirrors the backend generate_uin(): buyer / program / sequence are read from
  // the IPO code (CHD/<type>/<buyer>/<program>/<seq>); the vendor from the VPO.
  useEffect(() => {
    if (!selectedIpo || !selectedIssuedVpo) return undefined;
    let cancelled = false;

    (async () => {
      const ipoObj = ipoList.find((o) => o.id === selectedIpo);
      const vpoObj = issuedVpos.find((o) => o.id === selectedIssuedVpo);
      let vpoDetail = null;
      try {
        vpoDetail = await getVpoDetail(selectedIssuedVpo);
      } catch {
        /* ignore — still use what we have */
      }
      if (cancelled) return;

      // Buyer / program / sequence from the IPO code segments.
      const ipoCode = ipoObj?.ipo_code || vpoDetail?.ipo_code || "";
      const parts = ipoCode.split("/"); // [CHD, type, buyer, program, seq]
      const buyerCode =
        parts[2] || ipoObj?.buyer_code_display || ipoObj?.buyer_code_text || "";
      const program =
        parts[3] ||
        (ipoObj?.program_name || "").toUpperCase().replace(/\s+/g, "");
      const poSequence = parts[4] || String(ipoObj?.po_sr_no || "");

      // Vendor code from the VPO. Prefer the explicit field; otherwise pull it
      // out of the composed vpo_number (…/BUYER/VENDOR/CAT/…), where the vendor
      // segment sits right after the buyer.
      let vendorCode =
        vpoDetail?.vendor_code_display || vpoObj?.vendor_code_display || "";
      if (!vendorCode) {
        const vpoNumber = vpoDetail?.vpo_number || vpoObj?.vpo_number || "";
        const segs = vpoNumber.split("/");
        const bi = segs.findIndex(
          (s) => s === buyerCode || s.endsWith(`-${buyerCode}`),
        );
        if (bi >= 0 && segs[bi + 1]) vendorCode = segs[bi + 1];
      }

      setOrderCodes({ buyerCode, vendorCode, program, poSequence });
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedIpo, selectedIssuedVpo, ipoList, issuedVpos]);

  // Row helpers
  const addRow = () => {
    setRows((prev) => [...prev, createRow()]);
  };

  const removeRow = (idx) => {
    setRows((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev,
    );
  };

  const updateRow = (idx, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  // "# of Package" also resizes the row's package sub-rows (the 2nd dimension).
  const handleNumPackagesChange = (idx, value) => {
    const count = parseInt(value, 10);
    setRows((prev) => {
      const next = [...prev];
      const row = next[idx];
      next[idx] = {
        ...row,
        num_packages: value,
        packages: resizePackages(
          row.packages,
          Number.isFinite(count) ? count : 0,
        ),
      };
      return next;
    });
  };

  const updatePackageField = (idx, pkgIdx, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      const packages = [...(next[idx].packages || [])];
      packages[pkgIdx] = { ...packages[pkgIdx], [field]: value };
      next[idx] = { ...next[idx], packages };
      return next;
    });
  };

  const computeBalance = (row) => {
    const poQ = parseFloat(row.po_quantity) || 0;
    const recQ = parseFloat(row.received_quantity) || 0;
    return (poQ - recQ).toFixed(2);
  };

  const computeAmount = (row) => {
    const recQ = parseFloat(row.received_quantity) || 0;
    const rate = parseFloat(row.rate) || 0;
    return (recQ * rate).toFixed(2);
  };

  // Save handler
  const handleSave = async () => {
    if (!receivableType || !ipoType) {
      setErrorMsg("Please select Receivable Type and IPO Type.");
      return;
    }

    // Over-allocation is never allowed — a particular's package (USN) quantities
    // must not add up to MORE than what was received. Block save on any "over".
    const overRow = rows.findIndex((row) => {
      const np = parseInt(row.num_packages, 10) || 0;
      if (np <= 0) return false;
      const recd = parseFloat(row.received_quantity) || 0;
      return packagesSum(row) - recd > 1e-6;
    });
    if (overRow !== -1) {
      const row = rows[overRow];
      const recd = parseFloat(row.received_quantity) || 0;
      const sum = packagesSum(row);
      setErrorMsg(
        `Row ${overRow + 1}: the package quantities add up to ${sum}, which exceeds the ` +
          `received quantity (${recd}) by ${(sum - recd).toFixed(2)}. Reduce them so the ` +
          `total does not exceed the received quantity.`,
      );
      return;
    }

    // Every packaged row must allocate its full received quantity across its packages.
    const badRow = rows.findIndex((row) => {
      const np = parseInt(row.num_packages, 10) || 0;
      if (np <= 0) return false;
      const recd = parseFloat(row.received_quantity) || 0;
      if (recd <= 0) return true;
      return Math.abs(packagesSum(row) - recd) > 1e-6;
    });
    if (badRow !== -1) {
      const row = rows[badRow];
      const recd = parseFloat(row.received_quantity) || 0;
      const sum = packagesSum(row);
      setErrorMsg(
        `Row ${badRow + 1}: the ${row.num_packages} package quantities must add up to the ` +
          `received quantity (${recd || 0}). Allocated ${sum}` +
          `${recd ? `, ${(recd - sum).toFixed(2)} remaining` : ""}.`,
      );
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Upload each picked image to Vercel Blob (in parallel) and keep only the
      // returned public URLs — the API stores URLs, not file bytes.
      const [
        goodsConditionUrl,
        vehicleNumberUrl,
        vehiclePicUrl,
        vendorChallanUrl,
        vendorInvoiceUrl,
      ] = await Promise.all([
        goodsConditionImage
          ? uploadToBlob(goodsConditionImage, "ims/inward/goods-condition")
          : "",
        vehicleNumberImage
          ? uploadToBlob(vehicleNumberImage, "ims/inward/vehicle-number")
          : "",
        vehiclePic ? uploadToBlob(vehiclePic, "ims/inward/vehicle-pic") : "",
        vendorChallanImage
          ? uploadToBlob(vendorChallanImage, "ims/inward/vendor-challan")
          : "",
        !isChallanOnly && vendorInvoiceImage
          ? uploadToBlob(vendorInvoiceImage, "ims/inward/vendor-invoice")
          : "",
      ]);

      const payload = {
        receivable_type: receivableType,
        ipo_type: ipoType,
        ipo: selectedIpo || null,
        vpo: selectedIssuedVpo || null,
        goods_receiving_condition: goodsReceivingCondition,
        goods_receiving_condition_image: goodsConditionUrl || "",
        vehicle_number: vehicleNumber,
        vehicle_number_image: vehicleNumberUrl || "",
        vehicle_pic: vehiclePicUrl || "",
        vendor_challan_image: vendorChallanUrl || "",
        vendor_invoice_image: isChallanOnly ? "" : vendorInvoiceUrl || "",
        vendor_challan_no: vendorChallanNo,
        vendor_invoice_no: isChallanOnly ? "" : vendorInvoiceNo,
        items: rows.map((row, idx) => ({
          sr_no: idx + 1,
          particulars: row.particulars,
          po_quantity: parseFloat(row.po_quantity) || 0,
          received_quantity: parseFloat(row.received_quantity) || 0,
          rate: isChallanOnly ? 0 : parseFloat(row.rate) || 0,
          remarks: row.remarks,
          received_form: row.received_form,
          num_packages: parseInt(row.num_packages) || 0,
          packages: (row.packages || []).map((p, pIdx) => ({
            package_no: pIdx + 1,
            received_form: row.received_form || "",
            quantity: parseFloat(p.quantity) || 0,
            unit: "CM",
            usn: buildUsn(row, globalPackageNo(rows, idx, pIdx)),
          })),
          uqr_sent: row.uqr_sent,
          qc_requested: row.qc_requested,
          // These feed the USN: raw_material -> material description,
          // length -> specification; particular code defaults to the SR no.
          raw_material: row.raw_material,
          length: row.length,
        })),
      };

      const result = await createInwardStoreSheet(payload);
      if (result?.status === "success") {
        setSuccessMsg("Inward Store Logs saved successfully!");
        setCreatedSheet(result.data);
      } else {
        setErrorMsg(
          result?.message || JSON.stringify(result) || "Failed to save.",
        );
      }
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Build the printable Goods Receipt Note from the current form state, resolving the
  // selected ids to their human labels.
  const buildReceiptDocument = () => {
    const user = getStoredUser();
    const receivableLabel =
      RECEIVABLE_TYPE_OPTIONS.find((o) => o.value === receivableType)?.label ||
      receivableType;
    const ipoTypeLabel =
      IPO_TYPE_OPTIONS.find((o) => o.value === ipoType)?.label || ipoType;
    const ipoObj = ipoList.find((o) => o.id === selectedIpo);
    const vpoObj = issuedVpos.find((o) => o.id === selectedIssuedVpo);

    return {
      date: new Date(),
      receivable_type: receivableLabel,
      ipo_type: ipoTypeLabel,
      ipo_code: ipoObj?.ipo_code || "",
      vpo_number: vpoObj?.vpo_number || "",
      vendor_challan_no: vendorChallanNo,
      vendor_invoice_no: isChallanOnly ? "" : vendorInvoiceNo,
      goods_condition: goodsReceivingCondition,
      is_challan_only: isChallanOnly,
      uin: previewUin,
      lines: rows.map((r, i) => {
        const form = r.received_form || "FORM";
        const pkgs = r.packages || [];
        const packages = pkgs.length
          ? pkgs.map((pkg, pIdx) => ({
              form: `${form}-${pIdx + 1}`,
              quantity: pkg.quantity,
              unit: "CM",
              usn: buildUsn(r, globalPackageNo(rows, i, pIdx)),
            }))
          : [
              {
                form: `${form}-1`,
                quantity: r.received_quantity,
                unit: "CM",
                usn: buildUsn(r, globalPackageNo(rows, i, 0)),
              },
            ];
        return {
          particulars: r.particulars,
          uin: previewUin,
          po_quantity: r.po_quantity,
          received_quantity: r.received_quantity,
          balance: computeBalance(r),
          rate: r.rate,
          amount: computeAmount(r),
          remarks: r.remarks,
          received_form: r.received_form,
          num_packages: r.num_packages,
          uqr: r.uqr_sent,
          packages,
        };
      }),
      received_by_name:
        user.name ||
        user.full_name ||
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "",
      received_by_userid: user.email || user.username || "",
      received_by_post: user.designation || "",
    };
  };

  const handlePrint = () => printInwardReceipt(buildReceiptDocument());

  // Preview the UIN + per-package USN codes LIVE from the current rows — the same
  // buildUsn() the table uses, so the modal and the table never diverge. One UIN
  // per sheet; one USN per package (a single fallback when a row has no packages).
  // The real UIN number and USNs are assigned by the backend on Save.
  const previewUin = useMemo(() => buildUin(orderCodes), [orderCodes]);

  const previewItems = useMemo(
    () =>
      rows.map((row, i) => {
        const form = row.received_form || "FORM";
        const pkgs = row.packages || [];
        const packages = pkgs.length
          ? pkgs.map((pkg, pIdx) => ({
              id: pkg.id,
              form: `${form}-${pIdx + 1}`,
              quantity: pkg.quantity,
              unit: "CM",
              usn: buildUsn(row, globalPackageNo(rows, i, pIdx)),
            }))
          : [
              {
                id: `${i}-single`,
                form: `${form}-1`,
                quantity: row.received_quantity,
                unit: "CM",
                usn: buildUsn(row, globalPackageNo(rows, i, 0)),
              },
            ];
        return {
          sr: i + 1,
          particulars: row.particulars,
          numPackages: parseInt(row.num_packages, 10) || packages.length,
          packages,
        };
      }),
    [rows],
  );

  const handleGenerateCodes = () => {
    if (!selectedIpo || !selectedIssuedVpo) {
      setErrorMsg("Select an IPO and a VPO first to generate codes.");
      return;
    }
    setErrorMsg("");
    setCodesGenerated(true);
    setShowCodesModal(true);
  };

  // True when any particular's package (USN) quantities add up to MORE than its
  // received quantity. Save is blocked and the Save button is disabled while so.
  const hasOverAllocation = rows.some((row) => {
    const np = parseInt(row.num_packages, 10) || 0;
    if (np <= 0) return false;
    const recd = parseFloat(row.received_quantity) || 0;
    return packagesSum(row) - recd > 1e-6;
  });

  return (
    <div
      className="min-h-full w-full overflow-y-auto bg-[#f3f4f6] pt-9 pb-40"
      style={{
        zoom: 0.9,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        // The theme's --accent is a pinkish grey used for the dropdown option hover;
        // recolor to a neutral light grey so hover reads grey (matches StockSheet).
        "--accent": "#edeef1",
      }}
    >
      <div className="mx-auto max-w-[95%] space-y-5">
        {/* Header */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex cursor-pointer items-center gap-1 rounded-md border border-[#e2e3e8] bg-white px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-[#f5f5f5] hover:shadow-lg"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-foreground">
            Inward Store Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record incoming inventory with receiving details and generate
            UIN/USN codes
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

        {/* Generated codes display */}
        {createdSheet?.uin_code && (
          <div className={CARD}>
            <h3 className={SECTION_TITLE}>Generated Codes</h3>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-[#e2e3e8] bg-background px-3 py-1.5 font-mono text-sm">
                <span className="text-muted-foreground">UIN</span>
                <span className="font-semibold text-foreground">
                  {createdSheet.uin_code}
                </span>
              </span>
              {createdSheet.items?.map(
                (item) =>
                  item.usn_code && (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-2 rounded-md border border-[#e2e3e8] bg-background px-3 py-1.5 font-mono text-sm"
                    >
                      <span className="text-muted-foreground">
                        USN #{item.sr_no}
                      </span>
                      <span className="font-semibold text-foreground">
                        {item.usn_code}
                      </span>
                    </span>
                  ),
              )}
            </div>
          </div>
        )}

        {/* Order details */}
        <div className={CARD}>
          <h3 className={SECTION_TITLE}>Order Details</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={LABEL}>
                Receivable Type <span className="text-primary">*</span>
              </label>
              <ThemedSelect
                value={receivableType}
                onChange={setReceivableType}
                options={RECEIVABLE_TYPE_OPTIONS}
                placeholder="-- Select --"
              />
            </div>

            <div>
              <label className={LABEL}>
                Select IPO Type <span className="text-primary">*</span>
              </label>
              <ThemedSelect
                value={ipoType}
                onChange={(v) => {
                  setIpoType(v);
                  setSelectedIpo("");
                }}
                options={IPO_TYPE_OPTIONS}
                placeholder="-- Select --"
              />
            </div>

            <div>
              <label className={LABEL}>Select IPO</label>
              <ThemedSelect
                value={selectedIpo}
                onChange={setSelectedIpo}
                isDisabled={!ipoType}
                placeholder="-- Select IPO --"
                options={ipoList.map((ipo) => ({
                  value: ipo.id,
                  label: `${ipo.ipo_code} — ${ipo.program_name}`,
                }))}
              />
            </div>

            <div>
              <label className={LABEL}>
                Select VPO (auto-fill items)
                {loadingVpoItems ? " — loading…" : ""}
              </label>
              <ThemedSelect
                value={selectedIssuedVpo}
                onChange={handleSelectIssuedVpo}
                placeholder="-- Select issued VPO --"
                options={issuedVpos.map((v) => ({
                  value: v.id,
                  // The composed VPO code already carries the IPO base + category,
                  // so show it alone (no trailing ipo_code).
                  label: v.vpo_number,
                }))}
              />
            </div>
          </div>
        </div>

        {/* Receiving details */}
        <div className={CARD}>
          <h3 className={SECTION_TITLE}>Receiving Details</h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 md:items-start">
            {/* Row 1 — Goods Receiving Condition | its image */}
            <div>
              <label className={LABEL}>Goods Receiving Condition</label>
              <textarea
                className={`${CTRL} min-h-20 resize-y`}
                value={goodsReceivingCondition}
                onChange={(e) => setGoodsReceivingCondition(e.target.value)}
                placeholder="Describe goods receiving condition..."
              />
            </div>

            <div>
              <label className={LABEL}>Goods Condition Image</label>
              <ImageUpload
                id="iss-goods-condition-image"
                value={goodsConditionImage}
                onChange={setGoodsConditionImage}
              />
            </div>

            {/* Row 2 — Vehicle Number | Vehicle Pic */}
            <div>
              <label className={LABEL}>Vehicle Number</label>
              <input
                className={CTRL}
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="Enter vehicle number"
              />
              <div className="mt-2">
                <ImageUpload
                  id="iss-vehicle-number"
                  value={vehicleNumberImage}
                  onChange={setVehicleNumberImage}
                />
              </div>
            </div>

            <div>
              <label className={LABEL}>Vehicle Pic</label>
              <ImageUpload
                id="iss-vehicle-pic"
                value={vehiclePic}
                onChange={setVehiclePic}
              />
            </div>

            {/* Row 3 — Vendor Challan No. | Vendor Invoice No. */}
            <div>
              <label className={LABEL}>Vendor Challan No.</label>
              <input
                className={CTRL}
                type="text"
                value={vendorChallanNo}
                onChange={(e) => setVendorChallanNo(e.target.value)}
                placeholder="Enter challan number"
              />
              <div className="mt-2">
                <ImageUpload
                  id="iss-vendor-challan-image"
                  value={vendorChallanImage}
                  onChange={setVendorChallanImage}
                />
              </div>
            </div>

            {!isChallanOnly && (
              <div>
                <label className={LABEL}>Vendor Invoice No.</label>
                <input
                  className={CTRL}
                  type="text"
                  value={vendorInvoiceNo}
                  onChange={(e) => setVendorInvoiceNo(e.target.value)}
                  placeholder="Enter invoice number"
                />
                <div className="mt-2">
                  <ImageUpload
                    id="iss-vendor-invoice-image"
                    value={vendorInvoiceImage}
                    onChange={setVendorInvoiceImage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className={CARD}>
          <h3 className={SECTION_TITLE}>Items</h3>
          {/* pb gives the in-cell "Received Form" dropdown room to open without the
              table's overflow clipping it (which would add a scrollbar). */}
          <div className="overflow-x-auto rounded-lg border border-[#e2e3e8] pb-44">
            <table className="w-full table-fixed border-collapse text-sm">
              {isChallanOnly ? (
                <colgroup>
                  <col style={{ width: "4%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "4%" }} />
                </colgroup>
              ) : (
                <colgroup>
                  <col style={{ width: "3%" }} />
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "4%" }} />
                </colgroup>
              )}
              <thead>
                <tr>
                  <th className={`${TH} text-center`}>Sr</th>
                  <th className={TH}>Particulars</th>
                  <th className={TH}>PO Qty</th>
                  <th className={TH}>Received Qty</th>
                  <th className={`${TH} text-center`}>Bal</th>
                  {!isChallanOnly && <th className={TH}>Rate (₹)</th>}
                  {!isChallanOnly && <th className={TH}>Amount (₹)</th>}
                  <th className={TH}>Remarks</th>
                  <th className={TH}>Received Form</th>
                  <th className={TH}># of Package</th>
                  <th className={TH}>UQR</th>
                  <th className={TH}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const pkgCount = parseInt(row.num_packages, 10) || 0;
                  const colSpan = isChallanOnly ? 10 : 12;
                  const recd = parseFloat(row.received_quantity) || 0;
                  const allocated = packagesSum(row);
                  const remaining = recd - allocated;
                  return (
                    <Fragment key={idx}>
                      <tr className="bg-[#fff6f1] transition-colors hover:bg-[#ffeede]">
                        <td className={`${TD} text-center font-semibold`}>
                          {idx + 1}
                        </td>
                        <td className={TD}>
                          <input
                            className={TCTRL}
                            type="text"
                            value={row.particulars}
                            onChange={(e) =>
                              updateRow(idx, "particulars", e.target.value)
                            }
                            placeholder="Item name"
                          />
                        </td>
                        <td className={TD}>
                          <input
                            className={`${TCTRL} ${NO_SPIN}`}
                            type="number"
                            value={row.po_quantity}
                            onChange={(e) =>
                              updateRow(idx, "po_quantity", e.target.value)
                            }
                            min="0"
                          />
                        </td>
                        <td className={TD}>
                          <input
                            className={`${TCTRL} ${NO_SPIN}`}
                            type="number"
                            value={row.received_quantity}
                            onChange={(e) =>
                              updateRow(
                                idx,
                                "received_quantity",
                                e.target.value,
                              )
                            }
                            min="0"
                          />
                        </td>
                        <td className={`${TD} text-center font-medium`}>
                          {computeBalance(row)}
                        </td>
                        {!isChallanOnly && (
                          <td className={TD}>
                            <div className="flex items-center gap-1">
                              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                                ₹
                              </span>
                              <input
                                className={`${TCTRL} ${NO_SPIN}`}
                                type="number"
                                value={row.rate}
                                onChange={(e) =>
                                  updateRow(idx, "rate", e.target.value)
                                }
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </td>
                        )}
                        {!isChallanOnly && (
                          <td className={TD}>
                            <div className="flex items-center gap-1">
                              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                                ₹
                              </span>
                              <span className="font-medium">
                                {computeAmount(row)}
                              </span>
                            </div>
                          </td>
                        )}
                        <td className={TD}>
                          <input
                            className={TCTRL}
                            type="text"
                            value={row.remarks}
                            onChange={(e) =>
                              updateRow(idx, "remarks", e.target.value)
                            }
                            placeholder="Remarks"
                          />
                        </td>
                        <td className={TD}>
                          <ThemedSelect
                            value={row.received_form}
                            onChange={(v) => updateRow(idx, "received_form", v)}
                            options={FORM_OPTIONS}
                            isSearchable={false}
                            placeholder="Form"
                          />
                        </td>
                        <td className={TD}>
                          <input
                            className={`${TCTRL} ${NO_SPIN}`}
                            type="number"
                            value={row.num_packages}
                            onChange={(e) =>
                              handleNumPackagesChange(idx, e.target.value)
                            }
                            min="0"
                          />
                        </td>
                        <td className={TD}>
                          {qcAutoSend ? (
                            // Quality inspection is done for this IPO → auto-send.
                            <div
                              className="flex items-center gap-1.5"
                              title="This IPO's goods are quality-inspected (UQR done) — sent automatically."
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                              <span className="text-[9px] font-semibold leading-tight text-green-600">
                                AUTO-SENT TO QUALITY
                              </span>
                            </div>
                          ) : (
                            // No / not-yet-inspected → a click button that requests
                            // verification (sent to UQR on Save).
                            <button
                              type="button"
                              onClick={() =>
                                updateRow(
                                  idx,
                                  "qc_requested",
                                  !row.qc_requested,
                                )
                              }
                              title="Not quality-inspected. Click to request a quality inspection — it's sent to the Quality team on Save."
                              className={`w-full rounded-md border px-2 py-1.5 text-[9px] font-semibold leading-tight transition-colors ${
                                row.qc_requested
                                  ? "border-green-600 bg-green-500/10 text-green-600"
                                  : "border-amber-500 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              }`}
                            >
                              {row.qc_requested
                                ? "✓ REQUESTED — SENDS ON SAVE"
                                : "REQUEST TO VERIFICATION"}
                            </button>
                          )}
                        </td>
                        <td className={`${TD} text-center`}>
                          <button
                            type="button"
                            className="cursor-pointer rounded p-1 text-lg leading-none text-destructive transition-colors hover:bg-destructive/10"
                            onClick={() => removeRow(idx)}
                            title="Remove row"
                          >
                            ×
                          </button>
                        </td>
                      </tr>

                      {/* 2nd dimension: the item's packages. Received Form, Unit and
                          USN are prefilled from the parent; only quantity is entered,
                          and the quantities must sum to the received quantity to save.
                          The first (blank) cell keeps it indented under the SR column. */}
                      {pkgCount > 0 && row.packages.length > 0 && (
                        <tr>
                          {/* Packages span the whole row width (incl. under Sr.
                              No.) so the tree-guide trunk sits under Sr. No. and
                              each USN row branches off it, rounding at the last. */}
                          <td
                            colSpan={colSpan}
                            className="border-b border-[#e2e3e8] bg-muted/20 py-3 pl-1 pr-3"
                          >
                            <div
                              className="mb-2 flex flex-wrap items-center justify-between gap-2 pl-[calc(4%+0.5rem)]"
                              style={{ maxWidth: "55%" }}
                            >
                              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {pkgCount} {row.received_form || "package"}
                                {pkgCount > 1 ? "s" : ""} — enter quantity per
                                package
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-muted-foreground">
                                  Allocated{" "}
                                  <span className="font-semibold text-foreground">
                                    {allocated}
                                  </span>{" "}
                                  / Received{" "}
                                  <span className="font-semibold text-foreground">
                                    {recd || 0}
                                  </span>
                                </span>
                                {Math.abs(remaining) < 1e-6 && recd > 0 ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-green-600">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Balanced
                                  </span>
                                ) : remaining > 0 ? (
                                  <span className="font-semibold text-amber-600">
                                    {remaining.toFixed(2)} remaining
                                  </span>
                                ) : (
                                  <span className="font-semibold text-destructive">
                                    {Math.abs(remaining).toFixed(2)} over
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="relative">
                              {/* White fill for the data columns only. The guide
                                  rail (~under Sr. No.) stays outside on the left,
                                  and the box covers only the left ~half (spacer
                                  column on the right) so it reads as a small,
                                  secondary detail under the parent row. */}
                              <div
                                className="pointer-events-none absolute inset-y-0 rounded-md bg-white"
                                style={{ left: "4%", right: "45%" }}
                                aria-hidden="true"
                              />
                              <table className="relative w-full table-fixed border-collapse">
                                <colgroup>
                                  <col style={{ width: "4%" }} />
                                  <col style={{ width: "13%" }} />
                                  <col style={{ width: "11%" }} />
                                  <col style={{ width: "27%" }} />
                                  <col style={{ width: "45%" }} />
                                </colgroup>
                                <thead>
                                  <tr>
                                    {/* Trunk (bottom half) → connects down into
                                        the first package row. Transparent so the
                                        rail sits outside the data box. */}
                                    <th
                                      className="relative p-0"
                                      aria-hidden="true"
                                    >
                                      <span className="pointer-events-none absolute bottom-0 left-1/2 top-1/2 w-px bg-primary/50" />
                                    </th>
                                    <th className={CTH}>Received Form</th>
                                    <th className={CTH}>Qty / Unit</th>
                                    <th className={`${CTH} normal-case`}>
                                      UIN :- {codesGenerated ? previewUin : ""}
                                    </th>
                                    {/* Spacer — outside the box (keeps it half-width). */}
                                    <th className="p-0" aria-hidden="true" />
                                  </tr>
                                </thead>
                                <tbody>
                                  {row.packages.map((pkg, pIdx) => {
                                    const usn = buildUsn(
                                      row,
                                      globalPackageNo(rows, idx, pIdx),
                                    );
                                    const isLastPkg =
                                      pIdx === row.packages.length - 1;
                                    // Zebra striping (white / light grey) so packages
                                    // are easy to scan; first row white, then grey.
                                    const zebra =
                                      pIdx % 2 === 0
                                        ? "bg-white"
                                        : "bg-[#f5f6f8]";
                                    return (
                                      <tr key={pkg.id}>
                                        {/* Tree branch to this USN row; the last
                                            row rounds off into an └. */}
                                        <td
                                          className="relative p-0"
                                          aria-hidden="true"
                                        >
                                          {isLastPkg ? (
                                            <span className="pointer-events-none absolute left-1/2 top-0 h-1/2 w-1/2 rounded-bl-[7px] border-b border-l border-primary/50" />
                                          ) : (
                                            <>
                                              <span className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-primary/50" />
                                              <span className="pointer-events-none absolute left-1/2 top-1/2 h-px w-1/2 bg-primary/50" />
                                            </>
                                          )}
                                        </td>
                                        <td
                                          className={`${CTD} ${zebra} font-semibold text-foreground`}
                                        >
                                          {row.received_form || "FORM"}-
                                          {pIdx + 1}
                                        </td>
                                        <td className={`${CTD} ${zebra}`}>
                                          <div className="flex items-center gap-1">
                                            <input
                                              className={`${CINPUT} ${NO_SPIN}`}
                                              type="number"
                                              min="0"
                                              value={pkg.quantity}
                                              onChange={(e) =>
                                                updatePackageField(
                                                  idx,
                                                  pIdx,
                                                  "quantity",
                                                  e.target.value,
                                                )
                                              }
                                              placeholder="0"
                                            />
                                            <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                                              cm
                                            </span>
                                          </div>
                                        </td>
                                        <td
                                          className={`${CTD} ${zebra} break-all pl-3 font-mono text-[10px] text-muted-foreground`}
                                          title={codesGenerated ? usn : ""}
                                        >
                                          USN :- {codesGenerated ? usn : ""}
                                        </td>

                                        <td className="p-0" aria-hidden="true" />
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                              {/* Border framing the data columns (right of the
                                  guide rail, left ~half of the row). */}
                              <div
                                className="pointer-events-none absolute inset-y-0 rounded-md border border-[#d0d3da]"
                                style={{ left: "4%", right: "45%" }}
                                aria-hidden="true"
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            + Add Row
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <button
            type="button"
            className="cursor-pointer rounded-md border border-[#e2e3e8] bg-card px-6 py-3 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted"
            onClick={handlePrint}
          >
            Print Receipt
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md border border-primary bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:border-[#e2e3e8] disabled:bg-muted disabled:text-foreground/40"
            onClick={handleGenerateCodes}
            disabled={!selectedIpo || !selectedIssuedVpo}
            title={
              !selectedIpo || !selectedIssuedVpo
                ? "Select an IPO and a VPO first"
                : undefined
            }
          >
            Generate UIN and USN Codes
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground/40 disabled:opacity-100 disabled:hover:opacity-100"
            onClick={handleSave}
            disabled={saving || hasOverAllocation}
            title={
              hasOverAllocation
                ? "Some particulars' package quantities exceed the received quantity — fix them to save."
                : undefined
            }
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <GeneratedCodesModal
        open={showCodesModal}
        uin={previewUin}
        items={previewItems}
        onClose={() => setShowCodesModal(false)}
      />
    </div>
  );
};

export default InwardStoreSheet;
