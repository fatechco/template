# Kemedar v4 → Next.js 16 Migration Plan

**Date:** 2026-04-14
**Source:** React 18 + Vite + Base44 SDK
**Target:** Next.js 16 (App Router) + Prisma ORM + PostgreSQL + Service Layer Architecture

---

## 1. PROJECT ANALYSIS

### 1.1 Scale Summary

| Metric | Count |
|--------|-------|
| Base44 Entities | 184 |
| Backend Functions | 131 |
| Frontend Files Using SDK | 356+ |
| Page Components | 73+ (desktop) + mobile mirrors |
| Component Directories | 100+ |
| User Roles | 18 |
| Business Domains | 22 |

### 1.2 Business Domains (Modules)

| # | Domain | Key Entities | Frontend Pages | Backend Functions |
|---|--------|-------------|----------------|-------------------|
| 1 | **Property Core** | Property, PropertyValuation, PropertyDistance, PropertyMatch, PropertySwipe | SearchProperties, PropertyDetails, CreateProperty | calculateValuation, getAIPriceSuggestion |
| 2 | **Auction (KemedarBid)** | AuctionBid, AuctionEvent, AuctionRegistration, AuctionSettings, AuctionWatchlist, PropertyAuction | (embedded in Property pages) | createAuction, placeBid, endAuction, approveAuction, registerBidder, forfeitWinner, refundAllLosers, processWinnerPayment, setAutoBid |
| 3 | **Fractional Ownership (KemeFrac)** | FracProperty, FracToken, FracTransaction, FracKYC, FracWatchlist, FracPropertyUpdate, FracYieldDistribution, FracSettings | KemeFrac, KemeFracDetail, KemeFracKYC, KemeFracPortfolio | submitFracOffering, approveOffering, distributeYield, purchaseTokens, payCreatorCommission |
| 4 | **Property Swap** | SwapIntent, SwapMatch, SwapGapOffer, SwapNegotiationMessage, SwapSettings | (swap components) | publishSwapIntent, generateSwapMatches, submitCounterOffer, passOnMatch, recordSwipe |
| 5 | **Escrow & Deals** | EscrowDeal, EscrowAccount, EscrowTransaction, EscrowMilestone, EscrowDispute, EscrowDocument | SmartContractDeal | escrowMilestoneProgression, evaluateDispute, settleByQrScan, paySellerDeposit |
| 6 | **Construction & Finishing** | BuildProject, FinishProject, FinishBOQ, FinishPhase, FinishMaterialOrder, FinishProgressUpdate, FinishSnaggingItem, BOQItem, FinishingCostIndex, FinishingSimulation, FOInspectionReport | ProjectDetails, SearchProjects | generateBOQ, generateBuildBOQ, generateFinishingEstimate, generateFinishingEstimatePDF, analyzeProgressPhoto, calculateKemeKitBoQ |
| 7 | **CRM** | CRMContact, CRMAccount, CRMAccountContact, CRMOpportunity, CRMOpportunityHistory, CRMPipeline, CRMPipelineStage, CRMTask, CRMNote, CRMCall, CRMMessage, CRMConversation, CRMActivityLog, CRMContactChannel, CRMContactConsent, CRMTemplate, CRMAutomationWorkflow, CRMAutomationRun, CRMAIAction, CRMAIAgent | (admin CRM pages) | draftOfferMessage |
| 8 | **Community** | Community, CommunityMember, CommunityPost, CommunityComment, CommunityAlert, CommunityEvent, CommunityRecommendation | (community components) | createCommunityPost, moderateCommunityPost, joinCommunity, generateCommunityDigest |
| 9 | **Advisor (KemeAdvisor)** | AdvisorProfile, AdvisorMatch, AdvisorReport | (advisor components) | generateAdvisorReport, generateBuyerStrategy, generateSellerStrategy, generateMatchInsights, generateMatchQueue |
| 10 | **Coaching** | CoachProfile, CoachJourney, CoachContent, CoachMessage, CoachAchievement, CoachNudge | (coach components) | generateCoachNudge, generateCoachResponse, generatePersonalizedStep, seedCoachJourneys, dismissJourney |
| 11 | **Concierge** | ConciergeJourney, ConciergeJourneyTemplate, ConciergeTask, ConciergeTaskTemplate | (concierge components) | triggerMoveInConcierge, processConciergeNotifications, setMoveInDate |
| 12 | **Marketplace (Kemetro)** | MarketplaceItem, GroupBuySession, FlashDeal, FlashOrder, ShopTheLookCart, ShopTheLookSettings | 37 Kemetro pages | searchKemetroProducts, searchKemetroForMaterial, placeFlashOrder, matchFlashDeals, notifyFlashBuyers, confirmFlashDelivery, generateGroupBuyOffer, mergeGuestCart |
| 13 | **Surplus** | SurplusItem, SurplusSavedItem, SurplusTransaction, SurplusShipmentRequest, SurplusSettings | (surplus routes) | publishSurplusItem, reserveSurplusItem, cancelSurplusReservation, autoExpireSurplusReservations, createSurplusShipmentRequest, generateSurplusListing, querySurplusForProfessional, surplusPostRenovationNudge |
| 14 | **Market Intelligence** | MarketIntelligenceReport, MarketSignal, MarketProfile, MarketPriceIndex, DemandSignal, DNASignal | ThinkDar | evaluateMarketReadiness, processSignal |
| 15 | **Lifestyle Scoring** | KemedarScore, LifeScoreDataPoint, LifeScoreReview, LifeScoreComparison, NeighborhoodLifeScore | (life-score components) | calculateKemedarScore, getMyKemedarScore, calculateLifeScore, generateLifeScoreNarrative |
| 16 | **Negotiation** | NegotiationSession, NegotiationOffer, NegotiationMessage, NegotiationAnalytics | (negotiate components) | openNegotiationRoom, submitCounterOffer, draftOfferMessage |
| 17 | **Live Events & Tours** | LiveEvent, LiveEventRegistration, LiveEventReservation, LiveEventMessage, LiveEventPoll, LiveEventHighlight, LiveTourSession, LiveTourRegistration, VirtualTour, TourHotspot, TourChatMessage | (live components) | generateEventDescription, generateEventSummary, suggestEventQuestions, generateTourSummary, moderateEventMessage |
| 18 | **User & Auth** | User, UserDNA, UserSubscription, BlockchainWallet | Dashboard, profiles | getMyDNA, recalculateDNA, recalculateAllDNA, agreeToTerms |
| 19 | **Subscriptions & Billing** | Subscription, SubscriptionPlan, SubscriptionActivity, SubscriptionInvoice, Invoice, PaidService | (subscription pages) | — |
| 20 | **Permissions (RBAC)** | RolePermission, SystemRole, SystemModule, PermissionGroup, PermissionResource, PermissionAction, PermissionAuditLog, ModuleConfig, FeatureRegistry | (admin RBAC pages) | seedRBACData |
| 21 | **QR Codes** | QRCode, QRScan, QRSettings | QRRedirect, QRNotFound | generateQRCode, downloadQRCode, handleQRScan, getUserQRCodes, regenerateQRCode, getQRAnalytics, recordHotspotClick, processImageForHotspots |
| 22 | **KemeKit & Snap** | KemeKitItem, KemeKitTemplate, KemeKitCalculation, KemeKitInstallationRequest, KemeKitSave, KemeKitSettings, SnapSession, SnapSettings, SnapMaterialCartItem | (kemekit/snap components) | addKemeKitToCart, calculateKemeKitBoQ, toggleOptionalItem, processSnapAndFix, convertSnapToTask, generateCaptureGuide, requestInstallation |

