import { surplusService } from "@/server/services/surplus.service";

export async function runAutoExpireReservations() {
  console.log("[JOB] Running auto-expire surplus reservations...");
  const result = await surplusService.autoExpireReservations();
  console.log(`[JOB] Expired ${result.processed} reservations`);
  return result;
}
