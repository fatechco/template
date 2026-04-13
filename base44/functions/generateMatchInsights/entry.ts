import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { propertyId } = await req.json();

  const [swipes, props] = await Promise.all([
    base44.entities.PropertySwipe.filter({ propertyId }),
    base44.entities.Property.filter({ id: propertyId })
  ]);

  if (!props.length) return Response.json({ error: 'Property not found' }, { status: 404 });
  const property = props[0];

  const totalSwipes = swipes.length;
  const likes = swipes.filter(s => s.action === 'like');
  const superLikes = swipes.filter(s => s.action === 'super_like');
  const passes = swipes.filter(s => s.action === 'pass');
  const likeRate = totalSwipes > 0 ? Math.round((likes.length + superLikes.length) / totalSwipes * 100) : 0;
  const avgViewDuration = totalSwipes > 0 ? Math.round(swipes.reduce((s, sw) => s + (sw.viewDuration || 0), 0) / totalSwipes) : 0;
  const avgPhotosViewed = totalSwipes > 0 ? Math.round(swipes.reduce((s, sw) => s + (sw.photosViewed || 0), 0) / totalSwipes) : 0;

  // AI insights
  const aiResult = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a real estate match analytics AI. Analyze this property's swipe performance:
Property: ${property.title}
Price: ${property.price_amount} ${property.currency || 'EGP'}
Type: ${property.category_name}
Location: ${property.city_name}, ${property.district_name}
Beds: ${property.beds}, Baths: ${property.baths}, Area: ${property.area_size}m²

Match Stats:
- Total swipes: ${totalSwipes}
- Likes: ${likes.length}
- Super Likes: ${superLikes.length}
- Passes: ${passes.length}
- Like rate: ${likeRate}%
- Avg view duration: ${avgViewDuration}s (fast < 5s means low interest, > 30s means high interest)
- Avg photos viewed: ${avgPhotosViewed}

Generate insights in JSON format.`,
    response_json_schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        topStrengths: { type: "array", items: { type: "string" } },
        topWeaknesses: { type: "array", items: { type: "string" } },
        priceAssessment: { type: "string" },
        photoAssessment: { type: "string" },
        recommendations: { type: "array", items: { type: "object", properties: { action: { type: "string" }, impact: { type: "string" } } } }
      }
    }
  });

  const insight = await base44.entities.MatchInsight.create({
    propertyId,
    sellerId: property.created_by || user.id,
    totalSwipes,
    totalLikes: likes.length,
    totalPasses: passes.length,
    totalSuperLikes: superLikes.length,
    likeRate,
    superLikeRate: totalSwipes > 0 ? Math.round(superLikes.length / totalSwipes * 100) : 0,
    avgViewDuration,
    avgPhotosViewed,
    aiInsightsSummary: aiResult?.summary || '',
    aiTopStrengths: aiResult?.topStrengths || [],
    aiTopWeaknesses: aiResult?.topWeaknesses || [],
    aiPriceAssessment: aiResult?.priceAssessment || '',
    aiPhotoAssessment: aiResult?.photoAssessment || '',
    aiRecommendations: aiResult?.recommendations || [],
    periodStart: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    periodEnd: new Date().toISOString().slice(0, 10),
    lastCalculated: new Date().toISOString()
  });

  return Response.json({ insight });
});