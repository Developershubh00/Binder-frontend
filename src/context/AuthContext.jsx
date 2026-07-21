// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';
import * as authService from '../api/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Clear per-session "Add later" dismissals for the logo prompt so a fresh
// login re-prompts (until a logo actually exists).
const clearLogoPromptDismissals = () => {
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('logoPromptDismissed:')) {
        sessionStorage.removeItem(key);
      }
    }
  } catch {
    /* sessionStorage unavailable — nothing to clear */
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getAccessToken();
      const savedUser = authService.getUser();

      if (token && savedUser) {
        try {
          setUser(savedUser);
          setIsAuthenticated(true);
          
          // Verify token with backend
          const userData = await api.getCurrentUser();
          setUser(userData.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid, clear storage
          authService.clearTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // The refresh token is dead (expired or blacklisted) — the session is really
  // over, so drop to signed-out state. Fired by authService after a refresh is
  // genuinely rejected; transient network/5xx failures never reach here.
  useEffect(() => {
    const onSessionExpired = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener(authService.SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => window.removeEventListener(authService.SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

  // Login with email/password; backend returns user with role for redirect
  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);

      if (response.token) {
        clearLogoPromptDismissals();
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      }

      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'An error occurred during login',
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage and state regardless of API call success
      authService.clearTokens();
      clearLogoPromptDismissals();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    authService.setUser(userData);
  };

  // Refetch current user from backend (e.g. after completing onboarding)
  const refreshUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      if (userData?.user) {
        setUser(userData.user);
        authService.setUser(userData.user);
      }
    } catch (err) {
      console.error('refreshUser failed', err);
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;