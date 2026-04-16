import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCompany, checkUsernameAvailability } from '../api/authService';
import './RegisterCompany.css';

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
};

function Field({ label, hint, className, ...props }) {
  return (
    <div className={className}>
      {label && <label className="register-label">{label}</label>}
      <input className="register-input" {...props} />
      {hint && <p className="register-hint">{hint}</p>}
    </div>
  );
}

const SKIP_KEYS = new Set(['message', 'detail', 'status', 'status_code', 'password', 'confirm_password']);

// User-friendly messages for each known field error
const FRIENDLY_MESSAGES = {
  company_name: 'A company with the same name already exists. Please use a different company name.',
  company_email: 'This company email is already registered. Please use a different email address.',
  username: 'This username already exists in the system. Please choose a different username.',
};

function parseBackendErrors(err) {
  let raw = err?.fieldErrors;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return [err.message || 'Registration failed. Please try again.'];
  }
  // Backend sometimes wraps field errors inside a nested 'data' key
  if (raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    raw = raw.data;
  }
  const lines = [];
  for (const key of Object.keys(raw)) {
    if (SKIP_KEYS.has(key)) continue;
    if (FRIENDLY_MESSAGES[key]) {
      lines.push(FRIENDLY_MESSAGES[key]);
    } else {
      const val = raw[key];
      const msgs = Array.isArray(val) ? val : [val];
      msgs.forEach((m) => {
        const text = typeof m === 'string' ? m : (m?.string ?? JSON.stringify(m));
        lines.push(text);
      });
    }
  }
  return lines.length > 0
    ? lines
    : [err.message || 'Registration failed. Please try again.'];
}

function getUsernamePrefixes(firstName, lastName) {
  const first = firstName.trim().toLowerCase().replace(/\s+/g, '');
  const last = lastName.trim().toLowerCase().replace(/\s+/g, '');
  const result = new Set();
  if (first) result.add(first);
  if (first && last) result.add(`${first}${last}`);
  if (last) result.add(last);
  return [...result];
}

