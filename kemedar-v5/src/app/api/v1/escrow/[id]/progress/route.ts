import { NextRequest } from "next/server";
import { escrowService } from "@/server/services/escrow.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const deal = await escrowService.progressMilestone(id, session.userId);
    return successResponse(deal);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
