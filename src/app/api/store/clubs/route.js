import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import MerchBundle from "@/models/MerchBundle";

/**
 * GET /api/store/clubs — Public list of clubs that currently have
 * at least one approved + visible merch bundle (for SWD student store).
 */
export async function GET() {
  try {
    await connectDB();

    const liveClubIds = await MerchBundle.distinct("club", {
      approvalStatus: "approved",
      visibility: true,
    });

    const clubs = await User.find({
      role: "club",
      _id: { $in: liveClubIds },
    }).select("username clubName createdAt updatedAt");

    return NextResponse.json({
      success: true,
      data: { clubs },
    });
  } catch (error) {
    console.error("Get store clubs error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching clubs" },
      { status: 500 }
    );
  }
}
