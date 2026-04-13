import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      targetType = null,
      status = null,
      page = 1,
      limit = 20,
    } = body;

    // Build filter
    const filter = { ownerUserId: user.id };
    if (targetType) filter.targetType = targetType;
    if (status) filter.status = status;

    // Fetch all matching QR codes
    const allQRCodes = await base44.asServiceRole.entities.QRCode.filter(filter, '-created_date');

    // Paginate
    const total = allQRCodes.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = allQRCodes.slice(start, start + limit);

    // Enrich each QR code with recent scan stats
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const enriched = await Promise.all(paginated.map(async (qr) => {
      try {
        const scans = await base44.asServiceRole.entities.QRScan.filter({ qrCodeId: qr.id });

        const todayScans = scans.filter(s => new Date(s.scannedAt) >= todayStart).length;
        const last7DaysScans = scans.filter(s => new Date(s.scannedAt) >= sevenDaysAgo).length;

        return {
          ...qr,
          todayScans,
          last7DaysScans,
        };
      } catch (_) {
        return { ...qr, todayScans: 0, last7DaysScans: 0 };
      }
    }));

    // Summary totals
    const totalActiveQRs = allQRCodes.filter(q => q.status === 'active').length;
    const totalScansAllTime = allQRCodes.reduce((sum, q) => sum + (q.totalScans || 0), 0);

    return Response.json({
      success: true,
      qrCodes: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      summary: {
        totalQRCodes: total,
        totalActiveQRs,
        totalScansAllTime,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});