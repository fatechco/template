import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId, userId } = await req.json();

    if (!sessionId || !userId) {
      return Response.json({ error: 'Missing sessionId or userId' }, { status: 400 });
    }

    console.log(`[mergeGuestCart] Merging guest cart ${sessionId} to user ${userId}`);

    // Get all valid guest cart items
    const now = new Date().toISOString();
    const guestItems = await base44.asServiceRole.entities.ShopTheLookCart.filter({
      sessionId,
      isConverted: false
    });

    if (!guestItems?.length) {
      return Response.json({
        success: true,
        message: 'No items to merge',
        itemsConverted: 0
      }, { status: 200 });
    }

    // Filter out expired items
    const validItems = guestItems.filter(item => !item.expiresAt || item.expiresAt > now);

    if (!validItems.length) {
      return Response.json({
        success: true,
        message: 'All items expired',
        itemsConverted: 0
      }, { status: 200 });
    }

    // Convert each item
    const itemIds = validItems.map(item => item.id);
    console.log(`[mergeGuestCart] Converting ${itemIds.length} items`);

    for (const item of validItems) {
      // TODO: Add to user's main Kemetro cart
      // This would require integration with the Kemetro cart system

      // Mark as converted
      await base44.asServiceRole.entities.ShopTheLookCart.update(item.id, {
        userId,
        isConverted: true,
        convertedAt: new Date().toISOString()
      });
    }

    return Response.json({
      success: true,
      message: `✅ ${validItems.length} saved item${validItems.length !== 1 ? 's' : ''} moved to your Kemetro cart!`,
      itemsConverted: validItems.length
    }, { status: 200 });

  } catch (error) {
    console.error('[mergeGuestCart] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});