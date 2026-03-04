// GET /api/auth/clubs
// TODO: Port from auth.controller.js getClubs()
import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
