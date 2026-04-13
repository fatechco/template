import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { recoverSnapSession } from '@/lib/snapSessionRecovery';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);
  const [recoveredSnapSession, setRecoveredSnapSession] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // Fetch public settings using native fetch to avoid SDK duplicate React issue
      const headers = { 'X-App-Id': appParams.appId };
      if (appParams.token) headers['Authorization'] = `Bearer ${appParams.token}`;

      try {
        const res = await fetch(`/api/apps/public/prod/public-settings/by-id/${appParams.appId}`, { headers });
        if (res.ok) {
          const publicSettings = await res.json();
          setAppPublicSettings(publicSettings);
        } else if (res.status === 403) {
          const data = await res.json().catch(() => ({}));
          const reason = data?.extra_data?.reason;
          if (reason === 'auth_required' || reason === 'user_not_registered') {
            setAuthError({ type: reason, message: data.message || reason });
          } else {
            setAuthError({ type: reason || 'unknown', message: data.message || 'Access denied' });
          }
          setIsLoadingPublicSettings(false);
          setIsLoadingAuth(false);
          return;
        }
      } catch (e) {
        // Non-fatal: continue even if public settings fail
      }

      setIsLoadingPublicSettings(false);

      if (appParams.token) {
        await checkUserAuth();
      } else {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({ type: 'unknown', message: error.message || 'An unexpected error occurred' });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);

      // Snap & Fix guest session recovery
      recoverSnapSession(currentUser).then(recovered => {
        if (recovered) {
          setRecoveredSnapSession(recovered);
        }
      }).catch(() => {});
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsAuthenticated(false);
      if (error.status === 401 || error.status === 403) {
        setAuthError({ type: 'auth_required', message: 'Authentication required' });
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      base44.auth.logout(window.location.href);
    } else {
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      recoveredSnapSession,
      setRecoveredSnapSession,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};