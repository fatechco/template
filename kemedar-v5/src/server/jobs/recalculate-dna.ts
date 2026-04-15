import { dnaService } from "@/server/services/dna.service";

export async function runRecalculateAllDNA() {
  console.log("[JOB] Running DNA recalculation for all users...");
  const result = await dnaService.recalculateAllDNA();
  console.log(`[JOB] Updated ${result.updated}/${result.total} users`);
  return result;
}
