import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const EVENT_POINTS = {
  identity_verified: 30, phone_verified: 20, email_verified: 10,
  national_id_verified: 50, address_verified: 40,
  property_deed_verified: 60, bank_statement_uploaded: 40,
  pre_approval_uploaded: 60, escrow_account_created: 30,
  escrow_first_deposit: 60, escrow_kyc_standard: 30, escrow_kyc_enhanced: 20,
  escrow_deal_completed: 60, listing_published: 10, vision_score_excellent: 40,
  offer_made_followed_through: 30, offer_accepted_no_withdrawal: 20,
  response_within_1hr: 5, community_verified_resident: 50,
  review_received_5star: 25, job_completed_on_time: 20,
  dispute_resolved_in_favor: 30, match_converted_to_deal: 20,
  advisor_profile_complete: 20, fo_assessment_submitted: 20,
  community_review_written: 20, recommendation_helpful: 2,
  long_term_platform_member: 25, multiple_deals_completed: 25,
  deal_completed: 50, viewing_attended: 10, negotiation_completed: 20,
  profile_completed: 20, fo_area_assessment: 20,
  expat_deal_closed: 40, management_review_received: 25,
  // Negative
  offer_withdrawn_no_reason: -40, viewing_no_show: -25,
  response_ignored_48hrs: -15, listing_inaccuracy_reported: -60,
  dispute_raised_against: -20, dispute_lost: -50,
  escrow_deal_cancelled_buyer_fault: -60, job_cancelled_professional: -40,
  fake_listing_confirmed: -150, review_flagged_as_fake: -50,
  community_post_removed: -20, payment_default: -60,
  account_warning_issued: -10, report_confirmed_valid: -30,
};

const NEGATIVE_EVENTS = new Set([
  "offer_withdrawn_no_reason", "viewing_no_show", "response_ignored_48hrs",
  "listing_inaccuracy_reported", "dispute_raised_against", "dispute_lost",
  "escrow_deal_cancelled_buyer_fault", "job_cancelled_professional",
  "review_flagged_as_fake", "community_post_removed", "payment_default",
  "account_warning_issued", "report_confirmed_valid",
]);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { eventType, relatedEntityType, relatedEntityId, description, descriptionAr, targetUserId } = body;

    if (!eventType) return Response.json({ error: 'eventType required' }, { status: 400 });

    const userId = targetUserId || user.id;
    const scoreImpact = EVENT_POINTS[eventType] || 0;
    const isNegative = NEGATIVE_EVENTS.has(eventType);

    // Calculate decay date for negative events
    let decaysAt = null;
    if (isNegative && eventType !== "fake_listing_confirmed") {
      decaysAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    // Get current score
    const scores = await base44.asServiceRole.entities.KemedarScore.filter({ userId });
    const currentScore = scores[0];

    const eventData = {
      userId,
      scoreId: currentScore?.id || null,
      eventType,
      scoreImpact,
      dimensionAffected: body.dimensionAffected || null,
      previousScore: currentScore?.overallScore || 0,
      newScore: Math.max(0, Math.min(1000, (currentScore?.overallScore || 0) + scoreImpact)),
      relatedEntityType: relatedEntityType || null,
      relatedEntityId: relatedEntityId || null,
      description: description || eventType.replace(/_/g, ' '),
      descriptionAr: descriptionAr || null,
      isVisible: true,
      isDecaying: isNegative,
      decaysAt,
    };

    const event = await base44.asServiceRole.entities.ScoreEvent.create(eventData);

    // Trigger recalculation
    await base44.asServiceRole.functions.invoke('calculateKemedarScore', { userId });

    return Response.json({ success: true, event, scoreImpact });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});