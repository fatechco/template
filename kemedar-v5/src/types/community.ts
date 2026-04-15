import type { CommunityType, CommunityMemberRole, CommunityPostType, ModerationStatus } from "./common";

export interface Community {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  type: CommunityType;
  coverImageUrl: string | null;
  logoUrl: string | null;
  cityId: string | null;
  compoundName: string | null;
  isVerified: boolean;
  isActive: boolean;
  isPublic: boolean;
  membersCount: number;
  postsCount: number;
  rules: Record<string, any> | null;
  features: string[];
  tags: string[];
  createdAt: string;
  members?: CommunityMember[];
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: CommunityMemberRole;
  unitNumber: string | null;
  isVerified: boolean;
  joinedAt: string;
  user?: { id: string; name: string | null; avatarUrl: string | null };
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorUserId: string;
  postType: CommunityPostType;
  title: string | null;
  titleAr: string | null;
  content: string;
  contentAr: string | null;
  imageUrls: string[];
  isPinned: boolean;
  isAnonymous: boolean;
  likesCount: number;
  commentsCount: number;
  moderationStatus: ModerationStatus;
  tags: string[];
  createdAt: string;
  author?: { id: string; name: string | null; avatarUrl: string | null };
  comments?: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorUserId: string;
  content: string;
  parentCommentId: string | null;
  likesCount: number;
  moderationStatus: ModerationStatus;
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  communityId: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  eventType: string | null;
  location: string | null;
  startAt: string | null;
  endAt: string | null;
  maxAttendees: number | null;
  rsvpCount: number;
}

export interface CommunityAlert {
  id: string;
  communityId: string;
  alertType: string;
  title: string;
  severity: string;
  isActive: boolean;
  expiresAt: string | null;
}
