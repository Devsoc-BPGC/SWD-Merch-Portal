import { NextResponse } from "next/server";
import { authenticateRequest, authorizeRole } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import MerchBundle from "@/models/MerchBundle";

/**
 * Helper: recalculate total from items + combos (mirrors Express calculateOrderTotal)
 */
function calculateOrderTotal(orderObj) {
  const items = Array.isArray(orderObj.items) ? orderObj.items : [];
  const combos = Array.isArray(orderObj.combos) ? orderObj.combos : [];

  const itemTotal = items.reduce((acc, item) => acc + (item.total || 0), 0);
  const comboTotal = combos.reduce((acc, combo) => {
    const qty = combo.quantity || 1;
    return acc + (combo.price || 0) * qty;
  }, 0);

  return itemTotal + comboTotal;
}

/**
 * GET /api/orders/club/bundles/[bundleId]/orders — Get orders for a club's bundle (club only)
 */
export async function GET(request, { params }) {
  try {
    const user = await authenticateRequest(request);
    authorizeRole(user, "club");

    const { bundleId } = await params;

    await connectDB();

    // Verify the bundle belongs to this club
    const bundle = await MerchBundle.findOne({
      _id: bundleId,
      club: user._id,
    });

    if (!bundle) {
      return NextResponse.json(
        { success: false, message: "Bundle not found or you do not have access to it" },
        { status: 404 }
      );
    }

    const orders = await Order.find({ bundle: bundleId }).sort({ createdAt: -1 });

    // Recalculate totals to handle any legacy data
    const ordersWithFixedTotal = orders.map((order) => {
      const serialized = order.toObject();
      serialized.totalPrice = calculateOrderTotal(serialized);
      return serialized;
    });

    return NextResponse.json({
      success: true,
      data: {
        bundle: {
          _id: bundle._id,
          title: bundle.title,
          description: bundle.description,
        },
        orders: ordersWithFixedTotal,
      },
    });
  } catch (error) {
    if (error.message === "No token provided" || error.message === "Invalid token" || error.message === "User not found") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Access denied. Insufficient permissions.") {
      return NextResponse.json({ success: false, message: error.message }, { status: 403 });
    }
    console.error("Get bundle orders error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching bundle orders" },
      { status: 500 }
    );
  }
}
