/**
 * Authentication utility functions
 * Manages token storage, retrieval, and user session
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const auth = {
  // Store token and user after successful login/registration
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Retrieve stored token
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  // Store user information
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Retrieve stored user information
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(TOKEN_KEY);
    }
    return false;
  },

  // Clear authentication data (logout)
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // Clear all stored data
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  },
};

export default auth;
