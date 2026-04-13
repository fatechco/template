import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { communityId, unitNumber, ownershipType, proofDocumentUrl } = await req.json();
  if (!communityId) return Response.json({ error: 'communityId required' }, { status: 400 });

  const communities = await base44.asServiceRole.entities.Community.filter({ id: communityId });
  const community = communities[0];
  if (!community) return Response.json({ error: 'Community not found' }, { status: 404 });

  // Check already a member
  const existing = await base44.asServiceRole.entities.CommunityMember.filter({ communityId, userId: user.id });
  if (existing.length > 0) return Response.json({ error: 'Already a member', status: existing[0].role }, { status: 400 });

  // Determine role and verification status based on privacy
  let role = 'pending';
  let verificationStatus = 'pending';

  if (community.privacyLevel === 'public') {
    role = 'member';
    verificationStatus = 'unverified';
  }

  const member = await base44.asServiceRole.entities.CommunityMember.create({
    communityId,
    userId: user.id,
    userName: user.full_name,
    userEmail: user.email,
    role,
    verificationStatus,
    unitNumber: unitNumber || null,
    ownershipType: ownershipType || null,
    proofDocumentUrl: proofDocumentUrl || null,
    joinedAt: new Date().toISOString(),
    notificationPreferences: { announcements: true, alerts: true, marketplace: true, polls: true, generalPosts: false },
  });

  // Update community pending/member count
  if (role === 'pending') {
    await base44.asServiceRole.entities.Community.update(communityId, {
      pendingMembers: (community.pendingMembers || 0) + 1,
    });
  } else {
    await base44.asServiceRole.entities.Community.update(communityId, {
      totalMembers: (community.totalMembers || 0) + 1,
    });
  }

  return Response.json({
    success: true,
    memberId: member.id,
    role,
    verificationStatus,
    requiresApproval: role === 'pending',
  });
});