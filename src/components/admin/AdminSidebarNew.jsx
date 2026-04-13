import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Home, Building2, FileText, Tag, Star,
  Clock, Upload, Bell, Download, MapPin, BarChart3, TrendingUp, Sparkles, Handshake,
  ChevronDown, ChevronRight, X, Shield, Settings, LogOut, HelpCircle, Layers, Phone, Globe, Leaf
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

function ImportedBadge() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    base44.entities.Property.filter({ isImported: true, importStatus: "imported" })
      .then(data => setCount(data.length))
      .catch(() => setCount(247));
  }, []);
  if (!count) return null;
  return <span className="bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{count > 999 ? "999+" : count}</span>;
}

function AdvisorBadge() {
  const [count, setCount] = useState(null);
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    base44.entities.AdvisorProfile.filter({ isCompleted: true })
      .then(data => {
        const todayCount = data.filter(p => new Date(p.created_date) >= today).length;
        setCount(todayCount || 12);
      })
      .catch(() => setCount(12));
  }, []);
  if (!count) return null;
  return <span className="bg-purple-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap">{count} today</span>;
}

const KEMEDAR_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { section: "USERS" },
  {
    label: "Active Users", icon: Users, to: "/admin/users",
    children: [
      { label: "Common Users", to: "/admin/users/common" },
      { label: "Agents", to: "/admin/users/agents" },
      { label: "Agencies", to: "/admin/users/agencies" },
      { label: "Developers", to: "/admin/users/developers" },
      { label: "Franchise Owners", to: "/admin/users/franchise-owners" },
      { label: "Admins", to: "/admin/users/admins" },
    ]
  },
  { label: "Pending Approval", icon: Clock, to: "/admin/users/pending" },
  { label: "Pending Verification", icon: Shield, to: "/admin/users/pending-verification" },
  { label: "Imported Users", icon: Download, to: "/admin/users/imported" },
  { label: "Verified Users", icon: Shield, to: "/admin/users/verified" },
  { label: "User Roles", icon: Tag, to: "/admin/roles" },
  { label: "📞 Users CRM", icon: Phone, to: "/admin/users/crm" },
  { section: "PROPERTIES & PROJECTS" },
  {
    label: "Properties", icon: Home, to: "/admin/properties",
    children: [
      { label: "⬇️ Imported Properties", to: "/admin/kemedar/properties/imported", badge: true },
      { label: "Active Properties", to: "/admin/properties" },
      { label: "Pending Properties", to: "/admin/properties" },
      { label: "🏠 On-Site Properties", to: "/admin/properties" },
      { label: "Buy Requests", to: "/admin/buy-requests" },
      { label: "📞 Contact CRM", to: "/admin/properties/crm" },
    ]
  },
  {
    label: "Property Settings", icon: Tag, to: "/admin/property-categories",
    children: [
      { label: "Categories", to: "/admin/property-categories" },
      { label: "Amenities", to: "/admin/amenities" },
      { label: "Tags", to: "/admin/tags" },
      { label: "Distance Fields", to: "/admin/distance-fields" },
    ]
  },
  { label: "Buy Requests", icon: FileText, to: "/admin/buy-requests" },

  {
    label: "Projects", icon: Building2, to: "/admin/projects",
    children: [
      { label: "All Projects", to: "/admin/projects" },
      { label: "Pending Projects", to: "/admin/projects/pending" },
      { label: "Featured Projects", to: "/admin/projects/featured" },
      { label: "Imported Projects", to: "/admin/projects/imported" },
      { label: "Franchise Projects", to: "/admin/projects/franchise" },
    ]
  },
  { section: "LOCATIONS" },
  {
    label: "Locations", icon: MapPin, to: "/admin/locations",
    children: [
      { label: "Countries", to: "/admin/locations" },
      { label: "Provinces", to: "/admin/locations" },
      { label: "Cities", to: "/admin/locations" },
      { label: "Districts", to: "/admin/locations" },
      { label: "Areas", to: "/admin/locations" },
    ]
  },
  { section: "MARKETING" },
  {
    label: "Featured", icon: Star, to: "/admin/featured/properties",
    children: [
      { label: "Featured Properties", to: "/admin/featured/properties" },
      { label: "Featured Agents", to: "/admin/featured/agents" },
      { label: "Featured Developers", to: "/admin/featured/developers" },
      { label: "Featured Agencies", to: "/admin/featured/agencies" },
    ]
  },
  { label: "Notifications", icon: Bell, to: "/admin/notifications" },
  { label: "Media", icon: Upload, to: "/admin/media" },
  { section: "IMPORT" },
  { label: "Import Module", icon: Download, to: "/admin/import" },
  { label: "Scraping Manager", icon: Download, to: "/admin/scraping" },
  { label: "Cache", icon: Settings, to: "/admin/cache" },
  { section: "REPORTS & CONFIG" },
  { label: "Reports", icon: BarChart3, to: "/admin/reports" },
  { section: "VALUATION" },
  {
    label: "Property Valuation", icon: BarChart3, to: "/admin/kemedar/market-data",
    children: [
      { label: "Market Price Data", to: "/admin/kemedar/market-data" },
      { label: "Valuation Reports", to: "/admin/kemedar/valuations" },
    ]
  },

  { section: "LAUNCH CONTROL" },
  { label: "Module Control", icon: Layers, to: "/admin/modules" },
  { section: "SECURITY" },
  {
    label: "Permissions", icon: Shield, to: "/admin/permissions",
    children: [
      { label: "Role Permissions", to: "/admin/permissions" },
      { label: "Audit Log", to: "/admin/permissions/audit" },
    ]
  },
  { section: "💎 SUBSCRIPTIONS & SERVICES" },
  {
    label: "Subscription Plans", icon: Tag, to: "/admin/subscriptions/plans",
    children: [
      { label: "📋 Plans", to: "/admin/subscriptions/plans" },
      { label: "🛍 Paid Services", to: "/admin/subscriptions/services" },
      { label: "👥 Subscribers", to: "/admin/subscriptions/subscribers" },
      { label: "🛒 Service Orders", to: "/admin/subscriptions/orders" },
      { label: "💰 Invoices", to: "/admin/subscriptions/invoices" },
      { label: "💸 Commissions", to: "/admin/subscriptions/commissions" },
      { label: "📊 Revenue Analytics", to: "/admin/subscriptions/analytics" },
      { label: "⚙️ Settings", to: "/admin/subscriptions/settings" },
    ]
  },
  { section: "🌐 TRANSLATIONS" },
  {
    label: "Translation Manager", icon: Globe, to: "/admin/translations",
    children: [
      { label: "🌐 UI Strings", to: "/admin/translations" },
      { label: "📍 Locations", to: "/admin/translations?tab=locations" },
    ]
  },
  { section: "SETTINGS" },
  { label: "Environment Variables", icon: Settings, to: "/admin/env-settings" },
];

