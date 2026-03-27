import { useEffect, useState } from 'react';
import { getInwardStoreSheets } from '../services/integration';
import './InwardStoreSheet.css';

const InwardStoreSheetDatabase = ({ onBack, onOpenForm }) => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const loadSheets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      const data = await getInwardStoreSheets(params);
      const results = data?.results || data || [];
      setSheets(Array.isArray(results) ? results : []);
    } catch {
      setSheets([]);
    } finally {
      setLoading(false);
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
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const typeLabel = (val) => {
    const map = { CHALLAN_ONLY: 'Challan Only', CHALLAN_CUM_INVOICE: 'Challan Cum Invoice' };
    return map[val] || val;
  };

  const ipoTypeLabel = (val) => {
    const map = { COMPANY: 'Company', PRODUCTION: 'Production', SAMPLING: 'Sampling' };
    return map[val] || val;
  };

  const isChallanOnly = (sheet) => sheet.receivable_type === 'CHALLAN_ONLY';

  return (
    <div className="iss-container">
      <div className="iss-header">
        <button className="iss-back-button" onClick={onBack}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="iss-title" style={{ marginBottom: 4 }}>Inward Store Sheet Database</h1>
            <p className="iss-description" style={{ marginBottom: 0 }}>All saved inward store sheets</p>
          </div>
          <button className="iss-btn iss-btn-primary" onClick={onOpenForm}>+ New Inward Store Sheet</button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24, maxWidth: 500 }}>
        <input
          className="iss-form-input"
          type="text"
          placeholder="Search by UIN, challan no, invoice no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="iss-btn iss-btn-secondary">Search</button>
      </form>

      {loading ? (
        <p style={{ color: 'var(--muted-foreground)', padding: 24 }}>Loading...</p>
      ) : sheets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted-foreground)' }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>No inward store sheets found.</p>
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
                {/* Card header — always visible */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : sheet.id)}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
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
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{sheet.uin_code || '—'}</span>
                  <span>{typeLabel(sheet.receivable_type)}</span>
                  <span>{ipoTypeLabel(sheet.ipo_type)}</span>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>{formatDate(sheet.created_at)}</span>
                  <span style={{ fontSize: 16 }}>{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border)' }}>
                    {/* Meta */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 24px', padding: '16px 0', fontSize: 13 }}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>IPO</span>
                        {sheet.ipo_code_display || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>VPO</span>
                        {sheet.vpo_code_display || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>IPC</span>
                        {sheet.ipc_code_display || '—'}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Vendor Challan No.</span>
                        {sheet.vendor_challan_no || '—'}
                      </div>
                      {!isChallanOnly(sheet) && (
                        <div>
                          <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Vendor Invoice No.</span>
                          {sheet.vendor_invoice_no || '—'}
                        </div>
                      )}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', fontSize: 11, marginBottom: 2 }}>Goods Receiving Condition</span>
                        {sheet.goods_receiving_condition || '—'}
                      </div>
                    </div>

                    {/* Items table */}
                    {sheet.items && sheet.items.length > 0 && (
                      <div className="iss-table-wrapper" style={{ marginTop: 8 }}>
                        <table className="iss-table">
                          <colgroup>
                            <col style={{ width: '4%' }} />
                            <col style={{ width: isChallanOnly(sheet) ? '18%' : '13%' }} />
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '8%' }} />
                            <col style={{ width: '7%' }} />
                            {!isChallanOnly(sheet) && <col style={{ width: '8%' }} />}
                            {!isChallanOnly(sheet) && <col style={{ width: '9%' }} />}
                            <col style={{ width: isChallanOnly(sheet) ? '15%' : '11%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '6%' }} />
                            <col style={{ width: '14%' }} />
                          </colgroup>
                          <thead>
                            <tr>
                              <th>Sr</th>
                              <th>Particulars</th>
                              <th>PO Qty</th>
                              <th>Recd Qty</th>
                              <th>Bal</th>
                              {!isChallanOnly(sheet) && <th>Rate (₹)</th>}
                              {!isChallanOnly(sheet) && <th>Amount (₹)</th>}
                              <th>Remarks</th>
                              <th>Recd Form</th>
                              <th>Pkg</th>
                              <th>USN</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sheet.items.map((item) => (
                              <tr key={item.id}>
                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.sr_no}</td>
                                <td>{item.particulars || '—'}</td>
                                <td>{item.po_quantity}</td>
                                <td>{item.received_quantity}</td>
                                <td>{item.balance}</td>
                                {!isChallanOnly(sheet) && <td>₹{item.rate}</td>}
                                {!isChallanOnly(sheet) && <td>₹{item.amount}</td>}
                                <td>{item.remarks || '—'}</td>
                                <td>{item.received_form || '—'}</td>
                                <td>{item.num_packages}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{item.usn_code || '—'}</td>
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

export default InwardStoreSheetDatabase;
