import { NextResponse } from "next/server";
import { authenticateRequest, authorizeRole } from "@/lib/auth";
import connectDB from "@/lib/db";
import MerchBundle from "@/models/MerchBundle";

export async function PUT(request, { params }) {
  try {
    const user = await authenticateRequest(request);
    authorizeRole(user, "csa");

    const { bundleId } = await params;

    await connectDB();

    const bundle = await MerchBundle.findById(bundleId)
      .populate("club", "username clubName");

    if (!bundle) {
      return NextResponse.json(
        { success: false, message: "Bundle not found" },
        { status: 404 }
      );
    }

    if (bundle.approvalStatus !== "approved") {
      return NextResponse.json(
        { success: false, message: "Cannot toggle visibility for non-approved bundles" },
        { status: 400 }
      );
    }

    await bundle.toggleVisibility();

    return NextResponse.json({
      success: true,
      message: `Bundle ${bundle.visibility ? "made visible" : "hidden"} successfully`,
      data: { bundle },
    });
  } catch (error) {
    if (error.message === "No token provided" || error.message === "Invalid token" || error.message === "User not found") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Access denied. Insufficient permissions.") {
      return NextResponse.json({ success: false, message: error.message }, { status: 403 });
    }
    console.error("Toggle bundle visibility error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while toggling bundle visibility" },
      { status: 500 }
    );
  }
}
