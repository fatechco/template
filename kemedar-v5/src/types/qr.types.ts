export type QRCodeType = "property" | "project" | "profile" | "store" | "event" | "custom";

export interface QRCode {
  id: string;
  userId: string;
  codeType: QRCodeType;
  targetId: string | null;
  targetUrl: string | null;
  frameText: string | null;
  frameTextAr: string | null;
  qrImageUrl: string | null;
  shortCode: string | null;
  scanCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface QRScan {
  id: string;
  qrCodeId: string;
  scannedByUserId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  location: Record<string, any> | null;
  scannedAt: string;
}

export interface QRAnalytics {
  totalScans: number;
  uniqueScanners: number;
  last7Days: number;
  recentScans: QRScan[];
}
