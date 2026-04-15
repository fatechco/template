import type { UserRole } from "./common";

export interface User {
  id: string;
  email: string;
  name: string | null;
  nameAr: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  agreedToTerms: boolean;
  agreedToTermsAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  nameAr: string | null;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface UserDNA {
  id: string;
  userId: string;
  preferredPropertyTypes: string[];
  preferredLocations: string[];
  budgetMin: number | null;
  budgetMax: number | null;
  preferredCurrency: string | null;
  lifestylePriorities: Record<string, any> | null;
  investmentStyle: string | null;
  riskTolerance: string | null;
  searchBehavior: Record<string, any> | null;
  interactionHistory: Record<string, any> | null;
  calculatedAt: string | null;
  version: number;
}

export interface BlockchainWallet {
  id: string;
  userId: string;
  walletAddress: string;
  networkType: "mainnet" | "testnet";
  isPrimary: boolean;
  balance: number | null;
  lastSyncedAt: string | null;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  nameAr?: string;
  phone?: string;
  role?: string;
}

export interface LoginResponse {
  user: UserListItem;
  token: string;
}
