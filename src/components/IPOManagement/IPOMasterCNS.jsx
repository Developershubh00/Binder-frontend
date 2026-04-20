import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-layout';
import { getIPOMasterCNS, saveIPOMasterCNSRows } from '../../services/integration';

const TABS = [
  { key: 'raw_material', label: 'Raw Material' },
  { key: 'artwork_labeling', label: 'Artwork & Labeling' },
  { key: 'packaging', label: 'Packaging' },
];

const RAW_SUBTABS = [
  { key: 'fabric', label: 'Fabric', matches: (t) => /fabric/i.test(t) },
  { key: 'fiber', label: 'Fiber', matches: (t) => /fiber|fibre/i.test(t) },
  { key: 'foam', label: 'Foam', matches: (t) => /foam/i.test(t) },
  { key: 'trim', label: 'Trim & Accessory', matches: (t) => /trim|accessory|accessor/i.test(t) },
  { key: 'yarn', label: 'Yarn', matches: (t) => /yarn|thread/i.test(t) },
];

const formatNumber = (value, { decimals = 3, suffix = '' } = {}) => {
  if (value === null || value === undefined || value === '') return '-';
  const n = Number(value);
  if (!Number.isFinite(n)) return '-';
  return `${n.toFixed(decimals)}${suffix}`;
};

