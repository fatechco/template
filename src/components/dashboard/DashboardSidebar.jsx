import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Home, Search, Heart, Bell, MessageCircle,
  User, Settings, LogOut, HelpCircle, Building2, Users, FileText,
  BarChart3, DollarSign, Megaphone, MapPin, ShoppingCart,
  CreditCard, X, Plus, GitCompare, ClipboardList, ScanSearch,
  KanbanSquare, UserSquare, Calendar, HardHat, LineChart,
  ChevronDown, ChevronRight, Briefcase, Star, Shield, Tag, Globe, Bookmark,
  CheckCircle, Package, Store, Lock
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Sparkles } from "lucide-react";

// ─── MENU DEFINITIONS ───────────────────────────────────────────────
// Items with `children` render as collapsible submenus

// Children with a `heading` property render as a non-clickable section label
const COMMON_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "🏙 Kemedar", icon: MapPin, children: [
      { heading: "PROPERTIES" },
      { label: "Find Property", icon: Search, to: "/kemedar/search-properties" },
      { label: "My Properties", icon: Home, to: "/dashboard/my-properties" },
      { label: "Add New Property", icon: Plus, to: "/kemedar/add/property" },
      { label: "My Favorites", icon: Heart, to: "/dashboard/favorites" },
      { label: "Compare Properties", icon: GitCompare, to: "/dashboard/compare" },
      { heading: "REQUESTS" },
      { label: "Add Buy Request", icon: FileText, to: "/kemedar/add/buy-request" },
      { label: "My Buy Requests", icon: ClipboardList, to: "/dashboard/my-buy-requests" },
      { label: "Search Buy Requests", icon: ScanSearch, to: "/dashboard/search-requests" },
      { heading: "PROJECTS" },
      { label: "Find Project", icon: Search, to: "/kemedar/search-projects" },
      { label: "My Projects", icon: HardHat, to: "/dashboard/my-projects" },
      { label: "Add New Project", icon: Plus, to: "/kemedar/add/project" },
      { heading: "ORGANIZERS" },
      { label: "Buyer Organizer (Kanban)", icon: KanbanSquare, to: "/dashboard/buyer-organizer" },
      { label: "Seller Organizer (Kanban)", icon: KanbanSquare, to: "/dashboard/seller-organizer" },
      { label: "📐 My Finishing Estimates", icon: Sparkles, to: "/dashboard/estimates" },
      { label: "🗝️ My Move-In Concierge", icon: CheckCircle, to: "/dashboard/concierge" },
      { heading: "SWAP" },
      {
        label: "🔄 Kemedar Swap™", icon: GitCompare, children: [
          { label: "My Matches", icon: Search, to: "/dashboard/swap/matches" },
          { label: "Active Negotiations", icon: MessageCircle, to: "/dashboard/swap/negotiations" },
          { label: "My Swap Intent", icon: FileText, to: "/dashboard/swap/intent" },
        ]
      },
      { heading: "AUCTIONS" },
      {
        label: "🔨 KemedarBid™", icon: DollarSign, children: [
          { label: "Active Bidding", icon: Star, to: "/dashboard/auctions" },
          { label: "Won Auctions", icon: CheckCircle, to: "/dashboard/auctions" },
          { label: "Watching", icon: Heart, to: "/dashboard/auctions" },
          { label: "My Auction Listings", icon: Home, to: "/dashboard/auctions" },
        ]
      },
    ]
  },
  {
    label: "🔧 Kemework", icon: HardHat, children: [
      { heading: "MY TASKS" },
      { label: "Post a Task", icon: Plus, to: "/kemework/post-task" },
      { label: "My Tasks", icon: FileText, to: "/dashboard/kemework/my-tasks" },
      { label: "My Task Orders", icon: ClipboardList, to: "/dashboard/kemework/orders" },
      { heading: "FIND & BROWSE" },
      { label: "Find Professionals", icon: Users, to: "/kemework/find-professionals" },
      { label: "Browse Services", icon: Star, to: "/kemework/services" },
      { label: "Browse Tasks", icon: Search, to: "/kemework/tasks" },
      { heading: "SAVED" },
      { label: "Bookmarked Pros & Services", icon: Bookmark, to: "/dashboard/kemework/bookmarks" },
    ]
  },
  {
    label: "🛒 Kemetro", icon: ShoppingCart, children: [
      { heading: "SHOPPING" },
      { label: "Browse Products", icon: Search, to: "/kemetro/search" },
      { label: "My Cart", icon: ShoppingCart, to: "/kemetro/cart" },
      { heading: "MY ORDERS" },
      { label: "All Orders", icon: ClipboardList, to: "/dashboard/kemetro-orders" },
      { heading: "REQUESTS" },
      { label: "My RFQs", icon: FileText, to: "/dashboard/kemetro-rfqs" },
      { label: "Post New RFQ", icon: Plus, to: "/m/add/rfq" },
    ]
  },
  { label: "🧬 My DNA™", icon: Sparkles, to: "/dashboard/my-dna" },
  { label: "💎 Premium Services", icon: CreditCard, to: "/dashboard/premium-services" },
  { label: "🔒 Escrow™", icon: Lock, to: "/dashboard/escrow" },
  {
  label: "💰 Money & Orders", icon: DollarSign, children: [
      { heading: "KEMEDAR" },
      { label: "Kemedar Orders", icon: ClipboardList, to: "/dashboard/kemedar-orders" },
      { heading: "KEMETRO" },
      { label: "Kemetro Orders", icon: ShoppingCart, to: "/dashboard/kemetro-orders" },
      { label: "My RFQs", icon: FileText, to: "/dashboard/kemetro-rfqs" },
      { heading: "KEMEWORK" },
      { label: "Kemework Orders", icon: ClipboardList, to: "/dashboard/kemework-orders" },
      { heading: "PAYMENTS" },
      { label: "Wallet", icon: CreditCard, to: "/dashboard/wallet" },
      { label: "Invoices", icon: FileText, to: "/dashboard/invoices" },
      { label: "Payment Methods", icon: CreditCard, to: "/dashboard/payment-methods" },
    ]
  },
  {
    label: "🗂 Tools & Communications", icon: MessageCircle, children: [
      { heading: "COMMUNICATIONS" },
      { label: "Messages", icon: MessageCircle, to: "/dashboard/messages" },
      { label: "Notifications", icon: Bell, to: "/dashboard/notifications" },
      { heading: "ACCOUNT" },
      { label: "My Profile", icon: User, to: "/dashboard/profile" },
      { label: "Subscription & Billing", icon: CreditCard, to: "/dashboard/subscription" },
      { label: "Settings", icon: Settings, to: "/dashboard/settings" },
    ]
  },
  {
    label: "❓ Help", icon: HelpCircle, children: [
      { label: "Support Tickets", icon: Bell, to: "/dashboard/tickets" },
      { label: "Help Center & FAQ", icon: FileText, to: "/dashboard/knowledge" },
      { label: "Contact Us", icon: MessageCircle, to: "/dashboard/contact-kemedar" },
    ]
  },
];

