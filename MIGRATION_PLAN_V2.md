# Kemedar v4 → Next.js 16 Migration Plan (V2 — 100% Coverage)

**Date:** 2026-04-14 (Updated)  
**Source:** React 18 + Vite + Base44 SDK (v0.8.25)  
**Target:** Next.js 16 (App Router) + Prisma ORM + PostgreSQL + Service Layer

---

## 1. COMPLETE PROJECT INVENTORY

### 1.1 Scale (Verified)

| Metric | Count |
|--------|-------|
| Base44 Entities | 184 |
| Backend Functions | 131 (48 use AI/LLM, 75 send email) |
| Page Files (.jsx) | 855 |
| Routes (total) | 1,307+ |
| Component Directories | 69 (550+ files) |
| Utility/Lib Files | 41 |
| User Roles | 18 |
| Business Modules | 22 |
| Languages Supported | 19 (incl. RTL: Arabic, Urdu, Farsi) |
| Subscription Plan Types | 17 |
| RBAC Resources | 174 |
| RBAC Roles | 15 |

### 1.2 Complete Module Map (22 Modules)

| # | Module | Pages | Components | Functions | Entities | Priority |
|---|--------|-------|------------|-----------|----------|----------|
| 1 | **Property Core** | 8 | 5 (property/) + 3 (distance/) + 3 (search/) + 9 (add-property/) + 17 (create-property/) | calculateValuation, getAIPriceSuggestion, batchProcessPropertyImages | Property, PropertyValuation, PropertyDistance, PropertyMatch, PropertySwipe, PropertyToken, AnalyzedPropertyImage | P0 |
| 2 | **Auction (KemedarBid)** | 6+ | 24 (auctions/) | createAuction, approveAuction, placeBid, endAuction, registerBidder, forfeitWinner, refundAllLosers, processWinnerPayment, setAutoBid, paySellerDeposit | PropertyAuction, AuctionBid, AuctionEvent, AuctionRegistration, AuctionSettings, AuctionWatchlist | P0 |
| 3 | **Fractional (KemeFrac)** | 4 | 9 (kemefrac/) | submitFracOffering, approveOffering, purchaseTokens, distributeYield, payCreatorCommission, syncNEARBalance | FracProperty, FracToken, FracTransaction, FracKYC, FracWatchlist, FracPropertyUpdate, FracYieldDistribution, FracSettings | P1 |
| 4 | **Swap (KemedarSwap)** | 4 | 13 (swap/) | publishSwapIntent, generateSwapMatches, expressInterest, passOnMatch, agreeToTerms, recordSwipe, transferOwnership | SwapIntent, SwapMatch, SwapGapOffer, SwapNegotiationMessage, SwapSettings | P1 |
| 5 | **Escrow** | 8 | 1 (escrow/) + 18 (verify/) | escrowMilestoneProgression, evaluateDispute, settleByQrScan, generateDealStructure, paySellerDeposit, joinCompoundDeal | EscrowDeal, EscrowAccount, EscrowTransaction, EscrowMilestone, EscrowDispute, EscrowDocument | P0 |
| 6 | **Construction & Finishing** | 6 | 16 (finish/) + 3 (finishing/) | generateBOQ, generateBuildBOQ, generateFinishingEstimate, generateFinishingEstimatePDF, analyzeProgressPhoto, calculateKemeKitBoQ | BuildProject, FinishProject, FinishPhase, FinishBOQ, FinishMaterialOrder, FinishProgressUpdate, FinishSnaggingItem, BOQItem, FinishingCostIndex, FinishingSimulation, FOInspectionReport, ExpansionMilestone | P1 |
| 7 | **CRM** | 10+ (admin/crm/) | 10 (crm/) | draftOfferMessage | CRMContact, CRMAccount, CRMAccountContact, CRMOpportunity, CRMOpportunityHistory, CRMPipeline, CRMPipelineStage, CRMTask, CRMNote, CRMCall, CRMMessage, CRMConversation, CRMActivityLog, CRMContactChannel, CRMContactConsent, CRMTemplate, CRMAutomationWorkflow, CRMAutomationRun, CRMAIAgent, CRMAIAction | P1 |
| 8 | **Community** | 6 | 6 (community/) | createCommunityPost, moderateCommunityPost, joinCommunity, generateCommunityDigest, moderateEventMessage | Community, CommunityMember, CommunityPost, CommunityComment, CommunityAlert, CommunityEvent, CommunityRecommendation | P1 |
| 9 | **Advisor (KemeAdvisor)** | 5+ | 10 (advisor/) | generateAdvisorReport, generateBuyerStrategy, generateSellerStrategy, generateMatchInsights, generateMatchQueue, regenerateMatchQueues | AdvisorProfile, AdvisorMatch, AdvisorReport | P2 |
| 10 | **Coaching** | 5+ | 6 (coach/) | generateCoachNudge, generateCoachResponse, generatePersonalizedStep, seedCoachJourneys, dismissJourney | CoachProfile, CoachJourney, CoachContent, CoachMessage, CoachAchievement, CoachNudge | P2 |
| 11 | **Concierge** | 4+ | 6 (concierge/) | triggerMoveInConcierge, processConciergeNotifications, setMoveInDate | ConciergeJourney, ConciergeJourneyTemplate, ConciergeTask, ConciergeTaskTemplate | P2 |
| 12 | **Kemetro (Marketplace)** | **37 pages** | **114 components** (seller 29, shipper 20, home 12, admin 10, flash 6, cart 3, checkout 3, search 2, product 4, header 4, store 5, build 4) | searchKemetroProducts, searchKemetroForMaterial, placeFlashOrder, matchFlashDeals, notifyFlashBuyers, confirmFlashDelivery, generateGroupBuyOffer, mergeGuestCart, addToShopTheLookCart, sendShopTheLookNotifications, detectGroupBuyOpportunities | MarketplaceItem, GroupBuySession, FlashDeal, FlashOrder, ShopTheLookCart, ShopTheLookSettings | P0 |
| 13 | **Surplus** | 10 pages | 13 (surplus/) | publishSurplusItem, reserveSurplusItem, cancelSurplusReservation, autoExpireSurplusReservations, createSurplusShipmentRequest, generateSurplusListing, querySurplusForProfessional, surplusPostRenovationNudge | SurplusItem, SurplusSavedItem, SurplusTransaction, SurplusShipmentRequest, SurplusSettings | P2 |
| 14 | **Kemework (Services)** | **30+ pages** | **26 components** + **23 (snap-and-fix/)** | processSnapAndFix, convertSnapToTask, redirectToKemeworkTask, requestInstallation, generateCaptureGuide, detectKemeworkOpportunity, updateTaskStatus | ServiceOrder, ServiceOrderActivity, SnapSession, SnapSettings, SnapMaterialCartItem | P1 |
| 15 | **Negotiation** | 2+ | 6 (negotiate/) | openNegotiationRoom, submitCounterOffer, draftOfferMessage | NegotiationSession, NegotiationOffer, NegotiationMessage, NegotiationAnalytics | P1 |
| 16 | **Live Events & Tours** | 8 | 3 (live/) + 5 (twin/) | generateEventDescription, generateEventSummary, suggestEventQuestions, generateTourSummary, moderateEventMessage | LiveEvent, LiveEventRegistration, LiveEventReservation, LiveEventMessage, LiveEventPoll, LiveEventHighlight, LiveTourSession, LiveTourRegistration, VirtualTour, TourHotspot, TourChatMessage | P2 |
| 17 | **Market Intelligence** | 5+ | 2 (predict/) | evaluateMarketReadiness, processSignal, generatePricePrediction, generateExpansionRoadmap | MarketIntelligenceReport, MarketSignal, MarketProfile, MarketPriceIndex, DemandSignal, CrossMarketSearch, InvestmentMetric, PricePrediction, PredictSubscription, PredictionHistoricalTrack | P2 |
| 18 | **Scoring & DNA** | 3+ | 7 (score/) | calculateKemedarScore, getMyKemedarScore, calculateLifeScore, generateLifeScoreNarrative, addScoreEvent, getSharedScore, scoreRelocationMatch, getMyDNA, recalculateDNA, recalculateAllDNA | KemedarScore, ScoreEvent, ScoreBadge, ScoreShareRequest, UserDNA, DNASignal, DNAInsight, LifeScoreDataPoint, LifeScoreReview, LifeScoreComparison, NeighborhoodLifeScore | P1 |
| 19 | **QR Codes** | 4+ | 6 (qr/) | generateQRCode, downloadQRCode, handleQRScan, getUserQRCodes, regenerateQRCode, getQRAnalytics, recordHotspotClick, processImageForHotspots | QRCode, QRScan, QRSettings, ImageHotspot, HotspotSponsorshipLog | P2 |
| 20 | **KemeKit** | 7 pages | 11 (kemekits/) | addKemeKitToCart, calculateKemeKitBoQ, toggleOptionalItem, requestInstallation | KemeKitItem, KemeKitTemplate, KemeKitCalculation, KemeKitInstallationRequest, KemeKitSave, KemeKitSettings | P2 |
| 21 | **Expat Module** | 9 pages (UAE, KSA, UK, USA) | 3 (expat/) | scoreRelocationMatch | RelocationProfile + location entities | P3 |
| 22 | **Rent-to-Own** | 6 pages | (embedded in kemedar/) | N/A (new feature) | New entities needed | P3 |

