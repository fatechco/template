import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const FINISHING_MULTIPLIERS = {
  'Unfinished': 0.75,
  'Semi-finished': 0.85,
  'Finished': 1.0,
  'Fully Furnished': 1.20,
};

const VIEW_MULTIPLIERS = {
  'Street': 1.0,
  'Garden': 1.05,
  'City': 1.07,
  'Sea': 1.15,
  'Pool': 1.10,
  'None': 1.0,
};

function getFloorMultiplier(floor) {
  if (floor === 0) return 0.92;
  if (floor <= 3) return 0.97;
  if (floor <= 7) return 1.0;
  if (floor <= 15) return 1.03;
  return 1.06;
}

function getAgeMultiplier(yearBuilt) {
  if (!yearBuilt) return 1.0;
  const age = new Date().getFullYear() - yearBuilt;
  if (age <= 2) return 1.10;
  if (age <= 5) return 1.05;
  if (age <= 10) return 1.0;
  if (age <= 20) return 0.95;
  return 0.88;
}

function getInvestmentGrade(score) {
  if (score >= 85) return 'A+';
  if (score >= 75) return 'A';
  if (score >= 65) return 'B+';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

function getDemandLevel(score) {
  if (score >= 80) return 'Very High';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  if (score >= 20) return 'Low';
  return 'Very Low';
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const inputs = await req.json();

  // Find market data
  let marketData = null;
  try {
    const districtData = inputs.districtId
      ? await base44.entities.MarketPriceIndex.filter({
          cityId: inputs.cityId,
          districtId: inputs.districtId,
          propertyType: inputs.propertyType,
          purpose: inputs.purpose,
        })
      : [];

    if (districtData && districtData.length > 0) {
      marketData = districtData[0];
    } else {
      const cityData = await base44.entities.MarketPriceIndex.filter({
        cityId: inputs.cityId,
        propertyType: inputs.propertyType,
        purpose: inputs.purpose,
      });
      if (cityData && cityData.length > 0) marketData = cityData[0];
    }
  } catch (e) {
    // no market data found
  }

  // Use fallback values if no market data
  const basePricePerSqm = marketData?.avgPricePerSqm || 2000;
  const avgSize = marketData?.avgSize || 120;
  const demandScore = marketData?.demandScore || 50;
  const avgRentalYield = marketData?.avgRentalYield || 5;
  const priceChange12 = marketData?.priceChange12Months || 3;

  // Apply multipliers
  const finishingMult = FINISHING_MULTIPLIERS[inputs.finishing] || 1.0;
  const floorMult = getFloorMultiplier(inputs.floor || 0);
  const viewMult = VIEW_MULTIPLIERS[inputs.viewType] || 1.0;
  const ageMult = getAgeMultiplier(inputs.yearBuilt);

  let amenityMult = 1.0;
  if (inputs.hasParking) amenityMult *= 1.03;
  if (inputs.hasPool) amenityMult *= 1.05;
  if (inputs.hasGarden) amenityMult *= 1.04;

  const totalMult = finishingMult * floorMult * viewMult * ageMult * amenityMult;
  const adjustedPricePerSqm = basePricePerSqm * totalMult;
  const midEstimate = adjustedPricePerSqm * inputs.totalArea;
  const minEstimate = midEstimate * 0.90;
  const maxEstimate = midEstimate * 1.10;

  // Accuracy score
  let accuracy = 60;
  if (inputs.districtId && marketData?.districtId) accuracy += 10;
  if (inputs.areaId) accuracy += 10;
  if ((marketData?.totalListings || 0) >= 50) accuracy += 5;
  if (marketData?.lastUpdated && (Date.now() - new Date(marketData.lastUpdated).getTime()) < 30 * 24 * 3600 * 1000) accuracy += 5;
  if (inputs.totalArea && inputs.bedrooms && inputs.bathrooms && inputs.finishing && inputs.yearBuilt) accuracy += 5;
  accuracy = Math.min(accuracy, 95);

  // Investment metrics
  const listedPrice = inputs.listedPrice || midEstimate;
  const priceVsMarket = ((listedPrice - midEstimate) / midEstimate) * 100;
  const sizeVsMarket = ((inputs.totalArea - avgSize) / avgSize) * 100;
  const rentalYield = avgRentalYield;

  // ROI score
  const priceScore = Math.max(0, Math.min(100, 100 - priceVsMarket));
  const demandScoreNorm = demandScore;
  const yieldScore = Math.min(100, (rentalYield / 10) * 100);
  const growthScore = Math.min(100, Math.max(0, (priceChange12 / 15) * 100));
  const locationScore = 65 + (inputs.districtId ? 10 : 0) + (inputs.areaId ? 5 : 0);
  const roiScore = Math.round((priceScore * 0.25 + demandScoreNorm * 0.25 + yieldScore * 0.2 + growthScore * 0.15 + locationScore * 0.15));
  const investmentGrade = getInvestmentGrade(roiScore);

  const trendDirection = priceChange12 > 2 ? 'Rising' : priceChange12 < -2 ? 'Declining' : 'Stable';

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 3600 * 1000);

  const valuationData = {
    userId: user.id,
    valuationGoal: inputs.valuationGoal,
    propertyType: inputs.propertyType,
    purpose: inputs.purpose,
    countryId: inputs.countryId,
    provinceId: inputs.provinceId,
    cityId: inputs.cityId,
    districtId: inputs.districtId,
    areaId: inputs.areaId,
    totalArea: inputs.totalArea,
    bedrooms: inputs.bedrooms,
    bathrooms: inputs.bathrooms,
    floor: inputs.floor,
    finishing: inputs.finishing,
    yearBuilt: inputs.yearBuilt,
    hasParking: inputs.hasParking || false,
    hasPool: inputs.hasPool || false,
    hasGarden: inputs.hasGarden || false,
    viewType: inputs.viewType,
    estimatedPriceMin: Math.round(minEstimate),
    estimatedPriceMax: Math.round(maxEstimate),
    estimatedPriceMid: Math.round(midEstimate),
    pricePerSqm: Math.round(adjustedPricePerSqm),
    marketAveragePricePerSqm: Math.round(basePricePerSqm),
    accuracyScore: accuracy,
    demandLevel: getDemandLevel(demandScore),
    demandScore: demandScore,
    priceVsMarket: Math.round(priceVsMarket * 10) / 10,
    sizeVsMarket: Math.round(sizeVsMarket * 10) / 10,
    rentalYield: Math.round(rentalYield * 10) / 10,
    roiScore: roiScore,
    investmentGrade: investmentGrade,
    trendDirection: trendDirection,
    trendPercentage: Math.round(priceChange12 * 10) / 10,
    locationScore: Math.min(100, locationScore),
    priceScore: Math.round(priceScore),
    demandScoreCalc: Math.round(demandScoreNorm),
    yieldScore: Math.round(yieldScore),
    growthScore: Math.round(growthScore),
    cityName: inputs.cityName || '',
    districtName: inputs.districtName || '',
    countryName: inputs.countryName || '',
    locationLabel: inputs.locationLabel || '',
    savedToPortfolio: inputs.valuationGoal === 'own_property',
    savedToMyValuations: inputs.valuationGoal === 'check_value',
    status: 'Completed',
    calculatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    marketData: marketData ? {
      avgDaysOnMarket: marketData.avgDaysOnMarket,
      activeListings: marketData.activeListings,
      priceChange1Month: marketData.priceChange1Month,
      priceChange3Months: marketData.priceChange3Months,
      priceChange6Months: marketData.priceChange6Months,
      priceChange12Months: marketData.priceChange12Months,
    } : null,
  };

  const saved = await base44.entities.PropertyValuation.create(valuationData);

  return Response.json({ valuation: saved, marketData });
});