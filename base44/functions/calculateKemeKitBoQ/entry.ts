import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    const { templateId, lengthMeters, widthMeters, heightMeters, doorsCount, windowsCount } = await req.json();

    // Validate inputs
    if (!templateId || lengthMeters <= 0 || widthMeters <= 0 || heightMeters <= 0 || doorsCount < 0 || windowsCount < 0) {
      return Response.json({ error: 'Invalid dimensions' }, { status: 400 });
    }

    // STEP A — SURFACE AREA CALCULATIONS
    const floorAreaSqm = lengthMeters * widthMeters;
    const ceilingAreaSqm = lengthMeters * widthMeters;
    const grossWallAreaSqm = (2 * lengthMeters * heightMeters) + (2 * widthMeters * heightMeters);

    // Get settings for deductions
    const settings = await base44.entities.KemeKitSettings.list().then(s => s[0] || {
      doorDeductionSqm: 1.6,
      windowDeductionSqm: 1.4,
      standardDoorWidthM: 0.9,
      shippingWeightRateEGP: 15
    });

    const doorDeductionTotal = doorsCount * settings.doorDeductionSqm;
    const windowDeductionTotal = windowsCount * settings.windowDeductionSqm;
    const netWallAreaSqm = grossWallAreaSqm - doorDeductionTotal - windowDeductionTotal;
    const perimeterLinearMeters = (2 * (lengthMeters + widthMeters)) - (doorsCount * settings.standardDoorWidthM);

    // Get all KemeKitItems for this template
    const items = await base44.entities.KemeKitItem.filter(
      { templateId },
      'displayOrder',
      100
    );

    // STEP B — ITEM QUANTITY CALCULATION (Two passes)
    const calculatedItems = [];
    const itemMap = new Map();

    // Pass 1: Non-ratio items
    for (const item of items.filter(i => i.calculationRule !== 'ratio_to_parent')) {
      const calculated = calculateItemQuantity(
        item, floorAreaSqm, netWallAreaSqm, ceilingAreaSqm,
        perimeterLinearMeters, settings
      );
      calculatedItems.push(calculated);
      itemMap.set(item.id, calculated);
    }

    // Pass 2: Ratio-to-parent items
    for (const item of items.filter(i => i.calculationRule === 'ratio_to_parent')) {
      const parentItem = itemMap.get(item.parentItemId);
      const calculated = calculateItemQuantity(
        item, floorAreaSqm, netWallAreaSqm, ceilingAreaSqm,
        perimeterLinearMeters, settings, parentItem
      );
      calculatedItems.push(calculated);
      itemMap.set(item.id, calculated);
    }

    // STEP C — LIVE INVENTORY CHECK
    const withInventory = await Promise.all(
      calculatedItems.map(async (item) => {
        const product = await base44.entities.KemetroProduct.filter({ id: item.productId }).then(p => p[0]);
        if (!product) return { ...item, error: 'Product not found' };

        const currentPriceEGP = product.priceEGP || item.unitPriceEGP;
        const stockAvailable = product.stockQuantity || 0;
        const isLowStock = stockAvailable < item.finalQty;
        const subtotalEGP = item.finalQty * currentPriceEGP;

        return {
          kitItemId: item.kitItemId,
          productId: item.productId,
          productName: item.productName,
          productImageUrl: item.productImageUrl,
          role: item.role,
          isOptional: item.isOptional,
          isHighlighted: item.isHighlighted,
          isIncluded: true,
          calculationRule: item.calculationRule,
          baseQty: Math.round(item.baseQty * 100) / 100,
          wasteMarginPercent: item.wasteMarginPercent,
          qtyWithWaste: Math.round(item.qtyWithWaste * 100) / 100,
          finalQty: item.finalQty,
          unitPriceEGP: currentPriceEGP,
          subtotalEGP: subtotalEGP,
          isLowStock: isLowStock,
          stockAvailable: stockAvailable,
          displayOrder: item.displayOrder
        };
      })
    );

    // STEP D — TOTALS
    const totalMaterialCostEGP = withInventory
      .filter(i => i.isIncluded && !i.error)
      .reduce((sum, i) => sum + (i.subtotalEGP || 0), 0);

    const totalWeightKg = await calculateTotalWeight(withInventory, base44);

    const template = await base44.entities.KemeKitTemplate.filter({ id: templateId }).then(t => t[0]);
    const estimatedLaborCostEGP = template
      ? template.baseLaborRatePerSqmEGP * floorAreaSqm
      : 0;

    const estimatedShippingEGP = totalWeightKg * settings.shippingWeightRateEGP;

    // STEP E — SAVE CALCULATION
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const calculationData = {
      templateId,
      userId: user?.id || null,
      sessionToken,
      lengthMeters,
      widthMeters,
      heightMeters,
      doorsCount,
      windowsCount,
      floorAreaSqm,
      netWallAreaSqm,
      grossWallAreaSqm,
      ceilingAreaSqm,
      perimeterLinearMeters,
      calculatedBoQ: withInventory,
      totalMaterialCostEGP,
      totalWeightKg,
      estimatedLaborCostEGP,
      status: 'draft'
    };

    const calculation = await base44.entities.KemeKitCalculation.create(calculationData);

    // Update template stats
    await base44.asServiceRole.entities.KemeKitTemplate.update(templateId, {
      totalCalculationsRun: (template?.totalCalculationsRun || 0) + 1
    });

    return Response.json({
      calculationId: calculation.id,
      calculatedItems: withInventory,
      surfaces: {
        floorAreaSqm,
        netWallAreaSqm,
        grossWallAreaSqm,
        ceilingAreaSqm,
        perimeterLinearMeters
      },
      totalMaterialCostEGP,
      totalWeightKg,
      estimatedLaborCostEGP,
      estimatedShippingEGP
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function calculateItemQuantity(item, floorSqm, wallSqm, ceilingSqm, perimeterM, settings, parentItem = null) {
  let baseQty = 0;

  switch (item.calculationRule) {
    case 'floor_sqm':
      baseQty = floorSqm / item.coveragePerUnit;
      break;
    case 'wall_sqm':
      baseQty = wallSqm / item.coveragePerUnit;
      break;
    case 'ceiling_sqm':
      baseQty = ceilingSqm / item.coveragePerUnit;
      break;
    case 'floor_wall_sqm':
      baseQty = (floorSqm + wallSqm) / item.coveragePerUnit;
      break;
    case 'linear_meter':
      baseQty = perimeterM / item.coveragePerUnit;
      break;
    case 'fixed_quantity':
      baseQty = item.fixedQuantity || 0;
      break;
    case 'ratio_to_parent':
      baseQty = parentItem ? parentItem.finalQty * item.ratioMultiplier : 0;
      break;
  }

  const qtyWithWaste = baseQty * (1 + (item.wasteMarginPercent || 0) / 100);
  const finalQty = Math.ceil(qtyWithWaste);

  return {
    kitItemId: item.id,
    baseQty,
    wasteMarginPercent: item.wasteMarginPercent || 0,
    qtyWithWaste,
    finalQty,
    unitPriceEGP: item.productPriceEGP,
    displayOrder: item.displayOrder,
    productName: item.productName,
    productImageUrl: item.productImageUrl,
    role: item.role,
    isOptional: item.isOptional,
    isHighlighted: item.isHighlighted,
    calculationRule: item.calculationRule,
    productId: item.productId
  };
}

async function calculateTotalWeight(items, base44) {
  let totalWeight = 0;
  for (const item of items) {
    if (item.error) continue;
    const product = await base44.entities.KemetroProduct.filter({ id: item.productId }).then(p => p[0]);
    if (product?.weightKg) {
      totalWeight += item.finalQty * product.weightKg;
    }
  }
  return totalWeight;
}