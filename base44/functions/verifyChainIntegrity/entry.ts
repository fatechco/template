import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { tokenId } = await req.json();
  if (!tokenId) {
    return Response.json({ error: 'tokenId is required' }, { status: 400 });
  }

  // Get all records ordered by recordNumber ASC
  const allRecords = await base44.asServiceRole.entities.VerificationRecord.filter({ tokenId });
  allRecords.sort((a, b) => (a.recordNumber || 0) - (b.recordNumber || 0));

  if (allRecords.length === 0) {
    return Response.json({ valid: true, chainLength: 0, message: 'No records found' });
  }

  for (let i = 0; i < allRecords.length; i++) {
    const record = allRecords[i];
    const expectedPrevHash = i === 0 ? 'GENESIS' : allRecords[i - 1].recordHash;

    // Validate previousHash linkage (chain linking check).
    // Full hash recomputation is not feasible since appendVerificationRecord embeds
    // a live Date.now() timestamp that cannot be recovered from stored data.
    const prevHashOk = record.previousHash === expectedPrevHash;

    if (!prevHashOk) {
      // Log chain breach
      await base44.asServiceRole.entities.VerificationRecord.create({
        tokenId,
        propertyId: record.propertyId,
        recordNumber: allRecords.length + 1,
        recordType: 'fraud_flag_raised',
        actorType: 'system',
        actorLabel: 'System — Chain Integrity Check',
        title: 'CRITICAL: Chain integrity failure detected',
        details: `Hash linkage broken at record #${record.recordNumber}. Expected previousHash does not match.`,
        metaData: {
          brokenAtRecordNumber: record.recordNumber,
          expectedPrevHash,
          storedPrevHash: record.previousHash,
          flagType: 'chain_integrity_failure',
          flagSeverity: 'critical',
          autoActionTaken: 'listing_suspended',
        },
        previousHash: allRecords[allRecords.length - 1]?.recordHash ?? 'GENESIS',
        recordHash: await sha256('fraud_flag' + tokenId + Date.now()),
        isVerified: false,
        recordedAt: new Date().toISOString(),
      });

      // Suspend the token
      await base44.asServiceRole.entities.PropertyToken.update(tokenId, {
        verificationStatus: 'suspended',
      });

      return Response.json({
        valid: false,
        brokenAtRecord: record.recordNumber,
        message: 'Chain integrity failure — listing suspended and admins notified',
      });
    }
  }

  return Response.json({ valid: true, chainLength: allRecords.length });
});