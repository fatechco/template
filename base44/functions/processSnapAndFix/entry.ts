import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Anthropic from 'npm:@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const {
    imageBase64,
    mediaType,
    userNote,
    userId,
    sessionToken,
    locationText,
    cityId,
  } = await req.json();

  if (!imageBase64 || !sessionToken) {
    return Response.json({ error: 'imageBase64 and sessionToken are required' }, { status: 400 });
  }

  // STEP A — Guard checks
  const settingsArr = await base44.asServiceRole.entities.SnapSettings.list('-created_date', 1);
  const settings = settingsArr?.[0];

  if (!settings?.isActive) {
    return Response.json({ error: 'Feature unavailable' }, { status: 403 });
  }

  const maxBytes = (settings.maxImageSizeMB ?? 10) * 1024 * 1024;
  const imageBytes = Math.ceil((imageBase64.length * 3) / 4);
  if (imageBytes > maxBytes) {
    return Response.json({ error: 'Image too large' }, { status: 400 });
  }

  // STEP B — Upload image and create SnapSession
  const imageHash = await sha256(imageBase64);
  const claudeModel = settings.claudeModel ?? 'claude-sonnet-4-20250514';

  // Convert base64 to blob and upload
  const byteString = atob(imageBase64);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  const imageBlob = new Blob([byteArray], { type: mediaType ?? 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', imageBlob, `snap-${sessionToken}.jpg`);

  const { file_url: originalImageUrl } = await base44.asServiceRole.integrations.Core.UploadFile({ file: imageBlob });

  const snapSession = await base44.asServiceRole.entities.SnapSession.create({
    userId: userId ?? null,
    sessionToken,
    originalImageUrl,
    originalImageHash: imageHash,
    userNote: userNote ?? null,
    locationText: locationText ?? null,
    cityId: cityId ?? null,
    status: 'analyzing',
    analysisStartedAt: new Date().toISOString(),
    claudeModel,
  });

  // STEP C — Call Claude Vision API
  const systemPrompt = `You are an elite Master Contractor, Licensed Plumber, Certified Electrician, and Quantity Surveyor working for Kemework — Egypt's top home services platform.

The user has uploaded a photo of a home repair issue or renovation need. Your job is to:

1. Diagnose the exact problem shown in the photo in plain, simple language a homeowner would understand.

2. Map this to the correct Kemework service category. Choose ONLY from:
   plumbing-services | electrical-services | carpentry | painting-decoration | ac-hvac | tiling-flooring | masonry-concrete | appliance-repair | pest-control | general-maintenance

3. Assess urgency:
   low = can wait days or weeks
   medium = should be fixed within 1-3 days
   high = needs attention today
   emergency = immediate risk to safety or property

4. If urgency is 'high' or 'emergency': Provide a brief, calm safety warning instructing the user on what to do RIGHT NOW before the professional arrives. e.g. 'Turn off the main water valve immediately to prevent flooding.'

5. Write a professional, technical Scope of Work that a licensed contractor can use to bid accurately. Use proper trade terminology. Include: what needs to be done, what to inspect, what tools/techniques to use, any codes or standards to follow in Egypt.

6. Estimate realistic labor hours (min and max).

7. State what professional skill level is required: Licensed Plumber | Certified Electrician | General Handyman | Specialist Contractor

8. List EVERY replacement part, material, or tool the job requires. For each item provide:
   - Specific product name (brand/spec if visible)
   - Quantity and unit
   - Optimized Kemetro search keywords (color + material + size + type)
   - Estimated cost in EGP

Be precise. If the image is unclear or you cannot identify the issue, say so in diagnosedIssue.
Respond ONLY with valid JSON. No preamble. No markdown backticks.`;

  const userText = `Analyze this home repair photo.
User's note: '${userNote || 'none'}'
Location: '${locationText || 'Egypt'}'

Return ONLY this exact JSON:
{
  "diagnosedIssue": string,
  "diagnosedIssueAr": string,
  "kemeworkCategorySlug": string,
  "urgencyLevel": string,
  "safetyWarning": string or null,
  "safetyWarningAr": string or null,
  "technicalDescription": string,
  "technicalDescriptionAr": string,
  "estimatedLaborHoursMin": number,
  "estimatedLaborHoursMax": number,
  "professionalSkillRequired": string,
  "requiredMaterials": [
    {
      "itemName": string,
      "itemNameAr": string,
      "quantity": number,
      "unit": string,
      "kemetroSearchKeywords": string,
      "estimatedCostEGP": number
    }
  ]
}`;

  let claudeRaw;
  try {
    const claudeResponse = await anthropic.messages.create({
      model: claudeModel,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType ?? 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: userText,
            },
          ],
        },
      ],
    });
    claudeRaw = claudeResponse.content?.[0]?.text ?? '';
  } catch (e) {
    await base44.asServiceRole.entities.SnapSession.update(snapSession.id, {
      status: 'failed',
      failureReason: `Claude API error: ${e.message}`,
    });
    return Response.json({ error: 'AI analysis failed. Please try again.' }, { status: 500 });
  }

  // STEP D — Parse and save
  const cleaned = claudeRaw.replace(/```json/gi, '').replace(/```/g, '').trim();

  let aiResult;
  try {
    aiResult = JSON.parse(cleaned);
  } catch (_) {
    await base44.asServiceRole.entities.SnapSession.update(snapSession.id, {
      status: 'failed',
      failureReason: 'AI response parse error',
    });
    return Response.json({ error: 'AI response parse error' }, { status: 500 });
  }

  const diagnosedLower = (aiResult.diagnosedIssue ?? '').toLowerCase();
  if (diagnosedLower.includes('unclear') || diagnosedLower.includes('cannot identify')) {
    await base44.asServiceRole.entities.SnapSession.update(snapSession.id, {
      status: 'failed',
      failureReason: 'Image unrecognizable',
    });
    return Response.json({
      error: "We couldn't diagnose from this photo. Please try a closer, clearer shot or describe the issue manually.",
      code: 'IMAGE_UNRECOGNIZABLE',
    }, { status: 422 });
  }

  const laborCostPerHour = settings.laborCostPerHourEGP ?? 150;
  const totalMaterials = (aiResult.requiredMaterials ?? []).reduce(
    (sum, m) => sum + (m.estimatedCostEGP ?? 0), 0
  );
  const laborMin = (aiResult.estimatedLaborHoursMin ?? 0) * laborCostPerHour;
  const laborMax = (aiResult.estimatedLaborHoursMax ?? 0) * laborCostPerHour;

  const updatedSession = await base44.asServiceRole.entities.SnapSession.update(snapSession.id, {
    diagnosedIssue: aiResult.diagnosedIssue,
    diagnosedIssueAr: aiResult.diagnosedIssueAr,
    kemeworkCategorySlug: aiResult.kemeworkCategorySlug,
    urgencyLevel: aiResult.urgencyLevel,
    safetyWarning: aiResult.safetyWarning ?? null,
    safetyWarningAr: aiResult.safetyWarningAr ?? null,
    technicalDescription: aiResult.technicalDescription,
    technicalDescriptionAr: aiResult.technicalDescriptionAr,
    estimatedLaborHoursMin: aiResult.estimatedLaborHoursMin,
    estimatedLaborHoursMax: aiResult.estimatedLaborHoursMax,
    estimatedLaborCostEGPMin: laborMin,
    estimatedLaborCostEGPMax: laborMax,
    professionalSkillRequired: aiResult.professionalSkillRequired,
    requiredMaterials: aiResult.requiredMaterials ?? [],
    totalEstimatedMaterialsCostEGP: totalMaterials,
    status: 'completed',
    analysisCompletedAt: new Date().toISOString(),
  });

  // Emergency admin notification
  if (
    aiResult.urgencyLevel === 'emergency' &&
    settings.emergencyUrgencyAutoNotifyAdmin
  ) {
    const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' }, '-created_date', 20);
    for (const admin of admins ?? []) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: admin.email,
          subject: '🚨 Emergency Snap & Fix Diagnosis',
          body: `An emergency-level home repair has been diagnosed via Snap & Fix.\n\nIssue: ${aiResult.diagnosedIssue}\nLocation: ${locationText || 'Not specified'}\nUser: ${userId || 'Guest'}\n\nPlease review the session in the admin panel.`,
        });
      } catch (_) {}
    }
  }

  return Response.json({ session: updatedSession });
});