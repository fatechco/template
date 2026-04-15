import { NextRequest } from "next/server";
import { fracService } from "@/server/services/frac.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const { tokensAmount, paymentMethod } = await request.json();
    const tx = await fracService.purchaseTokens(id, session.userId, tokensAmount, paymentMethod);
    return successResponse(tx, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
