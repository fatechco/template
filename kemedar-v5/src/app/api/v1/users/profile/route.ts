import { NextRequest } from "next/server";
import { userRepository } from "@/server/repositories/user.repository";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const profile = await userRepository.findById(session.userId);
    return successResponse(profile);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const body = await request.json();
    const profile = await userRepository.update(session.userId, body);
    return successResponse(profile);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
