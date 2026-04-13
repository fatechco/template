import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    propertyId, offeringType, offeringDescription, offeringDescriptionAr,
    expectedAnnualYieldPercent, yieldFrequency, tokensForSale,
    minTokensPerBuyer, maxTokensPerBuyer, offeringStartDate, offeringEndDate
  } = await req.json();

  if (!propertyId || !offeringType || !tokensForSale) {
    return Response.json({ error: 'propertyId, offeringType, and tokensForSale are required' }, { status: 400 });
  }

  // Fetch property and verify ownership
  const properties = await base44.entities.Property.filter({ id: propertyId });
  if (!properties.length) return Response.json({ error: 'Property not found' }, { status: 404 });
  const property = properties[0];

  if (property.user_id !== user.id) {
    return Response.json({ error: 'You do not own this property' }, { status: 403 });
  }

  // Get FracSettings for requireVerifyProLevel
  const settings = await base44.asServiceRole.entities.FracSettings.list();
  const config = settings[0] || {};
  const requireLevel = config.requireVerifyProLevel ?? 3;
  const currentLevel = property.verification_level ?? 1;

  if (currentLevel < requireLevel) {
    return Response.json({
      error: `Property must be at least Level ${requireLevel} Verified to offer fractional investment. Current level: ${currentLevel}`
    }, { status: 400 });
  }

  // Check for existing active offering
  const existing = await base44.asServiceRole.entities.FracProperty.filter({ propertyId });
  const activeOffering = existing.find(f => !['rejected', 'closed'].includes(f.status));
  if (activeOffering) {
    return Response.json({ error: 'A fractional offering already exists for this property' }, { status: 409 });
  }

  // Generate slug
  const city = (property.city_name || 'city').toLowerCase().replace(/\s+/g, '-');
  const type = (property.category_name || 'property').toLowerCase().replace(/\s+/g, '-');
  const year = new Date().getFullYear();
  const hex = Math.random().toString(16).slice(2, 6);
  const offeringSlug = `${city}-${type}-${year}-${hex}`;

  // Create FracProperty
  const fracProperty = await base44.asServiceRole.entities.FracProperty.create({
    propertyId,
    submittedByUserId: user.id,
    offeringType,
    offeringDescription: offeringDescription || '',
    offeringDescriptionAr: offeringDescriptionAr || '',
    offeringTitle: property.title || 'Fractional Offering',
    offeringSlug,
    tokensForSale,
    tokensSold: 0,
    tokensAvailable: tokensForSale,
    minTokensPerBuyer: minTokensPerBuyer || 1,
    maxTokensPerBuyer: maxTokensPerBuyer || null,
    expectedAnnualYieldPercent: expectedAnnualYieldPercent || null,
    yieldFrequency: yieldFrequency || null,
    offeringStartDate: offeringStartDate || null,
    offeringEndDate: offeringEndDate || null,
    nearTokenContractDeployed: false,
    nearNetworkType: config.nearNetworkDefault || 'testnet',
    status: 'draft',
    isVerified: currentLevel >= 3,
    isFeatured: false,
    viewCount: 0,
  });

  // Update Property to link the offering
  await base44.asServiceRole.entities.Property.update(propertyId, {
    isFracOffering: true,
    fracPropertyId: fracProperty.id,
  });

  // Notify admins
  const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
  for (const admin of admins.slice(0, 5)) {
    if (admin.email) {
      await base44.integrations.Core.SendEmail({
        to: admin.email,
        subject: '🏗️ New KemeFrac™ Submission for Review',
        body: `A new fractional offering has been submitted.\n\nProperty: ${property.title}\nSeller: ${user.full_name}\nType: ${offeringType}\nTokens for Sale: ${tokensForSale}\n\nReview at: https://kemedar.com/admin/kemedar/frac/offerings`,
      }).catch(() => {});
    }
  }

  return Response.json({ success: true, fracProperty });
});