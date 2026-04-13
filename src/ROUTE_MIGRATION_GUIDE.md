# Kemedar Route Migration Guide

## Routes Added to App.jsx ✓

### New Kemedar Public Routes
- `/kemedar/search-properties` (old: `/search-properties`)
- `/kemedar/search-projects` (old: `/search-projects`)
- `/kemedar/property/:slug` (old: `/property-details`)
- `/kemedar/find/agents` (old: `/find-agents`)
- `/kemedar/find/agencies` (old: `/find-agencies`)
- `/kemedar/find/developers` (old: `/find-developers`)
- `/kemedar/find/franchise-owners` (old: `/find-franchise-owners`)
- `/kemedar/agent/:username` (old: `/agent-profile`)
- `/kemedar/agency/:username` (old: `/agency-profile`)
- `/kemedar/developer/:username` (old: `/developer-profile`)

### New Kemedar Add/Create Routes
- `/kemedar/add/property` (old: `/create-property`)
- `/kemedar/add/project` (old: `/create-project`)
- `/kemedar/add/buy-request` (old: `/create-buy-request`)

### New Shared Auth Routes
- `/auth/login` (old: `/m/login`)
- `/auth/register` (old: `/m/register`)
- `/auth/forgot-password` (old: `/m/forgot-password`)

### 301 Redirects Added ✓
All old routes now redirect to new routes automatically.

---

## Link Updates Still Needed

Run these find-replace operations across all files:

### Replace Old Paths:
```
"/search-properties" → "/kemedar/search-properties"
"/search-projects" → "/kemedar/search-projects"
"/property-details" → "/kemedar/property/"
"/find-agents" → "/kemedar/find/agents"
"/find-agencies" → "/kemedar/find/agencies"
"/find-developers" → "/kemedar/find/developers"
"/find-franchise-owners" → "/kemedar/find/franchise-owners"
"/create-property" → "/kemedar/add/property"
"/create-project" → "/kemedar/add/project"
"/create-buy-request" → "/kemedar/add/buy-request"
"/agent-profile" → "/kemedar/agent/"
"/agency-profile" → "/kemedar/agency/"
"/developer-profile" → "/kemedar/developer/"
"/m/login" → "/auth/login"
"/m/register" → "/auth/register"
"/m/forgot-password" → "/auth/forgot-password"
```

