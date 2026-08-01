import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/sprzedaz", "/start", "/admin", "/app", "/zamowienie"];
const protectedApiPrefixes = ["/api/admin", "/api/sales/checkout", "/api/sales/instances"];
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 90;

export function middleware(request: NextRequest) {
  const password = process.env.INTERNAL_TOOLS_PASSWORD;
  const pathname = request.nextUrl.pathname;
  const shouldProtect = Boolean(password) && isProtectedPath(pathname);
  const rateLimited = applyRateLimit(request);

  if (rateLimited) return rateLimited;

  if (!shouldProtect) return NextResponse.next();

  const auth = request.headers.get("authorization");
  const expected = `Basic ${btoa(`admin:${password}`)}`;

  if (auth === expected) return NextResponse.next();

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Nasze Wesele"',
    },
  });
}

function applyRateLimit(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const shouldLimit = pathname.startsWith("/api/") || protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!shouldLimit) return null;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const key = `${ip}:${pathname.split("/").slice(0, 3).join("/")}`;
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  current.count += 1;
  if (current.count <= RATE_LIMIT_MAX) return null;

  return NextResponse.json(
    { error: "Za duzo prob. Sprobuj ponownie za chwile." },
    { status: 429, headers: { "Retry-After": Math.ceil((current.resetAt - now) / 1000).toString() } }
  );
}

function isProtectedPath(pathname: string) {
  return [...protectedPrefixes, ...protectedApiPrefixes].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export const config = {
  matcher: ["/sprzedaz/:path*", "/start/:path*", "/admin/:path*", "/api/:path*"],
};
