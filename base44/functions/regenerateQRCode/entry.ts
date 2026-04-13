import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import QRCode from 'npm:qrcode@1.5.3';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      qrCodeId,
      foregroundColor, backgroundColor,
      includeLogo, logoType, customLogoUrl,
      includeFrame, frameStyle,
      frameText, frameTextAr,
      qrStyle, errorCorrectionLevel,
    } = body;

    if (!qrCodeId) {
      return Response.json({ error: 'qrCodeId is required' }, { status: 400 });
    }

    // GET QRCode and verify ownership
    const codes = await base44.asServiceRole.entities.QRCode.filter({ id: qrCodeId });
    const qrCode = codes[0];
    if (!qrCode) return Response.json({ error: 'QR code not found' }, { status: 404 });
    if (qrCode.ownerUserId !== user.id) return Response.json({ error: 'Forbidden' }, { status: 403 });

    // GET settings for resolution
    const settingsList = await base44.asServiceRole.entities.QRSettings.list();
    const settings = settingsList[0] || {};

    const fg = foregroundColor || qrCode.foregroundColor || '#FF6B00';
    const bg = backgroundColor || qrCode.backgroundColor || '#FFFFFF';
    const ecl = errorCorrectionLevel || qrCode.errorCorrectionLevel || 'H';
    const trackingUrl = qrCode.trackingUrl;

    // Generate new SVG
    const svgContent = await QRCode.toString(trackingUrl, {
      type: 'svg',
      color: { dark: fg, light: bg },
      errorCorrectionLevel: ecl,
      width: settings.svgSize || 500,
    });
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const svgUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: svgBlob });

    // Generate new PNG
    const pngDataUrl = await QRCode.toDataURL(trackingUrl, {
      type: 'image/png',
      color: { dark: fg, light: bg },
      errorCorrectionLevel: ecl,
      width: settings.pngResolution || 1000,
    });
    const base64Data = pngDataUrl.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const pngBlob = new Blob([bytes], { type: 'image/png' });
    const pngUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: pngBlob });

    // Build update payload — only update provided fields
    const updateData = {
      qrImagePngUrl: pngUpload.file_url,
      qrImageSvgUrl: svgUpload.file_url,
      generatedAt: new Date().toISOString(),
    };
    if (foregroundColor !== undefined) updateData.foregroundColor = foregroundColor;
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
    if (includeLogo !== undefined) updateData.includeLogo = includeLogo;
    if (logoType !== undefined) updateData.logoType = logoType;
    if (customLogoUrl !== undefined) updateData.customLogoUrl = customLogoUrl;
    if (includeFrame !== undefined) updateData.includeFrame = includeFrame;
    if (frameStyle !== undefined) updateData.frameStyle = frameStyle;
    if (frameText !== undefined) updateData.frameText = frameText;
    if (frameTextAr !== undefined) updateData.frameTextAr = frameTextAr;
    if (qrStyle !== undefined) updateData.qrStyle = qrStyle;
    if (errorCorrectionLevel !== undefined) updateData.errorCorrectionLevel = errorCorrectionLevel;

    const updated = await base44.asServiceRole.entities.QRCode.update(qrCodeId, updateData);

    return Response.json({ success: true, qrCode: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});