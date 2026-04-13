import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    surplusItemId,
    deliveryAddress, deliveryLat, deliveryLng,
  } = await req.json();
  const buyerUserId = user.id;

  // Get surplus item
  const items = await base44.asServiceRole.entities.SurplusItem.filter(
    { id: surplusItemId }, '-created_date', 1
  );
  const item = items?.[0];
  if (!item) return Response.json({ error: 'Item not found' }, { status: 404 });
  if (item.deliveryOption !== 'shipper_network') {
    return Response.json({ error: 'This item does not offer shipper delivery' }, { status: 400 });
  }

  // Get the active reservation transaction for this item
  const txns = await base44.asServiceRole.entities.SurplusTransaction.filter(
    { surplusItemId, buyerUserId, transactionType: 'reservation' },
    '-created_date', 1
  );
  const transactionId = txns?.[0]?.id || null;

  // Calculate shipping cost: 15 EGP per kg
  const estimatedWeightKg = item.estimatedWeightKg || 10;
  const shippingCostEGP = estimatedWeightKg * 15;

  // Create shipment request
  const shipmentRequest = await base44.asServiceRole.entities.SurplusShipmentRequest.create({
    surplusItemId,
    transactionId,
    buyerUserId,
    sellerUserId: item.sellerId,
    assignedShipperId: null,
    pickupAddress: item.addressText || '',
    pickupLat: item.latitude || null,
    pickupLng: item.longitude || null,
    deliveryAddress,
    deliveryLat: deliveryLat || null,
    deliveryLng: deliveryLng || null,
    estimatedWeightKg,
    shippingCostEGP,
    status: 'open',
  });

  // NOTE: In production — broadcast push notification to all shippers within 20km of pickup
  // using the Kemetro Shipper notification system.
  // Notification payload:
  // "🚛 Surplus Heavy Load — [estimatedWeightKg]kg
  //  Pickup: [district] → Delivery: [deliveryAddress]
  //  Earn: [shippingCostEGP] EGP"

  return Response.json({
    success: true,
    shipmentRequest,
    shippingCostEGP,
    message: `✅ Shipment request created. A nearby shipper will accept shortly. Estimated shipping: ${shippingCostEGP} EGP.`,
  });
});