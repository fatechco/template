import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { communityId } = await req.json();
  if (!communityId) return Response.json({ error: 'communityId required' }, { status: 400 });

  const [communities, posts, alerts, events, items] = await Promise.all([
    base44.asServiceRole.entities.Community.filter({ id: communityId }),
    base44.asServiceRole.entities.CommunityPost.filter({ communityId, status: 'published' }),
    base44.asServiceRole.entities.CommunityAlert.filter({ communityId }),
    base44.asServiceRole.entities.CommunityEvent.filter({ communityId, status: 'upcoming' }),
    base44.asServiceRole.entities.MarketplaceItem.filter({ communityId, status: 'active' }),
  ]);

  const community = communities[0];
  if (!community) return Response.json({ error: 'Community not found' }, { status: 404 });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentPosts = posts
    .filter(p => new Date(p.created_date) > weekAgo)
    .sort((a, b) => (b.reactionsCount + b.commentsCount) - (a.reactionsCount + a.commentsCount))
    .slice(0, 5);

  const activeAlerts = alerts.filter(a => !a.isResolved).slice(0, 3);
  const resolvedAlerts = alerts.filter(a => a.isResolved && new Date(a.resolvedAt) > weekAgo).slice(0, 3);

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Generate a friendly weekly digest email for a neighborhood community called "${community.communityName}".

Community type: ${community.communityType}
Total members: ${community.totalMembers}

Top posts this week (${recentPosts.length}):
${recentPosts.map(p => `- [${p.postType}] ${p.title || p.content.substring(0, 80)} (${p.reactionsCount} reactions, ${p.commentsCount} comments)`).join('\n')}

Active alerts (${activeAlerts.length}):
${activeAlerts.map(a => `- ${a.alertType}: ${a.title} (${a.isResolved ? 'Resolved' : 'Ongoing'})`).join('\n')}

Upcoming events (${events.length}):
${events.slice(0, 3).map(e => `- ${e.title} on ${new Date(e.startsAt).toLocaleDateString('en-EG')}`).join('\n')}

Marketplace items active: ${items.length}

Write a warm, community-focused summary in English. Tone: friendly neighbor, not corporate.
Max 300 words. Include emojis.

Return JSON: { "subject": "email subject line", "body": "full email body HTML", "highlights": ["3 key highlights"] }`,
    response_json_schema: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        body: { type: 'string' },
        highlights: { type: 'array', items: { type: 'string' } }
      }
    }
  });

  // Send to all members
  const members = await base44.asServiceRole.entities.CommunityMember.filter({ communityId, role: 'member', verificationStatus: 'verified' });
  let sent = 0;
  for (const m of members.slice(0, 100)) {
    if (m.userEmail) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: m.userEmail,
        subject: result.subject,
        body: result.body,
      }).catch(() => {});
      sent++;
    }
  }

  return Response.json({ success: true, sent, subject: result.subject, highlights: result.highlights });
});