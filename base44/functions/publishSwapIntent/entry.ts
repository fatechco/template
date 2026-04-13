import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { swapIntentId } = await req.json();

  // Fetch intent and verify ownership
  const intents = await base44.entities.SwapIntent.filter({ id: swapIntentId });
  const intent = intents?.[0];
  if (!intent) return Response.json({ error: 'Swap intent not found' }, { status: 404 });
  if (intent.userId !== user.id) return Response.json({ error: 'Forbidden' }, { status: 403 });

  // Fetch offered property and verify ownership
  const properties = await base44.entities.Property.filter({ id: intent.offeredPropertyId });
  const property = properties?.[0];
  if (!property) return Response.json({ error: 'Property not found' }, { status: 404 });
  if (property.user_id !== user.id) return Response.json({ error: 'You do not own this property' }, { status: 403 });

  // Fetch SwapSettings
  const settingsList = await base44.entities.SwapSettings.list();
  const settings = settingsList?.[0];
  const minLevel = settings?.minVerifyProLevelToList ?? 2;
  const expiryDays = settings?.swapIntentExpiryDays ?? 90;

  // Verify Pro level check
  const currentLevel = property.verification_level ?? 1;
  if (currentLevel < minLevel) {
    return Response.json({
      error: `Property must be Kemedar Verify Pro Level ${minLevel}+ to join the Swap Pool. Current level: ${currentLevel}.`
    }, { status: 400 });
  }

  // Check for duplicate active intent on this property
  const activeIntents = await base44.entities.SwapIntent.filter({ offeredPropertyId: intent.offeredPropertyId });
  const duplicate = (activeIntents || []).find(i =>
    i.id !== swapIntentId &&
    ['active', 'matched', 'in_negotiation'].includes(i.status)
  );
  if (duplicate) {
    return Response.json({
      error: 'This property already has an active swap intent. Pause or cancel it first.'
    }, { status: 400 });
  }

  // Get AI valuation via InvokeLLM
  let estimatedValueEGP = null;
  let valuationConfidence = 'low';
  try {
    const valuationResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Estimate the market value in EGP for this Egyptian real estate property:
Title: ${property.title}
City: ${property.city_id || 'Unknown'}
Area: ${property.area_size || 'Unknown'} sqm
Bedrooms: ${property.beds || 'Unknown'}
Floor: ${property.floor_number || 'Unknown'}
Year Built: ${property.year_built || 'Unknown'}
Listed Price: ${property.price_amount || 'Unknown'} EGP

Return ONLY valid JSON:
{"estimatedValueEGP": number, "confidence": "high"|"medium"|"low"}`,
      response_json_schema: {
        type: 'object',
        properties: {
          estimatedValueEGP: { type: 'number' },
          confidence: { type: 'string' }
        }
      }
    });
    estimatedValueEGP = valuationResult?.estimatedValueEGP ?? property.price_amount ?? null;
    valuationConfidence = valuationResult?.confidence ?? 'low';
  } catch (_e) {
    estimatedValueEGP = property.price_amount ?? null;
    valuationConfidence = 'low';
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000).toISOString();

  // Update SwapIntent to active
  await base44.entities.SwapIntent.update(swapIntentId, {
    offeredPropertyEstimatedValueEGP: estimatedValueEGP,
    valuationConfidence,
    valuationUpdatedAt: now.toISOString(),
    status: 'active',
    publishedAt: now.toISOString(),
    expiresAt
  });

  // Update Property
  await base44.entities.Property.update(intent.offeredPropertyId, {
    isOpenToSwap: true,
    swapIntentId: swapIntentId
  });

  // Fire and forget: generate matches
  try {
    base44.functions.invoke('generateSwapMatches', { swapIntentId });
  } catch (_e) { /* non-blocking */ }

  // Notify user
  try {
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: '🔄 Your property is now in the Kemedar Swap™ pool!',
      body: `Hi ${user.full_name},\n\nYour property "${property.title}" is now live in the Kemedar Swap™ pool. We're scanning for matching properties and will notify you when we find a great match!\n\nKemedar Team`
    });
  } catch (_e) { /* non-blocking */ }

  return Response.json({ success: true, swapIntentId, estimatedValueEGP, valuationConfidence });
});