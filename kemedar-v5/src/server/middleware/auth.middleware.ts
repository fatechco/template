import { NextRequest } from "next/server";
import { verifyToken, type JWTPayload } from "@/server/lib/auth";

export async function extractAuth(
  request: NextRequest
): Promise<JWTPayload | null> {
  // Try Bearer token first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return verifyToken(token);
  }

  // Try cookie
  const cookieToken = request.cookies.get("auth-token")?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}

export async function requireAuthMiddleware(
  request: NextRequest
): Promise<JWTPayload> {
  const session = await extractAuth(request);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRoleMiddleware(
  request: NextRequest,
  ...roles: string[]
): Promise<JWTPayload> {
  const session = await requireAuthMiddleware(request);
  if (!roles.includes(session.role)) {
    throw new Error("Forbidden");
  }
  return session;
}
