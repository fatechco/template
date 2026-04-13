import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const {
    propertyId, sellerUserId, auctionType,
    startingPriceEGP, reservePriceEGP, buyNowPriceEGP,
    minimumBidIncrementEGP, registrationOpenAt, registrationCloseAt,
    auctionStartAt, auctionEndAt, extensionMinutes,
    requireBuyerProofOfFunds, auctionDescription, auctionDescriptionAr,
  } = await req.json();

  // Fetch property and settings in parallel
  const [properties, settingsArr] = await Promise.all([
    base44.asServiceRole.entities.Property.filter({ id: propertyId }),
    base44.asServiceRole.entities.AuctionSettings.list(),
  ]);

  const property = properties[0];
  if (!property) return Response.json({ error: 'Property not found' }, { status: 404 });
  if (property.user_id !== sellerUserId) return Response.json({ error: 'You do not own this property' }, { status: 403 });

  const settings = settingsArr[0] || {};
  const requireLevel = settings.requireVerifyProLevel ?? 2;

  if ((property.verification_level ?? 1) < requireLevel) {
    return Response.json({ error: `Property must be Verify Pro Level ${requireLevel}+ to list for auction.` }, { status: 400 });
  }

  // Check for existing active auction
  if (property.isAuction && property.auctionId) {
    const existing = await base44.asServiceRole.entities.PropertyAuction.filter({ id: property.auctionId });
    const ex = existing[0];
    if (ex && !['cancelled', 'failed', 'completed'].includes(ex.status)) {
      return Response.json({ error: 'This property already has an active auction.' }, { status: 400 });
    }
  }

  // Validate timing
  const now = Date.now();
  const startMs = new Date(auctionStartAt).getTime();
  const endMs = new Date(auctionEndAt).getTime();
  const minStart = now + 24 * 60 * 60 * 1000;

  if (startMs < minStart) return Response.json({ error: 'Auction must start at least 24 hours from now.' }, { status: 400 });
  if (endMs <= startMs) return Response.json({ error: 'End time must be after start time.' }, { status: 400 });

  const durationDays = (endMs - startMs) / (1000 * 60 * 60 * 24);
  const maxDays = settings.maxAuctionDurationDays ?? 30;
  const minDays = settings.minAuctionDurationDays ?? 1;
  if (durationDays > maxDays) return Response.json({ error: `Max auction duration is ${maxDays} days.` }, { status: 400 });
  if (durationDays < minDays) return Response.json({ error: `Min auction duration is ${minDays} day(s).` }, { status: 400 });

  // Generate auction code
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const auctionCode = `KBA-${hex}`;

  // Calculate deposits
  const sellerPct = (settings.sellerDepositPercent ?? 0.5) / 100;
  const sellerMin = settings.sellerDepositMinEGP ?? 2000;
  const sellerDepositEGP = Math.max(startingPriceEGP * sellerPct, sellerMin);

  const buyerPct = (settings.buyerDepositPercent ?? 1) / 100;
  const buyerMin = settings.buyerDepositMinEGP ?? 5000;
  const buyerDepositEGP = Math.max(startingPriceEGP * buyerPct, buyerMin);

  const buyerDepositDescription =
    'Fully refunded if you do not win. Forfeited if you win and fail to complete payment within 48 hours.';

  // Create auction
  const auction = await base44.asServiceRole.entities.PropertyAuction.create({
    propertyId, sellerUserId, auctionCode,
    auctionTitle: property.title,
    auctionTitleAr: property.title_ar || '',
    auctionType,
    startingPriceEGP, reservePriceEGP: reservePriceEGP || null,
    buyNowPriceEGP: buyNowPriceEGP || null,
    minimumBidIncrementEGP: minimumBidIncrementEGP || (settings.defaultMinBidIncrementEGP ?? 5000),
    sellerDepositEGP, sellerDepositPaid: false,
    buyerDepositEGP, buyerDepositDescription,
    registrationOpenAt, registrationCloseAt,
    auctionStartAt, auctionEndAt,
    extensionMinutes: extensionMinutes || (settings.defaultExtensionMinutes ?? 5),
    maxExtensions: settings.defaultMaxExtensions ?? 3,
    extensionsUsed: 0,
    requireVerifyProLevel: requireLevel,
    requireBuyerKYC: settings.requireBuyerKYC ?? true,
    requireBuyerProofOfFunds: requireBuyerProofOfFunds || false,
    auctionDescription: auctionDescription || '',
    auctionDescriptionAr: auctionDescriptionAr || '',
    status: 'pending_review',
    currentHighestBidEGP: 0,
    totalBids: 0, totalUniqueBidders: 0,
    totalRegisteredBidders: 0, totalPageViews: 0,
    totalWatchlisted: 0, peakConcurrentViewers: 0,
    reserveMet: false,
  });

  // Update property
  await base44.asServiceRole.entities.Property.update(propertyId, {
    isAuction: true,
    auctionId: auction.id,
  });

  // Log event
  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId: auction.id,
    eventType: 'auction_created',
    actorUserId: sellerUserId,
    actorType: 'seller',
    description: `Auction ${auctionCode} created for property "${property.title}". Pending admin review.`,
    metaData: { startingPriceEGP, auctionType, sellerDepositEGP, buyerDepositEGP },
    recordedAt: new Date().toISOString(),
  });

  // Notify admins (fire and forget)
  base44.asServiceRole.integrations.Core.SendEmail({
    to: 'admin@kemedar.com',
    subject: `[KemedarBid™] New Auction Pending Review — ${auctionCode}`,
    body: `A new auction has been submitted for review.\n\nAuction Code: ${auctionCode}\nProperty: ${property.title}\nStarting Price: ${startingPriceEGP.toLocaleString()} EGP\nType: ${auctionType}\n\nPlease review in the admin panel.`,
  }).catch(() => {});

  return Response.json({ success: true, auction });
});