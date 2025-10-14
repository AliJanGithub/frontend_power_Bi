import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../constants/constants';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check stored login info when app loads
  useEffect(() => {
    const storedToken = localStorage.getItem('powerbi_token');
    const storedUser = localStorage.getItem('powerbi_user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Login function that saves token + user
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${config.backend_api}/api/auth/login`, {
        email,
        password,
      });

      // Example response: { success: true, token: "abc123", user: {...} }
      const result = response.data;

      if (result.success && result.token) {
        localStorage.setItem('powerbi_token', result.token);
        localStorage.setItem('powerbi_user', JSON.stringify(result.user));

        setUser(result.user);
        setIsAuthenticated(true);

        return { success: true, user: result.user };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server error, please try again later' };
    }
  };

  // ✅ Logout clears all data
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('powerbi_user');
    localStorage.removeItem('powerbi_token');
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post(`${config.backend_api}/forgot-password`, { email });
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await axios.post(`${config.backend_api}/reset-password`, { token, password });
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('powerbi_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Hook for using auth anywhere
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
