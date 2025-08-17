// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-otp-password",
];

const PUBLIC_FILE =
  /\.(?:png|jpe?g|gif|webp|svg|ico|bmp|avif|mp3|wav|ogg|mp4|webm|txt|xml|json|js|css|map|woff2?|ttf|eot)$/i;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sw99_token")?.value;
  const { pathname } = request.nextUrl;

  // Always allow static/public assets
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") || // serve /public/images/**
    pathname.startsWith("/assets") || // serve /public/assets/**
    pathname.startsWith("/icons") || // serve /public/icons/**
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.endsWith(".webmanifest") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!token && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // exclude Next internals and any path that looks like a file (has a dot)
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)",
  ],
};
