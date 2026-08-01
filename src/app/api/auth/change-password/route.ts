import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { adminCookieOptions, ADMIN_SESSION_COOKIE, createAdminSessionCookie, verifyAdminSessionCookie } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const changePasswordSchema = z.object({
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const session = verifyAdminSessionCookie((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Sesja wygasla. Zaloguj sie ponownie." }, { status: 401 });
  if (!session.userId) return NextResponse.json({ error: "To konto awaryjne nie moze zmienic hasla w Supabase." }, { status: 400 });

  const payload = changePasswordSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ error: "Nowe haslo musi miec minimum 8 znakow." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 503 });

  const { data: currentUser, error: readError } = await supabase.auth.admin.getUserById(session.userId);
  if (readError || !currentUser.user) return NextResponse.json({ error: readError?.message || "Nie znaleziono konta." }, { status: 404 });

  const { error } = await supabase.auth.admin.updateUserById(session.userId, {
    password: payload.data.password,
    user_metadata: {
      ...currentUser.user.user_metadata,
      must_change_password: false,
      password_changed_at: new Date().toISOString(),
    },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const cleanSession = {
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    mustChangePassword: false,
  };
  const response = NextResponse.json({ ok: true, user: cleanSession });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionCookie(cleanSession), adminCookieOptions());
  return response;
}
