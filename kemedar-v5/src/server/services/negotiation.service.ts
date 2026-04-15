import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { negotiationRepository } from "@/server/repositories/negotiation.repository";
import { invokeLLM } from "@/server/lib/ai-client";

export const negotiationService = {
  async openRoom(data: {
    propertyId?: string;
    buyerUserId: string;
    sellerUserId: string;
    swapMatchId?: string;
    initialOfferPrice?: number;
  }) {
    const session = await negotiationRepository.createSession({
      property: data.propertyId ? { connect: { id: data.propertyId } } : undefined,
      buyer: { connect: { id: data.buyerUserId } },
      seller: { connect: { id: data.sellerUserId } },
      swapMatchId: data.swapMatchId,
      currentOfferPrice: data.initialOfferPrice,
      status: "active",
      startedAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    } as any);

    // Create analytics record
    await negotiationRepository.createAnalytics({
      session: { connect: { id: session.id } },
    } as any);

    return session;
  },

  async submitOffer(sessionId: string, userId: string, data: {
    offerPrice: number;
    conditions?: any;
    message?: string;
    messageAr?: string;
  }) {
    const session = await negotiationRepository.findSessionById(sessionId);
    if (!session) throw new Error("Session not found");
    if (session.status !== "active") throw new Error("Session is not active");
    if (session.buyerUserId !== userId && session.sellerUserId !== userId) throw new Error("Not a participant");

    // Direct prisma: complex query not in repository (updateMany not available in repo)
    await prisma.negotiationOffer.updateMany({
      where: { sessionId, status: "pending" },
      data: { status: "expired" },
    });

    const offer = await negotiationRepository.createOffer({
      session: { connect: { id: sessionId } },
      offeredBy: { connect: { id: userId } },
      offerPrice: data.offerPrice,
      conditions: data.conditions,
      message: data.message,
      messageAr: data.messageAr,
      status: "pending",
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
    } as any);

    // Update session
    await negotiationRepository.updateSession(sessionId, {
      currentOfferPrice: data.offerPrice,
      roundsCount: { increment: 1 },
      lastActivityAt: new Date(),
      status: "counter_offered",
    });

    // Update analytics
    await negotiationRepository.updateAnalytics(sessionId, {
      totalRounds: { increment: 1 },
    });

    return offer;
  },

  async respondToOffer(offerId: string, userId: string, action: "accept" | "reject" | "counter") {
    // Direct prisma: complex query not in repository (findUnique with include by offerId)
    const offer = await prisma.negotiationOffer.findUnique({
      where: { id: offerId },
      include: { session: true },
    });
    if (!offer) throw new Error("Offer not found");
    if (offer.offeredByUserId === userId) throw new Error("Cannot respond to your own offer");

    const session = offer.session;
    if (session.buyerUserId !== userId && session.sellerUserId !== userId) throw new Error("Not a participant");

    await negotiationRepository.updateOffer(offerId, {
      status: action === "accept" ? "accepted" : action === "reject" ? "rejected" : "countered",
      respondedAt: new Date(),
    });

    if (action === "accept") {
      await negotiationRepository.updateSession(session.id, {
        status: "agreed",
        agreedAt: new Date(),
      });

      await negotiationRepository.updateAnalytics(session.id, {
        outcome: "agreed",
      });
    } else if (action === "reject") {
      await negotiationRepository.updateSession(session.id, {
        status: "rejected",
      });
    }

    return { offerId, action, sessionStatus: action === "accept" ? "agreed" : action === "reject" ? "rejected" : "active" };
  },

  async sendMessage(sessionId: string, userId: string, content: string, contentAr?: string) {
    const session = await negotiationRepository.findSessionById(sessionId);
    if (!session) throw new Error("Session not found");
    if (session.buyerUserId !== userId && session.sellerUserId !== userId) throw new Error("Not a participant");

    const message = await negotiationRepository.createMessage({
      session: { connect: { id: sessionId } },
      sender: { connect: { id: userId } },
      content,
      contentAr,
    } as any);

    await negotiationRepository.updateSession(sessionId, {
      lastActivityAt: new Date(),
    });

    return message;
  },
};
