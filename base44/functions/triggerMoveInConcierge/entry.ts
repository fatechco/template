import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, propertyId, journeyType } = await req.json();

    if (!userId || !propertyId || !journeyType) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // STEP A: Check for existing journey
    const existingJourney = await base44.asServiceRole.entities.ConciergeJourney.filter({
      userId,
      propertyId,
      status: { $ne: 'Dismissed' }
    });

    if (existingJourney && existingJourney.length > 0) {
      return Response.json({ journey: existingJourney[0] }, { status: 200 });
    }

    // STEP B: Get property and select template
    const properties = await base44.asServiceRole.entities.Property.filter({ id: propertyId });
    if (!properties || properties.length === 0) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }

    const property = properties[0];
    
    // Query templates with specificity ordering
    const allTemplates = await base44.asServiceRole.entities.ConciergeJourneyTemplate.filter({
      isActive: true
    });

    let selectedTemplate = null;
    
    if (allTemplates && allTemplates.length > 0) {
      // Sort by specificity: city match > country match > global
      const sorted = allTemplates.sort((a, b) => {
        const aScore = (a.cityId === property.city_id ? 3 : 0) + (a.countryId === property.country_id ? 2 : 0) + (!a.cityId && !a.countryId ? 1 : 0);
        const bScore = (b.cityId === property.city_id ? 3 : 0) + (b.countryId === property.country_id ? 2 : 0) + (!b.cityId && !b.countryId ? 1 : 0);
        return bScore - aScore;
      });
      selectedTemplate = sorted[0];
    }

    // If no template exists, create journey with default tasks (fallback for fresh installs)
    const DEFAULT_TASKS = [
      { title: 'Legal & Contract Review', titleAr: 'مراجعة العقود القانونية', icon: '⚖️', moduleTarget: 'kemework', categoryTarget: 'Legal Services', triggerDayFromMoveIn: 0, sortOrder: 1 },
      { title: 'Deep Cleaning', titleAr: 'تنظيف شامل', icon: '🧹', moduleTarget: 'kemework', categoryTarget: 'Cleaning Services', triggerDayFromMoveIn: 2, sortOrder: 2 },
      { title: 'Moving & Packing', titleAr: 'نقل العفش', icon: '📦', moduleTarget: 'kemework', categoryTarget: 'Moving & Packing', triggerDayFromMoveIn: 5, sortOrder: 3 },
      { title: 'Internet & Utilities Setup', titleAr: 'إعداد الإنترنت والمرافق', icon: '📡', moduleTarget: 'kemework', categoryTarget: 'Electrical Services', triggerDayFromMoveIn: 7, sortOrder: 4 },
      { title: 'Painting & Touch-ups', titleAr: 'الدهانات والتشطيبات', icon: '🎨', moduleTarget: 'kemetro', categoryTarget: 'paint', triggerDayFromMoveIn: 10, sortOrder: 5 },
      { title: 'Furniture & Appliances', titleAr: 'الأثاث والأجهزة', icon: '🛋️', moduleTarget: 'kemetro', categoryTarget: 'furniture', triggerDayFromMoveIn: 14, sortOrder: 6 },
    ];

    if (!selectedTemplate) {
      // Create journey without template
      const today = new Date().toISOString().split('T')[0];
      const journey = await base44.asServiceRole.entities.ConciergeJourney.create({
        userId, propertyId, templateId: null, journeyType,
        journeyStartDate: today, status: 'Active', moveInDate: null,
        completionPercentage: 0, totalTasks: DEFAULT_TASKS.length,
        completedTasks: 0, actionedTasks: 0, skippedTasks: 0,
        celebrationModalShown: false, celebrationModalDismissed: false
      });
      for (const t of DEFAULT_TASKS) {
        await base44.asServiceRole.entities.ConciergeTask.create({
          journeyId: journey.id, userId, propertyId,
          title: t.title, titleAr: t.titleAr, icon: t.icon,
          moduleTarget: t.moduleTarget, categoryTarget: t.categoryTarget,
          triggerDayFromMoveIn: t.triggerDayFromMoveIn, sortOrder: t.sortOrder,
          status: 'Pending', isNotified: false, ctaClickCount: 0,
          dueDate: new Date().toISOString().split('T')[0],
        });
      }
      return Response.json({ journey, tasksCreated: DEFAULT_TASKS.length }, { status: 201 });
    }

    // STEP C: Create journey
    const today = new Date().toISOString().split('T')[0];
    const journey = await base44.asServiceRole.entities.ConciergeJourney.create({
      userId,
      propertyId,
      templateId: selectedTemplate.id,
      journeyType,
      journeyStartDate: today,
      status: 'Active',
      moveInDate: null,
      completionPercentage: 0,
      totalTasks: 0,
      completedTasks: 0,
      actionedTasks: 0,
      skippedTasks: 0,
      celebrationModalShown: false,
      celebrationModalDismissed: false
    });

    // STEP D: Auto-generate tasks
    const taskTemplates = await base44.asServiceRole.entities.ConciergeTaskTemplate.filter({
      journeyTemplateId: selectedTemplate.id,
      isActive: true
    });

    let taskCount = 0;
    if (taskTemplates && taskTemplates.length > 0) {
      const sortedTemplates = taskTemplates.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      
      for (const template of sortedTemplates) {
        // Calculate dueDate
        let dueDate;
        if (template.triggerDayFromMoveIn !== null && journey.moveInDate) {
          const moveInDate = new Date(journey.moveInDate);
          dueDate = new Date(moveInDate.getTime() + template.triggerDayFromMoveIn * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        } else {
          const startDate = new Date(journey.journeyStartDate);
          dueDate = new Date(startDate.getTime() + (template.triggerDay || 0) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }

        await base44.asServiceRole.entities.ConciergeTask.create({
          journeyId: journey.id,
          taskTemplateId: template.id,
          userId,
          propertyId,
          title: template.title,
          titleAr: template.titleAr,
          description: template.description,
          descriptionAr: template.descriptionAr,
          icon: template.icon,
          moduleTarget: template.moduleTarget,
          categoryTarget: template.categoryTarget,
          deepLinkPath: template.deepLinkPath,
          autoFillParams: template.autoFillParams,
          discountCode: template.discountCode || null,
          discountPercent: template.discountPercent || null,
          accentColor: template.accentColor,
          triggerDay: template.triggerDay,
          triggerDayFromMoveIn: template.triggerDayFromMoveIn || null,
          sortOrder: template.sortOrder || 0,
          status: 'Pending',
          isNotified: false,
          notifiedAt: null,
          notificationChannel: null,
          ctaClickedAt: null,
          ctaClickCount: 0,
          completedAt: null,
          skippedAt: null,
          dueDate
        });

        taskCount++;
      }
    }

    // STEP E: Update journey with task count
    const updatedJourney = await base44.asServiceRole.entities.ConciergeJourney.update(journey.id, {
      totalTasks: taskCount
    });

    return Response.json({ journey: updatedJourney, tasksCreated: taskCount }, { status: 201 });
  } catch (error) {
    console.error('triggerMoveInConcierge error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});