import { useCallback, useEffect, useMemo, useState } from "react";
import BaseFormTemplate from "./BaseFormTemplate";
import { formsConfig } from "./formConfig";
import { getUQRRequirements } from "../../services/integration";
import { FORM_DISPLAY_NAME_BY_KEY } from "@/utils/uqrMappings";

// Shared Tailwind class strings — flat/clean theme matching UQRFormsPreview.
const TH =
  "border-b border-[#e2e3e8] bg-muted px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground whitespace-nowrap";
const TD = "border-b border-[#e2e3e8] px-4 py-3 align-middle text-sm text-foreground";
const PRIMARY_BTN =
  "inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const OUTLINE_BTN =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#e2e3e8] bg-card px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

// Human label for a UQR form key (e.g. "trimsZippers" → "Zippers").
const formLabel = (formId) =>
  FORM_DISPLAY_NAME_BY_KEY[formId] || formsConfig[formId]?.title || formId;

// A local-storage backup key for an in-progress fill (mirrors UQRFormsPreview).
const uqrLocalKey = (r) =>
  `uqrDraft::pending::${r.order_type}::${r.ipo_code}::${r.ipc_code}::${r.form_id}`;

/**
 * UQR Pendings popup — the queue of UQR forms an IPC still needs.
 *
 * Opened by the "Pending UQRs" button on the UQR Forms page. A row appears for
 * every material/artwork on a generated IPC marked "Do you want the goods to be
 * quality inspected? = Yes" whose form isn't filled yet
 * (backend: GET ims/uqr-requirements/?status=pending). Clicking Fill opens the
 * matching UQR form scoped to that IPC; submitting saves contextually and the
 * backend flips the requirement to "filled", so it drops out of this list.
 */
const UQRPendings = ({ open, onClose }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null); // the requirement being filled

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUQRRequirements({ status: "pending" });
      const results = Array.isArray(data?.results) ? [...data.results] : [];
      // Group visually by IPO → IPC → form.
      results.sort(
        (a, b) =>
          (a.ipo_code || "").localeCompare(b.ipo_code || "") ||
          (a.ipc_code || "").localeCompare(b.ipc_code || "") ||
          formLabel(a.form_id).localeCompare(formLabel(b.form_id)),
      );
      setRows(results);
    } catch (err) {
      setError(err?.message || "Failed to load UQR pendings.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // (Re)load whenever the popup is opened; reset any in-progress fill on close.
  useEffect(() => {
    if (open) {
      load();
    } else {
      setActive(null);
    }
  }, [open, load]);

  const activeConfig = active ? formsConfig[active.form_id] : null;
  const activeApiContext = useMemo(
    () =>
      active
        ? {
            orderType: active.order_type,
            ipoCode: active.ipo_code,
            ipcCode: active.ipc_code,
          }
        : null,
    [active],
  );
  const activePrefill = useMemo(
    () =>
      active
        ? { poNo: active.ipo_code, factoryPoCode: active.ipc_code, uin: active.ipc_code }
        : null,
    [active],
  );

  // The form just saved contextually → the requirement is now filled server-side,
  // so reloading the list makes this row disappear.
  const handleSubmitSuccess = () => {
    setActive(null);
    load();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.45)] p-4 py-10"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", "--accent": "#edeef1" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-xl border border-[#e2e3e8] bg-[#f3f4f6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#e2e3e8] bg-card px-6 py-4 rounded-t-xl">
          <div>
            <h2 className="text-lg font-bold text-foreground">Pending UQRs</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              UQR forms an IPC still needs — created when a material or artwork is
              marked “quality inspected? = Yes”. Filling a form clears it here.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!active && (
              <button
                type="button"
                className={OUTLINE_BTN}
                onClick={load}
                disabled={loading}
              >
                Refresh
              </button>
            )}
            <button type="button" className={OUTLINE_BTN} onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {active ? (
            <div className="rounded-lg border border-[#e2e3e8] bg-card p-5 md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {formLabel(active.form_id)}
                  </span>
                  {" · "}
                  {[active.order_type, active.ipo_code, active.ipc_code]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <button
                  type="button"
                  className={OUTLINE_BTN}
                  onClick={() => setActive(null)}
                >
                  ← Back to list
                </button>
              </div>
              {activeConfig ? (
                <BaseFormTemplate
                  key={uqrLocalKey(active)}
                  formId={active.form_id}
                  title={activeConfig.title}
                  sections={activeConfig.sections}
                  tableConfig={activeConfig.tableConfig}
                  draftStorageKey={uqrLocalKey(active)}
                  apiContext={activeApiContext}
                  prefillValues={activePrefill}
                  onSubmitSuccess={handleSubmitSuccess}
                />
              ) : (
                <div className="text-sm text-destructive">
                  No form template found for “{active.form_id}”.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-[#e2e3e8] bg-card p-5 md:p-6">
              <div className="mb-4 text-sm font-semibold text-foreground">
                {loading
                  ? "Loading…"
                  : `${rows.length} pending UQR form${rows.length === 1 ? "" : "s"}`}
              </div>

              {error && (
                <div className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              {!loading && rows.length === 0 && !error ? (
                <div className="rounded-md border border-dashed border-[#e2e3e8] px-4 py-10 text-center text-sm text-muted-foreground">
                  No pending UQR forms. They appear here when an IPC is generated
                  with a material or artwork marked “quality inspected? = Yes”.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-[#e2e3e8]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className={TH}>Section</th>
                        <th className={TH}>IPO</th>
                        <th className={TH}>IPC</th>
                        <th className={TH}>UQR Form</th>
                        <th className={TH} style={{ width: 120 }} aria-label="Actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.id}>
                          <td className={TD}>{r.order_type || "—"}</td>
                          <td className={TD}>{r.ipo_code || "—"}</td>
                          <td className={TD}>{r.ipc_code || "—"}</td>
                          <td className={TD}>{formLabel(r.form_id)}</td>
                          <td className={`${TD} text-right`}>
                            <button
                              type="button"
                              className={PRIMARY_BTN}
                              onClick={() => setActive(r)}
                            >
                              Fill
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UQRPendings;