const toNum = (v) => {
  if (v === null || v === undefined || v === '') return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

// Derived fabric values (pure helpers; same row shape as backend)
const grossLengthPc = (row) => {
  const n = toNum(row.net_length_cns_pc);
  const w = toNum(row.gross_wastage_length);
  if (!Number.isFinite(n)) return NaN;
  return n * (1 + (Number.isFinite(w) ? w : 0) / 100);
};
const grossWidthPc = (row) => {
  const n = toNum(row.net_width_cns_pc);
  const w = toNum(row.gross_wastage_width);
  if (!Number.isFinite(n)) return NaN;
  return n * (1 + (Number.isFinite(w) ? w : 0) / 100);
};
const fabricGrossWidthCns = (row, ctx) => {
  if (!ctx?.isClub) return grossWidthPc(row);
  return ctx.clubRows.reduce((acc, r) => {
    const v = grossWidthPc(r);
    return acc + (Number.isFinite(v) ? v : 0);
  }, 0);
};
const fabricPurchaseWidthTotal = (row, ctx) => {
  const readOne = (id) => toNum(ctx?.manualInputs?.[id]?.purchase_width);
  if (!ctx?.isClub) return readOne(row.id);
  return ctx.clubRows.reduce((acc, r) => {
    const v = readOne(r.id);
    return acc + (Number.isFinite(v) ? v : 0);
  }, 0);
};

const YARN_COLUMNS = [
  { key: 'material_description', header: 'Material Description', align: 'left',
    render: (r) => r.material_description || '-' },
  { key: 'net_cns_pc', header: 'Net CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_cns_pc) },
  { key: 'overage_qty_pcs', header: 'Overage QTY PCS', align: 'right',
    render: (r) => formatNumber(r.overage_qty_pcs, { decimals: 2 }) },
  { key: 'gross_wastage', header: 'Gross Wastage', align: 'right',
    render: (r) => formatNumber(r.gross_wastage, { decimals: 2, suffix: '%' }) },
  { key: 'gross_cns', header: 'Gross CNS', align: 'right',
    render: (r) => formatNumber(r.gross_cns) },
  { key: 'unit', header: 'Unit', align: 'left',
    render: (r) => r.unit || '-' },
];

const numberInputStyle = (invalid) => ({
  width: 90,
  padding: '4px 6px',
  fontSize: 13,
  border: `1px solid ${invalid ? '#dc2626' : '#d1d5db'}`,
  borderRadius: 4,
  background: invalid ? '#fef2f2' : '#ffffff',
  textAlign: 'right',
  outline: 'none',
});

const ManualNumberCell = ({ rowId, field, ctx, invalid }) => {
  const value = ctx?.manualInputs?.[rowId]?.[field] ?? '';
  return (
    <input
      type="number"
      step="any"
      value={value}
      onChange={(e) => ctx?.setManualInput?.(rowId, field, e.target.value)}
      style={numberInputStyle(invalid)}
      title={invalid ? 'Purchase Width must be greater than Gross Width CNS' : undefined}
    />
  );
};

const FABRIC_COLUMNS = [
  { key: 'material_description', header: 'Material Description', align: 'left',
    render: (r) => r.material_description || '-' },
  { key: 'overage_qty', header: 'Overage QTY', align: 'right',
    render: (r) => formatNumber(r.overage_qty ?? r.overage_qty_pcs, { decimals: 2 }) },
  { key: 'net_length_cns_pc', header: 'Net Length CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_length_cns_pc) },
  { key: 'net_width_cns_pc', header: 'Net Width CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_width_cns_pc) },
  { key: 'gross_wastage_length', header: 'Gross Wastage Length', align: 'right',
    render: (r) => formatNumber(r.gross_wastage_length, { decimals: 2, suffix: '%' }) },
  { key: 'gross_wastage_width', header: 'Gross Wastage Width', align: 'right',
    render: (r) => formatNumber(r.gross_wastage_width, { decimals: 2, suffix: '%' }) },
  { key: 'gross_length_cns_pc', header: 'Gross Length CNS/PC', align: 'right',
    render: (r) => formatNumber(grossLengthPc(r)) },
  { key: 'gross_width_cns_pc', header: 'Gross Width CNS/PC', align: 'right',
    render: (r) => formatNumber(grossWidthPc(r)) },
  { key: 'gross_width_cns', header: 'Gross Width CNS', align: 'right',
    aggregatedInClub: true,
    render: (r, ctx) => formatNumber(fabricGrossWidthCns(r, ctx)) },
  { key: 'purchase_width', header: 'Purchase Width', align: 'right',
    aggregatedInClub: true,
    render: (r, ctx) => {
      const scopePurchase = fabricPurchaseWidthTotal(r, ctx);
      const scopeGross = fabricGrossWidthCns(r, ctx);
      const invalid = Number.isFinite(scopePurchase) && Number.isFinite(scopeGross)
        && scopePurchase > 0 && scopePurchase <= scopeGross;
      if (ctx?.isClub) {
        return (
          <span
            style={{
              fontWeight: 600,
              color: invalid ? '#dc2626' : undefined,
            }}
            title={invalid ? 'Purchase Width sum must be greater than Gross Width CNS' : undefined}
          >
            {formatNumber(scopePurchase, { decimals: 2 })}
          </span>
        );
      }
      return <ManualNumberCell rowId={r.id} field="purchase_width" ctx={ctx} invalid={invalid} />;
    } },
  { key: 'unit', header: 'Unit', align: 'left',
    render: (r) => r.unit || '-' },
  { key: 'gross_length_qty', header: 'Gross Length QTY', align: 'right',
    render: (r) => {
      const glPc = grossLengthPc(r);
      const overage = toNum(r.overage_qty ?? r.overage_qty_pcs);
      if (!Number.isFinite(glPc) || !Number.isFinite(overage)) return '-';
      return formatNumber(glPc * overage, { decimals: 2 });
    } },
  { key: 'purchase_length_qty', header: 'Purchase Length QTY', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_length_qty" ctx={ctx} /> },
  { key: 'gross_width_multiple', header: 'Gross Width Multiple', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="gross_width_multiple" ctx={ctx} /> },
  { key: 'balance_gross_width_wastage', header: 'Balance Gross Width Wastage', align: 'right',
    aggregatedInClub: true,
    render: (r, ctx) => {
      const pw = fabricPurchaseWidthTotal(r, ctx);
      const gw = fabricGrossWidthCns(r, ctx);
      if (!Number.isFinite(pw) || !Number.isFinite(gw)) return '-';
      return formatNumber(pw - gw, { decimals: 2 });
    } },
  { key: 'balance_gross_width_wastage_pct', header: 'Balance Gross Width Wastage %', align: 'right',
    aggregatedInClub: true,
    render: (r, ctx) => {
      const pw = fabricPurchaseWidthTotal(r, ctx);
      const gw = fabricGrossWidthCns(r, ctx);
      if (!Number.isFinite(pw) || !Number.isFinite(gw) || pw === 0) return '-';
      return formatNumber(((pw - gw) / pw) * 100, { decimals: 2, suffix: '%' });
    } },
];

const TRIM_COLUMNS = [
  { key: 'material_description', header: 'Material Description', align: 'left',
    render: (r) => r.material_description || '-' },
  { key: 'overage_qty', header: 'Overage QTY', align: 'right',
    render: (r) => formatNumber(r.overage_qty, { decimals: 2 }) },
  { key: 'gsm', header: 'GSM', align: 'right',
    render: (r) => formatNumber(r.gsm, { decimals: 2 }) },
  { key: 'cns_pc', header: 'CNS/PC', align: 'right',
    render: (r) => formatNumber(r.cns_pc) },
  { key: 'net_length_cns_pc', header: 'Net Length CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_length_cns_pc) },
  { key: 'net_width_cns_pc', header: 'Net Width CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_width_cns_pc) },
  { key: 'gross_wastage_length', header: 'Gross Wastage Length', align: 'right',
    render: (r) => formatNumber(r.gross_wastage_length, { decimals: 2, suffix: '%' }) },
  { key: 'gross_wastage_width', header: 'Gross Wastage Width', align: 'right',
    render: (r) => formatNumber(r.gross_wastage_width, { decimals: 2, suffix: '%' }) },
  { key: 'gross_length_pc_cns', header: 'Gross Length CNS/PC', align: 'right',
    render: (r) => formatNumber(grossLengthPc(r)) },
  { key: 'gross_width_cns_pc', header: 'Gross Width CNS/PC', align: 'right',
    render: (r) => formatNumber(grossWidthPc(r)) },
  { key: 'purchase_width', header: 'Purchase Width', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_width" ctx={ctx} /> },
  { key: 'unit', header: 'Unit', align: 'left',
    render: (r) => r.unit || '-' },
  { key: 'gross_length_cns', header: 'Gross Length CNS', align: 'right',
    render: (r) => formatNumber(r.gross_length_cns) },
  { key: 'purchase_length_qty', header: 'Purchase Length QTY', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_length_qty" ctx={ctx} /> },
  { key: 'gross_qty_pcs', header: 'Gross QTY PCS', align: 'right',
    render: (r) => formatNumber(r.gross_qty_pcs, { decimals: 2 }) },
  { key: 'purchase_qty_pcs', header: 'Purchase QTY PCS', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_qty_pcs" ctx={ctx} /> },
  { key: 'gross_weight_qty', header: 'Gross Weight QTY', align: 'right',
    render: (r) => formatNumber(r.gross_weight_qty, { decimals: 2 }) },
  { key: 'purchase_weight_qty', header: 'Purchase Weight QTY', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_weight_qty" ctx={ctx} /> },
];

const FIBER_COLUMNS = [
  { key: 'material_description', header: 'Material Description', align: 'left',
    render: (r) => r.material_description || '-' },
  { key: 'overage_qty', header: 'Overage QTY', align: 'right',
    render: (r) => formatNumber(r.overage_qty, { decimals: 2 }) },
  { key: 'denier', header: 'Denier', align: 'right',
    render: (r) => formatNumber(r.denier, { decimals: 2 }) },
  { key: 'gsm', header: 'GSM', align: 'right',
    render: (r) => formatNumber(r.gsm, { decimals: 2 }) },
  { key: 'net_length_cns_pc', header: 'Net Length CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_length_cns_pc) },
  { key: 'net_width_cns_pc', header: 'Net Width CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_width_cns_pc) },
  { key: 'net_weight_cns_pc_grams', header: 'Net Weight CNS/PC (Grams)', align: 'right',
    render: (r) => formatNumber(r.net_weight_cns_pc_grams, { decimals: 2 }) },
  { key: 'gross_wastage_length', header: 'Gross Wastage Length', align: 'right',
    render: (r) => formatNumber(r.gross_wastage_length, { decimals: 2, suffix: '%' }) },
  { key: 'gross_wastage_width', header: 'Gross Wastage Width', align: 'right',
    render: (r) => formatNumber(r.gross_wastage_width, { decimals: 2, suffix: '%' }) },
  { key: 'gross_length_pc_cns', header: 'Gross Length CNS/PC', align: 'right',
    render: (r) => formatNumber(grossLengthPc(r)) },
  { key: 'gross_width_cns_pc', header: 'Gross Width CNS/PC', align: 'right',
    render: (r) => formatNumber(grossWidthPc(r)) },
  { key: 'gross_weight_cns_pc_grams', header: 'Gross Weight CNS/PC (Grams)', align: 'right',
    render: (r) => formatNumber(r.gross_weight_cns_pc_grams, { decimals: 2 }) },
  { key: 'purchase_width', header: 'Purchase Width', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_width" ctx={ctx} /> },
  { key: 'unit', header: 'Unit', align: 'left',
    render: (r) => r.unit || '-' },
  { key: 'gross_length_cns', header: 'Gross Length CNS', align: 'right',
    render: (r) => formatNumber(r.gross_length_cns) },
  { key: 'gross_weight_cns', header: 'Gross Weight CNS', align: 'right',
    render: (r) => formatNumber(r.gross_weight_cns, { decimals: 2 }) },
  { key: 'purchase_weight_qty', header: 'Purchase Weight QTY', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_weight_qty" ctx={ctx} /> },
  { key: 'gross_width_multiple', header: 'Gross Width Multiple', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="gross_width_multiple" ctx={ctx} /> },
  { key: 'balance_gross_width_wastage', header: 'Balance Gross Width Wastage', align: 'right',
    render: (r) => formatNumber(r.balance_gross_width_wastage, { decimals: 2 }) },
  { key: 'balance_gross_width_wastage_pct', header: 'Balance Gross Width Wastage %', align: 'right',
    render: (r) => formatNumber(r.balance_gross_width_wastage_pct, { decimals: 2, suffix: '%' }) },
];

const FOAM_COLUMNS = [
  { key: 'material_description', header: 'Material Description', align: 'left',
    render: (r) => r.material_description || '-' },
  { key: 'overage_qty', header: 'Overage QTY', align: 'right',
    render: (r) => formatNumber(r.overage_qty, { decimals: 2 }) },
  { key: 'gsm', header: 'GSM', align: 'right',
    render: (r) => formatNumber(r.gsm, { decimals: 2 }) },
  { key: 'net_length_cns_pc', header: 'Net Length CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_length_cns_pc) },
  { key: 'net_width_cns_pc', header: 'Net Width CNS/PC', align: 'right',
    render: (r) => formatNumber(r.net_width_cns_pc) },
  { key: 'net_weight_cns_pc_grams', header: 'Net Weight CNS/PC (Grams)', align: 'right',
    render: (r) => formatNumber(r.net_weight_cns_pc_grams, { decimals: 2 }) },
  { key: 'gross_wastage_length', header: 'Gross Wastage Length', align: 'right',
    render: (r) => formatNumber(r.gross_wastage_length, { decimals: 2, suffix: '%' }) },
  { key: 'gross_wastage_width', header: 'Gross Wastage Width', align: 'right',
    render: (r) => formatNumber(r.gross_wastage_width, { decimals: 2, suffix: '%' }) },
  { key: 'gross_length_pc_cns', header: 'Gross Length CNS/PC', align: 'right',
    render: (r) => formatNumber(grossLengthPc(r)) },
  { key: 'gross_width_cns_pc', header: 'Gross Width CNS/PC', align: 'right',
    render: (r) => formatNumber(grossWidthPc(r)) },
  { key: 'gross_weight_cns_pc_grams', header: 'Gross Weight CNS/PC (Grams)', align: 'right',
    render: (r) => formatNumber(r.gross_weight_cns_pc_grams, { decimals: 2 }) },
  { key: 'purchase_width', header: 'Purchase Width', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_width" ctx={ctx} /> },
  { key: 'unit', header: 'Unit', align: 'left',
    render: (r) => r.unit || '-' },
  { key: 'gross_length_cns', header: 'Gross Length CNS', align: 'right',
    render: (r) => formatNumber(r.gross_length_cns) },
  { key: 'gross_weight_cns', header: 'Gross Weight CNS', align: 'right',
    render: (r) => formatNumber(r.gross_weight_cns, { decimals: 2 }) },
  { key: 'purchase_weight_qty', header: 'Purchase Weight QTY', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="purchase_weight_qty" ctx={ctx} /> },
  { key: 'gross_width_multiple', header: 'Gross Width Multiple', align: 'right',
    render: (r, ctx) => <ManualNumberCell rowId={r.id} field="gross_width_multiple" ctx={ctx} /> },
  { key: 'balance_gross_width_wastage', header: 'Balance Gross Width Wastage', align: 'right',
    render: (r) => formatNumber(r.balance_gross_width_wastage, { decimals: 2 }) },
  { key: 'balance_gross_width_wastage_pct', header: 'Balance Gross Width Wastage %', align: 'right',
    render: (r) => formatNumber(r.balance_gross_width_wastage_pct, { decimals: 2, suffix: '%' }) },
];

const SUBTAB_CONFIG = {
  yarn:   { columns: YARN_COLUMNS,   showSrNumber: false, ipcAfterSelect: false },
  fabric: { columns: FABRIC_COLUMNS, showSrNumber: false, ipcAfterSelect: false },
  trim:   { columns: TRIM_COLUMNS,   showSrNumber: true,  ipcAfterSelect: true  },
  fiber:  { columns: FIBER_COLUMNS,  showSrNumber: true,  ipcAfterSelect: true  },
  foam:   { columns: FOAM_COLUMNS,   showSrNumber: true,  ipcAfterSelect: true  },
};

const IPOMasterCNS = ({ ipo }) => {
  const [activeTab, setActiveTab] = useState('raw_material');
  const [rawSubtab, setRawSubtab] = useState('fabric');
  // Clubs: array of { id, rowIds: [string], label: 'Club N' }
  const [clubs, setClubs] = useState([]);
  // Which clubs are currently checked (by club.id)
  const [selectedClubs, setSelectedClubs] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});
  const [manualInputs, setManualInputs] = useState({});
  const setManualInput = (rowId, field, value) => {
    setManualInputs((prev) => ({
      ...prev,
      [rowId]: { ...(prev[rowId] || {}), [field]: value },
    }));
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getIPOMasterCNS(ipo.ipoId || ipo.id);
        if (!cancelled) {
          setData(response);
          const seed = {};
          const seedFields = [
            'purchase_width',
            'purchase_length_qty',
            'gross_width_multiple',
            'purchase_qty_pcs',
            'purchase_weight_qty',
          ];
          (response?.raw_material || []).forEach((r) => {
            const entry = {};
            seedFields.forEach((f) => {
              if (r[f] !== null && r[f] !== undefined) {
                entry[f] = String(r[f]);
              }
            });
            if (Object.keys(entry).length) seed[r.id] = entry;
          });
          setManualInputs(seed);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load IPO Master CNS.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (ipo?.ipoId || ipo?.id) run();
    return () => { cancelled = true; };
  }, [ipo?.ipoId, ipo?.id]);

  const rows = useMemo(() => {
    const all = data ? data[activeTab] || [] : [];
    if (activeTab !== 'raw_material') return all;
    const sub = RAW_SUBTABS.find((s) => s.key === rawSubtab);
    if (!sub) return all;
    return all.filter((r) => sub.matches(String(r.material_type || '')));
  }, [data, activeTab, rawSubtab]);

  const subtabConfig = SUBTAB_CONFIG[rawSubtab] || SUBTAB_CONFIG.yarn;
  const columns = subtabConfig.columns;
  const { showSrNumber, ipcAfterSelect } = subtabConfig;
  const totalCols = columns.length + 5 + (showSrNumber ? 1 : 0);

  const clubbedIdSet = useMemo(() => {
    const s = new Set();
    clubs.forEach((c) => c.rowIds.forEach((id) => s.add(id)));
    return s;
  }, [clubs]);

  // Rows not in any club — these keep the default IPC grouping.
  const unclubbedRows = useMemo(
    () => rows.filter((r) => !clubbedIdSet.has(r.id)),
    [rows, clubbedIdSet]
  );

  // Compute rowSpan groupings: consecutive rows sharing the same IPC are clubbed
  // under one IPC cell. Rows are already sorted by IPC then component on the backend.
  const groupedRows = useMemo(() => {
    const result = [];
    let currentIpc = null;
    unclubbedRows.forEach((row, idx) => {
      const isFirst = row.ipc !== currentIpc;
      if (isFirst) {
        currentIpc = row.ipc;
        let span = 1;
        for (let j = idx + 1; j < unclubbedRows.length && unclubbedRows[j].ipc === currentIpc; j += 1) {
          span += 1;
        }
        result.push({ ...row, _ipcRowSpan: span, _firstOfIpc: true });
      } else {
        result.push({ ...row, _ipcRowSpan: 0, _firstOfIpc: false });
      }
    });
    for (let i = 0; i < result.length; i += 1) {
      const next = result[i + 1];
      result[i]._lastOfIpc = !next || next._firstOfIpc;
    }
    return result;
  }, [unclubbedRows]);

  // Hydrate clubs for the active view: resolve ids back to row objects
  // (skipping rows that are filtered out by the current tab/subtab).
  const activeClubs = useMemo(() => {
    const byId = new Map(rows.map((r) => [r.id, r]));
    return clubs
      .map((c) => ({
        ...c,
        resolvedRows: c.rowIds.map((id) => byId.get(id)).filter(Boolean),
      }))
      .filter((c) => c.resolvedRows.length > 0);
  }, [clubs, rows]);

  const serialMap = useMemo(() => {
    const m = new Map();
    let n = 1;
    activeClubs.forEach((c) => c.resolvedRows.forEach((r) => { m.set(r.id, n); n += 1; }));
    groupedRows.forEach((r) => { m.set(r.id, n); n += 1; });
    return m;
  }, [activeClubs, groupedRows]);

  const isComplete = !!data?.is_complete;
  const totalRows = useMemo(
    () => (data ? ['raw_material', 'artwork_labeling', 'packaging'].reduce((n, k) => n + (data[k]?.length || 0), 0) : 0),
    [data]
  );

  const normalizeDesc = (d) => String(d || '').trim().toLowerCase();

  // Any material_description present among currently selected rows in the active view.
  // While non-empty, only rows matching one of these descriptions may be selected.
  const lockedDescriptions = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => {
      if (selected[r.id]) set.add(normalizeDesc(r.material_description));
    });
    return set;
  }, [rows, selected]);

  const isRowDisabled = (row) => {
    if (lockedDescriptions.size === 0) return false;
    return !lockedDescriptions.has(normalizeDesc(row.material_description));
  };

  const toggleRow = (id) => {
    const row = rows.find((r) => r.id === id);
    if (row && isRowDisabled(row) && !selected[id]) return;
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = useMemo(
    () => rows.reduce((n, r) => n + (selected[r.id] ? 1 : 0), 0),
    [rows, selected]
  );
  const showClub = selectedCount >= 2;

  const handleClub = () => {
    const pickedIds = rows.filter((r) => selected[r.id]).map((r) => r.id);
    if (pickedIds.length < 2) return;
    setClubs((prev) => [
      ...prev,
      {
        id: `club-${Date.now()}`,
        rowIds: pickedIds,
        label: `Club ${prev.length + 1}`,
      },
    ]);
    // Clear selections on clubbed rows
    setSelected((prev) => {
      const next = { ...prev };
      pickedIds.forEach((id) => { delete next[id]; });
      return next;
    });
  };

  const toggleClub = (clubId) => {
    setSelectedClubs((prev) => ({ ...prev, [clubId]: !prev[clubId] }));
  };

  const selectedClubCount = useMemo(
    () => Object.values(selectedClubs).filter(Boolean).length,
    [selectedClubs]
  );
  const showUnclub = selectedClubCount >= 1;

  const handleUnclub = () => {
    const toRemove = new Set(
      Object.entries(selectedClubs).filter(([, v]) => v).map(([k]) => k)
    );
    if (toRemove.size === 0) return;
    setClubs((prev) =>
      prev
        .filter((c) => !toRemove.has(c.id))
        .map((c, i) => ({ ...c, label: `Club ${i + 1}` }))
    );
    setSelectedClubs((prev) => {
      const next = { ...prev };
      toRemove.forEach((id) => { delete next[id]; });
      return next;
    });
  };

  const [savingKey, setSavingKey] = useState(null);
  const [saveError, setSaveError] = useState('');

  const buildSavePayload = (rowIds) => rowIds.map((id) => {
    const entry = manualInputs[id] || {};
    const payload = { id };
    const writable = [
      'purchase_width',
      'purchase_length_qty',
      'gross_width_multiple',
      'purchase_qty_pcs',
      'purchase_weight_qty',
    ];
    writable.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(entry, field)) {
        const v = entry[field];
        payload[field] = v === '' ? null : v;
      }
    });
    return payload;
  });

  const handleSaveRow = async (saveCtx) => {
    const ipoId = ipo?.ipoId || ipo?.id;
    if (!ipoId) return;
    let rowIds = [];
    let key = '';
    if (saveCtx?.type === 'row') {
      rowIds = [saveCtx.rowId];
      key = `row:${saveCtx.rowId}`;
    } else if (saveCtx?.type === 'club') {
      const club = clubs.find((c) => c.id === saveCtx.clubId);
      rowIds = club?.rowIds || [];
      key = `club:${saveCtx.clubId}`;
    }
    if (!rowIds.length) return;
    setSavingKey(key);
    setSaveError('');
    try {
      await saveIPOMasterCNSRows(ipoId, buildSavePayload(rowIds));
    } catch (e) {
      setSaveError(e?.message || 'Failed to save.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleSendToPurchase = (ctx) => { console.log('SEND TO PURCHASE', ctx); };

  const actionBtnStyle = {
    background: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: 4,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };


  if (loading) {
    return <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: 24 }}>Loading…</FormCard>;
  }
  if (error) {
    return <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: 24, color: 'crimson' }}>{error}</FormCard>;
  }

  return (
    <div>
      <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
        {TABS.map((t) => (
          <Button
            key={t.key}
            type="button"
            variant={activeTab === t.key ? 'default' : 'outline'}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {activeTab === 'raw_material' && (
        <div
          style={{
            position: 'relative',
            marginLeft: 16,
            marginBottom: 12,
            paddingLeft: 16,
            borderLeft: '2px solid #f97316',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -2,
              top: -12,
              width: 16,
              height: 12,
              borderLeft: '2px solid #f97316',
              borderBottom: '2px solid #f97316',
              borderBottomLeftRadius: 8,
            }}
            aria-hidden="true"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 }}>
              Category
            </span>
            {RAW_SUBTABS.map((s) => {
              const active = rawSubtab === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setRawSubtab(s.key)}
                  style={{
                    background: active ? '#f97316' : '#ffffff',
                    color: active ? '#ffffff' : '#374151',
                    border: active ? '1px solid #f97316' : '1px solid #e5e7eb',
                    borderRadius: 6,
                    padding: '3px 10px',
                    fontSize: 12,
                    lineHeight: 1.4,
                    cursor: 'pointer',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'artwork_labeling' || activeTab === 'packaging' ? (
        <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#6b7280' }}>In Progress</div>
        </FormCard>
      ) : activeTab === 'raw_material' && !SUBTAB_CONFIG[rawSubtab] ? (
        <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#6b7280' }}>In Progress</div>
        </FormCard>
      ) : totalRows === 0 ? (
        <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: 24 }}>
          <div>
            No IPC data has been saved for IPO <strong>{data?.ipo_code}</strong> yet.
            Open <strong>IPO</strong> from the sidebar tree, complete the wizard, and the rows will appear here.
          </div>
          {data?.diagnostics && (
            <details style={{ marginTop: 12, fontSize: 12, color: '#374151' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Diagnostics</summary>
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8, background: '#f9fafb', padding: 8, borderRadius: 6 }}>
                {JSON.stringify(data.diagnostics, null, 2)}
              </pre>
            </details>
          )}
        </FormCard>
      ) : (
        <>
          {!isComplete && (
            <FormCard
              className="rounded-2xl"
              style={{
                padding: 12,
                marginBottom: 12,
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                color: '#78350f',
                fontSize: 13,
              }}
            >
              Some IPCs for <strong>{data?.ipo_code}</strong> are still in draft. The table below shows data entered so far; values will update as the remaining IPCs are completed.
            </FormCard>
          )}
          {saveError && (
            <FormCard
              className="rounded-2xl"
              style={{
                padding: 12,
                marginBottom: 12,
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                fontSize: 13,
              }}
            >
              {saveError}
            </FormCard>
          )}
          <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={handleClub}
            aria-hidden={!showClub}
            tabIndex={showClub ? 0 : -1}
            style={{
              position: 'absolute',
              top: 0,
              right: 24,
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px 10px 0 0',
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
              boxShadow: showClub ? '0 -4px 10px rgba(249,115,22,0.25)' : 'none',
              cursor: 'pointer',
              transform: showClub ? 'translateY(-100%)' : 'translateY(0)',
              transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease 180ms',
              zIndex: 0,
              pointerEvents: showClub ? 'auto' : 'none',
            }}
          >
            CLUB ({selectedCount})
          </button>
          <button
            type="button"
            onClick={handleUnclub}
            aria-hidden={!showUnclub}
            tabIndex={showUnclub ? 0 : -1}
            style={{
              position: 'absolute',
              top: 0,
              right: 24,
              background: '#475569',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px 10px 0 0',
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
              boxShadow: showUnclub ? '0 -4px 10px rgba(71,85,105,0.3)' : 'none',
              cursor: 'pointer',
              transform: showUnclub ? 'translateY(-100%)' : 'translateY(0)',
              transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease 180ms',
              zIndex: 0,
              pointerEvents: showUnclub ? 'auto' : 'none',
            }}
          >
            UNCLUB ({selectedClubCount})
          </button>
          <FormCard
            className="rounded-2xl border-border bg-card"
            style={{
              padding: 16,
              overflowX: 'auto',
              position: 'relative',
              zIndex: 1,
              background: '#ffffff',
            }}
          >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                {showSrNumber && (
                  <th style={{ padding: '8px', textAlign: 'center' }}>SR#</th>
                )}
                {!ipcAfterSelect && <th style={{ padding: '8px' }}>IPC#</th>}
                <th style={{ padding: '8px', textAlign: 'center' }}>Select</th>
                {ipcAfterSelect && <th style={{ padding: '8px' }}>IPC#</th>}
                {columns.map((c) => (
                  <th
                    key={c.key}
                    style={{ padding: '8px', textAlign: c.align === 'left' ? 'left' : c.align, whiteSpace: 'nowrap' }}
                  >
                    {c.header}
                  </th>
                ))}
                <th style={{ padding: '8px', textAlign: 'center' }}>Club / Single</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>Save</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>Send to Purchase</th>
              </tr>
            </thead>
            <tbody>
              {activeClubs.map((club) => {
                const uniqueIpcs = Array.from(new Set(club.resolvedRows.map((r) => r.ipc)));
                return (
                  <React.Fragment key={club.id}>
                    {club.resolvedRows.map((row, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === club.resolvedRows.length - 1;
                      const cellBase = {
                        padding: '8px',
                        borderBottom: isLast ? '2px solid #f97316' : '1px solid #fde2c3',
                        background: '#fff7ed',
                      };
                      const ipcCell = isFirst && (
                        <td
                          rowSpan={club.resolvedRows.length}
                          style={{
                            padding: '8px',
                            fontWeight: 600,
                            verticalAlign: 'middle',
                            textAlign: 'center',
                            background: '#ffedd5',
                            borderRight: '1px solid #fdba74',
                            borderBottom: '2px solid #f97316',
                            borderTop: '2px solid #f97316',
                          }}
                        >
                          {uniqueIpcs.map((ipc) => (
                            <div key={ipc} style={{ lineHeight: 1.4 }}>{ipc}</div>
                          ))}
                          <div
                            style={{
                              marginTop: 6,
                              paddingTop: 6,
                              borderTop: '1px dashed #f97316',
                              fontSize: 11,
                              fontWeight: 700,
                              color: '#9a3412',
                              letterSpacing: 0.5,
                            }}
                          >
                            ({club.label})
                          </div>
                        </td>
                      );
                      const selectCell = isFirst && (
                        <td
                          rowSpan={club.resolvedRows.length}
                          style={{
                            padding: '8px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            background: '#ffedd5',
                            borderBottom: '2px solid #f97316',
                            borderTop: '2px solid #f97316',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedClubs[club.id]}
                            onChange={() => toggleClub(club.id)}
                            aria-label={`Select ${club.label}`}
                          />
                        </td>
                      );
                      return (
                        <tr key={row.id}>
                          {showSrNumber && (
                            <td style={{ ...cellBase, textAlign: 'center', fontWeight: 600 }}>
                              {serialMap.get(row.id) ?? ''}
                            </td>
                          )}
                          {!ipcAfterSelect && ipcCell}
                          {selectCell}
                          {ipcAfterSelect && ipcCell}
                          {(() => {
                            const ctx = {
                              isClub: true,
                              clubRows: club.resolvedRows,
                              manualInputs,
                              setManualInput,
                            };
                            return columns.map((c) => {
                              if (c.aggregatedInClub) {
                                if (!isFirst) return null;
                                return (
                                  <td
                                    key={c.key}
                                    rowSpan={club.resolvedRows.length}
                                    style={{
                                      ...cellBase,
                                      textAlign: c.align === 'left' ? undefined : c.align,
                                      verticalAlign: 'middle',
                                      background: '#ffedd5',
                                      borderTop: '2px solid #f97316',
                                      borderBottom: '2px solid #f97316',
                                    }}
                                  >
                                    {c.render(row, ctx)}
                                  </td>
                                );
                              }
                              return (
                                <td
                                  key={c.key}
                                  style={{ ...cellBase, textAlign: c.align === 'left' ? undefined : c.align }}
                                >
                                  {c.render(row, ctx)}
                                </td>
                              );
                            });
                          })()}
                          {isFirst && (
                            <>
                              <td
                                rowSpan={club.resolvedRows.length}
                                style={{
                                  padding: '8px',
                                  textAlign: 'center',
                                  verticalAlign: 'middle',
                                  background: '#ffedd5',
                                  borderTop: '2px solid #f97316',
                                  borderBottom: '2px solid #f97316',
                                }}
                              >
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '2px 10px',
                                    borderRadius: 999,
                                    background: '#f97316',
                                    color: '#ffffff',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                  }}
                                >
                                  CLUB
                                </span>
                              </td>
                              <td
                                rowSpan={club.resolvedRows.length}
                                style={{
                                  padding: '6px 4px',
                                  textAlign: 'center',
                                  verticalAlign: 'middle',
                                  background: '#fff7ed',
                                  borderTop: '2px solid #f97316',
                                  borderBottom: '2px solid #f97316',
                                }}
                              >
                                <button
                                  type="button"
                                  style={{ ...actionBtnStyle, opacity: savingKey === `club:${club.id}` ? 0.6 : 1 }}
                                  disabled={savingKey === `club:${club.id}`}
                                  onClick={() => handleSaveRow({ type: 'club', clubId: club.id })}
                                >
                                  {savingKey === `club:${club.id}` ? 'SAVING…' : 'SAVE'}
                                </button>
                              </td>
                              <td
                                rowSpan={club.resolvedRows.length}
                                style={{
                                  padding: '6px 4px',
                                  textAlign: 'center',
                                  verticalAlign: 'middle',
                                  background: '#fff7ed',
                                  borderTop: '2px solid #f97316',
                                  borderBottom: '2px solid #f97316',
                                }}
                              >
                                <button
                                  type="button"
                                  style={actionBtnStyle}
                                  onClick={() => handleSendToPurchase({ type: 'club', clubId: club.id })}
                                >
                                  SEND TO PURCHASE
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}

              {groupedRows.length === 0 && activeClubs.length === 0 ? (
                <tr>
                  <td colSpan={totalCols} style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>
                    No rows in this category.
                  </td>
                </tr>
              ) : groupedRows.map((row) => {
                const divider = row._lastOfIpc ? '2px solid #9ca3af' : '1px solid #f1f5f9';
                const disabled = isRowDisabled(row);
                const cellBase = {
                  padding: '8px',
                  borderBottom: divider,
                  color: disabled ? '#9ca3af' : undefined,
                  background: disabled ? '#f9fafb' : undefined,
                };
                const ipcCell = row._firstOfIpc && (
                  <td
                    rowSpan={row._ipcRowSpan}
                    style={{
                      padding: '8px',
                      fontWeight: 600,
                      verticalAlign: 'middle',
                      textAlign: 'center',
                      background: '#f9fafb',
                      borderRight: '1px solid #e5e7eb',
                      borderBottom: '2px solid #9ca3af',
                    }}
                  >
                    {row.ipc}
                  </td>
                );
                const selectCell = (
                  <td style={{ ...cellBase, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!selected[row.id]}
                      disabled={disabled}
                      onChange={() => toggleRow(row.id)}
                      style={disabled ? { cursor: 'not-allowed', opacity: 0.5 } : undefined}
                    />
                  </td>
                );
                return (
                  <tr key={row.id}>
                    {showSrNumber && (
                      <td style={{ ...cellBase, textAlign: 'center', fontWeight: 600 }}>
                        {serialMap.get(row.id) ?? ''}
                      </td>
                    )}
                    {!ipcAfterSelect && ipcCell}
                    {selectCell}
                    {ipcAfterSelect && ipcCell}
                    {(() => {
                      const ctx = {
                        isClub: false,
                        clubRows: [row],
                        manualInputs,
                        setManualInput,
                      };
                      return columns.map((c) => (
                        <td
                          key={c.key}
                          style={{ ...cellBase, textAlign: c.align === 'left' ? undefined : c.align }}
                        >
                          {c.render(row, ctx)}
                        </td>
                      ));
                    })()}
                    <td style={{ ...cellBase, textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 999,
                          background: '#e5e7eb',
                          color: '#374151',
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.5,
                        }}
                      >
                        SINGLE
                      </span>
                    </td>
                    <td style={{ ...cellBase, padding: '6px 4px', textAlign: 'center' }}>
                      <button
                        type="button"
                        style={{ ...actionBtnStyle, opacity: savingKey === `row:${row.id}` ? 0.6 : 1 }}
                        disabled={savingKey === `row:${row.id}`}
                        onClick={() => handleSaveRow({ type: 'row', rowId: row.id })}
                      >
                        {savingKey === `row:${row.id}` ? 'SAVING…' : 'SAVE'}
                      </button>
                    </td>
                    <td style={{ ...cellBase, padding: '6px 4px', textAlign: 'center' }}>
                      <button
                        type="button"
                        style={actionBtnStyle}
                        onClick={() => handleSendToPurchase({ type: 'row', rowId: row.id })}
                      >
                        SEND TO PURCHASE
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </FormCard>
          </div>
        </>
      )}
    </div>
  );
};

export default IPOMasterCNS;
