import { communityRepository } from "@/server/repositories/community.repository";
import { invokeLLMWithSchema, invokeLLM } from "@/server/lib/ai-client";
import prisma from "@/server/lib/prisma";

export const communityService = {
  async createPost(userId: string, communityId: string, data: {
    postType: string;
    title?: string;
    titleAr?: string;
    content: string;
    contentAr?: string;
    imageUrls?: string[];
    tags?: string[];
    isAnonymous?: boolean;
    pollOptions?: any;
  }) {
    // Verify membership
    const membership = await communityRepository.findMembership(communityId, userId);
    if (!membership) throw new Error("Must be a community member to post");

    const post = await communityRepository.createPost({
      community: { connect: { id: communityId } },
      author: { connect: { id: userId } },
      postType: data.postType as any,
      title: data.title,
      titleAr: data.titleAr,
      content: data.content,
      contentAr: data.contentAr,
      imageUrls: data.imageUrls || [],
      isAnonymous: data.isAnonymous || false,
      tags: data.tags || [],
      pollOptions: data.pollOptions,
      moderationStatus: "pending",
    } as any);

    // Auto-moderate
    this.moderatePost(post.id).catch(() => {});

    // Update community post count
    await prisma.community.update({
      where: { id: communityId },
      data: { postsCount: { increment: 1 } },
    });

    // Detect Kemework opportunity for help_request posts
    if (data.postType === "help_request") {
      this.detectKemeworkOpportunity(post.id, data.content).catch(() => {});
    }

    return post;
  },

  async moderatePost(postId: string) {
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) return;

    const result = await invokeLLMWithSchema<{
      isAppropriate: boolean;
      flagReason?: string;
      categories: string[];
      confidence: number;
    }>(
      `Moderate this community post for a real estate platform:\n\nTitle: ${post.title || ""}\nContent: ${post.content}\n\nCheck for: spam, offensive language, misinformation, scams, personal attacks. Consider Arabic and English content.`,
      {
        type: "object",
        properties: {
          isAppropriate: { type: "boolean" },
          flagReason: { type: "string" },
          categories: { type: "array", items: { type: "string" } },
          confidence: { type: "number" },
        },
      }
    );

    await communityRepository.updatePost(postId, {
      moderationStatus: result.isAppropriate ? "approved" : "flagged",
      moderationNotes: result.flagReason || null,
    });

    return result;
  },

  async detectKemeworkOpportunity(postId: string, content: string) {
    const result = await invokeLLMWithSchema<{
      isServiceRequest: boolean;
      serviceType?: string;
      urgency?: string;
      estimatedBudget?: string;
    }>(
      `Analyze this community help request to detect if it's a home service opportunity:\n\n"${content}"\n\nDetermine if this is a request for plumbing, electrical, painting, AC repair, carpentry, cleaning, or other home services.`,
      {
        type: "object",
        properties: {
          isServiceRequest: { type: "boolean" },
          serviceType: { type: "string" },
          urgency: { type: "string" },
          estimatedBudget: { type: "string" },
        },
      }
    );

    return result;
  },

  async joinCommunity(userId: string, communityId: string, unitNumber?: string) {
    const existing = await communityRepository.findMembership(communityId, userId);
    if (existing && !existing.leftAt) throw new Error("Already a member");

    const member = await communityRepository.addMember({
      community: { connect: { id: communityId } },
      user: { connect: { id: userId } },
      unitNumber,
      role: "member",
    } as any);

    await prisma.community.update({
      where: { id: communityId },
      data: { membersCount: { increment: 1 } },
    });

    return member;
  },

  async generateDigest(communityId: string) {
    const community = await communityRepository.findById(communityId);
    if (!community) throw new Error("Community not found");

    const recentPosts = await prisma.communityPost.findMany({
      where: { communityId, deletedAt: null, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      orderBy: { likesCount: "desc" },
      take: 10,
      include: { author: { select: { name: true } } },
    });

    const alerts = await communityRepository.findActiveAlerts(communityId);
    const events = await communityRepository.findEvents(communityId);

    const digest = await invokeLLM(
      `Generate a weekly community digest for "${community.name}":\n\n` +
        `Top Posts: ${recentPosts.map((p) => `- ${p.title || p.content.substring(0, 50)} (${p.likesCount} likes)`).join("\n")}\n\n` +
        `Active Alerts: ${alerts.map((a) => `- ${a.title}`).join("\n") || "None"}\n\n` +
        `Upcoming Events: ${events.map((e) => `- ${e.title}`).join("\n") || "None"}\n\n` +
        `Write a concise, friendly digest in both English and Arabic.`,
      { maxTokens: 1000 }
    );

    return { digest: digest.content, postCount: recentPosts.length, alertCount: alerts.length, eventCount: events.length };
  },
};
