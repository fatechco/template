import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const GRADE_THRESHOLDS = {
  Platinum: 850, Gold: 700, Silver: 550, Bronze: 400, Starter: 200, Restricted: 0
};

function getGrade(score) {
  if (score >= 850) return "Platinum";
  if (score >= 700) return "Gold";
  if (score >= 550) return "Silver";
  if (score >= 400) return "Bronze";
  if (score >= 200) return "Starter";
  return "Restricted";
}

function getPercentile(score) {
  if (score >= 850) return 5;
  if (score >= 700) return 20;
  if (score >= 550) return 40;
  if (score >= 400) return 65;
  if (score >= 200) return 85;
  return 100;
}

const EVENT_POINTS = {
  // Positive
  identity_verified: { points: 30, dimension: "verificationLevel" },
  phone_verified: { points: 20, dimension: "verificationLevel" },
  email_verified: { points: 10, dimension: "verificationLevel" },
  national_id_verified: { points: 50, dimension: "verificationLevel" },
  address_verified: { points: 40, dimension: "verificationLevel" },
  property_deed_verified: { points: 60, dimension: "sellerVerification" },
  bank_statement_uploaded: { points: 40, dimension: "financialReadiness" },
  pre_approval_uploaded: { points: 60, dimension: "financialReadiness" },
  escrow_account_created: { points: 30, dimension: "financialReadiness" },
  escrow_first_deposit: { points: 60, dimension: "financialReadiness" },
  escrow_kyc_standard: { points: 30, dimension: "verificationLevel" },
  escrow_kyc_enhanced: { points: 20, dimension: "verificationLevel" },
  escrow_deal_completed: { points: 60, dimension: "transactionHistory" },
  listing_published: { points: 10, dimension: "listingQuality" },
  vision_score_excellent: { points: 40, dimension: "listingQuality" },
  offer_made_followed_through: { points: 30, dimension: "platformBehavior" },
  offer_accepted_no_withdrawal: { points: 20, dimension: "platformBehavior" },
  response_within_1hr: { points: 5, dimension: "responseBehavior" },
  community_verified_resident: { points: 50, dimension: "communityStanding" },
  review_received_5star: { points: 25, dimension: "transactionHistory" },
  job_completed_on_time: { points: 20, dimension: "jobCompletion" },
  dispute_resolved_in_favor: { points: 30, dimension: "platformBehavior" },
  match_converted_to_deal: { points: 20, dimension: "platformBehavior" },
  advisor_profile_complete: { points: 20, dimension: "verificationLevel" },
  fo_assessment_submitted: { points: 20, dimension: "platformBehavior" },
  community_review_written: { points: 20, dimension: "communityStanding" },
  recommendation_helpful: { points: 2, dimension: "communityStanding" },
  long_term_platform_member: { points: 25, dimension: "platformBehavior" },
  multiple_deals_completed: { points: 25, dimension: "transactionHistory" },
  deal_completed: { points: 50, dimension: "transactionHistory" },
  viewing_attended: { points: 10, dimension: "platformBehavior" },
  negotiation_completed: { points: 20, dimension: "platformBehavior" },
  profile_completed: { points: 20, dimension: "verificationLevel" },
  fo_area_assessment: { points: 20, dimension: "platformBehavior" },
  expat_deal_closed: { points: 40, dimension: "transactionHistory" },
  management_review_received: { points: 25, dimension: "clientRatings" },
  // Negative
  offer_withdrawn_no_reason: { points: -40, dimension: "platformBehavior", decays: true },
  viewing_no_show: { points: -25, dimension: "platformBehavior", decays: true },
  response_ignored_48hrs: { points: -15, dimension: "responseBehavior", decays: true },
  listing_inaccuracy_reported: { points: -60, dimension: "listingQuality", decays: true },
  dispute_raised_against: { points: -20, dimension: "platformBehavior", decays: true },
  dispute_lost: { points: -50, dimension: "platformBehavior", decays: true },
  escrow_deal_cancelled_buyer_fault: { points: -60, dimension: "platformBehavior", decays: true },
  job_cancelled_professional: { points: -40, dimension: "jobCompletion", decays: true },
  fake_listing_confirmed: { points: -150, dimension: "listingQuality", decays: false },
  review_flagged_as_fake: { points: -50, dimension: "communityStanding", decays: true },
  community_post_removed: { points: -20, dimension: "communityStanding", decays: true },
  payment_default: { points: -60, dimension: "financialReadiness", decays: true },
  account_warning_issued: { points: -10, dimension: "platformBehavior", decays: true },
  report_confirmed_valid: { points: -30, dimension: "platformBehavior", decays: true },
};

