import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { marketId } = await req.json();
    const market = (await base44.asServiceRole.entities.MarketProfile.filter({ id: marketId }))[0];
    
    if (!market) {
      return Response.json({ error: 'Market not found' }, { status: 404 });
    }

    const prompt = `Create a detailed 12-month expansion roadmap for Kemedar in ${market.cityName}, ${market.countryName}.

Return as JSON with phases (pre_launch, soft_launch, full_launch, scale):
{
  "phases": [
    {
      "phase": "pre_launch",
      "months": "1-3",
      "milestones": [
        {"category": "legal"|"technical"|"commercial"|"team"|"marketing"|"regulatory", "name": string, "priority": "critical"|"high"|"medium"|"low", "description": string}
      ]
    }
  ]
}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          phases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phase: { type: "string" },
                months: { type: "string" },
                milestones: { type: "array" }
              }
            }
          }
        }
      }
    });

    // Create milestone records for each phase
    for (const phase of result.phases) {
      for (const milestone of phase.milestones) {
        await base44.asServiceRole.entities.ExpansionMilestone.create({
          marketId,
          phase: phase.phase,
          milestoneCategory: milestone.category,
          milestoneName: milestone.name,
          priority: milestone.priority,
          status: 'not_started'
        });
      }
    }

    return Response.json({
      success: true,
      roadmap: result.phases,
      totalMilestones: result.phases.reduce((sum, p) => sum + p.milestones.length, 0)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});