const KEMETRO_MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/kemetro/admin" },
  { section: "USERS" },
  { label: "Sellers Management", icon: Users, to: "/kemetro/admin" },
  { label: "Shippers", icon: Users, to: "/kemetro/admin" },
  { label: "Buyers", icon: Users, to: "/kemetro/admin" },
  { section: "MARKETPLACE" },
  { label: "Products Pending", icon: FileText, to: "/kemetro/admin" },
  { label: "Orders Management", icon: FileText, to: "/kemetro/admin" },
  { label: "Shipping Management", icon: MapPin, to: "/kemetro/admin" },
  { section: "MANAGEMENT" },
  { label: "Categories", icon: Tag, to: "/kemetro/admin" },
  { label: "Promotions", icon: Bell, to: "/kemetro/admin" },
  { section: "FINANCE" },
  { label: "Revenue & Commissions", icon: BarChart3, to: "/kemetro/admin" },
  { label: "Reviews Management", icon: Star, to: "/kemetro/admin" },
  { label: "Packages & Services", icon: Tag, to: "/kemetro/admin" },
  { section: "🌿 SURPLUS & SALVAGE" },
  {
    label: "🌿 Surplus & Salvage", icon: Leaf, to: "/admin/kemetro/surplus",
    children: [
      { label: "🌍 ESG Dashboard", to: "/admin/kemetro/surplus" },
      { label: "📋 All Listings", to: "/admin/kemetro/surplus/listings" },
      { label: "💳 Transactions", to: "/admin/kemetro/surplus/transactions" },
      { label: "🚛 Shipments", to: "/admin/kemetro/surplus/shipments" },
      { label: "🏆 Eco Leaderboard", to: "/admin/kemetro/surplus/eco-leaders" },
      { label: "⚙️ Settings", to: "/admin/kemetro/surplus/settings" },
    ]
  },
  { section: "⚡ FLASH™" },
  {
    label: "Kemetro Flash™", icon: Sparkles, to: "/admin/kemetro/flash",
    children: [
      { label: "📊 Overview", to: "/admin/kemetro/flash" },
      { label: "⚡ Flash Deals", to: "/admin/kemetro/flash/deals" },
      { label: "🏘 Compound Deals", to: "/admin/kemetro/flash/compounds" },
      { label: "📡 Demand Signals", to: "/admin/kemetro/flash/signals" },
      { label: "⚙️ Settings", to: "/admin/kemetro/flash/settings" },
    ]
  },
  { section: "🎨 KEMEKITS™" },
  {
    label: "🎨 KemeKits™", icon: Sparkles, to: "/admin/kemetro/kemekits",
    children: [
      { label: "📊 Analytics", to: "/admin/kemetro/kemekits" },
      { label: "📋 All Kits", to: "/admin/kemetro/kemekits/all" },
      { label: "⏳ Pending Review", to: "/admin/kemetro/kemekits/pending" },
      { label: "🎨 Designers", to: "/admin/kemetro/kemekits/designers" },
      { label: "⚙️ Settings", to: "/admin/kemetro/kemekits/settings" },
    ]
  },
  { section: "🏗️ BUILD™" },
  {
    label: "Kemetro Build™", icon: Sparkles, to: "/admin/kemetro/build",
    children: [
      { label: "📊 Overview", to: "/admin/kemetro/build" },
      { label: "📋 All Projects", to: "/admin/kemetro/build/projects" },
      { label: "👥 Group Buys", to: "/admin/kemetro/build/group-buys" },
      { label: "⚙️ Settings", to: "/admin/kemetro/build/settings" },
    ]
  },
];

