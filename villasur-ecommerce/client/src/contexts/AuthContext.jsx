import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('villasur_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('villasur_user', JSON.stringify(res.data.user));
    localStorage.setItem('villasur_token', res.data.token);
  };

  const register = async (email, password) => {
    const res = await axios.post('/api/auth/register', { email, password });
    setUser(res.data.user);
    localStorage.setItem('villasur_user', JSON.stringify(res.data.user));
    localStorage.setItem('villasur_token', res.data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('villasur_user');
    localStorage.removeItem('villasur_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 