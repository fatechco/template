// @ts-nocheck
import KemeworkOverview from '@/pages/admin/kemework/KemeworkOverview';
import KemeworkProfessionals from '@/pages/admin/kemework/KemeworkProfessionals';
import KemeworkServicesPending from '@/pages/admin/kemework/KemeworkServicesPending';
import KemeworkAccreditation from '@/pages/admin/kemework/KemeworkAccreditation';
import KemeworkOrdersAdmin from '@/pages/admin/kemework/KemeworkOrdersAdmin';
import KemeworkCategories from '@/pages/admin/kemework/KemeworkCategories';
import KemeworkPlans from '@/pages/admin/kemework/KemeworkPlans';
import SnapFixAnalytics from '@/pages/admin/kemework/snap-fix/SnapFixAnalytics';
import SnapFixSessions from '@/pages/admin/kemework/snap-fix/SnapFixSessions';
import SnapFixSafetyLog from '@/pages/admin/kemework/snap-fix/SnapFixSafetyLog';
import SnapFixSettings from '@/pages/admin/kemework/snap-fix/SnapFixSettings';

const PAGE_MAP = {
  overview: KemeworkOverview,
  analytics: SnapFixAnalytics,
  sessions: SnapFixSessions,
  safety: SnapFixSafetyLog,
  settings: SnapFixSettings,
  professionals: KemeworkProfessionals,
  services_pending: KemeworkServicesPending,
  accreditation: KemeworkAccreditation,
  orders: KemeworkOrdersAdmin,
  categories: KemeworkCategories,
  plans: KemeworkPlans,
};

export default function AdminKemeworkRoutes({ page = "overview" }) {
  const Component = PAGE_MAP[page] || KemeworkOverview;
  return <Component />;
}