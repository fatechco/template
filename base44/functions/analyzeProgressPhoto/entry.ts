import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { updateId, photoUrl, phaseId } = await req.json();

  const phases = await base44.entities.FinishPhase.filter({ id: phaseId });
  const phase = phases[0];

  const analysis = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a construction quality inspector specializing in Egyptian residential finishing projects. Analyze this construction progress photo for phase: ${phase?.phaseName || 'General Work'}.

Evaluate quality, progress completion, issues, and safety. Be specific and practical for Egyptian construction standards.

Return JSON:
{
  "estimatedCompletion": number (0-100, % of this phase done),
  "qualityScore": number (0-100),
  "workQuality": "poor|fair|good|excellent",
  "positiveObservations": [string],
  "issuesDetected": [{"issue": string, "severity": "low|medium|high|critical", "location": string, "recommendation": string, "requiresRework": boolean}],
  "estimatedDaysToPhaseComplete": number,
  "snaggingRisk": "low|medium|high",
  "snaggingWarnings": [string],
  "safetyObservations": [string],
  "overallAssessment": string
}`,
    file_urls: [photoUrl],
    response_json_schema: {
      type: 'object',
      properties: {
        estimatedCompletion: { type: 'number' },
        qualityScore: { type: 'number' },
        workQuality: { type: 'string' },
        positiveObservations: { type: 'array', items: { type: 'string' } },
        issuesDetected: { type: 'array', items: { type: 'object' } },
        estimatedDaysToPhaseComplete: { type: 'number' },
        snaggingRisk: { type: 'string' },
        snaggingWarnings: { type: 'array', items: { type: 'string' } },
        safetyObservations: { type: 'array', items: { type: 'string' } },
        overallAssessment: { type: 'string' }
      }
    }
  });

  if (updateId) {
    await base44.entities.FinishProgressUpdate.update(updateId, {
      aiAnalysisStatus: 'analyzed',
      aiQualityScore: analysis.qualityScore,
      aiDetectedProgress: analysis.overallAssessment,
      aiIssuesDetected: analysis.issuesDetected || [],
      aiPhaseCompletion: analysis.estimatedCompletion
    });
  }

  return Response.json({ success: true, analysis });
});