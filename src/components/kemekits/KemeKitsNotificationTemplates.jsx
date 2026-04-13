/**
 * KemeKits Notification Templates
 * Use base44.integrations.Core.SendEmail or your notification system
 * to send these templates at the appropriate trigger points.
 *
 * Each function returns { icon, title, body, cta }
 */

// ── DESIGNER NOTIFICATIONS ────────────────────────────────
export const designerKitSubmitted = ({ title }) => ({
  icon: "🎨",
  title: "KemeKit submitted — under review",
  body: `'${title}' is now in the admin queue. You'll be notified within 24 hours.`,
  cta: { label: "View My Kits →", path: "/kemework/pro/kemekits" },
});

export const designerKitApproved = ({ title }) => ({
  icon: "🚀",
  title: "Your KemeKit is LIVE! 🎉",
  body: `'${title}' is now on the KemeKits hub. Share your affiliate link to start earning.`,
  cta: [
    { label: "View Live Kit →", path: "/kemetro/kemekits" },
    { label: "Copy Affiliate Link", action: "copy_affiliate" },
  ],
});

export const designerKitRejected = ({ title, rejectionReason }) => ({
  icon: "❌",
  title: "KemeKit needs changes",
  body: `Admin feedback: '${rejectionReason}'. Edit and resubmit when ready.`,
  cta: { label: "Edit Kit →", path: "/kemework/pro/kemekits" },
});

export const designerFirstCalculation = ({ title }) => ({
  icon: "📐",
  title: "Someone just calculated your kit!",
  body: `A user ran a BOQ calculation on '${title}'. You earn commission if they add it to cart.`,
});

export const designerCommissionMilestone = ({ title, totalEarned }) => ({
  icon: "💎",
  title: `${Number(totalEarned).toLocaleString()} EGP earned from your KemeKit!`,
  body: `'${title}' has generated ${Number(totalEarned).toLocaleString()} EGP in Kemecoins commissions for you.`,
  cta: { label: "View My Wallet →", path: "/cp/pro/earnings" },
});

export const designerCommissionPaid = ({ title, commissionEGP }) => ({
  icon: "💰",
  title: `Commission earned — ${commissionEGP} EGP Kemecoins!`,
  body: `A buyer purchased the full cart for '${title}'. ${commissionEGP} EGP added to your Kemecoins wallet.`,
});

// ── BUYER NOTIFICATIONS ───────────────────────────────────
export const buyerCartAdded = ({ itemCount, totalCost }) => ({
  icon: "🛒",
  title: `🛒 ${itemCount} items added to your Kemetro cart!`,
  body: `Total: ${Number(totalCost).toLocaleString()} EGP — proceed to checkout`,
  cta: { label: "View Cart →", path: "/kemetro/cart" },
  type: "toast",
});

export const buyerSavedCalculationReminder = ({ length, width, roomType, kitTitle, itemCount, totalCost }) => ({
  icon: "📐",
  title: "Your room calculation is saved!",
  body: `Your ${length}×${width}m ${roomType} calculation for '${kitTitle}' is ready to order. ${itemCount} items totalling ${Number(totalCost).toLocaleString()} EGP.`,
  cta: { label: "Add to Cart →", path: "/kemetro/kemekits/my-calculations" },
});

export const buyerInstallationRequestSent = ({ designerName, kitTitle }) => ({
  icon: "👷",
  title: "Installation request sent!",
  body: `We've notified ${designerName || "contractors"} about your ${kitTitle} installation. Expect a response within 24 hours.`,
  cta: { label: "View My Task →", path: "/kemework/customer/tasks" },
});

export const buyerCartAbandoned = ({ itemCount, roomType, totalCost }) => ({
  icon: "🛒",
  title: "Your KemeKit is waiting in your cart",
  body: `${itemCount} items for your ${roomType} totalling ${Number(totalCost).toLocaleString()} EGP. Limited stock on some items.`,
  cta: { label: "Complete Your Order →", path: "/kemetro/cart" },
});

// ── KEMEWORK PROFESSIONAL NOTIFICATIONS ───────────────────
export const proInstallationRequestHireCreator = ({ kitTitle, length, width, roomType, estimatedLaborEGP }) => ({
  icon: "🤝",
  title: "Installation request for your KemeKit!",
  body: `A buyer wants you to install '${kitTitle}' in their ${length}×${width}m ${roomType}. Estimated job: ${Number(estimatedLaborEGP).toLocaleString()} EGP labor.`,
  cta: { label: "View Request →", path: "/cp/pro/orders" },
});

export const proInstallationOpenBidding = ({ roomType, city }) => ({
  icon: "📋",
  title: "New KemeKit installation task",
  body: `${roomType} installation in ${city}. Materials already ordered. Labor only.`,
  cta: { label: "View & Bid →", path: "/kemework/tasks" },
});

// ── KEMETRO SHIPPER NOTIFICATIONS ─────────────────────────
export const shipperHeavyFreightJob = ({ kitTitle, weightKg, pickupDistrict, deliveryDistrict, earningsEGP }) => ({
  icon: "🚛",
  title: `KemeKit Freight Job — ${weightKg} kg`,
  body: `${kitTitle} — ${weightKg} kg\nPickup: ${pickupDistrict} → Delivery: ${deliveryDistrict}\nEarn: ${Number(earningsEGP).toLocaleString()} EGP`,
  cta: { label: "Accept Job →", path: "/kemetro/shipper/dashboard" },
});

// ── ADMIN NOTIFICATIONS ───────────────────────────────────
export const adminKitPendingReview = ({ title, designerName, productCount, roomType, budgetTier }) => ({
  icon: "🎨",
  title: "New KemeKit awaiting approval",
  body: `'${title}' by ${designerName} — ${productCount} products, ${roomType}, ${budgetTier}`,
  cta: { label: "Review Kit →", path: "/admin/kemetro/kemekits/pending" },
});

export const adminHighGMVMilestone = ({ title, gmvEGP }) => ({
  icon: "💰",
  title: `KemeKit GMV milestone: ${Number(gmvEGP).toLocaleString()} EGP`,
  body: `'${title}' has generated ${Number(gmvEGP).toLocaleString()} EGP GMV. Consider featuring it.`,
  cta: { label: "Feature This Kit →", path: "/admin/kemetro/kemekits/all" },
});