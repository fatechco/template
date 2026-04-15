import { NextRequest } from "next/server";
import { propertyService } from "@/server/services/property.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const property = await propertyService.getById(id);
    return successResponse(property);
  } catch (error: any) {
    return errorResponse(error.message, error.message === "Property not found" ? 404 : 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const body = await request.json();
    const property = await propertyService.update(id, session.userId, body);
    return successResponse(property);
  } catch (error: any) {
    if (error.message === "Forbidden") return errorResponse(error.message, 403);
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    await propertyService.delete(id, session.userId);
    return successResponse({ deleted: true });
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
