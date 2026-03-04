// GET /api/orders/club/bundles/:bundleId/orders
// TODO: Port from order.controller.js getBundleOrders()
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
