/**
 * Kemedar Verify Pro™ — Notification Templates
 * All in-app + email notifications for the Verify Pro module.
 *
 * Usage:
 *   import { sendVerifyProNotification } from "@/lib/verifyProNotifications";
 *   await sendVerifyProNotification("seller_token_minted", { tokenId, propertyId, userEmail, ... });
 */

import { base44 } from "@/api/base44Client";

// ─── Template Registry ────────────────────────────────────────────────────────

const TEMPLATES = {

  // ── SELLER ──────────────────────────────────────────────────────────────────

  seller_token_minted: ({ tokenId }) => ({
    icon: "🔐",
    title: "Your Verify Pro Token is Active",
    body: `Token ID: ${tokenId}\nVerify your property to get more views`,
    cta_label: "Start Verification →",
    cta_path: `/verify/my-property/`,
  }),

  seller_level2_achieved: () => ({
    icon: "✅",
    title: "Seller Verified — Level 2 Reached!",
    body: "Your listing now shows a Seller badge.\nNext: Upload documents for Level 3",
    cta_label: "Upload Documents →",
    cta_path: `/verify/my-property/`,
  }),

  seller_doc_ai_authentic: ({ documentType, aiScore }) => ({
    icon: "✅",
    title: `Document Accepted — Score: ${aiScore}/100`,
    body: `${documentType} looks authentic.\nWaiting for Franchise Owner approval`,
    cta_label: null,
  }),

  seller_doc_ai_suspicious: () => ({
    icon: "⚠️",
    title: "Document Sent for Manual Review",
    body: "Our AI flagged a potential issue.\nFranchise Owner will review within 48 hours",
    cta_label: null,
  }),

  seller_doc_ai_fraudulent: ({ aiSummary }) => ({
    icon: "🚨",
    title: "Document Could Not Be Verified",
    body: `Issue: ${aiSummary}\nPlease upload a clearer or corrected document`,
    cta_label: "Re-upload Document →",
    cta_path: `/verify/my-property/`,
  }),

  seller_doc_fo_approved: ({ documentType }) => ({
    icon: "✅",
    title: "Document Approved by Franchise Owner",
    body: `${documentType} has been verified`,
    cta_label: null,
  }),

  seller_level3_achieved: () => ({
    icon: "◑",
    title: "Documents Verified — Level 3 Reached!",
    body: "All documents have been approved.\nNext: Book a physical inspection for Level 4",
    cta_label: "Book Inspection →",
    cta_path: `/verify/my-property/`,
  }),

  seller_inspection_scheduled: ({ foName, date, time }) => ({
    icon: "📅",
    title: "Physical Inspection Confirmed",
    body: `FO ${foName} will visit on ${date} at ${time}.\nPlease ensure someone is present`,
    cta_label: "View Details →",
    cta_path: `/verify/my-property/`,
  }),

  seller_inspection_passed: () => ({
    icon: "✅",
    title: "Inspection Passed — Level 4 Achieved! 🎉",
    body: "FO Verdict: Clean\nNext: Submit final documents for Level 5",
    cta_label: "Continue to Level 5 →",
    cta_path: `/verify/my-property/`,
  }),

  seller_inspection_minor_issues: () => ({
    icon: "⚠️",
    title: "Inspection Completed — Minor Issues Noted",
    body: "Admin is reviewing — you will be notified of the outcome",
    cta_label: "View Inspection Report →",
    cta_path: `/verify/my-property/`,
  }),

  seller_inspection_failed: ({ verdictNotes }) => ({
    icon: "❌",
    title: "Inspection Could Not Be Approved",
    body: `Reason: ${verdictNotes || "See inspection report"}\nPlease resolve issues and re-book`,
    cta_label: "Re-book Inspection",
    cta_path: `/verify/my-property/`,
  }),

  seller_certificate_issued: ({ tokenId, certificateExpiresAt }) => ({
    icon: "🏅",
    title: "FULLY VERIFIED! Level 5 Achieved! 🎉",
    body: `Certificate ID: ${tokenId}\nValid until: ${certificateExpiresAt ? new Date(certificateExpiresAt).toLocaleDateString() : "—"}`,
    cta_label: "Download Certificate →",
    cta_path: `/verify/${tokenId}`,
  }),

  seller_certificate_expiring: ({ tokenId }) => ({
    icon: "⏰",
    title: "Certificate Expires in 30 Days",
    body: "Renew to keep your Level 5 status\nRenewal fee: 199 EGP",
    cta_label: "Renew Now →",
    cta_path: `/verify/my-property/`,
  }),

  seller_certificate_expired: ({ tokenId }) => ({
    icon: "❌",
    title: "Your Verify Pro Certificate Has Expired",
    body: "Your listing has been downgraded to Level 4\nRenew to restore Level 5 status",
    cta_label: "Renew Certificate →",
    cta_path: `/verify/my-property/`,
  }),

  seller_fraud_suspended: ({ flagType }) => ({
    icon: "🚨",
    title: "URGENT: Your Listing is Under Review",
    body: `Issue detected: ${flagType || "Potential fraud flag"}\nListing temporarily suspended`,
    cta_label: "Contact Support →",
    cta_path: `/contact`,
    urgent: true,
  }),

  seller_fraud_cleared: () => ({
    icon: "✅",
    title: "Your Listing Has Been Reinstated",
    body: "The investigation is resolved.\nYour listing is active again",
    cta_label: null,
  }),

  // ── BUYER ───────────────────────────────────────────────────────────────────

  buyer_saved_property_upgraded: ({ propertyTitle, newLevel, propertyId }) => ({
    icon: "🔐",
    title: "A saved property just got more verified!",
    body: `${propertyTitle} is now Level ${newLevel} Verified`,
    cta_label: "View Property →",
    cta_path: `/property/${propertyId}`,
  }),

  buyer_saved_property_fully_verified: ({ propertyTitle, propertyId }) => ({
    icon: "🏅",
    title: "Great news — a saved property is FULLY VERIFIED",
    body: `${propertyTitle} now has a Level 5 certificate`,
    cta_label: "View Property →",
    cta_path: `/property/${propertyId}`,
  }),

  buyer_deal_proposed: ({ dealId }) => ({
    icon: "📤",
    title: "Your deal proposal has been sent",
    body: "Waiting for seller to accept",
    cta_label: "View Deal →",
    cta_path: `/deal/${dealId}`,
  }),

  buyer_deal_accepted: ({ dealId }) => ({
    icon: "🤝",
    title: "Seller Accepted Your Deal!",
    body: `Deal ${dealId} is now active\nComplete your conditions to proceed`,
    cta_label: "View Deal →",
    cta_path: `/deal/${dealId}`,
  }),

  buyer_deal_condition_passed: ({ dealId, conditionType, completedCount, totalCount }) => ({
    icon: "✅",
    title: `Deal Condition Met: ${conditionType}`,
    body: `Deal is now ${completedCount} of ${totalCount} conditions complete`,
    cta_label: "View Deal →",
    cta_path: `/deal/${dealId}`,
  }),

  buyer_deal_all_conditions_met: ({ dealId }) => ({
    icon: "🎉",
    title: "All Conditions Met — Deal Ready!",
    body: "Kemedar admin will execute ownership transfer\nExpected within 24 hours",
    cta_label: "View Deal →",
    cta_path: `/deal/${dealId}`,
  }),

  // ── FRANCHISE OWNER ─────────────────────────────────────────────────────────

  fo_inspection_assigned: ({ propertyType, city, distanceKm, tokenId }) => ({
    icon: "🔍",
    title: "New Inspection Request",
    body: `${propertyType}, ${city}\nDistance: ${distanceKm} km from you\nYour fee: 400 EGP`,
    cta_label: "Accept or Decline →",
    cta_path: `/fo/verify-inspections`,
  }),

  fo_inspection_reminder: ({ propertyTitle, date, time, sellerName, sellerPhone }) => ({
    icon: "📅",
    title: "Reminder: Inspection Tomorrow",
    body: `${propertyTitle}\n${date} at ${time}\nSeller: ${sellerName} — ${sellerPhone}`,
    cta_label: "View Details →",
    cta_path: `/fo/verify-inspections`,
  }),

  fo_document_to_review: ({ documentType, propertyTitle, aiScore, aiDecision }) => ({
    icon: "📄",
    title: "Document Ready for Your Review",
    body: `${documentType} for ${propertyTitle}\nAI Score: ${aiScore}/100 — ${aiDecision}`,
    cta_label: "Review Document →",
    cta_path: `/admin/kemedar/verify-pro/documents`,
  }),

  fo_payment_confirmed: ({ propertyTitle, date }) => ({
    icon: "💰",
    title: "Payment Confirmed: 400 EGP",
    body: `For inspection of ${propertyTitle}\nCompleted on ${date}`,
    cta_label: null,
  }),
};

