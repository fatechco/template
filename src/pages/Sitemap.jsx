import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ROW_PUBLIC = [
  {
    id: "main",
    title: "🏠 Main / Public Pages",
    color: "bg-blue-700",
    links: [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Terms & Policies", to: "/terms" },
      { label: "Careers", to: "/careers" },
      { label: "Advertise", to: "/advertise" },
      { label: "Franchise Owner Area", to: "/user-benefits/franchise-owner-area" },
      { label: "KemeFrac™ — Fractional Investing", to: "/kemefrac" },
      { label: "KemedarBid™ — Property Auctions", to: "/auctions" },
      { label: "How Auctions Work", to: "/auctions/how-it-works" },
      { label: "Auction: [KBA-XXXXXX]", to: "/auctions/KBA-A1B2C3" },
      { label: "Verify Certificate", to: "/verify/tokenId" },
      { label: "Kemedar Swap™ Hub", to: "/dashboard/swap" },
      { label: "KemeKits — Room in a Box", to: "/kemetro/kemekits" },
      { label: "Surplus & Salvage Eco-Market", to: "/kemetro/surplus" },
      { label: "Snap & Fix — AI Repair Diagnosis", to: "/kemework/snap" },
      { label: "Sitemap", to: "/sitemap" },
    ],
  },
  {
    id: "kemedar",
    title: "🏢 Kemedar – Real Estate",
    color: "bg-orange-500",
    links: [
      { label: "Search Properties", to: "/search-properties" },
      { label: "Search Projects", to: "/search-projects" },
      { label: "Find Agents", to: "/find-profile/real-estate-agents" },
      { label: "Find Agencies", to: "/find-profile/agency" },
      { label: "Find Developers", to: "/find-profile/developer" },
      { label: "Find Franchise Owners", to: "/find-profile/franchise-owner" },
      { label: "Create Property", to: "/create/property" },
      { label: "Create Buy Request", to: "/create/buy-request" },
      { label: "Create Project", to: "/create/project" },
      { label: "AI Property Submission", to: "/kemedar/add/property/ai" },
      { label: "Kemedar Predict™", to: "/kemedar/predict" },
      { label: "Kemedar Life Score™", to: "/kemedar/life-score" },
      { label: "Kemedar Match™ (Swipe)", to: "/kemedar/match" },
      { label: "Kemedar Coach™", to: "/kemedar/coach" },
      { label: "Kemedar Negotiate™", to: "/kemedar/negotiate/landing" },
      { label: "Kemedar Vision™", to: "/kemedar/vision/landing" },
      { label: "Kemedar Advisor™", to: "/kemedar/advisor" },
      { label: "Kemedar Score™", to: "/kemedar/score/landing" },
      { label: "Kemedar DNA™", to: "/kemedar/dna/landing" },
      { label: "Kemedar Escrow™", to: "/kemedar/escrow/landing" },
      { label: "Kemedar Finish™", to: "/kemedar/finish" },
      { label: "Kemedar Expat™", to: "/kemedar/expat" },
      { label: "Kemedar Live™", to: "/kemedar/live" },
      { label: "Kemedar Community™", to: "/kemedar/community" },
      { label: "Kemedar Twin™ (3D Tours)", to: "/kemedar/twin-cities" },
      { label: "Rent2Own™ Program", to: "/kemedar/rent2own/landing" },
      { label: "Twin Cities™ (Cross-Market)", to: "/kemedar/twin-cities" },
      { label: "KemedarBid™ Auction Hub", to: "/auctions" },
      { label: "Kemedar Swap™ Matchmaker", to: "/dashboard/swap" },
      { label: "Verify Pro Wizard", to: "/verify/my-property/propertyId" },
      { label: "Move-In Concierge", to: "/dashboard/concierge/journeyId" },
      { label: "Shop the Look", to: "/kemedar/vision/landing" },
      { label: "Valuation Wizard", to: "/kemedar/valuation" },
      { label: "AI Property Search", to: "/kemedar/ai-search" },
      { label: "Kemedar Pricing", to: "/kemedar/pricing" },
    ],
  },
  {
    id: "kemetro",
    title: "🛒 Kemetro – Marketplace",
    color: "bg-green-700",
    links: [
      { label: "Kemetro Home", to: "/kemetro" },
      { label: "Search Products", to: "/kemetro/search" },
      { label: "Cart", to: "/kemetro/cart" },
      { label: "My Orders", to: "/kemetro/orders" },
      { label: "Track Shipment", to: "/kemetro/track" },
      { label: "Seller Benefits", to: "/kemetro/seller-benefits" },
      { label: "Buyer Benefits", to: "/kemetro/buyer-benefits" },
      { label: "Fees", to: "/kemetro/fees" },
      { label: "How It Works", to: "/kemetro/how-it-works" },
      { label: "About Kemetro", to: "/kemetro/about" },
      { label: "Kemecoin", to: "/kemetro/kemecoin" },
      { label: "Export", to: "/kemetro/export" },
      { label: "Register as Seller", to: "/kemetro/seller/register" },
      { label: "Register as Shipper", to: "/kemetro/shipper/register" },
      { label: "KemeKits Gallery", to: "/kemetro/kemekits" },
      { label: "KemeKit Detail & Calculator", to: "/kemetro/kemekits/slug" },
      { label: "My KemeKit Calculations", to: "/kemetro/kemekits/my-calculations" },
      { label: "Surplus & Salvage Hub", to: "/kemetro/surplus" },
      { label: "Surplus Item Detail", to: "/kemetro/surplus/itemId" },
      { label: "Sell Surplus Materials", to: "/kemetro/surplus/add" },
      { label: "My Surplus Listings", to: "/kemetro/surplus/my-listings" },
      { label: "My Reservations (Surplus)", to: "/kemetro/surplus/my-reservations" },
      { label: "Kemetro Build™ (BOQ)", to: "/kemetro/build" },
      { label: "Kemetro Flash™ (Group Buy)", to: "/kemetro/flash" },
      { label: "Sponsor a Room", to: "/kemetro/seller/promotions" },
    ],
  },
  {
    id: "kemework",
    title: "🔧 Kemework – Services",
    color: "bg-purple-700",
    links: [
      { label: "Kemework Home", to: "/kemework" },
      { label: "Find Professionals", to: "/kemework/find-professionals" },
      { label: "Browse Tasks", to: "/kemework/tasks" },
      { label: "Browse Services", to: "/kemework/services" },
      { label: "Post a Task", to: "/kemework/post-task" },
      { label: "Add a Service", to: "/kemework/add-service" },
      { label: "How It Works", to: "/kemework/how-it-works" },
      { label: "Preferred Professional Program", to: "/kemework/preferred-professional-program" },
      { label: "Snap & Fix — AI Diagnosis", to: "/kemework/snap" },
      { label: "Snap & Fix Review", to: "/kemework/snap/review/id" },
      { label: "KemeKit Creator Studio", to: "/kemework/pro/kemekits/create" },
      { label: "My KemeKits (Pro)", to: "/kemework/pro/kemekits" },
    ],
  },
  {
    id: "kemefrac",
    title: "🔷 KemeFrac™ — Fractional Investment",
    color: "bg-teal-700",
    links: [
      { label: "KemeFrac™ Home", to: "/kemefrac" },
      { label: "Browse Offerings", to: "/kemefrac" },
      { label: "Offering Detail", to: "/kemefrac/slug" },
      { label: "KYC Verification", to: "/kemefrac/kyc" },
      { label: "My Portfolio", to: "/kemefrac/portfolio" },
      { label: "My Holdings (tab)", to: "/kemefrac/portfolio" },
      { label: "Yield History (tab)", to: "/kemefrac/portfolio" },
      { label: "My Watchlist (tab)", to: "/kemefrac/portfolio" },
      { label: "KYC Status (tab)", to: "/kemefrac/portfolio" },
      { label: "NEAR Wallet Connect", to: "/kemefrac/portfolio" },
    ],
  },
  {
    id: "bid",
    title: "🔨 KemedarBid™ — Auctions",
    color: "bg-red-700",
    links: [
      { label: "Auction Hub", to: "/auctions" },
      { label: "Live Auction Page", to: "/auctions/KBA-A1B2C3" },
      { label: "How Auctions Work", to: "/auctions/how-it-works" },
      { label: "Register to Bid", to: "/auctions/KBA-A1B2C3" },
      { label: "Place Bid (live page)", to: "/auctions/KBA-A1B2C3" },
      { label: "Auto-Bid Setup", to: "/auctions/KBA-A1B2C3" },
      { label: "Winner Payment Flow", to: "/auctions/KBA-A1B2C3/payment" },
      { label: "My Auctions Dashboard", to: "/dashboard/auctions" },
      { label: "Bidding (tab)", to: "/dashboard/auctions" },
      { label: "Won Auctions (tab)", to: "/dashboard/auctions" },
      { label: "Watching (tab)", to: "/dashboard/auctions" },
      { label: "My Auction Listings (seller)", to: "/dashboard/auctions" },
      { label: "Legal Transfer Tracker", to: "/auctions/KBA-A1B2C3/transfer" },
      { label: "Auction Seller Monitor", to: "/auctions/KBA-A1B2C3/manage" },
    ],
  },
  {
    id: "swap",
    title: "🔄 Kemedar Swap™",
    color: "bg-violet-700",
    links: [
      { label: "Swap Hub", to: "/dashboard/swap" },
      { label: "New Matches (tab)", to: "/dashboard/swap" },
      { label: "Active Negotiations (tab)", to: "/dashboard/swap/negotiations" },
      { label: "Mobile Swipe View", to: "/m/swap" },
      { label: "Negotiation Room", to: "/dashboard/swap/negotiation/matchId" },
      { label: "Financial Ledger (in room)", to: "/dashboard/swap/negotiation/matchId" },
      { label: "Negotiation Chat (in room)", to: "/dashboard/swap/negotiation/matchId" },
      { label: "Transfer Tracker", to: "/dashboard/swap" },
    ],
  },
];

