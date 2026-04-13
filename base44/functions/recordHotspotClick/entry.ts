import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { hotspotId, userId, sessionId } = await req.json();

    if (!hotspotId || !sessionId) {
      return Response.json({ error: 'Missing hotspotId or sessionId' }, { status: 400 });
    }

    console.log(`[recordHotspotClick] Recording click for hotspot ${hotspotId}`);

    // Get hotspot
    const hotspots = await base44.asServiceRole.entities.ImageHotspot.filter({ id: hotspotId });
    if (!hotspots?.length) {
      return Response.json({ error: 'Hotspot not found' }, { status: 404 });
    }
    const hotspot = hotspots[0];

    // Update hotspot click count
    await base44.asServiceRole.entities.ImageHotspot.update(hotspotId, {
      clickCount: (hotspot.clickCount || 0) + 1,
      lastClickedAt: new Date().toISOString()
    });

    // Update image click count
    const images = await base44.asServiceRole.entities.AnalyzedPropertyImage.filter({ id: hotspot.imageId });
    if (images?.length) {
      const image = images[0];
      await base44.asServiceRole.entities.AnalyzedPropertyImage.update(image.id, {
        totalHotspotClicks: (image.totalHotspotClicks || 0) + 1
      });
    }

    // Record sponsorship if applicable
    if (hotspot.isSponsored && hotspot.sponsoredBySellerId) {
      const settings = await base44.asServiceRole.entities.ShopTheLookSettings.list();
      const config = settings?.[0];
      const costEGP = config?.sponsoredPinCostPerClickEGP || 2;

      await base44.asServiceRole.entities.HotspotSponsorshipLog.create({
        hotspotId,
        sellerId: hotspot.sponsoredBySellerId,
        eventType: 'click',
        userId: userId || null,
        sessionId,
        costEGP,
        recordedAt: new Date().toISOString()
      });

      // Update hotspot sponsorship spent
      await base44.asServiceRole.entities.ImageHotspot.update(hotspotId, {
        sponsorshipTotalSpentEGP: (hotspot.sponsorshipTotalSpentEGP || 0) + costEGP
      });

      console.log(`[recordHotspotClick] Recorded sponsored click cost ${costEGP} EGP`);
    }

    return Response.json({ success: true, message: 'Click recorded' }, { status: 200 });

  } catch (error) {
    console.error('[recordHotspotClick] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});