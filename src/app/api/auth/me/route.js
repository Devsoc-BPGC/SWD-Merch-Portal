import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await authenticateRequest(request);

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    const authErrors = ["No token provided", "Invalid or expired token", "User not found"];
    const isAuthError = authErrors.some((msg) => error.message?.includes(msg));
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