const DIMENSION_CAPS = {
  financialReadiness: 300,
  platformBehavior: 250,
  verificationLevel: 250,
  communityStanding: 200,
  listingQuality: 300,
  transactionHistory: 300,
  responseBehavior: 200,
  sellerVerification: 200,
  jobCompletion: 350,
  clientRatings: 300,
  professionalVerification: 200,
  professionalBehavior: 150,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const targetUserId = body.userId || user.id;

    // Fetch all score events for user
    const events = await base44.asServiceRole.entities.ScoreEvent.filter({ userId: targetUserId });

    // Calculate dimension scores
    const dimensions = {};
    const now = new Date();

    for (const event of events) {
      const eventConfig = EVENT_POINTS[event.eventType];
      if (!eventConfig) continue;

      const dim = eventConfig.dimension || event.dimensionAffected;
      if (!dim) continue;

      let points = eventConfig.points ?? event.scoreImpact ?? 0;

      // Apply decay for old negative events
      if (points < 0 && event.decaysAt) {
        const decayDate = new Date(event.decaysAt);
        if (now >= decayDate) continue; // Fully decayed

        // Half-decay check (6 months = 180 days)
        const createdDate = new Date(event.created_date);
        const monthsOld = (now - createdDate) / (1000 * 60 * 60 * 24 * 30);
        if (monthsOld >= 6) points = Math.round(points / 2);
      }

      dimensions[dim] = (dimensions[dim] || 0) + points;
    }

    // Apply caps and floor at 0
    for (const [dim, cap] of Object.entries(DIMENSION_CAPS)) {
      dimensions[dim] = Math.max(0, Math.min(dimensions[dim] || 0, cap));
    }

    // Get existing score record
    const existing = await base44.asServiceRole.entities.KemedarScore.filter({ userId: targetUserId });
    const existingScore = existing[0];
    const prevScore = existingScore?.overallScore || 0;

    // Calculate role-based composite scores
    const role = existingScore?.primaryRole || body.primaryRole || "buyer";
    let buyerScore = null, sellerScore = null, professionalScore = null;

    if (["buyer", "agent", "developer", "franchise_owner"].includes(role)) {
      buyerScore = (dimensions.financialReadiness || 0) +
        (dimensions.platformBehavior || 0) +
        (dimensions.verificationLevel || 0) +
        (dimensions.communityStanding || 0);
    }

    if (["seller", "agent", "developer"].includes(role)) {
      sellerScore = (dimensions.listingQuality || 0) +
        (dimensions.transactionHistory || 0) +
        (dimensions.responseBehavior || 0) +
        (dimensions.sellerVerification || 0);
    }

    if (["professional", "seller_kemetro"].includes(role)) {
      professionalScore = (dimensions.jobCompletion || 0) +
        (dimensions.clientRatings || 0) +
        (dimensions.professionalVerification || 0) +
        (dimensions.professionalBehavior || 0);
    }

    // Overall score is max of applicable role scores
    const overallScore = Math.min(1000, Math.max(
      buyerScore || 0,
      sellerScore || 0,
      professionalScore || 0
    ));

    const overallGrade = getGrade(overallScore);
    const scoreChange = overallScore - prevScore;
    const scoreTrend = scoreChange > 10 ? "rising" : scoreChange < -10 ? "falling" : "stable";
    const percentile = getPercentile(overallScore);

    // Generate shareable token if doesn't exist
    const shareableToken = existingScore?.shareableScoreToken ||
      Math.random().toString(36).substring(2, 14).toUpperCase();

    const scoreData = {
      userId: targetUserId,
      overallScore,
      overallGrade,
      previousScore: prevScore,
      scoreChange,
      scoreTrend,
      buyerScore,
      sellerScore,
      professionalScore,
      ...dimensions,
      percentile,
      lastCalculated: now.toISOString(),
      nextScheduledCalc: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      calculationVersion: "1.0",
      shareableScoreToken: shareableToken,
    };

    let savedScore;
    if (existingScore) {
      savedScore = await base44.asServiceRole.entities.KemedarScore.update(existingScore.id, scoreData);
    } else {
      savedScore = await base44.asServiceRole.entities.KemedarScore.create(scoreData);
    }

    return Response.json({ success: true, score: savedScore, percentile });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});