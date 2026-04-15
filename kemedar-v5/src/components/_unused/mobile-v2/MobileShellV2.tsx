// @ts-nocheck
import { Outlet, useLocation } from "next/link";
import MobileBottomNav from "./MobileBottomNav";
import MobileGlobalHeader from "./MobileGlobalHeader";
import { MobileToastProvider } from "./MobileToast";
import { ModuleProvider } from "@/lib/module-context";

const FULLSCREEN_PATHS = ["/m/find", "/m/buy", "/m/settings", "/m/kemework/post-task", "/m/kemework/find-professionals"];
// These paths hide the global header but still show the bottom nav
const HIDE_HEADER_PATHS = ["/m/add", "/m/find/filters", "/m/kemedar/advisor", "/m/kemework", "/m/kemetro/search", "/m/kemetro/cart", "/m/kemetro/rfq", "/m/kemework/be-accredited", "/m/dashboard", "/m/cp", "/m/kemetro/shipper"];

export default function MobileShellV2() {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_PATHS.includes(pathname);

  const shouldHideHeader = HIDE_HEADER_PATHS.some(path => pathname.startsWith(path));

  return (
    <ModuleProvider>
      <MobileToastProvider>
        <div className="flex flex-col min-h-screen bg-gray-50 max-w-lg mx-auto relative">
          {!isFullscreen && !shouldHideHeader && <MobileGlobalHeader />}
          <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
            <Outlet />
          </div>
          <MobileBottomNav />
        </div>
      </MobileToastProvider>
    </ModuleProvider>
  );
}