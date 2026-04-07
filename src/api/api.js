// src/api/api.js
// API service - now uses real backend authentication
import * as authService from './authService';

// API Methods - using real backend auth service
export const api = {
  // Generic login - uses backend API
  login: async (credentials) => {
    const { login: loginValue, email, password, rememberMe } = credentials;
    try {
      const response = await authService.login(loginValue || email, password, rememberMe);
      
      if (response.status === 'success') {
        return {
          token: response.data.tokens.access,
          user: response.data.user,
          message: response.message || 'Login successful',
        };
      } else {
        throw {
          message: response.message || 'Login failed',
          status: response.status_code || 400,
        };
      }
    } catch (error) {
      // Re-throw with proper error structure
      throw {
        message: error.message || error.data?.message || 'Login failed',
        status: error.status || error.data?.status_code || 500,
        data: error.data,
      };
    }
  },

  // Master Admin login - uses backend API
  loginMasterAdmin: async (credentials) => {
    const { login: loginValue, email, password, rememberMe } = credentials;
    try {
      const response = await authService.login(loginValue || email, password, rememberMe);
      
      if (response.status === 'success') {
        // Check if user has master admin role
        const user = response.data.user;
        if (user.role !== 'master-admin' && user.role !== 'master_admin') {
          throw {
            message: 'Invalid master admin credentials.',
            status: 403,
          };
        }
        
        return {
          token: response.data.tokens.access,
          user: user,
          message: 'Master admin login successful',
        };
      } else {
        throw {
          message: response.message || 'Login failed',
          status: response.status_code || 400,
        };
      }
    } catch (error) {
      // Re-throw with proper error structure
      throw {
        message: error.message || error.data?.message || 'Login failed',
        status: error.status || error.data?.status_code || 500,
        data: error.data,
      };
    }
  },

  // Manager login - uses backend API
  loginManager: async (credentials) => {
    const { login: loginValue, email, password, rememberMe } = credentials;
    try {
      const response = await authService.login(loginValue || email, password, rememberMe);
      
      if (response.status === 'success') {
        // Check if user has manager role
        const user = response.data.user;
        if (user.role !== 'manager') {
          throw {
            message: 'Invalid manager credentials.',
            status: 403,
          };
        }
        
        return {
          token: response.data.tokens.access,
          user: user,
          message: 'Manager login successful',
        };
      } else {
        throw {
          message: response.message || 'Login failed',
          status: response.status_code || 400,
        };
      }
    } catch (error) {
      // Re-throw with proper error structure
      throw {
        message: error.message || error.data?.message || 'Login failed',
        status: error.status || error.data?.status_code || 500,
        data: error.data,
      };
    }
  },

  // Tenant login - uses backend API
  loginTenant: async (credentials) => {
    const { login: loginValue, email, password, rememberMe } = credentials;
    try {
      const response = await authService.login(loginValue || email, password, rememberMe);
      
      if (response.status === 'success') {
        // Check if user has tenant role
        const user = response.data.user;
        if (user.role !== 'tenant') {
          throw {
            message: 'Invalid tenant credentials.',
            status: 403,
          };
        }
        
        return {
          token: response.data.tokens.access,
          user: user,
          message: 'Tenant login successful',
        };
      } else {
        throw {
          message: response.message || 'Login failed',
          status: response.status_code || 400,
        };
      }
    } catch (error) {
      // Re-throw with proper error structure
      throw {
        message: error.message || error.data?.message || 'Login failed',
        status: error.status || error.data?.status_code || 500,
        data: error.data,
      };
    }
  },

  // Logout - uses backend API
  logout: async () => {
    await authService.logout();
    return { message: 'Logout successful' };
  },

  // Get current user - uses backend API
  getCurrentUser: async () => {
    try {
      const user = await authService.getCurrentUser();
      return {
        user: user,
      };
    } catch (error) {
      throw {
        message: error.message || 'No user found',
        status: 401,
      };
    }
  },
};

export default api;