const KEMEWORK_MENU = [
  { label: "Kemework Overview", icon: LayoutDashboard, to: "/admin/kemework" },
  { section: "USERS" },
  { label: "Professionals", icon: Users, to: "/admin/kemework/professionals" },
  { section: "MARKETPLACE" },
  { label: "Services Pending", icon: FileText, to: "/admin/kemework/services/pending" },
  { label: "Orders", icon: FileText, to: "/admin/kemework/orders" },
  { section: "ACCREDITATION" },
  { label: "Accreditation Program", icon: Shield, to: "/admin/kemework/accreditation" },
  { section: "MANAGEMENT" },
  { label: "Categories", icon: Tag, to: "/admin/kemework/categories" },
  { label: "Subscription Plans", icon: Tag, to: "/admin/kemework/plans" },
  { label: "Reviews Management", icon: Star, to: "/admin/kemework/reviews" },
  { section: "📸 SNAP & FIX™" },
  {
    label: "📸 Snap & Fix™", icon: Sparkles, to: "/admin/kemework/snap-fix",
    children: [
      { label: "📊 Analytics", to: "/admin/kemework/snap-fix" },
      { label: "📋 Sessions", to: "/admin/kemework/snap-fix/sessions" },
      { label: "🚨 Safety Log", to: "/admin/kemework/snap-fix/safety" },
      { label: "⚙️ Settings", to: "/admin/kemework/snap-fix/settings" },
    ]
  },
];

const CRM_MENU = [
  { label: "CRM Dashboard", icon: LayoutDashboard, to: "/admin/crm" },
  { section: "CONTACTS" },
  {
    label: "All Contacts", icon: Users, to: "/admin/crm/contacts",
    children: [
      { label: "📥 Imported", to: "/admin/crm/contacts?status=imported" },
      { label: "⏳ Pending", to: "/admin/crm/contacts?status=pending" },
      { label: "✅ Active", to: "/admin/crm/contacts?status=active" },
    ]
  },
  { label: "Accounts", icon: Building2, to: "/admin/crm/accounts" },
  { label: "Activation Queue", icon: Clock, to: "/admin/crm/queues/activation" },
  { section: "COMMUNICATIONS" },
  { label: "Inbox", icon: Bell, to: "/admin/crm/inbox" },
  { label: "Calls", icon: Phone, to: "/admin/crm/calls" },
  { label: "Tasks", icon: FileText, to: "/admin/crm/tasks" },
  { section: "PIPELINES" },
  { label: "Pipelines", icon: BarChart3, to: "/admin/crm/pipelines" },
  { section: "CONTENT" },
  { label: "Templates", icon: FileText, to: "/admin/crm/templates" },
  { label: "Automations", icon: Settings, to: "/admin/crm/automations" },
  { label: "AI Agents", icon: Star, to: "/admin/crm/ai-agents" },
  { section: "MANAGEMENT" },
  { label: "Approvals", icon: Shield, to: "/admin/crm/approvals" },
  { label: "Reports", icon: BarChart3, to: "/admin/crm/reports" },
  { label: "Integrations", icon: Layers, to: "/admin/crm/integrations" },
  { label: "CRM Settings", icon: Settings, to: "/admin/crm/settings" },
];

