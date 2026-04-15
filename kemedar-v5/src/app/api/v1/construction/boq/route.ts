import { NextRequest } from "next/server";
import { constructionService } from "@/server/services/construction.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const body = await request.json();
    const boq = await constructionService.generateBOQ(body);
    return successResponse(boq, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
