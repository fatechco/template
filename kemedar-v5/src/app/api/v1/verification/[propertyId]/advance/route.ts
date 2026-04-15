import { NextRequest } from "next/server";
import { verificationService } from "@/server/services/verification.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ propertyId: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { propertyId } = await params;
    const body = await request.json();
    const result = await verificationService.advanceLevel(propertyId, session.userId, body);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