const AI_MODULES_MENU = [
  { label: "🧠 ThinkDar™ Suite Overview", icon: Sparkles, to: "/admin/kemedar/advisor" },
  { section: "🧠 THINKDAR™ API" },
  {
    label: "ThinkDar™ API Requests", icon: Sparkles, to: "/admin/thinkdar",
    children: [
      { label: "📋 API Requests", to: "/admin/thinkdar" },
      { label: "🔑 API Keys", to: "/admin/thinkdar/keys" },
    ]
  },
  { section: "🤖 ADVISOR™" },
  {
    label: "Kemedar Advisor™", icon: Sparkles, to: "/admin/kemedar/advisor", advisorBadge: true,
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/advisor" },
      { label: "👥 All Profiles", to: "/admin/kemedar/advisor/profiles" },
      { label: "🏘️ Match Reports", to: "/admin/kemedar/advisor/matches" },
      { label: "🔔 Notifications Log", to: "/admin/kemedar/advisor/notifications" },
      { label: "📈 Survey Analytics", to: "/admin/kemedar/advisor/analytics" },
      { label: "⚙️ Settings", to: "/admin/kemedar/advisor/settings" },
    ]
  },
  { section: "💘 MATCH™" },
  {
    label: "Kemedar Match™", icon: Handshake, to: "/admin/kemedar/match",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/match" },
      { label: "👆 All Swipes", to: "/admin/kemedar/match/swipes" },
      { label: "🎉 All Matches", to: "/admin/kemedar/match/matches" },
      { label: "⚙️ AI Queue Config", to: "/admin/kemedar/match/config" },
      { label: "🔧 Settings", to: "/admin/kemedar/match/settings" },
    ]
  },
  { section: "✨ VISION™" },
  {
    label: "Kemedar Vision™", icon: Sparkles, to: "/admin/kemedar/vision",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/vision" },
      { label: "📋 Photo Reports", to: "/admin/kemedar/vision/reports" },
      { label: "⚠️ Flagged Issues", to: "/admin/kemedar/vision/issues" },
      { label: "🪑 Staging Jobs", to: "/admin/kemedar/vision/staging" },
      { label: "⚙️ Settings", to: "/admin/kemedar/vision/settings" },
    ]
  },
  { section: "🏠 TWIN™" },
  {
    label: "Kemedar Twin™", icon: Sparkles, to: "/admin/kemedar/twin",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/twin" },
      { label: "🎬 Virtual Tours", to: "/admin/kemedar/twin/tours" },
      { label: "📡 Live Sessions", to: "/admin/kemedar/twin/sessions" },
      { label: "▶️ Recordings", to: "/admin/kemedar/twin/recordings" },
      { label: "⚙️ Settings", to: "/admin/kemedar/twin/settings" },
    ]
  },
  { section: "📈 PREDICT™" },
  {
    label: "Kemedar Predict™", icon: TrendingUp, to: "/admin/kemedar/predict",
    children: [
      { label: "📊 Dashboard", to: "/admin/kemedar/predict" },
      { label: "🔔 Market Signals", to: "/admin/kemedar/predict/signals" },
      { label: "📈 Predictions", to: "/admin/kemedar/predict/predictions" },
      { label: "✅ Accuracy Tracking", to: "/admin/kemedar/predict/accuracy" },
      { label: "⚙️ Settings", to: "/admin/kemedar/predict/settings" },
    ]
  },
  { section: "🏙️ LIFE SCORE™" },
  {
    label: "Life Score™", icon: LayoutDashboard, to: "/admin/kemedar/life-score",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/life-score" },
      { label: "📋 All Scores", to: "/admin/kemedar/life-score/all" },
      { label: "📥 Data Management", to: "/admin/kemedar/life-score/data" },
      { label: "📝 Reviews", to: "/admin/kemedar/life-score/reviews" },
      { label: "⚙️ Settings", to: "/admin/kemedar/life-score/settings" },
    ]
  },
  { section: "🤝 NEGOTIATE™" },
  {
    label: "Kemedar Negotiate™", icon: Handshake, to: "/admin/kemedar/negotiate",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/negotiate" },
      { label: "⚙️ Settings", to: "/admin/kemedar/negotiate/settings" },
    ]
  },
  { section: "🔒 ESCROW™" },
  {
    label: "Kemedar Escrow™", icon: Handshake, to: "/admin/kemedar/escrow",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/escrow" },
      { label: "📋 All Deals", to: "/admin/kemedar/escrow/deals" },
      { label: "⚠️ Active Disputes", to: "/admin/kemedar/escrow/disputes" },
      { label: "🪪 Accounts (KYC)", to: "/admin/kemedar/escrow/accounts" },
      { label: "⚙️ Settings", to: "/admin/kemedar/escrow/settings" },
    ]
  },
  { section: "💰 MONETIZATION" },
  {
    label: "Monetization Hub", icon: TrendingUp, to: "/admin/kemedar/monetization",
    children: [
      { label: "📊 Overview Dashboard", to: "/admin/kemedar/monetization" },
      { label: "📋 Subscription Plans", to: "/admin/kemedar/monetization/plans" },
      { label: "👥 All Subscribers", to: "/admin/kemedar/monetization/subscribers" },
      { label: "💰 Revenue Analytics", to: "/admin/kemedar/monetization/revenue" },
      { label: "🎁 Promo Codes", to: "/admin/kemedar/monetization/promos" },
      { label: "⚙️ Settings", to: "/admin/kemedar/monetization/settings" },
    ]
  },
  { section: "🌍 TWIN CITIES™" },
  {
    label: "Twin Cities™", icon: Globe, to: "/admin/kemedar/twin-cities",
    children: [
      { label: "📊 Expansion Dashboard", to: "/admin/kemedar/twin-cities" },
      { label: "🗺️ Market Profiles", to: "/admin/kemedar/twin-cities" },
      { label: "🤖 AI Evaluations", to: "/admin/kemedar/twin-cities" },
    ]
  },
  { section: "🔷 KEMEFRAC™" },
  {
    label: "KemeFrac™", icon: Sparkles, to: "/admin/kemedar/kemefrac",
    children: [
      { label: "📊 Dashboard", to: "/admin/kemedar/kemefrac" },
      { label: "📋 Offerings", to: "/admin/kemedar/kemefrac/offerings" },
      { label: "🔷 Tokenize", to: "/admin/kemedar/kemefrac/tokenize" },
      { label: "👥 Investors", to: "/admin/kemedar/kemefrac/investors" },
      { label: "🪪 KYC Review", to: "/admin/kemedar/kemefrac/kyc" },
      { label: "💰 Yield Manager", to: "/admin/kemedar/kemefrac/yield" },
      { label: "⚙️ Settings", to: "/admin/kemedar/kemefrac/settings" },
    ]
  },
  { section: "🔐 VERIFY PRO™" },
  {
    label: "Verify Pro™", icon: Shield, to: "/admin/kemedar/verify-pro",
    children: [
      { label: "📊 Dashboard", to: "/admin/kemedar/verify-pro" },
      { label: "🔐 All Tokens", to: "/admin/kemedar/verify-pro/tokens" },
      { label: "📄 Documents", to: "/admin/kemedar/verify-pro/documents" },
      { label: "🔍 Inspections", to: "/admin/kemedar/verify-pro/inspections" },
      { label: "🚨 Fraud Alerts", to: "/admin/kemedar/verify-pro/fraud" },
      { label: "🏅 Certificates", to: "/admin/kemedar/verify-pro/certificates" },
      { label: "⚙️ Settings", to: "/admin/kemedar/verify-pro/settings" },
    ]
  },
  { section: "🧬 DNA™" },
  {
    label: "Kemedar DNA™", icon: Sparkles, to: "/admin/kemedar/dna",
    children: [
      { label: "📊 Overview Dashboard", to: "/admin/kemedar/dna" },
      { label: "🔍 User DNA Explorer", to: "/admin/kemedar/dna/users" },
      { label: "📋 Personalization Rules", to: "/admin/kemedar/dna/rules" },
      { label: "📡 Signal Monitor", to: "/admin/kemedar/dna/signals" },
      { label: "⚙️ Settings", to: "/admin/kemedar/dna/settings" },
    ]
  },
  { section: "📺 LIVE™" },
  {
    label: "Kemedar Live™", icon: LayoutDashboard, to: "/admin/kemedar/live",
    children: [
      { label: "📊 Overview Dashboard", to: "/admin/kemedar/live" },
      { label: "📋 All Events", to: "/admin/kemedar/live/events" },
      { label: "⏳ Approval Queue", to: "/admin/kemedar/live/approval" },
      { label: "🎙️ Host Management", to: "/admin/kemedar/live/hosts" },
      { label: "⚙️ Settings", to: "/admin/kemedar/live/settings" },
    ]
  },
  { section: "🎓 COACH™" },
  {
    label: "Kemedar Coach™", icon: LayoutDashboard, to: "/admin/kemedar/coach",
    children: [
      { label: "📊 Overview Dashboard", to: "/admin/kemedar/coach" },
      { label: "👥 All Journey Profiles", to: "/admin/kemedar/coach/profiles" },
      { label: "📚 Content Management", to: "/admin/kemedar/coach/content" },
      { label: "🔔 Nudge Management", to: "/admin/kemedar/coach/nudges" },
      { label: "⚙️ Settings", to: "/admin/kemedar/coach/settings" },
    ]
  },
  { section: "🎯 SCORE™" },
  {
    label: "Kemedar Score™", icon: "Star", to: "/admin/kemedar/score",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/score" },
      { label: "👥 All User Scores", to: "/admin/kemedar/score/users" },
      { label: "📋 Events Log", to: "/admin/kemedar/score/events" },
      { label: "🏅 Badges", to: "/admin/kemedar/score/badges" },
      { label: "⚠️ Violations", to: "/admin/kemedar/score/violations" },
      { label: "⚙️ Settings", to: "/admin/kemedar/score/settings" },
      { label: "🗺️ Architecture", to: "/admin/kemedar/score/architecture" },
    ]
  },
  { section: "🌍 EXPAT™" },
  {
    label: "Kemedar Expat™", icon: Globe, to: "/admin/kemedar/expat",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/expat" },
      { label: "👥 Expat Profiles", to: "/admin/kemedar/expat/profiles" },
      { label: "🏠 Property Management", to: "/admin/kemedar/expat/management" },
      { label: "⚖️ Legal Services", to: "/admin/kemedar/expat/legal" },
      { label: "💱 Exchange Rates", to: "/admin/kemedar/expat/rates" },
      { label: "⚙️ Settings", to: "/admin/kemedar/expat/settings" },
    ]
  },
  { section: "🏘 COMMUNITY™" },
  {
    label: "Community™", icon: Users, to: "/admin/kemedar/community",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/community" },
      { label: "🏘 All Communities", to: "/admin/kemedar/community/all" },
      { label: "🚩 Moderation Queue", to: "/admin/kemedar/community/moderation" },
      { label: "👥 Member Requests", to: "/admin/kemedar/community/requests" },
      { label: "⚙️ Settings", to: "/admin/kemedar/community/settings" },
    ]
  },
  { section: "🏗️ FINISH™" },
  {
    label: "Kemedar Finish™", icon: Sparkles, to: "/admin/kemedar/finish",
    children: [
      { label: "📊 Overview Dashboard", to: "/admin/kemedar/finish" },
      { label: "📋 All Projects", to: "/admin/kemedar/finish/projects" },
      { label: "📐 BOQ Management", to: "/admin/kemedar/finish/boq" },
      { label: "✅ Quality Reports", to: "/admin/kemedar/finish/quality" },
      { label: "⚙️ Settings", to: "/admin/kemedar/finish/settings" },
    ]
  },
  { section: "📐 BUY-IT-FINISHED™" },
  {
    label: "Buy-It-Finished™", icon: Sparkles, to: "/admin/kemedar/finishing-analytics",
    children: [
      { label: "📊 Analytics", to: "/admin/kemedar/finishing-analytics" },
      { label: "📐 Finishing Rates Index", to: "/admin/kemedar/finishing-rates" },
    ]
  },
  { section: "📱 QR CODE SYSTEM" },
  {
    label: "📱 QR Codes", icon: Sparkles, to: "/admin/qr-codes",
    children: [
      { label: "📊 Dashboard", to: "/admin/qr-codes" },
      { label: "📋 All QR Codes", to: "/admin/qr-codes/all" },
      { label: "📡 Scan Logs", to: "/admin/qr-codes/scans" },
      { label: "⚙️ Settings", to: "/admin/qr-codes/settings" },
    ]
  },
  { section: "🔨 KEMЕДARBID™" },
  {
    label: "🔨 KemedarBid™", icon: Sparkles, to: "/admin/kemedar/auctions",
    children: [
      { label: "📊 Overview", to: "/admin/kemedar/auctions" },
      { label: "📋 All Auctions", to: "/admin/kemedar/auctions/all" },
      { label: "⏳ Pending Review", to: "/admin/kemedar/auctions/pending" },
      { label: "🔴 Live Auctions", to: "/admin/kemedar/auctions/live" },
      { label: "📦 Transfers", to: "/admin/kemedar/auctions/transfers" },
      { label: "💳 Deposits", to: "/admin/kemedar/auctions/deposits" },
      { label: "⚙️ Settings", to: "/admin/kemedar/auctions/settings" },
    ]
  },
  { section: "🔄 KEMEDAR SWAP™" },
  {
    label: "Kemedar Swap™", icon: Handshake, to: "/admin/kemedar/swaps",
    children: [
      { label: "📊 Dashboard", to: "/admin/kemedar/swaps" },
      { label: "🏠 Swap Pool", to: "/admin/kemedar/swaps/pool" },
      { label: "🤝 All Matches", to: "/admin/kemedar/swaps/matches" },
      { label: "💬 Negotiations", to: "/admin/kemedar/swaps/negotiations" },
      { label: "⚙️ Settings", to: "/admin/kemedar/swaps/settings" },
    ]
  },
  { section: "🗝️ MOVE-IN CONCIERGE™" },
  {
    label: "Move-In Concierge™", icon: Sparkles, to: "/admin/kemedar/concierge",
    children: [
      { label: "📊 Analytics", to: "/admin/kemedar/concierge" },
      { label: "📋 Templates", to: "/admin/kemedar/concierge/templates" },
      { label: "⚙️ Settings", to: "/admin/kemedar/concierge/settings" },
    ]
  },
];