export default function RegisterCompany() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [usernamePrefix, setUsernamePrefix] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorLines, setErrorLines] = useState([]); // backend field errors → popup
  const [done, setDone] = useState(false);

  const companySlug = form.company_name.trim().toLowerCase().replace(/\s+/g, '');
  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle | checking | available | taken
  const debounceRef = useRef(null);

  const usernamePrefixes = useMemo(
    () => getUsernamePrefixes(form.first_name, form.last_name),
    [form.first_name, form.last_name]
  );

  const assembleUsername = (prefix, slug) =>
    prefix && slug ? `${prefix}@${slug}` : prefix;

  useEffect(() => {
    if (!usernamePrefix || !companySlug) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const taken = await checkUsernameAvailability(assembleUsername(usernamePrefix, companySlug));
        setUsernameStatus(taken ? 'taken' : 'available');
      } catch {
        setUsernameStatus('idle');
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [usernamePrefix, companySlug]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'company_name') {
        const slug = value.trim().toLowerCase().replace(/\s+/g, '');
        updated.username = assembleUsername(usernamePrefix, slug);
      }
      return updated;
    });
  };

  const onPrefixChange = (e) => {
    // Strip @ and spaces — they are not allowed in the prefix
    const prefix = e.target.value.replace(/[@\s]/g, '');
    setUsernamePrefix(prefix);
    setForm((prev) => ({ ...prev, username: assembleUsername(prefix, companySlug) }));
  };

  const selectSuggestion = (prefix) => {
    setUsernamePrefix(prefix);
    setForm((prev) => ({ ...prev, username: assembleUsername(prefix, companySlug) }));
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
    if (!usernamePrefix.trim()) return 'User Name is required.';
    if (usernameStatus === 'taken') return 'Username already exists, please choose another.';
    if (usernameStatus === 'checking') return 'Please wait while we check username availability.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);
    try {
      // Backend requires password fields; generate a secure random one.
      // The user will set their real password via the welcome email link.
      const tempPassword = Array.from(crypto.getRandomValues(new Uint8Array(18)))
        .map((b) => b.toString(36))
        .join('')
        .slice(0, 18);
      await registerCompany({ ...form, password: tempPassword, confirm_password: tempPassword });
      setDone(true);
    } catch (err) {
      setErrorLines(parseBackendErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {done && (
        <div className="register-overlay">
          <div className="register-popup">
            <div className="register-popup-icon">{'\u23f3'}</div>
            <p className="register-popup-title">Request Submitted!</p>
            <p className="register-popup-text">
              Your onboarding request for <strong>{form.company_name}</strong> is in progress.<br /><br />
              Once approved by the Binder-OS team, you will receive your <strong>username</strong> and{' '}
              <strong>temporary password</strong> along with a set-new-password link at{' '}
              <strong>{form.company_email}</strong>.
            </p>
            <button className="register-popup-btn" onClick={() => navigate('/login')}>
              Go to Login {'\u2192'}
            </button>
          </div>
        </div>
      )}

      <div className="register-page">
        <button className="register-back-btn" type="button" onClick={() => navigate(-1)}>
          {'\u2190'} Back
        </button>

        <div className="register-card">
          <div className="register-header">
            <div className="register-logo">
              <span className="logo-dots">{'\u25CB\u25CB\u25CB'}</span>
              <span className="logo-name">Binder</span>
            </div>
            <h2 className="register-title">Register Company</h2>
            <p className="register-subtitle">Fill in your company details and create a master profile to get started</p>
          </div>

          {error && <div className="register-error">{'\u26a0'} {error}</div>}

          {errorLines.length > 0 && (
            <div className="reg-err-overlay" onClick={() => setErrorLines([])}>
              <div className="reg-err-modal" onClick={(e) => e.stopPropagation()}>
                <div className="reg-err-icon">&#9888;</div>
                <p className="reg-err-title">Please fix the following</p>
                <ul className="reg-err-list">
                  {errorLines.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
                <button className="reg-err-btn" onClick={() => setErrorLines([])}>
                  OK
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <p className="register-section-title">Company Information</p>
            <div className="register-grid">
              <Field label="Company Name *" name="company_name" placeholder="Acme Corp" value={form.company_name} onChange={onChange} required />
              <Field label="Email *" type="email" name="company_email" placeholder="hello@acme.com" value={form.company_email} onChange={onChange} required />
              <Field label="WhatsApp Number" name="whatsapp_number" placeholder="+91 98765 43210" value={form.whatsapp_number} onChange={onChange} />
              <Field label="Mobile Number" name="mobile_number" placeholder="+91 98765 43210" value={form.mobile_number} onChange={onChange} />
              <Field label="GST Number" name="gst_number" placeholder="22AAAAA0000A1Z5" value={form.gst_number} onChange={onChange} />
              <Field label="PAN" name="pan_number" placeholder="AAAAA0000A" value={form.pan_number} onChange={onChange} />
            </div>

            <p className="register-section-title">Registered Address</p>
            <div className="register-grid">
              <Field className="register-full" label="Street *" name="address_street" placeholder="123 Business Park, Andheri East" value={form.address_street} onChange={onChange} required />
              <Field label="City *" name="location_city" placeholder="Mumbai" value={form.location_city} onChange={onChange} required />
              <Field label="State *" name="location_state" placeholder="Maharashtra" value={form.location_state} onChange={onChange} required />
              <Field label="Pincode *" name="address_pincode" placeholder="400001" value={form.address_pincode} onChange={onChange} required />
              <div>
                <label className="register-label">How Many Users? *</label>
                <input className="register-input" type="number" name="max_users" min={5} max={1000} value={form.max_users} onChange={onChange} required />
                <p className="register-hint">Minimum 5 {'\u00b7'} Maximum 1000</p>
              </div>
            </div>

            <p className="register-section-title">Create Master Profile</p>
            <div className="register-grid">
              <Field label="First Name *" name="first_name" placeholder="John" value={form.first_name} onChange={onChange} required />
              <Field label="Last Name *" name="last_name" placeholder="Doe" value={form.last_name} onChange={onChange} required />

              <div className="register-full">
                <label className="register-label">User Name *</label>
                <div className={`register-username-box${usernameStatus === 'taken' ? ' status-taken' : usernameStatus === 'available' ? ' status-available' : ''}`}>
                  <input
                    className="register-username-prefix"
                    placeholder="pick or type"
                    value={usernamePrefix}
                    onChange={onPrefixChange}
                    required
                  />
                  <span className="register-username-at-suffix">
                    @{companySlug || 'companyname'}
                  </span>
                </div>
                {usernameStatus === 'checking' && (
                  <p className="register-username-status checking">Checking availability…</p>
                )}
                {usernameStatus === 'taken' && (
                  <p className="register-username-status taken">Username already exists, please change username</p>
                )}
                {usernameStatus === 'available' && (
                  <p className="register-username-status available">Username is available</p>
                )}
                {usernamePrefixes.length > 0 && (
                  <div className="register-username-suggestions">
                    <span className="register-suggestions-label">Suggestions:</span>
                    {usernamePrefixes.map((prefix) => (
                      <button
                        key={prefix}
                        type="button"
                        className={`register-suggestion-chip${usernamePrefix === prefix ? ' active' : ''}`}
                        onClick={() => selectSuggestion(prefix)}
                      >
                        {prefix}
                        <span className="chip-slug">@{companySlug || 'companyname'}</span>
                      </button>
                    ))}
                  </div>
                )}
                <p className="register-hint">This will be your display username on Binder-OS</p>
              </div>
            </div>

            <button className="register-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Submitting\u2026' : 'SUBMIT REGISTRATION REQUEST'}
            </button>
          </form>

          <div className="register-footer">
            <span>Already have an account? </span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}
