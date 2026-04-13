import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// ── Email HTML builder ──────────────────────────────────────────────────────
function emailHtml(icon, title, body, ctaLabel, ctaUrl) {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border-radius:16px;border:1px solid #f0f0f0;">
  <div style="font-size:36px;margin-bottom:16px;text-align:center;">${icon}</div>
  <h2 style="color:#0A1628;font-size:20px;margin:0 0 12px;">${title}</h2>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">${body.replace(/\n/g, '<br/>')}</p>
  <a href="${ctaUrl}" style="display:inline-block;background:#14B8A6;color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px;">${ctaLabel}</a>
  <p style="color:#aaa;font-size:12px;margin-top:32px;text-align:center;">Kemedar Shop the Look · Powered by Kemetro AI</p>
</div>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { notificationType, data } = await req.json();

    // ── BUYER: Shoppable image on saved property ─────────────────────────────
    if (notificationType === "buyer_shoppable_property") {
      const { userEmail, propertyTitle, propertyId } = data;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: userEmail,
        subject: `✨ Shop the look in ${propertyTitle}!`,
        body: emailHtml(
          "✨",
          `Shop the look in ${propertyTitle}!`,
          `A property you saved has shoppable interior photos.\nTap to see what's available on Kemetro.`,
          "View Property →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/property/${propertyId}`
        ),
      });
      return Response.json({ sent: true });
    }

    // ── BUYER: Guest cart expiry warning ────────────────────────────────────
    if (notificationType === "buyer_cart_expiry") {
      const { userEmail, itemCount, expiryDate } = data;
      const expiry = new Date(expiryDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: userEmail,
        subject: "You left items in your Kemetro cart",
        body: emailHtml(
          "🛒",
          "You left items in your Kemetro cart",
          `You saved ${itemCount} item${itemCount !== 1 ? "s" : ""} from a Kemedar property.\nLog in before ${expiry} to keep them.`,
          "View My Cart →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/kemetro/cart`
        ),
      });
      return Response.json({ sent: true });
    }

    // ── SELLER: Hotspot available to sponsor ────────────────────────────────
    if (notificationType === "seller_hotspot_available") {
      const { sellerEmail, category, monthlyViews, dailyRate, hotspotId } = data;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: sellerEmail,
        subject: "🛋️ New sponsorship opportunity on Kemedar!",
        body: emailHtml(
          "🛋️",
          "New sponsorship opportunity on Kemedar!",
          `A ${category} hotspot was just tagged in a property with ${(monthlyViews || 0).toLocaleString()} monthly views.\nPin your product for ${dailyRate || 50} EGP/day.`,
          "View Opportunity →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/kemetro/seller/promotions`
        ),
      });
      return Response.json({ sent: true });
    }

    // ── SELLER: Sponsorship approved ────────────────────────────────────────
    if (notificationType === "seller_sponsorship_approved") {
      const { sellerEmail, itemLabel, propertyTitle, hotspotId } = data;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: sellerEmail,
        subject: "⭐ Your sponsorship is live!",
        body: emailHtml(
          "⭐",
          "Your sponsorship is live!",
          `Your product is now pinned to '${itemLabel}' in ${propertyTitle}.`,
          "View Campaign →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/kemetro/seller/promotions`
        ),
      });
      return Response.json({ sent: true });
    }

    // ── SELLER: Click milestone ──────────────────────────────────────────────
    if (notificationType === "seller_click_milestone") {
      const { sellerEmail, clicks, itemLabel, propertyTitle, cartCount } = data;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: sellerEmail,
        subject: `📊 Your sponsored pin got ${clicks} clicks!`,
        body: emailHtml(
          "📊",
          `Your sponsored pin got ${clicks} clicks!`,
          `${itemLabel} in ${propertyTitle} is performing well — ${cartCount} add-to-carts.`,
          "View Analytics →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/kemetro/seller/promotions`
        ),
      });
      return Response.json({ sent: true });
    }

    // ── SELLER: Sponsorship ending soon ─────────────────────────────────────
    if (notificationType === "seller_sponsorship_ending") {
      const { sellerEmail, itemLabel, propertyTitle, hotspotId } = data;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: sellerEmail,
        subject: "⏰ Your sponsorship ends in 3 days",
        body: emailHtml(
          "⏰",
          "Your sponsorship ends in 3 days",
          `${itemLabel} in ${propertyTitle}.\nExtend now to keep your top position.`,
          "Extend Campaign →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/kemetro/seller/promotions`
        ),
      });
      return Response.json({ sent: true });
    }

    // ── SELLER: Sponsorship ended summary ───────────────────────────────────
    if (notificationType === "seller_sponsorship_ended") {
      const { sellerEmail, itemLabel, totalClicks, totalCarts, durationDays, totalSpent } = data;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: sellerEmail,
        subject: `📋 Campaign summary — ${itemLabel}`,
        body: emailHtml(
          "📋",
          `Campaign summary — ${itemLabel}`,
          `Your pin received ${totalClicks} clicks and ${totalCarts} add-to-carts in ${durationDays} days.\nTotal spent: ${totalSpent} EGP.`,
          "View Full Report →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/kemetro/seller/promotions`
        ),
      });
      return Response.json({ sent: true });
    }

    // ── ADMIN: New sponsorship pending ──────────────────────────────────────
    if (notificationType === "admin_sponsorship_pending") {
      const { adminEmail, sellerName, itemLabel, propertyTitle, hotspotId } = data;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: adminEmail,
        subject: "🛋️ Seller sponsorship awaiting review",
        body: emailHtml(
          "🛋️",
          "Seller sponsorship awaiting review",
          `Seller: ${sellerName}\nItem: ${itemLabel}\nProperty: ${propertyTitle}`,
          "Approve / Review →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/admin/kemetro/shop-the-look/sponsorships`
        ),
      });
      return Response.json({ sent: true });
    }

    // ── ADMIN: High-traffic image ────────────────────────────────────────────
    if (notificationType === "admin_high_traffic_image") {
      const { adminEmail, propertyTitle, clicksToday, imageId } = data;
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: adminEmail,
        subject: "✨ High-traffic shoppable image alert",
        body: emailHtml(
          "✨",
          "High-traffic shoppable image alert",
          `${propertyTitle} image has ${clicksToday} hotspot clicks today.\nConsider featuring this property.`,
          "View Image →",
          `${Deno.env.get("SITE_URL") || "https://kemedar.com"}/admin/kemetro/shop-the-look/images`
        ),
      });
      return Response.json({ sent: true });
    }

    return Response.json({ error: "Unknown notificationType" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});