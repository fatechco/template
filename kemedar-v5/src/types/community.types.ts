export type CommunityType = "compound" | "building" | "district" | "interest_group" | "professional";
export type CommunityMemberRole = "member" | "moderator" | "admin" | "super_admin";
export type CommunityPostType = "announcement" | "help_request" | "question" | "general" | "complaint" | "alert" | "poll" | "marketplace" | "recommendation" | "event";
export type ModerationStatus = "pending" | "approved" | "flagged" | "removed";

export interface Community {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  type: CommunityType;
  coverImageUrl: string | null;
  logoUrl: string | null;
  countryId: string | null;
  provinceId: string | null;
  cityId: string | null;
  districtId: string | null;
  compoundName: string | null;
  isVerified: boolean;
  isActive: boolean;
  isPublic: boolean;
  membersCount: number;
  postsCount: number;
  rules: Record<string, any> | null;
  features: string[];
  tags: string[];
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  user?: Pick<import("./user.types").User, "id" | "name" | "avatarUrl">;
  role: CommunityMemberRole;
  unitNumber: string | null;
  isVerified: boolean;
  joinedAt: string;
  leftAt: string | null;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorUserId: string;
  author?: Pick<import("./user.types").User, "id" | "name" | "avatarUrl">;
  postType: CommunityPostType;
  title: string | null;
  titleAr: string | null;
  content: string;
  contentAr: string | null;
  imageUrls: string[];
  attachmentUrls: string[];
  isPinned: boolean;
  isAnonymous: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  moderationStatus: ModerationStatus;
  pollOptions: Record<string, any> | null;
  pollVotes: Record<string, any> | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  comments?: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorUserId: string;
  content: string;
  contentAr: string | null;
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
  imageUrl: string | null;
  maxAttendees: number | null;
  rsvpCount: number;
}

export interface CommunityAlert {
  id: string;
  communityId: string;
  alertType: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  severity: string;
  isActive: boolean;
  expiresAt: string | null;
}
