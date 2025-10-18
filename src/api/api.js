// src/api/api.js
// Mock API with hardcoded credentials for prototype

// Mock user database
const mockUsers = {
  'master-admin': {
    email: 'admin@binder.com',
    password: 'admin123',
    role: 'master-admin',
    name: 'John Admin',
    id: '1',
  },
  'manager': {
    email: 'manager@binder.com',
    password: 'manager123',
    role: 'manager',
    name: 'Sarah Manager',
    id: '2',
  },
  'tenant': {
    email: 'tenant@binder.com',
    password: 'tenant123',
    role: 'tenant',
    name: 'Mike Tenant',
    id: '3',
  },
};

// Simulate API delay
const simulateDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generate mock token
const generateToken = (email) => {
  return `mock_token_${email}_${Date.now()}`;
};

// API Methods
export const api = {
  // Generic login
  login: async (credentials) => {
    await simulateDelay(1000);
    
    const { email, password } = credentials;
    
    // Find user by email
    const user = Object.values(mockUsers).find(u => u.email === email);
    
    if (!user) {
      throw {
        message: 'User not found. Please check your email.',
        status: 404,
      };
    }
    
    if (user.password !== password) {
      throw {
        message: 'Incorrect password. Please try again.',
        status: 401,
      };
    }
    
    const token = generateToken(email);
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword,
      message: 'Login successful',
    };
  },

  // Master Admin login
  loginMasterAdmin: async (credentials) => {
    await simulateDelay(1000);
    
    const { email, password } = credentials;
    const user = mockUsers['master-admin'];
    
    if (email !== user.email) {
      throw {
        message: 'Invalid master admin credentials.',
        status: 401,
      };
    }
    
    if (password !== user.password) {
      throw {
        message: 'Incorrect password for master admin.',
        status: 401,
      };
    }
    
    const token = generateToken(email);
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword,
      message: 'Master admin login successful',
    };
  },

  // Manager login
  loginManager: async (credentials) => {
    await simulateDelay(1000);
    
    const { email, password } = credentials;
    const user = mockUsers['manager'];
    
    if (email !== user.email) {
      throw {
        message: 'Invalid manager credentials.',
        status: 401,
      };
    }
    
    if (password !== user.password) {
      throw {
        message: 'Incorrect password for manager.',
        status: 401,
      };
    }
    
    const token = generateToken(email);
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword,
      message: 'Manager login successful',
    };
  },

  // Tenant login
  loginTenant: async (credentials) => {
    await simulateDelay(1000);
    
    const { email, password } = credentials;
    const user = mockUsers['tenant'];
    
    if (email !== user.email) {
      throw {
        message: 'Invalid tenant credentials.',
        status: 401,
      };
    }
    
    if (password !== user.password) {
      throw {
        message: 'Incorrect password for tenant.',
        status: 401,
      };
    }
    
    const token = generateToken(email);
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword,
      message: 'Tenant login successful',
    };
  },

  // Logout
  logout: async () => {
    await simulateDelay(500);
    return { message: 'Logout successful' };
  },

  // Get current user
  getCurrentUser: async () => {
    await simulateDelay(500);
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw {
        message: 'No user found',
        status: 401,
      };
    }
    
    return {
      user: JSON.parse(userStr),
    };
  },
};

// Export mock users for reference (optional)
export const getMockCredentials = () => {
  return {
    'master-admin': {
      email: 'admin@binder.com',
      password: 'admin123',
    },
    'manager': {
      email: 'manager@binder.com',
      password: 'manager123',
    },
    'tenant': {
      email: 'tenant@binder.com',
      password: 'tenant123',
    },
  };
};

export default api;