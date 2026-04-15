"use client";
// @ts-nocheck
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import { buildPermissionsMap, checkPermissionSync, getUserRoleKey } from '@/lib/rbac/permissionUtils';
import LoginPromptModal from './LoginPromptModal';

// ─── Permission Context ───────────────────────────────────────────────────────
const PermissionContext = createContext({ permissionsMap: {}, roleKey: 'guest', loaded: false });

export function PermissionProvider({ children }) {
  const { user } = useAuth();
  const [permissionsMap, setPermissionsMap] = useState({});
  const [loaded, setLoaded] = useState(false);
  const roleKey = getUserRoleKey(user);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const perms = await apiClient.get("/api/v1/" + "rolepermission", '-created_date', 1000);
        if (!cancelled) {
          setPermissionsMap(buildPermissionsMap(perms));
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  return (
    <PermissionContext.Provider value={{ permissionsMap, roleKey, loaded }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionContext);
}

// Check a single permission synchronously using context
export function usePermissionCheck(resourceKey, actionKey) {
  const { permissionsMap, roleKey } = useContext(PermissionContext);
  return checkPermissionSync(resourceKey, actionKey, roleKey, permissionsMap);
}

// ─── PermissionGate Component ─────────────────────────────────────────────────
/**
 * Wraps content with permission checking.
 * 
 * Props:
 *   resource: string - resourceKey
 *   action: string - actionKey  
 *   fallback: string - guestBehavior override
 *   context: string - context for LoginModal message
 *   children: ReactNode
 *   formData: object - for allow_form_fill context
 *   onLoginSuccess: function - called after successful login
 */
export default function PermissionGate({
  resource,
  action,
  fallback,
  context,
  children,
  formData,
  onLoginSuccess,
  className,
}) {
  const { permissionsMap, roleKey, loaded } = useContext(PermissionContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginContext, setLoginContext] = useState(context);

  if (!loaded) return <>{children}</>;

  const perm = checkPermissionSync(resource, action, roleKey, permissionsMap);
  const behavior = fallback || perm.guestBehavior;

  // If allowed, just render
  if (perm.allowed) {
    return <>{children}</>;
  }

  // Denied — apply behavior
  switch (behavior) {
    case 'full_block':
      return null;

    case 'redirect_login':
      return (
        <>
          <div
            className={className}
            onClick={() => setShowLoginModal(true)}
            style={{ cursor: 'pointer' }}
          >
            {children}
          </div>
          {showLoginModal && (
            <LoginPromptModal
              context={loginContext || `${resource}_${action}`}
              formData={formData}
              onClose={() => setShowLoginModal(false)}
              onSuccess={() => { setShowLoginModal(false); onLoginSuccess?.(); }}
            />
          )}
        </>
      );

    case 'allow_form_fill':
      // Intercept submission
      return (
        <>
          <div
            className={className}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLoginContext(context || `${resource}_submit`);
              setShowLoginModal(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            {children}
          </div>
          {showLoginModal && (
            <LoginPromptModal
              context={loginContext || `${resource}_submit`}
              formData={formData}
              onClose={() => setShowLoginModal(false)}
              onSuccess={() => { setShowLoginModal(false); onLoginSuccess?.(); }}
            />
          )}
        </>
      );

    case 'show_teaser':
      return (
        <>
          <div
            className={className}
            onClick={() => setShowLoginModal(true)}
            style={{ cursor: 'pointer' }}
          >
            {children}
          </div>
          {showLoginModal && (
            <LoginPromptModal
              context={loginContext || `${resource}_${action}`}
              formData={formData}
              onClose={() => setShowLoginModal(false)}
              onSuccess={() => { setShowLoginModal(false); onLoginSuccess?.(); }}
            />
          )}
        </>
      );

    case 'show_preview':
      return (
        <div className="relative">
          <div className="select-none pointer-events-none opacity-40 blur-sm">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl z-10">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🔒</div>
              <p className="font-bold text-gray-800 text-sm">Sign in to see full details</p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="mt-3 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Sign In
              </button>
            </div>
          </div>
          {showLoginModal && (
            <LoginPromptModal
              context={loginContext || `${resource}_${action}`}
              formData={formData}
              onClose={() => setShowLoginModal(false)}
              onSuccess={() => { setShowLoginModal(false); onLoginSuccess?.(); }}
            />
          )}
        </div>
      );

    default:
      // Default: show login modal on interaction
      return (
        <>
          <div className={className} onClick={() => setShowLoginModal(true)} style={{ cursor: 'pointer' }}>
            {children}
          </div>
          {showLoginModal && (
            <LoginPromptModal
              context={loginContext || 'default'}
              formData={formData}
              onClose={() => setShowLoginModal(false)}
              onSuccess={() => { setShowLoginModal(false); onLoginSuccess?.(); }}
            />
          )}
        </>
      );
  }
}