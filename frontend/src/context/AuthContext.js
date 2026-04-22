import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, getMe } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('taskmanager_token');
    const savedUser = localStorage.getItem('taskmanager_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('taskmanager_token');
          localStorage.removeItem('taskmanager_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerUser(data);
    const { token, user: userData } = res.data;
    localStorage.setItem('taskmanager_token', token);
    localStorage.setItem('taskmanager_user', JSON.stringify(userData));
    setUser(userData);
    toast.success('Welcome to TaskManager! 🎉');
    return res.data;
  }, []);

  const login = useCallback(async (data) => {
    const res = await loginUser(data);
    const { token, user: userData } = res.data;
    localStorage.setItem('taskmanager_token', token);
    localStorage.setItem('taskmanager_user', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${userData.name.split(' ')[0]}! 👋`);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('taskmanager_token');
    localStorage.removeItem('taskmanager_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
