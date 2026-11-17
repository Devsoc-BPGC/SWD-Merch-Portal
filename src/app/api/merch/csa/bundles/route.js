import { NextResponse } from "next/server";
import { authenticateRequest, authorizeRole } from "@/lib/auth";
import connectDB from "@/lib/db";
import MerchBundle from "@/models/MerchBundle";

/**
 * GET /api/merch/csa/bundles
 * - CSA (authenticated): full list, optional ?status= filter
 * - Unauthenticated / invalid token: approved + visible only (SWD store)
 */
export async function GET(request) {
  try {
    await connectDB();

    let isCsa = false;
    try {
      const user = await authenticateRequest(request);
      authorizeRole(user, "csa");
      isCsa = true;
    } catch {
      isCsa = false;
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = {};
    if (isCsa) {
      if (status) {
        query.approvalStatus = status;
      }
    } else {
      query.approvalStatus = "approved";
      query.visibility = true;
    }

    const bundles = await MerchBundle.find(query)
      .populate("club", "username clubName")
      .populate("approvedBy", "username")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: { bundles } });
  } catch (error) {
    console.error("Get all bundles error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching bundles" },
      { status: 500 }
    );
  }
}
