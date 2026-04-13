import { Bell, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModules } from "@/lib/ModuleContext";

const ALL_MODULES = [
  { id: "kemedar",  label: "Kemedar®",  icon: "🏠", homePath: "/m" },
  { id: "kemework", label: "Kemework®", icon: "✏️", homePath: "/m/kemework" },
  { id: "kemetro",  label: "Kemetro®",  icon: "🛒", homePath: "/m/kemetro" },
];

function getActiveModuleFromPath(path) {
  if (path.startsWith("/m/kemetro")) return "kemetro";
  if (path.startsWith("/m/kemework")) return "kemework";
  return "kemedar";
}

// Root paths where back button should NOT appear
const ROOT_PATHS = [
  "/m", "/m/home", "/m/find", "/m/buy", "/m/account",
  "/m/kemetro", "/m/kemetro/home", "/m/kemework",
  "/m/dashboard",
];

// Pages that manage their own top bar (full-screen detail/form pages)
const HIDDEN_PATHS = [
  "/m/property/", "/m/project/", "/m/product/", "/m/service/",
  "/m/profile/", "/m/find/agent", "/m/find/developer", "/m/find/franchise",
  "/m/find/professional", "/m/find/property", "/m/find/project",
  "/m/find/product", "/m/find/service", "/m/find/buy-request", "/m/find/rfq",
  "/m/add/property", "/m/add/project", "/m/buy-request/", "/m/rfq/",
  "/m/settings", "/m/account",
  "/m/kemedar/match",
];

export default function MobileGlobalHeader() {
  const { isModuleActive } = useModules();
  const navigate = useNavigate();
  const location = useLocation();
  const notifCount = 2;

  const MODULES = ALL_MODULES.filter(m => isModuleActive(m.id));
  const activeModule = getActiveModuleFromPath(location.pathname);

  // Pages that manage their own top bar — hide module tabs but still show back button
  const shouldHideTabs = HIDDEN_PATHS.some(p => location.pathname.startsWith(p));

  const isRoot = ROOT_PATHS.some(p => location.pathname === p);
  const showBack = !isRoot;
  const showModuleTabs = MODULES.length > 1 && !shouldHideTabs;

  // Nothing to render at all
  if (!showBack && !showModuleTabs) return null;

  const handleModuleClick = (mod) => {
    navigate(mod.homePath);
  };

  return (
    <>
      {/* Floating back button — overlays page content */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="fixed top-3 left-3 z-[200] w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
      )}

      {/* Module tabs header — only when multiple modules active */}
      {showModuleTabs && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ boxShadow: "0 1px 0 #E5E7EB" }}>
          <div className="flex items-center px-2" style={{ height: 52 }}>
            {/* Module tabs */}
            <div className="flex flex-1 items-center">
              {MODULES.map(mod => {
                const isActive = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod)}
                    className="flex flex-col items-center justify-center px-3 py-1 relative"
                    style={{ minWidth: 80 }}
                  >
                    <span className="text-lg">{mod.icon}</span>
                    <span className={`text-[11px] font-black mt-0.5 leading-none ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                      {mod.label}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Notification bell */}
            <button
              onClick={() => navigate("/m/dashboard/notifications")}
              className="relative p-2 mr-1"
            >
              <Bell size={22} className="text-gray-700" strokeWidth={1.8} />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 rounded-full text-white text-[9px] font-black flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}