import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { signalType, entityType, entityId, metadata, sessionId, deviceType, platform } = await req.json();

    if (!signalType) return Response.json({ error: 'signalType required' }, { status: 400 });

    const timestamp = new Date().toISOString();

    // 1. Save signal
    await base44.asServiceRole.entities.DNASignal.create({
      userId: user.id,
      signalType,
      entityType: entityType || null,
      entityId: entityId || null,
      metadata: metadata || {},
      sessionId: sessionId || `sess_${Date.now()}`,
      deviceType: deviceType || 'unknown',
      platform: platform || 'web',
      timestamp
    });

    // 2. Partial DNA update based on signal type
    const existing = await base44.asServiceRole.entities.UserDNA.filter({ userId: user.id });
    let dna = existing[0];

    if (!dna) {
      dna = await base44.asServiceRole.entities.UserDNA.create({
        userId: user.id,
        dnaVersion: '1.0',
        dnaCompleteness: 0,
        totalSignalsProcessed: 0,
        lastRecalculated: timestamp
      });
    }

    const updates = {
      totalSignalsProcessed: (dna.totalSignalsProcessed || 0) + 1
    };

    // Partial updates per signal type
    if (signalType === 'property_viewed' && metadata?.propertyType) {
      const propDNA = dna.propertyDNA || {};
      const viewed = propDNA.viewedPropertyTypes || [];
      const existing = viewed.find(v => v.type === metadata.propertyType);
      if (existing) {
        existing.count = (existing.count || 0) + 1;
        existing.avgTimeSeconds = Math.round(((existing.avgTimeSeconds || 0) + (metadata.duration || 0)) / 2);
      } else {
        viewed.push({ type: metadata.propertyType, count: 1, avgTimeSeconds: metadata.duration || 0 });
      }
      updates.propertyDNA = { ...propDNA, viewedPropertyTypes: viewed };
    }

    if (signalType === 'property_search_performed' && metadata?.cityId) {
      const geoDNA = dna.geographicDNA || {};
      const cities = geoDNA.targetCities || [];
      const city = cities.find(c => c.cityId === metadata.cityId);
      if (city) {
        city.searchCount = (city.searchCount || 0) + 1;
        city.score = Math.min(100, (city.score || 0) + 5);
      } else {
        cities.push({ cityId: metadata.cityId, score: 10, searchCount: 1 });
      }
      updates.geographicDNA = { ...geoDNA, targetCities: cities };
    }

    if (signalType === 'feature_visited' && metadata?.feature) {
      const platDNA = dna.platformDNA || {};
      const features = platDNA.featuresUsed || [];
      const feat = features.find(f => f.feature === metadata.feature);
      if (feat) {
        feat.usageCount = (feat.usageCount || 0) + 1;
        feat.lastUsed = timestamp;
      } else {
        features.push({ feature: metadata.feature, usageCount: 1, lastUsed: timestamp });
      }
      updates.platformDNA = { ...platDNA, featuresUsed: features };
    }

    if (['live_event_attended', 'live_event_registered'].includes(signalType)) {
      const cross = dna.crossModuleSignals || {};
      updates.crossModuleSignals = { ...cross, liveEventsAttended: (cross.liveEventsAttended || 0) + 1 };
    }

    if (signalType === 'kemework_task_posted') {
      const cross = dna.crossModuleSignals || {};
      const kw = cross.kemeworkActivity || {};
      updates.crossModuleSignals = {
        ...cross,
        kemeworkActivity: { ...kw, jobsPosted: (kw.jobsPosted || 0) + 1 }
      };
    }

    if (signalType === 'kemetro_order_placed') {
      const cross = dna.crossModuleSignals || {};
      const kt = cross.kemetroActivity || {};
      updates.crossModuleSignals = {
        ...cross,
        kemetroActivity: {
          ...kt,
          ordersPlaced: (kt.ordersPlaced || 0) + 1,
          totalSpend: (kt.totalSpend || 0) + (metadata?.amount || 0)
        }
      };
    }

    // Recalculate completeness
    const dimensions = ['propertyDNA', 'financialDNA', 'timingDNA', 'geographicDNA', 'intentDNA', 'platformDNA', 'communicationDNA', 'learningDNA'];
    const updatedDna = { ...dna, ...updates };
    const filledDimensions = dimensions.filter(d => updatedDna[d] && Object.keys(updatedDna[d]).length > 0);
    updates.dnaCompleteness = Math.round((filledDimensions.length / dimensions.length) * 100);

    await base44.asServiceRole.entities.UserDNA.update(dna.id, updates);

    return Response.json({ success: true, signalsProcessed: updates.totalSignalsProcessed, dnaCompleteness: updates.dnaCompleteness });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});