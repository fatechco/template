export interface CoachProfile {
  id: string;
  userId: string;
  currentJourneyId: string | null;
  completedJourneys: string[];
  preferences: Record<string, any> | null;
  goals: Record<string, any> | null;
  experienceLevel: string | null;
  lastActiveAt: string | null;
  totalPointsEarned: number;
  streakDays: number;
}

export interface CoachJourney {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  targetRole: string | null;
  steps: Record<string, any> | null;
  totalSteps: number;
  estimatedMinutes: number | null;
  isActive: boolean;
  sortOrder: number;
}

export interface CoachMessage {
  id: string;
  userId: string;
  role: string;
  content: string;
  contentAr: string | null;
  isAiGenerated: boolean;
  journeyId: string | null;
  stepIndex: number | null;
  createdAt: string;
}

export interface CoachNudge {
  id: string;
  userId: string;
  nudgeType: string;
  title: string;
  titleAr: string | null;
  message: string;
  messageAr: string | null;
  actionUrl: string | null;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}
