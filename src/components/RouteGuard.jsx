import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useRouteRedirector } from '@/lib/route-redirector';

/**
 * RouteGuard: Wraps the app to handle intelligent routing
 * Executes redirect rules on every route change
 */
export default function RouteGuard({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirector = useRouteRedirector(user, location, navigate);

  useEffect(() => {
    redirector.checkAndRedirect();
  }, [location.pathname, user, navigate, redirector]);

  return children;
}