import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('codesense_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('codesense_token') || null;
  });

  const login = (userData, jwtToken) => {
    setUser(userData);
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem('codesense_token', jwtToken);
    }
    localStorage.setItem('codesense_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('codesense_user');
    localStorage.removeItem('codesense_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
