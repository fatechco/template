import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import QRCode from 'npm:qrcode@1.5.3';

function randomHex(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function resolveTarget(base44, targetType, targetId) {
  let targetTitle = '';
  let targetUrl = '';
  let record = null;

  if (targetType === 'property') {
    const items = await base44.asServiceRole.entities.Property.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Property not found');
    targetTitle = record.title;
    targetUrl = `https://kemedar.com/property/${record.id}`;
  } else if (targetType === 'project') {
    const items = await base44.asServiceRole.entities.Project.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Project not found');
    targetTitle = record.name || record.title || 'Project';
    targetUrl = `https://kemedar.com/project/${record.id}`;
  } else if (targetType === 'product') {
    const items = await base44.asServiceRole.entities.KemetroProduct.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Product not found');
    targetTitle = record.name || 'Product';
    targetUrl = `https://kemedar.com/kemetro/product/${record.slug || record.id}`;
  } else if (targetType === 'store') {
    const items = await base44.asServiceRole.entities.KemetroStore.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Store not found');
    targetTitle = record.storeName || 'Store';
    targetUrl = `https://kemedar.com/kemetro/store/${record.slug || record.id}`;
  } else if (targetType === 'service') {
    const items = await base44.asServiceRole.entities.KemeworkService.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Service not found');
    targetTitle = record.title || 'Service';
    targetUrl = `https://kemedar.com/kemework/service/${record.id}`;
  } else if (targetType === 'professional_profile') {
    const items = await base44.asServiceRole.entities.KemeworkProfessional.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Professional not found');
    targetTitle = record.displayName || 'Professional';
    targetUrl = `https://kemedar.com/kemework/profile/${record.id}`;
  } else if (targetType === 'agent_profile') {
    const items = await base44.asServiceRole.entities.User.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Agent not found');
    targetTitle = record.full_name || 'Agent';
    targetUrl = `https://kemedar.com/kemedar/agent/${record.username || record.id}`;
  } else if (targetType === 'agency_profile') {
    const items = await base44.asServiceRole.entities.User.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Agency not found');
    targetTitle = record.full_name || 'Agency';
    targetUrl = `https://kemedar.com/kemedar/agency/${record.username || record.id}`;
  } else if (targetType === 'developer_profile') {
    const items = await base44.asServiceRole.entities.User.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Developer not found');
    targetTitle = record.full_name || 'Developer';
    targetUrl = `https://kemedar.com/kemedar/developer/${record.username || record.id}`;
  } else if (targetType === 'franchise_profile') {
    const items = await base44.asServiceRole.entities.User.filter({ id: targetId });
    record = items[0];
    if (!record) throw new Error('Franchise owner not found');
    targetTitle = record.full_name || 'Franchise Owner';
    targetUrl = `https://kemedar.com/kemedar/franchise/${record.username || record.id}`;
  } else {
    throw new Error('Invalid targetType: ' + targetType);
  }

  return { targetTitle, targetUrl, record };
}

async function generateQRDataUrl(data, foregroundColor, backgroundColor, errorCorrectionLevel, width) {
  const svgString = await QRCode.toString(data, {
    type: 'svg',
    color: { dark: foregroundColor || '#FF6B00', light: backgroundColor || '#FFFFFF' },
    errorCorrectionLevel: errorCorrectionLevel || 'H',
    width: width || 1000,
  });
  return svgString;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      targetType, targetId,
      foregroundColor = '#FF6B00', backgroundColor = '#FFFFFF',
      includeLogo = true, logoType = 'kemedar', customLogoUrl = null,
      includeFrame = true, frameStyle = 'branded',
      frameText = 'Scan to view on Kemedar', frameTextAr = 'امسح للعرض على كيمدار',
      qrStyle = 'square', errorCorrectionLevel = 'H',
    } = body;

    if (!targetType || !targetId) {
      return Response.json({ error: 'targetType and targetId are required' }, { status: 400 });
    }

    // GET QRSettings
    const settingsList = await base44.asServiceRole.entities.QRSettings.list();
    const settings = settingsList[0];
    if (!settings || !settings.isActive) {
      return Response.json({ error: 'QR feature is currently unavailable' }, { status: 403 });
    }

    // CHECK subscription
    if (settings.requirePaidPlan) {
      const subs = await base44.asServiceRole.entities.UserSubscription.filter({
        userId: user.id,
        status: 'active',
      });
      if (!subs || subs.length === 0) {
        return Response.json({
          error: 'subscription_required',
          message: 'QR code generation requires an active paid subscription.',
          upgradeUrl: '/buy',
        }, { status: 402 });
      }
    }

    // CHECK user limit
    const userQRs = await base44.asServiceRole.entities.QRCode.filter({
      ownerUserId: user.id,
      status: 'active',
    });
    if (userQRs.length >= (settings.maxQRCodesPerUser || 50)) {
      return Response.json({
        error: `You have reached the maximum of ${settings.maxQRCodesPerUser} active QR codes on your plan.`,
      }, { status: 429 });
    }

    // CHECK per-listing limit
    const listingQRs = await base44.asServiceRole.entities.QRCode.filter({
      targetId,
      ownerUserId: user.id,
      status: 'active',
    });
    if (listingQRs.length >= (settings.maxQRCodesPerListing || 3)) {
      return Response.json({
        error: `Maximum ${settings.maxQRCodesPerListing} QR codes allowed per listing.`,
      }, { status: 429 });
    }

    // RESOLVE TARGET
    const { targetTitle, targetUrl } = await resolveTarget(base44, targetType, targetId);

    // GENERATE UID + tracking URL
    const qrCodeUID = 'KQR-' + randomHex(8);
    const trackingUrl = (settings.trackingBaseUrl || 'https://kemedar.com/qr/') + qrCodeUID;

    // GENERATE QR SVG
    const svgContent = await generateQRDataUrl(
      trackingUrl, foregroundColor, backgroundColor, errorCorrectionLevel, settings.svgSize || 500
    );

    // Upload SVG
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const svgUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: svgBlob });

    // Generate PNG data URL
    const pngDataUrl = await QRCode.toDataURL(trackingUrl, {
      type: 'image/png',
      color: { dark: foregroundColor || '#FF6B00', light: backgroundColor || '#FFFFFF' },
      errorCorrectionLevel: errorCorrectionLevel || 'H',
      width: settings.pngResolution || 1000,
    });

    // Convert base64 to blob and upload
    const base64Data = pngDataUrl.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const pngBlob = new Blob([bytes], { type: 'image/png' });
    const pngUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: pngBlob });

    // Is this the first QR for this target?
    const allTargetQRs = await base44.asServiceRole.entities.QRCode.filter({ targetId, ownerUserId: user.id });
    const isDefault = allTargetQRs.length === 0;

    // Determine ownerRole from user
    const ownerRole = user.role || 'common_user';

    // CREATE QRCode record
    const qrCode = await base44.asServiceRole.entities.QRCode.create({
      qrCodeUID,
      ownerUserId: user.id,
      ownerRole,
      targetType,
      targetId,
      targetTitle,
      targetUrl,
      trackingUrl,
      foregroundColor,
      backgroundColor,
      includeLogo,
      logoType,
      customLogoUrl,
      includeFrame,
      frameStyle,
      frameText,
      frameTextAr,
      qrStyle,
      errorCorrectionLevel,
      qrImagePngUrl: pngUpload.file_url,
      qrImageSvgUrl: svgUpload.file_url,
      generatedAt: new Date().toISOString(),
      status: 'active',
      totalScans: 0,
      uniqueScans: 0,
      isDefault,
    });

    return Response.json({ success: true, qrCode });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});