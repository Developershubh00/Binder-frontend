/**
 * Auth Service - Backend API Integration
 * Handles all authentication-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://binder-backend-0szj.onrender.com/api/';

/**
 * Get access token from localStorage
 */
const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Get refresh token from localStorage
 */
const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

/**
 * Set tokens in localStorage
 */
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

/**
 * Clear tokens from localStorage
 */
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

/**
 * Get user from localStorage
 */
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set user in localStorage
 */
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Refresh access token
 */
const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    return false;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return true;
    } else {
      clearTokens();
      return false;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    clearTokens();
    return false;
  }
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAccessToken();
  
  // Don't set Content-Type for FormData, browser will set it with boundary
  const isFormData = options.body instanceof FormData;
  
  const defaultHeaders = {};
  
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', fullUrl, config.method || 'GET');
    
    const response = await fetch(fullUrl, config);
    
    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && token) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry request with new token
        config.headers['Authorization'] = `Bearer ${getAccessToken()}`;
        return await fetch(fullUrl, config);
      }
    }
    
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Register new user
 */
export const register = async (userData) => {
  const response = await apiRequest('auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      password_confirm: userData.passwordConfirm,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
    }),
  });
  
  return await response.json();
};

/**
 * Login user (direct login)
 */
export const login = async (email, password) => {
  const url = `${API_BASE_URL}auth/login/`;
  console.log('Login request to:', url);
  
  const response = await apiRequest('auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  console.log('Login response status:', response.status);
  
  // Check if response is ok before parsing
  if (!response.ok) {
    let errorData;
    try {
      const text = await response.text();
      console.error('Login error response:', text);
      errorData = JSON.parse(text);
    } catch (e) {
      errorData = {
        message: `Server error: ${response.status} ${response.statusText}`,
        status_code: response.status,
      };
    }
    
    // Throw error with proper structure
    const error = new Error(errorData.message || errorData.detail || errorData.error || 'Login failed');
    error.status = errorData.status_code || response.status;
    error.data = errorData;
    throw error;
  }
  
  const data = await response.json();
  console.log('Login success data:', data);
  
  if (data.status === 'success') {
    setTokens(data.data.tokens.access, data.data.tokens.refresh);
    setUser(data.data.user);
  }
  
  return data;
};

/**
 * Request OTP for login (Step 1)
 */
export const requestOTP = async (email, password) => {
  const response = await apiRequest('auth/login/request-otp/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  return await response.json();
};

/**
 * Verify OTP and login (Step 2)
 */
export const verifyOTP = async (email, otp) => {
  const response = await apiRequest('auth/login/verify-otp/', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
  
  const data = await response.json();
  
  if (data.status === 'success') {
    setTokens(data.data.tokens.access, data.data.tokens.refresh);
    setUser(data.data.user);
  }
  
  return data;
};

/**
 * Logout user
 */
export const logout = async () => {
  const refresh = getRefreshToken();
  
  if (refresh) {
    try {
      await apiRequest('auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  clearTokens();
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const response = await apiRequest('auth/me/');
  const data = await response.json();
  
  if (data.id) {
    setUser(data);
  }
  
  return data;
};

/**
 * Verify email
 */
export const verifyEmail = async (token) => {
  const response = await apiRequest('auth/verify-email/', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  
  return await response.json();
};

/**
 * Resend verification email
 */
export const resendVerification = async (email) => {
  const response = await apiRequest('auth/resend-verification/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  
  return await response.json();
};

/**
 * Set password (for new users)
 */
export const setPassword = async (token, password, passwordConfirm) => {
  const response = await apiRequest('auth/set-password/', {
    method: 'POST',
    body: JSON.stringify({
      token,
      password,
      password_confirm: passwordConfirm,
    }),
  });
  
  return await response.json();
};

// Export utility functions for use in other parts of the app
export { getAccessToken, getRefreshToken, getUser, setUser, clearTokens };

