import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function tokenize(str) {
  return (str || '').toLowerCase().split(/\s+/).filter(Boolean);
}

function relevanceScore(product, keywords) {
  const haystack = [
    product.title || '',
    product.name || '',
    product.description || '',
    product.tags || ''
  ].join(' ').toLowerCase();

  const tokens = tokenize(keywords);
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score++;
  }
  return score;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { hotspotId } = await req.json();

    if (!hotspotId) {
      return Response.json({ error: 'Missing hotspotId' }, { status: 400 });
    }

    console.log(`[searchKemetroProducts] Searching for hotspot ${hotspotId}`);

    // Get hotspot
    const hotspots = await base44.asServiceRole.entities.ImageHotspot.filter({ id: hotspotId });
    if (!hotspots?.length) {
      return Response.json({ error: 'Hotspot not found' }, { status: 404 });
    }
    const hotspot = hotspots[0];

    const results = [];
    const today = new Date().toISOString().split('T')[0];

    // 1. Sponsored product first (if active)
    if (
      hotspot.isSponsored &&
      hotspot.sponsoredProductId &&
      hotspot.sponsorshipStatus === 'active' &&
      (!hotspot.sponsorshipEndDate || hotspot.sponsorshipEndDate >= today)
    ) {
      const sponsoredProducts = await base44.asServiceRole.entities.KemetroProduct.filter({
        id: hotspot.sponsoredProductId,
        is_active: true
      });

      if (sponsoredProducts?.length) {
        const sponsored = sponsoredProducts[0];
        results.push({ ...sponsored, _isSponsored: true, _relevanceScore: 999 });

        // Log impression (free)
        await base44.asServiceRole.entities.HotspotSponsorshipLog.create({
          hotspotId,
          sellerId: hotspot.sponsoredBySellerId,
          eventType: 'impression',
          userId: null,
          sessionId: 'system',
          costEGP: 0,
          recordedAt: new Date().toISOString()
        });

        console.log(`[searchKemetroProducts] Sponsored product ${hotspot.sponsoredProductId} added`);
      }
    }

    const maxOrganicResults = 4 - results.length;

    // 2. Organic product search
    if (maxOrganicResults > 0) {
      const allProducts = await base44.asServiceRole.entities.KemetroProduct.filter({
        is_active: true
      }, '-created_date', 200);

      const searchKeywords = hotspot.searchKeywords || '';
      const categorySlug = hotspot.kemetroCategorySlug || '';

      const scored = (allProducts || [])
        .filter(p => {
          if (!p) return false;
          // Sponsored product already in results — skip
          if (hotspot.sponsoredProductId && p.id === hotspot.sponsoredProductId) return false;
          return true;
        })
        .map(p => ({
          ...p,
          _isSponsored: false,
          _relevanceScore: relevanceScore(p, searchKeywords)
        }))
        .filter(p => p._relevanceScore > 0)
        .sort((a, b) => {
          if (b._relevanceScore !== a._relevanceScore) return b._relevanceScore - a._relevanceScore;
          if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
          if (!!b.is_verified_seller !== !!a.is_verified_seller) return !!b.is_verified_seller ? 1 : -1;
          return 0;
        })
        .slice(0, maxOrganicResults);

      results.push(...scored);
    }

    console.log(`[searchKemetroProducts] Returning ${results.length} results`);

    return Response.json({
      success: true,
      hotspot: {
        id: hotspot.id,
        itemLabel: hotspot.itemLabel,
        kemetroCategorySlug: hotspot.kemetroCategorySlug,
        searchKeywords: hotspot.searchKeywords,
        deepLinkUrl: hotspot.deepLinkUrl
      },
      products: results
    }, { status: 200 });

  } catch (error) {
    console.error('[searchKemetroProducts] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});