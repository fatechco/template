import { NextRequest } from "next/server";
import { crmService } from "@/server/services/crm.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse, paginatedResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const params = request.nextUrl.searchParams;
    const result = await crmService.listOpportunities(
      {
        stage: params.get("stage") || undefined,
        contactId: params.get("contactId") || undefined,
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
    const opportunity = await crmService.createOpportunity(body);
    return successResponse(opportunity, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
