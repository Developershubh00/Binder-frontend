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

  // Login with email/password; backend returns user with role for redirect
  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);

      if (response.token) {
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