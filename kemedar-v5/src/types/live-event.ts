import type { LiveEventType, LiveEventStatus } from "./common";

export interface LiveEvent {
  id: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  eventType: LiveEventType;
  status: LiveEventStatus;
  hostUserId: string;
  propertyId: string | null;
  coverImageUrl: string | null;
  streamUrl: string | null;
  recordingUrl: string | null;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  maxAttendees: number | null;
  registeredCount: number;
  attendedCount: number;
  tags: string[];
  createdAt: string;
}

export interface LiveEventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  attendedAt: string | null;
}
