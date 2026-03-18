// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import './Login.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState('');
//   const [popupType, setPopupType] = useState('error');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const displayPopup = (message, type = 'error') => {
//     setPopupMessage(message);
//     setPopupType(type);
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setPopupMessage('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const credentials = {
//         email: formData.email,
//         password: formData.password,
//       };

//       const result = await login(credentials);

//       if (result.success) {
//         const username = result.user?.username || result.user?.name || result.username || 'User';
//         displayPopup(`Welcome back, ${username}! Redirecting...`, 'success');

//         const role = result.user?.highest_role || result.user?.role || result.user?.role_type;
//         setTimeout(() => {
//           if (role === 'master-admin' || role === 'master_admin') {
//             navigate('/admin/dashboard');
//           } else if (role === 'manager') {
//             navigate('/manager/dashboard');
//           } else if (role === 'tenant') {
//             navigate('/tenant/dashboard');
//           } else {
//             navigate('/dashboard');
//           }
//         }, 1500);
//       } else {
//         displayPopup(result.message || 'Login failed. Please try again.');
//       }
//     } catch (error) {
//       displayPopup(
//         error.message || 'An unexpected error occurred. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // No prefilled data - user enters email and password only
//   return (
//     <div className="login-container">
//       {/* Left Side - Gradient Background */}
//       <div className="login-left-side">
//         <div className="brand-section">
//           <h2 className="brand-title">A WISE QUOTE</h2>
//         </div>
        
//         <div className="hero-content">
//           <h1 className="hero-title">Get Everything You Want</h1>
//           <p className="hero-subtitle">
//             You can get everything you want if you work hard, 
//             trust the process, and stick to the plan.
//           </p>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="login-right-side">
//         <div className="login-form-container">
//           <div className="brand-logo">
//             <span className="logo-text">Binder</span>
//           </div>

//           <div className="form-header">
//             <h1 className="form-title">Welcome Back</h1>
//             <p className="form-subtitle">Enter your email and password to access your account</p>
//           </div>

//           <form onSubmit={handleSubmit} className="login-form">
//             {/* Email Input */}
//             <div className="form-group">
//               <label className="input-label">Email</label>
//               <div className="input-container">
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email"
//                   className={`input-field ${errors.email ? 'error' : ''}`}
//                 />
//               </div>
//               {errors.email && (
//                 <span className="error-text">{errors.email}</span>
//               )}
//             </div>

//             {/* Password Input */}
//             <div className="form-group">
//               <label className="input-label">Password</label>
//               <div className="input-container">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   className={`input-field ${errors.password ? 'error' : ''}`}
//                 />
//                 <button
//                   type="button"
//                   className="toggle-password"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? '👁️' : '👁️‍🗨️'}
//                 </button>
//               </div>
//               {errors.password && (
//                 <span className="error-text">{errors.password}</span>
//               )}
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="form-options">
//               <label className="remember-checkbox">
//                 <input
//                   type="checkbox"
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleChange}
//                 />
//                 <span className="checkmark"></span>
//                 Remember me
//               </label>
//               <a href="/forgot-password" className="forgot-link">
//                 Forgot Password
//               </a>
//             </div>

//             {/* Sign In Button */}
//             <button type="submit" className="signin-button" disabled={loading}>
//               {loading ? (
//                 <span className="btn-loading">
//                   <span className="spinner"></span>
//                   Signing In...
//                 </span>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           {/* Sign Up Link */}
//           <div className="signup-section">
//             <span className="signup-text">Don't have an account? </span>
//             <a href="/register" className="signup-link">Sign Up</a>
//           </div>
//         </div>
//       </div>

