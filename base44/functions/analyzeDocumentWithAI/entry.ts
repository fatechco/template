import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { documentId } = await req.json();
  if (!documentId) {
    return Response.json({ error: 'documentId is required' }, { status: 400 });
  }

  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  if (!ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  // STEP A — Load document
  const docs = await base44.asServiceRole.entities.VerificationDocument.filter({ id: documentId });
  const doc = docs?.[0];
  if (!doc) {
    return Response.json({ error: 'VerificationDocument not found' }, { status: 404 });
  }

  // Load related property and seller
  const properties = await base44.asServiceRole.entities.Property.filter({ id: doc.propertyId });
  const property = properties?.[0];
  const sellers = doc.submittedByUserId
    ? await base44.asServiceRole.entities.User.filter({ id: doc.submittedByUserId })
    : [];
  const seller = sellers?.[0];

  // Fetch file as base64
  const fileResponse = await fetch(doc.fileUrl);
  if (!fileResponse.ok) {
    return Response.json({ error: 'Failed to fetch document file' }, { status: 500 });
  }
  const fileBuffer = await fileResponse.arrayBuffer();
  const base64FileData = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

  const mediaTypeMap = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
  const ext = (doc.fileType || 'pdf').toLowerCase();
  const mediaType = mediaTypeMap[ext] || 'application/pdf';

  // STEP B — Call Claude API
  const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system: `You are Kemedar Verify Pro AI Document Analyst.
You analyze Egyptian real estate documents for authenticity.
You check for: signs of tampering, digital manipulation, inconsistent fonts, cut-and-paste edits, incorrect seals, missing required fields, and logical data inconsistencies.

Document types you may receive:
- National ID: Check photo presence, number format (14 digits), name consistency, expiry date validity
- Title Deed (Shaqa/Tabu): Check property registration number, owner names, area measurements, district court seal, notary signature, issue date
- Utility Bill: Check address match, recent date, issuer logo, account number format
- Tax Certificate: Check property number, clearance date, authority stamp, signatures
- Building Permit: Check municipality seal, permit number, expiry, approved plans reference

Be conservative: when uncertain, return likely_authentic not authentic. Flag clearly visible issues only. Do not hallucinate problems that are not visible.
Respond ONLY with valid JSON — no preamble, no markdown backticks.`,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: mediaType, data: base64FileData },
            },
            {
              type: 'text',
              text: `Analyze this ${doc.documentType} document.
Property: ${property?.title || 'Unknown'}
Submitted by: ${seller?.full_name || 'Unknown'}
Submission date: ${doc.created_date || new Date().toISOString()}

Return ONLY this JSON structure:
{
  "aiScore": number 0-100,
  "aiDecision": "authentic"|"likely_authentic"|"suspicious"|"likely_fraudulent"|"unreadable",
  "aiFindings": [{"finding": string, "severity": "info"|"warning"|"critical", "detail": string}],
  "aiSummary": string (2-3 sentences EN),
  "aiSummaryAr": string (Arabic),
  "redFlags": [string],
  "positives": [string],
  "recommendAction": "approve"|"approve_with_note"|"request_clearer_scan"|"request_resubmission"|"flag_for_review"
}`,
            },
          ],
        },
      ],
    }),
  });

  if (!claudeResponse.ok) {
    const err = await claudeResponse.text();
    return Response.json({ error: 'Claude API error', details: err }, { status: 500 });
  }

  const claudeData = await claudeResponse.json();
  let rawText = claudeData.content?.[0]?.text || '{}';
  // Strip markdown backticks if present
  rawText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  const analysis = JSON.parse(rawText);
  const { aiScore, aiDecision, aiFindings, aiSummary, aiSummaryAr } = analysis;

  // STEP C — Save results
  await base44.asServiceRole.entities.VerificationDocument.update(documentId, {
    aiAnalyzed: true,
    aiScore,
    aiDecision,
    aiFindings: aiFindings || [],
    aiSummary,
    aiSummaryAr,
    aiAnalyzedAt: new Date().toISOString(),
    claudeModel: CLAUDE_MODEL,
  });

  // Append verification record
  await base44.asServiceRole.functions.invoke('appendVerificationRecord', {
    tokenId: doc.tokenId,
    recordType: 'document_ai_analyzed',
    actorType: 'claude_ai',
    actorLabel: 'AI Engine',
    title: `AI Document Analysis — Score: ${aiScore}/100`,
    details: aiSummary,
    metaData: { aiScore, aiDecision, claudeModel: CLAUDE_MODEL, documentId },
  });

  // Fraud flagging based on score
  if (aiScore < 25) {
    const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    await base44.asServiceRole.functions.invoke('appendVerificationRecord', {
      tokenId: doc.tokenId,
      recordType: 'fraud_flag_raised',
      actorType: 'claude_ai',
      actorLabel: 'AI Engine — Fraud Detection',
      title: 'CRITICAL: AI detected likely fraudulent document',
      details: `AI score ${aiScore}/100. Decision: ${aiDecision}. Auto-action: listing suspended.`,
      metaData: {
        flagType: 'ai_fraud_detection',
        flagSeverity: 'critical',
        autoActionTaken: 'listing_suspended',
        aiScore,
        aiDecision,
        notifiedAdminCount: admins?.length || 0,
      },
    });
    await base44.asServiceRole.entities.PropertyToken.update(doc.tokenId, {
      verificationStatus: 'fraud_flagged',
    });
  } else if (aiScore >= 25 && aiScore <= 50) {
    const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    await base44.asServiceRole.functions.invoke('appendVerificationRecord', {
      tokenId: doc.tokenId,
      recordType: 'fraud_flag_raised',
      actorType: 'claude_ai',
      actorLabel: 'AI Engine — Fraud Detection',
      title: 'WARNING: AI flagged suspicious document',
      details: `AI score ${aiScore}/100. Decision: ${aiDecision}. Manual review required.`,
      metaData: {
        flagType: 'ai_fraud_detection',
        flagSeverity: 'high',
        autoActionTaken: 'none',
        aiScore,
        aiDecision,
        notifiedAdminCount: admins?.length || 0,
      },
    });
  }

  return Response.json({ analysis, documentId });
});