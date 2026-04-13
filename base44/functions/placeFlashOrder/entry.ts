import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { dealId, quantity, deliveryAddress, deliveryCityId, paymentMethod, notes } = await req.json();
  if (!dealId || !quantity) return Response.json({ error: 'dealId and quantity required' }, { status: 400 });

  // Load deal
  const deals = await base44.asServiceRole.entities.FlashDeal.filter({ id: dealId });
  const deal = deals[0];
  if (!deal) return Response.json({ error: 'Deal not found' }, { status: 404 });
  if (deal.status !== 'active') return Response.json({ error: 'Deal is no longer active' }, { status: 400 });
  if (deal.stockRemaining < quantity) return Response.json({ error: `Only ${deal.stockRemaining} units available` }, { status: 400 });

  // Check max per buyer
  if (deal.maximumOrderQtyPerBuyer && quantity > deal.maximumOrderQtyPerBuyer) {
    return Response.json({ error: `Maximum ${deal.maximumOrderQtyPerBuyer} units per buyer` }, { status: 400 });
  }

  // Calculate price (check tier pricing)
  let unitPrice = deal.dealPrice;
  if (deal.hasTieredPricing && deal.priceTiers?.length) {
    const sortedTiers = [...deal.priceTiers].sort((a, b) => (b.minQty || 0) - (a.minQty || 0));
    const tier = sortedTiers.find(t => quantity >= (t.minQty || 0));
    if (tier) unitPrice = tier.price;
  }

  // Delivery cost
  let deliveryCost = 0;
  if (deal.deliveryCostPerUnit) {
    deliveryCost = deal.deliveryCostPerUnit * quantity;
    if (deal.freeDeliveryThreshold && unitPrice * quantity >= deal.freeDeliveryThreshold) deliveryCost = 0;
  }

  const subtotal = unitPrice * quantity;
  const platformFee = Math.round(subtotal * 0.02); // 2% platform fee
  const totalAmount = subtotal + deliveryCost + platformFee;

  const orderNumber = `KFD-${Date.now().toString(36).toUpperCase()}`;
  const scheduledDelivery = new Date(Date.now() + (deal.deliveryLeadDays || 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Reserve stock
  await base44.asServiceRole.entities.FlashDeal.update(dealId, {
    stockRemaining: (deal.stockRemaining || 0) - quantity,
    reservedStock: (deal.reservedStock || 0) + quantity,
    totalOrders: (deal.totalOrders || 0) + 1,
    totalUnitsSold: (deal.totalUnitsSold || 0) + quantity,
    totalRevenue: (deal.totalRevenue || 0) + totalAmount,
    uniqueBuyers: (deal.uniqueBuyers || 0) + 1,
  });

  // Create order
  const order = await base44.asServiceRole.entities.FlashOrder.create({
    orderNumber,
    dealId,
    dealType: 'flash',
    buyerId: user.id,
    sellerId: deal.sellerId,
    quantity,
    unitPrice,
    originalUnitPrice: deal.originalPrice,
    discount: (deal.originalPrice - unitPrice) * quantity,
    discountPercent: deal.discountPercent,
    subtotal,
    deliveryCost,
    platformFee,
    totalAmount,
    currency: deal.currency || 'EGP',
    deliveryType: deal.deliveryOption,
    deliveryAddress: deliveryAddress || '',
    deliveryCityId: deliveryCityId || '',
    scheduledDeliveryDate: scheduledDelivery,
    status: paymentMethod === 'wallet' ? 'paid' : 'pending_payment',
    paymentMethod: paymentMethod || 'on_delivery',
    productName: deal.productName,
    productImage: deal.productImages?.[0] || null,
    notes: notes || '',
  });

  // Email confirmation
  base44.asServiceRole.integrations.Core.SendEmail({
    to: user.email,
    subject: `✅ Order Confirmed — ${deal.productName}`,
    body: `Hi ${user.full_name},\n\nYour flash deal order is confirmed!\n\nOrder: ${orderNumber}\nProduct: ${deal.productName}\nQuantity: ${quantity} ${deal.unit || 'units'}\nUnit Price: ${unitPrice} EGP\nTotal: ${totalAmount} EGP\nDelivery: ~${scheduledDelivery}\n\nTrack your order in Kemetro.`,
  }).catch(() => {});

  return Response.json({
    success: true,
    orderId: order.id,
    orderNumber,
    unitPrice,
    subtotal,
    deliveryCost,
    platformFee,
    totalAmount,
    scheduledDeliveryDate: scheduledDelivery,
    status: order.status,
  });
});