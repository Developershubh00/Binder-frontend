import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCompany } from '../api/authService';
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
  password: '',
  confirm_password: '',
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
              <Field className="register-full" label="User Name *" name="username" placeholder="johndoe92" value={form.username} onChange={onChange} required hint="This will be your display username on Binder-OS" />
              <Field label="New Password *" type="password" name="password" placeholder="Min. 8 characters" value={form.password} onChange={onChange} required />
              <Field label="Confirm Password *" type="password" name="confirm_password" placeholder="Re-enter password" value={form.confirm_password} onChange={onChange} required />
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
