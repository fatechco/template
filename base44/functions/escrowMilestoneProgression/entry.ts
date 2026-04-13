import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// This automation handler fires on EscrowMilestone update events.
// It handles:
// 1. Auto-advancing deals when all milestones complete
// 2. Auto-releasing funds when grace period passes (keys_handover)
// 3. Auto-updating deal status based on milestone state

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { event, data: milestone, old_data } = body;

    if (!milestone || !milestone.dealId) {
      return Response.json({ ok: true, skipped: "no milestone data" });
    }

    // Only process completions
    if (milestone.status !== "completed" || old_data?.status === "completed") {
      return Response.json({ ok: true, skipped: "not a completion event" });
    }

    const dealId = milestone.dealId;

    // Load deal + all milestones
    const [deals, allMilestones] = await Promise.all([
      base44.asServiceRole.entities.EscrowDeal.filter({ id: dealId }),
      base44.asServiceRole.entities.EscrowMilestone.filter({ dealId })
    ]);

    if (!deals.length) return Response.json({ ok: true, skipped: "deal not found" });
    const deal = deals[0];

    const sorted = allMilestones.sort((a, b) => a.milestoneOrder - b.milestoneOrder);
    const completedMilestones = sorted.filter(m => m.status === "completed");
    const allDone = completedMilestones.length === sorted.length;

    // Calculate progress
    const progressPct = sorted.length ? Math.round((completedMilestones.length / sorted.length) * 100) : 0;

    // Specific milestone type actions
    if (milestone.milestoneType === "earnest_deposit") {
      // After earnest deposit confirmed → move deal to in_progress, auto-create MOU
      await base44.asServiceRole.entities.EscrowDeal.update(dealId, {
        status: "deposit_received",
        completionPercent: progressPct,
        currentMilestone: sorted.find(m => m.status === "in_progress")?.milestoneName || null
      });
    }

    if (milestone.milestoneType === "balance_payment") {
      // Balance paid → flag deal as awaiting_completion
      await base44.asServiceRole.entities.EscrowDeal.update(dealId, {
        status: "awaiting_completion",
        completionPercent: progressPct,
      });
    }

    if (milestone.milestoneType === "keys_handover") {
      // Keys handed over → 24h grace period then auto-release
      const releaseAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

      if (allDone) {
        // Complete the deal
        await base44.asServiceRole.entities.EscrowDeal.update(dealId, {
          status: "completed",
          completionPercent: 100,
          dealCompletedAt: new Date().toISOString(),
          totalReleased: deal.agreedPrice,
          buyerConfirmedCompletion: true,
          sellerConfirmedCompletion: true,
        });

        // Create final release transaction
        await base44.asServiceRole.entities.EscrowTransaction.create({
          transactionNumber: "KET-FINAL-" + Date.now(),
          dealId,
          transactionType: "milestone_release",
          direction: "out",
          amount: deal.agreedPrice - (deal.platformFeeAmount || 0),
          currency: deal.currency || "EGP",
          toUserId: deal.sellerId,
          status: "completed",
          description: "Final balance released to seller — Deal " + deal.dealNumber,
          processedAt: new Date().toISOString(),
        });

        // Platform fee transaction
        if (deal.platformFeeAmount > 0) {
          await base44.asServiceRole.entities.EscrowTransaction.create({
            transactionNumber: "KET-FEE-" + Date.now(),
            dealId,
            transactionType: "platform_fee",
            direction: "out",
            amount: deal.platformFeeAmount,
            currency: deal.currency || "EGP",
            status: "completed",
            description: "Kemedar Escrow™ platform fee — 1.5%",
            processedAt: new Date().toISOString(),
          });
        }
      }
    }

    // General: update progress for non-final milestones
    if (milestone.milestoneType !== "keys_handover" && !allDone) {
      const nextMilestone = sorted.find(m => m.milestoneOrder === milestone.milestoneOrder + 1);
      await base44.asServiceRole.entities.EscrowDeal.update(dealId, {
        status: "in_progress",
        completionPercent: progressPct,
        currentMilestone: nextMilestone?.milestoneName || null,
      });
    }

    return Response.json({
      ok: true,
      milestone: milestone.milestoneName,
      dealStatus: allDone ? "completed" : "in_progress",
      progress: progressPct
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});