// POST /api/orders/bundles/:bundleId/orders
// TODO: Port from order.controller.js createOrder()
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
