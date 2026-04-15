import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { liveEventRepository } from "@/server/repositories/live-event.repository";
import { invokeLLM, invokeLLMWithSchema } from "@/server/lib/ai-client";

export const liveEventService = {
  async generateEventDescription(eventData: Record<string, any>) {
    const result = await invokeLLMWithSchema<{
      title: string;
      titleAr: string;
      description: string;
      descriptionAr: string;
      agenda: string[];
    }>(
      `Generate compelling event content for a Kemedar Live event:\n${JSON.stringify(eventData)}\n\nCreate title, description, and agenda in both English and Arabic.`,
      {
        type: "object",
        properties: {
          title: { type: "string" },
          titleAr: { type: "string" },
          description: { type: "string" },
          descriptionAr: { type: "string" },
          agenda: { type: "array" },
        },
      }
    );
    return result;
  },

  async generateEventSummary(eventId: string) {
    const event = await liveEventRepository.findEventById(eventId);
    if (!event) throw new Error("Event not found");

    const result = await invokeLLMWithSchema<{
      summary: string;
      keyMoments: string[];
      sentimentAnalysis: { positive: number; neutral: number; negative: number };
      audienceInsights: string[];
      recommendations: string[];
    }>(
      `Summarize this live event:\nTitle: ${event.title}\nAttendees: ${event.attendedCount}\n` +
        `Messages: ${event.messages.length}\nPolls: ${event.polls.length}\n` +
        `Chat highlights: ${event.messages.slice(0, 20).map((m) => m.content).join(" | ")}`,
      {
        type: "object",
        properties: {
          summary: { type: "string" },
          keyMoments: { type: "array" },
          sentimentAnalysis: { type: "object" },
          audienceInsights: { type: "array" },
          recommendations: { type: "array" },
        },
      }
    );
    return result;
  },

  async suggestEventQuestions(eventId: string, topicContext: string) {
    const result = await invokeLLMWithSchema<{ questions: string[] }>(
      `Suggest 5 engaging discussion questions for a real estate event about: ${topicContext}`,
      { type: "object", properties: { questions: { type: "array" } } }
    );
    return result.questions;
  },

  async generateTourSummary(tourId: string) {
    // Direct prisma: complex query not in repository (findUnique for liveTourSession by id not in repo)
    const tour = await prisma.liveTourSession.findUnique({ where: { id: tourId } });
    if (!tour) throw new Error("Tour not found");

    const result = await invokeLLM(
      `Generate a brief summary of this property tour session:\nTitle: ${tour.title}\nAttendees: ${tour.attendeeCount}\nDuration: ${tour.startedAt && tour.endedAt ? Math.round((tour.endedAt.getTime() - tour.startedAt.getTime()) / 60000) + " minutes" : "N/A"}`,
      { maxTokens: 300 }
    );
    return { summary: result.content };
  },

  async moderateEventMessage(messageId: string) {
    // Direct prisma: complex query not in repository (findUnique for liveEventMessage by id not in repo)
    const message = await prisma.liveEventMessage.findUnique({ where: { id: messageId } });
    if (!message) throw new Error("Message not found");

    const result = await invokeLLMWithSchema<{ isAppropriate: boolean; reason?: string }>(
      `Moderate this live event chat message: "${message.content}"\nCheck for spam, offensive language, or scams.`,
      { type: "object", properties: { isAppropriate: { type: "boolean" }, reason: { type: "string" } } }
    );

    if (!result.isAppropriate) {
      // Direct prisma: complex query not in repository (update liveEventMessage not in repo)
      await prisma.liveEventMessage.update({ where: { id: messageId }, data: { isModerated: true } });
    }

    return result;
  },
};
