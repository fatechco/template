import { base44 } from "@/api/base44Client";

// ─── Helper ─────────────────────────────────────────────────────────────────
async function sendNotification({ toUserId, title, body, ctaLabel, ctaUrl, type = "kemefrac" }) {
  await base44.integrations.Core.SendEmail({
    to: toUserId, // resolved upstream to email
    subject: title,
    body: `${body}${ctaUrl ? `\n\n${ctaLabel}: ${ctaUrl}` : ""}`,
  }).catch(() => {});
}

// ─── SELLER NOTIFICATIONS ────────────────────────────────────────────────────

export async function notifyOfferingSubmitted({ sellerEmail, propertyTitle }) {
  return sendNotification({
    toUserId: sellerEmail,
    title: "🔷 KemeFrac™ Offering Received",
    body: `Your property "${propertyTitle}" has been submitted for fractional investment review.\n\nExpected review: 2–3 business days.`,
    ctaLabel: "View Dashboard",
    ctaUrl: "/cp/user",
  });
}

export async function notifyValuationSet({ sellerEmail, propertyTitle, valuationEGP, tokenPriceEGP, tokenSupply }) {
  const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n));
  return sendNotification({
    toUserId: sellerEmail,
    title: "💰 Valuation Set for Your KemeFrac™ Offering",
    body: `Property: "${propertyTitle}"\n\nProperty valuation: ${fmt(valuationEGP)} EGP\nToken price: ${fmt(tokenPriceEGP)} EGP\nToken supply: ${fmt(tokenSupply)} tokens\n\nPlease review and confirm in your dashboard.`,
    ctaLabel: "Review Valuation",
    ctaUrl: "/kemefrac/portfolio",
  });
}

export async function notifyOfferingApproved({ sellerEmail, propertyTitle }) {
  return sendNotification({
    toUserId: sellerEmail,
    title: "✅ KemeFrac™ Offering Approved!",
    body: `Great news! Your offering for "${propertyTitle}" has been approved. Admin is now tokenizing your property on NEAR Protocol. You'll be notified when it goes live.`,
  });
}

export async function notifyOfferingLive({ sellerEmail, propertyTitle, tokenSymbol, nearContractAddress, offeringSlug }) {
  return sendNotification({
    toUserId: sellerEmail,
    title: "🚀 Your KemeFrac™ Offering is LIVE!",
    body: `"${propertyTitle}" is now live on KemeFrac™!\n\nToken: ${tokenSymbol}\nContract: ${nearContractAddress}`,
    ctaLabel: "View Your Offering",
    ctaUrl: `/kemefrac/${offeringSlug}`,
  });
}

export async function notifyFirstTokenSold({ sellerEmail, tokenSymbol, tokensBought }) {
  return sendNotification({
    toUserId: sellerEmail,
    title: "🎉 First Investor! Tokens Purchased",
    body: `Someone just bought ${tokensBought} tokens of ${tokenSymbol}. Congratulations on your first investor!`,
    ctaLabel: "View Portfolio",
    ctaUrl: "/kemefrac/portfolio",
  });
}

export async function notifyMilestoneSold({ sellerEmail, tokenSymbol, percentSold, tokensRemaining }) {
  return sendNotification({
    toUserId: sellerEmail,
    title: `🔷 ${percentSold}% of Your Tokens Sold!`,
    body: `${tokensRemaining} tokens of ${tokenSymbol} remaining. Keep the momentum going!`,
    ctaLabel: "View Offering",
    ctaUrl: "/kemefrac",
  });
}

export async function notifySoldOut({ sellerEmail, tokenSymbol, totalRaisedEGP }) {
  const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n));
  return sendNotification({
    toUserId: sellerEmail,
    title: "🏆 SOLD OUT — All Tokens Purchased!",
    body: `Congratulations! Your ${tokenSymbol} offering is complete.\n\nTotal raised: ${fmt(totalRaisedEGP)} EGP`,
    ctaLabel: "View Portfolio",
    ctaUrl: "/kemefrac/portfolio",
  });
}

export async function notifyOfferingRejected({ sellerEmail, propertyTitle, rejectionReason }) {
  return sendNotification({
    toUserId: sellerEmail,
    title: "❌ KemeFrac™ Offering Not Approved",
    body: `Your offering for "${propertyTitle}" was not approved at this time.\n\nReason: ${rejectionReason}\n\nYou may edit and resubmit.`,
    ctaLabel: "View Feedback",
    ctaUrl: "/kemefrac/portfolio",
  });
}

// ─── INVESTOR NOTIFICATIONS ──────────────────────────────────────────────────

export async function notifyKYCApproved({ investorEmail }) {
  return sendNotification({
    toUserId: investorEmail,
    title: "✅ KYC Approved — Ready to Invest!",
    body: "Your identity has been verified. You can now purchase KemeFrac™ tokens and start investing in fractional Egyptian real estate.",
    ctaLabel: "Browse Offerings",
    ctaUrl: "/kemefrac",
  });
}