//       {/* Popup Modal */}
//       {showPopup && (
//         <div className="popup-backdrop" onClick={closePopup}>
//           <div
//             className={`popup-modal ${popupType}`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="popup-icon-wrapper">
//               {popupType === 'error' ? (
//                 <span className="popup-icon error">✕</span>
//               ) : (
//                 <span className="popup-icon success">✓</span>
//               )}
//             </div>
//             <h3 className="popup-title">
//               {popupType === 'error' ? 'Oops!' : 'Success!'}
//             </h3>
//             <p className="popup-text">{popupMessage}</p>
//             <button onClick={closePopup} className="popup-btn">
//               {popupType === 'error' ? 'Try Again' : 'Continue'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // View state: 'landing' | 'login'
  const [currentView, setCurrentView] = useState('landing');

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

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState('input'); // 'input' | 'confirm' | 'sent'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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
    if (!validateForm()) return;
    setLoading(true);
    try {
      const credentials = { email: formData.email, password: formData.password };
      const result = await login(credentials);
      if (result.success) {
        const username = result.user?.username || result.user?.name || result.username || 'User';
        displayPopup(`Welcome back, ${username}! Redirecting...`, 'success');
        const role = result.user?.highest_role || result.user?.role || result.user?.role_type;
        setTimeout(() => {
          if (role === 'master-admin' || role === 'master_admin') navigate('/admin/dashboard');
          else if (role === 'manager') navigate('/manager/dashboard');
          else if (role === 'tenant') navigate('/tenant/dashboard');
          else navigate('/dashboard');
        }, 1500);
      } else {
        displayPopup(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      displayPopup(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password handlers
  const openForgotModal = () => {
    setForgotEmail('');
    setForgotEmailError('');
    setForgotStep('input');
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep('input');
    setForgotEmail('');
    setForgotEmailError('');
  };

  const handleForgotSendRequest = () => {
    if (!forgotEmail.trim()) {
      setForgotEmailError('Username / Email is required');
      return;
    }
    setForgotEmailError('');
    setForgotStep('confirm');
  };

  const handleForgotYes = () => {
    setForgotStep('sent');
    setTimeout(() => {
      closeForgotModal();
      displayPopup('Password reset request sent to your admin!', 'success');
    }, 1500);
  };

  const handleForgotNo = () => {
    setForgotStep('input');
  };

  // ─── LANDING PAGE ────────────────────────────────────────────────────────────
  if (currentView === 'landing') {
    return (
      <div className="landing-container">
        <div className="landing-inner">
          <div className="landing-logo-block">
            <div className="landing-logo-icon">
              <span className="landing-logo-dots">○○○</span>
            </div>
            <h1 className="landing-logo-name">BINDER OS</h1>
            <p className="landing-tagline-top">YOUR COMPANY'S NERVOUS SYSTEM</p>
          </div>

          <div className="landing-body">
            <p className="landing-tagline-main">
              YOU TRACK EVERYTHING MOVING THROUGH YOUR COMPANY
            </p>
            <p className="landing-tagline-sub">
              SO. NOTHING GETS LOST BETWEEN UNIT, VENDORS, PROCESSES
            </p>
          </div>

          <div className="landing-action">
            <button
              className="landing-login-btn"
              onClick={() => setCurrentView('login')}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGIN PAGE ──────────────────────────────────────────────────────────────
  return (
    <div className="login-page">
      {/* Back to landing */}
      <button className="back-to-landing" onClick={() => setCurrentView('landing')}>
        ← Back
      </button>

      <div className="login-card">
        {/* Logo */}
        <div className="login-card-logo">
          <span className="logo-dots">○○○</span>
          <span className="logo-name">Binder</span>
        </div>

        <div className="login-card-header">
          <h2 className="login-card-title">Welcome Back</h2>
          <p className="login-card-subtitle">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
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
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
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
            {errors.password && <span className="error-text">{errors.password}</span>}
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
            <button
              type="button"
              className="forgot-link"
              onClick={openForgotModal}
            >
              Forgot Password
            </button>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Signing In...
              </span>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        <div className="signup-section">
          <span className="signup-text">Don't have an account? </span>
          <a href="/register" className="signup-link">Sign Up</a>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ─────────────────────────────────────────── */}
      {showForgotModal && (
        <div className="popup-backdrop" onClick={closeForgotModal}>
          <div
            className="popup-modal forgot-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="modal-close-btn" onClick={closeForgotModal}>
              ✕
            </button>

            {/* Logo inside modal */}
            <div className="modal-logo">
              <span className="logo-dots">○○○</span>
              <span className="logo-name">Binder</span>
            </div>

            {forgotStep === 'input' && (
              <>
                <h3 className="popup-title">Forgot Password?</h3>
                <p className="popup-text">
                  Enter your username or email to send a reset request to your admin.
                </p>
                <div className="forgot-input-group">
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      setForgotEmailError('');
                    }}
                    placeholder="USERNAME / EMAIL"
                    className={`input-field forgot-input ${forgotEmailError ? 'error' : ''}`}
                  />
                  {forgotEmailError && (
                    <span className="error-text">{forgotEmailError}</span>
                  )}
                </div>
                <button
                  className="forgot-send-btn"
                  onClick={handleForgotSendRequest}
                >
                  SEND REQUEST FOR RESET PASSWORD TO ADMIN
                </button>
              </>
            )}

            {forgotStep === 'confirm' && (
              <>
                <h3 className="popup-title">Confirm Request</h3>
                <p className="popup-text">
                  Send a password reset request for <strong>{forgotEmail}</strong> to your admin?
                </p>
                <div className="forgot-yn-row">
                  <button className="forgot-yes-btn" onClick={handleForgotYes}>
                    YES
                  </button>
                  <button className="forgot-no-btn" onClick={handleForgotNo}>
                    NO
                  </button>
                </div>
              </>
            )}

            {forgotStep === 'sent' && (
              <>
                <div className="popup-icon-wrapper">
                  <span className="popup-icon success">✓</span>
                </div>
                <h3 className="popup-title">Request Sent!</h3>
                <p className="popup-text">
                  Your admin has been notified. They will reset your password shortly.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── SUCCESS / ERROR POPUP ─────────────────────────────────────────── */}
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