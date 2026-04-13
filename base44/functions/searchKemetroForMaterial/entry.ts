import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { snapSessionId, materialIndex } = await req.json();

  if (!snapSessionId || materialIndex === undefined || materialIndex === null) {
    return Response.json({ error: 'snapSessionId and materialIndex are required' }, { status: 400 });
  }

  // GET snap session
  const sessions = await base44.asServiceRole.entities.SnapSession.filter({ id: snapSessionId }, '-created_date', 1);
  const snapSession = sessions?.[0];

  if (!snapSession) {
    return Response.json({ error: 'Snap session not found' }, { status: 404 });
  }

  const materials = snapSession.requiredMaterials ?? [];
  const material = materials[materialIndex];

  if (!material) {
    return Response.json({ error: `No material found at index ${materialIndex}` }, { status: 404 });
  }

  const keywords = (material.kemetroSearchKeywords ?? material.itemName ?? '').toLowerCase();
  const keywordTokens = keywords.split(/\s+/).filter(Boolean);

  // Full-text search on KemetroProduct
  // Fetch active products and filter by keyword relevance
  const allProducts = await base44.asServiceRole.entities.KemetroProduct.filter(
    { is_active: true },
    '-created_date',
    200
  );

  // Score each product by how many keyword tokens appear in its searchable text
  const scored = (allProducts ?? []).map((product) => {
    const searchable = [
      product.title ?? '',
      product.name ?? '',
      product.description ?? '',
      product.tags ?? '',
      product.sku ?? '',
    ].join(' ').toLowerCase();

    const matchCount = keywordTokens.filter(token => searchable.includes(token)).length;
    return { product, matchCount };
  });

  // Sort by matchCount desc, then by rating desc
  const sorted = scored
    .filter(({ matchCount }) => matchCount > 0)
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return (b.product.rating ?? 0) - (a.product.rating ?? 0);
    });

  const top4 = sorted.slice(0, 4).map(({ product }) => product);

  return Response.json({
    material,
    products: top4,
    keywords,
  });
});