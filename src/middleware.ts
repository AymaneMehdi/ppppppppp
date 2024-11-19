import { NextResponse } from "next/server";
import { auth } from "./auth";

export const middleware = auth(async function middleware(req) {
  const user = req.auth?.user;

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!user || user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