const ROW_DASHBOARDS = [
  {
    id: "cp-user",
    title: "📊 Control Panel – Common User",
    color: "bg-slate-600",
    links: [
      { label: "Dashboard Home", to: "/cp/user" },
      { label: "My Profile", to: "/cp/user/profile" },
      { label: "My Properties", to: "/cp/user/my-properties" },
      { label: "Favorites", to: "/cp/user/favorites" },
      { label: "Compare Properties", to: "/cp/user/compare" },
      { label: "My Buy Requests", to: "/cp/user/my-buy-requests" },
      { label: "Search Buy Requests", to: "/cp/user/search-requests" },
      { label: "Buyer Organizer", to: "/cp/user/buyer-organizer" },
      { label: "Seller Organizer", to: "/cp/user/seller-organizer" },
      { label: "Kemedar Orders", to: "/cp/user/kemedar-orders" },
      { label: "Kemetro Orders", to: "/cp/user/kemetro-orders" },
      { label: "Kemetro RFQs", to: "/cp/user/kemetro-rfqs" },
      { label: "Kemework Orders", to: "/cp/user/kemework-orders" },
      { label: "Kemework My Tasks", to: "/cp/user/kemework/my-tasks" },
      { label: "Kemework Bookmarks", to: "/cp/user/kemework/bookmarks" },
      { label: "Invoices", to: "/cp/user/invoices" },
      { label: "Payment Methods", to: "/cp/user/payment-methods" },
      { label: "Subscription", to: "/cp/user/subscription" },
      { label: "Notifications", to: "/cp/user/notifications" },
      { label: "Wallet", to: "/cp/user/wallet" },
      { label: "Messages", to: "/cp/user/messages" },
      { label: "Tickets", to: "/cp/user/tickets" },
      { label: "Knowledge Base", to: "/cp/user/knowledge" },
      { label: "Contact Kemedar", to: "/cp/user/contact-kemedar" },
      { label: "Settings", to: "/cp/user/settings" },
      { label: "Move-In Concierge", to: "/dashboard/concierge/journeyId" },
      { label: "Kemedar Swap™ Hub", to: "/dashboard/swap" },
      { label: "My Auctions", to: "/dashboard/auctions" },
      { label: "KemeFrac™ Portfolio", to: "/kemefrac/portfolio" },
      { label: "My Surplus Listings", to: "/kemetro/surplus/my-listings" },
      { label: "My DNA Profile", to: "/cp/user/my-dna" },
      { label: "My Kemedar Score™", to: "/cp/user/score" },
      { label: "Valuations", to: "/cp/user/valuations" },
      { label: "Negotiations", to: "/cp/user/negotiations" },
      { label: "Escrow Wallet", to: "/cp/user/escrow" },
      { label: "KYC Dashboard", to: "/cp/user/kyc" },
    ],
  },
  {
    id: "cp-user-mobile",
    title: "📱 Mobile CP – Common User",
    color: "bg-slate-700",
    links: [
      { label: "Dashboard Home", to: "/m/cp/user" },
      { label: "My Profile", to: "/m/cp/user/profile" },
      { label: "My Properties", to: "/m/cp/user/my-properties" },
      { label: "Favorites", to: "/m/cp/user/favorites" },
      { label: "My Buy Requests", to: "/m/cp/user/my-buy-requests" },
      { label: "Buyer Organizer", to: "/m/cp/user/buyer-organizer" },
      { label: "Seller Organizer", to: "/m/cp/user/seller-organizer" },
      { label: "Kemedar Orders", to: "/m/cp/user/kemedar-orders" },
      { label: "Kemetro Orders", to: "/m/cp/user/kemetro-orders" },
      { label: "Kemework Orders", to: "/m/cp/user/kemework-orders" },
      { label: "Invoices", to: "/m/cp/user/invoices" },
      { label: "Payment Methods", to: "/m/cp/user/payment-methods" },
      { label: "Subscription", to: "/m/cp/user/subscription" },
      { label: "Notifications", to: "/m/cp/user/notifications" },
      { label: "Wallet", to: "/m/cp/user/wallet" },
      { label: "Tickets", to: "/m/cp/user/tickets" },
      { label: "Knowledge Base", to: "/m/cp/user/knowledge" },
      { label: "Settings", to: "/m/cp/user/settings" },
      { label: "My Auctions", to: "/m/dashboard/auctions" },
      { label: "My DNA Profile", to: "/m/cp/user/my-dna" },
      { label: "My Kemedar Score™", to: "/m/cp/user/score" },
      { label: "Valuations", to: "/m/cp/user/valuations" },
      { label: "Negotiations", to: "/m/cp/user/negotiations" },
    ],
  },
  {
    id: "cp-agent",
    title: "📊 Control Panel – Agent",
    color: "bg-indigo-600",
    links: [
      { label: "Dashboard Home", to: "/cp/agent" },
      { label: "My Profile", to: "/cp/agent/profile" },
      { label: "Business Profile", to: "/cp/agent/business-profile" },
      { label: "My Properties", to: "/cp/agent/my-properties" },
      { label: "My Buy Requests", to: "/cp/agent/my-buy-requests" },
      { label: "Clients", to: "/cp/agent/clients" },
      { label: "Appointments", to: "/cp/agent/appointments" },
      { label: "Performance Stats", to: "/cp/agent/performance" },
      { label: "Kemedar Orders", to: "/cp/agent/kemedar-orders" },
      { label: "Kemetro Orders", to: "/cp/agent/kemetro-orders" },
      { label: "Kemework Orders", to: "/cp/agent/kemework-orders" },
      { label: "Invoices", to: "/cp/agent/invoices" },
      { label: "Wallet", to: "/cp/agent/wallet" },
      { label: "Subscription", to: "/cp/agent/subscription" },
      { label: "Notifications", to: "/cp/agent/notifications" },
      { label: "Messages", to: "/cp/agent/messages" },
      { label: "Tickets", to: "/cp/agent/tickets" },
      { label: "Knowledge Base", to: "/cp/agent/knowledge" },
      { label: "Settings", to: "/cp/agent/settings" },
      { label: "Premium Services", to: "/cp/agent/premium-services" },
      { label: "Kemedar Coach™", to: "/kemedar/coach" },
      { label: "Kemedar Negotiate™", to: "/kemedar/negotiate/landing" },
      { label: "KemedarBid™ Monitor", to: "/dashboard/auctions" },
      { label: "Kemedar Score™", to: "/cp/agent/score" },
      { label: "Kemedar DNA™", to: "/cp/agent/my-dna" },
      { label: "Finish™ Projects", to: "/cp/agent/finish/new" },
      { label: "Vision™ Reports", to: "/cp/agent/vision" },
      { label: "Negotiations", to: "/cp/agent/negotiations" },
      { label: "Escrow Wallet", to: "/cp/agent/escrow" },
    ],
  },
  {
    id: "cp-agent-mobile",
    title: "📱 Mobile CP – Agent",
    color: "bg-indigo-700",
    links: [
      { label: "Dashboard Home", to: "/m/cp/agent" },
      { label: "My Profile", to: "/m/cp/agent/profile" },
      { label: "Business Profile", to: "/m/cp/agent/business-profile" },
      { label: "My Properties", to: "/m/cp/agent/my-properties" },
      { label: "My Buy Requests", to: "/m/cp/agent/my-buy-requests" },
      { label: "Clients", to: "/m/cp/agent/clients" },
      { label: "Appointments", to: "/m/cp/agent/appointments" },
      { label: "Kemedar Orders", to: "/m/cp/agent/kemedar-orders" },
      { label: "Invoices", to: "/m/cp/agent/invoices" },
      { label: "Wallet", to: "/m/cp/agent/wallet" },
      { label: "Subscription", to: "/m/cp/agent/subscription" },
      { label: "Notifications", to: "/m/cp/agent/notifications" },
      { label: "Messages", to: "/m/cp/agent/messages" },
      { label: "Tickets", to: "/m/cp/agent/tickets" },
      { label: "Settings", to: "/m/cp/agent/settings" },
    ],
  },
  {
    id: "cp-agency",
    title: "📊 Control Panel – Agency",
    color: "bg-cyan-600",
    links: [
      { label: "Dashboard Home", to: "/cp/agency" },
      { label: "Business Profile", to: "/cp/agency/business-profile" },
      { label: "My Agents", to: "/cp/agency/my-agents" },
      { label: "My Properties", to: "/cp/agency/my-properties" },
      { label: "My Buy Requests", to: "/cp/agency/my-buy-requests" },
      { label: "Clients", to: "/cp/agency/clients" },
      { label: "Appointments", to: "/cp/agency/appointments" },
      { label: "Performance Stats", to: "/cp/agency/performance" },
      { label: "Kemedar Orders", to: "/cp/agency/kemedar-orders" },
      { label: "Kemetro Orders", to: "/cp/agency/kemetro-orders" },
      { label: "Kemework Orders", to: "/cp/agency/kemework-orders" },
      { label: "Invoices", to: "/cp/agency/invoices" },
      { label: "Wallet", to: "/cp/agency/wallet" },
      { label: "Payment Methods", to: "/cp/agency/payment-methods" },
      { label: "Tickets", to: "/cp/agency/tickets" },
      { label: "Premium Services", to: "/cp/agency/premium-services" },
    ],
  },
  {
    id: "cp-developer",
    title: "📊 Control Panel – Developer",
    color: "bg-rose-600",
    links: [
      { label: "Dashboard Home", to: "/cp/developer" },
      { label: "My Profile", to: "/cp/developer/profile" },
      { label: "My Projects", to: "/cp/developer/my-projects" },
      { label: "My Properties", to: "/cp/developer/my-properties" },
      { label: "Business Profile", to: "/cp/developer/business-profile" },
      { label: "Project Sales", to: "/cp/developer/project-sales" },
      { label: "Performance Stats", to: "/cp/developer/performance" },
      { label: "Kemedar Orders", to: "/cp/developer/kemedar-orders" },
      { label: "Kemetro Orders", to: "/cp/developer/kemetro-orders" },
      { label: "Kemework Orders", to: "/cp/developer/kemework-orders" },
      { label: "Invoices", to: "/cp/developer/invoices" },
      { label: "Wallet", to: "/cp/developer/wallet" },
      { label: "Payment Methods", to: "/cp/developer/payment-methods" },
      { label: "Tickets", to: "/cp/developer/tickets" },
      { label: "Premium Services", to: "/cp/developer/premium-services" },
      { label: "KemeFrac™ Offerings", to: "/kemefrac" },
      { label: "KemedarBid™ Auctions", to: "/dashboard/auctions" },
      { label: "Kemetro Surplus Eco-Score", to: "/kemetro/surplus" },
      { label: "Kemedar Score™", to: "/cp/developer/score" },
      { label: "Kemedar Vision™", to: "/cp/developer/vision" },
      { label: "Finish™ Projects", to: "/cp/developer/finish/new" },
      { label: "Negotiations", to: "/cp/developer/negotiations" },
      { label: "Escrow Wallet", to: "/cp/developer/escrow" },
    ],
  },
  {
    id: "cp-fo",
    title: "🏙️ Control Panel – FO Area",
    color: "bg-orange-700",
    links: [
      { label: "FO Dashboard Home", to: "/kemedar/franchise/dashboard" },
      { label: "Area Overview", to: "/kemedar/franchise/area-overview" },
      { label: "Area Users", to: "/kemedar/franchise/area-users" },
      { label: "Area Properties", to: "/kemedar/franchise/area-properties" },
      { label: "Area Projects", to: "/kemedar/franchise/area-projects" },
      { label: "FO Inspection App", to: "/fo/verify-inspections" },
      { label: "Document Review Queue", to: "/kemedar/franchise/files" },
      { label: "KemedarBid™ Oversight", to: "/dashboard/auctions" },
      { label: "Swap™ Facilitation", to: "/dashboard/swap" },
      { label: "Area Kemework Tasks", to: "/kemedar/franchise/kemework-tasks" },
      { label: "Kemetro in My Area", to: "/kemedar/franchise/kemetro-sellers" },
      { label: "Money & Orders", to: "/kemedar/franchise/orders" },
      { label: "File Manager & Email", to: "/kemedar/franchise/files" },
      { label: "Bulk Communications", to: "/kemedar/franchise/bulk-comms" },
      { label: "Business Manager", to: "/kemedar/franchise/biz/setup" },
      { label: "Support & Knowledge Base", to: "/kemedar/franchise/support" },
      { label: "Mobile FO Dashboard", to: "/m/cp/franchise" },
    ],
  },
  {
    id: "cp-pro",
    title: "🔧 Control Panel – Kemework Pro",
    color: "bg-teal-600",
    links: [
      { label: "Pro Dashboard", to: "/cp/pro" },
      { label: "My Profile", to: "/cp/pro/profile" },
      { label: "My Services", to: "/cp/pro/services" },
      { label: "My Orders", to: "/cp/pro/orders" },
      { label: "My Bids", to: "/cp/pro/bids" },
      { label: "Portfolio", to: "/cp/pro/portfolio" },
      { label: "My Customers", to: "/cp/pro/customers" },
      { label: "Earnings", to: "/cp/pro/earnings" },
      { label: "Accreditation Status", to: "/cp/pro/accreditation" },
      { label: "Subscription", to: "/cp/pro/subscription" },
      { label: "Invoices", to: "/cp/pro/invoices" },
      { label: "Tickets", to: "/cp/pro/tickets" },
      { label: "KemeKit Creator Studio", to: "/kemework/pro/kemekits/create" },
      { label: "My KemeKits", to: "/kemework/pro/kemekits" },
      { label: "Search Tasks", to: "/cp/pro/search-tasks" },
      { label: "Available Tasks", to: "/cp/pro/tasks-in-category" },
      { label: "Kemedar Score™", to: "/cp/pro/score" },
    ],
  },
  {
    id: "cp-seller",
    title: "🛒 Control Panel – Kemetro Seller",
    color: "bg-blue-600",
    links: [
      { label: "Seller Dashboard", to: "/kemetro/seller/dashboard" },
      { label: "My Products", to: "/kemetro/seller/products" },
      { label: "Add Product", to: "/kemetro/seller/add-product" },
      { label: "My Orders", to: "/kemetro/seller/orders" },
      { label: "Shipments", to: "/kemetro/seller/shipments" },
      { label: "Promotions", to: "/kemetro/seller/promotions" },
      { label: "Coupons", to: "/kemetro/seller/coupons" },
      { label: "Earnings", to: "/kemetro/seller/earnings" },
      { label: "Analytics", to: "/kemetro/seller/analytics" },
      { label: "Reviews", to: "/kemetro/seller/reviews" },
      { label: "Store Profile", to: "/kemetro/seller/edit-store" },
      { label: "Shipping Settings", to: "/kemetro/seller/shipping" },
      { label: "Subscription", to: "/kemetro/seller/subscription" },
      { label: "Support", to: "/kemetro/seller/support" },
      { label: "KemeKit Sponsorships", to: "/kemetro/seller/promotions" },
      { label: "Surplus & Salvage Listings", to: "/kemetro/surplus/my-listings" },
      { label: "Shipper Dashboard", to: "/kemetro/shipper/dashboard" },
    ],
  },
  {
    id: "cp-shipper",
    title: "🚚 Control Panel – Shipper",
    color: "bg-sky-600",
    links: [
      { label: "Shipper Dashboard", to: "/kemetro/shipper/dashboard" },
      { label: "Active Shipments", to: "/kemetro/shipper/active" },
      { label: "Shipment Requests", to: "/kemetro/shipper/requests" },
      { label: "Completed Shipments", to: "/kemetro/shipper/completed" },
      { label: "Earnings", to: "/kemetro/shipper/earnings" },
      { label: "Payouts", to: "/kemetro/shipper/payout" },
      { label: "Setup", to: "/kemetro/shipper/setup" },
      { label: "Documents", to: "/kemetro/shipper/documents" },
      { label: "Reviews", to: "/kemetro/shipper/reviews" },
      { label: "Register as Shipper", to: "/kemetro/shipper/register" },
      { label: "Track Shipment", to: "/kemetro/track" },
    ],
  },
  {
    id: "cp-company",
    title: "📊 Control Panel – Finishing Company",
    color: "bg-pink-600",
    links: [
      { label: "Dashboard Home", to: "/cp/company" },
      { label: "My Profile", to: "/cp/company/profile" },
      { label: "My Services", to: "/cp/company/services" },
      { label: "My Orders", to: "/cp/company/orders" },
      { label: "My Bids", to: "/cp/company/bids" },
      { label: "Team Members", to: "/cp/company/team" },
      { label: "My Customers", to: "/cp/company/customers" },
      { label: "Portfolio", to: "/cp/company/portfolio" },
      { label: "Earnings", to: "/cp/company/earnings" },
      { label: "My Invoices", to: "/cp/company/invoices" },
      { label: "Subscription & Billing", to: "/cp/company/subscription" },
      { label: "Tickets", to: "/cp/company/tickets" },
    ],
  },
  {
    id: "mobile-app",
    title: "📱 Mobile App",
    color: "bg-teal-600",
    links: [
      { label: "Mobile Home", to: "/m/home" },
      { label: "Find Page", to: "/m/find" },
      { label: "Find Property", to: "/m/find/property" },
      { label: "Property Search Filters", to: "/m/find/filters" },
      { label: "Find Project", to: "/m/find/project" },
      { label: "Find Product", to: "/m/find/product" },
      { label: "Find Service", to: "/m/find/service" },
      { label: "Add Property", to: "/m/add/property" },
      { label: "Add Project", to: "/m/add/project" },
      { label: "Add Buy Request", to: "/m/add/buy-request" },
      { label: "Add Product", to: "/m/add/product" },
      { label: "Add Service", to: "/m/add/service" },
      { label: "Add Task", to: "/m/add/task" },
      { label: "Mobile Account", to: "/m/account" },
      { label: "Mobile Dashboard", to: "/m/dashboard" },
      { label: "Kemetro Mobile Home", to: "/m/kemetro" },
      { label: "KemeKits Mobile Hub", to: "/m/kemetro/kemekits" },
      { label: "Surplus Market Mobile", to: "/m/kemetro/surplus" },
      { label: "Kemedar Swap™ (Mobile)", to: "/m/swap" },
      { label: "My Auctions (Mobile)", to: "/m/dashboard/auctions" },
      { label: "Auction Hub (Mobile)", to: "/m/auctions" },
      { label: "Concierge Hub (Mobile)", to: "/m/dashboard/concierge/journeyId" },
      { label: "Kemework Mobile", to: "/m/kemework" },
      { label: "Kemetro Flash™ (Mobile)", to: "/m/kemetro/flash" },
      { label: "Kemetro Build™ (Mobile)", to: "/m/kemetro/build" },
      { label: "Life Score™ (Mobile)", to: "/m/kemedar/life-score" },
      { label: "Kemedar Predict™ (Mobile)", to: "/m/kemedar/predict" },
      { label: "Kemedar Coach™ (Mobile)", to: "/m/kemedar/coach" },
      { label: "Kemedar Live™ (Mobile)", to: "/m/kemedar/live" },
      { label: "Twin Cities™ (Mobile)", to: "/m/kemedar/twin-cities" },
      { label: "Pricing (Mobile)", to: "/m/kemedar/pricing" },
    ],
  },
];

