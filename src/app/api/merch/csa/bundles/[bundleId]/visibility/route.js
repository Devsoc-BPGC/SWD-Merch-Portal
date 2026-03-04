// PUT /api/merch/csa/bundles/:bundleId/visibility
// TODO: Port from merchBundle.controller.js toggleVisibility()
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
