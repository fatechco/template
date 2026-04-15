import { NextRequest } from "next/server";
import { crmService } from "@/server/services/crm.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const contact = await crmService.getContact(id);
    return successResponse(contact);
  } catch (error: any) {
    return errorResponse(error.message, error.message === "Contact not found" ? 404 : 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    const body = await request.json();
    const contact = await crmService.updateContact(id, body);
    return successResponse(contact);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { id } = await params;
    await crmService.deleteContact(id);
    return successResponse({ deleted: true });
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
