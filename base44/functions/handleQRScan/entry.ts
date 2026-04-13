import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function parseUserAgent(ua) {
  const isMobile = /Mobile|Android|iPhone|iPod/.test(ua);
  const isTablet = /iPad|Tablet/.test(ua);
  let deviceType = 'desktop';
  if (isMobile) deviceType = 'mobile';
  else if (isTablet) deviceType = 'tablet';

  let os = null;
  if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  let browser = null;
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/Edg/.test(ua)) browser = 'Edge';
  else if (/MSIE|Trident/.test(ua)) browser = 'IE';

  return { deviceType, os, browser, isMobile };
}

async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { qrCodeUID } = body;

    if (!qrCodeUID) {
      return Response.json({ error: 'qrCodeUID is required' }, { status: 400 });
    }

    // GET QRCode
    const codes = await base44.asServiceRole.entities.QRCode.filter({ qrCodeUID, status: 'active' });
    const qrCode = codes[0];

    if (!qrCode) {
      return Response.json({
        error: 'not_found',
        redirectUrl: '/qr/not-found',
      }, { status: 404 });
    }

    // Parse headers
    const userAgent = req.headers.get('user-agent') || '';
    const referrerUrl = req.headers.get('referer') || null;
    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                  req.headers.get('x-real-ip') || 'unknown';

    const { deviceType, os, browser, isMobile } = parseUserAgent(userAgent);
    const hashedIp = await hashString(rawIp);

    // Attempt geo lookup via free IP API
    let country = null;
    let city = null;
    try {
      if (rawIp !== 'unknown' && rawIp !== '127.0.0.1') {
        const geoRes = await fetch(`https://ip-api.com/json/${rawIp}?fields=country,city`);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          country = geo.country || null;
          city = geo.city || null;
        }
      }
    } catch (_) { /* geo lookup optional */ }

    // Mobile redirect: prepend /m/ to path if mobile user-agent
    let redirectTo = qrCode.targetUrl;
    if (isMobile && qrCode.targetUrl) {
      try {
        const url = new URL(qrCode.targetUrl);
        const mobilePath = '/m' + url.pathname;
        redirectTo = url.origin + mobilePath;
      } catch (_) { /* keep original */ }
    }

    // CREATE QRScan record
    await base44.asServiceRole.entities.QRScan.create({
      qrCodeId: qrCode.id,
      qrCodeUID: qrCode.qrCodeUID,
      ownerUserId: qrCode.ownerUserId,
      targetType: qrCode.targetType,
      targetId: qrCode.targetId,
      scannedAt: new Date().toISOString(),
      ipAddress: hashedIp,
      country,
      city,
      deviceType,
      operatingSystem: os,
      browser,
      referrerUrl,
      redirectedTo: redirectTo,
      redirectSuccess: true,
    });

    // UPDATE totalScans + lastScannedAt
    await base44.asServiceRole.entities.QRCode.update(qrCode.id, {
      totalScans: (qrCode.totalScans || 0) + 1,
      lastScannedAt: new Date().toISOString(),
    });

    // UPDATE uniqueScans — count distinct IPs
    const allScans = await base44.asServiceRole.entities.QRScan.filter({ qrCodeId: qrCode.id });
    const uniqueIps = new Set(allScans.map(s => s.ipAddress));
    await base44.asServiceRole.entities.QRCode.update(qrCode.id, {
      uniqueScans: uniqueIps.size,
    });

    return Response.json({ success: true, redirectUrl: redirectTo });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});