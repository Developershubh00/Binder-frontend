import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-layout';
import { getIPOMasterCNS } from '../../services/integration';

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

const IPOMasterCNS = ({ ipo }) => {
  const [activeTab, setActiveTab] = useState('raw_material');
  const [rawSubtab, setRawSubtab] = useState('fabric');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getIPOMasterCNS(ipo.ipoId || ipo.id);
        if (!cancelled) setData(response);
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

  // Compute rowSpan groupings: consecutive rows sharing the same IPC are clubbed
  // under one IPC cell. Rows are already sorted by IPC then component on the backend.
  const groupedRows = useMemo(() => {
    const result = [];
    let currentIpc = null;
    rows.forEach((row, idx) => {
      const isFirst = row.ipc !== currentIpc;
      if (isFirst) {
        currentIpc = row.ipc;
        let span = 1;
        for (let j = idx + 1; j < rows.length && rows[j].ipc === currentIpc; j += 1) {
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
  }, [rows]);
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
          <FormCard className="rounded-2xl border-border bg-card" style={{ padding: 16, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '8px' }}>IPC / Component</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Select</th>
                <th style={{ padding: '8px' }}>Material Description</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Net CNS/PC</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Overage QTY PCS</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Gross Wastage</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Gross CNS</th>
                <th style={{ padding: '8px' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {groupedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>
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
                return (
                  <tr key={row.id}>
                    {row._firstOfIpc && (
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
                    )}
                    <td style={{ ...cellBase, textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!selected[row.id]}
                        disabled={disabled}
                        onChange={() => toggleRow(row.id)}
                        style={disabled ? { cursor: 'not-allowed', opacity: 0.5 } : undefined}
                      />
                    </td>
                    <td style={cellBase}>{row.material_description || '-'}</td>
                    <td style={{ ...cellBase, textAlign: 'right' }}>{formatNumber(row.net_cns_pc)}</td>
                    <td style={{ ...cellBase, textAlign: 'right' }}>{formatNumber(row.overage_qty_pcs, { decimals: 2 })}</td>
                    <td style={{ ...cellBase, textAlign: 'right' }}>{formatNumber(row.gross_wastage, { decimals: 2, suffix: '%' })}</td>
                    <td style={{ ...cellBase, textAlign: 'right' }}>{formatNumber(row.gross_cns)}</td>
                    <td style={cellBase}>{row.unit || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </FormCard>
        </>
      )}
    </div>
  );
};

export default IPOMasterCNS;
