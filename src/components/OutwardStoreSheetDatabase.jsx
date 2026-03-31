import { useEffect, useState } from 'react';
import { getOutwardStoreSheets } from '../services/integration';
import './InwardStoreSheet.css';

const dispatchTypeLabel = (value) => {
  const map = {
    INTERNAL_CHALLAN: 'Internal Challan',
    EXTERNAL_CHALLAN: 'External Challan',
  };
  return map[value] || value || '—';
};

const ipoTypeLabel = (value) => {
  const map = {
    PRODUCTION: 'Production',
    SAMPLING: 'Sampling',
    COMPANY: 'Company',
    COMPANY_ESSENTIALS: 'Company Essentials',
  };
  return map[value] || value || '—';
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OutwardStoreSheetDatabase = ({ onBack, onOpenForm }) => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const loadSheets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      const data = await getOutwardStoreSheets(params);
      const results = data?.results || data || [];
      setSheets(Array.isArray(results) ? results : []);
    } catch (error) {
      setSheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSheets();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadSheets();
  };

  return (
    <div className="iss-container">
      <div className="iss-header">
        <button className="iss-back-button" onClick={onBack}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="iss-title" style={{ marginBottom: 4 }}>Outward Store Sheet Database</h1>
            <p className="iss-description" style={{ marginBottom: 0 }}>All saved outward store sheets</p>
          </div>
          <button className="iss-btn iss-btn-primary" onClick={onOpenForm}>
            + New Outward Store Sheet
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24, maxWidth: 560 }}>
        <input
          className="iss-form-input"
          type="text"
          placeholder="Search by challan no, vendor, vehicle, contact..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="iss-btn iss-btn-secondary">Search</button>
      </form>

      {loading ? (
        <p style={{ color: 'var(--muted-foreground)', padding: 24 }}>Loading...</p>
      ) : sheets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted-foreground)' }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>No outward store sheets found.</p>
          <button className="iss-btn iss-btn-primary" onClick={onOpenForm}>
            Create your first one
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sheets.map((sheet) => {
            const isExpanded = expandedId === sheet.id;
            const referenceCode = sheet.ipo_type === 'COMPANY_ESSENTIALS'
              ? sheet.company_essential_code_display
              : sheet.ipo_code_display;

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
                    gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr auto',
                    gap: 12,
                    padding: '14px 18px',
                    background: isExpanded ? 'var(--accent)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 13,
                    color: 'var(--foreground)',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{sheet.company_challan_number || '—'}</span>
                  <span>{dispatchTypeLabel(sheet.dispatch_type)}</span>
                  <span>{sheet.dispatch_target_display || '—'}</span>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>{formatDate(sheet.created_at)}</span>
                  <span style={{ fontSize: 16 }}>{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 24px', padding: '16px 0', fontSize: 13 }}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Dispatch / Issued To</span>
                        {sheet.dispatch_target_display || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>IPO Type</span>
                        {ipoTypeLabel(sheet.ipo_type)}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>IPO / Essential</span>
                        {referenceCode || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Address</span>
                        {sheet.dispatch_issued_to_address || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Contact Person</span>
                        {sheet.contact_person || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Contact Number</span>
                        {sheet.contact_number || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Vehicle No.</span>
                        {sheet.vehicle_no || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Vendor</span>
                        {sheet.vendor_code_display ? `${sheet.vendor_code_display} - ${sheet.vendor_name_display || ''}` : '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Department / Section</span>
                        {[sheet.department_name_display, sheet.section_name_display].filter(Boolean).join(' / ') || '—'}
                      </div>
                    </div>

                    {sheet.items && sheet.items.length > 0 && (
                      <div className="iss-table-wrapper" style={{ marginTop: 8 }}>
                        <table className="iss-table">
                          <colgroup>
                            <col style={{ width: '4%' }} />
                            <col style={{ width: '14%' }} />
                            <col style={{ width: '9%' }} />
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '9%' }} />
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '12%' }} />
                          </colgroup>
                          <thead>
                            <tr>
                              <th>Sr</th>
                              <th>Particulars</th>
                              <th>Dispatch Qty</th>
                              <th>Unit</th>
                              <th>Link USN</th>
                              <th>USN Sum</th>
                              <th>Balance</th>
                              <th>Remark</th>
                              <th>Dispatch Form</th>
                              <th>Pkg</th>
                              <th>UQR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sheet.items.map((item) => (
                              <tr key={item.id}>
                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.sr_no}</td>
                                <td>{item.particulars || '—'}</td>
                                <td>{item.dispatch_quantity}</td>
                                <td>{item.unit || '—'}</td>
                                <td>
                                  <div className="oss-db-links">
                                    {item.usn_links?.length ? item.usn_links.map((link) => (
                                      <span key={link.id}>
                                        {link.link_usn || '—'} ({link.usn_quantity})
                                      </span>
                                    )) : '—'}
                                  </div>
                                </td>
                                <td>{item.usn_quantity_sum}</td>
                                <td>
                                  {item.balance}
                                  {Number.parseFloat(item.balance) > 0 && (
                                    <div className="oss-db-carry">{item.carry_forward_code} {item.balance}</div>
                                  )}
                                </td>
                                <td>{item.remark || '—'}</td>
                                <td>{item.dispatch_form || '—'}</td>
                                <td>{item.num_packages}</td>
                                <td>{item.uqr_sent ? 'Sent to verification' : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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

export default OutwardStoreSheetDatabase;
