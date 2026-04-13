import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { auctionId, bidderUserId, bidAmountEGP: rawBidAmount, isAutoBid, autoMaxAmountEGP } = await req.json();
  let bidAmountEGP = Number(rawBidAmount);

  const auctions = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });

  const liveStatuses = ['live', 'extended'];
  if (!liveStatuses.includes(auction.status)) {
    return Response.json({ error: `Auction is not currently live (status: ${auction.status})` }, { status: 400 });
  }

  const now = new Date();
  const effectiveEnd = new Date(auction.finalEndAt || auction.auctionEndAt);
  if (now > effectiveEnd) return Response.json({ error: 'This auction has ended.' }, { status: 400 });

  // Verify registration
  const registrations = await base44.asServiceRole.entities.AuctionRegistration.filter({ auctionId, bidderUserId });
  const registration = registrations[0];
  if (!registration || registration.registrationStatus !== 'active') {
    return Response.json({ error: 'You must register and pay the deposit before bidding.' }, { status: 400 });
  }

  // Validate bid amount
  if (bidAmountEGP < auction.startingPriceEGP) {
    return Response.json({ error: `Bid must be at least ${auction.startingPriceEGP.toLocaleString()} EGP (the starting price).` }, { status: 400 });
  }
  if (bidAmountEGP <= (auction.currentHighestBidEGP || 0)) {
    return Response.json({ error: `Your bid must exceed the current highest bid of ${(auction.currentHighestBidEGP || 0).toLocaleString()} EGP.` }, { status: 400 });
  }
  if ((auction.currentHighestBidEGP || 0) > 0 &&
      bidAmountEGP < (auction.currentHighestBidEGP + auction.minimumBidIncrementEGP)) {
    const minNext = auction.currentHighestBidEGP + auction.minimumBidIncrementEGP;
    return Response.json({ error: `Minimum bid increment is ${auction.minimumBidIncrementEGP.toLocaleString()} EGP. Minimum next bid: ${minNext.toLocaleString()} EGP.` }, { status: 400 });
  }
  if (auction.currentHighestBidderUserId === bidderUserId) {
    return Response.json({ error: 'You are already the highest bidder.' }, { status: 400 });
  }

  // Buy Now check
  let bidType = isAutoBid ? 'auto_max' : 'manual';
  let isBuyNow = false;
  if (auction.buyNowPriceEGP && bidAmountEGP >= auction.buyNowPriceEGP) {
    bidAmountEGP = auction.buyNowPriceEGP;
    bidType = 'buy_now';
    isBuyNow = true;
  }

  // Extension check
  const msRemaining = effectiveEnd.getTime() - now.getTime();
  const minutesRemaining = msRemaining / 60000;
  let wasExtended = false;
  let newFinalEndAt = auction.finalEndAt || auction.auctionEndAt;

  if (minutesRemaining <= auction.extensionMinutes &&
      (auction.extensionsUsed || 0) < (auction.maxExtensions || 3)) {
    const extMs = auction.extensionMinutes * 60 * 1000;
    newFinalEndAt = new Date(effectiveEnd.getTime() + extMs).toISOString();
    wasExtended = true;

    await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
      finalEndAt: newFinalEndAt,
      extensionsUsed: (auction.extensionsUsed || 0) + 1,
      status: 'extended',
    });

    await base44.asServiceRole.entities.AuctionEvent.create({
      auctionId,
      eventType: 'time_extended',
      actorUserId: bidderUserId,
      actorType: 'bidder',
      description: `Auction ${auction.auctionCode} extended by ${auction.extensionMinutes} minutes due to late bid. New end: ${newFinalEndAt}`,
      metaData: { extensionMinutes: auction.extensionMinutes, newFinalEndAt, extensionsUsed: (auction.extensionsUsed || 0) + 1 },
      recordedAt: now.toISOString(),
    });

    // Notify all registered bidders and watchers of extension (fire and forget)
    base44.asServiceRole.entities.AuctionRegistration.filter({ auctionId }).then(regs => {
      regs.forEach(r => {
        base44.asServiceRole.entities.User.filter({ id: r.bidderUserId }).then(users => {
          const u = users[0];
          if (u?.email) {
            base44.asServiceRole.integrations.Core.SendEmail({
              to: u.email,
              subject: `⏰ Auction Extended — ${auction.auctionCode}`,
              body: `A bid was placed in the final minutes! The auction has been extended.\n\nNew End Time: ${new Date(newFinalEndAt).toLocaleString()}\n\nDon't miss your chance — place your bid now!`,
            }).catch(() => {});
          }
        }).catch(() => {});
      });
    }).catch(() => {});
  }

  // Save bid
  const previousHighestBidderUserId = auction.currentHighestBidderUserId;
  const sequenceNumber = (auction.totalBids || 0) + 1;
  const nowIso = now.toISOString();

  const bid = await base44.asServiceRole.entities.AuctionBid.create({
    auctionId,
    bidderUserId,
    bidAmountEGP,
    bidType,
    isWinning: true,
    isAutoBid: !!isAutoBid,
    autoMaxAmountEGP: autoMaxAmountEGP || null,
    bidSequenceNumber: sequenceNumber,
    wasExtended,
    extensionMinutesAdded: wasExtended ? auction.extensionMinutes : null,
    bidPlacedAt: nowIso,
  });

  // Mark previous winning bid as not winning
  if (previousHighestBidderUserId) {
    const prevBids = await base44.asServiceRole.entities.AuctionBid.filter({ auctionId, isWinning: true });
    for (const pb of prevBids) {
      if (pb.id !== bid.id) {
        await base44.asServiceRole.entities.AuctionBid.update(pb.id, { isWinning: false });
      }
    }
  }

  // Determine if new unique bidder
  const isNewBidder = !previousHighestBidderUserId ||
    !(await base44.asServiceRole.entities.AuctionBid.filter({ auctionId, bidderUserId })).find(b => b.id !== bid.id);

  // Update auction state
  const auctionUpdates = {
    currentHighestBidEGP: bidAmountEGP,
    currentHighestBidderUserId: bidderUserId,
    totalBids: sequenceNumber,
  };
  if (isNewBidder) auctionUpdates.totalUniqueBidders = (auction.totalUniqueBidders || 0) + 1;

  // Reserve met check
  let reserveJustMet = false;
  if (auction.reservePriceEGP && bidAmountEGP >= auction.reservePriceEGP && !auction.reserveMet) {
    auctionUpdates.reserveMet = true;
    reserveJustMet = true;
  }

  await base44.asServiceRole.entities.PropertyAuction.update(auctionId, auctionUpdates);

  // Update registration stats
  await base44.asServiceRole.entities.AuctionRegistration.update(registration.id, {
    totalBidsPlaced: (registration.totalBidsPlaced || 0) + 1,
    highestBidPlaced: Math.max(registration.highestBidPlaced || 0, bidAmountEGP),
    lastBidAt: nowIso,
  });

  // Reserve met event & seller notification
  if (reserveJustMet) {
    await base44.asServiceRole.entities.AuctionEvent.create({
      auctionId,
      eventType: 'reserve_met',
      actorUserId: bidderUserId,
      actorType: 'bidder',
      description: `Reserve price met on auction ${auction.auctionCode}. Bid: ${bidAmountEGP.toLocaleString()} EGP.`,
      metaData: { bidAmountEGP, reservePriceEGP: auction.reservePriceEGP },
      recordedAt: nowIso,
    });
    base44.asServiceRole.entities.User.filter({ id: auction.sellerUserId }).then(users => {
      const s = users[0];
      if (s?.email) {
        base44.asServiceRole.integrations.Core.SendEmail({
          to: s.email,
          subject: `🎉 Reserve Price Met — ${auction.auctionCode}`,
          body: `Great news! The reserve price has been met for your auction.\n\nCurrent Highest Bid: ${bidAmountEGP.toLocaleString()} EGP\n\nThe auction is live and running!`,
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  // Outbid notification
  if (previousHighestBidderUserId && previousHighestBidderUserId !== bidderUserId) {
    const prevRegs = await base44.asServiceRole.entities.AuctionRegistration.filter({ auctionId, bidderUserId: previousHighestBidderUserId });
    const prevReg = prevRegs[0];
    base44.asServiceRole.entities.User.filter({ id: previousHighestBidderUserId }).then(users => {
      const u = users[0];
      if (u?.email) {
        const autoBidLine = prevReg?.autoBidMaxEGP ? `\nYour auto-bid max: ${prevReg.autoBidMaxEGP.toLocaleString()} EGP` : '';
        base44.asServiceRole.integrations.Core.SendEmail({
          to: u.email,
          subject: `⚡ You've Been Outbid — ${auction.auctionCode}`,
          body: `You've been outbid!\n\nAuction: ${auction.auctionTitle}\nCurrent Bid: ${bidAmountEGP.toLocaleString()} EGP${autoBidLine}\n\nPlace a new bid now to stay in the race!`,
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  // Log bid placed event
  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId,
    eventType: 'bid_placed',
    actorUserId: bidderUserId,
    actorType: 'bidder',
    description: `Bid #${sequenceNumber} placed: ${bidAmountEGP.toLocaleString()} EGP on auction ${auction.auctionCode}.`,
    metaData: {
      bidAmount: bidAmountEGP,
      bidderCount: (auction.totalUniqueBidders || 0) + (isNewBidder ? 1 : 0),
      timeRemaining: Math.max(0, new Date(newFinalEndAt).getTime() - now.getTime()),
      wasExtended,
    },
    recordedAt: nowIso,
  });

  // Autobid chain: find competing autobidder
  const autobidRegs = await base44.asServiceRole.entities.AuctionRegistration.filter({ auctionId, hasAutoBid: true });
  const competitor = autobidRegs
    .filter(r => r.bidderUserId !== bidderUserId && (r.autoBidMaxEGP || 0) > bidAmountEGP)
    .sort((a, b) => (b.autoBidMaxEGP || 0) - (a.autoBidMaxEGP || 0))[0];

  if (competitor) {
    const nextBid = bidAmountEGP + auction.minimumBidIncrementEGP;
    if (nextBid <= competitor.autoBidMaxEGP) {
      // Trigger autobid (fire and forget, next cycle)
      base44.asServiceRole.functions.invoke('placeBid', {
        auctionId,
        bidderUserId: competitor.bidderUserId,
        bidAmountEGP: nextBid,
        isAutoBid: true,
        autoMaxAmountEGP: competitor.autoBidMaxEGP,
      }).catch(() => {});
    }
  }

  // Notify watchers
  base44.asServiceRole.entities.AuctionWatchlist.filter({ auctionId, notifyOnNewBid: true }).then(watchers => {
    watchers.forEach(w => {
      base44.asServiceRole.entities.User.filter({ id: w.userId }).then(users => {
        const u = users[0];
        if (u?.email) {
          base44.asServiceRole.integrations.Core.SendEmail({
            to: u.email,
            subject: `🔨 New Bid — ${auction.auctionCode}`,
            body: `A new bid has been placed!\n\nAuction: ${auction.auctionTitle}\nCurrent Highest Bid: ${bidAmountEGP.toLocaleString()} EGP\nTotal Bids: ${sequenceNumber}`,
          }).catch(() => {});
        }
      }).catch(() => {});
    });
  }).catch(() => {});

  // If buy now, trigger end auction
  if (isBuyNow) {
    base44.asServiceRole.functions.invoke('endAuction', { auctionId }).catch(() => {});
  }

  const updatedAuction = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  return Response.json({ success: true, bid, auction: updatedAuction[0] });
});