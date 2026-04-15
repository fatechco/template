export type ConciergeTaskStatus = "pending" | "in_progress" | "completed" | "skipped" | "cancelled";

export interface ConciergeJourney {
  id: string;
  userId: string;
  propertyId: string | null;
  templateId: string | null;
  journeyType: string;
  status: string;
  completionPercent: number;
  moveInDate: string | null;
  startedAt: string;
  completedAt: string | null;
  dismissedAt: string | null;
  tasks?: ConciergeTask[];
}

export interface ConciergeTask {
  id: string;
  journeyId: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  category: string | null;
  priority: string | null;
  status: ConciergeTaskStatus;
  dueDate: string | null;
  completedAt: string | null;
  skippedAt: string | null;
  sortOrder: number;
  actionUrl: string | null;
  notes: string | null;
}
