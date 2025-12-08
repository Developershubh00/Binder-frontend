import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userRole: 'tenant',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error');
  const [showPassword, setShowPassword] = useState(false);

  const mockCredentials = {
    'master-admin': { email: 'admin@binder.com', password: 'admin123' },
    'manager': { email: 'manager@binder.com', password: 'manager123' },
    'tenant': { email: 'tenant@binder.com', password: 'tenant123' },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Auto-fill credentials when role changes
    if (name === 'userRole') {
      const credentials = mockCredentials[value];
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        email: credentials.email,
        password: credentials.password,
      }));
      // Clear any existing errors when auto-filling
      setErrors({});
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const displayPopup = (message, type = 'error') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const credentials = {
        email: formData.email,
        password: formData.password,
      };

      const result = await login(credentials, formData.userRole);

      if (result.success) {
        // displayPopup('Welcome back! Redirecting...', 'success');
        const username = result.user?.username || result.user?.name || result.username || 'User';
        displayPopup(`Welcome back, ${username}! Redirecting...`, 'success');
        
        setTimeout(() => {
          switch (formData.userRole) {
            case 'master-admin':
              navigate('/admin/dashboard');
              break;
            case 'manager':
              navigate('/manager/dashboard');
              break;
            case 'tenant':
              navigate('/tenant/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        }, 1500);
      } else {
        displayPopup(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      displayPopup(
        error.message || 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill tenant credentials on component mount
  useState(() => {
    const credentials = mockCredentials['tenant'];
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password,
    }));
  });

  return (
    <div className="login-container">
      {/* Left Side - Gradient Background */}
      <div className="login-left-side">
        <div className="brand-section">
          <h2 className="brand-title">A WISE QUOTE</h2>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">Get Everything You Want</h1>
          <p className="hero-subtitle">
            You can get everything you want if you work hard, 
            trust the process, and stick to the plan.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right-side">
        <div className="login-form-container">
          <div className="brand-logo">
            <span className="logo-text">Binder</span>
          </div>

          <div className="form-header">
            <h1 className="form-title">Welcome Back</h1>
            <p className="form-subtitle">Enter your email and password to access your account</p>
          </div>

          {/* Role Selector */}
          <div className="role-selector">
            <label htmlFor="userRole" className="role-label">Login As</label>
            <div className="select-container">
              <select
                id="userRole"
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
                className="role-select"
              >
                <option value="tenant">Tenant</option>
                <option value="manager">Manager</option>
                <option value="master-admin">Master Admin</option>
              </select>
              <div className="select-arrow">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="form-group">
              <label className="input-label">Email</label>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`input-field ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="input-label">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input-field ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="/forgot-password" className="forgot-link">
                Forgot Password
              </a>
            </div>

            {/* Sign In Button */}
            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="signup-section">
            <span className="signup-text">Don't have an account? </span>
            <a href="/register" className="signup-link">Sign Up</a>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-backdrop" onClick={closePopup}>
          <div
            className={`popup-modal ${popupType}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-icon-wrapper">
              {popupType === 'error' ? (
                <span className="popup-icon error">✕</span>
              ) : (
                <span className="popup-icon success">✓</span>
              )}
            </div>
            <h3 className="popup-title">
              {popupType === 'error' ? 'Oops!' : 'Success!'}
            </h3>
            <p className="popup-text">{popupMessage}</p>
            <button onClick={closePopup} className="popup-btn">
              {popupType === 'error' ? 'Try Again' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;