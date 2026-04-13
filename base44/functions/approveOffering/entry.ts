import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });

  const { fracPropertyId } = await req.json();
  if (!fracPropertyId) return Response.json({ error: 'fracPropertyId is required' }, { status: 400 });

  const fracProps = await base44.asServiceRole.entities.FracProperty.filter({ id: fracPropertyId });
  if (!fracProps.length) return Response.json({ error: 'FracProperty not found' }, { status: 404 });
  const fracProperty = fracProps[0];

  if (fracProperty.status !== 'valuation_set') {
    return Response.json({
      error: `Cannot approve — current status is "${fracProperty.status}". Must be "valuation_set".`
    }, { status: 400 });
  }

  // Validate all required fields are present
  const required = ['tokenSymbol', 'tokenName', 'totalTokenSupply', 'tokenPriceEGP', 'tokensForSale', 'propertyValuationEGP'];
  const missing = required.filter(f => !fracProperty[f]);
  if (missing.length) {
    return Response.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
  }

  await base44.asServiceRole.entities.FracProperty.update(fracPropertyId, {
    status: 'approved',
    approvedByAdminId: user.id,
  });

  // Get underlying property
  const properties = await base44.asServiceRole.entities.Property.filter({ id: fracProperty.propertyId });
  const property = properties[0] || {};

  // Notify seller
  const sellers = await base44.asServiceRole.entities.User.filter({ id: fracProperty.submittedByUserId });
  const seller = sellers[0];
  if (seller?.email) {
    await base44.integrations.Core.SendEmail({
      to: seller.email,
      subject: '🎉 KemeFrac™ Offering Approved!',
      body: `Congratulations! Your fractional offering has been approved by Kemedar.\n\nProperty: ${property.title}\nToken: ${fracProperty.tokenSymbol}\n\nKemedar admin will now tokenize your property on the NEAR blockchain. You will be notified once it goes live.\n\nhttps://kemedar.com/dashboard`,
    }).catch(() => {});
  }

  // Notify admin team
  const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
  for (const admin of admins.slice(0, 5)) {
    if (admin.email && admin.id !== user.id) {
      await base44.integrations.Core.SendEmail({
        to: admin.email,
        subject: `🔗 Ready to Tokenize: ${fracProperty.tokenSymbol}`,
        body: `A KemeFrac™ offering is approved and ready for NEAR tokenization.\n\nProperty: ${property.title}\nToken Symbol: ${fracProperty.tokenSymbol}\nToken Name: ${fracProperty.tokenName}\nTotal Supply: ${fracProperty.totalTokenSupply}\n\nDeploy from admin dashboard:\nhttps://kemedar.com/admin/kemedar/frac/offerings`,
      }).catch(() => {});
    }
  }

  return Response.json({ success: true, status: 'approved' });
});