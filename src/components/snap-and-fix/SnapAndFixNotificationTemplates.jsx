/**
 * Snap & Fix Notification Templates
 *
 * Usage:
 *   import { buildNotification, SNAP_NOTIF } from "@/components/snap-and-fix/SnapAndFixNotificationTemplates";
 *   const notif = buildNotification(SNAP_NOTIF.USER_DIAGNOSIS_COMPLETE, { diagnosedIssue: "...", sessionId: "..." });
 */

export const SNAP_NOTIF = {
  // ── USER ──────────────────────────────────────────────────────
  USER_DIAGNOSIS_COMPLETE: "user_diagnosis_complete",
  USER_TASK_POSTED: "user_task_posted",
  USER_EMERGENCY_ALERT: "user_emergency_alert",
  USER_MATERIALS_CART: "user_materials_cart",
  USER_SESSION_EXPIRING: "user_session_expiring",

  // ── PROFESSIONAL ──────────────────────────────────────────────
  PRO_NEW_AI_TASK: "pro_new_ai_task",
  PRO_EMERGENCY_TASK: "pro_emergency_task",

  // ── ADMIN ─────────────────────────────────────────────────────
  ADMIN_EMERGENCY: "admin_emergency",
};

/**
 * Build a notification payload from a template key + context variables.
 * Returns { icon, title, body, cta_label, cta_url, channels, priority }
 */
export function buildNotification(type, ctx = {}) {
  const {
    diagnosedIssue = "Home repair issue",
    safetyWarning = "Take immediate action.",
    sessionId = "",
    taskId = "",
    city = "your area",
    category = "General Maintenance",
    urgencyLevel = "medium",
    cartCount = 1,
    userName = "User",
  } = ctx;

  const templates = {
    // ── USER ──────────────────────────────────────────────────────
    [SNAP_NOTIF.USER_DIAGNOSIS_COMPLETE]: {
      icon: "✨",
      title: "AI Diagnosis Ready!",
      body: `We identified: ${diagnosedIssue}. Review the contractor brief and post to professionals.`,
      cta_label: "Review Diagnosis →",
      cta_url: `/kemework/snap/review/${sessionId}`,
      channels: ["push"],
      priority: "normal",
    },

    [SNAP_NOTIF.USER_TASK_POSTED]: {
      icon: "🚀",
      title: "Task Posted to Professionals!",
      body: `Your ${diagnosedIssue} task is live. Professionals in ${city} are now reviewing and will bid soon.`,
      cta_label: "View My Task →",
      cta_url: `/kemework/task/${taskId}`,
      channels: ["push"],
      priority: "normal",
    },

    [SNAP_NOTIF.USER_EMERGENCY_ALERT]: {
      icon: "🚨",
      title: "⚠️ Safety Alert — Action Required",
      body: `${safetyWarning}\nA professional has been notified of the urgency.`,
      cta_label: "View Emergency Task →",
      cta_url: `/kemework/task/${taskId}`,
      channels: ["push", "email"],
      priority: "high",
      email_subject: "⚠️ Safety Alert — Immediate Action Required",
    },

    [SNAP_NOTIF.USER_MATERIALS_CART]: {
      icon: "✅",
      title: null, // toast only
      body: `✅ ${cartCount} part${cartCount !== 1 ? "s" : ""} added to Kemetro cart!`,
      cta_label: "View Cart →",
      cta_url: "/kemetro/cart",
      channels: ["toast"],
      priority: "normal",
    },

    [SNAP_NOTIF.USER_SESSION_EXPIRING]: {
      icon: "⏰",
      title: null, // email only
      email_subject: "Your Snap & Fix diagnosis expires soon",
      body: `You diagnosed '${diagnosedIssue}' but haven't posted it yet. Your diagnosis expires in 12 hours. Sign up now to save it.`,
      cta_label: "Post My Task →",
      cta_url: `/kemework/snap/review/${sessionId}`,
      channels: ["email"],
      priority: "normal",
    },

    // ── PROFESSIONAL ──────────────────────────────────────────────
    [SNAP_NOTIF.PRO_NEW_AI_TASK]: {
      icon: "✨",
      title: `AI-Diagnosed Task — ${category}`,
      body: `${diagnosedIssue} in ${city}. Photo + technical scope available. ${urgencyLevel} urgency.`,
      cta_label: "View & Bid →",
      cta_url: `/kemework/task/${taskId}`,
      channels: ["push"],
      priority: "normal",
    },

    [SNAP_NOTIF.PRO_EMERGENCY_TASK]: {
      icon: "🚨",
      title: "⚡ Emergency Task — Respond Now",
      body: `${diagnosedIssue} in ${city}. Client needs immediate assistance.`,
      cta_label: "View Emergency Task →",
      cta_url: `/kemework/task/${taskId}`,
      channels: ["push"],
      priority: "high",
    },

    // ── ADMIN ─────────────────────────────────────────────────────
    [SNAP_NOTIF.ADMIN_EMERGENCY]: {
      icon: "🚨",
      title: "Emergency Snap & Fix Diagnosis",
      body: `Issue: ${diagnosedIssue}\nSafety Warning: ${safetyWarning}\nLocation: ${city} | User: ${userName}`,
      cta_label: "View Safety Log →",
      cta_url: "/admin/kemework/snap-fix/safety",
      channels: ["push", "email"],
      priority: "high",
      email_subject: "🚨 Emergency Snap & Fix — Admin Action Required",
    },
  };

  return templates[type] || null;
}

/**
 * Simple preview card for use in the admin settings UI.
 */
export function NotificationPreviewCard({ type, ctx }) {
  const notif = buildNotification(type, ctx);
  if (!notif) return null;

  const channelColors = { push: "bg-blue-50 text-blue-700", email: "bg-orange-50 text-orange-700", toast: "bg-green-50 text-green-700" };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
          {notif.icon}
        </div>
        <div className="flex-1 min-w-0">
          {notif.title && <p className="font-black text-gray-900 text-sm">{notif.title}</p>}
          {notif.email_subject && !notif.title && (
            <p className="font-black text-gray-900 text-sm">📧 {notif.email_subject}</p>
          )}
          <p className="text-xs text-gray-500 mt-1 leading-relaxed whitespace-pre-line">{notif.body}</p>
          {notif.cta_label && (
            <p className="text-xs font-bold text-teal-600 mt-2">{notif.cta_label}</p>
          )}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {notif.channels.map(ch => (
              <span key={ch} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${channelColors[ch]}`}>{ch}</span>
            ))}
            {notif.priority === "high" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">high priority</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default { buildNotification, SNAP_NOTIF, NotificationPreviewCard };