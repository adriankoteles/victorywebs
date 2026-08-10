import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vyjmenované chráněné admin cesty
  const adminPaths = ["/dashboard", "/clients", "/projects", "/invoices"];
  
  const isProtectedPath = adminPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  if (isProtectedPath) {
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession || adminSession.value !== "authenticated") {
      // Pokud není přihlášen, přesměrovat na /login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
