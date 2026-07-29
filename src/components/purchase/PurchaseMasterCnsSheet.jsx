import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getPurchaseGrid,
  previewVpo,
  issueVpo,
  getJobWorkGrid,
  previewJobWorkVpo,
  issueJobWorkVpo,
  getVendorCodes,
} from '../../services/integration';
import { printVpo } from './vpo';
import { CATEGORY_CHIPS, TOP_TABS } from './columnSchemas';
import PurchaseGrid from './PurchaseGrid';
import JobWorkGrid from './JobWorkGrid';
import { VpoPreviewModal } from './vpo';
import StockUqrPanel from './StockUqrPanel';

// Shared Tailwind class strings — flat/clean theme matching the StockSheet revamp.
const OUTLINE_BTN =
  'cursor-pointer rounded-md border border-[#e2e3e8] bg-card px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50';
const PRIMARY_BTN =
  'cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';
// Segmented toggle item (top tabs + mode toggle)
const segItem = (active) =>
  `cursor-pointer rounded px-4 py-1.5 text-sm font-semibold transition-all ${
    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
  }`;
// Category chip
const chipCls = (active) =>
  `cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
    active
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-[#e2e3e8] bg-card text-muted-foreground hover:bg-muted'
  }`;

const MODE_OPTIONS = [
  { key: 'generate_vpo', label: 'Generate VPO' },
  { key: 'issue_stock', label: 'Issue Stock Qty to IPO' },
];

// Maps the Purchase grid's (tab, category-chip) to the StockSheet category key
// so the Stock & UQR check matches stock saved in the Master Stock Sheet.
const RAW_TO_STOCK_CATEGORY = {
  yarn: 'YARN',
  fabric: 'FABRIC',
  fiber: 'FIBER',
  foam: 'FOAM',
  trims: 'TRIMS_ACCESSORY',
};
const stockCategoryFor = (tab, category) => {
  if (tab === 'artwork') return 'ARTWORK_LABELLING';
  if (tab === 'packaging') return 'PACKAGING';
  return RAW_TO_STOCK_CATEGORY[category] || '';
};

