import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getIPOs } from '../services/integration';
import { useLoading } from '../context/LoadingContext';

const COMPLETED_KEY = 'completedIpos';

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
    key: id || code,
    id,
    code,
    orderType: ipo.order_type || ipo.orderType || '',
    createdAt: ipo.created_at || ipo.createdAt || '',
  };
};

const CompletedIPOs = ({ onBack }) => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showLoading, hideLoading } = useLoading();

  const fetchIpos = useCallback(async () => {
    showLoading();
    try {
      setLoading(true);
      setError(null);
      const completedKeys = readCompletedKeys();
      const response = await getIPOs();
      const list = extractItems(response)
        .map(normalizeIpo)
        .filter((ipo) => completedKeys.has(ipo.key));
      setIpos(list);
    } catch (err) {
      console.warn('Failed to load completed IPOs:', err);
      setError('Failed to load IPOs. Please try again.');
    } finally {
      setLoading(false);
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    fetchIpos();
  }, [fetchIpos]);

  // Refresh when an IPO is deleted from anywhere else in the app — the
  // Dashboard dispatches this event after a successful deleteIPO call,
  // and also scrubs the IPO from the completedIpos localStorage cache.
  useEffect(() => {
    const handler = () => fetchIpos();
    window.addEventListener('internalPurchaseOrdersUpdated', handler);
    return () => window.removeEventListener('internalPurchaseOrdersUpdated', handler);
  }, [fetchIpos]);

  // Wipes the local "completed" list. Those IPOs become active again and
  // will show back up in the Master IPO Sheet on its next mount.
  const handleClearTable = () => {
    if (ipos.length === 0) return;
    const ok = window.confirm(
      `Clear all ${ipos.length} completed IPO${ipos.length === 1 ? '' : 's'}? They will return to the Master IPO Sheet.`
    );
    if (!ok) return;
    localStorage.removeItem(COMPLETED_KEY);
    setIpos([]);
  };

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
        <h1 className="fullscreen-title">Completed IPOs</h1>
        <p className="fullscreen-description">
          All internal purchase orders that have been marked completed.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <span className="text-sm text-muted-foreground">
          Total completed: <strong className="text-foreground">{ipos.length}</strong>
        </span>
        <Button
          variant="outline"
          onClick={handleClearTable}
          disabled={ipos.length === 0}
          type="button"
          className="text-destructive hover:text-destructive"
        >
          Clear table
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted-foreground)' }}>
          Loading completed IPOs...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--destructive)' }}>
          {error}
        </div>
      ) : ipos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted-foreground)' }}>
          No completed IPOs yet. Mark IPOs as completed in the Master IPO Sheet to see them here.
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
              </tr>
            </thead>
            <tbody>
              {ipos.map((ipo, index) => (
                <tr
                  key={ipo.key || index}
                  style={{
                    borderBottom: index < ipos.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <td style={bodyCellStyle}>{ipo.code || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedIPOs;