const BUSINESS_EXTRA_CHILDREN = [
  { label: "Business Profile", icon: UserSquare, to: "/dashboard/business-profile" },
  { label: "Performance Stats", icon: BarChart3, to: "/dashboard/performance" },
  { label: "My Clients", icon: Users, to: "/dashboard/clients" },
  { label: "Appointments", icon: Calendar, to: "/dashboard/appointments" },
];

const BUSINESS_PROJECTS_EXTRA = [
  { label: "Projects I Added", icon: HardHat, to: "/dashboard/my-projects" },
  { label: "Add New Project", icon: Plus, to: "/kemedar/add/project" },
  { label: "Recent Projects", icon: LineChart, to: "/dashboard/my-projects?tab=recent" },
  { label: "Verify My Project", icon: Shield, to: "/dashboard/my-projects?tab=verify" },
];

// For Agent: same as common + My Business + extended projects
const AGENT_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "My Business", icon: Briefcase, children: [
      ...BUSINESS_EXTRA_CHILDREN,
    ]
  },
  {
    label: "🏙 Kemedar", icon: MapPin, children: [
      { heading: "PROPERTIES" },
      { label: "Find Property", icon: Search, to: "/kemedar/search-properties" },
      { label: "My Properties", icon: Home, to: "/dashboard/my-properties" },
      { label: "Add New Property", icon: Plus, to: "/kemedar/add/property" },
      { label: "My Favorites", icon: Heart, to: "/dashboard/favorites" },
      { label: "Compare Properties", icon: GitCompare, to: "/dashboard/compare" },
      { heading: "REQUESTS" },
      { label: "Add Buy Request", icon: FileText, to: "/kemedar/add/buy-request" },
      { label: "My Buy Requests", icon: ClipboardList, to: "/dashboard/my-buy-requests" },
      { label: "Search Buy Requests", icon: ScanSearch, to: "/dashboard/search-requests" },
      { heading: "PROJECTS" },
      { label: "Find Project", icon: Search, to: "/kemedar/search-projects" },
      { label: "My Projects", icon: HardHat, to: "/dashboard/my-projects" },
      { label: "Add New Project", icon: Plus, to: "/kemedar/add/project" },
      { heading: "ORGANIZERS" },
      { label: "Buyer Organizer (Kanban)", icon: KanbanSquare, to: "/dashboard/buyer-organizer" },
      { label: "Seller Organizer (Kanban)", icon: KanbanSquare, to: "/dashboard/seller-organizer" },
    ]
  },
  ...COMMON_MENU.slice(1, 3), // Kemework, Kemetro
  { label: "💎 Premium Services", icon: CreditCard, to: "/dashboard/premium-services" },
  ...COMMON_MENU.slice(4), // Money & Orders onwards
];

