import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/db";

/**
 * Generate a JWT token for a user.
 */
export function generateToken(userId, username, role, clubName = null) {
  const payload = {
    userId,
    username,
    role,
    ...(clubName && { clubName }),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

/**
 * Verify a JWT token and return the decoded payload.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

/**
 * Extract Bearer token from Authorization header string.
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }
  return authHeader.substring(7);
}

/**
 * Authenticate a Next.js request — extracts Bearer token, verifies JWT,
 * fetches the user from MongoDB, and returns the user document.
 * Throws on failure (caller should catch and return 401).
 */
export async function authenticateRequest(request) {
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);
  const decoded = verifyToken(token);

  await connectDB();
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Check if a user has one of the allowed roles.
 * Throws on failure (caller should catch and return 403).
 */
export function authorizeRole(user, ...roles) {
  if (!roles.includes(user.role)) {
    throw new Error("Access denied. Insufficient permissions.");
  }
}
