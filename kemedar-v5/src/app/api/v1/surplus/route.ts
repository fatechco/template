import { NextRequest } from "next/server";
import { surplusService } from "@/server/services/surplus.service";
import { surplusRepository } from "@/server/repositories/surplus.repository";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse, paginatedResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const result = await surplusRepository.findItems(
      {
        category: params.get("categoryId") || undefined,
        isActive: true,
      },
      {
        page: Number(params.get("page")) || 1,
        pageSize: Number(params.get("pageSize")) || 20,
      }
    );
    return paginatedResponse(result.data, result.total, result.page, result.pageSize);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const body = await request.json();
    const item = await surplusService.publishItem(session.userId, body);
    return successResponse(item, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
