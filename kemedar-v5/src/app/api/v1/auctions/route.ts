import { NextRequest } from "next/server";
import { auctionService } from "@/server/services/auction.service";
import { auctionRepository } from "@/server/repositories/auction.repository";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse, paginatedResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const result = await auctionRepository.findMany(
      { status: params.get("status") || undefined },
      { page: Number(params.get("page")) || 1, pageSize: Number(params.get("pageSize")) || 20 }
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
    const auction = await auctionService.createAuction(session.userId, {
      ...body,
      auctionStartAt: new Date(body.auctionStartAt),
      auctionEndAt: new Date(body.auctionEndAt),
    });
    return successResponse(auction, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
