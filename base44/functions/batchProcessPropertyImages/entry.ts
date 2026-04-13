import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { propertyId } = await req.json();

    if (!propertyId) {
      return Response.json({ error: 'Missing propertyId' }, { status: 400 });
    }

    console.log(`[batchProcessPropertyImages] Processing property ${propertyId}`);

    const properties = await base44.asServiceRole.entities.Property.filter({ id: propertyId });
    if (!properties?.length) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }

    const property = properties[0];
    const images = [];

    // Add featured image first if it exists
    if (property.featured_image) {
      images.push(property.featured_image);
    }

    // Add up to 4 more from image gallery
    if (property.image_gallery && Array.isArray(property.image_gallery)) {
      images.push(...property.image_gallery.slice(0, 4));
    }

    // Limit to max 5 images
    const imagesToProcess = images.slice(0, 5);
    console.log(`[batchProcessPropertyImages] Processing ${imagesToProcess.length} images`);

    // Queue background jobs with 2-second delays
    let jobCount = 0;
    for (const imageUrl of imagesToProcess) {
      // Queue the job in the background (don't wait for it)
      setTimeout(async () => {
        try {
          const response = await fetch(`${Deno.env.get('FUNCTION_URL') || 'http://localhost:3001'}/functions/processImageForHotspots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId, imageUrl })
          });
          if (!response.ok) {
            console.warn(`[batchProcessPropertyImages] Job failed for image ${imageUrl.slice(0, 50)}`);
          } else {
            console.log(`[batchProcessPropertyImages] Job completed for image ${imageUrl.slice(0, 50)}`);
          }
        } catch (e) {
          console.error(`[batchProcessPropertyImages] Job error: ${e.message}`);
        }
      }, jobCount * 2000);
      jobCount++;
    }

    return Response.json({
      success: true,
      queued: imagesToProcess.length,
      message: 'Image processing jobs queued'
    }, { status: 202 });

  } catch (error) {
    console.error('[batchProcessPropertyImages] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});