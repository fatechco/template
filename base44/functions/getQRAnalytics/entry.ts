import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { qrCodeId, dateFrom, dateTo } = body;

    if (!qrCodeId) {
      return Response.json({ error: 'qrCodeId is required' }, { status: 400 });
    }

    // GET QRCode and verify ownership
    const codes = await base44.asServiceRole.entities.QRCode.filter({ id: qrCodeId });
    const qrCode = codes[0];
    if (!qrCode) return Response.json({ error: 'QR code not found' }, { status: 404 });
    if (qrCode.ownerUserId !== user.id) return Response.json({ error: 'Forbidden' }, { status: 403 });

    // Default date range: last 30 days
    const now = new Date();
    const defaultFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fromDate = dateFrom ? new Date(dateFrom) : defaultFrom;
    const toDate = dateTo ? new Date(dateTo) : now;

    // Fetch all scans for this QR code
    const allScans = await base44.asServiceRole.entities.QRScan.filter({ qrCodeId });

    // Filter by date range
    const scans = allScans.filter(s => {
      const t = new Date(s.scannedAt);
      return t >= fromDate && t <= toDate;
    });

    // totalScans
    const totalScans = scans.length;

    // uniqueScans
    const uniqueIps = new Set(scans.map(s => s.ipAddress));
    const uniqueScans = uniqueIps.size;

    // scansByDay
    const dayMap = {};
    scans.forEach(s => {
      const day = s.scannedAt.slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    const scansByDay = Object.entries(dayMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // scansByDevice
    const deviceMap = {};
    scans.forEach(s => {
      const d = s.deviceType || 'unknown';
      deviceMap[d] = (deviceMap[d] || 0) + 1;
    });
    const scansByDevice = Object.entries(deviceMap).map(([device, count]) => ({ device, count }));

    // scansByOS
    const osMap = {};
    scans.forEach(s => {
      const o = s.operatingSystem || 'unknown';
      osMap[o] = (osMap[o] || 0) + 1;
    });
    const scansByOS = Object.entries(osMap).map(([os, count]) => ({ os, count }));

    // scansByCountry
    const countryMap = {};
    scans.forEach(s => {
      const c = s.country || 'unknown';
      countryMap[c] = (countryMap[c] || 0) + 1;
    });
    const scansByCountry = Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    // scansByCity
    const cityMap = {};
    scans.forEach(s => {
      const c = s.city || 'unknown';
      cityMap[c] = (cityMap[c] || 0) + 1;
    });
    const scansByCity = Object.entries(cityMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // peakDay
    const peakDay = scansByDay.reduce((max, d) => d.count > (max?.count || 0) ? d : max, null);

    // peakHour
    const hourMap = {};
    scans.forEach(s => {
      const h = new Date(s.scannedAt).getHours();
      hourMap[h] = (hourMap[h] || 0) + 1;
    });
    const peakHourEntry = Object.entries(hourMap).reduce(
      (max, [h, c]) => c > (max?.count || 0) ? { hour: parseInt(h), count: c } : max, null
    );

    return Response.json({
      success: true,
      qrCode: {
        id: qrCode.id,
        qrCodeUID: qrCode.qrCodeUID,
        targetType: qrCode.targetType,
        targetTitle: qrCode.targetTitle,
        status: qrCode.status,
      },
      dateRange: { from: fromDate.toISOString(), to: toDate.toISOString() },
      analytics: {
        totalScans,
        uniqueScans,
        scansByDay,
        scansByDevice,
        scansByOS,
        scansByCountry,
        scansByCity,
        peakDay,
        peakHour: peakHourEntry,
        conversionNote: 'Scans from this QR',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});