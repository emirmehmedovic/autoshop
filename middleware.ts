import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Edge-compatible middleware without importing auth config
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for session token (NextAuth JWT)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  const isLoggedIn = !!sessionToken

  // For admin routes, we need to check the token payload
  // But since we can't decode JWT in Edge without adding jwt library,
  // we'll redirect to login and let the page itself check the role
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
    // Let the page handle role checking (it will use auth() which works in server components)
    return NextResponse.next()
  }

  // For account routes
  if (pathname.startsWith("/account")) {
    if (!isLoggedIn) {
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
}