### 1.3 All SDK Operations Used

```
base44.entities.<Entity>.list()       → SELECT * (paginated)
base44.entities.<Entity>.filter({})   → SELECT * WHERE ... 
base44.entities.<Entity>.create({})   → INSERT
base44.entities.<Entity>.update(id, {}) → UPDATE WHERE id
base44.entities.<Entity>.delete(id)   → DELETE WHERE id
base44.entities.<Entity>.get(id)      → SELECT * WHERE id
base44.entities.<Entity>.subscribe()  → WebSocket real-time (5 entities)
```

**Real-time subscriptions (WebSocket):**
- AuctionBid
- LiveEventMessage
- NegotiationMessage
- NegotiationOffer
- NegotiationSession

### 1.4 Base44 Backend Functions (131 total)

These run server-side on Base44 cloud. They represent the **missing backend logic** that must be rebuilt entirely.

Categories:
- **AI/LLM-powered** (27): Content generation, predictions, analysis, matching
- **Transaction/Financial** (13): Escrow, payments, yield distribution, token purchase
- **CRUD Orchestration** (25): Multi-entity create/update workflows
- **Notification/Communication** (12): Email, push, in-app notifications
- **Blockchain** (6): NEAR Protocol tokenization, wallet sync, chain verification
- **Data Seeding/Admin** (8): Import, seed, batch processing
- **Scoring/Analytics** (10): Kemedar score, life score, DNA calculation
- **Search/Matching** (15): Property matching, product search, swap matching
- **QR Operations** (8): QR generation, scanning, analytics
- **Other** (7): Miscellaneous business logic

### 1.5 Entity Relationship Map (Core)

```
User (1) ──────┬── (*) Property
               ├── (*) EscrowDeal
               ├── (*) SwapIntent
               ├── (*) FracToken
               ├── (*) AuctionRegistration
               ├── (*) CRMContact
               ├── (1) UserDNA
               ├── (1) KemedarScore
               ├── (1) CoachProfile
               ├── (1) AdvisorProfile
               ├── (1) MatchProfile
               ├── (*) Subscription
               └── (*) BlockchainWallet

Property (1) ──┬── (*) PropertyDistance
               ├── (*) PropertyMatch
               ├── (*) PropertySwipe
               ├── (0..1) PropertyAuction
               ├── (0..1) FracProperty
               ├── (0..1) SwapIntent
               ├── (*) PropertyValuation
               ├── (*) AnalyzedPropertyImage
               └── (0..1) PropertyToken

EscrowDeal (1) ┬── (*) EscrowTransaction
               ├── (*) EscrowMilestone
               ├── (*) EscrowDispute
               └── (*) EscrowDocument

Community (1) ─┬── (*) CommunityMember
               ├── (*) CommunityPost ── (*) CommunityComment
               ├── (*) CommunityEvent
               └── (*) CommunityAlert

FracProperty (1) ┬── (*) FracToken
                 ├── (*) FracTransaction
                 ├── (*) FracPropertyUpdate
                 └── (*) FracYieldDistribution

Location Hierarchy:
Country (1) → Province (*) → City (*) → District (*) → Area (*)
```

---

## 2. ARCHITECTURE PROPOSAL

### 2.1 Target Folder Structure

