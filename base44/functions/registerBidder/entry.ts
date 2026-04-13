import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { auctionId, bidderUserId, proofOfFundsUrl } = await req.json();

  const [auctions, settingsArr] = await Promise.all([
    base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId }),
    base44.asServiceRole.entities.AuctionSettings.list(),
  ]);

  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });

  const validStatuses = ['registration', 'live'];
  if (!validStatuses.includes(auction.status)) {
    return Response.json({ error: `Registration is not open (auction status: ${auction.status})` }, { status: 400 });
  }

  const now = new Date();
  if (new Date(auction.registrationCloseAt) < now) {
    return Response.json({ error: 'Registration is closed for this auction.' }, { status: 400 });
  }

  const settings = settingsArr[0] || {};

  // KYC check
  if (auction.requireBuyerKYC) {
    const kycRecords = await base44.asServiceRole.entities.FracKYC.filter({ userId: bidderUserId });
    const kyc = kycRecords[0];
    if (!kyc || kyc.kycStatus !== 'approved') {
      return Response.json({ error: 'KYC verification required before registering to bid. Please complete your identity verification.' }, { status: 400 });
    }
  }

  // Check duplicate registration
  const existing = await base44.asServiceRole.entities.AuctionRegistration.filter({ auctionId, bidderUserId });
  if (existing.length > 0) return Response.json({ error: 'You are already registered for this auction.' }, { status: 400 });

  // Proof of funds check
  if (auction.requireBuyerProofOfFunds && !proofOfFundsUrl) {
    return Response.json({ error: 'Proof of funds required. Please upload a bank statement or pre-approval letter.' }, { status: 400 });
  }

  const nowIso = now.toISOString();

  // Create registration
  const registration = await base44.asServiceRole.entities.AuctionRegistration.create({
    auctionId,
    bidderUserId,
    kycVerified: auction.requireBuyerKYC,
    proofOfFundsUploaded: !!proofOfFundsUrl,
    proofOfFundsUrl: proofOfFundsUrl || null,
    proofOfFundsApprovedByAdmin: !auction.requireBuyerProofOfFunds,
    depositAmountEGP: auction.buyerDepositEGP,
    depositPaid: true,
    depositPaidAt: nowIso,
    depositTransactionId: `BDEP-${Date.now()}`,
    depositStatus: 'held',
    registrationStatus: 'active',
    hasAutoBid: false,
    totalBidsPlaced: 0,
    highestBidPlaced: 0,
    registeredAt: nowIso,
  });

  // Update auction bidder count
  await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
    totalRegisteredBidders: (auction.totalRegisteredBidders || 0) + 1,
  });

  // Log event
  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId,
    eventType: 'bidder_registered',
    actorUserId: bidderUserId,
    actorType: 'bidder',
    description: `New bidder registered for auction ${auction.auctionCode}. Deposit of ${auction.buyerDepositEGP.toLocaleString()} EGP held.`,
    metaData: { depositAmountEGP: auction.buyerDepositEGP, totalRegisteredBidders: (auction.totalRegisteredBidders || 0) + 1 },
    recordedAt: nowIso,
  });

  // Notify bidder
  const bidders = await base44.asServiceRole.entities.User.filter({ id: bidderUserId });
  const bidder = bidders[0];
  if (bidder?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: bidder.email,
      subject: `✅ You're Registered to Bid — ${auction.auctionCode}`,
      body: `You are now registered for the auction!\n\nAuction: ${auction.auctionTitle}\nAuction Code: ${auction.auctionCode}\nDeposit Held: ${auction.buyerDepositEGP.toLocaleString()} EGP (fully refunded if you don't win)\nAuction Starts: ${new Date(auction.auctionStartAt).toLocaleString()}\n\nGood luck! Bid Smart. Win Real.`,
    }).catch(() => {});
  }

  // Notify seller
  const sellers = await base44.asServiceRole.entities.User.filter({ id: auction.sellerUserId });
  const seller = sellers[0];
  if (seller?.email) {
    const newCount = (auction.totalRegisteredBidders || 0) + 1;
    base44.asServiceRole.integrations.Core.SendEmail({
      to: seller.email,
      subject: `🔔 New Bidder Registered — ${auction.auctionCode}`,
      body: `A new bidder has registered for your auction.\n\nAuction: ${auction.auctionTitle}\nTotal Registered Bidders: ${newCount}`,
    }).catch(() => {});
  }

  return Response.json({ success: true, registration });
});