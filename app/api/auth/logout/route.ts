import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" })
    clearAuthCookie(response)
    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
