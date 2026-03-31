import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCompany } from '../api/authService';

const initialForm = {
  company_name: '',
  company_email: '',
  whatsapp_number: '',
  mobile_number: '',
  company_phone: '',
  address_street: '',
  location_city: '',
  location_state: '',
  address_pincode: '',
  gst_number: '',
  pan_number: '',
  max_users: 5,
  first_name: '',
  last_name: '',
  username: '',
  password: '',
  confirm_password: '',
};

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
    padding: '24px 16px',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '28px 32px',
    width: '100%',
    maxWidth: 680,
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
    marginTop: 8,
    marginBottom: 24,
  },
  header: { marginBottom: 24, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 12,
    marginTop: 22,
    borderBottom: '1.5px solid #e2e8f0',
    paddingBottom: 6,
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 4 },
  full: { gridColumn: '1 / -1' },
  label: {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#475569',
    marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em',
  },
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
  btn: {
    width: '100%',
    padding: '11px',
    borderRadius: 9,
    border: 'none',
    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 20,
    transition: 'opacity .15s, transform .1s',
  },
  btnDisabled: { opacity: 0.55, cursor: 'not-allowed' },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    marginBottom: 14,
  },
  footer: { textAlign: 'center', marginTop: 18, fontSize: 13, color: '#64748b' },
  footerLink: { color: '#3b82f6', fontWeight: 600, textDecoration: 'none' },
  hint: { fontSize: 11, color: '#94a3b8', marginTop: 3 },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 16,
  },
  popup: {
    background: '#fff',
    borderRadius: 20,
    padding: '40px 32px',
    maxWidth: 440,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
    animation: 'popIn .3s cubic-bezier(.34,1.56,.64,1)',
  },
  checkCircle: {
    width: 64, height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: 30,
    boxShadow: '0 8px 24px rgba(99,102,241,.35)',
  },
  popTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  popSub: { fontSize: 13, color: '#64748b', marginBottom: 24, lineHeight: 1.6, textAlign: 'left' },
  popBtn: {
    padding: '10px 32px',
    borderRadius: 9,
    border: 'none',
    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
};

function Field({ label, hint, style, ...props }) {
  return (
    <div style={style}>
      {label && <label style={S.label}>{label}</label>}
      <input style={S.input} {...props} />
      {hint && <p style={S.hint}>{hint}</p>}
    </div>
  );
}

export default function RegisterCompany() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.company_name.trim()) return 'Company Name is required.';
    if (!form.company_email.trim()) return 'Email is required.';
    if (!form.address_street.trim()) return 'Street address is required.';
    if (!form.location_city.trim()) return 'City is required.';
    if (!form.location_state.trim()) return 'State is required.';
    if (!form.address_pincode.trim()) return 'Pincode is required.';
    const users = Number(form.max_users);
    if (isNaN(users) || users < 5 || users > 1000) return 'Number of users must be between 5 and 1000.';
    if (!form.first_name.trim()) return 'First Name is required.';
    if (!form.last_name.trim()) return 'Last Name is required.';
    if (!form.username.trim()) return 'User Name is required.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm_password) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);
    try {
      await registerCompany(form);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes popIn {
          from { transform: scale(.85); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        input:focus { border-color: #3b82f6 !important; background: #fff !important; outline: none; }
        button:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
      `}</style>

      {done && (
        <div style={S.overlay}>
          <div style={S.popup}>
            <div style={S.checkCircle}>\u23f3</div>
            <p style={S.popTitle}>Request Submitted!</p>
            <p style={S.popSub}>
              Your onboarding request for <strong>{form.company_name}</strong> is in progress.<br /><br />
              Once approved by the Binder-OS team, you will receive your <strong>username</strong> and{' '}
              <strong>temporary password</strong> along with a set-new-password link at{' '}
              <strong>{form.company_email}</strong>.
            </p>
            <button style={S.popBtn} onClick={() => navigate('/login')}>
              Go to Login \u2192
            </button>
          </div>
        </div>
      )}

      <div style={S.page}>
        <div style={S.card}>
          <div style={S.header}>
            <h2 style={S.title}>Register Company</h2>
            <p style={S.subtitle}>Fill in your company details and create a master profile to get started</p>
          </div>

          {error && <div style={S.error}>\u26a0 {error}</div>}

          <form onSubmit={handleSubmit} noValidate>

            <p style={S.sectionTitle}>Company Information</p>
            <div style={S.grid2}>
              <Field label="Company Name *" name="company_name" placeholder="Acme Corp" value={form.company_name} onChange={onChange} required />
              <Field label="Email *" type="email" name="company_email" placeholder="hello@acme.com" value={form.company_email} onChange={onChange} required />
              <Field label="WhatsApp Number" name="whatsapp_number" placeholder="+91 98765 43210" value={form.whatsapp_number} onChange={onChange} />
              <Field label="Mobile Number" name="mobile_number" placeholder="+91 98765 43210" value={form.mobile_number} onChange={onChange} />
              <Field label="GST Number" name="gst_number" placeholder="22AAAAA0000A1Z5" value={form.gst_number} onChange={onChange} />
              <Field label="PAN" name="pan_number" placeholder="AAAAA0000A" value={form.pan_number} onChange={onChange} />
            </div>

            <p style={S.sectionTitle}>Registered Address</p>
            <div style={S.grid2}>
              <div style={S.full}>
                <Field label="Street *" name="address_street" placeholder="123 Business Park, Andheri East" value={form.address_street} onChange={onChange} required />
              </div>
              <Field label="City *" name="location_city" placeholder="Mumbai" value={form.location_city} onChange={onChange} required />
              <Field label="State *" name="location_state" placeholder="Maharashtra" value={form.location_state} onChange={onChange} required />
              <Field label="Pincode *" name="address_pincode" placeholder="400001" value={form.address_pincode} onChange={onChange} required />
              <div>
                <label style={S.label}>How Many Users? *</label>
                <input style={S.input} type="number" name="max_users" min={5} max={1000} value={form.max_users} onChange={onChange} required />
                <p style={S.hint}>Minimum 5 \u00b7 Maximum 1000</p>
              </div>
            </div>

            <p style={S.sectionTitle}>Create Master Profile</p>
            <div style={S.grid2}>
              <Field label="First Name *" name="first_name" placeholder="John" value={form.first_name} onChange={onChange} required />
              <Field label="Last Name *" name="last_name" placeholder="Doe" value={form.last_name} onChange={onChange} required />
              <div style={S.full}>
                <Field label="User Name *" name="username" placeholder="johndoe92" value={form.username} onChange={onChange} required hint="This will be your display username on Binder-OS" />
              </div>
              <Field label="New Password *" type="password" name="password" placeholder="Min. 8 characters" value={form.password} onChange={onChange} required />
              <Field label="Confirm Password *" type="password" name="confirm_password" placeholder="Re-enter password" value={form.confirm_password} onChange={onChange} required />
            </div>

            <button style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }} type="submit" disabled={loading}>
              {loading ? 'Submitting\u2026' : 'Submit Registration Request'}
            </button>
          </form>

          <div style={S.footer}>
            <span>Already have an account? </span>
            <Link to="/login" style={S.footerLink}>Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}
