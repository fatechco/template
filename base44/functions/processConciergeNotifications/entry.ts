import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

function buildEmailHtml(title, body, ctaLabel, ctaUrl) {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border-radius:16px;border:1px solid #f0f0f0;">
  <div style="font-size:32px;margin-bottom:16px;">🗝️</div>
  <h2 style="color:#1a1a2e;font-size:20px;margin:0 0 12px;">${title}</h2>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">${body.replace(/\n/g, '<br/>')}</p>
  <a href="${ctaUrl}" style="display:inline-block;background:#FF6B00;color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px;">${ctaLabel}</a>
  <p style="color:#aaa;font-size:12px;margin-top:32px;">Kemedar Move-In Concierge · Unsubscribe</p>
</div>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // ── 1. TASK DUE notifications ─────────────────────────────
    const tasksToNotify = await base44.asServiceRole.entities.ConciergeTask.filter({
      status: 'Pending',
      isNotified: false,
      dueDate: { $lte: today }
    });

    let notificationCount = 0;

    for (const task of (tasksToNotify || [])) {
      await base44.asServiceRole.entities.ConciergeTask.update(task.id, { status: 'Due' });

      const [users, properties] = await Promise.all([
        base44.asServiceRole.entities.User.filter({ id: task.userId }),
        base44.asServiceRole.entities.Property.filter({ id: task.propertyId }),
      ]);
      if (!users?.length || !properties?.length) continue;

      const user = users[0];
      const property = properties[0];
      const cityName = property.city_name || '';
      const descShort = truncate(task.description || '', 80);

      let title, body, ctaLabel, ctaUrl;

      // Build deep link with params
      let deepLink = task.deepLinkPath || '/dashboard';
      if (task.autoFillParams && typeof task.autoFillParams === 'object') {
        const params = new URLSearchParams(task.autoFillParams);
        if (task.categoryTarget) params.set('category', task.categoryTarget);
        if (cityName) params.set('location', cityName);
        if (task.discountCode) params.set('promo', task.discountCode);
        deepLink = `${task.deepLinkPath}?${params.toString()}`;
      }

      if (task.moduleTarget === 'kemework') {
        title = `${task.icon || '👷'} Time for: ${task.title}`;
        body = `${descShort}\nFind top-rated ${task.categoryTarget || 'professionals'} in ${cityName} on Kemework.`;
        ctaLabel = 'Book Now on Kemework →';
        ctaUrl = deepLink;
      } else if (task.moduleTarget === 'kemetro') {
        title = `${task.icon || '🛒'} ${task.title}`;
        body = descShort;
        if (task.discountCode) body += `\nUse code ${task.discountCode} for ${task.discountPercent || 5}% off!`;
        ctaLabel = 'Shop on Kemetro →';
        ctaUrl = deepLink;
      } else {
        title = `${task.icon || '📋'} ${task.title}`;
        body = descShort;
        ctaLabel = 'View on Kemedar →';
        ctaUrl = deepLink;
      }

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: title,
          body: buildEmailHtml(title, body, ctaLabel, ctaUrl),
        });
      } catch (e) {
        console.warn(`Email failed for task ${task.id}:`, e.message);
      }

      await base44.asServiceRole.entities.ConciergeTask.update(task.id, {
        isNotified: true,
        notifiedAt: now.toISOString(),
        notificationChannel: 'email',
      });
      notificationCount++;
    }

    // ── 2. MOVE-IN DATE APPROACHING (3 days) ─────────────────
    const allJourneys = await base44.asServiceRole.entities.ConciergeJourney.filter({ status: 'Active' });
    const in3Days = new Date(); in3Days.setDate(in3Days.getDate() + 3);
    const in3Str = in3Days.toISOString().split('T')[0];

    for (const journey of (allJourneys || [])) {
      if (!journey.moveInDate) continue;
      if (journey.moveInDate !== in3Str) continue;

      const pendingTasks = await base44.asServiceRole.entities.ConciergeTask.filter({
        journeyId: journey.id,
        status: 'Pending',
      });
      const pendingCount = pendingTasks?.length || 0;
      if (pendingCount === 0) continue;

      const users = await base44.asServiceRole.entities.User.filter({ id: journey.userId });
      if (!users?.length) continue;
      const user = users[0];

      const title = '📅 3 days until you move in!';
      const body = `You have ${pendingCount} task${pendingCount !== 1 ? 's' : ''} still pending on your Kemedar Move-In Concierge.`;
      const ctaUrl = `/dashboard/concierge/${journey.id}`;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: title,
          body: buildEmailHtml(title, body, 'View My Journey →', ctaUrl),
        });
        notificationCount++;
      } catch (e) {
        console.warn(`Move-in approach email failed:`, e.message);
      }
    }

    // ── 3. JOURNEY HALF-COMPLETE milestone ────────────────────
    for (const journey of (allJourneys || [])) {
      const pct = journey.completionPercentage || 0;
      if (pct < 50 || pct >= 60) continue; // ~50% window, only once
      if (journey.celebrationModalShown) continue; // use as proxy for milestone sent

      const users = await base44.asServiceRole.entities.User.filter({ id: journey.userId });
      if (!users?.length) continue;
      const user = users[0];

      const done = journey.completedTasks || 0;
      const title = `🎯 Halfway there! ${done} tasks done.`;
      const body = `Keep going — you're making great progress on your move-in journey.`;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: title,
          body: buildEmailHtml(title, body, 'Continue Concierge →', `/dashboard/concierge/${journey.id}`),
        });
        notificationCount++;
      } catch (e) {
        console.warn(`Half-complete email failed:`, e.message);
      }
    }

    // ── 4. JOURNEY COMPLETE ───────────────────────────────────
    const completedJourneys = await base44.asServiceRole.entities.ConciergeJourney.filter({
      status: 'Completed',
      celebrationModalDismissed: false,
    });

    for (const journey of (completedJourneys || [])) {
      const users = await base44.asServiceRole.entities.User.filter({ id: journey.userId });
      const properties = journey.propertyId
        ? await base44.asServiceRole.entities.Property.filter({ id: journey.propertyId })
        : [];
      if (!users?.length) continue;

      const user = users[0];
      const propTitle = properties[0]?.title || 'your new home';
      const title = '🎉 Move-in complete — congratulations!';
      const body = `You finished all your move-in tasks for ${propTitle}. Enjoy your new home!`;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: title,
          body: buildEmailHtml(title, body, 'View My Home →', `/dashboard/concierge/${journey.id}`),
        });
        // Mark so we don't resend
        await base44.asServiceRole.entities.ConciergeJourney.update(journey.id, {
          celebrationModalDismissed: true,
        });
        notificationCount++;
      } catch (e) {
        console.warn(`Completion email failed:`, e.message);
      }
    }

    // ── 5. RE-ENGAGEMENT (3 days no activity) ────────────────
    const reengageDate = new Date(); reengageDate.setDate(reengageDate.getDate() - 3);

    for (const journey of (allJourneys || [])) {
      if (!journey.lastActivityAt) continue;
      const lastActive = new Date(journey.lastActivityAt);
      if (lastActive > reengageDate) continue;

      const pendingTasks = await base44.asServiceRole.entities.ConciergeTask.filter({
        journeyId: journey.id,
        status: 'Pending',
      });
      if (!pendingTasks?.length) continue;

      const users = await base44.asServiceRole.entities.User.filter({ id: journey.userId });
      if (!users?.length) continue;
      const user = users[0];

      const nextTask = pendingTasks[0];
      const dl = nextTask?.dueDate ? dueDateLabel(nextTask.dueDate) : 'soon';

      const title = `🗝️ Don't forget your move-in tasks`;
      const body = `You have ${pendingTasks.length} pending task${pendingTasks.length !== 1 ? 's' : ''} on your Move-In Concierge.\nYour next task is due ${dl}.`;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: title,
          body: buildEmailHtml(title, body, 'Open Concierge →', `/dashboard/concierge/${journey.id}`),
        });
        notificationCount++;
      } catch (e) {
        console.warn(`Re-engagement email failed:`, e.message);
      }
    }

    return Response.json({
      message: 'Notifications processed',
      notificationsSent: notificationCount,
    }, { status: 200 });

  } catch (error) {
    console.error('processConciergeNotifications error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function dueDateLabel(dateStr) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.round((d - now) / 86400000);
    if (diff === 0) return 'today';
    if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? 's' : ''} ago`;
    return `in ${diff} day${diff !== 1 ? 's' : ''}`;
  } catch { return 'soon'; }
}