import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check if feature already exists
    const existing = await base44.entities.FeatureRegistry.filter({ featureKey: 'buy_it_finished_simulator' }).catch(() => []);
    
    if (existing.length > 0) {
      return Response.json({ message: 'Feature already seeded', feature: existing[0] });
    }

    // Create the feature
    const feature = await base44.entities.FeatureRegistry.create({
      featureKey: 'buy_it_finished_simulator',
      featureName: 'AI Buy-It-Finished Simulator',
      featureType: 'feature',
      modules: ['kemedar', 'kemework', 'kemetro'],
      location: 'property_detail_page',
      description: 'Allows buyers to estimate finishing costs and post directly to Kemework/Kemetro.',
      isActive: true,
      rolloutPercentage: 100
    });

    return Response.json({ message: 'Feature seeded successfully', feature });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});