import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PolyhedraBackground from "../components/PolyhedraBackground";
import PolyhedraLogo from "../components/PolyhedraLogo";
import "./Login.css";
import { scrollToFirstError } from "@/utils/scrollToFirstError";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const [showPassword, setShowPassword] = useState(false);

  // NEW — controls the slide-up login card
  const [showLoginCard, setShowLoginCard] = useState(false);

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState("input"); // 'input' | 'confirm' | 'sent'
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.login.trim()) {
      newErrors.login = "Email or username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
      return false;
    }
    return true;
  };

  const displayPopup = (message, type = "error") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const credentials = {
        login: formData.login,
        password: formData.password,
        rememberMe: formData.rememberMe,
      };
      const result = await login(credentials);
      if (result.success) {
        const username =
          result.user?.username ||
          result.user?.name ||
          result.username ||
          "User";
        displayPopup(`Welcome back, ${username}! Redirecting...`, "success");
        const role =
          result.user?.highest_role ||
          result.user?.role ||
          result.user?.role_type;
        setTimeout(() => {
          if (role === "master-admin" || role === "master_admin")
            navigate("/admin/dashboard");
          else if (role === "manager") navigate("/manager/dashboard");
          else if (role === "tenant") navigate("/tenant/dashboard");
          else navigate("/dashboard");
        }, 1500);
      } else {
        displayPopup(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      displayPopup(
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password handlers
  const openForgotModal = () => {
    setForgotEmail("");
    setForgotEmailError("");
    setForgotStep("input");
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep("input");
    setForgotEmail("");
    setForgotEmailError("");
  };

  const handleForgotSendRequest = () => {
    if (!forgotEmail.trim()) {
      setForgotEmailError("Username / Email is required");
      return;
    }
    setForgotEmailError("");
    setForgotStep("confirm");
  };

  const handleForgotYes = () => {
    setForgotStep("sent");
    setTimeout(() => {
      closeForgotModal();
      displayPopup("Password reset request sent to your admin!", "success");
    }, 1500);
  };

  const handleForgotNo = () => {
    setForgotStep("input");
  };

  // First click opens the slide-up card; subsequent clicks submit the form.
  // Button stays type="button" so it never triggers a native submit on the
  // first click (which would otherwise validate an empty form).
  const handleLoginNowClick = () => {
    if (loading) return;
    if (!showLoginCard) {
      setShowLoginCard(true);
      return;
    }
    formRef.current?.requestSubmit();
  };

  return (
    <div className="login-split-container">
      {/* Polyhedra animation fills the viewport behind everything */}
      <PolyhedraBackground />

      <div className="split-content-row">
        {/* ═══ LEFT — Orange marketing panel ═══════════════════════ */}
        <div className="split-left">
          <div className="split-left-inner">
            {/* TOP content block */}
            <div className="split-left-top">
              <div className="split-logo-row">
                <div className="split-logo-img-wrap">
                  <PolyhedraLogo />
                </div>
                <h1 className="split-brand-name">Binder OS</h1>
              </div>

              <p className="split-tagline-top">COMPANY NERVOUS SYSTEM</p>

              {/* <div className="split-description">
                <p className="split-description-lead">
                  One system of record for complete traceability of operations — from raw material to finished goods.
                </p>
                <p className="split-description-body">
                  Binder OS replaces the chaos of spreadsheets, WhatsApp groups, and disconnected registers with a single manufacturing operating system built for India's textile ecosystem. We start where every company starts — with inventory.
                </p>
              </div> */}

              <div className="split-tagline-block">
                <p className="split-tagline-main">
                  TRACK EVERYTHING MOVING THROUGH YOUR COMPANY.
                  <br />
                  SO, NOTHING GETS LOST BETWEEN UNIT, VENDORS, PROCESSES.
                </p>
                {/* <p className="split-tagline-sub">
                  SO. NOTHING GETS LOST BETWEEN UNIT, VENDORS, PROCESSES
                </p> */}
              </div>
            </div>

            {/* BOTTOM CTA — sign up */}
            <div className="split-cta-row left-cta">
              <span className="split-cta-label">New to BinderOS?</span>
              <button
                className="split-register-btn"
                onClick={() => navigate("/register-company")}
              >
                SIGN-UP REQUEST
                <span className="split-register-arrow">→</span>
              </button>

              {/* Mobile-only LOGIN CTA (hidden on desktop/tablet) */}
              <span className="split-cta-label mobile-login-label">
                Already have an account?
              </span>
              <button
                className="split-register-btn login-now-btn mobile-login-btn"
                type="button"
                onClick={handleLoginNowClick}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    SIGNING IN...
                  </span>
                ) : (
                  <>
                    LOGIN NOW
                    <span className="split-register-arrow">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT — polyhedra bg + LOGIN NOW button + slide-up card ══ */}
        <div className="split-right">
          <div className="split-right-inner">
            {/* TOP spacer — lets polyhedra breathe; pushes CTA to bottom */}
            <div className="split-right-top" aria-hidden="true" />

            {/* BOTTOM CTA — login (stays visible; submits the form once card is open) */}
            <div className="split-cta-row right-cta">
              <span className="split-cta-label">Already have an account?</span>
              <button
                className="split-register-btn login-now-btn"
                type="button"
                onClick={handleLoginNowClick}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    SIGNING IN...
                  </span>
                ) : (
                  <>
                    LOGIN NOW
                    <span className="split-register-arrow">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ LOGIN CARD OVERLAY — outside split-right so mobile (which hides
            the right panel) still has it accessible. The actual submit
            happens via the LOGIN NOW button below, which sets form="loginForm" ═══ */}
      <div className={`login-card-wrapper ${showLoginCard ? "visible" : ""}`}>
        <div className="login-card">
          <button
            type="button"
            className="card-close-btn"
            onClick={() => setShowLoginCard(false)}
            aria-label="Back"
          >
            ←
          </button>

          <div className="login-card-header">
            <h2 className="login-card-title">Welcome to Binder OS</h2>
            <p className="login-card-subtitle">
              Enter your email or username to access your account
            </p>
          </div>

          <form
            ref={formRef}
            id="loginForm"
            onSubmit={handleSubmit}
            className="login-form"
          >
            <div className="form-group">
              <label className="input-label">Email or Username</label>
              <div className="input-container">
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Enter your email or username"
                  className={`input-field ${errors.login ? "error" : ""}`}
                />
              </div>
              {errors.login && (
                <span className="error-text">{errors.login}</span>
              )}
            </div>

            <div className="form-group">
              <label className="input-label">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input-field ${errors.password ? "error" : ""}`}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

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
          </form>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ─────────────────────────────────── */}
      {showForgotModal && (
        <div className="popup-backdrop" onClick={closeForgotModal}>
          <div
            className="popup-modal forgot-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeForgotModal}>
              ✕
            </button>

            {forgotStep === "input" && (
              <>
                <h3 className="popup-title">Forgot Password?</h3>
                <p className="popup-text">
                  Enter your username or email to send a reset request to your
                  admin.
                </p>
                <div className="forgot-input-group">
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      setForgotEmailError("");
                    }}
                    placeholder="USERNAME / EMAIL"
                    className={`input-field forgot-input ${forgotEmailError ? "error" : ""}`}
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

            {forgotStep === "confirm" && (
              <>
                <h3 className="popup-title">Confirm Request</h3>
                <p className="popup-text">
                  Send a password reset request for{" "}
                  <strong>{forgotEmail}</strong> to your admin?
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

            {forgotStep === "sent" && (
              <>
                <div className="popup-icon-wrapper">
                  <span className="popup-icon success">✓</span>
                </div>
                <h3 className="popup-title">Request Sent!</h3>
                <p className="popup-text">
                  Your admin has been notified. They will reset your password
                  shortly.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── SUCCESS / ERROR POPUP ─────────────────────────────────── */}
      {showPopup && (
        <div className="popup-backdrop" onClick={closePopup}>
          <div
            className={`popup-modal ${popupType}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-icon-wrapper">
              {popupType === "error" ? (
                <span className="popup-icon error">✕</span>
              ) : (
                <span className="popup-icon success">✓</span>
              )}
            </div>
            <h3 className="popup-title">
              {popupType === "error" ? "Oops!" : "Success!"}
            </h3>
            <p className="popup-text">{popupMessage}</p>
            <button onClick={closePopup} className="popup-btn">
              {popupType === "error" ? "Try Again" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