const AGENCY_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "My Business", icon: Briefcase, children: [
      ...BUSINESS_EXTRA_CHILDREN,
      { label: "Manage Agents", icon: Users, to: "/dashboard/my-agents" },
      { label: "Agency Analytics", icon: LineChart, to: "/dashboard/performance" },
    ]
  },
  {
    label: "🏙 Kemedar", icon: MapPin, children: [
      { heading: "PROPERTIES" },
      { label: "Find Property", icon: Search, to: "/kemedar/search-properties" },
      { label: "My Properties", icon: Home, to: "/dashboard/my-properties" },
      { label: "Add New Property", icon: Plus, to: "/kemedar/add/property" },
      { label: "My Favorites", icon: Heart, to: "/dashboard/favorites" },
      { label: "Compare Properties", icon: GitCompare, to: "/dashboard/compare" },
      { heading: "REQUESTS" },
      { label: "Add Buy Request", icon: FileText, to: "/kemedar/add/buy-request" },
      { label: "My Buy Requests", icon: ClipboardList, to: "/dashboard/my-buy-requests" },
      { label: "Search Buy Requests", icon: ScanSearch, to: "/dashboard/search-requests" },
      { heading: "PROJECTS" },
      { label: "Find Project", icon: Search, to: "/kemedar/search-projects" },
      { label: "My Projects", icon: HardHat, to: "/dashboard/my-projects" },
      { label: "Add New Project", icon: Plus, to: "/kemedar/add/project" },
      { heading: "ORGANIZERS" },
      { label: "Buyer Organizer (Kanban)", icon: KanbanSquare, to: "/dashboard/buyer-organizer" },
      { label: "Seller Organizer (Kanban)", icon: KanbanSquare, to: "/dashboard/seller-organizer" },
    ]
  },
  ...COMMON_MENU.slice(1, 3), // Kemework, Kemetro
  { label: "💎 Premium Services", icon: CreditCard, to: "/dashboard/premium-services" },
  ...COMMON_MENU.slice(4), // Money & Orders onwards
];

const DEVELOPER_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "My Business", icon: Briefcase, children: BUSINESS_EXTRA_CHILDREN,
  },
  {
    label: "🏙 Kemedar", icon: MapPin, children: [
      { heading: "PROPERTIES" },
      { label: "Find Property", icon: Search, to: "/kemedar/search-properties" },
      { label: "My Properties", icon: Home, to: "/dashboard/my-properties" },
      { label: "Add New Property", icon: Plus, to: "/kemedar/add/property" },
      { label: "My Favorites", icon: Heart, to: "/dashboard/favorites" },
      { label: "Compare Properties", icon: GitCompare, to: "/dashboard/compare" },
      { heading: "REQUESTS" },
      { label: "Add Buy Request", icon: FileText, to: "/kemedar/add/buy-request" },
      { label: "My Buy Requests", icon: ClipboardList, to: "/dashboard/my-buy-requests" },
      { label: "Search Buy Requests", icon: ScanSearch, to: "/dashboard/search-requests" },
      { heading: "PROJECTS" },
      { label: "Find Project", icon: Search, to: "/kemedar/search-projects" },
      { label: "My Projects", icon: HardHat, to: "/dashboard/my-projects" },
      { label: "Add New Project", icon: Plus, to: "/kemedar/add/project" },
      { label: "Project Sales", icon: DollarSign, to: "/dashboard/project-sales" },
      { heading: "ORGANIZERS" },
      { label: "Buyer Organizer (Kanban)", icon: KanbanSquare, to: "/dashboard/buyer-organizer" },
      { label: "Seller Organizer (Kanban)", icon: KanbanSquare, to: "/dashboard/seller-organizer" },
    ]
  },
  ...COMMON_MENU.slice(1, 3), // Kemework, Kemetro
  { label: "💎 Premium Services", icon: CreditCard, to: "/dashboard/premium-services" },
  ...COMMON_MENU.slice(4), // Money & Orders onwards
];

