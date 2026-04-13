import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { postId, content, communityId } = await req.json();

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Analyze this community post for home service needs that could be fulfilled by Kemework professionals.

Post content: "${content}"

Kemework trade categories: plumbing, electrical, painting, tiling, carpentry, AC_maintenance, cleaning, moving, renovation, landscaping, security_systems, pest_control, appliance_repair, masonry, waterproofing, glazing, gypsum, flooring

Return JSON:
{
  "hasOpportunity": true/false,
  "tradeType": "category from list above or null",
  "urgencyLevel": "immediate" | "soon" | "planning" | null,
  "estimatedJobSize": "small" | "medium" | "large" | null,
  "suggestedMessage": "friendly suggestion to the user in English (max 80 chars)",
  "suggestedMessageAr": "same in Arabic (max 80 chars)"
}`,
    response_json_schema: {
      type: 'object',
      properties: {
        hasOpportunity: { type: 'boolean' },
        tradeType: { type: 'string' },
        urgencyLevel: { type: 'string' },
        estimatedJobSize: { type: 'string' },
        suggestedMessage: { type: 'string' },
        suggestedMessageAr: { type: 'string' }
      }
    }
  });

  if (result.hasOpportunity && postId) {
    await base44.asServiceRole.entities.CommunityPost.update(postId, {
      suggestedKemeworkCategory: result.tradeType,
    });
  }

  return Response.json({ success: true, ...result });
});