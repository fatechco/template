import { NextRequest } from "next/server";
import { verificationService } from "@/server/services/verification.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ propertyId: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { propertyId } = await params;
    const certificate = await verificationService.issueCertificate(propertyId, session.userId);
    return successResponse(certificate);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
