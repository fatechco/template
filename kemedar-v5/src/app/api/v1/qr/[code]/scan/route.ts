import { NextRequest } from "next/server";
import { qrService } from "@/server/services/qr.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { code } = await params;
    const result = await qrService.handleQRScan(code, { userId: session.userId });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
