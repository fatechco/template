// @ts-nocheck
/**
 * Surplus & Salvage notification templates.
 * Usage: import { sendSurplusNotification } from "@/components/surplus/SurplusNotificationTemplates";
 */

import { apiClient } from "@/lib/api-client";

export const SURPLUS_NOTIFICATION_TEMPLATES = {
  // ─────── SELLER ───────
  listing_published: (item) => ({
    icon: "♻️",
    title: "Your surplus item is live!",
    body: `${item.title} is now on the Kemetro Surplus Market. You just saved ${item.estimatedWeightKg || "?"}  kg from the landfill 🌍`,
    cta_label: "View My Listing →",
    cta_path: `/kemetro/surplus/${item.id}`,
  }),

  reservation_received: (item, buyer) => ({
    icon: "🛒",
    title: "Someone reserved your item!",
    body: `${item.title} has been reserved. Buyer's funds are held in escrow. Arrange pickup via chat.`,
    cta_label: "Chat with Buyer →",
    cta_path: `/dashboard/messages`,
  }),

  reservation_expired_seller: (item) => ({
    icon: "⏰",
    title: "Reservation expired — item is active again",
    body: `The buyer didn't collect ${item.title}. Your listing is live again automatically.`,
    cta_label: null,
    cta_path: null,
  }),

  settlement_complete: (item, netEGP) => ({
    icon: "💰",
    title: `Payment released — ${netEGP?.toLocaleString()} EGP earned!`,
    body: `QR scan confirmed. ${netEGP?.toLocaleString()} EGP is now in your XeedWallet.`,
    cta_label: "View Wallet →",
    cta_path: `/dashboard/escrow`,
  }),

  eco_tier_upgraded: (newTier, kgTotal) => ({
    icon: "🏆",
    title: `Eco tier upgraded — ${newTier?.replace("_", " ")}!`,
    body: `You've diverted ${kgTotal?.toLocaleString()} kg of waste. Your Sustainable Developer badge has been upgraded on your profile.`,
    cta_label: "View Profile →",
    cta_path: `/cp/developer`,
  }),

  listing_expiring_soon: (item) => ({
    icon: "⏰",
    title: `${item.title} expires in 7 days`,
    body: `Renew your listing to keep it active on the Surplus Market.`,
    cta_label: "Renew Listing →",
    cta_path: `/kemetro/surplus/my-listings`,
  }),

  // ─────── BUYER ───────
  reservation_confirmed: (item, amountEGP) => ({
    icon: "✅",
    title: "Reserved! Your QR code is ready.",
    body: `${amountEGP?.toLocaleString()} EGP held securely in escrow. Show your QR to the seller to release payment.`,
    cta_label: "Show My QR Code →",
    cta_path: `/kemetro/surplus/reservation/${item.id}`,
  }),

  reservation_expiring_soon_buyer: (item) => ({
    icon: "⚡",
    title: "Pickup reminder — reservation expires soon!",
    body: `Your reservation for ${item.title} expires in 6 hours. Arrange pickup now or it cancels.`,
    cta_label: "Contact Seller →",
    cta_path: `/dashboard/messages`,
  }),

  reservation_expired_refund: (amountEGP) => ({
    icon: "💸",
    title: "Reservation expired — full refund issued",
    body: `${amountEGP?.toLocaleString()} EGP returned to your XeedWallet.`,
    cta_label: "Browse Surplus →",
    cta_path: `/kemetro/surplus`,
  }),

  transaction_complete: (item) => ({
    icon: "🎉",
    title: `Done! You saved ${item.estimatedWeightKg || "?"} kg from the landfill 🌍`,
    body: `${item.title} is yours. Thanks for supporting the circular economy!`,
    cta_label: "Leave a Review →",
    cta_path: `/kemetro/surplus/${item.id}`,
  }),

  price_dropped: (item, newPrice, oldPrice) => ({
    icon: "💚",
    title: "Price drop on a saved item!",
    body: `${item.title} is now ${newPrice?.toLocaleString()} EGP — down from ${oldPrice?.toLocaleString()}.`,
    cta_label: "Reserve Now →",
    cta_path: `/kemetro/surplus/${item.id}`,
  }),

  saved_item_almost_gone: (item) => ({
    icon: "⚡",
    title: "Your saved item is almost sold!",
    body: `${item.title} has just been reserved by another buyer. It may become available if they cancel.`,
    cta_label: null,
    cta_path: null,
  }),

  // ─────── PRO ───────
  surplus_near_job: (count, radius, discountPct) => ({
    icon: "🌿",
    title: "Cut your material costs — nearby surplus!",
    body: `${count} items matching your job's materials are listed within ${radius} km at ${discountPct}% off retail.`,
    cta_label: "View Surplus Near Job →",
    cta_path: `/kemetro/surplus`,
  }),

  // ─────── ADMIN ───────
  high_value_listing: (item) => ({
    icon: "🌿",
    title: "High-value surplus item listed",
    body: `${item.title} — ${item.surplusPriceEGP?.toLocaleString()} EGP — ${item.sellerType}`,
    cta_label: "Review Listing →",
    cta_path: `/admin/kemetro/surplus/listings`,
  }),

  esg_milestone_hit: (tonsAmount) => ({
    icon: "🏆",
    title: `ESG Milestone: ${tonsAmount} tons diverted!`,
    body: "Generate press release PDF now.",
    cta_label: "Generate ESG Report →",
    cta_path: `/admin/kemetro/surplus`,
  }),
};

/**
 * Sends a Surplus notification email via Resend/Core integration.
 * @param {string} toEmail - recipient email
 * @param {string} templateKey - key from SURPLUS_NOTIFICATION_TEMPLATES
 * @param {...any} args - template arguments
 */
export async function sendSurplusEmail(toEmail, templateKey, ...args) {
  const templateFn = SURPLUS_NOTIFICATION_TEMPLATES[templateKey];
  if (!templateFn) return;
  const tpl = templateFn(...args);
  await /* integration Core.SendEmail TODO */ ({
    to: toEmail,
    subject: tpl.title,
    body: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#14532d;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <span style="font-size:48px">${tpl.icon}</span>
          <h1 style="color:#fff;font-size:22px;margin:12px 0 0">${tpl.title}</h1>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:15px;line-height:1.6">${tpl.body}</p>
          ${tpl.cta_label ? `<a href="${window?.location?.origin || ""}${tpl.cta_path}" style="display:inline-block;margin-top:20px;background:#16a34a;color:#fff;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none">${tpl.cta_label}</a>` : ""}
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />
          <p style="color:#9ca3af;font-size:12px">Kemetro Surplus & Salvage Eco-Market</p>
        </div>
      </div>
    `,
  });
}