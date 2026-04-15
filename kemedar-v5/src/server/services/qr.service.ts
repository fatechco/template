import { qrRepository } from "@/server/repositories/qr.repository";

export const qrService = {
  async generateQRCode(userId: string, data: {
    codeType: string;
    targetId?: string;
    targetUrl?: string;
    frameText?: string;
    frameTextAr?: string;
  }) {
    const shortCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.targetUrl || `${process.env.NEXT_PUBLIC_APP_URL}/qr/${shortCode}`)}`;

    return qrRepository.create({
      user: { connect: { id: userId } },
      codeType: data.codeType as any,
      targetId: data.targetId,
      targetUrl: data.targetUrl,
      frameText: data.frameText,
      frameTextAr: data.frameTextAr,
      qrImageUrl,
      shortCode,
    } as any);
  },

  async handleQRScan(shortCode: string, scanData?: { userId?: string; ipAddress?: string; userAgent?: string; location?: any }) {
    const qrCode = await qrRepository.findByShortCode(shortCode);
    if (!qrCode) throw new Error("QR code not found");

    await qrRepository.createScan({
      qrCode: { connect: { id: qrCode.id } },
      scannedByUserId: scanData?.userId,
      ipAddress: scanData?.ipAddress,
      userAgent: scanData?.userAgent,
      location: scanData?.location,
    } as any);

    await qrRepository.update(qrCode.id, { scanCount: { increment: 1 } });

    return { targetUrl: qrCode.targetUrl, targetId: qrCode.targetId, codeType: qrCode.codeType };
  },

  async getAnalytics(qrCodeId: string) {
    const qrCode = await qrRepository.findById(qrCodeId);
    if (!qrCode) throw new Error("QR code not found");

    const scans = await qrRepository.findScans(qrCodeId, 100);

    const totalScans = qrCode.scanCount;
    const uniqueScanners = new Set(scans.filter((s) => s.scannedByUserId).map((s) => s.scannedByUserId)).size;
    const last7Days = scans.filter((s) => s.scannedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

    return { totalScans, uniqueScanners, last7Days, recentScans: scans.slice(0, 10) };
  },

  async getUserQRCodes(userId: string) {
    return qrRepository.findByUserId(userId);
  },

  async regenerateQRCode(qrCodeId: string) {
    const qrCode = await qrRepository.findById(qrCodeId);
    if (!qrCode) throw new Error("QR code not found");

    const newShortCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode.targetUrl || `${process.env.NEXT_PUBLIC_APP_URL}/qr/${newShortCode}`)}`;

    return qrRepository.update(qrCodeId, {
      shortCode: newShortCode,
      qrImageUrl: newUrl,
    });
  },
};
