import { conciergeService } from "@/server/services/concierge.service";

export async function runProcessConciergeNotifications() {
  console.log("[JOB] Processing concierge notifications...");
  const result = await conciergeService.processConciergeNotifications();
  console.log(`[JOB] Notified ${result.notified} tasks`);
  return result;
}
