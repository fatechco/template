import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { matchId } = await req.json();

  const matches = await base44.entities.SwapMatch.filter({ id: matchId });
  const match = matches?.[0];
  if (!match) return Response.json({ error: 'Match not found' }, { status: 404 });

  const isA = match.userAId === user.id;
  const isB = match.userBId === user.id;
  if (!isA && !isB) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const current = match.status;
  let newStatus = current;
  let bothInterested = false;

  if (isA) {
    if (current === 'suggested' || current === 'a_seen') newStatus = 'a_interested';
    else if (current === 'b_interested') { newStatus = 'both_interested'; bothInterested = true; }
  } else {
    if (current === 'suggested' || current === 'b_seen') newStatus = 'b_interested';
    else if (current === 'a_interested') { newStatus = 'both_interested'; bothInterested = true; }
  }

  await base44.entities.SwapMatch.update(matchId, { status: newStatus });

  if (bothInterested) {
    // Update both intents to in_negotiation
    await Promise.all([
      base44.asServiceRole.entities.SwapIntent.update(match.intentAId, { status: 'in_negotiation' }),
      base44.asServiceRole.entities.SwapIntent.update(match.intentBId, { status: 'in_negotiation' })
    ]);

    // Open negotiation room
    await base44.functions.invoke('openNegotiationRoom', { matchId });

    // Notify both users
    const userIds = [match.userAId, match.userBId];
    const users = await Promise.all(
      userIds.map(id => base44.asServiceRole.entities.User.filter({ id }).then(r => r?.[0]))
    );
    for (const u of users) {
      if (u?.email) {
        try {
          await base44.integrations.Core.SendEmail({
            to: u.email,
            subject: '🎉 It\'s a Swap Match! Both of you are interested',
            body: `Hi ${u.full_name},\n\nExciting news! Both you and the other property owner have expressed interest in this swap. Your negotiation room is now open.\n\nLog in to Kemedar to start negotiating the cash gap and arrange property viewings.\n\nKemedar Swap™ Team`
          });
        } catch (_e) { /* non-blocking */ }
      }
    }
  } else {
    // Notify the other party of interest (without revealing exactly who)
    const otherUserId = isA ? match.userBId : match.userAId;
    const otherUsers = await base44.asServiceRole.entities.User.filter({ id: otherUserId });
    const otherUser = otherUsers?.[0];
    if (otherUser?.email) {
      try {
        await base44.integrations.Core.SendEmail({
          to: otherUser.email,
          subject: `🔄 ${user.full_name.split(' ')[0]} is interested in your swap!`,
          body: `Hi ${otherUser.full_name},\n\n${user.full_name.split(' ')[0]} has expressed interest in swapping with your property.\n\nLog in to Kemedar to view the match and respond!\n\nKemedar Swap™ Team`
        });
      } catch (_e) { /* non-blocking */ }
    }
  }

  return Response.json({ success: true, newStatus, bothInterested });
});