import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password, role, clubName } = await request.json();

    // Validation
    const errors = [];
    if (!username || username.length < 3 || username.length > 30) {
      errors.push("Username must be between 3 and 30 characters");
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push("Username can only contain letters, numbers, and underscores");
    }
    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!role || !["csa", "club"].includes(role)) {
      errors.push('Role must be either "csa" or "club"');
    }
    if (role === "club" && !clubName) {
      errors.push("Club name is required for club role");
    }
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation errors", errors },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this username already exists" },
        { status: 400 }
      );
    }

    const userData = { username, password, role };
    if (role === "club") {
      userData.clubName = clubName;
    }

    const user = new User(userData);
    await user.save();

    const token = generateToken(user._id, user.username, user.role, user.clubName);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: { user: user.toJSON(), token },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during registration" },
      { status: 500 }
    );
  }
}