const FRANCHISE_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/kemedar/franchise/dashboard" },
  {
    label: "🏙 My Area (Kemedar)", icon: MapPin, children: [
      { heading: "KEMEDAR IN MY AREA" },
      { label: "Area Overview", icon: BarChart3, to: "/kemedar/franchise/area-overview" },
      { label: "Users in My Area", icon: Users, to: "/kemedar/franchise/area-users" },
      { label: "Area Properties", icon: Home, to: "/kemedar/franchise/area-properties" },
      { label: "Area Buy Requests", icon: FileText, to: "/kemedar/franchise/area-buy-requests" },
    ]
  },
  {
    label: "🔧 Kemework", icon: HardHat, children: [
      { heading: "KEMEWORK IN MY AREA" },
      { label: "Tasks in My Area", icon: ClipboardList, to: "/kemedar/franchise/area-projects" },
      { label: "Find Handyman", icon: Search, to: "/kemedar/franchise/handymen" },
      { label: "Accredited Handyman", icon: Shield, to: "/kemedar/franchise/handymen" },
      { label: "Tasks Kemedar Working On", icon: CheckCircle, to: "/kemedar/franchise/area-projects" },
    ]
  },
  {
    label: "🛒 Kemetro", icon: ShoppingCart, children: [
      { heading: "KEMETRO IN MY AREA" },
      { label: "Sellers in My Area", icon: Store, to: "/kemedar/franchise/revenue" },
      { label: "Products in My Area", icon: Package, to: "/kemedar/franchise/revenue" },
    ]
  },
  { label: "💎 Premium Services", icon: Star, to: "/dashboard/premium-services" },
  {
    label: "💰 Revenue", icon: DollarSign, children: [
      { label: "Wallet / Revenue", icon: CreditCard, to: "/kemedar/franchise/revenue" },
    ]
  },
  {
    label: "🗂 Communications", icon: MessageCircle, children: [
      { label: "Messages", icon: MessageCircle, to: "/dashboard/messages" },
      { label: "Notifications", icon: Bell, to: "/dashboard/notifications" },
    ]
  },
  {
    label: "❓ Help", icon: HelpCircle, children: [
      { label: "Support Tickets", icon: Bell, to: "/dashboard/tickets" },
      { label: "Contact Kemedar", icon: MessageCircle, to: "/dashboard/contact-kemedar" },
      { label: "Knowledge Base", icon: FileText, to: "/dashboard/knowledge" },
    ]
  },
];

