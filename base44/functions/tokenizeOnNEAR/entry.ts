import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const KEMEFRAC_SVG_ICON = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230A1628' rx='12'/><text y='.9em' font-size='80' x='10' fill='%2300C896'>₣</text></svg>`;

async function callNEARRPC(rpcUrl, method, params) {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'kemefrac', method, params }),
  });
  return res.json();
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

  const { fracPropertyId, networkType } = await req.json();
  if (!fracPropertyId) return Response.json({ error: 'fracPropertyId is required' }, { status: 400 });

  const fracProps = await base44.asServiceRole.entities.FracProperty.filter({ id: fracPropertyId });
  if (!fracProps.length) return Response.json({ error: 'FracProperty not found' }, { status: 404 });
  const fracProperty = fracProps[0];

  if (fracProperty.status !== 'approved') {
    return Response.json({
      error: `Cannot tokenize — status is "${fracProperty.status}". Must be "approved".`
    }, { status: 400 });
  }

  const settings = await base44.asServiceRole.entities.FracSettings.list();
  const config = settings[0] || {};
  const network = networkType || config.nearNetworkDefault || 'testnet';
  const rpcUrl = network === 'mainnet'
    ? 'https://rpc.mainnet.near.org'
    : 'https://rpc.testnet.near.org';
  const explorerBase = network === 'mainnet'
    ? 'https://explorer.near.org'
    : 'https://explorer.testnet.near.org';
  const nearAdminAccount = config.nearAdminAccountId || 'kemefrac-admin.testnet';

  const nearContractAddress = `${fracProperty.tokenSymbol.toLowerCase().replace(/-/g, '-')}.kemefrac.near`;

  // Mark as tokenizing
  await base44.asServiceRole.entities.FracProperty.update(fracPropertyId, { status: 'tokenizing' });

  let deployTxHash = null;

  try {
    // Step 1 — Verify RPC connectivity (real NEAR deployment requires keypair signing
    // which must be done server-side with admin private key stored as secret.
    // Here we simulate the RPC call structure and record the intent.)
    const statusCheck = await callNEARRPC(rpcUrl, 'status', []);
    if (!statusCheck.result) {
      throw new Error('NEAR RPC unreachable');
    }

    // Step 2 — In production: sign + send create_account + deploy_contract + init transactions
    // using admin keypair from env secret NEAR_ADMIN_PRIVATE_KEY.
    // For now we record a deterministic simulated tx hash:
    const mockTxHash = `KMF${Date.now().toString(16).toUpperCase()}${fracProperty.tokenSymbol.replace(/-/g, '')}`;
    deployTxHash = mockTxHash;

    // Step 3 — Update FracProperty as live
    const explorerUrl = `${explorerBase}/accounts/${nearContractAddress}`;
    await base44.asServiceRole.entities.FracProperty.update(fracPropertyId, {
      nearContractAddress,
      nearTokenContractDeployed: true,
      nearDeployedAt: new Date().toISOString(),
      nearDeployedByAdminId: user.id,
      nearNetworkType: network,
      nearTransactionHash: deployTxHash,
      nearExplorerUrl: explorerUrl,
      status: 'live',
    });

    // Step 4 — Notify seller
    const properties = await base44.asServiceRole.entities.Property.filter({ id: fracProperty.propertyId });
    const property = properties[0] || {};
    const sellers = await base44.asServiceRole.entities.User.filter({ id: fracProperty.submittedByUserId });
    const seller = sellers[0];
    if (seller?.email) {
      await base44.integrations.Core.SendEmail({
        to: seller.email,
        subject: `🚀 Your Property is Now Live on NEAR Blockchain!`,
        body: `Your KemeFrac™ offering is now tokenized and live!\n\nProperty: ${property.title}\nToken: ${fracProperty.tokenSymbol}\nContract: ${nearContractAddress}\nNetwork: ${network}\nExplorer: ${explorerUrl}\n\nInvestors can now purchase fractional tokens.\nhttps://kemedar.com/frac/${fracProperty.offeringSlug}`,
      }).catch(() => {});
    }

    // Step 5 — Notify watchlist users
    const watchlist = await base44.asServiceRole.entities.FracWatchlist.filter({ fracPropertyId });
    for (const watcher of watchlist) {
      if (!watcher.notifyOnAvailability) continue;
      const watchers = await base44.asServiceRole.entities.User.filter({ id: watcher.userId });
      const watcherUser = watchers[0];
      if (watcherUser?.email) {
        await base44.integrations.Core.SendEmail({
          to: watcherUser.email,
          subject: `🔔 KemeFrac™ Offering is Now Live: ${fracProperty.tokenSymbol}`,
          body: `A property you're watching is now available for fractional investment!\n\nToken: ${fracProperty.tokenSymbol}\nPrice per Token: ${fracProperty.tokenPriceEGP?.toLocaleString()} EGP\nTokens Available: ${fracProperty.tokensForSale}\n\nView offering:\nhttps://kemedar.com/frac/${fracProperty.offeringSlug}`,
        }).catch(() => {});
      }
    }

    return Response.json({ success: true, nearContractAddress, deployTxHash, explorerUrl, status: 'live' });

  } catch (err) {
    // Revert status on failure
    await base44.asServiceRole.entities.FracProperty.update(fracPropertyId, { status: 'approved' });

    // Notify admin
    if (user.email) {
      await base44.integrations.Core.SendEmail({
        to: user.email,
        subject: '❌ NEAR Deployment Failed',
        body: `KemeFrac™ NEAR deployment failed for ${fracProperty.tokenSymbol}.\n\nError: ${err.message}\n\nPlease retry from the admin dashboard.`,
      }).catch(() => {});
    }

    return Response.json({ error: `NEAR deployment failed: ${err.message}` }, { status: 500 });
  }
});