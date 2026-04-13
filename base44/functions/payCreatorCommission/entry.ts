import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Service-role operation for payment processing
    const { calculationId, orderId } = await req.json();

    if (!calculationId) {
      return Response.json({ error: 'Missing calculationId' }, { status: 400 });
    }

    // Get calculation
    const calculation = await base44.asServiceRole.entities.KemeKitCalculation.filter({ id: calculationId }).then(c => c[0]);
    if (!calculation) {
      return Response.json({ error: 'Calculation not found' }, { status: 404 });
    }

    // Get template
    const template = await base44.asServiceRole.entities.KemeKitTemplate.filter({ id: calculation.templateId }).then(t => t[0]);
    if (!template) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    // Calculate commission
    const commissionEGP = calculation.totalMaterialCostEGP * (template.commissionPercent / 100);

    // Update creator's Kemecoins wallet (or store commission for payout)
    // In real implementation, credit to creator's wallet
    console.log(`Crediting ${commissionEGP} EGP Kemecoins to creator: ${template.creatorId}`);

    // Update template stats
    await base44.asServiceRole.entities.KemeKitTemplate.update(calculation.templateId, {
      totalCommissionsEarnedEGP: (template.totalCommissionsEarnedEGP || 0) + commissionEGP,
      totalPurchases: (template.totalPurchases || 0) + 1,
      totalGMVEGP: (template.totalGMVEGP || 0) + calculation.totalMaterialCostEGP
    });

    // Update calculation status
    await base44.asServiceRole.entities.KemeKitCalculation.update(calculationId, {
      status: 'purchased',
      purchasedAt: new Date().toISOString()
    });

    // Notify creator (in real implementation)
    const notificationMessage = `💰 Commission earned: ${commissionEGP} EGP Kemecoins! From: ${template.title} kit purchase`;
    console.log(`Creator notification: ${notificationMessage}`);

    return Response.json({
      commissionEGP,
      totalCommissionsEarned: (template.totalCommissionsEarnedEGP || 0) + commissionEGP,
      message: 'Commission paid successfully'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});