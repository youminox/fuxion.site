import { NextResponse, type NextRequest } from "next/server";

const SUPPORTED_COUNTRIES = new Set(["pe", "co", "us", "mx", "ec", "gt"]);
const COOKIE_NAME = "fx_country";

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const queryCountry = (
    searchParams.get("pais") ||
    searchParams.get("country") ||
    ""
  )
    .toLowerCase()
    .trim();

  const existingCookie = (request.cookies.get(COOKIE_NAME)?.value || "")
    .toLowerCase()
    .trim();

  // 1. Explicit URL parameter (?pais=co, ?pais=mx, etc.) overrides and persists
  if (SUPPORTED_COUNTRIES.has(queryCountry)) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, queryCountry, {
      path: "/",
      maxAge: 60 * 60 * 24 * 180, // 180 days
      sameSite: "lax",
    });
    return response;
  }

  // 2. If user already has a valid country cookie, keep it
  if (SUPPORTED_COUNTRIES.has(existingCookie)) {
    return NextResponse.next();
  }

  // 3. Auto-detect via CDN / Edge Geo-IP headers (Vercel, Cloudflare, AppEngine, AWS)
  const geoHeader = (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    request.headers.get("x-appengine-country") ||
    request.headers.get("cloudfront-viewer-country") ||
    ""
  )
    .toLowerCase()
    .trim();

  // Map Puerto Rico (PR) to US store
  const normalizedGeo = geoHeader === "pr" ? "us" : geoHeader;

  if (SUPPORTED_COUNTRIES.has(normalizedGeo)) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, normalizedGeo, {
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all public page routes, skip static assets and internal Next files
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|img/|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
