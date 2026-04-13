import { X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FranchiseOwnerDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: "📊 DASHBOARD",
      items: [
        { label: "Dashboard", path: "/m/kemedar/franchise/dashboard" },
      ],
    },
    {
      title: "🏙 MY AREA (KEMEDAR)",
      items: [
        { label: "👥 Users in My Area", path: "/m/kemedar/franchise/area-users" },
        { label: "   • All Users", path: "/m/kemedar/franchise/area-users" },
        { label: "   • Agents", path: "/m/kemedar/franchise/area-users?role=agent" },
        { label: "   • Developers", path: "/m/kemedar/franchise/area-users?role=developer" },
        { label: "   • Professionals", path: "/m/kemedar/franchise/area-users?role=professional" },
        { label: "   • Finishing Companies", path: "/m/kemedar/franchise/area-users?role=finishing" },
        { label: "   • Verify a User", path: "/m/kemedar/franchise/verify-user" },
        { label: "🏠 Properties", path: "/m/kemedar/franchise/area-properties" },
        { label: "   • My Properties", path: "/m/kemedar/franchise/my-properties" },
        { label: "   • Add New Property", path: "/m/kemedar/add/property" },
        { label: "   • Area Properties", path: "/m/kemedar/franchise/area-properties" },
        { label: "   • Buy Requests", path: "/m/kemedar/franchise/area-buy-requests" },
        { label: "   • Verify Property", path: "/m/kemedar/franchise/verify-property" },
        { label: "🏗 Projects", path: "/m/kemedar/franchise/area-projects" },
        { label: "   • My Projects", path: "/m/kemedar/franchise/my-projects" },
        { label: "   • Add New Project", path: "/m/kemedar/add/project" },
        { label: "   • Area Projects", path: "/m/kemedar/franchise/area-projects" },
      ],
    },
    {
      title: "🔧 KEMEWORK",
      items: [
        { label: "Tasks in My Area", path: "/m/kemedar/franchise/kemework-tasks" },
        { label: "Recent Tasks", path: "/m/kemedar/franchise/kemework-tasks?filter=recent" },
        { label: "My Tasks", path: "/m/kemedar/franchise/kemework-tasks?filter=mine" },
        { label: "In Progress", path: "/m/kemedar/franchise/kemework-tasks?status=inprogress" },
        { label: "Completed", path: "/m/kemedar/franchise/kemework-tasks?status=done" },
        { label: "Find Handyman", path: "/m/kemedar/franchise/find-handyman" },
        { label: "Post Task", path: "/m/kemework/post-task" },
        { label: "Accredit Handyman", path: "/m/kemedar/franchise/accredit-handyman" },
        { label: "Accredited List", path: "/m/kemedar/franchise/accredited-handymen" },
        { label: "Kemedar Tasks", path: "/m/kemedar/franchise/kemedar-tasks" },
      ],
    },
    {
      title: "🛒 KEMETRO",
      items: [
        { label: "Sellers in My Area", path: "/m/kemedar/franchise/kemetro-sellers" },
        { label: "Products in My Area", path: "/m/kemedar/franchise/kemetro-products" },
        { label: "Verify Seller", path: "/m/kemedar/franchise/verify-seller" },
        { label: "Browse Products", path: "/m/kemetro" },
        { label: "My Account", path: "/m/kemetro/seller/dashboard" },
      ],
    },
    {
      title: "💎 PREMIUM SERVICES",
      items: [
        { label: "Subscriptions - Kemedar", path: "/m/kemedar/franchise/subscriptions?module=kemedar" },
        { label: "Subscriptions - Kemetro", path: "/m/kemedar/franchise/subscriptions?module=kemetro" },
        { label: "Subscriptions - Kemework", path: "/m/kemedar/franchise/subscriptions?module=kemework" },
        { label: "Ads - Kemedar", path: "/m/kemedar/franchise/promote-ads?module=kemedar" },
        { label: "Ads - Kemetro", path: "/m/kemedar/franchise/promote-ads?module=kemetro" },
        { label: "Ads - Kemework", path: "/m/kemedar/franchise/promote-ads?module=kemework" },
        { label: "Services - Kemedar", path: "/m/kemedar/franchise/paid-services?module=kemedar" },
        { label: "Services - Kemetro", path: "/m/kemedar/franchise/paid-services?module=kemetro" },
        { label: "Services - Kemework", path: "/m/kemedar/franchise/paid-services?module=kemework" },
        { label: "Order Service", path: "/m/buy" },
        { label: "Buy Kemecoins", path: "/m/kemedar/franchise/kemecoins" },
      ],
    },
    {
      title: "💰 MONEY & ORDERS",
      items: [
        { label: "Kemedar Orders", path: "/m/kemedar/franchise/orders?module=kemedar" },
        { label: "Kemetro Orders", path: "/m/kemedar/franchise/orders?module=kemetro" },
        { label: "Kemework Orders", path: "/m/kemedar/franchise/orders?module=kemework" },
        { label: "New Orders", path: "/m/kemedar/franchise/orders?status=new" },
        { label: "In Progress", path: "/m/kemedar/franchise/orders?status=inprogress" },
        { label: "Completed", path: "/m/kemedar/franchise/orders?status=completed" },
        { label: "Invoices", path: "/m/kemedar/franchise/invoices" },
        { label: "Wallet", path: "/m/kemedar/franchise/wallet" },
        { label: "Payments", path: "/m/kemedar/franchise/payments" },
        { label: "Payment Methods", path: "/m/kemedar/franchise/payment-methods" },
        { label: "Withdrawals", path: "/m/kemedar/franchise/withdrawals" },
        { label: "Deposits", path: "/m/kemedar/franchise/deposits" },
      ],
    },
    {
      title: "🗂 TOOLS & COMMUNICATIONS",
      items: [
        { label: "Files", path: "/m/kemedar/franchise/files" },
        { label: "Email", path: "/m/kemedar/franchise/email" },
        { label: "Messages", path: "/m/dashboard/messages" },
      ],
    },
    {
      title: "📣 BULK COMMUNICATIONS",
      items: [
        { label: "Message of the Week", path: "/m/kemedar/franchise/bulk-comms?type=weekly" },
        { label: "Email Campaigns", path: "/m/kemedar/franchise/bulk-comms?type=email" },
        { label: "Phone Calls", path: "/m/kemedar/franchise/bulk-comms?type=calls" },
        { label: "SMS Campaigns", path: "/m/kemedar/franchise/bulk-comms?type=sms" },
      ],
    },
    {
      title: "💼 BUSINESS MANAGER",
      items: [
        { label: "Setup", path: "/m/kemedar/franchise/biz/setup" },
        { label: "Leads", path: "/m/kemedar/franchise/biz/leads" },
        { label: "Customers", path: "/m/kemedar/franchise/biz/customers" },
        { label: "Sales", path: "/m/kemedar/franchise/biz/sales" },
        { label: "Expenses", path: "/m/kemedar/franchise/biz/expenses" },
        { label: "Contracts", path: "/m/kemedar/franchise/biz/contracts" },
        { label: "Employees", path: "/m/kemedar/franchise/biz/employees" },
        { label: "Tasks", path: "/m/kemedar/franchise/biz/tasks" },
        { label: "Reports", path: "/m/kemedar/franchise/biz/reports" },
      ],
    },
    {
      title: "❓ HELP",
      items: [
        { label: "Open Tickets", path: "/m/kemedar/franchise/support?status=open" },
        { label: "Resolved", path: "/m/kemedar/franchise/support?status=resolved" },
        { label: "Contact Kemedar", path: "/m/kemedar/franchise/contact-kemedar" },
        { label: "Knowledge Base", path: "/m/kemedar/franchise/knowledge" },
      ],
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="font-black text-gray-900">Franchise Menu</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-900" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              👤
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Franchise Owner</p>
              <span className="inline-block bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold mt-1">
                Area Owner
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            📍 Cairo, Egypt
          </p>
          <p className="text-xs text-yellow-500 font-bold mt-1 flex items-center gap-1">
            ⭐ Performance: 87/100
          </p>
        </div>

        {/* Menu Sections */}
        <div className="divide-y divide-gray-200">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <p className="px-4 py-3 text-xs font-black text-gray-600 uppercase tracking-widest">{section.title}</p>
              <div className="space-y-1 px-3 pb-2">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 text-left transition-colors text-sm text-gray-700"
                  >
                    <span className="text-sm text-gray-700">{item.label}</span>
                    {!item.label.startsWith("   •") && <ChevronRight size={16} className="text-gray-400" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}