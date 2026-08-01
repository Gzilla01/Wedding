import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "wedding_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type AdminSession = {
  userId?: string;
  email: string;
  name: string;
  role: "superadmin";
  mustChangePassword?: boolean;
  exp: number;
};

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function getSecret() {
  return process.env.AUTH_SECRET || process.env.INTERNAL_TOOLS_PASSWORD || "";
}

function signPayload(payload: string) {
  const secret = getSecret();
  if (!secret) throw new Error("AUTH_SECRET or INTERNAL_TOOLS_PASSWORD is required");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSessionCookie(session: Omit<AdminSession, "exp">) {
  const payload: AdminSession = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${signPayload(encoded)}`;
}

export function verifyAdminSessionCookie(cookie: string | undefined | null): AdminSession | null {
  if (!cookie || !cookie.includes(".")) return null;
  const [encoded, signature] = cookie.split(".");
  if (!encoded || !signature) return null;
  const expected = signPayload(encoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;
  const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as AdminSession;
  if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
  if (parsed.role !== "superadmin") return null;
  return parsed;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
