import KemeKitsAnalytics from "@/pages/admin/kemetro/kemekits/KemeKitsAnalytics";
import KemeKitsAllKits from "@/pages/admin/kemetro/kemekits/KemeKitsAllKits";
import KemeKitsPendingReview from "@/pages/admin/kemetro/kemekits/KemeKitsPendingReview";
import KemeKitsDesigners from "@/pages/admin/kemetro/kemekits/KemeKitsDesigners";
import KemeKitsSettings from "@/pages/admin/kemetro/kemekits/KemeKitsSettings";

const PAGE_MAP = {
  analytics: KemeKitsAnalytics,
  all: KemeKitsAllKits,
  pending: KemeKitsPendingReview,
  designers: KemeKitsDesigners,
  settings: KemeKitsSettings,
};

export default function AdminKemeKitsRoutes({ page = "analytics" }) {
  const Component = PAGE_MAP[page] || KemeKitsAnalytics;
  return <Component />;
}