const ADMIN_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "Users", icon: Users, children: [
      { label: "Active Users", icon: Users, to: "/dashboard/users?tab=active" },
      { label: "— Common Users", icon: User, to: "/dashboard/users?tab=active&role=user" },
      { label: "— Agents", icon: Briefcase, to: "/dashboard/users?tab=active&role=agent" },
      { label: "— Agencies", icon: Building2, to: "/dashboard/users?tab=active&role=agency" },
      { label: "— Developers", icon: HardHat, to: "/dashboard/users?tab=active&role=developer" },
      { label: "— Franchise Owners", icon: MapPin, to: "/dashboard/users?tab=active&role=franchise" },
      { label: "— Admins", icon: Shield, to: "/dashboard/users?tab=active&role=admin" },
      { label: "Pending Users", icon: Bell, to: "/dashboard/users?tab=pending" },
      { label: "Imported Users", icon: FileText, to: "/dashboard/users?tab=imported" },
      { label: "Verified Users", icon: Star, to: "/dashboard/users?tab=verified" },
      { label: "Roles", icon: Settings, to: "/dashboard/users?tab=roles" },
    ]
  },
  {
    label: "Properties & Projects", icon: Home, children: [
      { label: "Active Properties", icon: Home, to: "/dashboard/listings?tab=active" },
      { label: "Pending Properties", icon: Bell, to: "/dashboard/listings?tab=pending" },
      { label: "On-Site Properties", icon: MapPin, to: "/dashboard/listings?tab=onsite" },
      { label: "Imported Properties", icon: FileText, to: "/dashboard/listings?tab=imported" },
      { label: "Franchise Properties", icon: Star, to: "/dashboard/listings?tab=franchise" },
      { label: "Property Categories", icon: Tag, to: "/dashboard/property-categories" },
      { label: "All Amenities", icon: Star, to: "/dashboard/amenities" },
      { label: "Distance Fields", icon: MapPin, to: "/dashboard/distances" },
      { label: "All Projects", icon: Building2, to: "/dashboard/projects" },
      { label: "Active Projects", icon: Building2, to: "/dashboard/projects?tab=active" },
      { label: "Pending Projects", icon: Bell, to: "/dashboard/projects?tab=pending" },
      { label: "Buy Requests", icon: ClipboardList, to: "/dashboard/buy-requests" },
    ]
  },
  {
    label: "Locations", icon: MapPin, children: [
      { label: "Countries", icon: Globe, to: "/dashboard/locations?tab=countries" },
      { label: "Provinces", icon: MapPin, to: "/dashboard/locations?tab=provinces" },
      { label: "Cities", icon: MapPin, to: "/dashboard/locations?tab=cities" },
      { label: "Districts", icon: MapPin, to: "/dashboard/locations?tab=districts" },
      { label: "Areas", icon: MapPin, to: "/dashboard/locations?tab=areas" },
    ]
  },
  {
    label: "Marketing", icon: Megaphone, children: [
      { label: "Featured Properties", icon: Star, to: "/dashboard/marketing?tab=featured-props" },
      { label: "Featured Projects", icon: Star, to: "/dashboard/marketing?tab=featured-projects" },
      { label: "Featured Agents", icon: Star, to: "/dashboard/marketing?tab=featured-agents" },
      { label: "Featured Developers", icon: Star, to: "/dashboard/marketing?tab=featured-devs" },
      { label: "Featured Agencies", icon: Star, to: "/dashboard/marketing?tab=featured-agencies" },
      { label: "Recent Properties", icon: Bell, to: "/dashboard/marketing?tab=recent-props" },
      { label: "Recent Projects", icon: Bell, to: "/dashboard/marketing?tab=recent-projects" },
      { label: "Upload Media", icon: FileText, to: "/dashboard/marketing?tab=media" },
      { label: "Contact Data", icon: Users, to: "/dashboard/marketing?tab=contacts" },
    ]
  },
  {
    label: "Tools", icon: Settings, children: [
      { label: "Notifications", icon: Bell, to: "/dashboard/tools?tab=notifications" },
      { label: "Import Data", icon: FileText, to: "/dashboard/tools?tab=import" },
      { label: "Import Location CSV", icon: MapPin, to: "/dashboard/tools?tab=import-locations" },
      { label: "Import Marketing CSV", icon: Megaphone, to: "/dashboard/tools?tab=import-marketing" },
      { label: "Cache Clear", icon: Settings, to: "/dashboard/tools?tab=cache" },
    ]
  },
  {
    label: "Analytics & Revenue", icon: BarChart3, children: [
      { label: "Analytics", icon: BarChart3, to: "/dashboard/analytics" },
      { label: "Revenue", icon: DollarSign, to: "/dashboard/earnings" },
      { label: "Promotions", icon: Megaphone, to: "/dashboard/promotions" },
    ]
  },
  {
    label: "Kemetro", icon: ShoppingCart, children: [
      { label: "Kemetro Admin", icon: ShoppingCart, to: "/kemetro/admin" },
    ]
  },
];

