import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MerchBundle from "@/models/MerchBundle";

/**
 * GET /api/store/bundles — Public list of approved + visible bundles
 * for the SWD student store. Optional ?club=<clubId> filter.
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("club");

    const query = {
      approvalStatus: "approved",
      visibility: true,
    };
    if (clubId) {
      query.club = clubId;
    }

    const bundles = await MerchBundle.find(query)
      .populate("club", "username clubName")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: { bundles },
    });
  } catch (error) {
    console.error("Get store bundles error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching bundles" },
      { status: 500 }
    );
  }
}
