import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { authenticateRequest, authorizeRole } from "@/lib/auth";

/**
 * GET /api/auth/clubs
 * - CSA (authenticated): full club list
 * - Unauthenticated / invalid token: same public club list (no passwords)
 *   so SWD student store can load clubs even if its service JWT is stale.
 */
export async function GET(request) {
  try {
    await connectDB();

    // Prefer CSA auth when present; fall through to public list otherwise.
    try {
      const user = await authenticateRequest(request);
      authorizeRole(user, "csa");
    } catch {
      // public read allowed
    }

    const clubs = await User.find({ role: "club" }).select("-password");

    return NextResponse.json({
      success: true,
      data: { clubs },
    });
  } catch (error) {
    console.error("Get clubs error:", error);

    return NextResponse.json(
      { success: false, message: "Server error while fetching clubs" },
      { status: 500 }
    );
  }
}
