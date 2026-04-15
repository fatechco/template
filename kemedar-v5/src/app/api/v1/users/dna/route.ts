import { NextRequest } from "next/server";
import { dnaService } from "@/server/services/dna.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const dna = await dnaService.getMyDNA(session.userId);
    return successResponse(dna);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
