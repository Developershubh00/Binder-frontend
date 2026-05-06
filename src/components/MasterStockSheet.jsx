import { useEffect, useState } from 'react';
import { getStockSheets } from '../services/integration';
import { useLoading } from '../context/LoadingContext';
import './InwardStoreSheet.css';
import './StockSheet.css';

const CATEGORY_LABELS = {
  YARN: 'Yarn',
  FABRIC: 'Fabric',
  FIBER: 'Fiber',
  FOAM: 'Foam',
  TRIMS_ACCESSORY: 'Trims & Accessory',
  ARTWORK_LABELLING: 'Artwork & Labelling',
  PACKAGING: 'Packaging',
  COMPANY_ESSENTIALS: 'Company Essentials',
};

const IPO_TYPE_LABELS = {
  PRODUCTION: 'Production',
  SAMPLING: 'Sampling',
  COMPANY: 'Company',
  COMPANY_ESSENTIALS: 'Company Essentials',
};

const MasterStockSheet = ({ onBack, onOpenForm }) => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const { showLoading, hideLoading } = useLoading();

  const loadSheets = async () => {
    setLoading(true);
    showLoading();
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      const data = await getStockSheets(params);
      const results = data?.results || data || [];
      setSheets(Array.isArray(results) ? results : []);
    } catch {
      setSheets([]);
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  useEffect(() => { loadSheets(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadSheets();
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatNumber = (val) => {
    const n = parseFloat(val);
    if (!Number.isFinite(n)) return '0.00';
    return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
  };

  return (
    <div className="iss-container">
      <div className="iss-header">
        <button className="iss-back-button" onClick={onBack}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="iss-title" style={{ marginBottom: 4 }}>Master Stock Sheet</h1>
            <p className="iss-description" style={{ marginBottom: 0 }}>All saved stock sheet entries</p>
          </div>
          <button className="iss-btn iss-btn-primary" onClick={onOpenForm}>+ Add Stock Items</button>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24, maxWidth: 500 }}>
        <input
          className="iss-form-input"
          type="text"
          placeholder="Search by IPC / IPO code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="iss-btn iss-btn-secondary">Search</button>
      </form>

      {loading ? (
        <p style={{ color: 'var(--muted-foreground)', padding: 24 }}>Loading…</p>
      ) : sheets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted-foreground)' }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>No stock sheets yet.</p>
          <button className="iss-btn iss-btn-primary" onClick={onOpenForm}>Create your first one</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sheets.map((sheet) => {
            const isExpanded = expandedId === sheet.id;
            return (
              <div
                key={sheet.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--background)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : sheet.id)}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr 1fr auto',
                    gap: 16,
                    padding: '14px 18px',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{sheet.ipc_code_display || '—'}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                      {sheet.ipo_code_display || '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>IPO Type</div>
                    <div>{IPO_TYPE_LABELS[sheet.ipo_type] || sheet.ipo_type}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Category</div>
                    <div>{CATEGORY_LABELS[sheet.category] || sheet.category}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}># Pkgs</div>
                    <div>{sheet.num_packages}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Total Qty</div>
                    <div>{formatNumber(sheet.total_qty)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Amount</div>
                    <div>{formatNumber(sheet.amount)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{formatDate(sheet.created_at)}</div>
                </button>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '16px 18px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Rate</div>
                        <div>{formatNumber(sheet.rate)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Yarn Sub-Category</div>
                        <div>{sheet.yarn_sub_category || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Source</div>
                        <div>{sheet.source}</div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="ss-section" style={{ marginTop: 0 }}>
                      <h3 className="ss-section-title">Items ({sheet.items?.length || 0})</h3>
                      {(sheet.items || []).length === 0 ? (
                        <p className="ss-muted">No items</p>
                      ) : (
                        <div className="ss-table-wrap">
                          <table className="ss-table">
                            <thead>
                              <tr>
                                <th style={{ width: 70 }}>Sr.</th>
                                {(sheet.item_columns || []).map((col) => (
                                  <th key={col.key}>{col.label}</th>
                                ))}
                                {(!sheet.item_columns || sheet.item_columns.length === 0) && (
                                  <>
                                    <th>Material Description</th>
                                    <th style={{ width: 100 }}>Unit</th>
                                  </>
                                )}
                                <th style={{ width: 140 }}>Image</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sheet.items.map((it) => (
                                <tr key={it.id}>
                                  <td>{it.sr_no}</td>
                                  {(sheet.item_columns || []).map((col) => (
                                    <td key={col.key}>
                                      {it.details && it.details[col.key] !== undefined && it.details[col.key] !== ''
                                        ? String(it.details[col.key])
                                        : '—'}
                                    </td>
                                  ))}
                                  {(!sheet.item_columns || sheet.item_columns.length === 0) && (
                                    <>
                                      <td>{it.material_description || '—'}</td>
                                      <td>{it.unit || '—'}</td>
                                    </>
                                  )}
                                  <td>
                                    {it.image_url ? (
                                      <a href={it.image_url} target="_blank" rel="noreferrer">
                                        <img src={it.image_url} alt="item" className="ss-thumb" />
                                      </a>
                                    ) : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Packages */}
                    <div className="ss-section" style={{ marginTop: 16 }}>
                      <h3 className="ss-section-title">Packages ({sheet.packages?.length || 0})</h3>
                      {(sheet.packages || []).length === 0 ? (
                        <p className="ss-muted">No packages</p>
                      ) : (
                        <div className="ss-table-wrap">
                          <table className="ss-table">
                            <thead>
                              <tr>
                                <th style={{ width: 100 }}>Package #</th>
                                <th>QTY</th>
                                <th style={{ width: 140 }}>Unit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sheet.packages.map((pkg) => (
                                <tr key={pkg.id}>
                                  <td>{pkg.package_no}</td>
                                  <td>{formatNumber(pkg.qty)}</td>
                                  <td>{pkg.unit || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MasterStockSheet;
