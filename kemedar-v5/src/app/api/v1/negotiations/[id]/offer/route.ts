import { NextRequest } from "next/server";
import { negotiationService } from "@/server/services/negotiation.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const body = await request.json();
    const offer = await negotiationService.submitOffer(id, session.userId, body);
    return successResponse(offer, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
