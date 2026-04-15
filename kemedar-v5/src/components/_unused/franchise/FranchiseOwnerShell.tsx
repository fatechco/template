"use client";
// @ts-nocheck
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, HardHat, ShoppingBag, Star, DollarSign,
  MessageSquare, HelpCircle, ChevronDown, ChevronRight, LogOut, X, Menu,
  Home, Plus, Search, FileText, CheckSquare, BarChart3, Wallet, Mail,
  Settings, ShoppingCart, CreditCard, Bell, BookOpen, Phone, Briefcase,
  Shield, Package, ClipboardList, FolderOpen, UserCheck, TrendingUp,
  MapPin, Layers
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/kemedar/franchise/dashboard' },

  {
    label: '👥 Users in My Area', icon: Users, children: [
      { label: 'All Area Users', icon: Users, to: '/kemedar/franchise/area-users' },
      { heading: 'BY ROLE' },
      { label: 'Agents in My Area', icon: Briefcase, to: '/kemedar/franchise/area-users?role=agent' },
      { label: 'Developers in My Area', icon: HardHat, to: '/kemedar/franchise/area-users?role=developer' },
      { label: 'Professionals in My Area', icon: UserCheck, to: '/kemedar/franchise/area-users?role=professional' },
      { label: 'Finishing Companies', icon: Building2, to: '/kemedar/franchise/area-users?role=company' },
      { label: 'Marketers & Freelancers', icon: TrendingUp, to: '/kemedar/franchise/area-users?role=marketer' },
      { label: 'Shop Owners', icon: ShoppingBag, to: '/kemedar/franchise/area-users?role=shop' },
      { heading: 'ACTIONS' },
      { label: 'Verify User', icon: Shield, to: '/kemedar/franchise/area-users?action=verify' },
    ]
  },

  {
    label: '🏙 Kemedar', icon: MapPin, children: [
      { heading: 'PROPERTIES' },
      { label: 'Properties I Added', icon: Home, to: '/kemedar/franchise/area-properties?tab=mine' },
      { label: 'Add New Property', icon: Plus, to: '/create/property' },
      { label: 'Properties in My Area', icon: Building2, to: '/kemedar/franchise/area-properties' },
      { label: 'Recent Properties', icon: Bell, to: '/kemedar/franchise/area-properties?tab=recent' },
      { label: 'Buy Requests in Area', icon: FileText, to: '/kemedar/franchise/area-buy-requests' },
      { label: 'Verify Property', icon: Shield, to: '/kemedar/franchise/area-properties?action=verify' },
      { label: 'Add Buy Request', icon: Plus, to: '/create/buy-request' },
      { heading: 'PROJECTS' },
      { label: 'Projects I Added', icon: HardHat, to: '/kemedar/franchise/area-projects?tab=mine' },
      { label: 'Add New Project', icon: Plus, to: '/create/project' },
      { label: 'Projects in My Area', icon: Building2, to: '/kemedar/franchise/area-projects' },
      { label: 'Recent Projects', icon: Bell, to: '/kemedar/franchise/area-projects?tab=recent' },
      { label: 'Verify Project', icon: Shield, to: '/kemedar/franchise/area-projects?action=verify' },
    ]
  },

  {
    label: '🔧 Kemework', icon: HardHat, children: [
      { heading: 'FINISHING TASKS' },
      { label: 'Tasks in My Area', icon: ClipboardList, to: '/kemedar/franchise/kemework-tasks' },
      { label: 'Recent Tasks', icon: Bell, to: '/kemedar/franchise/kemework-tasks?tab=recent' },
      { label: 'Tasks I Posted', icon: FileText, to: '/kemedar/franchise/kemework-tasks?tab=mine' },
      { label: 'Tasks in Progress', icon: TrendingUp, to: '/kemedar/franchise/kemework-tasks?tab=progress' },
      { label: 'Completed Tasks', icon: CheckSquare, to: '/kemedar/franchise/kemework-tasks?tab=done' },
      { heading: 'HANDYMEN' },
      { label: 'Find Handyman / Company', icon: Search, to: '/kemework/find-professionals' },
      { label: 'Post Finishing Task', icon: Plus, to: '/kemework/post-task' },
      { label: 'Accredit Handyman of Choice', icon: Shield, to: '/kemedar/franchise/accredit-handyman' },
      { label: 'Handyman of Choice List', icon: Users, to: '/kemedar/franchise/accredited-handymen' },
      { label: 'Tasks Kemedar Working On', icon: Layers, to: '/kemedar/franchise/kemework-tasks?tab=kemedar' },
    ]
  },

  {
    label: '🛒 Kemetro', icon: ShoppingBag, children: [
      { heading: 'SELLERS & PRODUCTS' },
      { label: 'Kemetro Sellers in Area', icon: ShoppingBag, to: '/kemedar/franchise/kemetro-sellers' },
      { label: 'Product List in Area', icon: Package, to: '/kemedar/franchise/kemetro-sellers?tab=products' },
      { label: 'Verify Kemetro Seller', icon: Shield, to: '/kemedar/franchise/kemetro-sellers?action=verify' },
      { heading: 'MY STORE' },
      { label: 'Add Product', icon: Plus, to: '/kemetro/seller/add-product' },
      { label: 'My Products', icon: Package, to: '/kemetro/seller/products' },
      { label: 'Store Setup', icon: Settings, to: '/kemetro/seller/settings' },
      { label: 'Login as Kemetro Seller', icon: ShoppingCart, to: '/kemetro/seller/dashboard' },
      { heading: 'BROWSE' },
      { label: 'Browse Products', icon: Search, to: '/kemetro/search' },
      { label: 'My Kemetro Account', icon: ShoppingCart, to: '/kemetro' },
    ]
  },

  {
    label: '💎 Premium Services', icon: Star, children: [
      { heading: 'SUBSCRIPTIONS IN AREA' },
      { label: 'Kemedar Subscriptions', icon: CreditCard, to: '/kemedar/franchise/orders?service=kemedar-sub' },
      { label: 'Kemetro Subscriptions', icon: CreditCard, to: '/kemedar/franchise/orders?service=kemetro-sub' },
      { label: 'Kemework Subscriptions', icon: CreditCard, to: '/kemedar/franchise/orders?service=kemework-sub' },
      { heading: 'PROMOTIONS & ADS' },
      { label: 'Promote Kemedar Ads', icon: Bell, to: '/kemedar/franchise/orders?service=promo-kemedar' },
      { label: 'Promote Kemetro Ads', icon: Bell, to: '/kemedar/franchise/orders?service=promo-kemetro' },
      { label: 'Promote Kemework Ads', icon: Bell, to: '/kemedar/franchise/orders?service=promo-kemework' },
      { heading: 'PAID SERVICES' },
      { label: 'Order New Service', icon: Plus, to: '/kemedar/franchise/orders?tab=new' },
      { label: 'Buy Kemecoins', icon: DollarSign, to: '/kemetro/kemecoin' },
    ]
  },

  {
    label: '💰 Money & Orders', icon: DollarSign, children: [
      { heading: 'ORDERS IN MY AREA' },
      { label: 'New Orders', icon: Plus, to: '/kemedar/franchise/orders?tab=new' },
      { label: 'Orders in Progress', icon: TrendingUp, to: '/kemedar/franchise/orders?tab=progress' },
      { label: 'Completed Orders', icon: CheckSquare, to: '/kemedar/franchise/orders?tab=completed' },
      { label: 'Invoices in My Area', icon: FileText, to: '/kemedar/franchise/orders?tab=invoices' },
      { heading: 'WALLET & PAYMENTS' },
      { label: 'Wallet / Revenue', icon: Wallet, to: '/kemedar/franchise/revenue' },
      { label: 'Payment Methods', icon: CreditCard, to: '/kemedar/franchise/payment-methods' },
      { label: 'Withdrawals', icon: DollarSign, to: '/kemedar/franchise/withdrawals' },
      { label: 'Deposits', icon: DollarSign, to: '/kemedar/franchise/deposits' },
    ]
  },

  {
    label: '🗂 Tools & Communications', icon: MessageSquare, children: [
      { heading: 'FILE MANAGER' },
      { label: 'Invoice Templates', icon: FileText, to: '/kemedar/franchise/files?tab=invoices' },
      { label: 'Contract Templates', icon: FileText, to: '/kemedar/franchise/files?tab=contracts' },
      { label: 'Letterhead Template', icon: FileText, to: '/kemedar/franchise/files?tab=letterhead' },
      { label: 'Business Card Template', icon: FileText, to: '/kemedar/franchise/files?tab=cards' },
      { label: 'Signs & Banners', icon: FileText, to: '/kemedar/franchise/files?tab=banners' },
      { label: 'Resources & Courses', icon: BookOpen, to: '/kemedar/franchise/files?tab=courses' },
      { label: 'Company Documents', icon: FolderOpen, to: '/kemedar/franchise/files?tab=company' },
      { label: 'Employee Documents', icon: FolderOpen, to: '/kemedar/franchise/files?tab=employees' },
      { heading: 'EMAIL' },
      { label: 'Inbox', icon: Mail, to: '/kemedar/franchise/email?folder=inbox' },
      { label: 'Sent', icon: Mail, to: '/kemedar/franchise/email?folder=sent' },
      { label: 'Trash', icon: Mail, to: '/kemedar/franchise/email?folder=trash' },
      { label: 'Important', icon: Mail, to: '/kemedar/franchise/email?folder=important' },
      { heading: 'COMMUNICATIONS' },
      { label: 'Messages & Chats', icon: MessageSquare, to: '/kemedar/franchise/bulk-comms?tab=messages' },
      { label: 'Bulk Communications', icon: Bell, to: '/kemedar/franchise/bulk-comms' },
    ]
  },

  {
    label: '❓ Help', icon: HelpCircle, children: [
      { heading: 'SUPPORT TICKETS' },
      { label: 'Open Tickets in My Area', icon: HelpCircle, to: '/kemedar/franchise/support?tab=open' },
      { label: 'Resolved in My Area', icon: CheckSquare, to: '/kemedar/franchise/support?tab=resolved' },
      { heading: 'CONTACT KEMEDAR' },
      { label: 'Contact & Chat', icon: Phone, to: '/kemedar/franchise/contact-kemedar' },
      { label: 'People Online Now', icon: Users, to: '/kemedar/franchise/contact-kemedar?tab=online' },
      { label: 'Send Inquiry / Feedback', icon: MessageSquare, to: '/kemedar/franchise/contact-kemedar?tab=inquiry' },
      { label: 'Received Call Reports', icon: BarChart3, to: '/kemedar/franchise/contact-kemedar?tab=calls' },
      { heading: 'KNOWLEDGE BASE' },
      { label: 'Knowledge Base', icon: BookOpen, to: '/kemedar/franchise/knowledge' },
    ]
  },

  {
    label: '🤖 AI & Smart Tools', icon: TrendingUp, children: [
      { heading: 'KEMEDAR AI MODULES' },
      { label: 'Negotiate™ — Deal Room', icon: MessageSquare, to: '/kemedar/franchise/negotiations' },
      { label: 'Escrow™', icon: Shield, to: '/kemedar/franchise/escrow' },
      { label: 'Vision™ — Photo AI', icon: Search, to: '/kemedar/franchise/vision' },
      { label: 'Kemedar Live™', icon: Bell, to: '/kemedar/franchise/live' },
      { heading: 'BUILD & FINISH' },
      { label: 'Kemetro Build™ — BOQ', icon: Package, to: '/kemedar/franchise/build' },
      { label: 'Finish™ — Renovation', icon: HardHat, to: '/kemedar/franchise/finish/new' },
      { label: 'Flash Deals™', icon: Star, to: '/kemedar/franchise/flash' },
      { heading: 'INSIGHTS' },
      { label: 'Kemedar Score', icon: Star, to: '/kemedar/franchise/score' },
      { label: 'My DNA Profile', icon: Users, to: '/kemedar/franchise/my-dna' },
      { label: 'Community Hub', icon: Building2, to: '/kemedar/franchise/community' },
      { label: 'Life Score™', icon: MapPin, to: '/kemedar/franchise/life-score' },
      { label: 'Expat Hub', icon: Layers, to: '/kemedar/franchise/expat' },
    ]
  },
  {
    label: '📊 Business Manager', icon: Briefcase, children: [
      { label: 'Setup Your System', icon: Settings, to: '/kemedar/franchise/biz/setup' },
      { label: 'Leads', icon: TrendingUp, to: '/kemedar/franchise/biz/leads' },
      { label: 'Customers', icon: Users, to: '/kemedar/franchise/biz/customers' },
      { label: 'Sales & Invoices', icon: DollarSign, to: '/kemedar/franchise/biz/sales' },
      { label: 'Expenses', icon: CreditCard, to: '/kemedar/franchise/biz/expenses' },
      { label: 'Contracts', icon: FileText, to: '/kemedar/franchise/biz/contracts' },
      { label: 'Proposals', icon: FileText, to: '/kemedar/franchise/biz/proposals' },
      { label: 'Estimates', icon: FileText, to: '/kemedar/franchise/biz/estimates' },
      { label: 'Credit Notes', icon: FileText, to: '/kemedar/franchise/biz/credit-notes' },
      { label: 'Items', icon: FileText, to: '/kemedar/franchise/biz/items' },
      { label: 'Projects', icon: HardHat, to: '/kemedar/franchise/biz/projects' },
      { label: 'Employees', icon: Users, to: '/kemedar/franchise/biz/employees' },
      { label: 'Tasks', icon: CheckSquare, to: '/kemedar/franchise/biz/tasks' },
      { label: 'Reports', icon: BarChart3, to: '/kemedar/franchise/biz/reports' },
      { heading: 'EXTERNAL' },
      { label: 'Go to Kemecor ERP', icon: Settings, to: '/kemecor-erp' },
    ]
  },
];