const PurchaseMasterCnsSheet = ({ ipo, onBack, onOpenVpoHistory }) => {
  const ipoId = ipo?.id;
  const [tab, setTab] = useState('raw_material');
  const [category, setCategory] = useState('yarn');
  const [mode, setMode] = useState('generate_vpo');
  const [grid, setGrid] = useState({ rows: [], groups: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewErrors, setPreviewErrors] = useState(null);
  const [issuing, setIssuing] = useState(false);
  const [stockPanelRow, setStockPanelRow] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [lastIssuedVpo, setLastIssuedVpo] = useState(null);

  // Job Work tab state (separate payload shape: { materials, work_orders }).
  const [jobWork, setJobWork] = useState({ materials: [], work_orders: [] });
  const [jwPreviewOpen, setJwPreviewOpen] = useState(false);
  const [jwPreview, setJwPreview] = useState(null);
  const [jwPreviewErrors, setJwPreviewErrors] = useState(null);
  const [jwIssuing, setJwIssuing] = useState(false);
  const [jwPending, setJwPending] = useState(null); // { work_order_type, process_unit, lines }

  const isJobWork = tab === 'job_work';

  // Stale-while-revalidate cache so flipping between tabs/categories (or back
  // to one already viewed) renders instantly instead of waiting on the
  // (expensive) Master CNS recompute every time. Keyed by `${tab}:${category}`.
  const gridCache = useRef({});
  const reqToken = useRef(0);

  const chips = CATEGORY_CHIPS[tab] || [];

  // Reset category when top tab changes.
  useEffect(() => {
    const first = (CATEGORY_CHIPS[tab] || [])[0]?.key;
    if (first) setCategory(first);
    setSelected({});
  }, [tab]);

  const loadGrid = useCallback(async ({ force = false } = {}) => {
    if (!ipoId || !tab || !category) return;
    const key = `${ipoId}:${tab}:${category}`;
    const cached = gridCache.current[key];
    const token = ++reqToken.current;

    // Show cached rows immediately (no spinner) and revalidate in the
    // background. Only show the loading state when we have nothing to show.
    if (cached && !force) {
      if (tab === 'job_work') setJobWork(cached);
      else setGrid(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      if (tab === 'job_work') {
        const res = await getJobWorkGrid(ipoId, { category });
        if (token !== reqToken.current) return;
        if (res?.detail) {
          setError(res.detail);
          if (!cached) setJobWork({ materials: [], work_orders: [] });
        } else {
          const next = {
            materials: res?.materials || [],
            work_orders: res?.work_orders || [],
          };
          gridCache.current[key] = next;
          setJobWork(next);
        }
        return;
      }
      const res = await getPurchaseGrid(ipoId, { tab, category });
      if (token !== reqToken.current) return; // a newer request superseded this one
      if (res?.detail) {
        setError(res.detail);
        if (!cached) setGrid({ rows: [], groups: [] });
      } else {
        const next = { rows: res?.rows || [], groups: res?.groups || [] };
        gridCache.current[key] = next;
        setGrid(next);
      }
    } catch (err) {
      if (token !== reqToken.current) return;
      if (!cached) setError(err?.message || 'Failed to load purchase grid.');
    } finally {
      if (token === reqToken.current) setLoading(false);
    }
  }, [ipoId, tab, category]);

  useEffect(() => {
    loadGrid();
  }, [loadGrid]);

  // Vendors for the "Generate VPO" vendor dropdown (printable Purchase Order).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getVendorCodes();
        if (cancelled) return;
        const list = Array.isArray(res) ? res : (res?.results || []);
        setVendors(list);
      } catch {
        /* vendor list is optional — leave empty */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const selectedRows = useMemo(
    () => grid.rows.filter((r) => selected[r.id]),
    [grid.rows, selected]
  );
  const selectedCount = selectedRows.length;

  const handleLineItemUpdated = (row, patch) => {
    // Editing Purchase Qty changes the row's Balance (Balance = Purchase Qty −
    // Issued). Recompute it locally so the grid reflects the edit immediately;
    // the backend derives the same value on the next fetch.
    const enrich = (r) => {
      const merged = { ...r, ...patch };
      if ('purchase_qty' in patch) {
        const pq = Number(patch.purchase_qty);
        if (patch.purchase_qty === '' || patch.purchase_qty === null || Number.isNaN(pq)) {
          merged.balance_qty = null;
        } else {
          const issued = Number(merged.issued_qty ?? 0);
          merged.balance_qty = String(pq - (Number.isNaN(issued) ? 0 : issued));
        }
      }
      return merged;
    };
    const apply = (g) => ({
      ...g,
      rows: g.rows.map((r) => (r.id === row.id ? enrich(r) : r)),
    });
    setGrid((prev) => apply(prev));
    // Keep the cached copy in sync so the edit survives a tab/category flip.
    const key = `${ipoId}:${tab}:${category}`;
    if (gridCache.current[key]) gridCache.current[key] = apply(gridCache.current[key]);
  };

  // Autosave of an editable Job Work material cell (Purchased Width / Length
  // Qty) — mirror the patched value into the job-work grid state + cache so the
  // edit shows immediately and survives a tab/category flip.
  const handleJobWorkMaterialUpdated = (material, patch) => {
    const apply = (jw) => ({
      ...jw,
      materials: (jw.materials || []).map((m) =>
        m.source_id === material.source_id ? { ...m, ...patch } : m
      ),
    });
    setJobWork((prev) => apply(prev));
    const key = `${ipoId}:${tab}:${category}`;
    if (gridCache.current[key]) gridCache.current[key] = apply(gridCache.current[key]);
  };

  const buildLinesForApi = (rows) =>
    rows.map((r) => ({
      source_type: r.source_type,
      source_id: r.source_id,
      qty: Number(r.balance_qty ?? r.purchase_qty ?? 0),
      unit: r.unit,
    }));

  // Check Stock from the action bar: open the Stock & UQR panel for the first
  // selected row (the panel works one material at a time).
  const handleCheckStock = () => {
    const row = selectedRows[0];
    if (row) setStockPanelRow(row);
  };

  const openPreview = async () => {
    if (selectedCount === 0) return;
    setPreviewErrors(null);
    setPreview(null);
    setPreviewOpen(true);
    try {
      const lines = buildLinesForApi(selectedRows);
      const res = await previewVpo(ipoId, lines);
      if (res?.errors) {
        setPreviewErrors(res.errors);
        setPreview({ ipo, lines: [] });
      } else {
        setPreview(res);
      }
    } catch (err) {
      setPreviewErrors([err?.message || 'Failed to preview VPO.']);
    }
  };

  // issueData comes from the VpoPreviewModal:
  // { vendor_id, payment_terms, delivery_due_date, remarks, lines:[{...,rate,remark}] }
  const handleIssueVpo = async (issueData) => {
    const previewLines = preview?.lines || [];
    if (!previewLines.length) return;
    setIssuing(true);
    try {
      const lines = (issueData?.lines || previewLines).map((l) => ({
        source_type: l.source_type,
        source_id: l.source_id,
        qty: Number(l.qty),
        unit: l.unit,
        rate: l.rate,
        remark: l.remark,
      }));
      const res = await issueVpo(ipoId, {
        lines,
        vendor_id: issueData?.vendor_id,
        payment_terms: issueData?.payment_terms,
        delivery_due_date: issueData?.delivery_due_date,
        remarks: issueData?.remarks,
      });
      if (res?.errors) {
        setPreviewErrors(res.errors);
      } else {
        setPreviewOpen(false);
        setPreview(null);
        setSelected({});
        gridCache.current = {}; // balances changed — drop cache and refetch fresh
        loadGrid({ force: true });
        // Offer to print the just-issued Purchase Order.
        if (res?.vpo) {
          setLastIssuedVpo(res.vpo);
          printVpo(res.vpo);
        }
      }
    } catch (err) {
      setPreviewErrors([err?.message || 'Failed to issue VPO.']);
    } finally {
      setIssuing(false);
    }
  };

  // --- Job Work preview / issue ---
  // Job Work issues through the SAME VpoPreviewModal as material VPOs (vendor +
  // user PO block, entered manually). Adapt the job-work preview into that
  // modal's line shape; `jwPending` keeps the work-order meta for the issue call.
  const adaptJobWorkPreview = (res) => ({
    ipo: res?.ipo || ipo,
    lines: (res?.lines || []).map((l) => ({
      source_type: l.source_type,
      source_id: l.source_id,
      ipc_code: l.ipc_code,
      component_name: l.component_name,
      material_description: l.material_description || '',
      category: l.work_order_type,
      process_unit: l.process_unit,
      // Job-work table columns (fetched from the work-order grid).
      cns_qty: l.cns_qty,
      balance_qty: l.balance_qty,
      qty: l.issued_qty, // "Issued Qty" — drives the VPO line qty + amount
      unit: l.unit,
      rate: l.rate,
      amount: l.amount,
      remark: '',
    })),
  });

  const openJobWorkPreview = async (meta, lines) => {
    setJwPreviewErrors(null);
    setJwPreview(null);
    setJwPending({ ...meta, lines });
    setJwPreviewOpen(true);
    try {
      const res = await previewJobWorkVpo(ipoId, { ...meta, lines });
      if (res?.errors) {
        setJwPreviewErrors(res.errors);
        setJwPreview({ ipo, lines: [] });
      } else {
        setJwPreview(adaptJobWorkPreview(res));
      }
    } catch (err) {
      setJwPreviewErrors([err?.message || 'Failed to preview Job Work VPO.']);
    }
  };

  // issueData comes from VpoPreviewModal — same shape as the material flow:
  // { vendor_id, payment_terms, delivery_due_date, remarks, lines:[{ source_id, qty, rate }] }.
  // Re-attach the work-order meta (kept in jwPending) for the job-work endpoint.
  const handleIssueJobWorkVpo = async (issueData) => {
    const modalLines = issueData?.lines || [];
    if (!jwPending || !modalLines.length) return;
    setJwIssuing(true);
    try {
      const res = await issueJobWorkVpo(ipoId, {
        work_order_type: jwPending.work_order_type,
        process_unit: jwPending.process_unit,
        vendor_id: issueData?.vendor_id,
        payment_terms: issueData?.payment_terms,
        delivery_due_date: issueData?.delivery_due_date,
        remarks: issueData?.remarks,
        lines: modalLines.map((l) => ({
          source_id: l.source_id,
          issued_qty: Number(l.qty),
          rate: l.rate,
        })),
      });
      if (res?.errors) {
        setJwPreviewErrors(res.errors);
      } else {
        setJwPreviewOpen(false);
        setJwPreview(null);
        setJwPending(null);
        gridCache.current = {}; // balances changed — drop cache and refetch fresh
        loadGrid({ force: true });
      }
    } catch (err) {
      setJwPreviewErrors([err?.message || 'Failed to generate Job Work VPO.']);
    } finally {
      setJwIssuing(false);
    }
  };

  return (
    <div
      className="min-h-full w-full overflow-y-auto bg-[#f3f4f6] py-9"
      style={{
        zoom: 0.9,
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        '--accent': '#edeef1',
      }}
    >
      <div className="mx-auto max-w-[95%] space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Purchase — Master CNS Sheet
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">IPO {ipo?.ipo_code}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={OUTLINE_BTN} onClick={onOpenVpoHistory}>
              VPO History
            </button>
            <button type="button" className={OUTLINE_BTN} onClick={onBack}>
              ← Back to IPOs
            </button>
          </div>
        </div>

        {/* Top tabs */}
        <div className="inline-flex flex-wrap gap-1 rounded-md border border-[#e2e3e8] bg-muted p-1">
          {TOP_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={segItem(tab === t.key)}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-l-2 border-primary pl-4">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Category
            </span>
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  setCategory(c.key);
                  setSelected({});
                }}
                className={chipCls(category === c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {/* Mode toggle + action buttons (raw-material / artwork / packaging only —
            Job Work issues a VPO per work-order table instead). */}
        {!isJobWork && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex flex-wrap gap-1 rounded-md border border-[#e2e3e8] bg-muted p-1">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={segItem(mode === opt.key)}
                  onClick={() => {
                    setMode(opt.key);
                    setSelected({});
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {mode === 'generate_vpo' && (
                <>
                  <span className="text-xs text-muted-foreground">
                    {selectedCount} row(s) selected
                  </span>
                  <button
                    type="button"
                    className={OUTLINE_BTN}
                    onClick={handleCheckStock}
                    disabled={selectedCount === 0}
                  >
                    Check Stock
                  </button>
                  <button
                    type="button"
                    className={PRIMARY_BTN}
                    onClick={openPreview}
                    disabled={selectedCount === 0}
                  >
                    Generate VPO
                  </button>
                  {lastIssuedVpo && (
                    <button
                      type="button"
                      className={OUTLINE_BTN}
                      onClick={() => printVpo(lastIssuedVpo)}
                      title={`Reprint ${lastIssuedVpo.vpo_number || 'VPO'}`}
                    >
                      Print {lastIssuedVpo.vpo_number || 'VPO'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading grid…</div>
        ) : isJobWork ? (
          <JobWorkGrid
            data={jobWork}
            onGenerateVpo={openJobWorkPreview}
            onMaterialUpdated={handleJobWorkMaterialUpdated}
          />
        ) : (
          <PurchaseGrid
            rows={grid.rows}
            groups={grid.groups}
            tab={tab}
            category={category}
            mode={mode}
            selected={selected}
            onSelectedChange={setSelected}
            onCheckStock={(row) => setStockPanelRow(row)}
            onLineItemUpdated={handleLineItemUpdated}
          />
        )}

        <VpoPreviewModal
        open={jwPreviewOpen}
        preview={jwPreview}
        errors={jwPreviewErrors}
        busy={jwIssuing}
        vendors={vendors}
        jobWork
        onClose={() => {
          setJwPreviewOpen(false);
          setJwPreview(null);
          setJwPreviewErrors(null);
          setJwPending(null);
        }}
        onIssue={handleIssueJobWorkVpo}
      />

      <VpoPreviewModal
        open={previewOpen}
        preview={preview}
        errors={previewErrors}
        busy={issuing}
        vendors={vendors}
        onClose={() => {
          setPreviewOpen(false);
          setPreview(null);
          setPreviewErrors(null);
        }}
        onIssue={handleIssueVpo}
      />

      <StockUqrPanel
        open={Boolean(stockPanelRow)}
        ipoId={ipoId}
        row={stockPanelRow}
        category={stockCategoryFor(tab, category)}
        onClose={() => setStockPanelRow(null)}
        onIssued={() => {
          setStockPanelRow(null);
          gridCache.current = {}; // balances changed — drop cache and refetch fresh
          loadGrid({ force: true });
        }}
      />
      </div>
    </div>
  );
};

export default PurchaseMasterCnsSheet;
