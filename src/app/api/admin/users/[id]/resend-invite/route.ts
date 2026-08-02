import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/admin-auth";
import { sendAccountCreatedEmail } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = verifyAdminSessionCookie((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || session.mustChangePassword) return Response.json({ error: "Brak dostepu." }, { status: 401 });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase service role is not configured." }, { status: 503 });

  const { id } = await params;
  const { data: currentUser, error: readError } = await supabase.auth.admin.getUserById(id);
  if (readError || !currentUser.user) return Response.json({ error: readError?.message || "Nie znaleziono konta." }, { status: 404 });
  if (currentUser.user.app_metadata?.role !== "superadmin") return Response.json({ error: "Konto nie ma roli superadmina." }, { status: 403 });
  if (!currentUser.user.email) return Response.json({ error: "Konto nie ma adresu e-mail." }, { status: 400 });

  const temporaryPassword = generateTemporaryPassword();
  const { data, error } = await supabase.auth.admin.updateUserById(id, {
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      ...currentUser.user.user_metadata,
      must_change_password: true,
      temporary_password_sent_at: new Date().toISOString(),
    },
  });
  if (error) return Response.json({ error: error.message }, { status: 400 });

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const emailResult = await sendAccountCreatedEmail({
    to: currentUser.user.email,
    name: String(currentUser.user.user_metadata?.name || currentUser.user.email),
    temporaryPassword,
    appUrl: siteUrl,
    loginUrl: `${siteUrl}/login`,
  });

  return Response.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email,
      role: "superadmin",
      mustChangePassword: true,
      createdAt: data.user.created_at,
      lastSignInAt: data.user.last_sign_in_at,
    },
    email: emailResult,
  });
}

function generateTemporaryPassword() {
  const token = randomBytes(9).toString("base64url");
  return `Ap2028!${token}`;
}
