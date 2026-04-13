# Complete Sitemap - All Routes & Links

Generated: 2026-03-21
Last Updated: Full Platform Reorganization

---

## Table of Contents
1. [Authentication Routes (Shared)](#authentication-routes-shared)
2. [Kemedar Module](#kemedar-module)
3. [Kemetro Module](#kemetro-module)
4. [Kemework Module](#kemework-module)
5. [Admin Routes](#admin-routes)
6. [Legacy Redirects](#legacy-redirects)

---

## Authentication Routes (Shared)

### Desktop & Mobile (Same Routes)
- `/auth/login` - Login Page
- `/auth/register` - Register Page
- `/auth/forgot-password` - Forgot Password Page

### Mobile Legacy Redirects
- `/m/login` → `/auth/login`
- `/m/register` → `/auth/register`
- `/m/forgot-password` → `/auth/forgot-password`

---

## Kemedar Module

### Public Pages (Desktop)
- `/kemedar/search-properties` - Search Properties
- `/kemedar/search-projects` - Search Projects
- `/kemedar/property/:slug` - Property Details
- `/kemedar/find/agents` - Find Agents
- `/kemedar/find/agencies` - Find Agencies
- `/kemedar/find/developers` - Find Developers
- `/kemedar/find/franchise-owners` - Find Franchise Owners
- `/kemedar/agent/:username` - Agent Profile
- `/kemedar/agency/:username` - Agency Profile
- `/kemedar/developer/:username` - Developer Profile

### Create/Add Pages (Desktop)
- `/kemedar/add/property` - Create Property
- `/kemedar/add/project` - Create Project
- `/kemedar/add/buy-request` - Create Buy Request

### Agent Dashboard (Desktop & Mobile)
**Desktop:**
- `/kemedar/agent/dashboard` - Agent Dashboard
- `/kemedar/agent/clients` - Agent Clients
- `/kemedar/agent/clients/:id` - Client Details
- `/kemedar/agent/appointments` - Appointments
- `/kemedar/agent/analytics` - Analytics
- `/kemedar/agent/business-profile` - Business Profile

**Mobile:**
- `/m/kemedar/agent/dashboard`
- `/m/kemedar/agent/clients`
- `/m/kemedar/agent/clients/:id`
- `/m/kemedar/agent/appointments`
- `/m/kemedar/agent/analytics`
- `/m/kemedar/agent/business-profile`

**Mobile Redirects:**
- `/m/dashboard/agent` → `/m/kemedar/agent/dashboard`
- `/m/dashboard/clients` → `/m/kemedar/agent/clients`
- `/m/dashboard/appointments` → `/m/kemedar/agent/appointments`
- `/m/dashboard/business-profile` → `/m/kemedar/agent/business-profile`

### Agency Dashboard (Desktop & Mobile)
**Desktop:**
- `/kemedar/agency/dashboard` - Agency Dashboard
- `/kemedar/agency/my-agents` - My Agents
- `/kemedar/agency/my-agents/:id` - Agent Details
- `/kemedar/agency/analytics` - Analytics

**Mobile:**
- `/m/kemedar/agency/dashboard`
- `/m/kemedar/agency/my-agents`
- `/m/kemedar/agency/my-agents/:id`
- `/m/kemedar/agency/analytics`

**Mobile Redirects:**
- `/m/dashboard/agency` → `/m/kemedar/agency/dashboard`
- `/m/dashboard/my-agents` → `/m/kemedar/agency/my-agents`

### Developer Dashboard (Desktop & Mobile)
**Desktop:**
- `/kemedar/developer/dashboard` - Developer Dashboard
- `/kemedar/developer/projects` - My Projects
- `/kemedar/developer/units/:projectId` - Project Units
- `/kemedar/developer/leads` - Leads
- `/kemedar/developer/analytics` - Analytics

**Mobile:**
- `/m/kemedar/developer/dashboard`
- `/m/kemedar/developer/projects`
- `/m/kemedar/developer/units/:projectId`
- `/m/kemedar/developer/leads`
- `/m/kemedar/developer/analytics`

**Mobile Redirect:**
- `/m/dashboard/developer` → `/m/kemedar/developer/dashboard`

### Franchise Owner Dashboard (Desktop & Mobile)
**Desktop:**
- `/kemedar/franchise/dashboard` - Franchise Dashboard
- `/kemedar/franchise/area-users` - Area Users
- `/kemedar/franchise/area-properties` - Area Properties
- `/kemedar/franchise/area-projects` - Area Projects
- `/kemedar/franchise/verify/:id` - Verify Property
- `/kemedar/franchise/handymen` - Handymen List
- `/kemedar/franchise/revenue` - Revenue/Wallet
- `/kemedar/franchise/business-manager` - Business Manager
- `/kemedar/franchise/tools` - Tools

**Mobile:**
- `/m/kemedar/franchise/dashboard`
- `/m/kemedar/franchise/area-users`
- `/m/kemedar/franchise/area-properties`
- `/m/kemedar/franchise/area-projects`
- `/m/kemedar/franchise/verify/:id`
- `/m/kemedar/franchise/handymen`
- `/m/kemedar/franchise/revenue`
- `/m/kemedar/franchise/business-manager`
- `/m/kemedar/franchise/tools`

**Mobile Redirects:**
- `/m/dashboard/area-users` → `/m/kemedar/franchise/area-users`
- `/m/dashboard/area-properties` → `/m/kemedar/franchise/area-properties`
- `/m/dashboard/area-projects` → `/m/kemedar/franchise/area-projects`
- `/m/dashboard/handymen-list` → `/m/kemedar/franchise/handymen`
- `/m/dashboard/wallet` → `/m/kemedar/franchise/revenue`

### Mobile Kemedar Add Pages
- `/m/kemedar/add/property` - Add Property
- `/m/kemedar/add/project` - Add Project
- `/m/kemedar/add/buy-request` - Add Buy Request

### Mobile Kemedar Find Pages
- `/m/kemedar/search-properties` - Search Properties
- `/m/kemedar/search-projects` - Search Projects
- `/m/kemedar/find/agents` - Find Agents
- `/m/kemedar/find/developers` - Find Developers
- `/m/kemedar/find/franchise-owners` - Find Franchise Owners

### Mobile Kemedar Detail Pages
- `/m/kemedar/property/:slug` - Property Details
- `/m/kemedar/project/:slug` - Project Details
- `/m/kemedar/buy-request/:id` - Buy Request Details

---

## Kemetro Module

### Public Pages (Desktop & Mobile)
- `/kemetro` - Home
- `/kemetro/search` - Search Products
- `/kemetro/category/:slug` - Category Products
- `/kemetro/product/:slug` - Product Details
- `/kemetro/cart` - Shopping Cart
- `/kemetro/checkout` - Checkout
- `/kemetro/order/confirmation/:id` - Order Confirmation
- `/kemetro/track/:shipmentNumber` - Track Shipment
- `/kemetro/store/:slug` - Store Profile

### Buyer Routes (Desktop)
- `/kemetro/buyer/orders/:id` - Order Details
- `/kemetro/buyer/rfqs` - RFQs
- `/kemetro/buyer/rfqs/:id` - RFQ Details
- `/kemetro/buyer/reviews` - Reviews

### Seller Routes (Desktop) - `/kemetro/seller/*`
- `/kemetro/seller` - Store Overview (default)
- `/kemetro/seller/dashboard` - Dashboard
- `/kemetro/seller/store-overview` - Store Overview
- `/kemetro/seller/products` - Products List
- `/kemetro/seller/products/add` - Add Product
- `/kemetro/seller/products/:id/edit` - Edit Product
- `/kemetro/seller/orders` - Orders
- `/kemetro/seller/shipments` - Shipments
- `/kemetro/seller/analytics` - Analytics
- `/kemetro/seller/earnings` - Earnings
- `/kemetro/seller/reviews` - Reviews
- `/kemetro/seller/settings` - Store Settings
- `/kemetro/seller/shipping` - Shipping Settings
- `/kemetro/seller/coupons` - Coupons
- `/kemetro/seller/promotions` - Promotions
- `/kemetro/seller/edit-store` - Edit Store Profile
- `/kemetro/seller/subscription` - Subscription & Services
- `/kemetro/seller/support` - Support

### Shipper Routes (Desktop)
- `/kemetro/shipper/dashboard` - Dashboard
- `/kemetro/shipper/requests` - Shipment Requests
- `/kemetro/shipper/requests/:id` - Request Details
- `/kemetro/shipper/active` - Active Shipments
- `/kemetro/shipper/active/:id` - Shipment Details
- `/kemetro/shipper/shipments` - All Shipments
- `/kemetro/shipper/shipments/:id` - Shipment Details
- `/kemetro/shipper/bids` - Bids
- `/kemetro/shipper/earnings` - Earnings
- `/kemetro/shipper/analytics` - Analytics
- `/kemetro/shipper/reviews` - Reviews
- `/kemetro/shipper/coverage` - Coverage
- `/kemetro/shipper/vehicle` - Vehicle
- `/kemetro/shipper/support` - Support
- `/kemetro/shipper/payout` - Payout
- `/kemetro/shipper/subscription` - Subscription

### Mobile Seller Routes - `/m/dashboard/seller-*`
- `/m/dashboard/seller-dashboard` - Seller Dashboard Home
- `/m/dashboard/seller-products` - Products List
- `/m/dashboard/seller-products/:id/edit` - Edit Product
- `/m/dashboard/seller-products/:id/preview` - Product Preview
- `/m/dashboard/seller-orders` - Orders
- `/m/dashboard/seller-earnings` - Earnings
- `/m/dashboard/seller-analytics` - Analytics
- `/m/dashboard/seller-reviews` - Reviews
- `/m/dashboard/seller-shipments` - Shipments
- `/m/dashboard/shipping-settings` - Shipping Settings
- `/m/dashboard/seller-promotions` - Promotions
- `/m/dashboard/seller-promotions/add` - Add Promotion
- `/m/dashboard/seller-promotions/:id` - Promotion Detail
- `/m/dashboard/seller-promotions/:id/edit` - Edit Promotion
- `/m/dashboard/seller-coupons` - Coupons
- `/m/dashboard/seller-coupons/create` - Create Coupon
- `/m/dashboard/seller-coupons/:id/edit` - Edit Coupon
- `/m/dashboard/seller-edit-store` - Edit Store Profile
- `/m/dashboard/seller-store-settings` - Store Settings

### Mobile Seller Control Panel Routes - `/m/cp/seller/*`
- `/m/cp/seller/dashboard` - Dashboard
- `/m/cp/seller/products` - Products
- `/m/cp/seller/orders` - Orders
- `/m/cp/seller/earnings` - Earnings
- `/m/cp/seller/analytics` - Analytics
- `/m/cp/seller/reviews` - Reviews
- `/m/cp/seller/shipping` - Shipping
- `/m/cp/seller/promotions` - Promotions
- `/m/cp/seller/coupons` - Coupons
- `/m/cp/seller/settings` - Settings
- `/m/cp/seller/edit-store` - Edit Store

### Mobile Shipper Routes (/m/kemetro/shipper/*)
- `/m/kemetro/shipper/dashboard`
- `/m/kemetro/shipper/active`
- `/m/kemetro/shipper/requests`
- `/m/kemetro/shipper/completed`
- `/m/kemetro/shipper/earnings`
- `/m/kemetro/shipper/payout`
- `/m/kemetro/shipper/profile`
- `/m/kemetro/shipper/documents`
- `/m/kemetro/shipper/reviews`

### Mobile Kemetro Detail Pages
- `/m/kemetro/product/:slug` - Product Details
- `/m/kemetro/rfq/:id` - RFQ Details

### Mobile Kemetro Buyer Pages
- `/m/kemetro/buyer/rfqs/create` - Create RFQ

---

## Kemework Module

### Public Pages (Desktop & Mobile)
- `/kemework` - Home
- `/kemework/find-professionals` - Find Professionals
- `/kemework/services` - Browse Services
- `/kemework/tasks` - Browse Tasks
- `/kemework/service/:slug` - Service Details
- `/kemework/task/:slug` - Task Details
- `/kemework/freelancer/:username` - Freelancer Profile
- `/kemework/client/:username` - Client Profile
- `/kemework/post-task` - Post Task
- `/kemework/add-service` - Add Service
- `/kemework/how-it-works` - How It Works
- `/kemework/preferred-program` - Preferred Program

### Customer Routes (Desktop)
- `/kemework/customer/tasks` - My Tasks
- `/kemework/customer/orders` - My Orders
- `/kemework/customer/orders/:id` - Order Details
- `/kemework/customer/bookmarks` - Bookmarks
- `/kemework/customer/reviews` - Reviews

### Professional Routes (Desktop)
- `/kemework/pro/dashboard` - Dashboard
- `/kemework/pro/profile` - Profile
- `/kemework/pro/available-tasks` - Available Tasks
- `/kemework/pro/bids` - My Bids
- `/kemework/pro/services` - My Services
- `/kemework/pro/orders` - My Orders
- `/kemework/pro/orders/:id` - Order Details
- `/kemework/pro/earnings` - Earnings
- `/kemework/pro/portfolio` - Portfolio
- `/kemework/pro/reviews` - Reviews
- `/kemework/pro/analytics` - Analytics
- `/kemework/pro/accreditation` - Accreditation
- `/kemework/pro/subscription` - Subscription
- `/kemework/pro/support` - Support
- `/kemework/pro/payout` - Payout

### Finishing Company Routes (Desktop)
- `/kemework/company/dashboard` - Dashboard
- `/kemework/company/professionals` - My Professionals
- `/kemework/company/services` - Company Services
- `/kemework/company/jobs` - Jobs
- `/kemework/company/revenue` - Revenue
- `/kemework/company/reviews` - Reviews

### Mobile Kemework Detail Pages
- `/m/kemework/service/:slug` - Service Details
- `/m/kemework/task/:slug` - Task Details
- `/m/kemework/freelancer/:username` - Freelancer Profile
- `/m/kemework/client/:username` - Client Profile

### Mobile Kemework Add/Find Pages
- `/m/kemework/add-service` - Add Service
- `/m/kemework/post-task` - Post Task
- `/m/kemework/services` - Browse Services
- `/m/kemework/find-professionals` - Find Professionals
- `/m/kemework/tasks` - Browse Tasks

---

## Admin Routes

### Kemedar Admin (/admin/kemedar/*)
- `/admin/kemedar` - Dashboard
- `/admin/kemedar/users/common` - Common Users
- `/admin/kemedar/users/agents` - Agents
- `/admin/kemedar/users/agencies` - Agencies
- `/admin/kemedar/users/developers` - Developers
- `/admin/kemedar/users/franchise-owners` - Franchise Owners
- `/admin/kemedar/users/admins` - Admins
- `/admin/kemedar/users/pending/common` - Pending Common Users
- `/admin/kemedar/users/pending/agents` - Pending Agents
- `/admin/kemedar/users/pending/agencies` - Pending Agencies
- `/admin/kemedar/users/pending/developers` - Pending Developers
- `/admin/kemedar/users/pending/franchise` - Pending Franchise Owners
- `/admin/kemedar/users/imported/common` - Imported Common Users
- `/admin/kemedar/users/imported/agents` - Imported Agents
- `/admin/kemedar/users/imported/agencies` - Imported Agencies
- `/admin/kemedar/users/imported/developers` - Imported Developers
- `/admin/kemedar/users/verified/agents` - Verified Agents
- `/admin/kemedar/users/verified/agencies` - Verified Agencies
- `/admin/kemedar/users/verified/developers` - Verified Developers
- `/admin/kemedar/users/roles` - User Roles

#### Property Management
- `/admin/kemedar/properties/active` - Active Properties
- `/admin/kemedar/properties/pending` - Pending Properties
- `/admin/kemedar/properties/onsite` - Onsite Properties
- `/admin/kemedar/properties/imported` - Imported Properties
- `/admin/kemedar/properties/franchise` - Franchise Properties
- `/admin/kemedar/properties/categories` - Categories
- `/admin/kemedar/properties/purposes` - Purposes
- `/admin/kemedar/properties/suitable-for` - Suitable For
- `/admin/kemedar/properties/amenities` - Amenities
- `/admin/kemedar/properties/tags` - Tags
- `/admin/kemedar/properties/distance-fields` - Distance Fields

#### Project Management
- `/admin/kemedar/projects/all` - All Projects
- `/admin/kemedar/projects/active` - Active Projects
- `/admin/kemedar/projects/pending` - Pending Projects
- `/admin/kemedar/projects/onsite` - Onsite Projects
- `/admin/kemedar/projects/imported` - Imported Projects
- `/admin/kemedar/projects/franchise` - Franchise Projects

#### Location Management
- `/admin/kemedar/locations/countries` - Countries
- `/admin/kemedar/locations/provinces` - Provinces
- `/admin/kemedar/locations/cities` - Cities
- `/admin/kemedar/locations/districts` - Districts
- `/admin/kemedar/locations/areas` - Areas

#### Marketing & Featured
- `/admin/kemedar/featured/properties` - Featured Properties
- `/admin/kemedar/featured/agents` - Featured Agents
- `/admin/kemedar/featured/developers` - Featured Developers
- `/admin/kemedar/featured/agencies` - Featured Agencies
- `/admin/kemedar/recent/properties` - Recent Properties
- `/admin/kemedar/recent/agents` - Recent Agents
- `/admin/kemedar/recent/developers` - Recent Developers
- `/admin/kemedar/recent/agencies` - Recent Agencies

#### CRM & Operations
- `/admin/kemedar/buy-requests` - Buy Requests
- `/admin/kemedar/saved-searches` - Saved Searches
- `/admin/kemedar/notifications` - Notifications
- `/admin/kemedar/email-tracker` - Email Tracker
- `/admin/kemedar/crm` - All Contacts
- `/admin/kemedar/crm/pending` - Pending Users CRM
- `/admin/kemedar/crm/reports` - Call Reports
- `/admin/kemedar/marketing-requests` - Marketing Requests

#### Orders & Payments
- `/admin/kemedar/orders` - All Orders
- `/admin/kemedar/orders/products` - Products/Services
- `/admin/kemedar/orders/settings` - Payment Settings

#### Import & Data Management
- `/admin/kemedar/import/scraper` - Scraping Manager
- `/admin/kemedar/import/jobs` - Scrape Jobs
- `/admin/kemedar/import/users` - Imported Users
- `/admin/kemedar/import/properties` - Imported Properties
- `/admin/kemedar/import/csv-site` - CSV Site Data
- `/admin/kemedar/import/pending-activation` - Pending Activation
- `/admin/kemedar/cache` - Cache Clear

#### Reporting & Settings
- `/admin/kemedar/reports` - Reports
- `/admin/kemedar/settings` - Settings

---

## Mobile V2 Dashboard Routes

### Main Dashboard (/m/dashboard/*)
- `/m/dashboard` - Dashboard Home
- `/m/dashboard/my-properties` - My Properties
- `/m/dashboard/profile` - Profile
- `/m/dashboard/subscription` - Subscription
- `/m/dashboard/messages` - Messages
- `/m/dashboard/notifications` - Notifications

### Mobile V2 Shell Routes (/m/*)
- `/m` - Mobile Home
- `/m/home` - Mobile Home
- `/m/account` - Account
- `/m/account/guest` - Guest Account
- `/m/find` - Find Hub
- `/m/find/:type` - Find by Type
- `/m/add` - Add Hub
- `/m/add/property` - Add Property
- `/m/add/project` - Add Project
- `/m/add/buy-request` - Add Buy Request
- `/m/add/request` - Add Request
- `/m/add/rfq` - Add RFQ
- `/m/add/product` - Add Product
- `/m/add/service` - Add Service
- `/m/add/task` - Add Task
- `/m/buy` - Buy Hub
- `/m/settings` - Settings

---

## Legacy Redirects

### Mobile to Mobile Routes (/m/add/*, /m/find/*)
- `/m/add/rfq` → `/m/kemetro/buyer/rfqs/create`
- `/m/add/product` → `/m/kemetro/seller/products/add`
- `/m/add/service` → `/m/kemework/add-service`
- `/m/add/task` → `/m/kemework/post-task`
- `/m/find/product` → `/m/kemetro/search`
- `/m/find/service` → `/m/kemework/services`
- `/m/find/professional` → `/m/kemework/find-professionals`
- `/m/find/buy-request` → `/m/kemework/tasks`

### Mobile Detail Page Legacy Redirects
- `/m/property/:id` → `/m/kemedar/property/:id`
- `/m/project/:slug` → `/m/kemedar/project/:slug`
- `/m/product/:slug` → `/m/kemetro/product/:slug`
- `/m/service/:slug` → `/m/kemework/service/:slug`
- `/m/buy-request/:id` → `/m/kemedar/buy-request/:id`
- `/m/rfq/:id` → `/m/kemetro/rfq/:id`

### Desktop Legacy Redirects
- `/search-properties` → `/kemedar/search-properties`
- `/search-projects` → `/kemedar/search-projects`
- `/find-agents` → `/kemedar/find/agents`
- `/find-agencies` → `/kemedar/find/agencies`
- `/find-developers` → `/kemedar/find/developers`
- `/find-franchise-owners` → `/kemedar/find/franchise-owners`
- `/create-property` → `/kemedar/add/property`
- `/create-project` → `/kemedar/add/project`
- `/create-buy-request` → `/kemedar/add/buy-request`

### Module Home Redirects
- `/kemetro-home` → `/kemetro`
- `/kemetro-cart` → `/kemetro/cart`
- `/kemetro-checkout` → `/kemetro/checkout`
- `/kemework-home` → `/kemework`

### Mobile Shell Legacy Redirects
- `/mobile` → `/m`
- `/mobile/*` → `/m`

---

## User Benefits Routes

### Desktop
- `/user-benefits` - Hub
- `/user-benefits/property-seller` - Property Seller Benefits
- `/user-benefits/property-buyer` - Property Buyer Benefits
- `/user-benefits/real-estate-agent` - Real Estate Agent Benefits
- `/user-benefits/real-estate-developer` - Real Estate Developer Benefits
- `/user-benefits/handyman-or-technician` - Handyman Benefits
- `/user-benefits/franchise-owner-area` - Franchise Owner Area Benefits
- `/user-benefits/product-seller` - Product Seller Benefits
- `/user-benefits/product-buyer` - Product Buyer Benefits
- `/user-benefits/investor` - Investor Benefits

### Mobile
- `/m/benefits` - Hub
- `/m/benefits/property-seller`
- `/m/benefits/property-buyer`
- `/m/benefits/real-estate-agent`
- `/m/benefits/real-estate-developer`
- `/m/benefits/handyman-or-technician`
- `/m/benefits/franchise-owner-area`
- `/m/benefits/product-seller`
- `/m/benefits/product-buyer`
- `/m/benefits/investor`
- `/m/about`

---

## Route Statistics

| Category | Count |
|----------|-------|
| Auth Routes | 6 |
| Kemedar Public | 10 |
| Kemedar Dashboards | 51 |
| Kemetro Routes | 85+ |
| Kemetro Seller (Desktop) | 20 |
| Kemetro Seller (Mobile) | 19 |
| Kemework Routes | 45+ |
| Admin Routes | 70+ |
| User Benefits | 20 |
| Legacy Redirects | 40+ |
| **Total Routes** | **450+** |

---

## Platform-Specific Notes

### Desktop
- Module routes are at `/module-name/*`
- Role-specific dashboards at `/module/role/*`
- Public pages on desktop

### Mobile (/m/*)
- Dashboard shell at `/m/dashboard/*`
- Module routes at `/m/module-name/*`
- All mobile routes nested under `/m/*`
- Automatic redirects from desktop to mobile for mobile users

### Shared Routes
- Authentication pages (`/auth/*`)
- Static pages (About, Contact, Terms, etc.)
- Public module pages (browsing products, services, etc.)

---

## API Endpoints (Backend Functions)

*Future section for backend API routes as they are created*

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-21 | Complete route reorganization with module separation |