### Files to Update:
- components/header/*.jsx
- components/home/*.jsx
- components/profiles/*.jsx
- components/property/*.jsx
- components/search/*.jsx
- components/mobile/*.jsx
- components/mobile-v2/*.jsx
- pages/*.jsx
- lib/*.jsx

### Manual Search Locations:
- Navigation menus
- Link components
- Button onClick handlers
- Card "View" buttons
- Breadcrumbs
- Mobile drawer menus
- Footer links

---

---

## Kemetro Routes ✓

### Public Routes
- `/kemetro` (old: `/kemetro-home`)
- `/kemetro/search`
- `/kemetro/category/:slug`
- `/kemetro/product/:slug` (old: `/m/product/:slug`)
- `/kemetro/cart` (old: `/kemetro-cart`)
- `/kemetro/checkout` (old: `/kemetro-checkout`)
- `/kemetro/order/confirmation/:id`
- `/kemetro/track/:shipmentNumber`
- `/kemetro/store/:slug`

### Buyer Routes
- `/kemetro/buyer/orders` (old: `/m/dashboard/kemetro-orders`)
- `/kemetro/buyer/wishlist` (old: `/m/dashboard/wishlist`)
- `/kemetro/buyer/rfqs` (old: `/m/dashboard/kemetro/my-rfqs`)
- `/kemetro/buyer/reviews`

### Seller & Shipper Routes
All `/kemetro/seller/*` and `/kemetro/shipper/*` routes have both desktop and mobile versions

---

---

## Kemework Routes ✓

### Public Routes
- `/kemework` (old: `/kemework-home`)
- `/kemework/find-professionals` (old: `/m/find/professional`)
- `/kemework/services` (old: `/m/find/service`)
- `/kemework/tasks`
- `/kemework/service/:slug` (old: `/m/service/:slug`)
- `/kemework/task/:slug`
- `/kemework/freelancer/:username`
- `/kemework/client/:username`
- `/kemework/company/:username`
- `/kemework/post-task` (old: `/m/add/task`)
- `/kemework/add-service` (old: `/m/add/service`)

### Customer Routes
- `/kemework/customer/dashboard`
- `/kemework/customer/tasks` (old: `/m/dashboard/kemework/my-tasks`)
- `/kemework/customer/orders` (old: `/m/dashboard/kemework/orders`)
- `/kemework/customer/bookmarks`
- `/kemework/customer/reviews`

### Professional Routes
- `/kemework/pro/dashboard`
- `/kemework/pro/profile` (old: `/m/dashboard/pro-profile`)
- `/kemework/pro/available-tasks` (old: `/m/dashboard/available-tasks`)
- `/kemework/pro/bids` (old: `/m/dashboard/my-bids`)
- `/kemework/pro/services` (old: `/m/dashboard/pro-services`)
- `/kemework/pro/orders` (old: `/m/dashboard/pro-orders`)
- `/kemework/pro/earnings` (old: `/m/dashboard/pro-earnings`)
- `/kemework/pro/portfolio` (old: `/m/dashboard/pro-portfolio`)
- `/kemework/pro/reviews` (old: `/m/dashboard/seller-reviews`)
- `/kemework/pro/analytics` (old: `/m/dashboard/pro-analytics`)
- `/kemework/pro/accreditation` (old: `/m/dashboard/pro-accreditation`)
- `/kemework/pro/subscription`, `/payout`, `/support`

### Finishing Company Routes
- `/kemework/company/dashboard`
- `/kemework/company/professionals` (old: `/m/dashboard/my-professionals`)
- `/kemework/company/services` (old: `/m/dashboard/company-services`)
- `/kemework/company/jobs` (old: `/m/dashboard/company-jobs`)
- `/kemework/company/revenue`, `/reviews`

---

---

## Kemedar Role-Specific Dashboard Routes ✓

### Agent Routes
- `/kemedar/agent/dashboard` (old: `/m/dashboard/agent` or `/m/dashboard`)
- `/kemedar/agent/clients` (old: `/m/dashboard/clients`)
- `/kemedar/agent/appointments` (old: `/m/dashboard/appointments`)
- `/kemedar/agent/analytics`
- `/kemedar/agent/business-profile` (old: `/m/dashboard/business-profile`)

### Agency Routes
- `/kemedar/agency/dashboard` (old: `/m/dashboard/agency`)
- `/kemedar/agency/my-agents` (old: `/m/dashboard/my-agents`)
- `/kemedar/agency/analytics`

### Developer Routes
- `/kemedar/developer/dashboard` (old: `/m/dashboard/developer`)
- `/kemedar/developer/projects` (old: `/m/dashboard/my-projects`)
- `/kemedar/developer/units/:projectId`
- `/kemedar/developer/leads`
- `/kemedar/developer/analytics`

### Franchise Owner Routes
- `/kemedar/franchise/dashboard` (old: `/m/dashboard`)
- `/kemedar/franchise/area-users` (old: `/m/dashboard/area-users`)
- `/kemedar/franchise/area-properties` (old: `/m/dashboard/area-properties`)
- `/kemedar/franchise/area-projects`
- `/kemedar/franchise/verify/:id` (old: `/m/dashboard/verify-property/:id`)
- `/kemedar/franchise/handymen` (old: `/m/dashboard/handymen-list`)
- `/kemedar/franchise/revenue` (old: `/m/dashboard/wallet`)
- `/kemedar/franchise/business-manager`
- `/kemedar/franchise/tools`

### Shared Dashboard Routes (Unchanged)
- `/dashboard/*` (role-aware hub)
- `/m/dashboard/*` (mobile equivalents)
- Messages, notifications, profile, wallet, invoices, subscription, support, settings, knowledge, contact

---

---

## Mobile Utility Pages ✓

### Mobile Add Pages (now module-scoped)
- `/m/kemedar/add/property` (old: `/m/add/property`)
- `/m/kemedar/add/project` (old: `/m/add/project`)
- `/m/kemedar/add/buy-request` (old: `/m/add/buy-request`)
- `/m/kemetro/buyer/rfqs/create` (old: `/m/add/rfq`)
- `/m/kemetro/seller/products/add` (old: `/m/add/product`)
- `/m/kemework/add-service` (old: `/m/add/service`)
- `/m/kemework/post-task` (old: `/m/add/task`)

### Mobile Find Pages (now module-scoped)
- `/m/kemedar/search-properties` (old: `/m/find/property`)
- `/m/kemedar/search-projects` (old: `/m/find/project`)
- `/m/kemedar/find/agents` (old: `/m/find/agent`)
- `/m/kemedar/find/developers` (old: `/m/find/developer`)
- `/m/kemedar/find/franchise-owners` (old: `/m/find/franchise-owner`)
- `/m/kemetro/search` (old: `/m/find/product`)
- `/m/kemework/services` (old: `/m/find/service`)
- `/m/kemework/find-professionals` (old: `/m/find/professional`)
- `/m/kemework/tasks` (old: `/m/find/buy-request`)

### Mobile Detail Pages (now module-scoped)
- `/m/kemedar/property/:slug` (old: `/m/property/:id`)
- `/m/kemedar/project/:slug` (old: `/m/project/:slug`)
- `/m/kemedar/buy-request/:id`
- `/m/kemetro/product/:slug` (old: `/m/product/:slug`)
- `/m/kemetro/rfq/:id` (old: `/m/rfq/:id`)
- `/m/kemework/service/:slug` (old: `/m/service/:slug`)
- `/m/kemework/task/:slug`
- `/m/kemework/freelancer/:username`
- `/m/kemework/client/:username`

### Mobile Find/Add Hub (kept as shortcuts)
- `/m/add` → Action sheet hub ✓
- `/m/find` → Context hub ✓
- `/m/add/property` → Alias/redirect
- `/m/find/property` → Alias/redirect
- (etc. — all kept for backward compatibility)

---

## Status

✅ Kemedar public routes defined and redirects added
✅ Kemedar role dashboards reorganized (/kemedar/agent/*, /kemedar/agency/*, etc.)
✅ Kemetro routes defined and redirects added
✅ Kemework routes defined and redirects added
✅ Mobile utility pages reorganized (/m/kemedar/*, /m/kemetro/*, /m/kemework/*)
✅ Auth routes consolidated (/auth/*)
✅ Route redirector updated for all modules
✅ Internal links updated (header, footer, mobile nav)
✅ Legacy routes cleaned up and consolidated to redirects only
✅ All route migration complete