export type PropertyImportStatus = "imported" | "moved_to_pending" | "activated" | "rejected" | "duplicate";
export type OwnerContactStatus = "not_contacted" | "contacted" | "no_answer" | "interested" | "not_interested" | "activated";

export interface Property {
  id: string;
  userId: string;
  user?: Pick<import("./user.types").User, "id" | "name" | "nameAr" | "phone" | "avatarUrl" | "role">;
  propertyCode: string | null;

  categoryId: string;
  category?: PropertyCategory;
  purposeId: string;
  purpose?: PropertyPurpose;
  statusId: string | null;
  status?: PropertyStatus;
  furnishedId: string | null;
  furnished?: PropertyFurnished;

  countryId: string | null;
  provinceId: string | null;
  cityId: string | null;
  city?: Location;
  districtId: string | null;
  areaId: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  projectId: string | null;

  title: string;
  titleAr: string | null;
  description: string | null;
  descriptionAr: string | null;

  priceAmount: number | null;
  currencyId: string | null;
  isContactForPrice: boolean;
  isNegotiable: boolean;

  directPhone: string | null;
  featuredImage: string | null;
  avatarImage: string | null;
  imageGallery: string[];
  brochureFile: string | null;
  floorPlanFile: string | null;
  vrVideoLink: string | null;
  youtubeLinks: string[];
  amenityIds: string[];
  distanceIds: string[];
  frontageIds: string[];
  sceneViewIds: string[];
  publisherTypeId: string | null;
  tags: string[];

  isFeatured: boolean;
  isVerified: boolean;
  isActive: boolean;
  viewCount: number;
  verificationLevel: number;

  interestedInVeri: boolean;
  interestedInCampaign: boolean;

  isImported: boolean;
  importSource: string | null;
  importJobId: string | null;
  importedAt: string | null;
  importedBatchId: string | null;
  importStatus: PropertyImportStatus;

  ownerContactStatus: OwnerContactStatus;
  lastContactedAt: string | null;
  lastContactedBy: string | null;
  contactNotes: string | null;
  movedToPendingAt: string | null;
  movedToPendingBy: string | null;
  movedToPendingReason: string | null;

  isFracOffering: boolean;
  fracPropertyId: string | null;
  isOpenToSwap: boolean;
  swapIntentId: string | null;
  isAuction: boolean;
  auctionId: string | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Relations (optional, populated by includes)
  distances?: PropertyDistance[];
  matches?: PropertyMatch[];
  valuations?: PropertyValuation[];
  auction?: import("./auction.types").PropertyAuction;
  fracProperty?: import("./frac.types").FracProperty;
  swapIntent?: import("./swap.types").SwapIntent;
  analyzedImages?: AnalyzedPropertyImage[];
}

export interface PropertyCategory {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface PropertyPurpose {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
}

export interface PropertyStatus {
  id: string;
  name: string;
  nameAr: string | null;
}

export interface PropertyFurnished {
  id: string;
  name: string;
  nameAr: string | null;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  nameAr: string | null;
  icon: string | null;
  category: string | null;
}

export interface Location {
  id: string;
  name: string;
  nameAr: string | null;
}

export interface Country extends Location { code: string; }
export interface Province extends Location { countryId: string; }
export interface City extends Location { provinceId: string; }
export interface District extends Location { cityId: string; }
export interface Area extends Location { districtId: string; }

export interface Currency {
  id: string;
  code: string;
  name: string;
  nameAr: string | null;
  symbol: string;
  rate: number;
}

export interface PropertyDistance {
  id: string;
  propertyId: string;
  poiName: string;
  poiNameAr: string | null;
  poiType: string | null;
  distanceKm: number | null;
  distanceText: string | null;
  durationMins: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PropertyMatch {
  id: string;
  propertyId: string;
  userId: string;
  matchScore: number | null;
  matchReasons: Record<string, any> | null;
  isNotified: boolean;
  isViewed: boolean;
  isSaved: boolean;
  isDismissed: boolean;
  createdAt: string;
}

export interface PropertySwipe {
  id: string;
  propertyId: string;
  userId: string;
  direction: string;
  sessionId: string | null;
  createdAt: string;
}

export interface PropertyValuation {
  id: string;
  propertyId: string;
  valuationAmountEGP: number | null;
  valuationAmountUSD: number | null;
  valuationMethod: string | null;
  aiConfidence: number | null;
  marketComps: Record<string, any> | null;
  multipliers: Record<string, any> | null;
  investmentGrade: string | null;
  roiScore: number | null;
  setByAdminId: string | null;
  setByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyToken {
  id: string;
  propertyId: string;
  tokenAddress: string | null;
  tokenSymbol: string | null;
  networkType: "mainnet" | "testnet";
  transactionHash: string | null;
  mintedAt: string | null;
}

export interface AnalyzedPropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  roomType: string | null;
  style: string | null;
  condition: string | null;
  qualityScore: number | null;
  features: Record<string, any> | null;
  aiAnalysis: Record<string, any> | null;
  analyzedAt: string | null;
}

export interface PropertyFilters {
  categoryId?: string;
  purposeId?: string;
  cityId?: string;
  districtId?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  isImported?: boolean;
  importStatus?: string;
  userId?: string;
  search?: string;
  tags?: string[];
  isAuction?: boolean;
  isFracOffering?: boolean;
  isOpenToSwap?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