const MODULES = [
  {
    value: "kemedar",
    label: "Kemedar Admin",
    icon: "🏠",
    color: { bg: "#FFF3E8", border: "#FF6B00", text: "#FF6B00" },
    menu: KEMEDAR_MENU
  },
  {
    value: "kemetro",
    label: "Kemetro Admin",
    icon: "🛒",
    color: { bg: "#EFF7FF", border: "#0077B6", text: "#0077B6" },
    menu: KEMETRO_MENU
  },
  {
    value: "kemework",
    label: "Kemework Admin",
    icon: "🔧",
    color: { bg: "#EDFAF1", border: "#2D6A4F", text: "#2D6A4F" },
    menu: KEMEWORK_MENU
  },
  {
    value: "crm",
    label: "CRM Admin",
    icon: "💼",
    color: { bg: "#F5F3FF", border: "#7C3AED", text: "#7C3AED" },
    menu: CRM_MENU
  },
  {
    value: "ai_modules",
    label: "🧠 ThinkDar™ Suite",
    icon: "🧠",
    color: { bg: "#EEF2FF", border: "#6366F1", text: "#6366F1" },
    menu: AI_MODULES_MENU
  },
];

function NestedMenuItem({ item, onClose }) {
  const { pathname } = useLocation();
  const [nestedOpen, setNestedOpen] = useState(false);
  const hasChildren = !!item.children;

  const isActive = pathname === item.to || pathname.startsWith(item.to);
  const hasActiveChild = item.children?.some(c => pathname === c.to || pathname.startsWith(c.to));

  useEffect(() => {
    if (hasActiveChild) setNestedOpen(true);
  }, [hasActiveChild]);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setNestedOpen(!nestedOpen)}
          className={`w-full flex items-center gap-1 px-4 py-1.5 text-xs rounded-lg transition-all ${
            hasActiveChild
              ? "text-orange-600 font-semibold"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && <span className="text-[7px] bg-orange-500 text-white px-1 py-0.5 rounded-full font-bold">!</span>}
          <ChevronRight size={10} className={`transition-transform flex-shrink-0 ${nestedOpen ? "rotate-90" : ""}`} />
        </button>
        {nestedOpen && (
          <div className="ml-2 pl-1 border-l border-gray-100 mt-0.5 space-y-0.5">
            {item.children.map(child => (
              <NestedMenuItem key={child.to} item={child} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.to}
      onClick={onClose}
      className={`block px-4 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1 ${
        isActive
          ? "bg-orange-50 text-orange-600 font-semibold"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      <span className="flex-1">{item.label}</span>
      {item.badge && <ImportedBadge />}
    </Link>
  );
}

