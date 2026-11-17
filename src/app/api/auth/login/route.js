import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

async function readLoginBody(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();

  if (contentType.includes("application/json")) {
    try {
      return await request.json();
    } catch {
      return null;
    }
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    try {
      const form = await request.formData();
      return {
        username: form.get("username"),
        password: form.get("password"),
      };
    } catch {
      return null;
    }
  }

  // Unknown / missing content-type: try JSON then form
  try {
    const text = await request.text();
    if (!text || !text.trim()) return null;
    try {
      return JSON.parse(text);
    } catch {
      const params = new URLSearchParams(text);
      if (params.has("username") || params.has("password")) {
        return {
          username: params.get("username"),
          password: params.get("password"),
        };
      }
      return null;
    }
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await readLoginBody(request);
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid login body. Send JSON or form fields: username, password" },
        { status: 400 }
      );
    }

    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateToken(user._id, user.username, user.role, user.clubName);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: { user: user.toJSON(), token },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during login" },
      { status: 500 }
    );
  }
}
