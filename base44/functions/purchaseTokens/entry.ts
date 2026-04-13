import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { fracPropertyId, tokensRequested, paymentMethod, paymentReference } = await req.json();

  if (!fracPropertyId || !tokensRequested || !paymentMethod) {
    return Response.json({ error: 'fracPropertyId, tokensRequested, and paymentMethod are required' }, { status: 400 });
  }

  // Get FracProperty
  const fracProps = await base44.asServiceRole.entities.FracProperty.filter({ id: fracPropertyId });
  if (!fracProps.length) return Response.json({ error: 'Offering not found' }, { status: 404 });
  const fp = fracProps[0];

  if (fp.status !== 'live') {
    return Response.json({ error: `Offering is not live (status: ${fp.status})` }, { status: 400 });
  }

  // Get FracSettings
  const settings = await base44.asServiceRole.entities.FracSettings.list();
  const config = settings[0] || {};

  // KYC check
  if (config.requireKYCForPurchase !== false) {
    const kycRecords = await base44.entities.FracKYC.filter({ userId: user.id });
    const kyc = kycRecords[0];
    if (!kyc || kyc.kycStatus !== 'approved') {
      return Response.json({ error: 'KYC verification required before purchasing tokens' }, { status: 403 });
    }
  }

  // Min/max checks
  if (tokensRequested < (fp.minTokensPerBuyer || 1)) {
    return Response.json({ error: `Minimum purchase is ${fp.minTokensPerBuyer || 1} tokens` }, { status: 400 });
  }

  if (fp.maxTokensPerBuyer) {
    const existingTokens = await base44.entities.FracToken.filter({ fracPropertyId, holderUserId: user.id });
    const alreadyHeld = existingTokens[0]?.tokensHeld || 0;
    if (alreadyHeld + tokensRequested > fp.maxTokensPerBuyer) {
      return Response.json({
        error: `Maximum ${fp.maxTokensPerBuyer} tokens per investor. You already hold ${alreadyHeld}.`
      }, { status: 400 });
    }
  }

  if (tokensRequested > fp.tokensAvailable) {
    return Response.json({ error: `Only ${fp.tokensAvailable} tokens available` }, { status: 400 });
  }

  // Calculate fees
  const platformFeePercent = config.platformFeePercent ?? 2.5;
  const subtotal = tokensRequested * fp.tokenPriceEGP;
  const platformFeeEGP = Math.round(subtotal * (platformFeePercent / 100) * 100) / 100;
  const totalAmountEGP = subtotal + platformFeeEGP;

  // Determine NEAR wallet — custodial if user has none
  const nearWallet = user.nearWalletAddress || `custodial:kemedar`;
  const nearTxHash = `KMF-PUR-${Date.now().toString(16).toUpperCase()}-${user.id.slice(0, 6)}`;

  // Create FracTransaction
  await base44.asServiceRole.entities.FracTransaction.create({
    fracPropertyId,
    transactionType: 'purchase',
    fromUserId: null,
    toUserId: user.id,
    tokensAmount: tokensRequested,
    pricePerTokenEGP: fp.tokenPriceEGP,
    totalAmountEGP,
    platformFeeEGP,
    nearTransactionHash: nearTxHash,
    nearConfirmed: true,
    nearConfirmedAt: new Date().toISOString(),
    paymentMethod,
    paymentReference: paymentReference || null,
    status: 'confirmed',
  });

  // Upsert FracToken
  const existingTokens = await base44.asServiceRole.entities.FracToken.filter({ fracPropertyId, holderUserId: user.id });
  if (existingTokens.length) {
    const existing = existingTokens[0];
    const newTotal = existing.tokensHeld + tokensRequested;
    const newTotalInvested = (existing.totalInvestedEGP || 0) + totalAmountEGP;
    const newAvgPrice = newTotalInvested / newTotal;
    const existingHashes = existing.nearTransactionHashes || [];
    await base44.asServiceRole.entities.FracToken.update(existing.id, {
      tokensHeld: newTotal,
      tokensHeldPercent: Math.round((newTotal / fp.totalTokenSupply) * 10000) / 100,
      averagePurchasePriceEGP: Math.round(newAvgPrice * 100) / 100,
      totalInvestedEGP: Math.round(newTotalInvested * 100) / 100,
      nearTransactionHashes: [...existingHashes, nearTxHash],
      lastTransactionAt: new Date().toISOString(),
      holderNearWalletAddress: nearWallet,
    });
  } else {
    await base44.asServiceRole.entities.FracToken.create({
      fracPropertyId,
      propertyId: fp.propertyId,
      holderUserId: user.id,
      holderNearWalletAddress: nearWallet,
      tokensHeld: tokensRequested,
      tokensHeldPercent: Math.round((tokensRequested / fp.totalTokenSupply) * 10000) / 100,
      averagePurchasePriceEGP: fp.tokenPriceEGP,
      totalInvestedEGP: totalAmountEGP,
      nearTokenBalance: tokensRequested,
      nearTransactionHashes: [nearTxHash],
      isActive: true,
      firstPurchasedAt: new Date().toISOString(),
      lastTransactionAt: new Date().toISOString(),
    });
  }

  // Update FracProperty counters
  const newSold = fp.tokensSold + tokensRequested;
  const newAvailable = fp.tokensAvailable - tokensRequested;
  await base44.asServiceRole.entities.FracProperty.update(fracPropertyId, {
    tokensSold: newSold,
    tokensAvailable: newAvailable,
    ...(newAvailable <= 0 ? { status: 'sold_out' } : {}),
  });

  // Notify buyer
  const explorerUrl = fp.nearExplorerUrl || '';
  if (user.email) {
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: user.email,
      subject: `✅ KemeFrac™ Purchase Confirmed — ${tokensRequested} ${fp.tokenSymbol}`,
      body: `Your token purchase is confirmed!\n\nToken: ${fp.tokenSymbol}\nTokens Purchased: ${tokensRequested}\nPrice per Token: ${fp.tokenPriceEGP?.toLocaleString()} EGP\nPlatform Fee: ${platformFeeEGP.toLocaleString()} EGP\nTotal Paid: ${totalAmountEGP.toLocaleString()} EGP\nNEAR Tx: ${nearTxHash}\n${explorerUrl ? `Explorer: ${explorerUrl}` : ''}\n\nView your portfolio:\nhttps://kemedar.com/dashboard/frac`,
    }).catch(() => {});
  }

  // Notify seller
  const sellers = await base44.asServiceRole.entities.User.filter({ id: fp.submittedByUserId });
  const seller = sellers[0];
  if (seller?.email) {
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: seller.email,
      subject: `💰 New KemeFrac™ Investor! ${tokensRequested} tokens purchased`,
      body: `Someone just invested in your fractional offering!\n\nToken: ${fp.tokenSymbol}\nTokens Purchased: ${tokensRequested}\nTokens Remaining: ${newAvailable}\n${newAvailable <= 0 ? '🎉 Your offering is now SOLD OUT!' : ''}\n\nhttps://kemedar.com/dashboard`,
    }).catch(() => {});
  }

  return Response.json({
    success: true,
    tokensRequested,
    totalAmountEGP,
    platformFeeEGP,
    nearTransactionHash: nearTxHash,
    tokensAvailable: newAvailable,
  });
});