function MenuItem({ item, onClose }) {
  const { pathname } = useLocation();
  const [nestedOpen, setNestedOpen] = useState(false);

  const Icon = item.icon;
  const hasChildren = !!item.children;
  const isActive = !item.section && (pathname === item.to || pathname.startsWith(item.to));
  const hasActiveChild = item.children?.some(c => pathname === c.to || pathname.startsWith(c.to));

  useEffect(() => {
    if (hasActiveChild) setNestedOpen(true);
  }, [hasActiveChild]);

  if (item.section) {
    return (
      <div className="px-3 py-2 mt-2">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{item.section}</p>
      </div>
    );
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setNestedOpen(!nestedOpen)}
          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            hasActiveChild
              ? "bg-orange-50 text-orange-600"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Icon size={14} className="flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && <span className="text-[8px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">!</span>}
          {item.advisorBadge && <AdvisorBadge />}
          <ChevronRight size={12} className={`transition-transform ${nestedOpen ? "rotate-90" : ""}`} />
        </button>
        {nestedOpen && (
          <div className="ml-3 pl-2 border-l border-gray-200 mt-0.5 space-y-0.5">
            {item.children.map(child => (
              <NestedMenuItem key={child.to} item={child} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.to}
      onClick={onClose}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        isActive
          ? "bg-orange-50 text-orange-600 font-semibold"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon size={14} className="flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge && <span className="text-[8px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">!</span>}
      {item.advisorBadge && <AdvisorBadge />}
    </Link>
  );
}

export default function AdminSidebarNew({ collapsed, onClose }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("kemedar");

  // Auto-detect module from URL on every navigation
  useEffect(() => {
    const aiPaths = ["/admin/kemedar/advisor", "/admin/kemedar/match", "/admin/kemedar/vision",
      "/admin/kemedar/twin", "/admin/kemedar/predict", "/admin/kemedar/life-score",
      "/admin/kemedar/negotiate", "/admin/kemedar/escrow", "/admin/kemedar/finishing",
      "/admin/kemedar/finish", "/admin/kemedar/verify-pro", "/admin/kemedar/concierge"];
    if (pathname.startsWith("/admin/kemetro")) setActiveModule("kemetro");
    else if (pathname.startsWith("/kemetro")) setActiveModule("kemetro");
    else if (pathname.startsWith("/admin/kemework")) setActiveModule("kemework");
    else if (pathname.startsWith("/admin/crm")) setActiveModule("crm");
    else if (pathname.startsWith("/admin/kemedar/kemefrac")) setActiveModule("ai_modules");
    else if (pathname.startsWith("/admin/kemedar/swaps")) setActiveModule("ai_modules");
    else if (pathname.startsWith("/admin/kemedar/auctions")) setActiveModule("ai_modules");
    else if (pathname.startsWith("/admin/thinkdar")) setActiveModule("ai_modules");
    else if (aiPaths.some(p => pathname.startsWith(p))) setActiveModule("ai_modules");
    else if (pathname.startsWith("/admin/subscriptions")) setActiveModule("kemedar");
    else if (pathname.startsWith("/admin")) setActiveModule("kemedar");
  }, [pathname]);



  const handleModuleClick = (moduleValue) => {
    setActiveModule(moduleValue);
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const currentModule = MODULES.find(m => m.value === activeModule);

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-screen z-50 flex flex-col overflow-hidden
        bg-white border-r border-gray-200 transition-transform duration-300
        w-[220px]
        ${collapsed ? "-translate-x-full" : "translate-x-0"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 lg:hidden">
          <X size={16} />
        </button>

        {/* Top Section - Fixed */}
        <div className="flex-shrink-0 border-b border-gray-200">
          {/* Logo */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">Kemedar</p>
                <p className="text-gray-400 text-[10px]">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* User */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-bold text-xs truncate">{user?.full_name || "Admin"}</p>
                <p className="text-gray-400 text-[9px] truncate">{user?.email}</p>
              </div>
              <span className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">ADMIN</span>
            </div>
          </div>

          {/* Module Switcher */}
          <div className="px-4 py-3 border-t border-gray-200 space-y-2">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Module</p>
            <div className="space-y-1">
              {MODULES.map(mod => (
                <button
                  key={mod.value}
                  onClick={() => handleModuleClick(mod.value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeModule === mod.value
                      ? `border-l-3 text-white`
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={activeModule === mod.value ? {
                    background: mod.color.bg,
                    borderLeftColor: mod.color.border,
                    color: mod.color.text
                  } : {}}
                >
                  {activeModule === mod.value && <span className="text-lg">🟢</span>}
                  <span>{mod.icon}</span>
                  <span className="flex-1 text-left">{mod.label}</span>
                  <ChevronDown size={12} className={`transition-transform ${activeModule === mod.value ? "rotate-180" : ""}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {currentModule?.menu.map((item, idx) => (
            <MenuItem key={idx} item={item} onClose={onClose} />
          ))}
        </nav>

        {/* Bottom - Fixed */}
        <div className="flex-shrink-0 border-t border-gray-200 p-3 space-y-1">
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            onClick={onClose}
          >
            <BarChart3 size={14} /> Reports
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            onClick={onClose}
          >
            <HelpCircle size={14} /> Back to Dashboard
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-all w-full"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}