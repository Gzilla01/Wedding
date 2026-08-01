import { NextResponse } from "next/server";
import { z } from "zod";
import { adminCookieOptions, ADMIN_SESSION_COOKIE, createAdminSessionCookie } from "@/lib/admin-auth";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().trim().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const payload = loginSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: "Podaj login i haslo." }, { status: 400 });

  const email = payload.data.email.trim();
  const password = payload.data.password;

  if (isBootstrapAdmin(email, password)) {
    return loginResponse({
      email: "admin@aleksandrapawel-2028.pl",
      name: "Superadmin",
      role: "superadmin",
    });
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return NextResponse.json({ error: "Logowanie nie jest skonfigurowane." }, { status: 503 });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return NextResponse.json({ error: "Nieprawidlowy login albo haslo." }, { status: 401 });

  const role = data.user.app_metadata?.role;
  if (role !== "superadmin") return NextResponse.json({ error: "Konto nie ma uprawnien superadmina." }, { status: 403 });
  const mustChangePassword = data.user.user_metadata?.must_change_password === true;

  return loginResponse({
    userId: data.user.id,
    email: data.user.email || email,
    name: String(data.user.user_metadata?.name || data.user.email || "Superadmin"),
    role: "superadmin",
    mustChangePassword,
  }, mustChangePassword);
}

function isBootstrapAdmin(email: string, password: string) {
  const expected = process.env.INTERNAL_TOOLS_PASSWORD;
  const normalized = email.toLowerCase();
  return Boolean(expected && password === expected && (normalized === "admin" || normalized === "admin@aleksandrapawel-2028.pl"));
}

function loginResponse(session: { userId?: string; email: string; name: string; role: "superadmin"; mustChangePassword?: boolean }, requiresPasswordChange = false) {
  const response = NextResponse.json({ ok: true, requiresPasswordChange, user: session });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionCookie(session), adminCookieOptions());
  return response;
}
