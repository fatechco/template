import { NextRequest } from "next/server";
import { adminRepository } from "@/server/repositories/admin.repository";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const params = request.nextUrl.searchParams;
    const role = params.get("role");
    if (!role) return errorResponse("Role parameter is required", 400);
    const permissions = await adminRepository.findPermissions(role);
    return successResponse(permissions);
  } catch (error: any) {
    return errorResponse(error.message, error.message === "Forbidden" ? 403 : 500);
  }
}
