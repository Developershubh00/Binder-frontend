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
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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

      const result = await login(credentials);

      if (result.success) {
        const username = result.user?.username || result.user?.name || result.username || 'User';
        displayPopup(`Welcome back, ${username}! Redirecting...`, 'success');

        const role = result.user?.highest_role || result.user?.role || result.user?.role_type;
        setTimeout(() => {
          if (role === 'master-admin' || role === 'master_admin') {
            navigate('/admin/dashboard');
          } else if (role === 'manager') {
            navigate('/manager/dashboard');
          } else if (role === 'tenant') {
            navigate('/tenant/dashboard');
          } else {
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

  // No prefilled data - user enters email and password only
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