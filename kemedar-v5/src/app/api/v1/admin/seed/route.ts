import { NextRequest } from "next/server";
import { adminService } from "@/server/services/admin.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const result = await adminService.seedRBACData();
    return successResponse(result, 201);
  } catch (error: any) {
    return errorResponse(error.message, error.message === "Forbidden" ? 403 : 400);
  }
}
