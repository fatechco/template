export interface MarketplaceItem {
  id: string;
  sellerId: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  category: string | null;
  subcategory: string | null;
  priceEGP: number | null;
  currency: string;
  imageUrls: string[];
  condition: string | null;
  quantity: number;
  unit: string | null;
  brand: string | null;
  specifications: Record<string, any> | null;
  location: string | null;
  cityId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  tags: string[];
  createdAt: string;
}

export interface FlashDeal {
  id: string;
  sellerId: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  originalPriceEGP: number | null;
  flashPriceEGP: number;
  discountPercent: number | null;
  quantity: number;
  soldCount: number;
  imageUrl: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface FlashOrder {
  id: string;
  dealId: string;
  buyerUserId: string;
  quantity: number;
  totalPriceEGP: number;
  status: string;
  rating: number | null;
  review: string | null;
  createdAt: string;
}

export interface GroupBuySession {
  id: string;
  title: string;
  category: string | null;
  targetQty: number;
  currentQty: number;
  pricePerUnit: number | null;
  discountPercent: number | null;
  status: string;
  expiresAt: string | null;
}

export interface SurplusItem {
  id: string;
  sellerId: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  category: string | null;
  condition: string | null;
  priceEGP: number | null;
  originalPriceEGP: number | null;
  quantity: number;
  imageUrls: string[];
  location: string | null;
  isActive: boolean;
  reservedByUserId: string | null;
  viewCount: number;
  createdAt: string;
}
