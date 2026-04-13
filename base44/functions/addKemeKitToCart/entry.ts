import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Login required' }, { status: 401 });
    }

    const { calculationId } = await req.json();

    if (!calculationId) {
      return Response.json({ error: 'Missing calculationId' }, { status: 400 });
    }

    // Get calculation
    const calculation = await base44.entities.KemeKitCalculation.filter({ id: calculationId }).then(c => c[0]);
    if (!calculation) {
      return Response.json({ error: 'Calculation not found' }, { status: 404 });
    }

    if (calculation.userId && calculation.userId !== user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get included items
    const includedItems = calculation.calculatedBoQ.filter(i => i.isIncluded);

    // Add to Kemetro cart
    const cartOperations = includedItems.map(item => ({
      productId: item.productId,
      quantity: item.finalQty,
      isLowStock: item.isLowStock ? '⚠️ Low stock — order soon' : null
    }));

    // Update calculation
    await base44.entities.KemeKitCalculation.update(calculationId, {
      status: 'cart_added',
      cartAddedAt: new Date().toISOString(),
      userId: user.id
    });

    // Get template for stats
    const template = await base44.entities.KemeKitTemplate.filter({ id: calculation.templateId }).then(t => t[0]);

    // Update template stats
    if (template) {
      await base44.asServiceRole.entities.KemeKitTemplate.update(calculation.templateId, {
        totalCartsGenerated: (template.totalCartsGenerated || 0) + 1
      });
    }

    // Create shipment alert if heavy
    if (calculation.totalWeightKg > 100) {
      const userCity = user.cityId || 'Cairo'; // Fallback
      // Alert would be sent to shippers in user's city (implementation depends on notification system)
      console.log(`Heavy KemeKit alert: ${calculation.totalWeightKg}kg to ${userCity}`);
    }

    return Response.json({
      cartItemCount: includedItems.length,
      totalMaterialCostEGP: calculation.totalMaterialCostEGP,
      cartOperations
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});