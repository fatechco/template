import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { areaId, districtId, cityId } = await req.json();

    if (!areaId && !districtId && !cityId) {
      return Response.json({ error: 'Area, district, or city ID required' }, { status: 400 });
    }

    // Fetch all data points for this location
    const query = {};
    if (areaId) query.areaId = areaId;
    if (districtId) query.districtId = districtId;
    if (cityId) query.cityId = cityId;

    const dataPoints = await base44.entities.LifeScoreDataPoint.filter(query, undefined, 1000);
    const lifeScoreRecords = await base44.entities.NeighborhoodLifeScore.filter(query);

    // Calculate scores for each dimension
    const scores = calculateDimensionScores(dataPoints);
    
    // Calculate overall score with weights
    const weights = {
      walkability: 0.12,
      noise: 0.10,
      green: 0.12,
      safety: 0.20,
      connectivity: 0.15,
      education: 0.12,
      convenience: 0.12,
      healthcare: 0.07
    };

    const overallScore = Object.keys(weights).reduce((sum, dim) => {
      return sum + (scores[dim] || 0) * weights[dim];
    }, 0);

    const grade = assignGrade(overallScore);
    const dataCompleteness = calculateCompleteness(scores);

    // Prepare update data
    const updateData = {
      walkabilityScore: Math.round(scores.walkability),
      noiseScore: Math.round(scores.noise),
      greenScore: Math.round(scores.green),
      safetyScore: Math.round(scores.safety),
      connectivityScore: Math.round(scores.connectivity),
      educationScore: Math.round(scores.education),
      convenienceScore: Math.round(scores.convenience),
      healthcareScore: Math.round(scores.healthcare),
      overallLifeScore: Math.round(overallScore),
      overallGrade: grade,
      dataCompleteness: Math.round(dataCompleteness),
      lastUpdated: new Date().toISOString()
    };

    // Update or create record
    if (lifeScoreRecords.length > 0) {
      await base44.entities.NeighborhoodLifeScore.update(lifeScoreRecords[0].id, updateData);
      return Response.json({ success: true, scores: updateData });
    }

    return Response.json({ success: true, scores: updateData });
  } catch (error) {
    console.error('Calculate Life Score error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function calculateDimensionScores(dataPoints) {
  const scoresByDimension = {
    walkability: calculateWalkability(dataPoints),
    noise: calculateNoise(dataPoints),
    green: calculateGreen(dataPoints),
    safety: calculateSafety(dataPoints),
    connectivity: calculateConnectivity(dataPoints),
    education: calculateEducation(dataPoints),
    convenience: calculateConvenience(dataPoints),
    healthcare: calculateHealthcare(dataPoints)
  };
  return scoresByDimension;
}

function calculateWalkability(dataPoints) {
  const walkPoints = dataPoints.filter(p => p.dimension === 'walkability');
  if (walkPoints.length === 0) return 50;
  
  let score = 50;
  const destinationCount = walkPoints.reduce((sum, p) => sum + (p.value.count || 0), 0);
  
  if (destinationCount >= 20) score = 85;
  else if (destinationCount >= 11) score = 65;
  else if (destinationCount >= 6) score = 40;
  else if (destinationCount >= 3) score = 20;
  else score = 0;
  
  // Bonuses
  if (walkPoints.some(p => p.value.nearestShop < 200)) score += 10;
  if (walkPoints.some(p => p.value.nearestPark < 500)) score += 10;
  
  return Math.min(100, score);
}

function calculateNoise(dataPoints) {
  const noisePoints = dataPoints.filter(p => p.dimension === 'noise');
  let score = 100;
  
  if (noisePoints.length === 0) return 60;
  
  // Deductions based on proximity to noise sources
  noisePoints.forEach(p => {
    const dist = p.value.mainRoadProximity || p.value.distance || 0;
    if (dist < 100) score -= 40;
    else if (dist < 300) score -= 20;
    else if (dist < 500) score -= 10;
    
    if (p.value.airportDistance < 10) score -= 25;
    else if (p.value.airportDistance < 20) score -= 10;
    
    if (p.value.trainDistance < 1) score -= 15;
  });
  
  return Math.max(0, score);
}

function calculateGreen(dataPoints) {
  const greenPoints = dataPoints.filter(p => p.dimension === 'green');
  if (greenPoints.length === 0) return 50;
  
  let score = 50;
  const parkCount = greenPoints.reduce((sum, p) => sum + (p.value.parkCount || 0), 0);
  
  if (parkCount >= 2) score = 65;
  else if (parkCount === 1) score = 40;
  else score = 20;
  
  // Bonuses
  if (greenPoints.some(p => p.value.waterBodyProximity < 500)) score += 15;
  if (greenPoints.some(p => p.value.airQuality === 'Good')) score += 10;
  
  return Math.min(100, score);
}

function calculateSafety(dataPoints) {
  const safetyPoints = dataPoints.filter(p => p.dimension === 'safety');
  let score = 70;
  
  safetyPoints.forEach(p => {
    if (p.value.crimeRate === 'low') score += 20;
    else if (p.value.crimeRate === 'high') score -= 30;
    
    if (p.value.gatedCommunity) score += 15;
  });
  
  return Math.max(0, Math.min(100, score));
}

function calculateConnectivity(dataPoints) {
  const connPoints = dataPoints.filter(p => p.dimension === 'connectivity');
  let internetScore = 20;
  let transportScore = 20;
  
  // Internet sub-score
  if (connPoints.some(p => p.value.fiberAvailable)) internetScore = 40;
  else if (connPoints.some(p => p.value.mobileSignal_4G)) internetScore = 20;
  
  // Transport sub-score
  if (connPoints.some(p => p.value.nearestMetroStation < 500)) transportScore = 60;
  else if (connPoints.some(p => p.value.nearestMetroStation < 1000)) transportScore = 45;
  else if (connPoints.some(p => p.value.busLinesCount > 3)) transportScore = 30;
  
  return Math.round(internetScore * 0.4 + transportScore * 0.6);
}

function calculateEducation(dataPoints) {
  const eduPoints = dataPoints.filter(p => p.dimension === 'education');
  if (eduPoints.length === 0) return 40;
  
  let score = 40;
  const schoolCount = eduPoints.reduce((sum, p) => sum + (p.value.schoolsTotal || 0), 0);
  
  if (schoolCount >= 5) score = 85;
  else if (schoolCount >= 3) score = 50;
  else if (schoolCount >= 1) score = 30;
  
  if (eduPoints.some(p => p.value.internationalSchools > 0)) score = Math.max(score, 75);
  
  return Math.min(100, score);
}

function calculateConvenience(dataPoints) {
  const convPoints = dataPoints.filter(p => p.dimension === 'convenience');
  let score = 40;
  
  if (convPoints.some(p => p.value.supermarkets > 0 && p.value.nearestSupermarket < 500)) score += 20;
  if (convPoints.some(p => p.value.pharmacies > 0 && p.value.nearestPharmacy < 500)) score += 15;
  if (convPoints.some(p => p.value.restaurants > 0)) score += 10;
  if (convPoints.some(p => p.value.malls > 0)) score += 10;
  
  return Math.min(100, score);
}

function calculateHealthcare(dataPoints) {
  const healthPoints = dataPoints.filter(p => p.dimension === 'healthcare');
  let score = 40;
  
  if (healthPoints.some(p => p.value.hospitals > 0 && p.value.nearestHospital < 5000)) score += 30;
  else if (healthPoints.some(p => p.value.clinics > 0)) score += 15;
  
  if (healthPoints.some(p => p.value.privateHospital)) score += 15;
  
  return Math.min(100, score);
}

function assignGrade(score) {
  if (score >= 90) return 'exceptional';
  if (score >= 80) return 'excellent';
  if (score >= 70) return 'very_good';
  if (score >= 60) return 'good';
  if (score >= 50) return 'average';
  if (score >= 40) return 'below_average';
  return 'poor';
}

function calculateCompleteness(scores) {
  const filledDimensions = Object.values(scores).filter(s => s > 0).length;
  return (filledDimensions / 8) * 100;
}