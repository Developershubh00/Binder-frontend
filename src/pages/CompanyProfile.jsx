import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../api/authService';
import './Profile.css';

export default function CompanyProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [units, setUnits] = useState([]);
  const [activeNav, setActiveNav] = useState('account');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.getOnboarding();
        setCompany(data.company || {});
        setTenant(data.tenant || {});
        setUnits(data.units || []);
      } catch (e) {
        setError(e?.message || 'Failed to load company profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const displayName = (
    [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() ||
    user?.full_name?.trim() ||
    user?.name?.trim() ||
    user?.email ||
    'User'
  );

  const initials = (name, email) => {
    if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return '?';
  };

  const tenantDetails = user?.tenant_details || {};
  const addr = company?.registered_address || {};

  const formatAddress = () => {
    const parts = [addr.line1, addr.line2, addr.city, addr.state, addr.pin_code, addr.country].filter(Boolean);
    return parts.join(', ') || '—';
  };

  const formatCategories = (cats) => {
    if (!cats || !Array.isArray(cats) || cats.length === 0) return '—';
    return cats.join(', ');
  };

  const navItems = [
    { id: 'account', label: 'Account Holder' },
    { id: 'company', label: 'Company Info' },
    { id: 'legal', label: 'Legal & Tax' },
    { id: 'address', label: 'Address' },
    ...(units.length > 0 ? [{ id: 'units', label: 'Factory Units' }] : []),
    { id: 'subscription', label: 'Subscription' },
  ];

  // Skeleton loader — same structure as Master Panel
  if (loading) return (
    <div className="profile-root">
      <aside className="profile-sidebar">
        <div className="profile-sidebar-bg" />
        <div className="profile-sidebar-top">
          <div className="profile-avatar-wrap">
            <div className="sk-circle sk-avatar-lg" />
          </div>
          <div className="sk-line sk-line--name" />
          <div className="sk-line sk-line--role" />
        </div>
        <nav className="profile-nav">
          <div className="sk-nav-item" />
          <div className="sk-nav-item sk-nav-item--sm" />
          <div className="sk-nav-item sk-nav-item--sm" />
        </nav>
      </aside>
      <main className="profile-main">
        <div className="sk-line sk-heading" />
        <div className="sk-grid">
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
        </div>
        <div className="sk-divider" />
        <div className="sk-line sk-heading sk-heading--sm" />
        <div className="sk-grid">
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="profile-root">

      {/* ══════════════════════ SIDEBAR ══════════════════════════ */}
      <aside className="profile-sidebar">
        <div className="profile-sidebar-bg" />

        <div className="profile-sidebar-top">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-circle">
              {initials(displayName, user?.email)}
            </div>
          </div>
          <p className="profile-sidebar-name">{displayName}</p>
          <p className="profile-sidebar-role">Company Profile</p>
        </div>

        <nav className="profile-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`profile-nav-item${activeNav === item.id ? ' profile-nav-item--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="profile-nav-divider" />
          <Link to="/dashboard" className="profile-nav-back">← Dashboard</Link>
        </nav>
      </aside>

      {/* ══════════════════════ MAIN CONTENT ═════════════════════ */}
      <main className="profile-main">

        {error && <div className="profile-error">⚠ {error}</div>}

        {/* ── ACCOUNT HOLDER ──────────────────────────────────── */}
        {activeNav === 'account' && (
          <div className="profile-content" key="account">
            <section className="profile-section">
              <h2 className="profile-section-heading">Account Holder</h2>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-label">Full Name</label>
                  <div className="profile-input-static">{displayName}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Email</label>
                  <div className="profile-input-static">{user?.email || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Phone</label>
                  <div className="profile-input-static">{user?.phone || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Designation</label>
                  <div className="profile-input-static">{user?.designation || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Role</label>
                  <div className="profile-input-static">{user?.highest_role?.replace(/_/g, ' ') || user?.role?.replace(/_/g, ' ') || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Date Joined</label>
                  <div className="profile-input-static">{user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-IN') : '—'}</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── COMPANY INFO ────────────────────────────────────── */}
        {activeNav === 'company' && (
          <div className="profile-content" key="company">
            <section className="profile-section">
              <h2 className="profile-section-heading">Company Information</h2>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-label">Company Name</label>
                  <div className="profile-input-static">{tenantDetails.company_name || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Tenant ID</label>
                  <div className="profile-input-static" style={{ fontFamily: 'monospace' }}>{tenantDetails.tenant_id || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Legal Name</label>
                  <div className="profile-input-static">{company?.legal_name || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Trade Name</label>
                  <div className="profile-input-static">{company?.trade_name || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Owner Name</label>
                  <div className="profile-input-static">{tenant?.owner_name || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Company Email</label>
                  <div className="profile-input-static">{tenant?.company_email || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Company Phone</label>
                  <div className="profile-input-static">{tenant?.company_phone || tenant?.mobile_number || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">WhatsApp</label>
                  <div className="profile-input-static">{tenant?.whatsapp_number || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Industry Vertical</label>
                  <div className="profile-input-static">{tenant?.industry_vertical || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Business Categories</label>
                  <div className="profile-input-static">{formatCategories(company?.business_categories)}</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── LEGAL & TAX ─────────────────────────────────────── */}
        {activeNav === 'legal' && (
          <div className="profile-content" key="legal">
            <section className="profile-section">
              <h2 className="profile-section-heading">Legal & Tax Details</h2>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-label">GST Number</label>
                  <div className="profile-input-static" style={{ fontFamily: 'monospace' }}>{company?.gst_number || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">PAN Number</label>
                  <div className="profile-input-static" style={{ fontFamily: 'monospace' }}>{company?.pan_number || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">IEC Code</label>
                  <div className="profile-input-static" style={{ fontFamily: 'monospace' }}>{company?.iec_code || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">MSME Number</label>
                  <div className="profile-input-static" style={{ fontFamily: 'monospace' }}>{company?.msme_number || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Factory License</label>
                  <div className="profile-input-static" style={{ fontFamily: 'monospace' }}>{company?.factory_license || '—'}</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── ADDRESS ─────────────────────────────────────────── */}
        {activeNav === 'address' && (
          <div className="profile-content" key="address">
            <section className="profile-section">
              <h2 className="profile-section-heading">Registered Address</h2>
              <div className="profile-form-grid">
                {addr.line1 && (
                  <div className="profile-field">
                    <label className="profile-label">Address Line 1</label>
                    <div className="profile-input-static">{addr.line1}</div>
                  </div>
                )}
                {addr.line2 && (
                  <div className="profile-field">
                    <label className="profile-label">Address Line 2</label>
                    <div className="profile-input-static">{addr.line2}</div>
                  </div>
                )}
                <div className="profile-field">
                  <label className="profile-label">City</label>
                  <div className="profile-input-static">{addr.city || tenant?.location_city || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">State</label>
                  <div className="profile-input-static">{addr.state || tenant?.location_state || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">PIN Code</label>
                  <div className="profile-input-static">{addr.pin_code || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Country</label>
                  <div className="profile-input-static">{addr.country || 'India'}</div>
                </div>
              </div>

              {!addr.line1 && !addr.city && !addr.state && !addr.pin_code && (
                <>
                  <div className="profile-divider" />
                  <div className="profile-form-grid">
                    <div className="profile-field" style={{ gridColumn: '1 / -1' }}>
                      <label className="profile-label">Full Address</label>
                      <div className="profile-input-static">{formatAddress()}</div>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {/* ── FACTORY UNITS ───────────────────────────────────── */}
        {activeNav === 'units' && units.length > 0 && (
          <div className="profile-content" key="units">
            <section className="profile-section">
              <h2 className="profile-section-heading">
                Factory Units
                <span className="profile-count" style={{ marginLeft: 8 }}>{units.length}</span>
              </h2>

              {units.map((unit, idx) => (
                <div key={unit.id || idx} style={{ background: 'var(--muted)', borderRadius: 10, padding: '20px 20px 16px', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {unit.unit_name || `Unit ${idx + 1}`}
                    {unit.is_headquarters && (
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--primary)', color: 'var(--primary-foreground)', padding: '2px 8px', borderRadius: 4, letterSpacing: 0.5 }}>HQ</span>
                    )}
                  </h3>
                  <div className="profile-form-grid">
                    <div className="profile-field">
                      <label className="profile-label">Unit Code</label>
                      <div className="profile-input-static" style={{ fontFamily: 'monospace' }}>{unit.unit_code || '—'}</div>
                    </div>
                    <div className="profile-field">
                      <label className="profile-label">Unit GST</label>
                      <div className="profile-input-static" style={{ fontFamily: 'monospace' }}>{unit.unit_gst || '—'}</div>
                    </div>
                    <div className="profile-field">
                      <label className="profile-label">City</label>
                      <div className="profile-input-static">{unit.city || '—'}</div>
                    </div>
                    <div className="profile-field">
                      <label className="profile-label">State</label>
                      <div className="profile-input-static">{unit.state || '—'}</div>
                    </div>
                    <div className="profile-field">
                      <label className="profile-label">Contact Person</label>
                      <div className="profile-input-static">{unit.contact_person || '—'}</div>
                    </div>
                    <div className="profile-field">
                      <label className="profile-label">Contact Phone</label>
                      <div className="profile-input-static">{unit.contact_phone || '—'}</div>
                    </div>
                    <div className="profile-field">
                      <label className="profile-label">Contact Email</label>
                      <div className="profile-input-static">{unit.contact_email || '—'}</div>
                    </div>
                    <div className="profile-field">
                      <label className="profile-label">Address</label>
                      <div className="profile-input-static">{unit.address || '—'}</div>
                    </div>
                  </div>
                  {unit.sheds && unit.sheds.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <label className="profile-label">Sheds ({unit.sheds.length})</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                        {unit.sheds.map((shed, si) => (
                          <span key={shed.id || si} className="profile-chip">
                            {shed.shed_name} ({shed.shed_code}) — {shed.primary_process || 'N/A'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>
        )}

        {/* ── SUBSCRIPTION ────────────────────────────────────── */}
        {activeNav === 'subscription' && (
          <div className="profile-content" key="subscription">
            <section className="profile-section">
              <h2 className="profile-section-heading">Subscription</h2>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-label">Plan</label>
                  <div className="profile-input-static" style={{ textTransform: 'capitalize' }}>{tenant?.plan || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Max Users</label>
                  <div className="profile-input-static">{tenant?.max_users || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Subscription Start</label>
                  <div className="profile-input-static">{tenant?.subscription_start_date ? new Date(tenant.subscription_start_date).toLocaleDateString('en-IN') : '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Subscription End</label>
                  <div className="profile-input-static">{tenant?.subscription_end_date ? new Date(tenant.subscription_end_date).toLocaleDateString('en-IN') : '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Status</label>
                  <div className="profile-input-static" style={{ color: tenant?.is_active ? '#16a34a' : 'var(--destructive)', fontWeight: 600 }}>
                    {tenant?.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

      </main>
    </div>
  );
}