const ROW_ADMIN = [
  {
    id: "admin-kemedar",
    title: "⚙️ Admin – Kemedar Core",
    color: "bg-gray-900",
    links: [
      { label: "Admin Dashboard", to: "/admin" },
      { label: "All Users", to: "/admin/users" },
      { label: "Pending Users", to: "/admin/users/pending" },
      { label: "All Properties", to: "/admin/properties" },
      { label: "All Projects", to: "/admin/projects" },
      { label: "Buy Requests", to: "/admin/buy-requests" },
      { label: "Locations Manager", to: "/admin/locations" },
      { label: "Property Categories", to: "/admin/property-categories" },
      { label: "Amenities", to: "/admin/amenities" },
      { label: "Roles & Permissions", to: "/admin/permissions" },
      { label: "Module Control Center", to: "/admin/modules" },
      { label: "Notifications Manager", to: "/admin/notifications" },
      { label: "Reports Center", to: "/admin/reports" },
      { label: "Cache Manager", to: "/admin/cache" },
      { label: "Import Data", to: "/admin/import" },
      { label: "Translations", to: "/admin/translations" },
      { label: "Env Settings", to: "/admin/env-settings" },
      { label: "─ AI: Predict™ Dashboard", to: "/admin/kemedar/predict" },
      { label: "Market Signals", to: "/admin/kemedar/predict/signals" },
      { label: "Price Predictions", to: "/admin/kemedar/predict/predictions" },
      { label: "Accuracy Tracking", to: "/admin/kemedar/predict/accuracy" },
      { label: "─ AI: Vision™ Dashboard", to: "/admin/kemedar/vision" },
      { label: "Photo Reports", to: "/admin/kemedar/vision/reports" },
      { label: "Flagged Issues", to: "/admin/kemedar/vision/issues" },
      { label: "Staging Jobs", to: "/admin/kemedar/vision/staging" },
      { label: "─ AI: Advisor™ Dashboard", to: "/admin/kemedar/advisor" },
      { label: "Advisor Profiles", to: "/admin/kemedar/advisor/profiles" },
      { label: "Match Reports", to: "/admin/kemedar/advisor/matches" },
      { label: "Survey Analytics", to: "/admin/kemedar/advisor/analytics" },
      { label: "─ Kemedar Coach™", to: "/admin/kemedar/coach" },
      { label: "─ Kemedar Life Score™", to: "/admin/kemedar/life-score" },
      { label: "─ Kemedar Score™", to: "/admin/kemedar/score" },
      { label: "─ Kemedar DNA™", to: "/admin/kemedar/dna" },
      { label: "─ Kemedar Community™", to: "/admin/kemedar/community" },
      { label: "─ Kemedar Live™", to: "/admin/kemedar/live" },
      { label: "─ Kemedar Expat™", to: "/admin/kemedar/expat" },
      { label: "─ Kemedar Escrow™", to: "/admin/kemedar/escrow" },
      { label: "─ Kemedar Match™", to: "/admin/kemedar/match" },
      { label: "─ Kemedar Negotiate™", to: "/admin/kemedar/negotiate" },
      { label: "─ Kemedar Finish™", to: "/admin/kemedar/finish" },
      { label: "─ Twin Cities™", to: "/admin/kemedar/twin-cities" },
      { label: "─ Verify Pro Dashboard", to: "/admin/kemedar/verify-pro" },
      { label: "All Tokens", to: "/admin/kemedar/verify-pro/tokens" },
      { label: "Document Review Queue", to: "/admin/kemedar/verify-pro/documents" },
      { label: "FO Inspections Review", to: "/admin/kemedar/verify-pro/inspections" },
      { label: "Fraud Alerts", to: "/admin/kemedar/verify-pro/fraud" },
      { label: "Certificates Manager", to: "/admin/kemedar/verify-pro/certificates" },
      { label: "─ KemedarBid™ Dashboard", to: "/admin/kemedar/auctions" },
      { label: "All Auctions", to: "/admin/kemedar/auctions/all" },
      { label: "Pending Review Queue", to: "/admin/kemedar/auctions/pending" },
      { label: "Live Auctions Monitor", to: "/admin/kemedar/auctions/live" },
      { label: "Transfers in Progress", to: "/admin/kemedar/auctions/transfers" },
      { label: "Deposits Management", to: "/admin/kemedar/auctions/deposits" },
      { label: "Auction Settings", to: "/admin/kemedar/auctions/settings" },
      { label: "─ Swap™ Dashboard", to: "/admin/kemedar/swap" },
      { label: "Swap Pool Manager", to: "/admin/kemedar/swap/pool" },
      { label: "All Swap Matches", to: "/admin/kemedar/swap/matches" },
      { label: "Active Negotiations", to: "/admin/kemedar/swap/negotiations" },
      { label: "─ Concierge Analytics", to: "/admin/kemedar/concierge" },
      { label: "Journey Templates", to: "/admin/kemedar/concierge/templates" },
      { label: "Concierge Settings", to: "/admin/kemedar/concierge/settings" },
      { label: "─ KemeFrac™ Dashboard", to: "/admin/kemedar/kemefrac" },
      { label: "All Offerings", to: "/admin/kemedar/kemefrac/offerings" },
      { label: "Tokenize on NEAR", to: "/admin/kemedar/kemefrac/tokenize" },
      { label: "Investors Manager", to: "/admin/kemedar/kemefrac/investors" },
      { label: "KYC Review Queue", to: "/admin/kemedar/kemefrac/kyc" },
      { label: "Yield Manager", to: "/admin/kemedar/kemefrac/yield" },
      { label: "─ Monetization Hub", to: "/admin/kemedar/monetization" },
      { label: "Subscription Plans", to: "/admin/subscriptions/plans" },
      { label: "All Subscribers", to: "/admin/subscriptions/subscribers" },
      { label: "Revenue Analytics", to: "/admin/subscriptions/analytics" },
      { label: "Service Orders", to: "/admin/subscriptions/orders" },
      { label: "─ CRM Dashboard", to: "/admin/crm" },
      { label: "CRM Contacts", to: "/admin/crm/contacts" },
      { label: "CRM Pipelines", to: "/admin/crm/pipelines" },
      { label: "CRM Calls", to: "/admin/crm/calls" },
      { label: "CRM AI Agents", to: "/admin/crm/ai-agents" },
    ],
  },
  {
    id: "admin-kemetro",
    title: "⚙️ Admin – Kemetro",
    color: "bg-green-900",
    links: [
      { label: "Kemetro Admin Dashboard", to: "/kemetro/admin" },
      { label: "All Products", to: "/admin/kemedar/properties" },
      { label: "All Orders", to: "/admin/subscriptions/orders" },
      { label: "All Sellers", to: "/admin/kemework/professionals" },
      { label: "Categories Manager", to: "/admin/property-categories" },
      { label: "─ KemeKits Dashboard", to: "/admin/kemetro/kemekits" },
      { label: "All Kits", to: "/admin/kemetro/kemekits/all" },
      { label: "Pending Review Queue", to: "/admin/kemetro/kemekits/pending" },
      { label: "Designers Leaderboard", to: "/admin/kemetro/kemekits/designers" },
      { label: "KemeKits Settings", to: "/admin/kemetro/kemekits/settings" },
      { label: "─ Surplus ESG Dashboard", to: "/admin/kemetro/surplus" },
      { label: "All Surplus Listings", to: "/admin/kemetro/surplus/listings" },
      { label: "Surplus Transactions", to: "/admin/kemetro/surplus/transactions" },
      { label: "Surplus Shipments", to: "/admin/kemetro/surplus/shipments" },
      { label: "Eco Leaderboard", to: "/admin/kemetro/surplus/eco-leaders" },
      { label: "Surplus Settings", to: "/admin/kemetro/surplus/settings" },
      { label: "─ Shop the Look Dashboard", to: "/admin/kemetro/shop-the-look" },
      { label: "Shoppable Image Library", to: "/admin/kemetro/shop-the-look/images" },
      { label: "Manual Tagging Tool", to: "/admin/kemetro/shop-the-look/tag" },
      { label: "Sponsorships Manager", to: "/admin/kemetro/shop-the-look/sponsorships" },
      { label: "Shop the Look Settings", to: "/admin/kemetro/shop-the-look/settings" },
      { label: "─ Flash™ Overview", to: "/admin/kemetro/flash" },
      { label: "Flash Deals", to: "/admin/kemetro/flash/deals" },
      { label: "Compound Deals", to: "/admin/kemetro/flash/compounds" },
      { label: "Demand Signals", to: "/admin/kemetro/flash/signals" },
      { label: "Flash Settings", to: "/admin/kemetro/flash/settings" },
    ],
  },
  {
    id: "admin-kemework",
    title: "⚙️ Admin – Kemework",
    color: "bg-teal-900",
    links: [
      { label: "Kemework Admin Dashboard", to: "/admin/kemework" },
      { label: "All Tasks", to: "/admin/kemework/tasks" },
      { label: "All Professionals", to: "/admin/kemework/professionals" },
      { label: "Accreditation Review", to: "/admin/kemework/accreditation" },
      { label: "Categories Manager", to: "/admin/kemework/categories" },
      { label: "Plans Manager", to: "/admin/kemework/plans" },
      { label: "Services Pending", to: "/admin/kemework/services/pending" },
      { label: "Orders Overview", to: "/admin/kemework/orders" },
      { label: "─ Snap & Fix Dashboard", to: "/admin/kemework/snap-fix" },
      { label: "Sessions Log", to: "/admin/kemework/snap-fix/sessions" },
      { label: "Emergency Safety Log", to: "/admin/kemework/snap-fix/safety" },
      { label: "Snap & Fix Settings", to: "/admin/kemework/snap-fix/settings" },
    ],
  },
];

