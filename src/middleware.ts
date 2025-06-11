import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Define paths that are always allowed
const PUBLIC_PATHS = [
    "/login",
  "/api/auth/login",
  "/api/auth/register",
  "/favicon.ico",
  "/_next",
  "/images",
  "/fonts",
  "/public",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    console.warn("[MIDDLEWARE] Invalid token", err);
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }
}