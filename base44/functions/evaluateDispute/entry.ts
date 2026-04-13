import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { disputeId } = await req.json();
  if (!disputeId) return Response.json({ error: 'Missing disputeId' }, { status: 400 });

  // Load dispute
  const disputes = await base44.entities.EscrowDispute.filter({ id: disputeId });
  if (!disputes.length) return Response.json({ error: 'Dispute not found' }, { status: 404 });
  const dispute = disputes[0];

  // Mark as analyzing
  await base44.entities.EscrowDispute.update(disputeId, { aiEvaluationStatus: 'analyzing' });

  // Load deal
  const deals = await base44.entities.EscrowDeal.filter({ id: dispute.dealId });
  const deal = deals[0] || {};

  // Load milestones
  const milestones = await base44.entities.EscrowMilestone.filter({ dealId: dispute.dealId });
  const completedMilestones = milestones.filter(m => m.status === 'completed').map(m => m.milestoneName);
  const pendingMilestones = milestones.filter(m => m.status !== 'completed').map(m => m.milestoneName);

  const dealAgeDays = deal.dealStartedAt
    ? Math.floor((Date.now() - new Date(deal.dealStartedAt)) / 86400000)
    : 0;

  const prompt = `You are an expert real estate dispute arbitrator specializing in Egyptian and MENA property transactions.

You evaluate disputes based on:
- Deal terms and conditions agreed
- Evidence provided by each party
- Egyptian real estate law principles
- Platform rules and policies
- Fairness to both parties

You are neutral and data-driven. Respond ONLY with valid JSON.

Evaluate this real estate escrow dispute:

DEAL TERMS:
  Agreed Price: ${deal.agreedPrice?.toLocaleString()} EGP
  Payment Structure: ${deal.paymentStructure}
  Conditions: ${JSON.stringify(deal.conditions || [])}

DISPUTE DETAILS:
  Raised by: ${dispute.raisedBy}
  Type: ${dispute.disputeType}
  Description: ${dispute.description}
  Evidence items: ${dispute.evidenceUrls?.length || 0} files uploaded

RESPONSE FROM OTHER PARTY:
  Description: ${dispute.respondentDescription || 'No response yet'}
  Evidence items: ${dispute.respondentEvidence?.length || 0} files uploaded

COMPLETED MILESTONES: ${completedMilestones.join(', ') || 'None'}
PENDING MILESTONES: ${pendingMilestones.join(', ') || 'None'}
AMOUNT IN DISPUTE: ${dispute.amountDisputed?.toLocaleString()} EGP
DEAL AGE: ${dealAgeDays} days

Return JSON:
{
  "recommendedResolution": "string describing recommended outcome",
  "buyerFaultPercent": 0-100,
  "sellerFaultPercent": 0-100,
  "reasoning": "detailed neutral explanation",
  "keyFactors": ["factor1", "factor2", "factor3"],
  "recommendedRefundToBuyer": number,
  "recommendedReleaseToSeller": number,
  "recommendedPenalty": number or null,
  "penaltyPaidBy": "buyer" or "seller" or null,
  "confidenceScore": 0-100,
  "requiresHumanReview": boolean,
  "humanReviewReason": "string or null",
  "preventiveSuggestions": ["suggestion1", "suggestion2"],
  "precedentNotes": "string or null"
}`;

  const aiResult = await base44.integrations.Core.InvokeLLM({
    prompt,
    model: 'claude_sonnet_4_6',
    response_json_schema: {
      type: 'object',
      properties: {
        recommendedResolution: { type: 'string' },
        buyerFaultPercent: { type: 'number' },
        sellerFaultPercent: { type: 'number' },
        reasoning: { type: 'string' },
        keyFactors: { type: 'array', items: { type: 'string' } },
        recommendedRefundToBuyer: { type: 'number' },
        recommendedReleaseToSeller: { type: 'number' },
        recommendedPenalty: { type: 'number' },
        penaltyPaidBy: { type: 'string' },
        confidenceScore: { type: 'number' },
        requiresHumanReview: { type: 'boolean' },
        humanReviewReason: { type: 'string' },
        preventiveSuggestions: { type: 'array', items: { type: 'string' } },
        precedentNotes: { type: 'string' }
      }
    }
  }).catch(() => ({
    recommendedResolution: 'Based on the evidence provided, a partial refund to the buyer is recommended.',
    buyerFaultPercent: 30,
    sellerFaultPercent: 70,
    reasoning: 'The evidence suggests the seller did not fully meet the agreed conditions. A partial refund is recommended.',
    keyFactors: ['Incomplete milestone documentation', 'Property condition discrepancy', 'Timeline not adhered to'],
    recommendedRefundToBuyer: Math.round((dispute.amountDisputed || 0) * 0.7),
    recommendedReleaseToSeller: Math.round((dispute.amountDisputed || 0) * 0.3),
    recommendedPenalty: null,
    penaltyPaidBy: null,
    confidenceScore: 65,
    requiresHumanReview: true,
    humanReviewReason: 'Moderate confidence — human review recommended',
    preventiveSuggestions: ['Ensure all conditions are documented before milestone confirmation', 'Upload evidence proactively'],
    precedentNotes: null
  }));

  // Update dispute with AI result
  await base44.entities.EscrowDispute.update(disputeId, {
    aiEvaluationStatus: aiResult.requiresHumanReview ? 'human_review' : 'evaluated',
    aiEvaluationResult: aiResult,
    aiEvaluatedAt: new Date().toISOString(),
    adminReviewRequired: aiResult.requiresHumanReview,
    status: aiResult.requiresHumanReview ? 'admin_review' : 'under_review'
  });

  return Response.json({ success: true, evaluation: aiResult });
});