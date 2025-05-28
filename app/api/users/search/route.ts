import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json({ users: [] })
    }

    // Search users
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
        id: { not: user.id }, // Exclude current user
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
      },
      take: limit,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Search users error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
