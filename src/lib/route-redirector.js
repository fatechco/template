/**
 * Intelligent Route Redirector
 * Handles screen-size-based routing, role-based dashboard routing, and legacy redirects
 */

export function useRouteRedirector(user, location, navigate) {
  const redirector = {
    /**
     * Check if screen is mobile (< 768px or PWA standalone)
     */
    isMobileSession: () => {
      const isSmallScreen = window.innerWidth < 768;
      const isStandalone = window.navigator.standalone === true || 
                          window.matchMedia("(display-mode: standalone)").matches;
      return isSmallScreen || isStandalone;
    },

    getDesktopRoute: (mobilePath) => {
      const path = mobilePath.replace(/^\/m\//, '/');
      if (path.startsWith('/kemetro/seller/')) return path;
      if (path.startsWith('/kemedar/')) return path;
      if (path.startsWith('/kemework/')) return path;
      if (path.startsWith('/dashboard/')) return path;
      return path;
    },

    getMobileRoute: (desktopPath) => {
      if (desktopPath.startsWith('/m/')) return desktopPath;
      if (desktopPath.startsWith('/auth/')) return desktopPath;
      if (desktopPath.startsWith('/admin')) return desktopPath;
      if (['/', '/about', '/contact', '/advertise', '/careers', '/terms', '/privacy', '/help'].includes(desktopPath)) {
        return desktopPath;
      }
      if (desktopPath.startsWith('/dashboard/')) {
        return `/m${desktopPath}`;
      }
      if (desktopPath.startsWith('/kemetro') && !desktopPath.includes('/seller') && !desktopPath.includes('/shipper') && !desktopPath.includes('/buyer')) {
        return desktopPath;
      }
      if (desktopPath.startsWith('/kemework') && !desktopPath.includes('/customer') && !desktopPath.includes('/pro') && !desktopPath.includes('/company')) {
        return desktopPath;
      }
      if (desktopPath.startsWith('/kemedar') && !desktopPath.includes('/agent') && !desktopPath.includes('/agency') && !desktopPath.includes('/developer') && !desktopPath.includes('/franchise')) {
        return desktopPath;
      }
      if (desktopPath.startsWith('/kemetro/')) {
        return `/m${desktopPath}`;
      }
      if (desktopPath.startsWith('/kemedar/')) {
        return `/m${desktopPath}`;
      }
      if (desktopPath.startsWith('/kemework/')) {
        return `/m${desktopPath}`;
      }
      return `/m${desktopPath}`;
    },

    handleScreenSizeRedirect: () => {
      const isMobile = redirector.isMobileSession();
      const currentPath = location.pathname;
      // NEVER redirect /admin routes
      if (currentPath.startsWith('/admin')) {
        return false;
      }
      // On desktop, only redirect /m/* paths that have a real desktop equivalent
      // (role dashboards under /m/kemedar/, /m/kemetro/, /m/kemework/)
      // Do NOT redirect general /m/* pages like /m/find/*, /m/add/*, etc.
      if (!isMobile && currentPath.startsWith('/m/')) {
        const desktopOnlyPrefixes = [
          '/m/kemedar/', '/m/kemetro/', '/m/kemework/',
        ];
        const hasDesktopEquiv = desktopOnlyPrefixes.some(p => currentPath.startsWith(p));
        if (hasDesktopEquiv) {
          const desktopPath = redirector.getDesktopRoute(currentPath);
          if (!desktopPath.startsWith('/dashboard')) {
            navigate(desktopPath, { replace: true });
            return true;
          }
        }
        // All other /m/* paths stay as-is (they are mobile-only pages)
        return false;
      }
      if (isMobile) {
        const moduleRoutes = [
          '/kemetro/seller/', '/kemetro/shipper/', '/kemetro/buyer/',
          '/kemework/pro/', '/kemework/customer/', '/kemework/company/',
          '/kemedar/agent/', '/kemedar/agency/', '/kemedar/developer/', '/kemedar/franchise/',
          '/dashboard/', '/kemetro/', '/kemework/', '/kemedar/',
        ];
        const shouldRedirectToMobile = moduleRoutes.some(route => currentPath.startsWith(route));
        if (shouldRedirectToMobile && !currentPath.startsWith('/m/') && !currentPath.startsWith('/admin')) {
          const mobilePath = redirector.getMobileRoute(currentPath);
          navigate(mobilePath, { replace: true });
          return true;
        }
      }
      return false;
    },

    handleRoleDashboardRedirect: () => {
      // NEVER redirect /admin routes under any circumstances
      if (location.pathname.startsWith('/admin')) {
        return false;
      }
      if (!user || location.pathname !== '/dashboard') {
        return false;
      }
      const isMobile = redirector.isMobileSession();
      const activeRole = user.activeRole || user.role;
      const roleDashboardMap = {
        'common_user': '/dashboard',
        'agent': isMobile ? '/m/kemedar/agent/dashboard' : '/kemedar/agent/dashboard',
        'agency': isMobile ? '/m/kemedar/agency/dashboard' : '/kemedar/agency/dashboard',
        'developer': isMobile ? '/m/kemedar/developer/dashboard' : '/kemedar/developer/dashboard',
        'franchise_owner_area': isMobile ? '/m/kemedar/franchise/dashboard' : '/kemedar/franchise/dashboard',
        'product_seller': isMobile ? '/m/kemetro/seller/dashboard' : '/kemetro/seller/dashboard',
        'product_buyer': isMobile ? '/m/kemetro/buyer/orders' : '/kemetro/buyer/orders',
        'shipper': isMobile ? '/m/kemetro/shipper/dashboard' : '/kemetro/shipper/dashboard',
        'professional': isMobile ? '/m/kemework/pro/dashboard' : '/kemework/pro/dashboard',
        'customer_kemework': isMobile ? '/m/kemework/customer/dashboard' : '/kemework/customer/dashboard',
        'finishing_company': isMobile ? '/m/kemework/company/dashboard' : '/kemework/company/dashboard',
        'admin': '/admin',
      };
      const targetPath = roleDashboardMap[activeRole];
      if (targetPath && targetPath !== location.pathname) {
        navigate(targetPath, { replace: true });
        return true;
      }
      return false;
    },

    handleLegacyRedirect: () => {
      const currentPath = location.pathname;
      const legacyRedirects = {
        '/mobile': '/m',
        '/mobile/home': '/m/home',
        '/mobile/account': '/m/account',
        '/mobile/settings': '/m/settings',
        '/mobile/find': '/m/find',
        '/mobile/add': '/m/add',
        '/mobile/buy': '/m/buy',
        '/mobile/add-property': '/m/add/property',
        '/mobile/add-project': '/m/add/project',
        '/mobile/add-buy-request': '/m/add/buy-request',
        '/mobile/notifications': '/m/dashboard/notifications',
      };
      for (const [oldPath, newPath] of Object.entries(legacyRedirects)) {
        if (currentPath === oldPath) {
          navigate(newPath, { replace: true });
          return true;
        }
        if (currentPath.startsWith(oldPath + '/')) {
          const rest = currentPath.slice(oldPath.length);
          navigate(newPath + rest, { replace: true });
          return true;
        }
      }
      return false;
    },

    checkAndRedirect: () => {
      // NEVER redirect /admin routes - allow direct access
      if (location.pathname.startsWith('/admin')) {
        return false;
      }
      if (redirector.handleLegacyRedirect()) return true;
      if (redirector.handleScreenSizeRedirect()) return true;
      if (redirector.handleRoleDashboardRedirect()) return true;
      return false;
    },
  };

  return redirector;
}