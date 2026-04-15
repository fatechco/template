import { NextRequest } from "next/server";
import { userRepository } from "@/server/repositories/user.repository";
import { signToken } from "@/server/lib/auth";
import { errorResponse, successResponse } from "@/server/lib/api-response";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, nameAr, phone, role } = await request.json();
    if (!email || !password) return errorResponse("Email and password are required", 400);

    const existing = await userRepository.findByEmail(email);
    if (existing) return errorResponse("Email already registered", 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const allowedRoles = ["user", "agent", "developer", "product_seller", "kemetro_seller", "shipper", "kemework_professional"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    const user = await userRepository.create({
      email,
      passwordHash,
      name,
      nameAr,
      phone,
      role: userRole as any,
    });

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    return successResponse({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token }, 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
