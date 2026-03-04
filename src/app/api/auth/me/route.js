// GET /api/auth/me
// TODO: Port from auth.controller.js getMe()
import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
