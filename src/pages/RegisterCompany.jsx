import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createTenantOwner, registerCompany } from '../api/authService';

const initialCompanyForm = {
  company_name: '',
  owner_name: '',
  company_email: '',
  whatsapp_number: '',
  company_phone: '',
  company_address: '',
  location_city: '',
  location_state: '',
  industry_vertical: '',
  plan: 'starter',
  logo: null,
};

/* ─── tiny inline styles (no extra CSS file needed) ─── */
const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
    padding: '16px',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '28px 32px',
    width: '100%',
    maxWidth: 620,
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  },
  header: { marginBottom: 20, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px', marginBottom: 14 },
  fullRow: { gridColumn: '1 / -1' },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 13,
    color: '#0f172a',
    outline: 'none',
    background: '#f8fafc',
    boxSizing: 'border-box',
    transition: 'border-color .15s',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 13,
    color: '#0f172a',
    background: '#f8fafc',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  fileInput: {
    width: '100%',
    padding: '6px 8px',
    border: '1.5px dashed #cbd5e1',
    borderRadius: 8,
    fontSize: 12,
    color: '#64748b',
    background: '#f8fafc',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  btn: {
    width: '100%',
    padding: '10px',
    borderRadius: 9,
    border: 'none',
    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 6,
    transition: 'opacity .15s, transform .1s',
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    marginBottom: 14,
  },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' },
  footerLink: { color: '#3b82f6', fontWeight: 600, textDecoration: 'none' },

  /* ── success popup overlay ── */
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
  },
  popup: {
    background: '#fff',
    borderRadius: 20,
    padding: '36px 32px',
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
    animation: 'popIn .3s cubic-bezier(.34,1.56,.64,1)',
  },
  checkCircle: {
    width: 64, height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: 30,
    boxShadow: '0 8px 24px rgba(34,197,94,.35)',
  },
  popTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' },
  popSub: { fontSize: 13, color: '#64748b', marginBottom: 24 },
  popBtn: {
    padding: '10px 28px',
    borderRadius: 9,
    border: 'none',
    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },

  /* owner form section */
  ownerSection: {
    borderTop: '1.5px solid #e2e8f0',
    marginTop: 20,
    paddingTop: 20,
  },
  ownerTitle: { fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 14, textAlign: 'center' },
};

function Field({ label, style, ...props }) {
  return (
    <div style={style}>
      {label && <label style={S.label}>{label}</label>}
      <input style={S.input} {...props} />
    </div>
  );
}

