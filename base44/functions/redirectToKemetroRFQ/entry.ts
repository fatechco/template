import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'User must be authenticated', redirectTo: '/auth/login' }, { status: 401 });
    }

    const { simulationId } = await req.json();

    const simulation = await base44.entities.FinishingSimulation.filter({ id: simulationId }).then(s => s[0]);
    if (!simulation) {
      return Response.json({ error: 'Simulation not found' }, { status: 404 });
    }

    // Convert shopping list to RFQ line items
    const items = [];
    if (simulation.aiShoppingList && Array.isArray(simulation.aiShoppingList)) {
      for (const item of simulation.aiShoppingList) {
        items.push({
          description: item.item,
          quantity: item.quantity,
          unit: item.unit
        });
      }
    }

    return Response.json({
      redirectTo: '/m/kemetro/buyer/rfqs/create',
      prefillData: {
        title: `[AI ✨] Material RFQ - ${simulation.desiredTier} Tier Finishing`,
        description: `AI-generated material list for ${simulation.desiredStyle} style property finishing project. Budget: ${simulation.estimatedMaterialsCost}`,
        items: items,
        budget: simulation.estimatedMaterialsCost,
        targetDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        relatedSimulationId: simulationId
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});