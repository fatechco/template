import { NextRequest } from "next/server";
import { adminRepository } from "@/server/repositories/admin.repository";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse, paginatedResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const params = request.nextUrl.searchParams;
    const result = await adminRepository.findUsers(
      {
        search: params.get("search") || undefined,
        role: params.get("role") || undefined,
        isActive: params.get("status") ? params.get("status") === "active" : undefined,
      },
      {
        page: Number(params.get("page")) || 1,
        pageSize: Number(params.get("pageSize")) || 20,
      }
    );
    return paginatedResponse(result.data, result.total, result.page, result.pageSize);
  } catch (error: any) {
    return errorResponse(error.message, error.message === "Forbidden" ? 403 : 500);
  }
}
