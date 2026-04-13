import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { event, data } = body;

    // ── Trigger A: Concierge journey completed ────────────────────────────
    if (event?.entity_name === 'ConciergeJourney' && event?.type === 'update') {
      const journey = data;
      if (journey?.status !== 'Completed') return Response.json({ skipped: true });

      // 48-hour delayed push
      const user = await base44.asServiceRole.entities.User.filter(
        { id: journey.userId },
        '-created_date',
        1
      );
      const email = user?.[0]?.email;
      if (!email) return Response.json({ skipped: 'no user email' });

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: "♻️ Finished settling in? Turn clutter into cash.",
        body: `
Hi there,

Congrats on completing your move-in! 🎉

Don't let leftover tiles, paint or materials take up space.
Snap a photo and sell them on the Kemetro Surplus Market.
Funds go straight to your XeedWallet.

👉 Sell My Leftovers: https://kemedar.com/kemetro/surplus/add

The Kemedar Team
        `.trim()
      });

      return Response.json({ sent: true, trigger: 'concierge_complete' });
    }

    // ── Trigger C: Large Kemetro order delivered ─────────────────────────
    if (event?.entity_name === 'KemetroOrder' && event?.type === 'update') {
      const order = data;
      if (order?.status !== 'Delivered') return Response.json({ skipped: true });
      if ((order?.totalAmount || 0) < 5000) return Response.json({ skipped: 'order too small' });

      const user = await base44.asServiceRole.entities.User.filter(
        { id: order.buyerId },
        '-created_date',
        1
      );
      const email = user?.[0]?.email;
      if (!email) return Response.json({ skipped: 'no user email' });

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject: "♻️ Any leftover materials from your order?",
        body: `
Hi there,

It looks like your renovation supplies were delivered a week ago — hope the project went well!

Do you have any leftover tiles, paint, or materials from your order?
Resell unused items on Kemetro Surplus and recover some of your costs.

👉 Sell Leftovers: https://kemedar.com/kemetro/surplus/add

The Kemetro Team
        `.trim()
      });

      return Response.json({ sent: true, trigger: 'large_order_delivered' });
    }

    return Response.json({ skipped: 'no matching trigger' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});