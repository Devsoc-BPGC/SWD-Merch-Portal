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
    return NextResponse.json(
      { success: false, message: error.message || "Invalid or expired token" },
      { status: 401 }
    );
  }
}
