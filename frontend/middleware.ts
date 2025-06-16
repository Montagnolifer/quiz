import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Simple middleware without authentication
  const res = NextResponse.next()

  // Allow all routes to pass through
  // Authentication will be handled client-side
  return res
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/editor/:path*", "/login", "/signup"],
}