export default function RegisterCompany() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialCompanyForm);
  const [tenantId, setTenantId] = useState(null);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [ownerDone, setOwnerDone] = useState(false);
  const [emailInfo, setEmailInfo] = useState({ sent: null, note: '' });
  const [binderNotify, setBinderNotify] = useState({ sent: null, note: '' });

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const submitCompany = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await registerCompany(form);
      const d = response?.data || {};
      setTenantId(d.tenant_id);
      setBinderNotify({
        sent: d.binder_notification_sent === true,
        note: (d.binder_notification_note || '').trim(),
      });
      setShowSuccessPopup(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const submitOwner = async (e) => {
    e.preventDefault();
    if (!tenantId) return;
    setError('');
    setOwnerLoading(true);
    try {
      const res = await createTenantOwner({ tenantId, email: ownerEmail, password: ownerPassword });
      const d = res?.data || {};
      setEmailInfo({
        sent: d.email_sent === true,
        note: (d.email_note || '').trim(),
      });
      setOwnerDone(true);
    } catch (err) {
      setError(err.message || 'Failed to create owner');
    } finally {
      setOwnerLoading(false);
    }
  };

  return (
    <>
      {/* Google Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes popIn {
          from { transform: scale(.8); opacity: 0; }
          to   { transform: scale(1);  opacity: 1; }
        }
        input:focus, select:focus { border-color: #3b82f6 !important; background: #fff !important; }
        button:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
      `}</style>

      {/* ── Success Popup ── */}
      {showSuccessPopup && (
        <div style={S.overlay}>
          <div style={S.popup}>
            <div style={S.checkCircle}>✓</div>
            <p style={S.popTitle}>Company Registered!</p>
            <p style={S.popSub}>
              <strong>{form.company_name}</strong> has been created successfully.<br />
              Now set up the owner login credentials.
            </p>
            {binderNotify.sent === true && (
              <p style={{ fontSize: 12, color: '#16a34a', marginBottom: 12 }}>
                Binder-OS has been notified about this registration.
              </p>
            )}
            {binderNotify.sent === false && binderNotify.note && (
              <p style={{ fontSize: 11, color: '#b45309', marginBottom: 12, textAlign: 'left' }}>
                Team notification: {binderNotify.note} Set <code style={{ fontSize: 10 }}>BINDER_OS_NOTIFICATION_EMAIL</code> on the server.
              </p>
            )}
            <button style={S.popBtn} onClick={() => setShowSuccessPopup(false)}>
              Create Owner Account →
            </button>
          </div>
        </div>
      )}

      {/* ── Owner submitted: pending approval (no auto-redirect) ── */}
      {ownerDone && (
        <div style={S.overlay}>
          <div style={{ ...S.popup, maxWidth: 440 }}>
            <div style={{ ...S.checkCircle, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>✓</div>
            <p style={S.popTitle}>Registration submitted</p>
            <p style={{ ...S.popSub, textAlign: 'left', marginBottom: 16, lineHeight: 1.55 }}>
              Your profile is in the <strong>approval process</strong>. You will receive an email once your account is approved.
              {emailInfo.sent && (
                <>
                  <br /><br />
                  A welcome message with your login details was sent to your email when delivery succeeded.
                </>
              )}
              {emailInfo.note && (
                <>
                  <br /><br />
                  <span style={{ color: '#64748b', fontSize: 12 }}>{emailInfo.note}</span>
                </>
              )}
              {!emailInfo.sent && !emailInfo.note && (
                <>
                  <br /><br />
                  <span style={{ color: '#b45309', fontSize: 12 }}>
                    We could not confirm the welcome email. Ask your administrator or check server email settings.
                  </span>
                </>
              )}
            </p>
            <button type="button" style={S.popBtn} onClick={() => navigate('/login')}>
              Go to login
            </button>
          </div>
        </div>
      )}

      <div style={S.page}>
        <div style={S.card}>
          <div style={S.header}>
            <h2 style={S.title}>Register Company</h2>
            <p style={S.subtitle}>Create your tenant and owner account</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.45 }}>
              <strong>Step 1:</strong> Submit company details — Binder-OS is notified by email.
              <br />
              <strong>Step 2:</strong> Enter owner email and temporary password — you get the welcome and login email (when delivery succeeds).
            </p>
          </div>

          {error && <div style={S.error}>⚠ {error}</div>}

          {/* ── Company Form ── */}
          <form onSubmit={submitCompany}>
            <div style={S.grid}>
              <Field label="Company Name" name="company_name" placeholder="Acme Corp" value={form.company_name} onChange={onChange} required />
              <Field label="Owner Name" name="owner_name" placeholder="John Doe" value={form.owner_name} onChange={onChange} required />
              <Field label="Company Email" type="email" name="company_email" placeholder="hello@acme.com" value={form.company_email} onChange={onChange} required />
              <Field label="WhatsApp Number" name="whatsapp_number" placeholder="+91 98765 43210" value={form.whatsapp_number} onChange={onChange} />
              <Field label="Company Phone" name="company_phone" placeholder="+91 11 2345 6789" value={form.company_phone} onChange={onChange} />
              <Field label="City" name="location_city" placeholder="Mumbai" value={form.location_city} onChange={onChange} />
              <Field label="State" name="location_state" placeholder="Maharashtra" value={form.location_state} onChange={onChange} />
              <Field label="Industry Vertical" name="industry_vertical" placeholder="SaaS / Retail / Finance…" value={form.industry_vertical} onChange={onChange} />

              <div style={S.fullRow}>
                <Field label="Company Address" name="company_address" placeholder="123 Business Park, Andheri East" value={form.company_address} onChange={onChange} />
              </div>

              <div>
                <label style={S.label}>Plan</label>
                <select style={S.select} name="plan" value={form.plan} onChange={onChange}>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="advance">Advance</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label style={S.label}>Company Logo</label>
                <input style={S.fileInput} type="file" name="logo" accept="image/*" onChange={onChange} />
              </div>
            </div>

            <button
              style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
              type="submit"
              disabled={loading || !!tenantId}
            >
              {loading ? 'Submitting…' : tenantId ? '✓ Company Registered' : 'Register Company'}
            </button>
          </form>

          {/* ── Owner Credentials (shown after popup dismissed) ── */}
          {tenantId && !showSuccessPopup && (
            <div style={S.ownerSection}>
              <p style={S.ownerTitle}>🔑 Create Owner Login Credentials</p>
              <form onSubmit={submitOwner}>
                <div style={S.grid}>
                  <div>
                    <label style={S.label}>Owner Email</label>
                    <input style={S.input} type="email" placeholder="owner@acme.com" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label style={S.label}>Temporary Password</label>
                    <input style={S.input} type="password" placeholder="Min. 8 characters" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} required />
                  </div>
                </div>
                <button
                  style={{ ...S.btn, ...(ownerLoading ? S.btnDisabled : {}) }}
                  type="submit"
                  disabled={ownerLoading}
                >
                  {ownerLoading ? 'Submitting…' : 'Submit owner credentials'}
                </button>
              </form>
            </div>
          )}

          <div style={S.footer}>
            <span>Already registered? </span>
            <Link to="/login" style={S.footerLink}>Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}