### 1.3 Complete Page Inventory (855 files)

| Directory | File Count | Description |
|-----------|------------|-------------|
| Root pages/ | 62 | Public + common user pages |
| pages/admin/ | 150+ | Admin dashboard, CRM, modules, all kemedar/kemetro admin |
| pages/admin/kemedar/ | 80+ | Advisor, auctions, coach, community, concierge, CRM, DNA, escrow, expat, finish, import, kemefrac, life-score, live, locations, match, notify, pricing, rent2own, RWA, swap, thinkdar, twin, valuations |
| pages/admin/kemetro/ | 60+ | AI-match, build, buyer, flash, kemekits, seller, shipper, shop-the-look, surplus |
| pages/dashboard/ | 80+ | My properties, favorites, compare, buy requests, subscription, profile, business, performance, clients, orders, invoices, wallet, settings |
| pages/cp/ | 400+ | Control panel shells: /cp/user, /cp/agent, /cp/agency, /cp/pro, /cp/developer, /cp/company (each 50-70 routes) |
| pages/fo/ | 7 | Franchise owner area, properties, users, buy requests, wallet, tasks |
| pages/kemedar/ | 50+ | AI, coach, community, DNA, escrow, expat, finish, life-score, live, match, negotiate, predict, rent2own, swap, twin, verify, vision |
| pages/kemetro/ | 60+ | Admin, AI-match, build, buyer, flash, kemekits, seller, shipper, shop-the-look, surplus |
| pages/kemework/ | 30+ | Browse, services, tasks, snap-fix, professionals, accreditation |
| pages/m/ | 70+ | Mobile mirrors of desktop routes |
| pages/UserBenefits/ | 9 | Role-specific benefit pages |

