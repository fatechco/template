import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { hotspotId, productId, userId, sessionId } = await req.json();

    if (!hotspotId || !productId || !sessionId) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    console.log(`[addToShopTheLookCart] Adding product ${productId} from hotspot ${hotspotId}`);

    // Get product details
    const products = await base44.asServiceRole.entities.KemetroProduct.filter({ id: productId });
    if (!products?.length) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
    const product = products[0];

    // Get hotspot
    const hotspots = await base44.asServiceRole.entities.ImageHotspot.filter({ id: hotspotId });
    if (!hotspots?.length) {
      return Response.json({ error: 'Hotspot not found' }, { status: 404 });
    }
    const hotspot = hotspots[0];

    if (userId) {
      // Logged-in user: add to main Kemetro cart
      // This would normally integrate with the Kemetro cart system
      console.log(`[addToShopTheLookCart] Adding to cart for user ${userId}`);
      // TODO: Integration with Kemetro cart backend
    } else {
      // Guest: create Shop the Look cart record
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await base44.asServiceRole.entities.ShopTheLookCart.create({
        sessionId,
        userId: null,
        hotspotId,
        propertyId: hotspot.propertyId,
        productId,
        productName: product.title || product.name,
        productImageUrl: product.featured_image || product.image,
        productPriceEGP: product.price_amount,
        quantity: 1,
        addedAt: new Date().toISOString(),
        isConverted: false,
        expiresAt: expiresAt.toISOString()
      });

      console.log(`[addToShopTheLookCart] Created guest cart item`);
    }

    // Update hotspot add-to-cart count
    await base44.asServiceRole.entities.ImageHotspot.update(hotspotId, {
      addToCartCount: (hotspot.addToCartCount || 0) + 1
    });

    // Update image add-to-cart count
    const images = await base44.asServiceRole.entities.AnalyzedPropertyImage.filter({ id: hotspot.imageId });
    if (images?.length) {
      const image = images[0];
      await base44.asServiceRole.entities.AnalyzedPropertyImage.update(image.id, {
        totalAddToCarts: (image.totalAddToCarts || 0) + 1
      });
    }

    // Record sponsorship cost if applicable
    if (hotspot.isSponsored && hotspot.sponsoredBySellerId) {
      const settings = await base44.asServiceRole.entities.ShopTheLookSettings.list();
      const config = settings?.[0];
      const baseCost = config?.sponsoredPinCostPerClickEGP || 2;
      const costEGP = baseCost * 2;

      await base44.asServiceRole.entities.HotspotSponsorshipLog.create({
        hotspotId,
        sellerId: hotspot.sponsoredBySellerId,
        eventType: 'add_to_cart',
        userId: userId || null,
        sessionId,
        costEGP,
        recordedAt: new Date().toISOString()
      });

      // Update hotspot sponsorship spent
      await base44.asServiceRole.entities.ImageHotspot.update(hotspotId, {
        sponsorshipTotalSpentEGP: (hotspot.sponsorshipTotalSpentEGP || 0) + costEGP
      });

      console.log(`[addToShopTheLookCart] Recorded sponsored add-to-cart cost ${costEGP} EGP`);
    }

    // Get cart count for response
    const cartItems = await base44.asServiceRole.entities.ShopTheLookCart.filter({
      sessionId,
      isConverted: false
    });
    const cartCount = cartItems?.length || 0;

    return Response.json({
      success: true,
      message: 'Item added to cart',
      cartCount
    }, { status: 200 });

  } catch (error) {
    console.error('[addToShopTheLookCart] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});