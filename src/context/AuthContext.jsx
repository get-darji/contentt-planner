import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const GOOGLE_USER_STORAGE_KEY = 'darji_google_user';
const LEGACY_USER_STORAGE_KEY = 'regimes_user';

const decodeJwtPayload = (token) => {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join('')
  );

  return JSON.parse(json);
};

const buildGoogleUser = (credential) => {
  const profile = decodeJwtPayload(credential);

  return {
    id: profile.sub,
    name: profile.name,
    email: profile.email,
    avatar: profile.picture,
    role: 'Google user',
    workspaceId: 'ws_darji_01'
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(user));

  useEffect(() => {
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY);

    if (user) {
      localStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(GOOGLE_USER_STORAGE_KEY);
    }
  }, [user]);

  const signInWithGoogleCredential = (credential) => {
    const newUser = buildGoogleUser(credential);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, signInWithGoogleCredential }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
