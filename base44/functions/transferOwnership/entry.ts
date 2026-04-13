import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { tokenId, fromUserId, toUserId, dealId, salePrice } = await req.json();

  if (!tokenId || !fromUserId || !toUserId || !dealId) {
    return Response.json({ error: 'tokenId, fromUserId, toUserId, dealId are required' }, { status: 400 });
  }

  // Validate SmartContractDeal (using NegotiationSession as proxy for deal)
  const deals = await base44.asServiceRole.entities.NegotiationSession.filter({ id: dealId });
  const deal = deals?.[0];
  if (!deal) {
    return Response.json({ error: 'Deal not found' }, { status: 404 });
  }
  if (deal.status !== 'deal_closed' && deal.status !== 'accepted') {
    return Response.json({ error: 'Transfer blocked: deal status invalid' }, { status: 400 });
  }

  // Get current token
  const tokens = await base44.asServiceRole.entities.PropertyToken.filter({ id: tokenId });
  const token = tokens?.[0];
  if (!token) {
    return Response.json({ error: 'PropertyToken not found' }, { status: 404 });
  }

  const transferHash = await sha256(tokenId + fromUserId + toUserId + dealId + Date.now().toString());
  const transferRecord = {
    fromUserId,
    toUserId,
    transferDate: new Date().toISOString(),
    dealId,
    transactionHash: transferHash,
  };

  // Update PropertyToken
  const existingHistory = token.transferHistory || [];
  await base44.asServiceRole.entities.PropertyToken.update(tokenId, {
    currentOwnerUserId: toUserId,
    transferHistory: [...existingHistory, transferRecord],
  });

  // Update old owner wallet — remove token
  const fromWallets = await base44.asServiceRole.entities.BlockchainWallet.filter({ userId: fromUserId });
  if (fromWallets?.[0]) {
    const fromWallet = fromWallets[0];
    await base44.asServiceRole.entities.BlockchainWallet.update(fromWallet.id, {
      ownedTokenIds: (fromWallet.ownedTokenIds || []).filter(id => id !== tokenId),
      totalTransactions: (fromWallet.totalTransactions || 0) + 1,
    });
  }

  // Update new owner wallet — add token
  const toWallets = await base44.asServiceRole.entities.BlockchainWallet.filter({ userId: toUserId });
  if (toWallets?.[0]) {
    const toWallet = toWallets[0];
    await base44.asServiceRole.entities.BlockchainWallet.update(toWallet.id, {
      ownedTokenIds: [...(toWallet.ownedTokenIds || []), tokenId],
      totalTransactions: (toWallet.totalTransactions || 0) + 1,
    });
  }

  // Append verification record
  await base44.asServiceRole.functions.invoke('appendVerificationRecord', {
    tokenId,
    recordType: 'ownership_transferred',
    actorType: 'system',
    actorLabel: 'System',
    title: 'Ownership transferred to new owner',
    details: `Property token transferred from user ${fromUserId} to user ${toUserId} via deal ${dealId}.`,
    metaData: { fromUserId, toUserId, salePrice, dealId, transactionHash: transferHash },
  });

  // Update deal status
  await base44.asServiceRole.entities.NegotiationSession.update(dealId, {
    status: 'deal_closed',
  });

  // Trigger certificate issuance for new owner
  await base44.asServiceRole.functions.invoke('issueCertificate', { tokenId, issuedByAdminId: 'system' });

  return Response.json({ success: true, transactionHash: transferHash });
});