const KEMETRO_SELLER_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/kemetro/seller/dashboard" },
  {
    label: "🛒 My Store", icon: ShoppingCart, children: [
      { label: "Store Overview", icon: BarChart3, to: "/kemetro/seller/dashboard" },
      { label: "My Products", icon: Tag, to: "/kemetro/seller/products" },
      { label: "Add Product", icon: Plus, to: "/kemetro/seller/add-product" },
      { label: "My Orders", icon: ClipboardList, to: "/kemetro/seller/orders" },
      { label: "Shipments", icon: MapPin, to: "/kemetro/seller/shipments" },
      { label: "Earnings", icon: DollarSign, to: "/kemetro/seller/earnings" },
      { label: "Reviews", icon: Star, to: "/kemetro/seller/reviews" },
      { label: "Promotions", icon: Megaphone, to: "/kemetro/seller/promotions" },
      { label: "Shipping Settings", icon: MapPin, to: "/kemetro/seller/shipping" },
      { label: "Coupons", icon: Tag, to: "/kemetro/seller/coupons" },
      { label: "Analytics", icon: BarChart3, to: "/kemetro/seller/analytics" },
      { label: "Store Settings", icon: Settings, to: "/kemetro/seller/store-settings" },
      { label: "Subscription", icon: CreditCard, to: "/kemetro/seller/subscription" },
    ]
  },
  {
    label: "Account", icon: User, children: [
      { label: "My Profile", icon: User, to: "/dashboard/profile" },
      { label: "Messages", icon: MessageCircle, to: "/dashboard/messages" },
      { label: "Notifications", icon: Bell, to: "/dashboard/notifications" },
      { label: "Support", icon: HelpCircle, to: "/kemetro/seller/support" },
      { label: "Earnings / Payout", icon: DollarSign, to: "/kemetro/seller/earnings" },
    ]
  },
];

const KEMEWORK_CUSTOMER_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "🔧 My Tasks", icon: ClipboardList, children: [
      { label: "Post a Task", icon: Plus, to: "/kemework/post-task" },
      { label: "My Tasks", icon: ClipboardList, to: "/dashboard/kemework/my-tasks" },
      { label: "My Orders", icon: ShoppingCart, to: "/dashboard/kemework/orders" },
    ]
  },
  {
    label: "Find & Browse", icon: Search, children: [
      { label: "Find Professionals", icon: Users, to: "/kemework/find-professionals" },
      { label: "Browse Services", icon: ShoppingCart, to: "/kemework/services" },
      { label: "Browse Tasks", icon: ClipboardList, to: "/kemework/tasks" },
    ]
  },
  {
    label: "Account", icon: User, children: [
      { label: "My Profile", icon: User, to: "/dashboard/profile" },
      { label: "Messages", icon: MessageCircle, to: "/dashboard/messages" },
      { label: "Notifications", icon: Bell, to: "/dashboard/notifications" },
      { label: "Subscription", icon: CreditCard, to: "/dashboard/subscription" },
    ]
  },
];

const KEMEWORK_PRO_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/cp/pro" },
  {
    label: "🔧 My Work", icon: Briefcase, children: [
      { label: "My Services", icon: Star, to: "/cp/pro/services" },
      { label: "Add a Service", icon: Plus, to: "/kemework/add-service" },
      { label: "My Bids", icon: FileText, to: "/cp/pro/bids" },
      { label: "My Orders", icon: ClipboardList, to: "/cp/pro/orders" },
      { label: "My Earnings", icon: DollarSign, to: "/cp/pro/earnings" },
      { label: "My Portfolio", icon: Star, to: "/cp/pro/portfolio" },
      { label: "My Customers", icon: Users, to: "/cp/pro/customers" },
    ]
  },
  {
    label: "🎨 KemeKits™", icon: Package, children: [
      { label: "My KemeKits", icon: Package, to: "/kemework/pro/kemekits" },
      { label: "Create New Kit", icon: Plus, to: "/kemework/pro/kemekits/create" },
    ]
  },
  {
    label: "Tasks", icon: Search, children: [
      { label: "Browse Tasks", icon: ClipboardList, to: "/kemework/tasks" },
      { label: "Search Tasks", icon: Search, to: "/cp/pro/search-tasks" },
    ]
  },
  {
    label: "Accreditation", icon: Shield, children: [
      { label: "My Accreditation", icon: Shield, to: "/cp/pro/accreditation" },
      { label: "Apply / Status", icon: Star, to: "/kemework/preferred-professional-program" },
    ]
  },
  {
    label: "Account", icon: User, children: [
      { label: "My Profile", icon: User, to: "/cp/pro/profile" },
      { label: "Messages", icon: MessageCircle, to: "/cp/pro/messages" },
      { label: "Notifications", icon: Bell, to: "/cp/pro/notifications" },
      { label: "Subscription", icon: CreditCard, to: "/cp/pro/subscription" },
      { label: "Invoices", icon: FileText, to: "/cp/pro/invoices" },
      { label: "Settings", icon: Settings, to: "/cp/pro/settings" },
    ]
  },
  {
    label: "❓ Help", icon: HelpCircle, children: [
      { label: "Support Tickets", icon: Bell, to: "/cp/pro/tickets" },
      { label: "Knowledge Base", icon: FileText, to: "/cp/pro/knowledge" },
      { label: "Contact Us", icon: MessageCircle, to: "/cp/pro/contact-kemedar" },
    ]
  },
];