// ─── Send Notification ────────────────────────────────────────────────────────

/**
 * Send a Verify Pro notification.
 * @param {string} templateKey - Key from TEMPLATES above
 * @param {object} params - Template-specific params + { recipientEmail, recipientUserId, propertyId }
 */
export async function sendVerifyProNotification(templateKey, params = {}) {
  const templateFn = TEMPLATES[templateKey];
  if (!templateFn) {
    console.warn(`[VerifyPro] Unknown notification template: ${templateKey}`);
    return;
  }

  const tpl = templateFn(params);
  const { recipientEmail, recipientUserId } = params;

  // Send email notification
  if (recipientEmail) {
    await base44.integrations.Core.SendEmail({
      to: recipientEmail,
      subject: `${tpl.icon} ${tpl.title}`,
      body: buildEmailBody(tpl),
    }).catch(err => console.warn("[VerifyPro] Email failed:", err.message));
  }

  return tpl;
}

function buildEmailBody(tpl) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <div style="background: #FF6B00; padding: 16px 24px; border-radius: 12px 12px 0 0;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/0687980a4_kemedar-Logo-ar-6000.png"
      alt="Kemedar" style="height: 32px; filter: brightness(0) invert(1);" />
    <p style="color: white; font-size: 11px; margin: 4px 0 0; opacity: 0.8;">Kemedar Verify Pro™</p>
  </div>

  <div style="background: white; border: 1px solid #e5e7eb; border-top: none; padding: 32px 24px; border-radius: 0 0 12px 12px;">
    <p style="font-size: 32px; margin: 0 0 8px;">${tpl.icon}</p>
    <h1 style="font-size: 20px; font-weight: 900; margin: 0 0 16px; color: #111;">${tpl.title}</h1>
    <p style="font-size: 15px; color: #555; line-height: 1.6; white-space: pre-line; margin: 0 0 24px;">${tpl.body}</p>

    ${tpl.cta_label ? `
    <a href="https://kemedar.com${tpl.cta_path || ''}"
      style="display: inline-block; background: #FF6B00; color: white; font-weight: 900; font-size: 15px;
             padding: 14px 28px; border-radius: 12px; text-decoration: none; margin-bottom: 24px;">
      ${tpl.cta_label}
    </a>` : ""}

    ${tpl.urgent ? `<p style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; color: #dc2626; font-size: 13px; font-weight: bold;">
      ⚠️ This requires urgent attention. Contact Kemedar support if you need assistance.
    </p>` : ""}
  </div>

  <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 16px;">
    © ${new Date().getFullYear()} Kemedar. All rights reserved.<br />
    <a href="https://kemedar.com" style="color: #FF6B00;">kemedar.com</a>
  </p>
</body>
</html>`;
}

// ─── Named exports for common notifications ───────────────────────────────────

export const VerifyProNotifs = TEMPLATES;
export default sendVerifyProNotification;