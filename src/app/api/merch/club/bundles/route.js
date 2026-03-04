import { NextResponse } from "next/server";
import { authenticateRequest, authorizeRole } from "@/lib/auth";
import connectDB from "@/lib/db";
import MerchBundle from "@/models/MerchBundle";

export async function POST(request) {
  try {
    const user = await authenticateRequest(request);
    authorizeRole(user, "club");

    const body = await request.json();
    const { title, description, merchItems, sizeCharts = [], combos = [] } = body;

    // --- validation ---
    const errors = [];

    if (!title || typeof title !== "string" || title.trim().length === 0 || title.trim().length > 200) {
      errors.push({ field: "title", message: "Title is required and must be between 1 and 200 characters" });
    }
    if (description && (typeof description !== "string" || description.length > 1000)) {
      errors.push({ field: "description", message: "Description cannot exceed 1000 characters" });
    }
    if (!Array.isArray(merchItems) || merchItems.length === 0) {
      errors.push({ field: "merchItems", message: "At least one merch item is required" });
    } else {
      merchItems.forEach((item, i) => {
        if (!item.name || typeof item.name !== "string" || item.name.trim().length === 0 || item.name.trim().length > 100) {
          errors.push({ field: `merchItems[${i}].name`, message: "Merch item name is required (1-100 chars)" });
        }
        if (item.price === undefined || isNaN(Number(item.price)) || Number(item.price) < 0) {
          errors.push({ field: `merchItems[${i}].price`, message: "Merch item price must be a non-negative number" });
        }
        if (!item.image || typeof item.image !== "string") {
          errors.push({ field: `merchItems[${i}].image`, message: "Merch item image must be a valid URL" });
        }
        if (item.sizes !== undefined && !Array.isArray(item.sizes)) {
          errors.push({ field: `merchItems[${i}].sizes`, message: "Sizes must be an array" });
        }
      });
    }
    if (sizeCharts !== undefined && !Array.isArray(sizeCharts)) {
      errors.push({ field: "sizeCharts", message: "Size charts must be an array" });
    }
    if (combos !== undefined && !Array.isArray(combos)) {
      errors.push({ field: "combos", message: "Combos must be an array" });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation errors", errors },
        { status: 400 }
      );
    }

    await connectDB();

    const bundle = new MerchBundle({
      club: user._id,
      title: title.trim(),
      description: description?.trim() || "",
      merchItems,
      sizeCharts,
      combos,
    });

    await bundle.save();

    return NextResponse.json(
      { success: true, message: "Merch bundle created successfully", data: { bundle } },
      { status: 201 }
    );
  } catch (error) {
    if (error.message === "No token provided" || error.message === "Invalid token" || error.message === "User not found") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Access denied. Insufficient permissions.") {
      return NextResponse.json({ success: false, message: error.message }, { status: 403 });
    }
    console.error("Create bundle error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while creating merch bundle", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/merch/club/bundles — List current club's bundles (club only)
 */
export async function GET(request) {
  try {
    const user = await authenticateRequest(request);
    authorizeRole(user, "club");

    await connectDB();

    const bundles = await MerchBundle.find({ club: user._id })
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
    console.error("Get club bundles error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching club bundles" },
      { status: 500 }
    );
  }
}
