import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { qrCodeId, format = 'png', pageSize = 'A4' } = body;

    if (!qrCodeId) return Response.json({ error: 'qrCodeId is required' }, { status: 400 });

    // GET QRCode and verify ownership
    const codes = await base44.asServiceRole.entities.QRCode.filter({ id: qrCodeId });
    const qrCode = codes[0];
    if (!qrCode) return Response.json({ error: 'QR code not found' }, { status: 404 });
    if (qrCode.ownerUserId !== user.id) return Response.json({ error: 'Forbidden' }, { status: 403 });

    // CHECK subscription still active
    const settingsList = await base44.asServiceRole.entities.QRSettings.list();
    const settings = settingsList[0];
    if (settings?.requirePaidPlan) {
      const subs = await base44.asServiceRole.entities.UserSubscription.filter({
        userId: user.id,
        status: 'active',
      });
      if (!subs || subs.length === 0) {
        return Response.json({
          error: 'subscription_required',
          message: 'An active paid subscription is required to download QR codes.',
          upgradeUrl: '/buy',
        }, { status: 402 });
      }
    }

    const safeTitle = (qrCode.targetTitle || 'qr')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 40);
    const uid = qrCode.qrCodeUID;

    if (format === 'png') {
      return Response.json({
        success: true,
        downloadUrl: qrCode.qrImagePngUrl,
        filename: `kemedar-qr-${safeTitle}-${uid}.png`,
        format: 'png',
      });
    }

    if (format === 'svg') {
      return Response.json({
        success: true,
        downloadUrl: qrCode.qrImageSvgUrl,
        filename: `kemedar-qr-${safeTitle}-${uid}.svg`,
        format: 'svg',
      });
    }

    if (format === 'pdf') {
      // Build a print-ready HTML that the client can print to PDF
      // or generate an SVG-based PDF payload description
      const pageDimensions = {
        A4: { width: '210mm', height: '297mm', qrSize: '150mm' },
        business_card: { width: '85mm', height: '55mm', qrSize: '40mm' },
        flyer: { width: '148mm', height: '210mm', qrSize: '100mm' },
      };
      const dims = pageDimensions[pageSize] || pageDimensions['A4'];

      const pdfHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: ${dims.width} ${dims.height}; margin: 10mm; }
  body { margin: 0; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: calc(${dims.height} - 20mm); }
  .qr-title { font-size: ${pageSize === 'business_card' ? '8pt' : '14pt'}; font-weight: bold; color: #1a1a1a; margin-bottom: 8px; text-align: center; }
  .qr-image { width: ${dims.qrSize}; height: ${dims.qrSize}; }
  .qr-url { font-size: ${pageSize === 'business_card' ? '5pt' : '9pt'}; color: #666; margin-top: 8px; word-break: break-all; text-align: center; }
  .qr-frame-text { font-size: ${pageSize === 'business_card' ? '6pt' : '11pt'}; color: #FF6B00; margin-top: 6px; font-weight: bold; }
  .footer { font-size: 7pt; color: #aaa; margin-top: ${pageSize === 'business_card' ? '4px' : '16px'}; }
</style>
</head>
<body>
  <div class="qr-title">${qrCode.targetTitle || ''}</div>
  <img class="qr-image" src="${qrCode.qrImagePngUrl}" alt="QR Code" />
  <div class="qr-frame-text">${qrCode.frameText || 'Scan to view on Kemedar'}</div>
  <div class="qr-url">${qrCode.targetUrl || ''}</div>
  <div class="footer">Powered by Kemedar®</div>
</body>
</html>`;

      // Upload HTML as file for client-side PDF printing
      const htmlBlob = new Blob([pdfHtml], { type: 'text/html' });
      const upload = await base44.asServiceRole.integrations.Core.UploadFile({ file: htmlBlob });

      return Response.json({
        success: true,
        downloadUrl: qrCode.qrImagePngUrl,
        pdfHtmlUrl: upload.file_url,
        pdfHtml,
        filename: `kemedar-qr-${safeTitle}-${uid}.pdf`,
        format: 'pdf',
        pageSize,
        note: 'Use pdfHtml to render and print to PDF client-side.',
      });
    }

    return Response.json({ error: 'Invalid format. Use png, svg, or pdf.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});