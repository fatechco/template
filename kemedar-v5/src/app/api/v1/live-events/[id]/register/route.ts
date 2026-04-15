import { NextRequest } from "next/server";
import { liveEventRepository } from "@/server/repositories/live-event.repository";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const existing = await liveEventRepository.findRegistration(id, session.userId);
    if (existing) return errorResponse("Already registered", 400);
    const result = await liveEventRepository.createRegistration({
      event: { connect: { id } },
      user: { connect: { id: session.userId } },
    });
    return successResponse(result, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
