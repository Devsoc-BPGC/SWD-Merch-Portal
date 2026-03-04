import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

/**
 * GET /api/orders/student/[studentBITSID] — Get all orders for a student (public)
 */
export async function GET(request, { params }) {
  try {
    const { studentBITSID } = await params;

    await connectDB();

    const orders = await Order.find({ studentBITSID })
      .populate({
        path: "bundle",
        select: "title description club",
        populate: { path: "club", select: "clubName" },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: { studentBITSID, orders },
    });
  } catch (error) {
    console.error("Get student orders error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching student orders" },
      { status: 500 }
    );
  }
}
