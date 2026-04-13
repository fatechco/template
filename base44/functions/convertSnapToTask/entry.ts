import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const {
    snapSessionId,
    userId,
    editedDescription,
    userBudgetEGP,
    materialsSuppliedBy,
    propertyId,
  } = await req.json();

  if (!snapSessionId) {
    return Response.json({ error: 'snapSessionId is required' }, { status: 400 });
  }

  // Prefer authenticated user over passed userId for security
  let resolvedUserId = userId;
  try {
    const authUser = await base44.auth.me();
    if (authUser?.id) resolvedUserId = authUser.id;
  } catch (_) {}

  if (!resolvedUserId) {
    return Response.json({ error: 'Login required to post task' }, { status: 401 });
  }

  // GET and validate snap session
  const sessions = await base44.asServiceRole.entities.SnapSession.filter({ id: snapSessionId }, '-created_date', 1);
  const snapSession = sessions?.[0];

  if (!snapSession) {
    return Response.json({ error: 'Snap session not found' }, { status: 404 });
  }

  if (snapSession.status !== 'completed') {
    return Response.json({ error: `Cannot convert session with status: ${snapSession.status}` }, { status: 409 });
  }

  const description = editedDescription ?? snapSession.technicalDescription;

  // Create KemeworkTask
  const task = await base44.asServiceRole.entities.KemeworkTask.create({
    userId: resolvedUserId,
    title: snapSession.diagnosedIssue,
    description,
    categorySlug: snapSession.kemeworkCategorySlug,
    urgencyLevel: snapSession.urgencyLevel,
    attachedImageUrl: snapSession.originalImageUrl,
    locationText: snapSession.locationText ?? null,
    cityId: snapSession.cityId ?? null,
    budgetEGP: userBudgetEGP ?? null,
    propertyId: propertyId ?? null,
    isSnapAndFix: true,
    snapSessionId: snapSession.id,
    materialsSuppliedBy: materialsSuppliedBy ?? 'professional',
    requiredMaterials: snapSession.requiredMaterials ?? [],
    status: 'open',
  });

  // Update SnapSession
  await base44.asServiceRole.entities.SnapSession.update(snapSession.id, {
    userId: resolvedUserId,
    status: 'converted',
    resultingTaskId: task.id,
    materialsSuppliedBy: materialsSuppliedBy ?? 'professional',
    convertedAt: new Date().toISOString(),
    userEditedDescription: !!editedDescription,
  });

  return Response.json({ task });
});