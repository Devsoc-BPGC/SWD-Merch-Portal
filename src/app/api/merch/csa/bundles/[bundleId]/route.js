import { NextResponse } from "next/server";
import { authenticateRequest, authorizeRole } from "@/lib/auth";
import connectDB from "@/lib/db";
import MerchBundle from "@/models/MerchBundle";

export async function PUT(request, { params }) {
  try {
    const user = await authenticateRequest(request);
    authorizeRole(user, "csa");

    const { bundleId } = await params;
    const updateData = await request.json();

    // --- validation ---
    const errors = [];

    if (updateData.title !== undefined) {
      if (typeof updateData.title !== "string" || updateData.title.trim().length === 0 || updateData.title.trim().length > 200) {
        errors.push({ field: "title", message: "Title must be between 1 and 200 characters" });
      }
    }
    if (updateData.description !== undefined) {
      if (typeof updateData.description !== "string" || updateData.description.length > 1000) {
        errors.push({ field: "description", message: "Description cannot exceed 1000 characters" });
      }
    }
    if (updateData.merchItems !== undefined) {
      if (!Array.isArray(updateData.merchItems) || updateData.merchItems.length === 0) {
        errors.push({ field: "merchItems", message: "At least one merch item is required" });
      } else {
        updateData.merchItems.forEach((item, i) => {
          if (item.name !== undefined && (typeof item.name !== "string" || item.name.trim().length === 0 || item.name.trim().length > 100)) {
            errors.push({ field: `merchItems[${i}].name`, message: "Merch item name must be between 1 and 100 characters" });
          }
          if (item.price !== undefined && (isNaN(Number(item.price)) || Number(item.price) < 0)) {
            errors.push({ field: `merchItems[${i}].price`, message: "Merch item price must be a non-negative number" });
          }
          if (item.image !== undefined && typeof item.image !== "string") {
            errors.push({ field: `merchItems[${i}].image`, message: "Merch item image must be a valid URL" });
          }
          if (item.sizes !== undefined && !Array.isArray(item.sizes)) {
            errors.push({ field: `merchItems[${i}].sizes`, message: "Sizes must be an array" });
          }
        });
      }
    }
    if (updateData.sizeCharts !== undefined && !Array.isArray(updateData.sizeCharts)) {
      errors.push({ field: "sizeCharts", message: "Size charts must be an array" });
    }
    if (updateData.combos !== undefined && !Array.isArray(updateData.combos)) {
      errors.push({ field: "combos", message: "Combos must be an array" });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation errors", errors },
        { status: 400 }
      );
    }

    await connectDB();

    const bundle = await MerchBundle.findById(bundleId)
      .populate("club", "username clubName")
      .populate("approvedBy", "username");

    if (!bundle) {
      return NextResponse.json(
        { success: false, message: "Bundle not found" },
        { status: 404 }
      );
    }

    // Validate combo items reference existing merch items
    if (updateData.combos && updateData.combos.length > 0) {
      const currentMerchItems = updateData.merchItems || bundle.merchItems;
      const itemNames = currentMerchItems.map((item) => item.name);

      for (const combo of updateData.combos) {
        for (const itemName of combo.items) {
          if (!itemNames.includes(itemName)) {
            return NextResponse.json(
              {
                success: false,
                message: `Combo "${combo.name}" contains item "${itemName}" that doesn't exist in merch items`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    // Only update allowed fields
    const allowedFields = ["title", "description", "merchItems", "sizeCharts", "combos"];
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        bundle[field] = updateData[field];
      }
    }

    await bundle.save();

    return NextResponse.json({
      success: true,
      message: "Bundle updated successfully",
      data: { bundle },
    });
  } catch (error) {
    if (error.message === "No token provided" || error.message === "Invalid token" || error.message === "User not found") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Access denied. Insufficient permissions.") {
      return NextResponse.json({ success: false, message: error.message }, { status: 403 });
    }
    console.error("Update bundle error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while updating bundle", error: error.message },
      { status: 500 }
    );
  }
}
