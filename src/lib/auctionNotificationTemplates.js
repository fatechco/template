export const AUCTION_NOTIFICATIONS = {
  // SELLER NOTIFICATIONS
  seller: {
    auctionSubmitted: {
      icon: '🔨',
      title: 'Auction submitted for review',
      body: (code) => `KBA-${code} is under admin review. Typically 24–48 hours.`,
      cta: { label: 'View Auction →', variant: 'primary' }
    },
    approvedDepositRequired: {
      icon: '✅',
      title: 'Auction approved! Pay deposit to activate.',
      body: (amount) => `Your auction is cleared. Pay ${amount.toLocaleString()} EGP seller deposit to schedule it live.`,
      cta: { label: 'Pay Deposit Now →', variant: 'urgent' }
    },
    depositConfirmed: {
      icon: '🗓️',
      title: 'Auction is scheduled and live!',
      body: (code, startDate) => `KBA-${code} opens for registration on ${startDate}. Bidding starts [date].`,
      cta: null
    },
    firstBidderRegistered: {
      icon: '👥',
      title: 'First bidder registered!',
      body: (propertyTitle) => `Someone paid their deposit to bid on ${propertyTitle}. Auction is heating up.`,
      cta: null
    },
    reservePriceMet: {
      icon: '🎉',
      title: 'Reserve price met! 🎉',
      body: () => `The current bid has reached your reserve price. Your property WILL sell.`,
      cta: null
    },
    bidMilestone: {
      icon: '🔨',
      title: (bidCount) => `Auction update — ${bidCount} bids placed`,
      body: (bidAmount, bidderCount) => `Current bid: ${bidAmount.toLocaleString()} EGP\n${bidderCount} bidders competing.`,
      cta: { label: 'Monitor Live →', variant: 'primary' }
    },
    auctionEnding1Hour: {
      icon: '⏰',
      title: '⏰ Your auction ends in 1 hour!',
      body: (bidAmount, bidderCount) => `Current bid: ${bidAmount.toLocaleString()} EGP\n${bidderCount} bidders. Stay alert!`,
      cta: null
    },
    auctionComplete: {
      icon: '🏆',
      title: '🎉 Auction Complete! Property Sold!',
      body: (winnerName, finalPrice) => `Winner: ${winnerName}\nFinal price: ${finalPrice.toLocaleString()} EGP\nThey have 48 hours to complete payment.`,
      cta: { label: 'View Auction Results →', variant: 'primary' }
    },
    winnerPaid: {
      icon: '✅',
      title: 'Payment confirmed — transfer begins!',
      body: () => `Kemework lawyer assigned. Escrow will release upon title transfer.`,
      cta: { label: 'Track Transfer →', variant: 'primary' }
    },
    reserveNotMet: {
      icon: '⚠️',
      title: 'Auction ended — reserve not met',
      body: (highestBid) => `Highest bid: ${highestBid.toLocaleString()} EGP\nAccept this offer or re-list?`,
      cta: { label: 'Decide Now →', variant: 'warning' }
    },
    winnerForfeited: {
      icon: '💸',
      title: (depositAmount) => `Winner forfeited — you receive ${depositAmount.toLocaleString()} EGP`,
      body: (deposit) => `The winner failed to pay. ${deposit.toLocaleString()} EGP of their deposit goes to you. Re-list or accept 2nd highest bid?`,
      cta: { label: 'View Options →', variant: 'primary' }
    },
    transferComplete: {
      icon: '💰',
      title: (amount) => `💰 ${amount.toLocaleString()} EGP released to your wallet!`,
      body: () => `Title transfer confirmed. Funds have been released from escrow.`,
      cta: { label: 'View Wallet →', variant: 'primary' }
    }
  },

  // BUYER / BIDDER NOTIFICATIONS
  buyer: {
    registrationConfirmed: {
      icon: '✅',
      title: 'You\'re registered to bid!',
      body: (depositAmount, startDate) => `${depositAmount.toLocaleString()} EGP deposit secured. Bidding opens ${startDate}. Get ready!`,
      cta: { label: 'View Auction →', variant: 'primary' }
    },
    registrationClosing24h: {
      icon: '⏰',
      title: '⏰ Auction registration closes tomorrow',
      body: (propertyTitle, depositAmount) => `Last chance to register for ${propertyTitle}. Deposit required: ${depositAmount.toLocaleString()} EGP`,
      cta: { label: 'Register Now →', variant: 'urgent' }
    },
    auctionLive: {
      icon: '🔴',
      title: '🔴 AUCTION IS LIVE — Start Bidding!',
      body: (propertyTitle, startingBid) => `${propertyTitle} auction has started. Starting bid: ${startingBid.toLocaleString()} EGP\nYou're registered — go place your bid!`,
      cta: { label: 'Bid Now →', variant: 'urgent' }
    },
    outbid: {
      icon: '⚡',
      title: '⚡ You\'ve been outbid!',
      body: (currentBid, neededAmount) => `Current highest bid: ${currentBid.toLocaleString()} EGP\nYou need ${neededAmount.toLocaleString()} EGP more to lead.`,
      cta: { label: 'Bid Again →', variant: 'urgent' }
    },
    autoBidLimitReached: {
      icon: '🤖',
      title: '🤖 Auto-bid limit reached',
      body: (autoBidMax) => `Another bidder exceeded your auto-bid maximum of ${autoBidMax.toLocaleString()} EGP. Update your limit to stay in the race.`,
      cta: { label: 'Update Auto-Bid →', variant: 'primary' }
    },
    auctionEnding30Min: {
      icon: '⏰',
      title: '⏰ Auction ends in 30 minutes!',
      body: (propertyTitle, currentBid) => `${propertyTitle} — Current bid: ${currentBid.toLocaleString()} EGP`,
      cta: { label: 'Check Auction Status →', variant: 'primary' }
    },
    timeExtended: {
      icon: '⚡',
      title: '⚡ Auction time extended!',
      body: (minutes, newEndTime) => `A last-minute bid extended the auction by ${minutes} minutes. New end: ${newEndTime}`,
      cta: { label: 'Keep Bidding →', variant: 'urgent' }
    },
    youWon: {
      icon: '🏆',
      title: '🏆 CONGRATULATIONS — You Won!',
      body: (propertyTitle, winningBid) => `You won ${propertyTitle} for ${winningBid.toLocaleString()} EGP!\nComplete payment within 48 hours or forfeit your deposit.`,
      cta: { label: 'Pay Now →', variant: 'gold-urgent' },
      priority: 'highest'
    },
    paymentDeadline6h: {
      icon: '⚠️',
      title: '⚠️ URGENT — 6 hours to complete payment',
      body: (paymentAmount, deposit) => `You must pay ${paymentAmount.toLocaleString()} EGP within 6 hours or forfeit your ${deposit.toLocaleString()} EGP deposit.`,
      cta: { label: 'Complete Payment NOW →', variant: 'urgent' }
    },
    paymentConfirmed: {
      icon: '✅',
      title: 'Payment confirmed — transfer in progress',
      body: () => `Your payment is secured in escrow. Legal transfer is underway.`,
      cta: { label: 'Track Transfer →', variant: 'primary' }
    },
    didNotWin: {
      icon: '💚',
      title: 'Auction ended — your deposit is refunded',
      body: (depositAmount) => `Better luck next time. ${depositAmount.toLocaleString()} EGP has been returned to your XeedWallet.`,
      cta: null
    },
    transferComplete: {
      icon: '🏠',
      title: '🏠 Property Transferred! Welcome home.',
      body: (propertyTitle) => `${propertyTitle} is officially yours. Keys are ready for handover.`,
      cta: { label: 'View My Property →', variant: 'primary' }
    }
  },

  // WATCHER NOTIFICATIONS
  watcher: {
    auctionLive: {
      icon: '🔴',
      title: '🔴 An auction you\'re watching just went LIVE!',
      body: (propertyTitle, city, startingBid) => `${propertyTitle}, ${city} — Starting: ${startingBid.toLocaleString()} EGP`,
      cta: { label: 'Watch Live →', variant: 'primary' }
    },
    priceThresholdReached: {
      icon: '💰',
      title: '💰 Price threshold reached!',
      body: (propertyTitle, currentBid) => `${propertyTitle} just hit your alert price!\nCurrent bid: ${currentBid.toLocaleString()} EGP`,
      cta: { label: 'Register to Bid →', variant: 'primary' }
    },
    ending1Hour: {
      icon: '⏰',
      title: '⏰ Auction ends in 1 hour',
      body: (propertyTitle, currentBid, bidderCount) => `${propertyTitle}\nCurrent bid: ${currentBid.toLocaleString()} EGP — ${bidderCount} bidders`,
      cta: null
    }
  },

  // ADMIN NOTIFICATIONS
  admin: {
    newAuctionPending: {
      icon: '🔨',
      title: '🔨 New auction submitted — review needed',
      body: (propertyTitle, sellerName, startingBid, code) => `Seller: ${sellerName} | ${propertyTitle}\nStarting: ${startingBid.toLocaleString()} EGP | KBA-${code}`,
      cta: { label: 'Review →', variant: 'primary' }
    },
    highValueAuctionLive: {
      icon: '🔴',
      title: '🔴 High-value auction live',
      body: (amount, propertyTitle, bidderCount) => `${amount.toLocaleString()} EGP | ${propertyTitle}\n${bidderCount} bidders registered`,
      cta: null
    },
    paymentDeadlineApproaching: {
      icon: '⚠️',
      title: (hours, code) => `⚠️ Payment deadline in ${hours} hours — ${code}`,
      body: (amount) => `Winner has not yet paid ${amount.toLocaleString()} EGP`,
      cta: { label: 'Contact Winner →', variant: 'warning' }
    },
    depositForfeiture: {
      icon: '💸',
      title: (code) => `💸 Deposit forfeited — ${code}`,
      body: () => `Winner failed to pay. Action required.`,
      cta: { label: 'Review Options →', variant: 'warning' }
    }
  }
};