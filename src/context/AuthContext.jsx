import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isDemoMode } from '../lib/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, check if we have a mock user in session
      const mockUser = sessionStorage.getItem('mockUser');
      if (mockUser) {
        setUser(JSON.parse(mockUser));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginDemo = (email) => {
    const demoUser = { uid: 'demo-user-123', email: email || 'demo@example.com', isDemo: true };
    sessionStorage.setItem('mockUser', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const logoutDemo = () => {
    sessionStorage.removeItem('mockUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginDemo, logoutDemo }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
