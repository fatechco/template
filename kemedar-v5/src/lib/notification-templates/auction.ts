export const auctionNotificationTemplates = {
  auction_created: (params: { auctionCode: string; propertyTitle: string }) => ({
    title: "Auction Created",
    body: `Your auction ${params.auctionCode} for "${params.propertyTitle}" has been created and is pending approval.`,
    cta: { label: "View Auction", url: `/auctions/${params.auctionCode}` },
  }),
  auction_approved: (params: { auctionCode: string }) => ({
    title: "Auction Approved",
    body: `Your auction ${params.auctionCode} has been approved! Please pay the seller deposit to go live.`,
    cta: { label: "Pay Deposit", url: `/auctions/${params.auctionCode}` },
  }),
  bid_placed: (params: { auctionCode: string; bidAmount: number }) => ({
    title: "New Bid Placed",
    body: `A bid of ${params.bidAmount.toLocaleString()} EGP was placed on auction ${params.auctionCode}.`,
    cta: { label: "View Bids", url: `/auctions/${params.auctionCode}` },
  }),
  outbid: (params: { auctionCode: string; newHighestBid: number }) => ({
    title: "You've Been Outbid!",
    body: `Someone placed a higher bid of ${params.newHighestBid.toLocaleString()} EGP on auction ${params.auctionCode}.`,
    cta: { label: "Place Higher Bid", url: `/auctions/${params.auctionCode}` },
  }),
  auction_won: (params: { auctionCode: string; winningBid: number }) => ({
    title: "Congratulations! You Won!",
    body: `You won auction ${params.auctionCode} with a bid of ${params.winningBid.toLocaleString()} EGP. Complete payment within 48 hours.`,
    cta: { label: "Complete Payment", url: `/auctions/${params.auctionCode}` },
  }),
  auction_ended: (params: { auctionCode: string; status: string }) => ({
    title: "Auction Ended",
    body: `Auction ${params.auctionCode} has ended. Status: ${params.status}.`,
    cta: { label: "View Results", url: `/auctions/${params.auctionCode}` },
  }),
};
