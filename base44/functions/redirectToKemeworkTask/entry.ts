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

    // Construct BoQ text from breakdown
    let boqText = 'AI-Generated Bill of Quantities:\n\n';
    if (simulation.aiGeneratedBoQ && Array.isArray(simulation.aiGeneratedBoQ)) {
      for (const item of simulation.aiGeneratedBoQ) {
        boqText += `${item.category}: ${item.description}\n`;
        boqText += `  Materials: $${Math.round(item.materialCost)} | Labor: $${Math.round(item.laborCost)}\n\n`;
      }
    }

    // Add design advice
    if (simulation.aiDesignAdvice) {
      boqText += `\nDesign Recommendations:\n${simulation.aiDesignAdvice}`;
    }

    // Return redirect info with prefilled form data
    return Response.json({
      redirectTo: '/kemework/post-task',
      prefillData: {
        category: 'General Contractors & Construction',
        title: `[AI ✨] Finishing Work - ${simulation.desiredTier} Tier ${simulation.desiredStyle} Style`,
        description: boqText,
        budget: simulation.estimatedLaborTotal || simulation.estimatedTotalMin,
        estimatedDuration: `${simulation.estimatedWeeksMin}-${simulation.estimatedWeeksMax} weeks`,
        tags: ['AI-Structured-BoQ', 'High-Intent', 'Finishing-Project'],
        relatedPropertyId: simulation.propertyId,
        relatedSimulationId: simulationId
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});