// ─── FLAT LIST FOR SEARCH ────────────────────────────────────────────────────

const ALL_SECTIONS = [...ROW_PUBLIC, ...ROW_DASHBOARDS, ...ROW_ADMIN];

const JUMP_LINKS = [
  { label: "🌐 Public", target: "public" },
  { label: "🏢 Kemedar", target: "kemedar" },
  { label: "🛒 Kemetro", target: "kemetro" },
  { label: "🔧 Kemework", target: "kemework" },
  { label: "🔷 KemeFrac", target: "kemefrac" },
  { label: "🔨 Auctions", target: "bid" },
  { label: "🔄 Swap", target: "swap" },
  { label: "👤 Dashboards", target: "dashboards" },
  { label: "⚙️ Admin", target: "admin" },
];

// ─── COLUMN COMPONENT ────────────────────────────────────────────────────────

function SitemapColumn({ section, searchQuery }) {
  const filteredLinks = searchQuery
    ? section.links.filter(l => l.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : section.links;

  if (searchQuery && filteredLinks.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0" style={{ width: 210 }}>
      <div className={`${section.color} px-3 py-3`}>
        <h2 className="text-white font-bold text-[11px] leading-tight break-words">{section.title}</h2>
        <p className="text-white/60 text-[10px] mt-0.5">{filteredLinks.length} pages</p>
      </div>
      <ul className="p-1.5 space-y-0.5">
        {filteredLinks.map((link) => (
          <li key={link.to + link.label}>
            <Link
              to={link.to}
              className={`flex items-center gap-1.5 px-2 py-1.5 text-[11px] rounded-md transition-colors group w-full
                ${link.label.startsWith("─")
                  ? "text-gray-400 font-semibold cursor-default pointer-events-none"
                  : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                }`}
            >
              {!link.label.startsWith("─") && (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-400 transition-colors flex-shrink-0"></span>
              )}
              <span className={`break-words leading-tight ${searchQuery && link.label.toLowerCase().includes(searchQuery.toLowerCase()) ? "font-semibold text-orange-600" : ""}`}>
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── ROW COMPONENT ───────────────────────────────────────────────────────────

function SitemapRow({ label, sections, searchQuery }) {
  const visibleSections = searchQuery
    ? sections.filter(s => s.links.some(l => l.label.toLowerCase().includes(searchQuery.toLowerCase())))
    : sections;

  if (searchQuery && visibleSections.length === 0) return null;

  return (
    <div className="mb-10">
      {label && <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">{label}</h3>}
      <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
        {visibleSections.map(s => (
          <SitemapColumn key={s.id} section={s} searchQuery={searchQuery} />
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Sitemap() {
  const [searchQuery, setSearchQuery] = useState("");

  const publicCount = ROW_PUBLIC.reduce((s, c) => s + c.links.filter(l => !l.label.startsWith("─")).length, 0);
  const dashCount = ROW_DASHBOARDS.reduce((s, c) => s + c.links.filter(l => !l.label.startsWith("─")).length, 0);
  const adminCount = ROW_ADMIN.reduce((s, c) => s + c.links.filter(l => !l.label.startsWith("─")).length, 0);

  const scrollTo = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-[#1a1a2e] text-white py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Sitemap</h1>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-3">
          A complete overview of all pages, modules, and sections available on the Kemedar PropTech Super App.
        </p>
        <p className="text-xs text-gray-500">
          <span className="text-blue-400 font-bold">{publicCount}</span> public pages ·{" "}
          <span className="text-green-400 font-bold">{dashCount}</span> dashboard pages ·{" "}
          <span className="text-red-400 font-bold">{adminCount}</span> admin pages
        </p>
      </div>

      {/* Search + Quick Jump — sticky */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 space-y-2">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full pl-9 pr-4 h-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">✕</button>
            )}
          </div>

          {/* Quick Jump */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {JUMP_LINKS.map(j => (
              <button
                key={j.target}
                onClick={() => scrollTo(j.target)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-600 transition-colors whitespace-nowrap"
              >
                {j.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 w-full">

        <div id="section-public">
          <SitemapRow label="🌐 Row 1 — Public Pages (no login required)" sections={ROW_PUBLIC} searchQuery={searchQuery} />
        </div>

        <div id="section-dashboards">
          <SitemapRow label="👤 Row 2 — User Control Panels (logged in)" sections={ROW_DASHBOARDS} searchQuery={searchQuery} />
        </div>

        <div id="section-admin">
          <SitemapRow label="⚙️ Row 3 — Admin Panels" sections={ROW_ADMIN} searchQuery={searchQuery} />
        </div>

        {/* Last Updated */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Sitemap last updated: April 8, 2026
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}