```
kemedar-v5/
├── prisma/
│   ├── schema/                    # Split Prisma schemas by domain
│   │   ├── property.prisma
│   │   ├── user.prisma
│   │   ├── auction.prisma
│   │   ├── escrow.prisma
│   │   ├── frac.prisma
│   │   ├── swap.prisma
│   │   ├── crm.prisma
│   │   ├── community.prisma
│   │   ├── marketplace.prisma
│   │   ├── construction.prisma
│   │   ├── subscription.prisma
│   │   ├── scoring.prisma
│   │   ├── live-event.prisma
│   │   ├── negotiation.prisma
│   │   ├── coaching.prisma
│   │   ├── concierge.prisma
│   │   ├── qr.prisma
│   │   ├── rbac.prisma
│   │   ├── location.prisma        # Country/Province/City/District/Area
│   │   └── lookup.prisma          # PropertyCategory, PropertyPurpose, etc.
│   ├── schema.prisma              # Main schema (datasource + generator)
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (public)/              # Public routes (no auth)
│   │   │   ├── page.tsx           # Home
│   │   │   ├── search/
│   │   │   │   ├── properties/
│   │   │   │   └── projects/
│   │   │   ├── property/[id]/
│   │   │   ├── project/[id]/
│   │   │   ├── about/
│   │   │   ├── terms/
│   │   │   └── sitemap/
│   │   │
│   │   ├── (auth)/                # Auth routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (dashboard)/           # Protected user routes
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── my-properties/
│   │   │   ├── favorites/
│   │   │   ├── subscription/
│   │   │   └── profile/
│   │   │
│   │   ├── (kemedar)/             # Property matching & scoring
│   │   │   ├── advisor/
│   │   │   ├── match/
│   │   │   ├── life-score/
│   │   │   └── predict/
│   │   │
│   │   ├── (kemetro)/             # Marketplace
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── product/[id]/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── seller/
│   │   │   ├── shipper/
│   │   │   └── surplus/
│   │   │
│   │   ├── (kemework)/            # Services
│   │   │   ├── layout.tsx
│   │   │   └── ...
│   │   │
│   │   ├── (admin)/               # Admin panel
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── properties/
│   │   │   ├── users/
│   │   │   ├── crm/
│   │   │   ├── rbac/
│   │   │   ├── translations/
│   │   │   └── subscriptions/
│   │   │
│   │   ├── (franchise)/           # Franchise owner
│   │   │   └── ...
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── v1/
│   │   │   │   ├── properties/
│   │   │   │   │   ├── route.ts          # GET (list/filter), POST (create)
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts      # GET, PUT, DELETE
│   │   │   │   │       ├── valuation/route.ts
│   │   │   │   │       └── auction/route.ts
│   │   │   │   ├── users/
│   │   │   │   ├── auctions/
│   │   │   │   ├── escrow/
│   │   │   │   ├── frac/
│   │   │   │   ├── swap/
│   │   │   │   ├── crm/
│   │   │   │   ├── community/
│   │   │   │   ├── marketplace/
│   │   │   │   ├── negotiations/
│   │   │   │   ├── live-events/
│   │   │   │   ├── subscriptions/
│   │   │   │   ├── scoring/
│   │   │   │   ├── qr/
│   │   │   │   ├── ai/              # AI-powered endpoints
│   │   │   │   │   ├── predict/
│   │   │   │   │   ├── generate/
│   │   │   │   │   └── analyze/
│   │   │   │   └── webhooks/
│   │   │   │       ├── stripe/
│   │   │   │       └── near/
│   │   │   └── auth/
│   │   │       ├── login/route.ts
│   │   │       ├── register/route.ts
│   │   │       └── session/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── server/                    # Server-side business logic
│   │   ├── services/              # Service Layer (business logic)
│   │   │   ├── property.service.ts
│   │   │   ├── auction.service.ts
│   │   │   ├── escrow.service.ts
│   │   │   ├── frac.service.ts
│   │   │   ├── swap.service.ts
│   │   │   ├── crm.service.ts
│   │   │   ├── community.service.ts
│   │   │   ├── marketplace.service.ts
│   │   │   ├── negotiation.service.ts
│   │   │   ├── scoring.service.ts
│   │   │   ├── coaching.service.ts
│   │   │   ├── concierge.service.ts
│   │   │   ├── live-event.service.ts
│   │   │   ├── subscription.service.ts
│   │   │   ├── qr.service.ts
│   │   │   ├── ai.service.ts          # Wraps LLM calls
│   │   │   ├── blockchain.service.ts  # NEAR Protocol integration
│   │   │   └── notification.service.ts
│   │   │
│   │   ├── repositories/         # Data Access Layer (Prisma queries)
│   │   │   ├── property.repository.ts
│   │   │   ├── auction.repository.ts
│   │   │   ├── escrow.repository.ts
│   │   │   ├── frac.repository.ts
│   │   │   ├── swap.repository.ts
│   │   │   ├── crm.repository.ts
│   │   │   ├── community.repository.ts
│   │   │   ├── marketplace.repository.ts
│   │   │   ├── negotiation.repository.ts
│   │   │   ├── scoring.repository.ts
│   │   │   └── ...
│   │   │
│   │   ├── middleware/            # API middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   │
│   │   ├── validators/           # Zod schemas for request validation
│   │   │   ├── property.schema.ts
│   │   │   ├── auction.schema.ts
│   │   │   └── ...
│   │   │
│   │   └── lib/
│   │       ├── prisma.ts          # Prisma client singleton
│   │       ├── auth.ts            # Auth utilities (JWT/session)
│   │       ├── ai-client.ts       # LLM client wrapper
│   │       ├── near-client.ts     # NEAR blockchain client
│   │       ├── stripe-client.ts   # Stripe server-side
│   │       ├── email.ts           # Email service
│   │       └── websocket.ts       # WebSocket for real-time
│   │
│   ├── components/                # React components (migrated)
│   │   ├── ui/                    # Radix/Shadcn (keep as-is)
│   │   ├── property/
│   │   ├── auction/
│   │   ├── escrow/
│   │   ├── frac/
│   │   ├── community/
│   │   ├── kemetro/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── hooks/                     # Client-side hooks
│   │   ├── use-property.ts        # React Query hooks per domain
│   │   ├── use-auction.ts
│   │   ├── use-auth.ts
│   │   └── ...
│   │
│   ├── lib/                       # Client-side utilities
│   │   ├── api-client.ts          # Fetch wrapper for /api/v1/*
│   │   ├── query-client.ts        # React Query config
│   │   ├── auth-context.tsx
│   │   ├── module-context.tsx
│   │   ├── currency-context.tsx
│   │   ├── i18n/
│   │   └── utils.ts
│   │
│   └── types/                     # Shared TypeScript types
│       ├── property.types.ts
│       ├── user.types.ts
│       ├── auction.types.ts
│       └── ...
│
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env
└── package.json
```

### 2.2 Layer Separation

```
┌─────────────────────────────────────────┐
│  Next.js App Router (Pages/Layouts)     │  ← UI Layer (React Server/Client Components)
│  Components + Hooks                     │
├─────────────────────────────────────────┤
│  API Routes (app/api/v1/*)              │  ← Controller Layer (HTTP ↔ Service)
│  Request validation (Zod)               │
│  Auth/RBAC middleware                   │
├─────────────────────────────────────────┤
│  Services (server/services/*)           │  ← Business Logic Layer
│  Orchestrates repositories              │
│  Implements 131 Base44 functions        │
│  AI/LLM integration                     │
│  Notification dispatch                  │
├─────────────────────────────────────────┤
│  Repositories (server/repositories/*)   │  ← Data Access Layer
│  Prisma queries only                    │
│  No business logic                      │
├─────────────────────────────────────────┤
│  Prisma ORM                             │  ← ORM Layer
│  PostgreSQL                             │  ← Database
└─────────────────────────────────────────┘
```

**Data flow example:**
```
Client Component
  → React Query hook (useProperties)
    → fetch("/api/v1/properties?city=cairo")
      → API Route (controller)
        → auth middleware (verify JWT)
        → rbac middleware (check permission)
        → zod validation
        → propertyService.search(filters)
          → propertyRepository.findMany(where)
            → prisma.property.findMany(...)
              → PostgreSQL
```

---

## 3. MIGRATION PLAN (Step-by-Step)

### Phase 0: Foundation (Week 1-2)

**0.1 — Initialize Next.js 16 project**
- `npx create-next-app@latest kemedar-v5 --typescript --tailwind --app --src-dir`
- Configure path aliases (`@/` → `src/`)
- Install shared dependencies (Radix UI, Framer Motion, React Query, Zod, Recharts, Leaflet, etc.)
- Copy `components/ui/` (Shadcn) verbatim — these are framework-agnostic

