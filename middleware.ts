import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/write", "/profile", "/messages"]

  // Admin routes
  const adminRoutes = ["/admin/dashboard", "/admin"]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  if (isAdminRoute) {
    const adminToken = request.cookies.get("admin_token")?.value

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const decoded = verifyToken(adminToken)
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