const KEMEWORK_COMPANY_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "🏗 Company Operations", icon: Building2, children: [
      { label: "Active Jobs", icon: ClipboardList, to: "/dashboard/company-jobs" },
      { label: "Completed Jobs", icon: Star, to: "/dashboard/completed-company-jobs" },
      { label: "My Services", icon: Briefcase, to: "/dashboard/company-services" },
      { label: "Add Service", icon: Plus, to: "/kemework/add-service" },
      { label: "My Revenue", icon: DollarSign, to: "/dashboard/company-revenue" },
      { label: "My Reviews", icon: Star, to: "/dashboard/company-reviews" },
    ]
  },
  {
    label: "👷 My Professionals", icon: Users, children: [
      { label: "My Professionals", icon: Users, to: "/dashboard/my-professionals" },
      { label: "Add Professional", icon: Plus, to: "/dashboard/my-professionals/add" },
      { label: "Performance", icon: BarChart3, to: "/dashboard/professionals-performance" },
    ]
  },
  {
    label: "Tasks", icon: Search, children: [
      { label: "Browse Tasks", icon: ClipboardList, to: "/kemework/tasks" },
    ]
  },
  {
    label: "Account", icon: User, children: [
      { label: "Company Profile", icon: Building2, to: "/dashboard/company-profile" },
      { label: "Messages", icon: MessageCircle, to: "/dashboard/messages" },
      { label: "Notifications", icon: Bell, to: "/dashboard/notifications" },
      { label: "Subscription", icon: CreditCard, to: "/dashboard/subscription" },
    ]
  },
];

const ROLE_MENU_MAP = {
  user: COMMON_MENU,
  product_buyer: COMMON_MENU,
  customer_kemework: COMMON_MENU,
  agent: AGENT_MENU,
  agency: AGENCY_MENU,
  developer: DEVELOPER_MENU,
  franchise_owner: FRANCHISE_MENU,
  franchise_owner_area: FRANCHISE_MENU,
  franchise_owner_country: FRANCHISE_MENU,
  admin: ADMIN_MENU,
  product_seller: KEMETRO_SELLER_MENU,
  kemetro_seller: KEMETRO_SELLER_MENU,
  kemework_customer: KEMEWORK_CUSTOMER_MENU,
  kemework_professional: KEMEWORK_PRO_MENU,
  kemework_company: KEMEWORK_COMPANY_MENU,
};

const ROLE_BADGE = {
  admin: { label: "Admin", color: "bg-red-500" },
  agent: { label: "Agent", color: "bg-orange-500" },
  agency: { label: "Agency", color: "bg-blue-500" },
  developer: { label: "Developer", color: "bg-purple-500" },
  franchise_owner_area: { label: "Franchise Area", color: "bg-green-500" },
  franchise_owner_country: { label: "Franchise Country", color: "bg-teal-500" },
  user: { label: "Common User", color: "bg-gray-500" },
  product_buyer: { label: "Common User", color: "bg-gray-500" },
  customer_kemework: { label: "Common User", color: "bg-gray-500" },
  product_seller: { label: "Product Seller", color: "bg-blue-600" },
  kemetro_seller: { label: "Product Seller", color: "bg-blue-600" },
  kemework_customer: { label: "Customer (Kemework)", color: "bg-teal-600" },
  kemework_professional: { label: "Professional", color: "bg-emerald-600" },
  kemework_company: { label: "Finishing Company", color: "bg-amber-600" },
};

const ALL_ROLES = [
  { value: "user", label: "Common User" },
  { value: "agent", label: "Agent" },
  { value: "agency", label: "Agency" },
  { value: "developer", label: "Developer" },
  { value: "franchise_owner_area", label: "Franchise Owner (Area)" },
  { value: "franchise_owner_country", label: "Franchise Owner (Country)" },
  { value: "admin", label: "Admin" },
  { value: "product_seller", label: "Product Seller (Kemetro)" },
  { value: "kemework_customer", label: "Customer (Kemework)" },
  { value: "kemework_professional", label: "Professional (Kemework)" },
  { value: "kemework_company", label: "Finishing Company (Kemework)" },
];

