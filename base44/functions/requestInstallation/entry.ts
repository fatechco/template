import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Login required' }, { status: 401 });
    }

    const { calculationId, requestType, cityId, additionalNotes } = await req.json();

    if (!calculationId || !requestType) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (!['hire_creator', 'open_bidding'].includes(requestType)) {
      return Response.json({ error: 'Invalid requestType' }, { status: 400 });
    }

    // Get calculation and template
    const calculation = await base44.entities.KemeKitCalculation.filter({ id: calculationId }).then(c => c[0]);
    if (!calculation) {
      return Response.json({ error: 'Calculation not found' }, { status: 404 });
    }

    const template = await base44.entities.KemeKitTemplate.filter({ id: calculation.templateId }).then(t => t[0]);
    if (!template) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create Kemework Task
    const taskDescription = `Installation of KemeKit: ${template.title}
Room size: ${calculation.lengthMeters}m × ${calculation.widthMeters}m × ${calculation.heightMeters}m
Floor area: ${calculation.floorAreaSqm} sqm
Materials: ${calculation.calculatedBoQ.filter(i => i.isIncluded).length} items ordered via Kemetro
${additionalNotes ? `Additional notes: ${additionalNotes}` : ''}`;

    const taskData = {
      title: `Install: ${template.title}`,
      category: template.requiredProfessionalSkill,
      description: taskDescription,
      attachedBoQ: JSON.stringify(calculation.calculatedBoQ),
      materialsSuppliedBy: 'customer',
      budgetEGP: calculation.estimatedLaborCostEGP,
      cityId: cityId || user.cityId,
      isKemeKit: true,
      propertyAddress: `Room dimensions: ${calculation.lengthMeters}x${calculation.widthMeters}x${calculation.heightMeters}m`
    };

    let kemeworkTaskId = null;

    if (requestType === 'hire_creator') {
      taskData.assignedToProId = template.creatorId;
      // In real implementation, create task via Kemework API
      // For now, we simulate task creation
      console.log(`Creating assigned task for creator: ${template.creatorId}`);
    } else {
      // open_bidding - no assigned pro
      console.log(`Creating open bidding task in city: ${taskData.cityId}`);
    }

    // Create KemeKitInstallationRequest
    const installationRequest = await base44.entities.KemeKitInstallationRequest.create({
      calculationId,
      templateId: calculation.templateId,
      userId: user.id,
      requestType,
      assignedProId: requestType === 'hire_creator' ? template.creatorId : null,
      kemeworkTaskId,
      totalMaterialCostEGP: calculation.totalMaterialCostEGP,
      estimatedLaborCostEGP: calculation.estimatedLaborCostEGP,
      cityId: cityId || user.cityId,
      status: 'pending'
    });

    return Response.json({
      installationRequestId: installationRequest.id,
      kemeworkTaskId,
      requestType,
      message: requestType === 'hire_creator'
        ? `Installation request sent to ${template.creatorName}!`
        : 'Installation request posted for bidding!'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});