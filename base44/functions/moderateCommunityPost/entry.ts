import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { postId } = await req.json();
  if (!postId) return Response.json({ error: 'postId required' }, { status: 400 });

  const posts = await base44.asServiceRole.entities.CommunityPost.filter({ id: postId });
  const post = posts[0];
  if (!post) return Response.json({ error: 'Post not found' }, { status: 404 });

  const communities = await base44.asServiceRole.entities.Community.filter({ id: post.communityId });
  const community = communities[0];

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are a community moderation AI for Kemedar Community™, an Egyptian and Arab real estate neighborhood social network.

Moderate posts for:
1. Spam or commercial advertising (without being a member recommendation)
2. Offensive, abusive, or inappropriate content
3. Privacy violations (sharing others' personal info)
4. Fake information or misinformation
5. Content entirely unrelated to the neighborhood
6. Scams or fraudulent offers

Be LENIENT with:
- Neighbor recommendations for services (these are valuable)
- Complaints about building issues (legitimate community concern)
- Local market listings (within platform rules)
- Discussion of area prices/market (valuable community intelligence)
- Arabic colloquial language (normal)
- Real estate price discussions (normal)
- Strong religious references (acceptable)

Moderate this community post:
Author role: ${post.authorRole || 'member'}
Post type: ${post.postType}
Community type: ${community?.communityType || 'compound'}
Content: "${post.content}"
Title: "${post.title || ''}"

Return valid JSON only:
{
  "decision": "approve" | "flag" | "remove",
  "confidence": 0-100,
  "reasoning": "brief reason",
  "categories": [],
  "suggestedAction": "string",
  "requiresHumanReview": false,
  "kemeworkOpportunity": false,
  "kemeworkCategory": null,
  "kemetroOpportunity": false,
  "priceMentioned": null,
  "recommendationDetected": false
}`,
    response_json_schema: {
      type: 'object',
      properties: {
        decision: { type: 'string' },
        confidence: { type: 'number' },
        reasoning: { type: 'string' },
        categories: { type: 'array', items: { type: 'string' } },
        suggestedAction: { type: 'string' },
        requiresHumanReview: { type: 'boolean' },
        kemeworkOpportunity: { type: 'boolean' },
        kemeworkCategory: { type: 'string' },
        kemetroOpportunity: { type: 'boolean' },
        priceMentioned: { type: 'number' },
        recommendationDetected: { type: 'boolean' }
      }
    }
  });

  // Apply decision
  let newStatus = post.status;
  if (result.decision === 'approve') newStatus = 'published';
  else if (result.decision === 'remove' && result.confidence >= 90) newStatus = 'removed';
  else if (result.decision === 'flag') newStatus = 'flagged';

  await base44.asServiceRole.entities.CommunityPost.update(postId, {
    aiModerated: true,
    aiModerationScore: result.confidence,
    aiCategoryDetected: result.categories?.[0] || null,
    status: newStatus,
    suggestedKemeworkCategory: result.kemeworkCategory || null,
  });

  return Response.json({ success: true, decision: result.decision, result });
});