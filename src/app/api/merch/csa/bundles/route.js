// GET all bundles (CSA)
// TODO: Port from merchBundle.controller.js getAllBundles()
import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
