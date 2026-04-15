import { NextRequest } from "next/server";
import { communityService } from "@/server/services/community.service";
import { communityRepository } from "@/server/repositories/community.repository";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse, paginatedResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sp = request.nextUrl.searchParams;
    const result = await communityRepository.findPosts(id, { page: Number(sp.get("page")) || 1, pageSize: Number(sp.get("pageSize")) || 20 });
    return paginatedResponse(result.data, result.total, result.page, result.pageSize);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const body = await request.json();
    const post = await communityService.createPost(session.userId, id, body);
    return successResponse(post, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
