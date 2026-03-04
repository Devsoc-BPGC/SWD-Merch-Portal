import { NextResponse } from "next/server";
import { authenticateRequest, authorizeRole } from "@/lib/auth";
import connectDB from "@/lib/db";
import MerchBundle from "@/models/MerchBundle";

export async function PUT(request, { params }) {
  try {
    const user = await authenticateRequest(request);
    authorizeRole(user, "csa");

    const { bundleId } = await params;

    let visibility = true;
    try {
      const body = await request.json();
      if (body.visibility !== undefined) {
        visibility = body.visibility;
      }
    } catch {
      // body may be empty — default visibility = true
    }

    await connectDB();

    const bundle = await MerchBundle.findById(bundleId)
      .populate("club", "username clubName");

    if (!bundle) {
      return NextResponse.json(
        { success: false, message: "Bundle not found" },
        { status: 404 }
      );
    }

    if (bundle.approvalStatus !== "pending") {
      return NextResponse.json(
        { success: false, message: "Bundle is not in pending status" },
        { status: 400 }
      );
    }

    await bundle.approve(user._id);

    if (visibility !== undefined) {
      bundle.visibility = visibility;
      await bundle.save();
    }

    return NextResponse.json({
      success: true,
      message: "Bundle approved successfully",
      data: { bundle },
    });
  } catch (error) {
    if (error.message === "No token provided" || error.message === "Invalid token" || error.message === "User not found") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Access denied. Insufficient permissions.") {
      return NextResponse.json({ success: false, message: error.message }, { status: 403 });
    }
    console.error("Approve bundle error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while approving bundle" },
      { status: 500 }
    );
  }
}
