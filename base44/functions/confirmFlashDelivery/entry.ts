import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId, rating, review, photoUrl, confirmedBy } = await req.json();
  if (!orderId) return Response.json({ error: 'orderId required' }, { status: 400 });

  const orders = await base44.asServiceRole.entities.FlashOrder.filter({ id: orderId });
  const order = orders[0];
  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

  // Verify caller owns this order or is the seller
  const isBuyer = order.buyerId === user.id;
  const isSeller = order.sellerId === user.id;
  const isAdmin = user.role === 'admin';
  if (!isBuyer && !isSeller && !isAdmin) {
    return Response.json({ error: 'Not authorized for this order' }, { status: 403 });
  }

  const updateData = {};

  if (isBuyer || (isAdmin && confirmedBy === 'buyer')) {
    updateData.buyerConfirmedDelivery = true;
    updateData.buyerConfirmedAt = new Date().toISOString();
    if (rating) updateData.buyerRating = rating;
    if (review) updateData.buyerReview = review;
    if (photoUrl) updateData.deliveryPhotoUrl = photoUrl;
    updateData.status = 'delivered';
  }

  if (isSeller || (isAdmin && confirmedBy === 'seller')) {
    // Seller marks as shipped/out for delivery
    updateData.status = 'out_for_delivery';
    if (photoUrl) updateData.deliveryPhotoUrl = photoUrl;
  }

  await base44.asServiceRole.entities.FlashOrder.update(orderId, updateData);

  // If compound deal, check if ALL participants confirmed — then finalize
  if (order.dealType === 'compound' && isBuyer) {
    const deal = (await base44.asServiceRole.entities.CompoundDeal.filter({ id: order.dealId }))[0];
    if (deal) {
      // Update participant confirmation
      const updatedParticipants = (deal.participants || []).map(p =>
        p.userId === user.id ? { ...p, deliveryConfirmed: true, confirmedAt: new Date().toISOString(), rating, review } : p
      );
      const allConfirmed = updatedParticipants.every(p => p.deliveryConfirmed);
      await base44.asServiceRole.entities.CompoundDeal.update(deal.id, {
        participants: updatedParticipants,
        ...(allConfirmed ? { status: 'delivered', actualDeliveryDate: new Date().toISOString().split('T')[0] } : {}),
      });
    }
  }

  // Update seller rating if provided
  if (rating && isBuyer && order.dealId) {
    const deals = order.dealType === 'flash'
      ? await base44.asServiceRole.entities.FlashDeal.filter({ id: order.dealId })
      : [];
    if (deals[0]?.sellerId) {
      const seller = await base44.asServiceRole.entities.KemetroStore.filter({ userId: deals[0].sellerId });
      if (seller[0]) {
        const current = seller[0].averageRating || 4.5;
        const count = seller[0].totalReviews || 0;
        const newRating = ((current * count) + rating) / (count + 1);
        await base44.asServiceRole.entities.KemetroStore.update(seller[0].id, {
          averageRating: Math.round(newRating * 10) / 10,
          totalReviews: count + 1,
        });
      }
    }
  }

  return Response.json({ success: true, status: updateData.status || 'updated', confirmedAt: new Date().toISOString() });
});