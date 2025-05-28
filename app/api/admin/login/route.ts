import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { comparePasswords, generateToken } from "@/lib/auth"
import { adminLoginSchema } from "@/lib/validations/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validationResult = adminLoginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    const { email, password } = validationResult.data

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await comparePasswords(password, admin.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      isAdmin: true,
    })

    // Create response
    const response = NextResponse.json({
      message: "Admin login successful",
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        avatar: admin.avatar,
      },
    })

    // Set admin auth cookie
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