function SubItem({ item, isActive }) {
  const ChildIcon = item.icon;
  const active = isActive(item.to);
  return (
    <Link
      href={item.to || "#"}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
        ${active ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
    >
      <ChildIcon size={13} className="flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavItem({ item, isActive, location }) {
  const hasActiveChild = item.children?.some(
    c => !c.heading && c.to && (location.pathname === c.to || location.pathname.startsWith(c.to + '/'))
  );
  const [open, setOpen] = useState(hasActiveChild);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
            ${hasActiveChild
              ? 'bg-orange-50 text-orange-600 border-orange-500'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'}`}
        >
          <Icon size={16} className="flex-shrink-0" />
          <span className="flex-1 text-left truncate">{item.label}</span>
          {open ? <ChevronDown size={12} className="opacity-40 flex-shrink-0" /> : <ChevronRight size={12} className="opacity-40 flex-shrink-0" />}
        </button>
        {open && (
          <div className="ml-4 pl-3 border-l border-gray-200 mt-0.5 space-y-0.5">
            {item.children.map((child, ci) => {
              if (child.heading) {
                return <p key={`h-${ci}`} className="px-3 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">{child.heading}</p>;
              }
              return <SubItem key={child.to} item={child} isActive={isActive} />;
            })}
          </div>
        )}
      </div>
    );
  }

  const active = isActive(item.to);
  return (
    <Link
      href={item.to || "#"}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
        ${active
          ? 'bg-orange-50 text-orange-600 border-orange-500'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'}`}
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export default function FranchiseOwnerShell({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'FO';

  const location = { pathname };
  const isActive = (to) => to && (pathname === to || pathname.startsWith(to + '/'));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-[270px]' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* User Card */}
        <div className="px-5 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-orange-700 font-bold text-base flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight truncate">{user?.full_name || 'Franchise Owner'}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full bg-orange-600">Franchise Owner</span>
            <Link href="/kemedar/franchise/dashboard" className="text-xs text-gray-400 hover:text-gray-700">Dashboard →</Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {MENU.map((item, idx) => (
            <NavItem key={idx} item={item} isActive={isActive} location={location} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-1 flex-shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
        >
          <Menu size={18} className="text-gray-700" />
        </button>
      )}

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 left-[250px] z-50 bg-white border border-gray-200 rounded-full p-1 shadow-sm"
        >
          <X size={13} className="text-gray-500" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}