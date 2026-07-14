import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/Pagination';
import { getIPOs } from '../services/integration';
import { useLoading } from '../context/LoadingContext';

const PAGE_SIZE = 10;

const COMPLETED_KEY = 'completedIpos';

// Read the set of completed IPO keys (id-or-code) from localStorage. Wrapped
// in a try/catch so corrupted or missing storage doesn't break the page.
const readCompletedKeys = () => {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
};

const extractItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  return [];
};

const normalizeIpo = (ipo) => {
  const id = String(ipo.id || ipo.ipoId || '');
  const code = ipo.ipo_code || ipo.ipoCode || '';
  return {
    // Stable identifier used for completion tracking. Prefer numeric id; fall
    // back to the IPO code if id isn't returned by the API.
    key: id || code,
    id,
    code,
    orderType: ipo.order_type || ipo.orderType || '',
    createdAt: ipo.created_at || ipo.createdAt || '',
  };
};

const IPOMasterSheet = ({ onBack }) => {
  const [ipos, setIpos] = useState([]);
  const [completedKeys, setCompletedKeys] = useState(readCompletedKeys);
  const [pendingKeys, setPendingKeys] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [page, setPage] = useState(1);
  const { showLoading, hideLoading } = useLoading();

  const fetchIpos = useCallback(async () => {
    showLoading();
    try {
      setLoading(true);
      setError(null);
      // "Completed" status lives in localStorage (not the backend), so we
      // fetch the full IPO set (page_size at the server max) and split
      // active/completed on the client. Pagination below is client-side.
      const response = await getIPOs({ page_size: 200 });
      const list = extractItems(response).map(normalizeIpo);
      setIpos(list);
      // Re-sync the completed-keys cache too, in case the Dashboard scrubbed
      // a deleted IPO from it while we were mounted.
      setCompletedKeys(readCompletedKeys());
    } catch (err) {
      console.warn('Failed to load IPOs:', err);
      setError('Failed to load IPOs. Please try again.');
    } finally {
      setLoading(false);
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    fetchIpos();
  }, [fetchIpos]);

  // Refresh when an IPO is deleted from anywhere else in the app
  // (Dashboard dispatches this after a successful deleteIPO call).
  useEffect(() => {
    const handler = () => fetchIpos();
    window.addEventListener('internalPurchaseOrdersUpdated', handler);
    return () => window.removeEventListener('internalPurchaseOrdersUpdated', handler);
  }, [fetchIpos]);

  const togglePending = (key) => {
    setPendingKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = () => {
    if (pendingKeys.size === 0) return;
    const merged = new Set([...completedKeys, ...pendingKeys]);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(Array.from(merged)));
    setCompletedKeys(merged);
    setPendingKeys(new Set());
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  // Active = IPOs that haven't been marked completed yet.
  const activeIpos = useMemo(
    () => ipos.filter((ipo) => !completedKeys.has(ipo.key)),
    [ipos, completedKeys],
  );

  // Client-side pagination over the active list (10 per screen). Clamp the
  // page if the list shrinks (e.g. after saving completions).
  const totalPages = Math.max(1, Math.ceil(activeIpos.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  const pagedIpos = activeIpos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const headerCellStyle = {
    padding: '14px 20px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '13px',
    color: 'var(--foreground)',
  };

  const bodyCellStyle = {
    padding: '14px 20px',
    verticalAlign: 'middle',
    fontSize: '14px',
    color: 'var(--foreground)',
  };

  return (
    <div className="fullscreen-content" style={{ overflowY: 'auto' }}>
      <div className="content-header">
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
          className="mb-6 bg-white"
        >
          ← Back
        </Button>
        <h1 className="fullscreen-title">Master IPO Sheet</h1>
        <p className="fullscreen-description">
          Mark IPOs as completed and save to move them to the Completed IPOs list.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="default"
          onClick={handleSave}
          disabled={pendingKeys.size === 0}
          type="button"
        >
          Save{pendingKeys.size > 0 ? ` (${pendingKeys.size} selected)` : ''}
        </Button>
        <span className="text-sm text-muted-foreground">
          Active IPOs: <strong className="text-foreground">{activeIpos.length}</strong>
        </span>
        {savedFlash && (
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
            ✓ Saved
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted-foreground)' }}>
          Loading IPOs...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--destructive)' }}>
          {error}
        </div>
      ) : activeIpos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted-foreground)' }}>
          No active IPOs. Generate an IPO code to add one to this list.
        </div>
      ) : (
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflowX: 'auto',
            backgroundColor: 'var(--card)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--muted)',
                  borderBottom: '2px solid var(--border)',
                }}
              >
                <th style={headerCellStyle}>IPO CODE</th>
                <th style={{ ...headerCellStyle, textAlign: 'center', width: '200px' }}>
                  MARK AS COMPLETED
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedIpos.map((ipo, index) => (
                <tr
                  key={ipo.key || index}
                  style={{
                    borderBottom: index < pagedIpos.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--muted)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={bodyCellStyle}>{ipo.code || 'N/A'}</td>
                  <td style={{ ...bodyCellStyle, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={pendingKeys.has(ipo.key)}
                      onChange={() => togglePending(ipo.key)}
                      style={{ width: 18, height: 18, cursor: 'pointer' }}
                      aria-label={`Mark ${ipo.code} as completed`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          totalCount={activeIpos.length}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default IPOMasterSheet;
