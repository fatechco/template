import { NextRequest } from "next/server";
import { kemekitService } from "@/server/services/kemekit.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const body = await request.json();
    const result = await kemekitService.calculateBOQ(body);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
