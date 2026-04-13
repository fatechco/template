import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const EGP_TO_USD_RATE = 48.5; // approximate — replace with live rate if needed

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

  const {
    fracPropertyId, valuationEGP, totalTokenSupply,
    tokenPriceEGP, tokensForSale, tokensRetainedBySeller
  } = await req.json();

  if (!fracPropertyId || !valuationEGP || !totalTokenSupply || !tokenPriceEGP || !tokensForSale) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (tokensForSale + (tokensRetainedBySeller || 0) > totalTokenSupply) {
    return Response.json({
      error: `tokensForSale (${tokensForSale}) + tokensRetainedBySeller (${tokensRetainedBySeller || 0}) cannot exceed totalTokenSupply (${totalTokenSupply})`
    }, { status: 400 });
  }

  // Get FracProperty
  const fracProps = await base44.asServiceRole.entities.FracProperty.filter({ id: fracPropertyId });
  if (!fracProps.length) return Response.json({ error: 'FracProperty not found' }, { status: 404 });
  const fracProperty = fracProps[0];

  // Get the underlying property for city/title
  const properties = await base44.asServiceRole.entities.Property.filter({ id: fracProperty.propertyId });
  const property = properties[0] || {};

  // Generate token symbol: KMF-{CITY_CODE}-{SEQ}
  const cityRaw = property.city_name || 'XX';
  const cityCode = cityRaw.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
  const allFrac = await base44.asServiceRole.entities.FracProperty.list('-created_date', 999);
  const sequence = String(allFrac.length).padStart(3, '0');
  const tokenSymbol = `KMF-${cityCode}-${sequence}`;
  const tokenName = `KemeFrac ${property.title || 'Property'} #${sequence}`;

  const propertyValuationUSD = Math.round((valuationEGP / EGP_TO_USD_RATE) * 100) / 100;

  await base44.asServiceRole.entities.FracProperty.update(fracPropertyId, {
    propertyValuationEGP: valuationEGP,
    propertyValuationUSD,
    totalTokenSupply,
    tokenPriceEGP,
    tokenPriceUSD: Math.round((tokenPriceEGP / EGP_TO_USD_RATE) * 100) / 100,
    tokensForSale,
    tokensRetainedBySeller: tokensRetainedBySeller || 0,
    tokensAvailable: tokensForSale,
    tokenSymbol,
    tokenName,
    valuationApprovedByAdminId: user.id,
    valuationDate: new Date().toISOString().split('T')[0],
    status: 'valuation_set',
  });

  // Notify seller
  const sellers = await base44.asServiceRole.entities.User.filter({ id: fracProperty.submittedByUserId });
  const seller = sellers[0];
  if (seller?.email) {
    await base44.integrations.Core.SendEmail({
      to: seller.email,
      subject: '📊 KemeFrac™ Valuation Set — Please Review',
      body: `Your fractional offering valuation has been set by Kemedar.\n\nProperty: ${property.title}\nValuation: ${valuationEGP.toLocaleString()} EGP\nToken Symbol: ${tokenSymbol}\nToken Price: ${tokenPriceEGP.toLocaleString()} EGP\nTotal Supply: ${totalTokenSupply} tokens\nTokens for Sale: ${tokensForSale}\n\nPlease log in to review and confirm.\nhttps://kemedar.com/dashboard`,
    }).catch(() => {});
  }

  return Response.json({ success: true, tokenSymbol, tokenName, propertyValuationUSD });
});