export async function notifyKYCRejected({ investorEmail, reason }) {
  return sendNotification({
    toUserId: investorEmail,
    title: "❌ KYC Not Approved",
    body: `Your KYC application was not approved.\n\nReason: ${reason}\n\nPlease resubmit with corrected documents.`,
    ctaLabel: "Resubmit KYC",
    ctaUrl: "/kemefrac/kyc",
  });
}

export async function notifyPurchaseConfirmed({ investorEmail, tokensBought, tokenSymbol, nearTxHash, ownershipPercent }) {
  return sendNotification({
    toUserId: investorEmail,
    title: "🔷 Token Purchase Confirmed!",
    body: `${tokensBought} tokens of ${tokenSymbol} are now yours.\n\nNEAR Tx: ${nearTxHash?.slice(0, 12)}...\nOwnership: ${ownershipPercent?.toFixed(2)}%`,
    ctaLabel: "View Portfolio",
    ctaUrl: "/kemefrac/portfolio",
  });
}

export async function notifyYieldReceived({ investorEmail, tokenSymbol, period, amountEGP }) {
  const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n));
  return sendNotification({
    toUserId: investorEmail,
    title: `💰 Yield Received — ${tokenSymbol}`,
    body: `Period: ${period}\nAmount: ${fmt(amountEGP)} EGP has been credited to your wallet.`,
    ctaLabel: "View Yield History",
    ctaUrl: "/kemefrac/portfolio",
  });
}

export async function notifyWatchlistOfferingLive({ investorEmail, propertyTitle, tokenPriceEGP, offeringSlug }) {
  const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n));
  return sendNotification({
    toUserId: investorEmail,
    title: "🚀 KemeFrac™ Offering Now Live!",
    body: `"${propertyTitle}" tokens are now available.\nPrice: ${fmt(tokenPriceEGP)} EGP per token`,
    ctaLabel: "View Offering",
    ctaUrl: `/kemefrac/${offeringSlug}`,
  });
}

export async function notifyNearlySoldOut({ investorEmail, tokenSymbol, tokensRemaining, offeringSlug }) {
  return sendNotification({
    toUserId: investorEmail,
    title: `⚡ Almost Gone — ${tokenSymbol} 90% Sold`,
    body: `Only ${tokensRemaining} tokens remaining. Don't miss your chance to invest!`,
    ctaLabel: "Buy Now",
    ctaUrl: `/kemefrac/${offeringSlug}`,
  });
}

export async function notifyMonthlyStatement({ investorEmail, totalTokens, propertyCount, yieldThisMonthEGP }) {
  const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n));
  return sendNotification({
    toUserId: investorEmail,
    title: "📋 Your Monthly KemeFrac™ Statement",
    body: `Total holdings: ${totalTokens} tokens across ${propertyCount} properties\nYield this month: ${fmt(yieldThisMonthEGP)} EGP`,
    ctaLabel: "Download Statement",
    ctaUrl: "/kemefrac/portfolio",
  });
}

// ─── ADMIN NOTIFICATIONS ─────────────────────────────────────────────────────

export async function adminNotifyNewSubmission({ adminEmail, propertyTitle, city, sellerName }) {
  return sendNotification({
    toUserId: adminEmail,
    title: "🔷 New KemeFrac™ Submission",
    body: `Property: "${propertyTitle}" — ${city}\nSeller: ${sellerName}`,
    ctaLabel: "Review Offering",
    ctaUrl: "/admin/kemedar/kemefrac/offerings",
  });
}

export async function adminNotifyReadyToTokenize({ adminEmail, tokenSymbol }) {
  return sendNotification({
    toUserId: adminEmail,
    title: `⚡ Ready to Tokenize: ${tokenSymbol}`,
    body: "All approvals complete. Deploy this offering to NEAR Protocol.",
    ctaLabel: "Tokenize Now",
    ctaUrl: "/admin/kemedar/kemefrac/tokenize",
  });
}

export async function adminNotifyNewKYC({ adminEmail, userName }) {
  return sendNotification({
    toUserId: adminEmail,
    title: "👤 New KYC Application",
    body: `${userName} has submitted their KYC documents for review.`,
    ctaLabel: "Review KYC",
    ctaUrl: "/admin/kemedar/kemefrac/kyc",
  });
}

export async function adminNotifyYieldDue({ adminEmail, offeringsCount }) {
  return sendNotification({
    toUserId: adminEmail,
    title: "💰 Yield Distribution Due Tomorrow",
    body: `${offeringsCount} offerings have scheduled yield payouts tomorrow. Please process them.`,
    ctaLabel: "Process Yields",
    ctaUrl: "/admin/kemedar/kemefrac/yield",
  });
}

export async function adminNotifyNEARMismatch({ adminEmail, userName, tokenSymbol, onChain, platform }) {
  return sendNotification({
    toUserId: adminEmail,
    title: "⚠️ NEAR Balance Mismatch Detected",
    body: `User: ${userName}\nProperty: ${tokenSymbol}\nOn-chain: ${onChain} tokens\nPlatform: ${platform} tokens\n\nManual investigation required.`,
    ctaLabel: "Investigate",
    ctaUrl: "/admin/kemedar/kemefrac/investors",
  });
}