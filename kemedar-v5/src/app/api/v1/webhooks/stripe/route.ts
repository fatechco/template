import { NextRequest } from "next/server";
import { constructWebhookEvent } from "@/server/lib/stripe-client";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) return errorResponse("Missing stripe-signature header", 400);

    const event = await constructWebhookEvent(body, signature);

    // Handle event types
    switch (event.type) {
      case "checkout.session.completed":
        // TODO: Activate subscription
        break;
      case "invoice.paid":
        // TODO: Record payment
        break;
      case "customer.subscription.deleted":
        // TODO: Cancel subscription
        break;
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return successResponse({ received: true });
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
