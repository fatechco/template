import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { TrendingUp } from "lucide-react";

const MODULE_CONFIG = {
  kemedar: {
    name: "Kemedar",
    quickActions: [
      { emoji: "🏠", label: "Add Property", path: "/m/add/property" },
      { emoji: "🔍", label: "Find Property", path: "/m/find/property" },
      { emoji: "📋", label: "My Properties", path: "/m/dashboard/my-properties" },
      { emoji: "❤️", label: "Favorites", path: "/m/dashboard/favorites" },
    ],
  },
  kemetro: {
    name: "Kemetro",
    quickActions: [
      { emoji: "🛒", label: "Browse Products", path: "/m/kemetro" },
      { emoji: "📦", label: "My Orders", path: "/m/dashboard/kemetro-orders" },
      { emoji: "❤️", label: "Wishlist", path: "/m/dashboard/wishlist" },
      { emoji: "🏪", label: "My Store", path: "/kemetro/seller" },
    ],
  },
  kemework: {
    name: "Kemework",
    quickActions: [
      { emoji: "🔧", label: "Find Professional", path: "/m/kemework/find-professionals" },
      { emoji: "📝", label: "Post Task", path: "/m/kemework/post-task" },
      { emoji: "📋", label: "My Orders", path: "/m/dashboard/kemework/orders" },
      { emoji: "🔖", label: "Bookmarks", path: "/m/dashboard/kemework/bookmarks" },
    ],
  },
};

export default function DashboardHome() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const firstName = user?.full_name?.split(" ")[0] || "User";
  const activeModule = "kemedar";
  const config = MODULE_CONFIG[activeModule];
  const QUICK_ACTIONS = config.quickActions;

  return (
    <div className="min-h-full bg-gray-50">
      {/* Scrollable Content */}
      <div className="pb-24 px-4 pt-6 space-y-6">
        {/* Greeting Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-2xl font-black text-gray-900">Good morning, {firstName}! 👋</p>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening in {config.name}</p>
        </div>

        {/* Module-Specific Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-orange-600">
              {activeModule === 'kemedar' ? '3' : activeModule === 'kemetro' ? '12' : '5'}
            </p>
            <p className="text-xs font-semibold text-gray-600 mt-1">
              {activeModule === 'kemedar' ? 'Active Listings' : activeModule === 'kemetro' ? 'Orders' : 'Active Jobs'}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <TrendingUp size={14} /> +
              {activeModule === 'kemedar' ? '2 listings' : activeModule === 'kemetro' ? '3 orders' : '1 job'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative">
            <span className="absolute top-4 right-4 text-xl">
              {activeModule === 'kemedar' ? '⭐' : activeModule === 'kemetro' ? '❤️' : '👍'}
            </span>
            <p className="text-3xl font-black text-gray-900">
              {activeModule === 'kemedar' ? '12' : activeModule === 'kemetro' ? '8' : '24'}
            </p>
            <p className="text-xs font-semibold text-gray-600 mt-1">
              {activeModule === 'kemedar' ? 'Saved' : activeModule === 'kemetro' ? 'Wishlist' : 'Completed'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-blue-600">
              {activeModule === 'kemedar' ? '2' : activeModule === 'kemetro' ? '5' : '8'}
            </p>
            <p className="text-xs font-semibold text-gray-600 mt-1">
              {activeModule === 'kemedar' ? 'Requests' : activeModule === 'kemetro' ? 'In Cart' : 'Messages'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-purple-600">
              {activeModule === 'kemedar' ? '1250' : activeModule === 'kemetro' ? '45' : '2340'}
            </p>
            <p className="text-xs font-semibold text-gray-600 mt-1">
              {activeModule === 'kemedar' ? 'Profile Views' : activeModule === 'kemetro' ? 'Store Views' : 'Profile Views'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="font-black text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all active:scale-95"
              >
                <div className="text-2xl mb-2">{action.emoji}</div>
                <p className="text-xs font-bold text-gray-900 text-left leading-tight">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Kemedar Vision™ Banner */}
        <button
          onClick={() => navigate('/m/add/property')}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-left shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">✨</div>
          <div className="flex-1">
            <p className="font-black text-white text-sm">Kemedar Vision™</p>
            <p className="text-purple-200 text-xs mt-0.5">AI photo quality check for your listings</p>
          </div>
          <span className="text-white text-lg">›</span>
        </button>

        {/* Subscription Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-900 text-sm">Bronze Plan</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{activeModule === 'kemedar' ? 'Properties' : 'Items'} used</span>
              <span className="font-bold">10 / 25</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 w-2/5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Expires in 28 days</p>
          <button onClick={() => navigate('/m/dashboard/subscription')} className="w-full mt-4 bg-orange-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-orange-700 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>

    </div>
  );
}