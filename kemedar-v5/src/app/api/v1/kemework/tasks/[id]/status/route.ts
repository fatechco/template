import { NextRequest } from "next/server";
import { kemeworkService } from "@/server/services/kemework.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const { status } = await request.json();
    const task = await kemeworkService.updateTaskStatus(id, session.userId, status);
    return successResponse(task);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