### 1.4 Complete Infrastructure Map (41 utility files)

| Category | Files | Key Features |
|----------|-------|-------------|
| **Auth** | AuthContext.jsx | Base44 auth, session recovery, guest → user migration |
| **Currency** | CurrencyContext.jsx | 8 currencies (EGP, USD, EUR, AED, SAR, GBP, QAR, KWD), exchange rates, formatting |
| **Modules** | ModuleContext.jsx, ModuleGate | Feature flags, 3 default modules, user preferences, 5-min polling |
| **i18n** | i18n.jsx | 19 languages, RTL support (AR/UR/FA), session cache 10-min TTL |
| **Subscriptions** | subscriptionEngine.js | 17 plan types, feature gating, usage tracking (daily/monthly) |
| **RBAC** | rbac/permissionUtils.js, rbac/seedData.js | 15 roles, 23 actions, 174 resources, 200+ permission rules, 5-min cache |
| **DNA Tracking** | useDNA.js | Behavioral signals: views, saves, searches, swipes, sessions, notifications |
| **Notifications** | auctionNotificationTemplates.js, kemefracNotifications.js, swapNotifications.js, verifyProNotifications.js | 70+ notification templates across 4 modules |
| **PWA** | pwa-install-manager.js, pwa-register.js, pwa-checklist.js, update-manager.js, background-sync.js | Install prompts, service worker, offline sync, update detection, 12-item validation |
| **Routing** | route-redirector.js, useResponsiveRedirect.js, mobile-detect.js, benefits-redirect.js | Mobile/desktop auto-redirect, role-based dashboard redirect |
| **Verify Pro** | verifyProMint.js, verifyProNotifications.js | Token minting (KVP-xxxxx), genesis hash, 24 notification templates |
| **Misc** | api-queue.js, app-params.js, coachJourneyData.js, kemeworkCategories.js, liveEventUtils.js, snapSessionRecovery.js, query-client.js, utils.js, detect-platform.js | Rate limiting, app config, static data, session recovery |

### 1.5 Complete Component Map (69 directories, 550+ files)

