import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { projectId } = await req.json();

  const projects = await base44.entities.FinishProject.filter({ id: projectId });
  if (!projects.length) return Response.json({ error: 'Project not found' }, { status: 404 });
  const project = projects[0];

  await base44.entities.FinishProject.update(projectId, { boqStatus: 'generating' });

  const prompt = `You are an expert Egyptian real estate finishing and construction estimator. Generate an accurate, detailed BOQ (Bill of Quantities) for a residential property in Egypt.

Current Egyptian market prices (2024-2025):
- Porcelain tiles 60×60 (local): 120-200 EGP/m², (imported): 250-400 EGP/m²
- Italian marble: 800-2500 EGP/m²
- Wall paint (local): 15-25 EGP/m², (imported): 35-65 EGP/m²
- German kitchen (basic): 15,000-25,000 EGP, (premium): 40,000-120,000 EGP
- Electrical per point: 250-500 EGP
- Plumbing per point: 300-600 EGP
- Plastering: 45-80 EGP/m²
- Gypsum board ceiling: 150-300 EGP/m²
- Wooden doors: 1,500-6,000 EGP each
- AC split unit installation: 500-1,000 EGP per unit
- Bathroom tiles: 150-350 EGP/m²
- Sanitary ware set (basic): 3,000-6,000 EGP, (premium): 8,000-20,000 EGP

Labor rates:
- Electrician: 500-800 EGP/day
- Plumber: 500-800 EGP/day
- Tiler: 600-900 EGP/day
- Painter: 300-500 EGP/day
- Carpenter: 500-900 EGP/day
- Foreman/supervisor: 800-1,200 EGP/day

Finishing levels:
- economy: local materials, lower labor rates, basic finishes
- standard: mix of local and imported, mid-range finishes (MOST POPULAR)
- premium: mostly imported materials, higher-end finishes
- luxury: all premium materials, bespoke elements, top labor rates

Respond ONLY with valid JSON, no markdown.`;

  const userPrompt = `Generate a complete BOQ for:
Property name: ${project.projectName}
Project type: ${project.projectType}
Property type: ${project.propertyType}
Total area: ${project.totalAreaSqm} sqm
Rooms: ${project.numberOfRooms} bedrooms
Bathrooms: ${project.numberOfBathrooms}
Finishing level: ${project.finishingLevel}
Design style: ${project.designStyle}
City: ${project.propertyAddress || 'Cairo'}

Return JSON with this exact structure:
{
  "projectSummary": {
    "totalArea": number,
    "roomBreakdown": [{"room": string, "area": number}],
    "estimatedDurationWeeks": number,
    "recommendedPhases": number
  },
  "sections": [
    {
      "sectionId": string,
      "sectionName": string,
      "sectionNameAr": string,
      "roomType": string,
      "items": [
        {
          "itemId": string,
          "itemName": string,
          "itemNameAr": string,
          "category": string,
          "description": string,
          "unit": string,
          "quantity": number,
          "unitCostRecommended": number,
          "totalCost": number,
          "searchKeyword": string,
          "phase": number,
          "isOrdered": false,
          "isDelivered": false
        }
      ]
    }
  ],
  "laborItems": [
    {
      "tradeType": string,
      "description": string,
      "estimatedDays": number,
      "dailyRateRecommended": number,
      "totalCost": number,
      "phaseNumber": number
    }
  ],
  "phaseSequence": [
    {
      "phaseNumber": number,
      "phaseName": string,
      "phaseNameAr": string,
      "phaseType": string,
      "estimatedDays": number,
      "keyMilestone": string,
      "tradesNeeded": [string],
      "paymentPercent": number
    }
  ],
  "scenarios": [
    {
      "scenarioName": string,
      "finishingLevel": string,
      "totalMaterials": number,
      "totalLabor": number,
      "grandTotal": number,
      "description": string
    }
  ],
  "totals": {
    "totalMaterialsCost": number,
    "totalLaborCost": number,
    "contingencyAmount": number,
    "platformFeeAmount": number,
    "grandTotal": number
  },
  "aiNotes": string,
  "potentialRisks": [string],
  "optimizationTips": [string]
}`;

  const boqData = await base44.integrations.Core.InvokeLLM({
    prompt: userPrompt,
    model: 'claude_sonnet_4_6',
    response_json_schema: {
      type: 'object',
      properties: {
        projectSummary: { type: 'object' },
        sections: { type: 'array', items: { type: 'object' } },
        laborItems: { type: 'array', items: { type: 'object' } },
        phaseSequence: { type: 'array', items: { type: 'object' } },
        scenarios: { type: 'array', items: { type: 'object' } },
        totals: { type: 'object' },
        aiNotes: { type: 'string' },
        potentialRisks: { type: 'array', items: { type: 'string' } },
        optimizationTips: { type: 'array', items: { type: 'string' } }
      }
    }
  });

  const totals = boqData.totals || {};
  const contingencyAmount = (totals.totalMaterialsCost || 0) * 0.10;
  const platformFeeAmount = ((totals.totalMaterialsCost || 0) + (totals.totalLaborCost || 0)) * 0.05;
  const grandTotal = (totals.totalMaterialsCost || 0) + (totals.totalLaborCost || 0) + contingencyAmount + platformFeeAmount;

  const boq = await base44.entities.FinishBOQ.create({
    projectId,
    version: 1,
    sections: boqData.sections || [],
    laborItems: boqData.laborItems || [],
    totalMaterialsCost: totals.totalMaterialsCost || 0,
    totalLaborCost: totals.totalLaborCost || 0,
    contingencyPercent: 10,
    contingencyAmount,
    platformFeePercent: 5,
    platformFeeAmount,
    grandTotal,
    scenarios: boqData.scenarios || [],
    aiGeneratedAt: new Date().toISOString(),
    aiModelUsed: 'claude_sonnet_4_6'
  });

  // Create phases from phase sequence
  const phases = boqData.phaseSequence || [];
  for (const phase of phases) {
    await base44.entities.FinishPhase.create({
      projectId,
      phaseNumber: phase.phaseNumber,
      phaseName: phase.phaseName,
      phaseNameAr: phase.phaseNameAr || phase.phaseName,
      phaseType: phase.phaseType || 'custom',
      description: phase.keyMilestone || '',
      estimatedDays: phase.estimatedDays || 7,
      phasePaymentAmount: grandTotal * ((phase.paymentPercent || 15) / 100),
      status: phase.phaseNumber === 1 ? 'not_started' : 'not_started',
      foInspectionRequired: true
    });
  }

  await base44.entities.FinishProject.update(projectId, {
    boqStatus: 'generated',
    estimatedDurationWeeks: boqData.projectSummary?.estimatedDurationWeeks || 8,
    aiProjectSummary: boqData.aiNotes,
    aiRiskFlags: boqData.potentialRisks || [],
    aiRecommendations: boqData.optimizationTips || [],
    budgetBreakdown: {
      materials: totals.totalMaterialsCost || 0,
      labor: totals.totalLaborCost || 0,
      supervision: 0,
      contingency: contingencyAmount,
      kemedarFee: platformFeeAmount
    }
  });

  return Response.json({ success: true, boqId: boq.id, boqData, grandTotal });
});