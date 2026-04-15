import { NextRequest } from "next/server";
import { adminService } from "@/server/services/admin.service";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const module = params.get("module");
    const locale = params.get("locale") || "en";

    if (!module) return errorResponse("Module parameter is required", 400);

    const translations = await adminService.getTranslations(module, locale);
    return successResponse(translations);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
