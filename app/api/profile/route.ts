import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().max(50, { message: "Name must be less than 50 characters" }).optional(),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional(),
  avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional(),
})

// GET user profile
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user with additional info
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// PUT update profile
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const validationResult = updateProfileSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    const { name, bio, avatar } = validationResult.data

    // Update profile
    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
