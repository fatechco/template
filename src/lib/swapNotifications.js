/**
 * Kemedar Swap™ — Notification Templates
 * Usage: swapNotifications.send(type, { user, property, match, ... })
 * All templates follow the platform's SendEmail / push notification format.
 */

export const SWAP_NOTIFICATIONS = {

  // ─── USER NOTIFICATIONS ──────────────────────────────────────

  intent_published: ({ propertyTitle, intentId } = {}) => ({
    icon: "🔄",
    title: "You're in the Kemedar Swap™ pool!",
    body: `We're scanning for compatible swap partners for ${propertyTitle || "your property"}. We'll notify you the moment we find a match.`,
    cta_label: "View My Intent →",
    cta_url: `/dashboard/swap`,
    priority: "normal",
    channels: ["push"],
  }),

  new_match: ({ cityName, score, matchId } = {}) => ({
    icon: "✨",
    title: `New swap match — ${score || "—"}% compatibility!`,
    body: `We found a property in ${cityName || "your city"} that suits your swap criteria. Tap to see if it's a match worth pursuing.`,
    cta_label: "View Match →",
    cta_url: `/dashboard/swap`,
    priority: "normal",
    channels: ["push"],
  }),

  other_party_interested: ({ firstName, propertyType, cityName, matchId } = {}) => ({
    icon: "💚",
    title: `${firstName || "Someone"} is interested in your swap!`,
    body: `The owner of ${propertyType || "a property"} in ${cityName || "your city"} wants to explore swapping with you.`,
    cta_label: "View & Respond →",
    cta_url: `/dashboard/swap`,
    priority: "high",
    channels: ["push"],
  }),

  both_matched: ({ firstName, matchId } = {}) => ({
    icon: "🎉",
    title: "🎉 IT'S A SWAP MATCH!",
    body: `You and ${firstName || "the other party"} both want to swap! Enter your private Negotiation Room to discuss the terms.`,
    cta_label: "Enter Negotiation Room →",
    cta_url: `/dashboard/swap/negotiation/${matchId}`,
    priority: "urgent",
    channels: ["push", "email"], // HIGH PRIORITY — both channels
  }),

  counter_offer_received: ({ firstName, gapEGP, matchId } = {}) => ({
    icon: "💱",
    title: `${firstName || "The other party"} made a counter-offer`,
    body: `They proposed a gap of ${gapEGP ? Number(gapEGP).toLocaleString() : "—"} EGP. Accept, counter, or decline in your Negotiation Room.`,
    cta_label: "View Offer →",
    cta_url: `/dashboard/swap/negotiation/${matchId}`,
    priority: "high",
    channels: ["push"],
  }),

  terms_agreed: ({ gapEGP, matchId } = {}) => ({
    icon: "✅",
    title: "Terms Agreed! Your swap is locked.",
    body: `Both parties agreed on a ${gapEGP ? Number(gapEGP).toLocaleString() : "0"} EGP gap. Proceed to legal and escrow to complete the swap securely.`,
    cta_label: "Complete Your Swap →",
    cta_url: `/dashboard/swap/negotiation/${matchId}`,
    priority: "high",
    channels: ["push", "email"],
  }),

  lawyer_assigned: ({ matchId } = {}) => ({
    icon: "⚖️",
    title: "Your Kemework lawyer has been assigned",
    body: "A certified real estate lawyer will contact you within 24 hours to begin drafting the dual transfer contracts.",
    cta_label: "View Negotiation Room →",
    cta_url: `/dashboard/swap/negotiation/${matchId}`,
    priority: "normal",
    channels: ["push"],
  }),

  escrow_confirmed: ({ gapEGP, matchId } = {}) => ({
    icon: "🔒",
    title: "Escrow funds confirmed — swap in progress",
    body: `${gapEGP ? Number(gapEGP).toLocaleString() : "—"} EGP is safely held in XeedWallet. Funds release when both title deeds transfer.`,
    cta_label: "View Status →",
    cta_url: `/dashboard/swap/negotiation/${matchId}`,
    priority: "normal",
    channels: ["push"],
  }),

  swap_completed: ({ firstName } = {}) => ({
    icon: "🏠",
    title: "Swap Complete — Congratulations!",
    body: `Your property swap with ${firstName || "the other party"} is officially done. Welcome to your new property!`,
    cta_label: "View My Properties →",
    cta_url: `/dashboard/my-properties`,
    priority: "normal",
    channels: ["push", "email"],
  }),

  intent_expiring: ({ propertyTitle } = {}) => ({
    icon: "⏰",
    title: "Your swap intent expires in 7 days",
    body: `Renew your intent for ${propertyTitle || "your property"} to stay in the pool and keep receiving new matches.`,
    cta_label: "Renew My Intent →",
    cta_url: `/dashboard/swap`,
    priority: "normal",
    channels: ["push"],
  }),

  sales_rep_assigned: ({ firstName } = {}) => ({
    icon: "📞",
    title: "A Kemedar agent will contact you",
    body: `To help finalise your swap with ${firstName || "the other party"}, a Kemedar sales agent will reach out soon.`,
    cta_label: null,
    cta_url: null,
    priority: "normal",
    channels: ["push"],
  }),

  // ─── ADMIN NOTIFICATIONS ─────────────────────────────────────

  admin_new_intent: ({ propertyTitle, cityName, userName, direction } = {}) => ({
    icon: "🔄",
    title: `New swap intent — ${propertyTitle || "Property"}, ${cityName || ""}`,
    body: `${userName || "A user"} | Direction: ${direction || "—"}`,
    cta_label: "View Intent →",
    cta_url: `/admin/kemedar/swaps/pool`,
    priority: "normal",
    channels: ["push"],
    audience: "admin",
  }),

  admin_high_score_match: ({ score, propertyATitle, propertyBTitle, matchId } = {}) => ({
    icon: "✨",
    title: `High-quality match found — Score: ${score || "—"}%`,
    body: `${propertyATitle || "Property A"} ⇄ ${propertyBTitle || "Property B"}`,
    cta_label: "Review Match →",
    cta_url: `/admin/kemedar/swaps/matches`,
    priority: "normal",
    channels: ["push"],
    audience: "admin",
  }),

  admin_negotiation_started: ({ userAName, userBName, gapEGP, matchId } = {}) => ({
    icon: "🎉",
    title: "New negotiation room opened",
    body: `${userAName || "User A"} ⇄ ${userBName || "User B"} | Gap: ${gapEGP ? Number(gapEGP).toLocaleString() : "—"} EGP`,
    cta_label: "Monitor Room →",
    cta_url: `/admin/kemedar/swaps/negotiations`,
    priority: "normal",
    channels: ["push"],
    audience: "admin",
  }),

  admin_stalled_negotiation: ({ daysInactive, matchId, userAName, userBName } = {}) => ({
    icon: "⚠️",
    title: `Stalled negotiation — ${daysInactive || "7"}+ days inactive`,
    body: `Match #${matchId?.slice(0,8) || "—"} | ${userAName || "User A"} ⇄ ${userBName || "User B"}`,
    cta_label: "Assign Sales Rep →",
    cta_url: `/admin/kemedar/swaps/negotiations?tab=stalled`,
    priority: "high",
    channels: ["push"],
    audience: "admin",
  }),

  admin_swap_completed: ({ revenue, propertyATitle, propertyBTitle, combinedValue } = {}) => ({
    icon: "✅",
    title: `Swap completed — Revenue: ${revenue ? Number(revenue).toLocaleString() : "—"} EGP`,
    body: `Properties: ${propertyATitle || "A"} ⇄ ${propertyBTitle || "B"} | Combined value: ${combinedValue ? Number(combinedValue).toLocaleString() : "—"} EGP`,
    cta_label: null,
    cta_url: `/admin/kemedar/swaps`,
    priority: "normal",
    channels: ["push"],
    audience: "admin",
  }),
};

/**
 * Send a swap notification via the platform's email integration
 * Call from backend functions: sendSwapNotification(type, params, toEmail)
 */
export async function sendSwapEmail(base44, type, params, toEmail) {
  const template = SWAP_NOTIFICATIONS[type]?.(params);
  if (!template) return;
  await base44.integrations.Core.SendEmail({
    to: toEmail,
    subject: template.title,
    body: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <div style="font-size:40px;text-align:center;margin-bottom:16px">${template.icon}</div>
        <h2 style="font-size:22px;font-weight:900;color:#111;text-align:center;margin-bottom:12px">${template.title}</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;text-align:center;margin-bottom:24px">${template.body}</p>
        ${template.cta_label && template.cta_url ? `
          <div style="text-align:center">
            <a href="${template.cta_url}" style="display:inline-block;background:#7C3AED;color:white;font-weight:900;padding:14px 32px;border-radius:14px;text-decoration:none;font-size:15px">
              ${template.cta_label}
            </a>
          </div>
        ` : ""}
        <p style="color:#999;font-size:12px;text-align:center;margin-top:32px">Kemedar Swap™ — AI Property Exchange Platform</p>
      </div>
    `,
  });
}