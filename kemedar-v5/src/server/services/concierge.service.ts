import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { conciergeRepository } from "@/server/repositories/concierge.repository";

export const conciergeService = {
  async triggerMoveInConcierge(dealId: string) {
    // Direct prisma: complex query not in repository (escrowDeal with property include)
    const deal = await prisma.escrowDeal.findUnique({
      where: { id: dealId },
      include: { property: true },
    });
    if (!deal) throw new Error("Deal not found");

    // Direct prisma: complex query not in repository (conciergeJourneyTemplate not in concierge repo)
    const template = await prisma.conciergeJourneyTemplate.findFirst({
      where: { isActive: true, journeyType: "move_in" },
    });

    const journey = await conciergeRepository.createJourney({
      user: { connect: { id: deal.buyerId } },
      property: { connect: { id: deal.propertyId } },
      templateId: template?.id,
      journeyType: "move_in",
      status: "active",
      startedAt: new Date(),
    } as any);

    // Create default tasks
    const defaultTasks = [
      { title: "Schedule Property Inspection", titleAr: "جدولة فحص العقار", category: "inspection", sortOrder: 1, priority: "high" },
      { title: "Transfer Utilities", titleAr: "نقل المرافق", category: "utilities", sortOrder: 2, priority: "medium" },
      { title: "Set Up Internet & TV", titleAr: "إعداد الإنترنت والتلفزيون", category: "utilities", sortOrder: 3, priority: "medium" },
      { title: "Change Door Locks", titleAr: "تغيير أقفال الأبواب", category: "security", sortOrder: 4, priority: "high" },
      { title: "Arrange Moving Company", titleAr: "ترتيب شركة نقل", category: "moving", sortOrder: 5, priority: "medium" },
      { title: "Register at Local Office", titleAr: "التسجيل في المكتب المحلي", category: "legal", sortOrder: 6, priority: "low" },
      { title: "Meet Neighbors & Community", titleAr: "التعرف على الجيران والمجتمع", category: "community", sortOrder: 7, priority: "low" },
    ];

    for (const task of defaultTasks) {
      await conciergeRepository.createTask({
        journey: { connect: { id: journey.id } },
        ...task,
        status: "pending",
        priority: task.priority,
      } as any);
    }

    return journey;
  },

  async setMoveInDate(journeyId: string, userId: string, moveInDate: Date) {
    const journey = await conciergeRepository.findJourneyById(journeyId);
    if (!journey) throw new Error("Journey not found");
    if (journey.userId !== userId) throw new Error("Not your journey");

    return conciergeRepository.updateJourney(journeyId, { moveInDate });
  },

  async completeTask(taskId: string, userId: string) {
    // Direct prisma: complex query not in repository (findUnique with include on journey)
    const task = await prisma.conciergeTask.findUnique({ where: { id: taskId }, include: { journey: true } });
    if (!task) throw new Error("Task not found");
    if (task.journey.userId !== userId) throw new Error("Not your journey");

    await conciergeRepository.updateTask(taskId, {
      status: "completed",
      completedAt: new Date(),
    });

    // Update journey completion percent
    const allTasks = await conciergeRepository.findTasks(task.journeyId);
    const completed = allTasks.filter((t) => t.status === "completed" || t.status === "skipped").length;
    const percent = (completed / allTasks.length) * 100;

    await conciergeRepository.updateJourney(task.journeyId, {
      completionPercent: percent,
      ...(percent >= 100 && { status: "completed", completedAt: new Date() }),
    });

    return { taskId, journeyProgress: percent };
  },

  async processConciergeNotifications() {
    // Direct prisma: complex query not in repository (complex where with date comparison and include)
    const dueTasks = await prisma.conciergeTask.findMany({
      where: {
        status: "pending",
        dueDate: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000) }, // Due within 24h
      },
      include: { journey: true },
    });

    // Mark as notified (in production, would send push/email)
    return { notified: dueTasks.length };
  },
};
