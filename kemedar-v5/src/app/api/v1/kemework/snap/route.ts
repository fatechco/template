import { NextRequest } from "next/server";
import { kemeworkService } from "@/server/services/kemework.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const body = await request.json();
    const result = await kemeworkService.processSnapAndFix(session.userId, body);
    return successResponse(result, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
