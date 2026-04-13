import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

  const { fracPropertyId, period, totalYieldAmountEGP, distributionDate } = await req.json();

  if (!fracPropertyId || !period || !totalYieldAmountEGP || !distributionDate) {
    return Response.json({ error: 'fracPropertyId, period, totalYieldAmountEGP, and distributionDate are required' }, { status: 400 });
  }

  const fracProps = await base44.asServiceRole.entities.FracProperty.filter({ id: fracPropertyId });
  if (!fracProps.length) return Response.json({ error: 'FracProperty not found' }, { status: 404 });
  const fp = fracProps[0];

  // Get all active token holders
  const allTokens = await base44.asServiceRole.entities.FracToken.filter({ fracPropertyId, isActive: true });
  if (!allTokens.length) return Response.json({ error: 'No active token holders found' }, { status: 400 });

  const yieldPerTokenEGP = Math.round((totalYieldAmountEGP / fp.tokensForSale) * 10000) / 10000;

  // Create distribution record
  const distribution = await base44.asServiceRole.entities.FracYieldDistribution.create({
    fracPropertyId,
    distributionPeriod: period,
    totalYieldAmountEGP,
    totalTokensEligible: fp.tokensSold || 0,
    yieldPerTokenEGP,
    distributionDate,
    distributionStatus: 'processing',
    recipientsCount: allTokens.length,
    initiatedByAdminId: user.id,
    payoutRecords: [],
    notes: '',
  });

  const payoutRecords = [];
  let failCount = 0;

  for (const token of allTokens) {
    const holderYield = Math.round(token.tokensHeld * yieldPerTokenEGP * 100) / 100;
    if (holderYield <= 0) continue;

    const yieldTxHash = `KMF-YLD-${Date.now().toString(16).toUpperCase()}-${token.holderUserId.slice(0, 6)}`;

    // Create yield transaction
    await base44.asServiceRole.entities.FracTransaction.create({
      fracPropertyId,
      transactionType: 'yield_paid',
      fromUserId: fp.submittedByUserId,
      toUserId: token.holderUserId,
      tokensAmount: 0,
      pricePerTokenEGP: 0,
      totalAmountEGP: holderYield,
      platformFeeEGP: 0,
      nearTransactionHash: yieldTxHash,
      nearConfirmed: true,
      nearConfirmedAt: new Date().toISOString(),
      paymentMethod: 'wallet',
      status: 'confirmed',
      notes: `Yield distribution for ${period}`,
    }).catch(() => { failCount++; });

    // Notify holder
    const holderUsers = await base44.asServiceRole.entities.User.filter({ id: token.holderUserId });
    const holderUser = holderUsers[0];
    if (holderUser?.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: holderUser.email,
        subject: `💰 KemeFrac™ Yield Received: ${holderYield.toLocaleString()} EGP`,
        body: `Your yield distribution has been credited!\n\nToken: ${fp.tokenSymbol}\nPeriod: ${period}\nTokens Held: ${token.tokensHeld}\nYield per Token: ${yieldPerTokenEGP} EGP\nTotal Yield: ${holderYield.toLocaleString()} EGP\n\nView your portfolio:\nhttps://kemedar.com/dashboard/frac`,
      }).catch(() => {});
    }

    payoutRecords.push({
      userId: token.holderUserId,
      tokensHeld: token.tokensHeld,
      yieldAmountEGP: holderYield,
      paidAt: new Date().toISOString(),
      nearTxHash: yieldTxHash,
    });
  }

  // Finalize distribution
  const finalStatus = failCount === 0 ? 'completed' : 'failed';
  await base44.asServiceRole.entities.FracYieldDistribution.update(distribution.id, {
    distributionStatus: finalStatus,
    completedAt: new Date().toISOString(),
    payoutRecords,
    recipientsCount: payoutRecords.length,
  });

  return Response.json({
    success: true,
    status: finalStatus,
    recipientsCount: payoutRecords.length,
    yieldPerTokenEGP,
    totalDistributed: payoutRecords.reduce((s, r) => s + r.yieldAmountEGP, 0),
    failCount,
  });
});