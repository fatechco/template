import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { matchId, proposedGapEGP, proposedGapDirection } = await req.json();

  const matches = await base44.entities.SwapMatch.filter({ id: matchId });
  const match = matches?.[0];
  if (!match) return Response.json({ error: 'Match not found' }, { status: 404 });
  if (match.userAId !== user.id && match.userBId !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!['negotiating', 'both_interested'].includes(match.status)) {
    return Response.json({ error: 'Match is not in negotiation' }, { status: 400 });
  }

  // Fetch settings for expiry hours
  const settingsList = await base44.entities.SwapSettings.list();
  const settings = settingsList?.[0];
  const expiryHours = settings?.gapOfferExpiryHours ?? 48;

  // Expire previous pending offers from this user
  const existingOffers = await base44.entities.SwapGapOffer.filter({ matchId, offeredByUserId: user.id });
  await Promise.all(
    (existingOffers || [])
      .filter(o => o.status === 'pending')
      .map(o => base44.entities.SwapGapOffer.update(o.id, { status: 'expired' }))
  );

  const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

  // Create new gap offer
  const newOffer = await base44.entities.SwapGapOffer.create({
    matchId,
    offeredByUserId: user.id,
    proposedGapEGP,
    proposedGapDirection,
    status: 'pending',
    expiresAt
  });

  // Create negotiation message
  await base44.entities.SwapNegotiationMessage.create({
    matchId,
    senderUserId: user.id,
    messageType: 'counter_offer',
    messageText: `Proposed a new gap amount: ${proposedGapEGP.toLocaleString('en-EG')} EGP`,
    proposedGapEGP,
    isRead: false
  });

  // Notify the other party
  const otherUserId = match.userAId === user.id ? match.userBId : match.userAId;
  const otherUsers = await base44.asServiceRole.entities.User.filter({ id: otherUserId });
  const otherUser = otherUsers?.[0];
  if (otherUser?.email) {
    try {
      await base44.integrations.Core.SendEmail({
        to: otherUser.email,
        subject: `🔄 ${user.full_name} proposed a new gap amount`,
        body: `Hi ${otherUser.full_name},\n\n${user.full_name} has proposed a cash gap of ${proposedGapEGP.toLocaleString('en-EG')} EGP for your property swap.\n\nLog in to Kemedar to respond.\n\nKemedar Swap™ Team`
      });
    } catch (_e) { /* non-blocking */ }
  }

  return Response.json({ success: true, offerId: newOffer.id });
});