import { base44 } from "@/api/base44Client";

const STORAGE_KEY = "snap_session_token";

/**
 * Save snap session token to localStorage for guest recovery
 */
export function saveSnapSessionToken(sessionToken) {
  try {
    localStorage.setItem(STORAGE_KEY, sessionToken);
  } catch { /* silent */ }
}

/**
 * Clear saved snap session token
 */
export function clearSnapSessionToken() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* silent */ }
}

/**
 * Get saved snap session token
 */
export function getSavedSnapSessionToken() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Called after login/register to recover and link a guest Snap & Fix session.
 * Returns the recovered session or null.
 */
export async function recoverSnapSession(user) {
  const token = getSavedSnapSessionToken();
  if (!token || !user?.id) return null;

  try {
    const sessions = await base44.entities.SnapSession.filter({
      sessionToken: token,
      status: "completed",
    }, "-created_date", 1);

    const session = sessions?.find(s => !s.userId);
    if (!session) return null;

    // Link session to user
    await base44.entities.SnapSession.update(session.id, { userId: user.id });
    clearSnapSessionToken();
    return session;
  } catch {
    return null;
  }
}