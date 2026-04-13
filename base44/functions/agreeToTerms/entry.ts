import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { matchId, agreedGapEGP } = await req.json();

  const matches = await base44.entities.SwapMatch.filter({ id: matchId });
  const match = matches?.[0];
  if (!match) return Response.json({ error: 'Match not found' }, { status: 404 });
  if (match.userAId !== user.id && match.userBId !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const now = new Date().toISOString();
  const update = {};

  if (match.userAId === user.id) {
    update.termsAgreedByUserAAt = now;
  } else {
    update.termsAgreedByUserBAt = now;
  }

  // Merge with existing timestamps
  const updatedAAt = update.termsAgreedByUserAAt ?? match.termsAgreedByUserAAt;
  const updatedBAt = update.termsAgreedByUserBAt ?? match.termsAgreedByUserBAt;

  const bothAgreed = updatedAAt && updatedBAt;

  if (bothAgreed) {
    update.status = 'terms_agreed';
    update.agreedGapEGP = agreedGapEGP;
    update.termsAgreedAt = now;
  }

  await base44.entities.SwapMatch.update(matchId, update);

  if (bothAgreed) {
    // System message in negotiation room
    await base44.entities.SwapNegotiationMessage.create({
      matchId,
      senderUserId: user.id,
      messageType: 'system',
      messageText: '✅ Both parties have agreed to the terms. Proceed to legal and escrow to complete the swap.',
      isRead: false
    });

    // Accept the current pending gap offer (if any)
    const pendingOffers = await base44.entities.SwapGapOffer.filter({ matchId, status: 'pending' });
    await Promise.all(
      (pendingOffers || []).map(o =>
        base44.entities.SwapGapOffer.update(o.id, {
          status: 'accepted',
          respondedByUserId: user.id,
          respondedAt: now
        })
      )
    );

    // Notify both parties
    const userIds = [match.userAId, match.userBId];
    const users = await Promise.all(
      userIds.map(id => base44.asServiceRole.entities.User.filter({ id }).then(r => r?.[0]))
    );
    for (const u of users) {
      if (u?.email) {
        try {
          await base44.integrations.Core.SendEmail({
            to: u.email,
            subject: '✅ Swap Terms Agreed — Next: Legal & Escrow',
            body: `Hi ${u.full_name},\n\nBoth parties have agreed to the swap terms (cash gap: ${(agreedGapEGP || 0).toLocaleString('en-EG')} EGP).\n\nThe next step is to proceed through the legal review and XeedWallet escrow to complete your Kemedar Swap™.\n\nKemedar Team`
          });
        } catch (_e) { /* non-blocking */ }
      }
    }
  }

  return Response.json({ success: true, bothAgreed });
});