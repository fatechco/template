import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { calculationId, kitItemId, isIncluded } = await req.json();

    if (!calculationId || !kitItemId) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Get calculation
    const calculation = await base44.entities.KemeKitCalculation.filter({ id: calculationId }).then(c => c[0]);
    if (!calculation) {
      return Response.json({ error: 'Calculation not found' }, { status: 404 });
    }

    // Update calculated BOQ
    const updatedBoQ = calculation.calculatedBoQ.map(item =>
      item.kitItemId === kitItemId ? { ...item, isIncluded } : item
    );

    // Recalculate total
    const totalMaterialCostEGP = updatedBoQ
      .filter(i => i.isIncluded)
      .reduce((sum, i) => sum + (i.subtotalEGP || 0), 0);

    // Update calculation record
    await base44.entities.KemeKitCalculation.update(calculationId, {
      calculatedBoQ: updatedBoQ,
      totalMaterialCostEGP
    });

    return Response.json({
      totalMaterialCostEGP,
      updatedBoQ
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});