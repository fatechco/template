import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { tokenId, issuedByAdminId } = await req.json();

  if (!tokenId) {
    return Response.json({ error: 'tokenId is required' }, { status: 400 });
  }

  // Get token
  const tokens = await base44.asServiceRole.entities.PropertyToken.filter({ id: tokenId });
  const token = tokens?.[0];
  if (!token) {
    return Response.json({ error: 'PropertyToken not found' }, { status: 404 });
  }

  // Validate prerequisites
  if (token.verificationLevel < 5) {
    return Response.json(
      { error: `Certificate requires Level 5. Current level: ${token.verificationLevel}` },
      { status: 400 }
    );
  }
  if (token.verificationStatus !== 'verified') {
    return Response.json(
      { error: `Certificate requires status "verified". Current status: ${token.verificationStatus}` },
      { status: 400 }
    );
  }

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const certificateQrCode = `https://kemedar.com/verify/${tokenId}`;

  // Issue certificate
  await base44.asServiceRole.entities.PropertyToken.update(tokenId, {
    certificateIssued: true,
    certificateIssuedAt: now.toISOString(),
    certificateExpiresAt: expiresAt.toISOString(),
    certificateQrCode,
  });

  // Append verification record
  await base44.asServiceRole.functions.invoke('appendVerificationRecord', {
    tokenId,
    recordType: 'certificate_issued',
    actorType: 'admin',
    actorUserId: issuedByAdminId !== 'system' ? issuedByAdminId : null,
    actorLabel: issuedByAdminId === 'system' ? 'System' : 'Admin',
    title: 'Level 5 Certificate Issued',
    details: `Kemedar Verify Pro™ Level 5 certificate issued. Valid until ${expiresAt.toDateString()}.`,
    metaData: {
      certificateExpiresAt: expiresAt.toISOString(),
      issuedByAdminId,
      certificateQrCode,
    },
  });

  // Notify seller
  if (token.currentOwnerUserId) {
    const sellers = await base44.asServiceRole.entities.User.filter({ id: token.currentOwnerUserId });
    const seller = sellers?.[0];
    if (seller?.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: seller.email,
        subject: '🏆 Your Kemedar Verify Pro™ Certificate is Ready!',
        body: `Your property has been awarded the Kemedar Verify Pro™ Level 5 Certificate.\n\nVerify it at: ${certificateQrCode}\n\nThis certificate is valid until ${expiresAt.toDateString()}.`,
      });
    }
  }

  // Schedule renewal reminder — 30 days before expiry via a note record
  const reminderDate = new Date(expiresAt);
  reminderDate.setDate(reminderDate.getDate() - 30);
  await base44.asServiceRole.functions.invoke('appendVerificationRecord', {
    tokenId,
    recordType: 'custom_admin_note',
    actorType: 'system',
    actorLabel: 'System',
    title: `Certificate renewal reminder scheduled for ${reminderDate.toDateString()}`,
    details: 'Renewal reminder will be triggered 30 days before certificate expiry.',
    metaData: { reminderDate: reminderDate.toISOString(), certificateExpiresAt: expiresAt.toISOString() },
  });

  return Response.json({
    success: true,
    tokenId,
    certificateIssuedAt: now.toISOString(),
    certificateExpiresAt: expiresAt.toISOString(),
    certificateQrCode,
  });
});