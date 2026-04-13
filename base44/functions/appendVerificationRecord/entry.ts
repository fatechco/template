import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const {
    tokenId, recordType, actorType, actorUserId,
    actorLabel, title, details, metaData, attachmentUrl, attachmentType
  } = await req.json();

  if (!tokenId || !recordType || !actorType) {
    return Response.json({ error: 'tokenId, recordType, actorType are required' }, { status: 400 });
  }

  // Get the PropertyToken to retrieve propertyId
  const tokens = await base44.asServiceRole.entities.PropertyToken.filter({ id: tokenId });
  const token = tokens?.[0];
  if (!token) {
    return Response.json({ error: 'PropertyToken not found' }, { status: 404 });
  }

  // STEP A — Get last record for this token
  const allRecords = await base44.asServiceRole.entities.VerificationRecord.filter({ tokenId });
  allRecords.sort((a, b) => (a.recordNumber || 0) - (b.recordNumber || 0));
  const previousRecord = allRecords.length > 0 ? allRecords[allRecords.length - 1] : null;

  // STEP B — Calculate hash
  const previousHash = previousRecord?.recordHash ?? 'GENESIS';
  const recordData = JSON.stringify({
    tokenId, recordType, actorType, actorUserId,
    title, details, metaData, attachmentUrl,
    previousHash, timestamp: Date.now()
  });
  const recordHash = await sha256(recordData);

  // STEP C — Save VerificationRecord
  const newRecord = await base44.asServiceRole.entities.VerificationRecord.create({
    tokenId,
    propertyId: token.propertyId,
    recordNumber: (previousRecord?.recordNumber ?? 0) + 1,
    recordType,
    actorType,
    actorUserId: actorUserId || null,
    actorLabel: actorLabel || actorType,
    title: title || recordType,
    details: details || '',
    metaData: metaData || {},
    attachmentUrl: attachmentUrl || null,
    attachmentType: attachmentType || null,
    previousHash,
    recordHash,
    isVerified: true,
    recordedAt: new Date().toISOString(),
  });

  // STEP D — Update PropertyToken chain
  await base44.asServiceRole.entities.PropertyToken.update(tokenId, {
    currentChainHash: recordHash,
    chainLength: (token.chainLength || 0) + 1,
  });

  return Response.json({ record: newRecord });
});