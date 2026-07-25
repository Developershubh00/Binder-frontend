import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import {
  getStoreQualityRequests,
  getStoreQualitySummary,
  updateStoreQualityRequest,
  getAssignableUsers,
} from "../services/integration";
import ThemedSelect from "./IMS/StockSheet/ThemedSelect";

const CARD = "rounded-lg border border-[#e2e3e8] bg-card";
const TH =
  "border-b border-[#e2e3e8] bg-muted px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground whitespace-nowrap";
const TD = "border-b border-[#e2e3e8] px-3 py-2.5 align-middle text-foreground";

const STATUS_TABS = [
  { key: "open", label: "Open" },
  { key: "unassigned", label: "Unassigned" },
  { key: "mine", label: "Assigned to me" },
  { key: "all", label: "All" },
];

const OPEN_STATUSES = ["requested", "assigned", "in_review"];

const STATUS_STYLES = {
  requested: "bg-amber-500/10 text-amber-600",
  assigned: "bg-blue-500/10 text-blue-600",
  in_review: "bg-violet-500/10 text-violet-600",
  passed: "bg-green-500/10 text-green-600",
  failed: "bg-destructive/10 text-destructive",
};

const NEXT_ACTIONS = {
  requested: [{ to: "in_review", label: "Start Review" }],
  assigned: [{ to: "in_review", label: "Start Review" }],
  in_review: [
    { to: "passed", label: "Pass" },
    { to: "failed", label: "Fail" },
  ],
};

const userLabel = (u) =>
  u?.name ||
  u?.full_name ||
  [u?.first_name, u?.last_name].filter(Boolean).join(" ") ||
  u?.email ||
  u?.username ||
  "";

const StoreQualityInbox = ({ onBack }) => {
  const [tab, setTab] = useState("open");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ open: 0, unassigned: 0, assigned_to_me: 0, total: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (tab === "unassigned") params.status = "requested";
      if (tab === "mine") params.assigned = "me";
      const [reqRes, sumRes] = await Promise.all([
        getStoreQualityRequests(params),
        getStoreQualitySummary(),
      ]);
      let list = reqRes?.results || reqRes || [];
      list = Array.isArray(list) ? list : [];
      if (tab === "open") list = list.filter((r) => OPEN_STATUSES.includes(r.status));
      if (tab === "unassigned") list = list.filter((r) => !r.assigned_to);
      setRows(list);
      setSummary(sumRes || {});
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getAssignableUsers()
      .then((res) => {
        const list = res?.results || res || [];
        setUsers(Array.isArray(list) ? list : []);
      })
      .catch(() => setUsers([]));
  }, []);

  const patch = async (id, data) => {
    setBusyId(id);
    try {
      await updateStoreQualityRequest(id, data);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const Stat = ({ label, value, tone }) => (
    <div className={`${CARD} px-4 py-3`}>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={`mt-0.5 text-2xl font-bold ${tone || "text-foreground"}`}>
        {value ?? 0}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-full w-full overflow-y-auto bg-[#f3f4f6] py-9"
      style={{
        zoom: 0.9,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        "--accent": "#edeef1",
      }}
    >
      <div className="mx-auto max-w-[95%] space-y-5">
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <ShieldCheck className="h-7 w-7 text-primary" />
                Store Quality Inspections
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Inspection requests coming from the Inward / Outward store — assign a
                quality-team member and work them through.
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#e2e3e8] bg-card px-4 py-2.5 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Open" value={summary.open} tone="text-primary" />
          <Stat label="Unassigned" value={summary.unassigned} tone="text-amber-600" />
          <Stat label="Assigned to me" value={summary.assigned_to_me} tone="text-blue-600" />
          <Stat label="Total" value={summary.total} />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-[#e2e3e8] bg-card text-foreground/70 hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={`overflow-x-auto ${CARD}`}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className={TH}>Source</th>
                <th className={TH}>USN / Particulars</th>
                <th className={TH}>UIN</th>
                <th className={TH}>Trigger</th>
                <th className={TH}>Status</th>
                <th className={TH}>Assigned To</th>
                <th className={TH}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td className={`${TD} text-center text-muted-foreground`} colSpan={7}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className={`${TD} text-center text-muted-foreground`} colSpan={7}>
                    No inspection requests here.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-muted/50">
                    <td className={`${TD} capitalize`}>{r.source}</td>
                    <td className={TD}>
                      <div className="font-mono text-[11px] text-foreground">
                        {r.usn_code || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {r.particulars || ""}
                      </div>
                    </td>
                    <td className={`${TD} font-mono text-[11px]`}>{r.uin_code || "—"}</td>
                    <td className={TD}>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                          r.mode === "auto"
                            ? "bg-primary/10 text-primary"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {r.mode === "auto" ? "Auto (Yes)" : "Requested (No)"}
                      </span>
                    </td>
                    <td className={TD}>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          STATUS_STYLES[r.status] || "bg-muted text-foreground"
                        }`}
                      >
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className={`${TD} min-w-[180px]`}>
                      <ThemedSelect
                        value={r.assigned_to || ""}
                        onChange={(v) => patch(r.id, { assigned_to: v || null })}
                        isDisabled={busyId === r.id}
                        placeholder="— Assign —"
                        options={users.map((u) => ({
                          value: u.id,
                          label: userLabel(u),
                        }))}
                      />
                    </td>
                    <td className={TD}>
                      <div className="flex flex-wrap gap-1.5">
                        {(NEXT_ACTIONS[r.status] || []).map((a) => (
                          <button
                            key={a.to}
                            type="button"
                            disabled={busyId === r.id}
                            onClick={() => patch(r.id, { status: a.to })}
                            className={`cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                              a.to === "failed"
                                ? "border border-destructive/40 text-destructive hover:bg-destructive/10"
                                : a.to === "passed"
                                  ? "bg-green-600 text-white hover:opacity-90"
                                  : "border border-[#e2e3e8] text-foreground/70 hover:bg-muted"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                        {!NEXT_ACTIONS[r.status] && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreQualityInbox;