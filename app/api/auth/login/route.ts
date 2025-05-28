import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { comparePasswords, generateToken, setAuthCookie } from "@/lib/auth"
import { loginSchema } from "@/lib/validations/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    const { email, password } = validationResult.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await comparePasswords(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json({ error: "Please verify your email before logging in" }, { status: 403 })
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    })

    // Set auth cookie
    setAuthCookie(response, token)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
