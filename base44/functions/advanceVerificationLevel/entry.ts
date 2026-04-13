import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { tokenId, newLevel, actorUserId } = await req.json();

  if (!tokenId || !newLevel) {
    return Response.json({ error: 'tokenId and newLevel are required' }, { status: 400 });
  }

  // Get current token
  const tokens = await base44.asServiceRole.entities.PropertyToken.filter({ id: tokenId });
  const token = tokens?.[0];
  if (!token) {
    return Response.json({ error: 'PropertyToken not found' }, { status: 404 });
  }

  if (newLevel <= token.verificationLevel) {
    return Response.json(
      { error: `newLevel (${newLevel}) must be greater than current level (${token.verificationLevel})` },
      { status: 400 }
    );
  }

  if (newLevel < 1 || newLevel > 5) {
    return Response.json({ error: 'newLevel must be between 1 and 5' }, { status: 400 });
  }

  // Update token
  const updates = { verificationLevel: newLevel };
  if (newLevel === 5) {
    updates.verificationStatus = 'verified';
  }
  await base44.asServiceRole.entities.PropertyToken.update(tokenId, updates);

  // Append verification record
  await base44.asServiceRole.functions.invoke('appendVerificationRecord', {
    tokenId,
    recordType: 'level_upgraded',
    actorType: 'system',
    actorUserId: actorUserId || null,
    actorLabel: actorUserId ? 'Admin' : 'System',
    title: `Verification Level upgraded to Level ${newLevel}`,
    details: `Token advanced from Level ${token.verificationLevel} to Level ${newLevel}.${newLevel === 5 ? ' Status set to verified.' : ''}`,
    metaData: { previousLevel: token.verificationLevel, newLevel },
  });

  // Notify seller
  if (token.currentOwnerUserId) {
    const sellers = await base44.asServiceRole.entities.User.filter({ id: token.currentOwnerUserId });
    const seller = sellers?.[0];
    if (seller?.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: seller.email,
        subject: `🎉 Your property reached Verification Level ${newLevel}`,
        body: `Congratulations! Your property's Kemedar Verify Pro™ level has been upgraded to Level ${newLevel}${newLevel === 5 ? ' — the highest level. Your certificate will be issued shortly.' : '.'}`,
      });
    }
  }

  return Response.json({ success: true, tokenId, newLevel });
});