| # | Directory | Files | Purpose |
|---|-----------|-------|---------|
| 1 | ui/ | 52 | Shadcn/Radix UI primitives |
| 2 | kemetro/ | 114 | Full e-commerce: seller, shipper, admin, cart, checkout, flash, home, product, search, store, build |
| 3 | admin/ | 38 | Admin shells, analytics, commissions, invoices, orders, subscriptions |
| 4 | mobile/ | 37 | Mobile account, buy, find, kemedar, property, settings |
| 5 | kemework/ | 26 | Services marketplace: header, footer, home, mobile |
| 6 | auctions/ | 24 | Bid panels, countdown, analytics, registration, status |
| 7 | snap-and-fix/ | 23 | Photo diagnosis, materials, contractor brief |
| 8 | dashboard/ | 22 | Role-based shells (14 variants) + drawers |
| 9 | verify/ | 18 | 5-level verification wizard, deal tracking, certificates |
| 10 | create-property/ | 17 | 7-step property creation wizard |
| 11 | home/ | 15 | Homepage sections |
| 12 | mobile-v2/ | 15 | Refactored mobile shell |
| 13 | profiles/ | 14 | Agent/agency/developer/franchise profiles |
| 14 | finish/ | 16 | Finishing wizard (6 steps) + dashboard (7 tabs) |
| 15 | surplus/ | 13 | Surplus marketplace: listing, filter, map, 3-step wizard |
| 16 | swap/ | 13 | Swap: swipe cards, match animation, negotiation room |
| 17 | valuation/ | 13 | Valuation wizard + ROI calculator |
| 18 | kemekits/ | 11 | KemeKit: designer cards, BOQ calculator, installation |
| 19 | header/ | 10 | Site header + mega menus |
| 20 | advisor/ | 10 | 8-step advisor questionnaire |
| 21 | crm/ | 10 | Contact tabs: overview, AI, audit, docs, opportunities |
| 22 | add-property/ | 9 | Add property wizard |
| 23 | add-project/ | 9 | Add project wizard |
| 24 | responsive/ | 9 | Mobile utilities |
| 25 | ai-search/ | 8 | AI-powered property search |
| 26 | pwa/ | 8 | PWA: install, splash, onboarding, update, notifications |
| 27 | shop-the-look/ | 7 | Interior design: hotspot tagging, product linking |
| 28 | layout/ | 7 | Footer, ticker, wrapper |
| 29 | score/ | 7 | Kemedar score: badges, dimensions, history |
| 30 | qr/ | 6 | QR generator, customizer, analytics |
| 31 | coach/ | 6 | Coach: chat, achievements, roadmap |
| 32 | concierge/ | 6 | Concierge: tasks, journey, celebration |
| 33 | community/ | 6 | Posts, feeds (morning/evening/daily/weekly) |
| 34 | fo/ | 6 | Field officer inspection wizard |
| 35 | life-score/ | 6 | Neighborhood scoring, comparison |
| 36 | negotiate/ | 6 | Negotiation: offers, briefing, acceptance |
| 37 | franchise-area/ | 11 | Franchise opportunity presentation |
| 38 | kemefrac/ | 9 | Fractional: purchase, portfolio, NEAR wallet |
| 39 | find-property/ | 2+ | Property search |
| 40 | twin/ | 5 | Digital twin, live tours, verification |
| 41-69 | Others | ~60 | auth (4), add-forms (2), add-product (4), add-task (2), add-service (2), add-rfq (2), add-buy-request (3), create-shared (3), create-project (5), create-buy-request (4), distance (3), expat (3), find-people (3), find-project (2), finishing (3), franchise (1), hero (2), investment (varies), live (3), match (3), mobile-benefits (varies), modules (3), predict (2), property (5), rbac (2), seller (1), seller-mobile (2), subscription (2), vision (3), about (1), ai (3) |

---

## 2. UPDATED ARCHITECTURE

### 2.1 Folder Structure (Complete)

