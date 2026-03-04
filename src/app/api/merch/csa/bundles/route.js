import { NextResponse } from "next/server";
import { authenticateRequest, authorizeRole } from "@/lib/auth";
import connectDB from "@/lib/db";
import MerchBundle from "@/models/MerchBundle";

export async function GET(request) {
  try {
    const user = await authenticateRequest(request);
    authorizeRole(user, "csa");

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = {};
    if (status) {
      query.approvalStatus = status;
    }

    const bundles = await MerchBundle.find(query)
      .populate("club", "username clubName")
      .populate("approvedBy", "username")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: { bundles } });
  } catch (error) {
    if (error.message === "No token provided" || error.message === "Invalid token" || error.message === "User not found") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Access denied. Insufficient permissions.") {
      return NextResponse.json({ success: false, message: error.message }, { status: 403 });
    }
    console.error("Get all bundles error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching bundles" },
      { status: 500 }
    );
  }
}
