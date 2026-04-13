import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isMobileSession } from '@/lib/mobile-detect';

// Paths that should NEVER be redirected (work identically on mobile & desktop)
const STATIC_PATHS = [
  '/about', '/contact', '/terms', '/careers', '/advertise',
  '/sitemap', '/thinkdar', '/user-benefits',
  '/auctions/how-it-works', '/auth', '/admin',
];

// Desktop → Mobile path mapping
const DESKTOP_TO_MOBILE = {
  '/':                          '/m',
  '/Home':                      '/m',
  '/search-properties':         '/m/find/property',
  '/kemedar/search-properties': '/m/find/property',
  '/search-projects':           '/m/find/project',
  '/kemedar/search-projects':   '/m/find/project',
  '/create/property':           '/m/add/property',
  '/kemedar/add/property':      '/m/add/property',
  '/create/buy-request':        '/m/add/buy-request',
  '/kemedar/add/buy-request':   '/m/add/buy-request',
  '/create/project':            '/m/add/project',
  '/kemedar/add/project':       '/m/add/project',
  '/kemetro':                   '/m/kemetro',
  '/kemework':                  '/m/kemework',
  '/kemefrac':                  '/m/kemefrac',
  '/auctions':                  '/m/auctions',
  '/kemetro/search':            '/m/kemetro/search',
  '/kemetro/cart':              '/m/kemetro/cart',
  '/kemetro/kemekits':          '/m/kemetro/kemekits',
  '/kemetro/surplus':           '/m/kemetro/surplus',
  '/kemetro/build':             '/m/kemetro/build',
  '/kemetro/flash':             '/m/kemetro/flash',
  '/kemework/find-professionals': '/m/kemework/find-professionals',
  '/kemework/tasks':            '/m/kemework/tasks',
  '/kemework/services':         '/m/kemework/browse-services',
  '/kemework/post-task':        '/m/kemework/post-task',
  '/kemedar/predict':           '/m/kemedar/predict',
  '/kemedar/life-score':        '/m/kemedar/life-score',
  '/kemedar/coach':             '/m/kemedar/coach',
  '/kemedar/live':              '/m/kemedar/live',
  '/kemedar/twin-cities':       '/m/kemedar/twin-cities',
  '/kemedar/pricing':           '/m/kemedar/pricing',
  '/dashboard':                 '/m/dashboard',
  '/dashboard/swap':            '/m/swap',
  '/dashboard/auctions':        '/m/dashboard/auctions',
};

// Prefix-based mappings (applied when no exact match found)
const PREFIX_MAP = [
  { from: '/cp/user',               to: '/m/cp/user' },
  { from: '/cp/agent',              to: '/m/cp/agent' },
  { from: '/cp/agency',             to: '/m/cp/agency' },
  { from: '/cp/developer',          to: '/m/cp/developer' },
  { from: '/cp/pro',                to: '/m/cp/pro' },
  { from: '/cp/company',            to: '/m/cp/company' },
  { from: '/kemedar/franchise',     to: '/m/kemedar/franchise' },
  { from: '/kemetro/seller',        to: '/m/kemetro/seller' },
  { from: '/kemetro/shipper',       to: '/m/kemetro/shipper' },
  { from: '/dashboard',             to: '/m/dashboard' },
  { from: '/kemetro/product',       to: '/m/kemetro/product' },
  { from: '/kemetro/kemekits',      to: '/m/kemetro/kemekits' },
  { from: '/kemetro/surplus',       to: '/m/kemetro/surplus' },
  { from: '/auctions',              to: '/m/auctions' },
  { from: '/kemefrac',              to: '/m/kemefrac' },
  { from: '/kemedar/ai-search',     to: '/m/kemedar/ai-search' },
  { from: '/kemedar/valuation',     to: '/m/kemedar/valuation' },
];

function toMobileRoute(path) {
  // Exact match first
  if (DESKTOP_TO_MOBILE[path]) return DESKTOP_TO_MOBILE[path];
  // Prefix match
  for (const { from, to } of PREFIX_MAP) {
    if (path.startsWith(from)) {
      return to + path.slice(from.length);
    }
  }
  // Generic fallback: prepend /m
  return '/m' + path;
}

function isStaticPath(path) {
  return STATIC_PATHS.some(s => path === s || path.startsWith(s + '/'));
}

export function useResponsiveRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef(null);

  const checkAndRedirect = () => {
    const path = location.pathname;
    const mobile = isMobileSession();

    if (mobile) {
      // Already on mobile route → no-op
      if (path.startsWith('/m')) return;
      // Static pages → no redirect
      if (isStaticPath(path)) return;
      // Admin → no redirect
      if (path.startsWith('/admin') || path.startsWith('/auth')) return;
      // Redirect to mobile equivalent
      const mobilePath = toMobileRoute(path);
      navigate(mobilePath, { replace: true });
    } else {
      // On desktop but on a /m/ route → strip it
      if (path.startsWith('/m/') || path === '/m') {
        const desktopPath = path === '/m' ? '/' : path.slice(2);
        navigate(desktopPath || '/', { replace: true });
      }
    }
  };

  // Run on every route change
  useEffect(() => {
    checkAndRedirect();
  }, [location.pathname]);

  // Run on resize (debounced 300ms)
  useEffect(() => {
    const handler = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(checkAndRedirect, 300);
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [location.pathname]);
}