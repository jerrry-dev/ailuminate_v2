import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Hardcoded for development/testing. In production, use process.env.
const JWT_SECRET: Secret = "your_super_secret_key_1234567890";
const JWT_EXPIRES_IN = "7d";

// Interface for decoded JWT payload
interface DecodedToken {
  id: string;
  isAdmin?: boolean;
  [key: string]: any;
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare plain password with hashed password
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token with payload and expiration
export function generateToken(payload: string | object | Buffer): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

// Verify JWT token and return decoded payload or null
export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

// Set authentication cookie in the response
export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Clear authentication cookie from the response
export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

// Fetch current user from the request token cookie and database
export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !decoded.id) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user from DB:", error);
    return null;
  }
}

// Fetch current admin (with isAdmin check) from the request token cookie and database
export async function getCurrentAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !decoded.id || !decoded.isAdmin) return null;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });
    return admin;
  } catch (error) {
    console.error("Error fetching admin from DB:", error);
    return null;
  }
}

// Read auth token from cookies in server context
export function getAuthToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get("auth_token")?.value;
}

// Read admin token from cookies in server context
export function getAdminToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get("admin_token")?.value;
}
