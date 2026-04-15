import type { PropertyImportStatus, OwnerContactStatus } from "./common";

export interface PropertyCategory {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  icon: string | null;
  sortOrder: number;
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

export interface City {
  id: string;
  name: string;
  nameAr: string | null;
  provinceId: string;
}

export interface Property {
  id: string;
  userId: string;
  propertyCode: string | null;
  categoryId: string;
  purposeId: string;
  statusId: string | null;
  furnishedId: string | null;
  countryId: string | null;
  provinceId: string | null;
  cityId: string | null;
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
  tags: string[];
  isFeatured: boolean;
  isVerified: boolean;
  isActive: boolean;
  viewCount: number;
  verificationLevel: number;
  isImported: boolean;
  importSource: string | null;
  importStatus: PropertyImportStatus;
  ownerContactStatus: OwnerContactStatus;
  isFracOffering: boolean;
  fracPropertyId: string | null;
  isOpenToSwap: boolean;
  swapIntentId: string | null;
  isAuction: boolean;
  auctionId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Relations (populated when included)
  category?: PropertyCategory;
  purpose?: PropertyPurpose;
  status?: PropertyStatus;
  city?: City;
  user?: { id: string; name: string | null; nameAr: string | null; phone: string | null; avatarUrl: string | null; role: string };
  distances?: PropertyDistance[];
  valuations?: PropertyValuation[];
  auction?: PropertyAuction | null;
  fracProperty?: FracPropertySummary | null;
  swapIntent?: SwapIntentSummary | null;
  analyzedImages?: AnalyzedPropertyImage[];
}

export interface PropertyListItem {
  id: string;
  title: string;
  titleAr: string | null;
  priceAmount: number | null;
  featuredImage: string | null;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  isAuction: boolean;
  isFracOffering: boolean;
  isOpenToSwap: boolean;
  isContactForPrice: boolean;
  viewCount: number;
  verificationLevel: number;
  createdAt: string;
  category?: PropertyCategory;
  purpose?: PropertyPurpose;
  city?: City;
  user?: { id: string; name: string | null; nameAr: string | null; avatarUrl: string | null; role: string };
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
}

export interface PropertyValuation {
  id: string;
  propertyId: string;
  valuationAmountEGP: number | null;
  valuationAmountUSD: number | null;
  valuationMethod: string | null;
  aiConfidence: number | null;
  investmentGrade: string | null;
  roiScore: number | null;
  marketComps: Record<string, any> | null;
  setByAdmin: boolean;
  createdAt: string;
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

export interface CreatePropertyRequest {
  categoryId: string;
  purposeId: string;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  priceAmount?: number;
  currencyId?: string;
  cityId?: string;
  districtId?: string;
  areaId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  featuredImage?: string;
  imageGallery?: string[];
  tags?: string[];
}

// Stubs for relation types
interface PropertyAuction { id: string; status: string; }
interface FracPropertySummary { id: string; status: string; }
interface SwapIntentSummary { id: string; status: string; }
