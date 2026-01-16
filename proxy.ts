import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes: Record<string, string[]> = {
  "/dashboard": ["user", "admin", "government_officer", "buyer", "investor"],
  "/dashboard/admin": ["admin"],
  "/dashboard/government": ["government_officer"],
  "/dashboard/buyer": ["buyer"],
  "/dashboard/investor": ["investor"],
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if it's a protected route
  const route = Object.keys(protectedRoutes).find((r) => pathname.startsWith(r))

  if (route) {
    // For now, just pass through - actual auth check would be done on client side
    // since this is a demo with localStorage
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
