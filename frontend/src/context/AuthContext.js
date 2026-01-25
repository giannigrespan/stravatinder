import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gm_token'));
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const newToken = response.data.access_token;
    localStorage.setItem('gm_token', newToken);
    setToken(newToken);
    return response.data;
  };

  const register = async (email, password, name) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, { email, password, name });
    const newToken = response.data.access_token;
    localStorage.setItem('gm_token', newToken);
    setToken(newToken);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('gm_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const response = await api.put('/api/profile', profileData);
    setUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!token,
      api
    }}>
      {children}
    </AuthContext.Provider>
  );
};
