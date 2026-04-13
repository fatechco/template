import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { dealId, dealType, message, targetUserIds } = await req.json();
  if (!dealId) return Response.json({ error: 'dealId required' }, { status: 400 });

  let deal;
  let targets = targetUserIds || [];

  if (dealType === 'compound') {
    const deals = await base44.asServiceRole.entities.CompoundDeal.filter({ id: dealId });
    deal = deals[0];
    if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 });
    // Notify participants + demand signal targets
    targets = [
      ...(deal.participants || []).map(p => p.userEmail).filter(Boolean),
      ...(targets),
    ];
  } else {
    const deals = await base44.asServiceRole.entities.FlashDeal.filter({ id: dealId });
    deal = deals[0];
    if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 });
    // Find targeted users from demand signals
    const signals = await base44.asServiceRole.entities.DemandSignal.filter({ dealCreatedId: dealId });
    for (const sig of signals) {
      if (sig.targetUserIds?.length) targets.push(...sig.targetUserIds);
    }
  }

  if (targets.length === 0) {
    return Response.json({ success: true, notified: 0, message: 'No targets found' });
  }

  // Generate personalized notification content via LLM
  const notifContent = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Generate a short, compelling push notification for this deal:
Deal: ${deal.dealTitle || deal.productName}
Discount: ${deal.discountPercent || deal.priceTiers?.[0]?.discountPercent || 20}%
Location: ${deal.compoundName || deal.cityName || 'your area'}
Type: ${dealType === 'compound' ? 'Group Buy' : 'Flash Deal'}
Custom message: ${message || 'none'}

Return JSON: { "title": "short push title under 60 chars", "body": "compelling body under 120 chars", "emoji": "relevant emoji" }`,
    response_json_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        emoji: { type: 'string' },
      }
    }
  });

  // Send emails to real user IDs (fetch their emails)
  let notified = 0;
  const uniqueTargets = [...new Set(targets)].slice(0, 50);

  for (const target of uniqueTargets) {
    // Try as email directly
    if (target.includes('@')) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: target,
        subject: `${notifContent.emoji || '⚡'} ${notifContent.title}`,
        body: `${notifContent.body}\n\nView deal: ${dealType === 'compound' ? `/kemetro/flash/compound/${dealId}` : `/kemetro/flash/deal/${dealId}`}`,
      }).catch(() => {});
      notified++;
    }
  }

  return Response.json({ success: true, notified, title: notifContent.title, body: notifContent.body });
});