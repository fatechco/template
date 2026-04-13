import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Simple sha256 using Web Crypto API
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { propertyId, sellerUserId } = await req.json();

  if (!propertyId || !sellerUserId) {
    return Response.json({ error: 'propertyId and sellerUserId are required' }, { status: 400 });
  }

  // Check if token already exists for this property
  const existing = await base44.asServiceRole.entities.PropertyToken.filter({ propertyId });
  if (existing && existing.length > 0) {
    return Response.json({ token: existing[0], alreadyExisted: true });
  }

  // Generate tokenId
  const tokenId = `KVP-${propertyId.slice(0, 6).toUpperCase()}-${randomHex(3)}`;

  // Create BlockchainWallet for seller if not exists
  const existingWallets = await base44.asServiceRole.entities.BlockchainWallet.filter({ userId: sellerUserId });
  if (!existingWallets || existingWallets.length === 0) {
    const walletAddress = `KW-${(await sha256(sellerUserId)).slice(0, 16)}`;
    const now = new Date().toISOString();
    const publicKey = await sha256(walletAddress + now);
    await base44.asServiceRole.entities.BlockchainWallet.create({
      userId: sellerUserId,
      walletAddress,
      publicKey,
      balanceKemecoins: 0,
      totalTransactions: 0,
      verifiedPropertiesCount: 0,
      ownedTokenIds: [],
      isActive: true,
    });
  }

  // Generate genesis hash
  const genesisHash = await sha256(tokenId + propertyId + Date.now().toString());

  // Create PropertyToken
  const token = await base44.asServiceRole.entities.PropertyToken.create({
    tokenId,
    propertyId,
    currentOwnerUserId: sellerUserId,
    mintedByUserId: sellerUserId,
    mintedAt: new Date().toISOString(),
    genesisHash,
    currentChainHash: genesisHash,
    chainLength: 0,
    verificationLevel: 1,
    verificationStatus: 'pending',
    certificateIssued: false,
    transferHistory: [],
    isActive: true,
  });

  // Append genesis verification record via internal call
  await base44.asServiceRole.functions.invoke('appendVerificationRecord', {
    tokenId: token.id,
    recordType: 'property_listed',
    actorType: 'system',
    actorLabel: 'System',
    title: 'Property token minted',
    details: 'Property token minted on listing creation',
    metaData: { propertyId, sellerUserId },
  });

  return Response.json({ token, alreadyExisted: false });
});