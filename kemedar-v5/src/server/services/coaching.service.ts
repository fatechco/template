import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { coachingRepository } from "@/server/repositories/coaching.repository";
import { invokeLLM, invokeLLMWithSchema } from "@/server/lib/ai-client";

export const coachingService = {
  async generateNudge(userId: string, journeyPhase?: string) {
    // Direct prisma: complex query not in repository (coachProfile model differs from coachingProfile in repo)
    const profile = await prisma.coachProfile.findUnique({ where: { userId } });
    // Direct prisma: complex query not in repository (user model not in coaching repo)
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const nudge = await invokeLLMWithSchema<{
      title: string;
      titleAr: string;
      message: string;
      messageAr: string;
      actionUrl: string;
      nudgeType: string;
    }>(
      `Generate a personalized nudge notification for a Kemedar real estate platform user:\n` +
        `User: ${user?.name || "User"}\nRole: ${user?.role}\n` +
        `Journey Phase: ${journeyPhase || "general"}\n` +
        `Goals: ${JSON.stringify(profile?.goals || {})}\n` +
        `Streak Days: ${profile?.streakDays || 0}\n\n` +
        `Create an encouraging, actionable nudge in both English and Arabic.`,
      {
        type: "object",
        properties: {
          title: { type: "string" },
          titleAr: { type: "string" },
          message: { type: "string" },
          messageAr: { type: "string" },
          actionUrl: { type: "string" },
          nudgeType: { type: "string" },
        },
      }
    );

    // Direct prisma: complex query not in repository (coachNudge model differs from coachingNudge in repo)
    return prisma.coachNudge.create({
      data: { userId, ...nudge },
    });
  },

  async generateResponse(questionText: string, contextData?: Record<string, any>) {
    const result = await invokeLLM(
      `You are KemedarCoach, a friendly AI real estate advisor for the Egyptian market.\n\n` +
        `User question: "${questionText}"\n` +
        (contextData ? `Context: ${JSON.stringify(contextData)}\n` : "") +
        `\nProvide a helpful, concise response. Suggest relevant Kemedar platform features when appropriate.`,
      { maxTokens: 800, systemPrompt: "You are KemedarCoach, a friendly real estate education assistant." }
    );
    return { response: result.content };
  },

  async generatePersonalizedStep(userId: string, stepNumber: number, contextData?: Record<string, any>) {
    const result = await invokeLLMWithSchema<{
      title: string;
      content: string;
      actionItems: string[];
      estimatedMinutes: number;
    }>(
      `Generate step ${stepNumber} of a personalized real estate learning journey:\nContext: ${JSON.stringify(contextData || {})}`,
      {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          actionItems: { type: "array" },
          estimatedMinutes: { type: "number" },
        },
      }
    );
    return result;
  },

  async dismissJourney(journeyId: string, userId: string) {
    // Direct prisma: complex query not in repository (conciergeJourney/conciergeTask not in coaching repo)
    const journey = await prisma.conciergeJourney.findUnique({ where: { id: journeyId } });
    if (!journey) throw new Error("Journey not found");
    if (journey.userId !== userId) throw new Error("Not your journey");

    await prisma.conciergeTask.updateMany({
      where: { journeyId, status: "pending" },
      data: { status: "skipped", skippedAt: new Date() },
    });

    return prisma.conciergeJourney.update({
      where: { id: journeyId },
      data: { status: "dismissed", dismissedAt: new Date() },
    });
  },
};
