import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockDatabase } from '../data/mockDatabase.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shopez_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Auth verification backend offline, using mock session');
        const mockUser = mockDatabase.verifyToken(token);
        if (mockUser) setUser(mockUser);
        else logout();
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('shopez_token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, username: data.username, email: data.email, role: data.role, balance: data.balance });
      return data;
    } catch (err) {
      console.warn('Login backend offline, using mock session');
      try {
        const mockData = mockDatabase.login(email, password);
        localStorage.setItem('shopez_token', mockData.token);
        setToken(mockData.token);
        setUser({ _id: mockData._id, username: mockData.username, email: mockData.email, role: mockData.role, balance: mockData.balance });
        return mockData;
      } catch (mockErr) {
        setError(mockErr.message);
        throw mockErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('shopez_token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, username: data.username, email: data.email, role: data.role, balance: data.balance });
      return data;
    } catch (err) {
      console.warn('Register backend offline, using mock session');
      try {
        const mockData = mockDatabase.register(username, email, password, role);
        localStorage.setItem('shopez_token', mockData.token);
        setToken(mockData.token);
        setUser({ _id: mockData._id, username: mockData.username, email: mockData.email, role: mockData.role, balance: mockData.balance });
        return mockData;
      } catch (mockErr) {
        setError(mockErr.message);
        throw mockErr;
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh balance from server (called after trades)
  const refreshBalance = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(prev => prev ? { ...prev, balance: data.balance } : prev);
      }
    } catch (_) {}
  };

  const logout = () => {
    localStorage.removeItem('shopez_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, setError, refreshBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
