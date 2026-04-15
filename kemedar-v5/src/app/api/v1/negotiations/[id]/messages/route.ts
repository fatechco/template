import { NextRequest } from "next/server";
import { negotiationService } from "@/server/services/negotiation.service";
import { negotiationRepository } from "@/server/repositories/negotiation.repository";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const messages = await negotiationRepository.findMessages(id);
    return successResponse(messages);
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
    const message = await negotiationService.sendMessage(id, session.userId, body.content, body.contentAr);
    return successResponse(message, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
