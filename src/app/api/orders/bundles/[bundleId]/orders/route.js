import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import MerchBundle from "@/models/MerchBundle";

export async function POST(request, { params }) {
  try {
    const { bundleId } = await params;
    const body = await request.json();
    const { studentBITSID, studentName, studentEmail, items } = body;

    // --- validation ---
    const errors = [];

    if (!studentBITSID || typeof studentBITSID !== "string" || studentBITSID.trim().length === 0 || studentBITSID.trim().length > 20) {
      errors.push({ field: "studentBITSID", message: "Student BITS ID is required (1-20 chars)" });
    }
    if (!studentName || typeof studentName !== "string" || studentName.trim().length === 0 || studentName.trim().length > 100) {
      errors.push({ field: "studentName", message: "Student name is required (1-100 chars)" });
    }
    if (!studentEmail || typeof studentEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      errors.push({ field: "studentEmail", message: "Valid student email is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      errors.push({ field: "items", message: "At least one item is required" });
    } else {
      items.forEach((item, i) => {
        if (!item.merchName || typeof item.merchName !== "string" || item.merchName.trim().length === 0) {
          errors.push({ field: `items[${i}].merchName`, message: "Merch name is required" });
        }
        if (!item.size) {
          errors.push({ field: `items[${i}].size`, message: "Size is required" });
        }
        if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
          errors.push({ field: `items[${i}].quantity`, message: "Quantity must be between 1 and 10" });
        }
        if (item.price === undefined || isNaN(Number(item.price)) || Number(item.price) < 0) {
          errors.push({ field: `items[${i}].price`, message: "Price must be a non-negative number" });
        }
      });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation errors", errors },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify the bundle is approved & visible
    const bundle = await MerchBundle.findOne({
      _id: bundleId,
      approvalStatus: "approved",
      visibility: true,
    });

    if (!bundle) {
      return NextResponse.json(
        { success: false, message: "Bundle not found or not available for ordering" },
        { status: 404 }
      );
    }

    // Check for duplicate order (compound unique index will also enforce this)
    const existingOrder = await Order.findOne({
      studentBITSID: studentBITSID.trim(),
      bundle: bundleId,
    });

    if (existingOrder) {
      return NextResponse.json(
        { success: false, message: "You have already placed an order for this bundle" },
        { status: 400 }
      );
    }

    // Validate each item exists in the bundle (merch items + combos)
    const bundleItemNames = bundle.merchItems.map((item) => item.name);
    const bundleComboNames = bundle.combos.map((combo) => combo.name);
    const validItemNames = [...bundleItemNames, ...bundleComboNames];

    for (const item of items) {
      if (!validItemNames.includes(item.merchName)) {
        return NextResponse.json(
          { success: false, message: `Invalid merch item: ${item.merchName}` },
          { status: 400 }
        );
      }
    }

    // Validate prices match the bundle and compute total
    let totalPrice = 0;
    for (const item of items) {
      const combo = bundle.combos.find((c) => c.name === item.merchName);
      if (combo) {
        if (item.price !== combo.comboPrice) {
          return NextResponse.json(
            { success: false, message: `Invalid price for combo: ${item.merchName}` },
            { status: 400 }
          );
        }
      } else {
        const bundleItem = bundle.merchItems.find((i) => i.name === item.merchName);
        if (!bundleItem) {
          return NextResponse.json(
            { success: false, message: `Invalid merch item: ${item.merchName}` },
            { status: 400 }
          );
        }
        if (item.price !== bundleItem.price) {
          return NextResponse.json(
            { success: false, message: `Invalid price for item: ${item.merchName}` },
            { status: 400 }
          );
        }
      }
      totalPrice += item.price * item.quantity;
    }

    const order = new Order({
      studentBITSID: studentBITSID.trim(),
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim().toLowerCase(),
      bundle: bundleId,
      items,
      totalPrice,
    });

    await order.save();

    return NextResponse.json(
      { success: true, message: "Order created successfully", data: { order } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while creating order" },
      { status: 500 }
    );
  }
}
