import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { communityId, postType, content, title, mediaUrls, isAnonymous, pollOptions, pollEndsAt, alertType, alertArea, marketplaceItemId } = body;

  if (!communityId || !content || !postType) {
    return Response.json({ error: 'communityId, content, and postType required' }, { status: 400 });
  }

  // Verify membership
  const membership = await base44.asServiceRole.entities.CommunityMember.filter({ communityId, userId: user.id });
  const member = membership[0];
  if (!member || member.role === 'pending' || member.role === 'banned') {
    return Response.json({ error: 'Not a verified member of this community' }, { status: 403 });
  }

  const communities = await base44.asServiceRole.entities.Community.filter({ id: communityId });
  const community = communities[0];

  const isAdmin = ['admin', 'owner', 'moderator', 'franchise_owner'].includes(member.role);
  const requiresApproval = community?.requirePostApproval && !isAdmin;

  const post = await base44.asServiceRole.entities.CommunityPost.create({
    communityId,
    authorId: user.id,
    authorName: isAnonymous ? null : user.full_name,
    authorUnit: isAnonymous ? null : member.unitNumber,
    postType,
    content,
    title: title || null,
    mediaUrls: mediaUrls || [],
    isAnonymous: isAnonymous || false,
    isAnnouncement: postType === 'announcement',
    pollOptions: pollOptions || null,
    pollEndsAt: pollEndsAt || null,
    alertType: alertType || null,
    alertArea: alertArea || null,
    alertStartsAt: postType === 'alert' ? new Date().toISOString() : null,
    alertConfirmations: postType === 'alert' ? 1 : 0,
    alertConfirmingUserIds: postType === 'alert' ? [user.id] : [],
    marketplaceItemId: marketplaceItemId || null,
    reactions: { like: 0, helpful: 0, important: 0, heart: 0, thanks: 0 },
    status: requiresApproval ? 'pending_approval' : 'published',
  });

  // Update community post count
  await base44.asServiceRole.entities.Community.update(communityId, {
    totalPosts: (community?.totalPosts || 0) + 1,
    postsThisWeek: (community?.postsThisWeek || 0) + 1,
  });

  // Update member post count
  await base44.asServiceRole.entities.CommunityMember.update(member.id, {
    postsCount: (member.postsCount || 0) + 1,
    lastActiveAt: new Date().toISOString(),
  });

  // Async: run AI moderation
  if (!requiresApproval) {
    base44.asServiceRole.functions.invoke('moderateCommunityPost', { postId: post.id }).catch(() => {});
  }

  // Async: detect Kemework opportunity
  if (['help_request', 'question', 'general', 'complaint'].includes(postType)) {
    base44.asServiceRole.functions.invoke('detectKemeworkOpportunity', { postId: post.id, content, communityId }).catch(() => {});
  }

  return Response.json({
    success: true,
    postId: post.id,
    status: post.status,
    requiresApproval,
  });
});