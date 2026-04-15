import { NextRequest } from "next/server";
import { subscriptionService } from "@/server/services/subscription.service";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const plans = await subscriptionService.listPlans();
    return successResponse(plans);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
