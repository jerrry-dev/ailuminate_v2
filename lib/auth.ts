import type { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = (process.env.JWT_SECRET || "morismr") as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: string | object | Buffer): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).id },
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
    return null;
  }
}

export async function getCurrentAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== "object" || !("id" in decoded) || !(decoded as any).isAdmin) {
      return null;
    }

    const admin = await prisma.admin.findUnique({
      where: { id: (decoded as any).id },
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
    return null;
  }
}

export function getAuthToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get("auth_token")?.value;
}

export function getAdminToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get("admin_token")?.value;
}
