import { NextRequest } from "next/server";
import { qrService } from "@/server/services/qr.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const result = await qrService.getUserQRCodes(session.userId);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const body = await request.json();
    const qrCode = await qrService.generateQRCode(session.userId, body);
    return successResponse(qrCode, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