// ─── SUBMENU ITEM ───────────────────────────────────────────────────
function SubMenu({ item, isActive, onClose }) {
  const location = useLocation();
  const hasActiveChild = item.children?.some(c => !c.heading && c.to && (location.pathname === c.to || location.pathname.startsWith(c.to)));
  const [open, setOpen] = useState(hasActiveChild);
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
          ${hasActiveChild
            ? "bg-orange-50 text-orange-600 border-orange-500"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
          }`}
      >
        <Icon size={17} className="flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {open ? <ChevronDown size={13} className="opacity-40" /> : <ChevronRight size={13} className="opacity-40" />}
      </button>
      {open && (
        <div className="ml-4 pl-3 border-l border-gray-200 mt-0.5 space-y-0.5">
          {item.children.map((child, ci) => {
            if (child.heading) {
              return (
                <p key={`h-${ci}`} className="px-3 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {child.heading}
                </p>
              );
            }
            const ChildIcon = child.icon;
            const active = isActive(child.to);
            return (
              <Link
                key={child.to}
                to={child.to}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                  ${active ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                <ChildIcon size={14} className="flex-shrink-0" />
                <span>{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ROLE SWITCHER ──────────────────────────────────────────────────
function RoleSwitcher({ currentRole }) {
  const [switching, setSwitching] = useState(false);

  const ROLE_CP_PATH = {
    user: "/cp/user", product_buyer: "/cp/user", customer_kemework: "/cp/user", kemework_customer: "/cp/user",
    agent: "/cp/agent", agency: "/cp/agency", developer: "/cp/developer",
    franchise_owner: "/kemedar/franchise/dashboard", franchise_owner_area: "/kemedar/franchise/dashboard",
    product_seller: "/kemetro/seller/dashboard", kemetro_seller: "/kemetro/seller/dashboard",
    kemework_professional: "/cp/pro", kemework_company: "/cp/company", admin: "/admin",
  };

  const switchRole = async (newRole) => {
    setSwitching(true);
    await base44.auth.updateMe({ role: newRole });
    const path = ROLE_CP_PATH[newRole] || "/cp/user";
    window.location.href = path;
  };

  return (
    <div className="px-3 pb-2">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">🛠 Dev: Switch Role</p>
      <select
        value={currentRole}
        onChange={e => switchRole(e.target.value)}
        disabled={switching}
        className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg px-2 py-1.5 border border-gray-200 focus:outline-none cursor-pointer"
      >
        {ALL_ROLES.map(r => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── MAIN SIDEBAR ───────────────────────────────────────────────────
export default function DashboardSidebar({ collapsed, onClose }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const role = user?.role || "user";
  const menuItems = ROLE_MENU_MAP[role] || COMMON_MENU;
  const badge = ROLE_BADGE[role] || ROLE_BADGE.user;
  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const isActive = (to) => to && (pathname === to || (to !== "/dashboard" && pathname.startsWith(to)));

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50 flex flex-col
        bg-white border-r border-gray-200 text-gray-800 transition-transform duration-300
        w-[260px]
        ${collapsed ? "-translate-x-full" : "translate-x-0"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Mobile close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 lg:hidden">
          <X size={18} />
        </button>

        {/* User Card */}
        <div className="px-5 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight truncate">{user?.full_name || "User"}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email || ""}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
            <Link to="/dashboard/profile" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              Edit Profile →
            </Link>
          </div>
          {(role === "franchise_owner_area" || role === "franchise_owner") && (
            <div className="mt-3 space-y-1">
              <p className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin size={10} /> Cairo, Egypt</p>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-yellow-500 font-bold">Performance: 87/100</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {menuItems.map((item, idx) => {
            if (item.children) {
              return <SubMenu key={idx} item={item} isActive={isActive} onClose={onClose} />;
            }
            const Icon = item.icon;
            const to = item.to;
            const active = isActive(to);
            return (
              <Link
                key={to || idx}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
                  ${active
                    ? "bg-orange-50 text-orange-600 border-orange-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                  }`}
              >
                <Icon size={17} className="flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 pt-3 space-y-1">
          <RoleSwitcher currentRole={role} />
          <div className="px-3 pb-3 space-y-1">
            <Link
              to="/dashboard/support"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
            >
              <HelpCircle size={17} />
              <span>Help & Support</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}