```
kemedar-v5/
├── prisma/
│   ├── schema.prisma
│   ├── schema/                    # 23 domain schema files (DONE)
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── app/
│   │   ├── (public)/              # Public routes
│   │   │   ├── page.tsx           # Home
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── terms/
│   │   │   ├── careers/
│   │   │   ├── sitemap/
│   │   │   ├── search/
│   │   │   │   ├── properties/
│   │   │   │   └── projects/
│   │   │   ├── property/[id]/
│   │   │   ├── project/[id]/
│   │   │   ├── qr/[code]/
│   │   │   ├── score/[token]/
│   │   │   ├── verify/[id]/
│   │   │   ├── user-benefits/[role]/
│   │   │   └── profile/[username]/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/           # User dashboard (80+ routes)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── my-properties/
│   │   │   ├── favorites/
│   │   │   ├── compare/
│   │   │   ├── subscription/
│   │   │   ├── profile/
│   │   │   ├── wallet/
│   │   │   ├── orders/
│   │   │   ├── invoices/
│   │   │   ├── notifications/
│   │   │   ├── messages/
│   │   │   ├── settings/
│   │   │   └── [...slug]/         # Catch-all for remaining dashboard routes
│   │   │
│   │   ├── (cp)/                  # Control Panel (role-based, 400+ routes)
│   │   │   ├── layout.tsx         # Role-detecting shell
│   │   │   ├── cp/
│   │   │   │   ├── user/[...slug]/
│   │   │   │   ├── agent/[...slug]/
│   │   │   │   ├── agency/[...slug]/
│   │   │   │   ├── pro/[...slug]/
│   │   │   │   ├── developer/[...slug]/
│   │   │   │   └── company/[...slug]/
│   │   │
│   │   ├── (kemedar)/             # Kemedar features (50+ routes)
│   │   │   ├── layout.tsx
│   │   │   ├── kemedar/
│   │   │   │   ├── advisor/
│   │   │   │   ├── ai-search/
│   │   │   │   ├── coach/
│   │   │   │   ├── community/
│   │   │   │   ├── dna/
│   │   │   │   ├── escrow/
│   │   │   │   ├── expat/
│   │   │   │   ├── finish/
│   │   │   │   ├── life-score/
│   │   │   │   ├── live/
│   │   │   │   ├── match/
│   │   │   │   ├── negotiate/
│   │   │   │   ├── predict/
│   │   │   │   ├── rent2own/
│   │   │   │   ├── score/
│   │   │   │   ├── swap/
│   │   │   │   ├── twin/
│   │   │   │   ├── valuation/
│   │   │   │   ├── verify/
│   │   │   │   └── vision/
│   │   │
│   │   ├── (kemetro)/             # Marketplace (60+ routes)
│   │   │   ├── layout.tsx
│   │   │   ├── kemetro/
│   │   │   │   ├── page.tsx       # Home
│   │   │   │   ├── product/[slug]/
│   │   │   │   ├── category/[slug]/
│   │   │   │   ├── cart/
│   │   │   │   ├── checkout/
│   │   │   │   ├── search/
│   │   │   │   ├── flash/
│   │   │   │   ├── kemekits/
│   │   │   │   ├── surplus/
│   │   │   │   ├── shop-the-look/
│   │   │   │   ├── build/
│   │   │   │   ├── seller/
│   │   │   │   ├── buyer/
│   │   │   │   ├── shipper/
│   │   │   │   └── admin/
│   │   │
│   │   ├── (kemework)/            # Services marketplace (30+ routes)
│   │   │   ├── layout.tsx
│   │   │   ├── kemework/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── services/
│   │   │   │   ├── tasks/
│   │   │   │   ├── snap-fix/
│   │   │   │   ├── professionals/
│   │   │   │   └── accreditation/
│   │   │
│   │   ├── (admin)/               # Admin (150+ routes)
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── users/
│   │   │   │   ├── properties/
│   │   │   │   ├── projects/
│   │   │   │   ├── crm/
│   │   │   │   ├── rbac/
│   │   │   │   ├── translations/
│   │   │   │   ├── subscriptions/
│   │   │   │   ├── modules/
│   │   │   │   ├── kemedar/       # Sub-admin for all kemedar features
│   │   │   │   ├── kemetro/       # Sub-admin for marketplace
│   │   │   │   └── kemework/      # Sub-admin for services
│   │   │
│   │   ├── (fo)/                  # Franchise owner (7+ routes)
│   │   │   ├── layout.tsx
│   │   │   └── fo/
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/              # login, register, session, logout
│   │   │   └── v1/
│   │   │       ├── properties/    # CRUD + valuation + vision
│   │   │       ├── auctions/      # CRUD + bid + register + approve + end
│   │   │       ├── escrow/        # CRUD + progress + dispute + settle
│   │   │       ├── frac/          # CRUD + purchase + yield + kyc
│   │   │       ├── swap/          # intent + matches + interest + agree
│   │   │       ├── community/     # CRUD + posts + join + digest
│   │   │       ├── negotiations/  # session + offers + messages
│   │   │       ├── marketplace/   # products + flash + group-buy
│   │   │       ├── kemework/      # services + tasks + snap-fix
│   │   │       ├── live-events/   # CRUD + register + messages + polls
│   │   │       ├── subscriptions/ # plans + subscribe + cancel + webhook
│   │   │       ├── scoring/       # score + events + badges + share
│   │   │       ├── coaching/      # journey + content + nudge + response
│   │   │       ├── concierge/     # journey + tasks + move-in
│   │   │       ├── construction/  # projects + boq + phases + snagging
│   │   │       ├── crm/          # contacts + opportunities + tasks + calls
│   │   │       ├── qr/           # generate + scan + analytics
│   │   │       ├── users/        # profile + dna + score
│   │   │       ├── locations/    # countries + provinces + cities
│   │   │       ├── translations/ # get + import + export
│   │   │       ├── surplus/      # items + reserve + ship
│   │   │       ├── kemekit/      # calculate + cart + install
│   │   │       ├── ai/           # generate + search + analyze
│   │   │       ├── admin/        # users + modules + rbac + seed
│   │   │       └── webhooks/     # stripe + near
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── server/                    # Server-side
│   │   ├── services/              # 22 service files (1 per module)
│   │   ├── repositories/          # 22 repository files
│   │   ├── middleware/            # auth, rbac, rate-limit, validation
│   │   ├── validators/           # Zod schemas per domain
│   │   ├── jobs/                  # Cron/scheduled jobs
│   │   │   ├── auto-expire-reservations.ts
│   │   │   ├── recalculate-dna.ts
│   │   │   ├── regenerate-match-queues.ts
│   │   │   ├── process-concierge-notifications.ts
│   │   │   └── send-shop-the-look-notifications.ts
│   │   └── lib/
│   │       ├── prisma.ts
│   │       ├── auth.ts
│   │       ├── api-response.ts
│   │       ├── ai-client.ts
│   │       ├── near-client.ts
│   │       ├── stripe-client.ts
│   │       ├── email.ts
│   │       └── websocket.ts
│   │
│   ├── components/                # 69 directories migrated
│   │   ├── ui/                    # Shadcn (copy as-is)
│   │   └── [all 68 feature dirs]
│   │
│   ├── hooks/                     # React Query hooks per domain
│   │   ├── use-properties.ts
│   │   ├── use-auctions.ts
│   │   ├── use-escrow.ts
│   │   ├── use-frac.ts
│   │   ├── use-community.ts
│   │   ├── use-marketplace.ts
│   │   ├── use-kemework.ts
│   │   ├── use-negotiations.ts
│   │   ├── use-scoring.ts
│   │   ├── use-subscriptions.ts
│   │   ├── use-coaching.ts
│   │   ├── use-live-events.ts
│   │   ├── use-qr.ts
│   │   ├── use-surplus.ts
│   │   ├── use-kemekit.ts
│   │   ├── use-mobile.ts
│   │   └── use-responsive.ts
│   │
│   ├── lib/                       # Client-side utilities
│   │   ├── api-client.ts          # Fetch wrapper
│   │   ├── auth-context.tsx       # Auth state
│   │   ├── currency-context.tsx   # 8 currencies
│   │   ├── module-context.tsx     # Feature flags
│   │   ├── query-client.ts        # React Query
│   │   ├── i18n/                  # 19 languages
│   │   │   ├── provider.tsx
│   │   │   └── translations/
│   │   ├── subscription-engine.ts # 17 plan types
│   │   ├── rbac/                  # Permission system
│   │   │   ├── permission-utils.ts
│   │   │   ├── permission-gate.tsx
│   │   │   └── seed-data.ts
│   │   ├── dna-tracker.ts         # Behavioral signals
│   │   ├── notification-templates/ # 70+ notification templates
│   │   │   ├── auction.ts
│   │   │   ├── kemefrac.ts
│   │   │   ├── swap.ts
│   │   │   └── verify-pro.ts
│   │   ├── pwa/                   # PWA utilities
│   │   │   ├── install-manager.ts
│   │   │   ├── update-manager.ts
│   │   │   ├── register.ts
│   │   │   └── background-sync.ts
│   │   ├── mobile-detect.ts
│   │   ├── route-redirector.ts
│   │   └── utils.ts
│   │
│   └── types/                     # TypeScript types
│       └── [per domain]
│
├── public/
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 3. COMPLETE MIGRATION PLAN (Step-by-Step)

### Phase 0: Foundation ✅ DONE
- [x] Next.js project init
- [x] Prisma + PostgreSQL setup
- [x] Auth (JWT)
- [x] Server lib (prisma, auth, ai-client, api-response)

### Phase 1: Data Layer ✅ DONE
- [x] 23 Prisma schema files (184 models + 35 enums)
- [x] 8 Repository files (base, property, user, auction, escrow, frac, community, index)

### Phase 2: Service Layer (PARTIAL — 46/131 functions done)

**Done (7 services):**
- [x] property.service.ts (calculateValuation, getAIPriceSuggestion, batchProcessImages)
- [x] auction.service.ts (createAuction, approveAuction, registerBidder, placeBid, endAuction, forfeitWinner, refundAllLosers, setAutoBid)
- [x] escrow.service.ts (createDeal, progressMilestone, evaluateDispute, generateDealStructure)
- [x] frac.service.ts (submitOffering, approveOffering, purchaseTokens, distributeYield, getPortfolio)
- [x] scoring.service.ts (addScoreEvent, calculateKemedarScore, getMyScore, calculateLifeScore, generateLifeScoreNarrative)
- [x] community.service.ts (createPost, moderatePost, detectKemeworkOpportunity, joinCommunity, generateDigest)
- [x] ai.service.ts (generateContent, analyzeDocument, processPropertySearch, generateBuyerStrategy, generateSellerStrategy, draftOfferMessage)

**TODO (15 services):**
- [ ] swap.service.ts — publishSwapIntent, generateSwapMatches, expressInterest, passOnMatch, agreeToTerms, recordSwipe, transferOwnership
- [ ] negotiation.service.ts — openNegotiationRoom, submitCounterOffer
- [ ] marketplace.service.ts — searchProducts, placeFlashOrder, matchFlashDeals, confirmFlashDelivery, generateGroupBuyOffer, mergeGuestCart, detectGroupBuyOpportunities
- [ ] kemework.service.ts — processSnapAndFix, convertSnapToTask, detectKemeworkOpportunity, updateTaskStatus, requestInstallation, generateCaptureGuide
- [ ] kemekit.service.ts — calculateKemeKitBoQ, addKemeKitToCart, toggleOptionalItem
- [ ] surplus.service.ts — publishSurplusItem, reserveSurplusItem, cancelSurplusReservation, autoExpireSurplusReservations, createSurplusShipmentRequest, generateSurplusListing, querySurplusForProfessional, surplusPostRenovationNudge
- [ ] coaching.service.ts — generateCoachNudge, generateCoachResponse, generatePersonalizedStep, seedCoachJourneys, dismissJourney
- [ ] concierge.service.ts — triggerMoveInConcierge, processConciergeNotifications, setMoveInDate
- [ ] live-event.service.ts — generateEventDescription, generateEventSummary, suggestEventQuestions, generateTourSummary, moderateEventMessage
- [ ] qr.service.ts — generateQRCode, downloadQRCode, handleQRScan, getUserQRCodes, regenerateQRCode, getQRAnalytics, recordHotspotClick, processImageForHotspots
- [ ] verification.service.ts — advanceVerificationLevel, appendVerificationRecord, issueCertificate, agreeToTerms, analyzeDocumentWithAI
- [ ] blockchain.service.ts — tokenizeOnNEAR, verifyChainIntegrity, mintPropertyToken, expressInterest, syncNEARBalance
- [ ] notification.service.ts — notifyFlashBuyers, notifyTurnkeyLead, processConciergeNotifications, sendShopTheLookNotifications, surplusPostRenovationNudge
- [ ] admin.service.ts — seedRBACData, seedCoachJourneys, seedBuyItFinishedFeature, importEgyptLocations, importTranslations, exportTranslations, getTranslations
- [ ] crm.service.ts — full CRM operations

### Phase 3: API Routes (PARTIAL — 17/300+ done)

**Done:**
- [x] Properties CRUD + valuation
- [x] Auctions + bid + register
- [x] Escrow + progress
- [x] Frac + purchase
- [x] Community posts
- [x] Scoring my-score
- [x] AI generate + search
- [x] Auth login + register + session

**TODO:**
- [ ] Swap (4 routes)
- [ ] Negotiations (3 routes)
- [ ] Marketplace/Flash/GroupBuy (8 routes)
- [ ] Kemework/Snap (6 routes)
- [ ] KemeKit (4 routes)
- [ ] Surplus (5 routes)
- [ ] Live Events (6 routes)
- [ ] Coaching (4 routes)
- [ ] Concierge (3 routes)
- [ ] QR (5 routes)
- [ ] CRM (10 routes)
- [ ] Construction/Finishing (8 routes)
- [ ] Users/DNA/Profile (5 routes)
- [ ] Locations (3 routes)
- [ ] Translations (3 routes)
- [ ] Subscriptions/Stripe webhook (5 routes)
- [ ] Admin operations (10 routes)
- [ ] Webhooks (2 routes)

### Phase 4: Infrastructure
- [ ] Currency context (8 currencies)
- [ ] Module context (feature flags)
- [ ] i18n system (19 languages)
- [ ] Subscription engine (17 plans)
- [ ] RBAC system (174 resources)
- [ ] DNA tracker
- [ ] Notification templates (70+)
- [ ] PWA system
- [ ] Mobile detection + route redirect
- [ ] Email service

### Phase 5: UI Migration (855 pages, 550+ components)
- Priority: P0 modules first (Property, Auction, Escrow, Kemetro)
- Strategy: Copy Shadcn/ui components as-is, convert feature components
- Mobile: Responsive design replaces /m/ routes (eliminate duplication)

---

## 4. COMPLETE FUNCTION MAPPING (131 → Services)

| Service | Functions | Status |
|---------|-----------|--------|
| property.service | calculateValuation, getAIPriceSuggestion, adminSetValuation, batchProcessPropertyImages | ✅ Done |
| auction.service | createAuction, approveAuction, placeBid, endAuction, registerBidder, forfeitWinner, refundAllLosers, processWinnerPayment, setAutoBid, paySellerDeposit | ✅ Done (8/10) |
| escrow.service | escrowMilestoneProgression, evaluateDispute, settleByQrScan, generateDealStructure, joinCompoundDeal | ✅ Done (4/5) |
| frac.service | submitFracOffering, approveOffering, purchaseTokens, distributeYield, payCreatorCommission, syncNEARBalance | ✅ Done (5/6) |
| scoring.service | calculateKemedarScore, getMyKemedarScore, calculateLifeScore, generateLifeScoreNarrative, addScoreEvent, getSharedScore, scoreRelocationMatch | ✅ Done (5/7) |
| community.service | createCommunityPost, moderateCommunityPost, joinCommunity, generateCommunityDigest, moderateEventMessage | ✅ Done (4/5) |
| ai.service | aiGenerateContent, analyzeDocumentWithAI, processAIPropertySearch, generateBuyerStrategy, generateSellerStrategy, draftOfferMessage, generatePricePrediction, generateDealStructure, generateExpansionRoadmap | ✅ Done (6/9) |
| swap.service | publishSwapIntent, generateSwapMatches, expressInterest, passOnMatch, agreeToTerms, recordSwipe, transferOwnership | ❌ TODO |
| negotiation.service | openNegotiationRoom, submitCounterOffer | ❌ TODO |
| marketplace.service | searchKemetroProducts, searchKemetroForMaterial, placeFlashOrder, matchFlashDeals, notifyFlashBuyers, confirmFlashDelivery, generateGroupBuyOffer, mergeGuestCart, addToShopTheLookCart, sendShopTheLookNotifications, detectGroupBuyOpportunities | ❌ TODO |
| kemework.service | processSnapAndFix, convertSnapToTask, redirectToKemeworkTask, requestInstallation, generateCaptureGuide, detectKemeworkOpportunity, updateTaskStatus | ❌ TODO |
| kemekit.service | addKemeKitToCart, calculateKemeKitBoQ, toggleOptionalItem | ❌ TODO |
| surplus.service | publishSurplusItem, reserveSurplusItem, cancelSurplusReservation, autoExpireSurplusReservations, createSurplusShipmentRequest, generateSurplusListing, querySurplusForProfessional, surplusPostRenovationNudge | ❌ TODO |
| coaching.service | generateCoachNudge, generateCoachResponse, generatePersonalizedStep, seedCoachJourneys, dismissJourney | ❌ TODO |
| concierge.service | triggerMoveInConcierge, processConciergeNotifications, setMoveInDate, dismissJourney | ❌ TODO |
| live-event.service | generateEventDescription, generateEventSummary, suggestEventQuestions, generateTourSummary | ❌ TODO |
| qr.service | generateQRCode, downloadQRCode, handleQRScan, getUserQRCodes, regenerateQRCode, getQRAnalytics, recordHotspotClick, processImageForHotspots | ❌ TODO |
| verification.service | advanceVerificationLevel, appendVerificationRecord, issueCertificate, analyzeDocumentWithAI | ❌ TODO |
| blockchain.service | tokenizeOnNEAR, verifyChainIntegrity, mintPropertyToken, syncNEARBalance | ❌ TODO |
| notification.service | notifyFlashBuyers, notifyTurnkeyLead, processConciergeNotifications, sendShopTheLookNotifications | ❌ TODO |
| admin.service | seedRBACData, seedCoachJourneys, seedBuyItFinishedFeature, importEgyptLocations, importTranslations, exportTranslations, getTranslations | ❌ TODO |
| dna.service | getMyDNA, recalculateDNA, recalculateAllDNA | ❌ TODO |

---

## 5. RISK ANALYSIS (Updated)

| Risk | Severity | Notes |
|------|----------|-------|
| 855 pages to convert | HIGH | Use catch-all routes + lazy migration |
| 400+ CP routes are role-duplicated | MEDIUM | Merge into single role-aware shell |
| 70+ mobile pages duplicate desktop | MEDIUM | Eliminate with responsive design |
| NEAR blockchain integration | CRITICAL | 6 functions, needs testnet |
| 48 AI/LLM functions | HIGH | Need Anthropic API key + prompt engineering |
| 75 functions send email | HIGH | Need email service (Resend/SendGrid) |
| 19-language i18n | MEDIUM | Migrate translation loading logic |
| 174 RBAC resources | HIGH | Seed data + permission checking middleware |
| Real-time features (5 entities) | HIGH | Need WebSocket/SSE server |
| Stripe integration | MEDIUM | Webhook + subscription billing |
| PWA features | LOW | Can defer, not blocking |

---

*END OF MIGRATION PLAN V2*
