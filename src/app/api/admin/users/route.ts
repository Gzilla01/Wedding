import { z } from "zod";
import { sendAccountCreatedEmail } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().trim().min(2).max(80),
});

export async function GET() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase service role is not configured." }, { status: 503 });

  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({
    users: data.users
      .filter((user) => user.app_metadata?.role === "superadmin")
      .map((user) => ({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email,
        role: user.app_metadata?.role || "superadmin",
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
      })),
  });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase service role is not configured." }, { status: 503 });

  const payload = createUserSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return Response.json({ error: "Podaj email, imie i haslo min. 8 znakow." }, { status: 400 });

  const { data, error } = await supabase.auth.admin.createUser({
    email: payload.data.email,
    password: payload.data.password,
    email_confirm: true,
    app_metadata: { role: "superadmin" },
    user_metadata: { name: payload.data.name },
  });

  if (error) return Response.json({ error: error.message }, { status: 400 });
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const emailResult = await sendAccountCreatedEmail({
    to: payload.data.email,
    name: payload.data.name,
    appUrl: siteUrl,
    loginUrl: `${siteUrl}/login`,
  });

  return Response.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || payload.data.name,
      role: "superadmin",
      createdAt: data.user.created_at,
      lastSignInAt: data.user.last_sign_in_at,
    },
    email: emailResult,
  });
}