**0.2 — Set up PostgreSQL + Prisma**
- Install Prisma, init with PostgreSQL provider
- Configure `prisma/schema.prisma` with multi-file schema support (`prismaSchemaFolder`)
- Set up dev/staging/prod database URLs in `.env`

**0.3 — Set up Auth**
- Replace Base44 auth with NextAuth.js v5 (Auth.js) or custom JWT
- Implement session management, role-based guards
- Map all 18 Base44 user roles to RBAC system

**0.4 — Set up CI/CD**
- Docker Compose for local dev (PostgreSQL, Redis)
- GitHub Actions for build/test/lint

---

### Phase 1: Extract & Convert Entities to Prisma (Week 2-4)

**For each of the 184 entities:**

1. Read the `.jsonc` schema definition
2. Convert to Prisma model with proper types, relations, indexes
3. Add to the appropriate domain schema file

**Conversion rules:**

| Base44 Type | Prisma Type |
|-------------|-------------|
| `"type": "string"` | `String` |
| `"type": "string", "format": "date-time"` | `DateTime` |
| `"type": "number"` | `Float` or `Int` (context-dependent) |
| `"type": "boolean"` | `Boolean` |
| `"type": "string", "enum": [...]` | `enum` (Prisma enum) |
| `"type": "array", "items": {"type": "string"}` | `String[]` (PostgreSQL array) |
| `"type": "string", "description": "Reference to X"` | Relation to model X |
| Nested objects | `Json` type or separate model |

**Priority order by dependency:**
1. Location models (Country, Province, City, District, Area)
2. Lookup tables (PropertyCategory, PropertyPurpose, Currency, etc.)
3. User
4. Property (depends on User + Locations + Lookups)
5. All other domains (can be parallelized)

**Example conversion (Property):**

```
// base44/entities/Property.jsonc
{
  "user_id": { "type": "string", "description": "Reference to User" },
  "title": { "type": "string" },
  "price_amount": { "type": "number" },
  ...
}

// → prisma/schema/property.prisma
model Property {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  propertyCode    String?  @unique
  title           String
  titleAr         String?
  description     String?
  descriptionAr   String?
  priceAmount     Float?
  currencyId      String?
  currency        Currency? @relation(fields: [currencyId], references: [id])
  categoryId      String
  category        PropertyCategory @relation(fields: [categoryId], references: [id])
  purposeId       String
  purpose         PropertyPurpose @relation(fields: [purposeId], references: [id])
  // ... 50+ more fields
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  // Relations
  distances       PropertyDistance[]
  matches         PropertyMatch[]
  valuations      PropertyValuation[]
  auction         PropertyAuction?
  fracProperty    FracProperty?
  swapIntent      SwapIntent?

  @@index([userId])
  @@index([categoryId, purposeId])
  @@index([cityId])
  @@index([isActive, isFeatured])
}
```

**Run migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### Phase 2: Build Repository Layer (Week 4-5)

**For each domain, create a repository file with typed Prisma queries:**

```
server/repositories/property.repository.ts
  → findMany(filters, pagination)
  → findById(id)
  → create(data)
  → update(id, data)
  → softDelete(id)
  → search(query, filters)
  → countByStatus()
```

Pattern: Each repository wraps one Prisma model. No business logic. Returns typed results.

Total: ~22 repository files (one per domain)

---

### Phase 3: Build Service Layer — Replace 131 Backend Functions (Week 5-10)

This is the **most critical and risky** phase. Each Base44 function must be reverse-engineered from:
1. The function's `entry.ts` file in `base44/functions/`
2. Frontend code that calls it (to understand expected inputs/outputs)
3. Business context

**Service mapping (131 functions → services):**

| Service File | Functions to Implement | Complexity |
|---|---|---|
| `property.service.ts` | calculateValuation, getAIPriceSuggestion, batchProcessPropertyImages | HIGH — AI-dependent |
| `auction.service.ts` | createAuction, placeBid, endAuction, approveAuction, registerBidder, forfeitWinner, refundAllLosers, processWinnerPayment, setAutoBid | HIGH — financial, real-time |
| `frac.service.ts` | submitFracOffering, approveOffering, distributeYield, purchaseTokens, payCreatorCommission, syncNEARBalance | CRITICAL — blockchain + financial |
| `swap.service.ts` | publishSwapIntent, generateSwapMatches, submitCounterOffer, passOnMatch, recordSwipe, transferOwnership | HIGH — matching algorithm |
| `escrow.service.ts` | escrowMilestoneProgression, evaluateDispute, settleByQrScan, paySellerDeposit, joinCompoundDeal | CRITICAL — financial |
| `construction.service.ts` | generateBOQ, generateBuildBOQ, generateFinishingEstimate, generateFinishingEstimatePDF, analyzeProgressPhoto | HIGH — AI + PDF |
| `crm.service.ts` | draftOfferMessage | MEDIUM |
| `community.service.ts` | createCommunityPost, moderateCommunityPost, joinCommunity, generateCommunityDigest, moderateEventMessage | MEDIUM |
| `advisor.service.ts` | generateAdvisorReport, generateBuyerStrategy, generateSellerStrategy, generateMatchInsights, generateMatchQueue, regenerateMatchQueues | HIGH — AI |
| `coaching.service.ts` | generateCoachNudge, generateCoachResponse, generatePersonalizedStep, seedCoachJourneys, dismissJourney | MEDIUM |
| `concierge.service.ts` | triggerMoveInConcierge, processConciergeNotifications, setMoveInDate | MEDIUM |
| `marketplace.service.ts` | searchKemetroProducts, searchKemetroForMaterial, placeFlashOrder, matchFlashDeals, notifyFlashBuyers, confirmFlashDelivery, generateGroupBuyOffer, mergeGuestCart, addToShopTheLookCart, sendShopTheLookNotifications | HIGH |
| `surplus.service.ts` | publishSurplusItem, reserveSurplusItem, cancelSurplusReservation, autoExpireSurplusReservations, createSurplusShipmentRequest, generateSurplusListing, querySurplusForProfessional, surplusPostRenovationNudge | MEDIUM |
| `scoring.service.ts` | calculateKemedarScore, getMyKemedarScore, calculateLifeScore, generateLifeScoreNarrative, addScoreEvent, getSharedScore, scoreRelocationMatch | HIGH — algorithm |
| `dna.service.ts` | getMyDNA, recalculateDNA, recalculateAllDNA | HIGH — algorithm |
| `negotiation.service.ts` | openNegotiationRoom, submitCounterOffer, draftOfferMessage | MEDIUM |
| `live-event.service.ts` | generateEventDescription, generateEventSummary, suggestEventQuestions, generateTourSummary | MEDIUM — AI |
| `qr.service.ts` | generateQRCode, downloadQRCode, handleQRScan, getUserQRCodes, regenerateQRCode, getQRAnalytics, recordHotspotClick, processImageForHotspots | MEDIUM |
| `kemekit.service.ts` | addKemeKitToCart, calculateKemeKitBoQ, toggleOptionalItem, processSnapAndFix, convertSnapToTask, generateCaptureGuide, requestInstallation | MEDIUM |
| `ai.service.ts` | aiGenerateContent, analyzeDocumentWithAI, processAIPropertySearch, generatePricePrediction, generateDealStructure, generateExpansionRoadmap | HIGH — LLM |
| `blockchain.service.ts` | tokenizeOnNEAR, verifyChainIntegrity, mintPropertyToken, expressInterest | CRITICAL — blockchain |
| `notification.service.ts` | notifyTurnkeyLead, processConciergeNotifications, notifyFlashBuyers | MEDIUM |
| `admin.service.ts` | seedRBACData, seedCoachJourneys, seedBuyItFinishedFeature, importEgyptLocations, importTranslations, exportTranslations, getTranslations | LOW |
| `verification.service.ts` | advanceVerificationLevel, appendVerificationRecord, issueCertificate, agreeToTerms | MEDIUM |
| `subscription.service.ts` | (CRUD + Stripe webhook handling) | MEDIUM |

---

### Phase 4: Build API Routes (Week 8-12)

**For each domain, create RESTful API routes:**

```
app/api/v1/properties/route.ts         → GET (list+filter), POST (create)
app/api/v1/properties/[id]/route.ts    → GET, PUT, DELETE
app/api/v1/properties/[id]/valuation/route.ts  → POST (calculate)
app/api/v1/properties/[id]/auction/route.ts    → POST (create auction)
app/api/v1/auctions/[id]/bid/route.ts  → POST (place bid)
...
```

**Each route handler pattern:**
```typescript
// app/api/v1/properties/route.ts
export async function GET(request: NextRequest) {
  // 1. Auth middleware
  // 2. Parse query params
  // 3. Validate with Zod
  // 4. Call service
  // 5. Return JSON response
}
```

**WebSocket endpoints (for real-time features):**
- Auctions (live bidding) → Server-Sent Events or WebSocket via separate service
- Negotiations (real-time offers) → Same
- Live events (chat) → Same

---

### Phase 5: Convert UI (Week 10-18)

**5.1 — Replace SDK calls with API calls**

Every instance of:
```javascript
// OLD
const properties = await base44.entities.Property.list();
const result = await base44.entities.Property.create({ ... });
```

Becomes:
```typescript
// NEW — via React Query hook
const { data: properties } = useQuery({
  queryKey: ['properties', filters],
  queryFn: () => apiClient.get('/api/v1/properties', { params: filters })
});

const mutation = useMutation({
  mutationFn: (data) => apiClient.post('/api/v1/properties', data)
});
```

**5.2 — Convert pages to App Router**

| Current (React Router) | Target (App Router) |
|---|---|
| `src/pages/Home.jsx` | `src/app/(public)/page.tsx` |
| `src/pages/SearchProperties.jsx` | `src/app/(public)/search/properties/page.tsx` |
| `src/pages/PropertyDetails.jsx` | `src/app/(public)/property/[id]/page.tsx` |
| `src/pages/Dashboard.jsx` | `src/app/(dashboard)/dashboard/page.tsx` |
| `src/pages/KemetroHome.jsx` | `src/app/(kemetro)/page.tsx` |
| `src/pages/admin/*.jsx` | `src/app/(admin)/*/page.tsx` |
| `src/pages/m/*.jsx` | Responsive design (no separate mobile routes) |

**5.3 — Convert routing**
- Replace `react-router-dom` with Next.js file-based routing
- Replace `useNavigate()` with `useRouter()` from `next/navigation`
- Replace `<Link>` from react-router with `<Link>` from `next/link`
- Replace `useParams()` with page props or `useParams()` from next
- Remove mobile route duplication (`/m/*`) — use responsive design with same routes

**5.4 — Convert contexts**
- `AuthContext` → NextAuth.js session + `useSession()`
- `ModuleContext` → Server-side feature flags (database-backed)
- `CurrencyContext` → Keep as client context
- `I18nProvider` → `next-intl` or keep custom

**5.5 — Server Components vs Client Components**
- Property listing pages → Server Components (SSR for SEO)
- Property detail pages → Server Components (SSR for SEO)
- Dashboard pages → Client Components (interactive)
- Admin pages → Client Components (interactive)
- Search pages → Hybrid (server for initial, client for filters)

---

## 4. RISK ANALYSIS

### 4.1 Critical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **131 backend functions are black-box** — logic runs on Base44 cloud, we only have entry.ts signatures | CRITICAL | Read each entry.ts carefully. Many contain full logic. For AI functions, replicate prompt + LLM call pattern. Test extensively. |
| **Real-time features (WebSocket)** — 5 entities use `.subscribe()` | HIGH | Implement SSE (Server-Sent Events) or WebSocket server. Consider Pusher/Ably for managed solution. |
| **Blockchain integration (NEAR Protocol)** — 6 functions interact with NEAR | HIGH | Audit `near-api-js` usage. May need NEAR testnet for development. Token economics must be exact. |
| **Financial transactions (Escrow, Payments)** — money movement logic | CRITICAL | Double-entry accounting pattern. Extensive testing. Consider Stripe Connect for escrow. |
| **Data migration from Base44** — existing production data | HIGH | Need Base44 data export API or direct database access. Schema mapping may have edge cases. |
| **AI/LLM functions (27)** — prompts and model selection hidden | HIGH | Reverse-engineer prompts from function code. Use OpenAI/Anthropic API. Test output quality. |
| **Auth system change** — Base44 auth → NextAuth.js | HIGH | User session migration. Password hash compatibility. OAuth provider re-linking. |
| **Rate limiting removal** — current SDK has built-in rate limiter | MEDIUM | Implement server-side rate limiting (Redis + sliding window). |
| **Mobile route elimination** — 73+ `/m/*` routes | MEDIUM | Responsive redesign. Test all breakpoints. Some mobile-specific features may need special handling. |

### 4.2 Missing Backend Logic (Must Be Rebuilt)

These functions have NO frontend equivalent — they run entirely server-side:

1. **Cron/Scheduled jobs:**
   - `autoExpireSurplusReservations` — periodic cleanup
   - `recalculateAllDNA` — batch user profile recalculation
   - `regenerateMatchQueues` — periodic match refresh
   - `processSignal` — market signal processing

2. **Webhook handlers:**
   - Stripe payment webhooks
   - NEAR blockchain event handlers

3. **Background processing:**
   - `batchProcessPropertyImages` — image analysis pipeline
   - `processImageForHotspots` — AI image processing
   - Email/notification dispatch

### 4.3 Data Inconsistency Risks

- **ID format change:** Base44 uses string IDs (likely UUIDs). Prisma can use `cuid()` or `uuid()`. Must be consistent.
- **Soft deletes:** Many entities have `deleted_at`. Prisma needs `@default(now())` pattern + global filter.
- **Enum values:** Base44 enums stored as strings. Prisma enums are stricter — migration must handle unknown values.
- **JSON fields:** Some entities have nested objects. Decide between `Json` type vs normalized tables.
- **Array fields:** Base44 supports arrays natively. PostgreSQL supports arrays but Prisma's support is limited for filtering.
- **Timestamps:** Base44 auto-adds `created_date`. Prisma needs explicit `@default(now())`.

---

## 5. MAPPING TABLE: Base44 → Next.js

### 5.1 SDK Operations

| Base44 SDK | Next.js Equivalent |
|---|---|
| `base44.entities.X.list()` | `GET /api/v1/{resource}` → `repository.findMany()` |
| `base44.entities.X.filter({})` | `GET /api/v1/{resource}?key=val` → `repository.findMany({ where })` |
| `base44.entities.X.get(id)` | `GET /api/v1/{resource}/{id}` → `repository.findById(id)` |
| `base44.entities.X.create({})` | `POST /api/v1/{resource}` → `repository.create(data)` |
| `base44.entities.X.update(id, {})` | `PUT /api/v1/{resource}/{id}` → `repository.update(id, data)` |
| `base44.entities.X.delete(id)` | `DELETE /api/v1/{resource}/{id}` → `repository.softDelete(id)` |
| `base44.entities.X.subscribe()` | WebSocket/SSE endpoint → `GET /api/v1/{resource}/stream` |
| `base44.InvokeBackendFunction(name, args)` | `POST /api/v1/{domain}/{action}` → `service.method(args)` |

### 5.2 Infrastructure

| Base44 | Next.js Equivalent |
|---|---|
| Base44 Cloud (BaaS) | Self-hosted / Vercel + PostgreSQL |
| Base44 Auth | NextAuth.js v5 (Auth.js) |
| Base44 File Storage | S3 / Cloudflare R2 / Vercel Blob |
| Base44 Realtime | WebSocket server / SSE / Pusher |
| Base44 Cron Functions | Vercel Cron / node-cron / BullMQ |
| Base44 AI Functions | Direct OpenAI/Anthropic API calls |
| Rate-limit queue (client) | Server-side rate limiting (Redis) |
| Vite + Base44 Plugin | Next.js built-in bundler (Turbopack) |

### 5.3 Frontend Libraries

| Current | Keep/Replace |
|---|---|
| React 18 | React 19 (Next.js 16) |
| React Router 6 | Next.js App Router (file-based) |
| Vite 6 | Turbopack (built into Next.js) |
| `@base44/sdk` | Custom `apiClient.ts` + React Query |
| Tanstack React Query 5 | Keep (works with Next.js) |
| Radix UI + Shadcn | Keep (framework-agnostic) |
| Tailwind CSS 3 | Tailwind CSS 4 |
| Framer Motion 11 | Keep |
| React Leaflet 4 | Keep |
| Recharts 2 | Keep |
| Stripe React | Keep |
| Zod 3 | Keep (shared client + server validation) |
| react-hook-form 7 | Keep |
| Lucide React | Keep |
| Three.js | Keep |
| next-themes | Keep (already installed) |

### 5.4 Context Providers

| Current | Next.js Equivalent |
|---|---|
| `AuthContext` (Base44 auth) | NextAuth.js `SessionProvider` + `useSession()` |
| `ModuleContext` (feature flags) | DB-backed flags via server component + context |
| `CurrencyContext` | Keep as client context |
| `I18nProvider` | `next-intl` or keep custom (with URL-based locale) |
| `QueryClientProvider` | Keep (wrap in client layout) |

---

## 6. ESTIMATED TIMELINE

| Phase | Duration | Parallelizable |
|-------|----------|----------------|
| Phase 0: Foundation | 2 weeks | No |
| Phase 1: Prisma schemas (184 entities) | 2-3 weeks | Yes (by domain) |
| Phase 2: Repository layer | 1-2 weeks | Yes (by domain) |
| Phase 3: Service layer (131 functions) | 5-6 weeks | Yes (by domain) |
| Phase 4: API routes | 3-4 weeks | Yes (by domain) |
| Phase 5: UI conversion (356+ files) | 6-8 weeks | Yes (by module) |
| Testing & QA | 3-4 weeks | Partially |
| Data migration | 2 weeks | No |
| **Total** | **~22-29 weeks** | |

**Recommended team split for parallel work:**
- Team A: Property + Auction + Escrow + Swap (core transaction domains)
- Team B: Kemetro + Surplus + KemeKit (marketplace)
- Team C: CRM + Community + Coaching + Concierge (engagement)
- Team D: AI/Scoring/DNA + Blockchain (specialized tech)

---

## 7. MIGRATION PRIORITY ORDER

Based on dependencies and business value:

1. **User + Auth + RBAC** — everything depends on this
2. **Location + Lookup tables** — referenced by all property-related entities
3. **Property Core** — central business entity
4. **Subscriptions & Billing** — revenue-critical
5. **Escrow & Deals** — transaction backbone
6. **Auctions** — high-value feature
7. **CRM** — sales-critical
8. **Fractional Ownership** — complex but high-value
9. **Community** — engagement
10. **Marketplace (Kemetro)** — separate product line
11. **All remaining domains** — based on business priority

---

## APPENDIX A: COMPLETE ENTITY LIST (184)

<details>
<summary>Click to expand full entity list</summary>

### Property Domain
Property, PropertyAuction, PropertyDistance, PropertyMatch, PropertySwipe, PropertyToken, PropertyValuation, AnalyzedPropertyImage

### Auction Domain
AuctionBid, AuctionEvent, AuctionRegistration, AuctionSettings, AuctionWatchlist

### Fractional Ownership
FracProperty, FracToken, FracTransaction, FracKYC, FracWatchlist, FracPropertyUpdate, FracYieldDistribution, FracSettings

### Swap Domain
SwapIntent, SwapMatch, SwapGapOffer, SwapNegotiationMessage, SwapSettings

### Escrow Domain
EscrowDeal, EscrowAccount, EscrowTransaction, EscrowMilestone, EscrowDispute, EscrowDocument

### Construction & Finishing
BuildProject, FinishProject, FinishBOQ, FinishPhase, FinishMaterialOrder, FinishProgressUpdate, FinishSnaggingItem, BOQItem, FinishingCostIndex, FinishingSimulation, FOInspectionReport, ExpansionMilestone

### CRM
CRMContact, CRMAccount, CRMAccountContact, CRMOpportunity, CRMOpportunityHistory, CRMPipeline, CRMPipelineStage, CRMTask, CRMNote, CRMCall, CRMMessage, CRMConversation, CRMActivityLog, CRMContactChannel, CRMContactConsent, CRMTemplate, CRMAutomationWorkflow, CRMAutomationRun, CRMAIAction, CRMAIAgent

### Community
Community, CommunityMember, CommunityPost, CommunityComment, CommunityAlert, CommunityEvent, CommunityRecommendation

### Advisory
AdvisorProfile, AdvisorMatch, AdvisorReport

### Coaching
CoachProfile, CoachJourney, CoachContent, CoachMessage, CoachAchievement, CoachNudge

### Concierge
ConciergeJourney, ConciergeJourneyTemplate, ConciergeTask, ConciergeTaskTemplate

### Marketplace
MarketplaceItem, GroupBuySession, FlashDeal, FlashOrder, ShopTheLookCart, ShopTheLookSettings

### Surplus
SurplusItem, SurplusSavedItem, SurplusTransaction, SurplusShipmentRequest, SurplusSettings

### Market Intelligence
MarketIntelligenceReport, MarketSignal, MarketProfile, MarketPriceIndex, DemandSignal, CrossMarketSearch

### Scoring & Lifestyle
KemedarScore, LifeScoreDataPoint, LifeScoreReview, LifeScoreComparison, NeighborhoodLifeScore, ScoreBadge, ScoreEvent, ScoreShareRequest

### User DNA
UserDNA, DNASignal, DNAInsight

### Matching
MatchProfile, MatchQueue, MatchInsight

### Negotiation
NegotiationSession, NegotiationOffer, NegotiationMessage, NegotiationAnalytics

### Live Events & Tours
LiveEvent, LiveEventRegistration, LiveEventReservation, LiveEventMessage, LiveEventPoll, LiveEventHighlight, LiveTourSession, LiveTourRegistration, VirtualTour, TourHotspot, TourChatMessage

### KemeKit & Snap
KemeKitItem, KemeKitTemplate, KemeKitCalculation, KemeKitInstallationRequest, KemeKitSave, KemeKitSettings, SnapSession, SnapSettings, SnapMaterialCartItem

### Subscriptions & Billing
Subscription, SubscriptionPlan, SubscriptionActivity, SubscriptionInvoice, Invoice, PaidService, UserSubscription

### User & Auth
User, SystemRole, RolePermission, BlockchainWallet

### Permissions
PermissionGroup, PermissionResource, PermissionAction, PermissionAuditLog

### System Config
SystemModule, ModuleConfig, FeatureRegistry

### QR Codes
QRCode, QRScan, QRSettings

### Localization
Translation, TranslationLocation

### Other
CompoundDeal, FranchiseCommission, PromoCode, ThinkDarAPIRequest, InvestmentMetric, ValuationPortfolio, VerificationDocument, VerificationRecord, RelocationProfile, PersonalizationRule, PersonalizedFeed, UsageEvent, DistanceField, ProjectDistance, DeveloperEcoScore, PricePrediction, PredictSubscription, PredictionHistoricalTrack, ImageHotspot, HotspotSponsorshipLog, PropertyToken, ServiceOrder, ServiceOrderActivity

</details>

---

## APPENDIX B: COMPLETE BACKEND FUNCTIONS LIST (131)

<details>
<summary>Click to expand full function list with target service mapping</summary>

