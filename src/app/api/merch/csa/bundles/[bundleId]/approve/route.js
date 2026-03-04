// PUT /api/merch/csa/bundles/:bundleId/approve
// TODO: Port from merchBundle.controller.js approveBundle()
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
