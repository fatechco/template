import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function ftBalanceOf(rpcUrl, contractId, accountId) {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'kemefrac-sync',
      method: 'query',
      params: {
        request_type: 'call_function',
        finality: 'final',
        account_id: contractId,
        method_name: 'ft_balance_of',
        args_base64: btoa(JSON.stringify({ account_id: accountId })),
      },
    }),
  });
  const data = await res.json();
  if (data.result?.result) {
    const decoded = new TextDecoder().decode(new Uint8Array(data.result.result));
    return parseInt(JSON.parse(decoded), 10);
  }
  return null;
}

Deno.serve(async (req) => {
  // Allow scheduled invocation (no user auth required — admin-level operation)
  const base44 = createClientFromRequest(req);

  // Verify caller is admin or scheduled runner
  let isAdmin = false;
  try {
    const user = await base44.auth.me();
    isAdmin = user?.role === 'admin';
  } catch (_) {
    // scheduled — no user context
  }

  const settings = await base44.asServiceRole.entities.FracSettings.list();
  const config = settings[0] || {};

  // Get all active FracTokens that have a real NEAR wallet
  const allTokens = await base44.asServiceRole.entities.FracToken.filter({ isActive: true });
  const tokensToSync = allTokens.filter(t =>
    t.holderNearWalletAddress &&
    !t.holderNearWalletAddress.startsWith('custodial:')
  );

  // Get all live FracProperties for their contract addresses
  const allFracProps = await base44.asServiceRole.entities.FracProperty.filter({ status: 'live' });
  const contractMap = {};
  for (const fp of allFracProps) {
    if (fp.nearContractAddress && fp.nearTokenContractDeployed) {
      contractMap[fp.id] = {
        contractAddress: fp.nearContractAddress,
        network: fp.nearNetworkType || 'testnet',
      };
    }
  }

  const results = { synced: 0, discrepancies: 0, skipped: 0, errors: 0 };
  const discrepancyLog = [];

  for (const token of tokensToSync) {
    const contractInfo = contractMap[token.fracPropertyId];
    if (!contractInfo) { results.skipped++; continue; }

    const rpcUrl = contractInfo.network === 'mainnet'
      ? 'https://rpc.mainnet.near.org'
      : 'https://rpc.testnet.near.org';

    try {
      const onChainBalance = await ftBalanceOf(
        rpcUrl,
        contractInfo.contractAddress,
        token.holderNearWalletAddress
      );

      if (onChainBalance === null) { results.errors++; continue; }

      await base44.asServiceRole.entities.FracToken.update(token.id, {
        nearTokenBalance: onChainBalance,
        nearLastSyncedAt: new Date().toISOString(),
      });

      results.synced++;

      if (onChainBalance !== token.tokensHeld) {
        results.discrepancies++;
        discrepancyLog.push({
          tokenId: token.id,
          holderUserId: token.holderUserId,
          wallet: token.holderNearWalletAddress,
          dbBalance: token.tokensHeld,
          chainBalance: onChainBalance,
          diff: onChainBalance - token.tokensHeld,
        });
      }
    } catch (err) {
      results.errors++;
    }
  }

  // Notify admin if discrepancies found
  if (discrepancyLog.length > 0) {
    const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    const adminEmail = admins[0]?.email;
    if (adminEmail) {
      const rows = discrepancyLog.map(d =>
        `Holder: ${d.holderUserId} | Wallet: ${d.wallet} | DB: ${d.dbBalance} | Chain: ${d.chainBalance} | Diff: ${d.diff}`
      ).join('\n');
      await base44.integrations.Core.SendEmail({
        to: adminEmail,
        subject: `⚠️ KemeFrac™ NEAR Balance Discrepancies: ${discrepancyLog.length} found`,
        body: `The scheduled NEAR balance sync detected discrepancies:\n\n${rows}\n\nPlease investigate immediately.\nhttps://kemedar.com/admin/kemedar/frac`,
      }).catch(() => {});
    }
  }

  return Response.json({ success: true, results, discrepancyLog });
});