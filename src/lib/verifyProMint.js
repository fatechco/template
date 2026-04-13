import { base44 } from "@/api/base44Client";

/**
 * Mint a Verify Pro PropertyToken + genesis VerificationRecord
 * immediately after property creation.
 *
 * @param {string} propertyId - The newly created property's id
 * @param {string} userId - The seller/creator's user id
 * @returns {object} The created PropertyToken record
 */
export async function mintPropertyToken(propertyId, userId) {
  const tokenSuffix = propertyId.toString().slice(0, 6).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const tokenId = "KVP-" + tokenSuffix + "-" + randomPart;
  const timestamp = Date.now().toString();
  const genesisHash = btoa(tokenId + propertyId + timestamp).slice(0, 32);

  // 1. Create PropertyToken
  const token = await base44.entities.PropertyToken.create({
    tokenId,
    propertyId,
    currentOwnerUserId: userId,
    mintedByUserId: userId,
    mintedAt: new Date().toISOString(),
    genesisHash,
    currentChainHash: genesisHash,
    chainLength: 0,
    verificationLevel: 1,
    verificationStatus: "pending",
  });

  // 2. Create genesis VerificationRecord
  const recordData = JSON.stringify({
    tokenId: token.id,
    recordType: "property_listed",
    actorType: "system",
    timestamp,
    previousHash: "GENESIS",
  });
  const recordHash = btoa(recordData + "GENESIS").slice(0, 32);

  await base44.entities.VerificationRecord.create({
    tokenId: token.id,
    propertyId,
    recordNumber: 1,
    recordType: "property_listed",
    actorType: "system",
    actorLabel: "System",
    title: "Property token minted on listing creation",
    details: "Verify Pro chain initiated",
    previousHash: "GENESIS",
    recordHash,
    isVerified: true,
    recordedAt: new Date().toISOString(),
  });

  // 3. Set verification_level on Property
  await base44.entities.Property.update(propertyId, {
    verification_level: 1,
  });

  return token;
}