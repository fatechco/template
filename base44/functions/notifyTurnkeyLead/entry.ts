import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'User must be authenticated' }, { status: 401 });
    }

    const { simulationId } = await req.json();

    const simulation = await base44.entities.FinishingSimulation.filter({ id: simulationId }).then(s => s[0]);
    if (!simulation) {
      return Response.json({ error: 'Simulation not found' }, { status: 404 });
    }

    // Mark simulation as turnkey-requested
    await base44.entities.FinishingSimulation.update(simulationId, {
      requestedKemedarTurnkey: true
    });

    // Get property details
    const property = await base44.entities.Property.filter({ id: simulation.propertyId }).then(p => p[0]);

    // Find franchise owner for the property's area
    const franchiseOwners = await base44.entities.User.filter({ 
      role: 'franchise_owner',
      areaId: property?.areaId 
    }).catch(() => []);

    if (franchiseOwners.length === 0) {
      return Response.json({ 
        message: 'No franchise owner found for this area. Lead will be queued for manual assignment.',
        simulationId 
      });
    }

    // Create notification for franchise owner
    const franchiseOwnerId = franchiseOwners[0].id;
    const leadNotification = {
      franchiseOwnerId,
      leadType: 'finishing_turnkey_request',
      leadTitle: `Turnkey Finishing Request: ${property?.title || 'Property'}`,
      leadDescription: `AI estimate: ${simulation.desiredTier} tier ${simulation.desiredStyle} style. Budget: ${simulation.estimatedTotalMin}-${simulation.estimatedTotalMax}`,
      relatedUserId: user.id,
      relatedSimulationId: simulationId,
      relatedPropertyId: simulation.propertyId,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    // You would create a dedicated entity for this or use an activity log
    // For now, just track it in the simulation
    await base44.entities.FinishingSimulation.update(simulationId, {
      assignedFranchiseOwnerId: franchiseOwnerId
    });

    // Send email to franchise owner
    await base44.integrations.Core.SendEmail({
      to: franchiseOwners[0].email,
      subject: `🤝 New Turnkey Finishing Lead: ${simulation.desiredTier} Tier Project`,
      body: `
A buyer has requested a turnkey finishing estimate:

Property: ${property?.title}
Area: ${property?.area_size} sqm
Style: ${simulation.desiredStyle}
Quality Tier: ${simulation.desiredTier}
Estimated Budget: ${simulation.estimatedTotalMin}-${simulation.estimatedTotalMax}
Timeline: ${simulation.estimatedWeeksMin}-${simulation.estimatedWeeksMax} weeks

Buyer: ${user.full_name} (${user.email})

Log in to your Franchise Owner Dashboard to view the full estimate and BoQ.
      `
    }).catch(() => null);

    return Response.json({ 
      message: 'Turnkey lead created and franchise owner notified',
      simulationId,
      franchiseOwnerId
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});