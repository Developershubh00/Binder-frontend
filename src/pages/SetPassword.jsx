import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setPassword } from '../api/authService';

/* ─── styles ─── */
const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
    padding: 16,
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
    fontWeight: 800,
    color: '#3b82f6',
    letterSpacing: '-0.5px',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 4px',
  },
  sub: {
    textAlign: 'center',
    fontSize: 13,
    color: '#64748b',
    marginBottom: 28,
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#475569',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
    background: '#f8fafc',
    boxSizing: 'border-box',
    marginBottom: 16,
    transition: 'border-color .15s',
  },
  btn: {
    width: '100%',
    padding: '12px',
    borderRadius: 9,
    border: 'none',
    background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 13,
    marginBottom: 16,
  },
  success: {
    background: '#f0fdf4',
    border: '1px solid #86efac',
    color: '#166534',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 13,
    marginBottom: 16,
  },
  rules: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 1.6,
    paddingLeft: 16,
  },
  strength: {
    height: 4,
    borderRadius: 4,
    marginBottom: 16,
    transition: 'width .3s, background .3s',
  },
};

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '#e2e8f0' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: 'Weak', color: '#ef4444' };
  if (s <= 3) return { score: s, label: 'Fair', color: '#f59e0b' };
  return { score: s, label: 'Strong', color: '#22c55e' };
}

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPasswordVal] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Missing or invalid link. Please use the link from your welcome email.');
    }
  }, [token]);

  const strength = passwordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Missing token. Please use the link from your welcome email.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await setPassword(token, password, passwordConfirm);
      if (data.status === 'success') {
        if (data.data?.tokens) {
          // Tokens stored by authService.setPassword.
          // Full reload so AuthProvider re-reads localStorage before the protected Onboarding route checks.
          window.location.replace('/onboarding');
        } else {
          setSuccess('Password set! Redirecting to login…');
          setTimeout(() => navigate('/login'), 1800);
        }
      } else {
        setError(data.message || 'Failed to set password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        input:focus { border-color: #3b82f6 !important; background: #fff !important; }
        button:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
      `}</style>

      <div style={S.page}>
        <div style={S.card}>
          <div style={S.logo}>Binder</div>
          <h2 style={S.title}>Set your password</h2>
          <p style={S.sub}>Create a new password to activate your account and begin onboarding.</p>

          {error && <div style={S.error}>⚠ {error}</div>}
          {success && <div style={S.success}>✓ {success}</div>}

          <form onSubmit={handleSubmit}>
            <label style={S.label}>New Password</label>
            <input
              style={S.input}
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPasswordVal(e.target.value)}
              autoComplete="new-password"
              disabled={!token || loading}
              required
            />

            {/* password strength bar */}
            {password && (
              <div style={{ marginTop: -12, marginBottom: 12 }}>
                <div
                  style={{
                    ...S.strength,
                    width: `${Math.min(100, (strength.score / 5) * 100)}%`,
                    background: strength.color,
                  }}
                />
                <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
                  {strength.label}
                </span>
              </div>
            )}

            <label style={S.label}>Confirm Password</label>
            <input
              style={S.input}
              type="password"
              placeholder="Repeat your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              disabled={!token || loading}
              required
            />

            <ul style={S.rules}>
              <li>At least 8 characters</li>
              <li>Mix of letters, numbers &amp; symbols for a stronger password</li>
            </ul>

            <button
              style={{ ...S.btn, ...(!token || loading ? S.btnDisabled : {}) }}
              type="submit"
              disabled={!token || loading}
            >
              {loading ? 'Setting password…' : 'Set Password & Continue →'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
