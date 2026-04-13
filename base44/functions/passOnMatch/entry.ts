import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { matchId } = await req.json();

  const matches = await base44.entities.SwapMatch.filter({ id: matchId });
  const match = matches?.[0];
  if (!match) return Response.json({ error: 'Match not found' }, { status: 404 });

  if (match.userAId !== user.id && match.userBId !== user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  await base44.entities.SwapMatch.update(matchId, { status: 'rejected' });

  // Graceful — no notification sent to other party
  return Response.json({ success: true });
});