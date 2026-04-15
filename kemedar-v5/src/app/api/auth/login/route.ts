import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/server/repositories/user.repository";
import { signToken } from "@/server/lib/auth";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return errorResponse("Email and password are required", 400);

    const user = await userRepository.findByEmail(email);
    if (!user || !user.passwordHash) return errorResponse("Invalid credentials", 401);
    if (!user.isActive) return errorResponse("Account is disabled", 403);

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return errorResponse("Invalid credentials", 401);

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    await userRepository.update(user.id, { lastLoginAt: new Date() });

    const response = NextResponse.json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl }, token } });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
