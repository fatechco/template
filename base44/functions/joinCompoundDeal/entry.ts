import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { dealId, quantity, deliveryAddress, notes } = await req.json();
  if (!dealId || !quantity) return Response.json({ error: 'dealId and quantity required' }, { status: 400 });

  // Load deal
  const deals = await base44.asServiceRole.entities.CompoundDeal.filter({ id: dealId });
  const deal = deals[0];
  if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 });
  if (!['forming', 'threshold_reached'].includes(deal.status)) {
    return Response.json({ error: 'Deal is no longer accepting participants' }, { status: 400 });
  }

  // Check if already joined
  const existing = deal.participants?.find(p => p.userId === user.id);
  if (existing) return Response.json({ error: 'Already joined this deal' }, { status: 400 });

  // Determine current price tier
  const newParticipants = (deal.currentParticipants || 0) + 1;
  const newTotalQty = (deal.currentTotalQty || 0) + quantity;
  const tiers = (deal.priceTiers || []).slice().sort((a, b) => (b.minParticipants || 0) - (a.minParticipants || 0));
  const activeTier = tiers.find(t => newParticipants >= (t.minParticipants || 0)) || tiers[tiers.length - 1];
  const unitPrice = activeTier?.pricePerUnit || deal.retailPricePerUnit;
  const subtotal = quantity * unitPrice;

  // Add participant
  const participant = {
    userId: user.id,
    userName: user.full_name,
    userEmail: user.email,
    quantity,
    unitPrice,
    subtotal,
    deliveryAddress: deliveryAddress || deal.deliveryAddress,
    notes: notes || '',
    joinedAt: new Date().toISOString(),
    paymentStatus: 'pending',
  };

  const updatedParticipants = [...(deal.participants || []), participant];
  const newTotalValue = updatedParticipants.reduce((s, p) => s + (p.subtotal || 0), 0);

  // Check threshold
  const thresholdReached = newParticipants >= (deal.minParticipants || 999);
  const newStatus = thresholdReached ? 'threshold_reached' : 'forming';
  const currentTierIndex = tiers.findIndex(t => newParticipants >= (t.minParticipants || 0));

  await base44.asServiceRole.entities.CompoundDeal.update(dealId, {
    participants: updatedParticipants,
    currentParticipants: newParticipants,
    currentTotalQty: newTotalQty,
    totalGroupValue: newTotalValue,
    currentTierIndex: Math.max(0, currentTierIndex),
    status: newStatus,
    achievedPricePerUnit: unitPrice,
  });

  // Create FlashOrder record for tracking
  const orderNumber = `KFO-${Date.now().toString(36).toUpperCase()}`;
  const order = await base44.asServiceRole.entities.FlashOrder.create({
    orderNumber,
    dealId,
    dealType: 'compound',
    buyerId: user.id,
    quantity,
    unitPrice,
    originalUnitPrice: deal.retailPricePerUnit,
    discount: (deal.retailPricePerUnit - unitPrice) * quantity,
    discountPercent: activeTier?.discountPercent || 0,
    subtotal,
    totalAmount: subtotal,
    currency: 'EGP',
    deliveryAddress: deliveryAddress || deal.deliveryAddress,
    status: 'pending_payment',
    paymentMethod: 'on_delivery',
    productName: deal.productName || deal.productCategory,
    productImage: deal.productImage || null,
  });

  // Notify if threshold just reached
  if (thresholdReached && deal.status === 'forming') {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: user.email,
      subject: `🎉 Threshold Reached! Your group buy is happening — ${deal.dealTitle}`,
      body: `Great news! The group buy for ${deal.dealTitle} has reached its minimum threshold.\n\nYour order: ${quantity} m² at ${unitPrice} EGP/m² = ${subtotal} EGP\n\nA seller will be confirmed shortly and delivery will be coordinated to your compound.`,
    }).catch(() => {});
  }

  return Response.json({
    success: true,
    orderId: order.id,
    orderNumber,
    unitPrice,
    subtotal,
    thresholdReached,
    currentParticipants: newParticipants,
    activeTier,
  });
});