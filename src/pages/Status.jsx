import { useEffect, useState, useCallback } from 'react';
import './Status.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://binder-os.com/api/';

const STATUS_LABEL = {
  operational: 'Operational',
  degraded: 'Degraded performance',
  major_outage: 'Major outage',
  maintenance: 'Under maintenance',
  unknown: 'Status unknown',
};

const STATUS_BANNER = {
  operational: 'All systems operational',
  degraded: 'Some systems are experiencing issues',
  major_outage: 'Major service disruption',
  maintenance: 'Scheduled maintenance in progress',
  unknown: 'Unable to fetch status',
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

const Status = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE.replace(/\/$/, '')}/status/`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Backend responded ${res.status}`);
      const body = await res.json();
      setData(body);
    } catch (err) {
      setError(err.message || 'Unable to reach backend');
      setData(null);
    } finally {
      setLastChecked(new Date());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 30000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  // Frontend is necessarily operational if this page rendered.
  const frontendComponent = {
    name: 'Frontend (binder-os.com)',
    status: 'operational',
    description: 'Web client served and rendering',
  };

  let overall;
  let components;
  if (error) {
    overall = 'major_outage';
    components = [
      frontendComponent,
      {
        name: 'Backend API',
        status: 'major_outage',
        description: error,
      },
    ];
  } else if (data) {
    overall = data.overall_status || 'unknown';
    components = [frontendComponent, ...(data.components || [])];
  } else {
    overall = 'unknown';
    components = [frontendComponent];
  }

  return (
    <div className={`status-page status-${overall}`}>
      <header className="status-header">
        <h1>Binder OS Status</h1>
        <p className="status-subtitle">
          Live operational status for binder-os.com
        </p>
      </header>

      <div className={`status-banner banner-${overall}`}>
        <span className="status-dot" aria-hidden="true" />
        <span className="banner-text">{STATUS_BANNER[overall] || STATUS_BANNER.unknown}</span>
      </div>

      <section className="status-section">
        <h2>Components</h2>
        <ul className="component-list">
          {components.map((c) => (
            <li key={c.name} className={`component component-${c.status}`}>
              <div className="component-main">
                <span className="component-name">{c.name}</span>
                <span className={`component-pill pill-${c.status}`}>
                  {STATUS_LABEL[c.status] || c.status}
                </span>
              </div>
              {c.description && (
                <div className="component-description">{c.description}</div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="status-section">
        <h2>Deployment</h2>
        <dl className="meta-grid">
          <div>
            <dt>Version</dt>
            <dd>{data?.version || '—'}</dd>
          </div>
          <div>
            <dt>Last deployed</dt>
            <dd>{formatDate(data?.deployed_at)}</dd>
          </div>
          <div>
            <dt>Maintenance mode</dt>
            <dd>{data?.maintenance ? 'Active' : 'Off'}</dd>
          </div>
          <div>
            <dt>Last checked</dt>
            <dd>{lastChecked ? lastChecked.toLocaleTimeString() : '—'}</dd>
          </div>
        </dl>
      </section>

      <div className="status-actions">
        <button
          type="button"
          className="refresh-btn"
          onClick={fetchStatus}
          disabled={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh now'}
        </button>
        <span className="auto-refresh-note">Auto-refreshes every 30s</span>
      </div>

      <footer className="status-footer">
        <p>
          For incidents or support, contact{' '}
          <a href="mailto:support@binder-os.com">support@binder-os.com</a>.
        </p>
      </footer>
    </div>
  );
};

export default Status;
