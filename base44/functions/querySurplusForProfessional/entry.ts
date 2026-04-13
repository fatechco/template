import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { cityId, categoryIds = [], latitude, longitude, radius = 10 } = body;

    // Fetch active surplus items in the same city
    const allItems = await base44.asServiceRole.entities.SurplusItem.filter(
      { status: 'active', cityId },
      '-created_date',
      50
    );

    // Filter by discount >= 40%
    const discounted = allItems.filter(i => (i.discountPercent || 0) >= 40);

    // Attach mock distance (real implementation would use Haversine from lat/lng fields)
    const withDistance = discounted.map(item => {
      let distKm = 5; // fallback
      if (item.latitude && item.longitude && latitude && longitude) {
        const R = 6371;
        const dLat = ((item.latitude - latitude) * Math.PI) / 180;
        const dLon = ((item.longitude - longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((latitude * Math.PI) / 180) *
            Math.cos((item.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      }
      return { ...item, distanceFromTaskKm: Math.round(distKm * 10) / 10 };
    });

    // Filter by radius
    const nearby = withDistance.filter(i => i.distanceFromTaskKm <= radius);

    // Sort by discount desc
    nearby.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

    return Response.json({ items: nearby.slice(0, 6) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});