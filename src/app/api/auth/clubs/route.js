import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { authenticateRequest, authorizeRole } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await authenticateRequest(request);
    authorizeRole(user, "csa");

    await connectDB();
    const clubs = await User.find({ role: "club" }).select("-password");

    return NextResponse.json({
      success: true,
      data: { clubs },
    });
  } catch (error) {
    console.error("Get clubs error:", error);

    if (error.message === "Access denied. Insufficient permissions.") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 403 }
      );
    }

    if (
      error.message === "No token provided" ||
      error.message === "Invalid token" ||
      error.message === "User not found"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error while fetching clubs" },
      { status: 500 }
    );
  }
}
