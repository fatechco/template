import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { matchId } = await req.json();

  const matches = await base44.asServiceRole.entities.SwapMatch.filter({ id: matchId });
  const match = matches?.[0];
  if (!match) return Response.json({ error: 'Match not found' }, { status: 404 });

  const now = new Date().toISOString();

  // Update match to negotiating
  await base44.asServiceRole.entities.SwapMatch.update(matchId, {
    status: 'negotiating',
    negotiationStartedAt: now
  });

  // System welcome message
  await base44.asServiceRole.entities.SwapNegotiationMessage.create({
    matchId,
    senderUserId: match.userAId, // sent as system but attributed to A for DB constraint
    messageType: 'system',
    messageText: '🎉 You both want to swap! Start negotiating the cash gap and arrange property viewings.',
    isRead: false
  });

  // Determine initial gap direction
  let direction = 'equal';
  if (match.gapPayerUserId === match.userAId) direction = 'a_pays_b';
  else if (match.gapPayerUserId === match.userBId) direction = 'b_pays_a';

  // Create AI-calculated starting point gap offer
  await base44.asServiceRole.entities.SwapGapOffer.create({
    matchId,
    offeredByUserId: match.userAId, // system suggestion attributed to A
    proposedGapEGP: match.valuationGapEGP ?? 0,
    proposedGapDirection: direction,
    status: 'pending'
  });

  return Response.json({ success: true, matchId, negotiationStartedAt: now });
});