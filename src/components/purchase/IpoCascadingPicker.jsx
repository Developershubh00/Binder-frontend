import { useEffect, useState } from 'react';
import { getPurchaseIpos } from '../../services/integration';

const IPO_TYPES = [
  { key: 'company', label: 'Company' },
  { key: 'production', label: 'Production' },
  { key: 'sampling', label: 'Sampling' },
];

const IpoCascadingPicker = ({ onSelectIpo }) => {
  const [activeType, setActiveType] = useState(null);
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeType) {
      setIpos([]);
      return undefined;
    }
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getPurchaseIpos(activeType);
        if (!cancelled) setIpos(res?.results || []);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load IPOs.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [activeType]);

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* Column 1: IPO Type */}
      <div className="hover-panel">
        <div className="hover-panel-column">
          <div className="hover-panel-title">IPO Type</div>
          {IPO_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`hover-panel-item ${activeType === t.key ? 'active' : ''}`}
              onClick={() => setActiveType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: IPO list */}
      {activeType && (
        <div className="hover-panel nested-panel">
          <div className="hover-panel-column">
            <div className="hover-panel-title">
              {IPO_TYPES.find((t) => t.key === activeType)?.label} IPOs
            </div>
            {loading ? (
              <div className="hover-panel-subitem muted">Loading…</div>
            ) : error ? (
              <div className="hover-panel-subitem muted">{error}</div>
            ) : ipos.length === 0 ? (
              <div className="hover-panel-subitem muted" style={{ lineHeight: 1.5 }}>
                No IPOs shared to Purchase yet. Open an IPO Master CNS screen and click{' '}
                <strong>Share to Purchase</strong> first.
              </div>
            ) : (
              ipos.map((ipo) => (
                <button
                  key={ipo.id}
                  type="button"
                  className="hover-panel-item"
                  onClick={() => onSelectIpo?.(ipo)}
                  title={ipo.program_name}
                >
                  {ipo.ipo_code}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IpoCascadingPicker;
