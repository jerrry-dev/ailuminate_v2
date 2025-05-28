import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyEmailSchema } from "@/lib/validations/auth"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validationResult = verifyEmailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    const { token } = validationResult.data

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Update user to verified and clear verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    })

    // Send welcome email
    await sendWelcomeEmail(user.email, user.username)

    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
