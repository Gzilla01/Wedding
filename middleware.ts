import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/admin"];
const protectedApiPrefixes = ["/api/admin"];
const sessionCookieName = "wedding_admin_session";
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 90;

export async function middleware(request: NextRequest) {
  const password = process.env.INTERNAL_TOOLS_PASSWORD;
  const authSecret = process.env.AUTH_SECRET || password;
  const pathname = request.nextUrl.pathname;
  const shouldProtect = Boolean(authSecret || password) && isProtectedPath(pathname);
  const rateLimited = applyRateLimit(request);

  if (rateLimited) return rateLimited;

  if (!shouldProtect) return NextResponse.next();

  const auth = request.headers.get("authorization");
  const expected = password ? `Basic ${btoa(`admin:${password}`)}` : "";

  if (expected && auth === expected) return NextResponse.next();

  const session = request.cookies.get(sessionCookieName)?.value;
  if (authSecret && await verifySession(session, authSecret)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Brak dostepu. Zaloguj sie ponownie." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

async function verifySession(cookie: string | undefined, secret: string) {
  if (!cookie || !cookie.includes(".")) return false;
  const [payload, signature] = cookie.split(".");
  if (!payload || !signature) return false;
  const expected = await hmac(payload, secret);
  if (signature !== expected) return false;
  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as { exp?: number; role?: string };
    return parsed.role === "superadmin" && Boolean(parsed.exp && parsed.exp > Math.floor(Date.now() / 1000));
  } catch {
    return false;
  }
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64UrlEncode(new Uint8Array(signature));
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
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
  matcher: ["/admin/:path*", "/api/:path*"],
};
