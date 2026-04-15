import { NextRequest } from "next/server";
import { swapService } from "@/server/services/swap.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const result = await swapService.expressInterest(id, session.userId);
    return successResponse(result, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
