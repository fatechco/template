export type LiveEventType = "webinar" | "open_house" | "property_tour" | "q_and_a" | "market_update" | "panel";
export type LiveEventStatus = "draft" | "scheduled" | "live" | "ended" | "cancelled";

export interface LiveEvent {
  id: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  eventType: LiveEventType;
  status: LiveEventStatus;
  hostUserId: string;
  propertyId: string | null;
  communityId: string | null;
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

export interface LiveEventMessage {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  isModerated: boolean;
  isPinned: boolean;
  createdAt: string;
}

export interface LiveTourSession {
  id: string;
  propertyId: string;
  hostUserId: string;
  title: string | null;
  status: string;
  scheduledAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  recordingUrl: string | null;
  attendeeCount: number;
}

export interface VirtualTour {
  id: string;
  propertyId: string;
  title: string | null;
  description: string | null;
  tourUrl: string | null;
  thumbnailUrl: string | null;
  sceneCount: number;
  viewCount: number;
  isActive: boolean;
}
