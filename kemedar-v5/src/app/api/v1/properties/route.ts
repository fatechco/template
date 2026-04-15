import { NextRequest } from "next/server";
import { propertyService } from "@/server/services/property.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse, paginatedResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const filters = {
      categoryId: params.get("categoryId") || undefined,
      purposeId: params.get("purposeId") || undefined,
      cityId: params.get("cityId") || undefined,
      districtId: params.get("districtId") || undefined,
      minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
      maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
      isFeatured: params.get("isFeatured") === "true" ? true : undefined,
      isVerified: params.get("isVerified") === "true" ? true : undefined,
      isActive: params.get("isActive") !== "false",
      isImported: params.get("isImported") === "true" ? true : undefined,
      importStatus: params.get("importStatus") || undefined,
      userId: params.get("userId") || undefined,
      search: params.get("search") || undefined,
      tags: params.get("tags")?.split(",") || undefined,
      isAuction: params.get("isAuction") === "true" ? true : undefined,
      isFracOffering: params.get("isFracOffering") === "true" ? true : undefined,
      isOpenToSwap: params.get("isOpenToSwap") === "true" ? true : undefined,
    };
    const pagination = {
      page: Number(params.get("page")) || 1,
      pageSize: Number(params.get("pageSize")) || 20,
      sortBy: params.get("sortBy") || undefined,
      sortOrder: (params.get("sortOrder") as "asc" | "desc") || undefined,
    };

    const result = await propertyService.search(filters, pagination);
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
    const property = await propertyService.create(session.userId, body);
    return successResponse(property, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