| # | Function | Target Service | Complexity |
|---|----------|---------------|------------|
| 1 | addKemeKitToCart | kemekit.service | LOW |
| 2 | addScoreEvent | scoring.service | LOW |
| 3 | addToShopTheLookCart | marketplace.service | LOW |
| 4 | adminSetValuation | property.service | MEDIUM |
| 5 | advanceVerificationLevel | verification.service | MEDIUM |
| 6 | agreeToTerms | user.service | LOW |
| 7 | aiGenerateContent | ai.service | HIGH |
| 8 | analyzeDocumentWithAI | ai.service | HIGH |
| 9 | analyzeProgressPhoto | construction.service | HIGH |
| 10 | appendVerificationRecord | verification.service | LOW |
| 11 | approveAuction | auction.service | MEDIUM |
| 12 | approveOffering | frac.service | MEDIUM |
| 13 | autoExpireSurplusReservations | surplus.service | MEDIUM |
| 14 | batchProcessPropertyImages | property.service | HIGH |
| 15 | calculateKemeKitBoQ | kemekit.service | HIGH |
| 16 | calculateKemedarScore | scoring.service | HIGH |
| 17 | calculateLifeScore | scoring.service | HIGH |
| 18 | calculateValuation | property.service | HIGH |
| 19 | cancelSurplusReservation | surplus.service | LOW |
| 20 | confirmFlashDelivery | marketplace.service | MEDIUM |
| 21 | convertSnapToTask | kemekit.service | MEDIUM |
| 22 | createAuction | auction.service | MEDIUM |
| 23 | createCommunityPost | community.service | LOW |
| 24 | createSurplusShipmentRequest | surplus.service | MEDIUM |
| 25 | detectGroupBuyOpportunities | marketplace.service | HIGH |
| 26 | detectKemeworkOpportunity | kemekit.service | HIGH |
| 27 | dismissJourney | coaching.service | LOW |
| 28 | distributeYield | frac.service | CRITICAL |
| 29 | downloadQRCode | qr.service | LOW |
| 30 | draftOfferMessage | negotiation.service | MEDIUM |
| 31 | endAuction | auction.service | HIGH |
| 32 | escrowMilestoneProgression | escrow.service | CRITICAL |
| 33 | evaluateDispute | escrow.service | HIGH |
| 34 | evaluateMarketReadiness | market-intelligence.service | HIGH |
| 35 | exportTranslations | admin.service | LOW |
| 36 | expressInterest | blockchain.service | MEDIUM |
| 37 | forfeitWinner | auction.service | HIGH |
| 38 | generateAdvisorReport | advisor.service | HIGH |
| 39 | generateBOQ | construction.service | HIGH |
| 40 | generateBuildBOQ | construction.service | HIGH |
| 41 | generateBuyerStrategy | advisor.service | HIGH |
| 42 | generateCaptureGuide | kemekit.service | MEDIUM |
| 43 | generateCoachNudge | coaching.service | MEDIUM |
| 44 | generateCoachResponse | coaching.service | MEDIUM |
| 45 | generateCommunityDigest | community.service | MEDIUM |
| 46 | generateDealStructure | ai.service | HIGH |
| 47 | generateEventDescription | live-event.service | MEDIUM |
| 48 | generateEventSummary | live-event.service | MEDIUM |
| 49 | generateExpansionRoadmap | ai.service | HIGH |
| 50 | generateFinishingEstimate | construction.service | HIGH |
| 51 | generateFinishingEstimatePDF | construction.service | HIGH |
| 52 | generateGroupBuyOffer | marketplace.service | HIGH |
| 53 | generateLifeScoreNarrative | scoring.service | MEDIUM |
| 54 | generateMatchInsights | advisor.service | HIGH |
| 55 | generateMatchQueue | advisor.service | HIGH |
| 56 | generatePersonalizedStep | coaching.service | MEDIUM |
| 57 | generatePricePrediction | ai.service | HIGH |
| 58 | generateQRCode | qr.service | LOW |
| 59 | generateSellerStrategy | advisor.service | HIGH |
| 60 | generateSurplusListing | surplus.service | MEDIUM |
| 61 | generateSwapMatches | swap.service | HIGH |
| 62 | generateTourSummary | live-event.service | MEDIUM |
| 63 | getAIPriceSuggestion | property.service | HIGH |
| 64 | getMyDNA | dna.service | HIGH |
| 65 | getMyKemedarScore | scoring.service | LOW |
| 66 | getQRAnalytics | qr.service | LOW |
| 67 | getSharedScore | scoring.service | LOW |
| 68 | getTranslations | admin.service | LOW |
| 69 | getUserQRCodes | qr.service | LOW |
| 70 | handleQRScan | qr.service | MEDIUM |
| 71 | importEgyptLocations | admin.service | LOW |
| 72 | importTranslations | admin.service | LOW |
| 73 | issueCertificate | verification.service | MEDIUM |
| 74 | joinCommunity | community.service | LOW |
| 75 | joinCompoundDeal | escrow.service | MEDIUM |
| 76 | matchFlashDeals | marketplace.service | HIGH |
| 77 | mergeGuestCart | marketplace.service | MEDIUM |
| 78 | mintPropertyToken | blockchain.service | CRITICAL |
| 79 | moderateCommunityPost | community.service | MEDIUM |
| 80 | moderateEventMessage | live-event.service | MEDIUM |
| 81 | notifyFlashBuyers | notification.service | MEDIUM |
| 82 | notifyTurnkeyLead | notification.service | MEDIUM |
| 83 | openNegotiationRoom | negotiation.service | MEDIUM |
| 84 | passOnMatch | swap.service | LOW |
| 85 | payCreatorCommission | frac.service | CRITICAL |
| 86 | paySellerDeposit | escrow.service | CRITICAL |
| 87 | placeBid | auction.service | HIGH |
| 88 | placeFlashOrder | marketplace.service | HIGH |
| 89 | processAIPropertySearch | ai.service | HIGH |
| 90 | processConciergeNotifications | concierge.service | MEDIUM |
| 91 | processImageForHotspots | ai.service | HIGH |
| 92 | processSignal | market-intelligence.service | HIGH |
| 93 | processSnapAndFix | kemekit.service | HIGH |
| 94 | processWinnerPayment | auction.service | CRITICAL |
| 95 | publishSurplusItem | surplus.service | LOW |
| 96 | publishSwapIntent | swap.service | MEDIUM |
| 97 | purchaseTokens | frac.service | CRITICAL |
| 98 | querySurplusForProfessional | surplus.service | MEDIUM |
| 99 | recalculateAllDNA | dna.service | HIGH |
| 100 | recalculateDNA | dna.service | HIGH |
| 101 | recordHotspotClick | qr.service | LOW |
| 102 | recordSwipe | swap.service | LOW |
| 103 | redirectToKemetroRFQ | marketplace.service | LOW |
| 104 | redirectToKemeworkTask | kemekit.service | LOW |
| 105 | refundAllLosers | auction.service | CRITICAL |
| 106 | regenerateMatchQueues | advisor.service | HIGH |
| 107 | regenerateQRCode | qr.service | LOW |
| 108 | registerBidder | auction.service | MEDIUM |
| 109 | requestInstallation | kemekit.service | MEDIUM |
| 110 | reserveSurplusItem | surplus.service | MEDIUM |
| 111 | scoreRelocationMatch | scoring.service | HIGH |
| 112 | searchKemetroForMaterial | marketplace.service | MEDIUM |
| 113 | searchKemetroProducts | marketplace.service | MEDIUM |
| 114 | seedBuyItFinishedFeature | admin.service | LOW |
| 115 | seedCoachJourneys | admin.service | LOW |
| 116 | seedRBACData | admin.service | LOW |
| 117 | sendShopTheLookNotifications | notification.service | MEDIUM |
| 118 | setAutoBid | auction.service | HIGH |
| 119 | setMoveInDate | concierge.service | LOW |
| 120 | settleByQrScan | escrow.service | HIGH |
| 121 | submitCounterOffer | negotiation.service | MEDIUM |
| 122 | submitFracOffering | frac.service | HIGH |
| 123 | suggestEventQuestions | live-event.service | MEDIUM |
| 124 | surplusPostRenovationNudge | surplus.service | MEDIUM |
| 125 | syncNEARBalance | blockchain.service | HIGH |
| 126 | toggleOptionalItem | kemekit.service | LOW |
| 127 | tokenizeOnNEAR | blockchain.service | CRITICAL |
| 128 | transferOwnership | swap.service | CRITICAL |
| 129 | triggerMoveInConcierge | concierge.service | MEDIUM |
| 130 | updateTaskStatus | kemekit.service | LOW |
| 131 | verifyChainIntegrity | blockchain.service | HIGH |

</details>

---

*END OF MIGRATION PLAN*
