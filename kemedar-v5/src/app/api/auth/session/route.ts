import { NextRequest } from "next/server";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { userRepository } from "@/server/repositories/user.repository";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Not authenticated", 401);
    const user = await userRepository.findById(session.userId);
    if (!user) return errorResponse("User not found", 404);
    return successResponse({ id: user.id, email: user.email, name: user.name, nameAr: user.nameAr, role: user.role, avatarUrl: user.avatarUrl, isVerified: user.isVerified });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
